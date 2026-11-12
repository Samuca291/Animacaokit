// Adereços e cenários reutilizáveis (tudo vetorial, desenhado em código).
import { Ctx, W, H, TAU, P, clamp, hash, mix, al, box, circ, ell, line, poly, lg, glow, txt, textW, check, layer, Cam, stars, rr, idea, E, ring } from './core';

export function book(c: Ctx, x: number, y: number, s: number, open: number, col: string, o: { glow?: number; hl?: number } = {}) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  const op = clamp(open);
  if (op < 0.08) {
    box(c, -74, -30, 148, 30, 7, col);
    box(c, -60, -24, 130, 9, 3, P.cream);
    box(c, -74, -30, 16, 30, 7, mix(col, '#000', 0.25));
    box(c, 30, -30, 12, 40, 3, P.pink);
  } else {
    if (o.glow) glow(c, 0, -50, 240, P.yellow, 0.4 * o.glow);
    const wv = 122 * op, lift = 16 * op;
    for (const sd of [-1, 1]) {
      poly(c, [0, 5, sd * (wv + 9), 5 - lift, sd * (wv + 9), -84 - lift, 0, -74], mix(col, '#000', 0.2), 4);
      poly(c, [0, 0, sd * wv, -lift, sd * wv, -84 - lift, 0, -78], sd < 0 ? '#FFF8E3' : P.cream);
      for (let i = 0; i < 4; i++) {
        const yy = -64 + i * 15, x0 = sd * 14 * op, x1 = sd * (wv - 14) * (i === 3 ? 0.6 : 1);
        const done = o.hl !== undefined && o.hl > (sd < 0 ? i : i + 4);
        line(c, x0, yy - (Math.abs(x0) / wv) * lift, x1, yy - (Math.abs(x1) / wv) * lift, done ? P.orange : al('#6B5BA8', 0.55), 4);
      }
    }
    line(c, 0, 3, 0, -78, mix(col, '#000', 0.35), 4);
  }
  c.restore();
}

type PG = { glow?: number; hl?: number; checks?: number; a?: number; rot?: number; dark?: number };
export function page(c: Ctx, x: number, y: number, w: number, h: number, o: PG = {}) {
  c.save();
  c.translate(x, y);
  c.rotate(o.rot ?? 0);
  if (o.a !== undefined) c.globalAlpha *= clamp(o.a);
  const dk = o.dark ?? 0;
  if (o.glow) glow(c, 0, 0, w * 1.6, P.yellow, 0.5 * o.glow * (1 - dk));
  box(c, -w / 2 + 8, -h / 2 + 10, w, h, 12, 'rgba(0,0,30,0.3)');
  box(c, -w / 2, -h / 2, w, h, 12, mix('#FFF4D2', '#2E2A66', dk));
  box(c, -w / 2, -h / 2, w, h * 0.17, 12, mix(P.orange, '#3A3470', dk));
  for (let i = 0; i < 5; i++) {
    const yy = -h / 2 + h * 0.32 + i * h * 0.135, lw = (i === 4 ? 0.5 : 0.76) * w, x0 = -w * 0.41;
    line(c, x0, yy, x0 + lw, yy, mix('#8B7AD6', '#4A467F', dk), h * 0.045);
    if (o.hl !== undefined && o.hl > i) line(c, x0, yy, x0 + lw * clamp(o.hl - i), yy, P.orange, h * 0.055);
    if (o.checks !== undefined && o.checks > i) check(c, w * 0.4, yy, h * 0.1, '#1FB8A0', clamp(o.checks - i));
  }
  c.restore();
}

export function desk(c: Ctx, x: number, y: number, w: number) {
  box(c, x - w / 2 + 40, y + 170, 28, 70, 4, '#3D1D82');
  box(c, x + w / 2 - 68, y + 170, 28, 70, 4, '#3D1D82');
  box(c, x - w / 2 + 24, y + 24, w - 48, 156, 10, '#5B2DA6');
  box(c, x - w / 2 + 24, y + 24, w - 48, 16, 0, 'rgba(0,0,30,0.25)');
  box(c, x + w / 2 - 240, y + 62, 180, 64, 12, '#6C38BC');
  circ(c, x + w / 2 - 150, y + 94, 9, P.yellow);
  box(c, x - w / 2, y, w, 30, 12, '#9A62E8');
  box(c, x - w / 2, y, w, 10, 5, 'rgba(255,255,255,0.18)');
}

