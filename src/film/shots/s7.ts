// SEÇÃO 7 — A virada: dificuldades desejáveis. Domínio: roxo → laranja de montanha ao entardecer.
import { Ctx, W, P, E, lerp, tw, pop, prog, k1, arc, al, bg, layer, camK, shake, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, ring, ridge, stars, cross, spring, hash, Cam, arrow, KCOL, ell } from '../core';
import { owl, LUMI, IRIS } from '../owl';
import { meter, sign, sweat, flag, book, jar, calTile } from '../props';
import { autoCap } from './s6';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';

const c1 = q(7, 1), c2 = q(7, 2), c3 = q(7, 3), c4 = q(7, 4), c5 = q(7, 5), c6 = q(7, 6), c7 = q(7, 7), c8 = q(7, 8), c9 = q(7, 9), c10 = q(7, 10);

function dusk(c: Ctx, cm: Cam, T: number, x1 = 4200) {
  bg(c, '#2B1680', '#8A3AA0', '#FF8A3D');
  layer(c, cm, 0.1, () => {
    stars(c, T, 50, 101, -200, 0, 2400, 380, '#ffffff', 0.7);
    glow(c, 1300, 820, 900, P.orange, 0.45);
    circ(c, 1300, 800, 170, '#FFD98A');
  });
  layer(c, cm, 0.25, () => ridge(c, 14, 780, 260, '#6A2F9E', -400, x1 * 0.4 + 1600, 90));
  layer(c, cm, 0.5, () => ridge(c, 19, 900, 170, '#45208A', -400, x1 * 0.6 + 1600, 70));
}

const tS = at(c2, 'sentir'), tR = c3.a;
const A: ShotDef = {
  id: '7A', sec: 7, from: c1.a - 0.45, title: 'Percebe o padrão?', color: '#3A1D8F', tr: 'flash',
  desc: 'Os três emblemas (recuperar, espaçar, misturar) se alinham e se conectam. Dois medidores divergem: a "sensação" cai enquanto o "aprendizado" sobe. Ao reler, com a resposta diante dos olhos, a sensação volta a subir — e o aprendizado não.',
  cam: 'Plano frontal com push-in lento', cast: 'Lumi', sfxNote: 'três pops conectando, medidores, página confortável',
  sfx: [[c1.a, 'pop', 0.6], [c1.a + 0.2, 'pop', 0.6], [c1.a + 0.4, 'pop', 0.6], [c1.a + 0.7, 'chime', 0.6], [tS, 'drop', 0.5], [tS + 0.3, 'zip', 0.5], [tR + 0.2, 'page', 0.6], [at(c3, 'resposta'), 'ding', 0.4]],
  draw(c, T) {
    const cm = camK(T, [[c1.a - 0.45, 960, 540, 1.0], [c3.b + 0.4, 960, 560, 1.12]], E.sin);
    bg(c, '#3A1D8F', '#27136E', '#150B4A');
    layer(c, cm, 0.4, () => {
      stars(c, T, 50, 103, -100, -50, W + 100, 600, '#ffffff', 0.6);
      glow(c, 960, 420, 800, P.purple, 0.35);
    });
    const feel = k1(T, [[c2.a, 0.85], [tS, 0.85], [tS + 0.9, 0.28], [tR + 0.3, 0.28], [at(c3, 'resposta'), 0.95]], E.o);
    const learn = k1(T, [[c2.a, 0.2], [tS + 0.2, 0.2], [tS + 1.2, 0.92], [tR + 0.3, 0.92], [at(c3, 'resposta'), 0.3]], E.o);
    layer(c, cm, 1, () => {
      c.fillStyle = '#100840';
      c.fillRect(-600, 900, W + 1200, 600);
      // emblemas conectados
      const link = tw(T, c1.a + 0.6, c1.a + 1.2), dim = T > tR ? 0.35 : 1;
      c.save();
      c.globalAlpha = dim;
      line(c, 660, 250, lerp(660, 1260, link), 250, al(P.yellow, 0.8), 8);
      [660, 960, 1260].forEach((x, i) => {
        const s = pop(T, c1.a + i * 0.2, 0.45);
        c.save();
        c.translate(x, 250);
        c.scale(s, s);
        circ(c, 0, 0, 92, '#1B0E63');
        ring(c, 0, 0, 92, KCOL[i], 10);
        if (i === 0) jar(c, 0, 0, 2, 1, T);
        if (i === 1) for (let k = 0; k < 3; k++) calTile(c, -52 + k * 52, 4, 0.5, '', P.teal);
        if (i === 2) for (let k = 0; k < 3; k++) idea(c, k, -44 + k * 44, Math.sin(T * 3 + k) * 8, 18, { g: 0 });
        c.restore();
        txt(c, ['recuperar', 'espaçar', 'misturar'][i], x, 376, 24, '#ffffff', { w: 700, a: s });
      });
      c.restore();
      const ms = pop(T, c2.a + 0.2, 0.5);
      if (ms > 0) {
        meter(c, 520, 880, 330 * ms, feel, T, P.yellow);
        meter(c, 1400, 880, 330 * ms, learn, T, P.teal);
        tag(c, 'SENSAÇÃO DE SABER', 520, 500, 22, P.yellow, P.violet, ms);
        tag(c, 'APRENDIZADO', 1400, 500, 22, P.teal, P.violet, ms);
      }
      const rd = T > tR;
      owl(c, LUMI, { x: 960, y: 900, s: 1.12, t: T, seed: 1, face: rd ? 0 : T > tS ? 0.3 : -0.3, mood: rd ? 'proud' : T > tS + 0.5 ? 'surprised' : 'think', look: rd ? [0, 0.5] : T > tS ? [0.7, -0.2] : [-0.7, -0.2], tilt: Math.sin(T * 1.2) * 0.03, wl: rd ? 1.5 : 0.2, wr: rd ? 1.5 : 0.2 });
      if (rd) {
        const bs = pop(T, tR + 0.1, 0.45);
        book(c, 960, 800, 1.3 * bs, 1, P.royal, { glow: 1, hl: ((T * 1.6) % 1) * 8 });
        tag(c, 'reler: a resposta está na frente', 960, 620, 24, al('#ffffff', 0.16), '#ffffff', pop(T, at(c3, 'resposta'), 0.4));
      }
    });
    dust(c, T, 26, 105, '#ffffff', { a: 0.25 });
    vignette(c, 0.5);
  },
};

