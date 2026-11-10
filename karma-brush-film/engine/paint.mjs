// paint.mjs: a small simulated paint engine. No image model, no tracing.
// Every mark is a brush stroke: a bundle of bristles dragged along a path, each
// bristle carrying its own tone, paint load and thickness, picking up wet paint
// from the canvas as it goes. Paint thickness is kept in a height map and lit at
// the end (impasto). All randomness is seeded, so a scene always paints the same.
import zlib from 'node:zlib';
import fs from 'node:fs';

// ---------- random / noise ----------
export function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function hash2(x,y,s=0){let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1442695041);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296}
export function vnoise(x,y,s=0){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  const a=hash2(xi,yi,s),b=hash2(xi+1,yi,s),c=hash2(xi,yi+1,s),d=hash2(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
export function fbm(x,y,s=0,oct=3){let v=0,a=.5,t=0;for(let i=0;i<oct;i++){v+=a*vnoise(x,y,s+i*17);t+=a;x*=2;y*=2;a*=.5}return v/t}
export const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
export const lerp=(a,b,t)=>a+(b-a)*t;
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};

// ---------- colour ----------
export function hex(s){s=s.replace('#','');return[parseInt(s.slice(0,2),16)/255,parseInt(s.slice(2,4),16)/255,parseInt(s.slice(4,6),16)/255]}
export const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
export function rgb2hsl([r,g,b]){const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;const d=mx-mn;
  if(d>1e-6){s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6}return[h,s,l]}
export function hsl2rgb([h,s,l]){h=((h%1)+1)%1;s=clamp(s);l=clamp(l);if(s<1e-6)return[l,l,l];const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
  const f=t=>{t=((t%1)+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[f(h+1/3),f(h),f(h-1/3)]}
export function shift(c,{h=0,s=0,l=0}){const k=rgb2hsl(c);return hsl2rgb([k[0]+h,k[1]*(1+s),k[2]+l])}
export const dark=(c,t=.3,tint=[.16,.12,.3])=>mix(c,[c[0]*tint[0]*2.2,c[1]*tint[1]*2.2,c[2]*tint[2]*2.2],t);

// ---------- shapes (logical coordinates, return point lists) ----------
export function ellipse(cx,cy,rx,ry=rx,rot=0,n=0){n=n||Math.max(14,Math.ceil((rx+ry)*.6));const p=[],c=Math.cos(rot),s=Math.sin(rot);
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=Math.cos(a)*rx,y=Math.sin(a)*ry;p.push([cx+x*c-y*s,cy+x*s+y*c])}return p}
export function rect(cx,cy,w,h,rot=0){const c=Math.cos(rot),s=Math.sin(rot);return[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>[cx+x*c-y*s,cy+x*s+y*c])}
export function capsule(x1,y1,x2,y2,r1,r2=r1){const a=Math.atan2(y2-y1,x2-x1),p=[];const n=8;
  for(let i=0;i<=n;i++){const t=a+Math.PI/2+i/n*Math.PI;p.push([x1+Math.cos(t)*r1,y1+Math.sin(t)*r1])}
  for(let i=0;i<=n;i++){const t=a-Math.PI/2+i/n*Math.PI;p.push([x2+Math.cos(t)*r2,y2+Math.sin(t)*r2])}return p}
export function spline(ctrl,closed=true,seg=10){const n=ctrl.length,o=[];const m=closed?n:n-1;
  for(let i=0;i<m;i++){const p0=ctrl[closed?(i-1+n)%n:Math.max(0,i-1)],p1=ctrl[i],p2=ctrl[closed?(i+1)%n:Math.min(n-1,i+1)],p3=ctrl[closed?(i+2)%n:Math.min(n-1,i+2)];
    for(let k=0;k<seg;k++){const t=k/seg,t2=t*t,t3=t2*t;o.push([.5*(2*p1[0]+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
      .5*(2*p1[1]+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)])}}
  if(!closed)o.push(ctrl[n-1]);return o}
// wobble a closed outline along its normals so edges look hand-painted
export function rough(pts,amp=1.5,freq=.08,seed=1){const n=pts.length,o=[];let acc=0;
  for(let i=0;i<n;i++){const a=pts[(i-1+n)%n],b=pts[(i+1)%n],p=pts[i];let nx=b[1]-a[1],ny=-(b[0]-a[0]);const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;
    acc+=Math.hypot(p[0]-a[0],p[1]-a[1])*.5;const d=(fbm(acc*freq,seed*7.3,seed,2)-.5)*2*amp;o.push([p[0]+nx*d,p[1]+ny*d])}return o}
export function xf(pts,{x=0,y=0,rot=0,sx=1,sy=sx}={}){const c=Math.cos(rot),s=Math.sin(rot);return pts.map(([px,py])=>{px*=sx;py*=sy;return[x+px*c-py*s,y+px*s+py*c]})}
export function blob(cx,cy,r,seed=1,amp=.25,n=40){const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;const rr=r*(1+(fbm(Math.cos(a)*1.3+5,Math.sin(a)*1.3+5,seed,3)-.5)*2*amp);p.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr])}return p}

