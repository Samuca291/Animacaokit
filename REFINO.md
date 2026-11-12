# Refino do gancho (1A–1D) e do efeito do espaçamento (4A–4B)

Branch de trabalho: `refino/gancho-1A-1D-espacamento-4A-4B` (somente local; nada foi enviado ao GitHub).

O filme continua sendo função pura do tempo (`renderFrame(ctx, t)`), 1920×1080, 60 fps, 300 s = 18.000 quadros.
Narração, trilha, ordem e instantes de **todos** os 27 planos e de **todos** os 298 efeitos sonoros ficaram
idênticos ao original (verificado comparando `EV` do repositório clonado com o da cópia de trabalho): a trilha
(`src/film/data/trilha.b64.json`) já vem mixada, então a nova animação foi coreografada sobre os tempos existentes.

## O que mudou nesta revisão

| Plano | Arquivo | Mudança |
|---|---|---|
| 1A–1C | `src/film/shots/s1.ts` | **Uma tomada contínua** no quarto: `hookScene` + `roomCam` são compartilhados pelos três planos, então os cortes são invisíveis. Câmera: abre colada no bloco de notas, recua revelando o quarto, empurra até o rosto, crash zoom com ultrapassagem, plano médio e pan até a fala. Lumi atua do início ao fim (`lumiAt`): lê com os olhos, vira folhas, boceja, cochila, acorda, tenta segurar uma ideia, estufa o peito, aponta as frases, baixa a capa, tenta explicar e espia o bloco. |
| 1A | `s1.ts`, `hook.ts` | Cada linha grifada solta uma ideia que entra em **órbita na cabeça** de Lumi. A luz da janela varre o quarto (tarde → noite → manhã). "Amanhã" as ideias estouram uma a uma, uma despenca em "sumiu" e só duas, apagadas, pousam na mesa (e ficam lá até o 1C). |
| 1B | `s1.ts`, `hook.ts` | **O termômetro "sensação de aprender" foi removido.** No lugar: a cada releitura a folha vira, brilha mais e **infla um balão em forma de ideia** — grande, brilhante, translúcido e oco (sem olhos, sem miolo), com uma etiqueta de papel amarrada ao barbante. Não é outro medidor: é um objeto do mundo, e é o mesmo que estoura no 1D. |
| 1C | `s1.ts`, `hook.ts` | Bloco de notas de espiral num suporte, voltado para quem lê (`notepad`). Três frases ganham ✓ nos três ticks; a própria Lumi baixa a capa (a página some); no balão de fala só há contornos, que tremem e desabam no fundo do balão no instante do baque. Os balões continuam cheios. |
| 1D | `s1.ts` | Dois planaltos separados por um **abismo** (a "diferença enorme"), vistos em corte. À esquerda os três balões estouram nos três estalos; a câmera atravessa o vão e, do lado de Brasa, ideias sólidas brotam de caules com **raízes** que formam uma rede pulsante. O título cai letra a letra no céu entre as margens e uma ponte de luz começa a ligá-las. |
| 4A | `src/film/shots/s4ab.ts` | Ambiente completo em 7 camadas (céu, nuvens, três serras, vaga-lumes, trilhas, capim em primeiro plano). Passarela de cima × caminho de baixo, postes com **lanternas** cujo brilho é a memória disponível em cada dia, e a torre-farol do **longo prazo**. Esforço igual: os dois chegam seguidos pelos mesmos 6 blocos; Nilo empilha os 6 (seis baques), Lumi deixa 2 + 2 + 2. O clarão da maratona perde fôlego e apaga de longe para perto; a cada pouso de Lumi o cabo engrossa e a luz vai mais longe, até acender o farol. Câmera em spline: próximo → recuo → travelling dos saltos → geral com a placa. |
| 4B | `src/film/shots/s4ab.ts` | Interior da torre: fichário com **gavetas que se abrem** quando a ficha sai, mezaninos, escada, lanternas iguais às da trilha e uma janela com o mesmo entardecer do 4A. As fichas voam em curva com rastro até o livro, que folheia; a Dra. Íris rege o voo. A síntese usa o vocabulário do 4A (blocos separados → cabo → lanterna acesa) e é projetada pelo livro. |
| — | `src/film/hook.ts` (novo) | `notepad`, `balloon`, `popFx`, `lightShaft`/`dayLight`, `giftTag`. |
| — | `src/film/props.ts` | `roomBack` ganhou a opção `posters` (padrão `true`): só o gancho passa `false`. Os demais planos não mudam. |
| — | `src/film/timeline.ts` | Whip pan: cada plano é recortado ao próprio quadro (antes, o que o plano que entra desenhava além das bordas invadia o que sai, gerando um salto de um quadro nas entradas de 1D, 4A e 4B). |
| — | `tools/jumps.mjs` (novo) | Mede a diferença entre quadros consecutivos e aponta saltos isolados. |
| — | `src/film/shots/s4.ts` | Passa a importar 4A/4B de `s4ab.ts`; 4C e 4D ficaram literalmente iguais. |