const LX = (T: number) => k1(T, [[c4.a - 0.4, 300], [c4.a + 0.5, 640], [c4.b, 660], [c5.a + 0.5, 1280], [at(c5, 'esqueça'), 1560], [c5.b, 1840], [c6.a + 0.8, 2420], [c6.b, 2520], [c7.a + 1.0, 3050]], E.io);
const tAuto = at(c6, 'piloto'), tDes = at(c7, 'dificuldade');
const B: ShotDef = {
  id: '7B', sec: 7, from: c4.a - 0.4, title: 'Três obstáculos produtivos', color: '#8A3AA0', tr: 'band', trc: P.orange,
  desc: 'Trilha de montanha em travelling: puxar uma gaveta pesada do cofre (recuperar exige esforço), saltar pedras enquanto a anterior apaga um pouco (espaçar é aceitar esquecer), e um caminho que embaralha e derruba o chapéu-hélice (misturar tira do piloto automático). No cume: "DIFICULDADE DESEJÁVEL".',
  cam: 'Travelling lateral contínuo acompanhando Lumi, com paralaxe de montanhas', cast: 'Lumi', sfxNote: 'gaveta rangendo, saltos, névoa, chapéu caindo, placa do cume',
  sfx: [[c4.a + 0.5, 'mech', 0.6], [c4.b - 0.3, 'pop', 0.6], [c5.a + 0.5, 'zip', 0.5], [at(c5, 'esqueça'), 'drop', 0.5], [c5.b - 0.2, 'ding', 0.5], [c6.a + 0.8, 'tick', 0.5], [tAuto, 'bubble', 0.7], [tAuto + 0.5, 'thud', 0.5], [tDes - 0.5, 'riser', 0.6], [tDes, 'thud', 0.8], [tDes + 0.15, 'sparkle', 0.8]],
  draw(c, T) {
    const lx = LX(T);
    // câmera mais próxima e centrada em Lumi: obstáculos e etiquetas legíveis, sem cortar na borda
    const cm = { x: lx + 150, y: 610, z: 1.22 };
    // cada etiqueta só aparece enquanto Lumi está no seu obstáculo
    const win = (a: number, b: number) => pop(T, a, 0.4) * (1 - tw(T, b, b + 0.4));
    dusk(c, cm, T);
    layer(c, cm, 1, () => {
      c.fillStyle = '#2A1470';
      c.fillRect(-900, 880, 5600, 700);
      box(c, -900, 880, 5600, 18, 9, '#4A2494');
      // 1 · gaveta pesada
      const pull = tw(T, c4.a + 0.5, c4.b - 0.2, E.io);
      box(c, 760, 560, 300, 320, 30, '#3A1D82');
      box(c, 790 - pull * 110, 700, 240, 110, 16, '#5B2DA6');
      circ(c, 800 - pull * 110, 755, 14, P.yellow);
      idea(c, 1, 900 - pull * 110, 690 - pop(T, c4.b - 0.3, 0.4) * 90, 30 * pop(T, c4.b - 0.3, 0.4), { eyes: true });
      // 2 · pedras espaçadas
      c.fillStyle = '#FF8A3D';
      box(c, 1180, 880, 760, 400, 0, '#1B0D55');
      [1280, 1560, 1840].forEach((x, i) => {
        const on = lx > x - 40 ? 1 : 0, fade = i < 2 && lx > x + 60 ? tw(T, at(c5, 'esqueça') - 0.6 + i * 0.5, at(c5, 'esqueça') + 0.6 + i * 0.5) * 0.6 : 0;
        box(c, x - 70, 860, 140, 60, 20, '#5B2DA6');
        glow(c, x, 850, 120, P.teal, 0.5 * on * (1 - fade));
        idea(c, i, x, 800 + Math.sin(T * 2 + i) * 4, 22 * on, { dim: fade, g: 1 - fade });
      });
      for (let i = 0; i < 6; i++) ell(c, 1200 + i * 130 + Math.sin(T * 0.6 + i) * 40, 905 + (i % 2) * 18, 110, 30, al('#E6D9FF', 0.12));
      // 3 · caminho embaralhado
      for (let i = 0; i < 6; i++) {
        const k = (i + Math.floor(Math.max(0, T - c6.a) * 1.6)) % 3;
        box(c, 2180 + i * 96, 858, 88, 30, 10, KCOL[k]);
      }
      // cume
      box(c, 2960, 760, 500, 400, 40, '#3A1D82');
      box(c, 2960, 760, 500, 26, 13, '#6A35B0');
      flag(c, 3260, 760, 190, P.yellow, T, pop(T, tDes + 0.6, 0.5));
      // Lumi
      const hopS = [c5.a + 0.5, at(c5, 'esqueça'), c5.b - 0.5].reduce((a, t0) => a + arc(prog(T, t0, t0 + 0.5)), 0);
      const climb = tw(T, c7.a + 0.3, c7.a + 1.0);
      const moving = Math.abs(LX(T + 0.05) - lx) > 0.5;
      owl(c, LUMI, { x: lx, y: lerp(880, 760, E.o(climb)), hop: hopS * 110 + arc(climb) * 120, s: 0.95, t: T, seed: 1, face: T > c4.a + 0.5 && T < c4.b - 0.2 ? -0.5 : 0.5, mood: T > tDes ? 'happy' : T < c4.b - 0.2 && T > c4.a + 0.4 ? 'effort' : moving ? 'focus' : 'happy', walk: moving && hopS < 0.05 ? T * 2.5 : undefined, wr: T < c4.b - 0.2 && T > c4.a + 0.5 ? 1.9 : T > tDes ? 2.5 : 0.2, wl: T < c4.b - 0.2 && T > c4.a + 0.5 ? 1.9 : T > tDes ? 2.5 : 0.2, lean: T < c4.b - 0.2 && T > c4.a + 0.5 ? -0.14 * pull : 0 });
      if (T > c4.a + 0.5 && T < c4.b) sweat(c, lx + 20, 560, T);
      // etiquetas acima da cabeça real de Lumi (acompanham saltos e a subida do cume)
      const ty = lerp(880, 760, E.o(climb)) - (hopS * 110 + arc(climb) * 120) - 420;
      tag(c, 'recuperar exige esforço', lx, ty, 30, P.yellow, P.violet, win(c4.a + 0.4, c5.a + 0.2));
      tag(c, 'espaçar: aceitar esquecer um pouco', lx, ty, 30, P.teal, P.violet, win(c5.a + 0.4, c6.a + 0.2));
      tag(c, 'misturar: sem piloto automático', lx, ty, 30, P.pink, '#ffffff', win(c6.a + 0.4, tDes - 0.3));
      // chapéu-hélice cai
      const cf = prog(T, tAuto, tAuto + 0.8);
      if (T > c5.b && cf < 1) autoCap(c, lx + 4 - cf * 160, 880 - 343 + E.i(cf) * 330 - arc(cf) * 120, T, 0.9, 1 - cf);
    });
    const ss = spring(T, tDes - 0.1, 1.0);
    if (ss > 0) sign(c, 960, lerp(-180, 230, ss), 'DIFICULDADE DESEJÁVEL', 80, { bg: P.violet, fg: P.yellow, ropes: 400, T });
    burst(c, 960, 230, T, tDes + 0.15, P.yellow, 16, 520, 5);
    dust(c, T, 24, 107, '#FFD9A8', { a: 0.3 });
    vignette(c, 0.45);
  },
};

