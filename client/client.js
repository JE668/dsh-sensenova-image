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

// client/api.js
var SENSENOVA_IMAGE_RPC_CHANNEL = "/dsh-sensenova-image";
var SENSENOVA_IMAGE_ENDPOINTS = Object.freeze({
  getConfig: "image.getConfig",
  setConfig: "image.setConfig",
  status: "image.status"
});

// client/index.jsx
var name = "dsh-sensenova-image";
var inject = ["slots", "connection", "locale"];
var NS = "sensenova-image";
var BASE_URL = "https://token.sensenova.cn/v1";
var MODEL_LITE = "sensenova-u1.5-lite";
var MODEL_FAST = "sensenova-u1.5-fast";
var zh = {
  section: "SenseNova Image",
  title: "SenseNova Image",
  subtitle: "\u5546\u6C64 SenseNova U \u7CFB\u5217\u56FE\u7247\u751F\u6210 / \u7F16\u8F91\u5DE5\u5177\u63D2\u4EF6\u914D\u7F6E\u3002",
  apiKey: "API Key",
  apiKeyHint: "\u7559\u7A7A\u5219\u4F9D\u6B21\u5C1D\u8BD5\u73AF\u5883\u53D8\u91CF SENSENOVA_API_KEY \u4E0E\u51ED\u636E\u4E2D\u5FC3 ~/.dsh/.credentials.yaml\u3002\u586B\u5199\u5219\u8986\u76D6\u3002",
  apiKeyConfigured: "\u5DF2\u914D\u7F6E",
  apiKeyMissing: "\u672A\u914D\u7F6E",
  baseURL: "Base URL",
  defaultModel: "\u9ED8\u8BA4\u6A21\u578B",
  watermark: "\u9ED8\u8BA4\u6DFB\u52A0\u5B98\u65B9\u6C34\u5370\uFF08\u516C\u6D4B\u671F\u53BB\u6C34\u5370\u514D\u8D39\uFF09",
  defaultSize: "\u9ED8\u8BA4\u5C3A\u5BF8",
  outputDir: "\u9ED8\u8BA4\u8F93\u51FA\u76EE\u5F55",
  outputDirHint: "\u7559\u7A7A\u5219\u53EA\u5728\u8C03\u7528\u65B9\u6307\u5B9A savePath \u65F6\u5199\u6587\u4EF6\u3002",
  modelLite: "sensenova-u1.5-lite\uFF08\u8D28\u91CF\u4F18\u5148\uFF09",
  modelFast: "sensenova-u1.5-fast\uFF08\u901F\u5EA6\u4F18\u5148\uFF09",
  save: "\u4FDD\u5B58",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  saved: "\u5DF2\u4FDD\u5B58\u3002\u91CD\u542F DSH \u540E\u751F\u6548\u3002",
  failed: "\u4FDD\u5B58\u5931\u8D25\u3002",
  loading: "\u52A0\u8F7D\u4E2D\u2026",
  loadFailed: "\u65E0\u6CD5\u8BFB\u53D6\u914D\u7F6E\u3002"
};
var en = {
  section: "SenseNova Image",
  title: "SenseNova Image",
  subtitle: "Configuration for the SenseTime SenseNova U-series image generation / editing tools.",
  apiKey: "API Key",
  apiKeyHint: "When empty, falls back to the SENSENOVA_API_KEY env var, then ~/.dsh/.credentials.yaml. A value here overrides both.",
  apiKeyConfigured: "configured",
  apiKeyMissing: "not set",
  baseURL: "Base URL",
  defaultModel: "Default model",
  watermark: "Add official watermark by default (free during public beta)",
  defaultSize: "Default size",
  outputDir: "Default output directory",
  outputDirHint: "When empty, files are written only when the caller passes savePath.",
  modelLite: "sensenova-u1.5-lite (quality first)",
  modelFast: "sensenova-u1.5-fast (speed first)",
  save: "Save",
  saving: "Saving\u2026",
  saved: "Saved. Restart DSH to take effect.",
  failed: "Save failed.",
  loading: "Loading\u2026",
  loadFailed: "Could not read the configuration."
};
var styles = {
  card: { maxWidth: 520 },
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
function SenseNovaImageSettingsTab({ rpcCall, t }) {
  const [config, setConfig] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const [draft, setDraft] = (0, import_react.useState)({});
  const [apiKeyDraft, setApiKeyDraft] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [msg, setMsg] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    let alive = true;
    setError(null);
    rpcCall(SENSENOVA_IMAGE_ENDPOINTS.getConfig, {}).then((res) => {
      if (!alive) return;
      if (res && res.ok === true) setConfig(res.value ?? {});
      else setError(t("loadFailed"));
    }).catch((e) => {
      if (alive) setError(e?.message ?? t("loadFailed"));
    });
    return () => {
      alive = false;
    };
  }, []);
  if (error) return (0, import_react.createElement)("p", { style: styles.err }, error);
  if (config === null) return (0, import_react.createElement)("p", { style: styles.hint }, t("loading"));
  const field = (key, fallback) => key in draft ? draft[key] : config[key] ?? fallback;
  const set = (key, value) => {
    setMsg(null);
    setDraft((d) => ({ ...d, [key]: value }));
  };
  const dirty = Object.keys(draft).length > 0 || apiKeyDraft.trim() !== "";
  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const updates = {};
      for (const [k, v] of Object.entries(draft)) updates[k] = v;
      if (apiKeyDraft.trim() !== "") updates.apiKey = apiKeyDraft.trim();
      const res = await rpcCall(SENSENOVA_IMAGE_ENDPOINTS.setConfig, { updates });
      if (res && res.ok === true) {
        setConfig(res.value ?? {});
        setDraft({});
        setApiKeyDraft("");
        setMsg({ kind: "ok", text: t("saved") });
      } else {
        setMsg({ kind: "err", text: res?.error?.message ?? t("failed") });
      }
    } catch (e) {
      setMsg({ kind: "err", text: e?.message ?? t("failed") });
    } finally {
      setBusy(false);
    }
  };
  return (0, import_react.createElement)(
    "div",
    { style: styles.card },
    (0, import_react.createElement)("p", { style: { ...styles.hint, margin: "0 0 12px" } }, t("subtitle")),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)(
        "label",
        { style: styles.label },
        t("apiKey"),
        " \xB7 ",
        (0, import_react.createElement)(
          "span",
          { style: styles.hint },
          config.apiKeyConfigured ? t("apiKeyConfigured") : t("apiKeyMissing")
        )
      ),
      (0, import_react.createElement)("input", {
        style: styles.input,
        type: "password",
        value: apiKeyDraft,
        placeholder: "sk-\u2026",
        onChange: (e) => {
          setMsg(null);
          setApiKeyDraft(e.target.value);
        }
      }),
      (0, import_react.createElement)("div", { style: styles.hint }, t("apiKeyHint"))
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("baseURL")),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: field("baseURL", BASE_URL),
        onChange: (e) => set("baseURL", e.target.value)
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
          value: field("defaultModel", MODEL_LITE),
          onChange: (e) => set("defaultModel", e.target.value)
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
          checked: field("watermark", true) !== false,
          onChange: (e) => set("watermark", e.target.checked)
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
        value: field("defaultSize", "2048x2048"),
        onChange: (e) => set("defaultSize", e.target.value)
      })
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.field },
      (0, import_react.createElement)("label", { style: styles.label }, t("outputDir")),
      (0, import_react.createElement)("input", {
        style: styles.input,
        value: field("outputDir", ""),
        placeholder: "~/.dsh/images",
        onChange: (e) => set("outputDir", e.target.value)
      }),
      (0, import_react.createElement)("div", { style: styles.hint }, t("outputDirHint"))
    ),
    (0, import_react.createElement)(
      "div",
      { style: styles.row },
      (0, import_react.createElement)(
        "button",
        { style: styles.primary, disabled: busy || !dirty, onClick: save },
        busy ? t("saving") : t("save")
      )
    ),
    msg ? (0, import_react.createElement)("p", { style: msg.kind === "ok" ? styles.ok : styles.err }, msg.text) : null
  );
}
function apply(ctx) {
  const rpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(SENSENOVA_IMAGE_RPC_CHANNEL, endpoint, payload, signal);
  const translate = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-sensenova-image: locale dictionaries");
  ctx.slots.inject(
    "settings.section",
    () => ctx.slots.register(
      {
        name: "settings.section",
        id: "sensenova-image",
        order: 40,
        label: () => translate("section"),
        inject: () => ({ rpcCall, t: translate })
      },
      SenseNovaImageSettingsTab
    )
  );
}

    return module.exports;
  }
});
