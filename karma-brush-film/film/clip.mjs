// node film/clip.mjs <beat 1..13> -> film/clips/NN.mp4
// Paints the beat's scene stroke by stroke over the previous beat's finished painting, with a slow camera drift and captions.
import fs from 'node:fs';import {spawn} from 'node:child_process';import {FPS,LEAD,B,END,DURATION,scenes,K,cues} from './config.mjs';
const i=+process.argv[2];const SC=+(process.env.SCALE||2),OUT=1080,W=1080*SC;const N=W*W;
const load=async([n,o],extra={})=>(await import(`../scenes/s${n}.mjs`)).default({scale:SC,...o,...extra});
const smooth=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
const t0=LEAD+B[i-1],t1=i<13?LEAD+B[i]:DURATION;const f0=i===1?0:Math.round(t0*FPS),f1=Math.round(t1*FPS),fs0=Math.round(t0*FPS);
const paintT=Math.min(3.0,Math.max(2.0,(t1-t0)*.45));const FP=Math.round(paintT*FPS);
const T=Date.now();
const prev=(await load(scenes[(i+11)%13])).render();                    // what is on the canvas when this beat begins
const full=await load(scenes[i-1]);const total=full.strokes,fin=full.render();
// overlays
const rd=n=>fs.readFileSync(new URL(`./ov/${n}.rgba`,import.meta.url));const band=rd('band'),title=(i===1||i===13)?rd('title'):null;
const myCues=cues.map((c,k)=>[c[0]+LEAD,c[1]+LEAD,k]).filter(c=>c[1]>f0/FPS-1&&c[0]<f1/FPS+1).map(c=>[...c,rd('c'+String(c[2]).padStart(2,'0'))]);
const ff=spawn('ffmpeg',['-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',`${OUT}x${OUT}`,'-r',String(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf',process.env.CRF||'12','-pix_fmt','yuv420p','-g','30',new URL(`./clips/${String(i).padStart(2,'0')}.mp4`,import.meta.url).pathname],{stdio:['pipe','inherit','inherit']});
const write=buf=>new Promise(r=>ff.stdin.write(buf,r));
const cam=f=>{const u=smooth(0,1,Math.min(1,Math.max(0,(f-fs0)/(f1-fs0))));const a=K[i-1],b=K[i];return{z:a.z+(b.z-a.z)*u,x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u}};
// crop + downsample a lit canvas through the camera (4 bilinear taps per output pixel)
function shoot(src,f){const c=cam(f);const out=Buffer.alloc(OUT*OUT*3);const span=W/c.z,sc=span/OUT;let x0=c.x*SC-span/2,y0=c.y*SC-span/2;x0=Math.min(W-span,Math.max(0,x0));y0=Math.min(W-span,Math.max(0,y0));
  const offs=[.25,.75];for(let y=0;y<OUT;y++)for(let x=0;x<OUT;x++){let r=0,g=0,b=0;for(const oy of offs){const sy=Math.min(W-1.001,y0+(y+oy)*sc-.5),iy=Math.max(0,sy|0),fy=sy-iy;for(const ox of offs){const sx=Math.min(W-1.001,x0+(x+ox)*sc-.5),ix=Math.max(0,sx|0),fx=sx-ix;
      const p=(iy*W+ix)*3,q=p+W*3;const w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy;
      r+=src[p]*w00+src[p+3]*w10+src[q]*w01+src[q+3]*w11;g+=src[p+1]*w00+src[p+4]*w10+src[q+1]*w01+src[q+4]*w11;b+=src[p+2]*w00+src[p+5]*w10+src[q+2]*w01+src[q+5]*w11}}
    const o=(y*OUT+x)*3;out[o]=r/4+.5;out[o+1]=g/4+.5;out[o+2]=b/4+.5}return out}
function over(out,img,a,yFrom=0){if(a<=.003)return;for(let p=yFrom*OUT,o=p*3,q=p*4;p<OUT*OUT;p++,o+=3,q+=4){const al=img[q+3]*a/255;if(al<=0)continue;out[o]+=(img[q]-out[o])*al;out[o+1]+=(img[q+1]-out[o+1])*al;out[o+2]+=(img[q+2]-out[o+2])*al}}
function dress(out,f){const t=f/FPS;let ba=0;for(const c of cues){const a=Math.min(smooth(c[0]+LEAD-.35,c[0]+LEAD,t),1-smooth(c[1]+LEAD,c[1]+LEAD+.45,t));if(a>ba)ba=a}over(out,band,ba,840);
  for(const c of myCues)over(out,c[3],Math.min(smooth(c[0]-.05,c[0]+.2,t),1-smooth(c[1]-.12,c[1]+.1,t)),820);
  if(title){const a=i===1?1-smooth(LEAD-.1,LEAD+.7,t):smooth(DURATION-2.2,DURATION-.9,t);over(out,title,a)}return out}
// cover lead (beat 1 only): the finished evening painting with the title, so frame 0 works as the thumbnail
for(let f=f0;f<fs0;f++)await write(dress(shoot(prev,f),f));
// paint-on (grounds go down fast so the subject gets the time; bare ground between strokes turns over early): run the scene again and take a frame whenever the stroke count reaches that frame's share
const frames=[];let k=0;const share=j=>{const u=(j+1)/FP;return Math.round(total*(1-Math.pow(1-u,2.3)))};
const mixb=Buffer.alloc(N*3);
const snap=p=>{const lit=p.render(),cv=p.cov;const fade=smooth(.12,.55,(k+1)/FP);for(let n=0,o=0;n<N;n++,o+=3){let a=cv[n];a=a+(1-a)*fade;mixb[o]=prev[o]+(lit[o]-prev[o])*a;mixb[o+1]=prev[o+1]+(lit[o+1]-prev[o+1])*a;mixb[o+2]=prev[o+2]+(lit[o+2]-prev[o+2])*a}
  frames.push(dress(shoot(mixb,fs0+k),fs0+k));k++};
await load(scenes[i-1],{onStroke:p=>{while(k<FP-1&&p.strokes>=share(k))snap(p)}});
for(const fr of frames)await write(fr);
for(let f=fs0+frames.length;f<f1;f++)await write(dress(shoot(fin,f),f));
ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log('beat',i,total,'strokes',f1-f0,'frames',((Date.now()-T)/1000).toFixed(0)+'s');
