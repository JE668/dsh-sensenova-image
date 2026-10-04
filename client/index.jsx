// dsh-sensenova-image 网页客户端：设置一级入口「SenseNova Image」
//
// 左侧 Settings → 一级 section（settings.section slot）。
// 配置读写走 ctx.configForms.get(entryId)（dsh-client-ui-settings 提供的
// 官方通道，底层 remote.settings，由宿主 dsh-settings 自动暴露所有
// .volatile() 字段），无需自建 RPC 桥。

import { createElement as h, useEffect, useState, useSyncExternalStore } from 'react';
import {
  SENSENOVA_IMAGE_ENTRY_ID,
  SENSENOVA_IMAGE_FIELDS as F,
  SENSENOVA_IMAGE_DEFAULTS as D,
} from './api.js';

const name = 'dsh-sensenova-image';
const inject = ['slots', 'layout', 'locale'];

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
    saving: '保存中…',
    saved: '已保存。重启 DSH 或刷新会话后生效。',
    readOnly: '该配置当前不可写入。',
    unavailable: '配置服务不可用（宿主 dsh-settings 未暴露该插件条目）。',
    saveFailed: '保存失败：宿主拒绝了本次写入。',
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
    saving: 'Saving…',
    saved: 'Saved. Restart DSH or refresh the session to take effect.',
    readOnly: 'Configuration is not writable right now.',
    unavailable: 'Settings service unavailable (host did not expose this plugin entry).',
    saveFailed: 'Save failed: the host rejected this write.',
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
  primary: { font: 'inherit', cursor: 'pointer', border: 'none', background: 'var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary,#4f6ef7))', color: 'var(--dsw-alias-label-primary-foreground, #fff)', height: 36, padding: '0 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  ok: { color: 'var(--dsw-alias-state-success-primary,#34c759)', fontSize: 12 },
  err: { color: 'var(--dsw-alias-state-error-primary,#ff3b30)', fontSize: 12, whiteSpace: 'pre-wrap' },
  check: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
};

function SenseNovaImageSettingsCard({ settings, t }) {
  const snap = useSyncExternalStore(settings.subscribe, settings.getSnapshot);
  const v = snap?.value ?? {};

  const [draft, setDraft] = useState({
    baseURL: v.baseURL ?? D.baseURL,
    defaultModel: v.defaultModel ?? D.defaultModel,
    watermark: v.watermark !== false,
    defaultSize: v.defaultSize ?? D.defaultSize,
    outputDir: v.outputDir ?? '',
  });
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // 快照变化时同步 draft（例如另一处修改后的刷新）
  useEffect(() => {
    setDraft({
      baseURL: v.baseURL ?? D.baseURL,
      defaultModel: v.defaultModel ?? D.defaultModel,
      watermark: v.watermark !== false,
      defaultSize: v.defaultSize ?? D.defaultSize,
      outputDir: v.outputDir ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap?.revision]);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const ops = [];
      if (apiKeyDraft.trim() !== '') ops.push({ op: 'set', path: [F.apiKey], value: apiKeyDraft.trim() });
      ops.push(
        { op: 'set', path: [F.baseURL], value: draft.baseURL ?? D.baseURL },
        { op: 'set', path: [F.defaultModel], value: draft.defaultModel ?? D.defaultModel },
        { op: 'set', path: [F.watermark], value: draft.watermark !== false },
        { op: 'set', path: [F.defaultSize], value: draft.defaultSize ?? D.defaultSize },
        { op: 'set', path: [F.outputDir], value: draft.outputDir ?? '' },
      );
      const ok = await settings.mutate(ops, snap?.revision);
      setMsg(ok ? { kind: 'ok', text: t('saved') } : { kind: 'err', text: t('saveFailed') });
    } catch (e) {
      setMsg({ kind: 'err', text: String(e?.message ?? e) });
    } finally {
      setBusy(false);
    }
  };

  if (snap?.status !== 'ready') {
    return h('div', { style: styles.card },
      h('p', { style: styles.err }, t('unavailable')),
    );
  }

  return h('div', { style: styles.card },
    h('div', { style: { fontSize: 15, fontWeight: 600, marginBottom: 4 } }, t('title')),
    h('p', { style: styles.hint }, t('subtitle')),

    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('apiKey')),
      h('input', { style: styles.input, type: 'password', value: apiKeyDraft, placeholder: 'sk-…', onChange: (e) => setApiKeyDraft(e.target.value) }),
      h('div', { style: styles.hint }, t('apiKeyHint')),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('baseURL')),
      h('input', { style: styles.input, value: draft.baseURL ?? D.baseURL, onChange: (e) => set('baseURL', e.target.value) }),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultModel')),
      h('select', { style: styles.select, value: draft.defaultModel ?? D.defaultModel, onChange: (e) => set('defaultModel', e.target.value) },
        h('option', { value: 'sensenova-u1.5-lite' }, 'sensenova-u1.5-lite（质量优先）'),
        h('option', { value: 'sensenova-u1.5-fast' }, 'sensenova-u1.5-fast（速度优先）'),
      ),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('watermark')),
      h('label', { style: styles.check },
        h('input', { type: 'checkbox', checked: draft.watermark !== false, onChange: (e) => set('watermark', e.target.checked) }),
        h('span', null, t('watermarkLabel')),
      ),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultSize')),
      h('input', { style: styles.input, value: draft.defaultSize ?? D.defaultSize, onChange: (e) => set('defaultSize', e.target.value) }),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('outputDir')),
      h('input', { style: styles.input, value: draft.outputDir ?? '', placeholder: '留空则只在调用方指定 savePath 时写文件', onChange: (e) => set('outputDir', e.target.value) }),
    ),
    h('div', { style: styles.row },
      h('button', { style: styles.primary, disabled: busy || !snap?.writable, onClick: save }, busy ? t('saving') : t('save')),
      !snap?.writable && h('span', { style: styles.hint }, t('readOnly')),
    ),
    msg ? h('div', { style: msg.kind === 'ok' ? styles.ok : styles.err }, msg.text) : null,
  );
}

export function apply(ctx) {
  const translate = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, DICT), 'dsh-sensenova-image: locale dictionaries');

  ctx.inject(['configForms'], (settingsCtx) => {
    const forms = settingsCtx.get('configForms');
    const settings = forms.get(SENSENOVA_IMAGE_ENTRY_ID);
    settingsCtx.slots.inject('settings.section', () =>
      settingsCtx.slots.register(
        {
          name: 'settings.section',
          id: 'sensenova-image',
          order: 30,
          label: () => translate('section'),
          inject: () => ({ settings, t: translate }),
        },
        SenseNovaImageSettingsCard,
      ),
    );
  });
}

export { name, inject };
export default { apply, name, inject };
