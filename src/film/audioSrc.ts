// Fonte da trilha (narração + música + efeitos) resistente a arquivos ausentes.
// A trilha fica em texto (base64 em JSON), porque arquivos binários podem sumir do workspace entre sessões.
// import.meta.glob nunca quebra o build quando o arquivo não existe: nesse caso o filme roda mudo e avisa.
const b64 = import.meta.glob('./data/trilha.b64.json', { eager: true, import: 'default' }) as Record<string, { mime: string; data: string }>;

const entry = Object.values(b64)[0];
const URL_ = entry?.data ? `data:${entry.mime};base64,${entry.data}` : '';
export const audioUrl = (): string => URL_;
export const HAS_AUDIO = URL_ !== '';
