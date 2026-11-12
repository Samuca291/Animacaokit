// SEÇÃO 5 — A revelação do sono. Domínio: azul-noite com brilhos ciano (calma).
import { Ctx, W, P, E, lerp, tw, pop, prog, k1, arc, al, bg, layer, camK, dust, vignette, idea, glow, txt, tag, line, circ, box, ring, ell, stars, bez, qb, poly, hash, Cam, mix, burst } from '../core';
import { owl, LUMI } from '../owl';
import { roomBack, roomDesk, calTile, qm, zzz, lamp, book, clock, page } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';
import { H, TAU, KCOL, clamp, pulse, lg, spark, ridge } from '../core';
import { camS, hit } from '../fx';

const c1 = q(5, 1), c2 = q(5, 2), c3 = q(5, 3), c4 = q(5, 4), c5 = q(5, 5), c6 = q(5, 6), c7 = q(5, 7);

const tOff = c2.a + 0.25;
const A: ShotDef = {
  id: '5A', sec: 5, from: c1.a - 0.45, title: 'Entre uma sessão e outra', color: '#09134B', tr: 'wipe', trc: '#09134B', fx: 1440, fy: 380,
  desc: 'Noite no quarto. Entre duas folhas de calendário há um vão com um "?". Lumi se ajeita no ninho, o abajur apaga e ela dorme.',
  cam: 'Plano geral e push-in lento até a cabeça de Lumi', cast: 'Lumi', sfxNote: 'grilos/ambiente noturno, clique do abajur, Zzz',
  sfx: [[c1.a + 0.2, 'pop', 0.5], [at(c1, 'entre'), 'pop', 0.6], [tOff, 'tick', 0.9], [tOff + 0.5, 'drop', 0.4]],
  draw(c, T) {
    const off = tw(T, tOff, tOff + 0.25);
    const cm = camK(T, [[c1.a - 0.45, 960, 540, 1.02], [c2.a, 960, 560, 1.1], [c2.b + 0.9, 1000, 640, 1.55]]);
    roomBack(c, cm, T, { day: 0.5, dark: 0.25 + off * 0.5 });
    layer(c, cm, 1, () => {
      const ts = pop(T, c1.a + 0.2, 0.45) * (1 - tw(T, c2.a, c2.a + 0.5));
      calTile(c, 760, 330, 1.25 * ts, '1', P.teal);
      calTile(c, 1160, 330, 1.25 * ts, '2', P.teal);
      if (ts > 0.5) {
        for (let i = 0; i < 7; i++) circ(c, 840 + i * 40, 330 - arc(i / 6) * 50, 6, al('#ffffff', 0.6));
        qm(c, 960, 250, 110, P.yellow, pop(T, at(c1, 'entre'), 0.4) * ts, Math.sin(T * 4) * 0.08);
        txt(c, 'sessão', 760, 420, 22, '#ffffff', { w: 700, a: ts });
        txt(c, 'sessão', 1160, 420, 22, '#ffffff', { w: 700, a: ts });
      }
      // ninho
      ell(c, 1000, 900, 330, 80, '#3A2496');
      ell(c, 1000, 880, 300, 62, '#4D32B8');
      const sl = T > tOff + 0.5;
      owl(c, LUMI, { x: 1000, y: 880, s: 1.1, t: T, seed: 1, mood: sl ? 'asleep' : T > c2.a ? 'sleepy' : 'think', look: [0, -0.5], tilt: sl ? 0.12 : 0.03, sq: sl ? 0.06 + Math.sin(T * 1.2) * 0.02 : 0, bob: sl ? 2 : 1 });
      box(c, 800, 800, 400, 130, 60, P.pink);
      for (let i = 0; i < 5; i++) circ(c, 850 + i * 76, 850 + (i % 2) * 30, 12, al('#ffffff', 0.35));
      ell(c, 1000, 930, 340, 34, '#2C1B80');
      box(c, 1360, 800, 150, 110, 14, '#3A2496');
      lamp(c, 1470, 800, 1 - off);
      if (sl) zzz(c, 1090, 560, T);
    });
    c.fillStyle = al('#050A2E', off * 0.25);
    c.fillRect(0, 0, W, 1080);
    dust(c, T, 20, 81, '#BFD0FF', { a: 0.25 });
    vignette(c, 0.55);
  },
};

