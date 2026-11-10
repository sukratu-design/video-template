// world.mjs: shared painted things (people seen from above, mangoes, trees, tiles, shadows).
import {hex,mix,shift,dark,ellipse,rect,capsule,spline,rough,xf,blob,fbm,vnoise,clamp,lerp,radial,tangent,flow} from '../engine/paint.mjs';
export const SUN=[.8,.6];                      // direction shadows fall (unit-ish), light comes from top-left
export const SHADOW={tint:[.5,.47,.78],alpha:.62};
export const SKIN=[hex('#b9794f'),hex('#a0623c'),hex('#c98e62'),hex('#8f5533')];
export const C={
  mango:hex('#f2a52c'),mangoRed:hex('#e2562a'),mangoGreen:hex('#8fa23a'),leaf:hex('#3f7a3a'),leafD:hex('#1f4a34'),leafL:hex('#8fb84a'),
  terra:hex('#c8683c'),terraD:hex('#8e4428'),sand:hex('#e2c392'),cream:hex('#f1e6cf'),white:hex('#f6f1e4'),ink:hex('#2a1c1c'),
  saffron:hex('#f08a1c'),indigo:hex('#2f4f9a'),teal:hex('#2e9c94'),rose:hex('#d8477a'),vermilion:hex('#d8382a'),gold:hex('#e8b53a'),violet:hex('#6a4fa0'),
  earth:hex('#7a4a2c'),earthD:hex('#4a2c1e'),brass:hex('#c9973a'),sky:hex('#7fd0d4'),
};
// cast shadow: the mask swept along the sun direction for `h` logical px
export function cast(p,m,h=10,o={}){const S=p.S;let sh=m.moved(SUN[0]*h*S,SUN[1]*h*S);const steps=Math.ceil(h/4);
  for(let i=1;i<steps;i++)sh=sh.or(m.moved(SUN[0]*h*S*i/steps,SUN[1]*h*S*i/steps));p.glaze(sh,{...SHADOW,...o});return sh}
// light and shade on a painted form: a bright crescent toward the sun, a dark one away from it
export function form(p,m,d=3,k=1){const S=p.S;const a=m.sub(m.moved(-SUN[0]*d*S,-SUN[1]*d*S)),b=m.sub(m.moved(SUN[0]*d*S,SUN[1]*d*S));
  p.glaze(a,{tint:[.6,.52,.74],alpha:.5*k});p.glaze(b,{add:[1,.96,.82],alpha:.2*k})}
// fill a small shape solidly with short strokes
export function fill(p,m,col,o={}){return p.area(m,{w:5,len:13,density:3.2,clip:true,jit:{l:.035,s:.05,h:.006},dirJit:.2,taper:.25,thick:.8,wet:.1,gap:.02,...o,col})}

