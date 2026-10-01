/* Hikari — Emploi du temps (semaines 1 et 2) et agenda des évaluations et leçons à apprendre.
   Saisis par l'élève, stockés uniquement sur le téléphone (STORE.S.edt, STORE.S.agenda).
   Les leçons liées à une échéance passent en tête des révisions pendant les 7 jours qui précèdent. */
(function () {
  const today = () => STORE.today();
  const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const dowOf = (iso) => (new Date(iso + "T12:00:00Z").getUTCDay() + 6) % 7; // 0 = lundi
  const mondayOf = (iso) => addDays(iso, -dowOf(iso));
  const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const WINDOW = 7, FOCUS_MAX = 15;

  // Matières : celles de Hikari (couleurs des clans) + les autres matières du collège
  const DEF_IC = { fr: "📖", ma: "📐", hg: "🏛️", sc: "🔬", en: "💂", es: "💃", emc: "⚖️" };
  const EXTRA = [
    { id: "eps", n: "EPS", c: "#E0336E", ic: "🏃" }, { id: "arts", n: "Arts plastiques", c: "#0A9FD8", ic: "🎨" },
    { id: "mus", n: "Musique", c: "#A0662A", ic: "🎵" }, { id: "tech", n: "Technologie", c: "#58707E", ic: "⚙️" },
    { id: "vdc", n: "Vie de classe", c: "#7D8A1F", ic: "💬" }, { id: "etude", n: "Étude", c: "#8B8B99", ic: "📘" },
    { id: "past", n: "Temps pastoral", c: "#9C3D7A", ic: "🤝" },
    { id: "autre", n: "Autre", c: "#5D6B8A", ic: "⭐" }
  ];
  function E() { const S = STORE.S; S.edt = S.edt || {}; const e = S.edt; e.slots = e.slots || []; e.icons = e.icons || {}; return e; }
  function A() { const S = STORE.S; S.agenda = S.agenda || []; return S.agenda; }
  function subjects() {
    // Personnage dessiné (data/images.js → IMAGES.subj, ajouté par le parent) s'il existe, sinon l'emoji choisi par l'élève
    const ic = E().icons, im = (window.IMAGES && IMAGES.subj) || {};
    return PROGRAMME.subjects.map((s) => ({ id: s.id, n: s.short || s.name, c: s.color, k: s.kanji, hk: true, ic: ic[s.id] || DEF_IC[s.id] || "⭐", img: im[s.id] || "" }))
      .concat(EXTRA.map((x) => Object.assign({}, x, { ic: ic[x.id] || x.ic, img: im[x.id] || "" })));
  }
  const subj = (id) => subjects().find((s) => s.id === id) || subjects().find((s) => s.id === "autre");

  // ---------- Semaines 1 et 2 ----------
  // Référence : « la semaine du lundi X est une semaine N ». L'alternance saute les semaines de vacances.
  const inHoliday = (iso) => STORE.HOLIDAYS.all.concat(STORE.HOLIDAYS[STORE.S.settings.zone] || []).some(([a, b]) => iso >= a && iso < b);
  function weekNo(iso = today()) {
    const ref = E().ref; if (!ref) return 0;
    let a = ref.mon, b = mondayOf(iso), sign = 1; if (b < a) { [a, b] = [b, a]; sign = -1; }
    let n = 0; for (let m = a; m < b; m = addDays(m, 7)) if (!inHoliday(addDays(m, 2))) n++;
    return (((ref.w - 1 + sign * n) % 2) + 2) % 2 + 1;
  }
  function setWeek(w, iso = today()) { E().ref = { mon: mondayOf(iso), w }; STORE.save(); }
  const isHoliday = (iso) => inHoliday(iso);
  function slotsOn(iso) {
    if (inHoliday(iso)) return [];
    const d = dowOf(iso), w = weekNo(iso);
    return E().slots.filter((s) => s.d === d && (!s.w || s.w === w)).sort((a, b) => (a.start < b.start ? -1 : 1));
  }
  function nextSchoolDay(iso = today()) { for (let i = 1; i < 21; i++) { const d = addDays(iso, i); if (slotsOn(d).length) return d; } return null; }
  // Prochain cours d'une matière (pour dater une interro « au prochain cours »)
  function nextClass(sid, iso = today()) { for (let i = 1; i < 28; i++) { const d = addDays(iso, i); if (slotsOn(d).some((s) => s.s === sid)) return d; } return null; }
  const bag = (iso) => { const seen = new Set(), out = []; slotsOn(iso).forEach((s) => { const k = s.s + "|" + (s.lab || ""); if (!seen.has(k)) { seen.add(k); out.push(s); } }); return out; };

  // ---------- Agenda ----------
  const TYPES = { ctrl: ["Contrôle", "🎯"], interro: ["Interro", "⚡"], lecon: ["Leçon à apprendre", "📗"], oral: ["Oral / récitation", "🎤"] };
  const uid = () => "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  function add(it) { const x = Object.assign({ id: uid(), created: today(), lessons: [] }, it); A().push(x); STORE.save(); return x; }
  function del(id) { STORE.S.agenda = A().filter((x) => x.id !== id); STORE.save(); }
  const upcoming = (iso = today()) => A().filter((x) => x.date >= iso).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const past = (iso = today()) => A().filter((x) => x.date < iso).sort((a, b) => (a.date < b.date ? 1 : -1));
  const daysTo = (iso, from = today()) => Math.round((new Date(iso + "T12:00:00Z") - new Date(from + "T12:00:00Z")) / 86400000);
  // Leçons à préparer : échéances des 7 prochains jours (la plus proche l'emporte)
  function focusLessons(iso = today()) {
    const m = {}; upcoming(iso).forEach((x) => { if (daysTo(x.date, iso) > WINDOW) return; (x.lessons || []).forEach((l) => { if (!m[l]) m[l] = x; }); });
    return m;
  }
  window.AGENDA = { DAYS, TYPES, WINDOW, FOCUS_MAX, E, A, subjects, subj, weekNo, setWeek, isHoliday, slotsOn, nextSchoolDay, nextClass, bag, add, del, upcoming, past, daysTo, focusLessons, mondayOf, addDays, dowOf };
})();
