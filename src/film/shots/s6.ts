// SEÇÃO 6 — Prática intercalada. Domínio: azul vivo de oficina, com trilhas coloridas.
import { Ctx, W, P, E, lerp, tw, pop, prog, arc, al, bg, layer, camK, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, ring, ell, check, bez, qb, Cam, spring, ngon, KCOL, k1 } from '../core';
import { owl, LUMI, BRASA } from '../owl';
import { sign, qm } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';
import { shake, spark } from '../core';
import { hit, wob, win, moodK, pressMachine, PRESS_REACH } from '../fx';

const c1 = q(6, 1), c2 = q(6, 2), c3 = q(6, 3), c4 = q(6, 4), c5 = q(6, 5), c6 = q(6, 6), c7 = q(6, 7);

function factory(c: Ctx, cm: Cam, T: number) {
  bg(c, '#2A7BF0', '#1C49CC', '#132C94');
  layer(c, cm, 0.5, () => {
    for (let i = 0; i < 4; i++) {
      const x = 220 + i * 520;
      box(c, x - 110, 120, 220, 330, 110, al('#ffffff', 0.08));
      c.save();
      c.translate(x, 290);
      c.rotate(T * 0.4 * (i % 2 ? -1 : 1));
      for (let k = 0; k < 8; k++) {
        c.rotate(Math.PI / 4);
        box(c, -13, -98, 26, 34, 6, al('#ffffff', 0.14));
      }
      ring(c, 0, 0, 62, al('#ffffff', 0.14), 26);
      c.restore();
    }
    line(c, -200, 80, W + 200, 80, '#0E1F7A', 30);
    for (let i = 0; i < 16; i++) circ(c, 60 + i * 124, 80, 9, Math.floor(T * 2 + i) % 4 ? al(P.yellow, 0.3) : P.yellow);
  });
  layer(c, cm, 1, () => {
    c.fillStyle = '#0E1F7A';
    c.fillRect(-900, 900, W + 1800, 700);
  });
}
function belt(c: Ctx, T: number, y: number, sp: number) {
  box(c, -300, y, W + 600, 60, 30, '#0C1560');
  box(c, -300, y, W + 600, 14, 7, '#3A52E0');
  for (let i = 0; i < 20; i++) {
    const x = (((i * 124 - T * sp) % 2480) + 2480) % 2480 - 280;
    circ(c, x, y + 36, 15, '#2438B8');
    circ(c, x, y + 36, 6, '#0C1560');
  }
  for (const x of [200, 960, 1720]) box(c, x - 16, y + 60, 32, 200, 8, '#0C1560');
}
function block(c: Ctx, kind: number, x: number, y: number, s = 1, rot = 0, done = 0) {
  c.save();
  c.translate(x, y - 50 * s);
  c.rotate(rot);
  c.scale(s, s);
  box(c, -50, -50, 100, 100, 20, '#F4F7FF');
  box(c, -50, 26, 100, 24, 12, '#D5DCF5');
  idea(c, kind, 0, -6, 27, { g: 0 });
  if (done > 0) check(c, 30, 30, 30, '#1FB8A0', done);
  c.restore();
}
/** chapéu-hélice: o "piloto automático" */
export function autoCap(c: Ctx, x: number, y: number, T: number, s = 1, spin = 1) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  ell(c, 0, 0, 46, 16, P.pink);
  line(c, 0, -4, 0, -30, '#F4F7FF', 6);
  ell(c, 0, -32, 44 * Math.abs(Math.cos(T * 14 * spin)) + 4, 7, P.yellow);
  c.restore();
}

const T0 = c1.a - 0.45, SP = 150, GAPB = 200, XP = 850;
const J2 = Math.ceil(((c2.a - T0) * SP + 400) / GAPB);
// Esteira indexada: avança um passo, PARA sob a prensa, recebe o carimbo e segue.
// O contato acontece em T0 + k·CYC — exatamente os instantes dos efeitos sonoros já mixados na trilha.
const CYC = GAPB / SP, DW0 = 0.3, DW1 = 0.28, MV = CYC - DW0 - DW1;
const beltN = (T: number) => {
  const u = (T - T0 - DW1) / CYC, k = Math.floor(u);
  return k + E.io(prog((u - k) * CYC, 0, MV));
};
const PTOP = 150, PTRAVEL = 608 - (PTOP + PRESS_REACH);
/** curso do cabeçote em função do tempo até o contato (dt = 0): recolhe, dispara acelerando, segura, recua e assenta */
const ramAt = (dt: number) =>
  dt < -0.25 ? -0.1 * tw(dt, -0.44, -0.25, E.o) : dt < 0 ? lerp(-0.1, 1, tw(dt, -0.25, 0, E.i)) : dt < 0.08 ? 1 : lerp(1, 0, tw(dt, 0.08, 0.44, E.o)) - 0.07 * wob(dt, 0.44, 24, 9);
