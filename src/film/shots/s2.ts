// SEÇÃO 2 — A primeira surpresa: reler × recuperar (efeito do teste). Domínio: azul-royal de laboratório.
import { Ctx, W, P, E, lerp, tw, pop, prog, k1, arc, al, bg, layer, camK, dust, vignette, idea, glow, txt, tag, line, circ, box, burst, spring, bez, qb, ring, spark, cross, hash, clamp, lg, mix, shake, poly } from '../core';
import { owl, wingTip, LUMI, BRASA, IRIS } from '../owl';
import type { Owl } from '../owl';
import { shelf, book, desk, calTile, qm, sign, page, foreLeaves, clock } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';
import { ant, wob, hit, win, moodK, camS, heldBook } from '../fx';

const c1 = q(2, 1), c2 = q(2, 2), c3 = q(2, 3), c4 = q(2, 4), c5 = q(2, 5), c6 = q(2, 6), c7 = q(2, 7), c8 = q(2, 8), c9 = q(2, 9);

const tClose = at(c3, 'tentativas'), tSem = at(c3, 'sem');
const rd = [c2.a, at(c2, 'texto'), at(c2, 'várias'), c2.b + 0.2];
const tDuas = at(c1, 'duas'), tUp = at(c1, 'estudando'), tSame = at(c1, 'mesmo'), tLem = at(c4, 'lembrar'), tWeek = at(c4, 'semana');
const tRet = [tClose + 0.5, tClose + 1.1, tSem + 0.3]; // instantes em que Brasa recupera cada ideia
const SLOT = (i: number) => [1578 + i * 62, 372];
const A: ShotDef = {
  id: '2A', sec: 2, from: c1.a - 0.5, title: 'Duas formas de estudar', color: '#101A6B', tr: 'iris', trc: P.yellow,
  desc: 'Biblioteca em tela dividida. As duas pegam o mesmo capítulo e abrem o livro VOLTADO PARA SI (a câmera vê lombada e capas). Lumi relê e volta as páginas (×3), satisfeita. Brasa lê, fecha o livro com um estalo, deita-o na mesa, resiste a consultá-lo e reconstrói as ideias de memória num balão. Depois: "daqui a uma semana?"',
  cam: 'Plano geral → push em Lumi → whip pan para Brasa (com assentamento) → recuo', cast: 'Lumi, Brasa', sfxNote: 'páginas, livro fechando, ideias encaixando, folhas do calendário',
  sfx: [[rd[0], 'page', 0.6], [rd[1], 'page', 0.6], [rd[2], 'page', 0.6], [tClose, 'slam', 0.8], [tClose + 0.7, 'pop', 0.6], [tClose + 1.3, 'pop', 0.6], [tSem + 0.6, 'ding', 0.6], [c3.a - 0.3, 'whoosh', 0.6], ...Array.from({ length: 7 }, (_, i) => [c4.a + 0.2 + i * 0.22, 'tick', 0.5]), [at(c4, 'semana'), 'pop', 0.7]],
  draw(c, T) {
    const k0 = camK(T, [[c1.a - 0.5, 960, 540, 1.04], [c2.a - 0.3, 960, 540, 1], [c2.a + 0.5, 520, 560, 1.5], [c3.a - 0.35, 520, 560, 1.55], [c3.a + 0.2, 1420, 540, 1.5], [c4.a - 0.4, 1440, 530, 1.55], [c4.a + 0.5, 960, 540, 1]]);
    const cm = { ...k0, x: k0.x + 30 * wob(T, c3.a + 0.2, 10, 5), r: Math.sin(T * 0.5) * 0.004 };
    bg(c, '#132078', '#1B1160');
    layer(c, cm, 0.8, () => {
      shelf(c, 40, 110, 400, 4, 11, T);
      shelf(c, 1480, 110, 400, 4, 23, T);
      shelf(c, 800, 40, 320, 5, 37, T);
    });
    // luminárias pendentes, uma sobre cada mesa
    layer(c, cm, 0.9, () => {
      for (const [x, col] of [[500, P.teal], [1420, P.orange]] as [number, string][]) {
        const s = Math.sin(T * 0.8 + x) * 0.03;
        c.save();
        c.translate(x, -60);
        c.rotate(s);
        line(c, 0, 0, 0, 250, '#0C0F4F', 6);
        box(c, -48, 246, 96, 36, 16, '#0C0F4F');
        box(c, -36, 274, 72, 10, 5, col);
        c.restore();
        glow(c, x - s * 280, 300, 250, col, 0.2);
      }
    });
    const fl = (t0: number) => {
      const p = prog(T, t0, t0 + 0.32);
      return p < 1 ? p : 0;
    };
    const scan = (T * 1.5) % 1;
    layer(c, cm, 1, () => {
      c.fillStyle = '#0C0F4F';
      c.fillRect(-900, 850, W + 1800, 700);
      glow(c, 500, 600, 560, P.teal, 0.16);
      glow(c, 1420, 600, 560, P.orange, 0.16);
      // sinais de leitura: partículas de texto sobem das páginas para os olhos de quem lê
      const motes = (bx: number, col: string, k: number) => {
        if (k <= 0.02) return;
        for (let i = 0; i < 5; i++) {
          const p = (T * 0.9 + i / 5) % 1;
          box(c, bx + (i - 2) * 24 + Math.sin(p * 6 + i) * 6 - 8, 586 - p * 62, 16, 4, 2, al(col, k * Math.sin(p * Math.PI)));
        }
      };

      /* ---------- Lumi: relê ---------- */
      const grabL = ant(T, tUp - 0.15, tUp + 0.3), openL = pop(T, tUp + 0.3, 0.5), passes = rd.filter((p, i) => i < 3 && T >= p).length;
      const flipL = Math.max(fl(rd[0]), fl(rd[1]), fl(rd[2]), T > rd[3] ? fl(rd[3] + Math.floor((T - rd[3]) / 1.1) * 1.1 + 0.4) : 0);
      const lookL: [number, number] = T < tUp ? [0.1, 0] : T < tSame ? [0, 0.7] : T < tSame + 0.7 ? [0.85, 0.1] : T > c4.a ? [0.45, -0.7] : [-0.35 + 0.7 * scan, 0.72];
      owl(c, LUMI, {
        x: 500, y: 770, s: 1.05, t: T, seed: 1, face: 0.22, look: lookL, wl: 0.45,
        ...moodK(T, [[0, 'happy'], [rd[2] + 0.3, 'proud'], [rd[2] + 0.95, 'happy'], [c4.a, 'think'], [tLem, 'confused']]),
        hop: arc(prog(T, tDuas, tDuas + 0.4)) * 38, wr: 0.45 + 1.25 * arc(flipL) + 1.6 * arc(prog(T, tDuas, tDuas + 0.5)),
        tilt: 0.03 + 0.05 * arc(flipL) + (T > tLem ? 0.09 * tw(T, tLem, tLem + 0.3, E.back) : 0), sq: 0.04 * arc(flipL) + 0.12 * Math.max(0, hit(T, tDuas + 0.4, 18, 9)),
      });
      desk(c, 500, 700, 540);
      if (T < tUp + 0.3) {
        c.save();
        c.translate(526, 700);
        c.rotate((-Math.PI / 2) * grabL);
        book(c, 54, 0, 0.73, 0, P.royal);
        c.restore();
      } else {
        heldBook(c, 515, 700, 1, { open: openL, col: P.royal, flip: flipL, dir: -1, lit: 0.9, kind: 1, grip: LUMI.wing, near: 1, sq: 0.06 * arc(flipL) });
        motes(515, '#FFF1D0', (T > c4.a ? 0 : 0.9) * Math.max(0.3, 1 - passes * 0.22) * Math.min(1, openL));
      }
      // contador de releituras
      const cf = 1 - tw(T, c4.a - 0.3, c4.a);
      for (let i = 0; i < 3; i++) {
        const s = pop(T, rd[i] + 0.3, 0.4) * cf;
        if (s <= 0) continue;
        c.save();
        c.translate(380 + i * 110, 330 + 6 * Math.sin(T * 2 + i));
        c.rotate(0.35 * wob(T, rd[i] + 0.3, 14, 6));
        c.scale(s, s);
        circ(c, 0, 0, 36, al('#0C0F4F', 0.85));
        ring(c, 0, 0, 30, P.teal, 8);
        txt(c, '×' + (i + 1), 0, 2, 26, '#ffffff', { w: 800 });
        c.restore();
      }

      /* ---------- Brasa: recupera ---------- */
      const grabB = ant(T, tUp - 0.03, tUp + 0.45);
      const openB = T < tClose - 0.4 ? pop(T, tUp + 0.45, 0.5) : T < tClose - 0.12 ? lerp(1, 1.13, tw(T, tClose - 0.4, tClose - 0.12, E.o)) : lerp(1.13, 0, tw(T, tClose - 0.12, tClose, E.i));
      const strain = Math.max(...tRet.map((t0) => win(T, t0 - 0.35, t0 + 0.05, 0.12))), closed = T >= tClose;
      const lookB: [number, number] = T < tUp ? [-0.1, 0] : T < tSame ? [0, 0.7] : T < tSame + 0.7 ? [-0.85, 0.1] : T > c4.a ? [-0.45, -0.7]
        : T > tSem && T < tSem + 0.35 ? [-0.9, 0.5] : closed ? [0.55, -0.7] : T > tClose - 0.4 ? [0, -0.1] : [0.35 - 0.7 * scan, 0.72];
      owl(c, BRASA, {
        x: 1420, y: 770, s: 1.05, t: T, seed: 2, face: closed ? 0.08 : -0.22, look: lookB,
        ...moodK(T, [[0, 'happy'], [tUp, 'focus'], [tClose - 0.4, 'surprised'], [tClose - 0.05, 'effort'], [tClose + 0.3, 'think'], [tSem, 'worried'], [tSem + 0.3, 'effort'], [tSem + 0.6, 'happy'], [c4.a, 'think'], [tLem + 0.15, 'confused']], 0.18),
        hop: arc(prog(T, tDuas + 0.2, tDuas + 0.6)) * 38 + arc(prog(T, tSem + 0.6, tSem + 0.95)) * 28,
        wl: 0.45 + 1.6 * arc(prog(T, tDuas + 0.2, tDuas + 0.7)) + 1.1 * arc(prog(T, tSem, tSem + 0.45)),
        wr: 0.45 + 2.0 * tw(T, tClose + 0.15, tClose + 0.5, E.back) * (1 - tw(T, c4.a - 0.2, c4.a + 0.2)) + strain * 0.12 * Math.sin(T * 38),
        tilt: (closed ? -0.07 : 0) + strain * 0.05 * Math.sin(T * 33) + (T > tLem ? -0.09 * tw(T, tLem + 0.15, tLem + 0.45, E.back) : 0),
        sq: 0.12 * Math.max(0, hit(T, tDuas + 0.6, 18, 9)) + 0.1 * hit(T, tClose, 20, 9) + strain * 0.04 - 0.06 * win(T, tClose - 0.4, tClose - 0.05, 0.1),
      });
      desk(c, 1420, 700, 540);
      if (T < tUp + 0.45) {
        c.save();
        c.translate(1394, 700);
        c.scale(-1, 1);
        c.rotate((-Math.PI / 2) * grabB);
        book(c, 54, 0, 0.73, 0, P.pink);
        c.restore();
      } else if (!closed) {
        heldBook(c, 1405, 700, 1, { open: openB, col: P.pink, flip: fl(c3.a + 0.55), dir: 1, lit: 0.9, kind: 1, grip: BRASA.wing, near: -1 });
        motes(1405, '#FFF1D0', 0.9 * Math.min(1, openB) * (1 - tw(T, tClose - 0.4, tClose - 0.2)));
      } else {
        // estalo: o livro fecha de pé, tomba na mesa (com quique) e depois é afastado — "sem consultar o material"
        const fall = E.bo(prog(T, tClose + 0.12, tClose + 0.6)), slide = 46 * tw(T, tSem + 0.05, tSem + 0.4, E.o), pf = prog(T, tClose, tClose + 0.4);
        c.save();
        c.translate(1394 - slide, 700);
        c.scale(-1, 1);
        c.rotate((-Math.PI / 2) * (1 - fall));
        book(c, 54, 0, 0.73, 0, P.pink);
        c.restore();
        if (pf < 1) for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) circ(c, 1405 + sd * (18 + E.o(pf) * (50 + k * 30)), 650 - pf * (20 + k * 26), (16 - k * 5) * (1 - pf) + 3, al('#ffffff', 0.5 * (1 - pf)));
        burst(c, 1405, 640, T, tClose, '#ffffff', 9, 120, 3);
        cross(c, 1340 - slide, 668, 60, P.pink, prog(T, tSem, tSem + 0.35) * (1 - tw(T, c4.a - 0.4, c4.a)));
      }
      // balão de memória: três lugares vazios que ela preenche sem olhar o livro
      const bub = pop(T, tClose + 0.25, 0.45) * (1 - tw(T, c4.a - 0.1, c4.a + 0.15));
      if (bub > 0) {
        circ(c, 1530, 456, 9 * bub, '#F4F7FF');
        circ(c, 1552, 428, 14 * bub, '#F4F7FF');
        c.save();
        c.translate(1640, 372);
        c.scale(bub, bub);
        box(c, -122, -52, 250, 116, 56, 'rgba(2,3,30,0.3)');
        box(c, -128, -60, 256, 120, 58, '#F4F7FF');
        c.restore();
        for (let i = 0; i < 3; i++) idea(c, i, SLOT(i)[0], SLOT(i)[1], 22 * Math.min(1, bub), { hollow: true });
      }
      for (let i = 0; i < 3; i++) {
        const u = tw(T, tRet[i], tRet[i] + 0.55, E.o), dr = E.bo(prog(T, c4.a + i * 0.08, c4.a + 0.6 + i * 0.08));
        if (u <= 0) continue;
        const [sx, sy] = SLOT(i), x = lerp(lerp(1446, sx, u), 1500 + i * 62, dr), y = lerp(lerp(452, sy, u) - arc(u) * 70, 676, dr);
        idea(c, i, x, y, 22 * pop(T, tRet[i], 0.4) * (1 + 0.25 * hit(T, tRet[i] + 0.55, 22, 9)), { eyes: dr > 0.9, g: 1 });
        const rp = prog(T, tRet[i] + 0.5, tRet[i] + 0.95);
        if (rp > 0 && rp < 1) ring(c, sx, sy, 24 + rp * 34, al('#ffffff', 1 - rp), 4);
      }

      // "o mesmo capítulo": um arco liga os dois livros
      const same = pop(T, tSame, 0.45) * (1 - tw(T, c2.a - 0.55, c2.a - 0.25));
      if (same > 0) {
        bez(c, 560, 570, 960, 370, 1360, 570, al(P.yellow, 0.85 * Math.min(1, same)), 5, prog(T, tSame - 0.1, tSame + 0.45));
        tag(c, 'MESMO CAPÍTULO', 960, 452, 24, P.yellow, P.violet, same);
      }
      // calendário: uma semana — as folhas descem penduradas, balançam e viram uma a uma
      const cs = pop(T, c4.a, 0.5);
      if (cs > 0) {
        const sway = 0.09 * wob(T, c4.a, 7, 2.6);
        ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].forEach((d, i) => {
          const drop = spring(T, c4.a - 0.05 + i * 0.03, 0.8);
          c.save();
          c.translate(660 + i * 100, -60);
          c.rotate(sway * (1 + i * 0.12));
          line(c, 0, 0, 0, lerp(-140, 262, drop), al('#ffffff', 0.35), 3);
          calTile(c, 0, lerp(-90, 310, drop), 0.9 * cs, d, i > 4 ? P.pink : P.royal, Math.cos(prog(T, c4.a + 0.2 + i * 0.22, c4.a + 0.6 + i * 0.22) * Math.PI * 2));
          c.restore();
        });
        const di = k1(T, [[c4.a + 0.2, 0], [c4.a + 0.2 + 6 * 0.22, 6]], E.lin);
        if (T > c4.a + 0.2) ring(c, 660 + di * 100, 252, 64, al(P.yellow, 0.9 * (1 - tw(T, tWeek + 0.5, tWeek + 0.9))), 5);
        tag(c, '1 SEMANA DEPOIS', 960, 150, 26, P.yellow, P.violet, pop(T, tWeek, 0.4));
        qm(c, 500, 340 + 8 * Math.sin(T * 3), 120, P.teal, pop(T, tLem, 0.4), Math.sin(T * 4) * 0.08 + 0.3 * wob(T, tLem, 12, 4));
        qm(c, 1420, 340 + 8 * Math.sin(T * 3 + 1), 120, P.orange, pop(T, tLem + 0.15, 0.4), -Math.sin(T * 4) * 0.08 - 0.3 * wob(T, tLem + 0.15, 12, 4));
      }
    });
    foreLeaves(c, cm, T, '#080A3C');
    // riscos de velocidade no whip pan
    const wp = prog(T, c3.a - 0.35, c3.a + 0.2), wm = Math.sin(wp * Math.PI);
    if (wm > 0.01) {
      for (let i = 0; i < 18; i++) {
        c.fillStyle = al('#ffffff', 0.12 * wm);
        c.fillRect((((hash(i) * 2 - wp * 2.2) % 1.4) + 1.4) % 1.4 * W - 200, hash(i * 3.1) * 1080, (300 + hash(i * 7) * 600) * wm, 5 + hash(i + 2) * 10);
      }
    }
    dust(c, T, 24, 21, '#ffffff', { a: 0.22 });
    vignette(c, 0.45);
  },
};

