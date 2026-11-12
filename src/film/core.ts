// Núcleo do motor: matemática, easing, cor, primitivas vetoriais, câmera 2D com paralaxe e partículas.
// Tudo é função determinística do tempo — nenhum estado é guardado entre quadros.
export const W = 1920;
export const H = 1080;
export const TAU = Math.PI * 2;
export type Ctx = CanvasRenderingContext2D;

export const P = {
  ink: '#050A2E', night: '#09134B', violet: '#180A59', royal: '#243CDB', purple: '#6535A8',
  teal: '#22D7DA', cyan: '#33B9D7', orange: '#FF851D', pink: '#ED4BA4', yellow: '#FFD244',
  sky: '#8CAAF7', white: '#F4F7FF', cream: '#FFF1D0',
};
export const KCOL = [P.pink, P.yellow, P.teal];

/* ---------- matemática e tempo ---------- */
export const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const prog = (t: number, a: number, b: number) => (b <= a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
type Ease = (x: number) => number;
export const E = {
  lin: (x: number) => x,
  io: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  o: (x: number) => 1 - Math.pow(1 - x, 3),
  o5: (x: number) => 1 - Math.pow(1 - x, 5),
  i: (x: number) => x * x * x,
  sin: (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x),
  back: (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2),
  el: (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -9 * x) * Math.sin((x * 9 - 0.75) * (TAU / 3)) + 1),
  bo: (x: number) => {
    const n = 7.5625, d = 2.75;
    if (x < 1 / d) return n * x * x;
    if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
    if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
    return n * (x -= 2.625 / d) * x + 0.984375;
  },
};
/** tween 0→1 entre a e b */
export const tw = (t: number, a: number, b: number, e: Ease = E.io) => e(prog(t, a, b));
/** entrada com mola (passa do ponto e assenta) */
export const pop = (t: number, t0: number, d = 0.5) => (t < t0 ? 0 : E.back(clamp((t - t0) / d)));
export const spring = (t: number, t0: number, d = 0.9) => (t < t0 ? 0 : E.el(clamp((t - t0) / d)));
/** pulso 0→1→0 */
export const pulse = (t: number, t0: number, d: number) => Math.sin(prog(t, t0, t0 + d) * Math.PI);
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
export const noise = (x: number, seed = 0) => {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 57.3), hash(i + 1 + seed * 57.3), u) * 2 - 1;
};
/** quadros-chave: [tempo, v1, v2, ...] */
export function kf(t: number, keys: number[][], e: Ease = E.io): number[] {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const a = keys[i - 1], b = keys[i], u = e(prog(t, a[0], b[0]));
      return b.slice(1).map((v, j) => lerp(a[j + 1], v, u));
    }
  }
  return keys[keys.length - 1].slice(1);
}
export const k1 = (t: number, keys: number[][], e: Ease = E.io) => kf(t, keys, e)[0];
/** arco balístico 0→1→0 para saltos */
export const arc = (p: number) => 4 * p * (1 - p);

/* ---------- cor ---------- */
const cc: Record<string, number[]> = {};
export function rgb(col: string): number[] {
  let v = cc[col];
  if (v) return v;
  if (col[0] === '#') {
    const h = col.slice(1);
    const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6), 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  } else {
    const m = col.match(/[\d.]+/g) || ['0', '0', '0'];
    v = [+m[0], +m[1], +m[2]];
  }
  cc[col] = v;
  return v;
}
export const mix = (a: string, b: string, t: number) => {
  const A = rgb(a), B = rgb(b), u = clamp(t);
  return `rgb(${Math.round(lerp(A[0], B[0], u))},${Math.round(lerp(A[1], B[1], u))},${Math.round(lerp(A[2], B[2], u))})`;
};
export const al = (col: string, a: number) => {
  const A = rgb(col);
  return `rgba(${A[0]},${A[1]},${A[2]},${clamp(a).toFixed(3)})`;
};

