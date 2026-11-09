# dussehra-diwali-film: "Dussehra to Diwali, the long way home"

**Status: FINAL, locked 9 Nov 2026.** 1080×1080, 85.5 s (1.5 s cover + 84 s film). Delivered render: `node render.mjs` → H.264 CRF 16, AAC 192k, −16 LUFS (sha256 prefix `cdaf33cf9cd664eb`). To keep it reproducible, the final `vo.mp3` (Sarvam takes, not deterministic) and `music.mp3` (ElevenLabs Music v2.5 via Higgsfield, bansuri-led Raga Yaman, job `2c1e0939-9f9f-4248-97db-ed53e8f79b04`) are committed, an exception to the usual gitignore.

A 77.5 s, 1080×1080 painted explainer on why Rama reached Ayodhya (Diwali) only some time after his victory over Ravana (Dussehra). See `brief/SCRIPT.md` for the beat table and accuracy notes.

**Two versions:**
- `index.html` (current): ten generated Company School paintings in `frames/` (GPT Image 2.6 via Higgsfield, style reference attached), each with a slow camera move (`CAM[]`), 0.7 s dissolves, and handwritten captions from the measured voiceover. Prompts, model comparison and lessons: `brief/IMAGE-PROMPTS.md`.
- **Cover lead:** the video opens on `frames/cover.jpg` (made with `cover.mjs` from frame 10) for 1.5 s (`LEAD`), then dissolves into the film, so the upload can use frame 0 as its thumbnail. `render.mjs` delays the voiceover and music by `window.LEAD`. Total length 85.5 s.
- **Music:** `music.mp3` (gitignored) is the bansuri-led Raga Yaman score generated with ElevenLabs Music v2.5 on Higgsfield; `render.mjs` uses it when present, else the synthesized `audio.js` score.
- `index-drawn.html`: the earlier fully code-drawn version (symbols only, built from `../diwali-film/`'s toolkit and compositor; beats 1 and 4 have the detailed scenery pass). `render.mjs`/`stills.mjs` render `index.html`; to render the drawn version, rename it.

## Run
```bash
npm i
node stills.mjs out_dir 5 12.5 30   # PNG stills at those times (captions on)
FRAMES=60 START=30 STEP=10 node render.mjs t.mp4   # quick sample
node render.mjs dussehra-diwali-full.mp4           # full render; run in the background (~5 min here, 10-15 min on 2 vCPU)
```
`vo.mp3` next to `index.html` is muxed in automatically (music is sidechain-ducked, −16 LUFS).

## Voiceover
Sarvam `bulbul:v4-flash`, voice `shubh_en_narration`. The key is read from `SARVAM_API_KEY` in the environment or `~/.sarvam.env`; never commit it.
```bash
cd voiceover
node generate-takes.mjs '[]'        # 3 takes per line into shubh_t/ (Devanagari terms in the TTS text only)
python3 -I assemble.py              # uses TAKE[], places lines at ST[], writes v3.pcm and cues_v3.js
ffmpeg -f s16le -ar 48000 -ac 1 -i v3.pcm -b:a 192k ../vo.mp3
```
Paste `cues_v3.js` over `captionCues` in `index.html`. Beat boundaries `B[]` (top of the beats block in `index.html`) and the cut/bell/whoosh times in `audio.js` follow `ST[]`. All ten lines fit at tempo 1.0 (no atempo).

## Notes
- The paintings show the characters (natural skin tones, written into every prompt). The drawn version kept to the original brief's rule: no faces, no deities.
- Headless Chromium runs with `--allow-file-access-from-files` so the JPEGs don't taint the canvas.
- (Drawn version) No faces, no deities. Rama, Ravana, Vibhishana, Sita, Agni, Hanuman and Bharata are named in the narration only and shown by symbols drawn in code: bow and arrow, a ten-spired crown, a pyre, a crown under a parasol with a kalash, a lotus passing through fire, the Pushpaka Vimana (winged chariot), a mace with a saffron streak, sandals (paduka) on a throne, footprints, the city gate, lamps.
- The ~20-day calendar gap between the festivals is presented as later tradition, and the lamps of Ayodhya as "tradition says"; the epic's own content is the order of duties (Valmiki, Yuddha Kanda). See `brief/SCRIPT.md`.
- Toolkit change vs `diwali-film/`: `hatch`, `groundWash`, `drawShrub`, `drawFlame`, `label2`, `footprint`, `ribbon`, `stars` and `nightWash` now multiply by the incoming `globalAlpha`, so a faded group fades its hatching, flames and labels too (no need to pass the parent alpha twice).
