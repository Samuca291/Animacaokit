// SEÇÃO 3 — Na prática: o cofre da memória. Domínio: verde-água/ciano (descoberta).
import { Ctx, W, P, E, lerp, tw, pop, prog, k1, arc, al, bg, layer, camK, shake, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, ring, ell, ngon, cross, check, bubble, stroke, arrow, lg, mix } from '../core';
import { owl, LUMI, NILO } from '../owl';
import { book, jar, clock, flag } from '../props';
import { q, at, talk } from '../narration';
import type { ShotDef } from '../timeline';

const c1 = q(3, 1), c2 = q(3, 2), c3 = q(3, 3), c4 = q(3, 4), c5 = q(3, 5), c6 = q(3, 6), c7 = q(3, 7), c8 = q(3, 8), c9 = q(3, 9), c10 = q(3, 10);
const JX = (k: number) => 290 + (k % 8) * 192, JY = (k: number) => 250 + Math.floor(k / 8) * 150;
const GAP = 13; // o pote que falta revisar

export function vault(c: Ctx, cm: { x: number; y: number; z: number }, T: number, lit: (k: number) => number) {
  bg(c, '#07405C', '#082457', '#050A2E');
  layer(c, cm, 0.5, () => {
    for (let i = 0; i < 6; i++) ring(c, 960, 520, 300 + i * 190, al(P.teal, 0.11 - i * 0.015), 26);
    glow(c, 960, 480, 950, P.teal, 0.18);
    for (let i = 0; i < 24; i++) circ(c, 960 + Math.cos(i * 0.262 + T * 0.05) * 870, 520 + Math.sin(i * 0.262 + T * 0.05) * 870, 7, al(P.teal, 0.35));
  });
  layer(c, cm, 0.85, () => {
    for (let r = 0; r < 3; r++) {
      box(c, 170, 250 + r * 150 + 54, 1580, 14, 7, '#11597A');
      box(c, 170, 250 + r * 150 + 68, 1580, 8, 4, '#0A3350');
    }
    for (let k = 0; k < 24; k++) jar(c, JX(k), JY(k), k, lit(k), T);
  });
  layer(c, cm, 1, () => {
    ell(c, 960, 950, 900, 130, '#0A3A5C');
    ell(c, 960, 930, 760, 92, '#10587C');
    ell(c, 960, 925, 620, 66, '#14698F');
  });
}
const lectern = (c: Ctx, open: number, g = 0) => {
  box(c, 590, 800, 60, 110, 8, '#0A3350');
  box(c, 540, 896, 160, 22, 8, '#0A3350');
  book(c, 620, 804, 1.1, open, P.royal, { glow: g });
};
const baseLit = (k: number) => (k === GAP ? 0.12 : k % 7 === 3 ? 0.35 : 0.85);

