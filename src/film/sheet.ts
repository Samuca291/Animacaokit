// Folha de personagens: mesmas peças do rig usadas no filme (vistas, expressões e poses).
import { Ctx, W, H, P, bg, txt, box, al, shadow, glow, idea } from './core';
import { owl, LUMI, BRASA, IRIS, NILO, Owl } from './owl';

const POSES: [string, Partial<Owl>][] = [
  ['frente', {}], ['¾', { face: 0.5 }], ['perfil', { face: 1 }], ['costas', { back: true }], ['andando', { face: 0.5, walk: 0.2 }],
  ['feliz', { mood: 'happy' }], ['confusa', { mood: 'confused', tilt: -0.1, look: [-0.3, -0.5] }], ['surpresa', { mood: 'surprised', sq: -0.06 }], ['preocupada', { mood: 'worried', look: [0, 0.3] }], ['apontando', { face: 0.4, wr: 2.2, mood: 'happy' }],
];
export function drawSheet(c: Ctx, t = 0) {
  bg(c, '#1B0E63', '#09134B');
  glow(c, 700, 500, 900, P.royal, 0.25);
  txt(c, 'LUMI — protagonista', 90, 70, 34, '#ffffff', { w: 800, al: 'left' });
  POSES.forEach(([label, o], i) => {
    const x = 190 + (i % 5) * 268, y = 470 + Math.floor(i / 5) * 480;
    box(c, x - 120, y - 370, 240, 420, 28, al('#ffffff', 0.05));
    shadow(c, x, y, 80);
    owl(c, LUMI, { x, y, s: 0.92, t: t + i * 0.7, seed: 1 + i, ...o });
    txt(c, label, x, y + 76, 24, al('#ffffff', 0.8), { w: 600 });
  });
  [BRASA, IRIS, NILO].forEach((p, i) => {
    const x = 1620, y = 330 + i * 320;
    box(c, 1460, y - 280, 380, 300, 28, al('#ffffff', 0.05));
    shadow(c, x - 60, y - 20, 70);
    owl(c, p, { x: x - 60, y: y - 20, s: 0.72, t: t + i, seed: 3 + i, face: -0.3, mood: i === 0 ? 'happy' : 'neutral', wl: i === 1 ? 2.0 : 0.12 });
    txt(c, p.name, x + 40, y - 150, 30, '#ffffff', { w: 800, al: 'left' });
    txt(c, ['a que recupera', 'a pesquisadora', 'colega/figurante'][i], x + 40, y - 112, 20, al('#ffffff', 0.7), { w: 500, al: 'left' });
  });
  for (let i = 0; i < 3; i++) idea(c, i, 1330 + i * 62, H - 46, 22, { eyes: true });
  txt(c, 'ideias = unidades de informação', 1840, H - 46, 20, al('#ffffff', 0.7), { w: 500, al: 'right' });
  void W;
}