// Valores publicados no relato do Experimento 1 (Roediger & Karpicke, 2006): 5 min e 1 semana.
// Não há números de 2 dias aqui: não inventamos valores para essa medição.
const VAL = [[81, 75], [40, 61]];
const tb = [at(c6, 'imediato'), at(c7, 'dois'), at(c7, 'semana')];
const tWin = [at(c6, 'vantagem'), at(c7, 'recuperação'), at(c7, 'lembrava')];
const t06 = at(c5, '2006'), tG1 = at(c5, 'estudar'), tG2 = at(c5, 'recuperar');
function lab(c: Ctx, T: number) {
  bg(c, '#2A44E0', '#1B2BB0', '#131C7A');
  for (let i = 0; i < 9; i++) box(c, i * 240 - 60, 0, 120, 1080, 0, 'rgba(255,255,255,0.03)');
  // tanques e tubos
  for (const sx of [130, 1790]) {
    box(c, sx - 62, 300, 124, 430, 50, al('#BFEFFF', 0.14));
    box(c, sx - 62, 470 + Math.sin(T * 1.3 + sx) * 12, 124, 260, 50, al(P.teal, 0.45));
    for (let i = 0; i < 5; i++) circ(c, sx + Math.sin(i * 9 + T) * 30, 720 - ((T * 60 + i * 90) % 240), 7, 'rgba(255,255,255,0.5)');
    box(c, sx - 78, 270, 156, 40, 14, '#0E1466');
    box(c, sx - 78, 720, 156, 40, 14, '#0E1466');
    glow(c, sx, 560, 240, P.teal, 0.2);
  }
  line(c, 130, 270, 130, 90, '#0E1466', 20);
  line(c, 130, 90, 1790, 90, '#0E1466', 20);
  line(c, 1790, 90, 1790, 270, '#0E1466', 20);
  for (let i = 0; i < 12; i++) circ(c, 260 + i * 128, 90, 9, Math.floor(T * 2 + i) % 3 ? al(P.yellow, 0.35) : P.yellow);
  c.fillStyle = '#0C1260';
  c.fillRect(0, 880, W, 200);
}
// alvos do apontador a laser da Dra. Íris: [instante, x, y]
const LZ = [[t06 - 0.1, 980, 150], [tG1, 700, 300], [tG2, 1100, 300], [tb[0], 820, 430], [tWin[0], 785, 370], [tb[1], 980, 580], [tb[2], 1140, 480], [tWin[2], 1183, 440]];
const B: ShotDef = {
  id: '2B', sec: 2, from: c5.a - 0.45, title: 'O experimento de 2006', color: '#243CDB', tr: 'band', trc: P.royal,
  desc: 'Laboratório. Dra. Íris entra andando, a tela desce com mola e o ano "2006" gira como contador. Os dois grupos caem na legenda (reestudar × recuperar). Um relógio corre pelo eixo do tempo; memórias voam de cada grupo para tubos de líquido — em 1 semana, parte se perde no caminho e o nível de 5 min fica como contorno. Em 2 dias, as fichas trocam de posição. Desce a placa "EFEITO DO TESTE".',
  cam: 'Travelling em spline com paralaxe (fundo, quadro, vidraria em primeiro plano), acompanha o eixo do tempo; tremor na placa', cast: 'Dra. Íris, Lumi e Brasa (mini)', sfxNote: 'máquinas do laboratório, barras subindo, estrela de vantagem, placa caindo',
  sfx: [[c5.a, 'mech', 0.5], [at(c5, '2006'), 'pop', 0.7], [tb[0], 'zip', 0.5], [tWin[0], 'ding', 0.5], [tb[1], 'zip', 0.5], [tb[2], 'zip', 0.5], [tWin[1], 'chime', 0.7], [tWin[2], 'sparkle', 0.6], [c8.a + 0.2, 'thud', 0.8], [c8.a + 0.3, 'sparkle', 0.8]],
  draw(c, T) {
    const cm = shake(camS(T, [[c5.a - 0.45, 860, 540, 1.06], [t06 + 0.4, 960, 470, 1.16], [tG2 + 0.7, 960, 520, 1.1], [tb[0] + 0.4, 930, 500, 1.2], [tb[1] + 0.3, 970, 500, 1.2], [tb[2] + 0.5, 1005, 495, 1.2], [c8.a - 0.1, 990, 500, 1.18], [c8.a + 0.7, 960, 520, 1.08]]), T, c8.a + 0.2, 16, 0.5);
    bg(c, '#2A44E0', '#1B2BB0', '#131C7A');
    layer(c, cm, 0.5, () => lab(c, T));
    const thud = hit(T, c8.a + 0.2, 24, 8);
    // apontador a laser: salta de alvo em alvo com antecipação e ultrapassagem
    let li = 0;
    while (li < LZ.length - 1 && T >= LZ[li + 1][0] - 0.35) li++;
    const lp = li === 0 ? 1 : ant(T, LZ[li][0] - 0.35, LZ[li][0]), lA = LZ[Math.max(0, li - 1)], lB = LZ[li];
    const lx = lerp(lA[1], lB[1], lp) + Math.cos(T * 5) * 7, ly = lerp(lA[2], lB[2], lp) + Math.sin(T * 5) * 7;
    const lon = tw(T, t06 - 0.5, t06 - 0.2) * (1 - tw(T, c8.a - 0.3, c8.a));
    layer(c, cm, 1, () => {
      c.fillStyle = '#0C1260';
      c.fillRect(-900, 880, W + 1800, 700);
      // tela de projeção: desce com mola (som de máquina) e revela o conteúdo de cima para baixo
      const un = Math.max(0.02, spring(T, c5.a - 0.05, 0.9)), BH = 640 * un;
      box(c, 470, 126, 1020, 34, 17, '#0E1466');
      c.save();
      c.beginPath();
      c.rect(380, 40, 1200, 110 + BH + 6);
      c.clip();
      c.translate(0, 6 * thud);
      box(c, 500, 150, 960, 640, 30, '#0E1466');
      box(c, 520, 170, 920, 600, 18, '#101C8C');
      // ano em contador giratório
      const pl = pop(T, t06 - 0.1, 0.5);
      if (pl > 0) {
        c.save();
        c.translate(980, 110 + 12 * wob(T, t06 - 0.1, 12, 5));
        c.rotate(0.05 * wob(T, t06 - 0.1, 10, 4));
        c.scale(pl, pl);
        box(c, -300, -56, 600, 112, 26, P.yellow);
        '2006'.split('').forEach((dg, i) => {
          const p = prog(T, t06 - 0.1 + i * 0.07, t06 + 0.3 + i * 0.07);
          txt(c, p < 1 ? String((+dg + Math.floor((1 - p) * 14)) % 10) : dg, -228 + i * 39, 4 - (1 - E.back(p)) * 26, 62, P.violet, { w: 900, a: 0.35 + 0.65 * p });
        });
        txt(c, 'Roediger & Karpicke', 60, -12, 23, P.violet, { w: 700 });
        txt(c, 'Psychological Science', 60, 20, 18, al(P.violet, 0.8), { w: 600 });
        c.restore();
      }
      // grupos: caem na legenda, quicam e reagem ao resultado
      const g1 = spring(T, tG1, 0.8), g2 = spring(T, tG2, 0.8);
      if (g1 > 0) {
        owl(c, LUMI, {
          x: 630, y: lerp(150, 330, g1), s: 0.34, t: T, seed: 1, a: Math.min(1, g1 * 3), sq: 0.16 * hit(T, tG1 + 0.2, 18, 8) + 0.12 * tw(T, tb[2] + 0.8, tb[2] + 1.3),
          hop: 90 * arc(prog(T, tWin[0], tWin[0] + 0.4)), wl: 2.4 * arc(prog(T, tWin[0], tWin[0] + 0.5)) + 0.12, wr: 2.4 * arc(prog(T, tWin[0], tWin[0] + 0.5)) + 0.12,
          ...moodK(T, [[0, 'happy'], [tWin[0], 'proud'], [tb[1], 'neutral'], [tb[2] + 0.6, 'surprised'], [tWin[2], 'worried']]),
        });
        tag(c, 'REESTUDAR', 770, 290, 22, P.teal, P.violet, pop(T, tG1 + 0.15, 0.4));
      }
      if (g2 > 0) {
        const cheer = arc(prog(T, tWin[1], tWin[1] + 0.4)) + arc(prog(T, tWin[2], tWin[2] + 0.4));
        owl(c, BRASA, {
          x: 1030, y: lerp(150, 330, g2), s: 0.34, t: T, seed: 2, a: Math.min(1, g2 * 3), sq: 0.16 * hit(T, tG2 + 0.2, 18, 8), hop: 90 * cheer, wl: 2.4 * cheer + 0.12, wr: 2.4 * cheer + 0.12,
          ...moodK(T, [[0, 'happy'], [tWin[0], 'worried'], [tb[1], 'focus'], [tWin[1], 'happy'], [tWin[2], 'proud']]),
        });
        tag(c, 'RECUPERAR', 1180, 290, 22, P.orange, P.violet, pop(T, tG2 + 0.15, 0.4));
      }
      // eixo, grade e relógio que corre pelo tempo
      line(c, 600, 690, 1380, 690, al('#ffffff', 0.5), 4);
      const gA = pop(T, c5.a + 0.3, 0.5);
      for (let g = 20; g <= 80; g += 20) {
        line(c, 600, 688 - g * 3.6, 1380, 688 - g * 3.6, al('#ffffff', 0.1 * gA), 2);
        txt(c, g + '%', 585, 688 - g * 3.6, 16, al('#ffffff', 0.45 * gA), { w: 600, al: 'right' });
      }
      txt(c, 'retenção no teste final', 985, 197, 20, al('#ffffff', 0.75), { w: 600, a: gA });
      // tubo de líquido: sobe com mola, a superfície balança, bolhas sobem; `ghost` = nível anterior em contorno
      const tube = (x: number, v: number, col: string, t0: number, ghost: number) => {
        const u = spring(T, t0, 1.0), h = v * 3.6 * u, sl = 6 * wob(T, t0, 13, 3.2);
        box(c, x - 4, 688 - 304, 78, 304, 14, al('#ffffff', 0.06 * pop(T, t0 - 0.3, 0.3)));
        if (ghost > 0 && u > 0) {
          c.setLineDash([8, 7]);
          c.strokeStyle = al('#ffffff', 0.5 * Math.min(1, u));
          c.lineWidth = 3;
          c.strokeRect(x, 688 - ghost * 3.6, 70, ghost * 3.6);
          c.setLineDash([]);
        }
        if (h > 1) {
          c.beginPath();
          c.moveTo(x, 688);
          c.lineTo(x, 688 - h - sl);
          c.quadraticCurveTo(x + 35, 688 - h - 5, x + 70, 688 - h + sl);
          c.lineTo(x + 70, 688);
          c.closePath();
          c.fillStyle = lg(c, 0, 688 - h, 0, 688, [0, col, 1, mix(col, '#0E1466', 0.45)]);
          c.fill();
          for (let k = 0; k < 3; k++) circ(c, x + 14 + k * 21, 686 - ((T * 44 + k * 57) % Math.max(12, h - 6)), 3.5, al('#ffffff', 0.5));
          box(c, x + 8, 688 - h + 10, 7, Math.max(0, h - 20), 3, al('#ffffff', 0.25));
        }
        txt(c, Math.round(v * clamp(u)) + '%', x + 35, 688 - h - 26, 24, '#ffffff', { w: 800, a: u });
      };
      // memórias voam do grupo para o tubo; `keep` < 1 = parte se perde pelo caminho (esquecimento)
      const stream = (sx: number, bx: number, top: number, t0: number, keep: number, seed: number) => {
        for (let k = 0; k < 10; k++) {
          const ts = t0 - 0.4 + k * 0.07, u = prog(T, ts, ts + 0.62);
          if (u <= 0 || u >= 1) continue;
          const lost = hash(seed + k * 3.3) > keep, e = E.io(u);
          idea(c, k, lerp(sx, bx, e) + (lost ? (hash(k + seed) - 0.5) * 150 * e : 0), lerp(330, top, e) - arc(u) * 120 + (lost ? e * e * 240 : 0), 9, { g: 0.8, a: lost ? 1 - u : 1, dim: lost ? u * 0.85 : 0, rot: lost ? u * 4 : 0 });
        }
      };
      const GX = [820, 1140], GL = ['5 MINUTOS', '1 SEMANA'], GT = [tb[0], tb[2]], GW = [tWin[0], tWin[2]], KEEP = [[1, 1], [0.5, 0.82]];
      GL.forEach((lb, i) => {
        const x = GX[i];
        txt(c, lb, x, 722, 22, '#ffffff', { w: 700, a: pop(T, GT[i] - 0.2, 0.3) });
        tube(x - 78, VAL[i][0], P.teal, GT[i], i ? VAL[0][0] : 0);
        tube(x + 8, VAL[i][1], P.orange, GT[i] + 0.15, i ? VAL[0][1] : 0);
        stream(630, x - 43, 688 - VAL[i][0] * 3.6, GT[i], KEEP[i][0], 3 + i * 20);
        stream(1030, x + 43, 688 - VAL[i][1] * 3.6, GT[i] + 0.15, KEEP[i][1], 11 + i * 20);
        const winTeal = VAL[i][0] > VAL[i][1], ws = pop(T, GW[i], 0.5);
        if (ws > 0) {
          const sx = x + (winTeal ? -43 : 43), sy = 688 - Math.max(VAL[i][0], VAL[i][1]) * 3.6 - 62;
          glow(c, sx, sy, 80, P.yellow, 0.55);
          spark(c, sx, sy, 24 * ws, P.yellow, T * 1.5 + 2 * wob(T, GW[i], 9, 3));
          const rp = prog(T, GW[i], GW[i] + 0.5);
          if (rp < 1) ring(c, sx, sy, 20 + rp * 50, al(P.yellow, 1 - rp), 4);
        }
      });
      // 2 dias: sem números — as fichas trocam de posição (a vantagem muda de lado)
      txt(c, '2 DIAS', 980, 722, 22, al('#ffffff', 0.8), { w: 700, a: pop(T, tb[1] - 0.2, 0.3) });
      const d2 = pop(T, tb[1], 0.4), sw2 = ant(T, tb[1] + 0.1, tb[1] + 0.9);
      if (d2 > 0) {
        const yT = lerp(548, 600, sw2), yO = lerp(600, 548, sw2);
        line(c, 946, 574, 1014, 574, al('#ffffff', 0.25), 3);
        line(c, 952, 548, 952, yT, al(P.teal, 0.4), 6);
        line(c, 1008, 600, 1008, yO, al(P.orange, 0.4), 6);
        circ(c, 952, yT, 18 * d2, P.teal);
        circ(c, 1008, yO, 18 * d2, P.orange);
        txt(c, '↓', 952, yT + 1, 22, P.violet, { w: 900, a: sw2 });
        txt(c, '↑', 1008, yO, 22, P.violet, { w: 900, a: sw2 });
      }
      txt(c, 'reestudar já', 982, 640, 18, al(P.yellow, 0.95), { w: 600, a: pop(T, tb[1], 0.4) });
      txt(c, 'perde terreno', 982, 662, 18, al(P.yellow, 0.95), { w: 600, a: pop(T, tb[1], 0.4) });
      txt(c, 'Roediger & Karpicke (2006) · Experimento 1 · 2 dias sem valores exibidos', 960, 756, 15, al('#ffffff', 0.5), { w: 500, a: pop(T, tb[0], 0.5) });
      const mxk = k1(T, [[tb[0] - 0.45, 640], [tb[0], 820], [tb[1] - 0.5, 820], [tb[1], 980], [tb[2] - 0.5, 980], [tb[2], 1140]]);
      if (T > tb[0] - 0.45) {
        line(c, 640, 690, mxk, 690, P.yellow, 5);
        glow(c, mxk, 690, 50, P.yellow, 0.5);
        clock(c, mxk, 690, 14, (mxk - 640) / 22);
      }
      c.restore();
      box(c, 488, 150 + BH - 4, 984, 18, 9, '#3A52E0');
      // Dra. Íris: entra andando, apresenta, acompanha o resultado e comemora
      const ix = lerp(140, 350, tw(T, c5.a - 0.45, c5.a + 0.6, E.o)), walking = T < c5.a + 0.6;
      const io: Owl = {
        x: ix, y: 890, s: 1.05, t: T, seed: 3, face: walking ? 0.6 : 0.35, walk: walking ? T * 2.4 : undefined,
        hop: 40 * arc(prog(T, tWin[1], tWin[1] + 0.45)) + 30 * arc(prog(T, tWin[2], tWin[2] + 0.4)), sq: 0.16 * thud + 0.1 * Math.max(0, hit(T, tWin[1] + 0.45, 18, 8)),
        ...moodK(T, [[0, 'neutral'], [t06, 'happy'], [tG1, 'neutral'], [tWin[0], 'think'], [tb[1], 'focus'], [tWin[1], 'happy'], [c8.a, 'surprised'], [c8.a + 0.5, 'happy']], 0.25),
        look: [clamp((lx - ix) / 520, -1, 1), clamp((ly - 660) / 380, -1, 1)], tilt: Math.sin(T * 1.3) * 0.04 + 0.08 * wob(T, tWin[0], 10, 3),
        wl: 0.2 + 2.2 * arc(prog(T, tWin[1], tWin[1] + 0.5)),
      };
      io.wr = lerp(0.3, clamp(Math.atan2(lx - (ix + 84), ly - 733), 1.3, 2.9), lon);
      owl(c, IRIS, io);
      if (lon > 0.02) {
        const [wx, wy] = wingTip(io, 1);
        line(c, wx, wy, lx, ly, al(P.pink, 0.45 * lon), 3);
        glow(c, lx, ly, 46, P.pink, 0.8 * lon);
        circ(c, lx, ly, 7, al('#ffffff', lon));
      }
    });
    // vidraria em primeiro plano (desfocada): dá profundidade ao travelling
    layer(c, cm, 1.4, () => {
      for (const [fx, s] of [[40, 1], [1890, 1.25]]) {
        c.save();
        c.translate(fx, 1130);
        c.scale(s, s);
        box(c, -26, -330, 52, 130, 10, '#0A0F55');
        poly(c, [-26, -210, 26, -210, 120, 0, -120, 0], '#0A0F55', 10);
        poly(c, [-52, -150, 52, -150, 110, -12, -110, -12], al(P.teal, 0.35), 6);
        for (let k = 0; k < 3; k++) circ(c, Math.sin(T * 1.4 + k * 2) * 14, -150 - ((T * 50 + k * 60) % 170), 6, al('#BFF4FF', 0.5));
        c.restore();
      }
    });
    // placa do efeito
    const ds = spring(T, c8.a + 0.1, 1.1);
    if (ds > 0) sign(c, 960, lerp(-200, 250, ds), 'EFEITO DO TESTE', 96, { bg: P.violet, fg: P.yellow, ropes: 500, T });
    burst(c, 960, 250, T, c8.a + 0.3, P.yellow, 16, 520, 5);
    dust(c, T, 20, 31, '#ffffff', { a: 0.2 });
    vignette(c, 0.4);
  },
};

