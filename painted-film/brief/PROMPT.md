I'm attaching two files:

- `SCRIPT.md` — the shot-by-shot script for a 66-second square video explaining the Hindu concept of karma (13 beats, timings, visuals, voiceover, sound notes). Follow it exactly for content and timing.
- `reference-contact-sheet.png` — frames sampled every 0.5 s from the reference film ("The life of a fruit fly", drawn entirely in JavaScript). Study it closely for style, pacing and transitions. Do not copy its subject; borrow only its visual language.

## Task

Build this video **purely in code**: one self-contained `index.html` using HTML Canvas 2D (SVG only where it is clearly easier) and **GSAP 3** for all timing. Use no image files, video, AI-generated art, Lottie or icon fonts. Every pixel is drawn procedurally. Then provide a render script that exports a frame-accurate MP4.

## Output spec
- 1080 × 1080, 30 fps, 66.0 s (1980 frames). Canvas fixed at 1080², and the preview scales it to fit the window with CSS.
- Load GSAP from `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`. Fonts come from Google Fonts: **Tiro Devanagari Sanskrit** for Devanagari and **IBM Plex Mono** (small caps feel) for romanised labels. Wait for `document.fonts.ready` before the first draw.
- **Determinism is mandatory.** Use a seeded PRNG (mulberry32) for all randomness, with each scene owning its own seed. Never use `Math.random()`, `Date.now()` or `requestAnimationFrame` time inside drawing. Rendering frame N twice must give identical pixels.
- Build one paused master `gsap.timeline()`, with each beat as a labelled sub-timeline placed at its script timestamp. Expose:
  - `window.duration = 66`
  - `window.renderFrame(t)` → seeks the timeline to `t`, clears, and draws the whole frame synchronously.
- Preview mode (default) adds a minimal play/pause button, a scrubber, a time readout and a beat list to jump to. `?render=1` hides all UI. `?captions=1` burns in the voiceover lines as small captions at the bottom.

## Architecture
- `scenes = [{ id, start, end, setup(tl), draw(ctx, state, localT) }]`. GSAP tweens only plain `state` objects (progress, camera x/y/zoom/rotation, opacity, reveal fractions). A single `draw()` reads the state and paints everything. Avoid DOM animation.
- Shared camera transform per scene: translate, scale and rotate around a focus point. Zoom-throughs and match cuts work by tweening the camera.
- Transitions follow the reference:
  - **Hard cuts** on the beat, which are the majority.
  - **Match cuts**, where a shape in scene A sits at the same position and size as a shape in scene B. Examples: spark → glowing point (1→2), pot rim → quiver circle (4→5), arrow → seed in earth (5→6), lotus → wheel (7→8), and the final frame matching frame 1 so the film loops.
  - **Zoom-through** into the mango that becomes the rangoli (6→7).
- Write a small drawing library first, then build scenes on it:
  - `wobblyPath(points, {seed, amp, boil})`: hand-drawn lines with slight per-vertex jitter. **Line boil:** re-seed the jitter at 12 fps (`Math.floor(t*12)`) so static drawings shimmer like hand-animated frames, as the reference does.
  - `drawOn(path, progress)`: stroke reveal by arc length, used whenever a shape "draws itself".
  - `hatch(shape, {angle, spacing, weight, color, density})` and `crossHatch(...)`: clip to the shape, then draw parallel wobbly lines. Density can vary by a light direction to model form, giving the shading in every warm scene.
  - `chromaticSketch(path)`: 2–3 extra offset strokes in pink/green/blue at low alpha, like the colored-pencil fringe around the fly's wings in the reference.
  - `paper(ctx)`: a cream base, faint fibre noise (pre-rendered once into an offscreen canvas from the seeded PRNG), and soft diagonal light stripes.
  - `woodGrain`, `tiles` (courtyard tiles with a simple 4-petal motif), `earth` (red-brown stippled soil).
  - `dotField(shape, count, distribution)` with Fibonacci-spiral and Poisson options, for the dark diagram scenes.
  - `construction(ctx)`: thin circles, axis lines, ruler ticks along an arc, a small branching tally/dendrogram, crosshair marks. This is the "scientific plate" dressing used on every dark scene.
  - `label(devanagari, roman, gloss, anchor)`: a specimen label with a leader line that draws on, then the text fades in.
  - `glow(ctx, fn)`: draw twice, once blurred via `ctx.filter = 'blur(6px)'` with `globalCompositeOperation='lighter'` and once sharp.

## Visual language (match the contact sheet)
**WARM register** (lived world):
- Paper `#F3E6CC`; light stripes `#FBF3E2`; ink/hatch `#4A2E1C`; mango `#E8955A` → `#F2B661`; terracotta `#C4553A`; red earth `#9C3B2A`; wood `#C99A63`; leaf green `#8DB59A`; sky `#9CC7D9`; accent red `#B3232A`.
- Everything is outlined with 1.5–2.5 px wobbly ink and shaded with hatching, never with gradients alone. Flat fills sit underneath the hatching, like an illustrated field guide.
- Hands are shown from the wrist only, simplified and respectful, with no faces anywhere.

