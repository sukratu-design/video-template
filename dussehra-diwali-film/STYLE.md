# Style guide: the painted look

Reference: `assets/style-reference.png`, an early-19th-century Indian *Company School* watercolour ("Mahratta Horseman fully accoutred"). Study it before touching the visuals.

## What makes it read as that painting
- **Paper:** one cream, aged, hand-made sheet for every beat: grain, foxing spots, faint stains, chain lines, fibres, a vignette and a ragged edge on a darker mount. It is generated in code (`buildPaper`) and seeded, so frames are reproducible.
- **Paint:** scenes draw onto a *transparent art layer*; `composite()` lays that onto the paper with a subtractive watercolour model: translucent washes mottled by the paper grain, darker where they pool at the edges, slight outward pigment bleed, and fibre displacement on every edge. Very dark pixels act as brown-black pen ink.
- **Line:** thin brown-black pen outlines with a small wobble (`wobblyPath`, `inkStroke`), cross-hatching for shade (`hatch`, `crossHatch`), pencil construction lines for diagrams.
- **Palette** (`C` in `index.html`): pearl grey, pink/magenta, teal-blue, vermilion, ochre/umber and gold on cream. No pure black, no saturated neons, no navy backgrounds (the first version's dark "diagram" beats were redone as ink-and-wash on the same paper).
- **Composition:** objects float on bare paper with at most a loose ochre/umber ground-wash strip (`groundWash`) and dry-brush shrubs (`drawShrub`). No scenic backgrounds, no tiles, no grids.
- **Caption:** handwritten copperplate (Pinyon Script) in dark ink, written on left to right over ~0.6 s (`drawCaption`). Devanagari labels use Tiro Devanagari Sanskrit in ink. Subject rules from the brief still hold: no faces, no deities, everything drawn in code.

## Toolkit map (`index.html`)
- Math/random: `hashSeed`, `mulberry32`, `noise01`, `vnoise`, `clamp`, `lerp`, `ease`.
- Paths: `pointsCircle`, `resample`, `wobblyPath`, `tracePath`, `partialPath`, `pointOnPath`, `drawOn`, `almondPoints`, `leafPoints`.
- Marks: `inkStroke`, `chromaticSketch`, `hatch`, `crossHatch`, `dotField`, `poissonInCircle`, `fibonacciInShape`, `construction`, `label`, `glow`, `spark`.
- Paper/paint: `buildPaper`, `composite`, `groundWash`, `drawShrub`, `camera`.
- Objects: `mango`, `smallSeed`, `drawHand`, `drawDiya`, `drawFlame`, `bird`, `drawCloth`.
- Timeline: `addBeat(id, start, end, state, setup(tl, state), draw)` registers a beat; GSAP tweens mutate `state` (a plain object), `draw` paints it. `window.renderFrame(t)` renders any time `t` deterministically; `window.duration` is the length.

## Known weak spots (fix when reusing)
- Hands (beats 1 and 13) are simple mitten shapes; redraw if people matter.
- The bow is a pale grey; the quiver and arrows are better.
- Beat 4 opens zoomed in with the pot filling the frame for ~1 s.
