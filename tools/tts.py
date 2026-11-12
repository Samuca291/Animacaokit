#!/usr/bin/env python3
"""Narração: sintetiza cada frase do roteiro com Kokoro (pt-BR) e mede a duração real."""
import json, os, time
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.environ.get("WORK", "/tmp/aprender")
S = json.load(open(os.path.join(HERE, "script.json"), encoding="utf-8"))
OUT = os.path.join(WORK, "voice")
os.makedirs(OUT, exist_ok=True)
VOICE = S.get("voice", "pf_dora")
TARGET = float(S.get("speechTarget", 262))
k = Kokoro(os.path.join(WORK, "models/kokoro-v1.0.onnx"), os.path.join(WORK, "models/voices-v1.0.bin"))

items = []
for sec in S["sections"]:
    for j, text in enumerate(sec["sentences"]):
        sid = f"{sec['id']}.{j + 1}"
        items.append((sid, S.get("tts", {}).get(sid, text), len(text)))

LANG = ["pt-br"]


def synth(text, speed):
    try:
        x, sr = k.create(text, voice=VOICE, speed=speed, lang=LANG[0])
    except Exception as e:  # noqa
        print("lang fallback:", e, flush=True)
        LANG[0] = "pt"
        x, sr = k.create(text, voice=VOICE, speed=speed, lang=LANG[0])
    x = np.asarray(x, dtype=np.float32).reshape(-1)
    pk = float(np.abs(x).max()) or 1.0
    idx = np.where(np.abs(x) > 0.02 * pk)[0]
    a = max(0, int(idx[0]) - int(0.02 * sr))
    b = min(len(x), int(idx[-1]) + int(0.05 * sr))
    return x[a:b], sr


t0 = time.time()
speed = 1.0
buf = {}
cal = items[:6]
dur = 0.0
sr = 24000
for sid, text, _ in cal:
    x, sr = synth(text, 1.0)
    buf[sid] = x
    dur += len(x) / sr
est = dur * sum(c for _, _, c in items) / sum(c for _, _, c in cal)
if est > TARGET + 6 or est < TARGET - 22:
    speed = float(np.clip(est / TARGET, 0.9, 1.15))
print(f"calib: est={est:.1f}s speed={speed:.3f} t={time.time() - t0:.0f}s", flush=True)

done = {}
for sid, text, _ in items:
    if speed == 1.0 and sid in buf:
        x = buf[sid]
    else:
        x, sr = synth(text, speed)
    sf.write(os.path.join(OUT, f"{sid}.wav"), x, sr, subtype="PCM_16")
    done[sid] = round(len(x) / sr, 3)
    print(sid, done[sid], f"t={time.time() - t0:.0f}s", flush=True)

json.dump(
    {"voice": VOICE, "engine": "Kokoro-82M v1.0 (kokoro-onnx)", "speed": round(speed, 3), "sr": sr,
     "total": round(sum(done.values()), 2), "items": done},
    open(os.path.join(OUT, "durations.json"), "w"),
)
print("TTS_DONE total", round(sum(done.values()), 1), flush=True)
