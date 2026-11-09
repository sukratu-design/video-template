import {tts} from './sarvam.mjs';
import fs from 'fs';
fs.mkdirSync('shubh_t',{recursive:true});
// Indic terms in Devanagari for the TTS text only; captions keep Latin spelling.
const L=[
 "दशहरा celebrates राम's victory over रावण. दिवाली celebrates his homecoming.",
 "In the calendar, they sit about twenty days apart. That count is later tradition. The रामायण does not count the days. It gives an order of duties.",
 "First, राम asked विभीषण, रावण's brother, to perform the last rites. Enmity, he said, ends with death.",
 "Then विभीषण was crowned king of लंका, as राम had promised.",
 "सीता passed through fire, the अग्नि परीक्षा. अग्नि, the fire itself, returned her unharmed.",
 "विभीषण gave them the पुष्पक विमान, a flying chariot, and they turned north.",
 "Over the bridge they had built, past किष्किंधा, to Sage भारद्वाज's ashram, where the rivers meet.",
 "हनुमान raced ahead to tell भरत, who for fourteen years had kept राम's sandals on the throne.",
 "The fourteen years were over. The sandals were returned, and राम came home.",
 "Tradition says अयोध्या lit lamps to welcome him. Victory first, then duty, then home."];
const paces=JSON.parse(process.argv[2]||'[]');const T=3;
const only=process.argv[3]?process.argv[3].split(',').map(Number):L.map((_,i)=>i);
await Promise.all(only.map(async i=>{
  for(let t=0;t<T;t++){
    const out=`shubh_t/l${i}_t${t}.mp3`;
    for(let k=0;k<3;k++){try{await tts(L[i],{model:'bulbul:v4-flash',speaker:'shubh_en_narration',pace:paces[i]??1.0,temperature:0.35,out});break}catch(e){console.log('ERR',i,t,e.message.slice(0,120));await new Promise(r=>setTimeout(r,1500))}}
  }
  console.log('line',i,'done');
}));
console.log('ALLDONE');
