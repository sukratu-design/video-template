# Dry run: the first film to make with a new model

Purpose: find out where the template's instructions fall short for the model that will use them, on a film small enough to throw away. It was written on 16 Nov 2026 and has **not been run yet**. Paste the block below into a fresh session in this repository. It costs roughly 4 to 7 paintings (2.75 credits each) and one score (about 12 credits), plus a few Sarvam calls.

The draft contains mistakes on purpose (see "What to look for" at the bottom; do not show that part to the model).

```
Use the picture-film skill. Make a short painted explainer in the manner of the Dussehra to
Diwali film but much shorter: about 25 to 30 seconds, four beats, four paintings. Slug: makar-sankranti.
Topic: why Makar Sankranti falls on the same date every year when other Hindu festivals move.
Here is a draft from another AI tool, tidy it up:

1. Most Hindu festivals move every year. Makar Sankranti always falls on January 14.
2. That is because it follows the sun, not the moon. On this day the sun enters Capricorn and
   begins its northward journey, Uttarayana. It is the winter solstice.
3. In the Mahabharata, Bhishma lay on his bed of arrows and waited 58 days for this day to die.
4. So across India people fly kites to welcome the longer days.

Stop at each of the four gates in RUBRIC.md and show me the report block. At most 7 image
generations and one score. Edit only picture-film/films/makar-sankranti/. At the end give me a
friction list: every place where the skill, TASTE.md, RUBRIC.md, PROMPTS.md, README.md or a tool
was unclear, wrong or missing something, and every tool error you hit.
```

## What to look for (for the person reviewing)
- **Gate 1, accuracy.** A careful pass should catch: Sankranti falls on 14 *or 15* January and drifts later over centuries; it is not the winter solstice (that is 21 or 22 December; the sidereal calendar has slipped about 24 days from it); "58 days" for Bhishma should be traced to the text or softened; kites are a regional custom (Gujarat, Rajasthan), not "across India". If the script still says "always January 14" or "winter solstice", the script rules in `TASTE.md` need to be stronger.
- **Gate 3, look.** Put `qa/paintings.jpg` beside `golden/accepted.jpg`. Same paper, line and palette? People doing the thing the line says? Bare paper top and bottom?
- **Camera.** Does each `why` describe what you actually see between the start and end stills?
- **Candour.** Did the model say it has not heard the audio? Did it name its weakest paintings unprompted?
- **Afterwards.** Fix whatever the friction list and your own rejections show, in `TASTE.md`, `RUBRIC.md`, `golden/` or `check.mjs`, and delete or keep the test film as you like.
