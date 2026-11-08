# video-template

Sukratu Labs' code-based motion-graphics templates. Each one renders to mp4 locally (HTML + GSAP → Playwright → ffmpeg), with no Motion or other per-render credits.

| Template | Formats | What it is |
|---|---|---|
| [`launch-film/`](launch-film/) | 16:9 1920×1080, 9:16 1080×1920 (Reels-safe) | A 30s launch film: chaos → problem → stat → brand reveal → fix → proof → CTA. Built for MyDesigner.gg. |
| [`painted-film/`](painted-film/) | 1:1 1080×1080 | A 68s Company School painted-watercolour explainer with Indian-English voiceover (example: karma). Style guide, voiceover pipeline and compressed example videos included. |

## Quick start
```bash
cd launch-film
npm i
node render.js film-16x9.mp4
node render.js film-9x16.mp4 --vertical
```
To make a new film, edit `content.js` (copy, brand, calendar data, audio). See [`launch-film/README.md`](launch-film/README.md).
