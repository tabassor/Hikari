#!/usr/bin/env python3
"""Nature des cartes Hikari (champ « t ») : def (définition), coeur (à savoir par cœur), exo (exercice), vocab (vocabulaire de langue).
  card-kinds.py dump  <repo> <sortie.tsv>        → liste des cartes avec la nature actuelle ou proposée
  card-kinds.py apply <repo> <fichier.tsv>       → écrit le champ t dans data/c-*.js et data/packs/*.js
Le TSV a pour colonnes : clé (fichier|chapitre|leçon|index), nature, matière, type, question, réponse."""
import sys, os, re, json, glob

def load(path):
    src = open(path, encoding="utf8").read()
    m = re.search(r"\.push\(\s*", src); end = src.rstrip().rfind(");")
    body = src[m.end():end].strip()
    data = json.loads("[" + body + "]")
    return src[:m.end()], data, src[end:]

def save(path, head, data, tail):
    body = ",\n".join(json.dumps(x, ensure_ascii=False, indent=1) for x in data)
    open(path, "w", encoding="utf8").write(head.rstrip() + "\n" + body + "\n" + tail.lstrip())

def chapters_of(obj):
    if "chapters" in obj or "extend" in obj or "format" in obj:   # pack
        out = [(c["id"], c) for c in obj.get("chapters", [])]
        out += [(x["chapter"], x) for x in obj.get("extend", [])]
        return out
    return [(obj["id"], obj)]   # chapitre de base

def lessons(ch): return ch.get("lessons", [])

DEF = re.compile(r"d[ée]finition|qu.est-ce qu(e|.un|.une)\b|que signifie|signifie…|on appelle|comment (s.)?appelle|que veut dire le mot|désigne|^qu.appelle-t-on|^quand dit-on|^que représente|^« ?[ée]quidistant", re.I)
EXO = re.compile(r"^(calcule|convertis|range|compare|écris|ecris|complète|complete|classe|conjugue|arrondis|encadre|trouve|place|donne la valeur|décompose|traduis|mets|remets|associe les nombres|combien|constructible|quelle sorte|bien écrit|le zéro|fraction ou non)", re.I)
VOC = re.compile(r"comment dit-on|cómo se dice|que veut dire|qu.est-ce que .* veut dire|traduis|en anglais|en espagnol|in english|en español|¿qué significa", re.I)
APPLI = re.compile(r"\d[\d ,]*\d|\d,\d|\b[A-Z]{2,4}\b|[\[(][A-Z][A-Z]?[\])]|\b[A-Z], [A-Z]|[A-Z] ?[∈∉…]|\b[A-Z]{1,2} ?= ?\d")
# Corrections relues à la main (6/10/2026) : (matières, motif sur la question, nature)
OVR = [
 ("ma", r"^combien (y a-t-il de chiffres|de zéros|de milliers dans un million)|^range (les rangs|les classes|ces unités)|^remets les étapes|^si \*?\*?om|^\(𝒞\)|diamétralement|^pour construire \[om\]|^sur une figure", "coeur"),
 ("ma", r"^cercle de centre o et de rayon|^un cercle a un rayon|^quel nombre est le plus grand|s'écrit…$|^quelle écriture est correcte", "exo"),
 ("ma sc", r"^combien de (centièmes|millièmes)", "coeur"),
 ("hg sc emc", r"^définis ", "def"),
 ("hg", r"^remets.*(ordre|chronolog)", "coeur"),
 ("hg", r"^ville durable", "exo"),
 ("sc", r"^combien d'espèces|^lequel de ces arbres|^remets dans l'ordre (de la vie|les étapes)", "coeur"),
 ("sc", r"^au bois joli, qu'est-ce qui|^clé d'entraînement|^je veux savoir|^un humidimètre affiche|^le mulet|^le lapin et le lièvre|^dans quel état|^la baleine est", "exo"),
 ("sc emc", r"^que sont les|^que veut dire « descendance", "def"),
 ("sc", r"^que sont capables", "coeur"),
 ("emc", r"^range ces échelles", "coeur"),
 ("emc", r"^intérêt général ou", "exo"),
 ("fr", r"…\s*\([a-zéèêîô]+, |^\*\*?(avoir|être)\*\*?, |^impératif, |fonction ?\??$|fonction du groupe|quel temps \?|^« .*» .*le mot souligné|le mot souligné est|^noyau du gn|^quelle phrase est une phrase|^pour trouver le sujet de|ou conditionnel|ou plus-que-parfait|^à quel temps sont|^rime (féminine|pauvre)|^un \*\*l\*\* ou|^un l ou|variables ou invariables|indique…$|le 2e groupe souligné", "exo"),
 ("fr", r"^combien de personnes|^range chaque élément dans le bon récit", "coeur"),
 ("fr", r"^« ?titanesque|^que veut dire « \*?\*?ouvrir|^que veut dire \*\*api", "def"),
 ("fr", r"^qui est le \*?\*?scribe", "def"),
 ("hg", r"^qui est le \*?\*?scribe", "def"),
 ("en es", r"^match each pronoun|^days and months begin|^in english, we use|^asocia : tener|^in english, we use|en espagnol, le \*\*v\*\*|^par quel signe|forme courte|^forme contractée|^pourquoi|^quelle forme n'existe|^pluriel de|^dans « hola »|^le ñ|^comment (demander|s'appelaient)|^qui appelait|^le mot « hispano|^à partir de quelle heure|^« good night", "coeur"),
 ("en es", r"^comment s'écrit « mois", "vocab"),
 ("en es", r"___|^écris en lettres|^say it in english|^write in english|^il est \d+ ?h|^tu veux|^demande :|^quelle écriture est correcte|^une (fille|personne)|^puis-je|^pour présenter|^today is|^« who can|^« how are you today|^réponds", "exo"),
 ("en es", r"veut dire…$|^« .* » veut dire|^\*\*\w+\*\* veut dire|^quelle écriture veut dire|is…$|^le week-end se dit|^l'après-midi, on dit|^comment s'écrit « mois", "vocab"),
]
def guess(subj, c):
    k, q = c.get("k"), re.sub(r"\*\*", "", str(c.get("q", "")))
    q0 = str(c.get("q", ""))
    if k != "g":
        for subs, pat, t in OVR:
            if subj in subs.split() and (re.search(pat, q, re.I) or re.search(pat, q0, re.I)): return t
    if k == "g": return "exo"
    if subj in ("en", "es"):
        if VOC.search(q) or k == "p": return "vocab"
        if EXO.search(q) or k in ("s", "o"): return "exo"
        return "coeur"
    if DEF.search(q): return "def"
    if EXO.search(q): return "exo"
    if subj in ("ma", "sc") and k in ("q", "i", "s", "o") and APPLI.search(q): return "exo"
    return "coeur"

