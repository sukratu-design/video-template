// 5: the archer. Arrows in the quiver (the store), one in flight (prarabdha), one on the string (agami).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,band,person,canopy,hex,mix,shift,ellipse,rect,spline,rough,xf,fbm,clamp,flow} from './world.mjs';
function arrow(p,x,y,a,len,lift=0,o={}){const c=Math.cos(a),s=Math.sin(a);const tip=[x+c*len/2,y+s*len/2],tail=[x-c*len/2,y-s*len/2];
  if(lift){const dx=SUN[0]*lift,dy=SUN[1]*lift;p.line([[tail[0]+dx,tail[1]+dy],[tip[0]+dx,tip[1]+dy]],{w:8,col:hex('#5a6a3a'),opacity:.6,thick:.2,raw:true})}
  p.line([tail,[x,y],tip],{w:o.w||4,col:o.dark?hex('#5a3420'):hex('#e9d9b0'),thick:1.3,raw:true,taper:.1});if(o.dark)p.line([tail,tip],{w:1.6,col:hex('#e9c9a0'),thick:1.5,raw:true,opacity:.8});p.dab(tip[0],tip[1],a,16,7,hex('#5a5f66'),{taper:.9,thick:1.5});
  for(const k of[-1,1])p.dab(tail[0]+c*9-s*5*k,tail[1]+s*9+c*5*k,a+.35*k,20,5,o.fl||C.vermilion,{thick:1.4})}
export default function(opt={}){const p=new Painting({...opt,seed:505,ground:hex('#6a5a2a')});
  const G=[hex('#c9b05a'),hex('#b89c4a'),hex('#d8c26c'),hex('#a8a04a'),hex('#93a04a')];const dir=flow(-.75,.35,.004,4);
  field(p,(x,y,r)=>shift(G[(r()*G.length)|0],{l:(fbm(x*.005,y*.005,6)-.5)*.14,h:(fbm(x*.003,y*.003,8)-.3)*.06}),{w:14,len:44,density:1.9,dir,dirJit:.3});
  field(p,[hex('#e6d488'),hex('#8a8a3a'),hex('#efe0a0')],{w:4,len:26,density:.55,dir,dirJit:.35,thick:1.3,opacity:.9});
  // the shooting lane, mown paler
  const lane=[[150,960],[420,700],[700,430],[960,170]];const lm=p.mask(rough(band(lane,150),8,.02,2));
  p.area(lm,{w:12,len:50,density:1.6,col:[hex('#dccb7c'),hex('#d2bd6a'),hex('#e6d890')],dir:-.77,dirJit:.15,clip:false,jit:{l:.03}});
  canopy(p,960,880,170,4,{sh:34});canopy(p,110,120,150,9,{sh:30,cols:[hex('#1f4a34'),hex('#2f6a3a'),hex('#6fa044')]});canopy(p,60,470,60,2,{sh:14});
  // target
  const tx=900,ty=215;const tm=p.mask(ellipse(tx,ty,96,96));cast(p,tm,26);
  [[96,C.white],[76,hex('#2a2a30')],[57,hex('#3f78c0')],[38,C.vermilion],[19,C.gold]].forEach(([r,c])=>{const m=p.mask(ellipse(tx,ty,r,r));p.area(m,{w:7,len:22,density:2.6,col:c,dir:(x,y)=>Math.atan2(y-ty,x-tx)+1.57,dirJit:.1,jit:{l:.03},taper:.2,thick:1.1})});
  form(p,tm,5,.6);arrow(p,tx-26,ty+34,-.8,74,0,{fl:C.indigo});
  // the arrow already flying, high above its own shadow
  arrow(p,590,535,-.775,190,60,{w:7,dark:1});
  for(let i=0;i<6;i++)p.dab(476-i*34,650+i*33,-.775,30-i*3,3.5,C.white,{opacity:.75-i*.1,dry:1.2,thick:.8});
  // the archer side-on to the target: bow arm out, string hand drawn back, an arrow on the string
  const ax=215,ay=850,fa=-.775;const bc=[ax+96,ay-128],nock=[ax+8,ay-52];
  person(p,{x:ax,y:ay,rot:.12,s:2.5,top:C.white,bottom:hex('#e3d3b0'),turban:C.indigo,skin:SKIN[1],reach:[nock,bc],stride:8,kurta:true,sash:C.vermilion});
  const bow=[];for(let i=-5;i<=5;i++){const t=i/5;const off=34*(1-t*t)-34;bow.push([bc[0]+Math.cos(fa)*off-Math.sin(fa)*t*125,bc[1]+Math.sin(fa)*off+Math.cos(fa)*t*125])}
  p.line(bow.map(([x,y])=>[x+SUN[0]*14,y+SUN[1]*14]),{w:7,col:hex('#5a5a3a'),opacity:.5,thick:.2});
  p.line(bow,{w:9,col:hex('#7a4424'),thick:1.5,tone:.1});p.line(bow.slice(1,10),{w:2.5,col:hex('#c98a4a'),thick:1.6,opacity:.8});
  p.line([bow[0],nock],{w:2,col:C.cream,raw:true,thick:1});p.line([nock,bow[10]],{w:2,col:C.cream,raw:true,thick:1});
  arrow(p,(nock[0]+bc[0])/2+16,(nock[1]+bc[1])/2-16,fa,160,0,{fl:C.gold,w:5,dark:1});
  // the quiver on the grass, full
  const qx=385,qy=905,qa=-.4;const qm=p.mask(xf(spline([[-70,-24],[62,-20],[70,0],[62,20],[-70,24],[-82,0]],true,6),{x:qx,y:qy,rot:qa}));cast(p,qm,12);
  fill(p,qm,[hex('#8a4a2a'),hex('#9c5a34'),hex('#7a3e22')],{w:7,len:30,dir:qa});form(p,qm,4);
  p.line(xf([[-40,-24],[-40,24]],{x:qx,y:qy,rot:qa}),{w:6,col:C.gold,raw:true,thick:1.4});p.line(xf([[30,-21],[30,21]],{x:qx,y:qy,rot:qa}),{w:6,col:C.gold,raw:true,thick:1.4});
  for(let i=0;i<6;i++){const o=xf([[80+i%2*14,-15+i*6]],{x:qx,y:qy,rot:qa})[0];arrow(p,o[0],o[1],qa+Math.PI+(i-2.5)*.05,54,0,{fl:[C.vermilion,C.gold,C.teal][i%3],w:3})}
  return p}