// a person seen from above and a little to one side: head over broad shoulders, body foreshortened,
// and a long shadow that starts at the feet and falls away from the sun (that is what makes them stand up).
// Local coords: head toward -y, feet at y=40. Options: turban | hair (+bun, braid), skirt (sari/lehenga), kurta (long tunic),
// arms as local hand positions or reach as world targets, sash, hem (border colour), shadow (length factor, 0 for none).
export function person(p,o){const{x,y,rot=0,s=1,top=C.white,bottom=C.cream,skin=SKIN[0],hair=C.ink,turban=null,skirt=false,kurta=false,
    stride=0,shadow=1,sash=null,hem=null,bun=false,braid=false,reach=[]}=o;let arms=(o.arms||[[-19,6],[19,6]]).slice();const FY=.8;
  reach.forEach((w,i)=>{if(!w)return;const dx=w[0]-x,dy=w[1]-y,c=Math.cos(-rot),sn=Math.sin(-rot);arms[i]=[(dx*c-dy*sn)/s,(dx*sn+dy*c)/(s*FY)]});
  const T=pts=>xf(pts,{x,y,rot,sx:s,sy:s*FY});const ax=rot+Math.PI/2;const q=Math.sqrt(s);
  // every part as a local polygon first, so the shadow can be projected from the same shapes
  const L=[];const add=(polys,col,dir,w,kind)=>L.push({polys,col,dir,w,kind});
  if(skirt)add([spline([[-12,6],[12,6],[18,36],[8,41],[-8,41],[-18,36]],true,6)],bottom,ax,6,'cloth');
  else{add([capsule(-6.5,8,-7.5,33+stride,6.4,5)],bottom,ax,5,'cloth');add([capsule(6.5,8,7.5,33-stride,6.4,5)],bottom,ax,5,'cloth');
    add([ellipse(-7.8,38+stride,4.4,6.4)],skin,ax,3.5,'skin');add([ellipse(7.8,38-stride,4.4,6.4)],skin,ax,3.5,'skin')}
  if(kurta)add([spline([[-13,4],[13,4],[15,22],[0,25],[-15,22]],true,6)],top,ax,6,'cloth');
  const armL=[];arms.forEach((h,i)=>{if(!h)return;const sx=i?15:-15,sy=-15;const dx=h[0]-sx,dy=h[1]-sy,d=Math.hypot(dx,dy)||1;const bend=Math.max(0,34-d)*.42*(i?1:-1);
    const ex=sx+dx*.5-dy/d*bend,ey=sy+dy*.5+dx/d*bend;const an=rot+Math.atan2(dy,dx);
    armL.push({polys:[capsule(sx,sy,ex,ey,6,4.9)],col:top,dir:an,w:4.6,kind:'cloth'});
    armL.push({polys:[capsule(ex,ey,h[0],h[1],4.2,3.4)],col:skin,dir:an,w:3.6,kind:'skin'});
    armL.push({polys:[ellipse(h[0],h[1],4.1,4.6,Math.atan2(dy,dx))],col:skin,dir:an,w:3.4,kind:'skin'})});
  const front=armL.filter((_,i)=>arms[(i/3)|0]&&arms[(i/3)|0][1]>-6),back=armL.filter(a=>!front.includes(a));
  L.push(...back);
  add([spline([[-17,-16],[-10,-22],[10,-22],[17,-16],[14,5],[0,9],[-14,5]],true,6)],top,ax,6,'cloth');
  L.push(...front);
  add([ellipse(0,-24,turban?12.6:10.4,turban?11.8:10.6)],turban||hair,rot,4.4,'head');
  if(bun)add([ellipse(0,-13,5.4,5)],hair,rot,3.4,'head');
  if(shadow){const A=Math.atan2(SUN[1],SUN[0]);const ux=Math.cos(A),uy=Math.sin(A);const F=T([[0,40]])[0];const len=.82*shadow*s,wd=.8*s;
    const map=([px,py])=>{const along=(40-py)*len,side=px*wd;return[F[0]+ux*along-uy*side,F[1]+uy*along+ux*side]};
    let sh=null;for(const part of L)for(const poly of part.polys){const m=p.mask(poly.map(map));sh=sh?sh.or(m):m}
    const fm=p.mask(T(ellipse(0,38,13,6)));p.glaze(sh.or(fm),{...SHADOW,alpha:.58})}
  const masks=[];
  for(const part of L){const m=p.mask(...part.polys.map(T));masks.push(m);const pal=part.kind==='skin'?[part.col,shift(part.col,{l:.03}),shift(part.col,{l:-.03})]:[part.col,shift(part.col,{l:.025}),shift(part.col,{l:-.03,s:.05})];
    fill(p,m,pal,{w:part.w*q,len:part.w*2.7*q,dir:part.dir,density:3.4});form(p,m,2.4*s,part.kind==='head'?1.1:.95)}
  const pt=(lx,ly)=>T([[lx,ly]])[0];const ln=(pts,o2)=>p.line(pts.map(([a,b])=>pt(a,b)),o2);
  // cloth details: folds, hem, sash, placket
  const fold=shift(top,{l:-.09,s:.08}),foldB=shift(bottom,{l:-.09,s:.08});
  ln([[-9,-12],[-7,-2],[-9,5]],{w:1.6*s,col:fold,opacity:.6,thick:.6});ln([[9,-13],[8,-3],[10,4]],{w:1.6*s,col:fold,opacity:.6,thick:.6});
  if(skirt){for(const k of[-9,-3,4,10])ln([[k*.6,9],[k*1.05,24],[k*1.3,38]],{w:1.7*s,col:foldB,opacity:.55,thick:.6});
    if(hem)ln([[-17,36],[-8,40.5],[0,41],[8,40.5],[17,36]],{w:3.2*s,col:hem,thick:1.4})}
  else if(kurta){ln([[0,-8],[0,8],[0,22]],{w:1.4*s,col:fold,opacity:.6,thick:.6});if(hem)ln([[-14,21.5],[0,24.5],[14,21.5]],{w:2.6*s,col:hem,thick:1.3})}
  if(sash){ln([[-14,-17],[-2,-6],[10,6]],{w:5.2*s,col:sash,thick:1.1,tone:.1});ln([[-13,-16],[-2,-5],[9,5]],{w:1.4*s,col:shift(sash,{l:.12}),thick:1.5,opacity:.7})}
  // head: turban wound in bands with a knot, or hair with a parting and a highlight
  const hc=pt(0,-24);
  if(turban){for(let i=0;i<4;i++){const r=(3+i*3)*s;p.line(ellipse(hc[0],hc[1],r*1.04,r*.84,rot+i*.9,10).slice(0,8),{w:2.3*s,col:shift(turban,{l:i%2?.08:-.08}),thick:1.3})}
    p.dab(...pt(3,-27),rot+.5,6*s,3.4*s,shift(turban,{l:.14}),{thick:1.6});ln([[9,-18],[14,-12],[13,-5]],{w:3.4*s,col:shift(turban,{l:-.04}),thick:1.2})}
  else{ln([[0,-33],[0,-24]],{w:1.3*s,col:shift(hair,{l:.16}),opacity:.6,thick:1});p.dab(...pt(-4,-27),rot+1.2,7*s,2.6*s,shift(hair,{l:.13}),{thick:1,opacity:.8});
    if(braid){ln([[0,-14],[1,-2],[-1,10]],{w:3.6*s,col:hair,thick:1.4});p.dab(...pt(-1,12),ax,5*s,3*s,C.vermilion,{thick:1.4})}}
  return{T,hands:arms.map(h=>h?T([h])[0]:null)}}

