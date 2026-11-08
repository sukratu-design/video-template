# painted-film: square explainer films in a "Company School" painted style

A code-only (HTML canvas + GSAP) 1080×1080, 30 fps film template whose look is a 19th-century Indian *Company School* watercolour: every beat is painted onto one procedurally generated sheet of aged paper. The worked example is **"The Life of a Seed"**, a 68 s explainer on karma (13 beats, Madhur/Shubh voiceover, synthesized tanpura). To make a new film in this style, keep the rendering toolkit and replace the beats, captions and voiceover.

![style reference](assets/style-reference.png)

## What's here
| Path | What |
|---|---|
| `index.html` | The whole film: seeded-random painting toolkit, paper + watercolour compositor, 13 beats (GSAP timelines), caption cues, preview UI. ~650 lines. |
| `audio.js` | Synthesized score (tanpura drone, cut toks, bell, whoosh, fire) rendered offline to `audio.wav`. No samples. |
| `render.mjs` | Puppeteer frame-by-frame render → ffmpeg; muxes music (sidechain-ducked under `vo.mp3`) and loudness-normalises to −16 LUFS. |
| `STYLE.md` | **Read first.** The style rules and a map of the painting toolkit. |
| `voiceover/` | TTS pipeline: generate takes, pick the best fit per line, compress pauses, place at caption cues. See `voiceover/README.md`. |
| `brief/` | The original brief (`PROMPT.md`, `SCRIPT.md`) given to the first agent, as an example of a good shot-by-shot brief. |
| `examples/` | Compressed finished renders and the voiceover track (see below). |
| `fonts/`, `vendor/` | Local fonts (Pinyon Script, Tiro Devanagari Sanskrit, IBM Plex Mono: all OFL) and a local GSAP fallback. |

## Examples (compressed, ~1080²)
- `examples/karma-companyschool-v3.mp4`: **the target look.** Painted style, Sarvam "Shubh" voice, final pacing. 13.5 MB.
- `examples/karma-plain-style-madhur.mp4`: the earlier flat/ink-on-navy-and-warm version with the Madhur voice, for comparison. 8.6 MB.
- `examples/vo-shubh-sarvam.mp3`: the final voiceover track, 68 s.

## Run
```bash
cd painted-film
npm i                       # puppeteer
python3 -m http.server 8080 # preview: open http://localhost:8080 (?captions=1 shows captions)
node render.mjs out.mp4     # full render, ~11-15 min on 2 vCPU / 3.7 GB; run in background
FRAMES=60 node render.mjs test.mp4            # quick test
START=30 STEP=10 FRAMES=60 node render.mjs t.mp4   # sample another beat (not real-time)
```
`vo.mp3` next to `index.html` is picked up automatically; without it the render is music-only.

## Make a new film in this style
1. Write the brief like `brief/SCRIPT.md`: a table of beats (time, look, picture, voiceover). Keep ~140 wpm of narration *with breaths* and see **Voiceover pacing** in `docs/PAINTED-FILM-HISTORY.md`.
2. Copy the folder. Keep the toolkit (everything above `const scenes=[]`) and the compositor; replace `addBeat(...)` scenes, `captionCues`, `window.duration` and the `audio.js` score as needed.
3. Generate the voiceover first (`voiceover/`), then set caption cues from the measured line timings, then render.
4. QA with stills and `ffprobe`; deliver the compressed copy.

Hard rules: seeded RNG only (no `Math.random()`/`Date.now()` in drawing), animate plain objects with GSAP (never dotted property names like `"bands.0"`), render forward through `window.renderFrame(t)`.