const tFe = at(c1, 'feche');
const QS = ['3 ideias principais?', 'Como eu explicaria?', 'Resolvo sem copiar?'];
const A: ShotDef = {
  id: '3A', sec: 3, from: c1.a - 0.45, title: 'Feche o material e pergunte', color: '#07405C', tr: 'iris', trc: P.teal,
  desc: 'Dentro do cofre da memória. Lumi fecha o livro e se faz três perguntas: três ideias saem das prateleiras; ela explica para Nilo; resolve um exemplo com o modelo coberto.',
  cam: 'Entrada em escala (íris), plano geral com leve push', cast: 'Lumi, Nilo', sfxNote: 'livro fechando, cartões, ideias voando, giz, acerto',
  sfx: [[tFe, 'slam', 0.8], [c2.a, 'pop', 0.6], [c2.a + 0.6, 'zip', 0.4], [c2.a + 1.0, 'zip', 0.4], [c2.a + 1.5, 'zip', 0.35], [c3.a, 'pop', 0.6], [at(c3, 'explicaria'), 'bubble', 0.6], [c4.a, 'pop', 0.6], [at(c4, 'exemplo'), 'tick', 0.5], [c4.b - 0.1, 'ding', 0.6]],
  draw(c, T) {
    const cm = camK(T, [[c1.a - 0.45, 960, 560, 1.16], [c2.a - 0.2, 960, 540, 1.02], [c4.b + 0.4, 960, 525, 1.08]]);
    vault(c, cm, T, baseLit);
    layer(c, cm, 1, () => {
      const cl = tw(T, tFe - 0.25, tFe, E.i);
      lectern(c, 1 - cl, 1 - cl);
      burst(c, 620, 780, T, tFe, '#ffffff', 8, 100, 2);
      const qi = T >= c4.a ? 2 : T >= c3.a ? 1 : T >= c2.a ? 0 : -1;
      const speaking = qi >= 0;
      owl(c, LUMI, { x: 960, y: 900, s: 1.12, t: T, seed: 1, face: T < c2.a ? -0.4 : qi === 1 ? 0.35 : qi === 2 ? 0.3 : 0, mood: T > c4.b - 0.1 ? 'happy' : speaking ? 'think' : 'focus', look: T < c2.a ? [-0.7, 0.3] : qi === 0 ? [0, -0.7] : [0.6, -0.2], beak: speaking ? talk(T) : undefined, wl: T < tFe ? 1.2 - cl * 1.0 : qi === 0 ? 2.4 : 0.2, wr: qi >= 1 ? 1.9 + Math.sin(T * 5) * 0.12 : 0.2, sq: 0.1 * arc(prog(T, tFe - 0.05, tFe + 0.25)), tilt: Math.sin(T * 1.2) * 0.03 });
      // cartões das perguntas
      QS.forEach((s, i) => {
        const t0 = [c2.a, c3.a, c4.a][i], k = pop(T, t0, 0.45);
        if (k <= 0) return;
        line(c, 330, -200, 330, 250 + i * 138 - 50, al('#ffffff', 0.3), 4);
        c.save();
        c.translate(330, 250 + i * 138);
        c.rotate(Math.sin(T * 1.6 + i) * 0.025);
        c.scale(k, k);
        box(c, -180, -50, 360, 100, 20, qi === i ? P.yellow : '#F4F7FF');
        txt(c, s, 0, 4, 29, P.violet, { w: 700 });
        c.restore();
      });
      // P1: três ideias saem dos potes
      [2, 11, 20].forEach((k, i) => {
        const t0 = c2.a + 0.6 + i * 0.45, u = tw(T, t0, t0 + 0.7, E.o), out = tw(T, c3.a + 0.5, c3.a + 0.9);
        if (u > 0 && out < 1) idea(c, k, lerp(JX(k), 860 + i * 100, u), lerp(JY(k), 480, u) - arc(u) * 80 + Math.sin(T * 2 + i) * 6, 30 * (1 - out), { eyes: true, dim: i === 2 ? 0.5 : 0 });
      });
      // P2: explicar para alguém
      const b2 = pop(T, at(c3, 'explicaria'), 0.4) * (1 - tw(T, c4.a - 0.1, c4.a + 0.3));
      const ns = pop(T, c3.a, 0.5) * (1 - tw(T, c4.a, c4.a + 0.4));
      if (ns > 0) owl(c, NILO, { x: 1560, y: 900, s: 0.82 * ns, t: T, seed: 5, face: -0.4, mood: 'happy', look: [-0.6, -0.2], tilt: 0.06 });
      bubble(c, 1300, 420, 380, 190, '#F4F7FF', 1010, 560, b2);
      if (b2 > 0.5) for (let i = 0; i < 3; i++) {
        idea(c, i, 1190 + i * 110, 420, 30, { g: 0 });
        if (i < 2) arrow(c, 1232 + i * 110, 420, 1262 + i * 110, 420, P.violet, 5);
      }
      // P3: resolver sem copiar o modelo
      const s3 = pop(T, c4.a + 0.2, 0.45);
      if (s3 > 0) {
        c.save();
        c.translate(1400, 440);
        c.scale(s3, s3);
        box(c, -230, -150, 460, 300, 24, '#0A2C4E');
        box(c, -214, -134, 428, 268, 16, '#0E3D66');
        box(c, 60, -110, 130, 90, 12, '#5B6C9A');
        line(c, 76, -96, 174, -34, '#0E3D66', 7);
        txt(c, 'modelo', 125, 0, 18, al('#ffffff', 0.6), { w: 600 });
        stroke(c, [-180, 80, -120, 10, -60, 60, 0, -30, 40, 20], P.yellow, 9, prog(T, at(c4, 'exemplo'), c4.b - 0.2));
        check(c, 130, 80, 60, P.teal, prog(T, c4.b - 0.2, c4.b + 0.15));
        c.restore();
      }
    });
    dust(c, T, 28, 51, P.teal, { a: 0.3 });
    vignette(c, 0.5);
  },
};

