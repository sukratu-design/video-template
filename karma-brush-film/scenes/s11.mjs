// 11: the roasted seed. Night; seeds on an iron pan over the fire. They look the same, but they will never sprout (Gita 4.37).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,person,vessel,hex,mix,shift,ellipse,rect,capsule,spline,rough,xf,blob,fbm,clamp,radial,tangent,flow} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:1111,ground:hex('#1c1626')});
  const cx=560,cy=520;const N=[hex('#2a2238'),hex('#33263a'),hex('#241d33'),hex('#3a2a3c'),hex('#2e2440')];
  const warm=(x,y)=>clamp(1-Math.hypot(x-cx,y-cy)/560);
  field(p,(x,y,r)=>{const w=Math.pow(warm(x,y),1.7);return mix(shift(N[(r()*5)|0],{l:(fbm(x*.006,y*.006,4)-.5)*.05}),[hex('#c9642a'),hex('#b5522a'),hex('#d97a34')][(r()*3)|0],w*.8)},{w:18,len:50,density:1.9,dir:radial(cx,cy),dirJit:.5});
  field(p,(x,y,r)=>mix(hex('#3a2c48'),hex('#f0a044'),Math.pow(warm(x,y),1.4)),{w:4,len:30,density:.5,dir:radial(cx,cy),dirJit:.3,dry:1.3,thick:1.2,opacity:.8});
  const rn=p.rnd;
  // firewood stack, lit on the fire side
  for(let i=0;i<7;i++){const y=820+i*24,x=930+(i%2)*14;const m=p.mask(capsule(x-110,y+i*3,x+110,y-10+i*3,13));fill(p,m,[hex('#5a3a2a'),hex('#6a4430'),hex('#4a2e22')],{w:7,len:40,dir:-.05,tone:.12});p.line([[x-104,y-7+i*3],[x+100,y-16+i*3]],{w:4,col:hex('#d9843a'),raw:true,opacity:.7,thick:1.3})}
  // logs pushed into the fire, stones around it
  for(let i=0;i<5;i++){const a=.5+i*1.26;const m=p.mask(capsule(cx+Math.cos(a)*60,cy+Math.sin(a)*60,cx+Math.cos(a)*250,cy+Math.sin(a)*250,17,15));fill(p,m,[hex('#3a2620'),hex('#4a3026'),hex('#2e1e1a')],{w:8,len:40,dir:a,tone:.14});
    p.line([[cx+Math.cos(a)*70,cy+Math.sin(a)*70],[cx+Math.cos(a)*150,cy+Math.sin(a)*150]],{w:10,col:hex('#f08a2c'),raw:true,opacity:.8,thick:1.3,dry:.7})}
  for(let i=0;i<13;i++){const a=i/13*6.2832+.2,r=168+rn()*10;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;const m=p.mask(rough(ellipse(x,y,30+rn()*8,23+rn()*6,a+1.57),2,.1,i));
    fill(p,m,(px,py)=>mix(hex('#4a4250'),hex('#f09a4a'),clamp(1.25-Math.hypot(px-cx,py-cy)/r*1.05)*1.6),{w:7,len:18,dir:a+1.57,jit:{l:.03}})}
  // the fire: red at the rim, orange, then yellow-white at the heart
  const fm=p.mask(rough(blob(cx,cy,150,3,.12),6,.08,4));
  const fc=(x,y,r)=>{const d=Math.hypot(x-cx,y-cy)/150+(r()-.5)*.3;return d>.85?hex('#c9302a'):d>.62?hex('#f0642a'):d>.4?hex('#f8a02c'):hex('#ffd45a')};
  p.area(fm,{w:13,len:44,density:2.4,col:fc,dir:radial(cx,cy),dirJit:.35,curve:1.6,clip:false,thick:1.4,wet:.5,jit:{l:.03}});
  p.area(fm,{w:5,len:32,density:.9,col:(x,y,r)=>r()<.5?hex('#fff0a8'):hex('#ffb83a'),dir:radial(cx,cy),dirJit:.5,curve:2,clip:false,thick:1.7});
  // the iron pan and the seeds on it
  const pan=p.mask(ellipse(cx,cy,104,104));p.area(pan,{w:9,len:30,density:2.6,col:[hex('#2a2a30'),hex('#34343c'),hex('#222228')],dir:tangent(cx,cy),dirJit:.1,jit:{l:.02},thick:1.2});
  p.line(ellipse(cx,cy,100,100,0,40).slice(14,32),{w:4,col:hex('#f08a2c'),thick:1.5,opacity:.85});p.line(ellipse(cx,cy,100,100,0,40).slice(34).concat(ellipse(cx,cy,100,100,0,40).slice(0,10)),{w:3,col:hex('#6a6a78'),thick:1.4,opacity:.8});
  p.line([[cx+Math.cos(-.5)*100,cy+Math.sin(-.5)*100],[cx+Math.cos(-.5)*250,cy+Math.sin(-.5)*250]],{w:13,col:hex('#2a2a30'),raw:true,thick:1.5,taper:.2});
  [[-40,-34,.4],[10,-52,1.9],[46,-14,.9],[-56,14,2.6],[-12,2,1.3],[30,36,2.2],[-28,52,.2],[62,-50,2.9]].forEach(([dx,dy,a],i)=>{const c=[hex('#6a625c'),hex('#57504c'),hex('#7a7068')][i%3];
    p.dab(cx+dx+4,cy+dy+4,a,40,18,hex('#121216'),{taper:.6,opacity:.8,thick:.3});p.dab(cx+dx,cy+dy,a,40,18,c,{taper:.6,thick:1.5,tone:.14,gap:.1});p.dab(cx+dx-2,cy+dy-2,a,22,3,hex('#e8742a'),{thick:1.6,opacity:.7})});
  // sparks
  for(let i=0;i<70;i++){const a=rn()*6.2832,d=120+rn()*rn()*420;p.dab(cx+Math.cos(a)*d,cy+Math.sin(a)*d,a,4+rn()*7,2.6,rn()<.5?hex('#ffd45a'):hex('#f0642a'),{thick:1.7,opacity:.9})}
  // a bowl of seeds not yet roasted, and the one who tends the fire
  const bi=vessel(p,250,330,70,[hex('#c9973a'),hex('#b8862c'),hex('#e0a848')],{h:0,inside:hex('#3a2a1c')});
  for(let i=0;i<9;i++){const a=i*2.4,d=8+i*4.6;p.dab(250+Math.cos(a)*d,330+Math.sin(a)*d,a*1.3,34,15,[hex('#d9bf8c'),hex('#e6d2a4'),hex('#cdb07a')][i%3],{taper:.6,thick:1.5,tone:.11})}
  person(p,{x:270,y:770,rot:.95,s:2.3,top:hex('#d9cfc0'),bottom:hex('#b8a890'),turban:C.vermilion,skin:SKIN[1],arms:[[-18,4],[28,-30]],stride:3,kurta:true,shadow:0});
  p.glow(cx,cy,330,hex('#ff9a3a'),.2,1.5);
  return p}
