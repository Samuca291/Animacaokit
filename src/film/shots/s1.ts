// SEÇÃO 1 — O gancho: reconhecer não é saber. Domínio: violeta/índigo com luz quente de abajur.
// 1A, 1B e 1C são UMA tomada contínua no quarto: `hookScene` e `roomCam` são compartilhados, então os cortes
// entre eles são invisíveis. O 1D leva os mesmos balões para a beira de um abismo — a "diferença enorme".
import { Ctx, W, P, KCOL, TAU, E, clamp, lerp, tw, pop, prog, hash, k1, kf, arc, al, mix, bg, layer, Cam, dust, vignette, idea, glow, txt, textW, tag, bubble, line, circ, box, burst, stars, bez, qb, spring, spark, ridge, ell, lg, pulse, poly } from '../core';
import { owl, LUMI, BRASA, Owl, wingTip } from '../owl';
import type { Mood } from '../owl';
import { roomBack, desk, book, lamp, qm, foreLeaves, zzz } from '../props';
import { q, at } from '../narration';
import type { ShotDef } from '../timeline';
import { wob, win, moodK, camS } from '../fx';
import { notepad, balloon, knotY, popFx, lightShaft, dayLight, giftTag } from '../hook';

const c1 = q(1, 1), c2 = q(1, 2), c3 = q(1, 3), c4 = q(1, 4), c5 = q(1, 5), c6 = q(1, 6);
const tM = at(c1, 'mesmo'), tAm = at(c1, 'amanhã'), tS = at(c1, 'sumiu');
const zQ = c2.a - 0.2, tQ = c2.a + 0.2, zR = c3.a - 0.25;
const pass = [at(c3, 'lê'), at(c3, 'relê'), at(c3, 'anotações'), at(c3, 'pode')], tApr = at(c3, 'aprendendo');
const tk = [c4.a + 0.1, c4.a + 0.35, c4.a + 0.6];
const tOff = at(c4, 'não'), tEx = at(c4, 'conseguir'), tSem = at(c4, 'sem'), tThud = tSem + 0.3;

/* ---------- a tomada do quarto (1A–1C) ---------- */
const BORN = Array.from({ length: 9 }, (_, i) => lerp(0.5, tM - 0.2, i / 9));
// destino de cada ideia: 6 estouram, 1 despenca em "sumiu" e só 2 ficam (0), apagadas
// (as duas que ficam estão do lado esquerdo da órbita na hora de descer; a que cai está à direita, longe do rosto)
const GONE = [tAm + 0.1, tS + 0.25, tS, tAm + 0.27, tAm + 0.69, 0, 0, tAm + 0.45, tAm + 0.95];
const DROP = 2, REST = [[652, 638], [702, 683]];
const PAD = [1085, 690], ANCH = [1172, 562];
const BAL = [[962, 270, 60], [1092, 188, 72], [1214, 278, 58]];
// cada virada de folha abre uma passada de leitura: [início da folha, início do grifo, fim do grifo]
const READ = [[0, 0.2, 1.55], [1.63, 1.75, 2.85], [2.93, 3.05, tM], [pass[0], pass[0] + 0.08, pass[1] - 0.04], [pass[1], pass[1] + 0.08, pass[2] - 0.04], [pass[2], pass[2] + 0.08, pass[3] - 0.1]];

const sleepK = (T: number) => win(T, tM + 0.3, tAm + 0.02, 0.22);
const dayAt = (T: number) => k1(T, [[0, 0], [at(c1, 'tarde'), 0.03], [tM + 0.5, 0.5], [tAm + 0.4, 1]]);

const CAM_A = [[0, 1015, 612, 1.85], [1.3, 992, 590, 1.62], [tM - 0.2, 946, 520, 1.13], [tAm + 0.2, 938, 498, 1.1], [zQ, 902, 518, 1.3]];
const CAM_B = [[zQ + 0.4, 852, 548, 2.32], [zR, 850, 545, 2.4], [zR + 0.8, 1005, 468, 1.33], [c4.a, 1012, 456, 1.4], [tOff + 0.3, 1005, 462, 1.44], [tEx + 0.1, 905, 448, 1.36], [c5.a + 0.4, 850, 436, 1.44]];
/** recuo que revela o quarto → empurrão até o rosto → crash zoom com ultrapassagem → plano médio → pan até a fala */
function roomCam(T: number): Cam {
  if (T <= zQ) return camS(T, CAM_A);
  if (T < zQ + 0.4) {
    const u = E.back(prog(T, zQ, zQ + 0.4)), a = CAM_A[4], b = CAM_B[0];
    return { x: lerp(a[1], b[1], u), y: lerp(a[2], b[2], u), z: lerp(a[3], b[3], u) };
  }
  return camS(T, CAM_B);
}

