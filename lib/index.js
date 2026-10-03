/**
 * dsh-sensenova-image —— 商汤 SenseNova U 系列图片生成 / 编辑工具插件。
 *
 * 注册两个 DSH 工具：
 *   1. sensenova_text2img —— 文生图（POST /v1/images/generations）
 *   2. sensenova_img2img  —— 图片编辑（POST /v1/images/edits）
 *
 * 支持模型：sensenova-u1.5-lite（默认）、sensenova-u1.5-fast
 *
 * 设置页（Settings → Plugins → Plugin configuration → SenseNova Image）：
 *   本插件导出 Config schema，DSH 自动生成设置表单；apiKey 以 role("secret")
 *   声明，界面上为密码输入框。
 *
 * API 密钥解析优先级：
 *   1. 插件配置 apiKey（设置页填写）
 *   2. 环境变量 SENSENOVA_API_KEY
 *   3. ~/.dsh/.credentials.yaml 中的 SENSENOVA_API_KEY 引用
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve, isAbsolute, basename, extname } from 'node:path';
import z from '@deepseek-ai/schemastery';
import { installImageRpc, viewOf } from './rpc.js';

const DEFAULT_BASE_URL = 'https://token.sensenova.cn/v1';
const DEFAULT_MODEL = 'sensenova-u1.5-lite';
const TIMEOUT_MS = 180000;

/** 插件配置 schema：DSH 依据它在设置页渲染表单。 */
export const Config = z.object({
  apiKey: z.string().role('secret').description('SenseNova API Key（sk-...）。留空则依次尝试环境变量 SENSENOVA_API_KEY 与凭据中心 ~/.dsh/.credentials.yaml。').volatile(),
  baseURL: z.string().default(DEFAULT_BASE_URL).description('API 基础地址，默认 https://token.sensenova.cn/v1').volatile(),
  defaultModel: z.union(['sensenova-u1.5-lite', 'sensenova-u1.5-fast']).default(DEFAULT_MODEL).description('默认模型：lite 质量优先；fast 速度优先。工具调用时可用 model 参数覆盖。').volatile(),
  watermark: z.boolean().default(true).description('默认是否添加 SenseNova 官方水印。公测期间 false（去水印）免费。').volatile(),
  defaultSize: z.string().default('2048x2048').description('默认图片尺寸：auto / 2K / 4K 或 WIDTHxHEIGHT（32 的倍数，512–4096，比例 ≤3:1）。').volatile(),
  outputDir: z.string().description('可选：图片默认保存目录；留空则只在调用方指定 savePath 时才写文件。').volatile(),
});

function asRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

/** Resolve the SenseNova API key: plugin config > process env > ~/.dsh/.credentials.yaml */
function resolveApiKey(config) {
  const cfgKey = config?.apiKey;
  if (typeof cfgKey === 'string' && cfgKey.trim() !== '') return cfgKey.trim();

  const envKey = process.env.SENSENOVA_API_KEY;
  if (typeof envKey === 'string' && envKey.trim() !== '') return envKey.trim();

  try {
    const credPath = resolve(homedir(), '.dsh', '.credentials.yaml');
    if (existsSync(credPath)) {
      const lines = readFileSync(credPath, 'utf8').split('\n');
      for (const line of lines) {
        const m = line.match(/^\s*SENSENOVA_API_KEY:\s*(.+)$/);
        if (m && m[1].trim() !== '') return m[1].trim();
      }
    }
  } catch { /* ignore */ }
  return undefined;
}

const NO_KEY_ERROR = '未找到 SenseNova API 密钥。请在 设置 → 插件 → SenseNova Image 的 apiKey 中填写，或设置环境变量 SENSENOVA_API_KEY，或在 ~/.dsh/.credentials.yaml 的 refs 中配置。';

