# picture-film: painted explainer from generated paintings

A square (1080x1080, 30 fps) explainer of 60 to 90 s: eight to ten generated Company School paintings, a slow camera move on each, dissolves, handwritten captions timed to an Indian-English voiceover, a generated raga score, and a title cover as the first frame. Worked example and quality bar: `films/dussehra-diwali/` (the locked "Dussehra to Diwali" film; this engine reproduces it pixel for pixel).

**Read before making a film, in this order:** `TASTE.md` (the judgement calls), `golden/README.md` with its three images (what good and rejected look like), `RUBRIC.md` (the checklist and the four approval gates), `brief/PROMPTS.md` (prompt blocks and tool settings). The step-by-step is in the `picture-film` skill.

## Layout
```
index.html        the engine (do not edit for a new film)
check.mjs         measurable checks; a final render refuses to start if it fails
contact.mjs       review sheets: paintings.jpg, film-N.jpg, cover.jpg
stills.mjs        PNG stills at given times
cover.mjs         title on a painting -> frames/cover.jpg
render.mjs        frames -> mp4, voice + ducked score, -16 LUFS
voiceover/vo.mjs  estimate | takes | build  (writes vo.mp3 and timing.js)
new.mjs           scaffold films/<slug>/
films/<slug>/     content.js (hand-written), timing.js (generated), frames/, vo.mp3, music.mp3, brief/
golden/           accepted and rejected reference sheets
brief/            prompt blocks, brief template, style-reference.png
```
A film is data: `content.js` holds title, closing, beats (painting, camera, narration). `timing.js` is written from the measured voiceover. Nothing else changes per film.

## Commands
```bash
node new.mjs my-film
node voiceover/vo.mjs films/my-film estimate      # length from word counts, no API calls
node voiceover/vo.mjs films/my-film takes         # 3 Sarvam takes per line (SARVAM_API_KEY or ~/.sarvam.env)
node voiceover/vo.mjs films/my-film build         # picks takes, writes vo.mp3 + timing.js, prints wpm per line
node check.mjs films/my-film                      # FAIL / WARN list
node contact.mjs films/my-film                    # qa/paintings.jpg, qa/film-N.jpg, qa/cover.jpg
node stills.mjs films/my-film out 5 12.5 30 --guides
node cover.mjs films/my-film 10                   # cover from painting 10
FRAMES=60 START=30 STEP=10 node render.mjs films/my-film t.mp4   # quick silent sample
node render.mjs films/my-film                     # full render; run in the background (about 5 min)
```
Preview in a browser: `index.html?film=films/my-film` (add `&guides=1` for the title and caption zones, `&captions=0` to hide captions).

Playwright and Chromium are preinstalled in cloud sessions (never run `playwright install`). Elsewhere run `npm i` once here. ffmpeg is required.

## content.js in brief
- `beats[].cam`: `from` / `to` are `[zoom, focusX, focusY]`. Zoom 1 fills the frame; focus is clamped so the frame never leaves the painting, which means that at zoom 1.1 the focus can only travel from 0.45 to 0.55. To pan further, zoom in more. `journey: true` allows zoom up to 1.7 for a map or route.
- `beats[].why`: the reason for the move. Required.
- `beats[].lines[]`: `captions` (on screen, Latin spelling, split at pauses) and `say` (sent to the voice, Indic names in Devanagari). A beat can have two lines; they get a half-second gap.
- `beats[].hold`: extra seconds on a painting after its narration.
- `lead`: seconds the cover holds before the film; the audio is delayed by the same amount.

## Voice
`vo.mjs build` trims each take, shortens long pauses to 0.38 s, lays lines out with 0.6 s breaths between beats, and derives beat boundaries and caption cues from the audio. It picks the median-length take of three; to override, write `films/<slug>/voiceover/picks.json` as `{"3": 2}` (line 3, take 2) and build again. To redo one line: `vo.mjs <film> takes 3`. Takes are not committed; `vo.mp3` is.

## Score
`music.mp3` in the film folder is mixed under the voice automatically (sidechain-ducked, 2.5 s fade at the end). Generate it; see `brief/PROMPTS.md`. A score synthesized in code was tried and rejected.

## What this template cannot do
Motion inside a painting, lip-sync, UI or product shots, landscape or vertical formats. The earlier code-drawn style (no generated images) is `painted-film/` and `diwali-film/`.
