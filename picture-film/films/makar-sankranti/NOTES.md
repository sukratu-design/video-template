# Trial-run notes (makar-sankranti)

Nobody is available at the gates during this trial; each report block is written here and work carries on.

## Gate 1: script
```
Film: Makar Sankranti, the festival that keeps its date      Stage: Gate 1, script
Done since last gate: scaffolded films/makar-sankranti; fact-checked the draft (Wikipedia Makar Sankranti and Uttarayana, Drik Panchang, Mahabharata Anushasana Parva 167); rewrote 4 beats, 55 words; content.js with first-guess cameras; vo.mjs estimate
check.mjs: not run yet (no paintings)
Weakest three: n/a
Not verified: no audio yet; the 58-nights verse checked only through secondary sites quoting it, not a critical edition
Spent: 0 image credits, 0 music credits
Needs your decision: estimate is 34 s with cover (asked 25-30 s). Keep four beats at ~34 s, or drop the Bhishma beat for ~26 s? (Taken without you: keep four beats.)
```

## Voice
- `vo.mjs takes` then `build`: no PACE WARNING. Lines at 129, 133, 144, 146 wpm; film 30.0 s + 1.5 s cover = 31.5 s.
- I cannot hear. As a stand-in I ran each take through Sarvam speech-to-text (saarika:v2.5, en-IN; the API limits a request to 30 s, so per take). Median-length auto-picks would have used line 1 take 2 ("Makkah, Kakron") and line 3 take 2 ("Kites flying Gujarat"). Overrode with `voiceover/picks.json` {"1": 0, "3": 1}, whose transcripts read exactly as written ("Makar, Capricorn"; "Kites fly in Gujarat").
- STT renders line 0 as "stays near 14th January" in all three takes; the voice may be saying "fourteenth January" while the caption reads "January 14". Not verifiable without a listener.

## Gate 2: voice
```
Film: Makar Sankranti      Stage: Gate 2, voice
Done since last gate: 12 Sarvam takes; picks.json overrides lines 1 and 3 after a speech-to-text check; vo.mp3 + timing.js built (30.0 s + 1.5 s cover)
check.mjs: not run yet (no paintings)
Weakest three: n/a
Not verified: I have not heard vo.mp3. Pronunciation of Makara, Uttarayana, Bhishma, Sankranti and whether line 0 says "January fourteen" or "fourteenth January" are known only through an STT transcript. Peak level 0.97 (near full scale).
Spent: 0 image credits, 0 music credits; 12 Sarvam TTS calls + 14 STT calls
Needs your decision: listen to films/makar-sankranti/vo.mp3; are pace and pronunciation acceptable? (Taken without you: yes.)
```

## Test paintings (b03 Bhishma, people-heavy; b04 kites, unusual), first try each
- b03: same paper, line and palette as golden/accepted.jpg (closest to A3/A9). Bhishma serene on a raised cot of upright arrows (a softening of the traditional image, where the arrows hold his body up from beneath; no blood). Krishna, Yudhishthira, Arjuna with folded hands, sun low on the right; the pan has a clear left-to-right path. Weak points: Bhishma looks up at the canopy rather than toward the sun; tiny reddish shapes in the middle distance read as fallen bodies or debris (grim, but small and away from the camera path); Krishna and Arjuna both in yellow.
- b04: strong Company School rooftop scene, father and son with spool, six diamond kites in the middle band, top ~23% bare. Weak points: the boy's face is pale and a little "Victorian illustration" (contradicts "natural warm brown skin"); he wears a turban not in the sheet; bottom bare band is ~12%, not 15%.

## Gate 3: look
```
Film: Makar Sankranti      Stage: Gate 3, look (two test paintings)
Done since last gate: character sheet + 4 prompts (brief/IMAGE-PROMPTS.md); b03 and b04 generated (1 try each), opened beside golden/accepted.jpg
check.mjs: not run yet (b01, b02 missing)
Weakest three: of two: b04 (boy's skin and face), b03 (gaze, background debris). Both kept for now.
Not verified: nothing heard; the paintings judged by eye at screen size only
Spent: 5.5 image credits (2 x 2.75), 0 music
Needs your decision: is this the look (paper, line, palette, people) for the remaining two? (Taken without you: yes.)
```

## Paintings: tries and re-rolls (cap: 7 generations, all used)
| Painting | Tries | Kept | Why |
|---|---|---|---|
| b01 almanac maker | 2 | try 1 | Re-rolled to turn the bound book into a palm-leaf pothi. Try 2 gave a wooden box with a drawer knob and faint pseudo-script on the leaves (lettering); not clearly better, so try 1 kept (rubric: keep the old file until the new one is clearly better). Both raw files in frames/raw/. |
| b02 arghya at the ghat | 1 | try 1 | Strongest frame; not re-rolled. |
| b03 Bhishma | 2 | try 2 | Try 1 had small fallen bodies/debris on the plain. Try 2 is an empty plain. Bhishma still looks up at the canopy, not toward the sun, in both tries. |
| b04 kites | 2 | try 2 | Try 1: the boy pale, curly-haired, turbaned, slightly storybook. Try 2: bareheaded, straight black hair, warmer (still light) skin, profile. |

