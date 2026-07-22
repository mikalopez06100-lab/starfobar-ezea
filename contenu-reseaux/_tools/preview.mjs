// Web-optimized previews (JPEG, 1x) for the proposition phone mockups.
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TPL = join(ROOT, 'templates');
const OUT = join(ROOT, '_preview');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const JOBS = [
  { tpl: '04-feed-4produits.html', out: '04-feed.jpg',       w: 1080, h: 1350 },
  { tpl: '07-propaganda.html',     out: '07-propaganda.jpg', w: 1080, h: 1920 },
  { tpl: '06-concours.html',       out: '06-concours.jpg',   w: 1080, h: 1920 },
  { tpl: '15-closing.html',        out: '15-closing.jpg',    w: 1080, h: 1350 },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell',
  args: ['--no-sandbox','--force-color-profile=srgb','--hide-scrollbars'] });

for (const j of JOBS) {
  const page = await browser.newPage();
  await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 1.35 });
  await page.goto(pathToFileURL(join(TPL, j.tpl)).href, { waitUntil: 'networkidle0', timeout: 60000 });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: join(OUT, j.out), type: 'jpeg', quality: 82,
    clip: { x: 0, y: 0, width: j.w, height: j.h } });
  console.log('OK', j.out);
  await page.close();
}
await browser.close();
console.log('done.');
