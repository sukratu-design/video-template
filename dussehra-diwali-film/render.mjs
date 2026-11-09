// Frame-accurate render: index.html?render=1 -> PNG frames -> ffmpeg, then mux synthesized music + optional voiceover.
// Usage: node render.mjs [output.mp4]   (env FRAMES=N renders only the first N frames, for quick tests)
import puppeteer from 'puppeteer';
import { spawn } from 'node:child_process';
import { writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(process.argv[2] || path.join(dir, 'karma-companyschool.mp4'));
const silentVideo = path.join(dir, 'video.mp4');
const audioPath = path.join(dir, 'audio.wav');
const voPath = path.join(dir, 'vo.mp3');
const musicPath = path.join(dir, 'music.mp3'); // optional generated score; used instead of the synthesized audio.wav when present
const FPS = 30;

function run(cmd, args) {
  const p = spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] });
  return new Promise((res, rej) => {
    p.on('error', rej);
    p.on('close', code => (code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`))));
  });
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  const url = pathToFileURL(path.join(dir, 'index.html')).href + '?render=1';
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  // window.ready resolves after fonts are loaded and frame 0 is drawn.
  await page.waitForFunction(() => window.ready && typeof window.renderFrame === 'function', { timeout: 120000 });
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.duration);
  const total = Math.round(duration * FPS);
  const frames = Math.min(total, Number(process.env.FRAMES) || total);
  console.log(`duration ${duration}s -> ${frames}/${total} frames`);

  // Music bed, synthesized in the page with OfflineAudioContext.
  const wavB64 = await page.evaluate(async () => {
    const buf = new Uint8Array(await (await window.KarmaAudio.renderWav()).arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return btoa(s);
  });
  await writeFile(audioPath, Buffer.from(wavB64, 'base64'));
  console.log('audio.wav written');

  const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-crf', '16', '-r', String(FPS), silentVideo],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const encDone = new Promise((res, rej) => { enc.on('error', rej); enc.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg video exit ' + c)))); });
  const t0 = Date.now();
  // Test-only sampling: START (seconds) and STEP (frame stride) let a short FRAMES=n test cover any beat.
  const START = Number(process.env.START) || 0, STEP = Number(process.env.STEP) || 1;
  for (let n = 0; n < frames; n++) {
    const b64 = await page.evaluate(f => { window.renderFrame(f / 30); return document.getElementById('film').toDataURL('image/png').slice(22); }, Math.round(START * FPS) + n * STEP);
    if (!enc.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => enc.stdin.once('drain', r));
    if (n % 150 === 0) console.log(`frame ${n}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  enc.stdin.end();
  await encDone;
  console.log('video.mp4 written');

  // Mux: music ducks under the voiceover (sidechain), then one loudness pass to -16 LUFS / -1.5 dBTP.
  const len = (frames / FPS).toFixed(3);
  const musicIn = existsSync(musicPath) ? musicPath : audioPath;
  const leadMs = Math.round(1000 * (await page.evaluate(() => window.LEAD || 0))); // cover hold before the film
  console.log('music:', path.basename(musicIn));
  const inputs = ['-i', silentVideo, '-i', musicIn];
  let filter;
  if (existsSync(voPath)) {
    inputs.push('-i', voPath);
    filter = `[2:a]adelay=${leadMs}|${leadMs},aresample=48000,` + 'aformat=channel_layouts=stereo,asplit=2[vo][key];' +
      `[1:a]adelay=${leadMs}|${leadMs},aresample=48000,aformat=channel_layouts=stereo,volume=0.42[mus];` +
      '[mus][key]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=450[duck];' +
      '[duck][vo]amix=inputs=2:duration=longest:normalize=0,' +
      `apad,atrim=0:${len},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]`;
  } else {
    filter = `[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${len},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]`;
  }
  await run('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filter, '-map', '0:v', '-map', '[a]',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', len, '-movflags', '+faststart', out]);
  await rm(silentVideo, { force: true });
  console.log('written', out);
} finally {
  await browser.close();
}