const tPull = at(c5, 'responder'), tConf = at(c5, 'conferir'), tErr = c6.a, tOt = c7.a, tEx = at(c7, 'exatamente');
const B: ShotDef = {
  id: '3B', sec: 3, from: c5.a - 0.3, title: 'Errou? Ótimo.', color: '#07405C',
  desc: 'Lumi tenta puxar a terceira ideia antes de conferir e traz a forma errada. O livro mostra o erro (✗) — e um holofote revela exatamente a prateleira que precisa de revisão.',
  cam: 'Plano geral; crash zoom para o pote apagado em "exatamente"', cast: 'Lumi', sfxNote: 'puxão, zumbido de erro, holofote, bandeira',
  sfx: [[tPull, 'zip', 0.6], [tConf, 'page', 0.6], [tErr, 'buzz', 0.8], [tOt, 'chime', 0.7], [tEx, 'whoosh', 0.6], [tEx + 0.4, 'pop', 0.7], [tEx + 0.5, 'sparkle', 0.6]],
  draw(c, T) {
    const cm0 = camK(T, [[c5.a - 0.3, 960, 525, 1.08], [tEx - 0.1, 960, 520, 1.1], [tEx + 0.45, 1210, 450, 1.7], [c7.b + 0.4, 1200, 455, 1.76]], E.io);
    const cm = shake(cm0, T, tErr, 16, 0.4);
    const spot = tw(T, tOt, tOt + 0.5);
    vault(c, cm, T, (k) => (k === GAP ? 0.12 + 0.2 * spot * (0.5 + 0.5 * Math.sin(T * 6)) : baseLit(k)));
    layer(c, cm, 0.85, () => {
      if (spot > 0) {
        c.save();
        c.globalCompositeOperation = 'lighter';
        c.fillStyle = lg(c, 0, -200, 0, 520, [0, al(P.yellow, 0.42 * spot), 1, al(P.yellow, 0.05)]);
        c.beginPath();
        c.moveTo(JX(GAP) - 40, -300);
        c.lineTo(JX(GAP) + 40, -300);
        c.lineTo(JX(GAP) + 120, JY(GAP) + 70);
        c.lineTo(JX(GAP) - 120, JY(GAP) + 70);
        c.closePath();
        c.fill();
        c.restore();
        ring(c, JX(GAP), JY(GAP), 76 + Math.sin(T * 5) * 5, al(P.yellow, spot), 7);
        flag(c, JX(GAP) + 76, JY(GAP) + 52, 150, P.pink, T, pop(T, tEx + 0.4, 0.45));
        tag(c, 'REVISAR AQUI', JX(GAP) + 10, JY(GAP) - 110, 22, P.yellow, P.violet, pop(T, tEx + 0.5, 0.4));
      }
    });
    layer(c, cm, 1, () => {
      lectern(c, tw(T, tConf, tConf + 0.4), tw(T, tConf, tConf + 0.4));
      const u = tw(T, tPull - 0.1, tPull + 0.5, E.o), reach = tw(T, c5.a, tPull - 0.1) * (1 - tw(T, tPull + 0.3, tPull + 0.8));
      const ok = T > tOt + 0.4;
      owl(c, LUMI, { x: 1080, y: 900, s: 1.12, t: T, seed: 1, face: ok ? 0.3 : T > tConf ? -0.4 : 0.25, mood: ok ? 'happy' : T > tErr ? 'surprised' : T > tPull + 0.5 ? 'proud' : 'focus', look: ok ? [0.5, -0.7] : T > tConf ? [-0.7, 0.2] : [0.4, -0.7], wr: ok ? 2.5 : 0.3 + reach * 2.3, wl: T > tPull + 0.5 && !ok ? 1.9 : 0.2, sq: -0.08 * reach + 0.1 * arc(prog(T, tErr, tErr + 0.3)), tilt: ok ? -0.06 : 0 });
      if (u > 0) {
        const px = lerp(JX(GAP), 960, u), py = lerp(JY(GAP), 600, u) - arc(u) * 60;
        const wob = Math.sin(T * 9) * 0.1;
        glow(c, px, py, 70, '#8A93BF', 0.3);
        ngon(c, px, py, 34, 5, '#8A93BF', -Math.PI / 2 + wob, 8);
        cross(c, px, py, 96, P.pink, prog(T, tErr, tErr + 0.3));
      }
    });
    dust(c, T, 28, 53, P.teal, { a: 0.3 });
    vignette(c, 0.5);
  },
};

