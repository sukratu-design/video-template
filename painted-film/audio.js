'use strict';
(function(){
const SR=44100,DUR=68;
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

  // bell shimmer on sparks
  function bell(t,freq=.8){const o=ctx.createOscillator();o.type='sine';o.frequency.value=freq*1000;const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+2.4);o.connect(g);g.connect(master);o.start(t);o.stop(t+2.5);const o2=ctx.createOscillator();o2.type='triangle';o2.frequency.value=freq*1500;o2.connect(g);o2.start(t);o2.stop(t+2.5)}
  for(const t of [2.8,4.0,65.6])bell(t);

  // clay tok on hard cuts
  const cuts=[0,4,9,14,19,29,34,38,44,49,55,61,65];
  for(const t of cuts){const o=ctx.createOscillator();o.type='square';o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(180,t+.09);const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.22,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.13);o.connect(g);g.connect(master);o.start(t);o.stop(t+.14);const n=ctx.createBufferSource();const b=ctx.createBuffer(1,Math.floor(SR*.05),SR);const d=b.getChannelData(0);const r=mulberry32(hash(t));for(let i=0;i<d.length;i++)d[i]=(r()*2-1)*Math.exp(-i/ (SR*.012));n.buffer=b;const ng=ctx.createGain();ng.gain.value=.15;n.connect(ng);ng.connect(master);n.start(t)}
  // arrow whoosh during the slowed archer analogy
  {const n=ctx.createBufferSource();const b=ctx.createBuffer(1,SR*5.2,SR);const d=b.getChannelData(0);const r=mulberry32(5050);for(let i=0;i<d.length;i++)d[i]=r()*2-1;n.buffer=b;const filt=ctx.createBiquadFilter();filt.type='bandpass';filt.frequency.setValueAtTime(250,22);filt.frequency.exponentialRampToValueAtTime(2200,24.5);filt.frequency.exponentialRampToValueAtTime(400,27);filt.Q.value=4;const g=ctx.createGain();g.gain.setValueAtTime(0,22);g.gain.linearRampToValueAtTime(.18,23);g.gain.linearRampToValueAtTime(0,27.2);n.connect(filt);filt.connect(g);g.connect(master);n.start(22);n.stop(27.2)}
  // fire crackle 55-61
  {const r=mulberry32(7070);for(let i=0;i<90;i++){const t=55+r()*6;if(t>61)continue;const n=ctx.createBufferSource();const len=.04+r()*.08;const b=ctx.createBuffer(1,Math.floor(SR*len),SR);const d=b.getChannelData(0);for(let j=0;j<d.length;j++)d[j]=(r()*2-1)*Math.exp(-j/(SR*.006));n.buffer=b;const g=ctx.createGain();g.gain.value=.05+r()*.12;n.connect(g);g.connect(master);n.start(t)}}
  // fade near-silence for moksha, then leave a quiet closing tail
  master.gain.setValueAtTime(.72,60.8);master.gain.linearRampToValueAtTime(.05,61.6);master.gain.linearRampToValueAtTime(.12,65);master.gain.linearRampToValueAtTime(.08,68);

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