// ---------- masks (device pixels) ----------
export class Mask{
  constructor(x0,y0,w,h,d){this.x0=x0;this.y0=y0;this.w=w;this.h=h;this.d=d||new Uint8Array(w*h)}
  at(x,y){x-=this.x0;y-=this.y0;return x>=0&&y>=0&&x<this.w&&y<this.h&&this.d[y*this.w+x]===1}
  _bin(m,f){const x0=Math.min(this.x0,m.x0),y0=Math.min(this.y0,m.y0),x1=Math.max(this.x0+this.w,m.x0+m.w),y1=Math.max(this.y0+this.h,m.y0+m.h);
    const o=new Mask(x0,y0,x1-x0,y1-y0);for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(f(this.at(x,y),m.at(x,y)))o.d[(y-y0)*o.w+(x-x0)]=1;return o}
  or(m){return this._bin(m,(a,b)=>a||b)}
  sub(m){return this._bin(m,(a,b)=>a&&!b)}
  and(m){return this._bin(m,(a,b)=>a&&b)}
  moved(dx,dy){return new Mask(this.x0+Math.round(dx),this.y0+Math.round(dy),this.w,this.h,this.d)}
  area(){let n=0;for(let i=0;i<this.d.length;i++)n+=this.d[i];return n}
}

function png(file,W,H,rgb){const raw=Buffer.alloc((W*3+1)*H);for(let y=0;y<H;y++){raw[y*(W*3+1)]=0;rgb.copy(raw,y*(W*3+1)+1,y*W*3,(y+1)*W*3)}
  const chunk=(t,d)=>{const b=Buffer.alloc(8+d.length+4);b.writeUInt32BE(d.length,0);b.write(t,4,'ascii');d.copy(b,8);b.writeUInt32BE(zlib.crc32(b.subarray(4,8+d.length)),8+d.length);return b};
  const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(H,4);ih[8]=8;ih[9]=2;
  fs.writeFileSync(file,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw,{level:6})),chunk('IEND',Buffer.alloc(0))]))}