const tCons = at(c9, 'Consulte'), tCor = at(c9, 'corrija'), tDep = at(c9, 'tente'), tOk = c9.b - 0.25, tJ = at(c10, 'mas');
const D: ShotDef = {
  id: '3C', sec: 3, from: c8.a - 0.3, title: 'Corrigir e tentar de novo', color: '#07405C', tr: 'whipL',
  desc: 'Chutar sem parar não ajuda (roleta de formas e ✗). Lumi consulta o livro, a forma errada se transforma na certa e volta ao pote; o relógio gira e ela recupera de novo (✓). No fim, um degrau alto, mas alcançável.',
  cam: 'Plano geral; pan para o degrau e acompanhamento do salto', cast: 'Lumi', sfxNote: 'roleta, erros, página, metamorfose, relógio, acerto, salto e pouso',
  sfx: [[c8.a + 0.5, 'buzz', 0.5], [c8.a + 1.0, 'buzz', 0.5], [c8.a + 1.5, 'buzz', 0.5], [tCons, 'page', 0.7], [tCor, 'sparkle', 0.7], [tCor + 0.9, 'pop', 0.6], [tDep, 'mech', 0.5], [tOk, 'ding', 0.8], [tJ, 'zip', 0.6], [tJ + 0.65, 'thud', 0.7]],
  draw(c, T) {
    const cm = camK(T, [[c8.a - 0.3, 960, 525, 1.08], [c10.a - 0.3, 960, 525, 1.08], [c10.a + 0.9, 1440, 480, 1.12], [c10.b + 0.5, 1500, 450, 1.18]]);
    const fixed = tw(T, tCor + 0.9, tCor + 1.3);
    vault(c, cm, T, (k) => (k === GAP ? 0.12 + 0.88 * fixed : baseLit(k)));
    layer(c, cm, 1, () => {
      // degrau alto, porém possível
      box(c, 1620, 650, 700, 500, 30, '#0E4A6B');
      box(c, 1620, 650, 700, 34, 17, '#18799E');
      box(c, 1700, 250, 500, 26, 13, al('#18799E', 0.25));
      lectern(c, tw(T, tCons, tCons + 0.35) * (1 - tw(T, tDep, tDep + 0.4)), tw(T, tCons, tCons + 0.35));
      const guessing = T < c9.a - 0.2;
      // roleta de chutes
      if (guessing) {
        const k = Math.floor(T * 9);
        idea(c, k, 1080, 470, 44, { hollow: true });
        txt(c, '?', 1080, 474, 44, '#ffffff', { w: 900 });
        ring(c, 1080, 470, 78, al('#ffffff', 0.25), 5);
        for (let i = 0; i < 4; i++) cross(c, 900 + i * 80, 330, 44, P.pink, prog(T, c8.a + 0.5 + i * 0.5, c8.a + 0.75 + i * 0.5));
      }
      // metamorfose: forma errada → forma certa → volta ao pote → é recuperada
      const mo = tw(T, tCor, tCor + 0.5), fly = tw(T, tCor + 0.5, tCor + 1.1, E.io), back = tw(T, tOk - 0.6, tOk, E.o);
      if (!guessing) {
        const hx = lerp(lerp(960, JX(GAP), fly), 1000, back), hy = lerp(lerp(600, JY(GAP) + 6, fly), 560, back) - arc(fly) * 70 - arc(back) * 60;
        if (mo < 1) ngon(c, hx, hy, 34 * (1 - mo), 5, '#8A93BF', -Math.PI / 2 + mo * 3, 8);
        if (mo > 0 && (fly < 1 || back > 0)) idea(c, GAP, hx, hy, 34 * mo, { eyes: true, rot: (1 - mo) * -3 });
        check(c, 1000, 440, 90, P.yellow, prog(T, tOk, tOk + 0.3) * (1 - tw(T, c10.a, c10.a + 0.3)));
        burst(c, 1000, 520, T, tOk, P.yellow, 12, 200, 6);
      }
      clock(c, 1500, 250, 64, k1(T, [[tDep, 2], [tOk - 0.5, 15]]));
      // Lumi
      const walk = tw(T, c10.a, tJ - 0.3, E.io), jp = prog(T, tJ, tJ + 0.65), lx = lerp(lerp(1080, 1430, walk), 1740, E.io(jp));
      const ly = lerp(900, 650, E.o(jp)), cr = arc(prog(T, tJ - 0.3, tJ + 0.02)) * 0.2 - arc(jp) * 0.14 + 0.2 * arc(prog(T, tJ + 0.65, tJ + 0.95));
      owl(c, LUMI, { x: lx, y: ly, hop: arc(jp) * 210, s: 1.12, t: T, seed: 1, face: T > c10.a ? 0.5 : guessing ? 0 : T < tCor ? -0.4 : 0.25, mood: T > tJ + 0.65 ? 'happy' : T > c10.a ? 'effort' : T > tOk ? 'happy' : guessing ? (T > c8.a + 1.6 ? 'dizzy' : 'confused') : 'focus', look: T > c10.a ? [0.6, -0.5] : [0, -0.6], walk: walk > 0 && walk < 1 ? T * 2.4 : undefined, sq: cr, wl: jp > 0 && jp < 1 ? 2.6 : guessing ? 1.6 + Math.sin(T * 8) * 0.3 : 0.2, wr: jp > 0 && jp < 1 ? 2.6 : back > 0 ? 2.2 : guessing ? 1.6 - Math.sin(T * 8) * 0.3 : 0.2, tilt: guessing && T > c8.a + 1.6 ? Math.sin(T * 5) * 0.12 : 0 });
      tag(c, 'real, mas possível', 1760, 300 + 280, 24, P.yellow, P.violet, pop(T, tJ + 0.75, 0.4));
    });
    dust(c, T, 28, 55, P.teal, { a: 0.3 });
    vignette(c, 0.5);
  },
};
export const S3: ShotDef[] = [A, B, D];
export { W as _w, mix as _m };
