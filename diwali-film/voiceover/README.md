# Voiceover pipeline

Goal: a `vo.mp3` (same length as the film, e.g. 68 s) where each narration line starts at its caption cue and reads at a calm pace.

## Providers used
- **Sarvam AI Bulbul v4-flash, voice `shubh_en_narration`** (final): `sarvam.mjs`. Needs `SARVAM_API_KEY` in `~/.sarvam.env` (`SARVAM_API_KEY=...`, chmod 600). **Never commit or paste the key.** Sarvam output varies a lot between runs, so generate several takes per line.
- **Edge TTS** (`edge-tts-build.mjs`, `npm i msedge-tts`): free, no key. Indian voices `en-IN-Neerja/NeerjaExpressive/Prabhat` and Hindi `hi-IN-Swara/Madhur`. Used for the earlier Madhur version.

## Steps
1. **Write the lines** as the `L` array in `generate-takes.mjs`: one entry per beat/caption group.
2. **Sanskrit/Indic terms:** English voices mispronounce IAST transliteration (saṃskāra, prārabdha). Put the terms in **Devanagari** in the TTS text only (संस्कार, वासना, संचित, प्रारब्ध, आगामी, फल, गीता, मोक्ष). Captions keep the Latin spelling.
3. **Takes:** `node generate-takes.mjs '[pace per line]'` → `shubh_t/l<i>_t<0..2>.mp3` (3 takes per line, pace 1.0-1.2, temperature 0.35).
4. **Pick:** `python3 -I pick.py` prints, per line, the processed duration of each take against its window and the best take (slowest that fits, tempo ≤ ~1.1).
5. **Assemble:** set `TAKE`, `W` (windows), `ST` (start times), `PIECES` (caption pieces per line) in `assemble.py`; run `python3 -I assemble.py`. It trims silence, compresses sentence pauses to 0.38 s, applies `atempo` only if a line overflows its window, places lines at their start times, snaps caption split points to the detected pauses, and writes `cues_v3.js` (a ready `captionCues` block) and `v3.pcm`. Then `ffmpeg -f s16le -ar 48000 -ac 1 -i v3.pcm -b:a 192k vo.mp3`.
6. Paste `cues_v3.js` over `captionCues` in `index.html`, put `vo.mp3` next to it, render.

## Pacing rules that fixed "rushed" audio
- Target 125-165 effective wpm with 0.2-0.4 s breaths; never `atempo` above ~1.1. Squeezing a slow voice (1.3-1.4×) was what felt rushed.
- If a line does not fit its window, **tighten the wording** or extend the window by ~0.2-0.3 s before speeding up.
- Fixed loudness comes from `render.mjs` (sidechain duck + loudnorm −16 LUFS), not from the TTS.

Scripts use relative folders (`shubh_t/`, `measure.py` imports) and expect to be run from this directory.