const pq = [at(c9, 'perguntas'), at(c9, 'medir'), at(c9, 'ajuda'), at(c9, 'fortalecê')];
const MEM = [[1300, 430], [1450, 340], [1560, 500], [1400, 600], [1230, 610], [1640, 660]];
const C: ShotDef = {
  id: '2C', sec: 2, from: c9.a - 0.35, title: 'Perguntar fortalece', color: '#0B3E66', tr: 'whipR',
  desc: 'Brasa segura um cartão de pergunta ligado por um cabo a uma rede de memórias. A cada pergunta, um pulso percorre o cabo, que engrossa; a rede acende. De "medir" para "fortalecer".',
  cam: 'Push-in lento em direção à rede', cast: 'Brasa', sfxNote: 'pulsos elétricos suaves, rede acendendo',
  sfx: [[pq[0], 'zip', 0.5], [pq[1], 'zip', 0.5], [pq[2], 'zip', 0.6], [pq[3], 'chime', 0.7], [pq[3] + 0.3, 'sparkle', 0.6]],
  draw(c, T) {
    const cm = camK(T, [[c9.a - 0.35, 900, 540, 1.05], [c9.b + 0.6, 1040, 520, 1.22]], E.sin);
    bg(c, '#0B4A72', '#0A2A5E', '#070F3F');
    layer(c, cm, 0.5, () => {
      for (let i = 0; i < 5; i++) ring(c, 1400, 500, 220 + i * 170, al(P.teal, 0.1 - i * 0.015), 24);
      glow(c, 1400, 500, 760, P.teal, 0.2);
    });
    const n = pq.filter((p) => T > p + 0.5).length, th = 5 + n * 5;
    layer(c, cm, 1, () => {
      c.fillStyle = '#081B4A';
      c.fillRect(-900, 900, W + 1800, 600);
      MEM.forEach((m, i) => {
        const o2 = MEM[(i + 1) % MEM.length];
        line(c, m[0], m[1], o2[0], o2[1], al(P.teal, 0.25 + n * 0.17), 3 + n * 2.5);
      });
      bez(c, 700, 600, 950, 760, 1230, 610, al(P.yellow, 0.55 + n * 0.1), th);
      pq.forEach((p) => {
        const u = prog(T, p, p + 0.55);
        if (u > 0 && u < 1) {
          const [x, y] = qb(700, 600, 950, 760, 1230, 610, E.io(u));
          glow(c, x, y, 80, P.yellow, 0.8);
          circ(c, x, y, 14, '#ffffff');
        }
      });
      MEM.forEach((m, i) => idea(c, i, m[0], m[1] + Math.sin(T * 1.5 + i) * 6, 30 + n * 5 + 8 * arc(prog(T, pq[Math.min(3, n)] + 0.5, pq[Math.min(3, n)] + 0.9)), { eyes: true, dim: 0.6 - n * 0.15, g: 0.4 + n * 0.3 }));
      const ask = pq.some((p) => T > p - 0.1 && T < p + 0.3);
      owl(c, BRASA, { x: 560, y: 900, s: 1.15, t: T, seed: 2, face: 0.35, mood: n >= 4 ? 'happy' : 'focus', wr: 1.75 + (ask ? 0.25 : 0), look: [0.7, -0.2], lean: ask ? 0.05 : 0 });
      // cartão de pergunta
      c.save();
      c.translate(700, 590);
      c.rotate(-0.1 + Math.sin(T * 2) * 0.03);
      box(c, -46, -60, 92, 120, 14, '#F4F7FF');
      txt(c, '?', 0, 4, 80, P.pink, { w: 900 });
      c.restore();
      tag(c, 'medir', 760, 420, 26, al('#ffffff', 0.14), '#ffffff', pop(T, pq[1], 0.4) * (1 - tw(T, pq[2], pq[2] + 0.4)));
      tag(c, 'fortalecer', 1420, 220, 34, P.yellow, P.violet, pop(T, pq[3], 0.45));
      burst(c, 1420, 480, T, pq[3] + 0.3, P.teal, 14, 320, 8);
    });
    dust(c, T, 26, 41, P.teal, { a: 0.3 });
    vignette(c, 0.5);
  },
};
export const S2: ShotDef[] = [A, B, C];
export { page as _p, k1 as _k };
