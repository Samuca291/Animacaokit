import { useEffect, useRef, useState } from 'react';
import Player, { SEC_COL } from './Player';
import { SHOTS, SECS, NARR, EV, END, renderFrame, drawSheet } from './film';
import { exportMp4, exportSupported, PROFILES, type Profile } from './exporter';
import { HAS_AUDIO } from './film/audioSrc';

const fmt = (t: number) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
const PALETTE: [string, string][] = [
  ['#09134B', 'fundo profundo · mistério'], ['#180A59', 'violeta noturno'], ['#243CDB', 'azul-royal · laboratório'], ['#6535A8', 'roxo · tempo'],
  ['#22D7DA', 'verde-água · descoberta'], ['#33B9D7', 'ciano · energia'], ['#FF851D', 'laranja · calor e revelação'], ['#ED4BA4', 'rosa · acento e erro'],
  ['#FFD244', 'amarelo · destaque'], ['#8CAAF7', 'azul-claro · sono e apoio'],
];
const TR: Record<string, string> = { cut: 'corte seco', whipR: 'whip pan →', whipL: 'whip pan ←', whipU: 'whip pan ↑', whipD: 'whip pan ↓', iris: 'escala / íris', wipe: 'cortina de cor', flash: 'flash', band: 'faixa-objeto' };
const FACTS: [string, string, string, string][] = [
  ['Efeito do teste: reestudar pode vencer no teste imediato; recuperar vence após 2 dias e 1 semana.', 'Roediger & Karpicke (2006), Psychological Science', 'https://doi.org/10.1111/j.1467-9280.2006.01693.x', 'No filme aparecem só os valores publicados para 5 min (81% reestudar × 75% recuperar) e 1 semana (40% × 61%). Os de 2 dias não são exibidos. Confirme os números no artigo antes de publicar.'],
  ['Espaçar sessões favorece a retenção; não há intervalo universal — depende de por quanto tempo se quer lembrar.', 'Cepeda et al. (2006), Psychological Bulletin', 'https://doi.org/10.1037/0033-2909.132.3.354', 'A revisão reúne 317 experimentos em 184 artigos (839 avaliações), segundo o resumo publicado. O filme diz só "centenas" e mostra o intervalo esticando com o prazo.'],
  ['Prática de teste e prática distribuída têm o apoio mais forte; intercalar tem apoio mais condicionado; reler rende pouco.', 'Dunlosky et al. (2013), PSPI', 'https://doi.org/10.1177/1529100612453266', 'Usado para calibrar o tom: "costuma", "pode", "depois que compreendeu o básico".'],
  ['Durante o sono não REM, padrões ligados a experiências recentes podem ser reativados; isso participa da consolidação.', 'Rasch & Born (2013), Physiological Reviews', 'https://doi.org/10.1152/physrev.00032.2012', 'Metáfora visual de arquipélago e árvore, não de computador ou gravação. O texto não promete que tudo fica guardado.'],
  ['Intercalar tipos relacionados pode ajudar a discriminar qual estratégia usar; o efeito depende do material.', 'Firth, Rivers & Boyle (2021), Review of Education', 'https://doi.org/10.1002/rev3.3266', 'O roteiro mantém "pode" e reserva a mistura para depois do básico.'],
  ['"Dificuldade desejável" é o termo dos pesquisadores para obstáculos produtivos.', 'Bjork (1994); Bjork & Bjork (2011)', 'https://bjorklab.psych.ucla.edu/research/', 'Fonte adicional, fora da sua lista: o termo vem do trabalho de Robert e Elizabeth Bjork. Vale conferir antes de publicar.'],
];

let off: HTMLCanvasElement | null = null;
const offCtx = () => {
  if (!off) {
    off = document.createElement('canvas');
    off.width = 1920;
    off.height = 1080;
  }
  return off.getContext('2d')!;
};
function Thumb({ t, i }: { t: number; i: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      renderFrame(offCtx(), t);
      ref.current?.getContext('2d')?.drawImage(off!, 0, 0, 384, 216);
    }, 1500 + i * 90);
    return () => clearTimeout(id);
  }, [t, i]);
  return <canvas ref={ref} width={384} height={216} className="aspect-video w-full rounded-lg bg-[#09134B]" />;
}
function Sheet() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      const c = ref.current?.getContext('2d');
      if (c) drawSheet(c, 1.2);
    }, 1200);
    return () => clearTimeout(id);
  }, []);
  return <canvas ref={ref} width={1920} height={1080} className="aspect-video w-full rounded-2xl ring-1 ring-white/10" />;
}
const H2 = ({ k, children }: { k: string; children: React.ReactNode }) => (
  <h2 className="mb-6 flex items-baseline gap-3 text-2xl font-extrabold tracking-tight md:text-3xl">
    <span className="font-mono text-sm font-medium text-[#FFD244]">{k}</span>
    {children}
  </h2>
);

