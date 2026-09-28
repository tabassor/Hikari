// Restructure les chapitres en leçons. Usage : node split.js  (réécrit app/data/c-*.js)
global.window = {};
const fs = require("fs");
const D = "/home/claude/app/data/";
for (const f of ["programme", "c-fr", "c-ma", "c-hg", "c-sc", "c-lv-emc"]) require(D + f + ".js");
const CH = {}; window.CONTENT.chapters.forEach((c) => (CH[c.id] = c));

const r = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
// Plan : [titre, blocs de fiche (indices), cartes (indices), événements (indices), lieux (ids), routes?, cartes interactives en plus]
const PLAN = {
  "fr-origines": [
    ["Qu'est-ce qu'un mythe ?", r(0, 4), [0, 1, 2], [], [], 0, [
      { k: "p", q: "Associe chaque mot à sa définition.", pairs: [["Mythe", "Récit ancien qui explique le monde"], ["Récit étiologique", "Explique l'origine d'une chose"], ["Cosmogonie", "Récit de la création du monde"], ["Texte fondateur", "Base d'une culture ou d'une religion"]] }]],
    ["Genèse, Gilgamesh et Ovide", r(5, 6), r(3, 8), [], [], 0, [
      { k: "s", q: "Range chaque élément dans le bon récit.", bins: ["La Genèse", "Gilgamesh", "Métamorphoses"], items: [["Adam et Ève", 0], ["Le jardin d'Éden", 0], ["Six jours de création", 0], ["Enkidu", 1], ["La cité d'Uruk", 1], ["Utnapishtim et le déluge", 1], ["Arachné", 2], ["Narcisse", 2], ["Daphné", 2]] }]],
    ["Les dieux grecs et romains", r(7, 9), r(9, 19), [], [], 0, [
      { k: "p", q: "Associe chaque dieu grec à son nom latin.", pairs: [["Zeus", "Jupiter"], ["Poséidon", "Neptune"], ["Athéna", "Minerve"], ["Aphrodite", "Vénus"], ["Arès", "Mars"], ["Hermès", "Mercure"]] },
      { k: "p", q: "Associe chaque dieu à son domaine.", pairs: [["Hadès", "Les Enfers"], ["Héphaïstos", "La forge"], ["Artémis", "La chasse"], ["Déméter", "Les moissons"], ["Dionysos", "La vigne"]] }]],
    ["Des mots nés des mythes", r(10, 13), r(20, 27), [], [], 0, [
      { k: "p", q: "Associe chaque racine grecque à son sens.", pairs: [["chrono-", "temps"], ["géo-", "terre"], ["théo-", "dieu"], ["anthropo-", "être humain"], ["-graphie", "écriture"]] }]]
  ],
  "fr-phrase": [
    ["Sujet, verbe et phrase simple", [0, 1, 2], [0, 1, 6, 13, 18], [], [], 0, []],
    ["COD, COI et compléments circonstanciels", r(3, 7), [2, 3, 4, 5, 7, 8, 9, 10, 11, 12], [], [], 0, [
      { k: "s", q: "Quelle est la fonction du groupe en gras ?", bins: ["COD", "COI", "Compl. circonstanciel"], items: [["Zeus lance **la foudre**.", 0], ["Athéna aide **Ulysse**.", 0], ["Pandore obéit **à Zeus**.", 1], ["Enkidu pense **à sa forêt**.", 1], ["**Le soir**, les dieux festoient.", 2], ["Ils dînent **sur l'Olympe**.", 2]] }]],
    ["Le groupe nominal et les classes de mots", r(8, 11), [14, 15, 16, 17], [], [], 0, [
      { k: "s", q: "Ces mots sont-ils variables ou invariables ?", bins: ["Variable", "Invariable"], items: [["dragon (nom)", 0], ["immense (adjectif)", 0], ["les (déterminant)", 0], ["ils (pronom)", 0], ["souvent (adverbe)", 1], ["dans (préposition)", 1], ["mais (conjonction)", 1], ["très (adverbe)", 1]] }]]
  ],
  "fr-temps": [
    ["Les terminaisons de l'indicatif", [0, 1, 2], [0, 1, 2, 15], [], [], 0, [
      { k: "s", q: "À quel temps sont ces verbes ?", bins: ["Imparfait", "Futur", "Passé simple"], items: [["ils chantaient", 0], ["nous marchions", 0], ["tu danseras", 1], ["elles joueront", 1], ["il regarda", 2], ["nous parlâmes", 2], ["ils raconteront", 1], ["je jouais", 0]] }]],
    ["Passé simple, être et avoir", r(3, 6), r(3, 8), [], [], 0, []],
    ["Verbes en -cer/-ger, valeurs des temps", r(7, 10), r(9, 14), [], [], 0, []]
  ],
  "ma-entiers": [
    ["Chiffres, nombres et classes", [0, 1, 2, 3, 4, 7, 8], [0, 2, 3, 4, 7], [], [], 0, [
      { k: "o", q: "Range ces nombres du plus petit au plus grand.", items: ["98 765", "1 002 000", "1 020 000", "12 000 000", "1 000 000 000"] }]],
    ["Écrire les nombres en lettres", [5, 6], [1, 5, 6], [], [], 0, []]
  ],
  "ma-decimaux": [
    ["Dixièmes, centièmes, millièmes", r(0, 4), [0, 1, 7, 8], [], [], 0, [
      { k: "p", q: "Associe les écritures égales.", pairs: [["1/10", "0,1"], ["1/100", "0,01"], ["1/1000", "0,001"], ["37/100", "0,37"], ["254/1000", "0,254"]] }]],
    ["× et ÷ par 10, 100, 1 000", r(5, 7), [2], [], [], 0, []],
    ["Comparer et ranger", [8, 9], [3, 9, 10], [], [], 0, [
      { k: "o", q: "Range du plus petit au plus grand.", items: ["3,09", "3,449", "3,47", "3,5", "3,51"] },
      { k: "o", q: "Range du plus petit au plus grand.", items: ["0,07", "0,1", "0,15", "0,5", "0,51"] }]],
    ["Arrondir, encadrer, graduer", [10, 11], [4, 5, 6], [], [], 0, []]
  ],
  "ma-geom1": [
    ["Points, droites, segments", [0, 1, 2], [0, 1, 2, 3, 9], [], [], 0, [
      { k: "p", q: "Associe chaque notation à son nom.", pairs: [["(AB)", "la droite AB"], ["[AB)", "la demi-droite d'origine A"], ["[AB]", "le segment AB"], ["AB", "la longueur AB"]] }]],
    ["Milieu, codage et distances", [3, 4, 5, 10, 11], [4, 11, 12], [], [], 0, []],
    ["Cercle et disque", r(6, 9), [5, 6, 7, 8, 10], [], [], 0, []]
  ],
  "ma-auto": [
    ["Tables, doubles et moitiés", [0, 1, 2], [0, 3], [], [], 0, []],
    ["Fractions simples", [], [1, 2], [], [], 0, [
      { k: "p", q: "Associe chaque fraction à son écriture décimale.", pairs: [["1/2", "0,5"], ["1/4", "0,25"], ["3/4", "0,75"], ["1/10", "0,1"]] }]],
    ["Longueurs et durées", [], [4, 5], [], [], 0, [
      { k: "o", q: "Range ces unités de la plus grande à la plus petite.", items: ["km", "hm", "dam", "m", "dm", "cm", "mm"] }]]
  ],
  "hi-humanite": [
    ["Un berceau africain", [0, 1], [0, 1, 2, 3], [0, 1, 2], ["hadar", "dmanissi"], 0, []],
    ["Homo sapiens peuple la Terre", [2, 3], [4, 5, 6, 9, 12], [3, 4, 5], ["irhoud"], 1, [
      { k: "o", q: "Dans quel ordre Homo sapiens a-t-il atteint ces continents ?", items: ["Afrique (origine)", "Asie", "Australie", "Europe", "Amérique"], x: "Les dates de l'Asie et de l'Australie sont proches ; l'ordre donné est celui du récit du cours." }]],
    ["Vivre au Paléolithique", r(4, 7), [7, 8, 10, 11, 13], [6, 7], ["chauvet", "lascaux"], 0, [
      { k: "o", q: "Remets ces repères dans l'ordre chronologique.", items: ["Lucy", "Genre Homo", "Humains à Dmanissi", "Premiers Homo sapiens", "Grotte Chauvet", "Grotte de Lascaux"] }]]
  ],
  "hi-neolithique": [
    ["Agriculture et élevage", r(0, 4), [0, 1, 2, 3, 4, 5], [0], ["croissant"], 0, []],
    ["Villages, techniques et conséquences", r(5, 9), [6, 7, 8, 9], [1, 2, 3], ["catal", "carnac"], 0, [
      { k: "s", q: "Paléolithique ou Néolithique ?", bins: ["Paléolithique", "Néolithique"], items: [["Nomades", 0], ["Chasse et cueillette", 0], ["Pierre taillée", 0], ["Villages", 1], ["Agriculture et élevage", 1], ["Pierre polie", 1], ["Poterie pour les récoltes", 1], ["Peintures de Lascaux", 0]] }]]
  ],
  "hi-etats": [
    ["Les premières villes", r(0, 3), [2, 3, 4], [0], ["uruk"], 0, []],
    ["L'invention de l'écriture", r(4, 6), [0, 1, 5, 6, 7, 8, 11], [1], [], 0, [
      { k: "p", q: "Associe chaque écriture à son pays.", pairs: [["Cunéiforme", "Mésopotamie"], ["Hiéroglyphes", "Égypte"]] }]],
    ["L'Égypte et Babylone", r(7, 11), [9, 10], [2, 3, 4], ["gizeh", "babylone"], 0, [
      { k: "o", q: "Remets dans l'ordre chronologique.", items: ["Début du Néolithique", "Premières villes (Uruk)", "Invention de l'écriture", "Pyramides de Gizeh", "Code de Hammurabi"] }]]
  ],
  "ge-metropoles": [
    ["Qu'est-ce qu'une métropole ?", r(0, 4), [0, 1, 2, 3, 5], [], ["tokyo", "delhi", "shanghai", "saopaulo", "mexico", "caire", "mumbai", "newyork", "lagos", "paris", "londres", "pekin"], 0, [
      { k: "s", q: "Sur quel continent se trouve chaque métropole ?", bins: ["Asie", "Amérique", "Afrique", "Europe"], items: [["Tokyo", 0], ["Delhi", 0], ["São Paulo", 1], ["Mexico", 1], ["Lagos", 2], ["Le Caire", 2], ["Paris", 3], ["Londres", 3]] }]],
    ["Habiter une métropole", [5, 6], [6, 8, 9, 10], [], [], 0, []],
    ["La ville de demain", r(7, 9), [4, 7], [], [], 0, [
      { k: "s", q: "Ville durable ou pas ?", bins: ["Plus durable", "Moins durable"], items: [["Tramway", 0], ["Pistes cyclables", 0], ["Parcs et arbres", 0], ["Logements pour tous", 0], ["Embouteillages", 1], ["Étalement urbain", 1], ["Quartiers séparés riches/pauvres", 1]] }]]
  ],
  "sc-vivant": [
    ["Le vivant et la cellule", r(0, 5), [0, 1, 2, 3], [], [], 0, [
      { k: "s", q: "Cellule animale, végétale, ou les deux ?", bins: ["Les deux", "Végétale seulement"], items: [["Membrane", 0], ["Noyau", 0], ["Cytoplasme", 0], ["Paroi", 1], ["Chloroplastes", 1]] }]],
    ["Le microscope", [6, 7], [4, 5, 6, 7], [], [], 0, [
      { k: "p", q: "Associe chaque partie du microscope à son rôle.", pairs: [["Oculaire", "On y place l'œil"], ["Objectif", "Grossit l'objet"], ["Platine", "On y pose la lame"], ["Vis", "Mise au point"]] }]],
    ["Classer le vivant", r(8, 13), r(8, 15), [], [], 0, [
      { k: "s", q: "Range chaque animal selon son attribut.", bins: ["Poils", "Plumes", "Ni poils ni plumes"], items: [["Chat", 0], ["Baleine", 0], ["Chauve-souris", 0], ["Pigeon", 1], ["Pingouin", 1], ["Truite", 2], ["Grenouille", 2], ["Tortue", 2]] }]]
  ],
  "sc-matiere": [
    ["Solide, liquide, gaz", r(0, 2), [0, 1, 2], [], [], 0, [
      { k: "s", q: "Dans quel état sont-ils (à température ambiante) ?", bins: ["Solide", "Liquide", "Gaz"], items: [["Caillou", 0], ["Glaçon", 0], ["Huile", 1], ["Lait", 1], ["Air", 2], ["Vapeur d'eau", 2]] }]],
    ["Les changements d'état", r(3, 6), r(3, 9), [], [], 0, [
      { k: "p", q: "Associe chaque changement d'état.", pairs: [["Fusion", "Solide → liquide"], ["Solidification", "Liquide → solide"], ["Vaporisation", "Liquide → gaz"], ["Liquéfaction", "Gaz → liquide"]] }]],
    ["Masse et volume", r(7, 11), r(10, 15), [], [], 0, []]
  ],
  "en-hello": [
    ["Hello! Greetings", [0, 1], [9, 10, 20], [], [], 0, [
      { k: "p", q: "Match the greetings.", pairs: [["Good morning", "Bonjour (le matin)"], ["Good evening", "Bonsoir"], ["Goodbye", "Au revoir"], ["See you later", "À plus tard"], ["Thank you", "Merci"]] }]],
    ["Introduce yourself · BE", r(2, 6), r(0, 8), [], [], 0, [
      { k: "p", q: "Match each pronoun with BE.", pairs: [["I", "am"], ["He", "is"], ["We", "are"], ["They", "are"], ["She", "is"]] }]],
    ["Numbers", [7, 8], r(11, 16), [], [], 0, [
      { k: "o", q: "Put the numbers in order.", items: ["twelve", "thirteen", "twenty", "thirty", "forty", "a hundred"] }]],
    ["Nationalities", [9, 10], [17, 18, 19], [], [], 0, [
      { k: "p", q: "Match the country and the nationality.", pairs: [["Scotland", "Scottish"], ["Wales", "Welsh"], ["Ireland", "Irish"], ["England", "English"], ["France", "French"]] }]]
  ],
  "en-family": [
    ["My family · possessives", r(0, 4), r(0, 7), [], [], 0, [
      { k: "p", q: "Match the family words.", pairs: [["mother", "mère"], ["uncle", "oncle"], ["aunt", "tante"], ["grandfather", "grand-père"], ["sister", "sœur"]] }]],
    ["Days and months", r(5, 8), r(8, 12), [], [], 0, [
      { k: "o", q: "Put the days of the week in order.", items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }]],
    ["Likes · classroom English", r(9, 12), r(13, 17), [], [], 0, []]
  ],
  "es-hola": [
    ["¡Hola! Saludos", [0, 1], [12, 19], [], [], 0, [
      { k: "p", q: "Asocia los saludos.", pairs: [["Buenos días", "Bonjour (le matin)"], ["Buenas tardes", "Bonjour (l'après-midi)"], ["Buenas noches", "Bonsoir / bonne nuit"], ["Hasta luego", "À plus tard"], ["Gracias", "Merci"]] }]],
    ["Me presento · ser y tener", r(2, 6), [...r(0, 11), 15], [], [], 0, [
      { k: "p", q: "Asocia : tener au présent.", pairs: [["yo", "tengo"], ["tú", "tienes"], ["él / ella", "tiene"], ["nosotros", "tenemos"], ["ellos", "tienen"]] }]],
    ["Pronunciación y números", r(7, 12), [13, 14, 16, 17, 18], [], [], 0, [
      { k: "o", q: "Ordena los números.", items: ["cinco", "doce", "quince", "veinte", "cuarenta", "cien"] }]]
  ],
  "es-clase": [
    ["El material escolar", r(0, 2), r(0, 6), [], [], 0, [
      { k: "s", q: "¿El o la ?", bins: ["el", "la"], items: [["cuaderno", 0], ["libro", 0], ["estuche", 0], ["bolígrafo", 0], ["goma", 1], ["regla", 1], ["mochila", 1], ["pizarra", 1]] }]],
    ["Colores, días y meses", r(3, 8), [7, 8, 9], [], [], 0, [
      { k: "o", q: "Ordena los días de la semana.", items: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"] }]],
    ["Me gusta · en clase", r(9, 12), r(10, 16), [], [], 0, []]
  ],
  "emc-representer": [
    ["Représenter et intérêt général", r(0, 2), [0, 1, 8], [], [], 0, [
      { k: "s", q: "Intérêt général ou intérêt particulier ?", bins: ["Intérêt général", "Intérêt particulier"], items: [["Construire une piste cyclable", 0], ["Protéger une rivière", 0], ["Réparer le toit du collège", 0], ["Choisir le menu préféré de ses amis", 1], ["Garder la meilleure place pour soi", 1]] }]],
    ["Délégués et élus", r(3, 6), [2, 3, 4, 7, 9], [], [], 0, [
      { k: "o", q: "Range ces échelles de la plus petite à la plus grande.", items: ["Classe", "Commune", "Département", "Région", "France", "Union européenne"] }]],
    ["Voter", [7, 8], [5, 6], [], [], 0, []]
  ]
};

const STUBS = {
  "fr-poesie": ["Qu'est-ce qu'un poème ?", "Les images : comparaison, métaphore", "Vers, strophes et rimes", "Dire un poème"],
  "fr-ruses": ["Le vocabulaire du théâtre", "Molière et la farce", "Les ressorts du comique", "Mettre en scène"],
  "fr-aventure": ["Le héros d'aventure", "Le schéma narratif", "Héros de l'Odyssée et de l'Iliade", "Écrire une aventure"],
  "fr-monstres": ["Monstres des mythes", "Monstres des contes", "La part d'humanité du monstre", "Inventer un monstre"],
  "fr-accords": ["Accords dans le groupe nominal", "L'accord sujet-verbe", "Sujets inversés et multiples", "L'accord du participe passé"],
  "fr-conj2": ["L'impératif présent", "Le conditionnel présent", "Passé composé et plus-que-parfait"],
  "ma-fractions": ["La fraction quotient", "Fractions sur une demi-droite", "Comparer des fractions", "Ajouter et soustraire des fractions", "Fraction d'une quantité"],
  "ma-calcul": ["Addition et soustraction de décimaux", "Multiplier des décimaux", "Ordre de grandeur", "Division euclidienne", "Division décimale", "Résoudre des problèmes"],
  "ma-angles": ["Vocabulaire des angles", "Mesurer et construire au rapporteur", "La bissectrice", "Construire des triangles", "Somme des angles d'un triangle"],
  "ma-proba": ["Tableaux et diagrammes", "Recueillir des données", "La probabilité, de 0 à 1", "Calculer une probabilité", "Fréquences et probabilités"],
  "ma-mesures": ["Périmètres", "Périmètre du cercle", "Aires du carré et du rectangle", "Convertir des aires", "Volumes et cubes"],
  "ma-symetrie": ["Médiatrice d'un segment", "Symétrique d'un point", "Symétrique d'une figure", "Propriétés de la symétrie"],
  "ma-prop": ["Reconnaître la proportionnalité", "Linéarité et retour à l'unité", "Pourcentages", "Échelles"],
  "ma-algo": ["Schémas en barres", "Motifs qui évoluent", "Instructions et boucles", "Programmer un déplacement"],
  "hi-grecs": ["Des cités indépendantes", "Homère et les récits fondateurs", "Sanctuaires et jeux Olympiques", "Athènes et la démocratie"],
  "hi-rome-mythe": ["La fondation légendaire de Rome", "Ce que dit l'archéologie"],
  "hi-monotheisme": ["Les Hébreux et la Bible", "Du polythéisme au monothéisme"],
  "hi-empire": ["Conquêtes et empire", "Paix romaine et romanisation", "Des chrétiens dans l'empire", "Rome et la Chine des Han"],
  "ge-faible": ["Un espace à fortes contraintes", "Un espace de grande biodiversité", "Un espace agricole de faible densité"],
  "ge-littoraux": ["Un littoral industrialo-portuaire", "Un littoral touristique"],
  "ge-monde": ["Où vivent les humains ?", "Les formes d'occupation de l'espace"],
  "sc-melanges": ["Mélanges et solutions", "Séparer un mélange", "L'air, un mélange de gaz", "Transformations chimiques et sécurité"],
  "sc-energie": ["Les formes d'énergie", "Les chaînes d'énergie", "Le circuit électrique", "Transmettre un signal"],
  "sc-terre": ["Le jour et la nuit", "L'année", "Les saisons", "Mouvements et vitesse"],
  "sc-ecosysteme": ["Conditions de la vie sur Terre", "Météo et climat", "L'écosystème", "Réseaux alimentaires", "Actions humaines et biodiversité"],
  "sc-biodiv": ["Diversité dans une espèce", "Clés de détermination", "Fossiles et crises biologiques"],
  "sc-aliments": ["Bien se nourrir", "Produire et conserver les aliments", "Micro-organismes et fermentation"],
  "sc-reproduction": ["De la fleur au fruit", "Les pollinisateurs", "La puberté", "La reproduction humaine"],
  "sc-objets": ["Objets techniques et besoins", "Fonctions et solutions", "Cycle de vie d'un objet", "Programmer un robot"],
  "en-routine": ["My day", "Telling the time", "Present simple: he/she + -s"],
  "en-legends": ["Once upon a time", "Dragons and legends", "Tell a story"],
  "es-familia": ["Mi familia", "Los verbos en -ar, -er, -ir", "La negación"],
  "emc-laicite": ["Qu'est-ce que la laïcité ?", "La laïcité à l'École", "La Charte de la laïcité"],
  "emc-vieprivee": ["Vie privée et droit à l'image", "Mes données personnelles", "Se protéger en ligne"]
};

const used = {};
for (const [cid, lessons] of Object.entries(PLAN)) {
  const c = CH[cid]; used[cid] = { f: new Set(), c: new Set(), e: new Set() };
  c.lessons = lessons.map(([title, fi, ci, ei, pl, routes, extra], n) => {
    fi.forEach((i) => used[cid].f.add(i)); ci.forEach((i) => used[cid].c.add(i)); ei.forEach((i) => used[cid].e.add(i));
    const L = { id: `${cid}-l${n + 1}`, title };
    if (fi.length) L.fiche = fi.map((i) => c.fiche[i]);
    L.cards = ci.map((i) => c.cards[i]).concat(extra);
    if (ei.length) L.events = ei.map((i) => c.events[i]);
    if (pl.length) L.places = pl.map((id) => c.places.find((p) => p.id === id));
    if (routes) L.routes = c.routes;
    return L;
  });
  // contrôles : rien de perdu
  const miss = (arr, set, what) => (arr || []).forEach((_, i) => { if (!set.has(i)) console.log("NON AFFECTÉ", cid, what, i); });
  miss(c.cards, used[cid].c, "carte"); miss(c.events, used[cid].e, "événement");
  (c.places || []).forEach((p) => { if (!c.lessons.some((l) => (l.places || []).includes(p))) console.log("LIEU NON AFFECTÉ", cid, p.id); });
  const fi = (c.fiche || []).map((_, i) => i).filter((i) => !used[cid].f.has(i)); if (fi.length) console.log("fiche non affectée", cid, fi);
  delete c.fiche; delete c.cards; delete c.events; delete c.places; delete c.routes;
}
// Chapitres à venir : plan de leçons (progression type, non officielle) ; événements et lieux gardés au niveau du chapitre
for (const [cid, titles] of Object.entries(STUBS)) {
  const c = CH[cid]; if (!c) { console.log("STUB inconnu", cid); continue; }
  c.lessons = titles.map((t, n) => ({ id: `${cid}-l${n + 1}`, title: t, stub: true }));
  if (c.events || c.places) { c.lessons[0].events = c.events; c.lessons[0].places = c.places; delete c.events; delete c.places; }
  // on répartit les événements des chapitres HG à venir sur la bonne leçon
}
// répartitions fines pour les chapitres HG à venir
const mv = (cid, from, to, pred) => { const c = CH[cid]; const L = c.lessons; const src = L[from]; const ev = (src.events || []).filter(pred); src.events = (src.events || []).filter((e) => !pred(e)); L[to].events = (L[to].events || []).concat(ev); };
mv("hi-grecs", 0, 1, (e) => /Homère/.test(e.label)); mv("hi-grecs", 0, 2, (e) => /Olymp/.test(e.label)); mv("hi-grecs", 0, 3, (e) => /Périclès/.test(e.label));
{ const L = CH["hi-grecs"].lessons; L[2].places = L[0].places.filter((p) => p.id !== "athenes"); L[3].places = L[0].places.filter((p) => p.id === "athenes"); L[0].places = undefined; }
mv("hi-empire", 0, 1, (e) => /Caracalla/.test(e.label)); mv("hi-empire", 0, 2, (e) => /Temple|Nicée|officielle/.test(e.label)); mv("hi-empire", 0, 3, (e) => /Han/.test(e.label));
{ const L = CH["hi-empire"].lessons; L[3].places = L[0].places.filter((p) => p.id === "changan"); L[1].places = L[0].places.filter((p) => p.id === "arles"); L[0].places = undefined; }
Object.values(CH).forEach((c) => (c.lessons || []).forEach((l) => { if (!l.events || !l.events.length) delete l.events; if (!l.places || !l.places.length) delete l.places; }));

// Écriture
const files = { "c-fr.js": "fr", "c-ma.js": "ma", "c-hg.js": "hg", "c-sc.js": "sc", "c-lv-emc.js": ["en", "es", "emc"] };
const head = `/* Contenu Hikari — généré par split.js puis éditable à la main.
   Structure : chapitre (séquence de la prof, avec son yōkai) → leçons (une ou deux séances) → cartes.
   Types de cartes : f par cœur · q QCM · i réponse à taper · g générateur · s classer · o ordonner · p associer.
   Leçons « stub » : plan de progression type (NON officiel), à remplir par packs ou photos. */\n`;
for (const [file, subj] of Object.entries(files)) {
  const subs = [].concat(subj);
  const chs = window.CONTENT.chapters.filter((c) => subs.includes(c.s));
  fs.writeFileSync(D + file, head + "(window.CONTENT = window.CONTENT || { chapters: [] }).chapters.push(\n" + chs.map((c) => JSON.stringify(c, null, 1)).join(",\n") + "\n);\n");
}
let nl = 0, ncards = 0, nx = 0; window.CONTENT.chapters.forEach((c) => (c.lessons || []).forEach((l) => { nl++; ncards += (l.cards || []).length; nx += (l.cards || []).filter((k) => "sop".includes(k.k)).length; }));
console.log("leçons", nl, "cartes (hors générateurs démultipliés)", ncards, "interactives", nx);
