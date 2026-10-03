// dsh-sensenova-image Web RPC（loopback-only）：设置页 ⇄ Host 的配置读写通道
//
// 客户端经 ctx.connection.rpc.call(channel, endpoint, payload) 发起调用，
// 宿主侧用 ctx.connection.rpc.handle(channel, handler) 注册对应处理函数
// （dsh-client-connection 官方通道注册 API，内部复用 /api 同源的
//  浏览器会话 + Host/Origin 信任栅栏）。
//
// handler 契约：(endpoint, payload, signal, peer) => rpcResultSchema
//   成功 { ok: true, value }
//   失败 { ok: false, error: { code, message, details } }

import { SENSENOVA_IMAGE_RPC_CHANNEL, SENSENOVA_IMAGE_ENDPOINTS } from '../client/api.js';

/** 允许写入的字段白名单（与 Config schema 对齐）。 */
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

function ok(value) { return { ok: true, value }; }

/** 构造符合 rpcErrorSchema 的错误结果（'internal' 不在合法 code 集合）。 */
function fail(code, message) {
  if (code === 'cancelled') return { ok: false, error: { code: 'cancelled', message, details: {} } };
  return { ok: false, error: { code: 'bad-request', message, details: { issues: [{ message }] } } };
}

export function buildImageRpcHandler({ getLiveConfig, writeLiveConfig, hasApiKey, log }) {
  return async (endpoint, payload = {}, signal) => {
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
}

/**
 * 注册 /dsh-sensenova-image RPC 通道。返回 disposer。
 * 依赖宿主侧注入的 connection 服务（plugin inject 需含 'connection'）。
 */
export function installImageRpc(ctx, deps) {
  const rpc = ctx.connection?.rpc;
  if (typeof rpc?.handle !== 'function') {
    deps.log?.(`[dsh-sensenova-image] connection.rpc.handle 不可用，设置页 RPC 未安装`);
    return () => {};
  }
  const handler = buildImageRpcHandler(deps);
  deps.log?.(`[dsh-sensenova-image] 注册 RPC 通道 ${SENSENOVA_IMAGE_RPC_CHANNEL}`);
  const cleanup = rpc.handle(SENSENOVA_IMAGE_RPC_CHANNEL, handler);
  return typeof cleanup === 'function' ? cleanup : () => {};
}
