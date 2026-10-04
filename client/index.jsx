// dsh-sensenova-image 网页客户端：插件设置卡片（Plugins 页面）
//
// 严格对齐官方 @deepseek-ai/dsh-client-ui-settings-web-search 的范式：
//   inject 里直接声明 configForms，顶层直接用 ctx.configForms，
//   用 whileServed + slots.inject('plugins.item') 把卡片挂到插件条目上。
// 配置读写由宿主 dsh-settings 通过 remote.settings 提供（.volatile() 字段）。

import { createElement as h, useCallback, useSyncExternalStore } from 'react';

const name = 'dsh-sensenova-image';
const inject = ['slots', 'locale', 'configForms'];

const NS = 'sensenova-image';
const ENTRY_ID = 'dsh-sensenova-image';
const ITEM_ID = 'sensenova-image';
const ITEM_ORDER = 40;

const BASE_URL = 'https://token.sensenova.cn/v1';
const MODEL_LITE = 'sensenova-u1.5-lite';
const MODEL_FAST = 'sensenova-u1.5-fast';

const zh = {
  title: 'SenseNova Image',
  summary: '商汤 SenseNova U 系列图片生成 / 编辑工具。',
  detail: '商汤 SenseNova U 系列图片生成 / 编辑工具插件配置。',
  apiKey: 'API Key',
  apiKeyHint: '留空则依次尝试环境变量 SENSENOVA_API_KEY 与凭据中心 ~/.dsh/.credentials.yaml。填写则覆盖。',
  baseURL: 'Base URL',
  defaultModel: '默认模型',
  watermark: '水印',
  defaultSize: '默认尺寸',
  outputDir: '默认输出目录',
  outputDirHint: '留空则只在调用方指定 savePath 时写文件。',
  modelLite: 'sensenova-u1.5-lite（质量优先）',
  modelFast: 'sensenova-u1.5-fast（速度优先）',
  save: '保存',
  saving: '保存中…',
  saved: '已保存。重启 DSH 后生效。',
  failed: '保存失败：宿主拒绝了本次写入。',
  readOnly: '该配置当前不可写入。',
  unavailable: '配置服务不可用（宿主未暴露该插件条目）。',
};

const en = {
  title: 'SenseNova Image',
  summary: 'SenseTime SenseNova U-series image generation / editing tools.',
  detail: 'Configuration for the SenseTime SenseNova U-series image generation / editing tools.',
  apiKey: 'API Key',
  apiKeyHint: 'When empty, falls back to the SENSENOVA_API_KEY env var, then ~/.dsh/.credentials.yaml. A value here overrides both.',
  baseURL: 'Base URL',
  defaultModel: 'Default model',
  watermark: 'Watermark',
  defaultSize: 'Default size',
  outputDir: 'Default output directory',
  outputDirHint: 'When empty, files are written only when the caller passes savePath.',
  modelLite: 'sensenova-u1.5-lite (quality first)',
  modelFast: 'sensenova-u1.5-fast (speed first)',
  save: 'Save',
  saving: 'Saving…',
  saved: 'Saved. Restart DSH to take effect.',
  failed: 'Save failed: the host rejected this write.',
  readOnly: 'Configuration is not writable right now.',
  unavailable: 'Settings service unavailable (the host did not expose this plugin entry).',
};

