// Voiceover pipeline in one script. The voice drives the timing, never the reverse.
//   node voiceover/vo.mjs <film> estimate         timing.js from word counts (no API calls), to preview and budget length
//   node voiceover/vo.mjs <film> takes [i,j,...]  3 Sarvam takes per line into <film>/voiceover/takes/  (optional: only those line numbers)
//   node voiceover/vo.mjs <film> build            transcribe + pick takes, assemble <film>/vo.mp3, write <film>/timing.js
//                                                  (--no-stt skips the transcription check)
// Line numbers count every lines[] entry across beats, from 0. To override the automatic pick, write
// <film>/voiceover/picks.json as {"3": 2, "7": 0} (line -> take) and build again.
// Key: SARVAM_API_KEY in the environment, or ~/.sarvam.env. Never commit or paste it.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { filmArg, readContent } from '../lib/film.mjs';

const [filmA, cmd, extra] = process.argv.slice(2);
const film = filmArg(filmA), F = readContent(film.dir);
const V = { model: 'bulbul:v4-flash', speaker: 'shubh_en_narration', pace: 1.0, temperature: 0.35, ...(F.voice || {}) };
const takesDir = path.join(film.dir, 'voiceover', 'takes');
const TAKES = 3, SR = 48000, FR = 480;
// Layout constants (seconds). These reproduce the pacing of the locked Dussehra film.
const START = 0.5, BREATH = 0.6, LINE_GAP = 0.5, BEAT_LEAD = 0.2, CUE_TAIL = 0.25, TAIL = 3.3, SENTENCE_PAUSE = 0.38, EST_WPM = 132;

const lines = []; // flat list of {beat, say, captions}
F.beats.forEach((b, bi) => (b.lines || []).forEach(l => lines.push({ beat: bi, say: l.say || l.captions.join(' '), captions: l.captions, hold: 0 })));
F.beats.forEach((b, bi) => { if (!b.lines?.length) throw new Error(`beat ${bi + 1} has no lines`); const last = lines.filter(l => l.beat === bi).at(-1); last.hold = b.hold || 0; });
const words = s => s.trim().split(/\s+/).length;

function layout(durs, pauses) { // durs[i] seconds of speech per line -> beats, cues, starts
  const starts = []; let t = START;
  lines.forEach((l, i) => { if (i > 0) t += (l.beat !== lines[i - 1].beat ? BREATH : LINE_GAP) + lines[i - 1].hold; starts.push(+t.toFixed(2)); t += durs[i]; });
  const lastEnd = starts.at(-1) + durs.at(-1);
  const filmLen = Math.ceil((lastEnd + TAIL + lines.at(-1).hold) * 2) / 2;
  const beats = F.beats.map((_, bi) => (bi === 0 ? 0 : +(starts[lines.findIndex(l => l.beat === bi)] - BEAT_LEAD).toFixed(2)));
  beats.push(filmLen);
  const cues = [];
  lines.forEach((l, i) => {
    const d = durs[i], chars = l.captions.map(c => c.replace(/\s/g, '').length), tot = chars.reduce((a, b) => a + b, 0);
    const cut = []; let acc = 0;
    for (const c of chars.slice(0, -1)) { // split captions at the detected pause nearest the proportional point
      acc += c; const est = acc / tot * d;
      const near = (pauses?.[i] || []).reduce((b, q) => (b === null || Math.abs(q - est) < Math.abs(b - est) ? q : b), null);
      cut.push(near !== null && Math.abs(near - est) < 0.6 ? near : est);
    }
    const s = [starts[i], ...cut.map(q => starts[i] + q)];
    const next = i < lines.length - 1 ? starts[i + 1] : filmLen - 0.3;
    const e = [...s.slice(1), Math.min(starts[i] + d + CUE_TAIL, next - 0.05)];
    l.captions.forEach((c, k) => cues.push([+s[k].toFixed(2), +e[k].toFixed(2), c]));
  });
  return { starts, beats, cues, filmLen };
}
function writeTiming(L, note, estimated) {
  const body = `/* ${note}\n   Written by voiceover/vo.mjs. Do not hand-edit: change content.js and run it again. */\nwindow.TIMING = {\n` +
    (estimated ? '  estimated: true,\n' : '') + `  film: ${L.filmLen},\n  beats: ${JSON.stringify(L.beats)},\n  cues: [\n` +
    L.cues.map(c => '    ' + JSON.stringify(c)).join(',\n') + '\n  ]\n};\n';
  fs.writeFileSync(path.join(film.dir, 'timing.js'), body);
}
function report(L, durs, extraCols = () => '') {
  console.log('line beat  start    end   sec  wpm  text');
  lines.forEach((l, i) => console.log(String(i).padStart(4), String(l.beat + 1).padStart(4), L.starts[i].toFixed(2).padStart(6), (L.starts[i] + durs[i]).toFixed(2).padStart(6),
    durs[i].toFixed(1).padStart(5), String(Math.round(words(l.captions.join(' ')) / durs[i] * 60)).padStart(4), extraCols(i), ' ' + l.captions.join(' ').slice(0, 60)));
  const lead = F.lead || 0, total = lines.reduce((a, l) => a + words(l.captions.join(' ')), 0);
  console.log(`\n${total} words, film ${L.filmLen}s + ${lead}s cover = ${L.filmLen + lead}s. Beat lengths: ${L.beats.slice(1).map((b, i) => (b - L.beats[i]).toFixed(1)).join(' ')}`);
}

