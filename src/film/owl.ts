// Rig das personagens: família original de corujas geométricas ("Corujos").
// Corpo, cabeça, tufos, olhos, pálpebras, bico, asas e pernas são peças separadas e animáveis.
import { Ctx, TAU, P, clamp, lerp, hash, circ, ell, mix, rr, box, poly, line } from './core';

export type OwlPal = {
  name: string; body: string; shade: string; wing: string; belly: string; face: string; beak: string; feet: string;
  lid: string; tuft: number; acc?: 'scarf' | 'glasses'; accCol?: string;
};
export const LUMI: OwlPal = { name: 'Lumi', body: '#22D7DA', shade: '#17B0C8', wing: '#1293B2', belly: '#C9F8F1', face: '#EAFFFB', beak: '#FFD244', feet: '#FF851D', lid: '#19BCCB', tuft: 0 };
export const BRASA: OwlPal = { name: 'Brasa', body: '#FF851D', shade: '#E86818', wing: '#CF541A', belly: '#FFE2B5', face: '#FFF3DF', beak: '#FFD244', feet: '#C73A7C', lid: '#F07619', tuft: 1, acc: 'scarf', accCol: '#ED4BA4' };
export const IRIS: OwlPal = { name: 'Dra. Íris', body: '#8250D6', shade: '#6535A8', wing: '#552A96', belly: '#D9C8FA', face: '#F1E9FF', beak: '#FF851D', feet: '#FF851D', lid: '#7040C0', tuft: 2, acc: 'glasses', accCol: '#FFD244' };
export const NILO: OwlPal = { name: 'Nilo', body: '#8CAAF7', shade: '#6F8CE6', wing: '#5873D2', belly: '#E3EAFF', face: '#F2F5FF', beak: '#FFD244', feet: '#FF851D', lid: '#7C9AF0', tuft: 1 };

export type Mood = 'neutral' | 'happy' | 'proud' | 'confused' | 'surprised' | 'worried' | 'sleepy' | 'asleep' | 'focus' | 'effort' | 'dizzy' | 'think';
// pálpebra sup., pálpebra inf., ângulo, pupila, escala do olho, bico, estilo (0 normal, 1 arco feliz, 2 dormindo, 3 espiral), assimetria
const MOODS: Record<Mood, number[]> = {
  neutral: [0.1, 0, 0, 1, 1, 0, 0, 0],
  happy: [0.04, 0.36, 0, 1.06, 1, 0.38, 0, 0],
  proud: [1, 0, 0, 1, 1, 0.22, 1, 0],
  confused: [0.2, 0.05, 0.12, 0.84, 1, 0.14, 0, 0.32],
  surprised: [0, 0, 0, 0.66, 1.1, 0.62, 0, 0],
  worried: [0.24, 0.08, 0.36, 0.8, 1, 0.16, 0, 0],
  sleepy: [0.6, 0.1, 0.05, 0.9, 1, 0, 0, 0],
  asleep: [1, 0, 0, 1, 1, 0, 2, 0],
  focus: [0.3, 0.12, -0.26, 0.95, 1, 0, 0, 0],
  effort: [0.38, 0.3, -0.36, 0.9, 1, 0.12, 0, 0],
  dizzy: [0, 0, 0, 1, 1, 0.32, 3, 0],
  think: [0.16, 0.1, 0.08, 0.9, 1, 0, 0, 0.14],
};

export type Owl = {
  x: number; y: number; s?: number; t?: number; seed?: number;
  /** giro da cabeça/corpo: -1 perfil esq. · 0 frente · 1 perfil dir. */
  face?: number; tilt?: number; lean?: number;
  /** squash (+) / stretch (−) com volume conservado */
  sq?: number; hop?: number; look?: [number, number];
  mood?: Mood; m2?: Mood; mk?: number; blink?: number; beak?: number;
  /** asas: 0 = recolhida, π/2 = horizontal, π = para cima */
  wl?: number; wr?: number; walk?: number; bob?: number; back?: boolean; a?: number;
};

