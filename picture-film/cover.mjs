// usage: node cover.mjs <film> [beat number = last] [titleY = 0.115]
// Draws the film title on one of the paintings and writes <film>/frames/cover.jpg (2048x2048).
// Pick a painting with bare paper across the top; the cover is frame 0 of the video, so it becomes the upload thumbnail.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { filmArg, readContent, openFilm } from './lib/film.mjs';
const film = filmArg(process.argv[2]), F = readContent(film.dir);
const n = Number(process.argv[3]) || F.beats.length, TY = Number(process.argv[4] || 0.115);
const src = path.join(film.dir, F.beats[n - 1].image);
const img = 'data:image/' + (src.endsWith('.png') ? 'png' : 'jpeg') + ';base64,' + readFileSync(src).toString('base64');
const { page, close } = await openFilm(film); // the engine page has the fonts loaded
const b64 = await page.evaluate(async ({ img, TY, title, sub }) => {
  const im = new Image(); im.src = img; await im.decode();
  const c = document.createElement('canvas'); c.width = c.height = 2048; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 2048, 2048);
  const g = x.createLinearGradient(0, 0, 0, TY * 2048 * 2.1); g.addColorStop(0, 'rgba(238,226,202,.9)'); g.addColorStop(.65, 'rgba(238,226,202,.55)'); g.addColorStop(1, 'rgba(238,226,202,0)');
  x.fillStyle = g; x.fillRect(0, 0, 2048, TY * 2048 * 2.1);
  const fit = (s, size, max) => { x.font = `${size}px "Pinyon Script"`; const w = x.measureText(s).width; if (w > max) x.font = `${Math.floor(size * max / w)}px "Pinyon Script"`; };
  x.textAlign = 'center'; x.fillStyle = '#2A1C14'; fit(title, 204, 1860); x.fillText(title, 1024, TY * 2048 + 40);
  if (sub) { x.fillStyle = '#6A4426'; fit(sub, 88, 1700); x.fillText(sub, 1024, TY * 2048 + 150); }
  return c.toDataURL('image/jpeg', 0.92).slice(23);
}, { img, TY, title: F.title.text, sub: F.title.sub });
await close();
const out = path.join(film.dir, F.cover || 'frames/cover.jpg');
writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('wrote', out, '(look at it before rendering)');