def ans(c):
    if c.get("k") == "q": return c["c"][c["a"]] if isinstance(c.get("a"), int) else str(c.get("a"))
    if "a" in c: return c["a"] if isinstance(c["a"], str) else " | ".join(map(str, c["a"]))
    if "pairs" in c: return " ; ".join(f"{a}→{b}" for a, b in c["pairs"][:4])
    if "items" in c: return " ; ".join(str(x[0] if isinstance(x, list) else x) for x in c["items"][:5])
    return c.get("g", "")

def files(repo): return sorted(glob.glob(os.path.join(repo, "data/c-*.js"))) + sorted(glob.glob(os.path.join(repo, "data/packs/*.js")))

def walk(repo):
    for f in files(repo):
        head, data, tail = load(f)
        for obj in data:
            subj_default = obj.get("s")
            for cid, ch in chapters_of(obj):
                subj = ch.get("s") or subj_default or cid.split("-")[0].replace("hi", "hg").replace("ge", "hg")
                for l in lessons(ch):
                    for i, c in enumerate(l.get("cards", []) or []):
                        yield f, head, data, tail, subj, cid, l, i, c

def dump(repo, out):
    rows = []
    for f, _, _, _, subj, cid, l, i, c in walk(repo):
        key = f"{os.path.relpath(f, repo)}|{cid}|{l['id']}|{i}"
        t = c.get("t") or guess(subj, c)
        clean = lambda s: re.sub(r"\s+", " ", str(s)).replace("\t", " ")[:140]
        rows.append("\t".join([key, t, subj, c.get("k", ""), clean(c.get("q", c.get("g", ""))), clean(ans(c))]))
    open(out, "w", encoding="utf8").write("\n".join(rows) + "\n"); print(len(rows), "cartes")

def apply(repo, tsv):
    want = {}
    for line in open(tsv, encoding="utf8"):
        if not line.strip(): continue
        key, t = line.split("\t")[:2]; want[key] = t.strip()
    done = {}
    cache = {}
    for f, head, data, tail, subj, cid, l, i, c in walk(repo):
        key = f"{os.path.relpath(f, repo)}|{cid}|{l['id']}|{i}"
        if key in want: c["t"] = want[key]; done[key] = 1
        cache[f] = (head, data, tail)
    for f, (head, data, tail) in cache.items(): save(f, head, data, tail)
    print(len(done), "cartes étiquetées ;", len(set(want) - set(done)), "clés introuvables")

if __name__ == "__main__":
    {"dump": dump, "apply": apply}[sys.argv[1]](sys.argv[2], sys.argv[3])
