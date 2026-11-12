// Trilha: música original e efeitos sintetizados em JS puro (sem samples de terceiros),
// narração Kokoro posicionada pelos cues, ducking automático, normalização de loudness e MP3.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import { loadFilm } from './frames.mjs';

const WORK = process.env.WORK || '/tmp/aprender';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const F = await loadFilm();
const SR = 44100, DUR = 300, N = SR * DUR, TAU = Math.PI * 2;
const mk = () => [new Float32Array(N), new Float32Array(N)];
const MUS = mk(), ECH = mk(), SFX = mk();
const V = new Float32Array(N);
let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function add(bus, t, dur, fn, gain = 1, pan = 0) {
  const i0 = Math.floor(t * SR), n = Math.floor(dur * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4), gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < n; i++) {
    const k = i0 + i;
    if (k < 0 || k >= N) continue;
    const v = fn(i / SR, i / n);
    bus[0][k] += v * gl;
    bus[1][k] += v * gr;
  }
}
const pad = (m, t, d, g, pan) => { const f = mtof(m); add(MUS, t, d + 0.9, (x) => (Math.sin(TAU * f * x) + 0.35 * Math.sin(TAU * f * 2.003 * x) + 0.14 * Math.sin(TAU * f * 3 * x)) * Math.min(1, x / 0.6) * Math.min(1, (d + 0.9 - x) / 0.9) * (0.85 + 0.15 * Math.sin(x * 3.1)), g, pan); };
const pluck = (m, t, g, pan) => { const f = mtof(m); add(ECH, t, 0.9, (x) => (Math.sin(TAU * f * x) + 0.5 * Math.sin(TAU * f * 2 * x) * Math.exp(-x * 9)) * Math.exp(-x * 5.5) * Math.min(1, x / 0.004), g, pan); };
const bell = (m, t, g, pan, bus = ECH) => { const f = mtof(m); add(bus, t, 1.6, (x) => (Math.sin(TAU * f * x) * Math.exp(-x * 3.2) + 0.35 * Math.sin(TAU * f * 2.76 * x) * Math.exp(-x * 7)) * Math.min(1, x / 0.003), g, pan); };
const bass = (m, t, d, g) => { const f = mtof(m); add(MUS, t, d, (x, u) => (Math.sin(TAU * f * x) + 0.25 * Math.sin(TAU * f * 2 * x)) * Math.exp(-x * 2.2) * Math.min(1, x / 0.01) * Math.min(1, (1 - u) * 12), g, 0); };
const kick = (t, g) => add(MUS, t, 0.26, (x) => Math.sin(TAU * (46 * x + (74 / 28) * (1 - Math.exp(-28 * x)))) * Math.exp(-x * 11), g, 0);
const hat = (t, g, pan) => { let p = 0; add(MUS, t, 0.05, (x) => { const r = rnd(), v = r - p; p = r; return v * Math.exp(-x * 70); }, g, pan); };

/* ---------- música: 96 BPM, 120 compassos ---------- */
const CH = { Am: [45, 57, 60, 64, 71], F: [41, 53, 57, 60, 64], C: [48, 55, 60, 64, 67], G: [43, 55, 59, 62, 69], Em: [40, 52, 55, 59, 66], Dm: [38, 50, 57, 60, 65] };
const PROG = { 1: ['Am', 'F', 'Am', 'Em'], 2: ['Am', 'F', 'C', 'G'], 3: ['C', 'Am', 'F', 'G'], 4: ['F', 'G', 'Em', 'Am'], 5: ['F', 'Am', 'Dm', 'C'], 6: ['C', 'G', 'Am', 'F'], 7: ['Am', 'Em', 'F', 'G'], 8: ['F', 'G', 'Am', 'C'] };
const BEAT = 0.625, BAR = 2.5;
const cue = (id) => F.EV.narration.find((x) => x.id === id);
const calmA = cue('7.8').t, calmB = cue('7.10').t;
for (let b = 0; b < 120; b++) {
  const t = b * BAR, sec = F.secAt(t + 0.2).id, last = b >= 118;
  const ch = CH[last ? 'C' : PROG[sec][b % 4]];
  const calm = t >= calmA - 1 && t < calmB;
  if (b < 118 || b === 118) ch.slice(1).forEach((m, i) => pad(m, t, last ? 4.2 : BAR, sec === 5 ? 0.085 : 0.06, (i - 1.5) * 0.4));
  if (b === 119) continue;
  bass(ch[0], t, BEAT * 2.4, sec === 5 || sec === 1 ? 0.2 : 0.3);
  if (sec !== 5 && sec !== 1 && !calm) bass(ch[0] + (b % 2 ? 7 : 0), t + BEAT * 2.5, BEAT * 1.4, 0.22);
  const drums = (sec === 3 || sec === 4 || sec === 6 || sec === 8 || (sec === 2 && t > cue('2.5').t) || (sec === 7 && !calm)) && !last;
  if (drums) {
    kick(t, 0.5);
    kick(t + BEAT * 2, 0.42);
    if (sec === 6) kick(t + BEAT * 3.5, 0.3);
    for (let k = 0; k < 8; k++) hat(t + k * BEAT * 0.5, k % 2 ? 0.1 : 0.05, k % 2 ? 0.3 : -0.3);
  }
  if (sec === 1) [0, 2, 3].forEach((k, i) => bell(ch[2 + ((b + i) % 3)] + 12, t + k * BEAT, 0.09, i % 2 ? 0.4 : -0.4));
  else if (sec === 5) [0, 1.5, 3].forEach((k, i) => bell(ch[1 + ((b + i * 2) % 4)] + 12, t + k * BEAT, 0.1, i % 2 ? 0.5 : -0.5));
  else if (last) [0, 1, 2, 3].forEach((k) => bell(ch[1 + k] + 12, t + k * BEAT * 0.5, 0.14, k % 2 ? 0.4 : -0.4));
  else if (!calm) {
    const pat = sec === 6 ? [0, 3, 1, 4, 2, 4, 1, 3] : [1, 2, 3, 4, 3, 2, 4, 3];
    pat.forEach((k, i) => { if (sec === 2 && t < cue('2.4').t && i % 2) return; pluck(ch[k] + (sec === 6 && i % 2 ? 24 : 12), t + i * BEAT * 0.5, 0.1, i % 2 ? 0.45 : -0.45); });
  }
}
// eco estéreo cruzado nos timbres percussivos
const D = Math.floor(0.469 * SR);
for (let i = D; i < N; i++) { ECH[0][i] += 0.3 * ECH[1][i - D]; ECH[1][i] += 0.3 * ECH[0][i - D]; }
for (let i = 0; i < N; i++) { MUS[0][i] += ECH[0][i]; MUS[1][i] += ECH[1][i]; }