async function postJson(baseURL, path, apiKey, body) {
  const url = `${String(baseURL).replace(/\/+$/, '')}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch {
      throw new Error(`API 返回非 JSON（HTTP ${response.status}）：${text.slice(0, 300)}`);
    }
    if (!response.ok) {
      const msg = json?.error?.message ?? json?.error ?? text;
      throw new Error(`SenseNova API 错误（HTTP ${response.status}）：${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

const MIME = { png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg', webp: 'image/webp' };

/** Save base64 image to disk; returns absolute path. */
function saveImage(b64, targetPath, format) {
  const ext = (format === 'jpeg' ? 'jpg' : format) || 'png';
  let filePath = resolve(process.cwd(), targetPath);
  // If targetPath is an existing dir or has no image extension, treat as directory.
  const hasImgExt = ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(filePath).toLowerCase());
  if (!hasImgExt) {
    if (!existsSync(filePath)) mkdirSync(filePath, { recursive: true });
    filePath = resolve(filePath, `sensenova-${Date.now()}.${ext}`);
  } else if (!existsSync(dirname(filePath))) {
    mkdirSync(dirname(filePath), { recursive: true });
  }
  writeFileSync(filePath, Buffer.from(b64, 'base64'));
  return filePath;
}

function buildValue(result, model) {
  return {
    ok: true,
    model,
    size: result?.size,
    output_format: result?.output_format,
    usage: result?.usage ? {
      input_tokens: result.usage.input_tokens,
      output_tokens: result.usage.output_tokens,
      total_tokens: result.usage.total_tokens,
      images_count: result.usage.images_count,
    } : undefined,
  };
}

function renderResult(_args, value) {
  if (!value?.ok) {
    return [{ type: 'text', text: `❌ ${value?.error || '未知错误'}` }];
  }
  const lines = [`✅ SenseNova ${value.model} 生成完成${value.size ? `（${value.size}）` : ''}`];
  if (value.imagePath) lines.push(`已保存：${value.imagePath}`);
  if (value.imageUrl) lines.push(`图片 URL（24h 有效）：${value.imageUrl}`);
  if (value.imageDataUrl) lines.push(`Base64 图片数据已返回（${Math.round(value.imageDataUrl.length / 1024)} KB）。如需保存到文件，请用 savePath 参数重新生成。`);
  if (value.usage) lines.push(`Token：input ${value.usage.input_tokens ?? '?'} / output ${value.usage.output_tokens ?? '?'} / total ${value.usage.total_tokens ?? '?'}`);
  return [{ type: 'text', text: lines.join('\n') }];
}

const resultSchema = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    model: { type: 'string' },
    size: { type: 'string' },
    output_format: { type: 'string' },
    imageDataUrl: { type: 'string' },
    imageUrl: { type: 'string' },
    imagePath: { type: 'string' },
    usage: {
      type: 'object',
      properties: {
        input_tokens: { type: 'integer' },
        output_tokens: { type: 'integer' },
        total_tokens: { type: 'integer' },
        images_count: { type: 'integer' },
      },
      additionalProperties: true,
    },
    error: { type: 'string' },
  },
  additionalProperties: true,
};

const modelEnum = ['sensenova-u1.5-lite', 'sensenova-u1.5-fast'];

const text2imgParams = {
  type: 'object',
  properties: {
    prompt: { type: 'string', description: '图像生成描述（中文或英文）' },
    model: { type: 'string', enum: modelEnum, description: '默认使用插件配置的 defaultModel' },
    size: { type: 'string', description: '尺寸：auto / 2K / 4K 常量，或 WIDTHxHEIGHT（32 的倍数，512-4096，比例 ≤3:1）。建议：2048x2048、2720x1536（16:9）、1536x2720（9:16）' },
    output_format: { type: 'string', enum: ['png', 'jpeg', 'webp'], description: '输出格式，默认 png' },
    response_format: { type: 'string', enum: ['b64_json', 'url'], description: 'b64_json 返回 Base64；url 返回 24h 临时链接。默认 b64_json' },
    watermark: { type: 'boolean', description: '是否添加官方水印，默认取插件配置（出厂 true）' },
    prompt_extend: { type: 'boolean', description: '自动润色扩写 prompt，默认 true' },
    savePath: { type: 'string', description: '可选：将 Base64 结果保存为本地文件（完整文件路径或目录）' },
  },
  required: ['prompt'],
  additionalProperties: false,
};

const img2imgParams = {
  type: 'object',
  properties: {
    prompt: { type: 'string', description: '编辑指令（描述期望的最终画面）' },
    images: {
      type: 'array',
      description: '图片输入数组，每项 { image_url }。第 1 张为主编辑图，最多 5 张。image_url 支持公网 URL 或 data:image/png;base64,... Data URL（必须含完整前缀）',
      items: {
        type: 'object',
        properties: {
          image_url: { type: 'string', description: '公网 URL 或 Base64 Data URL' },
        },
        required: ['image_url'],
        additionalProperties: false,
      },
    },
    model: { type: 'string', enum: modelEnum, description: '默认使用插件配置的 defaultModel' },
    size: { type: 'string', description: 'auto（默认，适配主图）或 WIDTHxHEIGHT' },
    output_format: { type: 'string', enum: ['png', 'jpeg', 'webp'], description: '默认 png' },
    response_format: { type: 'string', enum: ['b64_json', 'url'], description: '默认 b64_json' },
    watermark: { type: 'boolean', description: '默认取插件配置' },
    prompt_extend: { type: 'boolean', description: '默认 true' },
    savePath: { type: 'string', description: '可选：保存路径（完整文件路径或目录）' },
  },
  required: ['prompt', 'images'],
  additionalProperties: false,
};

