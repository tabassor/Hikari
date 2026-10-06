/* Pack 2026-10-05-ma-geom1-revanche — Revanche : langage géométrique */
window.REPO_PACKS.push({
 "format": "hikari-pack",
 "version": 2,
 "id": "2026-10-05-ma-geom1-revanche",
 "title": "Revanche : langage géométrique",
 "created": "2026-10-06",
 "open": [
  "ma-geom1-rev1"
 ],
 "extend": [
  {
   "chapter": "ma-geom1",
   "lessons": [
    {
     "id": "ma-geom1-rev1",
     "title": "Revanche : langage géométrique (interro n°2)",
     "remed": {
      "date": "2026-10-05",
      "title": "Interrogation n°2 : langage géométrique"
     },
     "refs": [
      "MA-GEOM-AUTO1",
      "MA-GEOM-01"
     ],
     "note": "Tirée de tes erreurs à l'interrogation n°2 sur le langage géométrique.",
     "fiche": [
      {
       "h": "Ta revanche : le langage géométrique"
      },
      {
       "p": "Tu connais déjà presque tout : l'alignement, la droite, le segment et le point de concours étaient justes. Il reste quatre petits pièges à déjouer."
      },
      {
       "def": [
        "Demi-droite",
        "Une portion de droite **limitée d'un côté par son origine** et **illimitée de l'autre**."
       ]
      },
      {
       "tip": "Attention : une demi-droite a une **origine**, pas une « extrémité ». Et n'oublie pas la fin : « et **illimitée de l'autre** »."
      },
      {
       "def": [
        "Segment",
        "Une portion de droite **limitée des deux côtés** par ses **extrémités**."
       ]
      },
      {
       "tip": "Attention : « limitée **des deux côtés** ». C'est ce qui fait la différence avec la demi-droite."
      },
      {
       "table": [
        [
         "Figure",
         "Notation",
         "Comment la lire"
        ],
        [
         "Droite passant par A et B",
         "(AB)",
         "deux parenthèses : illimitée des deux côtés"
        ],
        [
         "Demi-droite d'origine B passant par A",
         "[BA)",
         "l'origine B en premier, du côté du crochet"
        ],
        [
         "Segment d'extrémités A et B",
         "[AB]",
         "deux crochets : limité des deux côtés"
        ],
        [
         "Longueur du segment [AB]",
         "AB",
         "sans crochets ni parenthèses"
        ]
       ]
      },
      {
       "tip": "Attention : pour la demi-droite, **l'origine s'écrit en premier**, juste après le crochet. Pour la longueur, on écrit **AB**, pas un exemple comme « 16 cm »."
      },
      {
       "p": "Le symbole **≠** se lit **« est différent de »** : AB ≠ CD se lit « AB est différent de CD »."
      }
     ],
     "cards": [
      {
       "k": "f",
       "t": "def",
       "q": "Écris la définition d'une **demi-droite**.",
       "a": "Une portion de droite **limitée d'un côté par son origine** et **illimitée de l'autre**.",
       "x": "Deux morceaux à ne pas oublier : l'**origine** d'un côté, et « illimitée de l'autre ».",
       "cle": [
        "origine",
        "illimitée"
       ]
      },
      {
       "k": "q",
       "t": "def",
       "q": "Une demi-droite est limitée d'un côté par…",
       "c": [
        "son origine",
        "son extrémité",
        "son milieu",
        "son centre"
       ],
       "a": 0,
       "x": "Une demi-droite a une **origine**. Ce sont les segments qui ont des **extrémités**."
      },
      {
       "k": "s",
       "t": "coeur",
       "q": "Origine ou extrémités ?",
       "bins": [
        "Origine",
        "Extrémités"
       ],
       "items": [
        [
         "Le point de départ d'une demi-droite",
         0
        ],
        [
         "Les deux bouts d'un segment",
         1
        ],
        [
         "Dans [EF), le point E",
         0
        ],
        [
         "Dans [EF], les points E et F",
         1
        ]
       ],
       "x": "Demi-droite → une **origine**. Segment → deux **extrémités**."
      },
      {
       "k": "f",
       "t": "def",
       "q": "Écris la définition d'un **segment**.",
       "a": "Une portion de droite **limitée des deux côtés** par ses **extrémités**.",
       "x": "Sans « des deux côtés », la définition est incomplète.",
       "cle": [
        "deux",
        "extrémités"
       ]
      },
      {
       "k": "q",
       "t": "def",
       "q": "Complète la définition du segment : « Une portion de droite limitée **…** par ses extrémités. »",
       "c": [
        "des deux côtés",
        "d'un seul côté",
        "de l'autre côté",
        "au milieu"
       ],
       "a": 0,
       "x": "Un segment est limité **des deux côtés** ; une demi-droite d'un seul côté."
      },
      {
       "k": "q",
       "t": "exo",
       "q": "La demi-droite d'origine **B** passant par A se note…",
       "c": [
        "[BA)",
        "(AB]",
        "[AB)",
        "[BA]"
       ],
       "a": 0,
       "x": "L'origine B s'écrit en premier, juste après le crochet : **[BA)**."
      },
      {
       "k": "i",
       "t": "exo",
       "q": "Écris la notation de la demi-droite d'origine **E** passant par F.",
       "a": [
        "[EF)"
       ],
       "x": "Origine en premier, côté crochet : **[EF)**."
      },
      {
       "k": "f",
       "t": "coeur",
       "q": "Dans la notation d'une demi-droite, où se place l'**origine** ?",
       "a": "**En premier**, juste après le **crochet** : [BA) a pour origine B.",
       "x": "Le crochet est du côté de l'origine ; la parenthèse du côté illimité."
      },
      {
       "k": "p",
       "t": "exo",
       "q": "Associe chaque figure à sa notation.",
       "pairs": [
        [
         "Demi-droite d'origine M passant par N",
         "[MN)"
        ],
        [
         "Demi-droite d'origine N passant par M",
         "[NM)"
        ],
        [
         "Segment d'extrémités M et N",
         "[MN]"
        ],
        [
         "Droite passant par M et N",
         "(MN)"
        ]
       ],
       "x": "Regarde d'abord l'origine, puis les crochets ou les parenthèses."
      },
      {
       "k": "q",
       "t": "coeur",
       "q": "La **longueur** du segment [AB] se note…",
       "c": [
        "AB",
        "[AB]",
        "(AB)",
        "[AB)"
       ],
       "a": 0,
       "x": "La longueur s'écrit **sans crochets ni parenthèses** : AB."
      },
      {
       "k": "i",
       "t": "exo",
       "q": "Le segment [CD] mesure 7 cm. Complète avec la notation de la longueur : … = 7 cm",
       "a": [
        "CD",
        "DC",
        "CD = 7 cm",
        "CD=7cm",
        "CD = 7cm"
       ],
       "x": "On écrit **CD = 7 cm** : la longueur, c'est CD sans crochets."
      },
      {
       "k": "i",
       "t": "def",
       "q": "Comment se lit le symbole **≠** ?",
       "a": [
        "est différent de",
        "différent de",
        "est différente de",
        "différente de"
       ],
       "x": "≠ se lit **« est différent de »**."
      },
      {
       "k": "q",
       "t": "exo",
       "q": "Comment lit-on **AB ≠ CD** ?",
       "c": [
        "AB est différent de CD",
        "AB est égal à CD",
        "AB appartient à CD",
        "AB est parallèle à CD"
       ],
       "a": 0,
       "x": "≠ : « est différent de ». = : « est égal à ». ∈ : « appartient à »."
      }
     ]
    }
   ]
  }
 ]
});