export function mango(p,x,y,rot=0,s=1,ripe=1,shadow=4){const out=T=>xf(spline([[-17,1],[-10,-10],[4,-12.5],[15,-7],[18.5,3],[10,11.5],[-4,11],[-13,7.5]],true,6),{x,y,rot,sx:s*T,sy:s*T});
  const m=p.mask(out(1));if(shadow)cast(p,m,shadow*s);
  const c=Math.cos(rot),sn=Math.sin(rot);const base=ripe>.5?C.mango:mix(C.mangoGreen,C.mango,ripe*1.2);
  fill(p,m,(px,py,r)=>{const u=((px-x)*c+(py-y)*sn)/(18*s),v=(-(px-x)*sn+(py-y)*c)/(12*s);let col=mix(base,C.mangoRed,clamp(u*.75+.15)*ripe*.9);col=mix(col,C.mangoGreen,clamp(-u*1.1-.45)*.8+ (1-ripe)*.3);return mix(col,hex('#ffd97a'),clamp(-v*.6-.1))},
    {w:4*s,len:13*s,dir:(px,py)=>rot+.5*(-(px-x)*sn+(py-y)*c)/(12*s),thick:1.1,jit:{l:.03,h:.012}});
  form(p,m,2.4*s,.8);p.dab(x-Math.cos(rot)*17*s,y-Math.sin(rot)*17*s,rot+.6,5*s,2.2*s,C.earthD,{thick:1});
  p.dab(x+ (-2*c+5*sn)*s,y+(-2*sn-5*c)*s,rot,7*s,2.2*s,hex('#ffe9a8'),{opacity:.75,thick:1.2});return m}

