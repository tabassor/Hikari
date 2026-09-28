/* Contenu — Histoire-Géographie (Clan des Ombres). Programme 2015/2020, toujours en vigueur en 6e en 2026-2027.
   events : alimentent le Rouleau du temps (frise). places : alimentent la carte. routes : tracés de migrations.
   Les dates de la Préhistoire sont des ordres de grandeur ; elles évoluent avec les découvertes. */
(window.CONTENT = window.CONTENT || { chapters: [] }).chapters.push(
{
  id: "hi-humanite", s: "hg", period: 1, title: "Les débuts de l'humanité", kanji: "人",
  refs: ["HI-T1-01"],
  boss: { name: "Sen'nen, l'Ancien des cavernes", hp: 10 },
  sum: "Le berceau africain de l'humanité et les grandes migrations qui ont peuplé la Terre.",
  fiche: [
    { h: "Un berceau africain" },
    { p: "Les plus anciens fossiles d'ancêtres de l'homme ont été trouvés en **Afrique**. Lucy, une australopithèque découverte en Éthiopie en 1974, a vécu il y a environ 3,2 millions d'années. Le genre **Homo** apparaît vers **−2,8 millions d'années**." },
    { h: "Des humains qui migrent" },
    { list: ["Vers −1,8 million d'années, des humains (Homo erectus) sont déjà sortis d'Afrique : on a retrouvé leurs restes à **Dmanissi**, en Géorgie.", "**Homo sapiens**, notre espèce, apparaît en Afrique il y a environ 300 000 ans (fossiles de Jebel Irhoud, au Maroc).", "Entre environ −100 000 et −40 000, Homo sapiens sort d'Afrique et gagne l'Asie, l'Australie puis l'Europe ; il n'atteint l'Amérique que vers −20 000 / −15 000.", "En Europe, il côtoie **Néandertal**, qui disparaît il y a environ 40 000 ans."] },
    { h: "La vie au Paléolithique" },
    { p: "Les humains sont **nomades** : ils se déplacent pour chasser, pêcher et cueillir. Ils taillent la pierre (Paléolithique = âge de la pierre taillée), maîtrisent le feu et créent des œuvres d'art : peintures des grottes **Chauvet** (vers −36 000) et **Lascaux** (vers −18 000)." },
    { h: "Une histoire qui change" },
    { tip: "Chaque nouvelle fouille peut bouleverser les dates. C'est normal : les archéologues sont des enquêteurs, et l'enquête continue !" }
  ],
  events: [
    { y: -3200000, label: "Lucy (australopithèque)", note: "Éthiopie, découverte en 1974" },
    { y: -2800000, label: "Apparition du genre Homo", note: "Afrique", key: true },
    { y: -1800000, label: "Humains à Dmanissi", note: "Géorgie : premiers humains hors d'Afrique connus", key: true },
    { y: -300000, label: "Premiers Homo sapiens", note: "Jebel Irhoud, Maroc" },
    { y: -100000, label: "Sapiens commence à sortir d'Afrique", note: "Migrations jusqu'à −40 000 environ", key: true },
    { y: -40000, label: "Disparition de Néandertal", note: "Ordre de grandeur" },
    { y: -36000, label: "Grotte Chauvet", note: "Ardèche" },
    { y: -18000, label: "Grotte de Lascaux", note: "Dordogne" }
  ],
  places: [
    { id: "hadar", n: "Hadar (Lucy)", lon: 40.5, lat: 11.1, map: "world" },
    { id: "irhoud", n: "Jebel Irhoud", lon: -8.9, lat: 31.9, map: "world" },
    { id: "dmanissi", n: "Dmanissi", lon: 44.3, lat: 41.3, map: "medit" },
    { id: "chauvet", n: "Grotte Chauvet", lon: 4.4, lat: 44.4, map: "europe" },
    { id: "lascaux", n: "Lascaux", lon: 1.2, lat: 45.05, map: "europe" }
  ],
  routes: [
    { label: "Vers le Proche-Orient", pts: [[37, 5], [42, 14], [38, 28], [44, 33]] },
    { label: "Vers l'Asie et l'Australie (vers −65 000 / −50 000)", pts: [[44, 33], [60, 25], [80, 20], [100, 10], [115, -5], [135, -20]] },
    { label: "Vers l'Europe (vers −45 000)", pts: [[44, 33], [30, 40], [15, 46], [2, 46]] },
    { label: "Vers l'Amérique (vers −20 000 / −15 000)", pts: [[100, 10], [120, 40], [150, 60], [-168, 65], [-140, 60], [-110, 45], [-90, 20], [-70, -15]] }
  ],
  cards: [
    { k: "q", q: "Sur quel continent sont apparus les premiers humains ?", c: ["L'Afrique", "L'Europe", "L'Asie", "L'Amérique"], a: 0 },
    { k: "q", q: "Vers quand apparaît le genre **Homo** ?", c: ["Vers −2,8 millions d'années", "Vers −10 000", "Vers −300 000", "Vers −3300"], a: 0 },
    { k: "f", q: "Qu'a-t-on trouvé à **Dmanissi** (Géorgie) ?", a: "Des restes d'humains vieux d'environ 1,8 million d'années : la preuve de très anciennes migrations hors d'Afrique." },
    { k: "f", q: "Qui est **Lucy** ?", a: "Une australopithèque (lointaine cousine de l'homme) qui vivait en Éthiopie il y a environ 3,2 millions d'années ; découverte en 1974." },
    { k: "q", q: "Comment s'appelle notre espèce ?", c: ["Homo sapiens", "Homo erectus", "Néandertal", "Australopithèque"], a: 0 },
    { k: "q", q: "Vers quand Homo sapiens commence-t-il à sortir d'Afrique ?", c: ["Vers −100 000", "Vers −3 millions", "Vers −10 000", "Après l'invention de l'écriture"], a: 0 },
    { k: "q", q: "Quel est le dernier continent peuplé par Homo sapiens ?", c: ["L'Amérique", "L'Europe", "L'Australie", "L'Asie"], a: 0 },
    { k: "f", q: "Que signifie **Paléolithique** ?", a: "L'âge de la pierre ancienne (pierre taillée)." },
    { k: "f", q: "Définis **nomade**.", a: "Qui n'a pas d'habitat fixe et se déplace pour trouver sa nourriture." },
    { k: "f", q: "Définis **migration**.", a: "Déplacement d'une population d'un lieu à un autre pour s'y installer." },
    { k: "q", q: "Comment les humains du Paléolithique se nourrissent-ils ?", c: ["Chasse, pêche et cueillette", "Agriculture et élevage", "Commerce", "Grandes cultures de blé"], a: 0 },
    { k: "q", q: "Dans quelle grotte trouve-t-on des peintures datant d'environ −36 000 ?", c: ["Chauvet", "Lascaux", "Dmanissi", "Uruk"], a: 0 },
    { k: "q", q: "Néandertal a disparu il y a environ…", c: ["40 000 ans", "4 000 ans", "4 millions d'années", "400 ans"], a: 0 },
    { k: "f", q: "Pourquoi les dates de la Préhistoire changent-elles parfois ?", a: "Parce que de nouvelles fouilles et de nouvelles méthodes de datation apportent de nouvelles découvertes." }
  ]
},
{
  id: "hi-neolithique", s: "hg", period: 1, title: "La « révolution » néolithique", kanji: "農",
  refs: ["HI-T1-02"],
  boss: { name: "Tanbo-no-Oni, l'ogre des rizières", hp: 10 },
  sum: "Les humains se sédentarisent, cultivent et élèvent : leur rapport à la nature change.",
  fiche: [
    { h: "Un grand changement" },
    { p: "Vers **−10 000**, au **Proche-Orient** (dans le **Croissant fertile**), des humains commencent à cultiver des plantes (blé, orge) et à élever des animaux (chèvres, moutons). Ils deviennent **sédentaires** : ils vivent dans des villages." },
    { def: ["Néolithique", "L'âge de la pierre nouvelle (pierre polie), marqué par l'agriculture et l'élevage."] },
    { def: ["Sédentarisation", "Fait de s'installer durablement au même endroit."] },
    { def: ["Domestication", "Fait d'apprivoiser des animaux et de sélectionner des plantes pour les utiliser."] },
    { h: "Nouvelles techniques" },
    { list: ["Pierre **polie** (haches), faucilles", "Poterie pour stocker les récoltes", "Tissage", "Maisons regroupées en villages"] },
    { h: "Des conséquences" },
    { p: "La population augmente, les humains transforment les paysages (défrichements), accumulent des réserves… et des inégalités apparaissent. L'agriculture se diffuse lentement : elle atteint le territoire de la France vers −6000. Les **mégalithes** comme les alignements de **Carnac** datent de cette période." },
    { tip: "Pourquoi « révolution » entre guillemets ? Parce que le changement a pris des milliers d'années !" }
  ],
  events: [
    { y: -10000, label: "Début du Néolithique", note: "Croissant fertile : agriculture et élevage", key: true },
    { y: -7000, label: "Çatal Höyük", note: "Grand village d'Anatolie (Turquie actuelle)" },
    { y: -6000, label: "L'agriculture atteint la France", note: "Ordre de grandeur" },
    { y: -4500, label: "Alignements de Carnac", note: "Mégalithes, Bretagne" }
  ],
  places: [
    { id: "croissant", n: "Croissant fertile (Jéricho)", lon: 35.4, lat: 31.9, map: "medit" },
    { id: "catal", n: "Çatal Höyük", lon: 32.8, lat: 37.7, map: "medit" },
    { id: "carnac", n: "Carnac", lon: -3.1, lat: 47.6, map: "europe" }
  ],
  cards: [
    { k: "q", q: "Vers quand commence le Néolithique au Proche-Orient ?", c: ["Vers −10 000", "Vers −3300", "Vers −2,8 millions", "Vers −100 000"], a: 0 },
    { k: "q", q: "Où commence le Néolithique ?", c: ["Dans le Croissant fertile (Proche-Orient)", "En France", "En Amérique", "En Chine seulement"], a: 0 },
    { k: "f", q: "Définis **sédentaire**.", a: "Qui vit durablement au même endroit." },
    { k: "f", q: "Définis **domestication**.", a: "Apprivoiser des animaux et sélectionner des plantes pour les utiliser." },
    { k: "f", q: "Que signifie **Néolithique** ?", a: "L'âge de la pierre nouvelle (pierre polie)." },
    { k: "q", q: "Quelles plantes sont parmi les premières cultivées au Proche-Orient ?", c: ["Le blé et l'orge", "Le maïs et la pomme de terre", "Le riz et le thé", "Le cacao et la vanille"], a: 0 },
    { k: "q", q: "Quel objet se répand au Néolithique pour stocker les récoltes ?", c: ["La poterie", "La pièce de monnaie", "La tablette d'argile écrite", "Le papier"], a: 0, x: "Au Proche-Orient, la poterie se répand avec l'agriculture (elle existait déjà chez certains chasseurs-cueilleurs, au Japon par exemple)." },
    { k: "q", q: "Pourquoi parle-t-on de « révolution » néolithique **entre guillemets** ?", c: ["Parce que le changement a duré des milliers d'années", "Parce qu'il y a eu une guerre", "Parce que c'est une légende", "Parce que c'est arrivé en un jour"], a: 0 },
    { k: "q", q: "Les alignements de Carnac sont…", c: ["des mégalithes du Néolithique", "des peintures du Paléolithique", "des pyramides", "des temples grecs"], a: 0 },
    { k: "f", q: "Cite deux conséquences de la sédentarisation.", a: "Hausse de la population ; villages ; paysages transformés ; réserves et richesses ; apparition d'inégalités." }
  ]
},
{
  id: "hi-etats", s: "hg", period: 1, title: "Premiers États, premières écritures", kanji: "王",
  refs: ["HI-T1-03"],
  boss: { name: "Nendo, le golem d'argile", hp: 10 },
  sum: "Villes, rois, lois et écriture naissent en Mésopotamie et en Égypte.",
  fiche: [
    { h: "Les premières villes" },
    { p: "En **Mésopotamie** (« le pays entre deux fleuves », le Tigre et l'Euphrate), des villages deviennent des villes vers −3500. **Uruk** est l'une des plus grandes." },
    { def: ["Cité-État", "Ville indépendante qui contrôle le territoire autour d'elle, avec son roi et ses dieux."] },
    { def: ["État", "Organisation qui gouverne un territoire et sa population : un chef, des lois, des impôts, une armée, des fonctionnaires."] },
    { h: "L'invention de l'écriture" },
    { list: ["Vers **−3300**, en Mésopotamie : l'écriture **cunéiforme** (en forme de clous), tracée avec un calame dans l'argile.", "Vers −3200 en Égypte : les **hiéroglyphes**.", "Au début, on écrit pour **compter** (récoltes, impôts, troupeaux), puis pour les lois, la religion, les récits (comme Gilgamesh)."] },
    { def: ["Scribe", "Fonctionnaire qui sait lire, écrire et compter au service du roi ou du pharaon."] },
    { h: "L'Égypte des pharaons" },
    { p: "Le long du **Nil**, l'Égypte est unifiée vers −3100 sous l'autorité d'un **pharaon**, roi considéré comme un dieu. Les pyramides de **Gizeh** sont construites vers −2500." },
    { h: "Des lois écrites" },
    { p: "Vers −1750, **Hammurabi**, roi de Babylone, fait graver ses lois sur une stèle : c'est le **Code de Hammurabi**." },
    { tip: "Par convention, l'Histoire commence avec l'invention de l'écriture. Avant, c'est la Préhistoire." }
  ],
  events: [
    { y: -3500, label: "Premières villes (Uruk)", note: "Mésopotamie" },
    { y: -3300, label: "Invention de l'écriture", note: "Cunéiforme en Mésopotamie", key: true },
    { y: -3100, label: "Unification de l'Égypte", note: "Premier pharaon" },
    { y: -2500, label: "Pyramides de Gizeh", note: "Égypte" },
    { y: -1750, label: "Code de Hammurabi", note: "Babylone" }
  ],
  places: [
    { id: "uruk", n: "Uruk", lon: 45.6, lat: 31.3, map: "medit" },
    { id: "babylone", n: "Babylone", lon: 44.4, lat: 32.5, map: "medit" },
    { id: "gizeh", n: "Gizeh", lon: 31.1, lat: 30.0, map: "medit" }
  ],
  cards: [
    { k: "q", q: "Vers quand l'écriture est-elle inventée ?", c: ["Vers −3300", "Vers −10 000", "Vers −753", "Vers −40 000"], a: 0 },
    { k: "q", q: "Où l'écriture cunéiforme est-elle inventée ?", c: ["En Mésopotamie", "En Grèce", "En Chine", "En Gaule"], a: 0 },
    { k: "f", q: "Que signifie **Mésopotamie** ?", a: "Le pays entre deux fleuves : le Tigre et l'Euphrate." },
    { k: "f", q: "Définis **cité-État**.", a: "Une ville indépendante qui contrôle le territoire autour d'elle, avec son roi et ses dieux." },
    { k: "f", q: "Définis **État**.", a: "Une organisation qui gouverne un territoire et sa population (chef, lois, impôts, armée, fonctionnaires)." },
    { k: "f", q: "Qui est le **scribe** ?", a: "Un fonctionnaire qui sait lire, écrire et compter au service du roi." },
    { k: "q", q: "Sur quel support écrit-on le cunéiforme ?", c: ["Des tablettes d'argile", "Du papier", "Du parchemin", "Des feuilles de palmier"], a: 0 },
    { k: "q", q: "À quoi sert d'abord l'écriture ?", c: ["À compter (récoltes, impôts, troupeaux)", "À écrire des romans", "À envoyer des lettres d'amour", "À faire des affiches"], a: 0 },
    { k: "q", q: "Comment s'appelle l'écriture de l'Égypte ancienne ?", c: ["Les hiéroglyphes", "Le cunéiforme", "L'alphabet", "Les idéogrammes chinois"], a: 0 },
    { k: "q", q: "Quel fleuve traverse l'Égypte ?", c: ["Le Nil", "Le Tigre", "L'Euphrate", "Le Jourdain"], a: 0 },
    { k: "q", q: "Qui fait graver un célèbre code de lois vers −1750 ?", c: ["Hammurabi", "Gilgamesh", "Périclès", "Ramsès"], a: 0 },
    { k: "f", q: "Qu'est-ce qui sépare la Préhistoire de l'Histoire ?", a: "L'invention de l'écriture (vers −3300)." }
  ]
},
{
  id: "ge-metropoles", s: "hg", period: 1, title: "Habiter une métropole", kanji: "都",
  refs: ["GE-T1-01", "GE-T1-02"],
  boss: { name: "Tokaidō, le dragon des mégapoles", hp: 10 },
  sum: "Comment vit-on dans les très grandes villes du monde, et comment les rendre durables ?",
  fiche: [
    { h: "Qu'est-ce qu'une métropole ?" },
    { def: ["Métropole", "Très grande ville qui concentre population, activités et pouvoirs de décision (sièges d'entreprises, gouvernement, universités) et rayonne sur un vaste territoire."] },
    { def: ["Urbanisation", "Augmentation de la part de la population qui vit en ville. Aujourd'hui, plus de la moitié de l'humanité vit en ville."] },
    { def: ["Étalement urbain", "Extension de la ville sur les espaces ruraux autour d'elle."] },
    { def: ["Densité", "Nombre d'habitants par km²."] },
    { h: "Habiter, c'est…" },
    { list: ["se **loger** : immeubles, lotissements, mais aussi bidonvilles dans certaines métropoles", "**travailler** : centres d'affaires (CBD), usines, commerces", "se **déplacer** : métro, bus, voiture, embouteillages, trajets domicile-travail", "**cohabiter** : quartiers riches et pauvres parfois séparés (ségrégation), ou mélangés (mixité sociale)"] },
    { h: "La ville de demain" },
    { p: "Pour une ville **durable** : transports en commun et vélos, **écoquartiers** économes en énergie, espaces verts, logements pour tous (mixité sociale)." },
    { tip: "Ton prof étudie deux métropoles précises en classe ? Photographie la leçon : j'ajouterai tes études de cas à la carte." }
  ],
  places: [
    { id: "tokyo", n: "Tokyo", lon: 139.7, lat: 35.7, map: "world" },
    { id: "delhi", n: "Delhi", lon: 77.2, lat: 28.6, map: "world" },
    { id: "shanghai", n: "Shanghai", lon: 121.5, lat: 31.2, map: "world" },
    { id: "saopaulo", n: "São Paulo", lon: -46.6, lat: -23.6, map: "world" },
    { id: "mexico", n: "Mexico", lon: -99.1, lat: 19.4, map: "world" },
    { id: "caire", n: "Le Caire", lon: 31.2, lat: 30.0, map: "world" },
    { id: "mumbai", n: "Mumbai", lon: 72.9, lat: 19.1, map: "world" },
    { id: "newyork", n: "New York", lon: -74.0, lat: 40.7, map: "world" },
    { id: "lagos", n: "Lagos", lon: 3.4, lat: 6.5, map: "world" },
    { id: "paris", n: "Paris", lon: 2.35, lat: 48.9, map: "world" },
    { id: "londres", n: "Londres", lon: -0.1, lat: 51.5, map: "world" },
    { id: "pekin", n: "Pékin", lon: 116.4, lat: 39.9, map: "world" }
  ],
  cards: [
    { k: "f", q: "Définis **métropole**.", a: "Une très grande ville qui concentre population, activités et pouvoirs de décision, et rayonne sur un vaste territoire." },
    { k: "f", q: "Définis **urbanisation**.", a: "L'augmentation de la part de la population qui vit en ville." },
    { k: "f", q: "Définis **étalement urbain**.", a: "L'extension de la ville sur les espaces ruraux qui l'entourent." },
    { k: "f", q: "Définis **densité** de population.", a: "Le nombre d'habitants par km²." },
    { k: "f", q: "Qu'est-ce qu'un **écoquartier** ?", a: "Un quartier conçu pour respecter l'environnement : économe en énergie, avec espaces verts, transports doux et mixité sociale." },
    { k: "q", q: "Aujourd'hui, quelle part de l'humanité vit en ville ?", c: ["Plus de la moitié", "Environ un dixième", "Presque personne", "Environ un quart"], a: 0 },
    { k: "q", q: "Comment appelle-t-on la séparation des habitants riches et pauvres dans des quartiers différents ?", c: ["La ségrégation", "La mixité sociale", "L'étalement urbain", "La densité"], a: 0 },
    { k: "q", q: "Quel mode de transport rend la ville plus durable ?", c: ["Le tramway", "La voiture individuelle", "L'avion", "Le camion"], a: 0 },
    { k: "q", q: "Tokyo se trouve…", c: ["au Japon, en Asie", "en Chine", "en Inde", "au Brésil"], a: 0 },
    { k: "q", q: "São Paulo se trouve…", c: ["au Brésil, en Amérique du Sud", "au Mexique", "au Portugal", "en Argentine"], a: 0 },
    { k: "q", q: "Lagos, une métropole qui grandit très vite, est en…", c: ["Afrique (Nigeria)", "Asie (Inde)", "Europe (Portugal)", "Amérique (Mexique)"], a: 0 }
  ]
},
{ id: "hi-grecs", s: "hg", period: 2, title: "Le monde des cités grecques", kanji: "希", refs: ["HI-T2-01"], stub: true,
  events: [{ y: -750, label: "Homère (Iliade, Odyssée)", note: "VIIIe siècle av. J.-C." }, { y: -776, label: "Premiers jeux Olympiques", note: "Olympie", key: true }, { y: -440, label: "Athènes au temps de Périclès", note: "Ve siècle av. J.-C. : démocratie", key: true }],
  places: [{ id: "athenes", n: "Athènes", lon: 23.7, lat: 38.0, map: "medit" }, { id: "olympie", n: "Olympie", lon: 21.6, lat: 37.6, map: "medit" }, { id: "delphes", n: "Delphes", lon: 22.5, lat: 38.5, map: "medit" }] },
{ id: "hi-rome-mythe", s: "hg", period: 2, title: "Rome, du mythe à l'histoire", kanji: "狼", refs: ["HI-T2-02"], stub: true,
  events: [{ y: -753, label: "Fondation légendaire de Rome", note: "Romulus et Rémus", key: true }],
  places: [{ id: "rome", n: "Rome", lon: 12.5, lat: 41.9, map: "medit" }] },
{ id: "hi-monotheisme", s: "hg", period: 2, title: "La naissance du monothéisme juif", kanji: "一", refs: ["HI-T2-03"], stub: true,
  events: [{ y: -587, label: "Prise de Jérusalem par Babylone", note: "Exil à Babylone" }],
  places: [{ id: "jerusalem", n: "Jérusalem", lon: 35.2, lat: 31.8, map: "medit" }] },
{ id: "hi-empire", s: "hg", period: 3, title: "L'empire romain", kanji: "帝", refs: ["HI-T3-01", "HI-T3-02", "HI-T3-03"], stub: true,
  events: [{ y: -27, label: "Auguste, premier empereur", note: "Début de l'Empire", key: true }, { y: 70, label: "Destruction du Temple de Jérusalem" }, { y: 212, label: "Édit de Caracalla", note: "Citoyenneté à tous les hommes libres", key: true }, { y: 325, label: "Concile de Nicée" }, { y: 380, label: "Christianisme religion officielle", note: "Édit de Thessalonique", key: true }, { y: -206, label: "Dynastie Han en Chine", note: "Jusqu'en 220" }],
  places: [{ id: "arles", n: "Arles", lon: 4.6, lat: 43.7, map: "europe" }, { id: "changan", n: "Chang'an (Chine des Han)", lon: 108.9, lat: 34.3, map: "world" }] },
{ id: "ge-faible", s: "hg", period: 2, title: "Habiter un espace de faible densité", kanji: "野", refs: ["GE-T2-01", "GE-T2-02"], stub: true },
{ id: "ge-littoraux", s: "hg", period: 4, title: "Habiter les littoraux", kanji: "浜", refs: ["GE-T3-01", "GE-T3-02"], stub: true },
{ id: "ge-monde", s: "hg", period: 5, title: "Le monde habité", kanji: "界", refs: ["GE-T4-01", "GE-T4-02"], stub: true }
);