/* ---------- primitivas ---------- */
export function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const q = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  c.beginPath();
  c.moveTo(x + q, y);
  c.lineTo(x + w - q, y);
  c.quadraticCurveTo(x + w, y, x + w, y + q);
  c.lineTo(x + w, y + h - q);
  c.quadraticCurveTo(x + w, y + h, x + w - q, y + h);
  c.lineTo(x + q, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - q);
  c.lineTo(x, y + q);
  c.quadraticCurveTo(x, y, x + q, y);
  c.closePath();
}
export const box = (c: Ctx, x: number, y: number, w: number, h: number, r: number, col: string | CanvasGradient) => {
  rr(c, x, y, w, h, r);
  c.fillStyle = col;
  c.fill();
};
export const circ = (c: Ctx, x: number, y: number, r: number, col: string | CanvasGradient) => {
  if (r <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fillStyle = col;
  c.fill();
};
export const ell = (c: Ctx, x: number, y: number, rx: number, ry: number, col: string | CanvasGradient, rot = 0) => {
  if (rx <= 0 || ry <= 0) return;
  c.beginPath();
  c.ellipse(x, y, rx, ry, rot, 0, TAU);
  c.fillStyle = col;
  c.fill();
};
export const ring = (c: Ctx, x: number, y: number, r: number, col: string, lw: number) => {
  if (r <= 0 || lw <= 0) return;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.strokeStyle = col;
  c.lineWidth = lw;
  c.stroke();
};
export const line = (c: Ctx, x1: number, y1: number, x2: number, y2: number, col: string, lw = 4) => {
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.strokeStyle = col;
  c.lineWidth = lw;
  c.lineCap = 'round';
  c.stroke();
};
export const poly = (c: Ctx, pts: number[], col: string | CanvasGradient, round = 0) => {
  c.beginPath();
  for (let i = 0; i < pts.length; i += 2) i ? c.lineTo(pts[i], pts[i + 1]) : c.moveTo(pts[i], pts[i + 1]);
  c.closePath();
  c.fillStyle = col;
  c.fill();
  if (round > 0) {
    c.strokeStyle = col;
    c.lineWidth = round;
    c.lineJoin = 'round';
    c.stroke();
  }
};
/** polilinha (parcial por p) */
export const stroke = (c: Ctx, pts: number[], col: string, lw: number, p = 1) => {
  if (p <= 0) return;
  const n = pts.length / 2 - 1;
  const upto = clamp(p) * n;
  c.beginPath();
  c.moveTo(pts[0], pts[1]);
  for (let i = 1; i <= n; i++) {
    if (i <= upto) c.lineTo(pts[i * 2], pts[i * 2 + 1]);
    else {
      const u = upto - (i - 1);
      if (u > 0) c.lineTo(lerp(pts[i * 2 - 2], pts[i * 2], u), lerp(pts[i * 2 - 1], pts[i * 2 + 1], u));
      break;
    }
  }
  c.strokeStyle = col;
  c.lineWidth = lw;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke();
};
/** ponto em uma Bézier quadrática */
export const qb = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, u: number): [number, number] => {
  const v = 1 - u;
  return [v * v * x0 + 2 * v * u * cx + u * u * x1, v * v * y0 + 2 * v * u * cy + u * u * y1];
};
/** traço em Bézier quadrática, parcial de p0 a p1 */
export const bez = (c: Ctx, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, col: string, lw: number, p1 = 1, p0 = 0) => {
  if (p1 <= p0) return;
  c.beginPath();
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const u = lerp(p0, p1, i / n);
    const [x, y] = qb(x0, y0, cx, cy, x1, y1, u);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  }
  c.strokeStyle = col;
  c.lineWidth = lw;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke();
};
export const lg = (c: Ctx, x0: number, y0: number, x1: number, y1: number, stops: (string | number)[]) => {
  const g = c.createLinearGradient(x0, y0, x1, y1);
  for (let i = 0; i < stops.length; i += 2) g.addColorStop(stops[i] as number, stops[i + 1] as string);
  return g;
};
/** fundo em degradê vertical de tela cheia */
export const bg = (c: Ctx, ...cols: string[]) => {
  const g = c.createLinearGradient(0, 0, 0, H);
  cols.forEach((col, i) => g.addColorStop(cols.length === 1 ? 0 : i / (cols.length - 1), col));
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
};
/** brilho aditivo */
export function glow(c: Ctx, x: number, y: number, r: number, col: string, a = 0.6) {
  if (a <= 0.004 || r <= 1) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, al(col, a));
  g.addColorStop(0.45, al(col, a * 0.32));
  g.addColorStop(1, al(col, 0));
  c.save();
  c.globalCompositeOperation = 'lighter';
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
  c.restore();
}
/** estrela de 4 pontas (centelha) */
export function spark(c: Ctx, x: number, y: number, r: number, col: string, rot = 0) {
  if (r <= 0.3) return;
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * TAU) / 8, q = i % 2 ? r * 0.26 : r;
    c.lineTo(Math.cos(a) * q, Math.sin(a) * q);
  }
  c.closePath();
  c.fillStyle = col;
  c.fill();
  c.restore();
}
/** rajada de centelhas a partir de t0 */
export function burst(c: Ctx, x: number, y: number, t: number, t0: number, col: string, n = 8, rad = 90, seed = 1) {
  const p = prog(t, t0, t0 + 0.7);
  if (p <= 0 || p >= 1) return;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + hash(seed + i) * 0.8, d = rad * E.o(p) * (0.6 + hash(seed * 3 + i) * 0.6);
    spark(c, x + Math.cos(a) * d, y + Math.sin(a) * d, (1 - p) * (9 + hash(i + seed) * 9), i % 2 ? col : '#fff', p * 2);
  }
}
export function ngon(c: Ctx, x: number, y: number, r: number, n: number, col: string, rot = 0, round = 0) {
  const pts: number[] = [];
  for (let i = 0; i < n; i++) pts.push(x + Math.cos(rot + (i / n) * TAU) * r, y + Math.sin(rot + (i / n) * TAU) * r);
  poly(c, pts, col, round);
}

