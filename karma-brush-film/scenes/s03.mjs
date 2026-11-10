// 3: a path worn into a field by walking it again and again. Impressions harden into habits (vasana).
import {Painting} from '../engine/paint.mjs';
import {C,SUN,SHADOW,SKIN,cast,form,fill,field,band,person,canopy,hex,mix,shift,ellipse,spline,rough,fbm,clamp,flow} from './world.mjs';
export default function(opt={}){const p=new Painting({...opt,seed:303,ground:hex('#4a5a2a')});
  const G=[hex('#6f9a3c'),hex('#5c8a36'),hex('#84ac46'),hex('#4e7c34'),hex('#93b552')];
  const dir=flow(-1.1,.5,.004,5);
  field(p,(x,y,r)=>shift(G[(r()*G.length)|0],{l:(fbm(x*.005,y*.005,9)-.5)*.16,h:(fbm(x*.004,y*.004,2)-.5)*.05}),{w:16,len:40,density:1.9,dir,dirJit:.35});
  field(p,[hex('#a9c85c'),hex('#3f6e30'),hex('#c2d470')],{w:5,len:22,density:.5,dir,dirJit:.4,thick:1.3,opacity:.9});
  const path=[[-40,930],[150,860],[300,700],[470,640],[620,560],[700,400],[860,300],[1120,210]];
  const side=[[300,700],[380,560],[360,400],[450,250],[420,-30]],side2=[[620,560],[780,600],[930,720],[1120,760]];
  const dirOf=pts=>{const sp=spline(pts,false,8);return(x,y)=>{let b=0,bd=1e9;for(let i=0;i<sp.length-1;i+=2){const d=(sp[i][0]-x)**2+(sp[i][1]-y)**2;if(d<bd){bd=d;b=i}}const a=sp[b],c=sp[Math.min(sp.length-1,b+2)];return Math.atan2(c[1]-a[1],c[0]-a[0])}};
  // faint trails walked a few times, then the main path walked a thousand times
  for(const[s,w,a]of[[side,26,.5],[side2,22,.4]]){const m=p.mask(rough(band(s,w),4,.03,w));p.area(m,{w:7,len:26,density:1.3*a*2,col:[hex('#b9b46a'),hex('#a8a25c'),hex('#c6bd78')],dir:dirOf(s),dirJit:.3,dry:1.5,clip:false,opacity:.85})}
  const pm=p.mask(rough(band(path,t=>58-10*Math.sin(t*9)),5,.02,3));const pd=dirOf(path);
  p.area(p.mask(rough(band(path,84),8,.02,5)),{w:8,len:26,density:.9,col:[hex('#b5ad62'),hex('#9fa055')],dir:pd,dirJit:.4,clip:false,dry:1.4});
  p.area(pm,{w:11,len:40,density:2.4,col:[hex('#d9b77c'),hex('#cfa86a'),hex('#e3c690'),hex('#c49a5e')],dir:pd,dirJit:.18,jit:{l:.035},clip:true,curve:.6});
  p.area(pm,{w:4,len:34,density:.5,col:[hex('#a9824c'),hex('#f0d9a8')],dir:pd,dirJit:.1,dry:1.3,thick:1.3});
  const rn=p.rnd;
  // wildflowers
  for(let i=0;i<260;i++){const x=rn()*1080,y=rn()*1080;if(pm.at((x*p.S)|0,(y*p.S)|0))continue;const c=[C.white,hex('#f4d24a'),hex('#e86a8a'),C.white][i%4];if(fbm(x*.006,y*.006,31)>.5)p.dab(x,y,rn()*6.28,5,4.5,c,{thick:1.6,taper:.2})}
  canopy(p,150,170,150,3,{sh:30});canopy(p,960,900,190,5,{sh:36,cols:[hex('#1f4a34'),hex('#2f6a3a'),hex('#6fa044')]});canopy(p,985,560,70,8,{sh:16});
  // footprints behind the walker, and the walker
  const sp=spline(path,false,8);for(let i=4;i<34;i++){const a=sp[i],b=sp[i+1];const an=Math.atan2(b[1]-a[1],b[0]-a[0]);const k=i%2?1:-1;p.dab(a[0]-Math.sin(an)*7*k,a[1]+Math.cos(an)*7*k,an,11,4.5,hex('#9a7444'),{opacity:.8,thick:.6})}
  const q=sp[36],q2=sp[38];person(p,{x:q[0],y:q[1],rot:Math.atan2(q2[1]-q[1],q2[0]-q[0])+Math.PI/2,s:1.75,top:C.vermilion,bottom:C.white,turban:C.gold,skin:SKIN[1],arms:[[-18,2],[17,12]],stride:7,shadow:7});
  return p}