/** puxador: Brasa estica a asa, puxa, segura e solta (o puxador volta balançando) */
const pullAt = (dt: number) =>
  dt < -0.36 ? -0.2 * tw(dt, -0.52, -0.36, E.o) : dt < -0.24 ? lerp(-0.2, 1, tw(dt, -0.36, -0.24)) : dt < 0.12 ? 1 : lerp(1, 0, tw(dt, 0.12, 0.4, E.o)) + 0.14 * wob(dt, 0.4, 20, 8);
const kindOf = (j: number) => (j < J2 ? 0 : Math.floor((j - J2) / 3) % 3);
const A: ShotDef = {
  id: '6A', sec: 6, from: T0, title: 'Sempre o mesmo tipo', color: '#1C49CC', tr: 'wipe', trc: P.yellow, fx: 1440, fy: 380,
  desc: 'Oficina de exercícios. Na esteira só chegam blocos iguais: Brasa aciona a prensa hidráulica no piloto automático (chapéu-hélice). A esteira para, o cabeçote desce guiado pelas colunas e carimba com impacto. Depois os blocos vêm agrupados por tipo, com um manual pendurado: em blocos, útil no começo.',
  cam: 'Plano geral lateral com leve travelling e tremor no impacto', cast: 'Brasa', sfxNote: 'esteira, prensa ritmada, carimbos, manual descendo',
  sfx: [[c1.a, 'mech', 0.5], ...Array.from({ length: 8 }, (_, i) => [T0 + (i * GAPB + 400) / SP, i % 2 ? 'thud' : 'tick', 0.5]), [c2.a + 0.2, 'pop', 0.6], [at(c2, 'entender'), 'ding', 0.6]],
  draw(c, T) {
    const kI = Math.round((T - T0) / CYC), tI = T0 + kI * CYC, dt = T - tI, heavy = kI % 2 ? 1 : 0.7;
    const cm = shake(camK(T, [[T0, 900, 540, 1.08], [c2.a, 960, 540, 1.02], [c2.b + 0.4, 1010, 530, 1.06]], E.sin), T, tI, 7 * heavy, 0.3);
    factory(c, cm, T);
    const learn = T > c2.a, n = beltN(T), imp = hit(dt, 0, 26, 9), pull = pullAt(dt);
    layer(c, cm, 1, () => {
      // Brasa fica atrás da esteira, sobre uma plataforma: só os pés ficam encobertos pela esteira
      box(c, 330, 640, 350, 80, 18, '#13207A');
      box(c, 330, 640, 350, 14, 7, '#3A52E0');
      pressMachine(c, XP, PTOP, 760, {
        ram: PTRAVEL * ramAt(dt), kind: kindOf(Math.round(n)), jolt: 4 * imp, lamp: win(dt, -0.3, 0.16, 0.06), lampCol: KCOL[kindOf(Math.round(n))],
        gauge: 0.15 + 0.55 * Math.max(0, pull) + 0.3 * Math.max(0, imp), steam: prog(dt, 0.08, 0.5),
      });
      // puxador de acionamento ligado à travessa
      const hx = 632, hy = lerp(476, 548, pull);
      line(c, hx, PTOP + 34, XP - 168, PTOP + 34, '#0C1560', 6);
      line(c, hx, PTOP + 34, hx, hy, al('#ffffff', 0.55), 4);
      for (let i = 0; i < 6; i++) circ(c, hx, PTOP + 60 + ((hy - PTOP - 70) * i) / 5, 4, '#DCE6FF');
      box(c, hx - 24, hy, 48, 16, 8, P.yellow);
      box(c, hx - 24, hy + 10, 48, 6, 3, '#E0A21E');
      const bx = 480, px = bx + 74, py = 690 - 157;
      owl(c, BRASA, {
        x: bx, y: 690, s: 1.05, t: T, seed: 2, face: 0.3, ...moodK(T, [[T0, 'sleepy'], [c2.a, 'focus'], [at(c2, 'entender'), 'happy']], 0.35),
        look: learn ? [0.8, T > at(c2, 'entender') ? 0.3 : -0.3] : [0.6, 0.5], wr: Math.atan2(hx - px, hy + 8 - py), wl: 0.2 + 0.25 * Math.max(0, pull),
        tilt: (learn ? 0.01 : 0.07 + 0.03 * Math.sin(T * 1.1)) + 0.05 * Math.max(0, pull), sq: 0.05 * Math.max(0, pull) + 0.05 * Math.max(0, imp), hop: 5 * Math.max(0, imp),
      });
      autoCap(c, bx + 4, 690 - 346 - 5 * Math.max(0, imp), T, 0.96, learn ? 0.15 : 1);
      // esteira e blocos reagem ao golpe
      c.save();
      c.translate(0, 5 * imp);
      belt(c, (n * GAPB) / SP, 700, SP);
      const mp = prog(dt < 0 ? dt + CYC : dt, DW1, DW1 + MV), sway = dt > DW1 || dt < -DW0 ? 0.05 * Math.sin(mp * Math.PI * 2) : 0;
      for (let j = 0; j < 30; j++) {
        const x = XP + (j - n) * GAPB;
        if (x < -120 || x > W + 220) continue;
        const q0 = j === kI && dt >= 0 ? 0.11 * hit(dt, 0, 24, 8) : 0;
        c.save();
        c.translate(x, 700);
        c.scale(1 + q0 * 0.5, 1 - q0);
        block(c, kindOf(j), 0, 0, 1, sway, pop(T, T0 + j * CYC, 0.3));
        c.restore();
      }
      c.restore();
      // impacto: clarão, linhas de choque e poeira saindo pelos lados
      if (dt >= 0 && dt < 0.34 && kI >= 0) {
        const p = dt / 0.34;
        glow(c, XP, 606, 170 * heavy, P.yellow, 0.75 * (1 - p));
        for (let i = 0; i < 10; i++) {
          const a = (i < 5 ? Math.PI : 0) + ((i % 5) - 2) * 0.2, ra = 78 + 80 * E.o(p) * heavy, rb = ra + 36 * (1 - p);
          line(c, XP + Math.cos(a) * ra, 606 + Math.sin(a) * ra * 0.6, XP + Math.cos(a) * rb, 606 + Math.sin(a) * rb * 0.6, al('#ffffff', 1 - p), 6 * (1 - p) + 1);
        }
        for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) circ(c, XP + sd * (72 + E.o(p) * (40 + i * 28)), 692 - i * 9 - p * 22, (15 - i * 3) * (1 - p) + 2, al('#DCE6FF', 0.6 * (1 - p)));
        for (let i = 0; i < 6; i++) spark(c, XP + (i - 2.5) * 44 * E.o(p) * 1.6, 600 - arc(p) * (40 + (i % 3) * 22), 9 * (1 - p) * heavy, i % 2 ? P.yellow : '#ffffff', p * 3 + i);
      }
      // manual: tipo → procedimento
      const ms = spring(T, c2.a + 0.2, 0.9);
      if (ms > 0) {
        const my = lerp(-300, 300, ms);
        line(c, 1400, -100, 1400, my - 130, al('#ffffff', 0.4), 5);
        box(c, 1210, my - 130, 380, 280, 24, '#F4F7FF');
        for (let i = 0; i < 3; i++) {
          idea(c, i, 1280, my - 70 + i * 76, 24, { g: 0 });
          line(c, 1330, my - 70 + i * 76, 1400, my - 70 + i * 76, P.violet, 5);
          box(c, 1420, my - 92 + i * 76, 130, 44, 12, al(KCOL[i], 0.35));
          for (let k = 0; k <= i; k++) circ(c, 1446 + k * 34, my - 70 + i * 76, 9, P.violet);
        }
      }
    });
    tag(c, 'em blocos · útil no começo', 1390, 108, 28, P.yellow, P.violet, pop(T, at(c2, 'agrupar'), 0.4));
    dust(c, T, 22, 91, '#ffffff', { a: 0.25 });
    vignette(c, 0.4);
  },
};

