#!/usr/bin/env python3
"""Alinhamento por palavra (faster-whisper) + checagem de inteligibilidade da narração.
Não usa o roteiro como prompt: a transcrição é comparada às cegas com o texto."""
import difflib, json, os, re
import soundfile as sf
from faster_whisper import WhisperModel

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.environ.get("WORK", "/tmp/aprender")
S = json.load(open(os.path.join(HERE, "script.json"), encoding="utf-8"))


def norm(w):
    return re.sub(r"[^0-9a-zà-ÿ]", "", w.lower())


m = WhisperModel(os.environ.get("WHISPER", "small"), device="cpu", compute_type="int8", cpu_threads=2)
res = {}
hits = total = 0
for sec in S["sections"]:
    for j, text in enumerate(sec["sentences"]):
        sid = f"{sec['id']}.{j + 1}"
        p = os.path.join(WORK, "voice", sid + ".wav")
        dur = sf.info(p).duration
        segs, _ = m.transcribe(p, language="pt", word_timestamps=True, beam_size=3, condition_on_previous_text=False)
        hyp = [(norm(w.word), float(w.start), float(w.end), w.word) for s in segs for w in s.words]
        hyp = [h for h in hyp if h[0]]
        ref = text.split()
        rn = [norm(w) for w in ref]
        sm = difflib.SequenceMatcher(None, rn, [h[0] for h in hyp], autojunk=False)
        st = [None] * len(ref)
        hit = 0
        for a, b, n in sm.get_matching_blocks():
            for q in range(n):
                st[a + q] = hyp[b + q][1]
                hit += 1
        # palavras sem correspondência: interpola pela posição em caracteres
        cp = [0]
        for w in ref:
            cp.append(cp[-1] + len(w) + 1)
        for i in range(len(ref)):
            if st[i] is None:
                i0 = i - 1
                while i0 >= 0 and st[i0] is None:
                    i0 -= 1
                i1 = i + 1
                while i1 < len(ref) and st[i1] is None:
                    i1 += 1
                p0, t0 = (cp[i0], st[i0]) if i0 >= 0 else (0, 0.0)
                p1, t1 = (cp[i1], st[i1]) if i1 < len(ref) else (cp[-1], dur)
                st[i] = t0 + (t1 - t0) * (cp[i] - p0) / max(1, p1 - p0)
        for i in range(1, len(st)):
            st[i] = max(st[i], st[i - 1])
        score = hit / max(1, len(ref))
        hits += hit
        total += len(ref)
        res[sid] = {"score": round(score, 3), "dur": round(dur, 3), "hyp": "".join(h[3] for h in hyp).strip(),
                    "words": [[round(v, 3)] for v in st]}
        print(sid, f"{score:.2f}", res[sid]["hyp"], flush=True)

res["_summary"] = {"match": round(hits / max(1, total), 4), "words": total, "model": os.environ.get("WHISPER", "small")}
json.dump(res, open(os.path.join(WORK, "voice", "align.json"), "w"), ensure_ascii=False)
print("ALIGN_DONE match", res["_summary"]["match"], flush=True)
