/* Cœur : état, répétition espacée (SRS), gamification, leçons, packs, photos.
   Structure du contenu : chapitre (séquence de la prof + yōkai) → leçons (1–2 séances) → cartes.
   Toutes les données restent sur le téléphone (localStorage + IndexedDB pour les photos). */
(function () {
  const KEY = "hikari.v1";
  const DAY = 86400000;
  const today = (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };

  const DEFAULT = () => ({
    v: 2, profile: null, xp: 0, days: {}, streak: { cur: 0, best: 0, last: null },
    chapters: {}, lessons: {}, cards: {}, bosses: {}, badges: {}, packs: [],
    stats: { reviews: 0, mapWins: 0, orderWins: 0, bestCombo: 0, dragWins: 0 },
    settings: { goal: 20, newPerDay: 25, sound: true, haptics: true, zone: "C" }
  });

  let S;
  function load() {
    try { S = Object.assign(DEFAULT(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = DEFAULT(); }
    S.settings = Object.assign(DEFAULT().settings, S.settings || {}); S.stats = Object.assign(DEFAULT().stats, S.stats || {}); if (!S.settings.zone) S.settings.zone = "C"; // famille en zone C
    if (!S.settings.newPerDayV2) { if (S.settings.newPerDay === 15) S.settings.newPerDay = 25; S.settings.newPerDayV2 = true; }
    S.lessons = S.lessons || {}; S.msgs = S.msgs || {};
    // Édition : « classe » (contenu des cours de la prof, défis de papa) ou « libre » (contenu de base seulement, pour un autre élève).
    // Choisie par le lien d'installation : …/Hikari/?libre ; mémorisée ensuite sur le téléphone.
    try { const q = location.search; const ed = /[?&]libre\b/.test(q) ? "libre" : /[?&]classe\b/.test(q) ? "classe" : null; if (ed && S.settings.edition !== ed) { S.settings.edition = ed; localStorage.setItem(KEY, JSON.stringify(S)); } } catch (e) { }
    return S;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn("Sauvegarde impossible", e); } }

  // ---------- Contenu fusionné (base + packs) ----------
  let CH = [], CHI = {}, LEI = {}, REFI = {}, SUBI = {};
  const clone = (o) => JSON.parse(JSON.stringify(o));
  // Un chapitre sans leçons (ancien format, pack simple) devient un chapitre à une leçon
  function normalize(c) {
    if (!c.lessons || !c.lessons.length) {
      c.lessons = [{ id: c.id + "-l1", title: c.title, fiche: c.fiche, cards: c.cards || [], events: c.events, places: c.places, routes: c.routes, stub: !!c.stub && !(c.cards || []).length }];
      delete c.fiche; delete c.cards; delete c.events; delete c.places; delete c.routes;
    }
    c.lessons.forEach((l) => { l.cards = l.cards || []; if (l.stub && (l.cards.length || (l.fiche || []).length)) l.stub = false; });
    c.stub = c.lessons.every((l) => l.stub);
    return c;
  }
  function mergeLesson(c, L, pack) {
    const ex = c.lessons.find((l) => l.id === L.id);
    if (!ex) {
      const nl = Object.assign({ cards: [] }, L, { fromPack: pack, fromTeacher: true });
      const at = L.after ? c.lessons.findIndex((l) => l.id === L.after) : -1;
      if (at >= 0) c.lessons.splice(at + 1, 0, nl); else if (L.first) c.lessons.unshift(nl); else c.lessons.push(nl);
      return;
    }
    // replace : la leçon de la prof devient la référence (fiche et cartes de base remplacées)
    if (L.replace) {
      ["fiche", "cards", "events", "places", "routes", "photos"].forEach((k) => { if (L[k]) ex[k] = L[k]; });
      if (L.title) ex.title = L.title; if (L.refs) ex.refs = L.refs; if (L.note) ex.note = L.note;
      ex.extra = []; ex.stub = false; ex.fromTeacher = true; ex.fromPack = pack; return;
    }
    if (L.title) ex.title = L.title;
    if (L.refs) ex.refs = Array.from(new Set((ex.refs || []).concat(L.refs)));
    if (L.fiche) ex.extra = (ex.extra || []).concat([{ pack, note: L.note, fiche: L.fiche }]);
    else if (L.note) ex.extra = (ex.extra || []).concat([{ pack, note: L.note, fiche: [] }]);
    ["cards", "events", "places", "routes", "photos"].forEach((k) => { if (L[k]) ex[k] = (ex[k] || []).concat(L[k]); });
    if (L.cards && L.cards.length || L.fiche) ex.stub = false;
  }
  // Packs livrés avec l'application : en édition libre, seulement ceux destinés à tous (contenu de base, pas de cours ni de défi personnels)
  const repoPacks = () => (window.REPO_PACKS || []).filter((p) => !(S && S.settings && S.settings.edition === "libre") || p.audience === "tous");
  const isLibre = () => !!(S && S.settings && S.settings.edition === "libre");
  function buildContent() {
    SUBI = {}; REFI = {};
    PROGRAMME.subjects.forEach((s) => { SUBI[s.id] = s; s.domains.forEach((d) => d.items.forEach((it) => { REFI[it.id] = Object.assign({ s: s.id, domain: d.name }, it); })); });
    const map = new Map();
    CONTENT.chapters.forEach((c) => map.set(c.id, normalize(clone(c))));
    // Packs livrés avec l'application (dépôt GitHub : data/packs/*.js), puis packs importés sur le téléphone
    repoPacks().concat(S.packs || []).forEach((p) => {
      const pk = p.title || p.id;
      (p.chapters || []).forEach((c0) => {
        const c = normalize(clone(c0)); const base = map.get(c.id);
        if (!base) { c.fromPack = pk; c.lessons.forEach((l) => { if (!l.stub) l.fromTeacher = true; }); map.set(c.id, c); return; }
        ["title", "sum", "boss", "kanji", "period"].forEach((k) => { if (c[k] != null) base[k] = c[k]; });
        if (c.refs) base.refs = Array.from(new Set((base.refs || []).concat(c.refs)));
        c.lessons.forEach((L) => mergeLesson(base, L, pk)); base.fromPack = pk; normalize(base);
      });
      (p.extend || []).forEach((x) => {
        const c = map.get(x.chapter); if (!c) return;
        if (x.refs) c.refs = Array.from(new Set((c.refs || []).concat(x.refs)));
        (x.lessons || []).forEach((L) => mergeLesson(c, L, pk));
        // Ancien format : ajouts sans leçon → leçon « Ajouts de ta prof » du chapitre
        if (x.cards || x.fiche || x.events || x.places) {
          const target = x.lesson ? x.lesson : c.id + "-ajouts";
          mergeLesson(c, { id: target, title: x.lesson ? undefined : "Ajouts de ta prof", note: x.note, fiche: x.fiche, cards: x.cards, events: x.events, places: x.places, refs: x.refs }, pk);
        }
        normalize(c);
      });
    });
    CH = Array.from(map.values()); CHI = {}; LEI = {};
    CH.forEach((c) => { CHI[c.id] = c; c.lessons.forEach((l) => { l.ch = c.id; LEI[l.id] = l; }); });
  }

  // ---------- Calendrier scolaire 2026-2027 (vacances : du samedi, fin des cours, au lundi de reprise exclu) ----------
  // Sources : education.gouv.fr (calendrier officiel), L'Étudiant et vacances-scolaires.com (dates par zone).
  const HOLIDAYS = {
    all: [["2026-10-17", "2026-11-02"], ["2026-12-19", "2027-01-04"], ["2027-07-03", "2027-09-01"]],
    A: [["2027-02-13", "2027-03-01"], ["2027-04-10", "2027-04-26"]],
    B: [["2027-02-20", "2027-03-08"], ["2027-04-17", "2027-05-03"]],
    C: [["2027-02-06", "2027-02-22"], ["2027-04-03", "2027-04-19"]]
  };
  const ZONE_SENSITIVE_FROM = "2027-02-06";
  const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return today(d); };
  function inHoliday(iso, zone) { return HOLIDAYS.all.concat(zone ? HOLIDAYS[zone] : []).some(([a, b]) => iso >= a && iso < b); }
  // Numéro de la semaine de cours (1 = semaine de start) à la date donnée ; les semaines de vacances ne comptent pas
  function classWeek(sched, iso = today(), zone = S && S.settings.zone) {
    if (!sched || iso < sched.start) return 0;
    let n = 0, mon = sched.start;
    while (mon <= iso) { if (!inHoliday(mon, zone)) n++; mon = addDays(mon, 7); }
    return n;
  }
  function weekStart(sched, n, zone = S && S.settings.zone) { let k = 0, mon = sched.start; while (true) { if (!inHoliday(mon, zone)) { k++; if (k === n) return mon; } mon = addDays(mon, 7); if (k > 80) return null; } }
  function unlockedFiches(ch) {
    const sc = ch && ch.schedule; if (!sc) return null;
    const w = classWeek(sc), set = new Set();
    sc.grid.slice(0, w).forEach((row) => row.forEach((f) => set.add(f)));
    return set;
  }

  // Leçons ouvertes automatiquement par les packs du dépôt (une seule fois : elle peut ensuite les refermer)
  function autoOpen() {
    S.autoOpened = S.autoOpened || {};
    repoPacks().forEach((p) => (p.open || []).forEach((lid) => { if (!S.autoOpened[lid] && LEI[lid]) { S.autoOpened[lid] = today(); if (!lessonOpen(lid)) openLesson(lid); S.newFromRepo = (S.newFromRepo || []).concat([lid]); } }));
    // Chapitres à calendrier (carnet de conjugaison) : ouverture des leçons au fil des semaines
    S.schedWeek = S.schedWeek || {};
    CH.filter((c) => c.schedule).forEach((c) => {
      const w = classWeek(c.schedule), prev = S.schedWeek[c.id] || 0; if (w <= prev) return;
      const un = unlockedFiches(c);
      c.lessons.forEach((l) => { if ((l.fiches || []).some((f) => un.has(f)) && !lessonOpen(l.id)) openLesson(l.id); });
      // fiches « à réviser » de la semaine : leurs cartes repassent en tête des révisions
      const row = c.schedule.grid[w - 1] || [], review = new Set(row.slice(2));
      if (review.size) c.lessons.forEach((l) => lessonCards(c, l).forEach((k) => { const fs = k.fiche ? [k.fiche] : k.tab && k.tab.fiches ? (k._verbs || []).map((v) => k.tab.fiches[v]) : []; if (fs.some((f) => review.has(f)) && S.cards[k.id] && S.cards[k.id].due > Date.now()) S.cards[k.id].due = Date.now(); }));
      if (prev) S.newWeek = { ch: c.id, week: w }; else S.newWeek = { ch: c.id, week: w, first: true };
      S.schedWeek[c.id] = w;
    });
    save();
  }
  // Migration v1 → v2 : un chapitre ouvert ouvre toutes ses leçons remplies
  function migrate() {
    // Nouvelle courbe de niveaux : on garde le niveau atteint et la fraction en cours (les XP totaux sont recalculés)
    if (!S.curveV3) { const old = S.curveV2 ? needV2 : needV1; let l = 1, rest = S.xp || 0; while (rest >= old(l)) { rest -= old(l); l++; }
      let x = 0; for (let k = 1; k < l; k++) x += need(k); S.xp = x + Math.round((rest / old(l)) * need(l)); S.curveV2 = 1; S.curveV3 = 1; save(); }
    if (S.v >= 2 && S.migrated2) return;
    Object.entries(S.chapters || {}).forEach(([cid, st]) => {
      const c = CHI[cid]; if (!c || !st || st.state === "locked") return;
      c.lessons.forEach((l) => { if (!l.stub && !S.lessons[l.id]) S.lessons[l.id] = { state: "active", since: st.since || today() }; });
    });
    S.v = 2; S.migrated2 = true; save();
  }

  // ---------- États ----------
  const lessonOpen = (lid) => !!(S.lessons[lid] && S.lessons[lid].state !== "locked");
  function chapterState(cid) {
    const c = CHI[cid]; if (!c) return "locked";
    if (!c.lessons.some((l) => lessonOpen(l.id))) return "locked";
    return S.chapters[cid] && S.chapters[cid].state === "done" ? "done" : "active";
  }
  function openLesson(lid) { S.lessons[lid] = { state: "active", since: today() }; const l = LEI[lid]; if (l && !S.chapters[l.ch]) S.chapters[l.ch] = { state: "active", since: today() }; }
  function closeLesson(lid) { delete S.lessons[lid]; }
  const activeChapters = () => CH.filter((c) => chapterState(c.id) !== "locked");
  const openLessons = (c) => c.lessons.filter((l) => lessonOpen(l.id));

  // Identifiants de cartes stables (chapitre + contenu), indépendants du découpage en leçons
  function cardId(ch, c) {
    if (c.k === "q") return `${ch.id}:${ART.hash(c.q + "|" + c.c[c.a])}`;
    if ("sop".includes(c.k)) return `${ch.id}:${c.k}:${ART.hash(c.q + "|" + JSON.stringify(c.items || c.pairs))}`;
    return `${ch.id}:${ART.hash(c.q + "|" + String(c.a))}`;
  }
  // ---------- Définitions : exercices fabriqués automatiquement à partir de chaque carte « définition » ----------
  // « Reconstitue » (remettre les morceaux de la phrase dans l'ordre) et « Complète » (taper le mot clé manquant).
  const STOP = new Set("le la les un une des de du d l à au aux et ou en par pour sur dans qui que qu est sont a ont son sa ses leur leurs ce cet cette ces il elle on se s ne pas plus avec sans entre tout tous toute toutes même".split(" "));
  const NUMW = { 2: "deux", 3: "trois", 4: "quatre", 5: "cinq", 10: "dix", 100: "cent" };
  function defTerm(q) { const b = String(q).match(/\*\*([^*]+)\*\*/); if (b) return b[1]; const g = String(q).match(/«\s*([^»]+?)\s*»/); if (g) return g[1]; return String(q).replace(/^(définition d['eu]?\s*(une?|du|de la|des)?|qu'est-ce qu['e]?\s*(une?|la|le|l')?|définis|que signifie|que veut dire|que sont (les )?|qu'appelle-t-on (une?|la|le|les|l')?)\s*/i, "").replace(/\s*[?.:]\s*$/, ""); }
  function chunks(words) {
    const n = words.length, k = Math.min(n <= 6 ? 3 : n <= 10 ? 4 : n <= 16 ? 5 : 6, Math.floor(n / 2)), out = [];
    for (let i = 0; i < k; i++) { const a = Math.round((i * n) / k), b = Math.round(((i + 1) * n) / k); if (b > a) out.push(words.slice(a, b).join(" ")); }
    return out;
  }
  function deriveDef(c, baseId, ch, l) {
    if (c.t !== "def" || c.k !== "f" || typeof c.a !== "string") return [];
    const t0 = defTerm(c.q), term = t0.length <= 40 && !/\?/.test(t0) ? t0 : null, raw = c.a.replace(/\s+/g, " ").trim().replace(/[.;]\s*$/, ""), plain = raw.replace(/\*\*/g, "");
    const words = plain.split(" ").filter(Boolean), out = [], base = { ch: ch.id, le: l.id, t: "def", derived: baseId, x: c.x, bonus: c.bonus };
    if (words.length >= 5 && words.length <= 30) {
      const items = chunks(words); if (new Set(items).size === items.length && items.length >= 3)
        out.push(Object.assign({ id: baseId + ":ro", k: "o", q: term ? `Reconstitue la définition : **${term}**` : `${c.q} Reconstitue la réponse.`, items }, base));
    }
    // Mots clés : ceux en gras dans la réponse, sinon les mots les plus longs ; une carte « Complète » par mot clé (2 au plus)
    let keys = []; raw.replace(/\*\*([^*]+)\*\*/g, (m, g) => { g.split(/\s+/).filter((w) => !STOP.has(w.toLowerCase().replace(/^[ld]'/, "")) && w.replace(/[^\p{L}\d]/gu, "").length >= 3).forEach((w) => keys.push(w)); return m; });
    if (!keys.length) keys = words.filter((w) => !STOP.has(w.toLowerCase()) && w.replace(/[^\p{L}]/gu, "").length >= 6);
    keys = Array.from(new Set(keys.map((w) => w.replace(/[,;:()]+$/g, "").replace(/^[(]+/, "").replace(/^(l|d|qu|j|s|n|m|t)['’]/i, "")))).filter((w) => w.length >= 2).sort((a, b) => b.length - a.length).slice(0, 2);
    keys.forEach((w, i) => {
      const re = new RegExp("(^|[\\s'(])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=$|[\\s,;:).])"); if (!re.test(plain)) return;
      const holed = plain.replace(re, (m, p) => p + "……");
      const ans = [w]; if (/^\d+$/.test(w) && NUMW[w]) ans.push(NUMW[w]); if (NUMW[w] === undefined) Object.entries(NUMW).forEach(([d, t]) => { if (t === w.toLowerCase()) ans.push(d); });
      out.push(Object.assign({ id: baseId + ":c" + i, k: "i", q: term ? `Complète la définition de **${term}** : « ${holed} »` : `${c.q} Complète : « ${holed} »`, a: ans }, base));
    });
    return out;
  }
  function lessonCards(ch, l) {
    const out = [], un = unlockedFiches(ch);
    (l.cards || []).forEach((c0) => {
      let c = c0;
      if (un) {
        if (c.fiche && !un.has(c.fiche)) return;
        if (c.tab && c.tab.fiches) { const ok = Object.keys(c.tab.verbs).filter((v) => un.has(c.tab.fiches[v])); if (!ok.length) return; c = Object.assign({}, c, { _verbs: ok }); }
      }
      if (l.remed) c = Object.assign({}, c, { bonus: true });
      if (c.k === "g") { const tag = c.tab ? ART.hash(c.tab.tense + Object.keys(c.tab.verbs).join()) + ":" : ""; for (let i = 0; i < (c.n || 3); i++) out.push(Object.assign({ id: `${ch.id}:g:${c.g}:${tag}${i}`, ch: ch.id, le: l.id }, c)); }
      else { const id = cardId(ch, c); out.push(Object.assign({ id, ch: ch.id, le: l.id }, c)); deriveDef(c, id, ch, l).forEach((d) => out.push(d)); }
    });
    (l.places || []).forEach((p) => out.push({ id: `${ch.id}:m:${p.id}`, ch: ch.id, le: l.id, k: "m", place: p, q: `Touche la carte là où se trouve **${p.n}**.` }));
    return out;
  }
  // onlyOpen : seulement les leçons ouvertes (révisions) ; sinon toutes (aperçu)
  function cardList(ch, onlyOpen = true) { let out = []; ch.lessons.forEach((l) => { if (!onlyOpen || lessonOpen(l.id)) out = out.concat(lessonCards(ch, l)); }); return out; }
  function allActiveCards(filter) { let cs = []; activeChapters().forEach((c) => { if (!filter || filter(c)) cs = cs.concat(cardList(c)); }); return cs; }

  // ---------- SRS (variante SM-2, 4 boutons) ----------
  // Jours réussis d'affilée : +1 au plus par jour quand la réponse est juste, remis à zéro à la première erreur
  function okStreak(k, g) { if (g === 0) { k.okDays = 0; k.okLast = today(); return; } if (k.okLast !== today() || !k.okDays) { k.okDays = (k.okLast === today() ? k.okDays || 0 : (k.okDays || 0)) + 1; k.okLast = today(); } }
  function grade(cardId, g, bonus, focus) {
    const now = Date.now();
    // Préparation d'une échéance : une carte pas encore due et réussie garde son calendrier (pas de bachotage qui fausse les intervalles)
    if (focus && S.cards[cardId] && !isDue(cardId) && g >= 1) { const k = S.cards[cardId]; k.tries = (k.tries || 0) + 1; if (g >= 2 && (k.lapses > 0 || k.ease < 2.3)) { S.hw = S.hw || {}; S.hw[today()] = (S.hw[today()] || 0) + 1; } k.last = now; okStreak(k, g); return k; }
    const c = S.cards[cardId] || { ivl: 0, ease: 2.5, reps: 0, lapses: 0, first: today() };
    c.tries = (c.tries || 0) + 1; c.last = today();
    // Carte difficile (déjà ratée, ou facilité basse) réussie : compte pour les défis « cartes difficiles »
    // Les cartes « revanche » (erreurs d'interro) comptent double, même la première fois
    if (g >= 2 && (bonus || c.lapses > 0 || c.ease < 2.3)) { S.hw = S.hw || {}; S.hw[today()] = (S.hw[today()] || 0) + (bonus ? 2 : 1); }
    if (g === 0) { c.lapses++; c.reps = 0; c.ivl = 0; c.due = now + 10 * 60000; c.ease = Math.max(1.3, c.ease - 0.2); }
    else {
      if (c.reps === 0) c.ivl = g === 3 ? 3 : 1;
      else if (c.reps === 1) c.ivl = g === 1 ? 2 : g === 2 ? 3 : 5;
      else c.ivl = Math.round(c.ivl * c.ease * (g === 1 ? 0.6 : g === 3 ? 1.3 : 1));
      c.ivl = Math.min(180, Math.max(1, c.ivl));
      c.ease = Math.min(3, Math.max(1.3, c.ease + (g === 1 ? -0.15 : g === 3 ? 0.15 : 0)));
      c.reps++;
      const d = new Date(); d.setHours(4, 0, 0, 0); c.due = d.getTime() + c.ivl * DAY;
    }
    c.last = now; okStreak(c, g); S.cards[cardId] = c;
    return c;
  }
  const isDue = (id) => { const c = S.cards[id]; return c && c.due <= Date.now(); };
  const isNew = (id) => !S.cards[id];
  const mastered = (id) => { const c = S.cards[id]; return !!c && c.ivl >= 21; };
  const newSeenToday = () => Object.values(S.cards).filter((c) => c.first === today()).length;

  // ---------- Échéances de l'agenda : cartes concernées et jauge ----------
  // Compléments du programme : leçons de base (non issues du cours de la prof) du même chapitre,
  // ou des chapitres qui couvrent les mêmes points du programme que la leçon choisie.
  function relatedLessons(lid) {
    const l = LEI[lid]; if (!l) return []; const c = CHI[l.ch], refs = new Set(l.refs || []), out = [];
    CH.forEach((c2) => { if (c2.s !== c.s) return; if (c2.id !== c.id && !(c2.refs || []).some((r) => refs.has(r))) return;
      c2.lessons.forEach((l2) => { if (l2.id === lid || l2.fromTeacher || l2.stub || l2.remed) return; if (lessonCards(c2, l2).length) out.push(l2.id); }); });
    return out;
  }
  function itemCards(it) {
    const main = new Set(it.lessons || []), comp = new Set(), out = [], seen = new Set();
    if (it.prog !== false) main.forEach((lid) => relatedLessons(lid).forEach((x) => { if (!main.has(x)) comp.add(x); }));
    const add = (lid, isComp) => { const l = LEI[lid]; if (!l) return; lessonCards(CHI[l.ch], l).forEach((c) => { if (seen.has(c.id)) return; seen.add(c.id); out.push(isComp ? Object.assign({}, c, { comp: true }) : c); }); };
    main.forEach((l) => add(l, false)); comp.forEach((l) => add(l, true));
    return out;
  }
  // Vu = carte déjà travaillée ; prête = réussie 2 jours différents d'affilée (une erreur remet le compteur à zéro)
  const READY_DAYS = 2;
  const okDaysOf = (id) => (S.cards[id] && S.cards[id].okDays) || 0;
  function itemProgress(it) { const cs = itemCards(it); let seen = 0, ok = 0, need = 0; cs.forEach((c) => { const k = S.cards[c.id]; if (k) seen++; const d = okDaysOf(c.id); if (d >= READY_DAYS) ok++; need += Math.max(0, READY_DAYS - d); }); return { total: cs.length, seen, ok, need, comp: cs.filter((c) => c.comp).length }; }
  const agendaCands = (items) => { const seen = new Set(), out = []; items.forEach((it) => itemCards(it).forEach((c) => { if (seen.has(c.id)) return; seen.add(c.id); out.push(Object.assign({}, c, { focus: it })); })); return out; };
  // Cartes à préparer pour les échéances de l'agenda (contrôle, interro, leçon à apprendre)
  function focusCards(cands, max) {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const cand = cands.filter((c) => !(S.cards[c.id] && S.cards[c.id].last >= t0.getTime() && !isDue(c.id)));
    // d'abord les cartes jamais vues, puis les plus fragiles, puis les moins récemment revues
    const score = (c) => { const k = S.cards[c.id]; if (!k) return -1e15; if (k.lapses > 0 && !okDaysOf(c.id)) return -2e15 + (k.last || 0) / 1e3; /* ratée récemment : d'abord */ return Math.min(okDaysOf(c.id), READY_DAYS) * 1e14 - (k.lapses * 5 + (3 - k.ease) * 4) * 1e10 + (k.last || 0); };
    return cand.sort((a, b) => score(a) - score(b)).slice(0, max);
  }
  // Nature d'une carte : def (définition), coeur (à savoir), exo (exercice), vocab (vocabulaire de langue)
  const KINDS = { def: ["Définitions", "📖"], coeur: ["Par cœur", "🧠"], exo: ["Exercices", "✏️"], vocab: ["Vocabulaire", "💬"] };
  const kindOf = (c) => c.t || (c.k === "g" ? "exo" : "coeur");
  function buildSession({ subject, chapter, lesson, agenda, kind, max = 30 } = {}) {
    let pool = allActiveCards((c) => (!subject || c.s === subject) && (!chapter || c.id === chapter));
    if (kind) pool = pool.filter((c) => kindOf(c) === kind);
    if (lesson) pool = pool.filter((c) => c.le === lesson);
    if (agenda && window.AGENDA) { const it = AGENDA.A().find((x) => x.id === agenda); if (!it) return []; return shuffleOrder(focusCards(agendaCands([it]), 20)); }
    const items = !chapter && !lesson && !kind && window.AGENDA ? AGENDA.upcoming().filter((x) => AGENDA.daysTo(x.date) <= AGENDA.WINDOW) : [];
    const cands = agendaCands(items).filter((c) => !subject || (CHI[c.ch] && CHI[c.ch].s === subject));
    let fmax = 0; items.forEach((it) => { const P = itemProgress(it); fmax += Math.ceil(P.need / Math.max(1, AGENDA.daysTo(it.date))); });
    fmax = Math.min(30, Math.max(window.AGENDA ? AGENDA.FOCUS_MAX : 15, fmax));
    const focus = focusCards(cands, fmax), fids = new Set(focus.map((c) => c.id));
    pool = pool.filter((c) => !fids.has(c.id));
    const due = pool.filter((c) => isDue(c.id)).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due);
    const extra = (S.extraNew && S.extraNew.d === today()) ? S.extraNew.n : 0;
    const room = chapter || lesson ? 999 : Math.max(0, S.settings.newPerDay + extra - newSeenToday());
    // Nouvelles cartes : d'abord les leçons ouvertes le plus récemment (le cours de la semaine),
    // à tour de rôle entre leçons ouvertes le même jour.
    const byL = {}; pool.filter((c) => isNew(c.id)).forEach((c) => (byL[c.le] = byL[c.le] || []).push(c));
    const since = (lid) => (S.lessons[lid] && S.lessons[lid].since) || "0000";
    const byDay = {}; Object.keys(byL).forEach((lid) => (byDay[since(lid)] = byDay[since(lid)] || []).push(byL[lid]));
    let fresh = pool.filter((c) => isNew(c.id) && c.bonus);
    Object.keys(byL).forEach((lid) => (byL[lid] = byL[lid].filter((c) => !c.bonus)));
    Object.keys(byDay).sort().reverse().forEach((d) => { const groups = byDay[d]; let more = true; while (more) { more = false; groups.forEach((arr) => { if (arr.length) { fresh.push(arr.shift()); more = true; } }); } });
    fresh = fresh.slice(0, Math.max(0, room - focus.length)); // la préparation d'un contrôle prend la place des nouvelles cartes du jour
    let list = due.slice(0, max).concat(fresh.slice(0, Math.max(0, max - Math.min(due.length, max))));
    return shuffleOrder(focus).concat(shuffleOrder(list));
  }
  const shuffleOrder = (list) => list.map((c, i) => [c, i + Math.random() * 6]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  const GEN_LABEL = { tab: "conjugaison", enNum: "nombres en anglais", enDays: "jours et mois en anglais", enColor: "couleurs en anglais", enDate: "dates en anglais", esNum: "nombres en espagnol", esDays: "jours et mois en espagnol", esColor: "couleurs en espagnol", esDate: "dates en espagnol", words: "nombres en lettres", placeInt: "chiffres des grands nombres", nbOf: "nombre de dizaines, centaines…", placeDec: "chiffres des décimaux", decFrac: "fractions décimales", rayon: "rayon et diamètre", cmpDec: "comparer des décimaux", convLen: "conversions de longueurs", double: "doubles et moitiés", durees: "durées", encadre: "encadrements", fracQty: "fraction d'une quantité", numline: "droite graduée", round: "arrondis", tables: "tables de multiplication", convVol: "conversions de volumes", grossissement: "grossissement du microscope" };
  // ---------- Messages et défis de papa (champ « messages » des packs) ----------
  // { id, from, text, date, until?, reward?: { text, emoji, surprise } | "texte",
  //   et un type de défi : boss: idChapitre | revisions: n | hard: n (cartes difficiles réussies)
  //   | streak: n (jours de flamme) | epreuve: { n, pass, cards: [...] | "hard" } }
  function messages() {
    const out = []; repoPacks().forEach((p) => (p.messages || []).forEach((m) => {
      if (!m || !m.id || !m.text) return;
      const r = typeof m.reward === "string" ? { text: m.reward } : m.reward || null;
      out.push(Object.assign({ from: "Papa", date: p.created || today() }, m, { reward: r }));
    }));
    return out;
  }
  const sumSince = (obj, from, to) => Object.entries(obj || {}).filter(([d]) => d >= from && (!to || d <= to)).reduce((a, [, v]) => a + (typeof v === "number" ? v : v.n || 0), 0);
  function defiState(m) {
    const t = today(), rec = S.msgs[m.id] || {};
    let done = !!rec.won, p = 0, prog = null, type = null;
    if (m.boss) { type = "boss"; const b = S.bosses[m.boss], ch = CHI[m.boss]; const won = !!(b && b.won && (!b.date || b.date >= m.date)); done = done || won;
      if (ch) { const k = countsOf(cardList(ch)); p = won ? 1 : Math.min(0.9, k.total ? k.seen / k.total : 0); } }
    else if (m.revisions) { type = "revisions"; const n = sumSince(S.days, m.date, m.until); prog = [Math.min(n, m.revisions), m.revisions]; }
    else if (m.hard) { type = "hard"; const n = sumSince(S.hw, m.date, m.until); prog = [Math.min(n, m.hard), m.hard]; }
    else if (m.streak) { type = "streak"; const n = Math.max(rec.bestStreak || 0, streakAlive()); prog = [Math.min(n, m.streak), m.streak]; }
    else if (m.epreuve) { type = "epreuve"; const e = m.epreuve, pass = e.pass || Math.ceil((e.n || 10) * 0.8); prog = [Math.min(rec.best || 0, pass), pass]; }
    if (prog) { p = prog[0] / prog[1]; done = done || prog[0] >= prog[1]; }
    if (done) p = 1;
    const isDefi = !!type, expired = !done && !!(m.until && t > m.until);
    return { isDefi, type, done, expired, p, prog, won: rec.won || null, used: rec.used || null };
  }
  // À appeler après chaque action : enregistre les défis réussis (et les bons gagnés).
  function checkDefis() {
    const newly = [];
    messages().forEach((m) => { const rec = (S.msgs[m.id] = S.msgs[m.id] || {}); if (m.streak) rec.bestStreak = Math.max(rec.bestStreak || 0, streakAlive());
      const st = defiState(m); if (st.isDefi && st.done && !rec.won && !(m.until && today() > m.until && !st.done)) { rec.won = today(); newly.push(m); } });
    return newly;
  }
  // Cartes difficiles de l'élève, pour les épreuves « hard »
  function hardCards(n) {
    const act = allActiveCards().filter((c) => S.cards[c.id]);
    const score = (c) => { const st = S.cards[c.id]; return (st.lapses || 0) * 2 + (2.5 - st.ease) * 4 + (st.ivl < 3 ? 1 : 0); };
    return act.sort((a, b) => score(b) - score(a)).slice(0, n);
  }
  // ---------- Notes (saisies dans l'Espace parent, jamais publiées) ----------
  function grades() { return (S.grades || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1)); }
  const on20 = (g) => (g.note / (g.sur || 20)) * 20;
  function gradeAverages() {
    const out = {}; grades().forEach((g) => { const o = (out[g.s] = out[g.s] || { sum: 0, w: 0, n: 0 }); const w = g.coef || 1; o.sum += on20(g) * w; o.w += w; o.n++; });
    Object.values(out).forEach((o) => (o.avg = o.w ? o.sum / o.w : null)); return out;
  }
  // Leçons « revanche » liées à une note (même matière, même date)
  function remedFor(g) {
    const ls = []; CH.forEach((c) => c.s === g.s && c.lessons.forEach((l) => { if (l.remed && l.remed.date === g.date) ls.push([c, l]); }));
    return ls.map(([c, l]) => { const cs = lessonCards(c, l), k = countsOf(cs); return { l, total: cs.length, won: cs.filter((x) => S.cards[x.id] && S.cards[x.id].ivl >= 7).length, seen: k.seen }; });
  }
  // ---------- Suivi parent ----------
  function report() {
    const subs = (PROGRAMME.subjects || []).map((sb) => {
      const chs = CH.filter((c) => c.s === sb.id);
      let lTot = 0, lOpen = 0; const refsSeen = new Set();
      chs.forEach((c) => c.lessons.forEach((l) => { if (l.stub) return; lTot++; if (lessonOpen(l.id)) { lOpen++; (l.refs || c.refs || []).forEach((r) => refsSeen.add(r)); } }));
      const refsAll = []; sb.domains.forEach((d) => d.items.forEach((it) => refsAll.push(it.id)));
      const k = countsOf(allActiveCards((c) => c.s === sb.id));
      return { s: sb, lTot, lOpen, refs: refsAll.filter((r) => refsSeen.has(r)).length, refsAll: refsAll.length, k };
    });
    const byLesson = {};
    allActiveCards().forEach((c) => { const st = S.cards[c.id]; if (!st) return; const L = (byLesson[c.le] = byLesson[c.le] || { le: c.le, ch: c.ch, seen: 0, tries: 0, lapses: 0, cards: [] }); L.seen++; L.tries += st.tries || (st.reps + st.lapses) || 1; L.lapses += st.lapses || 0; if (st.lapses) L.cards.push({ q: c.q || (c.g ? "Exercices : " + (GEN_LABEL[c.g] || c.g) + (c.tab ? " (" + c.tab.tense + ")" : "") : c.id), lapses: st.lapses, ok: st.ivl >= 3 }); });
    const hard = Object.values(byLesson).filter((L) => L.seen >= 3 && L.lapses > 0).map((L) => Object.assign(L, { rate: L.lapses / Math.max(1, L.tries), cards: L.cards.sort((a, b) => b.lapses - a.lapses).slice(0, 3) })).sort((a, b) => b.rate - a.rate || b.lapses - a.lapses).slice(0, 5);
    const all = countsOf(allActiveCards());
    return { subs, hard, fresh: all.fresh, total: all.total, perDay: S.settings.newPerDay, days: Math.ceil(all.fresh / Math.max(1, S.settings.newPerDay)) };
  }
  // Paliers de mémoire : vue (étudiée), solide (intervalle ≥ 7 j), maîtrisée (≥ 21 j)
  function stagesOf(pool) { const o = { seen: 0, solid: 0, mastered: 0 }; pool.forEach((c) => { const st = S.cards[c.id]; if (!st) return; o.seen++; if (st.ivl >= 7) o.solid++; if (st.ivl >= 21) o.mastered++; }); return o; }
  function countsOf(pool) { return { total: pool.length, due: pool.filter((c) => isDue(c.id)).length, fresh: pool.filter((c) => isNew(c.id)).length, mastered: pool.filter((c) => mastered(c.id)).length, seen: pool.filter((c) => !isNew(c.id)).length }; }
  const counts = (filter) => countsOf(allActiveCards(filter));

  // ---------- XP, niveaux, rangs, flamme ----------
  const RANKS = [[1, "見習い", "Apprentie"], [3, "初心", "Novice"], [6, "初段", "Shodan"], [10, "二段", "Nidan"], [15, "三段", "Sandan"], [20, "守護", "Gardienne"], [27, "達人", "Virtuose"], [35, "師範", "Maîtresse"], [45, "伝説", "Légende"]];
  // Courbe calibrée sur une année scolaire : Légende (niv. 45) ≈ 96 000 XP, soit ~35 cartes par jour d'école
  // (≈ 68 000 XP) + 2 séances de 30 min par semaine avec un parent (≈ 29 000 XP)
  const need = (l) => 100 + 97 * (l - 1);
  const needV1 = (l) => 100 + 25 * (l - 1), needV2 = (l) => 100 + 70 * (l - 1);
  function levelInfo(xp = S.xp) { let l = 1, rest = xp; while (rest >= need(l)) { rest -= need(l); l++; } const r = RANKS.filter((x) => x[0] <= l).pop(); const nx = RANKS.find((x) => x[0] > l); return { level: l, into: rest, need: need(l), rank: r, next: nx }; }
  function addXP(n) {
    const before = levelInfo().level; S.xp += Math.round(n);
    const d = today(); S.days[d] = S.days[d] || { n: 0, xp: 0 }; S.days[d].xp += Math.round(n);
    const after = levelInfo().level; return after > before ? after : 0;
  }
  function countReview() {
    const d = today(); S.days[d] = S.days[d] || { n: 0, xp: 0 }; S.days[d].n++; S.stats.reviews++;
    if (S.days[d].n === S.settings.goal) {
      const y = today(new Date(Date.now() - DAY));
      S.streak.cur = S.streak.last === y ? S.streak.cur + 1 : S.streak.last === d ? S.streak.cur : 1;
      S.streak.last = d; S.streak.best = Math.max(S.streak.best, S.streak.cur);
      return true;
    }
    return false;
  }
  function streakAlive() { const d = today(), y = today(new Date(Date.now() - DAY)); if (S.streak.last !== d && S.streak.last !== y) S.streak.cur = 0; return S.streak.cur; }

  // ---------- Emblèmes ----------
  const BADGES = [
    ["premier-pas", "初", "Premier pas", "Réussir sa toute première révision", () => S.stats.reviews >= 1],
    ["flamme-3", "炎", "Petite flamme", "3 jours d'objectif atteint d'affilée", () => S.streak.best >= 3],
    ["flamme-7", "焔", "Flamme vive", "7 jours d'affilée", () => S.streak.best >= 7],
    ["flamme-30", "鳳", "Phénix", "30 jours d'affilée", () => S.streak.best >= 30],
    ["cartes-100", "百", "Cent frappes", "100 révisions", () => S.stats.reviews >= 100],
    ["cartes-500", "千", "Mille éclairs", "500 révisions", () => S.stats.reviews >= 500],
    ["maitrise-10", "極", "Premiers secrets", "10 cartes maîtrisées (intervalle ≥ 21 jours)", () => Object.keys(S.cards).filter(mastered).length >= 10],
    ["maitrise-100", "奥", "Gardienne des secrets", "100 cartes maîtrisées", () => Object.keys(S.cards).filter(mastered).length >= 100],
    ["boss-1", "勝", "Première victoire", "Vaincre un premier yōkai", () => Object.values(S.bosses).some((b) => b.won)],
    ["boss-5", "覇", "Chasseuse de yōkai", "Vaincre 5 yōkai", () => Object.values(S.bosses).filter((b) => b.won).length >= 5],
    ["parfait", "完", "Sans une égratignure", "Vaincre un yōkai sans perdre de cœur", () => Object.values(S.bosses).some((b) => b.perfect)],
    ["combo-10", "連", "Combo ×10", "10 bonnes réponses de suite", () => S.stats.bestCombo >= 10],
    ["combo-25", "嵐", "Tempête", "25 bonnes réponses de suite", () => S.stats.bestCombo >= 25],
    ["sept-clans", "七", "Les sept clans", "Ouvrir au moins une leçon dans chaque clan", () => PROGRAMME.subjects.every((s) => activeChapters().some((c) => c.s === s.id))],
    ["cartographe", "図", "Cartographe", "10 lieux trouvés sur la carte", () => S.stats.mapWins >= 10],
    ["chronomancienne", "暦", "Chronomancienne", "Remettre une frise dans l'ordre sans erreur", () => S.stats.orderWins >= 1],
    ["tisseuse", "織", "Tisseuse de liens", "Réussir 10 exercices à glisser sans faute", () => S.stats.dragWins >= 10],
    ["photographe", "写", "Œil de l'espionne", "Ajouter une photo de cours", () => !!S.stats.photos],
    ["parchemin", "巻", "Parchemin secret", "Importer un pack de leçon", () => (S.packs || []).length >= 1],
    ["niveau-10", "昇", "Ascension", "Atteindre le niveau 10", () => levelInfo().level >= 10],
    ["famille-1", "家", "Révision en famille", "Valider une première séance de révision avec un parent", () => (S.fam || []).length >= 1],
    ["famille-10", "絆", "Lien du savoir", "10 séances de révision avec un parent", () => (S.fam || []).length >= 10],
    ["famille-30", "誓", "Serment d'étude", "30 séances de révision avec un parent", () => (S.fam || []).length >= 30]
  ];
  // ---------- Séances de révision avec un parent (cahier en support, validées avec le code parent) ----------
  // 10 XP par minute ; +100 XP de régularité si une autre séance a eu lieu dans les 7 jours précédents.
  const FAM_XP_MIN = 10, FAM_REGULAR = 100;
  function famPreview(min) { const t = today(), wk = (S.fam || []).some((x) => x.d < t && x.d >= addDays(t, -7)); return { base: min * FAM_XP_MIN, reg: wk ? FAM_REGULAR : 0 }; }
  function addFam(f) { const p = famPreview(f.min); const rec = Object.assign({ d: today(), xp: p.base + p.reg, reg: !!p.reg }, f); (S.fam = S.fam || []).push(rec); const up = addXP(rec.xp); save(); return { rec, up }; }
  const famWeek = () => { const t = today(), mon = addDays(t, -((new Date(t + "T12:00:00").getDay() + 6) % 7)); return (S.fam || []).filter((x) => x.d >= mon); };
  function checkBadges() { const won = []; BADGES.forEach(([id, , , , test]) => { if (!S.badges[id] && test()) { S.badges[id] = today(); won.push(id); } }); return won; }

  // ---------- Packs de leçon ----------
  function validatePack(p) {
    const errs = [], warns = [], refsOf = [];
    if (!p || p.format !== "hikari-pack") errs.push("Ce fichier n'est pas un pack Hikari (champ format manquant).");
    (p && p.chapters || []).forEach((c) => { if (!c.id || !c.s || !c.title) errs.push("Chapitre incomplet (id, s, title obligatoires)."); if (c.s && !SUBI[c.s]) errs.push(`Matière inconnue : ${c.s}`); refsOf.push(...(c.refs || [])); (c.lessons || []).forEach((l) => { if (!l.id) errs.push("Leçon sans identifiant."); refsOf.push(...(l.refs || [])); }); });
    (p && p.extend || []).forEach((x) => { if (!CHI[x.chapter]) errs.push(`Chapitre à compléter introuvable : ${x.chapter}`); refsOf.push(...(x.refs || [])); (x.lessons || []).forEach((l) => { if (!l.id) errs.push("Leçon sans identifiant."); refsOf.push(...(l.refs || [])); }); });
    refsOf.forEach((r) => { if (!REFI[r]) warns.push(`Référence de programme inconnue : ${r}`); });
    return { errs, warns };
  }
  function importPack(p) {
    const v = validatePack(p); if (v.errs.length) return v;
    S.packs = (S.packs || []).filter((x) => x.id !== p.id); S.packs.push(p);
    buildContent();
    if (p.activate !== false) {
      (p.chapters || []).forEach((c) => (c.lessons || [{ id: c.id + "-l1" }]).forEach((l) => { if (!lessonOpen(l.id) && LEI[l.id] && !LEI[l.id].stub) openLesson(l.id); }));
      (p.extend || []).forEach((x) => { (x.lessons || []).forEach((l) => { if (!lessonOpen(l.id) && LEI[l.id] && !LEI[l.id].stub) openLesson(l.id); }); if ((x.cards || x.fiche) && !x.lesson && LEI[x.chapter + "-ajouts"]) openLesson(x.chapter + "-ajouts"); });
    }
    save(); return v;
  }

  // ---------- Photos (IndexedDB), rattachées à une leçon ----------
  let dbp;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => { const r = indexedDB.open("hikari-photos", 1); r.onupgradeneeded = () => r.result.createObjectStore("p", { keyPath: "id" }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    return dbp;
  }
  async function shrink(file) {
    const img = await createImageBitmap(file).catch(() => null); if (!img) return file;
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const cv = document.createElement("canvas"); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    return new Promise((r) => cv.toBlob((b) => r(b || file), "image/jpeg", 0.82));
  }
  async function addPhoto(ownerId, file) {
    const blob = await shrink(file); const d = await db();
    const rec = { id: ownerId + ":" + Date.now() + ":" + Math.random().toString(36).slice(2, 6), ch: ownerId, blob, date: new Date().toISOString() };
    await new Promise((res, rej) => { const t = d.transaction("p", "readwrite"); t.objectStore("p").put(rec); t.oncomplete = res; t.onerror = () => rej(t.error); });
    S.stats.photos = (S.stats.photos || 0) + 1; save(); return rec;
  }
  async function photos(ownerId) {
    try { const d = await db(); return await new Promise((res) => { const out = []; const t = d.transaction("p"); t.objectStore("p").openCursor().onsuccess = (e) => { const c = e.target.result; if (c) { if (!ownerId || c.value.ch === ownerId) out.push(c.value); c.continue(); } else res(out); }; }); } catch (e) { return []; }
  }
  async function delPhoto(id) { const d = await db(); await new Promise((res) => { const t = d.transaction("p", "readwrite"); t.objectStore("p").delete(id); t.oncomplete = res; }); }

  function exportAll() { return JSON.stringify({ format: "hikari-sauvegarde", date: new Date().toISOString(), state: S }, null, 1); }
  function importAll(obj) { if (!obj || obj.format !== "hikari-sauvegarde" || !obj.state) throw new Error("Ce fichier n'est pas une sauvegarde Hikari."); S = Object.assign(DEFAULT(), obj.state); S.lessons = S.lessons || {}; save(); buildContent(); migrate(); }
  function reset() { S = DEFAULT(); save(); buildContent(); }

  window.STORE = {
    load, save, isLibre, get S() { return S; }, today, buildContent, migrate, autoOpen, classWeek, weekStart, unlockedFiches, HOLIDAYS, ZONE_SENSITIVE_FROM, get CH() { return CH; }, get CHI() { return CHI; }, get LEI() { return LEI; }, get REFI() { return REFI; }, get SUBI() { return SUBI; },
    cardList, lessonCards, KINDS, kindOf, relatedLessons, itemCards, itemProgress, READY_DAYS, chapterState, lessonOpen, openLesson, closeLesson, openLessons, activeChapters, allActiveCards, grade, isDue, isNew, mastered, buildSession, counts, countsOf,
    levelInfo, famPreview, addFam, famWeek, FAM_XP_MIN, FAM_REGULAR, stagesOf, report, grades, gradeAverages, remedFor, on20, messages, defiState, checkDefis, hardCards, addXP, countReview, streakAlive, RANKS, BADGES, checkBadges, validatePack, importPack, addPhoto, photos, delPhoto, exportAll, importAll, reset
  };
})();
