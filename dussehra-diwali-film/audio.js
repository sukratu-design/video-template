'use strict';
/* Score: a short piece in Raga Bhupali (Sa Re Ga Pa Dha), synthesized sample by sample, no samples or SFX.
   Tanpura (Pa Sa Sa Sa) throughout; sitar alap 0-12 s; gat over a soft teentaal theka 12-75 s; the tabla stops and
   the sitar resolves to Sa for the closing line. Plucked strings are Karplus-Strong with a little jawari buzz;
   the tabla is tuned sines with a bayan glide. Seeded, so every render is identical. */
(function(){
const SR=44100,DUR=84.0;
function mulberry32(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const SA=146.83; // Sa = D3
const SEMI={'S':0,'R':2,'G':4,'P':7,'D':9};
// note name -> Hz. Suffix '.' = lower octave, "'" = upper octave.
function hz(n){let o=0;if(n.endsWith('.')){o=-1;n=n.slice(0,-1)}else if(n.endsWith("'")){o=1;n=n.slice(0,-1)}return SA*Math.pow(2,(SEMI[n]+12*o)/12)}

/* Karplus-Strong pluck with fractional delay, T60 decay and optional jawari buzz. */
function pluck(out,t0,freq,{dur=2,amp=.3,t60=2,bright=.6,buzz=.25,seed=1}={}){
  const r=mulberry32(seed),s0=Math.floor(t0*SR),n=Math.floor(dur*SR),P=SR/freq-.5,L=Math.ceil(P)+2;
  const y=new Float32Array(n+L);let lp=0;for(let i=0;i<L;i++){const w=r()*2-1;lp=lp+(w-lp)*bright;y[i]=lp}
  const damp=Math.pow(.001,1/(t60*freq));
  for(let i=L;i<n+L;i++){const p=i-P,k=Math.floor(p),f=p-k,a=y[k]*(1-f)+y[k+1]*f,b=y[k-1]*(1-f)+y[k]*f;y[i]=damp*.5*(a+b)}
  const fade=Math.floor(.06*SR);
  for(let i=0;i<n;i++){const j=s0+i;if(j<0||j>=out.length)continue;let v=y[i+L];v=v+buzz*Math.tanh(3*v);const e=i>n-fade?(n-i)/fade:1;const att=Math.min(1,i/40);out[j]+=amp*v*e*att}
}
/* Tabla strokes. */
function sine(out,t0,f0,f1,tau,amp,dur){const s0=Math.floor(t0*SR),n=Math.floor(dur*SR);let ph=0;for(let i=0;i<n;i++){const t=i/SR,f=f1+(f0-f1)*Math.exp(-t/.06);ph+=2*Math.PI*f/SR;const j=s0+i;if(j>=0&&j<out.length)out[j]+=amp*Math.sin(ph)*Math.exp(-t/tau)}}
function click(out,t0,amp,seed){const r=mulberry32(seed),s0=Math.floor(t0*SR),n=Math.floor(.03*SR);let lp=0;for(let i=0;i<n;i++){const w=r()*2-1;lp=lp+(w-lp)*.35;const j=s0+i;if(j>=0&&j<out.length)out[j]+=amp*lp*Math.exp(-i/SR/.004)}}
const DAYAN=SA*2;
function dayan(out,t,kind,amp,seed){ // na / ta: crisp ring; tin: softer, longer, with an overtone
  if(kind==='tin'){sine(out,t,DAYAN*1.01,DAYAN,.22,amp*.55,.6);sine(out,t,DAYAN*2.76,DAYAN*2.74,.09,amp*.18,.3)}
  else{sine(out,t,DAYAN*1.02,DAYAN,.11,amp*.7,.4);sine(out,t,DAYAN*3.01,DAYAN*3,.04,amp*.2,.15)}
  click(out,t,amp*.35,seed)}
function bayan(out,t,amp){sine(out,t,98,62,.32,amp,.9)}
const BOLS={dha:(o,t,a,s)=>{dayan(o,t,'na',a,s);bayan(o,t,a*.8)},dhin:(o,t,a,s)=>{dayan(o,t,'tin',a,s);bayan(o,t,a*.7)},tin:(o,t,a,s)=>dayan(o,t,'tin',a,s),ta:(o,t,a,s)=>dayan(o,t,'na',a*.85,s)};
const THEKA=['dha','dhin','dhin','dha','dha','dhin','dhin','dha','dha','tin','tin','ta','ta','dhin','dhin','dha'];

function compose(out){
  const tan=new Float32Array(out.length),sit=new Float32Array(out.length),tab=new Float32Array(out.length);
  // tanpura: Pa. Sa Sa Sa. every 2.6 s, long decays
  let k=0;for(let t=.1;t<DUR-1;t+=2.6){[['P.',0],['S',.65],['S',1.3],['S.',1.95]].forEach(([n,dt],i)=>pluck(tan,t+dt,hz(n)*(n==='S.'?1:1),{dur:5.5,amp:.22,t60:5,bright:.5,buzz:.6,seed:100+k*4+i}));k++}
  // sitar alap (free time)
  const alap=[[1.2,'S',2.4],[3.0,'D.',1.4],[4.1,'S',1.6],[5.4,'R',1.1],[6.2,'G',2.2],[8.0,'R',1.0],[8.7,'G',1.0],[9.4,'P',2.0],[10.8,'G',.8],[11.3,'R',.7]];
  alap.forEach(([t,n,d],i)=>pluck(sit,t,hz(n),{dur:d+1,amp:.34,t60:d+.8,bright:.75,buzz:.35,seed:300+i}));
  // gat over teentaal: 16 beats per cycle, beat = 60/76 s
  const BEAT=60/76,G0=12.0,CYC=['G - R S D. S R G P - G R G R S -','G P D S\' D P G R G - P - G R S -','P D S\' R\' S\' D P G P D P G R G R S','G P D S\' D P G R G - P - G R S -','G - R S D. S R G P - G R G R S -'];
  CYC.forEach((c,ci)=>{const notes=c.split(' ');notes.forEach((n,bi)=>{if(n==='-')return;let len=1;for(let j=bi+1;j<notes.length&&notes[j]==='-';j++)len++;const t=G0+(ci*16+bi)*BEAT;pluck(sit,t,hz(n),{dur:len*BEAT+.9,amp:.3,t60:len*BEAT+.6,bright:.75,buzz:.35,seed:500+ci*16+bi});
    if(len===1&&(bi%4===3)&&ci%2===1){const nx=notes[(bi+1)%16]==='-'?n:notes[(bi+1)%16];pluck(sit,t+BEAT*.5,hz(nx),{dur:.8,amp:.2,t60:.6,bright:.8,buzz:.3,seed:900+ci*16+bi})}})});
  // tabla: soft theka for the gat, ending on the sam of the last cycle
  const TEND=G0+5*16*BEAT;
  for(let b=0;G0+b*BEAT<TEND+.01;b++){const t=G0+b*BEAT,bol=THEKA[b%16],fade=Math.min(1,b/8)*(1-Math.max(0,(t-(TEND-6))/7));BOLS[bol](tab,t,.42*fade,2000+b);if(b%2===1&&b%16>3&&b%16<12)BOLS.ta(tab,t+BEAT*.5,.16*fade,3000+b)}
  BOLS.dha(tab,TEND,.38,4000);
  // close: slow resolution to Sa under the last line and the greeting
  [[TEND+1.2,'G',1.6],[TEND+2.6,'R',1.4],[TEND+3.9,'S',1.6],[TEND+5.4,'D.',1.4],[TEND+6.6,'S',5.5]].forEach(([t,n,d],i)=>pluck(sit,t,hz(n),{dur:d+1,amp:.34,t60:d+.8,bright:.7,buzz:.35,seed:1200+i}));
  pluck(sit,TEND+6.62,hz("S'"),{dur:5,amp:.12,t60:4.5,bright:.7,buzz:.3,seed:1300});
  for(let i=0;i<out.length;i++)out[i]=.55*tan[i]+.85*sit[i]+.6*tab[i];
}

async function renderWav(){
  const N=Math.floor(SR*DUR),out=new Float32Array(N);
  compose(out);
  // fade in, fade out, simple soft-clip and normalise
  for(let i=0;i<N;i++){const t=i/SR;let g=Math.min(1,t/2.5);if(t>DUR-3)g*=Math.max(0,(DUR-t)/3);out[i]=Math.tanh(out[i]*g*1.2)}
  let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(out[i]));const norm=pk>0?.89/pk:1;
  const buf=new ArrayBuffer(44+N*2),view=new DataView(buf);
  function writeStr(o,s){for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i))}
  writeStr(0,'RIFF');view.setUint32(4,36+N*2,true);writeStr(8,'WAVE');writeStr(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,SR,true);view.setUint32(28,SR*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);writeStr(36,'data');view.setUint32(40,N*2,true);
  let off=44;for(let i=0;i<N;i++){const v=Math.max(-1,Math.min(1,out[i]*norm));view.setInt16(off,v<0?v*0x8000:v*0x7FFF,true);off+=2}
  return new Blob([buf],{type:'audio/wav'});
}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
window.KarmaAudio={renderWav,download:async(name='audio.wav')=>{const b=await renderWav();downloadBlob(b,name);return b}};
})();
