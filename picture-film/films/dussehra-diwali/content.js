/* Worked example: "Dussehra to Diwali, the long way home" (the locked film in ../../../dussehra-diwali-film/).
   A film is this file + timing.js (written by voiceover/vo.mjs) + frames/ + vo.mp3 + music.mp3.
   Edit this file only; never hand-edit the engine for a new film. */
window.FILM = {
  title:   { text: 'Dussehra to Diwali', sub: 'the long way home' },
  closing: { text: 'शुभ दीपावली', font: 'deva', credit: 'Sukratu Labs' }, // font: 'deva' or 'script'
  lead: 1.5,                    // seconds the cover holds before the film (0 = no cover)
  cover: 'frames/cover.jpg',    // made with: node cover.mjs films/<slug> <beat number>
  xfade: 0.7,                   // dissolve between paintings
  voice: { model: 'bulbul:v4-flash', speaker: 'shubh_en_narration', pace: 1.0, temperature: 0.35 },

  /* One beat = one painting + one camera move + its narration.
     cam: from/to are [zoom, focusX, focusY] in image-normalised units (zoom 1 = image fills the frame).
     why: the reason for the move, in a few words. If you cannot say why, the move is wrong.
     lines[].captions: what appears on screen, split at natural pauses (Latin spelling).
     lines[].say: what the voice reads, with Indic terms in Devanagari (defaults to the captions joined). */
  beats: [
    { image: 'frames/b01.jpg', cam: { from: [1.00, .50, .50], to: [1.09, .58, .47] }, why: 'push toward Ravana as he is named',
      lines: [{ say: "दशहरा celebrates राम's victory over रावण. दिवाली celebrates his homecoming.",
                captions: ["Dussehra celebrates Rama's victory over Ravana.", "Diwali celebrates his homecoming."] }] },
    { image: 'frames/b02.jpg', cam: { from: [1.07, .50, .42], to: [1.00, .50, .50] }, why: 'settle out from the moons to the scholar and his book',
      lines: [{ say: "In the calendar, they sit about twenty days apart. That count is later tradition. The रामायण does not count the days. It gives an order of duties.",
                captions: ["In the calendar, they sit about twenty days apart.", "That count is later tradition.", "The Ramayana does not count the days.", "It gives an order of duties."] }] },
    { image: 'frames/b03.jpg', cam: { from: [1.00, .50, .52], to: [1.10, .52, .58] }, why: 'toward the pyre',
      lines: [{ say: "First, राम asked विभीषण, रावण's brother, to perform the last rites. Enmity, he said, ends with death.",
                captions: ["First, Rama asked Vibhishana, Ravana's brother,", "to perform the last rites.", "Enmity, he said, ends with death."] }] },
    { image: 'frames/b04.jpg', cam: { from: [1.10, .55, .42], to: [1.00, .50, .50] }, why: 'pull back from the pouring water to the whole court',
      lines: [{ say: "Then विभीषण was crowned king of लंका, as राम had promised.",
                captions: ["Then Vibhishana was crowned king of Lanka,", "as Rama had promised."] }] },
    { image: 'frames/b05.jpg', cam: { from: [1.00, .50, .50], to: [1.10, .60, .50] }, why: 'toward Sita',
      lines: [{ say: "सीता passed through fire, the अग्नि परीक्षा. अग्नि, the fire itself, returned her unharmed.",
                captions: ["Sita passed through fire, the Agni Pariksha.", "Agni, the fire itself, returned her unharmed."] }] },
    { image: 'frames/b06.jpg', cam: { from: [1.10, .40, .58], to: [1.04, .52, .44] }, why: 'rise with the chariot',
      lines: [{ say: "विभीषण gave them the पुष्पक विमान, a flying chariot, and they turned north.",
                captions: ["Vibhishana gave them the Pushpaka Vimana,", "a flying chariot, and they turned north."] }] },
    { image: 'frames/b07.jpg', journey: true, cam: { from: [1.55, .56, .80], to: [1.12, .50, .36] }, why: 'follow the route on the map from Lanka up to Ayodhya',
      lines: [{ say: "Over the bridge they had built, past किष्किंधा, to Sage भारद्वाज's ashram, where the गंगा and यमुना meet.",
                captions: ["Over the bridge they had built, past Kishkindha,", "to Sage Bharadwaja's ashram, where the Ganga and Yamuna meet."] }] },
    { image: 'frames/b08.jpg', cam: { from: [1.14, .36, .48], to: [1.14, .64, .50] }, why: 'pan with the leap, ashram to throne',
      lines: [{ say: "हनुमान raced ahead to tell भरत, who for fourteen years had kept राम's sandals on the throne.",
                captions: ["Hanuman raced ahead to tell Bharata,", "who for fourteen years had kept Rama's sandals on the throne."] }] },
    { image: 'frames/b09.jpg', cam: { from: [1.08, .55, .62], to: [1.00, .50, .50] }, why: 'pull back from the sandals to the reunion',
      lines: [{ say: "The fourteen years were over. The sandals were returned, and राम came home.",
                captions: ["The fourteen years were over.", "The sandals were returned, and Rama came home."] }] },
    { image: 'frames/b10.jpg', cam: { from: [1.07, .55, .55], to: [1.00, .50, .50] }, why: 'settle on the whole lit city for the close',
      lines: [{ say: "Tradition says अयोध्या lit lamps to welcome him. Victory first, then duty, then home.",
                captions: ["Tradition says Ayodhya lit lamps to welcome him.", "Victory first, then duty, then home."] },
              { say: "That is why there is a gap between दशहरा and दिवाली.",
                captions: ["That is why there is a gap between Dussehra and Diwali."] }] }
  ]
};
