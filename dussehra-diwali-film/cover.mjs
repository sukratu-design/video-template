// usage: node cover.mjs <painting.png|jpg> <out.png> [titleY] ; draws the film title on a painting, 2048x2048
import puppeteer from 'puppeteer';
import {readFileSync,writeFileSync} from 'fs';
import path from 'path';import {fileURLToPath,pathToFileURL} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const [src,out,ty]=process.argv.slice(2);const TY=Number(ty||0.115);
const img='data:image/'+(src.endsWith('.png')?'png':'jpeg')+';base64,'+readFileSync(src).toString('base64');
const html=`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'Pinyon Script';src:url('${pathToFileURL(path.join(dir,'fonts/pinyon-script-400.ttf')).href}')}
@font-face{font-family:'Tiro Devanagari Sanskrit';src:url('${pathToFileURL(path.join(dir,'fonts/tiro-devanagari-sanskrit-400.ttf')).href}')}
body{margin:0}</style><canvas id=c width=2048 height=2048></canvas><script>
window.go=async()=>{await document.fonts.load('100px "Pinyon Script"');await document.fonts.load('100px "Tiro Devanagari Sanskrit"');
const im=new Image();im.src=${JSON.stringify(img)};await im.decode();const c=document.getElementById('c'),x=c.getContext('2d');x.drawImage(im,0,0,2048,2048);
const g=x.createLinearGradient(0,0,0,${TY}*2048*2.1);g.addColorStop(0,'rgba(238,226,202,.9)');g.addColorStop(.65,'rgba(238,226,202,.55)');g.addColorStop(1,'rgba(238,226,202,0)');x.fillStyle=g;x.fillRect(0,0,2048,${TY}*2048*2.1);
x.textAlign='center';x.fillStyle='#2A1C14';x.font='204px "Pinyon Script"';x.fillText('Dussehra to Diwali',1024,${TY}*2048+40);
x.fillStyle='#6A4426';x.font='88px "Pinyon Script"';x.fillText('the long way home',1024,${TY}*2048+150);
return c.toDataURL('image/png').slice(22)}</script>`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--allow-file-access-from-files']});const p=await b.newPage();
await p.goto(pathToFileURL(path.join(dir,'index.html')).href);await p.setContent(html,{waitUntil:'load'});
writeFileSync(out,Buffer.from(await p.evaluate(()=>window.go()),'base64'));await b.close();console.log('wrote',out);
