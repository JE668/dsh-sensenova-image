#!/usr/bin/env node
// Smoke test: call the plugin's executors directly to verify the SenseNova image APIs work.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';

// Load the plugin module directly
const moduleUrl = new URL('../lib/index.js', import.meta.url).href;
const plugin = await import(moduleUrl);
const tools = plugin.buildImageTools({});
const byName = Object.fromEntries(tools.map(t => [t.name, t]));

// Resolve API key the same way the plugin does
function findKey() {
  if (process.env.SENSENOVA_API_KEY) return process.env.SENSENOVA_API_KEY;
  const p = resolve(homedir(), '.dsh', '.credentials.yaml');
  const lines = readFileSync(p, 'utf8').split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*SENSENOVA_API_KEY:\s*(.+)$/);
    if (m) return m[1].trim();
  }
  throw new Error('no key found');
}

const key = findKey();
console.log(`Using API key: ${key.slice(0, 8)}... (${key.length} chars)`);

// --- Test 1: text2img ---
console.log('\n=== Test 1: sensenova_text2img (lite) ===');
const t1 = await byName.sensenova_text2img.execute(
  {
    prompt: '一只白色毛绒绒的海豹宝宝漂浮在平静海面上，柔和晨光，写实摄影风格',
    size: '1024x1024',
    watermark: false,
    response_format: 'b64_json',
    output_format: 'png',
  },
  {}
);
console.log('Result:', JSON.stringify({
  ok: t1.ok,
  model: t1.model,
  size: t1.size,
  hasB64: !!t1.imageDataUrl,
  b64Len: t1.imageDataUrl?.length,
  usage: t1.usage,
  error: t1.error,
}, null, 2));

if (t1.ok && t1.imageDataUrl) {
  // Save it
  const b64 = t1.imageDataUrl.split('base64,')[1];
  const outPath = resolve('./test-output/text2img-seal.png');
  const { writeFileSync, mkdirSync } = await import('node:fs');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`Saved to ${outPath}`);
}

// --- Test 2: img2img with a URL reference image ---
console.log('\n=== Test 2: sensenova_img2img (fast) ===');
const t2 = await byName.sensenova_img2img.execute(
  {
    prompt: '背景换成在一望无际的冰川上',
    model: 'sensenova-u1.5-fast',
    images: [{ image_url: 'https://www.sensenova.cn/images/little-seal.png' }],
    watermark: false,
    response_format: 'b64_json',
  },
  {}
);
console.log('Result:', JSON.stringify({
  ok: t2.ok,
  model: t2.model,
  size: t2.size,
  hasB64: !!t2.imageDataUrl,
  b64Len: t2.imageDataUrl?.length,
  usage: t2.usage,
  error: t2.error,
}, null, 2));

if (t2.ok && t2.imageDataUrl) {
  const b64 = t2.imageDataUrl.split('base64,')[1];
  const outPath = resolve('./test-output/img2img-seal.png');
  const { writeFileSync, mkdirSync } = await import('node:fs');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`Saved to ${outPath}`);
}

console.log('\n=== Done ===');
