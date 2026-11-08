import {tts} from './sarvam.mjs';
import fs from 'fs';
fs.mkdirSync('shubh_t',{recursive:true});
// Indic terms in Devanagari for the TTS text only; captions keep Latin spelling.
const L=[
 "Once a year, on the darkest night of autumn, a whole country lights up.",
 "Diwali, दीपावली, means a row of lamps.",
 "The oldest tale begins in अयोध्या. A prince, राम, is sent to the forest for fourteen years.",
 "Fourteen monsoons. Fourteen winters. Then, at last, the road home.",
 "But the night he returns is the new moon, अमावस्या, and no one can see the way. So अयोध्या lights lamps, in every window, on every roof.",
 "A दिया is the simplest thing. Clay, oil, a cotton wick. Yet it is enough.",
 "At each doorstep, a रंगोली is drawn, a welcome in colour.",
 "Over five days, families clean, feast, and give. लक्ष्मी, they say, visits the brightest home.",
 "Every region tells it a little differently. The heart is the same.",
 "A flame loses nothing by lighting another. So light one, and pass it on."];
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
