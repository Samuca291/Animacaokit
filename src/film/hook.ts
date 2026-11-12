// Adereços e efeitos do gancho (planos 1A–1D): bloco de notas no suporte, balões da "sensação de aprender",
// estouro, luz da janela ao longo do dia e etiqueta de papel. Tudo é função pura dos parâmetros.
import { Ctx, P, KCOL, TAU, E, clamp, lerp, prog, hash, al, mix, box, circ, line, poly, glow, ring, shapePath, txt, check } from './core';

/* ---------- luz da janela ---------- */
/** cor, intensidade e alcance da luz que entra pela janela (0 = tarde · 0.5 = noite · 1 = manhã) */
export function dayLight(day: number): [string, number, number] {
  const d = clamp(day), sun = 1 - clamp(d / 0.34), moon = clamp(1 - Math.abs(d - 0.5) / 0.2), morn = clamp((d - 0.7) / 0.3);
  if (sun > 0) return ['#FFB45A', 0.28 * sun, lerp(980, 520, sun)];
  if (morn > 0) return ['#FFE9A8', 0.2 * morn, lerp(720, 430, morn)];
  return ['#9DB4FF', 0.13 * moon, 560];
}
/** feixe que atravessa o quarto: deita e esquenta no fim da tarde, fica azul à noite, volta dourado de manhã */
export function lightShaft(c: Ctx, day: number) {
  const [col, a, reach] = dayLight(day);
  if (a <= 0.004) return;
  c.save();
  c.globalCompositeOperation = 'lighter';
  const g = c.createLinearGradient(1440, 260, 1440 - reach * 0.8, 1040);
  g.addColorStop(0, al(col, a));
  g.addColorStop(1, al(col, 0));
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(1252, 200);
  c.lineTo(1628, 200);
  c.lineTo(1628 - reach * 0.72, 1060);
  c.lineTo(1252 - reach, 1060);
  c.closePath();
  c.fill();
  c.restore();
}

/* ---------- bloco de notas no suporte ---------- */
type NP = { hl?: number; checks?: number; flip?: number; close?: number; lit?: number };
const NL = [36, 53, 78, 95, 120, 137];
/**
 * Bloco de espiral no topo, apoiado num suporte de mesa e inclinado para trás, voltado para quem lê.
 * (x, y) = centro do apoio sobre a mesa. São 3 "frases" de duas linhas: `hl` 0→6 grifa as linhas,
 * `checks` 0→3 marca as frases reconhecidas, `flip` 0→1 vira uma folha por cima da espiral e
 * `close` 0→1 baixa a capa sobre a folha (a página some).
 */
export function notepad(c: Ctx, x: number, y: number, o: NP = {}) {
  const w = 190, h = 152, cl = clamp(o.close ?? 0), lit = clamp(o.lit ?? 1, 0, 1.4) * (1 - cl);
  c.save();
  c.translate(x, y);
  line(c, 70, -4, 112, -120, '#2B1A7A', 9);
  box(c, -98, -10, 196, 12, 6, '#3A2AA8');
  box(c, -92, -18, 184, 10, 5, '#6C4FE0');
  if (lit > 0.01) glow(c, 8, -92, 240, P.yellow, 0.4 * lit);
  // folha em ¾: o topo recua para a direita e a largura encurta
  c.transform(0.86, 0, -0.17, 0.94, -57, -161);
  box(c, -9, -7, w + 18, h + 12, 12, '#2B1A7A');
  box(c, 4, 5, w, h, 9, '#D8C59A');
  box(c, 0, 0, w, h, 9, '#FFF4D2');
  NL.forEach((ly, i) => {
    const x0 = 36, lw = (i % 2 ? 0.46 : 0.74) * w, k = clamp((o.hl ?? 0) - i);
    line(c, x0, ly, x0 + lw, ly, '#B9A7E8', 6);
    if (k > 0) line(c, x0, ly, x0 + lw * k, ly, P.orange, 7);
  });
  for (let s = 0; s < 3; s++) {
    const k = clamp((o.checks ?? 0) - s);
    if (k > 0) check(c, 18, NL[s * 2] + 8, 18, '#1FB8A0', k);
  }
  // folha virando por cima da espiral
  const f = o.flip ?? 0;
  if (f > 0.01 && f < 0.99) {
    const yb = lerp(h, -h * 0.5, E.io(f)), bl = Math.sin(f * Math.PI) * 16;
    c.beginPath();
    c.moveTo(0, 12);
    c.lineTo(w, 12);
    c.quadraticCurveTo(w + bl, (12 + yb) / 2, w, yb);
    c.lineTo(0, yb);
    c.quadraticCurveTo(-bl, (12 + yb) / 2, 0, 12);
    c.closePath();
    c.fillStyle = yb < 12 ? '#E9DBB4' : '#FFFBEC';
    c.fill();
  }
  // capa presa na espiral: desce e cobre a folha
  if (cl > 0.01) {
    const yb = lerp(14, h + 2, E.o(cl)), bl = Math.sin(cl * Math.PI) * 14;
    c.beginPath();
    c.moveTo(-2, 6);
    c.lineTo(w + 2, 6);
    c.quadraticCurveTo(w + 2 + bl, (6 + yb) / 2, w + 2, yb);
    c.lineTo(-2, yb);
    c.quadraticCurveTo(-2 - bl, (6 + yb) / 2, -2, 6);
    c.closePath();
    c.fillStyle = '#5A3FD0';
    c.fill();
    if (cl > 0.6) {
      c.save();
      c.globalAlpha *= clamp((cl - 0.6) / 0.4);
      box(c, w * 0.22, h * 0.38, w * 0.56, 32, 8, '#8AF2F0');
      box(c, w * 0.3, h * 0.38 + 13, w * 0.4, 6, 3, '#2B1A7A');
      c.restore();
    }
  }
  box(c, 0, 0, w, 20, 9, P.orange);
  for (let i = 0; i < 9; i++) box(c, 9 + i * 21, -8, 7, 18, 3.5, '#DCE6FF');
  c.restore();
}

