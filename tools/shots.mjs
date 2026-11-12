// Folha de contato por plano (controle de qualidade visual).
//   node tools/shots.mjs saida.jpg "2A,2B,6A" [quadrosPorPlano=6] [colunas=3] [larguraCelula=640]
//   node tools/shots.mjs saida.jpg "30.5,31.2,2B"   → números são instantes absolutos (s)
import { createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import { loadFilm } from './frames.mjs';

const [outFile, ids, nArg, colsArg, cwArg] = process.argv.slice(2);
const F = await loadFilm();
const cv = createCanvas(1920, 1080);
const ctx = cv.getContext('2d');
const n = +(nArg || 6), cols = +(colsArg || 3), cw = +(cwArg || 640), ch = Math.round((cw * 9) / 16);
const times = [];
for (const id of ids.split(',')) {
  if (!Number.isNaN(+id)) { times.push(+id); continue; }
  const s = F.SHOTS.find((x) => x.id === id);
  if (!s) { console.log('plano não encontrado:', id); continue; }
  for (let i = 0; i < n; i++) times.push(s.a + 0.3 + ((s.b - s.a - 0.6) * i) / Math.max(1, n - 1));
}
const rows = Math.ceil(times.length / cols);
const sheet = createCanvas(cols * cw, rows * ch);
const sc = sheet.getContext('2d');
let bad = 0;
times.forEach((t, i) => {
  try { F.renderFrame(ctx, t, true); } catch (e) { bad++; console.log('ERR t=' + t.toFixed(2), e.message, (e.stack || '').split('\n')[1]); }
  const x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
  sc.drawImage(cv, x, y, cw, ch);
  sc.fillStyle = 'rgba(0,0,0,0.65)'; sc.fillRect(x, y, 150, 24);
  sc.fillStyle = '#fff'; sc.font = '600 15px Poppins'; sc.fillText(`${t.toFixed(2)}s · ${F.shotAt(t).id}`, x + 8, y + 17);
});
fs.writeFileSync(outFile, sheet.toBuffer('image/jpeg'));
console.log('ok', outFile, times.length, 'quadros,', bad, 'erros');