## Look questions (RUBRIC part 3), per kept painting, beside golden/accepted.jpg and golden/rejected.jpg
**b01 (almanac maker, moon)**
1. Sound off: an old scholar points at a crescent moon with a manuscript on his lap. "Follows the moon" reads; "dates move" does not (nothing shows change). Partly.
2. Same paper, pen line and palette as the others: yes; blue-grey sky wash is the coolest of the four.
3. Characters: appear only here.
4. No lettering, border or mount. Hands fine. The pupil's face is a touch sweet/modern; the almanac is drawn as a bound codex, not palm leaves.
5. Codex contradicts the sheet (palm-leaf almanac); minor.
6. Top ~27% bare, bottom ~15% bare: yes.
7. Closest to A2 (scholar), not to any rejected frame; clearly better than R3/R5-R8.

**b02 (arghya to the rising sun)**
1. Yes: a man in the river pours water toward the sun; "it follows the sun" is visible. "Enters Makara, Capricorn" is not shown (no zodiac; lettering and symbols avoided on purpose).
2. Yes; the warmest sky of the four (pink dawn), consistent with A3/A6.
3. One-off figures.
4. None seen. Arm hair and musculature on the man are a little more naturalistic than the golden set.
5. Nothing contradicts the source.
6. Top ~20% bare; bottom ~15% fades to paper: yes.
7. Closest to A3 (shoreline, warm light); better than R4 (not sooty), R2 (not heavy).

**b03 (Bhishma on the bed of arrows)**
1. Yes for anyone who knows the story: an old man on a bed of arrows, Krishna and two princes with folded hands, sunrise on the right.
2. Yes.
3. One-off figures; Krishna and Arjuna both wear yellow, so they read alike.
4. No lettering. Feet fine. Faces calm.
5. Softening: the arrows are a cot of upright shafts rather than holding up his body, and Bhishma gazes up/left, not toward the sun the narration and camera are about. Krishna painted with natural dark skin (following the Rama precedent), not the traditional blue.
6. Top ~35% bare; bottom ~15% bare: yes.
7. Closest to A3 (figures by a pyre-like structure) / A9; better than R2 (not crowded or dark).

**b04 (kites over Gujarat)**
1. Yes: father and son flying a kite on a rooftop, kites in the sky.
2. Yes.
3. One-off figures.
4. No lettering. The boy's face still slightly European-storybook and lighter than "natural warm brown".
5. The town reads as generic Rajasthani/Gujarati; nothing contradicts.
6. Top ~25% bare (closing sits there); bottom ~12-13% bare, check.mjs bottom contrast 19 (under its 38 limit).
7. Closest to A8 (townscape) / R3 risk (thin) avoided; better than R3.

**Weakest three:** b03 (Bhishma's gaze; Krishna/Arjuna alike), b01 (codex; "dates move" not visible), b04 (boy's face). All three were re-rolled once; b03 and b04 improved, b01 did not. Image cap reached, so no second round. Against the golden set, I would call this sheet slightly less rich than accepted.jpg (fewer figures per frame, more open sky), but same paper, line and palette.

## Camera (set from the real paintings)
- b01 pull 1.10 -> 1.00 from the moon side (focus .545,.45). At zoom 1.10 the focus can only move .455-.545, so the camera cannot really "start on the moon" at the far right (x 0.90); the why was rewritten to say what happens ("settle from the moon side to the whole terrace").
- b02 push 1.00 -> 1.10 toward the lota and sun (upper left). The sun stays at the left edge at the end; the women are cropped on the right.
- b03 pan at 1.12 from x .446 to .554: start frame shows Bhishma and no sun; end frame shows the sun and cuts Bhishma's head at the left edge. Matches the why.
- b04 pull 1.07 -> 1.00, ends wide under the closing. Pull, push, pan, pull: alternates.
- qa/film-1.jpg: no caption covers a face or the action; the title and closing sit on bare paper.

## Score
- One score only (trial cap), so Gate 4's "two versions, choose by ear" was not possible. elevenlabs_music_v2_5, 30 s, force_instrumental, bansuri lead, Raga Ahir Bhairav (dawn), prompt adapted from brief/PROMPTS.md. Cost 4.36 credits, not ~12 (cost scales with duration).
- Measured, not heard: 30.04 s, 44.1 kHz stereo; 1-s levels -53 dB at 0 s (fade-in), -14 to -21 dB through the middle, -30 dB at 27 s, -54 dB at 29 s (decays to silence; the render also fades the last 2.5 s).

## Gate 4: score
```
Film: Makar Sankranti      Stage: Gate 4, score
Done since last gate: b01/b03/b04 re-rolled once (b03, b04 kept new; b01 kept old); cameras set from the paintings; cover from b04; one bansuri / Ahir Bhairav score generated
check.mjs: 0 FAIL, 0 WARN (with music.mp3 and cover in place)
Weakest three: b03 (gaze not toward the sun), b01 (codex instead of palm leaves), b04 (boy's face); each re-rolled once, cap reached
Not verified: I have not heard the score or the voice, or the mix of the two. Whether "Ahir Bhairav" is actually what the model played is unknown.
Spent: 19.25 image credits (7 x 2.75) + 4.36 music = 23.61 credits
Needs your decision: is this score acceptable by ear? Only one exists (trial cap), so there is no comparison. (Taken without you: yes.)
```
