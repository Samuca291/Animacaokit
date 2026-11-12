// SEÇÃO 4, planos 4A e 4B — o efeito do espaçamento.
// 4A: duas trilhas no entardecer (passarela de cima, caminho de baixo), com lanternas que medem a memória ao
// longo dos dias e uma torre-farol do "longo prazo". 4B: o interior dessa torre — o arquivo dos experimentos.
import { Ctx, W, P, KCOL, E, clamp, lerp, tw, pop, prog, hash, arc, al, mix, bg, layer, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, ring, ell, ridge, spring, stars, bez, qb, cloud, pulse, poly, lg, spark } from '../core';
import { owl, LUMI, NILO, IRIS } from '../owl';
import { book, sign, sweat, zzz } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';
import { wob, hit, win, moodK, camS } from '../fx';

const c1 = q(4, 1), c2 = q(4, 2), c3 = q(4, 3);

/** lanterna da trilha (e do arquivo): k = brilho 0..1 */
function lantern(c: Ctx, x: number, y: number, s: number, k: number, col: string) {
  const on = clamp(k);
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  if (on > 0.03) glow(c, 0, 0, 80 + 60 * on, col, 0.75 * on);
  box(c, -11, -25, 22, 8, 3, '#150B55');
  box(c, -14, -18, 28, 36, 9, mix('#2A1D6E', col, 0.25 + 0.75 * on));
  box(c, -8, -12, 7, 24, 3, al('#ffffff', 0.12 + 0.45 * on));
  box(c, -11, 17, 22, 7, 3, '#150B55');
  c.restore();
}
/** bloco de estudo: a unidade de "esforço" (as duas personagens têm exatamente os mesmos seis) */
function blk(c: Ctx, x: number, y: number, j: number, sq = 0, rot = 0, s = 1) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(s * (1 + sq), s * (1 - sq));
  box(c, -21, -18, 42, 36, 9, KCOL[j % 3]);
  box(c, -21, -18, 42, 10, 5, al('#ffffff', 0.3));
  c.restore();
}

/* ---------- 4A ---------- */
const DX = (d: number) => 380 + (d - 1) * 230, POST = (d: number) => DX(d) + 90;
const TOPY = 430, BOTY = 830, TWR = 2010;
const tIn = c1.a - 0.5, tStack = at(c1, 'tudo'), tPan = at(c1, 'costuma'), tPior = at(c1, 'pior'), tLongo = at(c1, 'longo');
const tHop = [at(c1, 'estudar'), at(c1, 'distribuir'), at(c1, 'esforço'), at(c1, 'separadas')];
const tLand = [0, tHop[1] + 0.55, tHop[2] + 0.55, tHop[3] + 0.55];
const SX = [1, 3, 5, 7].map((d) => DX(d) - 40);
// Lumi deixa 2 blocos por sessão (dias 1, 3 e 5): 2 + 2 + 2 = os mesmos 6 que Nilo empilha de uma vez
const LDROP = [tStack, tStack + 0.26, tLand[1] + 0.08, tLand[1] + 0.24, tLand[2] + 0.08, tLand[2] + 0.24];
const NDROP = Array.from({ length: 6 }, (_, j) => tStack + j * 0.13);
const CAM4A = [[c1.a - 0.7, 560, 578, 1.3], [c1.a + 2.2, 600, 572, 1.24], [tStack + 0.5, 610, 566, 1.22], [tPan + 1.6, 1130, 560, 1.0], [tLongo + 0.7, 1180, 560, 1.0], [tHop[1] + 0.3, 960, 620, 1.12], [tHop[2] + 0.45, 1240, 640, 1.18], [tHop[3] + 0.55, 1660, 620, 1.2], [c2.a + 0.5, 1260, 520, 1.0], [c3.a - 0.1, 1300, 518, 1.03]];

