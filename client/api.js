// dsh-sensenova-image 设置页契约（client 专用）
//
// 不再使用自定义 RPC 通道：DSH 的 dsh-settings / dsh-client-ui-settings
// 会自动为任何带 .volatile() 字段的插件条目暴露一个 settings namespace，
// 客户端通过 ctx.configForms.get(entryId) 读写，底层走 remote.settings。

export const SENSENOVA_IMAGE_ENTRY_ID = 'dsh-sensenova-image';

/** 设置页可编辑的字段名（与 lib/index.js 的 Config schema 对齐）。 */
export const SENSENOVA_IMAGE_FIELDS = Object.freeze({
  apiKey: 'apiKey',
  baseURL: 'baseURL',
  defaultModel: 'defaultModel',
  watermark: 'watermark',
  defaultSize: 'defaultSize',
  outputDir: 'outputDir',
});

export const SENSENOVA_IMAGE_DEFAULTS = Object.freeze({
  baseURL: 'https://token.sensenova.cn/v1',
  defaultModel: 'sensenova-u1.5-lite',
  watermark: true,
  defaultSize: '2048x2048',
  outputDir: '',
});
