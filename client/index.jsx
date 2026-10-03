// dsh-sensenova-image 网页客户端：设置一级入口「SenseNova Image」
// 左侧 Settings → 一级 section，可编辑 baseURL / defaultModel / watermark / defaultSize / outputDir / apiKey。
// 通过 ctx.connection.rpc 调用宿主侧服务读写配置。

import { createElement as h, useEffect, useState } from 'react';
import { SENSENOVA_IMAGE_RPC_CHANNEL, SENSENOVA_IMAGE_ENDPOINTS, redactConfig } from './api.js';

const name = 'dsh-sensenova-image';
const inject = ['slots', 'connection', 'locale'];

const NS = 'sensenova-image';
const DICT = {
  zh: {
    section: 'SenseNova Image',
    title: 'SenseNova Image',
    subtitle: '商汤 SenseNova U 系列图片生成 / 编辑工具插件配置。',
    apiKey: 'API Key',
    apiKeyHint: '留空则依次尝试环境变量 SENSENOVA_API_KEY 与凭据中心 ~/.dsh/.credentials.yaml。填写则覆盖。',
    baseURL: 'Base URL',
    defaultModel: '默认模型',
    watermark: '水印',
    watermarkLabel: '默认添加官方水印（公测期去水印免费）',
    defaultSize: '默认尺寸',
    outputDir: '默认输出目录',
    save: '保存',
  },
  en: {
    section: 'SenseNova Image',
    title: 'SenseNova Image',
    subtitle: 'Configuration for the SenseTime SenseNova U-series image generation / editing tools.',
    apiKey: 'API Key',
    apiKeyHint: 'When empty, falls back to the SENSENOVA_API_KEY env var, then ~/.dsh/.credentials.yaml. A value here overrides both.',
    baseURL: 'Base URL',
    defaultModel: 'Default model',
    watermark: 'Watermark',
    watermarkLabel: 'Add official watermark by default (free during public beta)',
    defaultSize: 'Default size',
    outputDir: 'Default output directory',
    save: 'Save',
  },
};