/** ideias orbitando a cabeça de Lumi: o que ela tem "na cabeça" enquanto estuda */
function haloPos(i: number, T: number): [number, number, number] {
  const a = (i / 9) * TAU + T * 0.85, dip = 30 * sleepK(T - 0.1);
  return [850 + Math.cos(a) * 236, 420 + dip + Math.sin(a) * 56 + Math.sin(T * 2 + i) * 5, Math.sin(a)];
}
function haloIdeas(c: Ctx, T: number, front: boolean) {
  for (let i = 0; i < 9; i++) {
    const t0 = BORN[i];
    if (T < t0) continue;
    const ar = tw(T, t0, t0 + 0.75, E.o), keep = GONE[i] === 0, kk = i === 5 ? 0 : 1, tDn = tS + 0.35 + kk * 0.25;
    const [hx, hy, dz] = haloPos(i, keep ? Math.min(T, tDn) : T);
    let x = lerp(PAD[0], hx, ar), y = lerp(PAD[1] - 130, hy, ar) - arc(ar) * 70, r = 25 * pop(T, t0, 0.5), dim = 0, rot = 0;
    const isFront = ar < 0.7 || dz > 0 || (keep && T > tDn) || (i === DROP && T > tS);
    if (isFront !== front) continue;
    if (keep) {
      // sobreviventes: perdem brilho e descem para descansar na mesa; levam um susto com o baque do 1C
      const k = kk, dn = tw(T, tDn, tDn + 1.15);
      dim = 0.5 * tw(T, tAm, tS);
      x = lerp(x, REST[k][0], dn);
      y = lerp(y, REST[k][1], dn) - arc(dn) * 40 - arc(prog(T, tThud + k * 0.06, tThud + 0.34 + k * 0.06)) * 24;
      r = lerp(r, 17, dn);
    } else if (i === DROP) {
      const f = prog(T, tS, tS + 0.62);
      if (f >= 1) continue;
      dim = clamp(f * 3);
      y += f * f * 330;
      x += f * 26;
      rot = f * 2.2;
      r *= 1 - 0.25 * f;
    } else {
      const g = GONE[i];
      if (T >= g) {
        popFx(c, x, y, T, g, KCOL[i % 3], 26, i);
        continue;
      }
      // antes de estourar: incha e treme
      const sw = tw(T, g - 0.16, g, E.i);
      r *= 1 + 0.3 * sw;
      x += Math.sin(T * 60) * 2.5 * sw;
      dim = 0.25 * tw(T, tAm - 0.3, tAm + 0.3);
    }
    idea(c, i, x, y, r, { eyes: true, dim, rot, g: 1 - 0.5 * sleepK(T) });
  }
}

const FACE = [[0, 0.42], [tAm + 0.1, 0.42], [tAm + 0.4, 0.22], [zQ, 0.22], [zQ + 0.22, 0], [zR + 0.15, 0], [zR + 0.6, 0.42], [tOff + 0.35, 0.42], [tEx - 0.3, -0.06], [tSem + 0.15, -0.06], [tSem + 0.55, 0.12]];
const MOODS: [number, Mood][] = [[0, 'focus'], [1.25, 'happy'], [tM + 0.12, 'sleepy'], [tM + 0.4, 'asleep'], [tAm, 'surprised'], [tS + 0.1, 'worried'], [zQ, 'surprised'], [zR + 0.3, 'neutral'], [pass[0], 'focus'], [pass[2] + 0.25, 'happy'], [tApr, 'proud'], [c4.a - 0.2, 'happy'], [tOff - 0.3, 'proud'], [tOff + 0.5, 'happy'], [tEx + 0.55, 'think'], [tSem + 0.05, 'worried']];
const LOOK = [[0, 0.6, 0.5], [tM, 0.6, 0.5], [tAm + 0.05, 0.6, 0.4], [tAm + 0.3, 0.1, -0.85], [tS - 0.1, 0.75, -0.7], [tS + 0.45, 0.8, 0.7], [zQ, 0.3, 0.4], [zQ + 0.2, 0, 0], [zR + 0.1, 0, 0], [zR + 0.55, 0.8, 0.4], [pass[3], 0.8, 0.45], [pass[3] + 0.3, 0.6, -0.75], [c4.a - 0.2, 0.6, -0.75], [c4.a + 0.05, 0.8, 0.45], [tOff + 0.3, 0.8, 0.45], [tEx - 0.3, 0, 0.05], [tEx + 0.45, 0, 0.05], [tEx + 0.8, -0.7, -0.6], [tSem + 0.1, -0.7, -0.5], [tSem + 0.45, 0.9, 0.45]];
const WSHUT = [[tOff - 0.45, 0], [tOff - 0.1, 2.35], [tOff + 0.22, 1.4], [tOff + 0.6, 0]];

