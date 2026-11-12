#!/bin/bash
# Pipeline completo: trilha → 18.000 quadros → mux → verificação.
cd "$(dirname "$0")/.."
WORK=${WORK:-/tmp/aprender}
FF=node_modules/ffmpeg-static/ffmpeg
mkdir -p "$WORK/logs"
node tools/audio.mjs > "$WORK/logs/audio.log" 2>&1
PRESET=${PRESET:-ultrafast} CRF=${CRF:-18} node tools/render.mjs 0 18000 "$WORK/video.mp4" > "$WORK/logs/render.log" 2>&1
$FF -y -loglevel error -i "$WORK/video.mp4" -i "$WORK/mix.wav" -af "loudnorm=I=-14:TP=-1.5:LRA=11" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -t 300 -movflags +faststart "$WORK/aprender-de-verdade.mp4" > "$WORK/logs/mux.log" 2>&1
$FF -hide_banner -i "$WORK/aprender-de-verdade.mp4" -map 0:v -c copy -f null - > "$WORK/logs/verify.log" 2>&1
echo EXPORT_DONE >> "$WORK/logs/verify.log"
