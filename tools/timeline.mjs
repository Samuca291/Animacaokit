// Ajusta o roteiro à narração real (durações medidas + alinhamento por palavra)
// e gera src/film/data/narration.json. O total é sempre exatamente 300 s.
import fs from 'node:fs';
import path from 'node:path';

const WORK = process.env.WORK || '/tmp/aprender';
const here = path.dirname(new URL(import.meta.url).pathname);
const S = JSON.parse(fs.readFileSync(path.join(here, 'script.json'), 'utf8'));
const rd = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null);
const D = rd(path.join(WORK, 'voice/durations.json'));
const A = rd(path.join(WORK, 'voice/align.json'));
const TOTAL = 300;
const MINGAP = 0.24;
const est = (s) => 0.2 + s.length / 15.6;

const secs = S.sections.map((sec, i) => {
  const items = sec.sentences.map((text, j) => {
    const id = `${sec.id}.${j + 1}`;
    return { id, text, d: D?.items?.[id] ?? est(text) };
  });
  const lead = i === 0 ? 1.0 : 0.3;
  const tail = i === S.sections.length - 1 ? 3.2 : 0.5;
  const speech = items.reduce((a, x) => a + x.d, 0);
  const need = lead + tail + speech + (items.length - 1) * MINGAP;
  return { id: sec.id, title: sec.title, nominal: [sec.start, sec.end], items, lead, tail, speech, need, alloc: Math.max(need, sec.end - sec.start) };
});

const speechTotal = secs.reduce((a, s) => a + s.speech, 0);
const sumNeed = secs.reduce((a, s) => a + s.need, 0);
let squeeze = 1;
if (sumNeed > TOTAL) {
  squeeze = Math.max(0.15, (TOTAL - speechTotal) / (sumNeed - speechTotal));
  for (const s of secs) {
    s.lead *= squeeze;
    s.tail *= squeeze;
    s.need = s.lead + s.tail + s.speech + (s.items.length - 1) * MINGAP * squeeze;
    s.alloc = s.need;
  }
  console.warn(`! narração longa: pausas comprimidas x${squeeze.toFixed(2)}`);
} else {
  const excess = secs.reduce((a, s) => a + s.alloc, 0) - TOTAL;
  const red = secs.reduce((a, s) => a + (s.alloc - s.need), 0);
  const k = red > 0 ? excess / red : 0;
  for (const s of secs) s.alloc -= (s.alloc - s.need) * k;
}

let t = 0;
const out = [];
for (const s of secs) {
  const extra = Math.max(0, s.alloc - s.need);
  const n = s.items.length;
  const wts = s.items.map((x, j) => (j === n - 1 ? 1.7 : /\?$/.test(x.text) ? 1.5 : 1));
  const wLead = 0.4;
  const wSum = wts.reduce((a, b) => a + b, 0) + wLead;
  const start = t;
  t += s.lead + (extra * wLead) / wSum;
  const cues = [];
  s.items.forEach((x, j) => {
    const a = t;
    const b = t + x.d;
    const words = x.text.split(/\s+/);
    const al = A?.[x.id];
    let w;
    if (al && al.score >= 0.6 && al.words.length === words.length) {
      const sc = al.dur > 0 ? x.d / al.dur : 1;
      w = al.words.map((p) => a + Math.min(x.d, Math.max(0, p[0] * sc)));
    } else {
      const tot = words.reduce((q, v) => q + v.length + 1, 0);
      let acc = 0;
      w = words.map((v) => {
        const r = a + (acc / tot) * x.d;
        acc += v.length + 1;
        return r;
      });
    }
    for (let i = 1; i < w.length; i++) w[i] = Math.max(w[i], w[i - 1]);
    cues.push({ id: x.id, text: x.text, a: +a.toFixed(3), b: +b.toFixed(3), w: w.map((v) => +v.toFixed(3)) });
    t = b + (j === n - 1 ? s.tail : MINGAP * squeeze) + (extra * wts[j]) / wSum;
  });
  out.push({ id: s.id, title: s.title, nominal: s.nominal, start: +start.toFixed(3), end: +t.toFixed(3), cues });
}
out[out.length - 1].end = TOTAL;

const data = {
  total: TOTAL,
  source: D ? 'tts' : 'estimativa',
  engine: D?.engine ?? null,
  voice: D?.voice ?? null,
  speed: D?.speed ?? null,
  speech: +speechTotal.toFixed(2),
  aligned: !!A,
  match: A?._summary?.match ?? null,
  alignModel: A?._summary?.model ?? null,
  sections: out,
};
const dst = path.join(here, '../src/film/data/narration.json');
fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.writeFileSync(dst, JSON.stringify(data));
console.log(`narration.json · fonte=${data.source} · fala=${data.speech}s · alinhado=${data.aligned}`);
console.log(out.map((s) => `${s.id}: ${s.start.toFixed(2)}–${s.end.toFixed(2)} (nominal ${s.nominal.join('–')})`).join('\n'));
