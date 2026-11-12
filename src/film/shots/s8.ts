// SEÇÃO 8 — O ciclo e o retorno ao início. Domínio: laranja/amarelo de amanhecer, fechando em azul profundo.
import { Ctx, W, H, P, E, lerp, tw, pop, prog, arc, al, bg, layer, camK, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, ring, stars, cross, check, bubble, poly, TAU, KCOL, k1, hash, textW } from '../core';
import { owl, LUMI, BRASA, Mood } from '../owl';
import { book, calTile, roomBack, roomDesk, page, foreLeaves } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';

const c1 = q(8, 1), c2 = q(8, 2), c3 = q(8, 3), c4 = q(8, 4), c5 = q(8, 5), c6 = q(8, 6), c7 = q(8, 7), c8 = q(8, 8);
const ST = ['ESTUDAR', 'FECHAR E EXPLICAR', 'CONFERIR E CORRIGIR', 'VOLTAR OUTRO DIA', 'MISTURAR', 'DORMIR'];
const tSt = [at(c1, 'estude'), at(c1, 'feche'), c2.a, c3.a, at(c3, 'misture'), at(c4, 'durma') - 0.2];
const ANG = (i: number) => -Math.PI / 2 + (i / 6) * TAU;
const CX = 960, CY = 560, RAD = 330;

function wheel(c: Ctx, T: number, rot: number, power: number) {
  bg(c, '#FF9A3D', '#F0559A', '#5B2DA6');
  glow(c, CX, CY, 900, P.yellow, 0.3);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU + T * 0.05;
    poly(c, [CX, CY, CX + Math.cos(a) * 1500, CY + Math.sin(a) * 1500, CX + Math.cos(a + 0.12) * 1500, CY + Math.sin(a + 0.12) * 1500], al('#ffffff', 0.05));
  }
  ring(c, CX, CY, RAD, al('#ffffff', 0.3), 30);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * TAU + T * 0.25 + rot;
    circ(c, CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD, 5, al('#ffffff', 0.8));
  }
  // núcleo: a memória ficando mais forte
  glow(c, CX, CY, 200 + power * 160, P.yellow, 0.4 + power * 0.4);
  for (let i = 0; i < 3; i++) {
    const a = T * 0.7 + (i / 3) * TAU;
    idea(c, i, CX + Math.cos(a) * 205, CY + Math.sin(a) * 205, 20 + power * 4, { eyes: true });
  }
  // 1ª passada: arcos de progresso (ficam sempre por baixo das estações)
  ST.forEach((_, i) => {
    if (i === 0 || T < tSt[i] - 0.4) return;
    c.beginPath();
    c.arc(CX, CY, RAD, ANG(i - 1) + rot, ANG(i - 1) + rot + (TAU / 6) * tw(T, tSt[i] - 0.4, tSt[i]));
    c.strokeStyle = P.yellow;
    c.lineWidth = 12;
    c.lineCap = 'round';
    c.stroke();
  });
  // 2ª passada: estações por cima
  ST.forEach((s, i) => {
    const k = pop(T, tSt[i], 0.45);
    const a = ANG(i) + rot, x = CX + Math.cos(a) * RAD, y = CY + Math.sin(a) * RAD;
    circ(c, x, y, 26, al('#ffffff', 0.35));
    if (k <= 0) return;
    c.save();
    c.translate(x, y);
    c.scale(k, k);
    circ(c, 0, 8, 80, 'rgba(40,10,80,0.25)');
    circ(c, 0, 0, 80, '#F4F7FF');
    ring(c, 0, 0, 80, [P.royal, P.pink, P.teal, P.purple, P.orange, P.night][i], 10);
    if (i === 0) book(c, 0, 34, 0.5, 1, P.royal);
    if (i === 1) {
      book(c, -22, 30, 0.42, 0, P.pink);
      bubble(c, 24, -18, 60, 44, P.violet, 0, 30);
      idea(c, 1, 24, -18, 12, { g: 0 });
    }
    if (i === 2) check(c, 0, 4, 76, '#1FB8A0', 1);
    if (i === 3) calTile(c, 0, 0, 0.82, '+1', P.purple);
    if (i === 4) for (let j = 0; j < 3; j++) idea(c, j, -40 + j * 40, Math.sin(T * 3 + j) * 7, 17, { g: 0 });
    if (i === 5) {
      circ(c, 0, 0, 40, P.night);
      circ(c, 16, -12, 34, '#F4F7FF');
    }
    c.restore();
    // etiqueta sempre para fora do anel: em cima/embaixo nos polos, ao lado nas estações laterais
    const lw = textW(c, s, 24, 700) + 36, side = Math.abs(Math.cos(a)) > 0.4;
    const tx = side ? x + Math.sign(Math.cos(a)) * (96 + lw / 2) : x;
    const ty = side ? y : y + Math.sign(Math.sin(a)) * 122;
    tag(c, s, tx, ty, 24, P.violet, '#ffffff', k);
  });
}
const lumiAng = (T: number) => k1(T, tSt.map((t0, i) => [t0, ANG(i)]).concat([[c4.b + 0.3, ANG(6)]]), E.io);
/** Lumi no centro da roda: os olhos seguem a estação ativa e um marcador percorre o anel até ela */
function hub(c: Ctx, T: number, a: number, mood: Mood = 'happy') {
  const mx = CX + Math.cos(a) * RAD, my = CY + Math.sin(a) * RAD;
  glow(c, mx, my, 120, P.yellow, 0.55);
  ring(c, mx, my, 42 + Math.sin(T * 6) * 3, al(P.yellow, 0.85), 6);
  circ(c, mx, my, 12, '#ffffff');
  owl(c, LUMI, { x: CX, y: CY + 84, s: 0.5, t: T, seed: 1, face: Math.cos(a) * 0.5, look: [Math.cos(a), Math.sin(a) * 0.5], mood, wl: 0.5 + Math.sin(T * 3) * 0.15, wr: 0.5 - Math.sin(T * 3) * 0.15 });
}

