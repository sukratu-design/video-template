# History: how the launch-film template came to be

## 2026-11-04: origin
- **Motion original:** Anand had Motion.so produce a 30 s launch film for MyDesigner.gg (Motion chat `a2cc9ae6-e9c6-4159-bc99-2d8e4be283fa`, "Launch video for mydesigner.gg service", engine `gva` / standard effort). He liked everything except the music. A second Motion pass swapped the track for "premium cinematic electronic" (final export `41f8285a-4c88-57dd-8056-23a90f1ce807`).
- **Vertical remaster in Motion:** a 9:16 remaster was started in Motion (chat `816d37a3-c68b-4a61-a220-beb1d7c01f85`). It was abandoned in favour of this repo because Motion credits were too expensive.
- **What the connector couldn't give us:** the Motion MCP connector exposes chat messages and exports, but not the project source. It also only supports its own `motion` engine, so the `gva` project couldn't be cloned or re-rendered through it.

## Reverse-engineering method
1. **Inputs:** downloaded the final mp4 (1920×1080, 30 fps, 30.0 s, AAC 48 kHz). Read Motion's own beat-by-beat description from the chat.
2. **Frames:** extracted contact sheets every 0.5 s, plus full-res frames at the key beats.
3. **Colours:** sampled exact colours from the frames: paper `#f3ede8`, orange `#fe883d`.
4. **Logo:** cut the wordmark out of a flat-orange frame, using green-channel distance from the orange as alpha. The ring mark was redrawn as SVG.
5. **Fonts:** identified Space Grotesk and Space Mono. The end-card serif is approximated with Fraunces 600.
6. **Build:** rebuilt every scene as DOM + one GSAP master timeline. The stippled spheres are generated on canvas with a seeded RNG. The tile shatter is a 24×14 grid of 80 px tiles matching the background grid.
7. **Audio:** lifted the audio track from the Motion export unchanged, so the music and SFX stay in sync.
8. **Calibration:** compared exact frames (`ffmpeg select='eq(n,N)'`) side by side against the reference and adjusted timings until every beat landed within about 0.2 s.
   - **Gotcha:** `fps=1` / `tile` contact sheets are offset by about 0.5 s and misled the first calibration pass. Use exact frame numbers.

## Decisions
- **GSAP + Playwright + ffmpeg over Remotion:** Anand already works in GSAP, the timeline is fully owned, and there's no Remotion company-licence question (Remotion's free tier is limited by team size).
- **Deterministic rendering:** a paused timeline, seeked per frame, screenshotted as JPEG q95, piped into libx264 at CRF 16 with `-preset veryfast`.
- **Vertical as a parallel layout file:** `vertical.html` keeps the same timeline and re-lays out the scenes for portrait:
  - 5 narrow day columns with two-line cards
  - stacked captions
  - the stat wrapped onto 2 lines
  - the end line split over 2 lines
- **Reels-safe pass:** the plan board was shrunk and lifted. The prompt bar, proof tags and notifications moved clear of Instagram's bottom caption area and right-hand buttons.
- **Turned into a template:** all copy, brand, data and audio moved into `content.js`. Template output was verified against the approved renders (mean absolute pixel diff ≈2/255, i.e. compression noise only).

## Rejected or not done
- **Remotion:** see above.
- **Re-rendering in Motion:** too expensive per iteration.
- **Re-creating the music:** the Motion-generated mix is a placeholder. Check Motion's terms before reusing it beyond this film, or replace it.

## Open items
- Replace the keyed `assets/wordmark.png` with the vector logo.
- Confirm or replace the end-card serif.
- Decide on the audio licence or a replacement track.
- Possible future templates: a product-demo film and a testimonial film. They have a different story structure, so they'd be new folders, not edits of `launch-film/`.
