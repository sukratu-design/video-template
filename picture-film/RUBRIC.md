# Rubric: a film is done when all of this is true

Work down the list in order. Do not render the full film until every box in parts 1 to 4 is ticked. Copy the "Report" block at the end into your message to the user at each gate.

## 1. Script (before any audio or image is made)
- [ ] The title poses one question and the last spoken line answers it plainly.
- [ ] Every factual sentence has a source written next to it in `brief/SCRIPT.md`. Anything that is tradition rather than text is worded "tradition says" (or similar).
- [ ] If the script came from an AI draft or the user's memory, the claims were checked independently, and every change is listed under "Changes from the draft".
- [ ] No sentence over 22 words. No beat over 34 words. 150 to 170 words in total for about 80 s (scale in proportion).
- [ ] `node voiceover/vo.mjs <film> estimate` gives a length the user has agreed to.
- [ ] **GATE 1: the user has approved the beat table** (picture + narration per beat).

## 2. Voice
- [ ] `vo.mjs build` shows no TRANSCRIPT WARNING, and you have read the printed transcript of every chosen take against its caption (English words exact; Indic names plausibly spelled).
- [ ] Three takes per line; `vo.mjs build` shows no PACE WARNING (lines of 8+ words between 105 and 170 wpm; the accepted film runs 112 to 163, about 130 overall). If a line is outside, re-take or reword it. Never speed audio up.
- [ ] Indic names are in Devanagari in `say`, Latin in `captions`.
- [ ] **GATE 2: the user has listened to `vo.mp3`** and confirmed pace and pronunciation. You cannot hear it. Say so.

## 3. Paintings
- [ ] Two test paintings (one people-heavy beat, one unusual beat) were generated first and **the user approved the look (GATE 3)** before the rest were generated.
- [ ] Every prompt is the style block + character lines + scene + avoid block from `brief/PROMPTS.md`; the style and avoid blocks are unedited. Every person gets a character line, recurring or not. If a re-roll needs a character line changed, change it in the brief too and note why. The prompts are saved in the film's `brief/IMAGE-PROMPTS.md`.
- [ ] `node check.mjs <film>` reports 0 FAIL, and every WARN is either fixed or explained in the brief.
- [ ] **Look** at `qa/paintings.jpg` beside `golden/accepted.jpg` and `golden/rejected.jpg`, then answer in writing, per painting:
  1. With the sound off, could a viewer guess the line? (If not: re-roll with a clearer action.)
  2. Is it the same paper, pen line and palette as its neighbours?
  3. Are the characters recognisably the same people as in the other paintings (dress, colours, build)?
  4. Any lettering, border, mount, signature, extra limb, odd hand or foot, modern or cartoon face? (Crop and enlarge books, leaves, banners and signs: pseudo-script hides there.)
  5. Does anything contradict the source or the character sheet (who is present, skin tone, what they hold)?
  6. Is the top (and, for the first and last, the top fifth) bare paper? Is the bottom bare?
  7. Which rejected frame (R1 to R8) is it closest to, and is it clearly better than that one?
  8. Is it as rich as its nearest neighbour in `golden/accepted.jpg`, or is it sparse (few figures, empty sky)?
  9. Is the person or thing the line names in the middle half of the sheet, where the camera can reach it?
- [ ] Name the **weakest third of the paintings** (three of ten, at least one) and re-roll them. Keep every try in `frames/raw/` (not committed) and the old file in place until the new one is clearly better. Repeat once if the new weakest are still weaker than the golden set.

## 4. Film
- [ ] Every `cam` has a `why`, and looking at `qa/film-*.jpg` the start and end frames of each beat show what the `why` says.
- [ ] In no still does a caption or the title cover a face, a hand doing the action, or the thing the line names.
- [ ] No still shows a soft or malformed detail enlarged by the zoom.
- [ ] Pushes, pull-backs and pans alternate; the last beat ends wide.
- [ ] The cover (`qa/cover.jpg`) has the title on bare paper and reads at thumbnail size (view it at 200 px).
- [ ] Two scores with different lead instruments were generated; **the user chose one by ear (GATE 4)**. If only one score is allowed, generate one and say plainly that nobody has compared or heard it.

## 5. Render and delivery
- [ ] `node render.mjs <film>` ran in the background and finished; the mp4 length equals film + cover lead.
- [ ] Three stills pulled from the mp4 itself (start, middle, last second) look right.
- [ ] A compressed copy was sent to the user (`ffmpeg -i in.mp4 -c:v libx264 -crf 25 -c:a copy out.mp4`); no mp4 was committed.
- [ ] `vo.mp3`, `music.mp3`, `timing.js`, the paintings and the brief are committed so the film can be re-rendered exactly.
- [ ] `docs/PAINTED-FILM-HISTORY.md` has a short section on what this film taught, and anything that should change a rule was changed in `TASTE.md`, this file or `check.mjs`.

Keep the gate reports and Look answers in the `Log` section of the film's `brief/SCRIPT.md`, not in a separate file.

## Report block (use at every gate)
```
Film: <title>            Stage: <gate number and name>
Done since last gate: <one line each>
check.mjs: <n FAIL, n WARN; each WARN and what was done about it>
Weakest three: <painting numbers, why, re-rolled or kept>
Not verified: <what you could not check, e.g. you have not heard the audio>
Spent: <image and music credits so far>
Needs your decision: <the one question for this gate>
```

## Honesty rules
- Say what you did not check. "I have not heard the voiceover" is always true for you.
- If a painting is the best of three tries and still not right, say that and show it; do not present it as good.
- If the subject does not suit this style, say so at Gate 1.