/* ---------- balões: a "sensação de aprender" ---------- */
/** distância do centro até o nó, conforme a forma */
export const knotY = (kind: number, r: number) => [0.76, 1.04, 0.92][((kind % 3) + 3) % 3] * r;
type BL = { a?: number; sq?: number; rot?: number; shine?: number };
/**
 * Balão em forma de ideia: bonito, brilhante — e oco. A película é translúcida (vê-se o quarto através dela),
 * não tem olhos nem miolo: é o contrário das ideias sólidas do filme.
 */
export function balloon(c: Ctx, kind: number, x: number, y: number, r: number, o: BL = {}) {
  if (r <= 1.5) return;
  const col = KCOL[((kind % 3) + 3) % 3], sq = o.sq ?? 0, ky = knotY(kind, r);
  c.save();
  if (o.a !== undefined) c.globalAlpha *= clamp(o.a);
  glow(c, x, y, r * 2.2, col, 0.18 + 0.22 * (o.shine ?? 0));
  c.translate(x, y);
  c.rotate(o.rot ?? 0);
  c.scale(1 + sq, 1 - sq);
  poly(c, [-r * 0.11, ky + r * 0.1, r * 0.11, ky + r * 0.1, 0, ky - r * 0.06], col, 3);
  shapePath(c, kind, r);
  c.lineJoin = 'round';
  c.fillStyle = al(mix(col, '#ffffff', 0.3), 0.36);
  c.fill();
  c.strokeStyle = col;
  c.lineWidth = Math.max(3, r * 0.1);
  c.stroke();
  c.save();
  shapePath(c, kind, r);
  c.clip();
  c.fillStyle = 'rgba(255,255,255,0.2)';
  c.beginPath();
  c.arc(-r * 0.62, -r * 0.82, r * 0.98, 0, TAU);
  c.fill();
  c.restore();
  c.beginPath();
  c.arc(-r * 0.06, -r * 0.02, r * 0.56, Math.PI * 1.1, Math.PI * 1.42);
  c.strokeStyle = 'rgba(255,255,255,0.8)';
  c.lineWidth = Math.max(2.5, r * 0.075);
  c.lineCap = 'round';
  c.stroke();
  c.restore();
}

/** estouro: anel, estilhaços de película e nada dentro */
export function popFx(c: Ctx, x: number, y: number, T: number, t0: number, col: string, r: number, seed = 1) {
  const p = prog(T, t0, t0 + 0.5);
  if (p <= 0 || p >= 1) return;
  const e = E.o(p);
  ring(c, x, y, r * (0.9 + 0.9 * e), al('#ffffff', (1 - p) * 0.9), 6 * (1 - p) + 1);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU + hash(seed * 7 + i) * 0.5, d0 = r * (0.8 + 0.95 * e), d1 = d0 + r * 0.42 * (1 - p), g = p * p * 34;
    line(c, x + Math.cos(a) * d0, y + Math.sin(a) * d0 + g, x + Math.cos(a) * d1, y + Math.sin(a) * d1 + g, i % 2 ? col : '#ffffff', 5 * (1 - p) + 1);
  }
}

/** etiqueta de papel amarrada ao barbante dos balões (o texto é tipografia em código) */
export function giftTag(c: Ctx, x: number, y: number, rot: number, s: number) {
  if (s <= 0.01) return;
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(s, s);
  line(c, 0, 0, 0, 18, al('#ffffff', 0.7), 2.5);
  box(c, -84, 20, 176, 62, 10, 'rgba(2,3,30,0.35)');
  box(c, -88, 14, 176, 62, 10, '#FFE9B8');
  circ(c, 0, 23, 5, '#B98A3E');
  txt(c, 'SENSAÇÃO', 0, 42, 18, '#3A1D8F', { w: 800, ls: 1.5 });
  txt(c, 'DE APRENDER', 0, 62, 15, '#6535A8', { w: 700, ls: 1 });
  c.restore();
}
