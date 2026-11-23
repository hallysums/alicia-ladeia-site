#!/usr/bin/env python3
"""Gera index.html com srcset responsivo para as imagens.
Uso: python3 tools/build_html.py  (a partir da raiz do projeto)
Edite os textos em tools/index.src.html; marcadores IMG[...] viram <img> com srcset.
Sintaxe: IMG[id|proporcao(h/w)|larguras|sizes|alt|classe|extra]
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "index.src.html"
OUT = ROOT / "index.html"
BASE = "https://images.unsplash.com/photo-"


def url(pid, w, ratio, crop):
    h = round(w * ratio)
    return f"{BASE}{pid}?auto=format&amp;fit=crop&amp;crop={crop}&amp;q=72&amp;w={w}&amp;h={h}"


def img(m):
    parts = m.group(1).split("|")
    pid, ratio, widths, sizes, alt, cls = parts[:6]
    extra = parts[6] if len(parts) > 6 else 'loading="lazy" decoding="async"'
    crop = "faces,center" if "faces" in cls else "entropy"
    cls = cls.replace("faces", "").strip()
    ratio = float(ratio)
    ws = [int(w) for w in widths.split(",")]
    srcset = ", ".join(f"{url(pid, w, ratio, crop)} {w}w" for w in ws)
    mid = ws[len(ws) // 2]
    return (f'<img class="{cls}" src="{url(pid, mid, ratio, crop)}" srcset="{srcset}" '
            f'sizes="{sizes}" width="{mid}" height="{round(mid*ratio)}" alt="{alt}" {extra}>')


html = re.sub(r"IMG\[(.+?)\]", img, SRC.read_text(encoding="utf-8"))
OUT.write_text(html, encoding="utf-8")
print("index.html gerado:", len(html), "bytes")
