import subprocess, numpy as np, sys
SR=48000; FR=480; PT=0.38
def load(f):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True,check=True).stdout
    return np.frombuffer(raw,np.int16).astype(np.float32)/32768
def mask(x):
    n=len(x)//FR; r=np.sqrt((x[:n*FR].reshape(n,FR)**2).mean(1)+1e-12); return 20*np.log10(r)<-40
def runs(m):
    out=[];i=0
    while i<len(m):
        if m[i]:
            j=i
            while j<len(m) and m[j]: j+=1
            out.append((i,j)); i=j
        else: i+=1
    return out
def process(x):
    m=mask(x); idx=np.where(~m)[0]; a=max(0,idx[0]-3); b=min(len(m),idx[-1]+4)
    x=x[a*FR:b*FR]; m=m[a:b]; segs=[]; pos=0
    for (i,j) in runs(m):
        if i==0 or j==len(m): continue
        L=(j-i)*FR/SR
        if L>0.45:
            keep=int(PT*SR); segs.append(x[pos:i*FR+keep//2]); pos=j*FR-keep//2
    segs.append(x[pos:]); return np.concatenate(segs)
if __name__=='__main__':
    W=[3.85,4.65,4.75,4.6,10.2,4.3,3.7,5.75,5.1,5.3,5.75,6.15]
    p=sys.argv[1]
    for i in range(12):
        d=len(process(load(f'shubh/l{i}_p{p}.mp3')))/SR
        print(i,round(d,2),'window',W[i],'tempo',round(d/W[i],3))