const SEQ = [0, 2, 1, 0, 1, 2, 2, 0, 1, 2];
const PER = 1.75, tB0 = c3.a + 0.2, CH = (k: number) => [300, 330 + k * 150];
const B: ShotDef = {
  id: '6B', sec: 6, from: c3.a - 0.35, title: 'Misturar: qual estratégia usar?', color: '#1C49CC', tr: 'whipR',
  desc: 'Agora os tipos chegam misturados. Para cada bloco, Brasa precisa olhar, pensar e escolher o duto certo entre três. O letreiro "PRÁTICA INTERCALADA" acende com letras de cores alternadas.',
  cam: 'Plano geral; push leve na decisão', cast: 'Brasa', sfxNote: 'bloco chegando, "hmm" (tick), alavanca, duto, acerto; letreiro',
  sfx: [...Array.from({ length: 6 }, (_, i) => [[tB0 + i * PER, 'zip', 0.4], [tB0 + i * PER + 0.9, 'mech', 0.4], [tB0 + i * PER + 1.5, 'ding', 0.5]]).flat(), [c4.a + 0.1, 'thud', 0.8], [c4.a + 0.25, 'sparkle', 0.8]],
  draw(c, T) {
    const cm = camK(T, [[c3.a - 0.35, 1010, 530, 1.06], [c4.a, 930, 540, 1.1], [c4.b + 0.5, 960, 540, 1.04]], E.sin);
    factory(c, cm, T);
    const n = Math.max(0, Math.floor((T - tB0) / PER)), ph = T < tB0 ? 0 : ((T - tB0) % PER) / PER, kind = SEQ[n % SEQ.length];
    layer(c, cm, 1, () => {
      // dutos
      for (let k = 0; k < 3; k++) {
        const [x, y] = CH(k);
        box(c, -200, y - 50, x + 250, 100, 50, '#0C1560');
        ring(c, x + 50, y, 56, KCOL[k], 14);
        idea(c, k, x - 60, y, 26, { g: 0.6 });
        const hit = k === SEQ[(ph > 0.85 ? n : n - 1 + SEQ.length) % SEQ.length] ? arc(prog((ph + 0.15) % 1, 0, 0.35)) : 0;
        if (hit > 0 && T > tB0 + PER * 0.8) glow(c, x + 50, y, 150, KCOL[k], 0.7 * hit);
      }
      belt(c, T, 760, 0);
      const think = ph > 0.3 && ph < 0.55;
      owl(c, BRASA, { x: 1250, y: 960, s: 1.1, t: T, seed: 2, face: -0.35, mood: think ? 'think' : ph > 0.85 ? 'happy' : 'focus', look: think ? [-0.2, -0.7] : [-0.7, 0.1], tilt: think ? -0.1 : 0, wl: ph > 0.52 && ph < 0.8 ? 2.2 : 0.9 });
      if (think) for (let i = 0; i < 3; i++) circ(c, 1130 + i * 30, 560 - i * 16, 9 * pop(ph, 0.3 + i * 0.05, 0.1), '#ffffff');
      // alavanca
      const la = lerp(0, (kind - 1) * 0.6, tw(ph, 0.52, 0.62));
      box(c, 1010, 880, 120, 34, 12, '#0C1560');
      c.save();
      c.translate(1070, 884);
      c.rotate(la);
      line(c, 0, 0, 0, -110, '#F4F7FF', 12);
      circ(c, 0, -116, 22, KCOL[kind]);
      c.restore();
      // bloco da vez: chega → espera → vai para o duto do seu tipo
      if (T >= tB0) {
        const [dx, dy] = CH(kind);
        if (ph < 0.6) block(c, kind, lerp(2100, 820, E.o(prog(ph, 0, 0.28))), 760, 1, think ? Math.sin(T * 20) * 0.03 : 0);
        else {
          const u = E.io(prog(ph, 0.6, 0.86));
          const [x, y] = qb(820, 710, 560, dy - 160, dx + 50, dy + 40, u);
          block(c, kind, x, y + 50 * (1 - u * 0.4), 1 - u * 0.4, -u * 1.2);
        }
      }
      for (let k = 1; k < 4; k++) block(c, SEQ[(n + k) % SEQ.length], 2100 - (T < tB0 ? 0 : ph * 240) + 240 * (k - 1) - 300 + 520, 760, 1, 0);
    });
    const ss = spring(T, c4.a, 1.0);
    if (ss > 0) sign(c, 960, lerp(-180, 200, ss), 'PRÁTICA INTERCALADA', 84, { bg: P.violet, cols: (i) => KCOL[i % 3], ropes: 400, T });
    burst(c, 960, 200, T, c4.a + 0.25, P.yellow, 16, 520, 5);
    dust(c, T, 22, 93, '#ffffff', { a: 0.25 });
    vignette(c, 0.4);
  },
};

