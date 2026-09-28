/* Référentiel des programmes officiels applicables en 6e — année 2026-2027.
   Paraphrases fidèles (pas de citations intégrales) établies le 28/09/2026 à partir des textes publiés
   au Bulletin officiel et des ressources Éduscol. Les identifiants (FR-GRAM-01…) sont internes à Hikari
   et restent stables : c'est sur eux que s'accrochent leçons, cartes et photos.
   À relire contre les annexes PDF avant usage définitif (lecture faite via outil de résumé). */
window.PROGRAMME = {
  annee: "2026-2027",
  sources: {
    FRMA: { label: "Programmes de français et de mathématiques du cycle 3 — arrêté du 10/04/2025, BO n°16 du 17/04/2025 (en vigueur en 6e depuis 2025)", url: "https://www.education.gouv.fr/bo/2025/Hebdo16/MENE2504620A" },
    LV:   { label: "Programmes de langues vivantes — arrêté du 05/05/2025, BO n°22 du 29/05/2025 (en vigueur en 6e depuis 2025, cible A1+ en LVA, A1 en LVB)", url: "https://www.education.gouv.fr/bo/2025/Hebdo22/MENE2504621A" },
    HG:   { label: "Programme d'histoire-géographie du cycle 3 (2015 consolidé 2020) — BO n°31 du 30/07/2020. Reste en vigueur en 6e en 2026-2027 ; nouveau programme en 6e à la rentrée 2027", url: "https://www.education.gouv.fr/bo/20/Hebdo31/MENE2018714A.htm" },
    EMC:  { label: "Programme d'EMC — arrêté du 29/05/2024, BO n°24 du 13/06/2024 (en vigueur en 6e à la rentrée 2026)", url: "https://www.education.gouv.fr/bo/2024/Hebdo24/MENE2413934A" },
    SC:   { label: "Programme de sciences et technologie du cycle 3 — arrêté du 15/06/2023, BO n°25 du 22/06/2023 (en vigueur en 6e en 2026-2027 ; nouveau programme à la rentrée 2027)", url: "https://www.education.gouv.fr/bo/2023/Hebdo25/MENE2314101A" }
  },
  subjects: [
    { id: "fr", name: "Français", clan: "Clan du Pinceau", kanji: "筆", color: "#3F51D6", src: "FRMA",
      motto: "Les mots sont des sorts : trace-les juste.",
      domains: [
        { name: "Lecture", items: [
          { id: "FR-LECT-01", t: "Lire avec fluidité", d: "Lire silencieusement et à voix haute avec un phrasé adapté (groupes de mots, ponctuation, liaisons), environ 130 mots par minute." },
          { id: "FR-LECT-02", t: "Lire à voix haute avec expressivité", d: "Lire un texte de 10 à 20 lignes en regardant l'auditoire, en rendant émotions, intonation et dialogues." },
          { id: "FR-LECT-03", t: "Comprendre seul un texte", d: "Dégager le sens global et le genre, repérer explicite et implicite, faire des inférences, repérer liens logiques et reprises, justifier par le texte." },
          { id: "FR-LECT-04", t: "Lire pour apprendre", d: "Identifier nature et source d'un document, comparer des documents, relier les informations d'un document composite, interpréter une image." },
          { id: "FR-LECT-05", t: "S'approprier une œuvre", d: "Relier l'œuvre à son expérience, fonder son interprétation sur des éléments précis, débattre de ses impressions, persévérer dans la lecture." }
        ]},
        { name: "Culture littéraire et artistique", items: [
          { id: "FR-CULT-01", t: "Créer, recréer le monde : récits des origines", d: "Textes fondateurs (dont ceux des religions monothéistes), mythes et contes étiologiques de divers continents." },
          { id: "FR-CULT-02", t: "Chanter et enchanter le monde : mots et merveilles", d: "Poésie : recueil ou groupement, pouvoir d'évocation des images, au-delà du vers et de la rime." },
          { id: "FR-CULT-03", t: "Se masquer, jouer, déjouer : ruses en action", d: "Théâtre : illusion et réel, être et paraître, ressorts comiques de la ruse, mise en voix et en scène." },
          { id: "FR-CULT-04", t: "Partir à l'aventure !", d: "Récits d'aventure : l'élan du départ, les épreuves ; production de récits personnels." },
          { id: "FR-CULT-05", t: "Rencontrer des monstres", d: "Expérience de l'autre, expérience de soi : part d'humanité du monstre, visée éducative du conte, invention de monstres." }
        ]},
        { name: "Écriture", items: [
          { id: "FR-ECR-01", t: "Écrire à la main de façon fluide", d: "Copier sans erreur, de façon lisible et soignée ; mettre en forme ses textes." },
          { id: "FR-ECR-02", t: "Écrire pour réfléchir et apprendre", d: "Résumer, synthétiser, hiérarchiser des idées, justifier ses choix, réemployer une règle ou du lexique." },
          { id: "FR-ECR-03", t: "Produire des écrits variés", d: "Écrire souvent des textes personnels (avis, récit, explication), utiliser le brouillon, veiller à la cohérence, réviser son texte." }
        ]},
        { name: "Oral", items: [
          { id: "FR-ORAL-01", t: "Écouter pour comprendre", d: "Écoute active, reformuler l'explicite et l'implicite, identifier les genres de discours." },
          { id: "FR-ORAL-02", t: "Dire pour être compris", d: "Production orale organisée (raconter, expliquer, argumenter), lecture expressive devant un public." },
          { id: "FR-ORAL-03", t: "Participer à des échanges", d: "Respecter les codes de la prise de parole, tenir compte des autres, regard critique sur son oral." }
        ]},
        { name: "Vocabulaire", items: [
          { id: "FR-LEX-01", t: "Mots des disciplines et mots inconnus", d: "Acquérir le vocabulaire de plusieurs domaines ; face à un mot inconnu, choisir seul une stratégie (déduire, vérifier, chercher)." },
          { id: "FR-LEX-02", t: "Formation des mots", d: "Composer et décomposer des mots ; distinguer mots simples, dérivés et composés." },
          { id: "FR-LEX-03", t: "Synonymes et antonymes", d: "Trouver synonymes et antonymes de la même classe grammaticale." },
          { id: "FR-LEX-04", t: "Étymologie", d: "Découvrir l'origine et l'évolution du sens des mots : préfixes et racines grecs et latins." },
          { id: "FR-LEX-05", t: "Réemploi et registres", d: "Réemployer à bon escient le vocabulaire étudié et les mots polysémiques, en respectant le registre de langue." },
          { id: "FR-ORTH-01", t: "Orthographe lexicale", d: "Écrire correctement et en autonomie les mots fréquents." }
        ]},
        { name: "Grammaire et orthographe grammaticale", items: [
          { id: "FR-GRAM-01", t: "Constituants de la phrase simple", d: "Identifier sujet, groupe verbal, COD, COI et compléments circonstanciels dans des phrases de plus en plus complexes." },
          { id: "FR-GRAM-02", t: "Attribut du sujet ou COD", d: "Distinguer l'attribut du sujet et le complément d'objet direct." },
          { id: "FR-GRAM-03", t: "Manipulations syntaxiques", d: "Utiliser pronominalisation, encadrement, suppression et construction du verbe pour reconnaître les constituants." },
          { id: "FR-GRAM-04", t: "Pronoms personnels", d: "Identifier les pronoms personnels, leur fonction et leur antécédent." },
          { id: "FR-GRAM-05", t: "Le groupe nominal", d: "Identifier un groupe nominal quelle que soit sa fonction." },
          { id: "FR-GRAM-06", t: "Épithète ou complément du nom", d: "Distinguer adjectif (ou groupe adjectival) épithète et groupe nominal prépositionnel complément du nom." },
          { id: "FR-GRAM-07", t: "Phrase simple, phrase complexe", d: "Comprendre la notion de proposition ; distinguer phrase simple et phrase complexe." },
          { id: "FR-GRAM-08", t: "Juxtaposition, coordination, subordination", d: "Reconnaître ces liens entre propositions ; distinguer conjonctions de coordination et de subordination." },
          { id: "FR-ORTH-02", t: "Accords dans le groupe nominal", d: "Maîtriser la chaîne d'accords dans le groupe nominal." },
          { id: "FR-ORTH-03", t: "Accord sujet-verbe", d: "Identifier le groupe sujet et raisonner sur l'accord, y compris sujets multiples ou inversés." },
          { id: "FR-ORTH-04", t: "Accord du participe passé", d: "Avec être ; avec avoir quand le COD est un pronom placé avant le verbe." },
          { id: "FR-CONJ-01", t: "Temps composés", d: "Consolider passé composé et plus-que-parfait (auxiliaire + participe passé)." },
          { id: "FR-CONJ-02", t: "Impératif et conditionnel présents", d: "Mémoriser pour être, avoir, 1er et 2e groupes, faire, aller, dire, venir, pouvoir, voir, vouloir, prendre." },
          { id: "FR-CONJ-03", t: "Marques des temps", d: "Connaître les marques du présent, de l'imparfait, du futur, du passé simple, du plus-que-parfait, du conditionnel et de l'impératif." },
          { id: "FR-CONJ-04", t: "Radicaux variables du 1er groupe", d: "Verbes en -cer, -ger, -yer, -eler, -eter, e/é." },
          { id: "FR-CONJ-05", t: "Valeurs des temps", d: "Première approche : temps du discours, temps du récit." }
        ]}
      ]},
    { id: "ma", name: "Mathématiques", short: "Maths", clan: "Clan de la Lame", kanji: "刃", color: "#D42A48", src: "FRMA",
      motto: "Chaque calcul est une frappe : précise, rapide, sûre.",
      domains: [
        { name: "Nombres entiers et décimaux", items: [
          { id: "MA-NOMB-AUTO1", t: "Automatismes : dixièmes, centièmes, millièmes", d: "Relations entre 1/10, 1/100, 1/1000 et 1 ; fraction décimale ↔ écriture décimale ; × et ÷ par 10, 100, 1000.", auto: true },
          { id: "MA-NOMB-01", t: "Valeur des chiffres", d: "Valeur d'un chiffre selon son rang ; liens entre unité, dixième, centième, millième." },
          { id: "MA-NOMB-02", t: "Grands nombres entiers", d: "Lire, écrire, décomposer les grands nombres jusqu'au milliard." },
          { id: "MA-NOMB-03", t: "Écritures d'un décimal", d: "Reconnaître un décimal ; passer de l'écriture à virgule à la fraction, au nombre mixte, au pourcentage." },
          { id: "MA-NOMB-04", t: "Demi-droite graduée", d: "Placer et repérer un nombre décimal sur une demi-droite graduée." },
          { id: "MA-NOMB-05", t: "Comparer, ranger, arrondir", d: "Comparer et ranger des décimaux, arrondir (unité, dixième, centième), encadrer, intercaler." }
        ]},
        { name: "Calcul et résolution de problèmes", items: [
          { id: "MA-CALC-01", t: "Addition et soustraction de décimaux", d: "Calculer mentalement, en ligne et en posé." },
          { id: "MA-CALC-02", t: "Multiplication de décimaux", d: "Multiplier par 0,1 ; 0,01 ; 0,001 ; sens et calcul du produit de deux décimaux." },
          { id: "MA-CALC-03", t: "Ordre de grandeur", d: "Contrôler un résultat par un ordre de grandeur." },
          { id: "MA-CALC-04", t: "Division d'un décimal par un entier", d: "Diviser un décimal par un entier inférieur à 10." },
          { id: "MA-CALC-05", t: "Division euclidienne", d: "Division euclidienne par un entier inférieur à 100 (quotient, reste)." },
          { id: "MA-CALC-06", t: "Problèmes", d: "Résoudre des problèmes mobilisant multiplication, division décimale et euclidienne." }
        ]},
        { name: "Fractions et pourcentages", items: [
          { id: "MA-FRAC-AUTO1", t: "Automatismes : fractions", d: "Reconnaître une fraction sous plusieurs formes ; 1/4, 1/2, 3/4 ; 1/4 = 0,25 ; fraction d'une quantité.", auto: true },
          { id: "MA-FRAC-01", t: "La fraction quotient", d: "a/b est le nombre qui multiplié par b donne a ; il peut être entier, décimal ou non décimal." },
          { id: "MA-FRAC-02", t: "Fractions sur une demi-droite", d: "Placer une fraction ; graduer un segment." },
          { id: "MA-FRAC-03", t: "Fraction opérateur", d: "Prendre une fraction d'une quantité ; multiplier une fraction par un entier." },
          { id: "MA-FRAC-04", t: "Comparer des fractions", d: "Égalités de fractions ; comparer, encadrer, ranger fractions et nombres mixtes." },
          { id: "MA-FRAC-05", t: "Calculer avec des fractions", d: "Additionner et soustraire des fractions (cas simples) ; multiplier une fraction par un entier." },
          { id: "MA-FRAC-06", t: "Problèmes avec fractions", d: "Résoudre et inventer des problèmes avec des fractions." },
          { id: "MA-POUR-01", t: "Pourcentages", d: "Sens d'un pourcentage ; exprimer une proportion en pourcentage ; appliquer un pourcentage." }
        ]},
        { name: "Algèbre", items: [
          { id: "MA-ALG-01", t: "Nombres inconnus", d: "Résoudre des problèmes à l'aide de modèles pré-algébriques (schémas en barres, balances)." },
          { id: "MA-ALG-02", t: "Motifs qui évoluent", d: "Trouver la régularité d'un motif et l'exprimer." }
        ]},
        { name: "Grandeurs et mesures", items: [
          { id: "MA-GRAN-AUTO1", t: "Automatismes : longueurs et périmètres", d: "Préfixes de kilo- à milli- ; conversions de longueurs ; périmètre du carré et du rectangle ; report au compas.", auto: true },
          { id: "MA-GRAN-01", t: "Périmètre du cercle", d: "P = π × D = 2 × π × R ; périmètres de figures composées." },
          { id: "MA-GRAN-AUTO2", t: "Automatismes : aires", d: "Comparer des aires ; 1 cm² ; aire sur quadrillage ; 1 m² = 100 dm², 1 dm² = 100 cm².", auto: true },
          { id: "MA-GRAN-02", t: "Aires du carré et du rectangle", d: "Convertir des aires ; formules du carré et du rectangle." },
          { id: "MA-GRAN-03", t: "Volumes", d: "Le cm³ ; volume d'assemblages de cubes." },
          { id: "MA-GRAN-AUTO3", t: "Automatismes : heures et durées", d: "Lire l'heure ; jour, heure, minute, seconde ; ½ h = 30 min, ¼ h = 15 min.", auto: true },
          { id: "MA-GRAN-04", t: "Durées", d: "Calculer et convertir horaires et durées ; 0,5 h = 30 min." }
        ]},
        { name: "Espace et géométrie", items: [
          { id: "MA-GEOM-AUTO1", t: "Automatismes : vocabulaire et codage", d: "Vocabulaire géométrique et codage (angle droit, longueurs égales).", auto: true },
          { id: "MA-GEOM-01", t: "Distance et milieu", d: "Distance entre deux points ; inégalité triangulaire ; milieu d'un segment." },
          { id: "MA-GEOM-02", t: "Cercle et disque", d: "Ensembles de points à une distance donnée ; rayon, diamètre, corde." },
          { id: "MA-GEOM-03", t: "Médiatrice", d: "Définition, équidistance, construction." },
          { id: "MA-GEOM-04", t: "Angles", d: "Vocabulaire (droit, plat, aigu, obtus…), notation, mesure et construction au rapporteur." },
          { id: "MA-GEOM-05", t: "Bissectrice", d: "Définition et construction." },
          { id: "MA-GEOM-06", t: "Triangles", d: "Constructions ; triangles particuliers ; somme des angles égale à 180° ; cercle circonscrit." },
          { id: "MA-GEOM-07", t: "Symétrie axiale", d: "Symétrique d'un point, propriétés de conservation, constructions." },
          { id: "MA-GEOM-08", t: "Droites parallèles et perpendiculaires", d: "Reconnaître et utiliser (point à confirmer dans l'annexe)." },
          { id: "MA-ESP-AUTO1", t: "Automatismes : solides", d: "Reconnaître pyramide, boule, cube, cylindre, pavé, cône, prisme droit.", auto: true },
          { id: "MA-ESP-01", t: "Assemblages de cubes", d: "Vues, perspective cavalière, patron du cube, dénombrements." }
        ]},
        { name: "Données et probabilités", items: [
          { id: "MA-DONN-01", t: "Recueillir des données", d: "Planifier une enquête, construire un tableau, filtrer des données." },
          { id: "MA-DONN-02", t: "Lire des représentations", d: "Lire et interpréter tableaux, diagrammes et courbes." },
          { id: "MA-PROBA-01", t: "La probabilité", d: "Un nombre entre 0 (impossible) et 1 (certain)." },
          { id: "MA-PROBA-02", t: "Calculer une probabilité", d: "En situation d'équiprobabilité, sous forme de fraction, décimal ou pourcentage." },
          { id: "MA-PROBA-03", t: "Fréquences et probabilités", d: "Comparer les fréquences d'une expérience répétée à la probabilité." }
        ]},
        { name: "Proportionnalité", items: [
          { id: "MA-PROP-AUTO1", t: "Automatismes : double, moitié, tiers, quart", d: "Traduire « 4 fois plus » par une multiplication ou une division.", auto: true },
          { id: "MA-PROP-01", t: "Reconnaître la proportionnalité", d: "Définition ; reconnaître si une situation en relève." },
          { id: "MA-PROP-02", t: "Résoudre par linéarité ou retour à l'unité", d: "Le produit en croix n'est pas attendu en 6e." },
          { id: "MA-PROP-03", t: "Représenter ; échelles", d: "Tableau ou flèches ; première approche des échelles." }
        ]},
        { name: "Pensée informatique", items: [
          { id: "MA-INFO-01", t: "Instructions et séquences", d: "Identifier, produire, exécuter une séquence d'instructions." },
          { id: "MA-INFO-02", t: "Boucles", d: "Répéter une séquence." },
          { id: "MA-INFO-03", t: "Programmer un déplacement", d: "Programmer un chemin simple (robot, débranché ou sur machine)." }
        ]}
      ]},
    { id: "hg", name: "Histoire-Géographie", short: "Histoire-Géo", clan: "Clan des Ombres", kanji: "影", color: "#6B45B8", src: "HG",
      motto: "Qui connaît le passé et la carte n'est jamais surprise.",
      domains: [
        { name: "Histoire — Thème 1 : La longue histoire de l'humanité et des migrations", items: [
          { id: "HI-T1-01", t: "Les débuts de l'humanité", d: "Berceau africain, premières migrations et peuplement de la Terre ; une connaissance qui évolue avec les découvertes." },
          { id: "HI-T1-02", t: "La « révolution » néolithique", d: "Sédentarisation, agriculture et élevage transforment le rapport à l'environnement." },
          { id: "HI-T1-03", t: "Premiers États, premières écritures", d: "Le Proche-Orient, lieu d'invention de la ville, de l'État et de l'écriture." }
        ]},
        { name: "Histoire — Thème 2 : Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique", items: [
          { id: "HI-T2-01", t: "Le monde des cités grecques", d: "Cités indépendantes, culture commune (Homère, sanctuaires, jeux Olympiques) ; Athènes invente citoyenneté et démocratie." },
          { id: "HI-T2-02", t: "Rome du mythe à l'histoire", d: "Distinguer le récit de fondation de ce que disent archéologie et histoire." },
          { id: "HI-T2-03", t: "La naissance du monothéisme juif", d: "Dans un monde polythéiste : élaboration des textes bibliques, passage au monothéisme." }
        ]},
        { name: "Histoire — Thème 3 : L'empire romain dans le monde antique", items: [
          { id: "HI-T3-01", t: "Conquêtes, paix romaine et romanisation", d: "Construction de l'empire, pax romana, romanisation par la ville et la citoyenneté." },
          { id: "HI-T3-02", t: "Des chrétiens dans l'empire", d: "Diffusion du christianisme, des persécutions à la religion officielle." },
          { id: "HI-T3-03", t: "Rome et la Chine des Han", d: "Relations de l'empire romain avec les autres mondes : la route de la soie." }
        ]},
        { name: "Géographie — Thème 1 : Habiter une métropole", items: [
          { id: "GE-T1-01", t: "Les métropoles et leurs habitants", d: "Se loger, travailler, se déplacer, cohabiter dans une très grande ville ; deux études de cas." },
          { id: "GE-T1-02", t: "La ville de demain", d: "Développement urbain durable : écoquartiers, transports, mixité sociale." }
        ]},
        { name: "Géographie — Thème 2 : Habiter un espace de faible densité", items: [
          { id: "GE-T2-01", t: "Espaces à fortes contraintes ou de grande biodiversité", d: "Grand Nord, steppes, forêts équatoriales, parcs naturels…" },
          { id: "GE-T2-02", t: "Espaces de faible densité à vocation agricole", d: "Espaces agricoles intégrés au monde ou fragiles." }
        ]},
        { name: "Géographie — Thème 3 : Habiter les littoraux", items: [
          { id: "GE-T3-01", t: "Littoral industrialo-portuaire", d: "Grands ports et zones industrialo-portuaires." },
          { id: "GE-T3-02", t: "Littoral touristique", d: "Stations balnéaires, aménagements, conflits d'usage." }
        ]},
        { name: "Géographie — Thème 4 : Le monde habité", items: [
          { id: "GE-T4-01", t: "Répartition de la population mondiale", d: "Trois grands foyers ; dynamiques d'urbanisation et de littoralisation." },
          { id: "GE-T4-02", t: "Formes d'occupation de l'espace", d: "Habitat permanent ou temporaire ; peuplement dispersé ou groupé." }
        ]}
      ]},
    { id: "sc", name: "Sciences", clan: "Clan de l'Apothicaire", kanji: "薬", color: "#159A6B", src: "SC",
      motto: "Observer, douter, vérifier : voilà la vraie magie.",
      domains: [
        { name: "Matière, mouvement, énergie, information", items: [
          { id: "SC-01", t: "Propriétés de la matière", d: "Matériaux et durée de décomposition ; conductivité, magnétisme ; changements d'état et paliers de température." },
          { id: "SC-02", t: "Masse et volume", d: "Mesurer masse et volume, convertir ; volume d'un gaz ; liquides non miscibles." },
          { id: "SC-03", t: "Mélanges", d: "Décantation, saturation ; composition de l'air ; transformation chimique ; pictogrammes de sécurité." },
          { id: "SC-04", t: "Mouvements", d: "Vitesse = distance / durée ; rotation (jour) et révolution (année) de la Terre." },
          { id: "SC-05", t: "Conversions d'énergie", d: "Formes d'énergie, chaîne énergétique, ressources renouvelables ou non." },
          { id: "SC-06", t: "Lumière et saisons", d: "Jour et nuit ; saisons et hauteur du Soleil." },
          { id: "SC-07", t: "Électricité", d: "Circuit à une boucle, schéma normalisé, sécurité." },
          { id: "SC-08", t: "Transmettre l'information", d: "Signaux sonores, lumineux, électriques." }
        ]},
        { name: "Le vivant, sa diversité et ses fonctions", items: [
          { id: "SC-09", t: "Organisation du vivant", d: "Observation au microscope ; la cellule, unité commune du vivant." },
          { id: "SC-10", t: "Classer le vivant", d: "Classifications ; groupes emboîtés fondés sur des attributs partagés ; parenté." },
          { id: "SC-11", t: "Biodiversité actuelle et passée", d: "Diversité dans une espèce ; clé de détermination ; fossiles ; crises biologiques." },
          { id: "SC-12", t: "Besoins alimentaires", d: "Comportements alimentaires favorables à la santé." },
          { id: "SC-13", t: "Produire et conserver les aliments", d: "Conservation ; fermentation par des micro-organismes." },
          { id: "SC-14", t: "Cycle de vie des plantes à fleurs", d: "Pollinisation, fruit, graine ; pollinisateurs." },
          { id: "SC-15", t: "Reproduction humaine", d: "Organes, puberté, fécondation." }
        ]},
        { name: "Les objets techniques", items: [
          { id: "SC-16", t: "Besoins et objets techniques", d: "Objet technique et objet naturel ; évolution des objets." },
          { id: "SC-17", t: "Fonctionnement des objets", d: "Besoin, fonction, solution ; croquis." },
          { id: "SC-18", t: "Cycle de vie d'un objet", d: "Impact environnemental." },
          { id: "SC-19", t: "Programmation", d: "Chaîne d'information, chaîne d'action, algorithme simple." }
        ]},
        { name: "La Terre, planète peuplée d'êtres vivants", items: [
          { id: "SC-20", t: "Une planète qui abrite la vie", d: "Conditions de la vie ; météo et climat ; réchauffement climatique." },
          { id: "SC-21", t: "L'écosystème", d: "Milieu et peuplement ; saisons ; perturbations." },
          { id: "SC-22", t: "Réseaux alimentaires", d: "Besoins des végétaux, production, décomposeurs, cycle de la matière." },
          { id: "SC-23", t: "Actions humaines", d: "Exploitation raisonnée des ressources, biodiversité." }
        ]}
      ]},
    { id: "en", name: "Anglais", clan: "Clan des Étoiles", kanji: "星", color: "#D99A00", src: "LV",
      motto: "On stage, every word shines.",
      domains: [
        { name: "Actes langagiers", items: [
          { id: "EN-ACT-02", t: "Se présenter", d: "Nom, âge, famille, nationalité." },
          { id: "EN-ACT-06", t: "Dire ses goûts", d: "I like / I don't like / my favourite…" },
          { id: "EN-ACT-08", t: "Consignes simples", d: "Donner et comprendre des consignes." },
          { id: "EN-ACT-09", t: "Poser des questions simples", d: "What's your name? Where do you live?…" },
          { id: "EN-ACT-10", t: "Formules de politesse", d: "Saluer, prendre congé, remercier." },
          { id: "EN-ACT-16", t: "Épeler (A1+)", d: "Épeler un mot." }
        ]},
        { name: "Grammaire", items: [
          { id: "EN-GRAM-01", t: "Présent simple, be et have", d: "Verbes courants au présent, be et have." },
          { id: "EN-GRAM-04", t: "Impératif", d: "Affirmatif et négatif : Look! Don't forget!" },
          { id: "EN-GRAM-10", t: "Articles", d: "a / the / absence d'article." },
          { id: "EN-GRAM-13", t: "Déterminants possessifs", d: "my, your, his, her, its, our, their." },
          { id: "EN-GRAM-17", t: "Pronoms sujets et compléments", d: "I, you, he, she, it, we, they…" },
          { id: "EN-GRAM-20", t: "Mots interrogatifs", d: "who, what, where, when (A1+ : why, how)." },
          { id: "EN-GRAM-21", t: "Marqueurs de temps", d: "today, tomorrow, on Saturday, in December…" },
          { id: "EN-GRAM-22", t: "La date", d: "Date avec les ordinaux." }
        ]},
        { name: "Lexique", items: [
          { id: "EN-LEX-01", t: "La famille", d: "family, parents, brother, sister, aunt, uncle, cousin…" },
          { id: "EN-LEX-02", t: "Nationalités", d: "British, English, Irish, Scottish, Welsh, American, French…" },
          { id: "EN-LEX-18", t: "Nombres jusqu'à 100", d: "Cardinaux ; quelques ordinaux en A1+." },
          { id: "EN-LEX-19", t: "L'heure", d: "Heures pleines, demies, quarts." }
        ]},
        { name: "Phonologie", items: [
          { id: "EN-PHON-05", t: "Accent de mot", d: "Accent sur les polysyllabes (favourite, beautiful)." },
          { id: "EN-PHON-06", t: "Lettres muettes (A1+)", d: "light, autumn, Wednesday." }
        ]}
      ]},
    { id: "es", name: "Espagnol", clan: "Clan du Soleil", kanji: "陽", color: "#E8641E", src: "LV",
      motto: "¡Con el sol, siempre adelante!",
      domains: [
        { name: "Actes langagiers", items: [
          { id: "ES-ACT-02", t: "Se présenter", d: "Nom, âge, famille, nationalité, lieu de vie." },
          { id: "ES-ACT-05", t: "Se situer dans le temps", d: "Jour, date." },
          { id: "ES-ACT-07", t: "Dire ses goûts", d: "Me gusta, me encanta, no me gusta nada, prefiero." },
          { id: "ES-ACT-10", t: "Consignes", d: "¡Entra! ¡Ven! ¡Mira! ¡Escuchad!" },
          { id: "ES-ACT-13", t: "Saluer", d: "Hola, buenos días, buenas tardes, adiós, hasta luego, gracias." },
          { id: "ES-ACT-16", t: "Épeler", d: "Se escribe…" },
          { id: "ES-ACT-17", t: "Demander de l'aide", d: "¿Puedes repetir? ¿Cómo se escribe…? ¿Qué significa…?" },
          { id: "ES-ACT-18", t: "Prendre des nouvelles", d: "¿Cómo estás? Bien, gracias." }
        ]},
        { name: "Grammaire", items: [
          { id: "ES-GRAM-01", t: "Genre et nombre", d: "el cuaderno, la pizarra, los lápices, las tijeras." },
          { id: "ES-GRAM-03", t: "Articles", d: "el / la / los / las ; un / una / unos / unas." },
          { id: "ES-GRAM-08", t: "Présent des verbes réguliers", d: "Verbes en -ar, -er, -ir." },
          { id: "ES-GRAM-11", t: "Ser, estar, ir, tener", d: "Verbes irréguliers essentiels." },
          { id: "ES-GRAM-17", t: "Négation", d: "no + verbe." },
          { id: "ES-GRAM-18", t: "Mots interrogatifs", d: "quién, dónde, qué, cuántos, cuándo…" },
          { id: "ES-GRAM-23", t: "La date", d: "Date du jour, date de naissance." }
        ]},
        { name: "Phonologie", items: [
          { id: "ES-PHON-01", t: "Voyelles", d: "Le e et le u se prononcent différemment du français." },
          { id: "ES-PHON-02", t: "Consonnes", d: "j, ñ, r, s, v." },
          { id: "ES-PHON-05", t: "Ponctuation inversée", d: "¿? et ¡! en début de phrase." }
        ]},
        { name: "Lexique", items: [
          { id: "ES-LEX-01", t: "La famille", d: "padre, madre, hermanos, abuelos, hijo único…" },
          { id: "ES-LEX-02", t: "Nationalités", d: "español/a, francés/francesa, ser de…" },
          { id: "ES-LEX-16", t: "Nombres de 0 à 100", d: "Niveau exact (A1/A1+) à confirmer." }
        ]}
      ]},
    { id: "emc", name: "EMC", clan: "Conseil de l'Académie", kanji: "和", color: "#12889A", src: "EMC",
      motto: "Ensemble, décider pour le bien de tous.",
      domains: [
        { name: "Thème annuel : Apprendre à vivre dans une société démocratique", items: [
          { id: "EMC-01", t: "Représenter les autres et servir l'intérêt général", d: "Élus et représentants à toutes les échelles (classe, collège, commune… Union européenne) ; intérêt général ; responsabilité." },
          { id: "EMC-02", t: "La laïcité à l'École", d: "Liberté de conscience, égalité, neutralité de l'État ; loi de 1905, loi de 2004, Charte de la laïcité." },
          { id: "EMC-03", t: "Le droit à la vie privée", d: "Vie privée, droit à l'image, données personnelles, traces numériques ; majorité numérique à 15 ans." }
        ]}
      ]}
  ]
};