// a tree canopy seen from above
export function canopy(p,cx,cy,r,seed=1,o={}){const{fruit=0,sh=26,cols=[C.leafD,C.leaf,C.leafL]}=o;const m=p.mask(rough(blob(cx,cy,r,seed,.22,60),r*.05,.05,seed));
  if(sh)p.glaze(m.moved(SUN[0]*sh*p.S,SUN[1]*sh*p.S),{...SHADOW,alpha:.55});
  const w=clamp(r*.07,7,16);const tuft=tangent(cx,cy);
  p.area(m,{w:w*1.5,len:w*3,density:1.6,sizeJit:.4,clip:false,col:shift(cols[0],{l:-.03}),jit:{l:.04,h:.02},dir:(x,y)=>tuft(x,y)+fbm(x*.02,y*.02,seed)*4,dirJit:.6,taper:.3});
  const lit=(x,y)=>fbm(x*.016+seed,y*.016,seed+2,3)*1.5-((x-cx)*SUN[0]+(y-cy)*SUN[1])/r*.45;
  p.area(m,{w,len:w*1.9,density:1.25,clip:false,col:(x,y,rn)=>{const l=lit(x,y)+(rn()-.5)*.25;return l>.9?cols[2]:l>.66?cols[1]:l>.5?mix(cols[0],cols[1],.5):cols[0]},sizeJit:.5,jit:{l:.05,h:.03,s:.1},dir:(x,y)=>tuft(x,y)+fbm(x*.03,y*.03,seed+4)*5,dirJit:.7,taper:.3,thick:1.2});
  p.area(m,{w:w*.7,len:w*1.5,density:.4,clip:false,col:(x,y,rn)=>lit(x,y)>.86?shift(cols[2],{l:.08,h:-.02}):cols[1],jit:{l:.05,h:.02},dir:(x,y)=>tuft(x,y)+fbm(x*.03,y*.03,seed+6)*5,dirJit:.8,thick:1.4});
  const rn=p.rnd;for(let i=0;i<fruit;i++){const a=rn()*6.283,d=Math.sqrt(rn())*r*.85;mango(p,cx+Math.cos(a)*d,cy+Math.sin(a)*d,rn()*6.283,clamp(r/260,.45,.9),o.ripe??(.5+rn()*.5),2)}
  return m}

// a floor of square tiles, each laid with two blunt strokes; grout is whatever is underneath
export function tiles(p,{ang=0,size=56,gap=4,cols=[C.terra],jit={l:.045,s:.08,h:.012},x0=-200,y0=-200,x1=1280,y1=1280,keep=null,o={}}={}){const c=Math.cos(ang),s=Math.sin(ang);const n=Math.ceil(1800/size);const rn=p.rnd;
  for(let j=-n;j<n;j++)for(let i=-n;i<n;i++){const cx=540+(i+.5)*size*c-(j+.5)*size*s,cy=540+(i+.5)*size*s+(j+.5)*size*c;if(cx<x0||cy<y0||cx>x1||cy>y1)continue;if(keep&&!keep(cx,cy))continue;
    let col=shift(cols[(rn()*cols.length)|0],{l:(rn()-.5)*2*jit.l,s:(rn()-.5)*2*jit.s,h:(rn()-.5)*2*jit.h});const v=rn()<.5;const a=ang+(v?Math.PI/2:0);const ox=v?-s:c,oy=v?c:s;const q=(size-gap)/4;
    for(const k of[-1,1])p.dab(cx+ox*0+(-oy)*q*k,cy+(ox)*q*k,a,size-gap,(size-gap)/2+1,shift(col,{l:(rn()-.5)*.03}),{taper:.1,ragged:.05,thick:.7,wet:.15,tone:.035,gap:.02,...o})}}

