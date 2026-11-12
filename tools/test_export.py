#!/usr/bin/env python3
"""Teste de ponta a ponta: abre o dist/index.html no Chromium, confere erros do console,
clica em "Baixar vídeo" e salva o MP4 gerado pelo navegador.
uso: python3 tools/test_export.py <caminho-do-dist> <saida.mp4> [query]  (ex.: "?exportSeconds=4")
"""
import re
import sys
import time
from playwright.sync_api import sync_playwright

dist, out = sys.argv[1], sys.argv[2]
query = sys.argv[3] if len(sys.argv) > 3 else ""
logs, downloads = [], []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--autoplay-policy=no-user-gesture-required"])
    page = browser.new_page(viewport={"width": 1440, "height": 900}, accept_downloads=True)
    page.on("console", lambda m: logs.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: logs.append(f"PAGEERROR: {e}"))
    page.on("download", lambda d: downloads.append(d))
    page.goto(f"file://{dist}{query}", wait_until="load")
    page.wait_for_timeout(3000)
    print("canvas:", page.evaluate("() => !!document.querySelector('canvas')"))
    print("encoder support:", page.evaluate("""async () => {
      const r = { VideoEncoder: typeof VideoEncoder, AudioEncoder: typeof AudioEncoder };
      if (typeof VideoEncoder !== 'undefined') for (const c of ['avc1.640028', 'vp09.00.40.08'])
        r[c] = (await VideoEncoder.isConfigSupported({ codec: c, width: 1920, height: 1080, bitrate: 8e6, framerate: 60 })).supported;
      if (typeof AudioEncoder !== 'undefined') for (const c of ['mp4a.40.2', 'opus'])
        r[c] = (await AudioEncoder.isConfigSupported({ codec: c, sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 })).supported;
      return r; }"""))
    page.screenshot(path=out + ".page.png")
    btn = page.get_by_role("button", name=re.compile(sys.argv[4] if len(sys.argv) > 4 else "Baixar vídeo"))
    print("button enabled:", btn.is_enabled(), "|", btn.inner_text().strip())
    t0 = time.time()
    btn.click()
    last = 0
    while not downloads and time.time() - t0 < float(sys.argv[5] if len(sys.argv) > 5 else 3000):
        page.wait_for_timeout(5000)
        if time.time() - last > 60:  # não consulta a página durante a exportação (ela está ocupada codificando)
            last = time.time()
            print(f"[{time.time() - t0:5.0f}s] exportando… (aguardando o download)", flush=True)
    if downloads:
        downloads[0].save_as(out)
        print(f"DOWNLOAD ok em {time.time() - t0:.0f}s -> {out}")
    else:
        print("NO DOWNLOAD; status:", page.locator("text=/Download|não|Erro|Seu navegador/").all_inner_texts())
    print("console:", *logs[:20], sep="\n  ")
    browser.close()
