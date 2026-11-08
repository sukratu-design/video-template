import sys,re,json,subprocess; sys.path.insert(0,'.')
from measure import *
TAKE=[0,2,2,0,0,0,1,2,0,2,0,2]
W=[3.85,4.65,4.8,4.8,10.3,4.3,3.8,5.85,5.1,5.3,5.75,6.15]
ST=[0,4.15,9.1,14.15,19.05,29.5,34.1,38.05,44.1,49.5,55.1,61.15]
PIECES=[["Karma isn't fate.","In Sanskrit, it means action."],
["Every action leaves a saṃskāra,","a seed pressed into the mind."],
["Impressions harden into habits, vāsanās, that shape what we do next."],
["Every seed we've ever sown is stored:","it is called sañcita karma."],
["Picture an archer.","Arrows in the quiver: the store.","The arrow in flight, prārabdha, must land.","The arrow in hand, āgāmi, is yours to choose."],
["In time, each seed ripens","into fruit, phala…"],
["…sweet or bitter.","This is the life we're living now."],
["Each fruit holds new seeds.","Act, impression, tendency, act:","the wheel turns."],
["As we shed worn clothes,","the self moves on, carrying its seeds."],
["The Gītā offers a way out: act fully,","but let go of the fruit."],
["A seed roasted in the fire of knowledge looks the same,","but it never sprouts again."],
["That is mokṣa.","Not the end of action,","but the end of being bound by it."]]
def atempo(x,t):
    if t<=1.0005: return x
    p=subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-filter:a',f'atempo={t:.4f}','-f','f32le','-'],input=x.tobytes(),capture_output=True,check=True)
    return np.frombuffer(p.stdout,np.float32)
out=np.zeros(int(SR*68),np.float32); cues=[]; rep=[]
for i in range(12):
    x=process(load(f'shubh_t/l{i}_t{TAKE[i]}.mp3'))
    d=len(x)/SR; t=max(1.0,d/W[i]); assert t<=1.1,(i,t)
    # pause midpoints (>=0.3s internal silence) in processed audio, in seconds
    m=mask(x); pm=[((a+b)/2*FR/SR) for a,b in runs(m) if a>0 and b<len(m) and (b-a)*FR/SR>=0.3]
    y=atempo(x,t); d2=len(y)/SR; s=int(ST[i]*SR); out[s:s+len(y)]+=y
    chars=[len(p.replace(' ','')) for p in PIECES[i]]; tot=sum(chars); b=[];acc=0
    for c in chars[:-1]:
        acc+=c; est=acc/tot*d
        near=min(pm,key=lambda q:abs(q-est),default=None)
        b.append((near if near is not None and abs(near-est)<0.6 else est)/t)
    starts=[ST[i]]+[ST[i]+q for q in b]
    nxt=ST[i+1] if i<11 else 67.6
    end=min(ST[i]+d2+0.25,nxt-0.05)
    ends=starts[1:]+[end]
    for p,a,e in zip(PIECES[i],starts,ends): cues.append([round(a,2),round(e,2),p])
    rep.append((i,round(ST[i],2),round(ST[i]+d2,2),round(t,3),round(len(' '.join(PIECES[i]).split())/d2*60)))
for r in rep: print('line',r[0],'start',r[1],'end',r[2],'tempo',r[3],'wpm',r[4])
print('peak',np.abs(out).max())
open('v3.pcm','wb').write((np.clip(out,-1,1)*32767).astype(np.int16).tobytes())
js="const captionCues=[\n"+",\n".join("  "+json.dumps(c,ensure_ascii=False) for c in cues)+"\n];"
open('cues_v3.js','w').write(js)
