// Timing for the film. Narration is the approved karma track (Sarvam bulbul:v4-flash, shubh_en_narration):
// ../painted-film/examples/vo-shubh-sarvam.mp3, 68 s, with line 2 (samskara) replaced by a new take in ./vo.mp3. Cue times below are in voiceover time; the video adds LEAD.
export const FPS=30,LEAD=1.5,TAIL=4.6;
export const B=[0,3.85,9.08,14.12,19.03,29.35,33.95,38.03,44.08,49.4,55.05,61.12,67.75]; // beat starts (vo time)
export const END=B[12]+TAIL;                       // vo time at which the film ends
export const DURATION=LEAD+END;
export const scenes=[['01',{}],['02',{}],['03',{}],['04',{}],['05',{}],['06',{}],['07',{}],['08',{}],['09',{}],['10',{}],['11',{}],['08',{free:true}],['01',{evening:true}]];
// camera at each beat boundary (logical px): odd beats drift from wide into their subject, even beats pull back out
const wide={z:1,x:540,y:540};
export const K=[wide,{z:1.1,x:585,y:525},wide,{z:1.09,x:640,y:480},wide,{z:1.08,x:560,y:560},wide,{z:1.1,x:540,y:540},wide,{z:1.09,x:470,y:680},wide,{z:1.1,x:555,y:525},wide,{z:1.08,x:585,y:525}];
export const cues=[
  [0,1.35,"Karma isn't fate."],[1.35,3.75,"In Sanskrit, it means action."],[3.9,6.5,"Every action leaves a saṃskāra,"],[6.5,9.05,"a seed pressed into the mind."],
  [9.1,14.1,"Impressions harden into habits, vāsanās, that shape what we do next."],[14.15,17.1,"Every seed we've ever sown is stored:"],[17.1,19.0,"it is called sañcita karma."],
  [19.05,20.41,"Picture an archer."],[20.41,22.69,"Arrows in the quiver: the store."],[22.69,25.74,"The arrow in flight, prārabdha, must land."],[25.74,29.13,"The arrow in hand, āgāmi, is yours to choose."],
  [29.5,31.56,"In time, each seed ripens"],[31.56,33.38,"into fruit, phala…"],[34.1,35.43,"…sweet or bitter."],[35.43,38.0,"This is the life we're living now."],
  [38.05,40.12,"Each fruit holds new seeds."],[40.12,42.64,"Act, impression, tendency, act:"],[42.64,44.05,"the wheel turns."],[44.1,45.95,"As we shed worn clothes,"],[45.95,49.3,"the self moves on, carrying its seeds."],
  [49.5,52.96,"The Gītā offers a way out: act fully,"],[52.96,54.98,"but let go of the fruit."],[55.1,58.91,"A seed roasted in the fire of knowledge looks the same,"],[58.91,61.1,"but it never sprouts again."],
  [61.15,62.77,"That is mokṣa."],[62.77,64.47,"Not the end of action,"],[64.47,67.55,"but the end of being bound by it."]];
