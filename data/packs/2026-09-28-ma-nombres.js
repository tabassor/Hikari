/* Pack 2026-09-28-ma-nombres — Maths — Écritures des nombres entiers et décimaux */
window.REPO_PACKS.push(
{
 "format": "hikari-pack",
 "version": 2,
 "id": "2026-09-28-ma-nombres",
 "title": "Maths — Écritures des nombres entiers et décimaux",
 "created": "2026-09-28",
 "open": [
  "ma-entiers-l1",
  "ma-entiers-l2",
  "ma-decimaux-l1",
  "ma-decimaux-l5",
  "ma-decimaux-l6"
 ],
 "extend": [
  {
   "chapter": "ma-entiers",
   "lessons": [
    {
     "id": "ma-entiers-l1",
     "replace": true,
     "title": "Nombres entiers : chiffres et classes",
     "refs": [
      "MA-NOMB-01",
      "MA-NOMB-02"
     ],
     "note": "Cahier de maths — « Utiliser les écritures des nombres entiers et nombres décimaux ».",
     "fiche": [
      {
       "h": "Chiffres et nombres entiers"
      },
      {
       "p": "Dans le système décimal, il y a **dix chiffres** : 0 ; 1 ; 2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8 ; 9."
      },
      {
       "p": "Pour compter les objets d'un ensemble fini (des billes dans un sac…), on utilise les nombres entiers, appelés **entiers naturels**. Exemples : 7 ; 1 083 ; 2 007 055."
      },
      {
       "h": "Le tableau des classes"
      },
      {
       "table": [
        [
         "Milliards",
         "Millions",
         "Mille (milliers)",
         "Unités"
        ],
        [
         "C D U",
         "C D U",
         "C D U",
         "C D U"
        ],
        [
         "1",
         "9 6 7",
         "8 0 2",
         "3 4 5"
        ]
       ]
      },
      {
       "p": "C = centaines, D = dizaines, U = unités."
      },
      {
       "def": [
        "Chiffre des unités",
        "Dans un nombre entier, c'est le **dernier chiffre**."
       ]
      },
      {
       "list": [
        "Dans 1 967 802 345 : 5 est le chiffre des unités, 4 des dizaines, 3 des centaines,",
        "2 des unités de mille, 0 des dizaines de mille, 8 des centaines de mille,",
        "7 des unités de millions, 6 des dizaines de millions, 9 des centaines de millions,",
        "1 est le chiffre des unités de milliards."
       ]
      },
      {
       "tip": "Attention : le **nombre** de centaines de 1 967 802 345 est **19 678 023** (on garde tout ce qui est à gauche du chiffre des centaines, lui compris)."
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Combien y a-t-il de **chiffres** dans le système décimal ?",
       "a": "Dix : 0 ; 1 ; 2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8 ; 9.",
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "Comment appelle-t-on les nombres entiers qui servent à compter ?",
       "a": "Les **entiers naturels**.",
       "t": "def"
      },
      {
       "k": "f",
       "q": "Dans un nombre **entier**, quel est le chiffre des unités ?",
       "a": "Le **dernier** chiffre.",
       "t": "coeur"
      },
      {
       "k": "o",
       "q": "Range les classes de la plus grande à la plus petite.",
       "items": [
        "Classe des milliards",
        "Classe des millions",
        "Classe des mille",
        "Classe des unités"
       ],
       "t": "coeur"
      },
      {
       "k": "p",
       "q": "Dans le tableau, que veulent dire les lettres ?",
       "pairs": [
        [
         "C",
         "centaines"
        ],
        [
         "D",
         "dizaines"
        ],
        [
         "U",
         "unités"
        ]
       ],
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Dans **1 967 802 345**, quel est le chiffre des **dizaines de millions** ?",
       "c": [
        "6",
        "9",
        "7",
        "1"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Dans **1 967 802 345**, le chiffre **8** est celui des…",
       "c": [
        "centaines de mille",
        "centaines",
        "unités de millions",
        "dizaines de mille"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "Quel est le **nombre de centaines** de **1 967 802 345** ?",
       "a": [
        "19678023",
        "19 678 023"
       ],
       "num": 19678023,
       "x": "On garde tout ce qui est à gauche du chiffre des centaines, lui compris.",
       "t": "exo"
      },
      {
       "k": "g",
       "g": "placeInt",
       "n": 3,
       "t": "exo"
      },
      {
       "k": "g",
       "g": "nbOf",
       "n": 3,
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-entiers-l2",
     "replace": true,
     "title": "Écrire les nombres en lettres",
     "refs": [
      "MA-NOMB-02",
      "FR-ORTH-01"
     ],
     "note": "Cahier de maths — « Utiliser les écritures des nombres entiers et nombres décimaux ».",
     "fiche": [
      {
       "h": "Les traits d'union"
      },
      {
       "p": "**Avant la réforme de l'orthographe** : un trait d'union seulement entre les nombres strictement inférieurs à 100 (vingt-six, mais cent sept), et jamais autour du mot « et » (vingt et un, soixante et onze)."
      },
      {
       "p": "**Après la réforme** (c'est ce que fait ta prof) : **tous** les nombres composés sont unis par des traits d'union (vingt-et-un, cent-sept, trois-mille)."
      },
      {
       "h": "Les accords"
      },
      {
       "list": [
        "**mille** est invariable : trois-mille.",
        "**million** et **milliard** s'accordent : quarante-millions, treize-milliards.",
        "**vingt** et **cent** s'accordent s'ils sont **multipliés** et **suivis d'aucun nombre** : quatre-vingts (80 = 4 × 20), trois-cents (300 = 3 × 100).",
        "Mais : quatre-vingt-deux, trois-cent-six, cent-vingt (120 = 100 + 20), mille-cent (1 100 = 1 000 + 100)."
       ]
      },
      {
       "p": "Exemple : 1 967 802 345 s'écrit **un-milliard-neuf-cent-soixante-sept-millions-huit-cent-deux-mille-trois-cent-quarante-cinq**."
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Depuis la réforme de l'orthographe, comment relie-t-on les mots d'un nombre écrit en lettres ?",
       "a": "Par des **traits d'union**, entre tous les mots.",
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "« **mille** » s'accorde-t-il ?",
       "a": "Non, **mille est invariable** : trois-mille.",
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "« **million** » et « **milliard** » s'accordent-ils ?",
       "a": "Oui : quarante-millions, treize-milliards.",
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "Quand « **vingt** » et « **cent** » prennent-ils un **s** ?",
       "a": "Quand ils sont **multipliés** et **suivis d'aucun nombre** : quatre-vingts, trois-cents.",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Comment s'écrit **80** ?",
       "c": [
        "quatre-vingts",
        "quatre-vingt",
        "quatres-vingts",
        "quatre-vingt-s"
       ],
       "a": 0,
       "x": "80 = 4 × 20 : vingt est multiplié et n'est suivi d'aucun nombre.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Comment s'écrit **82** ?",
       "c": [
        "quatre-vingt-deux",
        "quatre-vingts-deux",
        "quatre-vingt deux",
        "quatres-vingt-deux"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Comment s'écrit **120** ?",
       "c": [
        "cent-vingt",
        "cents-vingt",
        "cent-vingts",
        "cents-vingts"
       ],
       "a": 0,
       "x": "120 = 100 + 20 : ni cent ni vingt ne sont multipliés.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Comment s'écrit **306** ?",
       "c": [
        "trois-cent-six",
        "trois-cents-six",
        "trois cent-six",
        "trois-cents six"
       ],
       "a": 0,
       "x": "cent est suivi d'un nombre (six) : pas de s.",
       "t": "exo"
      },
      {
       "k": "s",
       "q": "Bien écrit ou mal écrit (orthographe de ta prof) ?",
       "bins": [
        "Bien écrit",
        "Mal écrit"
       ],
       "items": [
        [
         "trois-cents",
         0
        ],
        [
         "quatre-vingt-deux",
         0
        ],
        [
         "trois-mille",
         0
        ],
        [
         "quarante-millions",
         0
        ],
        [
         "trois-milles",
         1
        ],
        [
         "quatre-vingts-deux",
         1
        ],
        [
         "cent-vingts",
         1
        ],
        [
         "treize-milliard",
         1
        ]
       ],
       "t": "exo"
      },
      {
       "k": "g",
       "g": "words",
       "n": 4,
       "t": "exo"
      }
     ]
    }
   ]
  },
  {
   "chapter": "ma-decimaux",
   "lessons": [
    {
     "id": "ma-decimaux-l1",
     "replace": true,
     "title": "Nombres décimaux : vocabulaire et tableau",
     "refs": [
      "MA-NOMB-01",
      "MA-NOMB-AUTO1"
     ],
     "note": "Cahier de maths — « Utiliser les écritures des nombres entiers et nombres décimaux ».",
     "fiche": [
      {
       "h": "Vocabulaire"
      },
      {
       "def": [
        "Nombre décimal",
        "Nombre qui possède deux parties : une **partie entière** et une **partie décimale** (plus petite que 1). C'est un nombre qui a une virgule et qui est fini (qui se termine)."
       ]
      },
      {
       "p": "Exemple : dans **123,456**, la partie entière est **123** et la partie décimale est **0,456** (0,456 est plus petit que 1)."
      },
      {
       "def": [
        "Chiffre des unités",
        "Dans un nombre décimal, c'est le **dernier chiffre de la partie entière**, juste avant la virgule. Dans 123,456, c'est 3."
       ]
      },
      {
       "h": "Zéros inutiles"
      },
      {
       "p": "On peut écrire ou supprimer des zéros **à droite de la partie décimale** et **à gauche de la partie entière** : ce sont des « zéros inutiles ». 12,53 = 12,53000 = 0012,53 = 012,530."
      },
      {
       "p": "Un **nombre entier** est un nombre décimal dont la partie décimale est nulle : 26 = 26,0 = 26,00. **Les nombres entiers font partie des nombres décimaux !**"
      },
      {
       "h": "Le tableau après la virgule"
      },
      {
       "table": [
        [
         "… unités",
         ",",
         "dixièmes",
         "centièmes",
         "millièmes",
         "dix-millièmes",
         "cent-millièmes",
         "millionièmes"
        ],
        [
         "406 007",
         ",",
         "1",
         "8",
         "9",
         "5",
         "2",
         "3"
        ]
       ]
      },
      {
       "p": "1 unité = 10 dixièmes = 100 centièmes = 1 000 millièmes."
      },
      {
       "p": "Dans 406 007,189 523, le **nombre de dixièmes** est 4 060 071."
      },
      {
       "h": "Lire un nombre décimal"
      },
      {
       "list": [
        "quatre-cent-six-mille-sept **virgule** cent-quatre-vingt-neuf-mille-cinq-cent-vingt-trois",
        "quatre-cent-six-mille-sept **unités** cent-quatre-vingt-neuf-mille-cinq-cent-vingt-trois **millionièmes**",
        "quatre-cent-six-mille-sept unités un **dixième** huit **centièmes** neuf **millièmes** cinq **dix-millièmes** deux **cent-millièmes** trois **millionièmes**",
        "quatre-cent-six-milliards-sept-millions-cent-quatre-vingt-neuf-mille-cinq-cent-vingt-trois **millionièmes**"
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Qu'est-ce qu'un **nombre décimal** ?",
       "a": "Un nombre qui possède une **partie entière** et une **partie décimale** (plus petite que 1) ; il a une virgule et il est fini.",
       "t": "def"
      },
      {
       "k": "i",
       "q": "Quelle est la **partie entière** de **123,456** ?",
       "a": [
        "123"
       ],
       "num": 123,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "Quelle est la **partie décimale** de **123,456** ?",
       "a": [
        "0,456"
       ],
       "num": 0.456,
       "x": "La partie décimale s'écrit 0,456 : elle est plus petite que 1.",
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Dans un nombre **décimal**, quel est le chiffre des unités ?",
       "a": "Le **dernier chiffre de la partie entière**, juste avant la virgule.",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Où peut-on ajouter ou supprimer des **zéros inutiles** ?",
       "c": [
        "À droite de la partie décimale et à gauche de la partie entière",
        "À gauche de la partie décimale et à droite de la partie entière",
        "Partout dans le nombre, sans changer sa valeur",
        "Juste après la virgule, avant les autres chiffres"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "s",
       "q": "Le **zéro** est-il inutile ?",
       "bins": [
        "Zéro inutile",
        "Zéro utile"
       ],
       "items": [
        [
         "le 0 final de 12,530",
         0
        ],
        [
         "le 0 de 012,53",
         0
        ],
        [
         "le 0 de 26,0",
         0
        ],
        [
         "le 0 de 12,053",
         1
        ],
        [
         "le 0 de 102,5",
         1
        ],
        [
         "le 0 de 20,5",
         1
        ]
       ],
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Un nombre entier est-il un nombre décimal ?",
       "c": [
        "Oui : sa partie décimale est nulle (26 = 26,0)",
        "Non : il n'a pas de virgule (26 n'est pas décimal)",
        "Seulement s'il est pair (26 oui, 27 non)",
        "Seulement s'il est écrit avec une virgule"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "o",
       "q": "Range les rangs **après la virgule**, dans l'ordre.",
       "items": [
        "dixièmes",
        "centièmes",
        "millièmes",
        "dix-millièmes",
        "cent-millièmes",
        "millionièmes"
       ],
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Dans **406 007,189 523**, le chiffre **5** est celui des…",
       "c": [
        "dix-millièmes",
        "millièmes",
        "cent-millièmes",
        "centièmes"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "Quel est le **nombre de dixièmes** de **406 007,189 523** ?",
       "a": [
        "4060071",
        "4 060 071"
       ],
       "num": 4060071,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Combien de centièmes dans **une unité** ?",
       "a": "100 centièmes (1 unité = 10 dixièmes = 100 centièmes = 1 000 millièmes).",
       "t": "coeur"
      },
      {
       "k": "g",
       "g": "placeDec",
       "n": 4,
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-decimaux-l5",
     "after": "ma-decimaux-l1",
     "title": "Écriture fractionnaire et nombre mixte",
     "refs": [
      "MA-NOMB-03",
      "MA-FRAC-01",
      "MA-FRAC-04",
      "MA-NOMB-AUTO1"
     ],
     "note": "Cahier de maths — « Utiliser les écritures des nombres entiers et nombres décimaux ».",
     "fiche": [
      {
       "h": "Écriture fractionnaire"
      },
      {
       "def": [
        "Écriture fractionnaire",
        "Écriture de la forme a/b. Le nombre **a** est le **numérateur** (nombre de parts dans la fraction). Le nombre **b** est le **dénominateur** (nombre de parts dans l'unité) : il doit être **différent de 0**."
       ]
      },
      {
       "p": "Exemples : 2/3 ; 0,15/5 ; 74/0,9."
      },
      {
       "def": [
        "Fraction",
        "Si le numérateur et le dénominateur sont des **nombres entiers**, l'écriture fractionnaire est appelée **fraction** (2/3 est une fraction ; 0,15/5 et 74/0,9 n'en sont pas)."
       ]
      },
      {
       "h": "Comparer une fraction à 1"
      },
      {
       "list": [
        "numérateur **inférieur** au dénominateur → fraction **inférieure** à l'unité : 2/3 < 1 car 2 < 3",
        "numérateur **supérieur** au dénominateur → fraction **supérieure** à l'unité : 5/2 > 1 car 5 > 2",
        "numérateur **égal** au dénominateur → fraction **égale** à l'unité"
       ]
      },
      {
       "h": "Fractions décimales"
      },
      {
       "def": [
        "Fraction décimale",
        "Écriture fractionnaire d'un nombre décimal dont le dénominateur vaut 10, 100, 1 000…"
       ]
      },
      {
       "table": [
        [
         "Fraction décimale",
         "En lettres",
         "Écriture décimale"
        ],
        [
         "1/10",
         "un dixième",
         "0,1"
        ],
        [
         "15/1000",
         "quinze millièmes",
         "0,015"
        ],
        [
         "235/100",
         "deux-cent-trente-cinq centièmes",
         "2,35"
        ]
       ]
      },
      {
       "p": "On peut **décomposer** un nombre décimal en somme d'un nombre entier et de fractions décimales : 1 022,349 = 1 022 + 3/10 + 4/100 + 9/1000 = (1 × 1000) + (0 × 100) + (2 × 10) + (2 × 1) + (3 × 0,1) + (4 × 0,01) + (9 × 0,001)."
      },
      {
       "tip": "Dans ton cahier, on écrit les traits de fraction entre les deux « barres » du signe « = »."
      },
      {
       "h": "Nombre mixte"
      },
      {
       "def": [
        "Nombre mixte",
        "Écrire un nombre décimal supérieur à 1 comme la **somme d'un nombre entier et d'une fraction inférieure à 1**."
       ]
      },
      {
       "table": [
        [
         "Écriture décimale",
         "Fraction décimale",
         "Nombre mixte",
         "Entier + fractions décimales"
        ],
        [
         "1,25",
         "125/100",
         "1 + 25/100",
         "1 + 2/10 + 5/100"
        ]
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Qu'est-ce qu'une **écriture fractionnaire** ?",
       "a": "Une écriture de la forme **a/b**, avec b différent de 0.",
       "t": "def"
      },
      {
       "k": "p",
       "q": "Associe chaque mot à son sens.",
       "pairs": [
        [
         "numérateur",
         "nombre de parts dans la fraction"
        ],
        [
         "dénominateur",
         "nombre de parts dans l'unité"
        ]
       ],
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Dans une écriture fractionnaire, le dénominateur doit être…",
       "c": [
        "différent de 0",
        "plus grand que 10",
        "pair",
        "égal au numérateur"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "f",
       "q": "Quand une écriture fractionnaire s'appelle-t-elle une **fraction** ?",
       "a": "Quand le numérateur et le dénominateur sont des **nombres entiers**.",
       "t": "coeur"
      },
      {
       "k": "s",
       "q": "Fraction ou non ?",
       "bins": [
        "Fraction",
        "Écriture fractionnaire, pas une fraction"
       ],
       "items": [
        [
         "2/3",
         0
        ],
        [
         "5/2",
         0
        ],
        [
         "7/10",
         0
        ],
        [
         "0,15/5",
         1
        ],
        [
         "74/0,9",
         1
        ],
        [
         "3,5/7",
         1
        ]
       ],
       "t": "exo"
      },
      {
       "k": "s",
       "q": "Compare chaque fraction à 1.",
       "bins": [
        "< 1",
        "= 1",
        "> 1"
       ],
       "items": [
        [
         "2/3",
         0
        ],
        [
         "9/10",
         0
        ],
        [
         "7/7",
         1
        ],
        [
         "100/100",
         1
        ],
        [
         "5/2",
         2
        ],
        [
         "12/5",
         2
        ]
       ],
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Qu'est-ce qu'une **fraction décimale** ?",
       "a": "L'écriture fractionnaire d'un nombre décimal dont le dénominateur vaut 10, 100, 1 000…",
       "t": "def"
      },
      {
       "k": "p",
       "q": "Associe les écritures égales.",
       "pairs": [
        [
         "1/10",
         "0,1"
        ],
        [
         "15/1000",
         "0,015"
        ],
        [
         "235/100",
         "2,35"
        ],
        [
         "7/100",
         "0,07"
        ]
       ],
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "« **quinze millièmes** » s'écrit…",
       "c": [
        "15/1000",
        "15/100",
        "1/15",
        "1000/15"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Quelle décomposition est égale à **5,27** ?",
       "c": [
        "5 + 2/10 + 7/100",
        "5 + 27/1000",
        "5 + 2/100 + 7/10",
        "52/10 + 7"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Qu'est-ce qu'un **nombre mixte** ?",
       "a": "L'écriture d'un nombre décimal supérieur à 1 comme la **somme d'un nombre entier et d'une fraction inférieure à 1**.",
       "t": "def"
      },
      {
       "k": "q",
       "q": "Écris **1,25** sous forme de **nombre mixte**.",
       "c": [
        "1 + 25/100",
        "1 + 25/1000",
        "125/100",
        "12 + 5/10"
       ],
       "a": 0,
       "x": "1,25 = 1 + 0,25 et 0,25 = 25/100 (vingt-cinq centièmes). 125/100 est juste mais ce n'est pas un nombre mixte.",
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Écris **3,7** sous forme de **nombre mixte**.",
       "c": [
        "3 + 7/10",
        "3 + 7/100",
        "37/10",
        "3 + 10/7"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "g",
       "g": "decFrac",
       "n": 3,
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-decimaux-l6",
     "after": "ma-decimaux-l5",
     "title": "Pourcentages",
     "refs": [
      "MA-POUR-01",
      "MA-NOMB-03"
     ],
     "note": "Cahier de maths — « Utiliser les écritures des nombres entiers et nombres décimaux ».",
     "fiche": [
      {
       "def": [
        "Pourcentage",
        "Un pourcentage est une **fraction décimale ayant 100 comme dénominateur** : a % = a/100."
       ]
      },
      {
       "p": "Exemple : dans un collège, **25 %** des élèves de 6e pratiquent le football. Cela signifie que :"
      },
      {
       "list": [
        "s'il y avait 100 élèves en 6e, il y en aurait 25 qui pratiquent le football ;",
        "la **proportion** des élèves pratiquant le football est 25/100."
       ]
      },
      {
       "p": "On dit que le **pourcentage** d'élèves de 6e pratiquant le football dans ce collège est 25 %."
      },
      {
       "table": [
        [
         "Pourcentage",
         "Fraction décimale",
         "Écriture décimale",
         "Entier + fractions décimales",
         "Fraction"
        ],
        [
         "25 %",
         "25/100",
         "0,25",
         "0 + 2/10 + 5/100",
         "1/4"
        ]
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Qu'est-ce qu'un **pourcentage** ?",
       "a": "Une fraction décimale ayant **100** comme dénominateur : a % = a/100.",
       "t": "def"
      },
      {
       "k": "q",
       "q": "25 % des élèves font du football. S'il y avait **100** élèves, combien en feraient ?",
       "c": [
        "25",
        "4",
        "75",
        "250"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "La proportion d'élèves qui font du football est **25/100**. On dit que le pourcentage est…",
       "c": [
        "25 %",
        "100 %",
        "0,25 %",
        "4 %"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "Écris **25 %** en écriture décimale.",
       "a": [
        "0,25"
       ],
       "num": 0.25,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "Complète : **7 %** = … / 100",
       "a": [
        "7"
       ],
       "num": 7,
       "t": "exo"
      },
      {
       "k": "i",
       "q": "Écris **40 %** en écriture décimale.",
       "a": [
        "0,4",
        "0,40"
       ],
       "num": 0.4,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "**3/100** est égal à…",
       "c": [
        "3 %",
        "30 %",
        "0,3 %",
        "300 %"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "p",
       "q": "Associe chaque pourcentage à sa fraction.",
       "pairs": [
        [
         "25 %",
         "1/4"
        ],
        [
         "50 %",
         "1/2"
        ],
        [
         "10 %",
         "1/10"
        ],
        [
         "100 %",
         "1"
        ]
       ],
       "t": "coeur"
      }
     ]
    }
   ]
  }
 ]
}
);
