// Técnicas de animação e adereços do refino dos planos 2A, 2B, 4D, 5B–5C e 6A.
// Tudo continua sendo função pura do tempo (nenhum estado entre quadros).
import { Ctx, P, E, clamp, lerp, prog, mix, al, box, circ, ell, line, poly, glow, idea, Cam } from './core';
import type { Mood } from './owl';

/* ---------- técnicas de animação ---------- */
/** easing com antecipação e ultrapassagem: recua, dispara, passa do ponto e assenta */
export const bio = (x: number) => {
  const k = 1.70158 * 1.525;
  return x < 0.5 ? (Math.pow(2 * x, 2) * ((k + 1) * 2 * x - k)) / 2 : (Math.pow(2 * x - 2, 2) * ((k + 1) * (x * 2 - 2) + k) + 2) / 2;
};
/** tween 0→1 com antecipação entre a e b */
export const ant = (t: number, a: number, b: number) => bio(prog(t, a, b));
/** follow-through: oscilação amortecida que parte de 0 em t0 e volta ao repouso */
export const wob = (t: number, t0: number, f = 9, d = 5) => (t < t0 ? 0 : Math.exp(-d * (t - t0)) * Math.sin(f * (t - t0)));
/** impacto: vale 1 em t0 e decai oscilando (squash → stretch → repouso) */
export const hit = (t: number, t0: number, f = 16, d = 7) => (t < t0 ? 0 : Math.exp(-d * (t - t0)) * Math.cos(f * (t - t0)));
/** janela suave 0→1→0 entre a e b, com rampas de d segundos */
export const win = (t: number, a: number, b: number, d = 0.3) => clamp((t - a) / d) * clamp((b - t) / d);

/** expressão ao longo do tempo: mistura suave entre humores em vez de troca seca */
export function moodK(t: number, keys: [number, Mood][], d = 0.22): { mood: Mood; m2?: Mood; mk?: number } {
  let i = 0;
  while (i < keys.length - 1 && t >= keys[i + 1][0]) i++;
  if (i === 0 || t >= keys[i][0] + d) return { mood: keys[i][1] };
  return { mood: keys[i - 1][1], m2: keys[i][1], mk: E.io((t - keys[i][0]) / d) };
}

/** câmera em spline de Hermite: velocidade contínua, sem paradas entre as chaves [t, x, y, zoom] */
export function camS(t: number, K: number[][]): Cam {
  const n = K.length;
  if (t <= K[0][0]) return { x: K[0][1], y: K[0][2], z: K[0][3] };
  if (t >= K[n - 1][0]) return { x: K[n - 1][1], y: K[n - 1][2], z: K[n - 1][3] };
  let i = 0;
  while (t > K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1], h = b[0] - a[0], u = (t - a[0]) / h, u2 = u * u, u3 = u2 * u;
  const v = [0, 0, 0];
  for (let j = 1; j <= 3; j++) {
    const m0 = i > 0 ? (b[j] - K[i - 1][j]) / (b[0] - K[i - 1][0]) : 0;
    const m1 = i < n - 2 ? (K[i + 2][j] - a[j]) / (K[i + 2][0] - a[0]) : 0;
    v[j - 1] = (2 * u3 - 3 * u2 + 1) * a[j] + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * b[j] + (u3 - u2) * h * m1;
  }
  return { x: v[0], y: v[1], z: v[2] };
}

/* ---------- livro seguro pela personagem ---------- */
type HB = { open?: number; col: string; flip?: number; dir?: number; lit?: number; sq?: number; kind?: number; grip?: string; near?: number };
/**
 * Livro aberto em pé sobre a mesa, VOLTADO PARA QUEM LÊ: a câmera vê a lombada e o lado de fora das capas,
 * o miolo aparece só por cima (as páginas apontam para a personagem) e a luz das páginas sobe para o rosto dela.
 * (x, y) = pé da lombada. `flip` 0→1 vira uma página por cima do livro; `grip` desenha as pontas das asas.
 */