const A: ShotDef = {
  id: '8A', sec: 8, from: c1.a - 0.5, title: 'O ciclo', color: '#FF851D', tr: 'wipe', trc: P.yellow, fx: 1776, fy: 250,
  desc: 'Uma roda luminosa com seis estações acende no ritmo da narração: estudar → fechar e explicar → conferir e corrigir → voltar outro dia → misturar → dormir. Lumi percorre o anel e o núcleo de memória cresce.',
  cam: 'Plano frontal simétrico, push-in lento', cast: 'Lumi', sfxNote: 'um sino por estação (escala ascendente), anel energizando',
  sfx: tSt.flatMap((t0, i) => [[t0, i % 2 ? 'ding' : 'pop', 0.6], [t0 + 0.05, 'tick', 0.4]]).concat([[c4.b, 'chime', 0.7]]),
  draw(c, T) {
    const cm = camK(T, [[c1.a - 0.5, 960, 540, 0.96], [c4.b + 0.6, 960, 550, 1.06]], E.sin);
    layer(c, cm, 1, () => {
      c.save();
      c.translate(-200, -200);
      c.scale(1.2, 1.2);
      c.restore();
      wheel(c, T, 0, tSt.filter((t0) => T > t0).length / 6);
      const a = lumiAng(T);
      hub(c, T, a, 'happy');
    });
    dust(c, T, 26, 121, '#ffffff', { a: 0.35 });
    vignette(c, 0.35, '#3a0a4a');
  },
};

