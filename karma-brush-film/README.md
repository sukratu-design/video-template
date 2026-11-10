# karma-brush-film: karma, painted in code with brushes and paint

**Status: first full cut (73.9 s, 1080×1080) out for review.** Voice: the approved karma narration (Sarvam `bulbul:v4-flash`, `shubh_en_narration`, `../painted-film/examples/vo-shubh-sarvam.mp3`). Music: placeholder, the bansuri track from `../dussehra-diwali-film/music.mp3`.

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

## The film (`film/`)
Each beat paints itself on, stroke by stroke, over the previous beat's finished painting, then holds with a slow camera drift. It opens on a 1.5 s cover (the evening painting with the title) so frame 0 works as the thumbnail, and ends on the same picture.
```bash
./film/build.sh karma-brush-film.mp4   # ~10 min on 4 cores: overlays, 13 clips (4 at a time), join, voice + music at -16 LUFS
SKIP_CLIPS=1 ./film/build.sh out.mp4   # re-mix audio only
SCALE=1 node film/clip.mjs 2           # quick half-size test of one beat
```
- `film/config.mjs`: beat starts `B[]` and caption cues (voiceover time), camera keyframes `K[]`, `LEAD`.
- `film/overlays.mjs`: renders the title, caption band and caption text once with Chromium (Pinyon Script).
- `film/clip.mjs`: paints one beat. The engine keeps a coverage map, so untouched canvas still shows the previous painting until strokes cover it.
- Pitfall: never put a `//` comment in the middle of the one-line statements in `clip.mjs`; it silently comments out the rest of the line (this blacked out a render).
