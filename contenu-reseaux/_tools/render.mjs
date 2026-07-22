// Render each HTML template in ../templates to a PNG at exact 2x resolution.
// Usage: node render.mjs           -> renders all posts in manifest
//        node render.mjs 07 12     -> renders only those post ids
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');            // contenu-reseaux/
const TPL = join(ROOT, 'templates');

const CHROME =
  'C:/Program Files/Google/Chrome/Application/chrome.exe';

const STORY = { w: 1080, h: 1920 };
const FEED  = { w: 1080, h: 1350 };

// id -> { file, out (folder), name (png basename), dim }
const MANIFEST = [
  { id: '01', tpl: '01-teaser.html',          out: '01_J-7_teaser',                 name: 'story.png', dim: STORY },
  { id: '02', tpl: '02-explication.html',      out: '02_J-3_explication',            name: 'story.png', dim: STORY },
  { id: '03', tpl: '03-countdown.html',        out: '03_H-12_countdown',             name: 'story.png', dim: STORY },
  { id: '04', tpl: '04-feed-4produits.html',   out: '04_J+1_feed_4produits',         name: 'post.png',  dim: FEED  },
  { id: '05', tpl: '05-story-general.html',     out: '05_J+1_story_general',          name: 'story.png', dim: STORY },
  { id: '06', tpl: '06-concours.html',          out: '06_J+3_concours',               name: 'story.png', dim: STORY },
  { id: '07', tpl: '07-propaganda.html',        out: '07_J+6_produit-propaganda',     name: 'story.png', dim: STORY },
  { id: '08', tpl: '08-racing.html',            out: '08_J+9_produit-racing',         name: 'story.png', dim: STORY },
  { id: '09', tpl: '09-bmw.html',               out: '09_J+12_produit-bmw',           name: 'story.png', dim: STORY },
  { id: '10', tpl: '10-pack.html',              out: '10_J+15_pack',                  name: 'story.png', dim: STORY },
  { id: '11', tpl: '11-concours-relance.html',  out: '11_J+18_concours-relance',      name: 'story.png', dim: STORY },
  { id: '12', tpl: '12-marlboro.html',          out: '12_J+22_produit-marlboro',      name: 'story.png', dim: STORY },
  { id: '13', tpl: '13-rappel-j5.html',         out: '13_J+25_rappel-j5',             name: 'story.png', dim: STORY },
  { id: '14', tpl: '14-rappel-j3.html',         out: '14_J+28_rappel-j3',             name: 'story.png', dim: STORY },
  { id: '15', tpl: '15-closing.html',           out: '15_J+30_closing',               name: 'post.png',  dim: FEED  },
];

const only = process.argv.slice(2);
const jobs = only.length ? MANIFEST.filter(m => only.includes(m.id)) : MANIFEST;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
});

for (const j of jobs) {
  const tplPath = join(TPL, j.tpl);
  if (!existsSync(tplPath)) { console.log(`SKIP ${j.id} (missing ${j.tpl})`); continue; }
  const outDir = join(ROOT, j.out);
  mkdirSync(outDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewport({ width: j.dim.w, height: j.dim.h, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(tplPath).href, { waitUntil: 'networkidle0', timeout: 60000 });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await new Promise(r => setTimeout(r, 350));
  const outPng = join(outDir, j.name);
  await page.screenshot({ path: outPng, type: 'png', clip: { x: 0, y: 0, width: j.dim.w, height: j.dim.h } });
  console.log(`OK   ${j.id} -> ${j.out}/${j.name}  (${j.dim.w*2}x${j.dim.h*2})`);
  await page.close();
}

await browser.close();
console.log('done.');