## Como executar

```bash
npm install
npm run dev        # player interativo (Vite)
npm run build      # gera dist/index.html (arquivo único)
npm run preview    # serve o build

npx tsc --noEmit -p .                                     # checagem de tipos
node tools/frames.mjs scan - 0.25                         # varre a timeline em modo estrito
node tools/shots.mjs qc.jpg "1A,1B,1C,1D,4A,4B" 12 4 480  # folha de contato dos planos
node tools/frames.mjs grid folha.jpg "1:149:16" 4         # folha de contato por intervalo
node tools/jumps.mjs "0:27.5,104.2:128"                   # procura saltos de um único quadro (60 fps)
node tools/jumps.mjs whips                                # idem, em torno de cada whip pan
node tools/render.mjs 0 1650 gancho.mp4                   # renderiza um trecho (H.264, sem áudio)
node tools/render.mjs 0 18000 video.mp4                   # renderiza os 18.000 quadros (sem áudio)
```

`WORK=/tmp/aprender` (padrão) é a pasta temporária usada pelas ferramentas.

## Limitações conhecidas

- O filme completo de 300 s não foi re-renderizado nesta revisão; foram renderizados os trechos alterados
  (pasta `previews/`, com a trilha original) e folhas de contato (pasta `qc/`).
- `tools/audio.mjs` precisa dos WAVs da narração (`$WORK/voice/*.wav`), que não estão no repositório. Por isso a
  trilha não foi remixada e nenhum efeito sonoro novo foi acrescentado: ações novas sem som próprio (o cochilo,
  a pedrinha que cai no abismo, a ponte de luz) são silenciosas.

---

## Revisão anterior — planos 2A, 2B, 4D, 5B–5C e 6A

| Plano | Arquivo | Mudança |
|---|---|---|
| 2A | `src/film/shots/s2.ts` | Livros voltados para as personagens (`heldBook`), corujas reposicionadas, expressões com mistura suave (`moodK`), whip pan com assentamento. |
| 2B | `src/film/shots/s2.ts` | Dra. Íris entra andando; tela com mola; contador "2006"; tubos de líquido; memórias voando para os tubos; câmera em spline com paralaxe. |
| 4D | `src/film/shots/s4.ts` | Calendário com moldura clara e página escura; marcador "hoje" que para em cada sessão; fio de luz que engrossa a cada reencontro. |
| 5B–5C | `src/film/shots/s5.ts` | Arquipélago bioluminescente em 8 camadas; tomada contínua (`dreamScene`/`dreamCam`). |
| 6A | `src/film/shots/s6.ts` | Prensa hidráulica de pórtico (`pressMachine`) com esteira indexada e ciclo sincronizado aos sons existentes. |
| — | `src/film/fx.ts` | Antecipação/ultrapassagem (`bio`, `ant`), follow-through (`wob`), impacto (`hit`), janela (`win`), expressões (`moodK`), câmera em spline (`camS`). |
| — | `tools/shots.mjs` | Folha de contato por plano. |