const tAt = at(c5, 'atalho'), tFav = at(c6, 'favor');
const B: ShotDef = {
  id: '8B', sec: 8, from: c5.a - 0.3, title: 'Não é um atalho', color: '#F0559A',
  desc: 'Uma placa-relâmpago "ATALHO" tenta cortar a roda e é dispensada. A roda gira uma volta inteira; a cada estação o núcleo fica mais forte e as ideias passam a empurrar a roda: a memória trabalhando a favor.',
  cam: 'Plano frontal; leve rotação do anel', cast: 'Lumi', sfxNote: 'zip do atalho, erro suave, roda girando, acorde final crescendo',
  sfx: [[c5.a, 'zip', 0.7], [tAt + 0.3, 'buzz', 0.5], [tAt + 0.6, 'drop', 0.5], [c6.a, 'mech', 0.5], [tFav, 'chime', 0.8], [tFav + 0.2, 'sparkle', 0.7]],
  draw(c, T) {
    const cm = camK(T, [[c5.a - 0.3, 960, 550, 1.06], [c6.b + 0.5, 960, 550, 1.14]], E.sin);
    const rot = tw(T, c6.a, c6.b + 0.3, E.io) * TAU;
    layer(c, cm, 1, () => {
      wheel(c, T, rot, 1 + tw(T, c6.a, c6.b) * 0.8);
      const a = ANG(0) + rot;
      hub(c, T, a, rot > 0.01 ? 'happy' : 'focus');
      // o atalho
      const inn = tw(T, c5.a, c5.a + 0.4, E.o), out = tw(T, tAt + 0.5, tAt + 1.1, E.i);
      if (out < 1) {
        c.save();
        c.translate(lerp(-300, 420, inn) - out * 200, 540 + out * 760);
        c.rotate(-0.15 + out * 1.4);
        poly(c, [-150, -50, 110, -50, 150, 0, 110, 50, -150, 50], P.night, 12);
        poly(c, [-116, -30, -86, -30, -100, -4, -80, -4, -112, 34, -104, 6, -122, 6], P.yellow, 3);
        txt(c, 'ATALHO', 22, 2, 36, '#ffffff', { w: 900 });
        cross(c, 0, 0, 150, P.pink, prog(T, tAt + 0.2, tAt + 0.5));
        c.restore();
      }
      burst(c, CX, CY, T, tFav + 0.1, '#ffffff', 16, 420, 9);
    });
    dust(c, T, 26, 123, '#ffffff', { a: 0.35 });
    vignette(c, 0.35, '#3a0a4a');
  },
};

