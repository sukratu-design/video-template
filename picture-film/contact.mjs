// usage: node contact.mjs <film> [outdir = <film>/qa]
// Writes the three review sheets that the QA step looks at (see RUBRIC.md):
//   paintings.jpg  every raw painting side by side: one hand, one paper, one palette?
//   film-1.jpg ... three stills per beat (start, middle, end) with captions, title and closing
//   cover.jpg      the cover, if the film has one
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { filmArg, readContent, openFilm } from './lib/film.mjs';
const film = filmArg(process.argv[2]), F = readContent(film.dir);
const out = path.resolve(process.argv[3] || path.join(film.dir, 'qa'));
mkdirSync(out, { recursive: true });
const { page, close } = await openFilm(film);
const info = await page.evaluate(() => ({ scenes: window.scenes, lead: window.LEAD, duration: window.duration }));
// Forward-only list of times: start (after the dissolve), middle, end (before the dissolve) of each beat.
const shots = info.scenes.flatMap((s, i) => [s.start + 0.6, (s.start + s.end) / 2, s.end - 0.6].map((t, k) => ({ beat: i + 1, k, t: Math.min(info.duration - 0.05, t + info.lead) })));
const TILE = 400, LABEL = 26, save = (name, b64) => { writeFileSync(path.join(out, name), Buffer.from(b64, 'base64')); console.log('wrote', path.join(out, name)); };
const sheet = (tiles, cols) => page.evaluate(async ({ tiles, cols, TILE, LABEL }) => {
  const rows = Math.ceil(tiles.length / cols), c = document.createElement('canvas'); c.width = cols * TILE; c.height = rows * (TILE + LABEL);
  const x = c.getContext('2d'); x.fillStyle = '#1a1a1e'; x.fillRect(0, 0, c.width, c.height); x.font = '500 15px "IBM Plex Mono", monospace'; x.textBaseline = 'middle';
  for (let i = 0; i < tiles.length; i++) { const im = new Image(); im.src = tiles[i].src; await im.decode(); const px = (i % cols) * TILE, py = Math.floor(i / cols) * (TILE + LABEL);
    x.drawImage(im, px + 2, py + LABEL, TILE - 4, TILE - 4); x.fillStyle = '#e9e2d2'; x.fillText(tiles[i].label, px + 8, py + LABEL / 2 + 1); }
  return c.toDataURL('image/jpeg', 0.88).slice(23);
}, { tiles, cols, TILE, LABEL });
const grab = t => page.evaluate(t => { window.renderFrame(t); return document.getElementById('film').toDataURL('image/jpeg', 0.9); }, t);

const tiles = [];
for (const s of shots) tiles.push({ src: await grab(s.t), label: `beat ${s.beat} ${['start', 'mid', 'end'][s.k]}  ${s.t.toFixed(1)}s` });
const PER = 12; // 4 beats per sheet keeps each tile large enough to judge
for (let i = 0; i < tiles.length; i += PER) save(`film-${i / PER + 1}.jpg`, await sheet(tiles.slice(i, i + PER), 3));
const raw = await page.evaluate(dir => window.FILM.beats.map((b, i) => ({ src: new URL(dir + '/' + b.image, location.href).href, label: `painting ${i + 1}  ${b.image}` })), film.rel);
save('paintings.jpg', await sheet(raw, raw.length <= 6 ? 3 : raw.length <= 8 ? 4 : 5));
if (F.lead > 0 && F.cover) save('cover.jpg', await page.evaluate(async src => { const im = new Image(); im.src = src; await im.decode(); const c = document.createElement('canvas'); c.width = c.height = 1024; c.getContext('2d').drawImage(im, 0, 0, 1024, 1024); return c.toDataURL('image/jpeg', 0.9).slice(23); }, film.rel + '/' + F.cover));
await close();
console.log('\nNow LOOK at every sheet and answer the "Look" questions in RUBRIC.md, next to golden/accepted.jpg and golden/rejected.jpg.');
