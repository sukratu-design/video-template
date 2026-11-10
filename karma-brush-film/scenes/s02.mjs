// 2: the seed pressed into earth. Every action leaves an impression (samskara).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,cast,form,fill,field,mango,hex,mix,shift,dark,ellipse,rect,spline,rough,xf,blob,fbm,clamp,tangent} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:202,ground:hex('#3a2218')});
  const cx=540,cy=560,rot=-.5;const E=[hex('#7a4a2c'),hex('#8e5a34'),hex('#6a3e26'),hex('#9c6a40')];
  // damp earth, the strokes circling the seed like ripples
  const ring=(x,y)=>{const d=Math.hypot(x-cx,(y-cy)*1.12);return{d,v:Math.sin(d/27-1.2)*Math.exp(-d/420)}};
  field(p,(x,y,r)=>{const{d,v}=ring(x,y);let c=E[(r()*E.length)|0];c=shift(c,{l:v*.085+(fbm(x*.008,y*.008,3)-.5)*.1});return d<190?mix(c,hex('#4a2a1c'),clamp((190-d)/120)*.75):c},
    {w:20,len:54,density:1.9,dir:tangent(cx,cy),dirJit:.18,curve:1.2,jit:{l:.03,h:.01}});
  field(p,(x,y,r)=>{const{v}=ring(x,y);return v>0?hex('#b98556'):hex('#4e2e1e')},{w:6,len:40,density:.35,dir:tangent(cx,cy),dirJit:.1,curve:1.4,opacity:.8,dry:1.6,thick:1.2,jit:{l:.05}});
  // pebbles and seedlings from seeds sown before
  const rn=p.rnd;for(let i=0;i<26;i++){const x=rn()*1080,y=rn()*1080;if(Math.hypot(x-cx,y-cy)<260)continue;const r=5+rn()*9;const m=p.mask(rough(ellipse(x,y,r,r*.75,rn()*3),1,.2,i));cast(p,m,4);fill(p,m,[hex('#a79a8c'),hex('#8c7c70'),hex('#c2b5a2')][i%3],{w:4,len:9,dir:rn()*3});form(p,m,2)}
  [[170,230,.4],[905,300,2.2],[880,860,4],[200,880,1],[610,120,5]].forEach(([x,y,a],i)=>{for(const k of[0,1]){const an=a+k*Math.PI+ (k?.3:0);const m=p.mask(xf(spline([[0,0],[14,-9],[34,-6],[42,0],[32,7],[14,8]],true,5),{x,y,rot:an,sx:1.25}));if(!k)cast(p,m,5);fill(p,m,k?C.leafL:hex('#6fae48'),{w:4,len:14,dir:an});form(p,m,2)}
    p.dab(x,y,a,7,4,hex('#d8e08a'),{thick:1.3})});
  // the pressed hollow and the seed
  const S=T=>xf(spline([[-150,4],[-104,-52],[-10,-74],[98,-58],[152,-8],[112,50],[10,70],[-100,52]],true,8),{x:cx,y:cy,rot,sx:T,sy:T});
  p.glaze(p.mask(rough(S(1.32),6,.03,4)),{tint:[.5,.42,.5],alpha:.55});p.glaze(p.mask(rough(S(1.14),4,.04,6)),{tint:[.5,.42,.55],alpha:.5});
  const m=p.mask(rough(S(1),2,.04,2));cast(p,m,9,{alpha:.7});
  const c=Math.cos(rot),s=Math.sin(rot);const uv=(x,y)=>[((x-cx)*c+(y-cy)*s)/150,(-(x-cx)*s+(y-cy)*c)/72];
  const husk=[hex('#d9bf8c'),hex('#cdb07a'),hex('#e6d2a4'),hex('#bf9a62')];
  p.area(m,{w:9,len:60,density:2.6,col:(x,y,r)=>{const[u,v]=uv(x,y);return shift(husk[(r()*4)|0],{l:-v*.07-Math.abs(u)*.05})},dir:(x,y)=>{const[u,v]=uv(x,y);return rot+v*.55*(u>0?-1:1)*Math.abs(u)},dirJit:.08,curve:.8,tone:.12,thick:1.3,gap:.08});
  p.area(m,{w:3,len:70,density:.5,col:[hex('#a67c48'),hex('#f1e2bc'),hex('#8f6a3c')],dir:(x,y)=>{const[u,v]=uv(x,y);return rot+v*.55*(u>0?-1:1)*Math.abs(u)},dirJit:.06,dry:1.3,thick:1.5,opacity:.85});
  form(p,m,9,1.1);
  p.line(xf([[-128,2],[-60,-10],[20,-12],[120,-4]],{x:cx,y:cy,rot}),{w:5,col:hex('#8a623a'),dry:.6,thick:1.4});
  // the trowel that planted it
  const tx=865,ty=655,ta=-1.05;const blade=p.mask(xf(spline([[0,-26],[70,-22],[112,0],[70,22],[0,26]],true,6),{x:tx,y:ty,rot:ta})),handle=p.mask(xf(rect(-52,0,104,22),{x:tx,y:ty,rot:ta}));
  cast(p,blade.or(handle),7);fill(p,handle,[hex('#a8743e'),hex('#96632f')],{w:6,len:30,dir:ta});form(p,handle,3);
  fill(p,blade,[hex('#8d9299'),hex('#a7adb3'),hex('#767c84')],{w:7,len:34,dir:ta+.2,tone:.1});form(p,blade,3);p.area(blade,{w:5,len:20,density:.3,col:hex('#7a4a2c'),dir:ta+1,dry:1.4});
  return p}
