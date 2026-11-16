/* makar-sankranti: "Makar Sankranti, the festival that keeps its date". Trial film (dry run of the picture-film template).
   Edit this file only; see ../dussehra-diwali/content.js for a complete example. */
window.FILM = {
  title:   { text: 'Makar Sankranti', sub: 'the festival that keeps its date' },
  closing: { text: 'मकर संक्रांति', font: 'deva', credit: 'Sukratu Labs' },
  lead: 1.5, cover: 'frames/cover.jpg', xfade: 0.7,
  voice: { model: 'bulbul:v4-flash', speaker: 'shubh_en_narration', pace: 1.0, temperature: 0.35 },
  beats: [
    { image: 'frames/b01.jpg', cam: { from: [1.10, .545, .45], to: [1.00, .50, .50] }, why: 'settle from the moon side to the whole terrace',
      lines: [{ say: "Most Hindu festivals follow the moon, so their dates move. मकर संक्रांति stays near January 14.",
                captions: ["Most Hindu festivals follow the moon,", "so their dates move.", "Makar Sankranti stays near January 14."] }] },
    { image: 'frames/b02.jpg', cam: { from: [1.00, .50, .50], to: [1.10, .455, .455] }, why: 'push toward the lota and the rising sun',
      lines: [{ say: "It follows the sun. That day, the sun enters मकर, Capricorn.",
                captions: ["It follows the sun.", "That day, the sun enters Makara, Capricorn."] }] },
    { image: 'frames/b03.jpg', cam: { from: [1.12, .446, .50], to: [1.12, .554, .52] }, why: 'pan from Bhishma to the sun he waits for',
      lines: [{ say: "Tradition calls it उत्तरायण, the turn north. भीष्म waited for it on his bed of arrows.",
                captions: ["Tradition calls it Uttarayana, the turn north.", "Bhishma waited for it on his bed of arrows."] }] },
    { image: 'frames/b04.jpg', cam: { from: [1.07, .47, .53], to: [1.00, .50, .50] }, why: 'pull back from father and son to the kite-filled sky',
      lines: [{ say: "Kites fly in Gujarat. Its date holds because it follows the sun.",
                captions: ["Kites fly in Gujarat.", "Its date holds because it follows the sun."] }] }
  ]
};
