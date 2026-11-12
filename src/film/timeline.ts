// Linha do tempo: ordena os planos, aplica transições e expõe renderFrame(t), EV e END.
import { Ctx, W, H, E, clamp, P, al, hash } from './core';
import { END, SECS } from './narration';
import { ALL } from './shots';

export type Trans = 'cut' | 'whipR' | 'whipL' | 'whipU' | 'whipD' | 'iris' | 'wipe' | 'flash' | 'band';
export type ShotDef = {
  id: string; sec: number; from: number; title: string; desc: string; cam: string; cast: string; color: string;
  tr?: Trans; trc?: string; trd?: number; fx?: number; fy?: number; sfxNote: string;
  draw: (c: Ctx, T: number) => void; sfx?: (number | string)[][];
};
export type Shot = ShotDef & { a: number; b: number; n: number };

export const SHOTS: Shot[] = ALL.slice()
  .sort((x, y) => x.from - y.from)
  .map((s, i, arr) => ({ ...s, a: i === 0 ? 0 : s.from, b: i < arr.length - 1 ? arr[i + 1].from : END, n: i + 1 }));

const TD: Record<Trans, number> = { cut: 0, whipR: 0.5, whipL: 0.5, whipU: 0.5, whipD: 0.5, iris: 0.9, wipe: 0.9, flash: 0.5, band: 0.8 };
const dur = (s: Shot) => s.trd ?? TD[s.tr ?? 'cut'];

let STRICT = false;
function drawShot(c: Ctx, s: Shot, T: number) {
  c.save();
  try {
    s.draw(c, T);
  } catch (e) {
    if (STRICT) throw e;
  }
  c.restore();
}

function drawTrans(c: Ctx, A: Shot, B: Shot, p: number, T: number) {
  const k = B.tr ?? 'cut', e = E.io(p);
  const fx = B.fx ?? W / 2, fy = B.fy ?? H / 2, R = Math.hypot(Math.max(fx, W - fx), Math.max(fy, H - fy)) + 40;
  const col = B.trc ?? P.night;
  if (k === 'whipR' || k === 'whipL' || k === 'whipU' || k === 'whipD') {
    const dx = k === 'whipR' ? 1 : k === 'whipL' ? -1 : 0, dy = k === 'whipD' ? 1 : k === 'whipU' ? -1 : 0;
    // cada plano fica recortado ao próprio quadro: o que ele desenha além das bordas não invade o vizinho
    c.save();
    c.translate(-dx * e * W, -dy * e * H);
    c.beginPath();
    c.rect(-1, -1, W + 2, H + 2);
    c.clip();
    drawShot(c, A, T);
    c.restore();
    c.save();
    c.translate(dx * (1 - e) * W, dy * (1 - e) * H);
    c.beginPath();
    c.rect(-1, -1, W + 2, H + 2);
    c.clip();
    drawShot(c, B, T);
    c.restore();
    const m = Math.sin(p * Math.PI);
    for (let i = 0; i < 26; i++) {
      const u = hash(i * 3.3), v = hash(i * 9.1), len = 300 + v * 700;
      c.fillStyle = al(i % 3 ? '#ffffff' : col, 0.16 * m);
      if (dx) c.fillRect(((u * 2 - p * 2 * dx) % 1.4) * W, v * H, len * m, 6 + v * 16);
      else c.fillRect(u * W, ((v * 2 - p * 2 * dy) % 1.4) * H, 6 + u * 16, len * m);
    }
  } else if (k === 'iris') {
    c.save();
    c.translate(fx, fy);
    c.scale(1 + e * 0.5, 1 + e * 0.5);
    c.translate(-fx, -fy);
    drawShot(c, A, T);
    c.restore();
    const r = E.i(p) * R;
    c.save();
    c.beginPath();
    c.arc(fx, fy, r, 0, Math.PI * 2);
    c.clip();
    c.translate(fx, fy);
    c.scale(1.18 - 0.18 * e, 1.18 - 0.18 * e);
    c.translate(-fx, -fy);
    drawShot(c, B, T);
    c.restore();
    c.beginPath();
    c.arc(fx, fy, r, 0, Math.PI * 2);
    c.strokeStyle = al(col, 1 - p);
    c.lineWidth = 26 * (1 - p) + 2;
    c.stroke();
  } else if (k === 'wipe') {
    // cobertura acelera no fim (pouca tela cheia de cor); revelação começa rápida (sem "quadro vazio")
    if (p < 0.5) {
      drawShot(c, A, T);
      c.beginPath();
      c.arc(fx, fy, E.i(p * 2) * R, 0, Math.PI * 2);
      c.fillStyle = col;
      c.fill();
    } else {
      drawShot(c, B, T);
      c.beginPath();
      c.rect(0, 0, W, H);
      c.arc(fx, fy, E.o(p * 2 - 1) * R, 0, Math.PI * 2, true);
      c.fillStyle = col;
      c.fill();
    }
  } else if (k === 'flash') {
    drawShot(c, p < 0.5 ? A : B, T);
    c.fillStyle = al(B.trc ?? '#ffffff', 1 - Math.abs(p - 0.5) * 2);
    c.fillRect(0, 0, W, H);
  } else if (k === 'band') {
    // faixa diagonal colorida que varre a tela e revela o plano seguinte
    drawShot(c, A, T);
    const x = -700 + e * (W + 1400);
    c.save();
    c.beginPath();
    c.moveTo(-10, -10);
    c.lineTo(x + 160, -10);
    c.lineTo(x - 160, H + 10);
    c.lineTo(-10, H + 10);
    c.closePath();
    c.clip();
    drawShot(c, B, T);
    c.restore();
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(x + 160, -10);
    c.lineTo(x + 460, -10);
    c.lineTo(x + 140, H + 10);
    c.lineTo(x - 160, H + 10);
    c.closePath();
    c.fill();
    c.fillStyle = al('#ffffff', 0.35);
    c.beginPath();
    c.moveTo(x + 480, -10);
    c.lineTo(x + 520, -10);
    c.lineTo(x + 200, H + 10);
    c.lineTo(x + 160, H + 10);
    c.closePath();
    c.fill();
  } else drawShot(c, B, T);
}

