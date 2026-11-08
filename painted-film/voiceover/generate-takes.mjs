import {tts} from './sarvam.mjs';
import {execFileSync} from 'child_process';
const L=[
 "Karma isn't fate. In Sanskrit, it means action.",
 "Every action leaves a संस्कार, a seed pressed into the mind.",
 "Impressions harden into habits, वासना, that shape what we do next.",
 "Every seed we've ever sown is stored: it is called संचित karma.",
 "Picture an archer. Arrows in the quiver: the store. The arrow in flight, प्रारब्ध, must land. The arrow in hand, आगामी, is yours to choose.",
 "In time, each seed ripens into fruit, फल…",
 "…sweet or bitter. This is the life we're living now.",
 "Each fruit holds new seeds. Act, impression, tendency, act: the wheel turns.",
 "As we shed worn clothes, the self moves on, carrying its seeds.",
 "The गीता offers a way out: act fully, but let go of the fruit.",
 "A seed roasted in the fire of knowledge looks the same, but it never sprouts again.",
 "That is मोक्ष. Not the end of action, but the end of being bound by it."];
const paces=JSON.parse(process.argv[2]);const T=3;
for(let i=0;i<L.length;i++){
  for(let t=0;t<T;t++){
    const out=`shubh_t/l${i}_t${t}.mp3`;
    try{await tts(L[i],{model:'bulbul:v4-flash',speaker:'shubh_en_narration',pace:paces[i],temperature:0.35,out});}catch(e){console.log('ERR',i,t,e.message)}
  }
  console.log('line',i,'done');
}
console.log('ALLDONE');
