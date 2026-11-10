// 8 and 12: the wheel. An ox walks its circle around the oil press, round and round (samsara).
// With {free:true} it is the same yard later: the yoke lies on the ground, the circle is open, a straight path leads out (moksha).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,band,person,canopy,vessel,bird,hex,mix,shift,ellipse,rect,capsule,spline,rough,xf,blob,fbm,clamp,radial,tangent,flow} from './world.mjs';
export function ox(p,x,y,rot,s=1,col=hex('#ece4d2')){const T=q=>xf(q,{x,y,rot,sx:s,sy:s});
  const body=p.mask(T(spline([[-64,0],[-52,-26],[-8,-31],[36,-26],[56,-12],[56,12],[36,26],[-8,31],[-52,26]],true,6)));const head=p.mask(T(spline([[50,-13],[78,-14],[98,-8],[104,0],[98,8],[78,14],[50,13]],true,5)));
  cast(p,body.or(head),13*s);
  p.line(T([[-62,0],[-84,6],[-98,-4]]),{w:4*s,col:shift(col,{l:-.12}),thick:1.2});p.dab(...T([[-101,-6]])[0],rot+2.6,12*s,6*s,hex('#3a2a22'),{thick:1.3});
  fill(p,body,[col,shift(col,{l:-.04}),shift(col,{l:.03})],{w:8*s,len:28*s,dir:rot,dirJit:.15,tone:.08});form(p,body,6*s,1);
  const hump=p.mask(T(ellipse(24,0,17,15)));fill(p,hump,shift(col,{l:.02}),{w:6*s,len:14*s,dir:rot+1.57});form(p,hump,4*s,1.1);
  fill(p,head,shift(col,{l:-.03}),{w:6*s,len:18*s,dir:rot});form(p,head,3*s,1);p.dab(...T([[101,0]])[0],rot+1.57,12*s,6*s,hex('#4a3a34'),{thick:1.2});
  for(const k of[-1,1]){p.line(T([[76,10*k],[84,24*k],[100,30*k]]),{w:4.5*s,col:hex('#3a2e2a'),thick:1.6});p.dab(...T([[66,15*k]])[0],rot+1.2*k,12*s,6*s,shift(col,{l:-.1}),{thick:1.2})}
  return T}
