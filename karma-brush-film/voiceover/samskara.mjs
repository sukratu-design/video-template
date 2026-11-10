// node voiceover/samskara.mjs : candidate re-takes of line 2 with different spellings of "saṃskāra" (Sarvam bulbul:v4-flash, shubh_en_narration)
import {tts} from '../../dussehra-diwali-film/voiceover/sarvam.mjs';
const V={A:'संस्कार',B:'संस्कारा',C:'सम्स्कार',D:'samskaara',E:'सम्स्कारा'};
for(const[k,w]of Object.entries(V))for(let t=0;t<2;t++){const out=`voiceover/takes/l1_${k}_t${t}.mp3`;
  try{await tts(`Every action leaves a ${w}, a seed pressed into the mind.`,{model:'bulbul:v4-flash',speaker:'shubh_en_narration',pace:1.0,temperature:0.35,out});console.log('ok',out)}catch(e){console.log('ERR',k,t,e.message)}}