// Mundo do sono: um arquipélago-jardim bioluminescente (não um computador).
// 5B e 5C são UMA tomada contínua: mesmo mundo, mesma câmera, tudo função do tempo global — o corte fica invisível.
const OLD = [[1250, 340], [1380, 250], [1530, 300], [1610, 430], [1470, 470], [1320, 470], [1200, 430]];
const NEW = [[1330, 370], [1490, 385], [1410, 300]];
const PADS = [[380, 800], [520, 772], [660, 800]];
const BR = [700, 770, 980, 520, 1250, 470];
const brP = (u: number) => qb(BR[0], BR[1], BR[2], BR[3], BR[4], BR[5], clamp(u));
const tDes = at(c3, 'desligou'), tCont = at(c3, 'continua'), tNrem = at(c4, 'não'), r0 = at(c4, 'padrões'), r1 = at(c4, 'reativados') - 0.5;
const tGo = at(c5, 'consolidação'), tEst = at(c5, 'estabiliza'), tOrg = at(c5, 'reorganiza'), tCon = at(c5, 'conectando');
const flashAt = (T: number, i: number) => Math.max(arc(prog(T, r0 + i * 0.32, r0 + i * 0.32 + 0.5)), arc(prog(T, r0 + 1.3 + i * 0.2, r0 + 1.3 + i * 0.2 + 0.4)), arc(prog(T, r1 + i * 0.2, r1 + i * 0.2 + 0.4)));
/** luzes do mundo interno: parecem apagar ("desligou") e voltam em cascata, da cabana até a árvore */
const litAt = (T: number, x: number) => {
  const t1 = tCont + clamp((x - 200) / 1500) * 0.9;
  return lerp(lerp(0.75, 0.1, tw(T, tDes - 0.5, tDes + 0.2)), 1, tw(T, t1, t1 + 0.6, E.o));
};
/** no fim do 5B as memórias reativadas decolam dos pedestais e ficam prontas para a travessia */
const hoverAt = (T: number, i: number) => tw(T, r1 + 0.9 + i * 0.12, r1 + 1.5 + i * 0.12, E.back);
/** trajetória de cada memória: pedestal → decolagem → ponte → copa. Estado: 0 no pedestal, 1 em trânsito, 2 na árvore */
function memAt(T: number, i: number): [number, number, number] {
  const t0 = tGo + i * 0.5, u = tw(T, t0, t0 + 1.5), hv = hoverAt(T, i), org = tw(T, tOrg, tOrg + 0.9);
  const hx = PADS[i][0], hy = PADS[i][1] - hv * 36 - Math.sin(T * 2.2 + i) * 5 * hv + 10 * pulse(T, t0 - 0.3, 0.3);
  if (u <= 0) return [hx, hy, 0];
  const tx = lerp(NEW[i][0], 1410 + Math.cos((i / 3) * TAU - 1.57) * 96, org), ty = lerp(NEW[i][1], 380 + Math.sin((i / 3) * TAU - 1.57) * 96, org);
  if (u < 0.2) {
    const k = E.io(u / 0.2);
    return [lerp(hx, BR[0], k), lerp(hy, BR[1], k) - arc(k) * 30, 1];
  }
  if (u < 0.78) {
    const [x, y] = brP((u - 0.2) / 0.58);
    return [x, y, 1];
  }
  if (u < 1) {
    const k = E.o((u - 0.78) / 0.22);
    return [lerp(BR[4], tx, k), lerp(BR[5], ty, k), 1];
  }
  return [tx, ty, 2];
}
const DKEYS = [
  [c3.a - 0.45, 960, 540, 1.14], [c4.a, 900, 560, 1.05], [r0 - 0.2, 700, 630, 1.24], [c4.b + 0.1, 600, 670, 1.42], [tGo + 0.2, 720, 640, 1.32],
  [tGo + 1.7, 1040, 520, 1.26], [tEst + 0.4, 1290, 430, 1.38], [tCon + 0.3, 1320, 420, 1.3], [c5.b + 0.6, 1040, 520, 1.02],
].sort((a, b) => a[0] - b[0]).filter((k, i, arr) => i === 0 || k[0] - arr[i - 1][0] > 0.05);
/** câmera única: estabelece o arquipélago, mergulha na ilha, acompanha a travessia, sobe à copa e recua revelando tudo */
const dreamCam = (T: number): Cam => ({ ...camS(T, DKEYS), r: Math.sin(T * 0.23) * 0.006 });

