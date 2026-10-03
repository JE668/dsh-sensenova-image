// dsh-sensenova-image 设置页 RPC 契约（client 与 host 共享）
export const SENSENOVA_IMAGE_RPC_CHANNEL = '/dsh-sensenova-image';

export const SENSENOVA_IMAGE_ENDPOINTS = Object.freeze({
  getConfig: 'image.getConfig',
  setConfig: 'image.setConfig',
  status: 'image.status',
});

/** 浏览器可见的配置字段（无敏感信息）。 */
export function redactConfig(c) {
  return {
    baseURL: c?.baseURL ?? '',
    defaultModel: c?.defaultModel ?? '',
    watermark: c?.watermark ?? true,
    defaultSize: c?.defaultSize ?? '',
    outputDir: c?.outputDir ?? '',
    apiKeyConfigured: c?.apiKeyConfigured === true,
  };
}
