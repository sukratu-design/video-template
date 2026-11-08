import {MsEdgeTTS, OUTPUT_FORMAT} from 'msedge-tts';
import fs from 'fs';
import {execFileSync} from 'child_process';
const V='hi-IN-MadhurNeural';
const L=[
 [0,3.9,"Karma isn't fate. In Sanskrit, it simply means action."],
 [4.15,8.85,"Every action leaves a trace, a संस्कार, like a seed pressed into the mind."],
 [9.1,13.85,"Impressions harden into habits, वासना, that shape what we do next."],
 [14.15,18.55,"Every seed we've ever sown is stored: संचित karma."],
 [19.05,28.75,"The sages use an archer. Arrows in the quiver: the store. The arrow already flying is प्रारब्ध. It must land. The arrow in your hand, आगामी, is still yours to choose."],
 [29.15,33.35,"In time, each seed ripens into fruit, फल…"],
 [34.1,37.65,"…sweet or bitter. This is the life we're living now."],
 [38.05,43.85,"And every fruit holds new seeds. Act, impression, tendency, act. The wheel turns, life after life."],
 [44.1,48.85,"As we shed worn clothes for new ones, the self moves on, carrying its seeds."],
 [49.2,54.55,"The गीता offers a way out: act fully, but let go of the fruit."],
 [55.1,60.85,"A seed roasted in the fire of knowledge looks the same, but it never sprouts again."],
 [61.15,66.65,"That is मोक्ष. Not the end of action, but the end of being bound by it."]
];
const dur=f=>parseFloat(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',f]).toString());
const parts=[];
for(let i=0;i<L.length;i++){
  const raw=`madhur2/raw${i}.mp3`, fit=`madhur2/fit${i}.mp3`;
  if(!fs.existsSync(raw)){
    const t=new MsEdgeTTS(); await t.setMetadata(V,OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const {audioStream}=t.toStream(L[i][2],{rate:'+10%'});
    const ws=fs.createWriteStream(raw); audioStream.pipe(ws); await new Promise(r=>ws.on('close',r));
  }
  const win=L[i][1]-L[i][0], d=dur(raw), tempo=Math.max(1,Math.min(1.3,d/(win-0.1)));
  execFileSync('ffmpeg',['-y','-v','error','-i',raw,'-filter:a',`atempo=${tempo.toFixed(4)}`,'-ar','48000','-ac','1',fit]);
  console.log(i,'win',win.toFixed(2),'raw',d.toFixed(2),'tempo',tempo.toFixed(3),'fit',dur(fit).toFixed(2));
  const st=Math.max(L[i][0],(parts.length?parts[parts.length-1][2]+0.12:0)); parts.push([fit,st,st+dur(fit)]); console.log('  start',st.toFixed(2),'cue',L[i][0],'end',(st+dur(fit)).toFixed(2));
}
const args=['-y','-v','error'];
parts.forEach(p=>args.push('-i',p[0]));
const fc=parts.map((p,i)=>`[${i}:a]adelay=${Math.round(p[1]*1000)}|${Math.round(p[1]*1000)}[a${i}]`).join(';')+';'+parts.map((_,i)=>`[a${i}]`).join('')+`amix=inputs=${parts.length}:normalize=0:duration=longest[o]`;
args.push('-filter_complex',fc,'-map','[o]','-t','67','-ar','48000','-b:a','160k','madhur2/vo_madhur.mp3');
execFileSync('ffmpeg',args);
console.log('done',dur('madhur2/vo_madhur.mp3'));