export function heldBook(c: Ctx, x: number, y: number, s: number, o: HB) {
  const op = clamp(o.open ?? 1, 0, 1.15), hw = lerp(13, 118, op), Hh = 108, rise = 14 * Math.min(1, op), near = o.near ?? 1;
  const dark = mix(o.col, '#000000', 0.3), lite = mix(o.col, '#ffffff', 0.3), sq = o.sq ?? 0;
  c.save();
  c.translate(x, y);
  c.scale(s * (1 + sq * 0.5), s * (1 - sq * 0.5));
  if (o.lit) glow(c, 0, -Hh - 26, 200, P.yellow, 0.5 * o.lit * Math.min(1, op));
  for (const sd of [-1, 1]) {
    const w = hw * (sd === near ? 1 : 0.88), top = -Hh - 8 * op;
    // miolo visto por cima: as páginas ficam do lado de quem lê
    poly(c, [0, -Hh + 2, sd * (w - 3), top + 2, sd * (w - 11), top - 13 * op, 0, -Hh - 11 * op], '#FFF6DC');
    line(c, sd * 6, -Hh - 6 * op, sd * (w - 9), top - 7 * op, al('#B9A7E8', 0.7 * Math.min(1, op)), 2);
    // capa (lado de fora), a metade mais distante um pouco mais escura
    poly(c, [0, 0, sd * w, -rise, sd * w, top, 0, -Hh], sd === near ? o.col : mix(o.col, '#000000', 0.16), 4);
    if (op > 0.5) {
      c.beginPath();
      c.moveTo(sd * 18, -12 - rise * 0.15);
      c.lineTo(sd * (w - 12), -rise - 10);
      c.lineTo(sd * (w - 12), top + 12);
      c.lineTo(sd * 18, -Hh + 12);
      c.closePath();
      c.strokeStyle = al(lite, 0.6);
      c.lineWidth = 3;
      c.lineJoin = 'round';
      c.stroke();
    }
  }
  if (op > 0.5) {
    idea(c, o.kind ?? 1, near * hw * 0.52, -Hh * 0.55 - rise * 0.5, 17, { g: 0 });
    for (let i = 0; i < 3; i++) line(c, -near * hw * 0.26, -Hh * 0.72 + i * 17 - rise * 0.25, -near * hw * (i === 2 ? 0.52 : 0.72), -Hh * 0.72 + i * 17 - rise * 0.7, al(lite, 0.65), 4);
  }
  // lombada: é ela que fica de frente para a câmera
  box(c, -8, -Hh - 1, 16, Hh + 3, 5, dark);
  box(c, -8, -Hh + 14, 16, 5, 2, P.yellow);
  box(c, -8, -24, 16, 5, 2, P.yellow);
  // página virando: passa por cima do livro, do lado de quem lê
  const fl = o.flip ?? 0;
  if (fl > 0.01 && fl < 0.99 && op > 0.6) {
    const d = o.dir ?? 1, a = Math.PI * fl, tx = Math.cos(a) * hw * 0.84 * d, ty = -Hh - 12 - Math.sin(a) * 42;
    c.beginPath();
    c.moveTo(0, -Hh - 9);
    c.quadraticCurveTo(tx * 0.5, ty - 16 * Math.sin(a), tx, ty);
    c.lineTo(tx * 0.94, ty + 13);
    c.quadraticCurveTo(tx * 0.45, -Hh + 2 - 12 * Math.sin(a), 0, -Hh - 2);
    c.closePath();
    c.fillStyle = '#FFFDF2';
    c.fill();
  }
  // pontas das asas abraçando as bordas
  if (o.grip && op > 0.4) {
    for (const sd of [-1, 1]) {
      const w = hw * (sd === near ? 1 : 0.88);
      for (let k = 0; k < 3; k++) ell(c, sd * (w - 2), -rise - 34 - k * 13, 12, 6.5, k === 1 ? o.grip : mix(o.grip, '#000000', 0.14), sd * 0.25);
    }
  }
  c.restore();
}

/* ---------- prensa hidráulica de pórtico ---------- */
type PR = { ram: number; kind: number; jolt?: number; gauge?: number; lamp?: number; steam?: number; lampCol?: string };
/** distância entre o topo da travessa e a face de contato da sapata, com o cabeçote recolhido */
export const PRESS_REACH = 298;
/**
 * Travessa presa ao teto, cilindro, haste cromada, cabeçote guiado por duas colunas e sapata de carimbo.
 * `ram` = descida do cabeçote em px; a face de contato fica em top + PRESS_REACH + ram.
 */