const tCol = at(c7, 'colocar'), tEnc = at(c8, 'encontrá'), tEnd = c8.b - 0.3;
const C: ShotDef = {
  id: '8C', sec: 8, from: c7.a - 0.4, title: 'Encontrar quando você precisa', color: '#09134B', tr: 'iris', trc: P.yellow,
  desc: 'De volta ao quarto do início, agora de manhã. Um funil despeja ideias na cabeça de Lumi e elas só escorregam. Então a página fecha, Brasa pergunta, e Lumi encontra as três ideias: o balão de fala agora está completo. Título final.',
  cam: 'Plano médio (o mesmo do início) e recuo para a composição final', cast: 'Lumi, Brasa', sfxNote: 'ideias quicando, pergunta, três sinos de acerto, acorde final com cauda',
  sfx: [[tCol, 'pop', 0.5], [tCol + 0.3, 'pop', 0.5], [tCol + 0.6, 'pop', 0.5], [c8.a, 'page', 0.6], [tEnc, 'ding', 0.6], [tEnc + 0.3, 'ding', 0.6], [tEnc + 0.6, 'chime', 0.8], [tEnd, 'sparkle', 0.8], [tEnd + 0.1, 'thud', 0.6]],
  draw(c, T) {
    const cm = camK(T, [[c7.a - 0.4, 1000, 540, 1.45], [c8.b, 960, 520, 1.3], [300, 960, 480, 1.12]]);
    roomBack(c, cm, T, { day: 1 });
    const closed = tw(T, c8.a, c8.a + 0.4), find = tw(T, tEnc - 0.2, tEnc + 0.3);
    layer(c, cm, 1, () => {
      owl(c, LUMI, { x: 850, y: 842, s: 1.2, t: T, seed: 1, face: lerp(0.35, -0.15, closed), mood: T > tEnc + 0.6 ? 'happy' : T > c8.a ? 'proud' : 'confused', look: [0, -0.6], wl: lerp(0.2, 2.1, find), wr: 0.4, tilt: T < c8.a ? Math.sin(T * 4) * 0.05 : -0.05 });
      roomDesk(c, 1, false);
      page(c, 1030, 630 + closed * 26, 190, 132, { glow: 0.8 * (1 - closed), hl: 5.6, dark: closed, rot: -0.05 });
      // funil: "colocar informação na cabeça"
      const fu = pop(T, c7.a, 0.4) * (1 - closed);
      if (fu > 0) {
        c.save();
        c.translate(850, 330);
        c.scale(fu * 0.85, fu * 0.85);
        poly(c, [-110, -90, 110, -90, 26, 30, 26, 80, -26, 80, -26, 30], P.orange, 10);
        box(c, -122, -104, 244, 26, 13, '#FFB05C');
        c.restore();
        for (let i = 0; i < 7; i++) {
          const u = ((T - c7.a) * 0.9 + i / 7) % 1, side = i % 2 ? 1 : -1;
          const x = 850 + (u > 0.45 ? side * (u - 0.45) * 520 : 0), y = u < 0.45 ? lerp(280, 470, u / 0.45) : 470 - arc((u - 0.45) / 0.55) * 90 + (u - 0.45) * 520;
          idea(c, i, x, y, 20 * fu, { a: 1 - Math.max(0, u - 0.7) / 0.3, rot: u * 6 });
        }
      }
      // Brasa pergunta; Lumi encontra
      const bs = pop(T, c8.a + 0.1, 0.5);
      if (bs > 0) {
        owl(c, BRASA, { x: 1420, y: 905, s: 1.0 * bs, t: T, seed: 2, face: -0.4, mood: T > tEnc + 0.6 ? 'happy' : 'neutral', wl: 1.9, look: [-0.6, -0.2] });
        c.save();
        c.translate(1290, 600);
        c.rotate(0.1);
        c.scale(bs, bs);
        box(c, -40, -52, 80, 104, 12, '#F4F7FF');
        txt(c, '?', 0, 4, 70, P.pink, { w: 900 });
        c.restore();
      }
      const bb = pop(T, tEnc, 0.45);
      bubble(c, 560, 320, 400, 220, '#F4F7FF', 760, 520, bb);
      if (bb > 0.4) for (let i = 0; i < 3; i++) {
        const k = pop(T, tEnc + i * 0.3, 0.4);
        idea(c, i, 450 + i * 110, 320, 38 * k, { eyes: true });
        if (i < 2) line(c, 496 + i * 110, 320, 514 + i * 110, 320, al(P.violet, k), 6);
      }
      burst(c, 560, 320, T, tEnc + 0.6, P.yellow, 12, 240, 4);
    });
    foreLeaves(c, cm, T);
    dust(c, T, 22, 125, '#ffffff', { a: 0.22 });
    vignette(c, 0.5);
    // composição final
    const e = tw(T, tEnd - 0.2, tEnd + 0.7);
    if (e > 0) {
      // fundo limpo: a sala some por completo antes do título (sem personagens atrás do texto)
      c.save();
      c.globalAlpha = e;
      bg(c, '#2A1E8F', '#140A5C', '#070B3A');
      c.restore();
      c.save();
      c.globalAlpha = e;
      stars(c, T, 70, 127, 0, 0, W, H, '#ffffff', 0.8);
      glow(c, 960, 430, 620, P.royal, 0.5);
      for (let i = 0; i < 3; i++) {
        const x = 800 + i * 160, y = 300 + Math.sin(T * 1.5 + i) * 8;
        if (i < 2) line(c, x + 50, y, x + 110, y, al('#ffffff', 0.5), 5);
        idea(c, i, x, y, 46 * pop(T, tEnd + i * 0.12, 0.5), { eyes: true });
      }
      c.restore();
      txt(c, 'Estudar é conseguir', 960, 500, 84, '#ffffff', { w: 800, a: pop(T, tEnd + 0.2, 0.5) });
      txt(c, 'encontrar.', 960, 610, 120, P.yellow, { w: 900, a: pop(T, tEnd + 0.5, 0.5) });
      txt(c, 'Roediger & Karpicke 2006 · Cepeda et al. 2006 · Dunlosky et al. 2013 · Rasch & Born 2013 · Firth, Rivers & Boyle 2021', 960, 900, 21, al('#ffffff', 0.6), { w: 500, a: pop(T, tEnd + 0.9, 0.5) });
      txt(c, 'Bjork & Bjork (dificuldades desejáveis) · animação original, sem relação com outros canais', 960, 940, 18, al('#ffffff', 0.42), { w: 500, a: pop(T, tEnd + 1.1, 0.5) });
    }
  },
};
export const S8: ShotDef[] = [A, B, C];
export { KCOL as _k, hash as _h };
