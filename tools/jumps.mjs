// Procura saltos de um único quadro: diferença média entre quadros consecutivos (60 fps) muito acima das vizinhas.
//   node tools/jumps.mjs "0:27.5,104.2:128"
//   node tools/jumps.mjs whips
import { createCanvas } from '@napi-rs/canvas';
import { loadFilm } from './frames.mjs';
const F = await loadFilm();
const cv = createCanvas(1920, 1080), ctx = cv.getContext('2d'), sm = createCanvas(192, 108), sc = sm.getContext('2d');
const arg = process.argv[2] || '0:27.5';
// "whips" = janela de 0,8 s em torno de cada whip pan do filme
const ranges = arg === 'whips' ? F.SHOTS.filter((x) => (x.tr || '').startsWith('whip')).map((x) => `${(x.a - 0.4).toFixed(2)}:${(x.a + 0.4).toFixed(2)}`) : arg.split(',');
for (const r of ranges) {
  const [a, b] = r.split(':').map(Number), d = [];
  let prev = null;
  for (let f = Math.round(a * 60); f <= Math.round(b * 60); f++) {
    F.renderFrame(ctx, f / 60, true);
    sc.drawImage(cv, 0, 0, 192, 108);
    const px = sc.getImageData(0, 0, 192, 108).data;
    if (prev) { let s = 0; for (let i = 0; i < px.length; i += 4) s += Math.abs(px[i] - prev[i]) + Math.abs(px[i + 1] - prev[i + 1]) + Math.abs(px[i + 2] - prev[i + 2]); d.push([f / 60, s / (192 * 108 * 3)]); }
    prev = Uint8ClampedArray.from(px);
  }
  const sorted = d.map((x) => x[1]).sort((x, y) => x - y), med = sorted[sorted.length >> 1];
  const spikes = d.map((x, i) => [x[0], x[1], x[1] / Math.max(0.6, i > 0 ? d[i - 1][1] : 0, i < d.length - 1 ? d[i + 1][1] : 0)]).filter((x) => x[2] > 2.2 && x[1] > 2.5).sort((x, y) => y[2] - x[2]);
  console.log(`trecho ${a}–${b}s: ${d.length + 1} quadros · diferença mediana ${med.toFixed(2)} · máxima ${sorted[sorted.length - 1].toFixed(2)} · picos isolados: ${spikes.length}`);
  spikes.slice(0, 10).forEach((x) => console.log(`   t=${x[0].toFixed(3)}s plano ${F.shotAt(x[0]).id} dif=${x[1].toFixed(2)} (${x[2].toFixed(1)}× as vizinhas)`));
  const top = d.slice().sort((x, y) => y[1] - x[1]).slice(0, 5).map((x) => `${x[0].toFixed(2)}s=${x[1].toFixed(1)}`);
  console.log('   maiores movimentos:', top.join('  '));
}
