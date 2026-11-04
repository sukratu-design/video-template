# Launch film template (MyDesigner.gg)

This is a 30-second motion-graphics launch film, built in code (HTML and GSAP) and rendered to mp4 locally, so it doesn't use any Motion credits. One content file drives two layouts:

| Layout | File | Output |
|---|---|---|
| 16:9 (web, YouTube, LinkedIn) | `index.html` | 1920×1080 @30 |
| 9:16 (Reels, X, Shorts; Reels-safe) | `vertical.html` | 1080×1920 @30 |

## Make a new film
1. **Copy the folder** for the new film or client.
2. **Edit `content.js`.** This is the only file you normally touch:
   - `brand`: colours, wordmark file, audio file
   - `intro`, `captions`, `stat`, `tagline`, `endLine`, `endUrl`: all on-screen copy
   - `notifications`, `prompt`, `planBlocks`, `proofTags`: the story beats
   - `cards` and `finalSlots`: the chaos calendar and where items land once "fixed". Any card missing from `finalSlots` is thrown off as noise.
3. **Swap assets:** put the wordmark (transparent PNG or SVG) in `assets/` and a 30-second music track as the `brand.audio` file.
4. **Render:**
   ```bash
   npm i                                  # first time: gsap + fonts
   npx playwright install chromium        # first time, if Playwright isn't set up
   node render.js --stills=7.3,16,23.8,29.5      # quick check frames (16:9)
   node render.js --vertical --stills=7.3,23.8   # quick check frames (9:16)
   node render.js film-16x9.mp4
   node render.js film-9x16.mp4 --vertical
   ```
   A full render takes about 3–4 minutes per layout. To preview live, open the HTML file in a browser and it plays in real time.

## Story structure (fixed by the template)
Hook → chaos board fills up → "problem" captions stamp → board shatters → stat beat → brand flood + logo reveal → iris into the plan board → prompt typed → noise thrown out, plan blocks lock in → proof tags → full-colour takeover → end line + logo + URL. Beat timings are in `SPEC.md`.

## Rules for copy length (so layouts still fit)
- **Captions:** 4 short words. In 9:16 they wrap onto 2 lines.
- **`stat.words` + `stat.tail`:** about 25 characters in total.
- **`tagline`:** ≤ 40 characters (mono, letter-spaced).
- **`endLine`:** 4 words. The last word is italic. In 9:16, words 1–2 and 3–4 go on separate lines.
- **`planBlocks`:** title ≤ 6 characters and subtitle ≤ 16 characters in 9:16.
- **Card names:** ≤ 18 characters, or they'll truncate in 9:16.

## Going deeper (only if the structure changes)
- **Timing:** each beat is a `tl.to(..., <seconds>)` in the HTML files. Change it in **both** layouts.
- **Layout positions** (notifications `NPOS`, board camera, sphere placement) are per layout file.
- `render.js` steps the timeline frame by frame (Playwright → ffmpeg), so renders come out the same every time.

## Known placeholders
- `assets/wordmark.png` was cut out of a frame of the Motion render. Replace it with the vector logo.
- `audio.m4a` is the music and SFX mix from the Motion export, timed to this cut. Check Motion's terms before using it beyond this film, or replace it. If you replace it, keep the hard drop at 8.4–9.0 s and the final hit at about 27.3 s.
- The end-line font is Fraunces, a close match. Swap it in the `@font-face` block if the brand has its own serif.
