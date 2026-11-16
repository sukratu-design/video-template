// Frame-accurate render: engine page -> PNG frames -> ffmpeg, then mux voiceover + score.
// usage: node render.mjs <film> [output.mp4]
//   env FRAMES=N START=sec STEP=n  -> short sample (N frames from START, every n-th frame), for quick tests
//   --draft  skips the check.mjs gate (never deliver a draft)
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { ROOT, filmArg, openFilm, run } from './lib/film.mjs';

const argv = process.argv.slice(2).filter(a => !a.startsWith('--'));
const draft = process.argv.includes('--draft');
const film = filmArg(argv[0]);
const out = path.resolve(argv[1] || path.join(film.dir, `${film.slug}.mp4`));
const sample = !!process.env.FRAMES;
const FPS = 30;

if (!draft && !sample) {
  const c = spawnSync('node', [path.join(ROOT, 'check.mjs'), film.dir], { stdio: 'inherit' });
  if (c.status !== 0) { console.error('\ncheck.mjs failed: fix the FAIL lines (or use --draft for a look, never for delivery).'); process.exit(1); }
}
const silentVideo = path.join(film.dir, 'video.tmp.mp4');
const voPath = path.join(film.dir, 'vo.mp3'), musicPath = path.join(film.dir, 'music.mp3');
const { page, close } = await openFilm(film);
try {
  const duration = await page.evaluate(() => window.duration);
  const leadMs = Math.round(1000 * (await page.evaluate(() => window.LEAD || 0)));
  const total = Math.round(duration * FPS);
  const frames = Math.min(total, Number(process.env.FRAMES) || total);
  const START = Number(process.env.START) || 0, STEP = Number(process.env.STEP) || 1;
  console.log(`duration ${duration}s -> ${frames}/${total} frames`);
  const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-crf', '16', '-r', String(FPS), silentVideo], { stdio: ['pipe', 'inherit', 'inherit'] });
  const encDone = new Promise((res, rej) => { enc.on('error', rej); enc.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg video exit ' + c)))); });
  const t0 = Date.now();
  for (let n = 0; n < frames; n++) { // forward only
    const b64 = await page.evaluate(f => { window.renderFrame(f / 30); return document.getElementById('film').toDataURL('image/png').slice(22); }, Math.round(START * FPS) + n * STEP);
    if (!enc.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => enc.stdin.once('drain', r));
    if (n % 150 === 0) console.log(`frame ${n}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  enc.stdin.end();
  await encDone;

  // Mux: the score ducks under the voice (sidechain), fades at the end; one loudness pass to -16 LUFS / -1.5 dBTP.
  const len = (frames / FPS).toFixed(3), fadeAt = Math.max(0, frames / FPS - 2.5).toFixed(3);
  const hasVo = existsSync(voPath), hasMusic = existsSync(musicPath);
  const inputs = ['-i', silentVideo];
  const norm = `apad,atrim=0:${len},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]`;
  const st = 'aresample=48000,aformat=channel_layouts=stereo';
  let filter = null;
  if (hasVo && hasMusic && !sample) {
    inputs.push('-i', musicPath, '-i', voPath);
    filter = `[2:a]adelay=${leadMs}|${leadMs},${st},asplit=2[vo][key];[1:a]adelay=${leadMs}|${leadMs},${st},volume=0.42,afade=t=out:st=${fadeAt}:d=2.5[mus];` +
      `[mus][key]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=450[duck];[duck][vo]amix=inputs=2:duration=longest:normalize=0,${norm}`;
  } else if ((hasVo || hasMusic) && !sample) {
    inputs.push('-i', hasVo ? voPath : musicPath);
    filter = `[1:a]adelay=${leadMs}|${leadMs},${st},${norm}`;
  }
  console.log('audio:', sample ? 'none (sample)' : [hasVo && 'vo.mp3', hasMusic && 'music.mp3'].filter(Boolean).join(' + ') || 'none');
  if (filter) await run('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filter, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', len, '-movflags', '+faststart', out]);
  else await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silentVideo, '-c', 'copy', '-movflags', '+faststart', out]);
  await rm(silentVideo, { force: true });
  console.log('written', out);
} finally {
  await close();
}
