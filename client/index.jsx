// dsh-sensenova-image 网页客户端：Settings 左侧一级入口「SenseNova Image」
//
// 注册形状逐字对齐 dsh-pocket（同一 profile 里已验证可用）：
//   ctx.slots.inject('settings.section', () => ctx.slots.register({
//     name, id, order, label: () => translate('section'),
//     inject: () => ({ rpcCall, t: translate }),
//   }, Tab))
// 传输走 ctx.connection.rpc.call(channel, endpoint, payload)，宿主侧路由见 lib/rpc.js。

import { createElement as h, useEffect, useState } from 'react';
import { SENSENOVA_IMAGE_RPC_CHANNEL, SENSENOVA_IMAGE_ENDPOINTS } from './api.js';

const name = 'dsh-sensenova-image';
const inject = ['slots', 'connection', 'locale'];

const NS = 'sensenova-image';
const BASE_URL = 'https://token.sensenova.cn/v1';
const MODEL_LITE = 'sensenova-u1.5-lite';
const MODEL_FAST = 'sensenova-u1.5-fast';

const zh = {
  section: 'SenseNova Image',
  title: 'SenseNova Image',
  subtitle: '商汤 SenseNova U 系列图片生成 / 编辑工具插件配置。',
  apiKey: 'API Key',
  apiKeyHint: '留空则依次尝试环境变量 SENSENOVA_API_KEY 与凭据中心 ~/.dsh/.credentials.yaml。填写则覆盖。',
  apiKeyConfigured: '已配置',
  apiKeyMissing: '未配置',
  baseURL: 'Base URL',
  defaultModel: '默认模型',
  watermark: '默认添加官方水印（公测期去水印免费）',
  defaultSize: '默认尺寸',
  outputDir: '默认输出目录',
  outputDirHint: '留空则只在调用方指定 savePath 时写文件。',
  modelLite: 'sensenova-u1.5-lite（质量优先）',
  modelFast: 'sensenova-u1.5-fast（速度优先）',
  save: '保存',
  saving: '保存中…',
  saved: '已保存。重启 DSH 后生效。',
  failed: '保存失败。',
  loading: '加载中…',
  loadFailed: '无法读取配置。',
};

const en = {
  section: 'SenseNova Image',
  title: 'SenseNova Image',
  subtitle: 'Configuration for the SenseTime SenseNova U-series image generation / editing tools.',
  apiKey: 'API Key',
  apiKeyHint: 'When empty, falls back to the SENSENOVA_API_KEY env var, then ~/.dsh/.credentials.yaml. A value here overrides both.',
  apiKeyConfigured: 'configured',
  apiKeyMissing: 'not set',
  baseURL: 'Base URL',
  defaultModel: 'Default model',
  watermark: 'Add official watermark by default (free during public beta)',
  defaultSize: 'Default size',
  outputDir: 'Default output directory',
  outputDirHint: 'When empty, files are written only when the caller passes savePath.',
  modelLite: 'sensenova-u1.5-lite (quality first)',
  modelFast: 'sensenova-u1.5-fast (speed first)',
  save: 'Save',
  saving: 'Saving…',
  saved: 'Saved. Restart DSH to take effect.',
  failed: 'Save failed.',
  loading: 'Loading…',
  loadFailed: 'Could not read the configuration.',
};

const styles = {
  card: { maxWidth: 520 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 },
  label: { fontSize: 13 },
  hint: { fontSize: 12, opacity: 0.65, lineHeight: 1.4 },
  input: {
    border: '1px solid var(--dsw-alias-border-l2, #d1d5db)',
    background: 'var(--dsw-alias-bg-layer-3, #fff)',
    color: 'var(--dsw-alias-label-primary, inherit)',
    borderRadius: 8, padding: '8px 10px', fontSize: 13,
    height: 36, boxSizing: 'border-box', width: '100%',
  },
  row: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 },
  primary: {
    font: 'inherit', cursor: 'pointer', border: 'none', height: 36,
    padding: '0 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
    background: 'var(--dsw-alias-button-primary-fill, #4f6ef7)',
    color: 'var(--dsw-alias-label-primary-foreground, #fff)',
  },
  ok: { fontSize: 12, color: 'var(--dsw-alias-state-success-primary, #34c759)' },
  err: { fontSize: 12, color: 'var(--dsw-alias-state-error-primary, #ff3b30)', whiteSpace: 'pre-wrap' },
  check: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
};