export function pressMachine(c: Ctx, x: number, top: number, floor: number, o: PR) {
  const j = o.jolt ?? 0, ry = top + 212 + o.ram, navy = '#0C1560', steel = '#16237F', lampCol = o.lampCol ?? P.yellow;
  for (const sd of [-1, 1]) {
    box(c, x + sd * 96 - 13, -400, 26, top + 420, 6, navy);
    box(c, x + sd * 122 - 17, top + 30, 34, floor - top, 8, steel);
    box(c, x + sd * 122 - 17, top + 30, 9, floor - top, 4, al('#ffffff', 0.14));
    box(c, x + sd * 122 - 32, floor - 40, 64, 60, 10, navy);
  }
  // haste cromada
  box(c, x - 16, top + 160 - j, 32, ry - top - 150 + j, 4, '#AFC0F5');
  box(c, x - 10, top + 160 - j, 8, ry - top - 150 + j, 3, '#F4F7FF');
  c.save();
  c.translate(0, -j);
  // travessa superior com faixa de segurança
  box(c, x - 168, top, 336, 76, 20, steel);
  box(c, x - 168, top, 336, 16, 8, '#3A52E0');
  c.save();
  c.beginPath();
  c.rect(x - 150, top + 54, 300, 14);
  c.clip();
  box(c, x - 150, top + 54, 300, 14, 0, P.yellow);
  for (let i = -1; i < 12; i++) poly(c, [x - 150 + i * 28, top + 68, x - 136 + i * 28, top + 68, x - 122 + i * 28, top + 54, x - 136 + i * 28, top + 54], navy);
  c.restore();
  for (const sd of [-1, 1]) circ(c, x + sd * 150, top + 34, 6, al('#ffffff', 0.5));
  // manômetro e lâmpada de ciclo
  const g = clamp(o.gauge ?? 0), ga = lerp(-2.5, 0.6, g);
  circ(c, x + 104, top + 34, 23, navy);
  circ(c, x + 104, top + 34, 18, '#F4F7FF');
  line(c, x + 104, top + 34, x + 104 + Math.cos(ga) * 14, top + 34 + Math.sin(ga) * 14, P.pink, 4);
  circ(c, x + 104, top + 34, 4, navy);
  const lp = clamp(o.lamp ?? 0);
  circ(c, x - 104, top + 34, 15, navy);
  circ(c, x - 104, top + 34, 10, mix('#3A2A6E', lampCol, 0.3 + 0.7 * lp));
  if (lp > 0.05) glow(c, x - 104, top + 34, 70, lampCol, 0.7 * lp);
  // cilindro
  box(c, x - 58, top + 66, 116, 96, 18, '#243CDB');
  box(c, x - 44, top + 78, 12, 68, 6, al('#ffffff', 0.3));
  box(c, x - 70, top + 148, 140, 20, 10, navy);
  c.restore();
  const st = o.steam ?? 0;
  if (st > 0 && st < 1) for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) circ(c, x + sd * (84 + st * (40 + k * 30)), top + 158 - st * (26 + k * 22), 9 + st * (24 - k * 8), al('#ffffff', 0.42 * (1 - st)));
  // cabeçote guiado
  for (const sd of [-1, 1]) {
    box(c, x + sd * 122 - 28, ry - 9, 56, 64, 12, '#C73A7C');
    circ(c, x + sd * 122, ry + 23, 7, al('#ffffff', 0.55));
  }
  box(c, x - 152, ry, 304, 46, 14, P.pink);
  box(c, x - 152, ry, 304, 12, 6, mix(P.pink, '#ffffff', 0.32));
  circ(c, x, ry + 24, 19, '#180A59');
  idea(c, o.kind, x, ry + 24, 11, { g: 0 });
  // porta-matriz e sapata: a superfície que toca o objeto
  poly(c, [x - 72, ry + 44, x + 72, ry + 44, x + 54, ry + 70, x - 54, ry + 70], '#C73A7C', 4);
  box(c, x - 66, ry + 66, 132, 14, 6, '#FFF1D0');
  box(c, x - 66, ry + 76, 132, 10, 5, '#F2B84B');
}