**DARK register** (inner mechanism):
- Ground `#0C0C18`; primary line `#C9CCF5` at 1–1.5 px; secondary line at 25% alpha; glow green `#3BE38A`; magenta `#E040A0`; gold `#F2C14E` (fire, final spark); ash `#6B6B7A`.
- The diagrams look like a naturalist's plate crossed with a physics diagram: precise thin lines, dots, construction geometry and small labels. Glow is used sparingly.

**Motion**
- Things draw themselves on with `power2.inOut`, scale in with `back.out(1.4)`, and get secondary motion through stagger. Even "still" moments keep slow motion (camera drift of ~1–2%, line boil) so nothing freezes.
- Pacing is brisk like the reference. Inside each beat, schedule 2–4 sub-events, and avoid any stretch longer than ~1.5 s where nothing new appears.

## Scene notes beyond the script
- Beat 2: grow the dots in a Fibonacci spiral outward from the centre point, staggered. The seed shape is a rounded almond built from 2 Béziers.
- Beat 3: each green band sweeps in with a bright leading edge, and the tally top-right gains one branch per band.
- Beat 4: pack the pot with ~300 seeds using Poisson-disc sampling inside a circle. Each seed is a small hatched almond at a random angle, and ~8% of them glow.
- Beat 5: draw the arrow-in-flight trajectory as a dashed parabola with tick marks every 40 px. Show the āgāmi "possible futures" as 7 faint fanned curves, one of which brightens briefly.
- Beat 6: grow the tree with a recursive L-system-like branching (seeded) driven by a `growth` 0→1 tween. Fill the canopy with hatched leaf clusters. Add mangoes last, popping in with `back.out`.
- Beat 7: build the rangoli inside a circle from hex/dot cells. Each cell's colour is sampled from a procedural target image function (first the sweet/bitter split, then a lotus), and the cells transition with a radial stagger.
- Beat 8: on the wheel, four nodes with labels and curved arrows between them. Rotate with an accelerating ease, leaving fading ring trails.
- Beat 9: the cloth is a closed wobbly shape that wraps around the point by tweening a radius/angle-sweep mask. To fray it, drop hatch lines out randomly (seeded) and add loose thread ends.
- Beat 10: the water bowl ripple is concentric wobbly circles. The hand exits frame before the bird arrives, and that timing is the point of the shot.
- Beat 11: draw the flame as 5–6 nested teardrop contours that boil at 12 fps, with sparks as tiny rising dots. Inside the seed, extinguish the dots (green → ash) in reverse spiral order. The failed sprout draws on 30%, flickers, then retracts.
- Beat 12: the circle opens by morphing the arc into a vertical line (interpolate between arc points and line points with the same count). The point rises with `power2.in`.
- Beat 13 must match beat 1's composition exactly so the end loops into the start. Swap only the spark colour to gold.

## Audio
- Create `audio.js`, which uses `OfflineAudioContext` to synthesize a 66 s WAV procedurally, then add a "Download audio" button in preview mode. It should contain:
  - a tanpura-like drone (Sa and Pa: sawtooth + slow filter sweep, plus the jvari buzz via a slight detune)
  - a soft clay *tok* on every hard cut, using the cut times from the timeline labels
  - a bell shimmer on sparks
  - an arrow whoosh (filtered noise sweep)
  - fire crackle (sparse noise bursts)
  - a fade to near-silence at 0:59
- Voiceover is recorded separately. Leave a `vo.mp3` hook: if present next to `index.html`, the preview plays it in sync and the render script muxes it.

## Render script
Write `render.mjs` (Node + Puppeteer):
1. Open `index.html?render=1` at viewport 1080×1080 with deviceScaleFactor 1.
2. Wait for fonts.
3. For each frame N of 1980, call `renderFrame(N/30)` and capture the canvas via `canvas.toDataURL('image/png')`. Pipe the frames into ffmpeg (`-f image2pipe -framerate 30 -i - -c:v libx264 -pix_fmt yuv420p -crf 16`).
4. Mux `audio.wav` (+ `vo.mp3` if present, ducking the music under the voice) into `karma.mp4`.

Also include a `README.md` with the exact commands.

## Working method
1. Build the drawing library plus a test page showing each primitive. Make sure hatching and line boil look hand-drawn before building any scenes.
2. Build the beats in order. After each one, render 3 stills (start, middle, end), look at them, and compare against the contact sheet. Fix anything that reads as "vector clip-art" rather than "illustrated plate".
3. Check the whole film at 1× in preview for pacing. Every cut should land on the script timestamp ±1 frame.
4. Before you finish, verify that the same frame renders identically twice (determinism), and that frame 0 and frame 1979 match closely enough to loop.

Treat the subject respectfully: no depictions of deities, no faces, no caricature. Spell the Sanskrit exactly as written in SCRIPT.md.
