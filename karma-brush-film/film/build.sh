#!/usr/bin/env bash
# film/build.sh [out.mp4] : render the 13 beat clips (4 at a time), join them, add voiceover and music.
# Run from karma-brush-film/. Takes about 10 minutes on 4 cores. SKIP_CLIPS=1 reuses existing clips.
set -euo pipefail
OUT=${1:-karma-brush-film.mp4}; VO=${VO:-vo.mp3}; MUSIC=${MUSIC:-../dussehra-diwali-film/music.mp3}
mkdir -p film/clips
[ -f film/ov/band.rgba ] || node film/overlays.mjs
if [ -z "${SKIP_CLIPS:-}" ]; then printf '%s\n' ${BEATS:-6 12 5 7 3 11 8 9 2 4 10 1 13} | xargs -P 4 -I{} node film/clip.mjs {}; fi
for i in 01 02 03 04 05 06 07 08 09 10 11 12 13; do echo "file 'clips/$i.mp4'"; done > film/list.txt
LEN=$(node -e "import('./film/config.mjs').then(c=>console.log(c.DURATION.toFixed(3)))"); LEADMS=$(node -e "import('./film/config.mjs').then(c=>console.log(c.LEAD*1000))")
FADE=$(node -e "console.log(($LEN-3).toFixed(3))")
ffmpeg -v error -y -f concat -safe 0 -i film/list.txt -i "$VO" -i "$MUSIC" -filter_complex \
"[1:a]aresample=48000,adelay=${LEADMS}:all=1,aformat=channel_layouts=stereo,apad,atrim=0:${LEN},asplit=2[vo][key];\
[2:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${LEN},volume=0.5,afade=t=in:d=1,afade=t=out:st=${FADE}:d=3[mus];\
[mus][key]sidechaincompress=threshold=0.02:ratio=5:attack=30:release=450[duck];\
[duck][vo]amix=inputs=2:duration=longest:normalize=0,apad,atrim=0:${LEN},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart -t "$LEN" "$OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_type,width,height -of compact "$OUT"