// ---------- the painting ----------
export class Painting{
  constructor({size=1080,scale=2,seed=1,ground=[.78,.66,.5]}={}){
    this.S=scale;this.size=size;const W=this.W=size*scale,H=this.H=size*scale;this.seed=seed;this.rnd=mulberry32(seed);
    this.c=new Float32Array(W*H*3);this.h=new Float32Array(W*H);this.strokes=0;
    // canvas tooth: woven threads plus fine noise, 0..1
    const g=this.grain=new Float32Array(W*H);const wv=Math.PI/(1.6*scale);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const w=.5+.25*(Math.sin(x*wv)+Math.sin(y*wv))*(.75+.5*vnoise(x*.02,y*.02,seed+3));
      g[y*W+x]=clamp(.55*w+.45*hash2(x,y,seed)*.8+.2*(vnoise(x*.35,y*.35,seed+9)-.5))}
    for(let i=0;i<W*H;i++){const v=(g[i]-.5)*.05;this.c[i*3]=ground[0]+v;this.c[i*3+1]=ground[1]+v;this.c[i*3+2]=ground[2]+v}
    this.snaps=null;
  }
  // rasterise one or more closed polygons (logical coords) into a mask
  mask(...polys){const S=this.S;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const P=polys.map(p=>p.map(([x,y])=>[x*S,y*S]));
    for(const p of P)for(const[x,y]of p){if(x<x0)x0=x;if(y<y0)y0=y;if(x>x1)x1=x;if(y>y1)y1=y}
    x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(this.W,Math.ceil(x1)+1);y1=Math.min(this.H,Math.ceil(y1)+1);
    const m=new Mask(x0,y0,Math.max(1,x1-x0),Math.max(1,y1-y0));
    for(const p of P){const n=p.length;for(let y=y0;y<y1;y++){const yc=y+.5,xs=[];
      for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
      xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2){const xa=Math.max(x0,Math.round(xs[k])),xb=Math.min(x1,Math.round(xs[k+1]));for(let x=xa;x<xb;x++)m.d[(y-y0)*m.w+(x-x0)]=1}}}
    return m}
  full(){const m=new Mask(0,0,this.W,this.H);m.d.fill(1);return m}

  // one brush stroke along a dense device-space path
  _stroke(px,py,wDev,col,o={}){
    const W=this.W,H=this.H,c=this.c,hh=this.h,g=this.grain,r=this.rnd;const n=px.length;if(n<2)return;this.strokes++;
    const bs=o.bs||1.5;const nb=Math.max(2,Math.round(wDev/bs));
    const opacity=o.opacity??.96,thick=o.thick??1,wet=o.wet??.25,ragged=o.ragged??.12,tonev=o.tone??.07,gap=o.gap??.05,dry=o.dry??0,clip=o.clip||null,taper=o.taper??.5;
    const aS=1-Math.pow(1-opacity,.42);
    const u=new Float32Array(nb),tn=new Float32Array(nb),s0=new Float32Array(nb),s1=new Float32Array(nb),bh=new Float32Array(nb),ld=new Float32Array(nb),
      br=new Float32Array(nb),bg=new Float32Array(nb),bb=new Float32Array(nb);const alive=new Uint8Array(nb);
    let t0=0,h0=.5;
    for(let i=0;i<nb;i++){u[i]=(nb>1?i/(nb-1)-.5:0)+(r()-.5)*.4/nb;t0=t0*.65+(r()-.5)*.7;h0=h0*.6+r()*.4;tn[i]=1+t0*tonev*2;
      s0[i]=r()*r()*ragged;s1[i]=1-r()*r()*ragged*1.4;const e=Math.abs(u[i])*2;bh[i]=thick*(.45+h0*.7+(e>.8?.35:0));ld[i]=.55+r()*.6;alive[i]=r()<gap?0:1;
      br[i]=col[0]*tn[i];bg[i]=col[1]*tn[i];bb[i]=col[2]*tn[i]}
    const dep=dry>0?dry/n:0;
    for(let k=0;k<n;k++){const t=k/(n-1);const ka=Math.max(0,k-1),kb=Math.min(n-1,k+1);let tx=px[kb]-px[ka],ty=py[kb]-py[ka];const tl=Math.hypot(tx,ty)||1;const nx=-ty/tl,ny=tx/tl;
      const pr=1-taper*(1-smooth(0,.14,t)*smooth(0,.18,1-t));const ww=wDev*pr;const endBlob=1+.5*smooth(.8,1,t);
      for(let i=0;i<nb;i++){if(!alive[i]||t<s0[i]||t>s1[i])continue;
        const x=px[k]+nx*u[i]*ww,y=py[k]+ny*u[i]*ww;const ix=Math.round(x),iy=Math.round(y);if(ix<1||iy<1||ix>=W-1||iy>=H-1)continue;
        if(clip&&!clip.at(ix,iy))continue;
        let a=aS;const q=iy*W+ix;
        if(dep){const l=ld[i]-k*dep;if(l<=0)continue;if(l<.45){if(g[q]<.5+(.45-l)*1.1)continue;a*=.8}}
        if(wet){const p3=q*3,wv=wet*.06;br[i]+=(c[p3]-br[i])*wv;bg[i]+=(c[p3+1]-bg[i])*wv;bb[i]+=(c[p3+2]-bb[i])*wv}
        const R=br[i],G=bg[i],B=bb[i],ht=bh[i]*endBlob;
        for(let dy=-1;dy<=1;dy++){const row=(iy+dy)*W+ix;for(let dx=-1;dx<=1;dx++){const wk=a*(dx===0&&dy===0?1:(dx===0||dy===0?.6:.3));const p=row+dx,p3=p*3;
          c[p3]+=(R-c[p3])*wk;c[p3+1]+=(G-c[p3+1])*wk;c[p3+2]+=(B-c[p3+2])*wk;hh[p]+=(ht-hh[p])*wk}}
      }}
    if(this.snaps&&this.strokes%this.snapEvery===0)this._snap();
  }
  // a short dab centred at logical (x,y)
  dab(x,y,ang,len,w,col,o={}){const S=this.S;const L=len*S,n=Math.max(3,Math.round(L));const px=new Float32Array(n),py=new Float32Array(n);const k=(o.curve||0)/L;
    let a=ang-k*L/2,cx=x*S-Math.cos(ang)*L/2,cy=y*S-Math.sin(ang)*L/2;for(let i=0;i<n;i++){px[i]=cx;py[i]=cy;cx+=Math.cos(a);cy+=Math.sin(a);a+=k}
    this._stroke(px,py,w*S,col,o)}
  // one long stroke through logical points (smoothed)
  line(pts,o={}){const S=this.S;const sp=o.raw?pts:spline(pts,false,8);const px=[],py=[];
    for(let i=0;i<sp.length-1;i++){const a=sp[i],b=sp[i+1],d=Math.hypot(b[0]-a[0],b[1]-a[1])*S,m=Math.max(1,Math.round(d));for(let k=0;k<m;k++){px.push((a[0]+(b[0]-a[0])*k/m)*S);py.push((a[1]+(b[1]-a[1])*k/m)*S)}}
    this._stroke(Float32Array.from(px),Float32Array.from(py),(o.w||4)*S,o.col||[0,0,0],{taper:.6,ragged:.05,...o})}
  // cover a mask with many strokes.
  // o.col: [r,g,b] | palette [[r,g,b],...] | (x,y,rnd)=>[r,g,b];  o.dir: angle | (x,y)=>angle
  area(mask,o={}){const S=this.S,r=this.rnd;const w=o.w||14,len=o.len||w*2.4,dens=o.density||1.6;const cell=Math.sqrt(w*len*.6/dens)*S;
    const pts=[];for(let gy=mask.y0;gy<mask.y0+mask.h;gy+=cell)for(let gx=mask.x0;gx<mask.x0+mask.w;gx+=cell){const x=gx+r()*cell,y=gy+r()*cell;if(mask.at(x|0,y|0))pts.push([x/S,y/S])}
    for(let i=pts.length-1;i>0;i--){const j=(r()*(i+1))|0;const t=pts[i];pts[i]=pts[j];pts[j]=t}
    if(o.sort)pts.sort(o.sort);
    const col=o.col,isFn=typeof col==='function',isPal=!isFn&&Array.isArray(col[0]);const dir=o.dir??0,dfn=typeof dir==='function';const J=o.jit||{};const dj=o.dirJit??.25,sj=o.sizeJit??.3;
    const so={clip:o.clip===false?null:(o.clip===true||o.clip===undefined?mask:o.clip),opacity:o.opacity,thick:o.thick,wet:o.wet,ragged:o.ragged,tone:o.tone,gap:o.gap,dry:o.dry,taper:o.taper,bs:o.bs};
    for(const[x,y]of pts){let cc=isFn?col(x,y,r):isPal?col[(r()*col.length)|0]:col;
      if(J.l||J.s||J.h)cc=shift(cc,{l:(r()-.5)*2*(J.l||0),s:(r()-.5)*2*(J.s||0),h:(r()-.5)*2*(J.h||0)});
      const a=(dfn?dir(x,y):dir)+(r()-.5)*2*dj;this.dab(x,y,a,len*(1-sj+r()*2*sj),w*(1-sj*.6+r()*sj*1.2),cc,{...so,curve:(r()-.5)*(o.curve??.5)})}
    return pts.length}
  // thin transparent wash over a mask (cast shadows, dusk, glow). tint multiplies; add lerps toward a colour.
  glaze(mask,{tint=[.62,.6,.85],alpha=.6,add=null,streak=0,ang=.6}={}){const W=this.W,c=this.c,S=this.S;const ca=Math.cos(ang),sa=Math.sin(ang);
    for(let y=mask.y0;y<mask.y0+mask.h;y++)for(let x=mask.x0;x<mask.x0+mask.w;x++){if(!mask.d[(y-mask.y0)*mask.w+(x-mask.x0)])continue;const p=(y*W+x)*3;
      let a=alpha*(.9+.2*vnoise(x*.03/S,y*.03/S,this.seed+5));if(streak)a*=1-streak+streak*2*vnoise((x*ca+y*sa)*.012/S,(-x*sa+y*ca)*.35/S,this.seed+8);a=clamp(a);
      if(add){c[p]+=(add[0]-c[p])*a;c[p+1]+=(add[1]-c[p+1])*a;c[p+2]+=(add[2]-c[p+2])*a}
      else{c[p]*=1-a+a*tint[0];c[p+1]*=1-a+a*tint[1];c[p+2]*=1-a+a*tint[2]}}}
  // soft radial light or dark (logical coords)
  glow(cx,cy,rad,col,alpha=.5,pow=2){const S=this.S,W=this.W,H=this.H,c=this.c;cx*=S;cy*=S;rad*=S;
    for(let y=Math.max(0,cy-rad|0);y<Math.min(H,cy+rad);y++)for(let x=Math.max(0,cx-rad|0);x<Math.min(W,cx+rad);x++){const d=Math.hypot(x-cx,y-cy)/rad;if(d>=1)continue;const a=alpha*Math.pow(1-d,pow),p=(y*W+x)*3;
      c[p]+=(col[0]-c[p])*a;c[p+1]+=(col[1]-c[p+1])*a;c[p+2]+=(col[2]-c[p+2])*a}}

  // light the paint surface and return 8-bit RGB
  render({relief=1}={}){const W=this.W,H=this.H,c=this.c,g=this.grain;const h=new Float32Array(W*H),src=this.h;
    for(let i=0;i<W*H;i++)h[i]=src[i]+.22*g[i]*(1-clamp(src[i]*.55));
    const b=new Float32Array(W*H);for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;b[i]=(h[i]*4+h[i-1]+h[i+1]+h[i-W]+h[i+W])/8}
    const out=Buffer.alloc(W*H*3);const k=.34*relief;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;let s=1,sp=0;
      if(x>1&&y>1&&x<W-2&&y<H-2){const d=(b[i+1+W]-b[i-1-W])*.7+(b[i+1]-b[i-1])*.35+(b[i+W]-b[i-W])*.35;s=1-clamp(d*k,-.22,.3);sp=d<0?clamp(-d*k-.05,0,.12):0}
      for(let j=0;j<3;j++){let v=c[i*3+j]*s+sp;out[i*3+j]=v<=0?0:v>=1?255:Math.round(v*255)}}
    return out}
  save(file,opt){png(file,this.W,this.H,this.render(opt))}
  // keep in-progress snapshots (for a paint-on animation later)
  record(every,dir){this.snaps=dir;this.snapEvery=every;this.snapN=0;fs.mkdirSync(dir,{recursive:true})}
  _snap(){png(`${this.snaps}/s${String(this.snapN++).padStart(4,'0')}.png`,this.W,this.H,this.render())}
}

// direction-field helpers (logical coords)
export const radial=(cx,cy)=>(x,y)=>Math.atan2(y-cy,x-cx);
export const tangent=(cx,cy)=>(x,y)=>Math.atan2(y-cy,x-cx)+Math.PI/2;
export const flow=(base,amp=.6,sc=.006,seed=1)=>(x,y)=>base+(fbm(x*sc,y*sc,seed,2)-.5)*2*amp;
