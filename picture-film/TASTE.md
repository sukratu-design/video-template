# Taste: the judgement calls, written down

`check.mjs` covers what can be measured. This file covers what cannot. Every rule here comes from a decision on one of the first three films; the reason is given so you can tell when a rule does not apply. Where a rule and your own eye disagree, say so to the user and show both, rather than quietly choosing.

## The film as a whole
- **One question, answered.** The title poses it ("Dussehra to Diwali"), the last spoken line answers it in plain words ("That is why there is a gap between Dussehra and Diwali."). If you cannot write that last line before the rest of the script, the film has no spine yet.
- **Calm.** Reverent, documentary, unhurried. No jokes, no hype, no exclamation marks, no "Did you know". The viewer should feel they are being shown an old album by someone who loves it.
- **Restraint is the style.** When unsure between more and less (more words, more zoom, more colour, more instruments), choose less. Three things were removed from the last film after review (sound effects, a caption effect, a synthesized score) and nothing was ever added.

## Script
- **Check every claim against the source before anyone hears it.** The draft for the last film said the epic explains the twenty-day gap. It does not; that is later tradition. The film says so, and that honesty became its best beat. For each factual sentence, write in the brief where it comes from. If a claim is tradition rather than text, the narration says "tradition says".
- **Do not take sides in contested readings.** Describe the event and its outcome ("returned her unharmed"), leave out the motive the draft supplied ("to prove her purity").
- **A line is something a person can say in one breath.** 8 to 22 words per sentence, one idea each. Short sentences in a row are good: "That count is later tradition. The Ramayana does not count the days. It gives an order of duties."
- **Name people the first time they matter and say who they are** ("Vibhishana, Ravana's brother").
- **End on a three-part line if the material allows** ("Victory first, then duty, then home."), then the answer line.
- **Budget:** 14 to 18 words per beat on average, 150 to 170 words in all for a film of about 80 s. Takes come out slower than estimates. Cut words, never speed the voice.
- Read the whole script aloud in your head once more looking only for a word that would make a devout viewer or a scholar wince. Fix that word.

## Paintings
- **Every painting answers "what is the narrator saying right now?"** A viewer with the sound off should be able to guess the line. A2 shows eleven moons because the line is about counting days.
- **People, not symbols.** The symbol-only version was accurate and was rejected as too basic. Show who the line is about, doing the thing the line says.
- **Gesture over face.** Faces are small and calm; meaning is carried by posture (kneeling, bowing, pouring, pointing, walking away).
- **One action per painting, two to six figures.** If the prompt needs "meanwhile" or "and also", it is two paintings.
- **Detailed middle, quiet edges.** The scene is a vignette fading into bare paper, with the top 12% and bottom 15% empty (top 20% on the first and last paintings, which carry the title and closing).
- **Same sheet, same hand.** One style block, word for word, on every prompt. Characters are described in the same words every time; that is the only consistency tool that works (a second reference image trips the content filter).
- **Light.** Daylight on cream paper by default. At most one night scene, as a soft-edged vignette, and it is usually the last.
- **Nothing written in the picture.** No lettering, labels or numerals. The image model cannot spell and captions do that job.
- **Accuracy lives in the prompt.** If the source says who was present, the prompt says so (Rama is absent from the coronation because of his vow). If geography matters, describe the real shape; "a map of India" gave a wedge.
- **Sensitive subjects.** Deities and revered figures are shown in the traditional manner of the period, with natural skin tones unless tradition is the point, dignified, never comic, never in distress. If a scene could read as violence or self-harm, reframe it to the moment after (Sita walking out of the fire, not standing in it).
- **Re-roll rather than accept.** A painting is wrong if it has: a strange hand or foot in the area the camera pushes toward, a face that looks modern or cartoonish, a figure whose skin or dress contradicts the character sheet, a border or mount, any lettering, or a mood that fights the line. Budget for re-rolling a third of the frames.

## Camera
- **Every move has a reason you can say in six words** (the `why` field): push toward the thing being named, pull back to reveal the whole when a thought resolves, pan along a movement in the painting, rise with something rising.
- **Start where the line starts and end where it ends.** If the line names Vibhishana and then Lanka, start on him and end wide.
- **Slow enough to be felt, not noticed.** Zoom between 1.00 and about 1.10 over a whole beat. The single exception is a journey across a map.
- **Alternate.** Push, pull, push, pan. Four pushes in a row feels like being marched.
- **Come to rest.** The last beat ends at zoom 1.0 on the whole painting, and holds there under the closing line.
- **Never push into the weakest part of a painting.** Zoom magnifies hands and faces.

## Words on screen
- Captions are the narration, verbatim, split where the voice pauses. Two lines at most.
- The title sits over bare paper on the first painting; the closing greeting over bare paper on the last. If the paper there is not bare, re-roll the painting; do not shrink or move the text.
- Latin spelling without diacritics in captions (Vibhishana, not Vibhīṣaṇa). Devanagari only for a closing greeting.

## Voice
- Indian-English narration, measured, warm (Sarvam `shubh_en_narration`). Indic names go to the TTS in Devanagari so they are pronounced correctly.
- 110 to 165 words a minute per line (name-heavy lines run slower), about 130 overall, with a breath of about 0.6 s between beats.
- A person listens before the render. You cannot hear; do not claim the voiceover is good. Report the numbers and ask.

## Score
- A generated acoustic piece in a raga that suits the hour and mood of the story, one lead instrument, tanpura, light tabla. It leaves room for a voice: "never busy".
- Structure follows the film: a short alap under the opening, a gentle lift through the middle, a resolution on Sa under the closing card.
- Generate two versions with different lead instruments and let the user choose by ear. Bansuri beat sitar last time.
- No sound effects.

## Cover
- The title on the painting with the most bare paper at the top, usually the last one. It is the first frame, so it is also the thumbnail.

## When this style is the wrong tool
A product launch, anything with UI, anything that needs motion inside the picture, anything comic. Use `launch-film/` or say so.