const niloPos = (t: number): [number, number] => [lerp(40, DX(1) - 56, tw(t, tIn, c1.a + 2.2, E.o)), 0];
function lumiPos(t: number): [number, number] {
  let x = lerp(60, SX[0], tw(t, tIn, c1.a + 2.2, E.o)), hop = 0;
  for (let k = 1; k < 4; k++) {
    const u = prog(t, tHop[k], tHop[k] + 0.55);
    if (u > 0) {
      x = lerp(SX[k - 1], SX[k], 0.7 * u + 0.3 * E.sin(u));
      hop = arc(u) * 104;
    }
  }
  return [x, hop];
}
/** bloco que segue a personagem em fila, com atraso (follow-through), até voar para o seu lugar no monte */
function trainBlock(c: Ctx, T: number, j: number, posAt: (t: number) => [number, number], floor: number, drops: number[], slot: number[]) {
  const land = drops[j], fly = prog(T, land - 0.3, land);
  if (fly >= 1) {
    blk(c, slot[0], slot[1], j, 0.2 * hit(T, land, 18, 9));
    return;
  }
  let rank = j;
  for (let i = 0; i < j; i++) rank -= tw(T, drops[i] - 0.3, drops[i]);
  const [ox, oh] = posAt(T - 0.08 * (j + 1)), tx = ox - 62 - rank * 44, ty = floor - 128 - oh * 0.8 + Math.sin(T * 3 + j * 1.3) * 6;
  if (fly <= 0) blk(c, tx, ty, j, 0, Math.sin(T * 2 + j) * 0.08);
  else blk(c, lerp(tx, slot[0], E.io(fly)), lerp(ty, slot[1], E.io(fly)) - arc(fly) * 60, j, 0, (1 - fly) * 1.2);
}

const PK = [1, 0.92, 0.75, 0.55, 0.36, 0.2, 0.08];
/** trilha de cima: um clarão forte que perde fôlego com a distância e se apaga, de longe para perto */
function topL(d: number, T: number) {
  const ton = tPan + 1.5 * (1 - Math.cbrt(1 - (d - 0.5) / 7));
  const off = d === 1 ? tLongo + 1.0 : lerp(tLongo + 0.75, tPior + 0.4, (d - 2) / 5), die = tw(T, off - 0.4, off);
  return PK[d - 1] * tw(T, ton, ton + 0.12) * (1 - (d === 1 ? 0.7 : 1) * die) * (die > 0 && die < 1 ? 0.7 + 0.3 * Math.sin(T * 44 + d) : 1);
}
/** trilha de baixo: cada reencontro reacende o que já existia e leva a luz mais longe */
function botL(d: number, T: number) {
  const s0 = (d === 1 ? 0.6 : d === 2 ? 0.34 : 0) * tw(T, tPan + (d - 1) * 0.12, tPan + 0.2 + (d - 1) * 0.12) * (1 - 0.55 * tw(T, tPan + 1.2, tPan + 2.8));
  const st = (k: number, upTo: number, lvl: number, nxt: number) => (d <= upTo ? lvl : d === upTo + 1 ? nxt : 0) * tw(T, tLand[k] + Math.abs(d - upTo) * 0.04, tLand[k] + 0.22 + Math.abs(d - upTo) * 0.04);
  return Math.max(s0, st(1, 3, 0.8, 0.4), st(2, 5, 1, 0.5), st(3, 7, 1, 1));
}

