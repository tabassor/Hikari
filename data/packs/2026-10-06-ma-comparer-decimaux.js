/* Pack 2026-10-06-ma-comparer-decimaux — Comparer, arrondir et encadrer les nombres décimaux */
window.REPO_PACKS.push({
 "format": "hikari-pack",
 "version": 2,
 "id": "2026-10-06-ma-comparer-decimaux",
 "title": "Comparer, arrondir et encadrer les nombres décimaux",
 "created": "2026-10-06",
 "open": [
  "ma-decimaux-l3",
  "ma-decimaux-l4"
 ],
 "extend": [
  {
   "chapter": "ma-decimaux",
   "lessons": [
    {
     "id": "ma-decimaux-l3",
     "replace": true,
     "title": "Comparer, encadrer, ranger les nombres décimaux",
     "refs": [
      "MA-NOMB-04",
      "MA-NOMB-05"
     ],
     "note": "Cours de maths « Comparer les nombres décimaux » (pages 1 à 4), début octobre 2026.",
     "fiche": [
      {
       "h": "I. Abscisse d'un point"
      },
      {
       "def": [
        "Abscisse",
        "Sur une droite graduée, on repère chaque point par un nombre décimal appelé « **abscisse** »."
       ]
      },
      {
       "p": "Le point A a pour abscisse 3. On note : **A (3)**. On a aussi : B (6,5) et C (10,7)."
      },
      {
       "h": "II. Comparaison"
      },
      {
       "p": "Les nombres décimaux sont rangés (comme les points qu'ils repèrent) sur une droite graduée."
      },
      {
       "table": [
        [
         "Symbole",
         "Signifie"
        ],
        [
         "<",
         "est inférieur à (plus petit)"
        ],
        [
         ">",
         "est supérieur à (plus grand)"
        ],
        [
         "≤",
         "est inférieur ou égal à"
        ],
        [
         "≥",
         "est supérieur ou égal à"
        ]
       ]
      },
      {
       "p": "Sur la droite graduée, le point A est situé avant le point B : on dit que 3 **est inférieur à** 6,5. On note : 3 < 6,5. Le point C est situé après le point A : 10,7 **est supérieur à** 3. On note : 10,7 > 3."
      },
      {
       "h": "III. Méthode pour comparer"
      },
      {
       "list": [
        "a) Si deux nombres ont des **parties entières différentes**, le plus petit est celui qui a la **plus petite partie entière**. Exemple : 9,354 < 12,5 car 9 < 12.",
        "b) Si deux nombres ont la **même partie entière**, on compare leurs **parties décimales** :",
        "1re façon : on compare **chiffre par chiffre**. Exemple : 3,452 et 3,46 → 4 dixièmes = 4 dixièmes, puis 5 centièmes < 6 centièmes, donc 3,452 < 3,46.",
        "2e façon : on complète les parties décimales par des **zéros inutiles**. Exemple : 3,452 et 3,460 → 452 < 460, donc 3,452 < 3,46."
       ]
      },
      {
       "h": "IV. Encadrement"
      },
      {
       "def": [
        "Encadrer",
        "**Encadrer** un nombre, c'est donner à ce nombre une valeur inférieure et une valeur supérieure."
       ]
      },
      {
       "p": "Sur la droite graduée, le point B est situé entre les points A et C. Donc 6,5 est **compris entre** 3 et 10,7. On note : 3 < 6,5 < 10,7 ou 10,7 > 6,5 > 3."
      },
      {
       "def": [
        "Intercaler",
        "**Intercaler** un nombre entre deux nombres donnés, c'est trouver un nombre qui soit compris entre ces deux nombres."
       ]
      },
      {
       "p": "Exercice du cours (une réponse possible parmi beaucoup d'autres) : a) 50 < **50,5** < 51 ; b) 243,6 < **250** < 280,17 ; c) 799,55 < **799,555** < 799,56."
      },
      {
       "h": "V. Ordre croissant, ordre décroissant"
      },
      {
       "def": [
        "Ordre croissant",
        "**Classer/ranger** des nombres par **ordre croissant**, c'est les ranger du plus petit au plus grand. Exemple : 0,38 < 0,7 < 1,5 < 12,17 < 12,8."
       ]
      },
      {
       "def": [
        "Ordre décroissant",
        "**Classer/ranger** des nombres par **ordre décroissant**, c'est les ranger du plus grand au plus petit. Exemple : 58,7 > 58,35 > 42 > 1,15."
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Définition de l'**abscisse** d'un point.",
       "a": "Sur une **droite graduée**, on repère chaque point par un **nombre décimal** appelé « abscisse ».",
       "t": "def",
       "cle": [
        "graduée",
        "décimal"
       ]
      },
      {
       "k": "q",
       "q": "Le point A a pour abscisse 3. On note…",
       "c": [
        "A (3)",
        "A [3]",
        "3 (A)",
        "A = 3"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "p",
       "q": "Associe chaque symbole à sa signification.",
       "pairs": [
        [
         "<",
         "est inférieur à"
        ],
        [
         ">",
         "est supérieur à"
        ],
        [
         "≤",
         "est inférieur ou égal à"
        ],
        [
         "≥",
         "est supérieur ou égal à"
        ]
       ],
       "t": "def"
      },
      {
       "k": "i",
       "q": "Comment se lit le symbole **<** ?",
       "a": [
        "est inférieur à",
        "inférieur à",
        "est plus petit que",
        "plus petit que"
       ],
       "t": "def"
      },
      {
       "k": "i",
       "q": "Comment se lit le symbole **≥** ?",
       "a": [
        "est supérieur ou égal à",
        "supérieur ou égal à"
       ],
       "t": "def"
      },
      {
       "k": "f",
       "q": "Deux nombres ont des **parties entières différentes**. Lequel est le plus petit ?",
       "a": "Celui qui a la **plus petite partie entière** : 9,354 < 12,5 car 9 < 12.",
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "3,452 et 3,46 ont la **même partie entière**. Que compare-t-on ensuite ?",
       "c": [
        "leurs parties décimales, chiffre par chiffre",
        "leurs nombres de chiffres après la virgule",
        "seulement leurs tout derniers chiffres",
        "leurs parties entières une deuxième fois"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Pour comparer 3,452 et 3,46, la **2e façon** du cours consiste à…",
       "c": [
        "compléter par un zéro inutile : 3,460",
        "enlever le dernier chiffre : 3,45",
        "compter les chiffres : 4 contre 3",
        "arrondir à l'unité : 3 et 3"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Quel nombre est le plus grand ?",
       "c": [
        "3,5",
        "3,47",
        "3,449",
        "3,09"
       ],
       "a": 0,
       "t": "exo",
       "x": "Compare chiffre par chiffre : 5 dixièmes > 4 dixièmes. Un nombre plus long n'est pas forcément plus grand !"
      },
      {
       "k": "g",
       "g": "cmpDec",
       "n": 3,
       "t": "exo"
      },
      {
       "k": "g",
       "g": "numline",
       "n": 2,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Que veut dire **encadrer** un nombre ?",
       "a": "C'est donner à ce nombre une **valeur inférieure** et une **valeur supérieure**.",
       "t": "def",
       "cle": [
        "inférieure",
        "supérieure"
       ]
      },
      {
       "k": "f",
       "q": "Que veut dire **intercaler** un nombre entre deux nombres donnés ?",
       "a": "C'est trouver un nombre qui soit **compris entre** ces deux nombres.",
       "t": "def",
       "cle": [
        "trouver",
        "compris"
       ]
      },
      {
       "k": "q",
       "q": "Sur la droite graduée, B (6,5) est situé entre A (3) et C (10,7). On note…",
       "c": [
        "3 < 6,5 < 10,7",
        "6,5 < 3 < 10,7",
        "3 < 10,7 < 6,5",
        "10,7 < 6,5 < 3"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "g",
       "g": "intercale",
       "n": 3,
       "t": "exo"
      },
      {
       "k": "f",
       "q": "Que veut dire ranger des nombres par **ordre croissant** ?",
       "a": "C'est les ranger du **plus petit** au **plus grand**.",
       "t": "def"
      },
      {
       "k": "f",
       "q": "Que veut dire ranger des nombres par **ordre décroissant** ?",
       "a": "C'est les ranger du **plus grand** au **plus petit**.",
       "t": "def"
      },
      {
       "k": "o",
       "q": "Range ces nombres par ordre **croissant**.",
       "items": [
        "0,38",
        "0,7",
        "1,5",
        "12,17",
        "12,8"
       ],
       "t": "exo"
      },
      {
       "k": "o",
       "q": "Range ces nombres par ordre **décroissant**.",
       "items": [
        "58,7",
        "58,35",
        "42",
        "1,15"
       ],
       "t": "exo"
      },
      {
       "k": "o",
       "q": "Range ces nombres par ordre **croissant**.",
       "items": [
        "0,07",
        "0,1",
        "0,15",
        "0,5",
        "0,51"
       ],
       "t": "exo"
      }
     ]
    },
    {
     "id": "ma-decimaux-l4",
     "replace": true,
     "title": "Arrondi et encadrement à un rang donné",
     "refs": [
      "MA-NOMB-05"
     ],
     "note": "Cours de maths « Comparer les nombres décimaux » (pages 1 à 4), début octobre 2026.",
     "fiche": [
      {
       "h": "VI. Arrondi d'un nombre"
      },
      {
       "tip": "Les deux mains : la « **main du défaut** » compte 0, 1, 2, 3, 4 ; la « **main de l'excès** » compte 5, 6, 7, 8, 9."
      },
      {
       "def": [
        "Arrondi",
        "**L'arrondi** d'un nombre est la **valeur approchée** la plus proche du nombre."
       ]
      },
      {
       "p": "**Propriété** : pour arrondir un nombre, on coupe ce nombre au rang demandé :"
      },
      {
       "list": [
        "si le chiffre qui suit la troncature est compris entre **0 et 4**, alors l'arrondi est la **valeur approchée par défaut** ;",
        "si le chiffre qui suit la troncature est compris entre **5 et 9**, alors l'arrondi est la **valeur approchée par excès**."
       ]
      },
      {
       "def": [
        "≈ et ≃",
        "Les symboles « ≈ » et « ≃ » signifient « est environ égal à »."
       ]
      },
      {
       "p": "Exemples (arrondis à l'unité, sur les droites graduées du cours) : 108,341 ≈ **108** (le chiffre qui suit est 3) ; 76,829 ≈ **77** (8) ; 3148,58 ≈ **3149** (5)."
      },
      {
       "table": [
        [
         "3492,6518 arrondi…",
         "Arrondi"
        ],
        [
         "à l'unité (à 1 près)",
         "3493"
        ],
        [
         "au dixième (à 0,1 près)",
         "3492,7"
        ],
        [
         "au centième (à 0,01 près)",
         "3492,65"
        ],
        [
         "au millième (à 0,001 près)",
         "3492,652"
        ],
        [
         "à la dizaine (à 10 près)",
         "3490"
        ],
        [
         "à la centaine (à 100 près)",
         "3500"
        ]
       ]
      },
      {
       "h": "VII. Encadrement d'un nombre à un rang donné"
      },
      {
       "p": "Valeur approchée par **défaut** ou **troncature** < NOMBRE < valeur approchée par **excès**. Pour passer de l'une à l'autre : **+1 au rang demandé**."
      },
      {
       "list": [
        "**Consécutifs** = qui se suivent.",
        "**Valeur approchée par défaut** = troncature."
       ]
      },
      {
       "p": "Encadrement à l'unité (ou par **deux entiers consécutifs**) : 729 < 729,3456 < 730."
      },
      {
       "table": [
        [
         "729,3456 encadré…",
         "Encadrement"
        ],
        [
         "à l'unité (à 1 près)",
         "729 < 729,3456 < 730"
        ],
        [
         "au dixième (à 0,1 près)",
         "729,3 < 729,3456 < 729,4"
        ],
        [
         "au centième (à 0,01 près)",
         "729,34 < 729,3456 < 729,35"
        ],
        [
         "au millième (à 0,001 près)",
         "729,345 < 729,3456 < 729,346"
        ],
        [
         "à la dizaine (à 10 près)",
         "720 < 729,3456 < 730"
        ],
        [
         "à la centaine (à 100 près)",
         "700 < 729,3456 < 800"
        ]
       ]
      }
     ],
     "cards": [
      {
       "k": "f",
       "q": "Qu'est-ce que l'**arrondi** d'un nombre ?",
       "a": "La **valeur approchée** la **plus proche** du nombre.",
       "t": "def",
       "cle": [
        "approchée",
        "proche"
       ]
      },
      {
       "k": "f",
       "q": "Comment arrondit-on un nombre à un rang donné ?",
       "a": "On le **coupe au rang demandé**, puis on regarde le chiffre qui suit : de **0 à 4**, c'est la valeur approchée **par défaut** ; de **5 à 9**, c'est la valeur approchée **par excès**.",
       "t": "coeur"
      },
      {
       "k": "s",
       "q": "Le chiffre qui suit la troncature est… Main du défaut ou main de l'excès ?",
       "bins": [
        "Main du défaut",
        "Main de l'excès"
       ],
       "items": [
        [
         "0",
         0
        ],
        [
         "1",
         0
        ],
        [
         "2",
         0
        ],
        [
         "3",
         0
        ],
        [
         "4",
         0
        ],
        [
         "5",
         1
        ],
        [
         "6",
         1
        ],
        [
         "7",
         1
        ],
        [
         "8",
         1
        ],
        [
         "9",
         1
        ]
       ],
       "t": "coeur"
      },
      {
       "k": "i",
       "q": "Que signifient les symboles **≈** et **≃** ?",
       "a": [
        "est environ égal à",
        "environ égal à",
        "est à peu près égal à",
        "à peu près égal à"
       ],
       "t": "def"
      },
      {
       "k": "i",
       "q": "Complète : valeur approchée par défaut = …",
       "a": [
        "troncature",
        "la troncature"
       ],
       "t": "def"
      },
      {
       "k": "i",
       "q": "Que veut dire **consécutifs** ?",
       "a": [
        "qui se suivent",
        "se suivent",
        "des nombres qui se suivent"
       ],
       "t": "def"
      },
      {
       "k": "i",
       "q": "Arrondi **à l'unité** de **108,341** ?",
       "a": [
        "108"
       ],
       "t": "exo",
       "x": "Le chiffre qui suit est 3 : main du défaut.",
       "num": 108
      },
      {
       "k": "i",
       "q": "Arrondi **à l'unité** de **76,829** ?",
       "a": [
        "77"
       ],
       "t": "exo",
       "x": "Le chiffre qui suit est 8 : main de l'excès.",
       "num": 77
      },
      {
       "k": "i",
       "q": "Arrondi **à l'unité** de **3148,58** ?",
       "a": [
        "3149",
        "3 149"
       ],
       "t": "exo",
       "x": "Le chiffre qui suit est 5 : main de l'excès.",
       "num": 3149
      },
      {
       "k": "q",
       "q": "Arrondi **au dixième** de **3492,6518** ?",
       "c": [
        "3492,7",
        "3492,6",
        "3492,65",
        "3493"
       ],
       "a": 0,
       "t": "exo",
       "x": "On coupe au dixième : 3492,6 ; le chiffre qui suit est 5, donc par excès : 3492,7."
      },
      {
       "k": "i",
       "q": "Arrondi **au centième** de **3492,6518** ?",
       "a": [
        "3492,65",
        "3 492,65"
       ],
       "t": "exo",
       "x": "On coupe au centième : 3492,65 ; le chiffre qui suit est 1, donc par défaut.",
       "num": 3492.65
      },
      {
       "k": "i",
       "q": "Arrondi **au millième** de **3492,6518** ?",
       "a": [
        "3492,652",
        "3 492,652"
       ],
       "t": "exo",
       "x": "On coupe au millième : 3492,651 ; le chiffre qui suit est 8, donc par excès : 3492,652.",
       "num": 3492.652
      },
      {
       "k": "q",
       "q": "Arrondi **à la dizaine** de **3492,6518** ?",
       "c": [
        "3490",
        "3500",
        "3493",
        "3480"
       ],
       "a": 0,
       "t": "exo",
       "x": "On coupe à la dizaine : 3490 ; le chiffre qui suit (les unités) est 2, donc par défaut."
      },
      {
       "k": "q",
       "q": "Arrondi **à la centaine** de **3492,6518** ?",
       "c": [
        "3500",
        "3400",
        "3490",
        "3000"
       ],
       "a": 0,
       "t": "exo",
       "x": "On coupe à la centaine : 3400 ; le chiffre qui suit (les dizaines) est 9, donc par excès."
      },
      {
       "k": "g",
       "g": "arrondiRang",
       "n": 3,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Dans un encadrement à un rang donné, comment passe-t-on de la valeur par défaut à la valeur par excès ?",
       "c": [
        "On ajoute 1 au rang demandé",
        "On ajoute 1 au chiffre des unités",
        "On ajoute 10 au rang demandé",
        "On enlève 1 au rang demandé"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Encadrer **à l'unité**, c'est encadrer par deux entiers…",
       "c": [
        "consécutifs",
        "différents",
        "identiques",
        "décimaux"
       ],
       "a": 0,
       "t": "coeur"
      },
      {
       "k": "q",
       "q": "Encadre **729,3456** **à l'unité**.",
       "c": [
        "729 < 729,3456 < 730",
        "728 < 729,3456 < 729",
        "729,3 < 729,3456 < 729,4",
        "730 < 729,3456 < 731"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Encadre **729,3456** **au centième**.",
       "c": [
        "729,34 < 729,3456 < 729,35",
        "729,3 < 729,3456 < 729,4",
        "729,345 < 729,3456 < 729,346",
        "729,35 < 729,3456 < 729,36"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Encadre **729,3456** **à la dizaine**.",
       "c": [
        "720 < 729,3456 < 730",
        "700 < 729,3456 < 800",
        "729 < 729,3456 < 730",
        "710 < 729,3456 < 720"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "q",
       "q": "Encadre **729,3456** **à la centaine**.",
       "c": [
        "700 < 729,3456 < 800",
        "720 < 729,3456 < 730",
        "600 < 729,3456 < 700",
        "700 < 729,3456 < 710"
       ],
       "a": 0,
       "t": "exo"
      },
      {
       "k": "g",
       "g": "encadreRang",
       "n": 3,
       "t": "exo"
      }
     ]
    }
   ]
  }
 ]
});