/** atuação de Lumi ao longo de toda a tomada (pose, olhar, expressão, asas, bico) */
function lumiAt(T: number): Owl {
  const sl = sleepK(T), ex = tw(T, tEx - 0.1, tEx + 0.35), flap = READ.slice(1).reduce((a, r) => a + pulse(T, r[0] - 0.12, 0.42), 0);
  const lk = kf(T, LOOK), scan = T < tM ? 0.28 * (((T * 1.7) % 1) - 0.5) : T > pass[0] && T < pass[3] ? 0.2 * Math.sin(T * 9) : 0;
  const reach = win(T, tS - 0.55, tS + 0.12, 0.25); // tenta segurar uma ideia que escapa
  const point = win(T, c4.a - 0.15, tOff - 0.25, 0.2); // aponta as frases que reconhece
  const proud = win(T, tApr, c4.a - 0.25, 0.25), yawn = 0.95 * pulse(T, tM + 0.02, 0.36);
  const nod = tk.reduce((a, t0) => a + pulse(T, t0 - 0.05, 0.24), 0), peek = BORN.reduce((a, t0) => a + pulse(T, t0 + 0.2, 0.4), 0);
  return {
    x: 850, y: 842, s: 1.2, t: T, seed: 1,
    face: k1(T, FACE),
    ...moodK(T, MOODS, 0.24),
    look: [clamp(lk[0] + scan, -1, 1), lk[1]],
    tilt: 0.04 + 0.3 * sl - 0.1 * win(T, tAm + 0.1, tS + 0.2, 0.2) - 0.06 * proud + 0.07 * nod - 0.035 * peek - 0.09 * ex * (1 - tw(T, tSem, tSem + 0.3)) + 0.1 * wob(T, tSem + 0.05, 15, 4),
    lean: 0.1 * sl,
    sq: 0.07 * sl - 0.07 * pulse(T, tAm, 0.45) - 0.09 * wob(T, zQ, 14, 6) - 0.05 * proud - 0.06 * pulse(T, tEx - 0.3, 0.3) + 0.07 * wob(T, tThud, 16, 6),
    hop: arc(prog(T, tApr, tApr + 0.42)) * 24,
    wr: Math.max(0.45 + Math.min(1.1, flap * 1.1), 2.65 * reach, (1.85 + 0.1 * Math.sin(T * 12)) * point, k1(T, WSHUT), 0.9 * proud, 0.95 * win(T, tSem + 0.35, c5.a + 0.6, 0.2)),
    wl: Math.max(0.12, 1.5 * pulse(T, tAm, 0.5), 0.9 * proud, ex * (1.95 + 0.14 * Math.sin(T * 6)) * (1 - 0.7 * tw(T, tSem, tSem + 0.4))),
    beak: T > tEx && T < tSem + 0.1 ? (0.18 + 0.5 * Math.abs(Math.sin(T * 11))) * (1 - tw(T, tSem - 0.3, tSem + 0.1)) : yawn > 0.05 ? yawn : undefined,
  };
}