/** Build the two tool definitions. */
export function buildImageTools(config = {}) {
  const getBaseUrl = () => config.baseURL || DEFAULT_BASE_URL;
  const getDefaultModel = () => config.defaultModel || DEFAULT_MODEL;

  async function callImageApi(rawArgs, exec, endpoint) {
    exec?.signal?.throwIfAborted?.();
    const args = asRecord(rawArgs);
    if (typeof args.prompt !== 'string' || args.prompt.trim() === '') {
      throw new Error('prompt 不能为空');
    }
    const apiKey = resolveApiKey(config);
    if (!apiKey) return { ok: false, error: NO_KEY_ERROR };

    const model = typeof args.model === 'string' && args.model.trim() !== '' ? args.model.trim() : getDefaultModel();
    const body = {
      model,
      prompt: args.prompt.trim(),
      n: 1,
      watermark: args.watermark !== undefined ? args.watermark : (config.watermark ?? true),
    };
    body.size = typeof args.size === 'string' && args.size.trim() !== '' ? args.size.trim() : (config.defaultSize || undefined);
    if (!body.size) delete body.size;
    if (args.output_format) body.output_format = args.output_format;
    if (args.response_format) body.response_format = args.response_format;
    if (args.prompt_extend !== undefined) body.prompt_extend = args.prompt_extend;

    if (endpoint === '/images/edits') {
      if (!Array.isArray(args.images) || args.images.length === 0) {
        throw new Error('images 不能为空（至少 1 张参考图）');
      }
      body.images = args.images.map((img) => {
        const record = asRecord(img);
        if (typeof record.image_url !== 'string' || record.image_url.trim() === '') {
          throw new Error('images[] 每项必须包含非空 image_url');
        }
        return { image_url: record.image_url };
      });
    }

    let result;
    try {
      result = await postJson(getBaseUrl(), endpoint, apiKey, body);
    } catch (error) {
      exec?.signal?.throwIfAborted?.();
      return { ok: false, error: error.message || String(error) };
    }

    const data = result?.data?.[0];
    const value = buildValue(result, model);
    const format = result?.output_format || args.output_format || 'png';

    if (data?.b64_json) {
      value.imageDataUrl = `data:${MIME[format] || 'image/png'};base64,${data.b64_json}`;
      const target = args.savePath || config.outputDir;
      if (typeof target === 'string' && target.trim() !== '') {
        value.imagePath = saveImage(data.b64_json, target.trim(), format);
      }
    } else if (data?.url) {
      value.imageUrl = data.url;
    }
    return value;
  }

  return [
    {
      name: 'sensenova_text2img',
      description: '通过商汤 SenseNova U 系列模型生成图片（文生图）。支持 sensenova-u1.5-lite（质量优先）和 sensenova-u1.5-fast（速度优先）。返回 Base64 图片数据或 24 小时有效 URL，可用 savePath 保存为本地文件。中文：调用商汤图片生成接口，将文字描述生成图片；可指定尺寸、格式、水印、输出方式。',
      parameters: text2imgParams,
      output: { schema: resultSchema, render: renderResult },
      execute: (args, exec) => callImageApi(args, exec, '/images/generations'),
    },
    {
      name: 'sensenova_img2img',
      description: '通过商汤 SenseNova U 系列模型编辑图片（图生图 / 图片改写）。输入 1-5 张参考图（公网 URL 或 Base64 Data URL，必须含完整 data:image/*;base64, 前缀）+ 编辑指令，生成修改后的图片。中文：基于参考图进行图片编辑，可修改背景、风格、局部元素等。',
      parameters: img2imgParams,
      output: { schema: resultSchema, render: renderResult },
      execute: (args, exec) => callImageApi(args, exec, '/images/edits'),
    },
  ];
}

/** DSH plugin entry. */
export const name = 'dsh-sensenova-image';
export const inject = ['tools', 'connection'];
export const reusable = true;

export function apply(ctx, config = {}) {
  const disposers = [];

  // 可变配置视图：宿主侧工具用快照构建，设置页写入后工具调用时读取最新值。
  // config 由 DSH Loader 以 Volatile 引用传入（.volatile() 字段为惰性 ref），
  // 这里解包成普通对象并保持一份可变副本供 RPC 设置页写入。
  const live = resolveConfigObject(config);
  const hasApiKey = () => Boolean(
    (typeof live.apiKey === 'string' && live.apiKey.trim() !== '')
    || (process.env.SENSENOVA_API_KEY || '').trim() !== ''
  );

  try {
    for (const tool of buildImageTools(live)) {
      disposers.push(ctx.tools.register(tool));
    }
  } catch (error) {
    ctx.logger?.warn?.(`[dsh-sensenova-image] 工具注册失败：${error?.message || error}`);
  }

  // 设置页 RPC 桥（loopback）：Settings → SenseNova Image 一级入口读写配置
  try {
    disposers.push(installImageRpc(ctx, {
      getLiveConfig: () => live,
      writeLiveConfig: (updates) => { Object.assign(live, updates); },
      hasApiKey,
      log: ctx.logger?.info ? (m) => ctx.logger.info(m) : undefined,
    }) || (() => {}));
  } catch (error) {
    ctx.logger?.warn?.(`[dsh-sensenova-image] RPC 桥安装失败：${error?.message || error}`);
  }

  if (typeof ctx.on === 'function') {
    ctx.on('dispose', () => { for (const d of disposers) d(); });
  }
}

/** 把 DSH Loader 传入的 config（可能含 Volatile ref）解包为普通对象。 */
function resolveConfigObject(config) {
  if (config === null || typeof config !== 'object') return {};
  const out = {};
  for (const [key, value] of Object.entries(config)) {
    out[key] = value !== null && typeof value === 'object' && typeof value.get === 'function'
      ? value.get()
      : value;
  }
  return out;
}

export default { apply, name, inject };
