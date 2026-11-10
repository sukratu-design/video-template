// 9: worn clothes for new. Saris drying on the riverbank; an old faded cloth set aside, a fresh one unrolled (Gita 2.22).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,band,person,vessel,hex,mix,shift,ellipse,rect,spline,rough,xf,blob,fbm,clamp,flow} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:909,ground:hex('#7a6a4a')});
  const Sd=[hex('#e6d2a4'),hex('#dcc592'),hex('#efdfb8'),hex('#d2b884')];const a=.42;
  field(p,(x,y,r)=>shift(Sd[(r()*4)|0],{l:(fbm(x*.005,y*.005,5)-.5)*.1}),{w:20,len:60,density:1.8,dir:flow(a,.4,.004,3),dirJit:.3});
  // the river across the top-left corner, and wet sand along it
  const shore=[[-40,470],[120,400],[300,300],[430,150],[520,-40]];const river=p.mask([...spline(shore,false,8),[-40,-40]]);
  p.area(p.mask(rough(band(shore,120),8,.02,3)),{w:12,len:44,density:1.4,col:[hex('#bfa67a'),hex('#b39a6e')],dir:-.75,dirJit:.2,clip:false});
  p.area(river,{w:16,len:66,density:2.2,col:[hex('#3fa7a8'),hex('#58b9b6'),hex('#2f8f98'),hex('#74cbc4'),hex('#2a7f8e')],dir:-.75,dirJit:.15,jit:{l:.03,h:.01},curve:.8,wet:.5});
  p.area(river,{w:4,len:40,density:.5,col:[C.white,hex('#c8efe8')],dir:-.75,dirJit:.1,dry:1.2,thick:1.4,opacity:.85});
  // saris laid out to dry
  const rn=p.rnd;const strip=(cx,cy,w,len,col,border,o={})=>{const m=p.mask(rough(rect(cx,cy,len,w,a),2.5,.03,cx));cast(p,m,4);
    p.area(m,{w:11,len:52,density:2.4,col:[col,shift(col,{l:.035}),shift(col,{l:-.035})],dir:a,dirJit:.07,jit:{l:.025,s:.05},tone:.09,thick:1.1,curve:.4,...o});
    if(border)for(const k of[-1,1]){const q=xf([[-len/2+6,k*(w/2-9)],[0,k*(w/2-9)+2],[len/2-6,k*(w/2-9)]],{x:cx,y:cy,rot:a});p.line(q,{w:9,col:border,thick:1.5,tone:.1});p.line(q,{w:2,col:shift(border,{l:.14}),thick:1.7,opacity:.7})}
    for(let i=0;i<5;i++){const u=-len/2+len*(i+.5+rn()*.4)/5.5;const q=xf([[u,-w/2+6],[u+8,0],[u-4,w/2-6]],{x:cx,y:cy,rot:a});p.line(q,{w:3,col:shift(col,{l:-.1}),opacity:.5,thick:.6})}return m};
  const ox=Math.sin(a)*-1,oy=Math.cos(a);const base=[610,560];
  [[-2.1,C.vermilion,C.gold,760],[-1.05,C.saffron,hex('#8a2a3a'),800],[0,C.teal,C.gold,820],[1.05,C.rose,hex('#f6e6bf'),780]].forEach(([k,c,b,len])=>strip(base[0]+ox*k*128,base[1]+oy*k*128,112,len,c,b));
  // the new cloth, half unrolled, a deep fresh indigo
  const nx=base[0]+ox*2.1*128+120,ny=base[1]+oy*2.1*128+54;strip(nx,ny,112,470,C.indigo,C.gold);
  const roll=p.mask(xf(ellipse(0,0,26,62),{x:nx-Math.cos(a)*245,y:ny-Math.sin(a)*245,rot:a}));cast(p,roll,9);fill(p,roll,[C.indigo,shift(C.indigo,{l:.06})],{w:7,len:30,dir:a+1.57});form(p,roll,6,1.2);
  person(p,{x:nx-Math.cos(a)*352,y:ny-Math.sin(a)*352+4,rot:a+1.57,s:1.9,top:C.gold,bottom:C.vermilion,skirt:true,skin:SKIN[0],arms:[[-24,-28],[24,-28]],sash:C.white,hem:C.gold,braid:true});
  // the old one: faded, threadbare and frayed, set aside
  const ocx=870,ocy=150,ol=360;const om=p.mask(rough(rect(ocx,ocy,ol,112,a-.12),7,.06,3));cast(p,om,4);
  p.area(om,{w:10,len:44,density:2.1,col:[hex('#c9b0a8'),hex('#bba29c'),hex('#d4beb2'),hex('#ad9896')],dir:a-.12,dirJit:.12,dry:.8,tone:.16,gap:.22,thick:.7,jit:{l:.03}});
  p.area(om,{w:4,len:30,density:.7,col:[hex('#98868a'),hex('#e0d2c6')],dir:a-.12,dirJit:.1,dry:1.3,thick:1});
  for(let i=0;i<7;i++){const q=xf([[(rn()-.5)*ol*.8,(rn()-.5)*80]],{x:ocx,y:ocy,rot:a-.12})[0];p.dab(q[0],q[1],rn()*3,14+rn()*14,9,Sd[i%4],{thick:.5,taper:.6})}
  for(const e of[-1,1])for(let i=0;i<16;i++){const q=xf([[e*ol/2,-50+i*6.6],[e*(ol/2+10+rn()*14),-50+i*6.6+(rn()-.5)*8]],{x:ocx,y:ocy,rot:a-.12});p.line(q,{w:1.6,col:hex('#bba29c'),raw:true,thick:1})}
  // stones on the corners, a basket of folded cloth
  for(let i=0;i<9;i++){const x=120+rn()*860,y=560+rn()*480;const r=7+rn()*8;const m=p.mask(rough(ellipse(x,y,r,r*.8,rn()*3),1,.2,i));cast(p,m,4);fill(p,m,[hex('#8c7c70'),hex('#a79a8c')][i%2],{w:4,len:9,dir:rn()*3});form(p,m,2)}
  const bi=vessel(p,175,900,82,[hex('#b88a4a'),hex('#a37238'),hex('#c99c5c')],{h:14,inside:hex('#5e3d22')});
  [[C.rose,-22,-14,.3],[C.white,16,-20,-.4],[C.teal,-4,16,.1],[C.saffron,28,18,.8]].forEach(([c,dx,dy,r])=>{const m=p.mask(rect(175+dx,900+dy,62,40,r));cast(p,m,3);fill(p,m,c,{w:7,len:24,dir:r});form(p,m,2)});
  return p}
