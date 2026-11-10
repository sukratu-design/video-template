// 10: act fully, let go of the fruit. Dawn; the yard is swept, a bowl of water is left for the birds, and the giver is already walking away (Gita 2.47).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,person,canopy,vessel,bird,hex,mix,shift,ellipse,rect,spline,rough,xf,blob,fbm,clamp,flow} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:1010,ground:hex('#6a4a4a')});
  const F=[hex('#dcb9a6'),hex('#d2ac9a'),hex('#e6c6b2'),hex('#c9a090')];
  field(p,(x,y,r)=>shift(F[(r()*4)|0],{l:(fbm(x*.005,y*.005,3)-.5)*.1}),{w:22,len:60,density:1.8,dir:flow(.2,.6,.004,2),dirJit:.4});
  // broom marks: fans of long dry arcs
  const rn=p.rnd;for(let j=0;j<7;j++)for(let i=0;i<8;i++){const fx=-60+i*165+(j%2)*80,fy=30+j*170;for(let k=0;k<9;k++){const r=40+k*17,a0=-2.5+rn()*.15;const pts=[];for(let t=0;t<=6;t++){const a=a0+t*.27;pts.push([fx+Math.cos(a)*r,fy+Math.sin(a)*r*.8])}
    p.line(pts,{w:5+rn()*4,col:k%3?hex('#efd6c2'):hex('#bf9686'),opacity:.55,dry:1.1,thick:.9,tone:.14,gap:.2})}}
  // long shadow of the house wall across the top-right, the low sun coming in under it
  p.glaze(p.mask(rough([[560,-40],[1120,-40],[1120,640],[980,520]],6,.02,3)),{...SHADOW,alpha:.5,streak:.2});
  // tulsi planter on its plinth
  const tx=830,ty=250;const pl=p.mask(rect(tx,ty,150,150,.2));cast(p,pl,70,{alpha:.55});fill(p,pl,[hex('#f1e6cf'),hex('#e6d8bc'),hex('#f6efe0')],{w:10,len:36,dir:.2});form(p,pl,8,1);
  for(const s of[1,.72]){const q=rect(tx,ty,150*s,150*s,.2);q.push(q[0]);p.line(q,{w:6,col:hex('#b8442c'),raw:true,thick:1.3,taper:.1})}
  canopy(p,tx,ty,50,5,{sh:0,cols:[hex('#1f4a34'),hex('#3f7a3a'),hex('#8fb84a')]});
  const dm=vessel(p,tx-96,ty+84,13,[hex('#c4623a'),hex('#d17446')],{h:4,inside:hex('#5a3a1e')});p.dab(tx-96,ty+84,-.6,9,5,hex('#ffd97a'),{thick:1.8});p.glow(tx-96,ty+84,40,hex('#ffcf6a'),.35);
  // swept-up heap of leaves
  const hp=p.mask(rough(blob(150,930,84,5,.25),4,.08,2));cast(p,hp,10);p.area(hp,{w:6,len:17,density:3,col:[hex('#b8962e'),hex('#8a6a2a'),hex('#c9742a'),C.leaf,hex('#d8b24a')],dir:flow(0,3,.05,9),dirJit:1.5,clip:false,thick:1.6,curve:1});
  // the bowl of water
  const bx=560,by=640;const wi=vessel(p,bx,by,104,[hex('#c9973a'),hex('#b8862c'),hex('#dcae52'),hex('#e8c468')],{h:20,rim:.15,inside:hex('#3f8a9a')});
  p.area(wi,{w:8,len:30,density:2.2,col:[hex('#4f9aa8'),hex('#63aebb'),hex('#3f8a9a'),hex('#7cc4c8')],dir:(x,y)=>Math.atan2(y-by,x-bx)+1.57,dirJit:.1,curve:1,wet:.5});
  for(const r of[22,44,66]){const q=ellipse(bx+30,by-22,r,r*.92,0,20);p.line(q.slice(0,13+((r/22)|0)*2),{w:2.5,col:C.white,opacity:.7,thick:1.4,dry:.6})}
  // birds come down to drink
  bird(p,bx+70,by-66,2.4,1.9,hex('#8a6a4a'),2);
  [[420,500,.7],[700,790,-2.5],[380,760,-.4],[760,560,3],[640,860,-1.9],[300,610,.1]].forEach(([x,y,a],i)=>bird(p,x,y,a,1.8,[hex('#8a6a4a'),hex('#9a7856'),hex('#6f5a48')][i%3],2));
  bird(p,900,760,2.7,1.9,hex('#7a6050'),30);
  // the one who did all this is already leaving, broom over the shoulder, long shadow behind
  const bq=[[262,150],[150,285]];p.line(bq.map(([x,y])=>[x+SUN[0]*16,y+SUN[1]*16]),{w:6,col:hex('#6a5a6a'),opacity:.45,raw:true,thick:.2});p.line(bq,{w:6,col:hex('#8a5a2e'),raw:true,thick:1.5});
  for(let i=0;i<12;i++){const a=2.2+(i-6)*.06;p.line([[150,285],[150+Math.cos(a)*74,285+Math.sin(a)*74]],{w:4,col:[hex('#d9b77c'),hex('#c49a5e'),hex('#e3c690')][i%3],raw:true,thick:1.4,dry:.5})}
  person(p,{x:205,y:150,rot:-.62,s:2.05,top:C.white,bottom:hex('#e3d3b0'),turban:C.saffron,skin:SKIN[1],arms:[[-18,6],null],reach:[null,[250,165]],stride:8,shadow:14});
  for(let i=0;i<9;i++){const t=i/9;p.dab(455-t*190+(i%2?7:-7),545-t*270,-2.2,11,4.5,hex('#b98a7a'),{opacity:.7,thick:.5})}
  return p}
