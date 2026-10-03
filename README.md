# dsh-sensenova-image

[English](#english) | 中文

DeepSeek Harness 插件：把商汤 **SenseNova U 系列图片模型**（`sensenova-u1.5-lite` / `sensenova-u1.5-fast`）以 DSH 工具的形式接入，agent 可直接在对话中**文生图**和**图生图（图片编辑）**。

> 这两个模型不走 Chat Completions 接口（官方明确说明 U 系列不支持作为对话模型），而是独立的 `/v1/images/generations` 与 `/v1/images/edits` 同步接口，因此无法配置进 DSH 的模型列表 —— 本插件以工具方式解决。

## 功能

- **sensenova_text2img**：文生图。可指定模型、尺寸（auto / 2K / 4K / WIDTHxHEIGHT）、输出格式（png/jpeg/webp）、水印、prompt 自动润色、是否返回 Base64 或 24 小时临时 URL，并可直接保存为本地文件。
- **sensenova_img2img**：图片编辑。支持 1–5 张参考图（公网 URL 或 Base64 Data URL，需带完整 `data:image/*;base64,` 前缀）+ 编辑指令。

## 安装

从 npm（发布后）：

```sh
dsh plugin --profile desktop add dsh-sensenova-image
```

或从 GitHub / 本地源码：

```sh
dsh plugin --profile desktop add github:JE668/dsh-sensenova-image
# 本地目录
dsh plugin --profile desktop add file:/path/to/dsh-sensenova-image
```

安装后刷新或重启 DSH 即可，无需额外操作。

## 设置

打开 **设置 → Plugins（插件）→ Plugin configuration（插件配置）→ dsh-sensenova-image**，本插件的设置表单由 DSH 根据插件的 Config schema 自动生成：

| 设置项 | 说明 | 默认值 |
|---|---|---|
| `apiKey` | SenseNova API Key（`sk-…`，密码框）。**留空**时依次尝试环境变量 `SENSENOVA_API_KEY` 与凭据中心 `~/.dsh/.credentials.yaml` | 空 |
| `baseURL` | API 基础地址 | `https://token.sensenova.cn/v1` |
| `defaultModel` | 默认模型（调用时可用 `model` 参数覆盖） | `sensenova-u1.5-lite` |
| `watermark` | 默认是否添加官方水印（公测期间去水印免费） | `true` |
| `defaultSize` | 默认图片尺寸 | `2048x2048` |
| `outputDir` | 图片默认保存目录；留空则仅在工具调用指定 `savePath` 时写文件 | 空 |

### 获取 API Key

在 [SenseNova 控制台](https://platform.sensenova.cn/) 的 Token Plan 中申请。

## 工具参数速查

**sensenova_text2img**

| 参数 | 必填 | 说明 |
|---|---|---|
| `prompt` | ✅ | 图像描述（中/英文） |
| `model` | — | `sensenova-u1.5-lite` / `sensenova-u1.5-fast` |
| `size` | — | `2048x2048`、`2720x1536`（16:9）、`1536x2720`（9:16）等；32 的倍数，512–4096，比例 ≤3:1 |
| `output_format` | — | `png` / `jpeg` / `webp` |
| `response_format` | — | `b64_json`（默认）/ `url`（24h 有效） |
| `watermark` | — | 默认取插件配置 |
| `prompt_extend` | — | prompt 自动润色，默认 `true` |
| `savePath` | — | 保存为本地文件（完整路径或目录） |

**sensenova_img2img** 额外必填 `images`：`[{ "image_url": "<公网 URL 或 Data URL>" }]`，最多 5 张，第 1 张为主编辑图。

## 使用限制（来自官方文档）

- 图片编辑必须传入至少一张输入图片。
- `url` 返回的链接 24 小时后失效。
- Base64 传入必须带完整 `data:image/{format};base64,` 前缀；无效图片会被直接拒绝。

## 本地验证 smoke test

```sh
node scripts/smoke-test.js   # 需先在 ~/.dsh/.credentials.yaml 或环境变量配置 SENSENOVA_API_KEY
```

## License

MIT

---

## English

**dsh-sensenova-image** is a DeepSeek Harness plugin that exposes SenseTime's **SenseNova U-series image models** (`sensenova-u1.5-lite` / `sensenova-u1.5-fast`) as DSH tools, so the agent can generate and edit images inline.

These models do **not** speak Chat Completions — they are synchronous `/v1/images/generations` and `/v1/images/edits` endpoints — so they cannot be added to DSH's model list. This plugin bridges that gap as tools.

### Install

```sh
dsh plugin --profile desktop add dsh-sensenova-image
# or from source:
dsh plugin --profile desktop add github:JE668/dsh-sensenova-image
```

### Settings

Open **Settings → Plugins → Plugin configuration → dsh-sensenova-image**. The form is rendered automatically from the plugin's config schema:

| Field | Description | Default |
|---|---|---|
| `apiKey` | SenseNova API key (secret input). Falls back to `SENSENOVA_API_KEY` env var, then `~/.dsh/.credentials.yaml` | empty |
| `baseURL` | API base URL | `https://token.sensenova.cn/v1` |
| `defaultModel` | Default model (overridable per call) | `sensenova-u1.5-lite` |
| `watermark` | Add official watermark by default | `true` |
| `defaultSize` | Default image size | `2048x2048` |
| `outputDir` | Default directory to save images | empty |

### Tools

- **sensenova_text2img**(prompt, model?, size?, output_format?, response_format?, watermark?, prompt_extend?, savePath?)
- **sensenova_img2img**(prompt, images[{image_url}], model?, size?, ..., savePath?)

### License

MIT