function hookScene(c: Ctx, T: number) {
  const cm = roomCam(T), day = dayAt(T), night = clamp(1 - Math.abs(day - 0.5) / 0.3), sl = sleepK(T);
  const spot = tw(T, zQ, zQ + 0.25) * (1 - tw(T, zR, zR + 0.6)); // "E o mais perigoso?": o quarto escurece em volta dela
  const closed = tw(T, tOff, tOff + 0.26, E.i);
  roomBack(c, cm, T, { day, dark: Math.max(0.38 * night, 0.55 * spot, 0.14 * closed), posters: false });
  layer(c, cm, 0.85, () => lightShaft(c, day));
  const L = lumiAt(T), [lc, la] = dayLight(day);
  // leitura: a folha vira, o grifo percorre as frases; em 1C cada frase reconhecida ganha um ✓
  let hl = 6, fl = 0;
  for (const r of READ) {
    if (T >= r[0]) hl = 6 * E.sin(prog(T, r[1], r[2]));
    const p = prog(T, r[0], r[0] + 0.32);
    if (r[0] > 0 && p > 0 && p < 1) fl = p;
  }
  const checks = tk.reduce((a, t0) => a + tw(T, t0, t0 + 0.18, E.o), 0);
  const lit = (0.75 + 0.5 * tw(T, pass[0], pass[3])) * (1 - 0.35 * sl);
  layer(c, cm, 1, () => {
    glow(c, 1080, 950, 480, lc, la * 1.2);
    haloIdeas(c, T, false);
    owl(c, LUMI, L);
    if (sl > 0.3) {
      c.save();
      c.globalAlpha *= sl;
      zzz(c, 965, 470, T);
      c.restore();
    }
    haloIdeas(c, T, true);
    // mesma mesa do resto do filme; o abajur fica ao lado do bloco (ilumina a folha sem se esconder atrás dela)
    desk(c, 930, 700, 780);
    book(c, 650, 700, 0.8, 0, P.pink);
    book(c, 656, 676, 0.7, 0, P.royal);
    lamp(c, 1272, 700, 1 - 0.25 * closed);
    notepad(c, PAD[0], PAD[1], { hl, checks, flip: fl, close: closed, lit });
    // a ponta da asa passa na frente do bloco quando ela vira a folha, aponta ou baixa a capa
    if ((L.wr ?? 0) > 1.2) {
      c.save();
      c.beginPath();
      c.rect(996, 300, 420, 398);
      c.clip();
      owl(c, LUMI, L);
      c.restore();
    }
    // a "sensação de aprender": cada releitura infla um balão — grande, brilhante e oco
    let tagX = 0, tagY = 0;
    for (let k = 0; k < 3; k++) {
      const t0 = pass[k], g = pop(T, t0, 0.55);
      if (g <= 0) continue;
      const up = tw(T, t0, t0 + 1.0, E.o), swell = 1 + 0.14 * tw(T, pass[3], pass[3] + 0.5, E.back) + 0.05 * pulse(T, tApr, 0.5);
      const jit = Math.sin(T * 46 + k) * 4 * win(T, tSem, tSem + 0.4, 0.1);
      const x = lerp(ANCH[0], BAL[k][0], up) + Math.sin(T * 0.9 + k * 2) * 6 + jit;
      const y = lerp(ANCH[1] - 30, BAL[k][1], up) + Math.sin(T * 1.3 + k * 1.7) * 7 + 12 * wob(T, tOff + 0.2, 11, 4);
      const r = BAL[k][2] * g * swell * lerp(0.45, 1, up), ky = y + knotY(k, r), cx = lerp(ANCH[0], x, 0.25), cy = lerp(ANCH[1], ky, 0.6);
      bez(c, ANCH[0], ANCH[1], cx, cy, x, ky, al('#ffffff', 0.6), 2.5);
      balloon(c, k, x, y, r, { rot: Math.sin(T * 1.1 + k) * 0.06, sq: 0.06 * wob(T, t0 + 0.3, 13, 5), shine: tw(T, pass[3], pass[3] + 0.4) });
      if (k === 2) [tagX, tagY] = qb(ANCH[0], ANCH[1], cx, cy, x, ky, 0.66);
    }
    giftTag(c, tagX, tagY, 0.1 + 0.07 * Math.sin(T * 1.6) + 0.22 * wob(T, pass[3], 9, 3), pop(T, pass[3], 0.45));
    burst(c, 1092, 230, T, tApr, P.yellow, 12, 190, 4);
    const tw_ = tw(T, tApr, tApr + 0.3) * (1 - closed);
    if (tw_ > 0) for (let i = 0; i < 5; i++) spark(c, 930 + i * 78 + hash(i) * 30, 130 + hash(i + 4) * 230, 10 * tw_ * (0.5 + 0.5 * Math.sin(T * 5 + i * 2)), i % 2 ? '#ffffff' : P.yellow, T);
    qm(c, 1085, 432, 150, P.yellow, pop(T, tQ, 0.45) * (1 - tw(T, zR - 0.05, zR + 0.25)), Math.sin(T * 5) * 0.08 + 0.3 * wob(T, tQ, 12, 5));
    // "explicá-la sem olhar": no balão de fala só há contornos, que desabam no fundo dele
    const bs = pop(T, tEx, 0.45);
    if (bs > 0) {
      const sag = Math.max(0, wob(T, tThud, 10, 4));
      c.save();
      c.translate(548, 300 + 14 * sag);
      c.scale(1 + 0.04 * sag, 1 - 0.05 * sag);
      c.translate(-548, -300);
      bubble(c, 548, 300, 380, 230, '#F4F7FF', 770, 530, bs);
      if (bs > 0.4) {
        for (let i = 0; i < 3; i++) {
          const s = pop(T, tEx + 0.14 + i * 0.14, 0.35);
          if (s <= 0) continue;
          const tf = tSem + 0.04 + i * 0.05, dt = Math.max(0, T - tf), drop = 76, landT = tf + Math.sqrt((2 * drop) / 1900);
          const fall = Math.min(drop, 950 * dt * dt), bounce = T > landT ? 16 * Math.abs(Math.sin((T - landT) * 9)) * Math.exp(-(T - landT) * 6) : 0;
          const shk = Math.sin(T * 55 + i * 2) * 5 * win(T, tSem - 0.02, tf + 0.06, 0.04), flick = T < tSem ? 0.55 + 0.45 * Math.sin(T * 13 + i * 2.1) : 1;
          c.save();
          c.globalAlpha *= flick;
          idea(c, i, 436 + i * 112 + shk, 296 + fall - bounce, 34 * s, { hollow: true, rot: (i - 1) * 0.5 * clamp(dt * 4), col: mix(['#ED4BA4', '#D9A300', '#149FB8'][i], '#8891B8', tw(T, tSem, tSem + 0.25)) });
          c.restore();
        }
        for (let i = 0; i < 3; i++) circ(c, 510 + i * 38, 258, 9 * pop(T, tThud + 0.12 + i * 0.1, 0.3), '#8A93BF');
      }
      c.restore();
    }
  });
  foreLeaves(c, cm, T);
  dust(c, T, 26, 3, '#ffffff', { a: 0.22 });
  vignette(c, 0.5 + 0.22 * spot);
}

