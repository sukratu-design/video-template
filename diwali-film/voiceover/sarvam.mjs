import fs from 'fs';
const key=(process.env.SARVAM_API_KEY||(fs.existsSync(process.env.HOME+'/.sarvam.env')?fs.readFileSync(process.env.HOME+'/.sarvam.env','utf8').match(/SARVAM_API_KEY=(.+)/)[1]:'')).trim();
if(!key)throw new Error('SARVAM_API_KEY missing (env var or ~/.sarvam.env)');
export async function tts(text,{model,speaker,lang='en-IN',pace=1.0,temperature=0.6,out}){
  const r=await fetch('https://api.sarvam.ai/text-to-speech',{method:'POST',headers:{'api-subscription-key':key,'Content-Type':'application/json'},body:JSON.stringify({text,language_code:lang,model,speaker,pace,temperature,speech_sample_rate:24000,output_audio_codec:'mp3'})});
  const j=await r.json();
  if(!r.ok||!j.audios){throw new Error(r.status+' '+JSON.stringify(j).slice(0,300))}
  fs.writeFileSync(out,Buffer.from(j.audios.join(''),'base64'));
}