/* ---------- texto ---------- */
export const FONT = 'Poppins, "Segoe UI", Helvetica, Arial, sans-serif';
export const textW = (c: Ctx, s: string, size: number, w = 800) => {
  c.save();
  c.font = `${w} ${size}px ${FONT}`;
  const m = c.measureText(s).width;
  c.restore();
  return m;
};
type TO = { w?: number; al?: CanvasTextAlign; ls?: number; a?: number; cols?: (i: number) => string };
export function txt(c: Ctx, s: string, x: number, y: number, size: number, col: string, o: TO = {}) {
  if (o.a !== undefined && o.a <= 0.01) return;
  c.save();
  c.font = `${o.w ?? 800} ${size}px ${FONT}`;
  c.fillStyle = col;
  c.textBaseline = 'middle';
  if (o.a !== undefined) c.globalAlpha *= clamp(o.a);
  if (!o.ls && !o.cols) {
    c.textAlign = o.al ?? 'center';
    c.fillText(s, x, y);
  } else {
    const ch = Array.from(s), ls = o.ls ?? 0;
    const ws = ch.map((k) => c.measureText(k).width);
    const total = ws.reduce((a, b) => a + b, 0) + ls * (ch.length - 1);
    let px = (o.al ?? 'center') === 'center' ? x - total / 2 : o.al === 'right' ? x - total : x;
    c.textAlign = 'left';
    ch.forEach((k, i) => {
      if (o.cols) c.fillStyle = o.cols(i);
      c.fillText(k, px, y);
      px += ws[i] + ls;
    });
  }
  c.restore();
}
/** etiqueta em pílula */
export function tag(c: Ctx, s: string, x: number, y: number, size: number, bgc: string, fg: string, a = 1) {
  if (a <= 0.01) return;
  const wd = textW(c, s, size, 700) + size * 1.5;
  c.save();
  c.globalAlpha *= clamp(a);
  c.translate(x, y);
  const k = 0.85 + 0.15 * clamp(a);
  c.scale(k, k);
  box(c, -wd / 2, -size * 0.95, wd, size * 1.9, size * 0.95, bgc);
  txt(c, s, 0, size * 0.05, size, fg, { w: 700 });
  c.restore();
}
export function check(c: Ctx, x: number, y: number, s: number, col: string, p = 1) {
  stroke(c, [x - 0.45 * s, y, x - 0.12 * s, y + 0.32 * s, x + 0.5 * s, y - 0.38 * s], col, s * 0.24, p);
}
export function cross(c: Ctx, x: number, y: number, s: number, col: string, p = 1) {
  stroke(c, [x - 0.4 * s, y - 0.4 * s, x + 0.4 * s, y + 0.4 * s], col, s * 0.24, clamp(p * 2));
  stroke(c, [x + 0.4 * s, y - 0.4 * s, x - 0.4 * s, y + 0.4 * s], col, s * 0.24, clamp(p * 2 - 1));
}
export function arrow(c: Ctx, x1: number, y1: number, x2: number, y2: number, col: string, lw: number, p = 1) {
  if (p <= 0.02) return;
  const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p), a = Math.atan2(y2 - y1, x2 - x1), h = lw * 3.2;
  line(c, x1, y1, ex, ey, col, lw);
  poly(c, [ex + Math.cos(a) * h, ey + Math.sin(a) * h, ex + Math.cos(a + 2.4) * h, ey + Math.sin(a + 2.4) * h, ex + Math.cos(a - 2.4) * h, ey + Math.sin(a - 2.4) * h], col, lw * 0.5);
}