function dreamScene(c: Ctx, T: number) {
  const cm = dreamCam(T), lit = (x: number) => litAt(T, x);
  const sw = tw(T, tNrem - 0.3, tNrem + 0.8), bridge = tw(T, c5.a - 0.2, tGo + 0.2), org = tw(T, tOrg, tOrg + 0.9);
  const con = tw(T, tCon, tCon + 1.2), est = tw(T, tEst, tEst + 0.8), bloom = tw(T, tCon + 0.5, tCon + 1.7);
  const fl = [0, 1, 2].map((i) => flashAt(T, i)), hov = [0, 1, 2].map((i) => hoverAt(T, i));
  const trav = [0, 1, 2].map((i) => {
    const u = tw(T, tGo + i * 0.5, tGo + i * 0.5 + 1.5);
    return u > 0.2 && u < 0.78 ? (u - 0.2) / 0.58 : -9;
  });
  bg(c, '#040730', '#0D1563', '#1B2A9E', '#2236B4');
  // céu profundo: nebulosas, estrelas e constelações (redes de memórias distantes)
  layer(c, cm, 0.08, () => {
    glow(c, 1350, 300, 950, '#4B2FC8', 0.22);
    glow(c, 420, 160, 760, '#1E78D8', 0.16);
    stars(c, T, 150, 83, -300, -200, W + 300, 640, '#ffffff', 0.9);
    for (let k = 0; k < 4; k++) {
      let px = 240 + k * 430, py = 110 + (k % 2) * 120;
      for (let j = 1; j < 5; j++) {
        const nx = 240 + k * 430 + (hash(k * 9 + j) - 0.3) * 240, ny = 110 + (k % 2) * 120 + (hash(k * 5 + j * 3) - 0.5) * 150;
        line(c, px, py, nx, ny, al('#9FB4FF', 0.1 + 0.08 * Math.sin(T * 0.8 + k + j)), 2);
        circ(c, nx, ny, 3, al('#ffffff', 0.7));
        px = nx;
        py = ny;
      }
    }
  });
  // lua, halos e feixes de luar
  layer(c, cm, 0.14, () => {
    glow(c, 300, 200, 330, '#BFD0FF', 0.34);
    ring(c, 300, 200, 118 + Math.sin(T * 0.5) * 6, al('#BFD0FF', 0.1), 3);
    ring(c, 300, 200, 172, al('#BFD0FF', 0.05), 2);
    c.save();
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const a = 0.62 + i * 0.2 + Math.sin(T * 0.2 + i) * 0.03;
      c.fillStyle = lg(c, 300, 200, 300 + Math.cos(a) * 1300, 200 + Math.sin(a) * 1300, [0, al('#BFD0FF', 0.075), 1, al('#BFD0FF', 0)]);
      c.beginPath();
      c.moveTo(300, 200);
      c.lineTo(300 + Math.cos(a - 0.05) * 1500, 200 + Math.sin(a - 0.05) * 1500);
      c.lineTo(300 + Math.cos(a + 0.05) * 1500, 200 + Math.sin(a + 0.05) * 1500);
      c.closePath();
      c.fill();
    }
    c.restore();
    circ(c, 300, 200, 70, '#EAF0FF');
    circ(c, 330, 184, 62, '#0B1158');
  });
  // ondas lentas: fitas de aurora; uma crista de luz varre o céu a cada rodada de reativação e na passagem para a consolidação
  layer(c, cm, 0.3, () => {
    c.save();
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      for (const [lw, a] of [[72, 0.035], [38, 0.07], [12, 0.16]]) {
        c.beginPath();
        for (let x = -400; x <= W + 400; x += 40) c.lineTo(x, 215 + i * 78 + Math.sin(x / 300 + T * 0.45 + i * 1.3) * (38 + 22 * sw));
        c.strokeStyle = al([P.teal, P.sky, P.pink][i], a * (0.8 + 1.3 * sw) * (0.8 + 0.2 * Math.sin(T * 0.45 + i)));
        c.lineWidth = lw;
        c.lineCap = 'round';
        c.stroke();
      }
    }
    for (const t0 of [r0 - 0.4, r0 + 0.9, r1 - 0.4, c5.a - 0.6]) {
      const p = prog(T, t0, t0 + 2.2);
      if (p > 0 && p < 1) glow(c, lerp(-300, W + 300, p), 290, 400, '#BFF4FF', 0.24 * Math.sin(p * Math.PI));
    }
    c.restore();
  });
  // serras e ilhas distantes, com luzinhas, e névoa no horizonte
  layer(c, cm, 0.4, () => {
    ridge(c, 21, 820, 120, '#18238C', -700, W + 700, 60, 0.7);
    for (let i = 0; i < 9; i++) {
      const x = -200 + i * 290 + hash(i) * 120;
      glow(c, x, 800 - hash(i + 4) * 60, 36, i % 2 ? P.teal : P.sky, 0.3 * lit(x) * (0.6 + 0.4 * Math.sin(T * 1.3 + i)));
    }
  });
  layer(c, cm, 0.62, () => {
    ridge(c, 33, 880, 90, '#141D7A', -700, W + 700, 50, 1.1);
    for (let i = 0; i < 6; i++) {
      const x = -60 + i * 420 + hash(i * 7) * 90, y = 850 - hash(i * 3) * 30;
      line(c, x, y, x, y - 50, '#101868', 7);
      circ(c, x, y - 70, 34, '#1B2792');
      circ(c, x - 18, y - 52, 24, '#172184');
      glow(c, x, y - 70, 50, P.sky, 0.22 * lit(x) * (0.6 + 0.4 * Math.sin(T * 1.1 + i * 2)));
    }
    c.fillStyle = lg(c, 0, 740, 0, 900, [0, al('#6F86FF', 0), 1, al('#6F86FF', 0.24)]);
    c.fillRect(-900, 740, W + 1800, 160);
  });
  const O = OLD.map((n, i) => {
    const a = Math.atan2(n[1] - 380, n[0] - 1410), k = E.io(clamp(org * 1.6 - i * 0.08));
    return [n[0] + Math.cos(a) * 26 * k + Math.sin(T * 0.7 + i) * 3, n[1] + Math.sin(a) * 26 * k + Math.cos(T * 0.6 + i) * 3];
  });
  layer(c, cm, 1, () => {
    // água: horizonte luminoso, reflexo da lua, marolas e lanternas flutuantes
    c.fillStyle = lg(c, 0, 850, 0, 1300, [0, '#1A2AA6', 0.35, '#0F1A78', 1, '#060A3C']);
    c.fillRect(-900, 850, W + 1800, 900);
    c.fillStyle = lg(c, 0, 850, 0, 884, [0, al('#9FB4FF', 0.38), 1, al('#9FB4FF', 0)]);
    c.fillRect(-900, 850, W + 1800, 34);
    const mx = (W / 2 + (300 - (W / 2 + (cm.x - W / 2) * 0.14)) * (1 + (cm.z - 1) * 0.14) - W / 2) / cm.z + cm.x;
    for (let k = 0; k < 9; k++) {
      const w = (64 - k * 4) * (0.6 + 0.4 * Math.sin(T * 1.4 + k * 1.7));
      line(c, mx - w, 872 + k * 22, mx + w, 872 + k * 22, al('#EAF0FF', 0.3 - k * 0.025), 5);
    }
    for (let i = 0; i < 14; i++) {
      const y = 884 + (i % 4) * 40, x = ((((i * 197 + T * (14 + (i % 4) * 9)) % 2700) + 2700) % 2700) - 400;
      line(c, x, y, x + 70 + (i % 3) * 40, y, al('#ffffff', 0.1), 4);
    }
    for (let i = 0; i < 7; i++) {
      const x = 60 + i * 290 + Math.sin(T * 0.2 + i) * 40, y = 912 + (i % 3) * 38 + Math.sin(T * 1.1 + i * 2) * 4, col = [P.pink, P.yellow, P.teal][i % 3];
      const l = lit(x) * (0.6 + 0.4 * Math.sin(T * 1.7 + i));
      ell(c, x, y + 6, 20, 6, '#0C1466');
      poly(c, [x - 11, y + 4, x + 11, y + 4, x + 7, y - 12, x - 7, y - 12], mix('#3B2A8F', col, l), 3);
      glow(c, x, y - 4, 46, col, 0.45 * l);
      line(c, x - 14, y + 17, x + 14, y + 17, al(col, 0.3 * l), 3);
    }
    // ilha das memórias recentes
    ell(c, 520, 888, 350, 34, al('#060A3C', 0.5));
    ell(c, 520, 860, 330, 76, '#2B3BC0');
    ell(c, 520, 846, 290, 54, '#3A4EDC');
    ell(c, 470, 836, 190, 26, al('#7C92FF', 0.25));
    for (let i = 0; i < 10; i++) {
      const x = i < 5 ? 196 + i * 15 : 730 + (i - 5) * 16, b = Math.sin(T * 0.9 + i) * 10, top = 762 - (i % 3) * 18;
      bez(c, x, 852, x + b * 0.4, 805, x + b, top, '#2434A8', 5);
      ell(c, x + b, top - 6, 4.5, 12, '#5568D8');
    }
    // cabana do dia: janela acesa e fumaça de sonho
    for (let k = 0; k < 4; k++) {
      const p = (T * 0.22 + k / 4) % 1;
      circ(c, 280 + Math.sin(p * 5 + k) * 14, 590 - p * 130, 8 + p * 16, al('#BFD0FF', 0.2 * (1 - p) * lit(248)));
    }
    box(c, 268, 596, 18, 50, 5, '#B02A78');
    box(c, 200, 640, 96, 190, 30, '#4D5FE0');
    box(c, 200, 640, 34, 190, 30, al('#7C92FF', 0.3));
    poly(c, [186, 650, 248, 570, 310, 650], P.pink, 10);
    box(c, 232, 780, 32, 50, 12, '#2B3BC0');
    circ(c, 248, 720, 22, al(P.yellow, 0.3 + 0.7 * lit(248)));
    line(c, 227, 720, 269, 720, '#4D5FE0', 3);
    line(c, 248, 699, 248, 741, '#4D5FE0', 3);
    glow(c, 248, 720, 120, P.yellow, 0.5 * lit(248));
    // trilha do replay entre os pedestais
    for (let i = 0; i < 2; i++) {
      for (let k = 1; k < 6; k++) {
        const [x, y] = qb(PADS[i][0], PADS[i][1] - 40, (PADS[i][0] + PADS[i + 1][0]) / 2, PADS[i][1] - 112, PADS[i + 1][0], PADS[i + 1][1] - 40, k / 6);
        circ(c, x, y, 3.5, al('#ffffff', 0.16 + 0.6 * Math.max(fl[i], fl[i + 1])));
      }
    }
    // pedestais com pétalas que se abrem a cada reativação
    PADS.forEach((p, i) => {
      const open = Math.max(fl[i], hov[i]);
      ell(c, p[0], p[1] + 42, 58, 15, '#2434A8');
      ell(c, p[0], 902, 52, 8, al(KCOL[i], 0.28 * fl[i]));
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k - 2) * (0.24 + 0.42 * open);
        ell(c, p[0] + Math.cos(a) * 32, p[1] + 30 + Math.sin(a) * 20, 9, 23, mix('#5568D8', KCOL[i], 0.25 + 0.75 * open), a + Math.PI / 2);
      }
      box(c, p[0] - 30, p[1] + 26, 60, 18, 8, '#4D5FE0');
    });
    // a grande árvore do que já se sabe: ilha, raízes, tronco, galhos e copa em camadas
    ell(c, 1415, 894, 260, 30, al('#060A3C', 0.5));
    ell(c, 1415, 930, 240, 24, al(P.yellow, 0.14 * bloom));
    ell(c, 1415, 866, 220, 44, '#2B3BC0');
    ell(c, 1415, 856, 190, 30, '#3446D0');
    for (const [dx, dy, lw] of [[-150, 26, 22], [-70, 40, 18], [80, 40, 18], [160, 26, 22]]) {
      bez(c, 1415 + dx * 0.1, 800, 1415 + dx * 0.6, 818, 1415 + dx, 846 + dy, '#3A2AA6', lw);
      bez(c, 1415 + dx * 0.1, 800, 1415 + dx * 0.6, 818, 1415 + dx, 846 + dy, al(P.yellow, 0.8 * (0.6 + 0.4 * Math.sin(T * 3 + dx))), 4, bloom);
    }
    poly(c, [1362, 862, 1468, 862, 1446, 560, 1388, 560], '#3A2AA6', 10);
    line(c, 1378, 840, 1396, 590, al('#7C92FF', 0.35), 7);
    bez(c, 1410, 610, 1350, 500, 1290, 430, '#3A2AA6', 34);
    bez(c, 1420, 610, 1500, 500, 1540, 410, '#3A2AA6', 34);
    bez(c, 1415, 610, 1410, 450, 1410, 330, '#3A2AA6', 30);
    const cv = (x: number, y: number, r: number, col: string, i: number) => circ(c, x + Math.sin(T * 0.5 + i) * 4, y + Math.cos(T * 0.4 + i) * 3, r, col);
    cv(1245, 455, 150, '#1F2FA6', 0);
    cv(1595, 445, 150, '#1F2FA6', 1);
    cv(1300, 420, 190, '#2738B8', 2);
    cv(1530, 400, 200, '#2E42CC', 3);
    cv(1410, 310, 190, '#3850E0', 4);
    cv(1335, 290, 105, '#4763EE', 5);
    cv(1495, 262, 84, '#4763EE', 6);
    c.beginPath();
    c.arc(1410, 310, 186, Math.PI * 1.05, Math.PI * 1.62);
    c.strokeStyle = al('#A9BBFF', 0.5);
    c.lineWidth = 7;
    c.lineCap = 'round';
    c.stroke();
    // folhas de luz: florescem quando o novo se liga ao que já existia
    for (let i = 0; i < 28; i++) {
      const a = hash(i * 3.7) * TAU, r = 60 + hash(i * 9.1) * 190, x = 1415 + Math.cos(a) * r * 1.15, y = 380 + Math.sin(a) * r * 0.7, b = clamp(bloom * 3 - hash(i) * 2);
      circ(c, x, y, 5 + 3 * b, al(mix('#7C92FF', P.yellow, b), 0.3 + 0.6 * b * (0.7 + 0.3 * Math.sin(T * 4 + i))));
      if (b > 0.5) spark(c, x, y, 10 * b, al('#ffffff', 0.8 * b), T + i);
    }
    // cipós com frutos de luz
    for (let i = 0; i < 6; i++) {
      const x = 1215 + i * 78, y0 = 545 + (i % 2) * 30, len = 60 + hash(i * 5) * 80, s = Math.sin(T * 0.9 + i * 1.4) * 14, l = lit(x) * (0.55 + 0.45 * Math.sin(T * 1.6 + i));
      bez(c, x, y0, x + s * 0.3, y0 + len * 0.6, x + s, y0 + len, '#2738B8', 4);
      circ(c, x + s, y0 + len + 8, 9, mix('#5568D8', '#DCE6FF', l));
      glow(c, x + s, y0 + len + 8, 42, mix(P.sky, P.yellow, bloom), 0.5 * l);
    }
    // rede do conhecimento antigo: ligações curvas com pulsos; ela se reorganiza para abrir espaço
    O.forEach((n, i) => {
      const m = O[(i + 1) % O.length], l = lit(n[0]), mxx = (n[0] + m[0]) / 2, myy = (n[1] + m[1]) / 2 + 16;
      bez(c, n[0], n[1], mxx, myy, m[0], m[1], al(mix(P.sky, P.yellow, bloom), 0.25 + 0.4 * l), 4);
      const [qx, qy] = qb(n[0], n[1], mxx, myy, m[0], m[1], (T * 0.5 + i * 0.37) % 1);
      circ(c, qx, qy, 4, al('#ffffff', 0.75 * l));
    });
    O.forEach((n, i) => {
      const l = lit(n[0]);
      glow(c, n[0], n[1], 56 + 22 * con, mix(P.sky, P.yellow, con), (0.35 + 0.3 * con) * l * (0.6 + 0.4 * Math.sin(T * 2 + i)));
      circ(c, n[0], n[1], 12, mix('#5568D8', '#DCE6FF', l));
      circ(c, n[0] - 3, n[1] - 4, 4, al('#ffffff', 0.6 * l));
    });
    // ponte de luz: dois cabos, travessas e contas que acendem em sequência como uma pista
    bez(c, BR[0], BR[1], BR[2], BR[3], BR[4], BR[5], al(P.teal, 0.14 + 0.5 * bridge), 7 + 5 * bridge);
    bez(c, BR[0], BR[1] + 30, BR[2], BR[3] + 46, BR[4], BR[5] + 30, al(P.teal, 0.1 + 0.3 * bridge), 4);
    box(c, 690, 726, 18, 78, 6, '#4D5FE0');
    circ(c, 699, 720, 12, mix('#5568D8', '#BFF4FF', bridge));
    glow(c, 699, 720, 60, P.teal, 0.5 * bridge);
    for (let k = 0; k <= 16; k++) {
      const u = k / 16, [x, y] = brP(u), run = clamp(bridge * 20 - k), near = Math.max(0, ...trav.map((tu) => 1 - Math.min(1, Math.abs(tu - u) * 6)));
      const a = Math.min(1, 0.15 + 0.5 * run + 0.6 * near);
      line(c, x, y, x, y + 30 + 60 * u * (1 - u), al('#BFF4FF', a * 0.6), 3);
      circ(c, x, y, 5 + 4 * near, al('#ffffff', a));
      if (run > 0.1 || near > 0.1) glow(c, x, y, 30 + 34 * near, P.teal, 0.3 * run + 0.45 * near);
      if (near > 0.1) ell(c, x, 900 + u * 20, 40, 7, al(P.teal, 0.2 * near));
    }
    // as memórias: reativam no pedestal, decolam, atravessam com rastro e se assentam na copa
    for (let i = 0; i < 3; i++) {
      const [x, y, st] = memAt(T, i), [x0, y0] = memAt(T - 0.03, i), f = fl[i], hv = hov[i], tArr = tGo + i * 0.5 + 1.5;
      const ang = Math.atan2(y - y0, x - x0), strch = st === 1 ? Math.min(0.32, Math.hypot(x - x0, y - y0) / 42) : 0;
      if (st === 1) {
        for (let k = 7; k >= 1; k--) {
          const [qx, qy] = memAt(T - k * 0.045, i);
          circ(c, qx, qy, 22 - k * 2.4, al(KCOL[i], 0.34 - k * 0.04));
        }
      }
      const jit = st === 2 ? (1 - est) * 9 : 0, jx = x + Math.sin(T * 31 + i) * jit, jy = y + Math.cos(T * 27 + i) * jit;
      if (st === 2 && con > 0) {
        for (const k of [i * 2, i * 2 + 1, (i * 2 + 5) % 7]) {
          const o2 = O[k], mxx = (jx + o2[0]) / 2, myy = (jy + o2[1]) / 2 - 18;
          bez(c, jx, jy, mxx, myy, o2[0], o2[1], al(P.yellow, 0.85), 5, con);
          if (con >= 1) {
            const [qx, qy] = qb(jx, jy, mxx, myy, o2[0], o2[1], (T * 0.8 + k * 0.3) % 1);
            circ(c, qx, qy, 5, '#ffffff');
          }
        }
      }
      if (st === 0 && f > 0.05) {
        ring(c, x, y, 40 + (1 - f) * 50, al('#ffffff', f * 0.8), 4);
        page(c, x, y - 96 - f * 16, 44, 58, { a: f * 0.85, rot: (i - 1) * 0.1 });
      }
      c.save();
      c.translate(jx, jy - (st === 0 ? f * 14 : 0));
      c.rotate(ang);
      c.scale(1 + strch, 1 - strch * 0.6);
      c.rotate(-ang);
      idea(c, i, 0, 0, (30 + (st === 0 ? f * 10 : 0)) * (1 + 0.22 * hit(T, tArr, 18, 7)), {
        eyes: true, dim: st === 0 ? 0.65 * (1 - f) * (1 - hv) * (1 - 0.3 * lit(x)) : 0, g: st === 0 ? 0.3 + f * 1.4 + hv * 0.8 : 1 + con,
      });
      c.restore();
      const rp = prog(T, tEst + i * 0.12, tEst + 0.7 + i * 0.12);
      if (st === 2 && rp > 0 && rp < 1) ring(c, jx, jy, 36 + rp * 46, al('#ffffff', 1 - rp), 4);
    }
    // vaga-lumes: sobem em revoada quando a rede floresce
    for (let i = 0; i < 18; i++) {
      const tree = i >= 8, bx = tree ? 1150 + hash(i) * 560 : 300 + hash(i) * 500, by = tree ? 520 + hash(i + 3) * 300 : 600 + hash(i + 3) * 200;
      const x = bx + Math.sin(T * (0.4 + hash(i) * 0.5) + i) * 60, y = by + Math.cos(T * (0.5 + hash(i + 1) * 0.4) + i * 2) * 40 - (tree ? bloom * 70 * hash(i + 6) : 0);
      const l = lit(x) * (0.5 + 0.5 * Math.sin(T * 2.3 + i * 1.9));
      glow(c, x, y, 22, '#FFF0A0', 0.6 * l);
      circ(c, x, y, 2.6, al('#FFFDF2', l));
    }
    burst(c, 1410, 380, T, tCon + 0.6, P.yellow, 14, 300, 7);
    const cut = 1 - tw(T, c5.a - 0.45, c5.a - 0.05);
    tag(c, 'memórias recentes', 520, 950, 22, al('#ffffff', 0.14), '#ffffff', pop(T, c4.a + 0.3, 0.4) * cut);
    tag(c, 'reativação', 520, 660, 26, P.yellow, P.violet, pop(T, r1, 0.4) * cut);
    tag(c, 'o que você já sabe', 1415, 950, 22, al('#ffffff', 0.14), '#ffffff', pop(T, tEst, 0.4));
  });
  // primeiro plano: juncos em silhueta e vaga-lumes desfocados
  layer(c, cm, 1.6, () => {
    for (let i = 0; i < 7; i++) {
      const x = i < 4 ? -70 + i * 46 : 1720 + (i - 4) * 70, b = Math.sin(T * 0.7 + i) * 26, top = 800 + (i % 3) * 50;
      bez(c, x, 1200, x + b * 0.3, 990, x + b, top, '#050830', 14);
      ell(c, x + b, top - 12, 9, 30, '#050830', b * 0.004);
    }
    for (let i = 0; i < 5; i++) {
      const x = ((hash(i * 4) * 2200 + T * (8 + i * 3)) % 2300) - 150, y = 300 + hash(i * 7) * 600 + Math.sin(T * 0.6 + i) * 30;
      glow(c, x, y, 70 + hash(i) * 50, i % 2 ? P.teal : '#FFF0A0', 0.16);
    }
  });
  tag(c, 'sono não REM · ondas lentas', 960, 120, 26, al('#ffffff', 0.16), '#ffffff', pop(T, tNrem, 0.4) * (1 - tw(T, c5.a - 0.45, c5.a - 0.05)));
  // véu de luz que atravessa o quadro na passagem da reativação para a consolidação
  const vp = prog(T, c5.a - 0.9, c5.a + 0.6);
  if (vp > 0 && vp < 1) {
    c.save();
    c.globalCompositeOperation = 'lighter';
    c.fillStyle = lg(c, 0, 0, W, 0, [Math.max(0, vp - 0.28), al('#BFF4FF', 0), vp, al('#BFF4FF', 0.2 * Math.sin(vp * Math.PI)), Math.min(1, vp + 0.28), al('#BFF4FF', 0)]);
    c.fillRect(0, 0, W, H);
    c.restore();
  }
  dust(c, T, 30, 85, P.teal, { a: 0.3 });
  vignette(c, 0.55);
}

