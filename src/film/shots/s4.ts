// SEÇÃO 4 — O efeito do espaçamento. Domínio: roxo do entardecer com horizonte laranja.
// Os planos 4A e 4B (refino do ambiente e da animação) estão em ./s4ab.ts; aqui ficam 4C e 4D, inalterados.
import { W, P, E, lerp, tw, pop, prog, k1, arc, al, bg, layer, camK, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, ring, ell, cross, check, spark, mix, poly, bez } from '../core';
import { owl, LUMI } from '../owl';
import { flag, roomBack, sweat, zzz } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';
import { TAU, clamp, qb, pulse } from '../core';
import { wob, hit, moodK, camS } from '../fx';
import { A4, B4 } from './s4ab';

const c4 = q(4, 4), c5 = q(4, 5), c6 = q(4, 6);

const tPoof = at(c4, 'mágico') + 0.45, tF = [at(c5, 'depende'), at(c5, 'quanto') + 0.2, at(c5, 'guardar')];
const C: ShotDef = {
  id: '4C', sec: 4, from: c4.a - 0.35, title: 'Não existe intervalo mágico', color: '#243CDB', tr: 'band', trc: P.royal,
  desc: 'Uma ampulheta "mágica" some numa nuvem. Em seguida, uma linha do tempo elástica: quanto mais longe a bandeira ("lembrar até…"), mais as sessões se afastam umas das outras.',
  cam: 'Plano frontal; pan suave acompanhando a bandeira', cast: 'Lumi', sfxNote: 'brilho mágico, puf, elástico esticando, pontos se reposicionando',
  sfx: [[c4.a + 0.1, 'sparkle', 0.6], [tPoof, 'buzz', 0.5], [tPoof + 0.05, 'bubble', 0.8], [c5.a, 'pop', 0.6], [tF[1], 'zip', 0.6], [tF[1] + 0.6, 'tick', 0.5], [tF[2], 'zip', 0.6], [tF[2] + 0.6, 'ding', 0.6]],
  draw(c, T) {
    const F = k1(T, [[c5.a, 820], [tF[1], 820], [tF[1] + 0.7, 1240], [tF[2], 1240], [tF[2] + 0.7, 1660]], E.io);
    const cm = camK(T, [[c4.a - 0.35, 960, 540, 1.1], [c5.a, 960, 540, 1.04], [c5.b + 0.4, 1000, 540, 1]]);
    bg(c, '#2A44E0', '#1D2AA8', '#141A70');
    layer(c, cm, 0.4, () => {
      for (let i = 0; i < 7; i++) ring(c, 960, 520, 160 + i * 150, al('#ffffff', 0.05), 3);
      glow(c, 960, 500, 800, P.sky, 0.14);
    });
    layer(c, cm, 1, () => {
      c.fillStyle = '#0E1466';
      c.fillRect(-600, 900, W + 1200, 600);
      const gone = tw(T, tPoof, tPoof + 0.25), tl = tw(T, c5.a - 0.2, c5.a + 0.4);
      // ampulheta mágica
      if (gone < 1) {
        c.save();
        c.translate(960, 560);
        c.scale(1 - gone, 1 - gone);
        c.rotate(Math.sin(T * 2) * 0.05);
        glow(c, 0, 0, 260, P.yellow, 0.5);
        box(c, -80, -150, 160, 26, 10, P.yellow);
        box(c, -80, 124, 160, 26, 10, P.yellow);
        poly(c, [-62, -124, 62, -124, 8, 0, 62, 124, -62, 124, -8, 0], al('#BFEFFF', 0.4), 6);
        poly(c, [-40, -90, 40, -90, 4, -8, -4, -8], P.pink);
        poly(c, [-52, 122, 52, 122, 0, 70], P.pink);
        c.restore();
        for (let i = 0; i < 6; i++) spark(c, 960 + Math.cos(T * 1.2 + i) * 210, 560 + Math.sin(T * 1.2 + i * 1.3) * 190, 14 * (1 - gone), P.yellow, T);
        tag(c, 'INTERVALO MÁGICO', 960, 330, 28, P.yellow, P.violet, pop(T, c4.a + 0.1, 0.4) * (1 - tl));
      }
      const pf = prog(T, tPoof, tPoof + 0.8);
      if (pf > 0 && pf < 1) for (let i = 0; i < 7; i++) circ(c, 960 + Math.cos(i) * pf * 190, 560 + Math.sin(i * 1.7) * pf * 150, 60 * (1 - pf) + 10, al('#E3EAFF', 1 - pf));
      cross(c, 960, 560, 200, P.pink, prog(T, tPoof + 0.1, tPoof + 0.45) * (1 - tl));

      // linha do tempo elástica
      if (tl > 0) {
        c.save();
        c.globalAlpha = tl;
        line(c, 260, 640, F, 640, al('#ffffff', 0.5), 8);
        circ(c, 260, 640, 22, '#ffffff');
        txt(c, 'hoje', 260, 700, 24, '#ffffff', { w: 700 });
        for (let i = 0; i < 5; i++) {
          const Fi = k1(T - i * 0.07, [[c5.a, 820], [tF[1], 820], [tF[1] + 0.7, 1240], [tF[2], 1240], [tF[2] + 0.7, 1660]], E.back);
          const x = 260 + ((i + 1) / 6) * (Fi - 260);
          glow(c, x, 640, 60, P.teal, 0.5);
          idea(c, i, x, 640, 22, { g: 0 });
        }
        flag(c, F, 660, 210, P.pink, T, 1);
        tag(c, F < 1000 ? 'DIAS' : F < 1500 ? 'SEMANAS' : 'MESES', F, 720, 28, P.yellow, P.violet, 1);
        tag(c, 'lembrar até…', F, 400, 24, al('#ffffff', 0.16), '#ffffff', 1);
        c.restore();
        const mv = [tF[1], tF[2]].some((t0) => T > t0 && T < t0 + 0.7);
        owl(c, LUMI, { x: F + 130, y: 900, s: 1.0 * tl, t: T, seed: 1, face: mv ? 0.5 : -0.3, mood: mv ? 'effort' : 'happy', walk: mv ? T * 2.6 : undefined, wl: 2.0, look: [-0.4, -0.6] });
      }
    });
    dust(c, T, 24, 73, '#ffffff', { a: 0.25 });
    vignette(c, 0.42);
  },
};

