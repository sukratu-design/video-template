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

// a person seen from above (drawn as if lying on the ground plane, like figures on a map)
export function person(p,o){const{x,y,rot=0,s=1,top=C.white,bottom=C.cream,skin=SKIN[0],hair=C.ink,turban=null,skirt=false,
    stride=0,shadow=5,sash=null,reach=[]}=o;let arms=(o.arms||[[-17,8],[17,8]]).slice();
  reach.forEach((w,i)=>{if(!w)return;const dx=w[0]-x,dy=w[1]-y,c=Math.cos(-rot),sn=Math.sin(-rot);arms[i]=[(dx*c-dy*sn)/s,(dx*sn+dy*c)/(s*.9)]});
  const T=pts=>xf(pts,{x,y,rot,sx:s,sy:s*.9});const M=(...q)=>p.mask(...q.map(T));const ax=rot+Math.PI/2;
  const parts=[];
  if(skirt)parts.push({m:M(spline([[-11,8],[11,8],[16,50],[0,53],[-16,50]],true,6)),col:bottom,dir:ax,w:6});
  else{parts.push({m:M(capsule(-6,10,-7,48+stride,6.5,5)),col:bottom,dir:ax,w:5});parts.push({m:M(capsule(6,10,7,48-stride,6.5,5)),col:bottom,dir:ax,w:5});
    parts.push({m:M(ellipse(-7,52+stride,4.5,6)),col:skin,dir:ax,w:4});parts.push({m:M(ellipse(7,52-stride,4.5,6)),col:skin,dir:ax,w:4})}
  const armParts=[];arms.forEach((h,i)=>{if(!h)return;const sx=i?14:-14,sy=-17;const ex=(sx+h[0])/2+(i?4:-4),ey=(sy+h[1])/2;
    armParts.push({m:M(capsule(sx,sy,ex,ey,5.6,4.8),capsule(ex,ey,h[0],h[1],4.8,4)),col:o.sleeve===false?skin:top,dir:rot+Math.atan2(h[1]-sy,h[0]-sx),w:4.5});
    armParts.push({m:M(ellipse(h[0],h[1],4.3,4.3)),col:skin,dir:ax,w:4})});
  const torso={m:M(spline([[-14,-21],[0,-25],[14,-21],[12,12],[0,15],[-12,12]],true,6)),col:top,dir:ax,w:6};
  const head={m:M(ellipse(0,-33,turban?12.5:10,turban?12:10.5)),col:turban||hair,dir:rot,w:4.5};
  const all=[...parts,...armParts,torso,head];
  if(shadow){let sh=null;for(const q of all){const mm=q.m.moved(SUN[0]*shadow*s*p.S,SUN[1]*shadow*s*p.S);sh=sh?sh.or(mm):mm}p.glaze(sh,SHADOW)}
  for(const q of all){fill(p,q.m,q.col,{w:q.w*Math.sqrt(s),len:q.w*2.6*Math.sqrt(s),dir:q.dir});form(p,q.m,2.2*s,.9)}
  if(sash){p.line([T([[-12,-20]])[0],T([[2,-4]])[0],T([[11,11]])[0]],{w:5*s,col:sash,thick:.9})}
  if(turban){const c=T([[0,-33]])[0];for(let i=0;i<3;i++){const r=(4+i*3.2)*s;p.line(ellipse(c[0],c[1],r,r*.9,rot+i,9).slice(0,7),{w:2.2*s,col:shift(turban,{l:i%2?.07:-.07}),thick:1.2})}}
  else{const c=T([[2,-35]])[0];p.dab(c[0],c[1],rot+.4,7*s,3*s,shift(hair,{l:.1}),{thick:.8})}
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
