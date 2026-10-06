/* Contenu Hikari — généré par split.js puis éditable à la main.
   Structure : chapitre (séquence de la prof, avec son yōkai) → leçons (une ou deux séances) → cartes.
   Types de cartes : f par cœur · q QCM · i réponse à taper · g générateur · s classer · o ordonner · p associer.
   Leçons « stub » : plan de progression type (NON officiel), à remplir par packs ou photos. */
(window.CONTENT = window.CONTENT || { chapters: [] }).chapters.push(
{
 "id": "ma-entiers",
 "s": "ma",
 "period": 1,
 "title": "Nombres entiers et grands nombres",
 "kanji": "億",
 "refs": [
  "MA-NOMB-01",
  "MA-NOMB-02"
 ],
 "boss": {
  "name": "Gigasū, le géant aux mille zéros",
  "hp": 10
 },
 "sum": "Lire, écrire et décomposer les grands nombres, jusqu'aux milliards.",
 "lessons": [
  {
   "id": "ma-entiers-l1",
   "title": "Chiffres, nombres et classes",
   "fiche": [
    {
     "h": "Chiffres et nombres"
    },
    {
     "p": "Il y a **dix chiffres** (0 à 9). Avec eux on écrit une infinité de **nombres**, comme un alphabet de dix lettres."
    },
    {
     "h": "Les classes"
    },
    {
     "table": [
      [
       "Milliards",
       "Millions",
       "Mille",
       "Unités"
      ],
      [
       "c d u",
       "c d u",
       "c d u",
       "c d u"
      ],
      [
       "2",
       "0 4 5",
       "3 0 0",
       "1 7 8"
      ]
     ]
    },
    {
     "p": "On sépare les classes par un **espace** : 2 045 300 178 se lit « deux milliards quarante-cinq millions trois cent mille cent soixante-dix-huit »."
    },
    {
     "h": "Chiffre des… / nombre de…"
    },
    {
     "p": "Dans 45 372 : le **chiffre** des centaines est 3 ; le **nombre** de centaines est 453."
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "placeInt",
     "n": 5,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "nbOf",
     "n": 3,
     "t": "exo"
    },
    {
     "k": "f",
     "q": "Différence entre **chiffre** et **nombre** ?",
     "a": "Les chiffres (0 à 9) sont les symboles ; les nombres s'écrivent avec des chiffres.",
     "t": "coeur"
    },
    {
     "k": "f",
     "q": "Combien de zéros dans **un million** ? Et dans **un milliard** ?",
     "a": "Un million = 1 000 000 (6 zéros) ; un milliard = 1 000 000 000 (9 zéros).",
     "t": "coeur"
    },
    {
     "k": "q",
     "q": "Combien de milliers dans un million ?",
     "c": [
      "1 000",
      "100",
      "10 000",
      "1 000 000"
     ],
     "a": 0,
     "t": "coeur"
    },
    {
     "k": "o",
     "q": "Range ces nombres du plus petit au plus grand.",
     "items": [
      "98 765",
      "1 002 000",
      "1 020 000",
      "12 000 000",
      "1 000 000 000"
     ],
     "t": "exo"
    }
   ]
  },
  {
   "id": "ma-entiers-l2",
   "title": "Écrire les nombres en lettres",
   "fiche": [
    {
     "h": "Écrire en lettres"
    },
    {
     "list": [
      "**mille** est invariable : trois mille.",
      "**cent** et **vingt** prennent un s quand ils sont multipliés et terminent le nombre, ou sont suivis de million ou milliard : deux cents, quatre-vingts millions ; mais deux cent trois, quatre-vingt mille.",
      "**million** et **milliard** sont des noms : ils prennent un s (trois millions).",
      "Depuis la réforme de 1990, on peut relier tous les mots par des traits d'union (deux-cent-trois). Les deux écritures sont acceptées."
     ]
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "words",
     "n": 4,
     "t": "exo"
    },
    {
     "k": "q",
     "q": "Quelle écriture est correcte ?",
     "c": [
      "quatre-vingts",
      "quatre-vingt",
      "quatres-vingts",
      "quatre-vingts-un"
     ],
     "a": 0,
     "t": "exo"
    },
    {
     "k": "q",
     "q": "Quelle écriture est correcte ?",
     "c": [
      "deux mille",
      "deux milles",
      "deux mils",
      "deux-milles"
     ],
     "a": 0,
     "x": "Mille est invariable.",
     "t": "exo"
    }
   ]
  }
 ]
},
{
 "id": "ma-decimaux",
 "s": "ma",
 "period": 1,
 "title": "Nombres décimaux",
 "kanji": "点",
 "refs": [
  "MA-NOMB-AUTO1",
  "MA-NOMB-01",
  "MA-NOMB-03",
  "MA-NOMB-04",
  "MA-NOMB-05"
 ],
 "boss": {
  "name": "Virgulon, l'esprit de la virgule",
  "hp": 12
 },
 "sum": "Dixièmes, centièmes, millièmes ; comparer, ranger, arrondir, placer sur une droite graduée.",
 "lessons": [
  {
   "id": "ma-decimaux-l1",
   "title": "Dixièmes, centièmes, millièmes",
   "fiche": [
    {
     "h": "Partie entière, partie décimale"
    },
    {
     "p": "Dans **37,254** : la partie entière est 37, la partie décimale est 254 (millièmes). 2 est le chiffre des **dixièmes**, 5 celui des **centièmes**, 4 celui des **millièmes**."
    },
    {
     "table": [
      [
       "1 unité",
       "=",
       "10 dixièmes",
       "=",
       "100 centièmes",
       "=",
       "1 000 millièmes"
      ],
      [
       "1",
       "",
       "10 × 0,1",
       "",
       "100 × 0,01",
       "",
       "1 000 × 0,001"
      ]
     ]
    },
    {
     "h": "Fractions décimales"
    },
    {
     "p": "1/10 = 0,1 ; 1/100 = 0,01 ; 1/1000 = 0,001. Donc 37/100 = 0,37 et 254/1000 = 0,254."
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "placeDec",
     "n": 5,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "decFrac",
     "n": 4,
     "t": "exo"
    },
    {
     "k": "f",
     "q": "Combien de centièmes dans une unité ?",
     "a": "100 centièmes.",
     "t": "coeur"
    },
    {
     "k": "f",
     "q": "Combien de millièmes dans un dixième ?",
     "a": "100 millièmes (0,1 = 0,100).",
     "t": "coeur"
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
       "1/100",
       "0,01"
      ],
      [
       "1/1000",
       "0,001"
      ],
      [
       "37/100",
       "0,37"
      ],
      [
       "254/1000",
       "0,254"
      ]
     ],
     "t": "coeur"
    }
   ]
  },
  {
   "id": "ma-decimaux-l2",
   "title": "× et ÷ par 10, 100, 1 000",
   "fiche": [
    {
     "h": "Multiplier ou diviser par 10, 100, 1 000"
    },
    {
     "p": "Multiplier par 10 rend chaque chiffre **10 fois plus grand** : il avance d'un rang vers la gauche (3,45 × 10 = 34,5). Diviser par 100 recule chaque chiffre de deux rangs (3,45 ÷ 100 = 0,0345)."
    },
    {
     "tip": "Ne dis pas « on déplace la virgule » : ce sont les chiffres qui changent de rang. C'est la bonne technique de sabre."
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "mul10",
     "n": 6,
     "t": "exo"
    }
   ]
  },
  {
   "id": "ma-decimaux-l3",
   "title": "Comparer et ranger",
   "fiche": [
    {
     "h": "Comparer"
    },
    {
     "p": "On compare d'abord les parties entières, puis les dixièmes, puis les centièmes… 3,5 > 3,47 car 5 dixièmes > 4 dixièmes (et non parce que 47 > 5 !)."
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "cmpDec",
     "n": 5,
     "t": "exo"
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
     "x": "On compare les dixièmes : 5 > 4 > 0.",
     "t": "exo"
    },
    {
     "k": "q",
     "q": "0,7 et 0,70 sont…",
     "c": [
      "égaux",
      "différents : 0,70 est plus grand",
      "différents : 0,7 est plus grand",
      "impossibles à comparer"
     ],
     "a": 0,
     "t": "exo"
    },
    {
     "k": "o",
     "q": "Range du plus petit au plus grand.",
     "items": [
      "3,09",
      "3,449",
      "3,47",
      "3,5",
      "3,51"
     ],
     "t": "exo"
    },
    {
     "k": "o",
     "q": "Range du plus petit au plus grand.",
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
   "title": "Arrondir, encadrer, graduer",
   "fiche": [
    {
     "h": "Arrondir"
    },
    {
     "p": "Arrondi au dixième de 12,47 : il est entre 12,4 et 12,5 ; le chiffre suivant est 7 (≥ 5), on prend 12,5."
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "round",
     "n": 4,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "numline",
     "n": 5,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "encadre",
     "n": 3,
     "t": "exo"
    }
   ]
  }
 ]
},
{
 "id": "ma-geom1",
 "s": "ma",
 "period": 1,
 "title": "Points, droites, segments, cercle",
 "kanji": "円",
 "refs": [
  "MA-GEOM-AUTO1",
  "MA-GEOM-01",
  "MA-GEOM-02"
 ],
 "boss": {
  "name": "Kagebō, l'ombre du compas",
  "hp": 10
 },
 "sum": "Notations, codage, milieu, distance et vocabulaire du cercle.",
 "lessons": [
  {
   "id": "ma-geom1-l1",
   "title": "Points, droites, segments",
   "fiche": [
    {
     "h": "Notations"
    },
    {
     "fig": "notations"
    },
    {
     "table": [
      [
       "Notation",
       "Se lit",
       "C'est…"
      ],
      [
       "(AB)",
       "la droite AB",
       "illimitée des deux côtés"
      ],
      [
       "[AB)",
       "la demi-droite d'origine A passant par B",
       "limitée du côté de A"
      ],
      [
       "[AB]",
       "le segment AB",
       "limité par A et B"
      ],
      [
       "AB",
       "la longueur AB",
       "un nombre (la distance entre A et B)"
      ],
      [
       "C ∈ (AB)",
       "C appartient à la droite AB",
       ""
      ],
      [
       "D ∉ [AB]",
       "D n'appartient pas au segment AB",
       ""
      ]
     ]
    }
   ],
   "cards": [
    {
     "k": "f",
     "q": "Que représente **(AB)** ?",
     "a": "La droite passant par A et B (illimitée des deux côtés).",
     "fig": "droite",
     "t": "def"
    },
    {
     "k": "f",
     "q": "Que représente **[AB)** ?",
     "a": "La demi-droite d'origine A passant par B.",
     "fig": "demidroite",
     "t": "def"
    },
    {
     "k": "f",
     "q": "Que représente **[AB]** ?",
     "a": "Le segment d'extrémités A et B.",
     "fig": "segment",
     "t": "def"
    },
    {
     "k": "f",
     "q": "Que représente **AB** (sans crochets) ?",
     "a": "La longueur du segment [AB], c'est-à-dire la distance entre A et B.",
     "t": "def"
    },
    {
     "k": "q",
     "q": "Le symbole ∈ signifie…",
     "c": [
      "appartient à",
      "est égal à",
      "est parallèle à",
      "n'appartient pas à"
     ],
     "a": 0,
     "t": "def"
    },
    {
     "k": "p",
     "q": "Associe chaque notation à son nom.",
     "pairs": [
      [
       "(AB)",
       "la droite AB"
      ],
      [
       "[AB)",
       "la demi-droite d'origine A"
      ],
      [
       "[AB]",
       "le segment AB"
      ],
      [
       "AB",
       "la longueur AB"
      ]
     ],
     "t": "coeur"
    }
   ]
  },
  {
   "id": "ma-geom1-l2",
   "title": "Milieu, codage et distances",
   "fiche": [
    {
     "h": "Milieu d'un segment"
    },
    {
     "fig": "milieu"
    },
    {
     "p": "I est le **milieu** de [AB] si I ∈ [AB] et IA = IB. On code les longueurs égales par le même petit signe."
    },
    {
     "h": "Inégalité triangulaire"
    },
    {
     "p": "Pour trois points A, B, C : AC ≤ AB + BC. Le chemin direct est toujours le plus court. Égalité seulement si B ∈ [AC]."
    }
   ],
   "cards": [
    {
     "k": "f",
     "q": "Définition du **milieu** I de [AB] ?",
     "a": "I appartient à [AB] et IA = IB.",
     "fig": "milieu",
     "t": "def"
    },
    {
     "k": "q",
     "q": "AB = 3 cm et BC = 4 cm. Quelle longueur est IMPOSSIBLE pour AC ?",
     "c": [
      "8 cm",
      "7 cm",
      "5 cm",
      "2 cm"
     ],
     "a": 0,
     "x": "Inégalité triangulaire : AC ≤ AB + BC = 7 cm.",
     "t": "exo"
    },
    {
     "k": "q",
     "q": "Sur une figure, deux segments portent le même petit trait. Cela signifie…",
     "c": [
      "qu'ils ont la même longueur",
      "qu'ils sont perpendiculaires",
      "qu'ils sont parallèles",
      "qu'ils se croisent"
     ],
     "a": 0,
     "t": "coeur"
    }
   ]
  },
  {
   "id": "ma-geom1-l3",
   "title": "Cercle et disque",
   "fiche": [
    {
     "h": "Le cercle"
    },
    {
     "fig": "cercle"
    },
    {
     "p": "Le **cercle** de centre O et de rayon 3 cm est formé de tous les points situés à 3 cm de O. Le **disque** est la surface à l'intérieur."
    },
    {
     "list": [
      "**Rayon** : segment qui joint le centre à un point du cercle (et sa longueur).",
      "**Corde** : segment qui joint deux points du cercle.",
      "**Diamètre** : corde qui passe par le centre ; diamètre = 2 × rayon."
     ]
    }
   ],
   "cards": [
    {
     "k": "f",
     "q": "Qu'est-ce qu'une **corde** ?",
     "a": "Un segment qui relie deux points du cercle.",
     "fig": "cercle",
     "t": "def"
    },
    {
     "k": "f",
     "q": "Qu'est-ce qu'un **diamètre** ?",
     "a": "Une corde qui passe par le centre. Diamètre = 2 × rayon.",
     "t": "def"
    },
    {
     "k": "f",
     "q": "Différence entre **cercle** et **disque** ?",
     "a": "Le cercle est la ligne ; le disque est la surface qu'il délimite.",
     "t": "coeur"
    },
    {
     "k": "g",
     "g": "rayon",
     "n": 4,
     "t": "exo"
    },
    {
     "k": "q",
     "q": "Un cercle a un rayon de 4 cm. Un point M est à 5 cm du centre. M est…",
     "c": [
      "à l'extérieur du cercle",
      "sur le cercle",
      "à l'intérieur du disque",
      "le centre"
     ],
     "a": 0,
     "t": "exo"
    }
   ]
  }
 ]
},
{
 "id": "ma-auto",
 "s": "ma",
 "period": 1,
 "title": "Dojo des automatismes",
 "kanji": "速",
 "refs": [
  "MA-FRAC-AUTO1",
  "MA-PROP-AUTO1",
  "MA-GRAN-AUTO1",
  "MA-GRAN-AUTO3"
 ],
 "boss": {
  "name": "Flashō, le démon de la vitesse",
  "hp": 15
 },
 "sum": "Questions flash à réponse immédiate : tables, fractions simples, doubles et moitiés, conversions, durées.",
 "lessons": [
  {
   "id": "ma-auto-l1",
   "title": "Tables, doubles et moitiés",
   "fiche": [
    {
     "h": "À savoir instantanément"
    },
    {
     "list": [
      "Les tables de multiplication de 2 à 10",
      "1/2 = 0,5 ; 1/4 = 0,25 ; 3/4 = 0,75",
      "Prendre 2/3 de 12 : 12 ÷ 3 × 2 = 8",
      "Double, moitié, triple, tiers, quadruple, quart",
      "km, hm, dam, m, dm, cm, mm : chaque unité vaut 10 fois la suivante",
      "1 h = 60 min ; ½ h = 30 min ; ¼ h = 15 min ; 1 min = 60 s"
     ]
    },
    {
     "tip": "Les automatismes, c'est comme les katas : tous les jours un peu, et ton cerveau les fait tout seul."
    }
   ],
   "cards": [
    {
     "k": "g",
     "g": "tables",
     "n": 8,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "double",
     "n": 4,
     "t": "exo"
    }
   ]
  },
  {
   "id": "ma-auto-l2",
   "title": "Fractions simples",
   "cards": [
    {
     "k": "g",
     "g": "fracQty",
     "n": 4,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "frac14",
     "n": 3,
     "t": "exo"
    },
    {
     "k": "p",
     "q": "Associe chaque fraction à son écriture décimale.",
     "pairs": [
      [
       "1/2",
       "0,5"
      ],
      [
       "1/4",
       "0,25"
      ],
      [
       "3/4",
       "0,75"
      ],
      [
       "1/10",
       "0,1"
      ]
     ],
     "t": "coeur"
    }
   ]
  },
  {
   "id": "ma-auto-l3",
   "title": "Longueurs et durées",
   "cards": [
    {
     "k": "g",
     "g": "convLen",
     "n": 5,
     "t": "exo"
    },
    {
     "k": "g",
     "g": "durees",
     "n": 3,
     "t": "exo"
    },
    {
     "k": "o",
     "q": "Range ces unités de la plus grande à la plus petite.",
     "items": [
      "km",
      "hm",
      "dam",
      "m",
      "dm",
      "cm",
      "mm"
     ],
     "t": "coeur"
    }
   ]
  }
 ]
},
{
 "id": "ma-fractions",
 "s": "ma",
 "period": 2,
 "title": "Fractions",
 "kanji": "分",
 "refs": [
  "MA-FRAC-01",
  "MA-FRAC-02",
  "MA-FRAC-03",
  "MA-FRAC-04",
  "MA-FRAC-05"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-fractions-l1",
   "title": "La fraction quotient",
   "stub": true
  },
  {
   "id": "ma-fractions-l2",
   "title": "Fractions sur une demi-droite",
   "stub": true
  },
  {
   "id": "ma-fractions-l3",
   "title": "Comparer des fractions",
   "stub": true
  },
  {
   "id": "ma-fractions-l4",
   "title": "Ajouter et soustraire des fractions",
   "stub": true
  },
  {
   "id": "ma-fractions-l5",
   "title": "Fraction d'une quantité",
   "stub": true
  }
 ]
},
{
 "id": "ma-calcul",
 "s": "ma",
 "period": 2,
 "title": "Opérations sur les décimaux",
 "kanji": "算",
 "refs": [
  "MA-CALC-01",
  "MA-CALC-02",
  "MA-CALC-03",
  "MA-CALC-04",
  "MA-CALC-05",
  "MA-CALC-06"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-calcul-l1",
   "title": "Addition et soustraction de décimaux",
   "stub": true
  },
  {
   "id": "ma-calcul-l2",
   "title": "Multiplier des décimaux",
   "stub": true
  },
  {
   "id": "ma-calcul-l3",
   "title": "Ordre de grandeur",
   "stub": true
  },
  {
   "id": "ma-calcul-l4",
   "title": "Division euclidienne",
   "stub": true
  },
  {
   "id": "ma-calcul-l5",
   "title": "Division décimale",
   "stub": true
  },
  {
   "id": "ma-calcul-l6",
   "title": "Résoudre des problèmes",
   "stub": true
  }
 ]
},
{
 "id": "ma-angles",
 "s": "ma",
 "period": 3,
 "title": "Angles et triangles",
 "kanji": "角",
 "refs": [
  "MA-GEOM-04",
  "MA-GEOM-05",
  "MA-GEOM-06"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-angles-l1",
   "title": "Vocabulaire des angles",
   "stub": true
  },
  {
   "id": "ma-angles-l2",
   "title": "Mesurer et construire au rapporteur",
   "stub": true
  },
  {
   "id": "ma-angles-l3",
   "title": "La bissectrice",
   "stub": true
  },
  {
   "id": "ma-angles-l4",
   "title": "Construire des triangles",
   "stub": true
  },
  {
   "id": "ma-angles-l5",
   "title": "Somme des angles d'un triangle",
   "stub": true
  }
 ]
},
{
 "id": "ma-proba",
 "s": "ma",
 "period": 3,
 "title": "Probabilités et données",
 "kanji": "率",
 "refs": [
  "MA-DONN-01",
  "MA-DONN-02",
  "MA-PROBA-01",
  "MA-PROBA-02",
  "MA-PROBA-03"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-proba-l1",
   "title": "Tableaux et diagrammes",
   "stub": true
  },
  {
   "id": "ma-proba-l2",
   "title": "Recueillir des données",
   "stub": true
  },
  {
   "id": "ma-proba-l3",
   "title": "La probabilité, de 0 à 1",
   "stub": true
  },
  {
   "id": "ma-proba-l4",
   "title": "Calculer une probabilité",
   "stub": true
  },
  {
   "id": "ma-proba-l5",
   "title": "Fréquences et probabilités",
   "stub": true
  }
 ]
},
{
 "id": "ma-mesures",
 "s": "ma",
 "period": 4,
 "title": "Périmètres, aires, volumes",
 "kanji": "量",
 "refs": [
  "MA-GRAN-01",
  "MA-GRAN-02",
  "MA-GRAN-03"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-mesures-l1",
   "title": "Périmètres",
   "stub": true
  },
  {
   "id": "ma-mesures-l2",
   "title": "Périmètre du cercle",
   "stub": true
  },
  {
   "id": "ma-mesures-l3",
   "title": "Aires du carré et du rectangle",
   "stub": true
  },
  {
   "id": "ma-mesures-l4",
   "title": "Convertir des aires",
   "stub": true
  },
  {
   "id": "ma-mesures-l5",
   "title": "Volumes et cubes",
   "stub": true
  }
 ]
},
{
 "id": "ma-symetrie",
 "s": "ma",
 "period": 4,
 "title": "Médiatrice et symétrie axiale",
 "kanji": "鏡",
 "refs": [
  "MA-GEOM-03",
  "MA-GEOM-07"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-symetrie-l1",
   "title": "Médiatrice d'un segment",
   "stub": true
  },
  {
   "id": "ma-symetrie-l2",
   "title": "Symétrique d'un point",
   "stub": true
  },
  {
   "id": "ma-symetrie-l3",
   "title": "Symétrique d'une figure",
   "stub": true
  },
  {
   "id": "ma-symetrie-l4",
   "title": "Propriétés de la symétrie",
   "stub": true
  }
 ]
},
{
 "id": "ma-prop",
 "s": "ma",
 "period": 5,
 "title": "Proportionnalité et pourcentages",
 "kanji": "比",
 "refs": [
  "MA-PROP-01",
  "MA-PROP-02",
  "MA-PROP-03",
  "MA-POUR-01"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-prop-l1",
   "title": "Reconnaître la proportionnalité",
   "stub": true
  },
  {
   "id": "ma-prop-l2",
   "title": "Linéarité et retour à l'unité",
   "stub": true
  },
  {
   "id": "ma-prop-l3",
   "title": "Pourcentages",
   "stub": true
  },
  {
   "id": "ma-prop-l4",
   "title": "Échelles",
   "stub": true
  }
 ]
},
{
 "id": "ma-algo",
 "s": "ma",
 "period": 5,
 "title": "Algèbre et programmation",
 "kanji": "式",
 "refs": [
  "MA-ALG-01",
  "MA-ALG-02",
  "MA-INFO-01",
  "MA-INFO-02",
  "MA-INFO-03"
 ],
 "stub": true,
 "lessons": [
  {
   "id": "ma-algo-l1",
   "title": "Schémas en barres",
   "stub": true
  },
  {
   "id": "ma-algo-l2",
   "title": "Motifs qui évoluent",
   "stub": true
  },
  {
   "id": "ma-algo-l3",
   "title": "Instructions et boucles",
   "stub": true
  },
  {
   "id": "ma-algo-l4",
   "title": "Programmer un déplacement",
   "stub": true
  }
 ]
}
);