const B: ShotDef = {
  id: '5B', sec: 5, from: c3.a - 0.45, title: 'O cérebro continua trabalhando', color: '#131A7A', tr: 'iris', trc: P.sky, fx: 1000, fy: 520,
  desc: 'Mergulho na cabeça de Lumi: um arquipélago noturno com serras distantes, mar com reflexo da lua, cabana do dia e a grande árvore. As luzes parecem apagar — e voltam em cascata. Sob ondas lentas no céu, o padrão do dia (triângulo, círculo, quadrado) é reativado em sequência: pétalas se abrem, ecos da página estudada surgem e, por fim, as memórias decolam dos pedestais.',
  cam: 'Transição em escala (íris), grua lenta com paralaxe até a ilha das memórias recentes', cast: 'Ideias-memória', sfxNote: 'mar calmo, lanternas acendendo, sinos suaves em sequência no replay',
  sfx: [[c3.a, 'drop', 0.4], [tCont, 'sparkle', 0.5], [tCont + 0.3, 'pop', 0.4], ...[0, 1, 2].flatMap((i) => [[r0 + i * 0.32, 'ding', 0.45], [r0 + 1.3 + i * 0.2, 'ding', 0.35], [r1 + i * 0.2, 'ding', 0.4]])],
  draw: dreamScene,
};
const C: ShotDef = {
  id: '5C', sec: 5, from: c5.a - 0.25, title: 'Consolidação', color: '#131A7A',
  desc: 'Tomada contínua com o 5B (corte invisível sob um véu de luz): as contas da ponte acendem como uma pista, as três memórias atravessam com rastro até a grande árvore, chegam trêmulas, estabilizam, a rede antiga se reorganiza e novas ligações douradas crescem; a copa floresce, as raízes acendem e os vaga-lumes sobem.',
  cam: 'A mesma câmera acompanha a travessia, sobe à copa e recua revelando a rede inteira', cast: 'Ideias-memória', sfxNote: 'travessia cintilante, encaixes suaves, rede pulsando',
  sfx: [[tGo, 'zip', 0.4], [tGo + 0.5, 'zip', 0.4], [tGo + 1.0, 'zip', 0.4], [tEst, 'pop', 0.5], [tOrg, 'mech', 0.35], [tCon, 'chime', 0.7], [tCon + 0.6, 'sparkle', 0.6]],
  draw: dreamScene,
};

