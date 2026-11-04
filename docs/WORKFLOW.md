# Workflow: making a new film from `launch-film/`

## 1. Brief (ask only for what's missing)
- **Brand:** name, URL/CTA, accent + deep accent colours, wordmark (transparent PNG/SVG), and a brand serif if any.
- **Story beats**, in the template's shape:
  - hook line
  - the chaos: calendar items and 5 notifications
  - 4-word problem caption
  - one stat
  - tagline
  - the prompt the product answers
  - 5 plan steps (Mon–Fri)
  - 2 proof tags
  - 4-word end line
- **Music:** a 30 s track. Otherwise keep the template audio as a labelled placeholder.

## 2. Set up
```bash
cp -r launch-film <new-film>    # or work on a branch
cd <new-film> && npm i
```

## 3. Edit `content.js`
- Keep to the length limits in `launch-film/README.md`.
- `cards` are `[id, day, hour, colour, name, time, tallPx?, xNudge?]`.
- `finalSlots` maps the kept card ids to `[day, hour, xNudge?, tallPx?]`. Any id missing from `finalSlots` is thrown off the board as noise.
- Update `chaosBoard.requests` to match the card count.
- Put the wordmark in `assets/` and set `brand.wordmark`. Set `brand.audio`.

## 4. QA with stills (fast)
```bash
node render.js --stills=2,6,7.3,10.8,15.8,19.6,23.8,27,29.5
node render.js --vertical --stills=2,6,7.3,10.8,15.8,19.6,23.8,27,29.5
```
Check:
- Nothing is clipped or overflowing.
- Captions, the stat and the end line wrap cleanly in 9:16.
- The wordmark is sharp.
- Thrown cards leave the frame.

## 5. Render
```bash
node render.js film-16x9.mp4              # ~3–4 min
node render.js film-9x16.mp4 --vertical   # ~3–4 min
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of compact film-9x16.mp4
```
Expect duration 30.0, the correct resolution, and an audio stream present.

## 6. Reels safe-zone check (9:16)
This overlays the zones Instagram covers on four key frames. Key text must sit outside the red areas.
```bash
ffmpeg -v error -y -i film-9x16.mp4 -vf "select='eq(n\,186)+eq(n\,700)+eq(n\,725)+eq(n\,880)',scale=360:-1,drawbox=x=0:y=ih*0.844:w=iw:h=ih*0.156:color=red@0.25:t=fill,drawbox=x=iw*0.88:y=ih*0.55:w=iw*0.12:h=ih*0.3:color=red@0.25:t=fill,tile=4x1:padding=6:color=white" -frames:v 1 safe-check.png
```

## 7. Comparing against a reference video (when recreating one)
Use exact frame numbers, not `fps=1` sheets, which drift by about 0.5 s:
```bash
ffmpeg -i ref.mp4 -i out.mp4 -filter_complex "[0:v]select='eq(n\,300)+eq(n\,450)',scale=480:-1,tile=1x2[a];[1:v]select='eq(n\,300)+eq(n\,450)',scale=480:-1,tile=1x2[b];[a][b]hstack" -frames:v 1 cmp.png
```

## 8. Deliver
- Send both mp4s to the user. Don't commit them.
- Flag any placeholders still in use: the keyed wordmark, the template audio, the Fraunces serif.
