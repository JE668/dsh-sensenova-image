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
  default: () => index_default,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");

// client/api.js
var SENSENOVA_IMAGE_ENTRY_ID = "dsh-sensenova-image";
var SENSENOVA_IMAGE_FIELDS = Object.freeze({
  apiKey: "apiKey",
  baseURL: "baseURL",
  defaultModel: "defaultModel",
  watermark: "watermark",
  defaultSize: "defaultSize",
  outputDir: "outputDir"
});
var SENSENOVA_IMAGE_DEFAULTS = Object.freeze({
  baseURL: "https://token.sensenova.cn/v1",
  defaultModel: "sensenova-u1.5-lite",
  watermark: true,
  defaultSize: "2048x2048",
  outputDir: ""
});

// client/index.jsx
var name = "dsh-sensenova-image";
var inject = ["slots", "layout", "locale"];
var NS = "sensenova-image";
var DICT = {
  zh: {
    section: "SenseNova Image",
    title: "SenseNova Image",
    subtitle: "\u5546\u6C64 SenseNova U \u7CFB\u5217\u56FE\u7247\u751F\u6210 / \u7F16\u8F91\u5DE5\u5177\u63D2\u4EF6\u914D\u7F6E\u3002",
    apiKey: "API Key",
    apiKeyHint: "\u7559\u7A7A\u5219\u4F9D\u6B21\u5C1D\u8BD5\u73AF\u5883\u53D8\u91CF SENSENOVA_API_KEY \u4E0E\u51ED\u636E\u4E2D\u5FC3 ~/.dsh/.credentials.yaml\u3002\u586B\u5199\u5219\u8986\u76D6\u3002",
    baseURL: "Base URL",
    defaultModel: "\u9ED8\u8BA4\u6A21\u578B",
    watermark: "\u6C34\u5370",
    watermarkLabel: "\u9ED8\u8BA4\u6DFB\u52A0\u5B98\u65B9\u6C34\u5370\uFF08\u516C\u6D4B\u671F\u53BB\u6C34\u5370\u514D\u8D39\uFF09",
    defaultSize: "\u9ED8\u8BA4\u5C3A\u5BF8",
    outputDir: "\u9ED8\u8BA4\u8F93\u51FA\u76EE\u5F55",
    save: "\u4FDD\u5B58",
    saving: "\u4FDD\u5B58\u4E2D\u2026",
    saved: "\u5DF2\u4FDD\u5B58\u3002\u91CD\u542F DSH \u6216\u5237\u65B0\u4F1A\u8BDD\u540E\u751F\u6548\u3002",
    readOnly: "\u8BE5\u914D\u7F6E\u5F53\u524D\u4E0D\u53EF\u5199\u5165\u3002",
    unavailable: "\u914D\u7F6E\u670D\u52A1\u4E0D\u53EF\u7528\uFF08\u5BBF\u4E3B dsh-settings \u672A\u66B4\u9732\u8BE5\u63D2\u4EF6\u6761\u76EE\uFF09\u3002",
    saveFailed: "\u4FDD\u5B58\u5931\u8D25\uFF1A\u5BBF\u4E3B\u62D2\u7EDD\u4E86\u672C\u6B21\u5199\u5165\u3002"
  },
  en: {
    section: "SenseNova Image",
    title: "SenseNova Image",
    subtitle: "Configuration for the SenseTime SenseNova U-series image generation / editing tools.",
    apiKey: "API Key",
    apiKeyHint: "When empty, falls back to the SENSENOVA_API_KEY env var, then ~/.dsh/.credentials.yaml. A value here overrides both.",
    baseURL: "Base URL",
    defaultModel: "Default model",
    watermark: "Watermark",
    watermarkLabel: "Add official watermark by default (free during public beta)",
    defaultSize: "Default size",
    outputDir: "Default output directory",
    save: "Save",
    saving: "Saving\u2026",
    saved: "Saved. Restart DSH or refresh the session to take effect.",
    readOnly: "Configuration is not writable right now.",
    unavailable: "Settings service unavailable (host did not expose this plugin entry).",
    saveFailed: "Save failed: the host rejected this write."
  }
};
var styles = {
  card: { background: "var(--dsw-alias-bg-layer-1,#fff)", border: "1px solid var(--dsw-alias-border-l2,#e5e7eb)", borderRadius: 12, padding: "16px 20px", maxWidth: 480 },
  field: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 },
  label: { fontSize: 13, color: "var(--dsw-alias-label-primary,inherit)" },
  hint: { fontSize: 12, color: "var(--dsw-alias-label-tertiary,#8b93a1)", lineHeight: 1.4 },
  input: { border: "1px solid var(--dsw-alias-border-l2,#d1d5db)", background: "var(--dsw-alias-bg-layer-3,#fff)", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "var(--dsw-alias-label-primary,inherit)", height: 36, boxSizing: "border-box", width: "100%" },
  select: { border: "1px solid var(--dsw-alias-border-l2,#d1d5db)", background: "var(--dsw-alias-bg-layer-3,#fff)", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "var(--dsw-alias-label-primary,inherit)", height: 36, boxSizing: "border-box", width: "100%" },
  row: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 },
  primary: { font: "inherit", cursor: "pointer", border: "none", background: "var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary,#4f6ef7))", color: "var(--dsw-alias-label-primary-foreground, #fff)", height: 36, padding: "0 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  ok: { color: "var(--dsw-alias-state-success-primary,#34c759)", fontSize: 12 },
  err: { color: "var(--dsw-alias-state-error-primary,#ff3b30)", fontSize: 12, whiteSpace: "pre-wrap" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 }
};
function SenseNovaImageSettingsCard({ settings, t }) {
  const snap = (0, import_react.useSyncExternalStore)(settings.subscribe, settings.getSnapshot);
  const v = snap?.value ?? {};
  const [draft, setDraft] = (0, import_react.useState)({
    baseURL: v.baseURL ?? SENSENOVA_IMAGE_DEFAULTS.baseURL,
    defaultModel: v.defaultModel ?? SENSENOVA_IMAGE_DEFAULTS.defaultModel,
    watermark: v.watermark !== false,
    defaultSize: v.defaultSize ?? SENSENOVA_IMAGE_DEFAULTS.defaultSize,
    outputDir: v.outputDir ?? ""
  });
  const [apiKeyDraft, setApiKeyDraft] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [msg, setMsg] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    setDraft({
      baseURL: v.baseURL ?? SENSENOVA_IMAGE_DEFAULTS.baseURL,
      defaultModel: v.defaultModel ?? SENSENOVA_IMAGE_DEFAULTS.defaultModel,
      watermark: v.watermark !== false,
      defaultSize: v.defaultSize ?? SENSENOVA_IMAGE_DEFAULTS.defaultSize,
      outputDir: v.outputDir ?? ""
    });
  }, [snap?.revision]);
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const ops = [];
      if (apiKeyDraft.trim() !== "") ops.push({ op: "set", path: [SENSENOVA_IMAGE_FIELDS.apiKey], value: apiKeyDraft.trim() });
      ops.push(
        { op: "set", path: [SENSENOVA_IMAGE_FIELDS.baseURL], value: draft.baseURL ?? SENSENOVA_IMAGE_DEFAULTS.baseURL },
        { op: "set", path: [SENSENOVA_IMAGE_FIELDS.defaultModel], value: draft.defaultModel ?? SENSENOVA_IMAGE_DEFAULTS.defaultModel },
        { op: "set", path: [SENSENOVA_IMAGE_FIELDS.watermark], value: draft.watermark !== false },
        { op: "set", path: [SENSENOVA_IMAGE_FIELDS.defaultSize], value: draft.defaultSize ?? SENSENOVA_IMAGE_DEFAULTS.defaultSize },
        { op: "set", path: [SENSENOVA_IMAGE_FIELDS.outputDir], value: draft.outputDir ?? "" }
      );
      const ok = await settings.mutate(ops, snap?.revision);
      setMsg(ok ? { kind: "ok", text: t("saved") } : { kind: "err", text: t("saveFailed") });
    } catch (e) {
      setMsg({ kind: "err", text: String(e?.message ?? e) });
    } finally {
      setBusy(false);
    }
  };
  if (snap?.status !== "ready") {
    return (0, import_react.createElement)(
      "div",
      { style: styles.card },
      (0, import_react.createElement)("p", { style: styles.err }, t("unavailable"))
    );
  }
  return (0, import_react.createElement)(
    "div",
    { style: styles.card },
    (0, import_react.createElement)("div", { style: { fontSize: 15, fontWeight: 600, marginBottom: 4 } }, t("title")),
    (0, import_react.createElement)("p", { style: styles.hint }, t("subtitle")),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("apiKey")),
      (0, import_react.createElement)("input", { style: styles.input, type: "password", value: apiKeyDraft, placeholder: "sk-\u2026", onChange: (e) => setApiKeyDraft(e.target.value) }),
      (0, import_react.createElement)("div", { style: styles.hint }, t("apiKeyHint"))
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("baseURL")),
      (0, import_react.createElement)("input", { style: styles.input, value: draft.baseURL ?? SENSENOVA_IMAGE_DEFAULTS.baseURL, onChange: (e) => set("baseURL", e.target.value) })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("defaultModel")),
      (0, import_react.createElement)(
        "select",
        { style: styles.select, value: draft.defaultModel ?? SENSENOVA_IMAGE_DEFAULTS.defaultModel, onChange: (e) => set("defaultModel", e.target.value) },
        (0, import_react.createElement)("option", { value: "sensenova-u1.5-lite" }, "sensenova-u1.5-lite\uFF08\u8D28\u91CF\u4F18\u5148\uFF09"),
        (0, import_react.createElement)("option", { value: "sensenova-u1.5-fast" }, "sensenova-u1.5-fast\uFF08\u901F\u5EA6\u4F18\u5148\uFF09")
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("watermark")),
      (0, import_react.createElement)(
        "label",
        { style: styles.check },
        (0, import_react.createElement)("input", { type: "checkbox", checked: draft.watermark !== false, onChange: (e) => set("watermark", e.target.checked) }),
        (0, import_react.createElement)("span", null, t("watermarkLabel"))
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("defaultSize")),
      (0, import_react.createElement)("input", { style: styles.input, value: draft.defaultSize ?? SENSENOVA_IMAGE_DEFAULTS.defaultSize, onChange: (e) => set("defaultSize", e.target.value) })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("outputDir")),
      (0, import_react.createElement)("input", { style: styles.input, value: draft.outputDir ?? "", placeholder: "\u7559\u7A7A\u5219\u53EA\u5728\u8C03\u7528\u65B9\u6307\u5B9A savePath \u65F6\u5199\u6587\u4EF6", onChange: (e) => set("outputDir", e.target.value) })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.row },
      (0, import_react.createElement)("button", { style: styles.primary, disabled: busy || !snap?.writable, onClick: save }, busy ? t("saving") : t("save")),
      !snap?.writable && (0, import_react.createElement)("span", { style: styles.hint }, t("readOnly"))
    ),
    msg ? (0, import_react.createElement)("div", { style: msg.kind === "ok" ? styles.ok : styles.err }, msg.text) : null
  );
}
function apply(ctx) {
  const translate = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, DICT), "dsh-sensenova-image: locale dictionaries");
  ctx.inject(["configForms"], (settingsCtx) => {
    const forms = settingsCtx.get("configForms");
    const settings = forms.get(SENSENOVA_IMAGE_ENTRY_ID);
    settingsCtx.slots.inject(
      "settings.section",
      () => settingsCtx.slots.register(
        {
          name: "settings.section",
          id: "sensenova-image",
          order: 30,
          label: () => translate("section"),
          inject: () => ({ settings, t: translate })
        },
        SenseNovaImageSettingsCard
      )
    );
  });
}
var index_default = { apply, name, inject };

    return module.exports;
  }
});
