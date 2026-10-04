// dsh-sensenova-image 设置页传输契约（host 与 client 共用）
//
// 宿主 lib/rpc.js 与客户端 client/index.jsx 都从这里取 channel / endpoint，
// 保证两端字面量永远一致（与 dsh-pocket 的做法相同）。

export const SENSENOVA_IMAGE_RPC_CHANNEL = '/dsh-sensenova-image';

export const SENSENOVA_IMAGE_ENDPOINTS = Object.freeze({
  getConfig: 'image.getConfig',
  setConfig: 'image.setConfig',
  status: 'image.status',
});

/** 脱敏视图：不下发 apiKey 明文，只给 configured 标记。 */
export function redactConfig(config = {}) {
  return {
    baseURL: config.baseURL ?? '',
    defaultModel: config.defaultModel ?? '',
    watermark: config.watermark !== false,
    defaultSize: config.defaultSize ?? '',
    outputDir: config.outputDir ?? '',
    apiKeyConfigured: typeof config.apiKey === 'string' && config.apiKey.trim() !== '',
  };
}
