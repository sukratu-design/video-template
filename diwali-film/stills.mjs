// usage: node stills.mjs outdir t1 t2 ... ; renders frames forward only (replays from 0 to each t)
import puppeteer from 'puppeteer';
import {mkdirSync,writeFileSync} from 'fs';
import path from 'path';import {fileURLToPath,pathToFileURL} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const out=process.argv[2];mkdirSync(out,{recursive:true});
const ts=process.argv.slice(3).map(Number).sort((a,b)=>a-b);
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage();p.on('pageerror',e=>console.error('page error:',e.message));p.on('console',m=>{if(m.type()==='error')console.error('console:',m.text())});
await p.setViewport({width:1080,height:1080});
await p.goto(pathToFileURL(path.join(dir,'index.html')).href+'?render=1',{waitUntil:'load'});
await p.waitForFunction(()=>window.ready&&window.renderFrame);await p.evaluate(()=>window.ready);
for(const t of ts){const d=await p.evaluate(t=>{window.renderFrame(t);return document.getElementById('film').toDataURL('image/png').slice(22)},t);writeFileSync(`${out}/t${t.toFixed(1).padStart(5,"0")}.png`,Buffer.from(d,'base64'));console.log('t',t)}
await b.close();
