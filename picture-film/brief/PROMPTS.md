# Prompt blocks

Paste these unchanged. Only the **Scene** paragraph and the character sheet are written per film. Save the final prompts in the film's own `brief/IMAGE-PROMPTS.md`: one section per painting, the accepted prompt first, then a line per re-roll saying what was wrong and what was changed. Keep every raw try in `frames/raw/` (gitignored).

## Tool settings (Higgsfield connector)
- `generate_image`, `model: "gpt_image_2_6"`, `aspect_ratio: "1:1"`, `resolution: "2k"`, `quality: "high"`, `count: 1`. Confirm the parameter names with `models_explore` before the first call, and preflight once with `get_cost: true` (2.75 credits a frame when this was written).
- **Style reference:** attach `brief/style-reference.png` to every frame as the only reference image (`medias: [{ role: "image_references", value: <media id> }]`; the role name comes from `models_explore` and was `image_references` in November 2026). Upload it with `media_upload` / `media_confirm`; in the original account it already exists as media `7a05ab3e-cf47-4794-a9bf-a83f96841e4f`.
- **Never attach a second reference of generated people.** Every job that did was blocked by the content filter. Consistency comes from repeating the character sheet word for word. A second reference is fine for non-people (a map re-roll took the first map as reference).
- At most four jobs at once. Blocked and rate-limited jobs are not charged.
- Other models were compared and turned down for this look (see `golden/rejected.jpg`): Nano Banana (flat, doll-like), FLUX 3 (heavy, dark, devotional-print).
- Download the 2048 px PNG and store it as `frames/bNN.jpg` with `ffmpeg -i in.png -q:v 6 bNN.jpg`.

## Style block (every frame, first paragraph)
> Use the attached image only as a STYLE reference (paper, pen line, washes, palette, period); do not copy its subject. Early 19th-century Indian Company School watercolour album page (c. 1820). Figures drawn in careful profile or three-quarter view with calm, dignified expressions, fine pen-drawn features, detailed costume painted with botanical-album precision. Aged cream hand-made laid paper with chain lines, soft foxing spots and faint stains. Brown-black pen outlines with a slight hand tremor, delicate cross-hatching for shade, transparent watercolour washes that pool at their edges. Palette: pearl grey, pink and magenta, teal-blue, vermilion, ochre, umber, touches of shell gold. Scenery is a soft vignette that fades into bare paper. Calm, reverent, documentary mood. Square 1:1, the painted sheet fills the square. Keep the top 12% and bottom 15% of the sheet as bare paper.

For the first and last paintings change the last sentence to: "Keep the top 22% and bottom 15% of the sheet as bare paper."

Do not add "deckle edge", "on a mount", "framed" or "album page on a table": they produce a border that eats the frame (R1, R2).

## Character sheet (write once per film, reuse word for word)
One line per recurring person: age and build, hair, each garment with its colour, what they carry. State skin tone for everyone ("natural warm brown skin tones") and rule out what the model tends to do wrong. Example from the Dussehra film:

> Rama: a young prince with natural warm brown skin, dark hair in a topknot, a pale cream striped jama, a gold sash, a pink shawl, a tall recurved bow over his shoulder. Sita: a rose-pink sari with a gold border, head modestly covered. Lakshmana: a young prince in a yellow jama with a pink sash, bow and quiver. Bharata: lean, plain ochre ascetic robes, matted hair tied up. Vibhishana: a dignified bearded prince in a dark-green jama and jewelled turban. Hanuman: the vanara messenger in the traditional miniature manner, golden-brown fur, red dhoti, gold armlets, gold mace.

In each scene, include only the people who are in it, each with their full line.

## Scene paragraph (the part you write)
Pattern: **where**, then **who is doing what to whom** (the one action, in the order the eye should travel), then **three to five period details**, then **what is in the distance**, then any **layout note** (which side the action moves toward, where the empty space is).

Two complete examples that produced accepted frames:

> Scene: the coronation of Vibhishana in a palace arcade in Lanka, with cusped multifoil arches on fluted cream columns with gold capitals, pink curtains, hanging brass lamps and floral rosettes on the walls. Vibhishana, a dignified bearded king in a dark-green jama and jewelled turban, sits on a low gold throne on a patterned red carpet. Lakshmana, a young prince in a yellow jama with a bow on his shoulder, stands beside him pouring water from a brass kalash with mango leaves and a coconut over his head (abhisheka). Two attendants in white hold a red royal parasol (chhatra) with gold fringe and pearl tassels, and white fly-whisks. Through the arches: a patterned teal sea and Lanka's gold towers. A few marigold petals fall.

> Scene: the reunion at Nandigram at the end of the fourteen-year exile. Bharata, a lean prince in plain ochre ascetic robes with matted hair tied up, kneels on the ground and gently places a pair of carved wooden sandals (paduka) with gold toe-knobs onto the bare feet of Rama. Rama, a young prince in a pale striped jama with a gold sash, a dark topknot and a tall recurved bow over his shoulder, stands and bends forward to raise Bharata with one hand, tenderly. Behind Rama stand Sita, in a rose-pink sari with a gold border, head modestly covered, and Lakshmana, a young prince in a yellow jama with a bow and quiver. Behind them on a ground wash rests a gilded flying chariot with pearl-grey wings and a red-pillared pavilion. On the right, a small pillared pavilion with an empty gold throne, and a few townspeople in white with garlands and small brass lamps, watching with folded hands. A hanging cloth banner on the pavilion shows fourteen ink tally marks, the last one in vermilion. Ayodhya's walls faint in the distance; flowering shrubs and a shade tree.

Notes on writing scenes:
- Verbs of gesture ("kneels", "bends forward to raise", "pours") do more than adjectives of feeling.
- Name objects with their period word and a gloss: "kalash", "chhatra", "paduka".
- For a map: describe the real coastline and where each place sits; ask for "no lettering".
- For night: "a night scene as a soft-edged vignette on the same cream paper".
- Place the subject of the line: "the central figure stands in the middle of the sheet". The camera cannot reach the edges.
- If the first try is sparse, add onlookers and two or three more period objects, and ask for the scene to fill the middle 60% of the sheet's height.
- Books and manuscripts: add "pages shown blank or with plain ruled lines, no script".
- If a scene is blocked by the filter, move to the moment after the dangerous one, and say what the figure is doing calmly.

## Avoid block (every frame, last paragraph)
> Avoid: any text, letters, numbers, signature or watermark; a border, mount or frame; photorealism; 3D render; glossy or neon colours; pure black; full-bleed dark background; anime or cartoon style; modern clothing; distorted faces, extra fingers or malformed feet.

## Score (Higgsfield `generate_audio`)
`model: "elevenlabs_music_v2_5"`, `duration: <film length in seconds, without the cover lead>`, `force_instrumental: true`. Cost scales with length: 4.4 credits for 30 s, about 12 for 84 s. Generate two with different lead instruments and let the user choose. The prompt that produced the chosen score of the Dussehra film (change the raga, mood and timings to suit; keep the structure and the last two sentences):

> Uplifting, luminous Indian classical instrumental led by BANSURI (bamboo flute) for a festive Diwali story film; background score under a spoken narration. Raga Yaman (evening raga, tivra Ma), joyful and devotional. The bansuri carries the melody throughout with breathy tone, meend glides and gentle ornaments; soft sitar and santoor answer and accompany underneath; tanpura drone throughout; tabla in a gentle teentaal (madhya laya, about 90 bpm). Structure: 0-10 s a short, hopeful bansuri alap over tanpura; 10-70 s the tabla enters and the bansuri rises into a bright, warm, uplifting gat with growing energy but never busy, leaving space for a voice; 70-84 s a radiant, celebratory resolution where the bansuri settles and ends on Sa over a sustained tanpura and a soft santoor shimmer. Warm, acoustic, intimate concert sound, no vocals, no electronic drums, no synth pads, no Western orchestra.

Choosing a raga: Yaman or Bhupali for evening and celebration, Bhairav or Ahir Bhairav for dawn and solemnity, Desh for longing and monsoon, Bhairavi for a gentle close. Say the hour and mood in words as well; the model follows the description more than the name.