/* ---------- efeitos ---------- */
const sweep = (f0, f1, d) => (x, u) => Math.sin(TAU * (f0 * x + ((f1 - f0) * x * x) / (2 * d))) * Math.sin(Math.PI * Math.min(1, u * 1.02)) ;
const noiseLP = (a0, a1) => { let y = 0; return (x, u) => { const a = a0 + (a1 - a0) * Math.sin(Math.PI * u); y += a * (rnd() - y); return y * Math.sin(Math.PI * u); }; };
const noiseHP = (k) => { let p = 0; return (x, u) => { const r = rnd(), v = r - p; p = r; return v * Math.exp(-u * k); }; };
function sfx(type, t, g) {
  const pan = Math.sin(t * 12.7) * 0.5;
  switch (type) {
    case 'pop': add(SFX, t, 0.09, sweep(480, 980, 0.09), g * 0.5, pan); break;
    case 'bubble': add(SFX, t, 0.13, sweep(380, 1500, 0.13), g * 0.45, pan); add(SFX, t, 0.04, noiseHP(6), g * 0.15, pan); break;
    case 'tick': add(SFX, t, 0.035, (x) => Math.sin(TAU * 1900 * x) * Math.exp(-x * 130), g * 0.35, pan); break;
    case 'whoosh': add(SFX, t, 0.55, noiseLP(0.02, 0.5), g * 0.9, -0.6); add(SFX, t + 0.05, 0.5, noiseLP(0.02, 0.4), g * 0.9, 0.6); break;
    case 'sparkle': for (let i = 0; i < 7; i++) bell(84 + [0, 4, 7, 12, 16, 19, 24][i], t + i * 0.055, g * 0.09, (i / 3 - 1) * 0.7, SFX); break;
    case 'thud': add(SFX, t, 0.24, (x) => Math.sin(TAU * (48 * x + (70 / 26) * (1 - Math.exp(-26 * x)))) * Math.exp(-x * 13), g * 0.7, 0); add(SFX, t, 0.08, noiseLP(0.2, 0.3), g * 0.35, pan); break;
    case 'ding': bell(84, t, g * 0.2, pan, SFX); bell(91, t + 0.07, g * 0.14, -pan, SFX); break;
    case 'chime': [79, 84, 88, 91].forEach((m, i) => bell(m, t + i * 0.07, g * 0.16, (i - 1.5) * 0.4, SFX)); break;
    case 'buzz': add(SFX, t, 0.28, (x, u) => (Math.sign(Math.sin(TAU * 148 * x)) * 0.5 + Math.sin(TAU * 157 * x)) * Math.sin(Math.PI * u), g * 0.16, pan); break;
    case 'page': add(SFX, t, 0.16, noiseHP(3), g * 0.3, pan); break;
    case 'slam': sfx('thud', t, g); add(SFX, t, 0.06, noiseHP(8), g * 0.4, pan); break;
    case 'zip': add(SFX, t, 0.22, sweep(320, 1500, 0.22), g * 0.3, pan); break;
    case 'drop': add(SFX, t, 0.3, sweep(900, 230, 0.3), g * 0.32, pan); break;
    case 'mech': for (let i = 0; i < 5; i++) add(SFX, t + i * 0.06, 0.03, (x) => Math.sin(TAU * (700 + i * 90) * x) * Math.exp(-x * 150), g * 0.3, pan); add(SFX, t, 0.36, (x, u) => Math.sin(TAU * 82 * x) * Math.sin(Math.PI * u), g * 0.25, pan); break;
    case 'riser': add(SFX, t, 0.9, (x, u) => { const v = Math.sin(TAU * (200 * x + 500 * x * x)) * 0.4 + rnd() * 0.25; return v * u * u; }, g * 0.4, 0); break;
  }
}
for (const e of F.EV.sfx) sfx(e.type, e.t, e.gain);