/* ---------- "ideias": as unidades de informação do filme ---------- */
export function shapePath(c: Ctx, kind: number, r: number) {
  c.beginPath();
  const k = ((kind % 3) + 3) % 3;
  if (k === 1) c.arc(0, 0, r, 0, TAU);
  else if (k === 0) {
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i * TAU) / 3;
      c.lineTo(Math.cos(a) * r * 1.12, Math.sin(a) * r * 1.12 + r * 0.14);
    }
    c.closePath();
  } else rr(c, -r * 0.86, -r * 0.86, r * 1.72, r * 1.72, r * 0.3);
}
type IO = { a?: number; g?: number; rot?: number; col?: string; eyes?: boolean; hollow?: boolean; dim?: number };
export function idea(c: Ctx, kind: number, x: number, y: number, r: number, o: IO = {}) {
  const a = o.a ?? 1;
  if (a <= 0.01 || r <= 0.4) return;
  const base = o.col ?? KCOL[((kind % 3) + 3) % 3];
  const col = o.dim ? mix(base, '#3C4A8C', o.dim) : base;
  c.save();
  c.globalAlpha *= clamp(a);
  if (o.g !== 0 && !o.hollow) glow(c, x, y, r * 2.7, col, 0.42 * (o.g ?? 1) * (1 - (o.dim ?? 0) * 0.8));
  c.translate(x, y);
  c.rotate(o.rot ?? 0);
  shapePath(c, kind, r);
  c.lineJoin = 'round';
  if (o.hollow) {
    c.strokeStyle = col;
    c.lineWidth = Math.max(2.5, r * 0.14);
    c.setLineDash([r * 0.42, r * 0.34]);
    c.stroke();
    c.setLineDash([]);
  } else {
    c.fillStyle = col;
    c.fill();
    if (kind % 3 === 0) {
      c.strokeStyle = col;
      c.lineWidth = r * 0.22;
      c.stroke();
    }
    c.save();
    c.clip();
    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.beginPath();
    c.arc(-r * 0.55, -r * 0.75, r * 0.95, 0, TAU);
    c.fill();
    c.restore();
    if (o.eyes) {
      circ(c, -r * 0.27, r * 0.06, r * 0.1, P.ink);
      circ(c, r * 0.27, r * 0.06, r * 0.1, P.ink);
    }
  }
  c.restore();
}

/* ---------- câmera virtual com paralaxe ---------- */
export type Cam = { x: number; y: number; z: number; r?: number };
export function layer(c: Ctx, cm: Cam, p: number, fn: () => void) {
  const z = Math.max(0.05, 1 + (cm.z - 1) * p);
  c.save();
  c.translate(W / 2, H / 2);
  if (cm.r) c.rotate(cm.r * p);
  c.scale(z, z);
  c.translate(-(W / 2 + (cm.x - W / 2) * p), -(H / 2 + (cm.y - H / 2) * p));
  fn();
  c.restore();
}
export const camK = (t: number, keys: number[][], e: Ease = E.io): Cam => {
  const v = kf(t, keys, e);
  return { x: v[0], y: v[1], z: v[2] };
};
/** tremor de câmera decrescente */
export const shake = (cm: Cam, t: number, t0: number, amp = 14, d = 0.45): Cam => {
  const p = prog(t, t0, t0 + d);
  if (p <= 0 || p >= 1) return cm;
  const k = (1 - p) * amp;
  return { ...cm, x: cm.x + Math.sin(t * 71) * k, y: cm.y + Math.cos(t * 83) * k };
};