export function lamp(c: Ctx, x: number, y: number, on: number) {
  ell(c, x, y - 4, 46, 12, '#2B1A7A');
  line(c, x, y - 8, x - 30, y - 124, '#4433B5', 10);
  line(c, x - 30, y - 124, x - 112, y - 176, '#4433B5', 10);
  circ(c, x - 30, y - 124, 10, P.yellow);
  if (on > 0.01) {
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.fillStyle = lg(c, 0, y - 160, 0, y + 30, [0, al(P.yellow, 0.36 * on), 1, al(P.yellow, 0)]);
    c.beginPath();
    c.moveTo(x - 166, y - 160);
    c.lineTo(x - 104, y - 122);
    c.lineTo(x - 30, y + 30);
    c.lineTo(x - 520, y + 30);
    c.closePath();
    c.fill();
    c.restore();
    glow(c, x - 140, y - 136, 170, P.yellow, 0.42 * on);
  }
  c.save();
  c.translate(x - 120, y - 178);
  c.rotate(-0.55);
  poly(c, [-32, -4, 32, -4, 58, 50, -58, 50], P.orange, 10);
  box(c, -50, 44, 100, 10, 5, on > 0.3 ? '#FFF0A0' : '#7A4A1E');
  c.restore();
}

export function shelf(c: Ctx, x: number, y: number, w: number, rows: number, seed: number, T: number) {
  const rh = 118;
  box(c, x - 16, y - 16, w + 32, rows * rh + 32, 16, '#150B55');
  box(c, x, y, w, rows * rh, 6, '#1D1068');
  const cols = [P.pink, P.orange, P.yellow, P.teal, P.royal, P.sky, '#8250D6', '#1FB8A0'];
  for (let r = 0; r < rows; r++) {
    const by = y + (r + 1) * rh - 12;
    box(c, x, by, w, 12, 3, '#3320A0');
    let bx = x + 10, i = 0;
    while (bx < x + w - 40) {
      const h1 = hash(seed + r * 31 + i * 7.3), bw = 16 + h1 * 20, bh = 60 + hash(seed + r * 17 + i * 3.1) * 36;
      if (h1 > 0.86) {
        box(c, bx + 2, by - 50, 44, 50, 14, al('#BFEFFF', 0.16));
        idea(c, i + r, bx + 24, by - 24, 10, { g: 0.7 + 0.3 * Math.sin(T * 2 + i) });
        bx += 52;
      } else {
        box(c, bx, by - bh, bw, bh, 3, cols[Math.floor(hash(seed + i * 1.9 + r) * cols.length)]);
        box(c, bx + 3, by - bh + 10, bw - 6, 5, 2, 'rgba(255,255,255,0.3)');
        bx += bw + 3;
      }
      i++;
    }
  }
}

export function plant(c: Ctx, x: number, y: number, s: number, T: number, col = '#1FB8A0') {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  for (let i = 0; i < 6; i++) {
    c.save();
    c.translate(0, -70);
    c.rotate(-1.15 + i * 0.46 + Math.sin(T * 1.2 + i) * 0.05);
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(28, -70, 0, -150 - (i % 2) * 30);
    c.quadraticCurveTo(-28, -70, 0, 0);
    c.fillStyle = i % 2 ? col : mix(col, '#0B5F7A', 0.45);
    c.fill();
    c.restore();
  }
  poly(c, [-48, -76, 48, -76, 36, 0, -36, 0], P.orange, 10);
  box(c, -56, -88, 112, 24, 9, '#FFA24D');
  c.restore();
}

