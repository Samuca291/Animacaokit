// Exporta o filme quadro a quadro (função pura do tempo) para H.264 via libx264.
//   node tools/render.mjs [quadroInicial] [quadroFinal] [saida.mp4]     (PRESET=veryfast CRF=17 por padrão)
import { spawn } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import { createCanvas } from '@napi-rs/canvas';
import { loadFilm } from './frames.mjs';

const WORK = process.env.WORK || '/tmp/aprender';
const F = await loadFilm();
const from = +(process.argv[2] ?? 0), to = +(process.argv[3] ?? F.END * 60), out = process.argv[4] ?? WORK + '/video.mp4';
const cv = createCanvas(1920, 1080);
const ctx = cv.getContext('2d');
const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', '1920x1080', '-r', '60', '-i', '-',
  '-c:v', 'libx264', '-preset', process.env.PRESET || 'veryfast', '-crf', process.env.CRF || '17', '-pix_fmt', 'yuv420p', '-r', '60', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = from; f < to; f++) {
  F.renderFrame(ctx, f / 60);
  const buf = typeof cv.data === 'function' ? cv.data() : Buffer.from(ctx.getImageData(0, 0, 1920, 1080).data.buffer);
  await new Promise((r) => ff.stdin.write(buf, r)); // só desenha o próximo quadro depois de entregar este
  if (f % 600 === 0) console.log(`quadro ${f}/${to} · ${((f - from) / ((Date.now() - t0) / 1000 || 1)).toFixed(1)} fps`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
console.log(`RENDER_DONE ${to - from} quadros em ${((Date.now() - t0) / 1000).toFixed(0)} s → ${out}`);