// a ribbon of given width along a centre line (returns a polygon)
export function band(pts,w){const sp=spline(pts,false,8),L=[],R=[];for(let i=0;i<sp.length;i++){const a=sp[Math.max(0,i-1)],b=sp[Math.min(sp.length-1,i+1)];let nx=-(b[1]-a[1]),ny=b[0]-a[0];const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;const ww=typeof w==='function'?w(i/(sp.length-1)):w;L.push([sp[i][0]+nx*ww/2,sp[i][1]+ny*ww/2]);R.push([sp[i][0]-nx*ww/2,sp[i][1]-ny*ww/2])}return L.concat(R.reverse())}
// cover the whole canvas with a ground of strokes
export function field(p,col,o={}){return p.area(p.full(),{w:24,len:64,density:1.5,clip:false,jit:{l:.035,s:.06,h:.012},taper:.3,thick:.8,wet:.3,...o,col})}
// a round vessel from above: rim ring, dark inside (returns inner mask)
export function vessel(p,cx,cy,r,col,o={}){const{rim=.16,h=14,inside=null}=o;const m=p.mask(ellipse(cx,cy,r,r));if(h)cast(p,m,h);
  p.area(m,{w:Math.max(4,r*.09),len:Math.max(10,r*.34),density:2.6,col,dir:tangent(cx,cy),dirJit:.1,jit:{l:.04,h:.008},taper:.2,thick:1.1});form(p,m,r*.06,.8);
  const mi=p.mask(ellipse(cx,cy,r*(1-rim),r*(1-rim)));p.area(mi,{w:Math.max(4,r*.1),len:Math.max(10,r*.3),density:2.4,col:inside||dark(col,.75),dir:tangent(cx,cy),jit:{l:.03}});
  p.glaze(mi.sub(mi.moved(SUN[0]*r*.16*p.S,SUN[1]*r*.16*p.S)),{tint:[.45,.4,.6],alpha:.6});return mi}
// a small bird from above: wings folded on the ground, spread when it is flying (lift > 10)
export function bird(p,x,y,rot,s=1,col=hex('#8a6a4a'),lift=3){const T=q=>xf(q,{x,y,rot,sx:s,sy:s});const fly=lift>10;
  const body=p.mask(T(spline([[13,0],[7,-6.5],[-7,-6.5],[-24,-3],[-24,3],[-7,6.5],[7,6.5]],true,5)),T(ellipse(11,0,6,5.5)));
  const wings=fly?p.mask(T(spline([[4,-5],[10,-27],[-3,-32],[-10,-5]],true,5)),T(spline([[4,5],[10,27],[-3,32],[-10,5]],true,5))):null;
  p.glaze((wings?body.or(wings):body).moved(SUN[0]*lift*s*p.S,SUN[1]*lift*s*p.S),SHADOW);
  if(wings){fill(p,wings,shift(col,{l:-.05}),{w:3*s,len:9*s,dir:rot+1.57});form(p,wings,1.5*s,.8)}
  fill(p,body,col,{w:3*s,len:9*s,dir:rot});form(p,body,1.6*s,.9);
  if(!fly)for(const k of[-1,1])p.dab(...T([[-6,3.2*k]])[0],rot+.12*k,17*s,3.4*s,shift(col,{l:-.14}),{thick:1.2});
  p.dab(...T([[11,0]])[0],rot,7*s,5*s,shift(col,{l:fly?-.02:-.2}),{thick:1.2});p.dab(...T([[18.5,0]])[0],rot,5*s,2.2*s,hex('#e8a23a'),{thick:1.4,taper:.8})}
export {hex,mix,shift,dark,ellipse,rect,capsule,spline,rough,xf,blob,fbm,vnoise,clamp,lerp,radial,tangent,flow};
