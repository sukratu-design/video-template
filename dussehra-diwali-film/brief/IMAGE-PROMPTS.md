# Image prompts: the ten paintings

The film (`index.html`) shows ten generated paintings, `frames/b01.jpg` … `b10.jpg`, with a slow camera move each, dissolves between beats and handwritten captions from the measured voiceover. The earlier code-drawn version is kept as `index-drawn.html`.

## How they were made
- **Tool:** Higgsfield (claude.ai connector), model **GPT Image 2.6** (Sunburst), `quality: high`, `resolution: 2k`, 1:1. 2.75 credits per frame.
- **Reference:** `painted-film/assets/style-reference.png` attached to every frame as a *style* reference ("do not copy its subject").
- **Compared before choosing** (beats 4 and 9): Nano Banana Pro (closest to the reference's restraint, 2 credits), FLUX 3 (lavish, more devotional-print, slow, once failed, 3 credits). GPT Image 2.6 painted people best and was chosen. See `docs/PAINTED-FILM-HISTORY.md`.
- **Exported** as 2048² PNG and stored here as JPEG (`ffmpeg -q:v 6`).

## Lessons
- **No second (character) reference image.** Every job that attached a generated frame with people as a second reference was flagged by the content filter. Consistency comes from repeating the character descriptions word for word.
- **Fire ordeal:** "Sita standing among the flames" was flagged twice (likely as self-harm imagery). Beat 5 shows Sita walking serenely out from the sacred fire, which blazes behind her.
- **Rate limit:** about four GPT Image jobs at a time; submit in small groups. Flagged and rate-limited jobs are not charged.
- **Map (beat 7):** the first map made the peninsula a broad wedge. The re-roll names the real shape (long narrow triangle, straight west coast, east coast bulging at Odisha/Andhra, Sri Lanka off the south-east, Kishkindha near Hampi, Ayodhya NE of Prayag on the Sarayu) and passes the first map as a second reference to keep its decoration.
- **Headless Chromium** needs `--allow-file-access-from-files` (set in `render.mjs` and `stills.mjs`) or the images taint the canvas.

## Shared blocks
**Style (every frame):**
> The reference is a STYLE reference only (paper, pen line, washes, palette, period) - do not copy its subject. Early 19th-century Indian Company School watercolour album page (c. 1820). Figures in careful profile or three-quarter view, calm dignified expressions, fine pen-drawn features, botanical-album precision. Aged cream hand-made laid paper with chain lines, soft foxing, faint stains. Brown-black pen outlines with a slight hand tremor, delicate cross-hatching, transparent watercolour washes. Palette: pearl grey, pink, magenta, teal-blue, vermilion, ochre, umber, shell gold. Soft vignette fading into bare paper. Square 1:1; the painted sheet fills the square. Keep the top 12% and bottom 15% of the sheet as bare paper.

**Characters (natural warm brown skin tones, no blue skin):** Rama: young prince, dark topknot, pale cream striped jama, gold sash, pink shawl, tall recurved bow. Sita: rose-pink sari with a gold border, head modestly covered. Lakshmana: yellow jama, pink sash, bow and quiver. Bharata: lean, plain ochre ascetic robes, matted hair tied up. Vibhishana: dignified bearded prince, dark-green jama, jewelled turban. Hanuman: the vanara messenger in the traditional miniature manner, golden-brown fur, red dhoti, gold armlets, gold mace.

**Avoid (every frame):** any text, letters, numbers, signature or watermark; photorealism; 3D; glossy or neon colour; pure black; modern clothing; distorted faces, extra fingers.

## Scenes
1. **Victory:** Rama in profile has just released an arrow; across the field Ravana, in the traditional miniature manner with ten crowned heads and gold armour, sinks back beside his broken chariot. Spent arrows, a broken wheel, a fallen parasol; Lanka's palaces across a patterned sea; palms, crows, thin smoke. Top 22% bare (title).
2. **Calendar:** an astronomer-scholar's terrace; eleven moon discs in an arc from waxing gibbous to new moon with one clay lamp beneath it; a scholar in white reading a palm-leaf manuscript; astrolabe, ink pot, manuscripts; a toran of mango leaves and marigolds.
3. **Last rites:** Vibhishana, head bowed, lights Ravana's sandalwood pyre heaped with marigolds on Lanka's shore; priests chant; Rama stands apart with joined hands.
4. **Coronation:** a palace arcade with cusped arches; Vibhishana on a plain gold throne; Lakshmana pours sea water from a golden kalash over his head; attendants with a red parasol and fly-whisks; petals falling. (Rama is not present: per Valmiki he kept his vow not to enter a city during exile.)
5. **Fire ordeal:** Sita walks serenely forward from a stepped altar whose sacred fire blazes behind her like a halo; Rama and Lakshmana with joined hands; vanaras bow; the camp behind.
6. **Pushpaka:** the gilded winged chariot rises from Lanka carrying Rama, Sita, Lakshmana, Vibhishana and vanara companions; palaces, sailboats, a compass rose.
7. **Map:** an antique pictorial map of India with an accurate peninsula, the Setu to Sri Lanka, Kishkindha's hills, the Vindhyas, Prayag's confluence with the ashram, Ayodhya on the Sarayu; a dotted route with a tiny winged chariot. No lettering.
8. **Hanuman:** Hanuman leaps over the Ganga from the ashram toward Nandigram, where Bharata sits beside the throne holding Rama's sandals.
9. **Reunion:** Bharata kneels and slides the sandals onto Rama's feet; Rama raises him; Sita and Lakshmana behind; the chariot; townspeople with lamps; a banner with fourteen tally marks.
10. **Diwali:** Ayodhya's gate at night lined with oil lamps; ghats and floating lamps on the Sarayu; Rama, Sita and Lakshmana enter through the glowing gateway; a rangoli at the threshold. Top 18% bare (closing greeting).