const styles = {
  card: { background: 'var(--dsw-alias-bg-layer-1,#fff)', border: '1px solid var(--dsw-alias-border-l2,#e5e7eb)', borderRadius: 12, padding: '16px 20px', maxWidth: 480 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  label: { fontSize: 13, color: 'var(--dsw-alias-label-primary,inherit)' },
  hint: { fontSize: 12, color: 'var(--dsw-alias-label-tertiary,#8b93a1)', lineHeight: 1.4 },
  input: { border: '1px solid var(--dsw-alias-border-l2,#d1d5db)', background: 'var(--dsw-alias-bg-layer-3,#fff)', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: 'var(--dsw-alias-label-primary,inherit)', height: 36, boxSizing: 'border-box', width: '100%' },
  select: { border: '1px solid var(--dsw-alias-border-l2,#d1d5db)', background: 'var(--dsw-alias-bg-layer-3,#fff)', borderRadius: 8, padding: '0 10px', fontSize: 13, color: 'var(--dsw-alias-label-primary,inherit)', height: 36, boxSizing: 'border-box', width: '100%' },
  row: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 },
  btn: { font: 'inherit', cursor: 'pointer', border: '1px solid var(--dsw-alias-button-ghost-active-border, var(--dsw-alias-border-l2,#d1d5db))', background: 'var(--dsw-alias-bg-layer-1,#fff)', color: 'var(--dsw-alias-label-primary,inherit)', height: 36, padding: '0 16px', borderRadius: 999, fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  primary: { font: 'inherit', cursor: 'pointer', border: 'none', background: 'var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary,#4f6ef7))', color: 'var(--dsw-alias-label-primary-foreground, #fff)', height: 36, padding: '0 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  ok: { color: 'var(--dsw-alias-state-success-primary,#34c759)', fontSize: 12 },
  err: { color: 'var(--dsw-alias-state-error-primary,#ff3b30)', fontSize: 12, whiteSpace: 'pre-wrap' },
  block: { borderTop: '1px solid var(--dsw-alias-border-l2,#e5e7eb)', marginTop: 16, paddingTop: 16 },
  check: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
};

function ImageSettingsTab({ rpcCall, t }) {
  const [cfg, setCfg] = useState(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const call = async (endpoint, payload) => {
    const res = await rpcCall(endpoint, payload);
    if (!res?.ok) throw new Error(res?.error?.message ?? 'RPC failed');
    return res.value;
  };

  const load = async () => {
    try {
      const c = await call(SENSENOVA_IMAGE_ENDPOINTS.getConfig, {});
      const view = redactConfig(c);
      setCfg(view);
      setDraft({ ...view });
    } catch (e) {
      setMsg({ kind: 'err', text: String(e?.message ?? e) });
    }
  };

  useEffect(() => { load(); }, []);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!draft) return;
    setBusy(true); setMsg(null);
    try {
      const payload = {
        baseURL: draft.baseURL,
        defaultModel: draft.defaultModel,
        watermark: !!draft.watermark,
        defaultSize: draft.defaultSize,
        outputDir: draft.outputDir,
      };
      if (typeof draft.apiKeyInput === 'string' && draft.apiKeyInput.trim() !== '') {
        payload.apiKey = draft.apiKeyInput.trim();
      }
      await call(SENSENOVA_IMAGE_ENDPOINTS.setConfig, payload);
      setMsg({ kind: 'ok', text: '已保存。重启 DSH 或刷新会话后生效。' });
      const c = await call(SENSENOVA_IMAGE_ENDPOINTS.getConfig, {});
      const view = redactConfig(c);
      setCfg(view);
      setDraft({ ...view, apiKeyInput: '' });
    } catch (e) {
      setMsg({ kind: 'err', text: String(e?.message ?? e) });
    } finally {
      setBusy(false);
    }
  };

  return h('div', { style: styles.card },
    h('div', { style: { fontSize: 15, fontWeight: 600, marginBottom: 4 } }, t('title') || 'SenseNova Image'),
    h('p', { style: styles.hint }, t('subtitle') || '商汤 SenseNova U 系列图片生成 / 编辑工具插件配置。'),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('apiKey') || 'API Key'),
      h('input', {
        style: styles.input,
        type: 'password',
        value: draft?.apiKeyInput ?? '',
        placeholder: draft?.apiKeyConfigured ? '已配置（留空则不修改）' : 'sk-…',
        onChange: (e) => set('apiKeyInput', e.target.value),
      }),
      h('div', { style: styles.hint }, t('apiKeyHint') || '留空则依次尝试环境变量 SENSENOVA_API_KEY 与凭据中心 ~/.dsh/.credentials.yaml。填写则覆盖。'),
    ),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('baseURL') || 'Base URL'),
      h('input', {
        style: styles.input,
        value: draft?.baseURL ?? '',
        placeholder: 'https://token.sensenova.cn/v1',
        onChange: (e) => set('baseURL', e.target.value),
      }),
    ),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultModel') || '默认模型'),
      h('select', {
        style: styles.select,
        value: draft?.defaultModel ?? 'sensenova-u1.5-lite',
        onChange: (e) => set('defaultModel', e.target.value),
      },
        h('option', { value: 'sensenova-u1.5-lite' }, 'sensenova-u1.5-lite（质量优先）'),
        h('option', { value: 'sensenova-u1.5-fast' }, 'sensenova-u1.5-fast（速度优先）'),
      ),
    ),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('watermark') || '水印'),
      h('label', { style: styles.check },
        h('input', { type: 'checkbox', checked: draft?.watermark !== false, onChange: (e) => set('watermark', e.target.checked) }),
        h('span', null, t('watermarkLabel') || '默认添加官方水印（公测期去水印免费）'),
      ),
    ),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultSize') || '默认尺寸'),
      h('input', {
        style: styles.input,
        value: draft?.defaultSize ?? '',
        placeholder: '2048x2048',
        onChange: (e) => set('defaultSize', e.target.value),
      }),
    ),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('outputDir') || '默认输出目录'),
      h('input', {
        style: styles.input,
        value: draft?.outputDir ?? '',
        placeholder: '留空则只在调用方指定 savePath 时写文件',
        onChange: (e) => set('outputDir', e.target.value),
      }),
    ),

    h('div', { style: styles.row },
      h('button', { style: styles.primary, disabled: busy, onClick: save }, busy ? '…' : (t('save') || '保存')),
      busy ? h('span', { style: styles.hint }, '保存中…') : null,
    ),
    msg ? h('div', { style: msg.kind === 'ok' ? styles.ok : styles.err }, msg.text) : null,
  );
}

export function apply(ctx) {
  const rpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(SENSENOVA_IMAGE_RPC_CHANNEL, endpoint, payload, signal);

  const translate = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, DICT), 'dsh-sensenova-image: locale dictionaries');

  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: 'sensenova-image',
        order: 30,
        label: () => translate('section'),
        inject: () => ({ rpcCall, t: translate }),
      },
      ImageSettingsTab,
    ),
  );
}

export { name, inject };
export default { apply, name, inject };
