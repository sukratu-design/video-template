// 7: sweet or bitter. A rangoli laid on the floor, one half gold, one half green; this is the life we are living now.
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,person,vessel,hex,mix,shift,ellipse,rect,spline,rough,xf,fbm,clamp,radial,tangent,flow} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:707,ground:hex('#5a4038')});
  const F=[hex('#b9907a'),hex('#ad846e'),hex('#c49c86'),hex('#a67a66')];
  field(p,(x,y,r)=>shift(F[(r()*4)|0],{l:(fbm(x*.005,y*.005,3)-.5)*.1}),{w:22,len:70,density:1.8,dir:flow(.3,.5,.003,2),dirJit:.3,curve:1.5});
  const cx=540,cy=540;const sweet=[hex('#f2a52c'),hex('#f6c544'),hex('#e8782a'),hex('#fbdc7a'),hex('#e2562a')],bitter=[hex('#6f9a3c'),hex('#2e7c64'),hex('#9cbc54'),hex('#1f5a4a'),hex('#c2d470')];
  const side=(x,y)=>(x-cx)*.94+(y-cy)*.34<0;const pal=(x,y,i)=>(side(x,y)?sweet:bitter)[i%5];
  const disc=p.mask(ellipse(cx,cy,418,418));p.area(disc,{w:9,len:30,density:2.2,col:[hex('#f3ead8'),hex('#e9dcc2'),hex('#f8f2e4')],dir:tangent(cx,cy),dirJit:.2,jit:{l:.02},thick:.9});
  const petal=(r0,r1,a,wd)=>{const o=[];const n=10;for(let i=0;i<=n;i++){const t=i/n;const r=r0+(r1-r0)*t,w=wd*Math.sin(Math.PI*Math.pow(t,.8))*r0;o.push([cx+Math.cos(a)*r-Math.sin(a)*w,cy+Math.sin(a)*r+Math.cos(a)*w])}
    for(let i=n;i>=0;i--){const t=i/n;const r=r0+(r1-r0)*t,w=-wd*Math.sin(Math.PI*Math.pow(t,.8))*r0;o.push([cx+Math.cos(a)*r-Math.sin(a)*w,cy+Math.sin(a)*r+Math.cos(a)*w])}return o};
  const ring=(n,r0,r1,wd,ci,off=0)=>{for(let i=0;i<n;i++){const a=off+i/n*6.2832;const mx=cx+Math.cos(a)*(r0+r1)/2,my=cy+Math.sin(a)*(r0+r1)/2;const c=pal(mx,my,ci+i%2);const m=p.mask(petal(r0,r1,a,wd));
    p.area(m,{w:6,len:18,density:3,col:c,dir:a,dirJit:.25,jit:{l:.05,h:.015,s:.08},taper:.3,thick:1.4,tone:.1});p.line([[cx+Math.cos(a)*(r0+8),cy+Math.sin(a)*(r0+8)],[cx+Math.cos(a)*(r1-10),cy+Math.sin(a)*(r1-10)]],{w:3,col:shift(c,{l:.14}),raw:true,thick:1.6,opacity:.8})}};
  const dots=(n,r,sz,ci,off=0)=>{for(let i=0;i<n;i++){const a=off+i/n*6.2832,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;const m=p.mask(ellipse(x,y,sz,sz));p.area(m,{w:5,len:10,density:3.4,col:pal(x,y,ci),dir:a+1.57,jit:{l:.05},thick:1.6})}};
  const band=(r0,r1,ci)=>{const m=p.mask(ellipse(cx,cy,r1,r1)).sub(p.mask(ellipse(cx,cy,r0,r0)));p.area(m,{w:5,len:18,density:2.6,col:(x,y)=>pal(x,y,ci),dir:tangent(cx,cy),dirJit:.1,jit:{l:.05,h:.01},taper:.2,thick:1.3})};
  band(392,410,2);ring(24,300,388,.115,0,.13);dots(24,372,11,3,0);band(284,296,4);ring(16,196,282,.19,1,0);dots(16,262,10,2,.196);band(180,192,0);
  ring(8,84,178,.42,2,.39);dots(8,160,9,4,0);
  // the lotus at the heart
  for(let i=0;i<8;i++){const a=i/8*6.2832+.2;const m=p.mask(petal(16,84,a,1.5));p.area(m,{w:5,len:16,density:3,col:[hex('#e86a8a'),hex('#f08aa4'),hex('#d8477a')],dir:a,dirJit:.2,jit:{l:.04},thick:1.4})}
  const hm=p.mask(ellipse(cx,cy,22,22));p.area(hm,{w:5,len:10,density:3,col:C.gold,dir:0,dirJit:3,thick:1.7});
  // the makers: two people finishing the rim, bowls of colour beside them
  [[150,930,C.gold],[232,985,C.vermilion],[105,1010,hex('#2e7c64')],[925,120,hex('#9cbc54')],[1000,190,C.white],[965,60,C.rose]].forEach(([x,y,c],i)=>{const mi=vessel(p,x,y,34,[hex('#c9973a'),hex('#b8862c'),hex('#dcae52')],{h:7,rim:.2,inside:c});p.area(mi,{w:5,len:9,density:2,col:shift(c,{l:.06}),dir:i,dirJit:3,thick:1.6})});
  person(p,{x:250,y:800,rot:1.05,s:1.9,top:C.vermilion,bottom:C.gold,skirt:true,skin:SKIN[0],arms:[[-20,-2],[30,-30]],sash:C.teal,hem:C.vermilion,bun:true});
  person(p,{x:860,y:250,rot:-2.2,s:1.9,top:C.indigo,bottom:C.white,turban:C.rose,skin:SKIN[1],arms:[[-28,-30],[20,0]],stride:3,kurta:true});
  return p}
