/* Cœur : état, répétition espacée (SRS), gamification, packs de leçon, photos.
   Toutes les données restent sur le téléphone (localStorage + IndexedDB pour les photos). */
(function () {
  const KEY = "hikari.v1";
  const DAY = 86400000;
  const today = (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };

  const DEFAULT = () => ({
    v: 1, profile: null, xp: 0, days: {}, streak: { cur: 0, best: 0, last: null },
    chapters: {}, cards: {}, bosses: {}, badges: {}, packs: [], stats: { reviews: 0, mapWins: 0, orderWins: 0, bestCombo: 0 },
    settings: { goal: 20, newPerDay: 15 }
  });

  let S;
  function load() {
    try { S = Object.assign(DEFAULT(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = DEFAULT(); }
    S.settings = Object.assign(DEFAULT().settings, S.settings || {}); S.stats = Object.assign(DEFAULT().stats, S.stats || {});
    return S;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { console.warn("Sauvegarde impossible", e); } }

  // ---------- Contenu fusionné (base + packs) ----------
  let CH = [], CHI = {}, REFI = {}, SUBI = {};
  function buildContent() {
    SUBI = {}; REFI = {};
    PROGRAMME.subjects.forEach((s) => { SUBI[s.id] = s; s.domains.forEach((d) => d.items.forEach((it) => { REFI[it.id] = Object.assign({ s: s.id, domain: d.name }, it); })); });
    const map = new Map();
    CONTENT.chapters.forEach((c) => map.set(c.id, JSON.parse(JSON.stringify(c))));
    (S.packs || []).forEach((p) => {
      (p.chapters || []).forEach((c) => {
        const base = map.get(c.id);
        const merged = Object.assign({}, base || {}, c, { stub: false, fromPack: p.title || p.id });
        map.set(c.id, merged);
      });
      (p.extend || []).forEach((x) => {
        const c = map.get(x.chapter); if (!c) return;
        c.extra = c.extra || [];
        c.extra.push({ pack: p.title || p.id, date: p.created, note: x.note, fiche: x.fiche || [] });
        if (x.cards) c.cards = (c.cards || []).concat(x.cards.map((k) => Object.assign({ fromPack: true }, k)));
        if (x.events) c.events = (c.events || []).concat(x.events);
        if (x.places) c.places = (c.places || []).concat(x.places);
        if (x.refs) c.refs = Array.from(new Set((c.refs || []).concat(x.refs)));
        if (c.stub && (x.cards || x.fiche)) c.stub = false;
      });
    });
    CH = Array.from(map.values()); CHI = {}; CH.forEach((c) => (CHI[c.id] = c));
  }

  // Identifiants de cartes stables (dépendent du contenu, pas de l'ordre)
  function cardList(ch) {
    const out = [];
    (ch.cards || []).forEach((c) => {
      if (c.k === "g") { for (let i = 0; i < (c.n || 3); i++) out.push(Object.assign({ id: `${ch.id}:g:${c.g}:${i}`, ch: ch.id }, c)); }
      else out.push(Object.assign({ id: `${ch.id}:${ART.hash(c.q + "|" + (c.k === "q" ? c.c[c.a] : String(c.a)))}`, ch: ch.id }, c));
    });
    (ch.places || []).forEach((p) => out.push({ id: `${ch.id}:m:${p.id}`, ch: ch.id, k: "m", place: p, q: `Touche la carte là où se trouve **${p.n}**.` }));
    return out;
  }
  const chapterState = (id) => (S.chapters[id] && S.chapters[id].state) || "locked";
  const activeChapters = () => CH.filter((c) => chapterState(c.id) !== "locked");
  function allActiveCards(filter) {
    let cs = []; activeChapters().forEach((c) => { if (!filter || filter(c)) cs = cs.concat(cardList(c)); }); return cs;
  }

  // ---------- SRS (variante SM-2, 4 boutons) ----------
  // g : 0 = raté, 1 = difficile, 2 = bien, 3 = facile
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
  function newSeenToday() { return Object.values(S.cards).filter((c) => c.first === today()).length; }

  function buildSession({ subject, chapter, max = 30 } = {}) {
    const pool = allActiveCards((c) => (!subject || c.s === subject) && (!chapter || c.id === chapter));
    const due = pool.filter((c) => isDue(c.id)).sort((a, b) => S.cards[a.id].due - S.cards[b.id].due);
    const room = chapter ? 999 : Math.max(0, S.settings.newPerDay - newSeenToday());
    let fresh = pool.filter((c) => isNew(c.id));
    // nouvelles cartes : en ordre de leçon, en alternant les chapitres
    const byCh = {}; fresh.forEach((c) => (byCh[c.ch] = byCh[c.ch] || []).push(c));
    fresh = []; let more = true; while (more) { more = false; Object.values(byCh).forEach((arr) => { if (arr.length) { fresh.push(arr.shift()); more = true; } }); }
    fresh = fresh.slice(0, room);
    let list = due.slice(0, max).concat(fresh.slice(0, Math.max(0, max - Math.min(due.length, max))));
    // mélange léger pour alterner les matières
    list = list.map((c, i) => [c, i + Math.random() * 6]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
    return list;
  }
  function counts(filter) {
    const pool = allActiveCards(filter);
    return { total: pool.length, due: pool.filter((c) => isDue(c.id)).length, fresh: pool.filter((c) => isNew(c.id)).length, mastered: pool.filter((c) => mastered(c.id)).length, seen: pool.filter((c) => !isNew(c.id)).length };
  }

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
    let goalHit = false;
    if (S.days[d].n === S.settings.goal) {
      goalHit = true;
      const y = today(new Date(Date.now() - DAY));
      S.streak.cur = S.streak.last === y ? S.streak.cur + 1 : S.streak.last === d ? S.streak.cur : 1;
      S.streak.last = d; S.streak.best = Math.max(S.streak.best, S.streak.cur);
    }
    return goalHit;
  }
  function streakAlive() { const d = today(), y = today(new Date(Date.now() - DAY)); if (S.streak.last !== d && S.streak.last !== y) S.streak.cur = 0; return S.streak.cur; }

  // ---------- Sceaux (succès) ----------
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
    ["sept-clans", "七", "Les sept clans", "Ouvrir au moins un chapitre dans chaque clan", () => PROGRAMME.subjects.every((s) => activeChapters().some((c) => c.s === s.id))],
    ["cartographe", "図", "Cartographe", "10 lieux trouvés sur la carte", () => S.stats.mapWins >= 10],
    ["chronomancienne", "暦", "Chronomancienne", "Remettre une frise dans l'ordre sans erreur", () => S.stats.orderWins >= 1],
    ["photographe", "写", "Œil de l'espionne", "Ajouter une photo de cours", () => !!S.stats.photos],
    ["parchemin", "巻", "Parchemin secret", "Importer un pack de leçon", () => (S.packs || []).length >= 1],
    ["niveau-10", "昇", "Ascension", "Atteindre le niveau 10", () => levelInfo().level >= 10]
  ];
  function checkBadges() { const won = []; BADGES.forEach(([id, , name, , test]) => { if (!S.badges[id] && test()) { S.badges[id] = today(); won.push(id); } }); return won; }

  // ---------- Packs de leçon ----------
  function validatePack(p) {
    const errs = [], warns = [];
    if (!p || p.format !== "hikari-pack") errs.push("Ce fichier n'est pas un pack Hikari (champ format manquant).");
    const refsOf = [];
    (p.chapters || []).forEach((c) => { if (!c.id || !c.s || !c.title) errs.push("Chapitre incomplet (id, s, title obligatoires)."); if (c.s && !SUBI[c.s]) errs.push(`Matière inconnue : ${c.s}`); refsOf.push(...(c.refs || [])); });
    (p.extend || []).forEach((x) => { if (!CHI[x.chapter]) errs.push(`Chapitre à compléter introuvable : ${x.chapter}`); refsOf.push(...(x.refs || [])); });
    refsOf.forEach((r) => { if (!REFI[r]) warns.push(`Référence de programme inconnue : ${r}`); });
    return { errs, warns };
  }
  function importPack(p) {
    const v = validatePack(p); if (v.errs.length) return v;
    S.packs = (S.packs || []).filter((x) => x.id !== p.id); S.packs.push(p);
    (p.chapters || []).forEach((c) => { if (chapterState(c.id) === "locked" && p.activate !== false) S.chapters[c.id] = { state: "active", since: today() }; });
    buildContent(); save(); return v;
  }

  // ---------- Photos (IndexedDB) ----------
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
  async function addPhoto(chapterId, file) {
    const blob = await shrink(file); const d = await db();
    const rec = { id: chapterId + ":" + Date.now() + ":" + Math.random().toString(36).slice(2, 6), ch: chapterId, blob, date: new Date().toISOString() };
    await new Promise((res, rej) => { const t = d.transaction("p", "readwrite"); t.objectStore("p").put(rec); t.oncomplete = res; t.onerror = () => rej(t.error); });
    S.stats.photos = (S.stats.photos || 0) + 1; save(); return rec;
  }
  async function photos(chapterId) {
    try { const d = await db(); return await new Promise((res) => { const out = []; const t = d.transaction("p"); t.objectStore("p").openCursor().onsuccess = (e) => { const c = e.target.result; if (c) { if (!chapterId || c.value.ch === chapterId) out.push(c.value); c.continue(); } else res(out); }; }); } catch (e) { return []; }
  }
  async function delPhoto(id) { const d = await db(); await new Promise((res) => { const t = d.transaction("p", "readwrite"); t.objectStore("p").delete(id); t.oncomplete = res; }); }

  function exportAll() { return JSON.stringify({ format: "hikari-sauvegarde", date: new Date().toISOString(), state: S }, null, 1); }
  function importAll(obj) { if (!obj || obj.format !== "hikari-sauvegarde" || !obj.state) throw new Error("Ce fichier n'est pas une sauvegarde Hikari."); S = Object.assign(DEFAULT(), obj.state); save(); buildContent(); }
  function reset() { S = DEFAULT(); save(); buildContent(); }

  window.STORE = {
    load, save, get S() { return S; }, today, buildContent, get CH() { return CH; }, get CHI() { return CHI; }, get REFI() { return REFI; }, get SUBI() { return SUBI; },
    cardList, chapterState, activeChapters, allActiveCards, grade, isDue, isNew, mastered, buildSession, counts,
    levelInfo, addXP, countReview, streakAlive, RANKS, BADGES, checkBadges, validatePack, importPack, addPhoto, photos, delPhoto, exportAll, importAll, reset
  };
})();
