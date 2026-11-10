// node paint.mjs <scene numbers...>   env: SCALE=1|2 (default 2), OUT=frames
import fs from 'node:fs';
const S=+(process.env.SCALE||2),out=process.env.OUT||'frames';fs.mkdirSync(out,{recursive:true});
for(const a of process.argv.slice(2)){const n=String(a).padStart(2,'0');const t=Date.now();
  const alias={'13':['01',{evening:true}],'12':['08',{free:true}]}[n]||[n,{}];
  const mod=await import(`./scenes/s${alias[0]}.mjs`);const p=mod.default({scale:S,...alias[1]});
  p.save(`${out}/${n}.png`);console.log(n,p.strokes,'strokes',((Date.now()-t)/1000).toFixed(1)+'s')}
