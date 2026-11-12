import { useCallback, useEffect, useRef, useState } from 'react';
import { renderFrame, EV, END, SECS, cueAt, secAt, shotAt } from './film';
import { audioUrl } from './film/audioSrc';
const trilha = audioUrl();

declare global {
  interface Window { seek: (t: number) => void; READY: boolean; END: number; EV: typeof EV }
}
const POSTER_T = 25.2;
export const SEC_COL = ['#6535A8', '#243CDB', '#22D7DA', '#ED4BA4', '#8CAAF7', '#33B9D7', '#FF851D', '#FFD244'];
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export default function Player({ api }: { api: React.MutableRefObject<{ seek: (t: number, play?: boolean) => void; pause: () => void } | null> }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const au = useRef<HTMLAudioElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const clock = useRef({ t: 0, at: 0, playing: false });
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [cc, setCc] = useState(false);
  const [muted, setMuted] = useState(false);
  const [src, setSrc] = useState('');

  const draw = useCallback((tt: number) => {
    const c = cv.current?.getContext('2d');
    if (c) renderFrame(c, tt);
  }, []);

  const seek = useCallback((tt: number, play?: boolean) => {
    const v = Math.max(0, Math.min(END, tt));
    clock.current.t = v;
    clock.current.at = performance.now();
    if (au.current) au.current.currentTime = Math.min(v, END - 0.05);
    setT(v);
    draw(v);
    if (play && au.current) {
      au.current.play().catch(() => {});
      clock.current.playing = true;
      setPlaying(true);
    }
  }, [draw]);

  const toggle = useCallback(() => {
    const a = au.current;
    if (clock.current.playing) {
      a?.pause();
      clock.current.playing = false;
      setPlaying(false);
    } else {
      if (clock.current.t >= END - 0.05) seek(0);
      clock.current.at = performance.now();
      a?.play().catch(() => {});
      clock.current.playing = true;
      setPlaying(true);
    }
  }, [seek]);

  const pause = useCallback(() => {
    au.current?.pause();
    clock.current.playing = false;
    setPlaying(false);
  }, []);

  useEffect(() => {
    let dead = false;
    if (trilha) fetch(trilha).then((r) => r.blob()).then((b) => !dead && setSrc(URL.createObjectURL(b))).catch(() => setSrc(trilha));
    const fonts = (document as Document).fonts;
    Promise.all([500, 600, 700, 800, 900].map((w) => fonts.load(`${w} 40px Poppins`))).catch(() => {}).then(() => {
      if (dead) return;
      // capa: o quadro 0 é o fade-in (preto); enquanto nada tocou, mostra o título do filme
      if (clock.current.t === 0 && !clock.current.playing) draw(POSTER_T);
      else draw(clock.current.t);
      setReady(true);
      window.READY = true;
    });
    window.END = END;
    window.EV = EV;
    window.seek = (x: number) => {
      au.current?.pause();
      clock.current.playing = false;
      setPlaying(false);
      seek(x);
    };
    api.current = { seek, pause };
    let raf = 0;
    const loop = () => {
      const k = clock.current;
      if (k.playing) {
        const now = performance.now();
        let tt = k.t + (now - k.at) / 1000;
        const a = au.current;
        if (a && !a.paused && a.readyState > 2 && Math.abs(a.currentTime - tt) > 0.07) tt = a.currentTime; // re-sincroniza com o áudio
        else if (a && a.paused && a.readyState > 2 && tt < END - 0.1) {
          a.currentTime = tt; // o áudio ficou pronto depois do clique: entra já no ponto certo
          a.play().catch(() => {});
        }
        k.t = tt;
        k.at = now;
        if (tt >= END) {
          k.t = END;
          k.playing = false;
          a?.pause();
          setPlaying(false);
        }
        draw(k.t);
        setT(k.t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowRight') seek(clock.current.t + 5);
      if (e.code === 'ArrowLeft') seek(clock.current.t - 5);
    };
    window.addEventListener('keydown', key);
    return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', key); };
  }, [api, draw, seek, toggle]);

  const cue = cueAt(t), sec = secAt(t), shot = shotAt(t);
  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * END);
  };

  return (
    <div ref={wrap} className="group relative overflow-hidden rounded-2xl bg-[#050A2E] shadow-[0_30px_120px_-20px_rgba(36,60,219,0.65)] ring-1 ring-white/10">
      <canvas ref={cv} width={1920} height={1080} onClick={toggle} className="block aspect-video w-full cursor-pointer" aria-label="Filme de animação: Aprender de verdade" />
      <audio ref={au} src={src || undefined} preload="auto" muted={muted} />
      {!playing && (
        <button onClick={toggle} aria-label="Reproduzir" className="absolute inset-0 m-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFD244] text-[#180A59] shadow-2xl transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white">
          <svg viewBox="0 0 24 24" className="ml-1 h-10 w-10" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
        </button>
      )}
      {!ready && <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">carregando fontes…</div>}
      {cc && cue && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center px-6">
          <p className="max-w-3xl rounded-xl bg-black/70 px-4 py-2 text-center text-sm font-medium leading-snug text-white md:text-lg">{cue.text}</p>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10 md:px-5">
        <div onPointerDown={scrub} onPointerMove={(e) => e.buttons === 1 && scrub(e)} className="relative mb-2 flex h-4 cursor-pointer touch-none items-center gap-[3px]" role="slider" aria-label="Posição" aria-valuemin={0} aria-valuemax={300} aria-valuenow={Math.round(t)} tabIndex={0}>
          {SECS.map((s, i) => {
            const p = Math.max(0, Math.min(1, (t - s.start) / (s.end - s.start)));
            return (
              <div key={s.id} className="h-1.5 overflow-hidden rounded-full bg-white/25" style={{ flex: s.end - s.start }}>
                <div className="h-full rounded-full" style={{ width: `${p * 100}%`, background: SEC_COL[i] }} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-white">
          <button onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproduzir'} className="rounded-lg p-1.5 hover:bg-white/15">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">{playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4.5v15l13-7.5z" />}</svg>
          </button>
          <span className="font-mono text-xs tabular-nums md:text-sm">{fmt(t)} / 5:00</span>
          <span className="hidden truncate text-xs text-white/70 sm:block">{sec.id}. {sec.title} · plano {shot.id}</span>
          <span className="ml-auto" />
          <button onClick={() => setCc((v) => !v)} aria-pressed={cc} className={`rounded-md px-2 py-1 text-xs font-bold ${cc ? 'bg-[#FFD244] text-[#180A59]' : 'bg-white/15 hover:bg-white/25'}`}>CC</button>
          <button onClick={() => setMuted((v) => !v)} aria-pressed={muted} className="rounded-md bg-white/15 px-2 py-1 text-xs font-bold hover:bg-white/25">{muted ? 'som off' : 'som on'}</button>
          <button onClick={() => (document.fullscreenElement ? document.exitFullscreen() : wrap.current?.requestFullscreen())} aria-label="Tela cheia" className="rounded-lg p-1.5 hover:bg-white/15">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