export const A4: ShotDef = {
  id: '4A', sec: 4, from: c1.a - 0.45, title: 'Maratona × sessões separadas', color: '#6535A8', tr: 'whipU', trc: P.purple,
  desc: 'Entardecer. Nilo (passarela de cima) e Lumi (caminho de baixo) chegam ao dia 1 seguidos pelos mesmos seis blocos de estudo. Nilo empilha tudo de uma vez: o clarão corre pelas lanternas, perde fôlego e se apaga antes da torre do longo prazo. Lumi deixa dois blocos por sessão e salta para os dias 3 e 5: a cada pouso o cabo engrossa e a luz vai mais longe, até acender o farol.',
  cam: 'Plano próximo no dia 1, recuo que revela a trilha inteira, travelling acompanhando os saltos e plano geral final', cast: 'Nilo, Lumi', sfxNote: 'blocos empilhando, clarão, saltos e pousos, cabo energizando, farol, placa',
  sfx: [...Array.from({ length: 6 }, (_, i) => [tStack + i * 0.13, 'thud', 0.45]), [tPan, 'whoosh', 0.5], [tHop[1], 'zip', 0.5], [tHop[1] + 0.55, 'ding', 0.5], [tHop[2], 'zip', 0.5], [tHop[2] + 0.55, 'ding', 0.55], [tHop[3], 'zip', 0.5], [tHop[3] + 0.55, 'chime', 0.7], [c2.a + 0.15, 'thud', 0.7], [c2.a + 0.3, 'sparkle', 0.7]],
  draw(c, T) {
    const cm = camS(T, CAM4A), on3 = tw(T, tLand[3], tLand[3] + 0.25), fade = 1 - tw(T, c2.a - 0.3, c2.a + 0.2);
    bg(c, '#2B1680', '#7A35A6', '#FF7A45');
    layer(c, cm, 0.1, () => {
      stars(c, T, 70, 61, -300, -80, 2500, 420, '#ffffff', 0.7);
      glow(c, 1180, 860, 900, P.orange, 0.42);
      circ(c, 1180, 880, 165, '#FFD27A');
    });
    layer(c, cm, 0.2, () => {
      for (let i = 0; i < 5; i++) cloud(c, ((i * 560 + T * (5 + i * 2)) % 2900) - 300, 250 + (i % 3) * 110, 1.1 + (i % 2) * 0.5, al(i % 2 ? '#FF9A6B' : '#D07AD8', 0.3));
    });
    layer(c, cm, 0.32, () => ridge(c, 4, 800, 170, '#5A2A98', -400, 3200, 80));
    layer(c, cm, 0.55, () => ridge(c, 7, 900, 130, '#3D1D82', -400, 3400, 70));
    layer(c, cm, 0.78, () => {
      ridge(c, 9, 985, 70, '#2A1470', -400, 3400, 60, 1.5);
      for (let i = 0; i < 16; i++) {
        const fx = hash(i * 3.1) * 2700 - 100 + Math.sin(T * 0.6 + i) * 30, fy = 560 + hash(i * 5.7) * 330 + Math.sin(T * 0.9 + i * 2) * 18;
        glow(c, fx, fy, 22, P.yellow, 0.5 * (0.5 + 0.5 * Math.sin(T * 2.2 + i * 1.7)));
      }
    });
    layer(c, cm, 1, () => {
      // chão e caminho de baixo
      c.fillStyle = lg(c, 0, BOTY, 0, BOTY + 500, [0, '#23126B', 1, '#150A4C']);
      c.fillRect(-900, BOTY + 10, 4400, 800);
      box(c, -900, BOTY, 4400, 18, 9, '#5234B8');
      box(c, -900, BOTY, 4400, 6, 3, al('#ffffff', 0.14));
      // passarela de cima sobre estacas: cada estaca marca a virada de um dia
      for (let d = 0; d <= 7; d++) {
        const x = DX(d) + 115;
        box(c, x - 6, TOPY + 10, 12, BOTY - TOPY, 4, '#2A1670');
        box(c, x - 6, TOPY + 10, 4, BOTY - TOPY, 2, al('#ffffff', 0.06));
      }
      box(c, -900, TOPY, TWR + 900, 18, 6, '#4A2C9E');
      box(c, -900, TOPY, TWR + 900, 5, 2, al('#ffffff', 0.16));
      for (let x = -880; x < TWR; x += 46) box(c, x, TOPY + 6, 3, 12, 1, al('#150B55', 0.5));
      for (let d = 1; d <= 7; d++) {
        line(c, DX(d), BOTY + 18, DX(d), BOTY + 50, '#2A1670', 6);
        box(c, DX(d) - 50, BOTY + 44, 100, 40, 10, '#F4F7FF');
        txt(c, 'DIA ' + d, DX(d), BOTY + 65, 22, '#2A1478', { w: 800 });
      }
      // torre do longo prazo: uma lâmpada para cada trilha
      box(c, TWR - 86, 150, 172, BOTY - 132, 24, '#1B0E63');
      box(c, TWR - 86, 150, 30, BOTY - 132, 14, al('#ffffff', 0.05));
      poly(c, [TWR - 104, 156, TWR + 104, 156, TWR, 62], '#3D1D82', 10);
      box(c, TWR - 104, 146, 208, 22, 10, '#4A2C9E');
      for (const [ly, on] of [[TOPY - 108, 0], [BOTY - 108, on3]]) {
        circ(c, TWR, ly, 70, '#0E0840');
        if (on > 0) {
          c.save();
          c.globalCompositeOperation = 'lighter';
          for (const sd of [0, Math.PI]) {
            const a = T * 0.9 + sd;
            c.fillStyle = al(P.yellow, 0.09 * on);
            c.beginPath();
            c.moveTo(TWR, ly);
            c.arc(TWR, ly, 430, a - 0.12, a + 0.12);
            c.closePath();
            c.fill();
          }
          c.restore();
          glow(c, TWR, ly, 300, P.yellow, 0.6 * on);
        }
        circ(c, TWR, ly, 58, mix('#241A78', '#FFE27A', on));
        if (on > 0) idea(c, 1, TWR, ly, 34 * pop(T, tLand[3], 0.5), { eyes: true });
        else idea(c, 1, TWR, ly, 30, { hollow: true, col: '#5B4BC8' });
        ring(c, TWR, ly, 64, mix('#3D2BA0', P.yellow, on), 9);
      }
      box(c, TWR - 74, 478, 148, 88, 14, P.yellow);
      txt(c, 'LONGO', TWR, 507, 27, P.violet, { w: 900 });
      txt(c, 'PRAZO', TWR, 540, 27, P.violet, { w: 900 });
      // cabos e lanternas: o brilho é a memória disponível em cada dia
      for (const top of [1, 0]) {
        const fy = top ? TOPY : BOTY, col = top ? P.yellow : P.teal;
        const L = (d: number) => (d > 7 ? (top ? 0 : on3) : top ? topL(d, T) : botL(d, T));
        for (let d = 1; d <= 7; d++) {
          const x0 = POST(d), x1 = d < 7 ? POST(d + 1) : TWR - 66, y0 = fy - 150, y1 = d < 7 ? fy - 150 : fy - 108, my = Math.max(y0, y1) + 34, k = Math.min(L(d), L(d + 1));
          const n = top ? 0 : (d <= 3 ? tw(T, tLand[1], tLand[1] + 0.2) : 0) + (d <= 5 ? tw(T, tLand[2], tLand[2] + 0.2) : 0) + on3;
          bez(c, x0, y0, (x0 + x1) / 2, my, x1, y1, '#150B55', 5);
          if (k > 0.02) {
            bez(c, x0, y0, (x0 + x1) / 2, my, x1, y1, al(col, 0.35 + 0.65 * k), 3 + (2 + 3 * n) * k);
            if (!top && k > 0.9) {
              const [gx, gy] = qb(x0, y0, (x0 + x1) / 2, my, x1, y1, (T * 0.8 + d * 0.37) % 1);
              glow(c, gx, gy, 34, '#ffffff', 0.7);
              circ(c, gx, gy, 5, '#ffffff');
            }
          }
        }
        for (let d = 1; d <= 7; d++) {
          line(c, POST(d), fy, POST(d), fy - 150, '#150B55', 7);
          lantern(c, POST(d), fy - 150, 1, L(d), col);
        }
      }
      // o clarão da maratona correndo pela trilha de cima
      const fp = prog(T, tPan, tPan + 1.1);
      if (fp > 0 && fp < 1) {
        const fx = lerp(DX(1), POST(7), E.o(fp));
        glow(c, fx, TOPY - 150, 130 * (1 - fp), '#ffffff', 0.8 * (1 - fp));
        spark(c, fx, TOPY - 150, 30 * (1 - fp), '#ffffff', T * 8);
      }

      // Nilo: tudo de uma vez
      const sway = wob(T, tStack + 0.78, 7, 1.2) + 0.25 * Math.sin(T * 1.7) * tw(T, tStack + 0.8, tStack + 1.3);
      for (let j = 5; j >= 0; j--) trainBlock(c, T, j, niloPos, TOPY, NDROP, [DX(1) + 36 + (j % 2) * 8 + j * 2.2 * sway, TOPY - 19 - j * 38]);
      const [nx] = niloPos(T), stacking = win(T, tStack - 0.35, tStack + 0.85, 0.12), tired = tw(T, tPior + 0.3, tLongo + 0.8);
      owl(c, NILO, {
        x: nx, y: TOPY, s: 0.74, t: T, seed: 5, face: lerp(0.45, 0.3, tired), walk: T < c1.a + 2.1 ? T * 2.3 : undefined,
        ...moodK(T, [[0, 'neutral'], [tStack - 0.4, 'effort'], [tStack + 0.9, 'proud'], [tPior + 0.2, 'worried'], [tLongo + 0.5, 'sleepy'], [tHop[1] + 0.6, 'asleep']], 0.25),
        wr: 0.2 + stacking * (1.5 + 0.8 * Math.sin(T * 24)), wl: 0.2 + stacking * (1.5 + 0.8 * Math.sin(T * 24 + Math.PI)),
        tilt: 0.06 * stacking + 0.16 * tired, sq: 0.05 * tired, look: [0.7, lerp(-0.2, 0.4, tired)],
      });
      if (stacking > 0.3) sweat(c, nx + 10, TOPY - 205, T);
      if (T > tHop[1] + 0.9) zzz(c, nx + 44, TOPY - 215, T);
      tag(c, 'TUDO DE UMA VEZ', DX(1) + 250, TOPY - 200, 22, P.pink, '#ffffff', pop(T, tStack, 0.4) * fade);

      // Lumi: o mesmo esforço, distribuído
      for (let j = 5; j >= 0; j--) trainBlock(c, T, j, lumiPos, BOTY, LDROP, [DX(1 + 2 * Math.floor(j / 2)) + 30, BOTY - 19 - (j % 2) * 38]);
      for (let k = 1; k < 4; k++) {
        const rp = prog(T, tLand[k], tLand[k] + 0.5);
        if (rp > 0 && rp < 1) ring(c, SX[k] + 20, BOTY - 40, 40 + rp * 90, al('#ffffff', 1 - rp), 5 * (1 - rp) + 1);
      }
      const [lx, lh] = lumiPos(T), up = clamp(lh / 30);
      const ant = tHop.slice(1).reduce((a, t0) => a + pulse(T, t0 - 0.2, 0.2), 0), land = tLand.slice(1).reduce((a, t0) => a + Math.max(0, wob(T, t0, 15, 8)), 0);
      const cheer = win(T, tLand[3] + 0.3, c2.a + 0.4, 0.2);
      owl(c, LUMI, {
        x: lx, y: BOTY, hop: lh + 24 * arc(prog(T, tLand[3] + 0.3, tLand[3] + 0.72)), s: 0.74, t: T, seed: 1, face: 0.5, walk: T < c1.a + 2.1 ? T * 2.3 : undefined,
        ...moodK(T, [[0, 'happy'], [tStack + 0.9, 'neutral'], [tPan + 0.3, 'surprised'], [tPior + 0.5, 'think'], [tHop[1] - 0.25, 'focus'], [tLand[1], 'happy'], [tHop[2] - 0.2, 'focus'], [tLand[2], 'happy'], [tHop[3] - 0.2, 'focus'], [tLand[3], 'proud']], 0.18),
        wl: Math.max(lerp(0.2, 2.4, up), 2.2 * cheer), wr: Math.max(lerp(0.2, 2.4, up), (2.2 + 0.3 * Math.sin(T * 9)) * cheer),
        sq: 0.16 * ant + 0.16 * land - 0.08 * up, look: [0.6, -0.75 * win(T, tStack + 0.2, tHop[1] - 0.3, 0.3)], tilt: -0.05 * win(T, tStack + 0.2, tHop[1] - 0.3, 0.3),
      });
      tag(c, 'EM SESSÕES SEPARADAS', DX(3), BOTY + 116, 22, P.teal, P.violet, pop(T, tHop[1] - 0.4, 0.4) * fade);
      burst(c, TWR, BOTY - 108, T, tLand[3], P.yellow, 12, 220, 3);
    });
    layer(c, cm, 1.45, () => {
      for (let i = 0; i < 48; i++) {
        const gx = -620 + i * 76 + hash(i) * 40, len = 90 + hash(i + 9) * 120, a = -0.25 + hash(i + 3) * 0.5 + Math.sin(T * 1.2 + i) * 0.05;
        poly(c, [gx - 12, 1150, gx + 12, 1150, gx + Math.sin(a) * len, 1150 - Math.cos(a) * len], '#0F0840', 4);
      }
    });
    const ss = spring(T, c2.a + 0.1, 1.0);
    if (ss > 0) sign(c, 960, lerp(-180, 210, ss), 'EFEITO DO ESPAÇAMENTO', 74, { bg: P.violet, fg: P.yellow, ls: lerp(-7, 13, tw(T, c2.a + 0.3, c2.a + 1.5, E.o)), ropes: 400, T });
    dust(c, T, 24, 63, '#FFD9A8', { a: 0.3 });
    vignette(c, 0.45);
  },
};

