'use strict';
(function(){
const SR=44100,DUR=84.0;
function mulberry32(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(v){let h=2166136261>>>0;for(const c of String(v)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v))}

async function renderWav(){
  const ctx=new OfflineAudioContext(1,SR*DUR,SR);
  const master=ctx.createGain();master.gain.value=.72;master.connect(ctx.destination);
  // tanpura drone Sa Pa
  const drone=ctx.createGain();drone.gain.value=.22;drone.connect(master);
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;filter.Q.value=1.4;filter.connect(drone);
  for(const freq of [130.81,196.0,261.63]){ // Sa Pa Sa
    const osc=ctx.createOscillator();osc.type='sawtooth';osc.frequency.value=freq;osc.detune.value=(freq===196?7:-3);
    const g=ctx.createGain();g.gain.value=freq===196?.12:.16;
    osc.connect(g);g.connect(filter);osc.start(0);osc.stop(DUR);
    // slow filter sweep
  }
  const lfo=ctx.createOscillator();lfo.frequency.value=.07;const lg=ctx.createGain();lg.gain.value=320;lfo.connect(lg);lg.connect(filter.frequency);lfo.start(0);lfo.stop(DUR);
  // jvari buzz
  const buzz=ctx.createOscillator();buzz.type='square';buzz.frequency.value=261.63;buzz.detune.value=14;const bg=ctx.createGain();bg.gain.value=.035;buzz.connect(bg);bg.connect(drone);buzz.start(0);buzz.stop(DUR);

  // no sound effects: drone only (the user asked for SFX to be removed)
  // gentle fade for the closing wish
  master.gain.setValueAtTime(.72,81.0);master.gain.linearRampToValueAtTime(.0,83.9);

  const buffer=await ctx.startRendering();
  // encode WAV
  const samples=buffer.getChannelData(0);
  const num= samples.length;
  const buf=new ArrayBuffer(44+num*2);
  const view=new DataView(buf);
  function writeStr(o,s){for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i))}
  writeStr(0,'RIFF');view.setUint32(4,36+num*2,true);writeStr(8,'WAVE');writeStr(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,SR,true);view.setUint32(28,SR*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeStr(36,'data');view.setUint32(40,num*2,true);
  let off=44;for(let i=0;i<num;i++){const v=Math.max(-1,Math.min(1,samples[i]));view.setInt16(off,v<0?v*0x8000:v*0x7FFF,true);off+=2}
  return new Blob([buf],{type:'audio/wav'});
}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
window.KarmaAudio={renderWav,download:async(name='audio.wav')=>{const b=await renderWav();downloadBlob(b,name);return b}};
})();
