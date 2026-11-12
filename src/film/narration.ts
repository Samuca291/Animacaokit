// Narração: tempos medidos na locução real (gerados por tools/timeline.mjs).
import data from './data/narration.json';

export type Cue = { id: string; text: string; a: number; b: number; w: number[] };
export type Sec = { id: number; title: string; nominal: number[]; start: number; end: number; cues: Cue[] };
export const NARR = data as unknown as {
  total: number; source: string; engine: string | null; voice: string | null; speed: number | null; speech: number;
  aligned: boolean; match: number | null; alignModel: string | null; sections: Sec[];
};
export const END = 300;
export const SECS = NARR.sections;
/** frase n (1-indexada) da seção s */
export const q = (s: number, n: number): Cue => SECS[s - 1].cues[n - 1];
/** instante em que começa a palavra (ou fração 0..1) dentro de uma frase */
export function at(cu: Cue, word: string | number, nth = 0): number {
  if (typeof word === 'number') return cu.a + (cu.b - cu.a) * word;
  const ws = cu.text.split(/\s+/), key = word.toLowerCase();
  let k = 0;
  for (let i = 0; i < ws.length; i++) if (ws[i].toLowerCase().includes(key) && k++ === nth) return cu.w[i] ?? cu.a;
  return cu.a;
}
export const cueAt = (t: number): Cue | null => {
  for (const s of SECS) for (const cu of s.cues) if (t >= cu.a && t < cu.b) return cu;
  return null;
};
export const secAt = (t: number): Sec => SECS.find((s) => t < s.end) ?? SECS[SECS.length - 1];
/** abertura do bico sincronizada à fala: um ciclo por sílaba estimada, ancorado no início real de cada palavra */
export function talk(t: number): number {
  const cu = cueAt(t);
  if (!cu) return 0;
  const ws = cu.text.split(/\s+/);
  let i = 0;
  while (i < cu.w.length - 1 && cu.w[i + 1] <= t) i++;
  const w0 = cu.w[i], w1 = i < cu.w.length - 1 ? cu.w[i + 1] : cu.b;
  const syl = Math.max(1, (ws[i].match(/[aeiouáéíóúâêôãõà]+/gi) || []).length);
  const u = (t - w0) / Math.max(0.05, w1 - w0);
  if (u < 0 || u > 1) return 0;
  return 0.18 + 0.7 * Math.abs(Math.sin(u * syl * Math.PI));
}
