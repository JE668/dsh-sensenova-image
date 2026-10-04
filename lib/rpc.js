// dsh-sensenova-image 设置页 endpoint 处理。
import { mountWebRoute, ok, fail } from './web-rpc.js';
import { SENSENOVA_IMAGE_RPC_CHANNEL, SENSENOVA_IMAGE_ENDPOINTS, redactConfig } from '../client/api.js';

/** 设置页可写字段白名单。 */
const WRITABLE_KEYS = new Set(['apiKey', 'baseURL', 'defaultModel', 'watermark', 'defaultSize', 'outputDir']);

export function viewOf(config, extra = {}) {
  return { ...redactConfig(config), ...extra };
}

export function buildImageRpcHandler({ getLiveConfig, writeLiveConfig, persistConfig, hasApiKey }) {
  return async (endpoint, payload = {}) => {
    if (endpoint === SENSENOVA_IMAGE_ENDPOINTS.getConfig || endpoint === SENSENOVA_IMAGE_ENDPOINTS.status) {
      return ok(viewOf(getLiveConfig(), { hasApiKey: hasApiKey() }));
    }
    if (endpoint === SENSENOVA_IMAGE_ENDPOINTS.setConfig) {
      const updates = payload && typeof payload === 'object' ? payload.updates : undefined;
      if (!updates || typeof updates !== 'object') return fail('bad-request', 'updates 必须是对象');
      const clean = {};
      for (const [key, value] of Object.entries(updates)) {
        if (!WRITABLE_KEYS.has(key)) continue;
        clean[key] = value;
      }
      if (Object.keys(clean).length === 0) return fail('bad-request', '没有可写入的字段');
      // 先落盘再回应：settings.update 会写 profile 的 cordis patch，重启后仍然生效。
      // 失败要如实报错，不能只改内存然后假装成功。
      if (typeof persistConfig === 'function') {
        try {
          await persistConfig(clean);
        } catch (error) {
          return fail('bad-request', `保存失败：${error?.message ?? String(error)}`);
        }
      }
      writeLiveConfig(clean);
      return ok(viewOf(getLiveConfig(), { hasApiKey: hasApiKey() }));
    }
    return fail('bad-request', `未知 endpoint: ${endpoint}`);
  };
}

/** 安装设置页 RPC 路由。宿主必须 inject ['connection', 'webServer']。 */
export function installImageRpc(ctx, deps) {
  return mountWebRoute(ctx, {
    channel: SENSENOVA_IMAGE_RPC_CHANNEL,
    handler: buildImageRpcHandler(deps),
    log: deps.log,
  });
}
