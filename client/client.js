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
var SENSENOVA_IMAGE_RPC_CHANNEL = "/dsh-sensenova-image";
var SENSENOVA_IMAGE_ENDPOINTS = Object.freeze({
  getConfig: "image.getConfig",
  setConfig: "image.setConfig",
  status: "image.status"
});
function redactConfig(c) {
  return {
    baseURL: c?.baseURL ?? "",
    defaultModel: c?.defaultModel ?? "",
    watermark: c?.watermark ?? true,
    defaultSize: c?.defaultSize ?? "",
    outputDir: c?.outputDir ?? "",
    apiKeyConfigured: c?.apiKeyConfigured === true
  };
}

// client/index.jsx
var name = "dsh-sensenova-image";
var inject = ["slots", "connection", "locale"];
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
    save: "\u4FDD\u5B58"
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
    save: "Save"
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
  btn: { font: "inherit", cursor: "pointer", border: "1px solid var(--dsw-alias-button-ghost-active-border, var(--dsw-alias-border-l2,#d1d5db))", background: "var(--dsw-alias-bg-layer-1,#fff)", color: "var(--dsw-alias-label-primary,inherit)", height: 36, padding: "0 16px", borderRadius: 999, fontSize: 13, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  primary: { font: "inherit", cursor: "pointer", border: "none", background: "var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary,#4f6ef7))", color: "var(--dsw-alias-label-primary-foreground, #fff)", height: 36, padding: "0 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  ok: { color: "var(--dsw-alias-state-success-primary,#34c759)", fontSize: 12 },
  err: { color: "var(--dsw-alias-state-error-primary,#ff3b30)", fontSize: 12, whiteSpace: "pre-wrap" },
  block: { borderTop: "1px solid var(--dsw-alias-border-l2,#e5e7eb)", marginTop: 16, paddingTop: 16 },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 }
};
function ImageSettingsTab({ rpcCall, t }) {
  const [cfg, setCfg] = (0, import_react.useState)(null);
  const [draft, setDraft] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [msg, setMsg] = (0, import_react.useState)(null);
  const call = async (endpoint, payload) => {
    const res = await rpcCall(endpoint, payload);
    if (!res?.ok) throw new Error(res?.error?.message ?? "RPC failed");
    return res.value;
  };
  const load = async () => {
    try {
      const c = await call(SENSENOVA_IMAGE_ENDPOINTS.getConfig, {});
      const view = redactConfig(c);
      setCfg(view);
      setDraft({ ...view });
    } catch (e) {
      setMsg({ kind: "err", text: String(e?.message ?? e) });
    }
  };
  (0, import_react.useEffect)(() => {
    load();
  }, []);
  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setMsg(null);
    try {
      const payload = {
        baseURL: draft.baseURL,
        defaultModel: draft.defaultModel,
        watermark: !!draft.watermark,
        defaultSize: draft.defaultSize,
        outputDir: draft.outputDir
      };
      if (typeof draft.apiKeyInput === "string" && draft.apiKeyInput.trim() !== "") {
        payload.apiKey = draft.apiKeyInput.trim();
      }
      await call(SENSENOVA_IMAGE_ENDPOINTS.setConfig, payload);
      setMsg({ kind: "ok", text: "\u5DF2\u4FDD\u5B58\u3002\u91CD\u542F DSH \u6216\u5237\u65B0\u4F1A\u8BDD\u540E\u751F\u6548\u3002" });
      const c = await call(SENSENOVA_IMAGE_ENDPOINTS.getConfig, {});
      const view = redactConfig(c);
      setCfg(view);
      setDraft({ ...view, apiKeyInput: "" });
    } catch (e) {
      setMsg({ kind: "err", text: String(e?.message ?? e) });
    } finally {
      setBusy(false);
    }
  };
  return (0, import_react.createElement)(
    "div",
    { style: styles.card },
    (0, import_react.createElement)("div", { style: { fontSize: 15, fontWeight: 600, marginBottom: 4 } }, t("title") || "SenseNova Image"),
    (0, import_react.createElement)("p", { style: styles.hint }, t("subtitle") || "\u5546\u6C64 SenseNova U \u7CFB\u5217\u56FE\u7247\u751F\u6210 / \u7F16\u8F91\u5DE5\u5177\u63D2\u4EF6\u914D\u7F6E\u3002"),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("apiKey") || "API Key"),
      (0, import_react.createElement)("input", {
        style: styles.input,
        type: "password",
        value: draft?.apiKeyInput ?? "",
        placeholder: draft?.apiKeyConfigured ? "\u5DF2\u914D\u7F6E\uFF08\u7559\u7A7A\u5219\u4E0D\u4FEE\u6539\uFF09" : "sk-\u2026",
        onChange: (e) => set("apiKeyInput", e.target.value)
      }),
      (0, import_react.createElement)("div", { style: styles.hint }, t("apiKeyHint") || "\u7559\u7A7A\u5219\u4F9D\u6B21\u5C1D\u8BD5\u73AF\u5883\u53D8\u91CF SENSENOVA_API_KEY \u4E0E\u51ED\u636E\u4E2D\u5FC3 ~/.dsh/.credentials.yaml\u3002\u586B\u5199\u5219\u8986\u76D6\u3002")
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("baseURL") || "Base URL"),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: draft?.baseURL ?? "",
        placeholder: "https://token.sensenova.cn/v1",
        onChange: (e) => set("baseURL", e.target.value)
      })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("defaultModel") || "\u9ED8\u8BA4\u6A21\u578B"),
      (0, import_react.createElement)(
        "select",
        {
          style: styles.select,
          value: draft?.defaultModel ?? "sensenova-u1.5-lite",
          onChange: (e) => set("defaultModel", e.target.value)
        },
        (0, import_react.createElement)("option", { value: "sensenova-u1.5-lite" }, "sensenova-u1.5-lite\uFF08\u8D28\u91CF\u4F18\u5148\uFF09"),
        (0, import_react.createElement)("option", { value: "sensenova-u1.5-fast" }, "sensenova-u1.5-fast\uFF08\u901F\u5EA6\u4F18\u5148\uFF09")
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("watermark") || "\u6C34\u5370"),
      (0, import_react.createElement)(
        "label",
        { style: styles.check },
        (0, import_react.createElement)("input", { type: "checkbox", checked: draft?.watermark !== false, onChange: (e) => set("watermark", e.target.checked) }),
        (0, import_react.createElement)("span", null, t("watermarkLabel") || "\u9ED8\u8BA4\u6DFB\u52A0\u5B98\u65B9\u6C34\u5370\uFF08\u516C\u6D4B\u671F\u53BB\u6C34\u5370\u514D\u8D39\uFF09")
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("defaultSize") || "\u9ED8\u8BA4\u5C3A\u5BF8"),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: draft?.defaultSize ?? "",
        placeholder: "2048x2048",
        onChange: (e) => set("defaultSize", e.target.value)
      })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("outputDir") || "\u9ED8\u8BA4\u8F93\u51FA\u76EE\u5F55"),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: draft?.outputDir ?? "",
        placeholder: "\u7559\u7A7A\u5219\u53EA\u5728\u8C03\u7528\u65B9\u6307\u5B9A savePath \u65F6\u5199\u6587\u4EF6",
        onChange: (e) => set("outputDir", e.target.value)
      })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.row },
      (0, import_react.createElement)("button", { style: styles.primary, disabled: busy, onClick: save }, busy ? "\u2026" : t("save") || "\u4FDD\u5B58"),
      busy ? (0, import_react.createElement)("span", { style: styles.hint }, "\u4FDD\u5B58\u4E2D\u2026") : null
    ),
    msg ? (0, import_react.createElement)("div", { style: msg.kind === "ok" ? styles.ok : styles.err }, msg.text) : null
  );
}
function apply(ctx) {
  const rpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(SENSENOVA_IMAGE_RPC_CHANNEL, endpoint, payload, signal);
  const translate = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, DICT), "dsh-sensenova-image: locale dictionaries");
  ctx.slots.inject(
    "settings.section",
    () => ctx.slots.register(
      {
        name: "settings.section",
        id: "sensenova-image",
        order: 30,
        label: () => translate("section"),
        inject: () => ({ rpcCall, t: translate })
      },
      ImageSettingsTab
    )
  );
}
var index_default = { apply, name, inject };

    return module.exports;
  }
});
