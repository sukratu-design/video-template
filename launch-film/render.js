// Frame-accurate render: seeks the GSAP timeline per frame, screenshots, pipes to ffmpeg.
// Usage: node render.js [out.mp4] [--vertical] [--from=0] [--to=30] [--stills=t1,t2,...] [--no-audio]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const out = process.argv.slice(2).find(a => !a.startsWith('--')) || 'out.mp4';
const FPS = 30, V = !!args.vertical, W = V ? 1080 : 1920, H = V ? 1920 : 1080;
const PAGE = V ? 'vertical.html' : 'index.html';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, PAGE));
  await page.evaluate(() => window.__ready);
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  const AUDIO = path.join(__dirname, await page.evaluate(() => window.CONTENT.brand.audio));

  if (args.stills) {
    for (const t of String(args.stills).split(',').map(Number)) {
      // render forward from 0 so callbacks fire in order
      for (let f = 0; f <= Math.round(t * FPS); f += 3) await page.evaluate(x => window.__seek(x), f / FPS);
      await page.evaluate(x => window.__seek(x), t);
      await page.screenshot({ path: `still_${t}.png` });
      await page.evaluate(() => window.__seek(0));
    }
    await browser.close(); return;
  }

  const from = Number(args.from || 0), to = Number(args.to || 30);
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (!args['no-audio']) ff.push('-ss', String(from), '-t', String(to - from), '-i', AUDIO, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '256k');
  ff.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const enc = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });
  for (let f = 0; f < Math.round(from * FPS); f += 3) await page.evaluate(x => window.__seek(x), f / FPS);
  const total = Math.round((to - from) * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(x => window.__seek(x), from + i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if (i % 90 === 0) process.stderr.write(`frame ${i}/${total}\n`);
  }
  enc.stdin.end();
  await new Promise(r => enc.on('close', r));
  await browser.close();
  console.log('wrote', out);
})();
