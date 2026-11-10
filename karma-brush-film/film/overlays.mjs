// node film/overlays.mjs -> film/ov/*.rgba : title card, caption band and one text image per caption cue (rendered once with Chromium)
import {createRequire} from 'node:module';import path from 'node:path';import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {cues} from './config.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const dir=path.resolve('film/ov');fs.mkdirSync(dir,{recursive:true});const font=path.resolve('../painted-film/fonts/pinyon-script-400.ttf');
const css=`@font-face{font-family:P;src:url(file://${font})}html,body{margin:0;background:transparent}#f{width:1080px;height:1080px;position:relative;overflow:hidden;font-family:P,serif;color:#fff4dc}`;
const sh='text-shadow:0 2px 3px rgba(20,10,6,.95),0 0 14px rgba(20,10,6,.8),0 0 30px rgba(20,10,6,.55)';
const page=b=>`<style>${css}</style><div id=f>${b}</div>`;
const items=[['title',`<div style="position:absolute;inset:0;background:radial-gradient(ellipse 62% 34% at 50% 50%,rgba(24,12,8,.72),rgba(24,12,8,0) 100%)"></div>
  <div style="position:absolute;left:0;right:0;top:372px;text-align:center;font-size:230px;line-height:1;${sh}">Karma</div>
  <div style="position:absolute;left:0;right:0;top:612px;text-align:center;font-size:62px;${sh}">the life of a seed</div>`],
 ['band',`<div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(rgba(24,12,8,0),rgba(24,12,8,.62) 45%,rgba(24,12,8,.86))"></div>`],
 ...cues.map((c,i)=>['c'+String(i).padStart(2,'0'),`<div style="position:absolute;left:70px;right:70px;bottom:44px;height:150px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:${c[2].length>52?54:62}px;line-height:1.08;${sh}">${c[2]}</div>`])];
const br=await chromium.launch({args:['--allow-file-access-from-files']});const pg=await br.newPage({viewport:{width:1080,height:1080}});await pg.goto('file://'+path.resolve('film/config.mjs'));
for(const[n,b]of items){await pg.setContent(page(b));await pg.evaluate(()=>document.fonts.ready);await pg.screenshot({path:`${dir}/${n}.png`,omitBackground:true});
  execFileSync('ffmpeg',['-v','error','-y','-i',`${dir}/${n}.png`,'-f','rawvideo','-pix_fmt','rgba',`${dir}/${n}.rgba`]);fs.unlinkSync(`${dir}/${n}.png`)}
await br.close();console.log(items.length,'overlays');