const tSub = at(c6, 'substitui'), tSac = c7.a, tComp = at(c7, 'comprometer');
const D: ShotDef = {
  id: '5D', sec: 5, from: c6.a - 0.35, title: 'Dormir não substitui — mas faz parte', color: '#09134B', tr: 'iris', trc: P.sky, fx: 960, fy: 500,
  desc: 'De volta ao quarto. Numa balança, travesseiro e livro se equilibram: um não substitui o outro. Depois, Lumi insiste em mais uma hora de leitura na madrugada: no balão de pensamento, a ponte de luz falha e memórias caem.',
  cam: 'Plano médio; push lento em Lumi cabeceando', cast: 'Lumi', sfxNote: 'balança, tique-taque acelerado, memórias caindo, bocejo/queda suave',
  sfx: [[c6.a, 'mech', 0.5], [tSub + 0.3, 'ding', 0.5], [tSac, 'tick', 0.6], [tSac + 0.5, 'tick', 0.6], [tSac + 1.0, 'tick', 0.6], [tSac + 1.5, 'tick', 0.6], [tComp, 'drop', 0.6], [tComp + 0.5, 'drop', 0.5], [tComp + 1.0, 'drop', 0.5]],
  draw(c, T) {
    const cm = camK(T, [[c6.a - 0.35, 960, 540, 1.06], [tSac, 960, 540, 1.06], [c7.b + 0.5, 1040, 520, 1.24]]);
    roomBack(c, cm, T, { day: 0.5, dark: 0.3 });
    const sc = 1 - tw(T, tSac - 0.2, tSac + 0.3);
    layer(c, cm, 1, () => {
      const nod = T > tComp ? 0.1 + Math.abs(Math.sin(T * 1.6)) * 0.14 : 0;
      owl(c, LUMI, { x: 850, y: 842, s: 1.2, t: T, seed: 1, face: 0.35, mood: T > tComp ? 'sleepy' : T > tSac ? 'effort' : 'neutral', look: [0.6, 0.4], tilt: nod, wr: 0.5 });
      roomDesk(c, 1, false);
      page(c, 1030, 630, 190, 132, { glow: 0.6, hl: (T * 1.2) % 5.6, rot: -0.05 });
      // caneca de café
      box(c, 1260, 640, 54, 60, 10, '#F4F7FF');
      ring(c, 1318, 668, 15, '#F4F7FF', 7);
      for (let i = 0; i < 2; i++) bez(c, 1276 + i * 22, 630, 1262 + i * 22 + Math.sin(T * 2 + i) * 12, 600, 1282 + i * 22, 570, al('#ffffff', 0.4), 5);
      // o relógio só entra quando a madrugada começa (antes ele competia com a balança)
      const ck = pop(T, tSac - 0.1, 0.45);
      if (ck > 0) {
        c.save();
        c.translate(1000, 240);
        c.scale(ck, ck);
        clock(c, 0, 0, 62, k1(T, [[tSac, 1], [c7.b, 3.4]], E.lin));
        c.restore();
      }
      // balança: acima da janela, longe da cabeça da Lumi
      if (sc > 0) {
        c.save();
        c.globalAlpha = sc;
        c.translate(1440, 190);
        const k = pop(T, c6.a, 0.5) * 0.82;
        c.scale(k, k);
        const a = lerp(-0.22, 0, tw(T, tSub, tSub + 0.6, E.back));
        box(c, -9, 0, 18, 250, 6, '#F4F7FF');
        box(c, -90, 240, 180, 24, 10, '#F4F7FF');
        c.save();
        c.rotate(a);
        box(c, -250, -10, 500, 18, 9, P.yellow);
        for (const sd of [-1, 1]) {
          c.save();
          c.translate(sd * 235, 0);
          c.rotate(-a);
          line(c, 0, 0, -60, 120, al('#ffffff', 0.6), 4);
          line(c, 0, 0, 60, 120, al('#ffffff', 0.6), 4);
          box(c, -84, 118, 168, 18, 9, P.yellow);
          if (sd < 0) box(c, -66, 70, 132, 50, 24, '#BFD0FF');
          else book(c, 0, 118, 0.8, 0, P.pink);
          c.restore();
        }
        c.restore();
        circ(c, 0, 0, 16, P.orange);
        c.restore();
      }
      // balão de pensamento: a ponte falha
      const th = pop(T, tSac + 0.4, 0.5);
      if (th > 0) {
        circ(c, 1130, 420, 12 * th, '#1A2390');
        circ(c, 1190, 370, 20 * th, '#1A2390');
        c.save();
        c.translate(1430, 300);
        c.scale(th, th);
        circ(c, 0, 0, 200, '#3445C8');
        circ(c, 0, 0, 186, '#121A78');
        const fail = tw(T, tComp, c7.b);
        bez(c, -150, 40, 0, -110, 150, 30, al(P.teal, 0.9 - fail * 0.7 + Math.sin(T * 24) * 0.1 * fail), 10);
        for (let i = 0; i < 3; i++) {
          const f = E.i(prog(T, tComp + i * 0.5, tComp + i * 0.5 + 0.9));
          const [x, y] = qb(-150, 40, 0, -110, 150, 30, 0.25 + i * 0.25);
          idea(c, i, x, y - 22 + f * 210, 22, { a: 1 - f * 0.9, rot: f * 3, dim: f * 0.7 });
        }
        c.restore();
      }
    });
    dust(c, T, 20, 89, '#BFD0FF', { a: 0.25 });
    vignette(c, 0.55);
  },
};
export const S5: ShotDef[] = [A, B, C, D];
export { hash as _h, glow as _g };