export default function(opt={}){const free=!!opt.free;const p=new Painting({...opt,seed:free?1212:808,ground:hex('#6a4a2a')});
  const cx=540,cy=free?640:560,R0=232,R1=356;const rn=p.rnd;
  const D=free?[hex('#e6c98c'),hex('#dcbb7a'),hex('#efd8a2'),hex('#d2ae6c')]:[hex('#d2a86c'),hex('#c69a5e'),hex('#dcb87e'),hex('#b98a52')];
  field(p,(x,y,r)=>shift(D[(r()*4)|0],{l:(fbm(x*.005,y*.005,5)-.5)*.12}),{w:20,len:56,density:1.8,dir:flow(.5,.7,.004,7),dirJit:.4});
  if(free){ // grass has come back, even on the old track
    field(p,[hex('#8fb04c'),hex('#6f9a3c'),hex('#a9c85c'),hex('#5c8a36')],{w:8,len:22,density:1.5,dir:flow(-1.2,.6,.01,3),dirJit:.5,thick:1.2,clip:{at:(x,y)=>fbm(x*.0035/p.S*2,y*.0035/p.S*2,21)>.47}})}
  // the worn ring
  const ringM=p.mask(rough(ellipse(cx,cy,R1,R1),6,.02,3)).sub(p.mask(rough(ellipse(cx,cy,R0,R0),6,.02,5)));
  const gate=free?p.mask(rect(cx,cy-R1+40,150,170)):null;const rm=free?ringM.sub(gate):ringM;
  p.area(rm,{w:13,len:54,density:free?1.2:2.3,col:free?[hex('#d9c08a'),hex('#cdb078'),hex('#b9b46a')]:[hex('#e9cf9c'),hex('#dfc08a'),hex('#f1dcae'),hex('#d4b078')],dir:tangent(cx,cy),dirJit:.1,curve:1,jit:{l:.03},clip:!free,dry:free?1.2:0});
  if(!free){p.area(rm,{w:4,len:46,density:.5,col:[hex('#b08a54'),hex('#f6e6bf')],dir:tangent(cx,cy),dirJit:.06,curve:1,dry:1.2,thick:1.2});
    for(let i=0;i<70;i++){const a=i/70*6.2832,r=(R0+R1)/2+(i%2?16:-16)+(rn()-.5)*30;p.dab(cx+Math.cos(a)*r,cy+Math.sin(a)*r,a+1.57,11,8,hex('#a37c4a'),{opacity:.75,thick:.5,taper:.3})}}
  else{ // the way out: a straight path from the open ring to the top of the picture
    const pm=p.mask(rough(band([[cx,cy-R0+10],[cx+6,cy-R1-60],[cx-4,150],[cx+2,-40]],t=>96-26*t),5,.02,8));
    p.area(pm,{w:12,len:50,density:2.4,col:[hex('#f6e6bf'),hex('#efd8a2'),hex('#fbf0d2'),hex('#e6c98c')],dir:-1.57,dirJit:.12,jit:{l:.03}});
    p.area(pm,{w:4,len:44,density:.4,col:[hex('#c9a66e'),hex('#fff6dc')],dir:-1.57,dirJit:.06,dry:1.2,thick:1.2});
    p.glow(cx,-80,620,hex('#fff2c4'),.55,1.6)}
  // things around the yard
  const hay=p.mask(rough(blob(140,150,150,4,.12),5,.05,2));cast(p,hay,34);p.area(hay,{w:6,len:40,density:2.6,col:[hex('#e8c35a'),hex('#d9ae44'),hex('#f2d67a'),hex('#c99a3a')],dir:radial(140,150),dirJit:.35,clip:false,thick:1.4,tone:.1});form(p,hay,20,.7);
  canopy(p,985,965,190,11,{sh:36});
  const tr=p.mask(rect(930,250,150,80,.25));cast(p,tr,12);fill(p,tr,[hex('#9a9288'),hex('#aaa298')],{w:9,len:30,dir:.25});fill(p,p.mask(rect(930,250,122,52,.25)),[hex('#4f9aa8'),hex('#63aebb'),hex('#3f8a9a')],{w:7,len:24,dir:.25});
  [[90,930,40],[160,1000,30],[62,1010,24]].forEach(([x,y,r])=>vessel(p,x,y,r,[hex('#c4623a'),hex('#b55532'),hex('#d17446')],{h:r*.4}));
  // the press at the centre
  const st=p.mask(rough(ellipse(cx,cy,74,74),2,.06,2));cast(p,st,22);p.area(st,{w:8,len:26,density:2.6,col:[hex('#9a9288'),hex('#8a8278'),hex('#aaa298')],dir:tangent(cx,cy),jit:{l:.03},thick:1.2});form(p,st,7,1);
  const hole=p.mask(ellipse(cx,cy,40,40));fill(p,hole,[hex('#3a2a1c'),hex('#5a4020'),hex('#6a4c24')],{w:6,len:16,dir:tangent(cx,cy)});
  const th=free?2.3:-.62;const bx=cx+Math.cos(th)*((R0+R1)/2+(free?-40:0)),by=cy+Math.sin(th)*((R0+R1)/2+(free?-40:0));
  const beam=[[cx,cy],[(cx+bx)/2,(cy+by)/2],[bx,by]];p.line(beam.map(([x,y])=>[x+SUN[0]*(free?4:16),y+SUN[1]*(free?4:16)]),{w:15,col:hex('#5a4a3a'),opacity:.5,thick:.2,raw:true});
  p.line(beam,{w:15,col:hex('#8a5a2e'),thick:1.6,tone:.12,raw:true,taper:.15});p.line(beam,{w:4,col:hex('#b98a52'),thick:1.7,raw:true,opacity:.8});
  const post=p.mask(ellipse(cx,cy,17,17));fill(p,post,hex('#6a4424'),{w:5,len:10,dir:1});form(p,post,3);
  if(!free){const oa=th+Math.PI/2;const T=ox(p,bx,by,oa,1.25);
    p.line([[bx+Math.cos(oa)*38-Math.sin(oa)*34,by+Math.sin(oa)*38+Math.cos(oa)*34],[bx+Math.cos(oa)*38+Math.sin(oa)*34,by+Math.sin(oa)*38-Math.cos(oa)*34]],{w:7,col:hex('#6a4424'),raw:true,thick:1.6});
    const da=th-.62;const dx=cx+Math.cos(da)*(R0+R1)/2,dy=cy+Math.sin(da)*(R0+R1)/2;person(p,{x:dx,y:dy,rot:da+Math.PI,s:1.75,top:C.white,bottom:hex('#e3d3b0'),turban:C.vermilion,skin:SKIN[1],arms:[[-18,6],[22,-18]],stride:7,shadow:6})}
  else{ // unyoked: the ox grazes, the yoke lies in the dust, someone walks out along the path, birds overhead
    p.line([[bx-30,by-34],[bx+34,by+30]],{w:7,col:hex('#6a4424'),raw:true,thick:1.6});
    ox(p,880,560,2.5,1.2);
    person(p,{x:cx+4,y:150,rot:.04,s:1.5,top:C.white,bottom:hex('#e3d3b0'),turban:C.vermilion,skin:SKIN[1],arms:[[-17,8],[17,6]],stride:7,shadow:8});
    const sp=[[cx+2,cy-R0+30],[cx+6,cy-R1-20],[cx,330],[cx+2,230]];for(let i=0;i<13;i++){const t=i/13;const y=cy-R0+20-(cy-R0-210)*t;p.dab(cx+3+(i%2?7:-7),y,-1.57,11,4.5,hex('#c9a66e'),{opacity:.8,thick:.5})}
    [[300,330,-1.9,2],[215,430,-1.8,1.6],[770,250,-1.2,1.8]].forEach(([x,y,a,s])=>bird(p,x,y,a,s,hex('#f6f1e4'),26))}
  return p}