/** janela com céu: day 0 = tarde · 0.5 = noite · 1 = manhã */
export function skyWindow(c: Ctx, x: number, y: number, w: number, h: number, day: number, T: number) {
  const d = clamp(day);
  const top = d < 0.5 ? mix('#FF9A3D', '#0A0F4A', d * 2) : mix('#0A0F4A', '#69C8F5', (d - 0.5) * 2);
  const bot = d < 0.5 ? mix('#FF5D8A', '#2B1C82', d * 2) : mix('#2B1C82', '#FFE9A8', (d - 0.5) * 2);
  const arch = (pad: number) => {
    c.beginPath();
    c.moveTo(x - pad, y + h + pad * 0.2);
    c.lineTo(x - pad, y + w / 2);
    c.arc(x + w / 2, y + w / 2, w / 2 + pad, Math.PI, 0);
    c.lineTo(x + w + pad, y + h + pad * 0.2);
    c.closePath();
  };
  arch(18);
  c.fillStyle = '#150B55';
  c.fill();
  c.save();
  arch(0);
  c.clip();
  c.fillStyle = lg(c, 0, y, 0, y + h, [0, top, 1, bot]);
  c.fillRect(x, y, w, h);
  const night = 1 - Math.abs(d - 0.5) * 2;
  if (night > 0.05) stars(c, T, 26, 5, x, y, x + w, y + h * 0.8, '#fff', night);
  const sunA = clamp(d / 0.35), sunB = clamp((d - 0.7) / 0.3);
  if (sunA < 1) {
    const sy = y + h * (0.3 + sunA * 0.9);
    glow(c, x + w * 0.3, sy, 170, P.yellow, 0.5);
    circ(c, x + w * 0.3, sy, 46, '#FFE27A');
  }
  const mu = clamp((d - 0.22) / 0.25) * clamp((0.9 - d) / 0.15);
  if (mu > 0.02) {
    const my = y + h * (1.2 - 0.9 * E.o(mu));
    glow(c, x + w * 0.66, my, 130, '#BFD0FF', 0.4);
    circ(c, x + w * 0.66, my, 38, '#EAF0FF');
    circ(c, x + w * 0.66 + 17, my - 10, 32, top);
  }
  if (sunB > 0) {
    const sy = y + h * (1.15 - E.o(sunB) * 0.75);
    glow(c, x + w * 0.42, sy, 200, P.yellow, 0.55);
    circ(c, x + w * 0.42, sy, 50, '#FFF0A0');
  }
  ell(c, x + w * 0.2, y + h + 30, w * 0.6, 110, mix('#3D1D82', '#1FB8A0', sunB * 0.5));
  ell(c, x + w * 0.85, y + h + 40, w * 0.6, 140, mix('#2A1478', '#16907F', sunB * 0.5));
  c.restore();
  line(c, x + w / 2, y + 8, x + w / 2, y + h, '#150B55', 12);
  line(c, x, y + h * 0.56, x + w, y + h * 0.56, '#150B55', 12);
  box(c, x - 36, y + h, w + 72, 26, 10, '#3320A0');
}

/** medidor em tubo (a "sensação de aprender") */
export function meter(c: Ctx, x: number, y: number, h: number, lvl: number, T: number, col = P.yellow) {
  const w = 48, L = clamp(lvl);
  box(c, x - w / 2 - 20, y - 16, w + 40, 24, 10, '#2A1D6E');
  box(c, x - w / 2 - 7, y - h - 14, w + 14, h + 10, w / 2 + 7, '#0E0840');
  const top = y - 10 - (h - 8) * L;
  if (L > 0.01) {
    c.save();
    rr(c, x - w / 2, y - h - 6, w, h - 4, w / 2);
    c.clip();
    c.fillStyle = lg(c, 0, top, 0, y, [0, col, 1, P.orange]);
    c.fillRect(x - w / 2, top + Math.sin(T * 3) * 2, w, h + 20);
    for (let i = 0; i < 5; i++) {
      const yy = y - 12 - ((T * 46 * (0.5 + hash(i + 3)) + hash(i + 9) * h) % Math.max(1, (h - 10) * L));
      circ(c, x + (hash(i) - 0.5) * w * 0.6, yy, 3 + hash(i + 1) * 3, 'rgba(255,255,255,0.5)');
    }
    c.restore();
    glow(c, x, top + 10, 90 + 70 * L, col, 0.32 * L);
  }
  for (let i = 1; i < 5; i++) line(c, x + w / 2 + 12, y - 10 - (h - 8) * (i / 5), x + w / 2 + 24, y - 10 - (h - 8) * (i / 5), 'rgba(255,255,255,0.35)', 3);
  line(c, x - w * 0.22, y - h + 10, x - w * 0.22, y - 34, 'rgba(255,255,255,0.2)', 5);
}

