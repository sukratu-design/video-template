// usage: node stills.mjs <film> <outdir> t1 t2 ...   PNG stills at those times (seconds, cover lead included), captions on.
// Add --guides to draw the title and caption zones.
import { mkdirSync, writeFileSync } from 'node:fs';
import { filmArg, openFilm } from './lib/film.mjs';
const argv = process.argv.slice(2).filter(a => !a.startsWith('--'));
const film = filmArg(argv[0]), out = argv[1];
if (!out) throw new Error('usage: node stills.mjs <film> <outdir> t1 t2 ...');
mkdirSync(out, { recursive: true });
const ts = argv.slice(2).map(Number).sort((a, b) => a - b);
const { page, close } = await openFilm(film, { params: process.argv.includes('--guides') ? '&guides=1' : '' });
for (const t of ts) {
  const d = await page.evaluate(t => { window.renderFrame(t); return document.getElementById('film').toDataURL('image/png').slice(22); }, t);
  writeFileSync(`${out}/t${t.toFixed(1).padStart(5, '0')}.png`, Buffer.from(d, 'base64'));
  console.log('t', t);
}
await close();
