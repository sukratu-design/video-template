import sys,re,json,subprocess; sys.path.insert(0,'.')
from measure import *
DUR=84.0
TAKE=[0,0,0,2,1,1,0,1,1,1,0]
ST=[0.5,6.6,17.6,27.4,32.9,40.6,47.3,55.3,62.2,68.2,76.3]
W=[ST[i+1]-ST[i]-0.1 for i in range(len(ST)-1)]+[DUR-ST[-1]-0.3]
PIECES=[["Dussehra celebrates Rama's victory over Ravana.","Diwali celebrates his homecoming."],
["In the calendar, they sit about twenty days apart.","That count is later tradition.","The Ramayana does not count the days.","It gives an order of duties."],
["First, Rama asked Vibhishana, Ravana's brother,","to perform the last rites.","Enmity, he said, ends with death."],
["Then Vibhishana was crowned king of Lanka,","as Rama had promised."],
["Sita passed through fire, the Agni Pariksha.","Agni, the fire itself, returned her unharmed."],
["Vibhishana gave them the Pushpaka Vimana,","a flying chariot, and they turned north."],
["Over the bridge they had built, past Kishkindha,","to Sage Bharadwaja's ashram, where the rivers meet."],
["Hanuman raced ahead to tell Bharata,","who for fourteen years had kept Rama's sandals on the throne."],
["The fourteen years were over.","The sandals were returned, and Rama came home."],
["Tradition says Ayodhya lit lamps to welcome him.","Victory first, then duty, then home."],
["That is why there is a gap between Dussehra and Diwali."]]
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