/** piscada automática: a cada 2,6–3,9 s, 130 ms */
export function blinkAt(t: number, seed: number) {
  const per = 2.6 + hash(seed * 9.1) * 1.3;
  const ph = (((t + hash(seed) * per) % per) + per) % per;
  return ph < 0.13 ? Math.sin((ph / 0.13) * Math.PI) : 0;
}

function eye(c: Ctx, x: number, y: number, R: number, sx: number, lx: number, ly: number, pk: number, up: number, lo: number, ang: number, lid: string, style: number, t: number) {
  if (sx <= 0.05) return;
  c.save();
  c.translate(x, y);
  c.scale(sx, 1);
  c.beginPath();
  c.arc(0, 0, R, 0, TAU);
  if (style === 1 || style === 2) {
    c.fillStyle = lid;
    c.fill();
    c.beginPath();
    if (style === 1) c.arc(0, R * 0.28, R * 0.56, Math.PI * 1.08, Math.PI * 1.92);
    else c.arc(0, -R * 0.2, R * 0.56, Math.PI * 0.12, Math.PI * 0.88);
    c.strokeStyle = P.ink;
    c.lineWidth = R * 0.17;
    c.lineCap = 'round';
    c.stroke();
    c.restore();
    return;
  }
  c.fillStyle = '#fff';
  c.fill();
  c.save();
  c.clip();
  if (style === 3) {
    c.beginPath();
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * TAU * 2.2 + t * 7, r = (i / 40) * R * 0.78;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.strokeStyle = P.ink;
    c.lineWidth = R * 0.14;
    c.lineCap = 'round';
    c.stroke();
  } else {
    const px = lx * R * 0.42, py = ly * R * 0.4, pr = R * 0.52 * pk;
    circ(c, px, py, pr, P.ink);
    circ(c, px - pr * 0.36, py - pr * 0.38, pr * 0.3, '#fff');
    circ(c, px + pr * 0.34, py + pr * 0.36, pr * 0.13, 'rgba(255,255,255,0.75)');
    c.fillStyle = lid;
    if (up > 0.005) {
      c.save();
      c.rotate(ang);
      c.fillRect(-R * 2, -R * 3, R * 4, R * 2 + up * 2 * R);
      c.restore();
    }
    if (lo > 0.005) c.fillRect(-R * 2, R - lo * 2 * R, R * 4, R * 2);
  }
  c.restore();
  c.restore();
}

function wingShape(c: Ctx, col: string, col2: string) {
  c.beginPath();
  c.moveTo(0, -12);
  c.bezierCurveTo(32, 4, 30, 82, 0, 104);
  c.bezierCurveTo(-30, 82, -32, 4, 0, -12);
  c.fillStyle = col;
  c.fill();
  line(c, -9, 62, -9, 84, col2, 5);
  line(c, 8, 62, 8, 86, col2, 5);
}

