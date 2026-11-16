// Shared helpers: locate a film folder, read its content.js/timing.js in Node, open the engine page in headless Chromium.
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Resolve a film argument ("films/my-film", "my-film" or an absolute path) to { dir, rel, slug }. */
export function filmArg(arg) {
  if (!arg) throw new Error('give the film folder, e.g. films/dussehra-diwali');
  let dir = [path.resolve(arg), path.resolve(ROOT, arg), path.resolve(ROOT, 'films', arg)].find(d => existsSync(path.join(d, 'content.js')));
  if (!dir) throw new Error(`no content.js found for film "${arg}"`);
  return { dir, rel: path.relative(ROOT, dir).split(path.sep).join('/'), slug: path.basename(dir) };
}

function evalWindow(file) {
  const w = {};
  vm.runInNewContext(readFileSync(file, 'utf8'), { window: w });
  return w;
}
export const readContent = dir => evalWindow(path.join(dir, 'content.js')).FILM;
export const readTiming = dir => (existsSync(path.join(dir, 'timing.js')) ? evalWindow(path.join(dir, 'timing.js')).TIMING : null);

/** Playwright (preinstalled in cloud sessions, or `npm i`), falling back to Puppeteer. Returns { page, close }. */
export async function openFilm(film, { params = '', viewport = { width: 1080, height: 1080 } } = {}) {
  const args = ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files']; // file access: or the JPEGs taint the canvas
  const require = createRequire(import.meta.url);
  let browser, page;
  const tryRequire = name => { for (const base of [import.meta.url, pathToFileURL('/opt/node-tools/').href]) { try { return createRequire(base)(name); } catch {} } try { return require(name); } catch { return null; } };
  const pw = tryRequire('playwright');
  if (pw) {
    browser = await pw.chromium.launch({ args });
    page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  } else {
    const pp = tryRequire('puppeteer');
    if (!pp) throw new Error('neither playwright nor puppeteer is installed: run `npm i` in picture-film/');
    browser = await pp.launch({ headless: true, args });
    page = await browser.newPage();
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  }
  page.on('pageerror', e => console.error('page error:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  const url = pathToFileURL(path.join(ROOT, 'index.html')).href + `?render=1&film=${encodeURIComponent(film.rel.startsWith('..') ? pathToFileURL(film.dir).href : film.rel)}${params}`;
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => window.ready, null, { timeout: 120000 });
  await page.evaluate(() => window.ready); // rejects with the page's error (missing frame, beat count mismatch)
  return { page, close: () => browser.close() };
}

export function run(cmd, args, opts = {}) {
  const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'], ...opts });
  return new Promise((res, rej) => { p.on('error', rej); p.on('close', c => (c === 0 ? res() : rej(new Error(`${cmd} exited ${c}`)))); });
}
export function audioSeconds(file) {
  if (!existsSync(file)) return null;
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return Number(r.stdout.trim()) || null;
}
