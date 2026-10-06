/* Pack 2026-09-28-ma-geometrie — Maths — Langage géométrique, cercle, triangles */
window.REPO_PACKS.push(
{
 "format": "hikari-pack",
 "version": 2,
 "id": "2026-09-28-ma-geometrie",
 "title": "Maths — Langage géométrique, cercle, triangles",
 "created": "2026-09-28",
 "open": [
  "ma-geom1-l1",
  "ma-geom1-l4",
  "ma-geom1-l2",
  "ma-geom1-l5",
  "ma-geom1-l3",
  "ma-geom1-l6"
 ],
 "extend": [
  {
   "chapter": "ma-geom1",
   "lessons": [
    {
     "id": "ma-geom1-l1",
     "replace": true,
     "title": "Point, droite, demi-droite, segment",
     "refs": [
      "MA-GEOM-AUTO1",
      "MA-GEOM-01"
     ],
     "note": "Cahier de maths — « Premières notions de géométrie, langage géométrique ».",
     "fiche": [
      {
       "h": "Le point"
      },
      {
       "p": "Un point se représente par une croix. **Le nom d'un point s'écrit avec une majuscule d'imprimerie** : ce sont les points A, B, C. Attention : ABC est le nom d'un **triangle** !"
      },
      {
       "h": "La droite"
      },
      {
       "svg": "<svg viewBox=\"0 0 320 120\" class=\"fig\" role=\"img\" aria-label=\"Trois types de lignes\"><path d=\"M20 25 q15 -20 30 0 t30 0 t30 0 t30 0 t30 0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><text x=\"200\" y=\"30\" class=\"figtxt\">ligne courbe</text><line x1=\"20\" y1=\"65\" x2=\"170\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2.5\"/><text x=\"200\" y=\"70\" class=\"figtxt\">ligne rectiligne</text><polyline points=\"20,100 60,85 70,110 120,90 170,105\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><text x=\"200\" y=\"105\" class=\"figtxt\">ligne brisée</text></svg>"
      },
      {
       "def": [
        "Droite",
        "Une droite est une **ligne rectiligne illimitée des 2 côtés**."
       ]
      },
      {
       "list": [
        "Une droite **n'a pas de longueur**.",
        "Une droite est composée d'une **infinité de points**.",
        "Le nom d'une droite s'écrit avec **2 parenthèses** (2 majuscules ou 2 minuscules) : (xy), (AB) ou (BA), (d).",
        "Une droite peut avoir plusieurs noms : (uv), (EF), (FE), (EG), (d)… mais **(EFG) est une notation fausse** !"
       ]
      },
      {
       "list": [
        "Par un point, il passe une **infinité de droites**.",
        "Par 2 points, il passe **une seule droite**."
       ]
      },
      {
       "svg": "<svg viewBox=\"0 0 320 130\" class=\"fig\" role=\"img\" aria-label=\"Droites concourantes\"><line x1=\"70\" y1=\"65\" x2=\"250\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"81.7\" y1=\"20.0\" x2=\"238.3\" y2=\"110.0\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"115.0\" y1=\"-13.299999999999997\" x2=\"205.0\" y2=\"143.3\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"160\" y1=\"-25\" x2=\"160\" y2=\"155\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"205.0\" y1=\"-13.299999999999997\" x2=\"115.0\" y2=\"143.3\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"65\" r=\"5\" fill=\"var(--accent)\" stroke=\"currentColor\" stroke-width=\"1.5\"/><text x=\"176\" y=\"60\" class=\"figtxt strong\">D</text><text x=\"160\" y=\"126\" text-anchor=\"middle\" class=\"figtxt\">5 droites concourantes en D</text></svg>"
      },
      {
       "p": "Les droites (d₁) à (d₅) sont **concourantes** en D. Le point D est appelé **point de concours**."
      },
      {
       "h": "La demi-droite"
      },
      {
       "def": [
        "Demi-droite",
        "Une demi-droite est une **portion** (un morceau) de droite **limitée d'un côté par son origine** et **illimitée de l'autre**."
       ]
      },
      {
       "list": [
        "Une demi-droite **n'a pas de longueur**.",
        "Son nom commence par un **crochet** (origine, en majuscule) et se termine par une **parenthèse** (côté illimité) : [MN) est la demi-droite d'origine M qui passe par N.",
        "Une demi-droite peut avoir plusieurs noms : [RS) = [RT) = [Ru).",
        "Attention : [GH) ≠ [HG) : ce ne sont pas les mêmes demi-droites !"
       ]
      },
      {
       "svg": "<svg viewBox=\"0 0 320 80\" class=\"fig\" role=\"img\" aria-label=\"Deux demi-droites d'origine K\"><line x1=\"20\" y1=\"40\" x2=\"160\" y2=\"40\" stroke=\"#D8334A\" stroke-width=\"4\"/><line x1=\"160\" y1=\"40\" x2=\"300\" y2=\"40\" stroke=\"#1E9E62\" stroke-width=\"4\"/><path d=\"M155 35 l10 10 M165 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"160\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">K</text><text x=\"22\" y=\"30\" class=\"figtxt strong\">x</text><text x=\"292\" y=\"30\" class=\"figtxt strong\">y</text><text x=\"90\" y=\"66\" text-anchor=\"middle\" class=\"figtxt\" style=\"fill:#D8334A\">[Kx)</text><text x=\"230\" y=\"66\" text-anchor=\"middle\" class=\"figtxt\" style=\"fill:#1E9E62\">[Ky)</text></svg>"
      },
      {
       "p": "Le point K de la droite (xy) partage la droite en 2 demi-droites : [Kx) et [Ky)."
      },
      {
       "h": "Le segment"
      },
      {
       "def": [
        "Segment",
        "Un segment est une **portion de droite limitée des 2 côtés par ses extrémités**."
       ]
      },
      {
       "list": [
        "Un segment **a une longueur**.",
        "Le nom d'un segment s'écrit avec **2 crochets et 2 majuscules** : [CD] ou [DC] est le segment d'extrémités C et D."
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Comment écrit-on le nom d'un **point** ?",
       "a": "Avec une **majuscule d'imprimerie**.",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "« **ABC** » est le nom…",
       "c": [
        "d'un triangle",
        "d'un point",
        "d'une droite",
        "d'un segment"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Définition d'une **droite** ?",
       "a": "Une **ligne rectiligne illimitée des 2 côtés**.",
       "fig": "droite",
       "t": "def"
      },
      {
       "k": "f",
       "q": "Définition d'une **demi-droite** ?",
       "a": "Une portion de droite **limitée d'un côté par son origine** et **illimitée de l'autre**.",
       "fig": "demidroite",
       "t": "def"
      },
      {
       "k": "f",
       "q": "Définition d'un **segment** ?",
       "a": "Une portion de droite **limitée des 2 côtés par ses extrémités**.",
       "fig": "segment",
       "t": "def"
      },
      {
       "k": "s",
       "q": "Droite, demi-droite ou segment ?",
       "bins": [
        "Droite",
        "Demi-droite",
        "Segment"
       ],
       "items": [
        [
         "Illimitée des 2 côtés",
         0
        ],
        [
         "S'écrit avec 2 parenthèses",
         0
        ],
        [
         "Limitée d'un côté par son origine",
         1
        ],
        [
         "Un crochet puis une parenthèse",
         1
        ],
        [
         "Limité par ses 2 extrémités",
         2
        ],
        [
         "A une longueur",
         2
        ],
        [
         "S'écrit avec 2 crochets",
         2
        ]
       ],
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Par **2 points**, il passe…",
       "c": [
        "une seule droite",
        "deux droites",
        "une infinité de droites",
        "aucune droite"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Par **un point**, il passe…",
       "c": [
        "une infinité de droites",
        "une seule droite",
        "deux droites",
        "aucune droite"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "Des droites qui se coupent toutes en un même point D sont…",
       "a": "**concourantes** en D ; D est le **point de concours**.",
       "svg": "<svg viewBox=\"0 0 320 130\" class=\"fig\" role=\"img\" aria-label=\"Droites concourantes\"><line x1=\"70\" y1=\"65\" x2=\"250\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"81.7\" y1=\"20.0\" x2=\"238.3\" y2=\"110.0\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"115.0\" y1=\"-13.299999999999997\" x2=\"205.0\" y2=\"143.3\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"160\" y1=\"-25\" x2=\"160\" y2=\"155\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"205.0\" y1=\"-13.299999999999997\" x2=\"115.0\" y2=\"143.3\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"65\" r=\"5\" fill=\"var(--accent)\" stroke=\"currentColor\" stroke-width=\"1.5\"/><text x=\"176\" y=\"60\" class=\"figtxt strong\">D</text><text x=\"160\" y=\"126\" text-anchor=\"middle\" class=\"figtxt\">5 droites concourantes en D</text></svg>",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Quelle notation est **fausse** ?",
       "c": [
        "(EFG)",
        "(EF)",
        "(GE)",
        "(d)"
       ],
       "a": 0,
       "x": "Le nom d'une droite s'écrit avec 2 lettres (ou une seule minuscule comme (d)), jamais 3.",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Quelle est l'**origine** de la demi-droite **[MN)** ?",
       "c": [
        "M",
        "N",
        "Elle n'en a pas",
        "M et N"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "[GH) et [HG) sont…",
       "c": [
        "deux demi-droites différentes",
        "la même demi-droite",
        "le même segment",
        "la même droite"
       ],
       "a": 0,
       "x": "L'origine n'est pas la même : G pour [GH), H pour [HG).",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "[CD] et [DC] sont…",
       "c": [
        "le même segment",
        "deux segments différents",
        "deux demi-droites",
        "deux droites"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Le point K de la droite (xy) partage cette droite en…",
       "c": [
        "2 demi-droites : [Kx) et [Ky)",
        "2 segments",
        "2 droites",
        "3 demi-droites"
       ],
       "a": 0,
       "svg": "<svg viewBox=\"0 0 320 80\" class=\"fig\" role=\"img\" aria-label=\"Deux demi-droites d'origine K\"><line x1=\"20\" y1=\"40\" x2=\"160\" y2=\"40\" stroke=\"#D8334A\" stroke-width=\"4\"/><line x1=\"160\" y1=\"40\" x2=\"300\" y2=\"40\" stroke=\"#1E9E62\" stroke-width=\"4\"/><path d=\"M155 35 l10 10 M165 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"160\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">K</text><text x=\"22\" y=\"30\" class=\"figtxt strong\">x</text><text x=\"292\" y=\"30\" class=\"figtxt strong\">y</text><text x=\"90\" y=\"66\" text-anchor=\"middle\" class=\"figtxt\" style=\"fill:#D8334A\">[Kx)</text><text x=\"230\" y=\"66\" text-anchor=\"middle\" class=\"figtxt\" style=\"fill:#1E9E62\">[Ky)</text></svg>",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Quelle figure **a une longueur** ?",
       "c": [
        "le segment",
        "la droite",
        "la demi-droite",
        "aucune"
       ],
       "a": 0,
       "t": "coeur"
      }
     ]
    },
    {
     "id": "ma-geom1-l4",
     "after": "ma-geom1-l1",
     "title": "Alignement et appartenance",
     "refs": [
      "MA-GEOM-AUTO1"
     ],
     "note": "Cahier de maths — « Premières notions de géométrie, langage géométrique ».",
     "fiche": [
      {
       "h": "Alignement"
      },
      {
       "def": [
        "Points alignés",
        "Des points sont **alignés** s'ils appartiennent à une **même droite**."
       ]
      },
      {
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, B, D sur une droite, C au-dessus\"><line x1=\"20\" y1=\"70\" x2=\"300\" y2=\"70\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M55 65 l10 10 M65 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"60\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M105 65 l10 10 M115 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"110\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><path d=\"M255 65 l10 10 M265 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"260\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M145 25 l10 10 M155 25 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"150\" y=\"20\" text-anchor=\"middle\" class=\"figtxt strong\">C</text></svg>"
      },
      {
       "p": "A, B, D sont alignés ; A, B, C ne sont pas alignés."
      },
      {
       "svg": "<svg viewBox=\"0 0 320 125\" class=\"fig\" role=\"img\" aria-label=\"Ligne en zigzag passant par M, N, O, P\"><line x1=\"20\" y1=\"60\" x2=\"300\" y2=\"60\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"5 5\"/><polyline points=\"30,15 60,60 90,105 120,60 150,15 180,60 210,105 240,60 270,15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M55 55 l10 10 M65 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"48\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">M</text><path d=\"M115 55 l10 10 M125 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"108\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">N</text><path d=\"M175 55 l10 10 M185 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"168\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><path d=\"M235 55 l10 10 M245 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"228\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">P</text></svg>"
      },
      {
       "p": "M, N, O, P sont alignés : ils sont sur une même droite (en pointillés), même si la ligne dessinée fait des zigzags !"
      },
      {
       "h": "Appartenance"
      },
      {
       "def": [
        "∈ et ∉",
        "Le symbole « ∈ » signifie « **appartient à** ». Le symbole « ∉ » signifie « **n'appartient pas à** »."
       ]
      },
      {
       "tip": "Ne confonds pas : ∈ et ∉ sont des symboles mathématiques ; e et E sont des lettres ; € veut dire euro."
      },
      {
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, C, D, E sur une droite, B en dehors\"><line x1=\"10\" y1=\"65\" x2=\"310\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M35 60 l10 10 M45 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"40\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M165 60 l10 10 M175 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"170\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M200 60 l10 10 M210 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"205\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M270 60 l10 10 M280 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"275\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M70 20 l10 10 M80 20 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"75\" y=\"15\" text-anchor=\"middle\" class=\"figtxt strong\">B</text></svg>"
      },
      {
       "list": [
        "B ∉ (AC)",
        "D ∈ (AC)",
        "E ∈ [CD)",
        "E ∉ [DC)"
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Quand dit-on que des points sont **alignés** ?",
       "a": "Quand ils appartiennent à une **même droite**.",
       "t": "def"
      },
      {
       "k": "q",
       "q": "Les points **A, B, D** sont-ils alignés ?",
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, B, D sur une droite, C au-dessus\"><line x1=\"20\" y1=\"70\" x2=\"300\" y2=\"70\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M55 65 l10 10 M65 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"60\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M105 65 l10 10 M115 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"110\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><path d=\"M255 65 l10 10 M265 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"260\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M145 25 l10 10 M155 25 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"150\" y=\"20\" text-anchor=\"middle\" class=\"figtxt strong\">C</text></svg>",
       "c": [
        "Oui",
        "Non"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Les points **A, B, C** sont-ils alignés ?",
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, B, D sur une droite, C au-dessus\"><line x1=\"20\" y1=\"70\" x2=\"300\" y2=\"70\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M55 65 l10 10 M65 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"60\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M105 65 l10 10 M115 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"110\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><path d=\"M255 65 l10 10 M265 65 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"260\" y=\"92\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M145 25 l10 10 M155 25 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"150\" y=\"20\" text-anchor=\"middle\" class=\"figtxt strong\">C</text></svg>",
       "c": [
        "Non",
        "Oui"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Les points **M, N, O, P** sont-ils alignés ?",
       "svg": "<svg viewBox=\"0 0 320 125\" class=\"fig\" role=\"img\" aria-label=\"Ligne en zigzag passant par M, N, O, P\"><line x1=\"20\" y1=\"60\" x2=\"300\" y2=\"60\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"5 5\"/><polyline points=\"30,15 60,60 90,105 120,60 150,15 180,60 210,105 240,60 270,15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M55 55 l10 10 M65 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"48\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">M</text><path d=\"M115 55 l10 10 M125 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"108\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">N</text><path d=\"M175 55 l10 10 M185 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"168\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><path d=\"M235 55 l10 10 M245 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"228\" y=\"54\" text-anchor=\"middle\" class=\"figtxt strong\">P</text></svg>",
       "c": [
        "Oui",
        "Non"
       ],
       "a": 0,
       "x": "Ils sont tous sur la droite en pointillés : peu importe la ligne en zigzag.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Les points **E, F, G** sont-ils alignés ?",
       "svg": "<svg viewBox=\"0 0 320 110\" class=\"fig\" role=\"img\" aria-label=\"Points E, F, G sur une ligne courbe\"><path d=\"M40 60 C40 15 110 15 110 55 C110 85 75 85 80 55 C85 25 190 10 200 22 C212 38 185 48 190 60 C196 75 175 85 168 95\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M195 17 l10 10 M205 17 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"216\" y=\"26\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M185 55 l10 10 M195 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"206\" y=\"64\" text-anchor=\"middle\" class=\"figtxt strong\">F</text><path d=\"M163 90 l10 10 M173 90 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"184\" y=\"99\" text-anchor=\"middle\" class=\"figtxt strong\">G</text></svg>",
       "c": [
        "Non",
        "Oui"
       ],
       "a": 0,
       "x": "Ils sont sur une ligne courbe, pas sur une même droite.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Que signifie le symbole **∉** ?",
       "c": [
        "n'appartient pas à",
        "appartient à",
        "est égal à",
        "euro"
       ],
       "a": 0,
       "t": "def"
      },
      {
       "k": "q",
       "q": "Quel symbole signifie « **appartient à** » ?",
       "c": [
        "∈",
        "€",
        "E",
        "e"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "B … (AC)",
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, C, D, E sur une droite, B en dehors\"><line x1=\"10\" y1=\"65\" x2=\"310\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M35 60 l10 10 M45 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"40\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M165 60 l10 10 M175 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"170\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M200 60 l10 10 M210 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"205\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M270 60 l10 10 M280 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"275\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M70 20 l10 10 M80 20 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"75\" y=\"15\" text-anchor=\"middle\" class=\"figtxt strong\">B</text></svg>",
       "c": [
        "∉",
        "∈"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "D … (AC)",
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, C, D, E sur une droite, B en dehors\"><line x1=\"10\" y1=\"65\" x2=\"310\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M35 60 l10 10 M45 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"40\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M165 60 l10 10 M175 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"170\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M200 60 l10 10 M210 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"205\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M270 60 l10 10 M280 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"275\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M70 20 l10 10 M80 20 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"75\" y=\"15\" text-anchor=\"middle\" class=\"figtxt strong\">B</text></svg>",
       "c": [
        "∈",
        "∉"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "E … [CD)",
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, C, D, E sur une droite, B en dehors\"><line x1=\"10\" y1=\"65\" x2=\"310\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M35 60 l10 10 M45 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"40\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M165 60 l10 10 M175 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"170\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M200 60 l10 10 M210 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"205\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M270 60 l10 10 M280 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"275\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M70 20 l10 10 M80 20 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"75\" y=\"15\" text-anchor=\"middle\" class=\"figtxt strong\">B</text></svg>",
       "c": [
        "∈",
        "∉"
       ],
       "a": 0,
       "x": "[CD) part de C, passe par D et continue : elle atteint E.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "E … [DC)",
       "svg": "<svg viewBox=\"0 0 320 95\" class=\"fig\" role=\"img\" aria-label=\"Points A, C, D, E sur une droite, B en dehors\"><line x1=\"10\" y1=\"65\" x2=\"310\" y2=\"65\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M35 60 l10 10 M45 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"40\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M165 60 l10 10 M175 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"170\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M200 60 l10 10 M210 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"205\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M270 60 l10 10 M280 60 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"275\" y=\"55\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M70 20 l10 10 M80 20 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"75\" y=\"15\" text-anchor=\"middle\" class=\"figtxt strong\">B</text></svg>",
       "c": [
        "∉",
        "∈"
       ],
       "a": 0,
       "x": "[DC) part de D et va vers C : elle part dans l'autre sens, loin de E.",
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-geom1-l2",
     "replace": true,
     "title": "Longueur, distance et milieu",
     "refs": [
      "MA-GEOM-01",
      "MA-GEOM-AUTO1",
      "MA-CALC-01"
     ],
     "note": "Cahier de maths — « Premières notions de géométrie, langage géométrique ».",
     "fiche": [
      {
       "h": "Longueur d'un segment, distance entre 2 points"
      },
      {
       "def": [
        "AB",
        "On note **AB** la **longueur du segment [AB]** ou la **distance entre les points A et B**."
       ]
      },
      {
       "p": "Le segment [IJ] mesure 4,6 cm. On note : **IJ = 4,6 cm**."
      },
      {
       "h": "Rédiger un calcul"
      },
      {
       "svg": "<svg viewBox=\"0 0 320 90\" class=\"fig\" role=\"img\" aria-label=\"C, D, E alignés\"><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M25 35 l10 10 M35 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"30\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M120 35 l10 10 M130 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"125\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M285 35 l10 10 M295 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"290\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><text x=\"78\" y=\"62\" text-anchor=\"middle\" class=\"figtxt\">2,2 m</text><text x=\"207\" y=\"62\" text-anchor=\"middle\" class=\"figtxt\">3,6 m</text><text x=\"160\" y=\"84\" text-anchor=\"middle\" class=\"figtxt strong\">CE = ?</text></svg>"
      },
      {
       "list": [
        "**On sait que** D ∈ [CE].",
        "**Donc** : CE = CD + DE (formule littérale)",
        "CE = 2,2 + 3,6",
        "CE = 5,8",
        "**La longueur CE vaut 5,8 mètres.** (phrase réponse)"
       ]
      },
      {
       "p": "Autre exemple : on sait que G ∈ [FH], FH = 9 km et GH = 5,5 km. Donc FG = FH − GH = 9 − 5,5 = 3,5. Le segment [FG] mesure 3,5 km."
      },
      {
       "h": "Milieu d'un segment"
      },
      {
       "def": [
        "Milieu",
        "Le milieu d'un segment est le point qui **appartient au segment** et qui **partage ce segment en 2 segments de même longueur**."
       ]
      },
      {
       "svg": "<svg viewBox=\"0 0 320 90\" class=\"fig\" role=\"img\" aria-label=\"I milieu de [AB]\"><line x1=\"40\" y1=\"45\" x2=\"280\" y2=\"45\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M35 40 l10 10 M45 40 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"40\" y=\"35\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M155 40 l10 10 M165 40 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"160\" y=\"35\" text-anchor=\"middle\" class=\"figtxt strong\">I</text><path d=\"M275 40 l10 10 M285 40 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"280\" y=\"35\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><path d=\"M96 37 l6 16 M104 37 l6 16 M216 37 l6 16 M224 37 l6 16\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><text x=\"160\" y=\"80\" text-anchor=\"middle\" class=\"figtxt\">I ∈ [AB] et IA = IB = AB ÷ 2</text></svg>"
      },
      {
       "p": "Si I est le milieu de [AB], alors I ∈ [AB] et IA = IB = AB ÷ 2, ou AB = 2 × IA = 2 × IB."
      },
      {
       "tip": "Pour montrer que des segments ont la **même longueur**, on note des **symboles identiques** sur chaque segment. Le signe « ≠ » signifie « est différent de »."
      },
      {
       "h": "Contre-exemples"
      },
      {
       "list": [
        "N ∈ [EF] mais NF ≠ NE : N n'est **pas** le milieu de [EF].",
        "PM = PN mais P ∉ [MN] : P n'est **pas** le milieu de [MN]."
       ]
      },
      {
       "p": "Calcul : on sait que I est le milieu de [AB] et AB = 8,4 dm. Or le milieu d'un segment le partage en deux segments de même longueur. Donc IB = AB ÷ 2 = 8,4 ÷ 2 = 4,2. Le segment [IB] mesure 4,2 dm."
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Que représente **AB** (sans crochets ni parenthèses) ?",
       "a": "La **longueur du segment [AB]**, c'est-à-dire la **distance entre A et B**.",
       "t": "def"
      },
      {
       "k": "q",
       "q": "Le segment [IJ] mesure 4,6 cm. Comment le note-t-on ?",
       "c": [
        "IJ = 4,6 cm",
        "[IJ] = 4,6 cm",
        "(IJ) = 4,6 cm",
        "[IJ) = 4,6 cm"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "D ∈ [CE], CD = 2,2 m et DE = 3,6 m. Combien mesure **CE** (en m) ?",
       "svg": "<svg viewBox=\"0 0 320 90\" class=\"fig\" role=\"img\" aria-label=\"C, D, E alignés\"><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M25 35 l10 10 M35 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"30\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M120 35 l10 10 M130 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"125\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M285 35 l10 10 M295 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"290\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><text x=\"78\" y=\"62\" text-anchor=\"middle\" class=\"figtxt\">2,2 m</text><text x=\"207\" y=\"62\" text-anchor=\"middle\" class=\"figtxt\">3,6 m</text><text x=\"160\" y=\"84\" text-anchor=\"middle\" class=\"figtxt strong\">CE = ?</text></svg>",
       "a": [
        "5,8"
       ],
       "num": 5.8,
       "x": "CE = CD + DE = 2,2 + 3,6 = 5,8. La longueur CE vaut 5,8 mètres.",
       "t": "exo"
      },
      {
       "k": "i",
       "q": "G ∈ [FH], FH = 9 km et GH = 5,5 km. Combien mesure **FG** (en km) ?",
       "a": [
        "3,5"
       ],
       "num": 3.5,
       "x": "FG = FH − GH = 9 − 5,5 = 3,5.",
       "t": "exo"
      },
      {
       "k": "o",
       "q": "Remets les étapes d'une rédaction dans l'ordre.",
       "items": [
        "On sait que…",
        "Donc : la formule littérale",
        "Le calcul avec les nombres",
        "La phrase réponse"
       ],
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "Définition du **milieu** d'un segment ?",
       "a": "Le point qui **appartient au segment** et qui le **partage en 2 segments de même longueur**.",
       "fig": "milieu",
       "t": "def"
      },
      {
       "k": "i",
       "q": "I est le milieu de [AB] et AB = 8,4 dm. Combien mesure **IB** (en dm) ?",
       "a": [
        "4,2"
       ],
       "num": 4.2,
       "x": "IB = AB ÷ 2 = 8,4 ÷ 2 = 4,2.",
       "t": "exo"
      },
      {
       "k": "i",
       "q": "K est le milieu de [MN] et KN = 2,6 m. Combien mesure **MN** (en m) ?",
       "a": [
        "5,2"
       ],
       "num": 5.2,
       "x": "MN = MK + KN = 2,6 + 2,6 = 5,2 (ou 2 × 2,6).",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Pour montrer que des segments ont la même longueur, on…",
       "c": [
        "note des symboles identiques sur chaque segment",
        "les colorie en rouge",
        "écrit leur nom entre crochets",
        "trace une droite"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Que signifie le signe **≠** ?",
       "c": [
        "est différent de",
        "est égal à",
        "appartient à",
        "est plus petit que"
       ],
       "a": 0,
       "t": "def"
      },
      {
       "k": "q",
       "q": "PM = PN, mais P ∉ [MN]. P est-il le milieu de [MN] ?",
       "c": [
        "Non, car P n'appartient pas au segment",
        "Oui, car PM = PN",
        "Oui, toujours",
        "On ne peut pas savoir"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "N ∈ [EF], mais NE ≠ NF. N est-il le milieu de [EF] ?",
       "c": [
        "Non, car NE ≠ NF",
        "Oui, car N ∈ [EF]",
        "Oui, toujours",
        "On ne peut pas savoir"
       ],
       "a": 0,
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-geom1-l5",
     "after": "ma-geom1-l2",
     "title": "Programme de construction et régionnement",
     "refs": [
      "MA-GEOM-AUTO1",
      "MA-GEOM-03"
     ],
     "note": "Cahier de maths — « Premières notions de géométrie, langage géométrique ».",
     "fiche": [
      {
       "h": "Programme de construction"
      },
      {
       "p": "Un programme de construction utilise des verbes précis : on **trace** les droites, demi-droites et segments ; on **place** les points, souvent « **tel que** » une condition."
      },
      {
       "list": [
        "Tracer une droite (d).",
        "Placer deux points N et E tels que N ∈ (d), E ∈ (d) et NE = 5 cm.",
        "Placer le point O milieu du segment [NE].",
        "Placer un point L tel que L ∉ (NE).",
        "Tracer la droite (NL), la demi-droite [LO) et le segment [LE].",
        "Placer le point S tel que S ∈ [LO) et S ∉ [LO]."
       ]
      },
      {
       "p": "On dit que le point O est le **point d'intersection** de la droite (d) et de la demi-droite [LS)."
      },
      {
       "h": "Régionnement entre 2 longueurs"
      },
      {
       "p": "Soit (d) la médiatrice du segment [AB]."
      },
      {
       "svg": "<svg viewBox=\"0 0 320 180\" class=\"fig\" role=\"img\" aria-label=\"Régionnement par la médiatrice (d) de [AB]\"><rect x=\"0\" y=\"0\" width=\"160\" height=\"150\" fill=\"#2B7BD9\" opacity=\".10\"/><rect x=\"160\" y=\"0\" width=\"160\" height=\"150\" fill=\"#D8334A\" opacity=\".10\"/><line x1=\"160\" y1=\"5\" x2=\"160\" y2=\"150\" stroke=\"#D8334A\" stroke-width=\"3\"/><text x=\"168\" y=\"20\" class=\"figtxt strong\">(d)</text><line x1=\"80\" y1=\"110\" x2=\"240\" y2=\"110\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M75 105 l10 10 M85 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"80\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M235 105 l10 10 M245 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"240\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><text x=\"80\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &lt; MB</text><text x=\"240\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &gt; MB</text><text x=\"160\" y=\"172\" text-anchor=\"middle\" class=\"figtxt\">sur (d) : MA = MB</text></svg>"
      },
      {
       "list": [
        "Sur la droite (d) : les points M tels que **MA = MB**.",
        "Du côté de A : les points M tels que **MA < MB**.",
        "Du côté de B : les points M tels que **MA > MB**."
       ]
      }
     ],
     "cards": [
      {
       "k": "s",
       "q": "Dans un programme de construction : tracer ou placer ?",
       "bins": [
        "Tracer",
        "Placer"
       ],
       "items": [
        [
         "une droite (d)",
         0
        ],
        [
         "le segment [LE]",
         0
        ],
        [
         "la demi-droite [LO)",
         0
        ],
        [
         "le point O milieu de [NE]",
         1
        ],
        [
         "un point L tel que L ∉ (NE)",
         1
        ],
        [
         "le point S tel que S ∈ [LO)",
         1
        ]
       ],
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "S ∈ [LO) et S ∉ [LO]. Où est S ?",
       "c": [
        "Sur la demi-droite [LO), au-delà de O",
        "Entre L et O",
        "Sur L",
        "En dehors de la demi-droite"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Qu'est-ce que le **point d'intersection** de deux lignes ?",
       "a": "Le point où elles se **coupent** (le point qui appartient aux deux).",
       "t": "def"
      },
      {
       "k": "q",
       "q": "(d) est la médiatrice de [AB]. Un point M **sur (d)** vérifie…",
       "svg": "<svg viewBox=\"0 0 320 180\" class=\"fig\" role=\"img\" aria-label=\"Régionnement par la médiatrice (d) de [AB]\"><rect x=\"0\" y=\"0\" width=\"160\" height=\"150\" fill=\"#2B7BD9\" opacity=\".10\"/><rect x=\"160\" y=\"0\" width=\"160\" height=\"150\" fill=\"#D8334A\" opacity=\".10\"/><line x1=\"160\" y1=\"5\" x2=\"160\" y2=\"150\" stroke=\"#D8334A\" stroke-width=\"3\"/><text x=\"168\" y=\"20\" class=\"figtxt strong\">(d)</text><line x1=\"80\" y1=\"110\" x2=\"240\" y2=\"110\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M75 105 l10 10 M85 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"80\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M235 105 l10 10 M245 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"240\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><text x=\"80\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &lt; MB</text><text x=\"240\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &gt; MB</text><text x=\"160\" y=\"172\" text-anchor=\"middle\" class=\"figtxt\">sur (d) : MA = MB</text></svg>",
       "c": [
        "MA = MB",
        "MA < MB",
        "MA > MB"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Un point M situé **du côté de A** (par rapport à la médiatrice de [AB]) vérifie…",
       "svg": "<svg viewBox=\"0 0 320 180\" class=\"fig\" role=\"img\" aria-label=\"Régionnement par la médiatrice (d) de [AB]\"><rect x=\"0\" y=\"0\" width=\"160\" height=\"150\" fill=\"#2B7BD9\" opacity=\".10\"/><rect x=\"160\" y=\"0\" width=\"160\" height=\"150\" fill=\"#D8334A\" opacity=\".10\"/><line x1=\"160\" y1=\"5\" x2=\"160\" y2=\"150\" stroke=\"#D8334A\" stroke-width=\"3\"/><text x=\"168\" y=\"20\" class=\"figtxt strong\">(d)</text><line x1=\"80\" y1=\"110\" x2=\"240\" y2=\"110\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M75 105 l10 10 M85 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"80\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M235 105 l10 10 M245 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"240\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><text x=\"80\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &lt; MB</text><text x=\"240\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &gt; MB</text><text x=\"160\" y=\"172\" text-anchor=\"middle\" class=\"figtxt\">sur (d) : MA = MB</text></svg>",
       "c": [
        "MA < MB",
        "MA = MB",
        "MA > MB"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Un point M situé **du côté de B** (par rapport à la médiatrice de [AB]) vérifie…",
       "svg": "<svg viewBox=\"0 0 320 180\" class=\"fig\" role=\"img\" aria-label=\"Régionnement par la médiatrice (d) de [AB]\"><rect x=\"0\" y=\"0\" width=\"160\" height=\"150\" fill=\"#2B7BD9\" opacity=\".10\"/><rect x=\"160\" y=\"0\" width=\"160\" height=\"150\" fill=\"#D8334A\" opacity=\".10\"/><line x1=\"160\" y1=\"5\" x2=\"160\" y2=\"150\" stroke=\"#D8334A\" stroke-width=\"3\"/><text x=\"168\" y=\"20\" class=\"figtxt strong\">(d)</text><line x1=\"80\" y1=\"110\" x2=\"240\" y2=\"110\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M75 105 l10 10 M85 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"80\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M235 105 l10 10 M245 105 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"240\" y=\"132\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><text x=\"80\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &lt; MB</text><text x=\"240\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">MA &gt; MB</text><text x=\"160\" y=\"172\" text-anchor=\"middle\" class=\"figtxt\">sur (d) : MA = MB</text></svg>",
       "c": [
        "MA > MB",
        "MA = MB",
        "MA < MB"
       ],
       "a": 0,
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-geom1-l3",
     "replace": true,
     "title": "Le cercle et le disque",
     "refs": [
      "MA-GEOM-02",
      "MA-GRAN-AUTO1"
     ],
     "note": "Cahier de maths — « Le cercle ».",
     "fiche": [
      {
       "h": "Vocabulaire"
      },
      {
       "def": [
        "Cercle",
        "Un cercle est un ensemble de points tous **équidistants** d'un point donné appelé **centre** du cercle. Équidistant = à la même distance."
       ]
      },
      {
       "svg": "<svg viewBox=\"0 0 320 210\" class=\"fig\" role=\"img\" aria-label=\"Vocabulaire du cercle\"><circle cx=\"150\" cy=\"105\" r=\"80\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M150 25 A80 80 0 0 0 93.4 48.4\" fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"6\" stroke-linecap=\"round\" opacity=\".6\"/><path d=\"M145 100 l10 10 M155 100 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"138\" y=\"109\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><line x1=\"150\" y1=\"105\" x2=\"230\" y2=\"105\" stroke=\"#159A6B\" stroke-width=\"3\"/><line x1=\"150\" y1=\"25\" x2=\"150\" y2=\"185\" stroke=\"#6B45B8\" stroke-width=\"3\"/><line x1=\"93.4\" y1=\"48.4\" x2=\"93.4\" y2=\"161.6\" stroke=\"#D99A00\" stroke-width=\"3\"/><path d=\"M225 100 l10 10 M235 100 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"242\" y=\"97\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><path d=\"M145 20 l10 10 M155 20 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"162\" y=\"21\" text-anchor=\"middle\" class=\"figtxt strong\">B</text><path d=\"M145 180 l10 10 M155 180 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"162\" y=\"197\" text-anchor=\"middle\" class=\"figtxt strong\">C</text><path d=\"M88.4 43.4 l10 10 M98.4 43.4 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"79.4\" y=\"48.4\" text-anchor=\"middle\" class=\"figtxt strong\">D</text><path d=\"M88.4 156.6 l10 10 M98.4 156.6 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"79.4\" y=\"169.6\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><text x=\"192\" y=\"124\" text-anchor=\"middle\" class=\"figtxt\" style=\"fill:#159A6B\">rayon [OA]</text><text x=\"158\" y=\"170\" class=\"figtxt\" style=\"fill:#6B45B8\">diamètre [BC]</text><text x=\"4\" y=\"110\" class=\"figtxt\" style=\"fill:#D99A00\">corde [DE]</text><text x=\"60\" y=\"22\" class=\"figtxt\">arc de cercle</text></svg>"
      },
      {
       "list": [
        "Un **rayon** est un segment qui joint le centre et un point du cercle.",
        "Une **corde** est un segment qui joint deux points du cercle.",
        "Un **diamètre** est un segment qui joint deux points du cercle et qui passe par le centre.",
        "Un **arc de cercle** est une portion de cercle située entre deux points du cercle."
       ]
      },
      {
       "list": [
        "Le **rayon** d'un cercle est la longueur commune de tous ses rayons : OA = OB = OC = OD = OE = 2,1 cm.",
        "Le **diamètre** est la longueur commune de tous ses diamètres : BC = 2 × OA = 4,2 cm.",
        "Un diamètre est une **corde particulière** qui passe par le centre.",
        "**Diamètre = 2 × rayon.**",
        "Le **milieu d'un diamètre** est le centre du cercle."
       ]
      },
      {
       "p": "B et C sont **diamétralement opposés**. Notations : 𝒞(O ; OA), 𝒞(O ; OB) ou 𝒞(O ; 2,1 cm) : le centre, puis le rayon (lettres ou valeur)."
      },
      {
       "tip": "Attention : le point O est le **centre** du cercle, ce **n'est pas un point du cercle** : A ∈ (𝒞) mais O ∉ (𝒞)."
      },
      {
       "h": "Le disque"
      },
      {
       "def": [
        "Disque",
        "Un disque est constitué d'un cercle et de l'ensemble des points situés à l'intérieur du cercle. Autrement dit, c'est l'ensemble des points situés à une distance **inférieure ou égale** (≤) au rayon d'un point donné, le centre."
       ]
      },
      {
       "p": "Notations : 𝒟(I ; IJ) = 𝒟(I ; 1,5 cm)."
      },
      {
       "h": "Régionnement entre une longueur et un nombre"
      },
      {
       "svg": "<svg viewBox=\"0 0 320 190\" class=\"fig\" role=\"img\" aria-label=\"Régionnement par le cercle de centre O et de rayon r\"><rect x=\"0\" y=\"0\" width=\"320\" height=\"190\" fill=\"#D8334A\" opacity=\".08\"/><circle cx=\"160\" cy=\"95\" r=\"65\" fill=\"#2B7BD9\" fill-opacity=\".14\" stroke=\"currentColor\" stroke-width=\"3\"/><path d=\"M155 90 l10 10 M165 90 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"148\" y=\"99\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><line x1=\"160\" y1=\"95\" x2=\"225\" y2=\"95\" stroke=\"currentColor\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><text x=\"192\" y=\"88\" text-anchor=\"middle\" class=\"figtxt\">r</text><path d=\"M220 90 l10 10 M230 90 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"237\" y=\"89\" text-anchor=\"middle\" class=\"figtxt strong\">I</text><text x=\"160\" y=\"130\" text-anchor=\"middle\" class=\"figtxt strong\">OM &lt; r</text><text x=\"160\" y=\"178\" text-anchor=\"middle\" class=\"figtxt strong\">sur le cercle : OM = r</text><text x=\"10\" y=\"22\" class=\"figtxt strong\">OM &gt; r</text></svg>"
      },
      {
       "list": [
        "**OM = r** : M est **sur le cercle**.",
        "**OM < r** : M est **à l'intérieur** du cercle.",
        "**OM > r** : M est **à l'extérieur** du cercle."
       ]
      },
      {
       "h": "Reporter une longueur au compas"
      },
      {
       "svg": "<svg viewBox=\"0 0 320 132\" class=\"fig\" role=\"img\" aria-label=\"Reporter des longueurs au compas\"><polyline points=\"20,40 80,30 140,60 180,55 230,75\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M15 35 l10 10 M25 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"20\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">P</text><path d=\"M75 25 l10 10 M85 25 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"80\" y=\"20\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M135 55 l10 10 M145 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"140\" y=\"50\" text-anchor=\"middle\" class=\"figtxt strong\">N</text><path d=\"M175 50 l10 10 M185 50 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"180\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">T</text><path d=\"M225 70 l10 10 M235 70 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"230\" y=\"65\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><line x1=\"20\" y1=\"100\" x2=\"258\" y2=\"100\" stroke=\"var(--accent)\" stroke-width=\"3\"/><path d=\"M15 95 l10 10 M25 95 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"20\" y=\"90\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><path d=\"M253 95 l10 10 M263 95 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"258\" y=\"90\" text-anchor=\"middle\" class=\"figtxt strong\">M</text><text x=\"140\" y=\"126\" text-anchor=\"middle\" class=\"figtxt\">OM = PE + EN + NT + TA</text></svg>"
      },
      {
       "p": "Pour construire [OM] tel que OM = PE + EN + NT + TA, on prend chaque longueur au compas et on la reporte bout à bout sur une demi-droite d'origine O."
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Définition d'un **cercle** ?",
       "a": "Un ensemble de points tous **équidistants** d'un point donné appelé **centre**.",
       "t": "def"
      },
      {
       "k": "q",
       "q": "« Équidistant » signifie…",
       "c": [
        "à la même distance",
        "très loin",
        "au milieu",
        "sur une droite"
       ],
       "a": 0,
       "t": "def"
      },
      {
       "k": "p",
       "q": "Associe chaque mot à sa définition.",
       "pairs": [
        [
         "rayon",
         "joint le centre et un point du cercle"
        ],
        [
         "corde",
         "joint deux points du cercle"
        ],
        [
         "diamètre",
         "corde qui passe par le centre"
        ],
        [
         "arc de cercle",
         "portion de cercle entre deux points"
        ]
       ],
       "t": "def"
      },
      {
       "k": "q",
       "q": "Le centre O est-il un **point du cercle** ?",
       "c": [
        "Non : O ∉ (𝒞)",
        "Oui : O ∈ (𝒞)",
        "Seulement si le rayon est petit",
        "On ne peut pas savoir"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Le **milieu d'un diamètre** est…",
       "c": [
        "le centre du cercle",
        "un point du cercle",
        "l'extrémité d'une corde",
        "le rayon"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Que signifie **𝒞(O ; 2,1 cm)** ?",
       "c": [
        "le cercle de centre O et de rayon 2,1 cm",
        "le cercle de diamètre 2,1 cm",
        "le disque de centre O",
        "le point O à 2,1 cm"
       ],
       "a": 0,
       "t": "def"
      },
      {
       "k": "q",
       "q": "B et C sont **diamétralement opposés** sur le cercle. Alors [BC] est…",
       "c": [
        "un diamètre",
        "un rayon",
        "un arc de cercle",
        "le centre"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "g",
       "g": "rayon",
       "n": 3,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Définition d'un **disque** ?",
       "a": "Un cercle et l'ensemble des points situés **à l'intérieur** : les points à une distance **inférieure ou égale** au rayon du centre.",
       "t": "def"
      },
      {
       "k": "q",
       "q": "(𝒞) est le cercle de centre O et de rayon r. Si **OM > r**, M est…",
       "svg": "<svg viewBox=\"0 0 320 190\" class=\"fig\" role=\"img\" aria-label=\"Régionnement par le cercle de centre O et de rayon r\"><rect x=\"0\" y=\"0\" width=\"320\" height=\"190\" fill=\"#D8334A\" opacity=\".08\"/><circle cx=\"160\" cy=\"95\" r=\"65\" fill=\"#2B7BD9\" fill-opacity=\".14\" stroke=\"currentColor\" stroke-width=\"3\"/><path d=\"M155 90 l10 10 M165 90 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"148\" y=\"99\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><line x1=\"160\" y1=\"95\" x2=\"225\" y2=\"95\" stroke=\"currentColor\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><text x=\"192\" y=\"88\" text-anchor=\"middle\" class=\"figtxt\">r</text><path d=\"M220 90 l10 10 M230 90 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"237\" y=\"89\" text-anchor=\"middle\" class=\"figtxt strong\">I</text><text x=\"160\" y=\"130\" text-anchor=\"middle\" class=\"figtxt strong\">OM &lt; r</text><text x=\"160\" y=\"178\" text-anchor=\"middle\" class=\"figtxt strong\">sur le cercle : OM = r</text><text x=\"10\" y=\"22\" class=\"figtxt strong\">OM &gt; r</text></svg>",
       "c": [
        "à l'extérieur du cercle",
        "sur le cercle",
        "à l'intérieur du cercle",
        "le centre"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Si **OM = r**, le point M est…",
       "c": [
        "sur le cercle",
        "à l'intérieur du cercle",
        "à l'extérieur du cercle",
        "le centre"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "s",
       "q": "Cercle de centre O et de rayon **3 cm**. Où est le point M ?",
       "bins": [
        "Sur le cercle",
        "À l'intérieur",
        "À l'extérieur"
       ],
       "items": [
        [
         "OM = 3 cm",
         0
        ],
        [
         "OM = 2 cm",
         1
        ],
        [
         "OM = 2,9 cm",
         1
        ],
        [
         "M = O (OM = 0)",
         1
        ],
        [
         "OM = 5 cm",
         2
        ],
        [
         "OM = 3,1 cm",
         2
        ]
       ],
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Pour construire [OM] tel que OM = PE + EN + NT + TA, on utilise…",
       "svg": "<svg viewBox=\"0 0 320 132\" class=\"fig\" role=\"img\" aria-label=\"Reporter des longueurs au compas\"><polyline points=\"20,40 80,30 140,60 180,55 230,75\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M15 35 l10 10 M25 35 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"20\" y=\"30\" text-anchor=\"middle\" class=\"figtxt strong\">P</text><path d=\"M75 25 l10 10 M85 25 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"80\" y=\"20\" text-anchor=\"middle\" class=\"figtxt strong\">E</text><path d=\"M135 55 l10 10 M145 55 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"140\" y=\"50\" text-anchor=\"middle\" class=\"figtxt strong\">N</text><path d=\"M175 50 l10 10 M185 50 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"180\" y=\"45\" text-anchor=\"middle\" class=\"figtxt strong\">T</text><path d=\"M225 70 l10 10 M235 70 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"230\" y=\"65\" text-anchor=\"middle\" class=\"figtxt strong\">A</text><line x1=\"20\" y1=\"100\" x2=\"258\" y2=\"100\" stroke=\"var(--accent)\" stroke-width=\"3\"/><path d=\"M15 95 l10 10 M25 95 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"20\" y=\"90\" text-anchor=\"middle\" class=\"figtxt strong\">O</text><path d=\"M253 95 l10 10 M263 95 l-10 10\" stroke=\"currentColor\" stroke-width=\"2\"/><text x=\"258\" y=\"90\" text-anchor=\"middle\" class=\"figtxt strong\">M</text><text x=\"140\" y=\"126\" text-anchor=\"middle\" class=\"figtxt\">OM = PE + EN + NT + TA</text></svg>",
       "c": [
        "le compas, pour reporter chaque longueur bout à bout",
        "le rapporteur",
        "une équerre seulement",
        "une calculatrice"
       ],
       "a": 0,
       "t": "coeur"
      }
     ]
    },
    {
     "id": "ma-geom1-l6",
     "after": "ma-geom1-l3",
     "title": "Les triangles",
     "refs": [
      "MA-GEOM-06",
      "MA-GEOM-01"
     ],
     "note": "Cahier de maths — « Les triangles ».",
     "fiche": [
      {
       "svg": "<svg viewBox=\"0 0 330 150\" class=\"fig\" role=\"img\" aria-label=\"Trois sortes de triangles\"><polygon points=\"15,115 95,115 40,45\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><polygon points=\"165,25 130,115 200,115\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M142.5 65.0 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><path d=\"M177.5 65.0 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><polygon points=\"240,115 310,115 275,54.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"/><path d=\"M270.0 110.0 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><path d=\"M275.0 110.0 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><path d=\"M252.5 79.7 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><path d=\"M257.5 79.7 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><path d=\"M287.5 79.7 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><path d=\"M292.5 79.7 l5 10\" stroke=\"var(--accent)\" stroke-width=\"2.5\"/><text x=\"55\" y=\"140\" text-anchor=\"middle\" class=\"figtxt\">quelconque</text><text x=\"165\" y=\"140\" text-anchor=\"middle\" class=\"figtxt\">isocèle</text><text x=\"275\" y=\"140\" text-anchor=\"middle\" class=\"figtxt\">équilatéral</text></svg>"
      },
      {
       "def": [
        "Triangle",
        "Un triangle est un **polygone ayant trois côtés**."
       ]
      },
      {
       "def": [
        "Triangle isocèle",
        "Un triangle ayant **deux côtés de même longueur**."
       ]
      },
      {
       "def": [
        "Triangle équilatéral",
        "Un triangle ayant ses **trois côtés de même longueur**."
       ]
      },
      {
       "p": "À construire sur ton cahier, à la règle et au compas : le triangle NOE tel que NO = 3,5 cm, OE = 4,1 cm et NE = 2,8 cm ; le triangle TOM isocèle en O tel que OT = 5,3 cm et TM = 3,9 cm ; le triangle EAU équilatéral tel que EA = 4,5 cm."
      },
      {
       "h": "Construire un triangle"
      },
      {
       "p": "A et B désignent deux points distincts :"
      },
      {
       "list": [
        "Le **plus court chemin** pour aller de A à B est le **segment [AB]**.",
        "Pour tout point C, on a **AC + CB ≥ AB**.",
        "On a **AC + CB = AB** pour tous les points C du segment [AB], et uniquement pour eux."
       ]
      },
      {
       "p": "On peut construire un triangle dont on connaît les trois côtés lorsque **la longueur de son plus grand côté est inférieure à la somme des longueurs des deux autres**."
      },
      {
       "list": [
        "AB = 3 cm, BC = 8 cm, AC = 4 cm : BC > AB + AC, donc le triangle **n'est pas** constructible.",
        "DE = 3 cm, EF = 5 cm, DF = 4 cm : EF < DE + DF, donc le triangle **est** constructible (et il existe 2 possibilités pour le point D)."
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Définition d'un **triangle** ?",
       "a": "Un **polygone ayant trois côtés**.",
       "t": "def"
      },
      {
       "k": "f",
       "q": "Définition d'un triangle **isocèle** ?",
       "a": "Un triangle ayant **deux côtés de même longueur**.",
       "t": "def"
      },
      {
       "k": "f",
       "q": "Définition d'un triangle **équilatéral** ?",
       "a": "Un triangle ayant ses **trois côtés de même longueur**.",
       "t": "def"
      },
      {
       "k": "s",
       "q": "Quelle sorte de triangle ? (longueurs des 3 côtés)",
       "bins": [
        "Quelconque",
        "Isocèle",
        "Équilatéral"
       ],
       "items": [
        [
         "3 cm ; 4 cm ; 5 cm",
         0
        ],
        [
         "3,5 cm ; 4,1 cm ; 2,8 cm",
         0
        ],
        [
         "5 cm ; 5 cm ; 3 cm",
         1
        ],
        [
         "2 cm ; 6 cm ; 6 cm",
         1
        ],
        [
         "4,5 cm ; 4,5 cm ; 4,5 cm",
         2
        ],
        [
         "7 cm ; 7 cm ; 7 cm",
         2
        ]
       ],
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Le triangle TOM est **isocèle en O** et OT = 5,3 cm. Combien mesure OM ?",
       "c": [
        "5,3 cm",
        "3,9 cm",
        "10,6 cm",
        "On ne peut pas savoir"
       ],
       "a": 0,
       "x": "Isocèle en O : les deux côtés qui partent de O ont la même longueur, OT = OM.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "EAU est **équilatéral** et EA = 4,5 cm. Combien mesure AU ?",
       "c": [
        "4,5 cm",
        "9 cm",
        "2,25 cm",
        "On ne peut pas savoir"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Le plus court chemin pour aller de A à B est…",
       "c": [
        "le segment [AB]",
        "la demi-droite [AB)",
        "un arc de cercle",
        "un chemin passant par C"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Pour tout point C : AC + CB … AB",
       "c": [
        "≥",
        "<",
        "="
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "AC + CB = AB uniquement quand…",
       "c": [
        "C appartient au segment [AB]",
        "C est très loin",
        "C ∉ (AB)",
        "le triangle est isocèle"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Quand peut-on construire un triangle dont on connaît les 3 côtés ?",
       "a": "Quand la longueur du **plus grand côté** est **inférieure à la somme** des longueurs des deux autres.",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "AB = 3 cm, BC = 8 cm, AC = 4 cm. Le triangle ABC est-il constructible ?",
       "c": [
        "Non, car 8 > 3 + 4",
        "Oui, car 8 > 3 + 4",
        "Oui, toujours",
        "Non, car 3 < 4"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "s",
       "q": "Constructible ou pas ? (longueurs en cm)",
       "bins": [
        "Constructible",
        "Pas constructible"
       ],
       "items": [
        [
         "3 ; 4 ; 5",
         0
        ],
        [
         "2 ; 2 ; 3",
         0
        ],
        [
         "6 ; 6 ; 6",
         0
        ],
        [
         "3 ; 4 ; 8",
         1
        ],
        [
         "1 ; 2 ; 5",
         1
        ],
        [
         "2 ; 3 ; 6",
         1
        ]
       ],
       "t": "exo"
      }
     ]
    }
   ]
  }
 ]
}
);