/* ---------- 4B ---------- */
const tCen = at(c3, 'centenas'), tSep = at(c3, 'separar'), tMos = at(c3, 'mostrou');
const CAM4B = [[c3.a - 0.7, 935, -330, 1.06], [c3.a + 1.0, 950, -60, 1.0], [tCen + 0.9, 966, 350, 1.0], [tSep, 960, 522, 1.08], [c3.b + 0.6, 955, 560, 1.15]];
const BANK = [130, 1270], DW = 104, DH = 64, ROWS = 26, Y0 = -1010;
// cada ficha sai de uma gaveta que está em quadro naquele instante (a câmera desce junto com elas)
const CARDS = Array.from({ length: 72 }, (_, i) => {
  const t0 = lerp(c3.a - 0.1, tSep - 0.75, i / 71), camY = lerp(-330, 520, clamp((t0 - (c3.a - 0.7)) / (tSep - (c3.a - 0.7))));
  return { b: i % 2, col: Math.floor(hash(i * 7.1) * 5), row: clamp(Math.round((camY - 330 + hash(i * 3.3) * 620 - Y0) / DH), 0, ROWS - 1), t0 };
});
const OPEN: Record<number, number> = {};
CARDS.forEach((k) => {
  const key = k.b * 1000 + k.row * 10 + k.col;
  if (OPEN[key] === undefined) OPEN[key] = k.t0;
});
const FLY = 1.15;

