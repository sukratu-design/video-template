// usage: node new.mjs <slug>   creates films/<slug>/ with a content.js skeleton and a brief to fill in.
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/film.mjs';
const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error('usage: node new.mjs <slug>  (lowercase letters, digits, hyphens)');
const dir = path.join(ROOT, 'films', slug);
if (existsSync(dir)) throw new Error(dir + ' already exists');
mkdirSync(path.join(dir, 'frames'), { recursive: true }); mkdirSync(path.join(dir, 'brief'), { recursive: true });
copyFileSync(path.join(ROOT, 'brief', 'BRIEF-TEMPLATE.md'), path.join(dir, 'brief', 'SCRIPT.md'));
writeFileSync(path.join(dir, 'content.js'), `/* ${slug}. Edit this file only; see ../dussehra-diwali/content.js for a complete example. */
window.FILM = {
  title:   { text: 'Title', sub: 'subtitle' },
  closing: { text: 'Closing line', font: 'script', credit: 'Sukratu Labs' }, // font: 'script' (Latin) or 'deva' (Devanagari)
  lead: 1.5, cover: 'frames/cover.jpg', xfade: 0.7,
  voice: { model: 'bulbul:v4-flash', speaker: 'shubh_en_narration', pace: 1.0, temperature: 0.35 },
  beats: [
    { image: 'frames/b01.jpg', cam: { from: [1.00, .50, .50], to: [1.08, .55, .50] }, why: '',
      lines: [{ say: 'What the voice reads, Indic names in Devanagari.', captions: ['What appears on screen,', 'split where the voice pauses.'] }] },
  ]
};
`);
console.log(`created films/${slug}/. Next: fill in brief/SCRIPT.md, then content.js, then: node voiceover/vo.mjs films/${slug} estimate`);
