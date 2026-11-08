import sys,re,json,subprocess; sys.path.insert(0,'.')
from measure import *
DUR=69.5
TAKE=[1,1,2,0,1,2,0,1,0,2]
ST=[0.4,5.8,10.7,18.0,24.8,36.2,43.2,47.9,56.8,62.0]
W=[ST[i+1]-ST[i]-0.1 for i in range(9)]+[DUR-ST[9]-0.3]
PIECES=[["Once a year, on the darkest night of autumn,","a whole country lights up."],
["Diwali, Dīpāvali,","means a row of lamps."],
["The oldest tale begins in Ayodhya.","A prince, Rama, is sent to the forest for fourteen years."],
["Fourteen monsoons. Fourteen winters.","Then, at last, the road home."],
["But the night he returns is the new moon, amāvasya,","and no one can see the way.","So Ayodhya lights lamps,","in every window, on every roof."],
["A diya is the simplest thing.","Clay, oil, a cotton wick.","Yet it is enough."],
["At each doorstep, a rangoli is drawn,","a welcome in colour."],
["Over five days, families clean, feast, and give.","Lakshmi, they say, visits the brightest home."],
["Every region tells it a little differently.","The heart is the same."],
["A flame loses nothing by lighting another.","So light one, and pass it on."]]
N=len(PIECES)
def atempo(x,t):
    if t<=1.0005: return x
    p=subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-filter:a',f'atempo={t:.4f}','-f','f32le','-'],input=x.tobytes(),capture_output=True,check=True)
    return np.frombuffer(p.stdout,np.float32)
out=np.zeros(int(SR*DUR),np.float32); cues=[]; rep=[]
for i in range(N):
    x=process(load(f'shubh_t/l{i}_t{TAKE[i]}.mp3'))
    d=len(x)/SR; t=max(1.0,d/W[i]); assert t<=1.1,(i,t,d,W[i])
    m=mask(x); pm=[((a+b)/2*FR/SR) for a,b in runs(m) if a>0 and b<len(m) and (b-a)*FR/SR>=0.3]
    y=atempo(x,t); d2=len(y)/SR; s=int(ST[i]*SR); out[s:s+len(y)]+=y
    chars=[len(p.replace(' ','')) for p in PIECES[i]]; tot=sum(chars); b=[];acc=0
    for c in chars[:-1]:
        acc+=c; est=acc/tot*d
        near=min(pm,key=lambda q:abs(q-est),default=None)
        b.append((near if near is not None and abs(near-est)<0.6 else est)/t)
    starts=[ST[i]]+[ST[i]+q for q in b]
    nxt=ST[i+1] if i<N-1 else DUR-0.3
    end=min(ST[i]+d2+0.25,nxt-0.05)
    ends=starts[1:]+[end]
    for p,a,e in zip(PIECES[i],starts,ends): cues.append([round(a,2),round(e,2),p])
    rep.append((i,round(ST[i],2),round(ST[i]+d2,2),round(t,3),round(len(' '.join(PIECES[i]).split())/d2*60)))
for r in rep: print('line',r[0],'start',r[1],'end',r[2],'tempo',r[3],'wpm',r[4])
print('peak',np.abs(out).max())
open('v3.pcm','wb').write((np.clip(out,-1,1)*32767).astype(np.int16).tobytes())
open('cues_v3.js','w').write("const captionCues=[\n"+",\n".join("  "+json.dumps(c,ensure_ascii=False) for c in cues)+"\n];")
