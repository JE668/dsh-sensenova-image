// dsh-sensenova-image Web RPC（loopback-only）：设置页 ⇄ Host 的配置读写通道
//
// 兼容两条路径（与 dsh-pocket 的 web-rpc.js 同构）：
//   1. dsh v0.1.5+：直接挂到本插件 inject 的 webServer 上
//   2. 旧版 dsh / headless：回退 ctx.connection.rpc.handle(...)

import { SENSENOVA_IMAGE_RPC_CHANNEL, SENSENOVA_IMAGE_ENDPOINTS } from '../client/api.js';

/** 允许写入的字段白名单（与 Config schema 对齐；apiKey 允许写入）。 */
const WRITABLE_KEYS = new Set(['apiKey', 'baseURL', 'defaultModel', 'watermark', 'defaultSize', 'outputDir']);

/** 浏览器可见的配置视图（不暴露 apiKey 明文）。 */
export function viewOf(config, { hasApiKey }) {
  return {
    baseURL: String(config?.baseURL ?? ''),
    defaultModel: String(config?.defaultModel ?? ''),
    watermark: config?.watermark !== false,
    defaultSize: String(config?.defaultSize ?? ''),
    outputDir: String(config?.outputDir ?? ''),
    apiKeyConfigured: hasApiKey,
  };
}

/** 构造 fetch-shaped route handler。 */
export function buildImageRpcHandler({ getLiveConfig, writeLiveConfig, hasApiKey, log }) {
  const handler = async (endpoint, payload = {}, signal) => {
    if (signal?.aborted) return fail('cancelled', 'request aborted');
    if (endpoint === SENSENOVA_IMAGE_ENDPOINTS.getConfig || endpoint === SENSENOVA_IMAGE_ENDPOINTS.status) {
      return ok(viewOf(getLiveConfig(), { hasApiKey: hasApiKey() }));
    }
    if (endpoint === SENSENOVA_IMAGE_ENDPOINTS.setConfig) {
      const updates = {};
      for (const [key, value] of Object.entries(payload ?? {})) {
        if (!WRITABLE_KEYS.has(key)) continue;
        if (key === 'watermark') updates.watermark = value === true;
        else updates[key] = typeof value === 'string' ? value : '';
      }
      writeLiveConfig(updates);
      log?.(`[dsh-sensenova-image] config updated via settings page: ${Object.keys(updates).join(', ') || '(no writable keys)'}`);
      return ok(viewOf(getLiveConfig(), { hasApiKey: hasApiKey() }));
    }
    return fail('bad-request', `unknown endpoint: ${endpoint}`);
  };
  return handler;
}

function ok(value) { return { ok: true, value }; }
function fail(code, message) { return { ok: false, error: { code, message } }; }

/**
 * 把 handler 挂到 webServer（新路径）；不可用则回退 ctx.connection.rpc.handle。
 * 返回 disposer。
 */
export function installImageRpc(ctx, deps) {
  const handler = buildImageRpcHandler(deps);
  const webServer = ctx.webServer;
  if (webServer && typeof webServer.register === 'function') {
    const route = makeWebRoute(SENSENOVA_IMAGE_RPC_CHANNEL, handler, deps.log);
    webServer.register(route);
    return () => { /* webServer routes are lifetime-bound to the plugin */ };
  }
  if (ctx.connection?.rpc?.handle) {
    return ctx.connection.rpc.handle(SENSENOVA_IMAGE_RPC_CHANNEL, handler, { authority: 'loopback' });
  }
  return () => {};
}

/** fetch-shaped route（与 pocket 的 pocketFetchHandler 行为对齐）。 */
function makeWebRoute(channel, handler, log) {
  return {
    name: `dsh-${channel.replace(/^\//, '')}`,
    fetch: async (request) => {
      const url = new URL(request.url);
      if (request.method !== 'POST') return new Response('not found', { status: 404 });
      if (!url.pathname.startsWith(`${channel}/`)) return new Response('not found', { status: 404 });
      const endpoint = url.pathname.slice(channel.length + 1);
      if (endpoint === '' || endpoint === '.' || endpoint === '..') return new Response('not found', { status: 404 });
      let payload = {};
      try { payload = await request.json(); } catch { /* empty body */ }
      const result = await handler(endpoint, payload, request.signal);
      return Response.json(result, { status: result.ok ? 200 : 400 });
    },
  };
}