type SG = { bg?: string; fg?: string; s?: number; ls?: number; cols?: (i: number) => string; sub?: string; T?: number; ropes?: number; a?: number };
/** placa de título (tipografia em código) */
export function sign(c: Ctx, x: number, y: number, s: string, size: number, o: SG = {}) {
  const k = o.s ?? 1;
  if (k <= 0.01) return;
  const ls = o.ls ?? size * 0.05;
  const tw0 = textW(c, s, size, 900) + ls * (s.length - 1);
  const w = Math.max(tw0, o.sub ? textW(c, o.sub, size * 0.36, 600) : 0) + size * 1.6, h = size * (o.sub ? 2.5 : 1.9);
  c.save();
  if (o.a !== undefined) c.globalAlpha *= clamp(o.a);
  c.translate(x, y);
  if (o.ropes) {
    line(c, -w * 0.36, -o.ropes, -w * 0.36, -h / 2, 'rgba(255,255,255,0.4)', 5);
    line(c, w * 0.36, -o.ropes, w * 0.36, -h / 2, 'rgba(255,255,255,0.4)', 5);
  }
  c.scale(k, k);
  box(c, -w / 2 - 10, -h / 2 + 6, w + 20, h + 20, 30, 'rgba(0,0,25,0.3)');
  box(c, -w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 30, mix(o.bg ?? P.night, '#ffffff', 0.2));
  box(c, -w / 2, -h / 2, w, h, 22, o.bg ?? P.night);
  const nb = Math.max(4, Math.round(w / 80));
  for (let i = 0; i < nb; i++) {
    const on = (Math.floor((o.T ?? 0) * 3) + i) % 2 === 0;
    circ(c, -w / 2 + (i + 0.5) * (w / nb), -h / 2 - 5, 6, on ? P.yellow : al(P.yellow, 0.3));
    if (on) glow(c, -w / 2 + (i + 0.5) * (w / nb), -h / 2 - 5, 22, P.yellow, 0.5);
  }
  txt(c, s, 0, o.sub ? -size * 0.26 : size * 0.04, size, o.fg ?? '#fff', { w: 900, ls, cols: o.cols });
  if (o.sub) txt(c, o.sub, 0, size * 0.66, size * 0.36, al('#ffffff', 0.78), { w: 600 });
  c.restore();
}

export function jar(c: Ctx, x: number, y: number, k: number, lit: number, T: number) {
  box(c, x - 26, y - 62, 52, 18, 7, '#1D7A99');
  box(c, x - 40, y - 48, 80, 100, 22, al('#BFF4FF', 0.13));
  idea(c, k, x, y + 6 + Math.sin(T * 1.5 + k) * 4 * lit, 22, { dim: 1 - clamp(lit), g: lit });
  line(c, x - 26, y - 30, x - 26, y + 24, 'rgba(255,255,255,0.22)', 5);
}

export function calTile(c: Ctx, x: number, y: number, s: number, label: string, col: string, flip = 1) {
  c.save();
  c.translate(x, y);
  c.scale(s, s * Math.max(0.02, Math.abs(flip)));
  box(c, -44, -48, 88, 100, 14, '#F4F7FF');
  box(c, -44, -48, 88, 30, 14, col);
  circ(c, -22, -50, 6, '#2A1D6E');
  circ(c, 22, -50, 6, '#2A1D6E');
  txt(c, label, 0, 16, 34, '#2A1D6E', { w: 800 });
  c.restore();
}

export function zzz(c: Ctx, x: number, y: number, T: number, col = '#BFD0FF') {
  for (let i = 0; i < 3; i++) {
    const p = (T * 0.45 + i / 3) % 1;
    txt(c, 'Z', x + p * 70 + Math.sin(p * 6 + i) * 10, y - p * 130, 26 + p * 30, col, { w: 800, a: Math.sin(p * Math.PI) });
  }
}
export function sweat(c: Ctx, x: number, y: number, T: number) {
  for (let i = 0; i < 3; i++) {
    const p = (T * 1.3 + i / 3) % 1, a = -2.3 + i * 0.5;
    const px = x + Math.cos(a) * (20 + p * 50), py = y + Math.sin(a) * (20 + p * 50) + p * p * 30;
    c.save();
    c.translate(px, py);
    c.rotate(a + Math.PI / 2);
    c.globalAlpha *= 1 - p;
    circ(c, 0, 0, 7, '#BFEFFF');
    poly(c, [-6, -3, 6, -3, 0, -17], '#BFEFFF');
    c.restore();
  }
}
export function flag(c: Ctx, x: number, y: number, h: number, col: string, T: number, s = 1) {
  if (s <= 0.01) return;
  line(c, x, y, x, y - h * s, '#F4F7FF', 7);
  const w = Math.sin(T * 4) * 6;
  poly(c, [x, y - h * s, x + 74 * s, y - h * s + 20 * s + w, x, y - h * s + 46 * s], col, 6);
  circ(c, x, y - h * s, 7, P.yellow);
}
export function qm(c: Ctx, x: number, y: number, size: number, col: string, s = 1, rot = 0) {
  if (s <= 0.01) return;
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(s, s);
  glow(c, 0, 0, size * 1.1, col, 0.35);
  txt(c, '?', 0, 0, size, col, { w: 900 });
  c.restore();
}
export function clock(c: Ctx, x: number, y: number, r: number, hrs: number) {
  circ(c, x, y, r + 8, '#2A1D6E');
  circ(c, x, y, r, '#F4F7FF');
  for (let i = 0; i < 12; i++) circ(c, x + Math.cos((i / 12) * TAU) * r * 0.82, y + Math.sin((i / 12) * TAU) * r * 0.82, i % 3 ? 2.5 : 4.5, '#2A1D6E');
  const ah = (hrs / 12) * TAU - Math.PI / 2, am = (hrs % 1) * TAU - Math.PI / 2;
  line(c, x, y, x + Math.cos(ah) * r * 0.5, y + Math.sin(ah) * r * 0.5, '#2A1D6E', r * 0.11);
  line(c, x, y, x + Math.cos(am) * r * 0.74, y + Math.sin(am) * r * 0.74, P.pink, r * 0.08);
  circ(c, x, y, r * 0.09, P.pink);
}

