// 1 (and 13): the gift. A courtyard from above; one person hands a mango to another.
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,person,mango,canopy,tiles,hex,mix,shift,ellipse,rect,spline,rough,blob,flow,tangent} from './world.mjs';
export default function(opt={}){const evening=!!opt.evening;
  const p=new Painting({...opt,seed:evening?113:101,ground:hex('#6e3f2a')});
  const ang=-.2;
  tiles(p,{ang,size:72,gap:5,cols:evening?[hex('#d98a4a'),hex('#cf7a40'),hex('#e09a58')]:[hex('#d9a878'),hex('#cf9668'),hex('#e2b68a'),hex('#c98a5c')]});
  // sun stripes: shadow bars from roof beams, falling across the left of the court
  for(let i=0;i<3;i++){const x=-420+i*230;const bar=p.mask(rough([[x,-40],[x+120,-40],[x+120+760,1120],[x+760,1120]],2,.03,i+3));p.glaze(bar,{...SHADOW,alpha:evening?.5:.42,streak:.25})}
  // basket of mangoes
  const bx=250,by=800;const bm=p.mask(ellipse(bx,by,92,92));cast(p,bm,16);
  p.area(bm,{w:7,len:26,density:2.4,col:[hex('#b88a4a'),hex('#a37238'),hex('#c99c5c')],dir:tangent(bx,by),dirJit:.12,jit:{l:.04},taper:.2,thick:1.1});
  p.area(p.mask(ellipse(bx,by,74,74)),{w:9,len:22,density:2,col:hex('#5e3d22'),dir:tangent(bx,by),jit:{l:.03}});
  [[-30,-22,.3],[22,-34,2],[40,12,1.2],[-8,30,4],[-44,24,5.2],[4,-4,.9],[30,44,3.3]].forEach(([dx,dy,r],i)=>mango(p,bx+dx,by+dy,r,1.25,i%3?1:.7,3));
  // tree in the corner
  canopy(p,930,150,250,7,{fruit:9,sh:34});
  // the two people, and the mango between their hands
  const G=[590,520];
  person(p,{x:400,y:500,rot:.22,s:3,top:C.white,bottom:hex('#e9dcc0'),turban:evening?C.rose:C.saffron,skin:SKIN[1],arms:[[-19,10],null],reach:[null,[G[0]-30,G[1]+6]],stride:5,kurta:true,hem:C.gold});
  person(p,{x:770,y:560,rot:-.3,s:2.3,top:evening?C.teal:C.indigo,bottom:hex('#d8c9a8'),skin:SKIN[0],arms:[null,[18,10]],reach:[[G[0]+30,G[1]+10],null],stride:-4});
  mango(p,G[0],G[1],-.4,2.1,1,8);
  // a few fallen leaves
  const rn=p.rnd;for(let i=0;i<16;i++){const x=640+rn()*420,y=250+rn()*200;p.dab(x,y,rn()*6.28,16,6,[C.leaf,C.leafL,hex('#b8962e')][i%3],{thick:1.2,curve:.6})}
  return p}
