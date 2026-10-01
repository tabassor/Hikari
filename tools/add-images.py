#!/usr/bin/env python3
"""Intègre des illustrations (Gemini) dans Hikari.
Usage : add-images.py <repo_dir> <clé>=<fichier> [<clé>=<fichier> ...]
  clé = ren-happy | ren-wow | ren-think | ren-fire | boss-<id du chapitre>
Chaque image est détourée (fond clair uni rendu transparent depuis les bords),
recadrée, réduite à 512 px et enregistrée en WebP dans img/, puis déclarée dans data/images.js."""
import sys, os, re, json
from PIL import Image, ImageDraw

def cutout(im, tol=38):
    im = im.convert("RGBA")
    w, h = im.size
    bg = im.getpixel((2, 2))[:3]
    # Remplissage depuis les 4 bords : seul le fond relié au bord devient transparent
    mask = Image.new("L", (w, h), 0)
    px = im.load(); mk = mask.load(); stack = [(x, y) for x in (0, w - 1) for y in range(0, h, 4)] + [(x, y) for y in (0, h - 1) for x in range(0, w, 4)]
    def close(c): return sum(abs(c[i] - bg[i]) for i in range(3)) <= tol
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or mk[x, y]: continue
        if not close(px[x, y]): continue
        mk[x, y] = 255
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    out = Image.composite(Image.new("RGBA", (w, h), (0, 0, 0, 0)), im, mask)
    bbox = out.getbbox() or (0, 0, w, h)
    out = out.crop(bbox)
    side = max(out.size); pad = int(side * 0.04)
    sq = Image.new("RGBA", (side + 2 * pad, side + 2 * pad), (0, 0, 0, 0))
    sq.paste(out, ((sq.width - out.width) // 2, (sq.height - out.height) // 2), out)
    return sq.resize((512, 512), Image.LANCZOS)

def main():
    repo = sys.argv[1]
    os.makedirs(os.path.join(repo, "img"), exist_ok=True)
    js = os.path.join(repo, "data/images.js"); src = open(js, encoding="utf8").read()
    data = json.loads(re.search(r"window\.IMAGES = (\{.*\});", src, re.S).group(1).replace("ren:", '"ren":').replace("boss:", '"boss":').replace("garden:", '"garden":'))
    for arg in sys.argv[2:]:
        key, path = arg.split("=", 1)
        kind, name = key.split("-", 1)
        if key == "garden-bg":  # décor pleine image : pas de détourage
            img = Image.open(path).convert("RGB"); img.thumbnail((1200, 1200))
        else:
            img = cutout(Image.open(path))
        fn = f"img/{key}.webp"; img.save(os.path.join(repo, fn), "WEBP", quality=82, method=6)
        data.setdefault(kind, {})[name] = fn
        print("ok", key, os.path.getsize(os.path.join(repo, fn)) // 1024, "Ko")
    body = json.dumps(data, ensure_ascii=False, indent=2)
    src = re.sub(r"window\.IMAGES = \{.*\};", "window.IMAGES = " + body + ";", src, flags=re.S)
    open(js, "w", encoding="utf8").write(src)

if __name__ == "__main__":
    main()