export function owl(c: Ctx, p: OwlPal, o: Owl) {
  const s = o.s ?? 1, t = o.t ?? 0, seed = o.seed ?? 1;
  const f = clamp(o.face ?? 0, -1, 1), af = Math.abs(f), prof = clamp((af - 0.7) / 0.3);
  const sq = o.sq ?? 0;
  const A = MOODS[o.mood ?? 'neutral'];
  const B = o.m2 ? MOODS[o.m2] : A, mk = o.m2 ? clamp(o.mk ?? 0) : 0;
  const M = A.map((v, i) => (i === 6 ? (mk > 0.5 ? B[6] : v) : lerp(v, B[i], mk)));
  const br = Math.sin(t * 2.1 + seed * 1.7) * 2.6 * (o.bob ?? 1);
  const wk = o.walk;
  const by = wk !== undefined ? -Math.abs(Math.sin(wk * TAU)) * 7 : 0;
  const wl = o.wl ?? 0.12, wr = o.wr ?? 0.12;
  c.save();
  if (o.a !== undefined) c.globalAlpha *= clamp(o.a);
  c.translate(o.x, o.y - (o.hop ?? 0));
  c.scale(s * (1 + sq * 0.55), s * (1 - sq * 0.55));
  c.rotate(o.lean ?? 0);

  // pernas e pés
  for (const sd of [-1, 1]) {
    const ph = wk !== undefined ? wk * TAU + (sd > 0 ? Math.PI : 0) : 0;
    const lift = wk !== undefined ? Math.max(0, Math.sin(ph)) * 15 : 0;
    const hx = sd * 28 * (1 - af * 0.4);
    const fx = hx + (wk !== undefined ? Math.cos(ph) * 15 * (f >= 0 ? 1 : -1) : 0);
    line(c, hx, -46 + by, fx, -8 - lift, mix(p.feet, '#6a2408', 0.3), 10);
    c.fillStyle = p.feet;
    c.beginPath();
    c.ellipse(fx + f * 8, -lift, 21, 10, 0, Math.PI, TAU);
    c.fill();
  }
  // cauda
  if (af > 0.25 || o.back) {
    const d = o.back ? 0.2 : -Math.sign(f);
    poly(c, [d * 58, -86 + by, d * 116, -50 + by, d * 60, -38 + by], p.wing, 8);
  }
  const wing = (side: number, ang: number) => {
    c.save();
    c.translate(side * 78 * (1 - af * 0.5) + f * 14, -150 + by + br * 0.5);
    c.rotate(side < 0 ? ang : -ang);
    wingShape(c, p.wing, mix(p.wing, '#000', 0.16));
    c.restore();
  };
  const lead = f > 0 ? 1 : -1;
  if (af > 0.5) wing(lead, lead < 0 ? wl : wr); // asa do lado oposto ao observador fica atrás do corpo

  // corpo
  ell(c, 0, -112 + by, 86, 88, p.shade);
  c.save();
  c.beginPath();
  c.ellipse(0, -112 + by, 86, 88, 0, 0, TAU);
  c.clip();
  ell(c, -15, -126 + by, 86, 88, p.body);
  if (!o.back) {
    ell(c, f * 28, -98 + by, 56 * (1 - af * 0.3), 64, p.belly);
    const fc = mix(p.belly, p.shade, 0.3);
    for (let i = 0; i < 3; i++) {
      const fxx = f * 28 + (i - 1) * 26 * (1 - af * 0.3), fy = -104 + by + (i === 1 ? 16 : 0);
      c.beginPath();
      c.moveTo(fxx - 8, fy);
      c.lineTo(fxx, fy + 8);
      c.lineTo(fxx + 8, fy);
      c.strokeStyle = fc;
      c.lineWidth = 4;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.stroke();
    }
  }
  c.restore();

  if (!(af > 0.5 && lead < 0) && wl < 1.25) wing(-1, wl);
  if (!(af > 0.5 && lead > 0) && wr < 1.25) wing(1, wr);

  // cachecol
  if (p.acc === 'scarf') {
    const ac = p.accCol || P.pink;
    c.save();
    c.translate(34 - f * 30, -168 + by);
    c.rotate(Math.sin(t * 2.4 + seed) * 0.08 - f * 0.1);
    box(c, -13, 0, 26, 58, 10, mix(ac, '#000', 0.18));
    c.restore();
    box(c, -74, -182 + by, 148, 32, 16, ac);
  }

  // cabeça
  c.save();
  c.translate(0, -166 + by + br);
  c.rotate(o.tilt ?? 0);
  const hx = f * 6;
  for (const sd of [-1, 1]) {
    const tx = sd * 76 - f * 12 + hx;
    if (p.tuft === 0) {
      poly(c, [tx - sd * 34, -104, tx + sd * 20, -166, tx + sd * 34, -76], p.body, 10);
      poly(c, [tx - sd * 14, -108, tx + sd * 16, -144, tx + sd * 22, -96], p.shade, 4);
    } else if (p.tuft === 1) {
      circ(c, tx - sd * 2, -122, 32, p.body);
      circ(c, tx - sd * 2, -122, 16, p.shade);
    } else {
      c.beginPath();
      c.moveTo(tx - sd * 30, -112);
      c.quadraticCurveTo(tx + sd * 26, -168, tx + sd * 72, -160);
      c.quadraticCurveTo(tx + sd * 52, -116, tx + sd * 34, -78);
      c.closePath();
      c.fillStyle = p.body;
      c.fill();
    }
  }
  rr(c, -110 + hx, -150, 220, 180, 86);
  c.fillStyle = p.shade;
  c.fill();
  c.save();
  rr(c, -110 + hx, -150, 220, 180, 86);
  c.clip();
  box(c, -128 + hx, -166, 220, 180, 86, p.body);
  c.restore();

  if (o.back) {
    const fc = mix(p.body, p.shade, 0.7);
    for (let i = 0; i < 5; i++) {
      const fxx = (i - 2) * 34, fy = -70 + (i % 2) * 26;
      line(c, fxx - 9, fy, fxx, fy + 9, fc, 5);
      line(c, fxx, fy + 9, fxx + 9, fy, fc, 5);
    }
  } else {
    const R = 38 * M[4], ey = -66, ex = 47 * (1 - af * 0.16);
    const lx = o.look ? o.look[0] : f * 0.45, ly = o.look ? o.look[1] : 0;
    const bl = o.blink ?? blinkAt(t, seed);
    for (const sd of [-1, 1]) {
      const far = sd === lead && af > 0.01;
      const sxk = far ? (1 - 0.45 * af) * (1 - prof) : 1;
      const cx = sd * ex + f * 31 + hx;
      if (sxk > 0.05) {
        c.save();
        c.translate(cx, ey);
        c.scale(sxk, 1);
        circ(c, 0, 0, R + 15, p.face);
        c.restore();
      }
      const up = Math.max(M[0] + (sd < 0 ? M[7] : 0), M[6] === 0 ? bl : 0);
      eye(c, cx, ey, R, sxk, lx, ly, M[3], clamp(up), M[1], sd * M[2], p.lid, M[6], t);
      if (p.acc === 'glasses' && sxk > 0.05) {
        c.save();
        c.translate(cx, ey);
        c.scale(sxk, 1);
        c.beginPath();
        c.arc(0, 0, R + 8, 0, TAU);
        c.strokeStyle = p.accCol || P.yellow;
        c.lineWidth = 8;
        c.stroke();
        c.restore();
      }
    }
    if (p.acc === 'glasses') line(c, -ex + f * 31 + hx + R + 6, ey, ex + f * 31 + hx - R - 6, ey, p.accCol || P.yellow, 7);
    // bico (abre com `beak`)
    const open = clamp(o.beak ?? M[5]);
    const bx = f * lerp(58, 104, prof) + hx, byy = -30, bw = 17 + af * 7;
    poly(c, [bx - bw * 0.72, byy, bx + bw * 0.72 + f * 10, byy, bx + f * 8, byy + 15 + open * 20], mix(p.beak, '#A8400C', 0.5), 5);
    if (open > 0.2) ell(c, bx + f * 4, byy + 3 + open * 5, bw * 0.4, open * 5, '#5a1433');
    poly(c, [bx - bw, byy - 9, bx + bw + f * 16, byy - 9 + af * 4, bx + f * 12, byy + 12], p.beak, 7);
  }
  c.restore();

  if (!(af > 0.5 && lead < 0) && wl >= 1.25) wing(-1, wl);
  if (!(af > 0.5 && lead > 0) && wr >= 1.25) wing(1, wr);
  c.restore();
}

/** ponta da asa em coordenadas de mundo (para segurar objetos) */
export function wingTip(o: Owl, side: number): [number, number] {
  const s = o.s ?? 1, f = clamp(o.face ?? 0, -1, 1), af = Math.abs(f);
  const a = side < 0 ? (o.wl ?? 0.12) : (o.wr ?? 0.12);
  const px = side * 78 * (1 - af * 0.5) + f * 14;
  return [o.x + s * (px + side * Math.sin(a) * 100), o.y - (o.hop ?? 0) + s * (-150 + Math.cos(a) * 100)];
}
/** posição aproximada do topo da cabeça */
export const headTop = (o: Owl): [number, number] => [o.x, o.y - (o.hop ?? 0) - (o.s ?? 1) * 320];
