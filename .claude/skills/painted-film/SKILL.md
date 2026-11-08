---
name: painted-film
description: Make a square (1080x1080) explainer film in the Company School painted-watercolour style from this repo's painted-film template, with an Indian-English voiceover. Use when asked for a painted/miniature/watercolour explainer or "a video in the karma film style".
---

# Painted film from template

Template: `painted-film/`. Read `painted-film/STYLE.md`, `painted-film/README.md` and `docs/PAINTED-FILM-HISTORY.md` first, and look at `painted-film/assets/style-reference.png` and `painted-film/examples/karma-companyschool-v3.mp4` (the target look).

1. **Brief:** shot-by-shot table (time, look, picture, narration) like `painted-film/brief/SCRIPT.md`. Narration ~140 wpm with breaths.
2. **Copy** `painted-film/` to a new folder; keep the toolkit and compositor in `index.html`, replace the `addBeat` scenes, `captionCues`, `window.duration`.
3. **Voiceover first** (`painted-film/voiceover/README.md`): Devanagari for Indic terms in TTS text, 3 takes per line, pick, assemble, paste the generated `captionCues`. Never put API keys in the repo.
4. **QA:** `FRAMES=60 START=<sec> STEP=<n> node render.mjs t.mp4`, extract stills with ffmpeg, check clipping/overlap/legibility, then full render in the background.
5. **Deliver** a compressed copy (`libx264 -crf 25 -c:a copy`); reference examples live in `painted-film/examples/`.

Rules: seeded RNG only, animate plain objects (no dotted GSAP property names), one run at a time on small servers, don't use `until ! pgrep -f` loops.
