#!/usr/bin/env python3
"""Ajoute un pack au dépôt Hikari : écrit data/packs/<id>.js et insère la ligne <script> dans index.html.
Usage : add-pack.py <repo_dir> <pack.json>"""
import json, sys, os, re
repo, src = sys.argv[1], sys.argv[2]
p = json.load(open(src, encoding="utf8"))
assert p.get("format") == "hikari-pack" and p.get("id"), "pack invalide"
fn = re.sub(r"[^a-z0-9-]", "-", p["id"].lower()) + ".js"
os.makedirs(os.path.join(repo, "data/packs"), exist_ok=True)
open(os.path.join(repo, "data/packs", fn), "w", encoding="utf8").write(f"/* Pack {p['id']} — {p.get('title','')} */\nwindow.REPO_PACKS.push({json.dumps(p, ensure_ascii=False, indent=1)});\n")
ix = os.path.join(repo, "index.html"); h = open(ix, encoding="utf8").read()
tag = f'<script src="data/packs/{fn}"></script>'
if tag not in h: h = h.replace("<!-- /PACKS -->", tag + "\n<!-- /PACKS -->"); open(ix, "w", encoding="utf8").write(h)
print("ok", fn)
