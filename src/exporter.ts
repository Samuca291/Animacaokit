// Exporta o filme inteiro direto no navegador (WebCodecs + mp4-muxer). Sem servidor:
// cada quadro é desenhado pelo mesmo motor do player, codificado e montado num MP4 na memória.
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { renderFrame, END } from './film';
import { audioUrl } from './film/audioSrc';

export type Profile = { id: string; label: string; w: number; h: number; fps: number; vbr: number };
export const PROFILES: Profile[] = [
  { id: 'hd', label: '1080p · 60 fps', w: 1920, h: 1080, fps: 60, vbr: 6_000_000 },
  { id: 'fast', label: '720p · 30 fps (rápido)', w: 1280, h: 720, fps: 30, vbr: 3_000_000 },
];
const ABR = 160_000, SR = 48000;
const VIDEO = [
  { codec: 'avc1.640028', mux: 'avc' as const },
  { codec: 'avc1.4d0028', mux: 'avc' as const },
  { codec: 'avc1.42e028', mux: 'avc' as const },
  { codec: 'vp09.00.40.08', mux: 'vp9' as const },
];
const AUDIO = [
  { codec: 'mp4a.40.2', mux: 'aac' as const },
  { codec: 'opus', mux: 'opus' as const },
];
export type Progress = (p: number, label: string, etaSec?: number) => void;
const tick = () => new Promise<void>((r) => setTimeout(r, 0));

export function exportSupported(): boolean {
  return typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';
}

export async function exportMp4(o: { profile: Profile; seconds?: number; onProgress: Progress; isCancelled?: () => boolean }): Promise<{ blob: Blob; audio: string; video: string }> {
  if (!exportSupported()) throw new Error('Este navegador não tem WebCodecs. Use Chrome ou Edge para baixar o vídeo.');
  const { w: W, h: H, fps: FPS, vbr: VBR } = o.profile;
  const secs = Math.min(END, o.seconds ?? END);
  const frames = Math.round(secs * FPS);

  let v: (typeof VIDEO)[number] | null = null;
  for (const c of VIDEO) {
    try {
      const s = await VideoEncoder.isConfigSupported({ codec: c.codec, width: W, height: H, bitrate: VBR, framerate: FPS });
      if (s.supported) { v = c; break; }
    } catch { /* tenta o próximo */ }
  }
  if (!v) throw new Error('O navegador não aceita nenhum codec de vídeo compatível.');

  // áudio: opcional (se a trilha ou o codificador faltarem, o vídeo sai mudo em vez de falhar)
  let a: (typeof AUDIO)[number] | null = null;
  let mix: AudioBuffer | null = null;
  const url = audioUrl();
  if (url && typeof AudioEncoder !== 'undefined' && typeof AudioData !== 'undefined') {
    for (const c of AUDIO) {
      try {
        const s = await AudioEncoder.isConfigSupported({ codec: c.codec, sampleRate: SR, numberOfChannels: 2, bitrate: ABR });
        if (s.supported) { a = c; break; }
      } catch { /* tenta o próximo */ }
    }
    if (a) {
      o.onProgress(0, 'decodificando a trilha');
      const bytes = await (await fetch(url)).arrayBuffer();
      const actx = new AudioContext();
      const decoded = await actx.decodeAudioData(bytes);
      await actx.close();
      const off = new OfflineAudioContext(2, Math.ceil(secs * SR), SR);
      const src = off.createBufferSource();
      src.buffer = decoded;
      src.connect(off.destination);
      src.start(0);
      mix = await off.startRendering();
    }
  }

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    video: { codec: v.mux, width: W, height: H, frameRate: FPS },
    ...(a && mix ? { audio: { codec: a.mux, numberOfChannels: 2, sampleRate: SR } } : {}),
    fastStart: 'in-memory',
  });
  const st = { err: null as Error | null };
  const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { st.err = e as Error; } });
  venc.configure({ codec: v.codec, width: W, height: H, bitrate: VBR, framerate: FPS, latencyMode: 'quality' });

  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D indisponível.');
  const k = W / 1920;
  const dur = Math.round(1e6 / FPS);
  const t0 = performance.now();
  let lastP = -1;
  for (let f = 0; f < frames; f++) {
    if (o.isCancelled?.()) { venc.close(); throw new Error('Exportação cancelada.'); }
    ctx.setTransform(k, 0, 0, k, 0, 0); // o motor desenha em 1920×1080; escala para o perfil escolhido
    renderFrame(ctx, f / FPS);
    const vf = new VideoFrame(cv, { timestamp: Math.round((f * 1e6) / FPS), duration: dur });
    venc.encode(vf, { keyFrame: f % (FPS * 2) === 0 });
    vf.close();
    if (st.err) throw st.err;
    while (venc.encodeQueueSize > 6) await tick();
    const p = (f + 1) / frames;
    if (p - lastP >= 0.004) {
      lastP = p;
      const el = (performance.now() - t0) / 1000;
      o.onProgress(p * (mix ? 0.94 : 0.99), 'desenhando e codificando o vídeo', p > 0.02 ? (el / p) * (1 - p) : undefined);
    }
    if (f % 10 === 0) await tick();
  }
  await venc.flush();
  venc.close();

  if (a && mix) {
    o.onProgress(0.95, 'codificando o áudio');
    const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: (e) => { st.err = e as Error; } });
    aenc.configure({ codec: a.codec, sampleRate: SR, numberOfChannels: 2, bitrate: ABR });
    const L = mix.getChannelData(0), R = mix.getChannelData(1);
    const total = Math.min(L.length, Math.round(secs * SR));
    const CH = 4800;
    for (let i = 0; i < total; i += CH) {
      const n = Math.min(CH, total - i);
      const data = new Float32Array(n * 2);
      data.set(L.subarray(i, i + n), 0);
      data.set(R.subarray(i, i + n), n);
      const ad = new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round((i * 1e6) / SR), data });
      aenc.encode(ad);
      ad.close();
      while (aenc.encodeQueueSize > 8) await tick();
    }
    await aenc.flush();
    aenc.close();
  }
  if (st.err) throw st.err;
  muxer.finalize();
  o.onProgress(1, 'pronto');
  return { blob: new Blob([target.buffer], { type: 'video/mp4' }), audio: a && mix ? a.mux.toUpperCase() : 'sem áudio', video: v.mux === 'avc' ? 'H.264' : 'VP9' };
}
