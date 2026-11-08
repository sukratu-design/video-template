# diwali-film: "A Row of Lamps"

A 69.5 s, 1080×1080 painted explainer on Diwali, built from the `painted-film/` template (same toolkit and compositor in `index.html`; new beats, captions, score and voiceover). See `brief/SCRIPT.md` for the beat table and `STYLE.md` for the look.

## Run
```bash
npm i
node stills.mjs out_dir 5 12.5 30   # PNG stills at those times (captions on)
FRAMES=60 START=30 STEP=10 node render.mjs t.mp4   # quick sample
node render.mjs diwali-full.mp4     # full render; run in the background (~10-15 min on 2 vCPU)
```
`vo.mp3` next to `index.html` is muxed in automatically (music is sidechain-ducked, −16 LUFS).

## Voiceover
Sarvam `bulbul:v4-flash`, voice `shubh_en_narration`. The key is read from `SARVAM_API_KEY` in the environment or `~/.sarvam.env`; never commit it.
```bash
cd voiceover
node generate-takes.mjs '[]'        # 3 takes per line into shubh_t/ (devanagari terms in the TTS text only)
python3 -I assemble.py              # picks TAKE[], places lines at ST[], writes v3.pcm and cues_v3.js
ffmpeg -f s16le -ar 48000 -ac 1 -i v3.pcm -b:a 192k ../vo.mp3
```
Paste `cues_v3.js` over `captionCues` in `index.html`. Beat boundaries `B[]` (top of the beats block in `index.html`) and the cut/bell times in `audio.js` follow `ST[]`.

## Notes
- Hero diya position (`DX,DY,DS`) is shared by beats 1, 9 and 10 so the film loops.
- Night washes cut glow holes with `destination-out` so lit windows read as light on a dark wash.
- Not drawn: faces or deities (Rama and Lakshmi are named, shown by footprints, sandals and a lotus).
- `composite()` lays the artwork on the paper with no pigment-bleed blur and no per-pixel edge displacement, so drawings and captions keep clean edges. Paper grain still mottles wash density. (The original `painted-film/` compositor keeps both effects.)