export function shotAt(t: number): Shot {
  for (let i = SHOTS.length - 1; i >= 0; i--) if (t >= SHOTS[i].a) return SHOTS[i];
  return SHOTS[0];
}

/** Desenha o quadro do instante t (segundos) em um contexto 1920×1080. Função pura do tempo. */
export function renderFrame(c: Ctx, t: number, strict = false) {
  STRICT = strict;
  const T = clamp(t, 0, END);
  const cur = shotAt(Math.min(T, END - 1e-4));
  const i = cur.n - 1, next = SHOTS[i + 1], prev = SHOTS[i - 1];
  c.save();
  c.beginPath();
  c.rect(0, 0, W, H);
  c.clip();
  c.fillStyle = P.ink;
  c.fillRect(0, 0, W, H);
  if (next && dur(next) > 0 && T > next.a - dur(next) / 2) drawTrans(c, cur, next, (T - (next.a - dur(next) / 2)) / dur(next), T);
  else if (prev && dur(cur) > 0 && T < cur.a + dur(cur) / 2) drawTrans(c, prev, cur, (T - (cur.a - dur(cur) / 2)) / dur(cur), T);
  else drawShot(c, cur, T);
  // abertura e encerramento deliberados
  const fin = T < 0.7 ? 1 - T / 0.7 : T > END - 1.2 ? (T - (END - 1.2)) / 1.1 : 0;
  if (fin > 0) {
    c.fillStyle = al(P.ink, clamp(fin));
    c.fillRect(0, 0, W, H);
  }
  c.restore();
}

const TSFX: Partial<Record<Trans, [string, number]>> = { whipR: ['whoosh', 0.8], whipL: ['whoosh', 0.8], whipU: ['whoosh', 0.8], whipD: ['whoosh', 0.8], iris: ['riser', 0.6], wipe: ['whoosh', 0.9], flash: ['chime', 0.7], band: ['whoosh', 0.9] };
const sfx: { t: number; type: string; gain: number; shot: string }[] = [];
for (const s of SHOTS) {
  const ts = TSFX[s.tr ?? 'cut'];
  if (ts && s.n > 1) sfx.push({ t: +(s.a - dur(s) / 2).toFixed(3), type: ts[0], gain: ts[1], shot: s.id });
  for (const e of s.sfx ?? []) if ((e[0] as number) >= 0 && (e[0] as number) < END) sfx.push({ t: +(e[0] as number).toFixed(3), type: e[1] as string, gain: (e[2] as number) ?? 0.7, shot: s.id });
}
sfx.sort((a, b) => a.t - b.t);

/** Eventos de sincronia: narração (com palavras), planos/transições e efeitos sonoros. */
export const EV = {
  end: END,
  fps: 60,
  frames: END * 60,
  narration: SECS.flatMap((s) => s.cues.map((cu) => ({ id: cu.id, section: s.id, t: cu.a, end: cu.b, text: cu.text, words: cu.w }))),
  shots: SHOTS.map((s) => ({ id: s.id, section: s.sec, t: s.a, end: s.b, transition: s.tr ?? 'cut' })),
  sfx,
};