/* ---------- atmosfera ---------- */
type DO = { sz?: number; sp?: number; a?: number };
export function dust(c: Ctx, t: number, n: number, seed: number, col: string, o: DO = {}) {
  for (let i = 0; i < n; i++) {
    const h1 = hash(i * 3.1 + seed), h2 = hash(i * 7.7 + seed + 1), h3 = hash(i * 1.3 + seed + 2);
    const sp = (o.sp ?? 14) * (0.4 + h3);
    let x = (h1 * (W + 200) + t * sp * (h2 > 0.5 ? 1 : -0.6)) % (W + 200);
    if (x < 0) x += W + 200;
    let y = (h2 * (H + 200) - t * sp * 0.7) % (H + 200);
    if (y < 0) y += H + 200;
    const a = (o.a ?? 0.5) * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * (0.6 + h3 * 1.5) + h1 * 40)));
    circ(c, x - 100, y - 100, (o.sz ?? 3) * (0.5 + h3), al(col, a));
  }
}
export function stars(c: Ctx, t: number, n: number, seed: number, x0: number, y0: number, x1: number, y1: number, col = '#fff', a = 1) {
  for (let i = 0; i < n; i++) {
    const h1 = hash(i * 1.7 + seed), h2 = hash(i * 5.3 + seed), h3 = hash(i * 9.1 + seed);
    const tw_ = 0.45 + 0.55 * Math.sin(t * (0.8 + h3 * 2) + h1 * 30);
    const x = lerp(x0, x1, h1), y = lerp(y0, y1, h2);
    if (h3 > 0.9) spark(c, x, y, 7 + h1 * 6, al(col, a * tw_), 0);
    else circ(c, x, y, 1.2 + h3 * 2.2, al(col, a * (0.35 + 0.65 * tw_)));
  }
}
export function vignette(c: Ctx, a = 0.45, col = '#02041c') {
  const g = c.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.08);
  g.addColorStop(0, al(col, 0));
  g.addColorStop(1, al(col, a));
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}
/** serra/colinas procedurais */
export function ridge(c: Ctx, seed: number, y: number, amp: number, col: string | CanvasGradient, x0 = -400, x1 = W + 400, step = 70, freq = 1) {
  c.beginPath();
  c.moveTo(x0, H + 900);
  for (let x = x0; x <= x1 + step; x += step) {
    const u = (x / 300) * freq;
    c.lineTo(x, y - (noise(u, seed) * 0.65 + noise(u * 2.7, seed + 9) * 0.35) * amp);
  }
  c.lineTo(x1 + step, H + 900);
  c.closePath();
  c.fillStyle = col;
  c.fill();
}
export function cloud(c: Ctx, x: number, y: number, s: number, col: string) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  box(c, -90, -26, 180, 52, 26, col);
  circ(c, -38, -30, 36, col);
  circ(c, 22, -42, 46, col);
  circ(c, 64, -18, 28, col);
  c.restore();
}
export function shadow(c: Ctx, x: number, y: number, rx: number, a = 0.28) {
  ell(c, x, y, rx, rx * 0.2, `rgba(2,4,30,${a})`);
}
export function bubble(c: Ctx, x: number, y: number, w: number, h: number, col: string, tx: number, ty: number, s = 1) {
  if (s <= 0.01) return;
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  const dx = tx - x, dy = ty - y, a = Math.atan2(dy, dx), bx = Math.cos(a) * w * 0.3, by = Math.sin(a) * h * 0.3;
  poly(c, [bx - Math.sin(a) * 26, by + Math.cos(a) * 26, bx + Math.sin(a) * 26, by - Math.cos(a) * 26, dx * 0.78, dy * 0.78], col, 6);
  box(c, -w / 2, -h / 2, w, h, Math.min(w, h) * 0.32, col);
  c.restore();
}
