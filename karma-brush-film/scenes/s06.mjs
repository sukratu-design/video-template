// 6: in time each seed ripens into fruit (phala). The mango tree from above, harvest under way.
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,person,canopy,mango,vessel,hex,mix,shift,ellipse,rect,spline,rough,xf,fbm,clamp,radial,flow} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:606,ground:hex('#6a3a22')});
  const E=[hex('#c7773f'),hex('#b86a38'),hex('#d48a4e'),hex('#a85c30')];
  field(p,(x,y,r)=>shift(E[(r()*4)|0],{l:(fbm(x*.006,y*.006,4)-.5)*.14}),{w:18,len:50,density:1.8,dir:radial(520,520),dirJit:.5});
  // grass creeping in at the edges
  field(p,(x,y,r)=>[hex('#7fa844'),hex('#5c8a36'),hex('#9cbc54')][(r()*3)|0],{w:7,len:20,density:1.3,dir:flow(-1.2,.6,.01,3),dirJit:.5,sort:null,thick:1.2,
    clip:{at:(x,y)=>{const d=Math.hypot(x/p.S-540,y/p.S-540);return d>470+fbm(x*.004/p.S*2,y*.004/p.S*2,12)*240}}});
  const rn=p.rnd;
  // baskets, a ladder, fallen fruit
  const b1=vessel(p,150,905,88,[hex('#b88a4a'),hex('#a37238'),hex('#c99c5c')],{h:16,inside:hex('#5e3d22')});
  for(let i=0;i<9;i++){const a=i*2.4,d=18+i*5.4;mango(p,150+Math.cos(a)*d,905+Math.sin(a)*d,a*1.7,1.2,1,3)}
  const b2=vessel(p,930,965,70,[hex('#b88a4a'),hex('#a37238')],{h:14,inside:hex('#5e3d22')});for(let i=0;i<4;i++)mango(p,915+i*12,955+(i%2)*18,i*1.9,1.1,.85,3);
  for(let i=0;i<9;i++)mango(p,90+rn()*900,880+rn()*170,rn()*6,1,.6+rn()*.4,3);
  // the tree
  canopy(p,520,480,430,6,{fruit:54,sh:60,ripe:undefined});
  const lad=xf([[0,0]],{})[0];const la=.95;for(const k of[-1,1])p.line(xf([[-150,22*k],[170,22*k]],{x:880,y:770,rot:la}),{w:7,col:hex('#8a5a2e'),raw:true,thick:1.5});
  for(let i=0;i<8;i++){const q=xf([[-130+i*40,-22],[-130+i*40,22]],{x:880,y:770,rot:la});p.line(q,{w:5,col:hex('#a8743e'),raw:true,thick:1.4})}
  person(p,{x:300,y:960,rot:-.5,s:2.1,top:C.saffron,bottom:C.white,turban:C.vermilion,skin:SKIN[1],arms:[[-30,-22],[24,-26]],stride:4,shadow:6});
  person(p,{x:760,y:935,rot:.5,s:1.7,top:C.rose,bottom:C.teal,skirt:true,skin:SKIN[0],reach:[[700,905],null],arms:[null,[16,10]],shadow:6});
  mango(p,694,900,.6,1.5,1,5);
  return p}
