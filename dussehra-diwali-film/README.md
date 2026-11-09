# dussehra-diwali-film: "Dussehra to Diwali, the long way home"

A 77.5 s, 1080×1080 painted explainer on why Rama reached Ayodhya (Diwali) only some time after his victory over Ravana (Dussehra). Built from `../diwali-film/` (same toolkit and clean-edge compositor in `index.html`; new beats, captions, score and voiceover). See `brief/SCRIPT.md` for the beat table and the accuracy notes, and `STYLE.md` for the look.

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
- No faces, no deities. Rama, Ravana, Vibhishana, Sita, Agni, Hanuman and Bharata are named in the narration only and shown by symbols drawn in code: bow and arrow, a ten-spired crown, a pyre, a crown under a parasol with a kalash, a lotus passing through fire, the Pushpaka Vimana (winged chariot), a mace with a saffron streak, sandals (paduka) on a throne, footprints, the city gate, lamps.
- The ~20-day calendar gap between the festivals is presented as later tradition, and the lamps of Ayodhya as "tradition says"; the epic's own content is the order of duties (Valmiki, Yuddha Kanda). See `brief/SCRIPT.md`.
- Toolkit change vs `diwali-film/`: `hatch`, `groundWash`, `drawShrub`, `drawFlame`, `label2`, `footprint`, `ribbon`, `stars` and `nightWash` now multiply by the incoming `globalAlpha`, so a faded group fades its hatching, flames and labels too (no need to pass the parent alpha twice).