const A: ShotDef = {
  id: '1A', sec: 1, from: 0, title: 'A tarde que some', color: '#2A1478',
  desc: 'Abre colado no bloco de notas: a cada linha grifada, uma ideia salta da folha e entra em órbita na cabeça de Lumi. A câmera recua e revela o quarto enquanto a luz da janela atravessa a tarde, a noite (ela cochila) e a manhã. "Amanhã", as ideias estouram uma a uma; Lumi tenta segurar uma, que despenca. Só duas, apagadas, vão pousar na mesa.',
  cam: 'Recuo do detalhe para o plano geral, com paralaxe; empurrão final até o rosto', cast: 'Lumi', sfxNote: 'pops das ideias, whoosh do time-lapse, bolhas estourando, a ideia que cai',
  sfx: [...Array.from({ length: 9 }, (_, i) => [lerp(0.5, tM - 0.2, i / 9), 'pop', 0.45]), [tM, 'whoosh', 0.6], [tAm + 0.1, 'bubble', 0.7], [tAm + 0.45, 'bubble', 0.6], [tS, 'drop', 0.7], [tS + 0.25, 'bubble', 0.6]],
  draw: hookScene,
};
const B: ShotDef = {
  id: '1B', sec: 1, from: c2.a - 0.2, title: 'O perigo: a sensação de aprender', color: '#3A1D8F',
  desc: 'Crash zoom nos olhos de Lumi; o quarto escurece em volta ("E o mais perigoso?"). Depois, a cada releitura a folha brilha mais e infla um balão em forma de ideia — grande, brilhante e oco: a sensação de aprender. Lumi estufa o peito, orgulhosa.',
  cam: 'Crash zoom com ultrapassagem, depois recuo para plano médio (mesma tomada do 1A)', cast: 'Lumi', sfxNote: 'zip do zoom, pop do "?", virar de página a cada releitura, balões inflando, brilho',
  sfx: [[c2.a - 0.2, 'zip', 0.7], [c2.a + 0.2, 'pop', 0.8], [pass[0], 'page', 0.6], [pass[1], 'page', 0.6], [pass[2], 'page', 0.6], [pass[1], 'tick', 0.5], [pass[2], 'tick', 0.5], [pass[3], 'ding', 0.5], [at(c3, 'aprendendo'), 'sparkle', 0.7]],
  draw: hookScene,
};
const C: ShotDef = {
  id: '1C', sec: 1, from: c4.a - 0.25, title: 'A página some', color: '#3A1D8F',
  desc: 'Lumi aponta e reconhece cada frase (✓). Confiante, ela mesma baixa a capa do bloco, vira-se para explicar — e no balão de fala só há contornos vazios, que desabam. Os balões continuam cheios; ela espia o bloco fechado.',
  cam: 'Plano médio, pan suave para o balão de fala (mesma tomada)', cast: 'Lumi', sfxNote: 'ticks dos ✓, capa fechando, balão de fala, contornos desabando',
  sfx: [[c4.a + 0.1, 'tick', 0.5], [c4.a + 0.35, 'tick', 0.5], [c4.a + 0.6, 'tick', 0.5], [tOff, 'drop', 0.7], [tEx, 'pop', 0.7], [tSem, 'buzz', 0.5], [tSem + 0.3, 'thud', 0.5]],
  draw: hookScene,
};

/* ---------- 1D: o abismo entre parecer e saber ---------- */
const tPar = at(c5, 'parecer'), tReal = at(c5, 'realmente'), tDif = at(c5, 'diferença'), tTit = c6.a + 0.15;
const GY = 770, LX = 800, RX = 1120;
const POPS = [tPar + 0.6, tPar + 0.85, tPar + 1.1];
const BAL2 = [[412, 348, 64], [566, 262, 76], [724, 352, 62]];
const STEM = [[1290, 150], [1440, 218], [1590, 168]];
const ROOT = [[1290, 850], [1440, 880], [1590, 850], [1215, 930], [1365, 960], [1515, 965], [1665, 925], [1300, 1045], [1450, 1060], [1600, 1040]];
const RSEG = [[0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9]];
const CAM_D = [[c5.a - 0.6, 566, 520, 1.5], [tDif, 590, 535, 1.42], [at(c5, 'entre'), 905, 600, 1.0], [tPar + 0.5, 606, 500, 1.3], [POPS[2] + 0.08, 612, 505, 1.3], [tReal + 0.55, 1452, 640, 1.2], [tTit - 0.32, 1462, 648, 1.22], [tTit + 0.55, 960, 540, 1.0], [c6.b + 1.3, 960, 532, 1.05]];
const LOOK_D = [[c5.a, 0.1, -0.7], [tDif + 0.35, 0.1, -0.7], [tDif + 0.6, 0.55, 0.8], [tDif + 1.1, 0.55, 0.8], [tDif + 1.4, 0.1, -0.7], [POPS[2] + 0.3, 0, -0.75], [POPS[2] + 0.65, 0.9, -0.05], [tTit, 0.9, -0.05], [tTit + 0.35, 0.45, -0.75], [tTit + 1.3, 0.45, -0.75], [tTit + 1.8, 0.85, 0.25]];

