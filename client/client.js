window.__ModuleLoader__.load({
  id: "dsh-sensenova-image",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    var React = require("react");
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// client/index.jsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var name = "dsh-sensenova-image";
var inject = ["slots", "locale", "configForms"];
var NS = "sensenova-image";
var ENTRY_ID = "dsh-sensenova-image";
var ITEM_ID = "sensenova-image";
var ITEM_ORDER = 40;
var BASE_URL = "https://token.sensenova.cn/v1";
var MODEL_LITE = "sensenova-u1.5-lite";
var MODEL_FAST = "sensenova-u1.5-fast";
var zh = {
  title: "SenseNova Image",
  summary: "\u5546\u6C64 SenseNova U \u7CFB\u5217\u56FE\u7247\u751F\u6210 / \u7F16\u8F91\u5DE5\u5177\u3002",
  detail: "\u5546\u6C64 SenseNova U \u7CFB\u5217\u56FE\u7247\u751F\u6210 / \u7F16\u8F91\u5DE5\u5177\u63D2\u4EF6\u914D\u7F6E\u3002",
  apiKey: "API Key",
  apiKeyHint: "\u7559\u7A7A\u5219\u4F9D\u6B21\u5C1D\u8BD5\u73AF\u5883\u53D8\u91CF SENSENOVA_API_KEY \u4E0E\u51ED\u636E\u4E2D\u5FC3 ~/.dsh/.credentials.yaml\u3002\u586B\u5199\u5219\u8986\u76D6\u3002",
  baseURL: "Base URL",
  defaultModel: "\u9ED8\u8BA4\u6A21\u578B",
  watermark: "\u6C34\u5370",
  defaultSize: "\u9ED8\u8BA4\u5C3A\u5BF8",
  outputDir: "\u9ED8\u8BA4\u8F93\u51FA\u76EE\u5F55",
  outputDirHint: "\u7559\u7A7A\u5219\u53EA\u5728\u8C03\u7528\u65B9\u6307\u5B9A savePath \u65F6\u5199\u6587\u4EF6\u3002",
  modelLite: "sensenova-u1.5-lite\uFF08\u8D28\u91CF\u4F18\u5148\uFF09",
  modelFast: "sensenova-u1.5-fast\uFF08\u901F\u5EA6\u4F18\u5148\uFF09",
  save: "\u4FDD\u5B58",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  saved: "\u5DF2\u4FDD\u5B58\u3002\u91CD\u542F DSH \u540E\u751F\u6548\u3002",
  failed: "\u4FDD\u5B58\u5931\u8D25\uFF1A\u5BBF\u4E3B\u62D2\u7EDD\u4E86\u672C\u6B21\u5199\u5165\u3002",
  readOnly: "\u8BE5\u914D\u7F6E\u5F53\u524D\u4E0D\u53EF\u5199\u5165\u3002",
  unavailable: "\u914D\u7F6E\u670D\u52A1\u4E0D\u53EF\u7528\uFF08\u5BBF\u4E3B\u672A\u66B4\u9732\u8BE5\u63D2\u4EF6\u6761\u76EE\uFF09\u3002"
};
var en = {
  title: "SenseNova Image",
  summary: "SenseTime SenseNova U-series image generation / editing tools.",
  detail: "Configuration for the SenseTime SenseNova U-series image generation / editing tools.",
  apiKey: "API Key",
  apiKeyHint: "When empty, falls back to the SENSENOVA_API_KEY env var, then ~/.dsh/.credentials.yaml. A value here overrides both.",
  baseURL: "Base URL",
  defaultModel: "Default model",
  watermark: "Watermark",
  defaultSize: "Default size",
  outputDir: "Default output directory",
  outputDirHint: "When empty, files are written only when the caller passes savePath.",
  modelLite: "sensenova-u1.5-lite (quality first)",
  modelFast: "sensenova-u1.5-fast (speed first)",
  save: "Save",
  saving: "Saving\u2026",
  saved: "Saved. Restart DSH to take effect.",
  failed: "Save failed: the host rejected this write.",
  readOnly: "Configuration is not writable right now.",
  unavailable: "Settings service unavailable (the host did not expose this plugin entry)."
};
var styles = {
  field: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 },
  label: { fontSize: 13 },
  hint: { fontSize: 12, opacity: 0.65, lineHeight: 1.4 },
  input: {
    border: "1px solid var(--dsw-alias-border-l2, #d1d5db)",
    background: "var(--dsw-alias-bg-layer-3, #fff)",
    color: "var(--dsw-alias-label-primary, inherit)",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 13,
    height: 36,
    boxSizing: "border-box",
    width: "100%"
  },
  row: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 },
  primary: {
    font: "inherit",
    cursor: "pointer",
    border: "none",
    height: 36,
    padding: "0 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    background: "var(--dsw-alias-button-primary-fill, #4f6ef7)",
    color: "var(--dsw-alias-label-primary-foreground, #fff)"
  },
  ok: { fontSize: 12, color: "var(--dsw-alias-state-success-primary, #34c759)" },
  err: { fontSize: 12, color: "var(--dsw-alias-state-error-primary, #ff3b30)", whiteSpace: "pre-wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 }
};
var FIELD_LABELS = {
  apiKey: "apiKey",
  baseURL: "baseURL",
  defaultModel: "defaultModel",
  watermark: "watermark",
  defaultSize: "defaultSize",
  outputDir: "outputDir"
};
function SenseNovaImageCard(props) {
  const settings = props.settings;
  const t = props.t ?? ((k) => zh[k] ?? k);
  const subscribe = (0, import_react.useCallback)((l) => settings.subscribe(l), [settings]);
  const getSnapshot = (0, import_react.useCallback)(() => settings.getSnapshot(), [settings]);
  const snapshot = (0, import_react.useSyncExternalStore)(subscribe, getSnapshot, getSnapshot);
  const value = snapshot?.value ?? {};
  const writable = snapshot?.writable === true && snapshot?.mode === "host";
  if (props.view === "summary") return (0, import_react.createElement)("span", null, t("summary"));
  if (snapshot?.status !== "ready" || value === void 0) {
    return (0, import_react.createElement)("p", { style: styles.err }, t("unavailable"));
  }
  const current = {
    baseURL: value.baseURL ?? BASE_URL,
    defaultModel: value.defaultModel ?? MODEL_LITE,
    watermark: value.watermark !== false,
    defaultSize: value.defaultSize ?? "2048x2048",
    outputDir: value.outputDir ?? ""
  };
  const setField = (key, next) => {
    props.actions.stage(FIELD_LABELS[key], next);
  };
  return (0, import_react.createElement)(
    "div",
    null,
    (0, import_react.createElement)("p", { style: { ...styles.hint, margin: "0 0 12px" } }, t("detail")),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("apiKey")),
      (0, import_react.createElement)("input", {
        style: styles.input,
        type: "password",
        value: props.actions.draft(FIELD_LABELS.apiKey).value ?? "",
        placeholder: "sk-\u2026",
        onChange: (e) => setField("apiKey", e.target.value)
      }),
      (0, import_react.createElement)("div", { style: styles.hint }, t("apiKeyHint"))
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("baseURL")),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.baseURL).value ?? current.baseURL,
        onChange: (e) => setField("baseURL", e.target.value)
      })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("defaultModel")),
      (0, import_react.createElement)(
        "select",
        {
          style: styles.input,
          value: props.actions.draft(FIELD_LABELS.defaultModel).value ?? current.defaultModel,
          onChange: (e) => setField("defaultModel", e.target.value)
        },
        (0, import_react.createElement)("option", { value: MODEL_LITE }, t("modelLite")),
        (0, import_react.createElement)("option", { value: MODEL_FAST }, t("modelFast"))
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)(
        "label",
        { style: styles.check },
        (0, import_react.createElement)("input", {
          type: "checkbox",
          checked: props.actions.draft(FIELD_LABELS.watermark).value ?? current.watermark,
          onChange: (e) => setField("watermark", e.target.checked)
        }),
        (0, import_react.createElement)("span", null, t("watermark"))
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("defaultSize")),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.defaultSize).value ?? current.defaultSize,
        onChange: (e) => setField("defaultSize", e.target.value)
      })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("outputDir")),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: props.actions.draft(FIELD_LABELS.outputDir).value ?? current.outputDir,
        placeholder: "~/.dsh/images",
        onChange: (e) => setField("outputDir", e.target.value)
      }),
      (0, import_react.createElement)("div", { style: styles.hint }, t("outputDirHint"))
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.row },
      (0, import_react.createElement)("button", {
        style: styles.primary,
        disabled: !writable || props.actions.saving() || props.actions.dirty() === false,
        onClick: () => props.actions.save()
      }, props.actions.saving() ? t("saving") : t("save")),
      !writable && (0, import_react.createElement)("span", { style: styles.hint }, t("readOnly"))
    ),
    props.actions.message() === "saved" ? (0, import_react.createElement)("p", { style: styles.ok }, t("saved")) : null,
    props.actions.message() === "failed" ? (0, import_react.createElement)("p", { style: styles.err }, t("failed")) : null
  );
}
function apply(ctx) {
  const t = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-sensenova-image: dictionaries");
  const form = ctx.configForms.get(ENTRY_ID);
  const drafts = /* @__PURE__ */ new Map();
  let message = null;
  let saving = false;
  const actions = {
    stage(field, value) {
      message = null;
      drafts.set(field, value);
    },
    draft(field) {
      return drafts.has(field) ? { kind: "set", value: drafts.get(field) } : { kind: "unset" };
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
        const ops = [...drafts.entries()].map(([field, value]) => ({ op: "set", path: [field], value }));
        const ok = await form.mutate(ops, form.getSnapshot()?.revision);
        if (ok) {
          drafts.clear();
          message = "saved";
        } else {
          message = "failed";
        }
      } catch {
        message = "failed";
      } finally {
        saving = false;
      }
    },
    inject() {
      return { settings: form, t, actions };
    }
  };
  ctx.effect(() => () => drafts.clear(), "dsh-sensenova-image: drafts");
  ctx.effect(() => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject(
    "plugins.item",
    () => ctx.slots.register(
      {
        name: "plugins.item",
        id: ITEM_ID,
        order: ITEM_ORDER,
        label: () => t("title"),
        locale: NS,
        inject: () => actions.inject()
      },
      SenseNovaImageCard
    )
  )), "dsh-sensenova-image: page");
}

    return module.exports;
  }
});