/* ---------- cenário: quarto de estudo ---------- */
export function roomBack(c: Ctx, cm: Cam, T: number, o: { day?: number; dark?: number; posters?: boolean } = {}) {
  const dk = o.dark ?? 0;
  c.fillStyle = lg(c, 0, 0, 0, H, [0, mix('#2A1478', '#0A0838', dk), 1, mix('#3F1F96', '#110D4A', dk)]);
  c.fillRect(0, 0, W, H);
  layer(c, cm, 0.85, () => {
    for (let i = -3; i < 16; i++) box(c, i * 190 - 40, -400, 96, 1900, 0, 'rgba(255,255,255,0.022)');
    skyWindow(c, 1240, 140, 400, 480, o.day ?? 0, T);
    shelf(c, 96, 150, 520, 4, 3, T);
    if (o.posters !== false) {
      box(c, 730, 190, 170, 126, 12, '#150B55');
      circ(c, 815, 253, 34, P.orange);
      ell(c, 815, 253, 58, 12, al(P.yellow, 0.8), -0.3);
      box(c, 940, 150, 126, 160, 12, '#150B55');
      idea(c, 0, 1003, 236, 30, { g: 0.5 });
    }
    c.beginPath();
    c.moveTo(-300, 40);
    c.quadraticCurveTo(960, 150, 2220, 40);
    c.strokeStyle = 'rgba(255,255,255,0.25)';
    c.lineWidth = 3;
    c.stroke();
    for (let i = 0; i < 17; i++) {
      const u = i / 16, bx = -300 + u * 2520, by = 40 + 4 * u * (1 - u) * 55 + 12;
      const on = 0.55 + 0.45 * Math.sin(T * 2.2 + i * 1.7);
      circ(c, bx, by, 9, [P.yellow, P.pink, P.teal][i % 3]);
      glow(c, bx, by, 46, [P.yellow, P.pink, P.teal][i % 3], 0.4 * on * (1 - dk * 0.6));
    }
    if (dk > 0.01) {
      c.fillStyle = al('#04062A', dk * 0.5);
      c.fillRect(-600, -600, W + 1200, H + 1200);
    }
  });
  layer(c, cm, 1, () => {
    c.fillStyle = lg(c, 0, 850, 0, 1400, [0, mix('#1E0F66', '#07062B', dk), 1, '#090533']);
    c.fillRect(-900, 850, W + 1800, 900);
    line(c, -900, 850, W + 900, 850, 'rgba(255,255,255,0.07)', 4);
    ell(c, 930, 970, 600, 74, mix('#5B2DA6', '#1B1460', dk));
    ell(c, 930, 970, 500, 54, mix('#7240C4', '#231A70', dk));
    plant(c, 1730, 870, 1.25, T);
  });
}
export function roomDesk(c: Ctx, lampOn = 1, extras = true) {
  desk(c, 930, 700, 780);
  if (extras) {
    book(c, 650, 700, 0.8, 0, P.pink);
    book(c, 656, 676, 0.7, 0, P.royal);
    box(c, 1250, 650, 44, 50, 9, P.teal);
    line(c, 1262, 652, 1254, 612, P.yellow, 6);
    line(c, 1280, 652, 1290, 618, P.pink, 6);
  }
  lamp(c, 1190, 700, lampOn);
}
/** silhuetas de primeiro plano para dar profundidade */
export function foreLeaves(c: Ctx, cm: Cam, T: number, col = '#0A0638') {
  layer(c, cm, 1.5, () => {
    for (let i = 0; i < 5; i++) {
      c.save();
      c.translate(-40 + i * 34, 1130);
      c.rotate(-0.5 + i * 0.25 + Math.sin(T * 0.9 + i) * 0.04);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(60, -180, 0, -380);
      c.quadraticCurveTo(-60, -180, 0, 0);
      c.fillStyle = col;
      c.fill();
      c.restore();
    }
    ell(c, 1960, 1120, 330, 150, col);
    ring(c, 1960, 1120, 300, al('#ffffff', 0.03), 8);
  });
}
