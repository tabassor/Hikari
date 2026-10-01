/* Hikari — Foyer : missions de la maison (argent de poche), Voie du mois (niveaux), Jardin des bienfaits.
   Univers indépendant des révisions : aucun XP, aucun effet sur les clans.
   Toutes les données restent sur le téléphone (STORE.S.foyer). */
(function () {
  // ---------- Heure : horloge du téléphone, corrigée par l'heure du serveur quand on est en ligne ----------
  let offset = 0;
  async function syncClock() {
    try {
      const t0 = Date.now(), r = await fetch("manifest.webmanifest?t=" + t0, { method: "HEAD", cache: "no-store" }), t1 = Date.now();
      const d = r.headers.get("Date"); if (!d) return;
      const server = new Date(d).getTime() + (t1 - t0) / 2, off = server - t1;
      offset = Math.abs(off) > 60000 ? off : 0; // on ne corrige que les écarts de plus d'une minute
    } catch (e) { /* hors ligne : on garde l'horloge du téléphone */ }
  }
  const now = () => new Date(Date.now() + offset);
  // Date et heure de Paris, quel que soit le réglage du téléphone
  const PARTS = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" });
  function paris(d = now()) {
    const p = {}; PARTS.formatToParts(d).forEach((x) => (p[x.type] = x.value));
    const iso = `${p.year}-${p.month}-${p.day}`, dow = (new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7; // 0 = lundi
    return { iso, dow, hm: +p.hour * 60 + +p.minute };
  }
  const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const mondayOf = (iso) => addDays(iso, -((new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7));
  const DOW = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

  // ---------- Contenu : préparé par les parents dans l'appli (Moi → Espace parent → Foyer) ----------
  // Rien de personnel dans le code public : missions et défis vivent uniquement sur le téléphone (S.foyer.cfg).
  // cfg = { hist: [{from, list}], voie: [...] (off = retiré, gardé pour les points passés), parents: [...], tokenWith }
  const FRACTIONS = [0, 0.26, 0.48, 0.7, 0.87];
  const LV = [["Graine", "種"], ["Bronze", "銅"], ["Argent", "銀"], ["Or", "金"], ["Légende", "伝"]];
  // Suggestions génériques proposées dans l'éditeur
  const SUGG_M = [["🗑️", "Sortir les poubelles"], ["♻️", "Vider le bac de tri"], ["🍽️", "Mettre la table"], ["🧽", "Débarrasser la table"], ["🥣", "Vider le lave-vaisselle"], ["🐾", "Nourrir l'animal"], ["👕", "Étendre le linge"], ["🪴", "Arroser les plantes"]];
  const SUGG_V = [["🎒", "Préparer mon sac la veille", "jour"], ["🛏️", "Ranger ma chambre", "jour"], ["👟", "Ranger mes chaussures", "jour"], ["🧺", "Mettre mon linge au sale", "jour"], ["🌙", "Éteindre la lumière à l'heure convenue", "jour"], ["📱", "Rester sous mon budget d'écran", "jour"], ["📖", "Lire 20 minutes", "jour"], ["📚", "Ranger ma bibliothèque", "semaine"], ["🪥", "Ranger ma salle de bain", "semaine"], ["🧹", "Aider à ranger un coin de la maison", "semaine"]];
  const FLOWERS = ["sakura", "tsubaki", "ajisai", "ayame", "kiku", "asagao", "hasu", "tanpopo"];
  const FLOWER_EMOJI = { sakura: "🌸", tsubaki: "🌺", ajisai: "💠", ayame: "🪻", kiku: "🌼", asagao: "🌷", hasu: "🪷", tanpopo: "🌻" };

  function F() { const S = STORE.S; S.foyer = S.foyer || {}; const f = S.foyer; f.log = f.log || {}; f.tokens = f.tokens || {}; f.voie = f.voie || {}; f.records = f.records || {}; f.bienfaits = f.bienfaits || []; return f; }
  const cfg = () => F().cfg || null;
  const ready = () => !!cfg();
  const hist = () => (cfg() && cfg().hist) || [];
  const listAt = (iso) => { let L = []; hist().forEach((h) => { if (h.from <= iso) L = h.list; }); return L; };
  const missions = () => listAt(paris().iso);
  const voieAll = () => (cfg() && cfg().voie) || [];
  const voieList = () => voieAll().filter((v) => !v.off);
  const parents = () => (cfg() && cfg().parents && cfg().parents.length ? cfg().parents : ["Papa", "Maman"]);
  const tokenWith = () => (cfg() && cfg().tokenWith) || parents()[0];
  const due = (iso) => { const dow = (new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7; return listAt(iso).filter((m) => m.days.includes(dow)); };
  const atMin = (m) => { const [h, mm] = (m.at || "19:00").split(":"); return +h * 60 + +mm; };
  const doneOf = (iso, id) => (F().log[iso] || {})[id];
  // Points possibles sur un mois et niveaux proportionnels (Bronze ≈ 26 %, Argent 48 %, Or 70 %, Légende 87 %)
  const maxMonth = (list = voieList()) => Math.round(list.reduce((a, v) => a + (v.freq === "semaine" ? v.p * 4.3 : v.p * 30.4), 0));
  function levels(list) { const mx = maxMonth(list) || 230; return LV.map((l, i) => [i ? Math.max(i * 5, Math.round((mx * FRACTIONS[i]) / 5) * 5) : 0, l[0], l[1]]); }
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  // Enregistre la configuration à partir d'une date (aujourd'hui par défaut) : les jours d'avant gardent leurs anciennes missions
  function saveCfg(c, from) {
    const f = F(), old = f.cfg || {}, start = from || paris().iso;
    const ms = (c.missions || []).filter((m) => m.n && m.days && m.days.length).map((m) => ({ id: m.id || uid("m"), n: String(m.n).slice(0, 80), ic: m.ic || "⭐", days: m.days.slice().sort(), at: /^\d\d:\d\d$/.test(m.at || "") ? m.at : "19:00" }));
    const h = (old.hist || []).filter((x) => x.from < start); h.push({ from: start, list: ms });
    const vs = (c.voie || []).filter((v) => v.n).map((v) => ({ id: v.id || uid("v"), n: String(v.n).slice(0, 80), ic: v.ic || "⭐", freq: v.freq === "semaine" ? "semaine" : "jour", p: v.freq === "semaine" ? 3 : 1 }));
    (old.voie || []).forEach((v) => { if (!vs.some((x) => x.id === v.id)) vs.push(Object.assign({}, v, { off: true })); });
    const ps = (c.parents || parents()).map((x) => String(x).trim()).filter(Boolean).slice(0, 4);
    f.cfg = { hist: h, voie: vs, parents: ps.length ? ps : ["Papa", "Maman"], tokenWith: ps.includes(c.tokenWith) ? c.tokenWith : ps[0] || "Papa" };
    STORE.save();
  }
  // Configuration actuelle sous forme éditable / transportable par lien
  const exportCfg = () => ({ missions: missions().map((m) => Object.assign({}, m)), voie: voieList().map((v) => Object.assign({}, v)), parents: parents(), tokenWith: tokenWith() });

  // Coche une mission (aujourd'hui seulement ; les jours passés se corrigent avec le code parent)
  function tick(id, byParent, iso) {
    const t = paris(), day = iso || t.iso, m = due(day).find((x) => x.id === id) || missions().find((x) => x.id === id); if (!m) return null;
    const late = day < t.iso || (day === t.iso && t.hm >= atMin(m));
    const rec = { t: byParent ? "parent" : late ? "silver" : "gold", at: now().toISOString() };
    (F().log[day] = F().log[day] || {})[id] = rec; STORE.save(); return rec;
  }
  function untick(id, iso) { const d = F().log[iso || paris().iso]; if (d) { delete d[id]; STORE.save(); } }

  // Bilan d'une semaine (lundi → dimanche)
  function week(mon) {
    const days = []; let total = 0, done = 0, gold = 0;
    for (let i = 0; i < 7; i++) { const iso = addDays(mon, i); const ms = due(iso).map((m) => ({ m, r: doneOf(iso, m.id) })); ms.forEach((x) => { total++; if (x.r) { done++; if (x.r.t === "gold") gold++; } }); days.push({ iso, ms }); }
    return { mon, days, total, done, gold, complete: total > 0 && done === total, allGold: total > 0 && gold === total };
  }
  // Jetons : une semaine complète = un jeton (calculé au fil de l'eau, jamais retiré)
  function checkTokens() {
    const f = F(), t = paris(), won = [];
    for (let k = 0; k < 6; k++) { const mon = addDays(mondayOf(t.iso), -7 * k), w = week(mon); if (w.complete && !f.tokens[mon]) { f.tokens[mon] = { won: t.iso, gold: w.allGold }; won.push(mon); } }
    if (won.length) STORE.save(); return won;
  }

  // Voie du mois
  const monthOf = (iso) => iso.slice(0, 7);
  function voiePoints(month) {
    let pts = 0; Object.entries(F().voie).forEach(([d, set]) => { if (d.slice(0, 7) !== month) return; Object.keys(set).forEach((id) => { const v = voieAll().find((x) => x.id === id); if (v) pts += v.p; }); });
    return pts;
  }
  const levelOf = (pts) => { const LS = levels(); let L = LS[0], next = null; LS.forEach((l, i) => { if (pts >= l[0]) { L = l; next = LS[i + 1] || null; } }); return { L, next }; };
  function voieDoneThisWeek(id, iso) { const mon = mondayOf(iso); for (let i = 0; i < 7; i++) { const d = addDays(mon, i); if (d !== iso && F().voie[d] && F().voie[d][id]) return d; } return null; }
  // Palmarès : un instantané par mois terminé (points et niveau atteint, figés avec les défis de l'époque)
  function palmares() {
    const f = F(), cur = monthOf(paris().iso); f.palm = f.palm || {};
    const months = new Set(Object.keys(f.voie).filter((d) => Object.keys(f.voie[d] || {}).length).map((d) => d.slice(0, 7)));
    months.forEach((m) => { if (m < cur && !f.palm[m]) { const pts = voiePoints(m), lv = levelOf(pts).L; f.palm[m] = { pts, lv: lv[1], k: lv[2] }; STORE.save(); } });
    const rows = Object.keys(f.palm).sort().reverse().map((m) => Object.assign({ m }, f.palm[m]));
    const best = rows.reduce((b, r) => (!b || r.pts > b.pts ? r : b), null);
    return { rows, best };
  }
  function bestMonth() { const f = F(), byM = {}; Object.keys(f.voie).forEach((d) => (byM[d.slice(0, 7)] = 1)); let best = null; Object.keys(byM).forEach((m) => { const p = voiePoints(m); if (!best || p > best.p) best = { m, p }; }); return best; }

  // Bienfaits
  function addBienfait(txt, by) {
    const f = F(), t = paris(), id = "b" + Date.now() + Math.random().toString(36).slice(2, 6), r = ART.rng(ART.hash(id + txt));
    // Place libre dans la prairie, en évitant de trop empiler les fleurs
    const same = f.bienfaits.filter((b) => b.d.slice(0, 7) === t.iso.slice(0, 7)); let x = 50, y = 70;
    for (let k = 0; k < 24; k++) { x = 6 + r() * 88; y = 48 + r() * 46; if (!same.some((b) => Math.hypot((b.x - x) * 1.3, b.y - y) < 9)) break; }
    f.bienfaits.push({ id, d: t.iso, txt: txt.slice(0, 160), by, fl: FLOWERS[Math.floor(r() * FLOWERS.length)], x: Math.round(x), y: Math.round(y) });
    STORE.save();
  }

  // Décors qui apparaissent au fil des bienfaits du mois
  // [seuil, clé, emoji de repli, x %, y % (pied), échelle]
  const DECOS = [[5, "papillons", "🦋", 22, 32, 2], [10, "lanterne", "🏮", 80, 66, 1.5], [15, "etang", "🐟", 24, 88, 2.2], [20, "torii", "⛩️", 50, 44, 1.8], [30, "arbre", "🌳", 88, 50, 2.8]];
  window.FOYER = { DECOS, syncClock, now, paris, addDays, mondayOf, DOW, missions, voieList, due, atMin, doneOf, tick, untick, week, checkTokens, monthOf, voiePoints, levelOf, voieDoneThisWeek, bestMonth, palmares, addBienfait, levels, maxMonth, FLOWERS, FLOWER_EMOJI, F, cfg, ready, saveCfg, exportCfg, voieAll, parents, tokenWith, SUGG_M, SUGG_V };
})();