// ---- audio helpers (port of the earlier measure.py / assemble.py) ----
function load(file) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error('ffmpeg could not read ' + file);
  return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength >> 2).slice();
}
function mask(x) { const n = Math.floor(x.length / FR), m = new Uint8Array(n); for (let i = 0; i < n; i++) { let s = 0; for (let k = i * FR; k < (i + 1) * FR; k++) s += x[k] * x[k]; m[i] = 10 * Math.log10(s / FR + 1e-12) < -40 ? 1 : 0; } return m; }
function runs(m) { const o = []; for (let i = 0; i < m.length;) { if (m[i]) { let j = i; while (j < m.length && m[j]) j++; o.push([i, j]); i = j; } else i++; } return o; }
function processTake(x) { // trim the ends, shorten long inner pauses to SENTENCE_PAUSE
  let m = mask(x); const idx = []; m.forEach((v, i) => { if (!v) idx.push(i); });
  if (!idx.length) throw new Error('silent take');
  const a = Math.max(0, idx[0] - 3), b = Math.min(m.length, idx.at(-1) + 4);
  x = x.subarray(a * FR, b * FR); m = m.subarray(a, b);
  const segs = []; let pos = 0; const keep = Math.round(SENTENCE_PAUSE * SR);
  for (const [i, j] of runs(m)) { if (i === 0 || j === m.length) continue; if ((j - i) * FR / SR > 0.45) { segs.push(x.subarray(pos, i * FR + (keep >> 1))); pos = j * FR - (keep >> 1); } }
  segs.push(x.subarray(pos));
  const out = new Float32Array(segs.reduce((n, s) => n + s.length, 0)); let o = 0; for (const s of segs) { out.set(s, o); o += s.length; }
  return out;
}
const pausesOf = x => { const m = mask(x); return runs(m).filter(([a, b]) => a > 0 && b < m.length && (b - a) * FR / SR >= 0.3).map(([a, b]) => (a + b) / 2 * FR / SR); };