const D: ShotDef = {
  id: '1D', sec: 1, from: c5.a - 0.3, title: 'Parecer saber × saber', color: '#180A59', tr: 'whipR',
  desc: 'Dois planaltos separados por um abismo — a "diferença enorme". À esquerda, Lumi na ponta dos pés, erguida pelos três balões ocos, que estouram um a um ("parecer que sabe"). A câmera atravessa o vão: do lado de Brasa, ideias sólidas brotam de caules cujas raízes, vistas em corte, formam uma rede que pulsa ("realmente saber"). O título cai letra a letra no céu entre as duas e uma ponte de luz começa a ligar as margens.',
  cam: 'Recuo que revela o abismo, empurrão para os balões, travessia até as raízes e recuo para o título', cast: 'Lumi, Brasa', sfxNote: 'três estouros de balão, acorde de revelação, riser e impacto do título',
  sfx: [[tPar + 0.6, 'bubble', 0.8], [tPar + 0.85, 'bubble', 0.7], [tPar + 1.1, 'bubble', 0.8], [tReal, 'chime', 0.8], [tTit - 0.5, 'riser', 0.6], [tTit, 'thud', 0.8], [tTit + 0.1, 'sparkle', 0.8], [tTit + 0.45, 'pop', 0.6]],
  draw(c, T) {
    const cm = camS(T, CAM_D), tt = tw(T, tTit - 0.2, tTit + 0.5), rs = tw(T, tReal - 0.6, tReal + 0.5, E.o);
    bg(c, mix('#1B0C63', '#2B3FD6', tt * 0.6), mix('#0B0F4A', '#1B0E63', tt), mix('#150A52', '#2A1478', tt));
    layer(c, cm, 0.2, () => stars(c, T, 90, 12, -400, -300, W + 400, 760, '#ffffff', 0.85));
    layer(c, cm, 0.35, () => {
      glow(c, 430, 380, 640, P.pink, 0.17);
      glow(c, 1480, 430, 700, P.teal, 0.2 + 0.12 * rs);
    });
    layer(c, cm, 0.5, () => ridge(c, 21, GY - 60, 150, '#231373', -600, W + 700, 80));
    layer(c, cm, 0.72, () => ridge(c, 33, GY - 6, 90, '#1A0F63', -600, W + 700, 60, 1.6));
    layer(c, cm, 1, () => {
      // o abismo
      c.fillStyle = lg(c, 0, GY, 0, GY + 700, [0, '#0B0940', 0.45, '#070628', 1, '#04031C']);
      c.fillRect(LX - 80, GY - 2, RX - LX + 160, 1400);
      glow(c, 960, GY + 560, 520, P.royal, 0.4);
      for (let i = 0; i < 4; i++) ell(c, 960 + Math.sin(T * 0.35 + i * 2.1) * 70, GY + 170 + i * 90, 170 - i * 16, 24, al('#8CAAF7', 0.07));
      // planaltos vistos em corte
      for (const sd of [-1, 1]) {
        const x0 = sd < 0 ? LX : RX, gx = sd < 0 ? x0 - 2600 : x0;
        c.beginPath();
        c.moveTo(x0 + sd * 2600, GY);
        c.lineTo(x0, GY);
        for (let k = 1; k <= 12; k++) c.lineTo(x0 + sd * (10 + k * 7 + 26 * hash(k * 3.7 + (sd > 0 ? 5 : 1))), GY + k * 80);
        c.lineTo(x0 + sd * 2600, GY + 960);
        c.closePath();
        c.fillStyle = lg(c, 0, GY, 0, GY + 520, [0, '#2A1C8C', 1, '#130C52']);
        c.fill();
        for (let k = 0; k < 2; k++) line(c, x0 + sd * 70, GY + 130 + k * 140, x0 + sd * 2600, GY + 130 + k * 140, al('#ffffff', 0.035), 7);
        box(c, gx, GY - 8, 2600, 20, 10, '#4B3BD0');
        box(c, gx, GY - 8, 2600, 7, 4, al('#ffffff', 0.16));
      }
      for (let i = 0; i < 6; i++) ell(c, 150 + i * 105 + hash(i) * 40, GY + 70 + hash(i + 3) * 190, 16 + hash(i + 7) * 14, 9, '#1B1266');
      // uma pedrinha rola da borda e some no escuro: é fundo
      const pb = T - (tDif + 0.3);
      if (pb <= 0) circ(c, LX - 9 + Math.sin(T * 30) * 1.5 * clamp(1 + pb * 4), GY - 14, 7, '#8C7CF0');
      else if (pb < 1.5) circ(c, LX - 9 + pb * 44, GY - 14 + 380 * pb * pb, 7, al('#8C7CF0', 1 - pb / 1.5));

      // esquerda: Lumi e os balões ocos
      const alive = POPS.reduce((a, t0) => a + (T < t0 ? 1 : 0), 0), walk = tw(T, tTit + 2.0, c6.b + 0.9, E.sin);
      const LU: Owl = {
        x: lerp(560, 610, walk), y: GY, s: 0.92, t: T, seed: 1,
        face: k1(T, [[POPS[2] + 0.1, 0.2], [POPS[2] + 0.5, 0.5]]),
        ...moodK(T, [[0, 'proud'], [POPS[0], 'surprised'], [POPS[2] + 0.25, 'worried'], [tTit + 0.4, 'surprised'], [tTit + 1.5, 'happy']], 0.2),
        look: kf(T, LOOK_D) as [number, number],
        wr: lerp(2.3, 0.35, tw(T, POPS[2] + 0.2, POPS[2] + 0.7)),
        hop: (5 + 2 * Math.sin(T * 2.2)) * alive * tw(T, c5.a - 0.6, c5.a) * (1 - tw(T, POPS[2], POPS[2] + 0.12, E.i)),
        sq: 0.1 * POPS.reduce((a, t0) => a + Math.max(0, wob(T, t0, 14, 7)), 0),
        tilt: -0.05 * tw(T, tTit + 0.3, tTit + 0.7),
        walk: walk > 0 && walk < 1 ? T * 2.4 : undefined,
      };
      const [hx, hy] = wingTip(LU, 1);
      for (let k = 0; k < 3; k++) {
        const tp = POPS[k], sw = tw(T, tp - 0.18, tp, E.i);
        const x = BAL2[k][0] + Math.sin(T * 1.0 + k * 2) * 8, y = BAL2[k][1] + Math.sin(T * 1.5 + k * 1.3) * 10, r = BAL2[k][2] * (1 + 0.16 * sw), ky = y + knotY(k, r);
        if (T < tp) {
          bez(c, hx, hy, lerp(hx, x, 0.3), lerp(hy, ky, 0.65), x, ky, al('#ffffff', 0.6), 2.5);
          balloon(c, k, x + Math.sin(T * 50) * 3 * sw, y, r, { rot: Math.sin(T * 1.1 + k) * 0.07 });
        } else {
          const f = prog(T, tp, tp + 0.7);
          if (f < 1) bez(c, hx, hy, lerp(hx, x, 0.3) + 30 * f, lerp(hy, ky, 0.65) + 160 * f, lerp(x, hx + (k - 1) * 40, f), lerp(ky, hy + 150, E.i(f)), al('#ffffff', 0.6 * (1 - f)), 2.5);
          popFx(c, x, y, T, tp, KCOL[k], BAL2[k][2], k + 3);
          burst(c, x, y, T, tp, KCOL[k], 8, 120, k + 3);
        }
      }
      owl(c, LUMI, LU);
      tag(c, 'PARECER QUE SABE', 566, 150, 24, al('#ffffff', 0.14), '#ffffff', pop(T, tPar, 0.4) * (1 - tt));

      // direita: raízes em corte (crescem de cima para baixo e passam a pulsar)
      const seg = (x0: number, y0: number, x1: number, y1: number, t0: number, i: number) => {
        const p = tw(T, t0, t0 + 0.32, E.o);
        if (p <= 0) return;
        line(c, x0, y0, lerp(x0, x1, p), lerp(y0, y1, p), al(P.teal, 0.75), 6);
        if (p >= 1) {
          const u = (T * 0.7 + i * 0.23) % 1;
          circ(c, lerp(x0, x1, u), lerp(y0, y1, u), 5, '#ffffff');
        }
      };
      glow(c, 1440, 960, 420, P.teal, 0.22 * rs);
      STEM.forEach((s, i) => seg(s[0], GY + 6, ROOT[i][0], ROOT[i][1], tReal - 0.45 + i * 0.08, i));
      RSEG.forEach(([a, b], j) => seg(ROOT[a][0], ROOT[a][1], ROOT[b][0], ROOT[b][1], tReal - 0.2 + (b > 6 ? 0.3 : 0) + j * 0.03, j + 3));
      ROOT.forEach((n, i) => idea(c, i, n[0], n[1], 14 * pop(T, tReal - 0.3 + (i > 6 ? 0.45 : i > 2 ? 0.15 : 0) + i * 0.03, 0.4), { g: 0.8 }));
      // caules e ideias sólidas: brotos discretos antes, crescem em "realmente saber"
      STEM.forEach(([sx, h], i) => {
        const g = 0.16 + 0.84 * spring(T, tReal - 0.5 + i * 0.14, 0.9), top = GY - h * g, sway = Math.sin(T * 1.4 + i) * 6 * g;
        bez(c, sx, GY, sx + sway * 0.4, GY - h * g * 0.5, sx + sway, top + 30 * g, '#1FB8A0', 5 + 6 * g);
        for (const sd of [-1, 1]) ell(c, sx + sd * 17 * g + sway * 0.3, GY - h * g * 0.42, 20 * g, 8 * g, '#1FB8A0', sd * -0.5);
        idea(c, i, sx + sway, top, 12 + 40 * g, { eyes: g > 0.6 });
      });
      owl(c, BRASA, {
        x: 1745, y: GY, s: 0.92, t: T, seed: 2, face: -0.3,
        ...moodK(T, [[0, 'neutral'], [tReal - 0.1, 'happy'], [tReal + 0.6, 'proud'], [tTit + 0.4, 'happy']], 0.2),
        wl: 0.12 + 1.98 * tw(T, tReal - 0.1, tReal + 0.3, E.back) * (1 - tw(T, tTit - 0.2, tTit + 0.3)) + (2.0 + 0.35 * Math.sin(T * 9)) * win(T, tTit + 1.0, tTit + 2.6, 0.25),
        look: [-0.6, -0.6 * tw(T, tTit, tTit + 0.4) * (1 - tw(T, tTit + 1.0, tTit + 1.4))],
        hop: arc(prog(T, tReal + 0.05, tReal + 0.4)) * 20,
      });
      tag(c, 'SABER DE VERDADE', 1440, 452, 24, al('#ffffff', 0.14), '#ffffff', pop(T, tReal, 0.4) * (1 - tt));

      // ponte de luz: nasce do lado de quem sabe e vem buscar Lumi
      for (let j = 0; j < 9; j++) {
        const k = pop(T, tTit + 0.9 + j * 0.075, 0.4);
        if (k <= 0) continue;
        const u = 1 - (j + 0.5) / 9, [px, py] = qb(LX, GY - 6, 960, GY - 96, RX, GY - 6, u), [qx, qy] = qb(LX, GY - 6, 960, GY - 96, RX, GY - 6, u + 0.02);
        c.save();
        c.translate(px, py);
        c.rotate(Math.atan2(qy - py, qx - px));
        c.scale(k, k);
        glow(c, 0, 0, 40, P.teal, 0.5);
        box(c, -15, -5, 30, 10, 5, '#8AF2F0');
        c.restore();
      }
      const bp = tw(T, tTit + 0.9, tTit + 1.7);
      if (bp > 0) {
        bez(c, RX, GY - 40, 960, GY - 136, LX, GY - 40, al('#8AF2F0', 0.5), 3, bp);
        if (bp >= 1) {
          const [gx, gy] = qb(RX, GY - 40, 960, GY - 136, LX, GY - 40, (T * 0.5) % 1);
          glow(c, gx, gy, 40, '#ffffff', 0.7);
          circ(c, gx, gy, 5, '#ffffff');
        }
      }
    });
    layer(c, cm, 1.35, () => {
      // só do lado de Lumi: nada em primeiro plano pode tapar as raízes
      ell(c, -60, 1190, 430, 170, '#06052A');
      for (let i = 0; i < 6; i++) {
        const gx = 60 + i * 46, a = -0.35 + i * 0.14 + Math.sin(T * 1.1 + i) * 0.05, len = 130 + hash(i) * 110;
        poly(c, [gx - 13, 1120, gx + 13, 1120, gx + Math.sin(a) * len, 1120 - Math.cos(a) * len], '#06052A', 4);
      }
    });
    // título: composição própria, no céu entre as duas margens
    if (T > tTit - 0.02) {
      glow(c, 960, 290, 720, P.royal, 0.4 * tt);
      const chars = Array.from('APRENDER'), size = 176, ls = 6, ws = chars.map((ch) => textW(c, ch, size, 900));
      let px = 960 - (ws.reduce((a, b) => a + b, 0) + ls * (chars.length - 1)) / 2;
      chars.forEach((ch, i) => {
        const t0 = tTit + i * 0.04, s = pop(T, t0, 0.42), dy = -110 * (1 - tw(T, t0, t0 + 0.3, E.o)), land = 0.14 * wob(T, t0 + 0.26, 17, 8);
        if (s > 0) {
          c.save();
          c.translate(px + ws[i] / 2, 288 + dy);
          c.scale(s * (1 + land), s * (1 - land));
          txt(c, ch, 0, -52, size, '#C2570E', { w: 900 });
          txt(c, ch, 0, -60, size, P.yellow, { w: 900 });
          c.restore();
        }
        px += ws[i] + ls;
      });
      const s2 = pop(T, tTit + 0.38, 0.5), ul = tw(T, tTit + 0.55, tTit + 0.95, E.o);
      c.save();
      c.translate(960, 352);
      c.scale(s2, s2);
      txt(c, 'DE VERDADE', 0, 0, 96, '#ffffff', { w: 800, ls: 10 });
      c.restore();
      if (ul > 0) line(c, 960 - 300 * ul, 406, 960 + 300 * ul, 406, P.teal, 8);
      tag(c, 'o que a ciência diz sobre estudar', 960, 450, 28, al('#ffffff', 0.14), '#ffffff', pop(T, tTit + 0.8, 0.4));
      burst(c, 960, 228, T, tTit, P.yellow, 14, 520, 9);
      for (let i = 0; i < 6; i++) spark(c, 960 + (hash(i + 3) - 0.5) * 1180, 110 + hash(i + 11) * 300, 13 * tt * (0.5 + 0.5 * Math.sin(T * 3 + i * 1.9)), i % 2 ? '#ffffff' : P.yellow, T * 0.6);
    }
    dust(c, T, 30, 9, '#ffffff', { a: 0.3 });
    vignette(c, 0.5);
  },
};
export const S1: ShotDef[] = [A, B, C, D];
