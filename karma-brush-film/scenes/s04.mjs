// 4: the store. A great clay pot holding every seed ever sown (sanchita karma).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,person,tiles,vessel,hex,mix,shift,dark,ellipse,spline,rough,fbm,clamp,tangent} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:404,ground:hex('#6e3f2a')});
  tiles(p,{ang:.14,size:118,gap:7,cols:[hex('#d9a878'),hex('#cf9668'),hex('#e2b68a'),hex('#c98a5c')]});
  const cx=560,cy=585,R=372;const rn=p.rnd;
  // the pot: shadow, outer rim, inner wall
  const outer=p.mask(ellipse(cx,cy,R,R));cast(p,outer,58,{alpha:.6});
  p.area(outer,{w:15,len:70,density:2.4,col:[hex('#c4623a'),hex('#b55532'),hex('#d17446'),hex('#a94c2c')],dir:tangent(cx,cy),dirJit:.07,curve:1,jit:{l:.03},taper:.2,thick:1.2});
  form(p,outer,16,1);
  const inner=p.mask(ellipse(cx,cy,R-44,R-44));
  p.area(inner,{w:16,len:50,density:2,col:[hex('#3b2018'),hex('#4a281c'),hex('#2e1814')],dir:tangent(cx,cy),jit:{l:.02}});
  // hundreds of seeds, each one a pair of strokes: its shadow, then the seed
  const husk=[hex('#d9bf8c'),hex('#cdb07a'),hex('#e6d2a4'),hex('#bf9a62'),hex('#c9a66e'),hex('#efe0b8')];const seeds=[];
  for(let y=cy-R;y<cy+R;y+=27)for(let x=cx-R;x<cx+R;x+=27){const sx=x+rn()*22,sy=y+rn()*22;if(Math.hypot(sx-cx,sy-cy)<R-66)seeds.push([sx,sy,rn()*Math.PI,rn()])}
  seeds.sort((a,b)=>a[3]-b[3]);
  for(const[x,y,a]of seeds)p.dab(x+5,y+4,a,40,19,hex('#24130f'),{taper:.55,thick:.4,opacity:.8});
  let k=0;for(const[x,y,a,r]of seeds){const glow=(k++%23===5);const c=glow?hex('#f6c544'):shift(husk[(r*6)|0],{l:(rn()-.5)*.07,h:(rn()-.5)*.02});
    p.dab(x,y,a,40,18,c,{taper:.6,thick:1.5,tone:.11,ragged:.06,gap:.06,wet:.05});p.dab(x-2,y-2,a,26,3,shift(c,{l:.1}),{thick:1.7,opacity:.8})}
  // the shaded inner wall falls across the seeds
  p.glaze(inner.sub(inner.moved(SUN[0]*52*p.S,SUN[1]*52*p.S)),{tint:[.45,.4,.62],alpha:.62});
  // someone adds today's seed; a few lie spilled on the floor
  person(p,{x:150,y:170,rot:-.75,s:2.15,top:C.teal,bottom:C.rose,skirt:true,hair:C.ink,skin:SKIN[0],arms:[[-16,10],null],reach:[null,[262,292]],shadow:6,sash:C.gold});
  p.dab(268,300,.7,40,18,hex('#e6d2a4'),{taper:.6,thick:1.5,tone:.11});
  [[90,640,.4],[120,720,2],[970,150,1.1],[60,900,2.6],[1010,990,.3]].forEach(([x,y,a])=>{p.dab(x+5,y+5,a,38,17,hex('#3a2018'),{taper:.55,opacity:.6,thick:.3});p.dab(x,y,a,38,17,husk[(rn()*6)|0],{taper:.6,thick:1.5,tone:.11})});
  return p}