export const B4: ShotDef = {
  id: '4B', sec: 4, from: c3.a - 0.4, title: 'Centenas de experimentos', color: '#3A1D8F', tr: 'whipD', trc: P.purple,
  desc: 'Dentro da torre: um fichário altíssimo, iluminado por lanternas, com o mesmo entardecer na janela. A câmera desce enquanto as gavetas se abrem e as fichas dos experimentos voam em curva até o livro-síntese, que folheia sozinho. A Dra. Íris rege o voo e apresenta o resultado no vocabulário do plano anterior: blocos separados, cabo de luz e lanterna acesa.',
  cam: 'Descida vertical em spline com leve deriva lateral e empurrão final na síntese', cast: 'Dra. Íris', sfxNote: 'fichas esvoaçando, livro brilhando, acorde, lanterna acendendo',
  sfx: [[c3.a, 'page', 0.5], [c3.a + 0.5, 'page', 0.5], [c3.a + 1.1, 'page', 0.5], [tCen, 'pop', 0.7], [tCen + 0.8, 'page', 0.5], [tSep, 'chime', 0.7], [tSep + 0.9, 'ding', 0.6]],
  draw(c, T) {
    const cm = camS(T, CAM4B), got = tw(T, c3.a + 0.6, tSep);
    bg(c, '#2A1478', '#1B0E63', '#12093F');
    layer(c, cm, 0.8, () => {
      // janela alta: o mesmo entardecer do plano anterior
      const wx = 790, ww = 340, wy = -700, wh = 760;
      box(c, wx - 22, wy - 22, ww + 44, wh + 44, 190, '#150B55');
      c.save();
      c.beginPath();
      c.moveTo(wx, wy + wh);
      c.lineTo(wx, wy + ww / 2);
      c.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0);
      c.lineTo(wx + ww, wy + wh);
      c.closePath();
      c.clip();
      c.fillStyle = lg(c, 0, wy, 0, wy + wh, [0, '#2B1680', 0.55, '#7A35A6', 1, '#FF7A45']);
      c.fillRect(wx, wy, ww, wh);
      stars(c, T, 22, 77, wx, wy, wx + ww, wy + wh * 0.5, '#ffffff', 0.8);
      glow(c, wx + ww * 0.6, wy + wh - 40, 300, P.orange, 0.55);
      circ(c, wx + ww * 0.6, wy + wh + 10, 90, '#FFD27A');
      ridge(c, 4, wy + wh - 30, 60, '#5A2A98', wx - 20, wx + ww + 20, 40, 2.4);
      c.restore();
      for (let i = 1; i < 3; i++) line(c, wx + (ww * i) / 3, wy + 30, wx + (ww * i) / 3, wy + wh, '#150B55', 10);
      for (let i = 1; i < 4; i++) line(c, wx, wy + (wh * i) / 4, wx + ww, wy + (wh * i) / 4, '#150B55', 10);
      // feixe quente que desce da janela até a mesa
      c.save();
      c.globalCompositeOperation = 'lighter';
      c.fillStyle = lg(c, 0, wy + wh, 0, 900, [0, al('#FFB45A', 0.16), 1, al('#FFB45A', 0)]);
      c.beginPath();
      c.moveTo(wx, wy + wh);
      c.lineTo(wx + ww, wy + wh);
      c.lineTo(wx + ww + 190, 900);
      c.lineTo(wx - 190, 900);
      c.closePath();
      c.fill();
      c.restore();
      for (let i = 0; i < 5; i++) ring(c, 960, 560, 170 + i * 110, al('#ffffff', 0.035), 3);
    });
    layer(c, cm, 1, () => {
      // gaveteiros: as gavetas abrem com antecipação quando a ficha sai
      for (let b = 0; b < 2; b++) {
        const bx = BANK[b];
        box(c, bx - 26, Y0 - 60, 5 * DW + 52, 1790, 18, '#150B55');
        box(c, bx - 26, Y0 - 60, 14, 1790, 7, al('#ffffff', 0.05));
        for (let r = 0; r < ROWS; r++) {
          const y = Y0 + r * DH;
          if (y < cm.y - 700 || y > cm.y + 640) continue;
          for (let k = 0; k < 5; k++) {
            const t0 = OPEN[b * 1000 + r * 10 + k], o = t0 === undefined ? 0 : clamp(win(T, t0 - 0.3, t0 + 1.0, 0.2) + 0.25 * wob(T, t0 - 0.1, 14, 6));
            const x = bx + k * DW + 5, w = DW - 10, hh = DH - 10;
            if (o > 0.02) {
              box(c, x + 3, y + 3, w - 6, 16, 4, '#0B0740');
              for (let i = 0; i < 4; i++) box(c, x + 12 + i * 19, y + 6 - 5 * o, 15, 12, 2, i % 2 ? '#E3EAFF' : P.cream);
            }
            c.save();
            c.translate(x + w / 2, y + hh / 2 + 5 + 9 * o);
            c.scale(1 + 0.07 * o, 1 + 0.07 * o);
            box(c, -w / 2, -hh / 2, w, hh, 8, mix((r + k) % 2 ? '#2A1C8C' : '#2F2298', '#4B3BD0', o));
            box(c, -w / 2, -hh / 2, w, 6, 3, al('#ffffff', 0.1 + 0.2 * o));
            box(c, -26, -15, 52, 15, 3, al('#FFF1D0', 0.75));
            circ(c, 0, 12, 6, P.yellow);
            c.restore();
          }
        }
        // mezaninos com guarda-corpo
        for (const my of [-372, 204]) {
          box(c, bx - 44, my, 5 * DW + 88, 16, 6, '#4433B5');
          box(c, bx - 44, my - 48, 5 * DW + 88, 7, 3, '#3320A0');
          for (let i = 0; i <= 10; i++) line(c, bx - 36 + i * ((5 * DW + 72) / 10), my, bx - 36 + i * ((5 * DW + 72) / 10), my - 46, '#3320A0', 4);
        }
      }
      // escada de correr encostada no gaveteiro da esquerda
      for (const sd of [0, 1]) line(c, 548 + sd * 62, 900, 588 + sd * 62, 210, '#6C4FE0', 8);
      for (let i = 0; i < 11; i++) line(c, 551 + i * 3.36, 850 - i * 58, 613 + i * 3.36, 850 - i * 58, '#6C4FE0', 6);
      // lanternas penduradas (as mesmas da trilha), balançando de leve
      for (const [lx, ly, ph] of [[742, -470, 0], [1178, -250, 2], [742, 120, 4], [1178, 330, 1]]) {
        const sw = Math.sin(T * 1.1 + ph) * 0.05;
        c.save();
        c.translate(lx, ly - 260);
        c.rotate(sw);
        line(c, 0, 0, 0, 236, '#150B55', 4);
        lantern(c, 0, 260, 1.35, 0.85 + 0.15 * Math.sin(T * 3 + ph), P.yellow);
        c.restore();
      }
      // chão, tapete e mesa de leitura
      c.fillStyle = '#0D0740';
      c.fillRect(-600, 900, W + 1200, 700);
      ell(c, 960, 930, 520, 46, '#2A1880');
      ell(c, 960, 930, 430, 34, '#3A26A8');
      box(c, 800, 770, 320, 140, 20, '#2A1880');
      box(c, 760, 760, 400, 30, 15, '#4433B5');
      glow(c, 960, 700, 300 + got * 200, P.yellow, 0.25 + got * 0.35);
      book(c, 960, 762, 2.1, 1, P.pink, { glow: got });
      // o livro folheia enquanto absorve as fichas
      if (T > c3.a + 0.9 && T < tSep + 0.25) {
        const f = ((T - c3.a) * 1.9) % 1, a = Math.PI * f, tx = 960 + Math.cos(a) * 246, ty = Math.sin(a) * 46;
        poly(c, [960, 758, 960, 600, tx, 584 - ty, tx, 728 - ty], f < 0.5 ? '#FFFDF2' : '#FFF4D8', 3);
      }
      // fichas: saem da gaveta em curva, deixam um rastro e mergulham no livro
      for (let i = 0; i < CARDS.length; i++) {
        const k = CARDS[i], u = prog(T, k.t0, k.t0 + FLY);
        if (u <= 0) continue;
        if (u >= 1) {
          const rp = prog(T, k.t0 + FLY, k.t0 + FLY + 0.3);
          if (rp < 1) ring(c, 960, 690, 22 + rp * 60, al(P.yellow, 0.8 * (1 - rp)), 4);
          continue;
        }
        const sx = BANK[k.b] + k.col * DW + DW / 2, sy = Y0 + k.row * DH + DH / 2, mx = lerp(sx, 960, 0.45) + (k.b ? 130 : -130) * hash(i * 1.9), my = Math.min(sy, 690) - 170 - hash(i) * 120;
        const e = E.sin(u), [px, py] = qb(sx, sy, mx, my, 960, 690, e), [qx, qy] = qb(sx, sy, mx, my, 960, 690, Math.max(0, e - 0.07));
        line(c, qx, qy, px, py, al('#FFF1D0', 0.35 * Math.sin(u * Math.PI)), 5);
        c.save();
        c.translate(px, py);
        c.rotate(u * 5 + i);
        c.scale((1 - e * 0.5) * pop(T, k.t0, 0.25), 1 - e * 0.5);
        box(c, -17, -25, 34, 50, 5, [P.cream, P.sky, '#F4F7FF', P.yellow][i % 4]);
        line(c, -9, -10, 9, -10, al(P.violet, 0.5), 3);
        line(c, -9, 2, 9, 2, al(P.violet, 0.5), 3);
        c.restore();
      }
      // Dra. Íris rege as fichas e depois apresenta a síntese
      const present = tw(T, tMos, tMos + 0.4);
      owl(c, IRIS, {
        x: 1340, y: 905, s: 1.05, t: T, seed: 3, face: lerp(-0.35, -0.22, present),
        ...moodK(T, [[0, 'focus'], [tCen, 'surprised'], [tCen + 0.9, 'happy'], [tMos, 'neutral'], [tSep + 0.9, 'proud']], 0.22),
        wl: lerp(2.0 + 0.32 * Math.sin(T * 3.2), 2.3 + 0.12 * wob(T, tSep, 12, 5), present), wr: 0.2 + 1.3 * pulse(T, tCen - 0.05, 0.6),
        look: [-0.65, lerp(lerp(-0.85, -0.1, tw(T, c3.a, tCen + 1.0)), -0.5, present)], tilt: lerp(-0.1, 0.02, tw(T, c3.a, tCen + 1.0)) + 0.05 * Math.sin(T * 3.2) * (1 - present),
        sq: -0.06 * pulse(T, tCen, 0.4), hop: arc(prog(T, tSep + 0.9, tSep + 1.25)) * 18,
      });
      // síntese: sessões separadas → cabo de luz → lanterna acesa (retenção)
      const k = pop(T, tSep, 0.5);
      if (k > 0) {
        const on = tw(T, tSep + 0.9, tSep + 1.1);
        // a síntese é projetada pelo próprio livro
        c.save();
        c.globalCompositeOperation = 'lighter';
        c.fillStyle = al(P.yellow, 0.1 * clamp(k));
        c.beginPath();
        c.moveTo(930, 640);
        c.lineTo(990, 640);
        c.lineTo(1192, 564);
        c.lineTo(728, 564);
        c.closePath();
        c.fill();
        c.restore();
        box(c, 728, 436, 464, 128, 30, al('#0B0A40', 0.6 * clamp(k)));
        for (let i = 0; i < 4; i++) {
          const x = 786 + i * 84, lp = tw(T, tSep + i * 0.15 + 0.1, tSep + i * 0.15 + 0.32);
          if (lp > 0) line(c, x, 528, x + 84 * lp, 528, al(P.teal, 0.95), 5 + i * 3);
          blk(c, x, 500, i, 0.2 * hit(T, tSep + i * 0.15 + 0.3, 18, 9) * (T > tSep + i * 0.15 + 0.3 ? 1 : 0), 0, pop(T, tSep + i * 0.15, 0.4));
        }
        lantern(c, 1140, 500, 1.5, on, P.yellow);
        burst(c, 1140, 500, T, tSep + 0.9, P.yellow, 10, 130, 5);
      }
      tag(c, 'Cepeda et al. · 2006 · Psychological Bulletin', 960, 990, 20, al('#ffffff', 0.14), '#ffffff', pop(T, tCen + 0.4, 0.4));
    });
    layer(c, cm, 1.3, () => {
      // primeiro plano: lanternas grandes e desfocadas passam pela câmera durante a descida
      for (const [lx, ly, ph] of [[150, -560, 0], [1790, -150, 2], [120, 330, 3]]) {
        const sw = Math.sin(T * 0.9 + ph) * 0.04;
        c.save();
        c.translate(lx, ly - 700);
        c.rotate(sw);
        line(c, 0, 0, 0, 660, '#0A0638', 9);
        glow(c, 0, 700, 260, P.yellow, 0.35);
        box(c, -44, 640, 88, 120, 26, '#0A0638');
        box(c, -26, 664, 52, 72, 14, al(P.yellow, 0.55));
        c.restore();
      }
    });
    tag(c, 'CENTENAS DE EXPERIMENTOS', 960, 130, 34, P.yellow, P.violet, pop(T, tCen, 0.45));
    dust(c, T, 24, 71, '#FFE9B8', { a: 0.24 });
    vignette(c, 0.5);
  },
};
