---
name: picture-film
description: Make a square painted explainer film (60-90 s) from generated Company School paintings with camera moves, handwritten captions, Indian-English voiceover and a raga score, using this repo's picture-film template. Use when asked for a video "like the Dussehra to Diwali film", a painted/miniature explainer with people in it, or a festival or history explainer for social media.
---

# Picture film

Template: `picture-film/`. The quality bar is the locked film in `picture-film/films/dussehra-diwali/`. Your job is to reach that bar through the process below, not to redesign the format.

## Before anything else
Read, in order: `picture-film/TASTE.md`, `picture-film/golden/README.md` (and open its three images), `picture-film/RUBRIC.md`, `picture-film/brief/PROMPTS.md`, `picture-film/README.md`, and `picture-film/films/dussehra-diwali/content.js` with its `brief/SCRIPT.md`. Skim `docs/PAINTED-FILM-HISTORY.md` for pitfalls.

## How to work
- **Stop at the four gates in `RUBRIC.md` and wait for the user.** Script, voice, look, score. Most of the quality of the earlier films came from the user rejecting things at those points. Do not skip a gate because you are confident. If the user has said in advance to run without stopping, still post the report block at each gate and carry on.
- **Edit only `films/<slug>/`.** If the engine cannot do something the film needs, tell the user before touching `index.html`.
- **Look at your own output.** After every batch of paintings and every camera change, run `contact.mjs` and open the sheets. Never describe an image you have not opened.
- **Be plain about what you have not verified,** above all the audio.
- When unsure between more and less, choose less.

## Steps
1. **Brief.** `node new.mjs <slug>`. Fill in `films/<slug>/brief/SCRIPT.md`: the question, the answer line, the beat table, a source for every factual sentence, changes from the draft. Check claims against the source text yourself (search if you can); an AI draft or a confident memory is not a source. Rubric part 1. **Gate 1.**
2. **Content.** Write `content.js`: title, closing, beats with `captions`, `say` (Devanagari for Indic names), a first-guess `cam` and its `why`. `node voiceover/vo.mjs films/<slug> estimate` and tell the user the length.
3. **Voice.** `vo.mjs takes`, then `build`. Fix any PACE WARNING by re-taking or rewording. Send the user `vo.mp3`. **Gate 2.**
4. **Two test paintings.** Write the character sheet. Build prompts from the blocks in `brief/PROMPTS.md`. Generate the hardest people-heavy beat and the most unusual beat. Open them next to `golden/accepted.jpg`. Show the user. **Gate 3.**
5. **The rest of the paintings,** four at a time. Save prompts in `brief/IMAGE-PROMPTS.md`. Run `check.mjs` and `contact.mjs`; answer the seven Look questions per painting in writing; name and re-roll the three weakest.
6. **Camera.** With the real paintings in place, set each `cam` from what is actually in the picture (where the named subject is, where the weak details are). Run `contact.mjs` again and check start and end frames against each `why`.
7. **Cover.** `node cover.mjs films/<slug> <painting number>`; open `qa/cover.jpg`.
8. **Score.** Two generated versions with different lead instruments. Send both. **Gate 4.** Save the chosen one as `music.mp3`.
9. **Render.** `node render.mjs films/<slug>` in the background. Pull three stills from the mp4 and look. Send a compressed copy. Rubric part 5.
10. **Close out.** Commit the film folder (not the mp4, takes or qa sheets). Add what the film taught to `docs/PAINTED-FILM-HISTORY.md`; if the user rejected something for a reason that will recur, add it to `TASTE.md`, `RUBRIC.md`, `golden/` or `check.mjs` so the next film starts from it. Update the Notion hub as `CLAUDE.md` asks.

## Hard rules
- Render forward only. Never commit API keys or mp4s. One render at a time.
- Tempo stays at 1.0. Cut words instead.
- No lettering inside paintings. No second reference image of people.
- Costs: about 2.75 credits a painting and 12 a score. Preflight with `get_cost`, expect a third of the paintings to be re-rolled, and report the total at each gate.