const styles = {
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

const FIELD_LABELS = {
  apiKey: 'apiKey',
  baseURL: 'baseURL',
  defaultModel: 'defaultModel',
  watermark: 'watermark',
  defaultSize: 'defaultSize',
  outputDir: 'outputDir',
};

/**
 * 设置卡片。props 来自 slot inject（controller.inject()），另加 slot ownerProps。
 */
function SenseNovaImageCard(props) {
  const settings = props.settings;
  const t = props.t ?? ((k) => zh[k] ?? k);

  const subscribe = useCallback((l) => settings.subscribe(l), [settings]);
  const getSnapshot = useCallback(() => settings.getSnapshot(), [settings]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const value = snapshot?.value ?? {};
  const writable = snapshot?.writable === true && snapshot?.mode === 'host';

  if (props.view === 'summary') return h('span', null, t('summary'));

  if (snapshot?.status !== 'ready' || value === undefined) {
    return h('p', { style: styles.err }, t('unavailable'));
  }

  const current = {
    baseURL: value.baseURL ?? BASE_URL,
    defaultModel: value.defaultModel ?? MODEL_LITE,
    watermark: value.watermark !== false,
    defaultSize: value.defaultSize ?? '2048x2048',
    outputDir: value.outputDir ?? '',
  };

  const setField = (key, next) => {
    props.actions.stage(FIELD_LABELS[key], next);
  };

  return h('div', null,
    h('p', { style: { ...styles.hint, margin: '0 0 12px' } }, t('detail')),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('apiKey')),
      h('input', {
        style: styles.input, type: 'password',
        value: props.actions.draft(FIELD_LABELS.apiKey).value ?? '',
        placeholder: 'sk-…',
        onChange: (e) => setField('apiKey', e.target.value),
      }),
      h('div', { style: styles.hint }, t('apiKeyHint')),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('baseURL')),
      h('input', {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.baseURL).value ?? current.baseURL,
        onChange: (e) => setField('baseURL', e.target.value),
      }),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultModel')),
      h('select', {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.defaultModel).value ?? current.defaultModel,
        onChange: (e) => setField('defaultModel', e.target.value),
      },
        h('option', { value: MODEL_LITE }, t('modelLite')),
        h('option', { value: MODEL_FAST }, t('modelFast')),
      ),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.check },
        h('input', {
          type: 'checkbox',
          checked: props.actions.draft(FIELD_LABELS.watermark).value ?? current.watermark,
          onChange: (e) => setField('watermark', e.target.checked),
        }),
        h('span', null, t('watermark')),
      ),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('defaultSize')),
      h('input', {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.defaultSize).value ?? current.defaultSize,
        onChange: (e) => setField('defaultSize', e.target.value),
      }),
    ),
    h('div', { style: styles.field },
      h('label', { style: styles.label }, t('outputDir')),
      h('input', {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.outputDir).value ?? current.outputDir,
        placeholder: '~/.dsh/images',
        onChange: (e) => setField('outputDir', e.target.value),
      }),
      h('div', { style: styles.hint }, t('outputDirHint')),
    ),
    h('div', { style: styles.row },
      h('button', {
        style: styles.primary,
        disabled: !writable || props.actions.saving() || props.actions.dirty() === false,
        onClick: () => props.actions.save(),
      }, props.actions.saving() ? t('saving') : t('save')),
      !writable && h('span', { style: styles.hint }, t('readOnly')),
    ),
    props.actions.message() === 'saved' ? h('p', { style: styles.ok }, t('saved')) : null,
    props.actions.message() === 'failed' ? h('p', { style: styles.err }, t('failed')) : null,
  );
}

function apply(ctx) {
  const t = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-sensenova-image: dictionaries');

  const form = ctx.configForms.get(ENTRY_ID);
  const drafts = new Map();
  let message = null;
  let saving = false;

  const actions = {
    stage(field, value) {
      message = null;
      drafts.set(field, value);
    },
    draft(field) {
      return drafts.has(field) ? { kind: 'set', value: drafts.get(field) } : { kind: 'unset' };
    },
    dirty() {
      return drafts.size > 0;
    },
    saving() {
      return saving;
    },
    message() {
      return message;
    },
    async save() {
      if (saving || drafts.size === 0) return;
      saving = true;
      try {
        const ops = [...drafts.entries()].map(([field, value]) => ({ op: 'set', path: [field], value }));
        const ok = await form.mutate(ops, form.getSnapshot()?.revision);
        if (ok) {
          drafts.clear();
          message = 'saved';
        } else {
          message = 'failed';
        }
      } catch {
        message = 'failed';
      } finally {
        saving = false;
      }
    },
    inject() {
      return { settings: form, t, actions };
    },
  };

  ctx.effect(() => () => drafts.clear(), 'dsh-sensenova-image: drafts');

  ctx.effect(() => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject(
    'plugins.item',
    () => ctx.slots.register(
      {
        name: 'plugins.item',
        id: ITEM_ID,
        order: ITEM_ORDER,
        label: () => t('title'),
        locale: NS,
        inject: () => actions.inject(),
      },
      SenseNovaImageCard,
    ),
  )), 'dsh-sensenova-image: page');
}

export { apply, inject, name };
