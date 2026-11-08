import fs from 'fs';
const key=fs.readFileSync(process.env.HOME+'/.sarvam.env','utf8').match(/SARVAM_API_KEY=(.+)/)[1].trim();
export async function tts(text,{model,speaker,lang='en-IN',pace=1.0,temperature=0.6,out}){
  const r=await fetch('https://api.sarvam.ai/text-to-speech',{method:'POST',headers:{'api-subscription-key':key,'Content-Type':'application/json'},body:JSON.stringify({text,language_code:lang,model,speaker,pace,temperature,speech_sample_rate:24000,output_audio_codec:'mp3'})});
  const j=await r.json();
  if(!r.ok||!j.audios){throw new Error(r.status+' '+JSON.stringify(j).slice(0,300))}
  fs.writeFileSync(out,Buffer.from(j.audios.join(''),'base64'));
}
if(process.argv[1].endsWith('sarvam.mjs')){
  const HI="Every action leaves a trace, a संस्कार, like a seed pressed into the mind. Impressions harden into habits, वासना, that shape what we do next. Every seed we've ever sown is stored: संचित karma. The arrow already flying is प्रारब्ध. It must land. The arrow in your hand, आगामी, is still yours to choose. A seed roasted in the fire of knowledge looks the same, but it never sprouts again. That is मोक्ष.";
  const V=[['bulbul:v3','aditya'],['bulbul:v3','ritu'],['bulbul:v3','shubh'],['bulbul:v4-flash','shubh_en_narration'],['bulbul:v4-flash','ritu_en_edtech']];
  for(const [model,speaker] of V){
    const out=`sarvam/s-${model.replace(':','')}-${speaker}.mp3`;
    try{await tts(HI,{model,speaker,out,pace:0.95});console.log('ok',out)}catch(e){console.log('ERR',model,speaker,e.message)}
  }
}