/* ---------- narração ---------- */
function readWav(p) {
  const b = fs.readFileSync(p);
  let o = 12, sr = 24000;
  while (o < b.length - 8) {
    const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') sr = b.readUInt32LE(o + 12);
    if (id === 'data') { const n = sz / 2, x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = b.readInt16LE(o + 8 + i * 2) / 32768; return { x, sr }; }
    o += 8 + sz + (sz % 2);
  }
  throw new Error('wav inválido ' + p);
}
let vpk = 0, voiced = 0;
for (const cu of F.EV.narration) {
  const p = path.join(WORK, 'voice', cu.id + '.wav');
  if (!fs.existsSync(p)) continue;
  const { x, sr } = readWav(p), i0 = Math.round(cu.t * SR), n = Math.floor((x.length * SR) / sr);
  for (let i = 0; i < n && i0 + i < N; i++) {
    const s = (i * sr) / SR, k = Math.floor(s), fr = s - k;
    const v = (x[k] || 0) * (1 - fr) + (x[k + 1] || 0) * fr;
    V[i0 + i] += v * Math.min(1, i / 200, (n - i) / 400);
    vpk = Math.max(vpk, Math.abs(v));
  }
  voiced++;
}
const vg = vpk > 0 ? 0.82 / vpk : 1;

/* ---------- ducking e mixagem ---------- */
const duck = new Float32Array(N);
for (const cu of F.EV.narration) { const a = Math.max(0, Math.floor((cu.t - 0.1) * SR)), b = Math.min(N, Math.floor((cu.end + 0.15) * SR)); duck.fill(1, a, b); }
let env = 0;
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVEfmt ', 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  env += (duck[i] - env) * (duck[i] > env ? 0.0006 : 0.00012);
  const t = i / SR, fade = Math.min(1, t / 0.6, (DUR - 0.25 - t) / 1.6 < 0 ? 0 : (DUR - 0.25 - t) / 1.6);
  const mg = (0.95 - 0.6 * env) * fade, sg = (0.9 - 0.3 * env) * fade, v = V[i] * vg;
  const l = Math.tanh(v + MUS[0][i] * mg + SFX[0][i] * sg), r = Math.tanh(v + MUS[1][i] * mg + SFX[1][i] * sg);
  out.writeInt16LE(Math.round(l * 32000), 44 + i * 4);
  out.writeInt16LE(Math.round(r * 32000), 46 + i * 4);
}
const wav = path.join(WORK, 'mix.wav');
fs.writeFileSync(wav, out);
const dst = path.join(root, 'src/assets/trilha.mp3');
fs.mkdirSync(path.dirname(dst), { recursive: true });
const run = (args) => { try { return execFileSync(ffmpeg, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { return (e.stderr || '').toString(); } };
execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-14:TP=-2:LRA=11,alimiter=limit=0.75:level=0,aresample=44100', '-t', '300', '-c:a', 'libmp3lame', '-b:a', '96k', dst], { stdio: 'inherit' });
// cópia em texto: arquivos binários podem sumir do workspace entre sessões; JSON permanece
fs.writeFileSync(path.join(root, 'src/film/data/trilha.b64.json'), JSON.stringify({ mime: 'audio/mpeg', data: fs.readFileSync(dst).toString('base64') }));
const rep = run(['-hide_banner', '-nostats', '-i', dst, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
let lufs = null, peak = null;
try {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(ffmpeg, ['-hide_banner', '-nostats', '-i', dst, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
  const tail = (r.stderr || '').split('Summary:').pop() || '';
  lufs = +(tail.match(/I:\s+(-?[\d.]+) LUFS/) || [])[1];
  peak = +(tail.match(/Peak:\s+(-?[\d.]+) dBFS/) || [])[1];
} catch {}
void rep;
const info = { voiced, sfx: F.EV.sfx.length, bytes: fs.statSync(dst).size, lufs, peak };
fs.writeFileSync(path.join(WORK, 'audio-report.json'), JSON.stringify(info));
console.log('trilha ok', info);
