// node contact.mjs  -> contact-sheet.jpg (all 13 frames with beat number, picture and narration)
import {createRequire} from 'node:module';const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');import path from 'node:path';
const B=[['The gift','Karma isn’t fate. In Sanskrit, it simply means action.'],
['The seed in the earth','Every action leaves a trace, a saṃskāra, like a seed pressed into the mind.'],
['The worn path','Impressions harden into habits, vāsanās, that shape what we do next.'],
['The pot of seeds','Every seed we’ve ever sown is stored. It is called sañcita karma.'],
['The archer','Arrows in the quiver: the store. The arrow already flying is prārabdha. The arrow in your hand, āgāmi, is still yours to choose.'],
['The mango tree','In time, each seed ripens into fruit, phala…'],
['The rangoli, half gold, half green','…sweet or bitter. This is the life we’re living now.'],
['The ox at the press','And every fruit holds new seeds. Act, impression, tendency, act. The wheel turns, life after life.'],
['Saris on the riverbank','As we shed worn clothes for new ones, the self moves on, carrying its seeds.'],
['The swept yard at dawn','The Gītā offers a way out: act fully, but let go of the fruit.'],
['Seeds on the fire','A seed roasted in the fire of knowledge looks the same, but it never sprouts again.'],
['The open circle','That is mokṣa. Not the end of action, but the end of being bound by it.'],
['The gift, again (evening)','(music resolves; the film loops)']];
const html=`<body style="margin:0;background:#1d1a17;font-family:Georgia,serif;color:#efe6d6;padding:36px 36px 20px"><div style="font-size:40px;margin:0 6px 4px">Karma, painted in code &mdash; contact sheet</div>
<div style="font-size:21px;opacity:.7;margin:0 6px 26px">13 frames, each placed stroke by stroke by a simulated brush engine (no image model). Narration from the existing karma script.</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:22px">${B.map((b,i)=>`<div><img src="file://${path.resolve('frames/'+String(i+1).padStart(2,'0')+'.png')}" style="width:100%;display:block;border-radius:3px"><div style="font-size:22px;margin-top:9px"><b>${i+1}</b> &middot; ${b[0]}</div><div style="font-size:16.5px;opacity:.72;font-style:italic;line-height:1.3;margin-top:3px">${b[1]}</div></div>`).join('')}</div></body>`;
const br=await chromium.launch({args:['--allow-file-access-from-files']});const pg=await br.newPage({viewport:{width:2800,height:1000}});
await pg.goto('file://'+path.resolve('contact.mjs'));await pg.setContent(html);await pg.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
await pg.screenshot({path:'contact-sheet.jpg',fullPage:true,type:'jpeg',quality:88});await br.close();