const sarvamKey = () => {
  const key = (process.env.SARVAM_API_KEY || (fs.existsSync(process.env.HOME + '/.sarvam.env') ? (fs.readFileSync(process.env.HOME + '/.sarvam.env', 'utf8').match(/SARVAM_API_KEY=(.+)/) || [])[1] : '') || '').trim();
  if (!key) throw new Error('SARVAM_API_KEY missing (environment variable or ~/.sarvam.env)');
  return key;
};
// Speech-to-text stands in for ears: a take that drops or garbles a word shows up in its transcript.
// (The first trial's median-length pick chose garbled takes on 2 of 4 lines; transcripts caught both.)
async function transcribe(file) { // one take at a time: the API rejects audio over 30 s
  const fd = new FormData();
  fd.append('file', new Blob([fs.readFileSync(file)], { type: 'audio/mpeg' }), path.basename(file));
  fd.append('model', 'saarika:v2.5'); fd.append('language_code', 'en-IN');
  const r = await fetch('https://api.sarvam.ai/speech-to-text', { method: 'POST', headers: { 'api-subscription-key': sarvamKey() }, body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || typeof j.transcript !== 'string') throw new Error(r.status + ' ' + JSON.stringify(j).slice(0, 200));
  return j.transcript;
}
const tokens = s => s.toLowerCase().replace(/(\d+)(st|nd|rd|th)\b/g, '$1').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
function similarity(a, b) { // share of words in common (order ignored), 0..1
  const A = tokens(a), B = tokens(b), left = [...B]; let hit = 0;
  for (const w of A) { const k = left.indexOf(w); if (k >= 0) { hit++; left.splice(k, 1); } }
  return A.length + B.length ? 2 * hit / (A.length + B.length) : 0;
}

if (cmd === 'estimate') {
  const durs = lines.map(l => words(l.captions.join(' ')) / EST_WPM * 60 + 0.38 * Math.max(0, (l.captions.join(' ').match(/[.?!]/g) || []).length - 1));
  const L = layout(durs);
  writeTiming(L, `ESTIMATED from word counts at ${EST_WPM} wpm. Real takes usually run longer; the final timing comes from "build".`, true);
  report(L, durs);
  console.log('\ntiming.js written (estimated). Stills and camera previews work; render.mjs will refuse it for a final.');
} else if (cmd === 'takes') {
  const key = sarvamKey();
  fs.mkdirSync(takesDir, { recursive: true });
  const only = extra ? extra.split(',').map(Number) : lines.map((_, i) => i);
  const tts = async (text, out) => {
    const r = await fetch('https://api.sarvam.ai/text-to-speech', { method: 'POST', headers: { 'api-subscription-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: V.lang || 'en-IN', model: V.model, speaker: V.speaker, pace: V.pace, temperature: V.temperature, speech_sample_rate: 24000, output_audio_codec: 'mp3' }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.audios) throw new Error(r.status + ' ' + JSON.stringify(j).slice(0, 200));
    fs.writeFileSync(out, Buffer.from(j.audios.join(''), 'base64'));
  };
  const jobs = only.flatMap(i => Array.from({ length: TAKES }, (_, t) => [i, t]));
  let failed = 0;
  const worker = async () => { for (let job; (job = jobs.shift());) { const [i, t] = job; let ok = false;
    for (let k = 0; k < 3 && !ok; k++) { try { await tts(lines[i].say, path.join(takesDir, `l${i}_t${t}.mp3`)); ok = true; } catch (e) { console.log('retry', i, t, e.message.slice(0, 120)); await new Promise(r => setTimeout(r, 1500 * (k + 1))); } }
    if (!ok) failed++; else console.log(`line ${i} take ${t}`); } };
  await Promise.all(Array.from({ length: 4 }, worker));
  if (failed) { console.error(`${failed} takes failed`); process.exit(1); }
  console.log('takes done. Next: node voiceover/vo.mjs ' + film.rel + ' build');
} else if (cmd === 'build') {
  const picksFile = path.join(film.dir, 'voiceover', 'picks.json');
  const picks = fs.existsSync(picksFile) ? JSON.parse(fs.readFileSync(picksFile, 'utf8')) : {};
  const chosen = [], info = [], heard = [];
  const useStt = !process.argv.includes('--no-stt');
  const cacheFile = path.join(takesDir, 'transcripts.json');
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i], want = l.captions.join(' ');
    const takes = [];
    for (let t = 0; t < TAKES; t++) {
      const f = path.join(takesDir, `l${i}_t${t}.mp3`); if (!fs.existsSync(f)) continue;
      const k = { t, x: processTake(load(f)), text: null, score: 1 };
      if (useStt) {
        const id = `l${i}_t${t}:${fs.statSync(f).size}`;
        try { k.text = cache[id] ?? (cache[id] = await transcribe(f)); k.score = similarity(want, k.text); }
        catch (e) { console.log(`transcription failed for line ${i} take ${t}: ${e.message.slice(0, 100)}`); }
      }
      takes.push(k);
    }
    if (!takes.length) throw new Error(`no takes for line ${i}: run "takes" first`);
    // Pick: the take whose transcript is closest to the caption text; among near-equals, the median length
    // (the short one is usually rushed or dropped a word, the long one drags).
    const best = Math.max(...takes.map(k => k.score));
    const pool = takes.filter(k => k.score >= best - 0.03).sort((a, b) => a.x.length - b.x.length);
    const pick = picks[i] !== undefined ? takes.find(k => k.t === picks[i]) : pool[Math.floor((pool.length - 1) / 2 + 0.5)];
    if (!pick) throw new Error(`picks.json asks for take ${picks[i]} of line ${i}, which does not exist`);
    chosen.push(pick.x); heard.push(pick);
    info.push(takes.map(k => (k.x.length / SR).toFixed(1) + (k.t === pick.t ? '*' : ' ')).join(' '));
    if (useStt) { console.log(`line ${i} wanted: ${want}`); takes.forEach(k => console.log(`   take ${k.t}${k.t === pick.t ? '*' : ' '} ${(k.score * 100).toFixed(0).padStart(3)}%  ${k.text ?? '(no transcript)'}`)); }
  }
  if (useStt) { fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 1)); console.log(''); }
  const durs = chosen.map(x => x.length / SR), L = layout(durs, chosen.map(pausesOf));
  const mix = new Float32Array(Math.round(L.filmLen * SR));
  chosen.forEach((x, i) => { const s = Math.round(L.starts[i] * SR); for (let k = 0; k < x.length && s + k < mix.length; k++) mix[s + k] += x[k]; });
  const pcm = Buffer.alloc(mix.length * 2); let peak = 0;
  for (let i = 0; i < mix.length; i++) { const v = Math.max(-1, Math.min(1, mix[i])); peak = Math.max(peak, Math.abs(v)); pcm.writeInt16LE(Math.round(v * 32767), i * 2); }
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 's16le', '-ar', String(SR), '-ac', '1', '-i', '-', '-b:a', '192k', path.join(film.dir, 'vo.mp3')], { input: pcm, maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error('ffmpeg failed writing vo.mp3: ' + r.stderr);
  writeTiming(L, `Measured from the voiceover (${V.speaker}), ${new Date().toISOString().slice(0, 10)}.`, false);
  report(L, durs, i => '  takes ' + info[i]);
  const bad = lines.map((l, i) => [i, Math.round(words(l.captions.join(' ')) / durs[i] * 60)]).filter(([i, w]) => words(lines[i].captions.join(' ')) >= 8 && (w < 105 || w > 170)); // short lines measure unreliably
  if (bad.length) console.log('\nPACE WARNING (the accepted film runs 110-165 wpm per line): ' + bad.map(([i, w]) => `line ${i} at ${w} wpm`).join(', ') + '. Re-take those lines or reword; do not speed audio up.');
  const doubtful = heard.map((k, i) => [i, k.score]).filter(([, sc]) => useStt && sc < 0.8);
  if (doubtful.length) console.log('\nTRANSCRIPT WARNING: ' + doubtful.map(([i, sc]) => `line ${i} (${(sc * 100).toFixed(0)}% match)`).join(', ') + '. Read the transcripts above: re-take the line, or respell the hard word in "say". Indic names are often transcribed differently and can be fine; missing or wrong English words are not.');
  console.log(`\npeak ${peak.toFixed(2)}. vo.mp3 and timing.js written. * marks the take used. Transcripts are a stand-in, not ears: a person must listen to vo.mp3 before the render (pronunciation, pace).`);
} else {
  console.log('usage: node voiceover/vo.mjs <film> estimate | takes [lines] | build');
  process.exit(1);
}
