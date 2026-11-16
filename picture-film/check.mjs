// usage: node check.mjs <film>
// The measurable half of RUBRIC.md. FAIL blocks a final render; WARN must be read and either fixed or justified
// in the film's brief. Passing this does not mean the film is good: the "Look" half of the rubric still applies.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { filmArg, readContent, readTiming, openFilm, audioSeconds } from './lib/film.mjs';
const film = filmArg(process.argv[2]), F = readContent(film.dir), T = readTiming(film.dir);
const out = { FAIL: [], WARN: [], ok: [] };
const fail = m => out.FAIL.push(m), warn = m => out.WARN.push(m), ok = m => out.ok.push(m);
const words = s => s.trim().split(/\s+/).length;
const N = F.beats.length;

// ---- content ----
if (!F.title?.text) fail('no title'); 
if (N < 3) fail('fewer than 3 beats'); else if (N > 12) warn(`${N} beats: past 12 the film stops being one idea; cut or split`);
F.beats.forEach((b, i) => {
  const n = i + 1;
  if (!b.image || !existsSync(path.join(film.dir, b.image))) fail(`beat ${n}: painting ${b.image} is missing`);
  if (!b.why || b.why.trim().length < 8) fail(`beat ${n}: cam has no "why". Say what the move is for, or change the move`);
  if (!b.lines?.length) fail(`beat ${n}: no narration`);
  (b.lines || []).forEach(l => {
    l.captions.forEach(c => { if (/[ऀ-ॿ]/.test(c)) fail(`beat ${n}: Devanagari in a caption ("${c.slice(0, 30)}"): captions use Latin spelling, only "say" uses Devanagari`); if (/—|--/.test(c)) warn(`beat ${n}: dash in caption "${c.slice(0, 40)}": use a comma or a full stop`); });
    const w = words(l.captions.join(' ')); if (w > 34) warn(`beat ${n}: a ${w}-word line. One painting cannot hold that much; split the beat or cut`);
    if (l.say && Math.abs(words(l.say) - w) > 2) warn(`beat ${n}: "say" and captions differ by more than 2 words: the caption must be what is spoken`);
  });
});
// ---- camera ----
const eff = (z, v) => Math.min(1 - .5 / z, Math.max(.5 / z, v)); // focus after clamping to the painting
let prevDir = 0, runLen = 0;
F.beats.forEach((b, i) => {
  const n = i + 1, c = b.cam; if (!c?.from || !c?.to) return fail(`beat ${n}: no cam`);
  const [z0, x0, y0] = c.from, [z1, x1, y1] = c.to, zmax = b.journey ? 1.7 : 1.16;
  if (Math.min(z0, z1) < 1) fail(`beat ${n}: zoom below 1 shows outside the painting`);
  if (Math.max(z0, z1) > zmax) fail(`beat ${n}: zoom ${Math.max(z0, z1)} is over ${zmax}. Past that the pen line goes soft${b.journey ? '' : ' (journey:true allows up to 1.7 for maps and routes)'}`);
  if (!T) return;
  const d = T.beats[i + 1] - T.beats[i];
  const pan = Math.hypot((eff(z1, x1) * z1 - eff(z0, x0) * z0), (eff(z1, y1) * z1 - eff(z0, y0) * z0)) * 1080, dz = Math.abs(z1 - z0);
  const zr = dz / d * 100, pr = pan / d;
  if (dz < .03 && pan < 40) warn(`beat ${n}: the camera hardly moves (zoom ${dz.toFixed(2)}, ${pan.toFixed(0)} px). A still painting reads as a slideshow`);
  if (!b.journey && zr > 2.4) warn(`beat ${n}: zoom changes ${zr.toFixed(1)}%/s (keep under 2.4). The move should be felt, not noticed`);
  if (!b.journey && pr > 45) warn(`beat ${n}: camera travels ${pr.toFixed(0)} px/s (keep under 45)`);
  if (b.journey && (zr > 7 || pr > 110)) warn(`beat ${n}: journey move is fast (${zr.toFixed(1)}%/s, ${pr.toFixed(0)} px/s)`);
  const dir = Math.sign(z1 - z0); runLen = dir && dir === prevDir ? runLen + 1 : 1; prevDir = dir;
  if (runLen === 4) warn(`beats ${n - 3}-${n}: four ${dir > 0 ? 'push-ins' : 'pull-backs'} in a row. Alternate pushes, pull-backs and pans`);
});
if (F.beats.at(-1).cam && F.beats.at(-1).cam.to[0] > 1.03) warn('last beat ends zoomed in: the film should come to rest on the whole painting (to zoom 1.0)');
// ---- timing ----
if (!T) fail('no timing.js: run voiceover/vo.mjs (estimate, then takes and build)');
else {
  if (T.estimated) fail('timing.js is an estimate: generate the voiceover (vo.mjs takes, then build) before a final render');
  if (T.beats.length !== N + 1) fail(`timing.js has ${T.beats.length - 1} beats but content.js has ${N}: re-run vo.mjs build`);
  const total = T.film + (F.lead || 0);
  if (total > 100) warn(`film is ${total}s: these hold attention to about 90 s`); else if (total < 20) warn(`film is only ${total}s`);
  T.beats.slice(1).forEach((b, i) => { const d = b - T.beats[i], last = i === N - 1;
    if (d < 4.5) warn(`beat ${i + 1} is ${d.toFixed(1)}s: under 4.5 s a detailed painting cannot be read`);
    if (d > (last ? 17 : 12)) warn(`beat ${i + 1} is ${d.toFixed(1)}s on one painting: over ${last ? 17 : 12} s it drags; split it into two paintings`); });
  T.cues.forEach((c, i) => { const d = c[1] - c[0], cps = c[2].length / d;
    if (i && c[0] < T.cues[i - 1][1] - 1e-6) fail(`cue ${i} overlaps the one before`);
    if (d < 1.1) warn(`caption "${c[2].slice(0, 30)}" shows for ${d.toFixed(1)}s: too short to read; merge it with its neighbour`);
    if (cps > 19) warn(`caption "${c[2].slice(0, 30)}" needs ${cps.toFixed(0)} characters/s (keep under 19): split it or slow the line`); });
  const said = T.cues.reduce((a, c) => a + words(c[2]), 0), speech = T.cues.reduce((a, c) => a + c[1] - c[0], 0);
  ok(`${N} beats, ${said} words, ${total}s (${Math.round(said / speech * 60)} wpm while speaking)`);
  const flat = F.beats.flatMap(b => b.lines.flatMap(l => l.captions)); if (flat.join('|') !== T.cues.map(c => c[2]).join('|')) fail('captions in content.js and timing.js differ: re-run vo.mjs build');
}
// ---- audio ----
const vo = audioSeconds(path.join(film.dir, 'vo.mp3')), music = audioSeconds(path.join(film.dir, 'music.mp3'));
if (!vo) fail('no vo.mp3'); else if (T && vo > T.film + .2) fail(`vo.mp3 (${vo.toFixed(1)}s) is longer than the film (${T.film}s)`);
if (!music) warn('no music.mp3: generate a score (see README "Score"). Do not synthesize one in code; that was tried and rejected');
else if (T && music < T.film - 6) warn(`music.mp3 (${music.toFixed(0)}s) ends ${(T.film - music).toFixed(0)}s before the film does`);
if (F.lead > 0 && !(F.cover && existsSync(path.join(film.dir, F.cover)))) fail('lead > 0 but the cover image is missing: run cover.mjs');
// ---- paintings and captions, measured in the page ----
if (!out.FAIL.some(m => /missing|no cam|timing/.test(m))) {
  const { page, close } = await openFilm(film);
  const frames = await page.evaluate(() => window.frameReport()), caps = await page.evaluate(() => window.captionReport());
  await close();
  const lum = c => .3 * c[0] + .59 * c[1] + .11 * c[2];
  frames.forEach((f, i) => { const n = i + 1;
    if (f.w !== f.h) fail(`painting ${n} is ${f.w}x${f.h}, not square`); else if (f.w < 1600) warn(`painting ${n} is only ${f.w}px: generate at 2K so zooms stay sharp`);
    if (lum(f.corner.rgb) < 150) warn(`painting ${n}: the top edge is dark (not bare paper). Every painting sits on the same cream sheet`);
    if (f.bottom.sd > 38) warn(`painting ${n}: the bottom 15% is busy (contrast ${f.bottom.sd.toFixed(0)}). Captions sit there; ask for bare paper at the bottom`); });
  const titleBeats = [[0, 'title'], [N - 1, 'closing line']]; for (const [i, what] of titleBeats) if (frames[i] && frames[i].top.sd > 30) warn(`painting ${i + 1}: the top 12% is busy (contrast ${frames[i].top.sd.toFixed(0)}) but the ${what} is drawn there; ask for ~20% bare paper at the top`);
  const papers = frames.map(f => lum(f.corner.rgb)), med = [...papers].sort((a, b) => a - b)[papers.length >> 1];
  papers.forEach((p, i) => { if (Math.abs(p - med) > 40 && !F.beats[i].journey) warn(`painting ${i + 1}: paper tone differs from the others (edge brightness ${p.toFixed(0)} vs ${med.toFixed(0)}): re-roll it`); });
  caps.forEach(c => { if (c.lines > 2) fail(`caption "${c.text.slice(0, 40)}" wraps to ${c.lines} lines: shorten it`); else if (c.size < 54) warn(`caption "${c.text.slice(0, 40)}" only fits at the small size: shorten it`); });
  ok(`paintings: ${frames.map(f => f.w).join(' ')} px; bottom contrast ${frames.map(f => f.bottom.sd.toFixed(0)).join(' ')}; top contrast ${frames.map(f => f.top.sd.toFixed(0)).join(' ')}`);
}
for (const k of ['ok', 'WARN', 'FAIL']) for (const m of out[k]) console.log(k.padEnd(5), m);
console.log(`\n${out.FAIL.length} FAIL, ${out.WARN.length} WARN.` + (out.FAIL.length ? '' : ' Measurable checks pass. Now do the "Look" half of RUBRIC.md with contact.mjs.'));
process.exit(out.FAIL.length ? 1 : 0);