function SenseNovaImageSettingsTab({ rpcCall, t }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState({});
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    rpcCall(SENSENOVA_IMAGE_ENDPOINTS.getConfig, {})
      .then((res) => {
        if (!alive) return;
        if (res && res.ok === true) setConfig(res.value ?? {});
        else setError(t('loadFailed'));
      })
      .catch((e) => { if (alive) setError(e?.message ?? t('loadFailed')); });
    return () => { alive = false; };
  }, []);

  if (error) return h('p', { style: styles.err }, error);
  if (config === null) return h('p', { style: styles.hint }, t('loading'));

  const field = (key, fallback) => (key in draft ? draft[key] : (config[key] ?? fallback));
  const set = (key, value) => { setMsg(null); setDraft((d) => ({ ...d, [key]: value })); };

  const dirty = Object.keys(draft).length > 0 || apiKeyDraft.trim() !== '';

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const updates = {};
      for (const [k, v] of Object.entries(draft)) updates[k] = v;
      if (apiKeyDraft.trim() !== '') updates.apiKey = apiKeyDraft.trim();
      const res = await rpcCall(SENSENOVA_IMAGE_ENDPOINTS.setConfig, { updates });
      if (res && res.ok === true) {
        setConfig(res.value ?? {});
        setDraft({});
        setApiKeyDraft('');
        setMsg({ kind: 'ok', text: t('saved') });
      } else {
        setMsg({ kind: 'err', text: res?.error?.message ?? t('failed') });
      }
    } catch (e) {
      setMsg({ kind: 'err', text: e?.message ?? t('failed') });
    } finally {
      setBusy(false);
    }
  };

  return h('div', { style: styles.card },
    h('p', { style: { ...styles.hint, margin: '0 0 12px' } }, t('subtitle')),

    h('div', { style: styles.field },
      h('label', { style: styles.label },
        t('apiKey'),
        ' · ',
        h('span', { style: styles.hint },
          config.apiKeyConfigured ? t('apiKeyConfigured') : t('apiKeyMissing')),
      ),
      h('input', {
        style: styles.input, type: 'password', value: apiKeyDraft,
        placeholder: 'sk-…', onChange: (e) => { setMsg(null); setApiKeyDraft(e.target.value); },
      }),
      h('div', { style: styles.hint }, t('apiKeyHint')),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('baseURL')),
      h('input', {
        style: styles.input, value: field('baseURL', BASE_URL),
        onChange: (e) => set('baseURL', e.target.value),
      }),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultModel')),
      h('select', {
        style: styles.input, value: field('defaultModel', MODEL_LITE),
        onChange: (e) => set('defaultModel', e.target.value),
      },
        h('option', { value: MODEL_LITE }, t('modelLite')),
        h('option', { value: MODEL_FAST }, t('modelFast')),
      ),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.check },
        h('input', {
          type: 'checkbox', checked: field('watermark', true) !== false,
          onChange: (e) => set('watermark', e.target.checked),
        }),
        h('span', null, t('watermark')),
      ),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultSize')),
      h('input', {
        style: styles.input, value: field('defaultSize', '2048x2048'),
        onChange: (e) => set('defaultSize', e.target.value),
      }),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('outputDir')),
      h('input', {
        style: styles.input, value: field('outputDir', ''),
        placeholder: '~/.dsh/images',
        onChange: (e) => set('outputDir', e.target.value),
      }),
      h('div', { style: styles.hint }, t('outputDirHint')),
    ),
    h('div', { style: styles.row },
      h('button', { style: styles.primary, disabled: busy || !dirty, onClick: save },
        busy ? t('saving') : t('save')),
    ),
    msg ? h('p', { style: msg.kind === 'ok' ? styles.ok : styles.err }, msg.text) : null,
  );
}

function apply(ctx) {
  const rpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(SENSENOVA_IMAGE_RPC_CHANNEL, endpoint, payload, signal);
  const translate = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-sensenova-image: locale dictionaries');
  ctx.slots.inject(
    'settings.section',
    () => ctx.slots.register(
      {
        name: 'settings.section',
        id: 'sensenova-image',
        order: 40,
        label: () => translate('section'),
        inject: () => ({ rpcCall, t: translate }),
      },
      SenseNovaImageSettingsTab,
    ),
  );
}

export { apply, inject, name };
