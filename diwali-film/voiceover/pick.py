import sys; sys.path.insert(0,'.')
from measure import *
W=[3.85,4.65,4.8,4.7,10.3,4.3,3.7,5.85,5.1,5.3,5.75,6.15]
for i in range(12):
    row=[]
    for t in range(3):
        d=len(process(load(f'shubh_t/l{i}_t{t}.mp3')))/SR; row.append((round(d,2),t))
    ok=[r for r in row if r[0]<=W[i]*1.04]
    best=max(ok) if ok else min(row)
    print(i,'win',W[i],row,'-> take',best[1],'tempo',round(max(1,best[0]/W[i]),3))
