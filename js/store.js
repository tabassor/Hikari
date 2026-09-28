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
    settings: { goal: 20, newPerDay: 15, sound: true, haptics: true, zone: "C" }
  });

  let S;
  function load() {
    try { S = Object.assign(DEFAULT(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = DEFAULT(); }
    S.settings = Object.assign(DEFAULT().settings, S.settings || {}); S.stats = Object.assign(DEFAULT().stats, S.stats || {}); if (!S.settings.zone) S.settings.zone = "C"; // famille en zone C
    S.lessons = S.lessons || {};
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
  function buildContent() {
    SUBI = {}; REFI = {};
    PROGRAMME.subjects.forEach((s) => { SUBI[s.id] = s; s.domains.forEach((d) => d.items.forEach((it) => { REFI[it.id] = Object.assign({ s: s.id, domain: d.name }, it); })); });
    const map = new Map();
    CONTENT.chapters.forEach((c) => map.set(c.id, normalize(clone(c))));
    // Packs livrés avec l'application (dépôt GitHub : data/packs/*.js), puis packs importés sur le téléphone
    (window.REPO_PACKS || []).concat(S.packs || []).forEach((p) => {
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
    (window.REPO_PACKS || []).forEach((p) => (p.open || []).forEach((lid) => { if (!S.autoOpened[lid] && LEI[lid]) { S.autoOpened[lid] = today(); if (!lessonOpen(lid)) openLesson(lid); S.newFromRepo = (S.newFromRepo || []).concat([lid]); } }));
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
  function lessonCards(ch, l) {
    const out = [], un = unlockedFiches(ch);
    (l.cards || []).forEach((c0) => {
      let c = c0;
      if (un) {
        if (c.fiche && !un.has(c.fiche)) return;
        if (c.tab && c.tab.fiches) { const ok = Object.keys(c.tab.verbs).filter((v) => un.has(c.tab.fiches[v])); if (!ok.length) return; c = Object.assign({}, c, { _verbs: ok }); }
      }
      if (c.k === "g") { const tag = c.tab ? ART.hash(c.tab.tense + Object.keys(c.tab.verbs).join()) + ":" : ""; for (let i = 0; i < (c.n || 3); i++) out.push(Object.assign({ id: `${ch.id}:g:${c.g}:${tag}${i}`, ch: ch.id, le: l.id }, c)); }
      else out.push(Object.assign({ id: cardId(ch, c), ch: ch.id, le: l.id }, c));
    });
    (l.places || []).forEach((p) => out.push({ id: `${ch.id}:m:${p.id}`, ch: ch.id, le: l.id, k: "m", place: p, q: `Touche la carte là où se trouve **${p.n}**.` }));
    return out;
  }
  // onlyOpen : seulement les leçons ouvertes (révisions) ; sinon toutes (aperçu)
  function cardList(ch, onlyOpen = true) { let out = []; ch.lessons.forEach((l) => { if (!onlyOpen || lessonOpen(l.id)) out = out.concat(lessonCards(ch, l)); }); return out; }
  function allActiveCards(filter) { let cs = []; activeChapters().forEach((c) => { if (!filter || filter(c)) cs = cs.concat(cardList(c)); }); return cs; }

  // ---------- SRS (variante SM-2, 4 boutons) ----------
  function grade(cardId, g) {
    const now = Date.now();
    const c = S.cards[cardId] || { ivl: 0, ease: 2.5, reps: 0, lapses: 0, first: today() };
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
    c.last = now; S.cards[cardId] = c;
    return c;
  }
  const isDue = (id) => { const c = S.cards[id]; return c && c.due <= Date.now(); };
  const isNew = (id) => !S.cards[id];
  const mastered = (id) => { const c = S.cards[id]; return !!c && c.ivl >= 21; };
  const newSeenToday = () => Object.values(S.cards).filter((c) => c.first === today()).length;

  function buildSession({ subject, chapter, lesson, max = 30 } = {}) {
    let pool = allActiveCards((c) => (!subject || c.s === subject) && (!chapter || c.id === chapter));
    if (lesson) pool = pool.filter((c) => c.le === lesson);
    const due = pool.filter((c) => isDue(c.id)).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due);
    const room = chapter || lesson ? 999 : Math.max(0, S.settings.newPerDay - newSeenToday());
    const byL = {}; pool.filter((c) => isNew(c.id)).forEach((c) => (byL[c.le] = byL[c.le] || []).push(c));
    let fresh = [], more = true; while (more) { more = false; Object.values(byL).forEach((arr) => { if (arr.length) { fresh.push(arr.shift()); more = true; } }); }
    fresh = fresh.slice(0, room);
    let list = due.slice(0, max).concat(fresh.slice(0, Math.max(0, max - Math.min(due.length, max))));
    return list.map((c, i) => [c, i + Math.random() * 6]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  }
  function countsOf(pool) { return { total: pool.length, due: pool.filter((c) => isDue(c.id)).length, fresh: pool.filter((c) => isNew(c.id)).length, mastered: pool.filter((c) => mastered(c.id)).length, seen: pool.filter((c) => !isNew(c.id)).length }; }
  const counts = (filter) => countsOf(allActiveCards(filter));

  // ---------- XP, niveaux, rangs, flamme ----------
  const RANKS = [[1, "見習い", "Apprentie"], [3, "初心", "Novice"], [6, "初段", "Shodan"], [10, "二段", "Nidan"], [15, "三段", "Sandan"], [20, "守護", "Gardienne"], [27, "達人", "Virtuose"], [35, "師範", "Maîtresse"], [45, "伝説", "Légende"]];
  const need = (l) => 100 + 25 * (l - 1);
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
    ["niveau-10", "昇", "Ascension", "Atteindre le niveau 10", () => levelInfo().level >= 10]
  ];
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
    load, save, get S() { return S; }, today, buildContent, migrate, autoOpen, classWeek, weekStart, unlockedFiches, HOLIDAYS, ZONE_SENSITIVE_FROM, get CH() { return CH; }, get CHI() { return CHI; }, get LEI() { return LEI; }, get REFI() { return REFI; }, get SUBI() { return SUBI; },
    cardList, lessonCards, chapterState, lessonOpen, openLesson, closeLesson, openLessons, activeChapters, allActiveCards, grade, isDue, isNew, mastered, buildSession, counts, countsOf,
    levelInfo, addXP, countReview, streakAlive, RANKS, BADGES, checkBadges, validatePack, importPack, addPhoto, photos, delPhoto, exportAll, importAll, reset
  };
})();
