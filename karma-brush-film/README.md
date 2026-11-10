# karma-brush-film: karma, painted in code with brushes and paint

**Status: look test. Contact sheet out for review; no film built yet.**

Thirteen 2160×2160 paintings for the karma script (`../painted-film/brief/SCRIPT.md`, narration unchanged, pictures re-imagined as scenes seen from above). No image model: every mark is a brush stroke placed by `engine/paint.mjs`.

## The paint engine (`engine/paint.mjs`, plain Node, no dependencies)
- A stroke is a bundle of bristles dragged along a path. Each bristle has its own tone, paint load, thickness and ragged start/end, and picks up wet paint from the canvas as it travels.
- Paint thickness is kept in a height map and lit from the top-left at the end (impasto), over a woven canvas tooth.
- `area()` covers a mask with strokes (colour, size and direction can be functions of position), `line()` is one long stroke, `dab()` a short one, `glaze()` a thin wash (cast shadows), `glow()` soft light.
- All randomness is seeded (`mulberry32`), so a scene always paints the same picture.

`scenes/world.mjs` holds shared subjects (people from above, mangoes, tree canopies, tiles, vessels, birds, cast shadows). `scenes/sNN.mjs` is one painting each; 13 reuses 01 (evening) and 12 reuses 08 (the open circle).

## Run
```bash
node paint.mjs 1 2 3        # paints frames/01.png ... at 2160 px (3-7 s each)
SCALE=1 node paint.mjs 7    # quick 1080 px preview
node contact.mjs            # contact-sheet.jpg (needs Playwright, preinstalled in the cloud workspace)
```
`frames/*.png` are gitignored (about 11 MB each); re-paint them with the command above.