const CELLS = [[0, 1], [0, 5], [1, 3], [2, 1], [2, 6], [3, 3]];
const cx = (col: number) => 596 + col * 90, cy = (row: number) => 306 + row * 116;
const tRe = at(c6, 'reencontrar'), tDias = at(c6, 'dias'), tMar = at(c6, 'única'), tProva = at(c6, 'prova'), tSemn = at(c6, 'semanas');
const tSes = CELLS.map((_, i) => lerp(tRe, tDias + 0.5, i / 5));
const IDX = CELLS.map(([r, k]) => r * 7 + k), EXAM = 26;
const cell = (i: number): [number, number] => [cx(i % 7), cy(Math.floor(i / 7))];
/** "hoje": avança de dia em dia e PARA em cada sessão — o deslocamento é o tempo passando entre elas */
const dayAt = (T: number) => k1(T, [[tRe - 0.45, 0], ...IDX.map((d, i) => [tSes[i], d]), [tDias + 0.9, EXAM]]);
const todayAt = (T: number): [number, number] => {
  const d = dayAt(T), d0 = Math.min(EXAM - 1, Math.floor(d)), f = clamp(d - d0), [ax, ay] = cell(d0), [bx, by] = cell(d0 + 1);
  return [lerp(ax, bx, E.io(f)), lerp(ay, by, E.io(f)) - arc(f) * (ay === by ? 16 : 44)];
};
const D: ShotDef = {
  id: '4D', sec: 4, from: c6.a - 0.4, title: 'Uma prova daqui a semanas', color: '#2A1478', tr: 'whipR',
  desc: 'Calendário de parede (página escura, moldura clara) no quarto. A prova está marcada semanas à frente. A pilha da "maratona" da véspera é riscada; no lugar, o marcador "hoje" salta de dia em dia e para em sessões curtas, ligadas por um fio de luz que engrossa até a prova. Lá fora, os dias passam.',
  cam: 'Push-in lento que acompanha o marcador descendo pelas semanas', cast: 'Lumi', sfxNote: 'estrela da prova, adesivos das sessões, linha de luz, risco na maratona',
  sfx: [[at(c6, 'prova'), 'pop', 0.7], [at(c6, 'semanas'), 'buzz', 0.4], ...tSes.map((t0) => [t0, 'pop', 0.55]), [tDias + 0.9, 'chime', 0.7], [tMar, 'zip', 0.5], [tMar + 0.4, 'tick', 0.6]],
  draw(c, T) {
    const cm = camS(T, [[c6.a - 0.4, 960, 540, 1.02], [tRe, 905, 470, 1.12], [tDias + 0.9, 950, 560, 1.22], [c6.b + 0.5, 940, 520, 1.18]]);
    const d = dayAt(T), [tx, ty] = todayAt(T), arrive = tw(T, tDias + 0.9, tDias + 1.2);
    // lá fora o céu cicla (um dia/noite por semana percorrida) e termina no anoitecer do plano seguinte
    const sky = lerp(0.04 + 0.9 * (0.5 - 0.5 * Math.cos((TAU * d) / 7)), 0.42, tw(T, tDias + 1.0, c6.b));
    roomBack(c, cm, T, { day: sky, dark: 0.12 + 0.18 * (1 - Math.abs(sky - 0.5) * 2) });
    layer(c, cm, 1, () => {
      c.save();
      c.translate(858, 70);
      c.rotate(0.022 * wob(T, c6.a - 0.4, 5, 1.5));
      c.translate(-858, -70);
      // prego, cordão, sombra na parede e espessura: o calendário se descola do fundo
      line(c, 858, 70, 610, 136, al('#DCE6FF', 0.55), 4);
      line(c, 858, 70, 1106, 136, al('#DCE6FF', 0.55), 4);
      circ(c, 858, 70, 10, P.yellow);
      box(c, 534, 160, 696, 610, 30, 'rgba(2,3,30,0.42)');
      box(c, 510, 142, 696, 610, 30, '#070A3A');
      // moldura clara + página escura: tudo o que se anima por dentro é luminoso e salta à vista
      box(c, 510, 130, 696, 610, 30, '#F4F7FF');
      box(c, 524, 216, 668, 510, 18, '#0D1157');
      box(c, 510, 130, 696, 86, 30, P.pink);
      box(c, 510, 180, 696, 36, 0, P.pink);
      box(c, 524, 136, 668, 10, 5, al('#ffffff', 0.28));
      box(c, 510, 212, 696, 6, 0, '#B02A78');
      for (let i = 0; i < 6; i++) {
        circ(c, 572 + i * 114, 152, 10, '#5A1040');
        box(c, 565 + i * 114, 104, 14, 50, 7, '#DCE6FF');
      }
      ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].forEach((dd, i) => txt(c, dd, cx(i), 180, 30, '#ffffff', { w: 800 }));
      // "daqui a semanas": as quatro semanas se destacam em sequência
      for (let r = 0; r < 4; r++) box(c, 548, cy(r) - 55, 620, 110, 18, al('#8CAAF7', 0.3 * pulse(T, tSemn + r * 0.13, 0.55)));
      // células: estrutura calma, de baixa saturação; os dias que já passaram escurecem e ganham uma lua
      for (let i = 0; i < 28; i++) {
        const [x, y] = cell(i), k = i % 7, pass = clamp(d - i), ses = IDX.includes(i), base = mix(k > 4 ? '#2B2390' : '#1E2A9E', '#141A66', 0.6 * pass);
        box(c, x - 39, y - 50, 78, 100, 14, base);
        box(c, x - 39, y - 50, 78, 6, 3, al('#ffffff', 0.12 * (1 - pass)));
        txt(c, String(i + 1), x - 22, y - 32, 15, al('#B9C6FF', 0.9 - 0.45 * pass), { w: 700 });
        if (pass > 0.3 && !ses && i < EXAM && i !== 25) {
          circ(c, x + 4, y + 12, 11 * clamp(pass * 1.6), al('#8CAAF7', 0.6));
          circ(c, x + 9, y + 7, 10 * clamp(pass * 1.6), base);
        }
      }
      // página do mês anterior virando para cima
      const pf = tw(T, c6.a - 0.35, c6.a + 0.4);
      if (pf < 1) {
        c.save();
        c.globalAlpha *= 1 - pf * pf;
        c.translate(0, 216);
        c.transform(1, 0, -0.03 * Math.sin(pf * Math.PI), 1 - pf, 0, 0);
        box(c, 524, 0, 668, 510, 18, '#3A46C8');
        for (let i = 0; i < 28; i++) box(c, cx(i % 7) - 39, cy(Math.floor(i / 7)) - 266, 78, 100, 14, al('#ffffff', 0.1));
        c.restore();
      }
      // maratona da véspera: uma pilha que não cabe no dia
      const cram = pop(T, tSemn, 0.4), ghost = tw(T, tRe - 0.2, tRe + 0.3) * (1 - tw(T, tMar - 0.35, tMar - 0.05)), dead = tw(T, tMar + 0.4, tMar + 0.8);
      if (cram > 0) {
        const [mx, my] = cell(25), sh = Math.sin(T * 30) * 3 * (1 - ghost) * (1 - dead), ks = cram * lerp(1, 0.8, ghost);
        c.save();
        c.globalAlpha *= lerp(1, 0.32, ghost) * (1 - dead * 0.6);
        c.translate(mx + sh, my + 50);
        c.scale(ks, ks * (1 - 0.45 * dead));
        box(c, -39, -100, 78, 100, 14, P.pink);
        for (let b = 0; b < 6; b++) box(c, -30 + (b % 2) * 8 + Math.sin(T * 9 + b) * b * 0.8 * (1 - ghost), -118 - b * 17, 56, 14, 5, [P.yellow, '#F4F7FF', P.orange][b % 3]);
        txt(c, 'MARATONA', 0, -34, 12, '#ffffff', { w: 800 });
        c.restore();
        cross(c, mx, my - 30, 120, '#0D1157', prog(T, tMar + 0.2, tMar + 0.55));
        cross(c, mx, my - 30, 104, '#F4F7FF', prog(T, tMar + 0.2, tMar + 0.55));
      }
      // fio de luz entre as sessões: engrossa a cada reencontro e leva um pulso adiante
      const seg = (i: number): number[] => {
        const [ax, ay] = cell(i < IDX.length ? IDX[i - 1] : IDX[IDX.length - 1]), [bx, by] = cell(i < IDX.length ? IDX[i] : EXAM);
        return [ax, ay, (ax + bx) / 2, Math.min(ay, by) - 74, bx, by];
      };
      for (let i = 1; i <= IDX.length; i++) {
        const p = i < IDX.length ? prog(T, tSes[i] - 0.3, tSes[i]) : prog(T, tDias + 0.5, tDias + 0.9);
        if (p <= 0) continue;
        const s = seg(i);
        bez(c, s[0], s[1], s[2], s[3], s[4], s[5], '#070A3A', 13 + i, p);
        bez(c, s[0], s[1], s[2], s[3], s[4], s[5], '#FFE9A8', 5 + i, p);
        if (p >= 1) {
          const [gx, gy] = qb(s[0], s[1], s[2], s[3], s[4], s[5], (T * 0.55 + i * 0.21) % 1);
          glow(c, gx, gy, 46, P.yellow, 0.7);
          circ(c, gx, gy, 6, '#ffffff');
        }
      }
      // sessões: adesivos com sombra, pousando com squash
      CELLS.forEach(([r, k], i) => {
        const s = pop(T, tSes[i], 0.45);
        if (s <= 0) return;
        const land = 1 + 0.22 * hit(T, tSes[i], 20, 8), rp = prog(T, tSes[i], tSes[i] + 0.5);
        glow(c, cx(k), cy(r), 110, P.teal, 0.3 + 0.12 * Math.sin(T * 3 + i));
        box(c, cx(k) - 33 * s + 6, cy(r) - 42 * s + 9, 72 * s, 92 * s, 14, 'rgba(2,3,30,0.5)');
        c.save();
        c.translate(cx(k), cy(r));
        c.scale(s * land, s / land);
        box(c, -36, -46, 72, 92, 14, P.teal);
        box(c, -36, -46, 72, 24, 14, '#8AF2F0');
        check(c, 0, 10, 42, '#0B1F66', prog(T, tSes[i] + 0.1, tSes[i] + 0.35));
        c.restore();
        if (rp > 0 && rp < 1) ring(c, cx(k), cy(r), 42 + rp * 56, al('#ffffff', 1 - rp), 5 * (1 - rp) + 1);
      });
      // dia da prova
      const ps = pop(T, tProva, 0.5), [ex, ey] = cell(EXAM), ek = 1 + 0.14 * hit(T, tProva, 16, 6) + 0.1 * hit(T, tDias + 0.9, 16, 5);
      glow(c, ex, ey, 130 + 50 * arrive, P.yellow, 0.3 + 0.35 * arrive * (0.75 + 0.25 * Math.sin(T * 4)));
      c.save();
      c.translate(ex, ey);
      c.scale(ek, ek);
      box(c, -39, -50, 78, 100, 14, P.yellow);
      box(c, -39, -50, 78, 24, 14, '#FFE9A8');
      spark(c, 0, -6, 30 * ps, P.orange, T);
      txt(c, 'PROVA', 0, 34, 14, P.violet, { w: 800, a: ps });
      c.restore();
      for (let i = 0; i < 5; i++) spark(c, ex + Math.cos(T * 2 + i * 1.257) * 72, ey + Math.sin(T * 2 + i * 1.257) * 72, 10 * arrive, '#ffffff', T * 3);
      burst(c, ex, ey, T, tDias + 0.9, P.yellow, 12, 200, 4);
      // marcador "hoje"
      const ta = tw(T, tRe - 0.45, tRe - 0.2) * (1 - tw(T, tDias + 1.3, tDias + 1.7));
      if (ta > 0) {
        glow(c, tx, ty, 90, '#ffffff', 0.35 * ta);
        ring(c, tx, ty, 34 + 2 * Math.sin(T * 6), al('#070A3A', ta), 11);
        ring(c, tx, ty, 34 + 2 * Math.sin(T * 6), al('#ffffff', ta), 5);
        tag(c, 'hoje', tx, ty - 66, 16, '#ffffff', P.violet, ta);
      }
      c.restore();
      // Lumi acompanha o marcador com o olhar e a asa
      const hop = tSes.reduce((a, t0) => a + arc(prog(T, t0, t0 + 0.3)), 0) + 2.2 * arc(prog(T, tDias + 0.9, tDias + 1.4));
      const land = tSes.reduce((a, t0) => a + Math.max(0, hit(T, t0 + 0.3, 20, 10)), 0);
      const point = tw(T, tRe - 0.2, tRe + 0.25) * (1 - tw(T, tMar - 0.3, tMar));
      owl(c, LUMI, {
        x: 1420, y: 905, s: 1.1, t: T, seed: 1, face: -0.35, hop: hop * 22, sq: 0.1 * land,
        ...moodK(T, [[0, 'neutral'], [tSemn, 'worried'], [tRe, 'happy'], [tDias + 0.9, 'proud'], [tMar - 0.25, 'worried'], [tMar + 0.55, 'happy']], 0.3),
        wl: lerp(0.2, 2.55 - (ty - 306) / 620, point) + 2.4 * arc(prog(T, tDias + 0.9, tDias + 1.4)) * 0.2, wr: 0.15 + 2.3 * arc(prog(T, tDias + 0.9, tDias + 1.4)),
        look: T > tRe - 0.3 && T < tMar - 0.3 ? [clamp((tx - 1420) / 620, -1, 1), clamp((ty - 640) / 380, -1, 1)] : [-0.6, T > tMar - 0.3 ? 0.35 : -0.2],
        tilt: 0.04 + 0.13 * wob(T, tMar + 0.05, 17, 4),
      });
      if (T > tSemn && T < tRe) sweat(c, 1440, 610, T);
    });
    dust(c, T, 22, 75, '#ffffff', { a: 0.22 });
    vignette(c, 0.5);
  },
};
export const S4: ShotDef[] = [A4, B4, C, D];
export { ell as _e, zzz as _z };