const GATES = [[430, 400], [960, 330], [1490, 400]];
const tCards = [at(c5, 'uma'), at(c5, 'tipo') + 0.35, at(c5, 'identificar')];
const tQ = at(c6, 'ninguém'), tLook = at(c7, 'reconhecer'), tDif = at(c7, 'diferença'), tPar = at(c7, 'parecem');
const C: ShotDef = {
  id: '6C', sec: 6, from: c5.a - 0.4, title: 'Identificar o caminho', color: '#1565C0', tr: 'band', trc: P.teal,
  desc: 'Uma encruzilhada com três trilhas de aparência idêntica e placas em branco. Para cada cartão, Lumi precisa identificar a trilha. No final, uma lupa revela a diferença entre dois problemas que pareciam iguais.',
  cam: 'Plano geral por trás de Lumi; crash zoom nos dois problemas "iguais"', cast: 'Lumi', sfxNote: 'cartões, trilhas acendendo, placas com "?", lupa, revelação',
  sfx: [[c5.a + 0.2, 'page', 0.5], ...tCards.flatMap((t0) => [[t0, 'pop', 0.6], [t0 + 0.5, 'zip', 0.4], [t0 + 1.0, 'ding', 0.5]]), [tQ, 'pop', 0.6], [tQ + 0.15, 'pop', 0.5], [tQ + 0.3, 'pop', 0.5], [tLook, 'whoosh', 0.6], [tDif, 'zip', 0.5], [tPar, 'chime', 0.8], [tPar + 0.2, 'sparkle', 0.7]],
  draw(c, T) {
    const cm = camK(T, [[c5.a - 0.4, 960, 560, 1.06], [c7.a, 960, 540, 1.0], [tLook + 0.4, 960, 470, 1.22], [c7.b + 0.5, 960, 470, 1.28]]);
    bg(c, '#27B5D8', '#1976D2', '#143C9E');
    layer(c, cm, 0.3, () => {
      for (let i = 0; i < 6; i++) ell(c, 100 + i * 380, 700, 300, 200 + (i % 2) * 80, al('#0D47A1', 0.35));
      glow(c, 960, 300, 800, '#BFF4FF', 0.2);
    });
    const zoom = tw(T, tLook, tLook + 0.4);
    layer(c, cm, 1, () => {
      ell(c, 960, 1200, 1500, 420, '#0F3A9A');
      const ci = tCards.filter((t0) => T >= t0).length - 1, order = [1, 0, 2];
      GATES.forEach((g, k) => {
        const lit = order.map((kk, i) => (kk === k ? tw(T, tCards[i] + 0.5, tCards[i] + 1.0) : 0)).reduce((a, b) => a + b, 0);
        bez(c, 960, 940, lerp(960, g[0], 0.4), 700, g[0], g[1] + 90, al('#ffffff', 0.25), 46);
        if (lit > 0) bez(c, 960, 940, lerp(960, g[0], 0.4), 700, g[0], g[1] + 90, KCOL[k], 22, lit);
        box(c, g[0] - 9, g[1] + 60, 18, 60, 6, '#0D2C7A');
        ring(c, g[0], g[1], 70, lit > 0.9 ? KCOL[k] : '#0D2C7A', 18);
        if (lit > 0.9) idea(c, k, g[0], g[1], 30, { eyes: true });
        else {
          box(c, g[0] + 80, g[1] - 40, 110, 70, 12, '#F4F7FF');
          txt(c, '?', g[0] + 135, g[1] - 4, 44, P.violet, { w: 900, a: pop(T, tQ + k * 0.15, 0.3) });
        }
      });
      // pilha de dez iguais, deixada de lado
      const st = 1 - tw(T, at(c5, 'você'), at(c5, 'você') + 0.5);
      if (st > 0) {
        c.save();
        c.globalAlpha = st;
        for (let i = 0; i < 10; i++) box(c, 180 + i * 5, 840 - i * 9, 130, 84, 12, i % 2 ? '#E3EAFF' : '#F4F7FF');
        idea(c, 0, 290, 800, 22, { g: 0 });
        tag(c, '×10 iguais', 270, 690, 24, P.pink, '#ffffff', pop(T, c5.a + 0.2, 0.4));
        c.restore();
      }
      owl(c, LUMI, { x: 960, y: 980, s: 1.0, t: T, seed: 1, back: T < tQ, mood: T > tPar ? 'happy' : T > tQ ? 'worried' : 'focus', wl: ci >= 0 && T < tQ ? 2.6 : 0.2, look: [0, -0.6], tilt: Math.sin(T * 1.3) * 0.03 });
      if (ci >= 0 && T < tQ) {
        const k = order[ci], s = pop(T, tCards[ci], 0.4);
        c.save();
        c.translate(900, 600);
        c.rotate(-0.12);
        c.scale(s, s);
        box(c, -56, -72, 112, 144, 16, '#F4F7FF');
        idea(c, k, 0, 0, 30, { g: 0 });
        c.restore();
      }
      tag(c, 'um de cada tipo', 1640, 800, 24, P.yellow, P.violet, pop(T, tCards[1], 0.4) * (1 - tw(T, tQ, tQ + 0.3)));
      // dois problemas que parecem iguais
      if (zoom > 0) {
        c.fillStyle = al('#0A1E6B', 0.6 * zoom);
        c.fillRect(-600, -400, W + 1200, 2000);
        const rev = tw(T, tPar - 0.5, tPar + 0.1), split = tw(T, tPar + 0.3, tPar + 1.1);
        for (const sd of [-1, 1]) {
          const x = 960 + sd * lerp(130, 330, split), y = 470;
          glow(c, x, y, 190, sd < 0 ? P.yellow : lerp(0, 1, rev) > 0.5 ? P.pink : P.yellow, 0.5 * zoom);
          c.save();
          c.translate(x, y);
          c.scale(zoom, zoom);
          circ(c, 0, 0, 92, sd > 0 && rev > 0.5 ? '#FFB84D' : P.yellow);
          if (sd > 0 && rev > 0) ngon(c, 0, 0, 92, 8, '#FFB84D', 0.39, 6);
          circ(c, -34, -40, 38, 'rgba(255,255,255,0.3)');
          if (rev > 0) for (let i = 0; i < 3; i++) (sd < 0 ? circ(c, -30 + i * 30, 10, 8 * rev, P.violet) : box(c, -38 + i * 30, 2, 16 * rev, 16 * rev, 3, P.violet));
          c.restore();
          tag(c, sd < 0 ? 'tipo A' : 'tipo B', x, 620, 26, sd < 0 ? P.yellow : P.pink, P.violet, pop(T, tPar + 0.1, 0.4));
        }
        txt(c, '≈', 960, 470, 110, '#ffffff', { w: 800, a: zoom * (1 - rev) });
        txt(c, '≠', 960, 470, 110, '#ffffff', { w: 800, a: rev });
        // lupa
        const mx = k1(T, [[tLook + 0.3, 520], [tDif, 830], [tPar - 0.4, 1090], [tPar + 0.5, 1500]]), my = 470 + Math.sin(T * 3) * 10;
        c.save();
        c.globalAlpha = zoom * (1 - tw(T, tPar + 0.4, tPar + 0.9));
        line(c, mx + 86, my + 86, mx + 170, my + 170, P.orange, 26);
        ring(c, mx, my, 120, '#F4F7FF', 18);
        circ(c, mx, my, 111, al('#BFF4FF', 0.2));
        c.restore();
        burst(c, 960, 470, T, tPar + 0.1, '#ffffff', 14, 380, 4);
      }
    });
    dust(c, T, 24, 95, '#ffffff', { a: 0.3 });
    vignette(c, 0.4);
  },
};
export const S6: ShotDef[] = [A, B, C];
export { qm as _q, glow as _g, line as _l };