export default function App() {
  const api = useRef<{ seek: (t: number, play?: boolean) => void; pause: () => void } | null>(null);
  const [exp, setExp] = useState<{ p: number; label: string; eta?: number; id: string } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [file, setFile] = useState<{ url: string; name: string; mb: number } | null>(null);
  const [hidden, setHidden] = useState(false);
  const cancel = useRef(false);
  // ?exportSeconds=4 gera só os primeiros segundos (teste rápido); sem o parâmetro, gera o filme inteiro
  const testSec = typeof location !== 'undefined' ? Number(new URLSearchParams(location.search).get('exportSeconds')) || 0 : 0;
  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  const download = async (pf: Profile) => {
    api.current?.pause();
    cancel.current = false;
    setMsg(null);
    setExp({ p: 0, label: 'Preparando', id: pf.id });
    try {
      const r = await exportMp4({ profile: pf, seconds: testSec || END, isCancelled: () => cancel.current, onProgress: (p, label, eta) => setExp({ p, label, eta, id: pf.id }) });
      if (file) URL.revokeObjectURL(file.url);
      const url = URL.createObjectURL(r.blob);
      const name = `aprender-de-verdade-${testSec ? `teste-${testSec}s` : '5min'}-${pf.h}p${pf.fps}.mp4`;
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setFile({ url, name, mb: r.blob.size / 1048576 });
      setMsg({ ok: true, text: `Pronto: ${name} · ${(r.blob.size / 1048576).toFixed(0)} MB · ${r.video} + ${r.audio}. Se o download não começou, use o link ao lado.` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setExp(null);
    }
  };
  const fmtEta = (s?: number) => (s === undefined ? 'calculando o tempo…' : s > 90 ? `faltam ~${Math.round(s / 60)} min` : `faltam ~${Math.max(1, Math.round(s))} s`);
  const go = (t: number) => {
    api.current?.seek(t, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (typeof location !== 'undefined' && location.search.includes('render')) {
    return <div className="bg-black"><Player api={api} /></div>;
  }
  const trans = Array.from(new Set(SHOTS.map((s) => TR[s.tr ?? 'cut'])));
  return (
    <div className="min-h-screen bg-[#070A2B] text-[#F4F7FF]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(900px_500px_at_50%_0%,rgba(101,53,168,0.5),transparent)]" />
      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#22D7DA]">filme de animação 2D · explicativo</p>
            <h1 className="mt-2 text-4xl font-black leading-none tracking-tight md:text-6xl">Aprender <span className="text-[#FFD244]">de verdade</span></h1>
            <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">Estudo e a capacidade humana de aprender: por que alguns métodos só dão a sensação de saber, e quais ajudam a encontrar a informação depois.</p>
          </div>
          <dl className="grid grid-cols-4 gap-x-6 font-mono text-xs text-white/60">
            {[['duração', '5:00,000'], ['quadros', String(EV.frames)], ['formato', '1920×1080'], ['fps', '60']].map(([a, b]) => (
              <div key={a}><dt>{a}</dt><dd className="text-base font-semibold text-white">{b}</dd></div>
            ))}
          </dl>
        </header>

        <Player api={api} />
        <section aria-label="Baixar o vídeo" className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center gap-3">
            {PROFILES.map((pf, i) => {
              const busy = exp?.id === pf.id;
              return (
                <button
                  key={pf.id}
                  onClick={() => download(pf)}
                  disabled={!!exp || !exportSupported()}
                  className={`relative overflow-hidden rounded-xl px-5 py-3 text-sm font-extrabold shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white disabled:cursor-not-allowed ${i === 0 ? 'bg-[#FFD244] text-[#180A59] hover:brightness-105' : 'bg-white/15 text-white hover:bg-white/25'} ${exp && !busy ? 'opacity-50' : ''}`}
                >
                  {busy && <span className="absolute inset-y-0 left-0 bg-[#FF851D]/80" style={{ width: `${exp.p * 100}%` }} />}
                  <span className="relative flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                    {busy ? `Gerando… ${Math.round(exp.p * 100)}%` : `${i === 0 ? 'Baixar vídeo' : 'Versão leve'} · MP4 ${pf.label}${testSec ? ` · teste ${testSec} s` : ''}`}
                  </span>
                </button>
              );
            })}
            {exp && (
              <button onClick={() => (cancel.current = true)} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white/85 hover:bg-white/10">Cancelar</button>
            )}
            {file && !exp && (
              <a href={file.url} download={file.name} className="rounded-xl border border-[#22D7DA]/50 px-4 py-3 text-sm font-bold text-[#22D7DA] hover:bg-[#22D7DA]/10">Salvar de novo ({file.mb.toFixed(0)} MB)</a>
            )}
          </div>
          <div className="mt-3 text-sm text-white/70" aria-live="polite">
            {exp ? (
              <p>{exp.label} · {fmtEta(exp.eta)}. Mantenha esta aba <b>aberta e visível</b>: o MP4 é montado no seu navegador, sem envio para servidor.</p>
            ) : (
              <p>Gera o filme completo (5:00, narração, música e efeitos) com o mesmo motor desta página. A versão 1080p60 pode levar de 5 a 20 minutos conforme o computador; a versão leve, cerca de um quarto disso.</p>
            )}
            {exp && hidden && <p className="mt-1 font-medium text-[#FFD244]">A aba está em segundo plano e o navegador pode desacelerar a geração. Volte para esta aba.</p>}
            {msg && <p className={`mt-1 font-medium ${msg.ok ? 'text-[#22D7DA]' : 'text-[#ED4BA4]'}`}>{msg.text}</p>}
            {!exportSupported() && <p className="mt-1 font-medium text-[#ED4BA4]">Seu navegador não tem WebCodecs. Use Chrome ou Edge (desktop).</p>}
            {!HAS_AUDIO && <p className="mt-1 font-medium text-[#FFD244]">A trilha de áudio não foi incluída neste build: o vídeo será gerado sem som.</p>}
          </div>
        </section>
        <div className="mt-4 flex flex-wrap gap-2">
          {SECS.map((s, i) => (
            <button key={s.id} onClick={() => go(s.start)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium transition hover:border-white/50 hover:bg-white/10">
              <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: SEC_COL[i] }} />
              {s.title} <span className="ml-1 font-mono text-white/50">{fmt(s.start).slice(0, 4)}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/50">Espaço reproduz/pausa · ← → saltam 5 s · CC liga a legenda (desligada por padrão, não é queimada na imagem).</p>

        <section className="mt-16">
          <H2 k="00">Leia antes</H2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#22D7DA]/40 bg-[#22D7DA]/[0.07] p-5">
              <h3 className="mb-2 font-bold text-[#22D7DA]">O que está pronto</h3>
              <ul className="space-y-2 text-sm text-white/85">
                <li>Filme completo de 300 s, {SHOTS.length} planos, desenhado em código (Canvas), cada quadro função pura do tempo.</li>
                <li>Narração do seu roteiro, sem cortes, voz {NARR.voice} ({NARR.engine}), velocidade {NARR.speed}; {NARR.speech} s de fala.</li>
                <li>Cortes, gestos, letreiros e efeitos ancorados no tempo real de cada palavra (faster-whisper {NARR.alignModel}; {NARR.match ? (NARR.match * 100).toFixed(1) : '—'} % das palavras reconhecidas às cegas).</li>
                <li>Música e {EV.sfx.length} efeitos sonoros sintetizados (nada de terceiros), com ducking sob a voz.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#FFD244]/40 bg-[#FFD244]/[0.06] p-5">
              <h3 className="mb-2 font-bold text-[#FFD244]">O que mudou em relação ao pedido</h3>
              <ul className="space-y-2 text-sm text-white/85">
                <li>Não houve pausa para sua aprovação: este ambiente constrói direto. Roteiro e storyboard estão abaixo para você revisar; nada foi gasto.</li>
                <li>Nenhum modelo de imagem foi usado. Personagens e cenários são vetoriais e rigados em código, por isso não há recortes em chroma.</li>
                <li>As seções começam até 1,4 s antes do horário nominal, porque os cortes seguem a locução real.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#ED4BA4]/40 bg-[#ED4BA4]/[0.06] p-5">
              <h3 className="mb-2 font-bold text-[#ED4BA4]">O que não foi possível</h3>
              <ul className="space-y-2 text-sm text-white/85">
                <li>O vídeo de referência não chegou a este ambiente. A direção de arte parte da sua descrição escrita; não há folha de contato dele.</li>
                <li>O MP4 não é um arquivo estático: o botão “Baixar vídeo” o codifica no seu navegador a partir do mesmo motor (H.264, com áudio AAC ou Opus conforme o navegador). Depende de WebCodecs (Chrome ou Edge no desktop). A versão 1080p60 é pesada; a “versão leve” 720p30 sai bem mais rápido.</li>
                <li>Ninguém ouviu a mixagem: a voz foi conferida só por transcrição automática. Ouça antes de publicar.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <H2 k="01">Roteiro e plano de cenas</H2>
          <div className="space-y-10">
            {SECS.map((s, i) => (
              <div key={s.id}>
                <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 pb-2">
                  <h3 className="text-lg font-bold"><span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ background: SEC_COL[i] }} />{s.id}. {s.title}</h3>
                  <span className="font-mono text-xs text-white/60">{fmt(s.start)} – {fmt(s.end)} · nominal {s.nominal[0]}–{s.nominal[1]} s</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {SHOTS.filter((x) => x.sec === s.id).map((x) => (
                    <article key={x.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <button onClick={() => go(x.a)} className="block w-full text-left" aria-label={`Ir para o plano ${x.id}`}>
                        <Thumb t={(x.a + x.b) / 2} i={x.n} />
                      </button>
                      <div className="mt-3 flex items-baseline justify-between gap-3">
                        <h4 className="font-bold"><span className="mr-2 font-mono text-[#FFD244]">{x.id}</span>{x.title}</h4>
                        <span className="shrink-0 font-mono text-xs text-white/60">{fmt(x.a)}–{fmt(x.b)}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/75">{x.desc}</p>
                      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-white/65">
                        <dt className="text-white/40">câmera</dt><dd>{x.cam}</dd>
                        <dt className="text-white/40">elenco</dt><dd>{x.cast}</dd>
                        <dt className="text-white/40">entrada</dt><dd>{TR[x.tr ?? 'cut']}</dd>
                        <dt className="text-white/40">som</dt><dd>{x.sfxNote}</dd>
                        <dt className="text-white/40">cor</dt><dd className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded" style={{ background: x.color }} />{x.color}</dd>
                      </dl>
                      <div className="mt-3 space-y-1 border-t border-white/10 pt-2">
                        {s.cues.filter((cu) => cu.a >= x.a - 0.6 && cu.a < x.b - 0.6).map((cu) => (
                          <button key={cu.id} onClick={() => go(cu.a)} className="block w-full rounded px-1 text-left text-sm leading-snug text-white/90 hover:bg-white/10">
                            <span className="mr-2 font-mono text-[11px] text-[#22D7DA]">{fmt(cu.a)}</span>{cu.text}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <H2 k="02">Direção de arte</H2>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE.map(([hex, role]) => (
                  <div key={hex} className="overflow-hidden rounded-xl border border-white/10">
                    <div className="h-14" style={{ background: hex }} />
                    <div className="px-3 py-2"><p className="font-mono text-xs">{hex}</p><p className="text-xs text-white/60">{role}</p></div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/70">Cada seção tem uma cor dominante. As "ideias" (triângulo, círculo, quadrado) são a unidade de informação do filme inteiro: aparecem na página, no cofre, no sonho, nas trilhas e no ciclo final.</p>
              <p className="mt-3 text-sm text-white/70">Câmera virtual com paralaxe em 3 a 4 camadas, push-ins, travellings, tilt vertical e crash zooms. Transições usadas: {trans.join(', ')}.</p>
            </div>
            <div>
              <Sheet />
              <p className="mt-3 text-sm text-white/70">Família original de corujas geométricas. Cabeça, tufos, olhos, pálpebras, bico, asas e pernas são peças separadas; piscam a cada 2,6–3,9 s e o bico segue as sílabas da narração quando a personagem "fala".</p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <H2 k="03">Checagem de fatos</H2>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
            {FACTS.map(([claim, src, url, note]) => (
              <div key={src} className="grid gap-2 p-4 md:grid-cols-[1.1fr_0.7fr_1.2fr]">
                <p className="text-sm font-medium">{claim}</p>
                <a href={url} target="_blank" rel="noreferrer" className="text-sm text-[#22D7DA] underline decoration-white/20 underline-offset-4 hover:decoration-[#22D7DA]">{src}</a>
                <p className="text-sm text-white/65">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <H2 k="04">Produção e exportação</H2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/80">
              <h3 className="mb-2 font-bold text-white">API do motor (nesta página)</h3>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-xs leading-relaxed text-[#8CAAF7]">{`window.seek(t)   // desenha o instante t (s)
window.READY     // fontes e motor carregados
window.END       // ${EV.end}
window.EV        // ${EV.narration.length} falas · ${EV.shots.length} planos · ${EV.sfx.length} efeitos
?render          // página só com o canvas`}</pre>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/80">
              <h3 className="mb-2 font-bold text-white">Pipeline (pasta tools/)</h3>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-xs leading-relaxed text-[#8CAAF7]">{`python3 tools/tts.py       # Kokoro pt-BR, frase a frase
python3 tools/align.py     # faster-whisper, por palavra
node tools/timeline.mjs    # ajusta cortes à locução (300 s)
node tools/audio.mjs       # música + efeitos + ducking, -14 LUFS
node tools/render.mjs      # 18.000 quadros → libx264
bash tools/export.sh       # tudo acima + mux + verificação`}</pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
