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

  // ---------- Contenu par défaut (modifiable par le parent) ----------
  const MISSIONS = [
    { id: "bac", n: "Vider le bac des recyclables dans la poubelle dehors", days: [0, 1, 2, 3, 4, 5, 6], at: "19:00", ic: "♻️" },
    { id: "menagers", n: "Sortir le conteneur des déchets ménagers", days: [0, 3], at: "19:00", ic: "🗑️" },
    { id: "recyclables", n: "Sortir le conteneur des recyclables", days: [1], at: "19:00", ic: "📦" },
    { id: "verre", n: "Sortir le conteneur de verre", days: [2], at: "19:00", ic: "🍾" },
    { id: "vegetaux", n: "Sortir les déchets végétaux", days: [6], at: "19:00", ic: "🍂" }
  ];
  const VOIE = [
    { id: "sac", n: "Préparer mon sac la veille", p: 1, freq: "jour", ic: "🎒" },
    { id: "chambre", n: "Ranger ma chambre", p: 1, freq: "jour", ic: "🛏️" },
    { id: "chaussures", n: "Ranger mes chaussures", p: 1, freq: "jour", ic: "👟" },
    { id: "linge", n: "Mettre mon linge au sale", p: 1, freq: "jour", ic: "🧺" },
    { id: "lumiere", n: "Éteindre la lumière à l'heure convenue", p: 1, freq: "jour", ic: "🌙" },
    { id: "ecran", n: "Rester sous mon budget d'écran", p: 1, freq: "jour", ic: "📱" },
    { id: "biblio", n: "Ranger ma bibliothèque", p: 3, freq: "semaine", ic: "📚" },
    { id: "sdb", n: "Ranger ma salle de bain", p: 3, freq: "semaine", ic: "🪥" },
    { id: "spot", n: "Aider à ranger un coin de la maison", p: 3, freq: "semaine", ic: "🧹" },
    { id: "pommes", n: "Mission pommes de pin dans le jardin", p: 3, freq: "semaine", ic: "🌲" }
  ];
  const LEVELS = [[0, "Graine", "種"], [60, "Bronze", "銅"], [110, "Argent", "銀"], [160, "Or", "金"], [200, "Légende", "伝"]];
  const FLOWERS = ["sakura", "tsubaki", "ajisai", "ayame", "kiku", "asagao", "hasu", "tanpopo"];
  const FLOWER_EMOJI = { sakura: "🌸", tsubaki: "🌺", ajisai: "💠", ayame: "🪻", kiku: "🌼", asagao: "🌷", hasu: "🪷", tanpopo: "🌻" };

  function F() { const S = STORE.S; S.foyer = S.foyer || {}; const f = S.foyer; f.log = f.log || {}; f.tokens = f.tokens || {}; f.voie = f.voie || {}; f.records = f.records || {}; f.bienfaits = f.bienfaits || []; return f; }
  const missions = () => F().missions || MISSIONS;
  const voieList = () => F().voieList || VOIE;
  const due = (iso) => { const dow = (new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7; return missions().filter((m) => m.days.includes(dow)); };
  const atMin = (m) => { const [h, mm] = (m.at || "19:00").split(":"); return +h * 60 + +mm; };
  const doneOf = (iso, id) => (F().log[iso] || {})[id];

  // Coche une mission (aujourd'hui seulement ; les jours passés se corrigent avec le code parent)
  function tick(id, byParent, iso) {
    const t = paris(), day = iso || t.iso, m = missions().find((x) => x.id === id); if (!m) return null;
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
    let pts = 0; Object.entries(F().voie).forEach(([d, set]) => { if (d.slice(0, 7) !== month) return; Object.keys(set).forEach((id) => { const v = voieList().find((x) => x.id === id); if (v) pts += v.p; }); });
    return pts;
  }
  const levelOf = (pts) => { let L = LEVELS[0], next = null; LEVELS.forEach((l, i) => { if (pts >= l[0]) { L = l; next = LEVELS[i + 1] || null; } }); return { L, next }; };
  function voieDoneThisWeek(id, iso) { const mon = mondayOf(iso); for (let i = 0; i < 7; i++) { const d = addDays(mon, i); if (d !== iso && F().voie[d] && F().voie[d][id]) return d; } return null; }
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
  const DECOS = [[5, "papillons", "🦋", 18, 34], [10, "lanterne", "🏮", 84, 46], [15, "etang", "🐟", 22, 82], [20, "torii", "⛩️", 50, 40], [30, "arbre", "🌳", 88, 40]];
  window.FOYER = { DECOS, syncClock, now, paris, addDays, mondayOf, DOW, missions, voieList, due, atMin, doneOf, tick, untick, week, checkTokens, monthOf, voiePoints, levelOf, voieDoneThisWeek, bestMonth, addBienfait, LEVELS, FLOWERS, FLOWER_EMOJI, F, MISSIONS, VOIE };
})();
