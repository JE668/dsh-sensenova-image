// dsh-sensenova-image 设置页 Web RPC（loopback-only）
//
// 设计依据：dsh-pocket/lib/web-rpc.js（同一 profile 里已验证可用）。
//
// 为什么不能直接用 ctx.connection.rpc.handle(channel, handler)：
// dsh v0.1.5-alpha.1+ 把 dsh-client-connection 的 inject 收缩成 ['credentials']，
// rpc.handle 内部访问 owner.webServer 会抛 "cannot get property without inject"。
// 因此本插件自己 inject ['connection', 'webServer']，直接 webServer.register(route)，
// 逐分支复刻 Connection /api 的传输语义。
//
// 关键坑（pocket issue #117）：connection.requestRejection 是类方法，内部读
// this.trustedHosts / this.browserAuth。必须以**方法形式**调用
// （connection.requestRejection(req)），抽成裸函数再调用会丢 this → TypeError →
// 被兜底成 403，于是**所有**请求都被判 forbidden。

const INVALID_REQUEST_RPC_ID = 'invalid-request';
const ENDPOINT_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
const RPC_BODY_MAX = 1024 * 1024; // 1 MB：全部 endpoint 都是小控制 JSON。

/** 从 `${channel}/<endpoint>` 里取出 endpoint。 */
function endpointFromPath(channel, pathname) {
  if (!pathname.startsWith(`${channel}/`)) return undefined;
  const endpoint = pathname.slice(channel.length + 1);
  if (endpoint.split('/').some((s) => s === '' || s === '.' || s === '..' || !ENDPOINT_SEGMENT_PATTERN.test(s))) {
    return undefined;
  }
  return endpoint;
}

function serverResponseJson(rpcId, result) {
  return JSON.stringify({ type: 'server-response', rpcId, result });
}

export function ok(value) {
  return { ok: true, value };
}

export function fail(code, message) {
  if (code === 'cancelled') return { ok: false, error: { code: 'cancelled', message, details: {} } };
  return { ok: false, error: { code: 'bad-request', message, details: { issues: [{ message }] } } };
}

/** Node req/res ⇄ fetch Request/Response 桥。 */
async function httpBridge(req, res, fetchHandler) {
  const abort = new AbortController();
  res.on('close', () => { if (!res.writableEnded) abort.abort(); });

  const declaredLen = req.headers['content-length'];
  if (declaredLen !== undefined && Number(declaredLen) > RPC_BODY_MAX) {
    res.writeHead(413, { connection: 'close' });
    res.end();
    req.destroy();
    return;
  }
  const chunks = [];
  let received = 0;
  let tooLarge = false;
  for await (const chunk of req) {
    received += chunk.length;
    if (received > RPC_BODY_MAX) { tooLarge = true; break; }
    chunks.push(chunk);
  }
  if (tooLarge) {
    res.writeHead(413, { connection: 'close' });
    res.end();
    req.destroy();
    return;
  }

  const url = `http://${req.headers.host ?? '127.0.0.1'}${req.url}`;
  const init = {
    method: req.method ?? 'GET',
    headers: Object.fromEntries(Object.entries(req.headers).filter(([, v]) => typeof v === 'string')),
    signal: abort.signal,
  };
  if (chunks.length > 0) init.body = Buffer.concat(chunks);

  const response = await fetchHandler.fetch(new Request(url, init));
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  if (response.body === null) { res.end(); return; }
  for await (const chunk of response.body) {
    if (!res.write(chunk)) {
      await new Promise((resolve) => {
        const done = () => { res.off('drain', done); res.off('close', done); resolve(); };
        res.once('drain', done);
        res.once('close', done);
      });
    }
  }
  res.end();
}

/** 把 endpoint handler 包成 fetch handler，复刻 /api 的状态码分支。 */
function fetchHandlerFor(channel, handler, log) {
  return {
    async fetch(request) {
      const endpoint = endpointFromPath(channel, new URL(request.url).pathname);
      if (request.method !== 'POST' || endpoint === undefined) {
        return new Response('not found', { status: 404 });
      }
      const mediaType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
      if (mediaType !== 'application/json') {
        return new Response('content type must be application/json', { status: 415 });
      }
      let body;
      try { body = await request.json(); } catch {
        return new Response('body is not JSON', { status: 400 });
      }
      // 客户端信封：{ type:'client-request', rpcId, method, payload }
      const rpcId = body && typeof body.rpcId === 'string' ? body.rpcId : INVALID_REQUEST_RPC_ID;
      const method = body && typeof body.method === 'string' ? body.method : null;
      const json = (result) => new Response(serverResponseJson(rpcId, result), {
        status: 200, headers: { 'content-type': 'application/json' },
      });
      if (rpcId === INVALID_REQUEST_RPC_ID || method === null) {
        return json(fail('bad-request', 'invalid client-request message'));
      }
      if (method !== endpoint) {
        return json(fail('bad-request', `method ${JSON.stringify(method)} does not match endpoint ${JSON.stringify(endpoint)}`));
      }
      try {
        return json(await handler(endpoint, body.payload, request.signal));
      } catch (error) {
        log?.(`[rpc] ${endpoint} failed: ${error?.message ?? error}`);
        return json(fail('bad-request', error?.message ?? String(error)));
      }
    },
  };
}

/**
 * 把设置页 RPC 挂到本插件自己 inject 的 webServer 上。
 * @returns 幂等可调用的清理函数；注册失败时返回 no-op。
 */
export function mountWebRoute(ctx, { channel, handler, log }) {
  const webServer = ctx?.webServer;
  if (!webServer || typeof webServer.register !== 'function') {
    log?.('[rpc] webServer 服务不可用，设置页将无法通信');
    return () => {};
  }
  const connection = ctx?.connection;
  const fetchHandler = fetchHandlerFor(channel, handler, log);
  const route = {
    kind: 'prefix',
    path: channel,
    handler: async (req, res) => {
      let rejection;
      // 必须以方法形式调用（issue #117）。
      if (typeof connection?.requestRejection === 'function') {
        try { rejection = connection.requestRejection(req); } catch { rejection = 403; }
      } else {
        rejection = 403;
      }
      if (rejection !== undefined) {
        res.writeHead(rejection, { 'content-type': 'text/plain; charset=utf-8' });
        res.end(rejection === 401 ? 'unauthorized' : 'forbidden');
        return;
      }
      await httpBridge(req, res, fetchHandler);
    },
  };
  let registered;
  try {
    registered = webServer.register(route);
  } catch (error) {
    log?.(`[rpc] 路由注册失败: ${error?.message ?? error}`);
    return () => {};
  }
  if (typeof registered === 'function') return () => { try { registered(); } catch {} };
  if (registered && typeof registered.then === 'function') {
    let done = false;
    return async () => {
      if (done) return;
      done = true;
      try { const d = await registered; if (typeof d === 'function') d(); } catch {}
    };
  }
  return () => {};
}
