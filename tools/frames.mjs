// Renderiza quadros do filme fora do navegador (Skia via @napi-rs/canvas) para controle de qualidade.
//   node tools/frames.mjs grid saida.jpg "0:27:16" [colunas]   → folha de contato
//   node tools/frames.mjs grid saida.jpg "1.5,8,12.2"
//   node tools/frames.mjs scan - 0.5                           → procura erros em toda a timeline
import { build } from 'esbuild';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const WORK = process.env.WORK || '/tmp/aprender';

export async function loadFilm() {
  const out = path.join(WORK, 'film.mjs');
  await build({ entryPoints: [path.join(root, 'src/film/index.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
  for (const w of [500, 600, 700, 800, 900]) {
    GlobalFonts.registerFromPath(path.join(root, `node_modules/@fontsource/poppins/files/poppins-latin-${w}-normal.woff2`), 'Poppins');
  }
  return import(out + '?v=' + Date.now());
}

if (process.argv[1].endsWith('frames.mjs')) {
  const [mode, outFile, spec, colsArg] = process.argv.slice(2);
  const F = await loadFilm();
  const cv = createCanvas(1920, 1080);
  const ctx = cv.getContext('2d');
  if (mode === 'scan') {
    let bad = 0;
    const t0 = Date.now();
    let n = 0;
    for (let t = 0; t <= 300; t += +(spec || 0.5)) {
      n++;
      try {
        F.renderFrame(ctx, t, true);
      } catch (e) {
        bad++;
        if (bad < 14) console.log('ERR t=' + t.toFixed(2), e.message, (e.stack || '').split('\n')[1]);
      }
    }
    console.log(`scan: ${n} quadros, ${bad} erros, ${((Date.now() - t0) / n).toFixed(1)} ms/quadro · planos=${F.SHOTS.length}`);
  } else {
    let times;
    if (spec.includes(':')) {
      const [a, b, n] = spec.split(':').map(Number);
      times = Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
    } else times = spec.split(',').map(Number);
    const cols = +(colsArg || 4), cw = 480, ch = 270, rows = Math.ceil(times.length / cols);
    const sheet = createCanvas(cols * cw, rows * ch);
    const sc = sheet.getContext('2d');
    times.forEach((t, i) => {
      try {
        F.renderFrame(ctx, t, true);
      } catch (e) {
        console.log('ERR t=' + t.toFixed(2), e.message, (e.stack || '').split('\n')[1]);
      }
      const x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
      sc.drawImage(cv, x, y, cw, ch);
      sc.fillStyle = 'rgba(0,0,0,0.6)';
      sc.fillRect(x, y, 150, 24);
      sc.fillStyle = '#fff';
      sc.font = '600 15px Poppins';
      sc.fillText(`${t.toFixed(1)}s · ${F.shotAt(t).id}`, x + 8, y + 17);
    });
    fs.writeFileSync(outFile, sheet.toBuffer('image/jpeg'));
    console.log('ok', outFile, times.length);
  }
}