const tConf = at(c8, 'confusão'), tV = at(c9, 'volte'), tP = at(c9, 'peça'), tRd = at(c9, 'reduza'), tGo = c10.a + 0.3;
const C: ShotDef = {
  id: '7C', sec: 7, from: c8.a - 0.35, title: 'Dificuldade não é confusão', color: '#45208A', tr: 'whipR',
  desc: 'Um paredão liso e impossível (a câmera sobe para mostrar a altura). Lumi bate e fica tonta: isso é confusão, não dificuldade. Então volta à explicação com a Dra. Íris, vê um exemplo, o paredão vira degraus — e ela sobe de novo, sozinha.',
  cam: 'Tilt vertical revelando o paredão; depois plano geral e acompanhamento da subida', cast: 'Lumi, Dra. Íris', sfxNote: 'impacto no paredão, tontura, quadro de explicação, blocos virando degraus, saltos',
  sfx: [[c8.a + 0.3, 'whoosh', 0.5], [tConf, 'thud', 0.9], [tConf + 0.2, 'buzz', 0.5], [tV, 'pop', 0.6], [tP, 'page', 0.6], [tRd, 'mech', 0.7], [tRd + 0.5, 'thud', 0.6], ...[0, 1, 2, 3].map((i) => [tGo + i * 0.42, 'zip', 0.4]), [tGo + 1.9, 'chime', 0.8], [tGo + 2.0, 'sparkle', 0.7]],
  draw(c, T) {
    const cm0 = camK(T, [[c8.a - 0.35, 960, 540, 1.02], [c8.a + 0.5, 1000, -260, 1.0], [tConf - 0.3, 1000, -260, 1.0], [tConf + 0.2, 960, 540, 1.02], [tGo, 960, 520, 1.02], [c10.b + 0.6, 1100, 420, 1.12]]);
    const cm = shake(cm0, T, tConf, 22, 0.5);
    dusk(c, cm, T, 2000);
    const red = tw(T, tRd, tRd + 0.9, E.io);
    layer(c, cm, 1, () => {
      c.fillStyle = '#2A1470';
      c.fillRect(-900, 880, 3800, 700);
      // paredão → degraus
      for (let i = 0; i < 5; i++) {
        const x = 1100 + i * 150, top = lerp(-1500, 760 - i * 110, red);
        box(c, x, top, 152, 2400, 14, i % 2 ? '#1B0D55' : '#211060');
        box(c, x, top, 152, 20 * red, 10, '#6A35B0');
      }
      box(c, 1850, lerp(-1500, 320, red), 700, 2400, 14, '#1B0D55');
      // tijolos: o paredão precisa ler como paredão (some quando vira degraus)
      if (red < 0.6) {
        const ba = 0.16 * (1 - red / 0.6);
        for (let r = 0; r < 26; r++) {
          const yy = 860 - r * 90;
          line(c, 1104, yy, 2546, yy, al('#ffffff', ba), 4);
          for (let k = 0; k < 9; k++) {
            const xx = 1104 + ((k + (r % 2) * 0.5) * 1442) / 9;
            if (xx < 2546) line(c, xx, yy, xx, yy - 90, al('#ffffff', ba * 0.8), 4);
          }
        }
        glow(c, 1500, -200, 700, P.pink, 0.12 * (1 - red));
      }
      tag(c, 'confusão ≠ dificuldade', 620, 420, 28, P.pink, '#ffffff', pop(T, tConf + 0.3, 0.4) * (1 - tw(T, tV, tV + 0.4)));
      // quadro de explicação + exemplo
      const es = pop(T, tV, 0.45);
      if (es > 0) {
        owl(c, IRIS, { x: 250, y: 880, s: 0.95 * es, t: T, seed: 3, face: 0.35, mood: 'happy', wr: 2.0, look: [0.6, -0.2] });
        c.save();
        c.translate(560, 560);
        c.scale(es, es);
        box(c, -170, -130, 340, 250, 22, '#F4F7FF');
        for (let i = 0; i < 3; i++) {
          idea(c, i, -100 + i * 100, -60, 24, { g: 0 });
          if (i < 2) arrow(c, -68 + i * 100, -60, -34 + i * 100, -60, P.violet, 5);
        }
        txt(c, 'explicação', 0, -108, 18, P.violet, { w: 700 });
        const ex = pop(T, tP, 0.4);
        box(c, -130, 6, 260 * ex, 86, 14, P.yellow);
        txt(c, 'exemplo resolvido', 0, 50, 22, P.violet, { w: 800, a: ex });
        c.restore();
      }
      // Lumi: bate, fica tonta, volta, sobe sozinha
      const hit = prog(T, tConf - 0.35, tConf), dz = T > tConf && T < tV;
      let lx = lerp(700, 1040, E.i(hit)) - (T > tConf ? tw(T, tConf, tConf + 0.4, E.o) * 160 : 0), ly = 880, hp = 0;
      if (T > tV) lx = lerp(880, 800, tw(T, tV, tV + 0.6));
      if (T > tRd + 0.9) lx = lerp(800, 1000, tw(T, tRd + 0.9, tGo));
      for (let i = 0; i < 5; i++) {
        const u = prog(T, tGo + i * 0.42, tGo + i * 0.42 + 0.4);
        if (u > 0) {
          lx = lerp(i === 0 ? 1000 : 1176 + (i - 1) * 150, 1176 + i * 150, E.io(u));
          ly = lerp(i === 0 ? 880 : 760 - (i - 1) * 110, 760 - i * 110, E.o(u));
          hp = arc(u) * 90;
        }
      }
      const top = T > tGo + 2.0;
      owl(c, LUMI, { x: lx, y: ly, hop: hp, s: 0.95, t: T, seed: 1, face: T > tV && T < tRd ? -0.45 : 0.5, mood: top ? 'happy' : dz ? 'dizzy' : T > tGo ? 'effort' : T > tV ? 'focus' : 'worried', sq: 0.25 * arc(prog(T, tConf, tConf + 0.3)), tilt: dz ? Math.sin(T * 5) * 0.14 : 0, wl: top ? 2.6 : hp > 0 ? 2.2 : 0.2, wr: top ? 2.6 : hp > 0 ? 2.2 : 0.2, walk: (T > tRd + 0.9 && T < tGo) || (T > tV && T < tV + 0.6) ? T * 2.5 : undefined, look: T < tConf ? [0.5, -0.8] : undefined });
      if (dz) for (let i = 0; i < 3; i++) circ(c, lx + Math.cos(T * 5 + i * 2.1) * 80, 880 - 330 + Math.sin(T * 5 + i * 2.1) * 20, 9, P.yellow);
      burst(c, 1776, 250, T, tGo + 2.0, P.yellow, 14, 260, 6);
      tag(c, 'de novo — sem ajuda', 1500, 200, 26, P.yellow, P.violet, pop(T, tGo + 2.0, 0.4));
    });
    dust(c, T, 24, 109, '#FFD9A8', { a: 0.3 });
    vignette(c, 0.45);
  },
};
export const S7: ShotDef[] = [A, B, C];
export { cross as _c, hash as _h, W as _w };
