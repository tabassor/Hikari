/* Générateurs d'exercices : chaque appel produit une nouvelle question.
   Retour : { k:'q', q, c:[...], a:indexBonneRéponse, x } ou { k:'i', q, a:[réponses], num?:valeur, x, svg? } */
(function () {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NB = " "; // espace fine insécable pour les milliers

  // Écriture française d'un nombre : 1234567,89
  function fmt(n, dec) {
    const neg = n < 0; n = Math.abs(n);
    let s = dec == null ? String(+n.toFixed(6)) : n.toFixed(dec);
    let [ent, frac] = s.split(".");
    ent = ent.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
    return (neg ? "−" : "") + ent + (frac ? "," + frac : "");
  }
  const round6 = (x) => Math.round(x * 1e6) / 1e6;

  // ---------- Nombres en lettres (français, orthographe traditionnelle, traits d'union sous 100) ----------
  const U = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
  const D = { 20: "vingt", 30: "trente", 40: "quarante", 50: "cinquante", 60: "soixante" };
  function sous100(n, fin = true) {
    if (n <= 16) return U[n];
    if (n < 20) return "dix-" + U[n - 10];
    if (n < 70) { const d = Math.floor(n / 10) * 10, u = n % 10; return D[d] + (u === 0 ? "" : u === 1 ? " et un" : "-" + U[u]); }
    if (n < 80) { const r = n - 60; return "soixante" + (r === 11 ? " et onze" : "-" + sous100(r)); }
    const r = n - 80; return r === 0 ? (fin ? "quatre-vingts" : "quatre-vingt") : "quatre-vingt-" + sous100(r);
  }
  function sous1000(n, fin) {
    const c = Math.floor(n / 100), r = n % 100;
    let s = "";
    if (c === 1) s = "cent"; else if (c > 1) s = U[c] + " cent" + (r === 0 && fin ? "s" : "");
    if (r) s += (s ? " " : "") + sous100(r, fin);
    return s;
  }
  function lettres(n) {
    if (n === 0) return "zéro";
    const parts = [];
    const mds = Math.floor(n / 1e9), mns = Math.floor(n / 1e6) % 1000, mil = Math.floor(n / 1000) % 1000, u = n % 1000;
    if (mds) parts.push(sous1000(mds, true) + " milliard" + (mds > 1 ? "s" : ""));
    if (mns) parts.push(sous1000(mns, true) + " million" + (mns > 1 ? "s" : ""));
    if (mil) parts.push(mil === 1 ? "mille" : sous1000(mil, false) + " mille");
    if (u) parts.push(sous1000(u, true));
    return parts.join(" ");
  }

  const EN_U = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const EN_D = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const en = (n) => n === 100 ? "a hundred" : n < 20 ? EN_U[n] : EN_D[Math.floor(n / 10)] + (n % 10 ? "-" + EN_U[n % 10] : "");
  const ES_U = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
  const ES_D = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const es = (n) => n === 100 ? "cien" : n < 30 ? ES_U[n] : ES_D[Math.floor(n / 10)] + (n % 10 ? " y " + ES_U[n % 10] : "");

  // ---------- Conjugaison 1er groupe ----------
  const VERBES = ["chanter", "parler", "danser", "marcher", "jouer", "regarder", "raconter", "aimer", "écouter", "arriver", "commencer", "manger", "voyager", "lancer", "nager", "avancer", "plonger", "créer", "dessiner", "trouver"];
  const PERS = ["je", "tu", "il", "nous", "vous", "ils"];
  const PERS_LBL = ["1re pers. du singulier", "2e pers. du singulier", "3e pers. du singulier", "1re pers. du pluriel", "2e pers. du pluriel", "3e pers. du pluriel"];
  const TEMPS = {
    "présent": ["e", "es", "e", "ons", "ez", "ent"],
    "imparfait": ["ais", "ais", "ait", "ions", "iez", "aient"],
    "futur": ["erai", "eras", "era", "erons", "erez", "eront"],
    "passé simple": ["ai", "as", "a", "âmes", "âtes", "èrent"]
  };
  function conj(inf, temps, p) {
    let st = inf.slice(0, -2); const end = TEMPS[temps][p];
    if (/^[aoâ]/.test(end)) { if (st.endsWith("c")) st = st.slice(0, -1) + "ç"; else if (st.endsWith("g")) st += "e"; }
    return st + end;
  }
  const pron = (p, form) => p === 0 && /^[aeéèêiouh]/.test(form) ? "j'" : PERS[p] + " ";

  // ---------- Demi-droite graduée (SVG) ----------
  function numlineSVG(start, step, k, decimals) {
    const W = 340, H = 90, x0 = 20, dx = 30;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="fig" role="img" aria-label="Demi-droite graduée">`;
    s += `<line x1="${x0 - 10}" y1="50" x2="${W - 6}" y2="50" stroke="currentColor" stroke-width="2"/>`;
    s += `<path d="M${W - 12} 44 L${W - 4} 50 L${W - 12} 56" fill="none" stroke="currentColor" stroke-width="2"/>`;
    for (let i = 0; i <= 10; i++) {
      const x = x0 + i * dx, big = i === 0 || i === 10 || i === 5;
      s += `<line x1="${x}" y1="${big ? 40 : 44}" x2="${x}" y2="${big ? 60 : 56}" stroke="currentColor" stroke-width="${big ? 2 : 1.4}"/>`;
    }
    s += `<text x="${x0}" y="80" text-anchor="middle" class="figtxt">${fmt(start, decimals)}</text>`;
    s += `<text x="${x0 + 10 * dx}" y="80" text-anchor="middle" class="figtxt">${fmt(round6(start + 10 * step), decimals)}</text>`;
    const px = x0 + k * dx;
    s += `<path d="M${px} 42 L${px - 7} 22 L${px + 7} 22 Z" fill="var(--accent)"/><text x="${px}" y="16" text-anchor="middle" class="figtxt strong">?</text></svg>`;
    return s;
  }

  const RANGS = ["unités", "dizaines", "centaines", "unités de mille", "dizaines de mille", "centaines de mille", "unités de millions", "dizaines de millions", "centaines de millions", "unités de milliards"];

  const G = {
    conj1() {
      const v = pick(VERBES), t = pick(Object.keys(TEMPS)), p = R(0, 5), f = conj(v, t, p);
      return { k: "i", q: `Conjugue **${v}** au **${t}**, ${PERS_LBL[p]} :<br><span class="big">${pron(p, f)}…</span>`, a: [f, pron(p, f) + f], x: `${pron(p, f)}${f} — terminaison -${TEMPS[t][p]}.` + (/^(commenc|lanc|avanc)/.test(v) ? " Devant a et o : ç." : /^(mang|voyag|nag|plong)/.test(v) ? " Devant a et o : ge." : "") };
    },
    placeInt() {
      const n = Math.floor(R(1e6, 9.99e9)), s = String(n), r = R(0, Math.min(9, s.length - 1)), ch = s[s.length - 1 - r];
      return { k: "i", q: `Dans **${fmt(n)}**, quel est le chiffre des **${RANGS[r]}** ?`, a: [ch], num: +ch };
    },
    nbOf() {
      const n = R(10000, 999999), [div, nom] = pick([[10, "dizaines"], [100, "centaines"], [1000, "milliers"]]), v = Math.floor(n / div);
      return { k: "i", q: `Quel est le **nombre de ${nom}** dans **${fmt(n)}** ?`, a: [String(v)], num: v, x: `On garde tout ce qui est à gauche du chiffre des ${nom}, lui compris : ${fmt(v)}.` };
    },
    words() {
      const shapes = [() => R(101, 999), () => R(1001, 99999), () => R(1, 99) * 1e6 + R(0, 999) * 1000, () => R(2, 9) * 1e9 + R(0, 999) * 1e6];
      const n = pick(shapes)();
      const s = String(n); const alts = new Set([n]);
      let guard = 0;
      while (alts.size < 4 && guard++ < 50) {
        const i = R(0, s.length - 1); const d = String((+s[i] + R(1, 9)) % 10);
        const m = +(s.slice(0, i) + d + s.slice(i + 1)); if (String(m).length === s.length) alts.add(m);
      }
      const opts = [...alts];
      const rect = (m) => lettres(m).replace(/ /g, "-");
      return { k: "q", q: `Comment s'écrit **${fmt(n)}** en lettres ?`, c: opts.map(rect), a: 0, x: "Orthographe rectifiée, comme dans ton cours : tous les mots du nombre sont reliés par des traits d'union." };
    },
    placeDec() {
      const ent = R(10, 999), dec = R(100, 999), n = +(ent + "." + dec);
      const opts = [["dixièmes", String(dec)[0]], ["centièmes", String(dec)[1]], ["millièmes", String(dec)[2]], ["unités", String(ent).slice(-1)], ["dizaines", String(ent).slice(-2, -1)]];
      const [nom, ch] = pick(opts);
      return { k: "i", q: `Dans **${fmt(n, 3)}**, quel est le chiffre des **${nom}** ?`, a: [ch], num: +ch };
    },
    decFrac() {
      const den = pick([10, 100, 1000]), num = R(1, den * 3 - 1);
      if (Math.random() < 0.5) return { k: "i", q: `Écris sous forme décimale : **${num}/${fmt(den)}**`, a: [fmt(num / den)], num: round6(num / den) };
      const d = String(den).length - 1;
      return { k: "i", q: `Complète : **${fmt(num / den, d)} = … / ${fmt(den)}**`, a: [String(num)], num: num };
    },
    mul10() {
      const x = round6(R(1, 9999) / pick([1, 10, 100, 1000])), f = pick([10, 100, 1000]), mul = Math.random() < 0.55;
      const r = round6(mul ? x * f : x / f);
      return { k: "i", q: `Calcule : **${fmt(x)} ${mul ? "×" : "÷"} ${fmt(f)}**`, a: [fmt(r)], num: r, x: `Chaque chiffre devient ${fmt(f)} fois plus ${mul ? "grand" : "petit"} : il ${mul ? "avance" : "recule"} de ${String(f).length - 1} rang(s).` };
    },
    cmpDec() {
      const e = R(0, 20); const t = pick([
        () => [+(e + "." + R(1, 9)), +(e + "." + R(10, 99))],
        () => [+(e + "." + R(10, 99)), +(e + "." + R(100, 999))],
        () => { const d = R(1, 9); return [+(e + "." + d), +(e + "." + d + "0")]; },
        () => [+(e + "." + R(0, 9) + R(0, 9)), +((e + R(0, 1)) + "." + R(0, 9))]
      ])();
      let [a, b] = Math.random() < 0.5 ? t : [t[1], t[0]];
      const sign = a > b ? ">" : a < b ? "<" : "=";
      const c = [">", "<", "="]; return { k: "q", q: `Compare : **${fmt(a)} … ${fmt(b)}**`, c: [sign, ...c.filter((z) => z !== sign)], a: 0, x: "Compare d'abord les parties entières, puis les dixièmes, puis les centièmes…" };
    },
    round() {
      const n = round6(R(1000, 99999) / 1000), [nom, d] = pick([["à l'unité", 0], ["au dixième", 1], ["au centième", 2]]);
      const r = +(Math.round(n * 10 ** d + 1e-9) / 10 ** d).toFixed(d);
      return { k: "i", q: `Arrondi **${nom}** de **${fmt(n, 3)}** ?`, a: [fmt(r, d)], num: r, x: "On regarde le chiffre juste après : 5 ou plus, on arrondit au-dessus." };
    },
    numline() {
      const [step, dec] = pick([[1, 0], [0.1, 1], [0.01, 2], [10, 0]]);
      const start = round6(step === 10 ? R(0, 20) * 10 : step === 1 ? R(0, 50) : step === 0.1 ? R(0, 30) : R(0, 300) / 100);
      const k = R(1, 9), v = round6(start + k * step);
      return { k: "i", q: "Quel nombre est repéré par la flèche ?", svg: numlineSVG(start, step, k, dec), a: [fmt(v)], num: v, x: `Chaque petit intervalle vaut ${fmt(step)}.` };
    },
    encadre() {
      let v; do { v = R(1000, 9999); } while (v % 10 === 0); const n = v / 100; const lo = Math.floor(n * 10) / 10, hi = round6(lo + 0.1);
      const good = `${fmt(lo, 1)} < ${fmt(n, 2)} < ${fmt(hi, 1)}`;
      const bads = [`${fmt(round6(lo - 0.1), 1)} < ${fmt(n, 2)} < ${fmt(lo, 1)}`, `${fmt(Math.floor(n))} < ${fmt(n, 2)} < ${fmt(Math.floor(n) + 1)}`, `${fmt(hi, 1)} < ${fmt(n, 2)} < ${fmt(round6(hi + 0.1), 1)}`];
      return { k: "q", q: `Encadre **${fmt(n, 2)}** entre deux nombres consécutifs **au dixième** :`, c: [good, ...bads], a: 0 };
    },
    rayon() {
      const r = R(2, 15);
      return Math.random() < 0.5 ? { k: "i", q: `Un cercle a un **rayon de ${r} cm**. Son diamètre ?`, a: [String(2 * r), 2 * r + " cm"], num: 2 * r, x: "Diamètre = 2 × rayon." }
        : { k: "i", q: `Un cercle a un **diamètre de ${2 * r} cm**. Son rayon ?`, a: [String(r), r + " cm"], num: r, x: "Rayon = diamètre ÷ 2." };
    },
    tables() { const a = R(2, 10), b = R(2, 10); return { k: "i", q: `**${a} × ${b}** = ?`, a: [String(a * b)], num: a * b, flash: true }; },
    fracQty() {
      const d = pick([2, 3, 4, 5, 10]), n = R(1, d - 1), q = d * R(2, 12);
      return { k: "i", q: `Calcule **${n}/${d} de ${q}**`, a: [String(q / d * n)], num: q / d * n, x: `${q} ÷ ${d} = ${q / d}, puis × ${n}.` };
    },
    frac14() {
      const t = pick([["1/2", "0,5"], ["1/4", "0,25"], ["3/4", "0,75"], ["1/10", "0,1"], ["1/100", "0,01"]]);
      return Math.random() < 0.5 ? { k: "i", q: `Écriture décimale de **${t[0]}** ?`, a: [t[1]], num: +t[1].replace(",", ".") }
        : { k: "q", q: `**${t[1]}** est égal à…`, c: [t[0], ...shuffle(["1/2", "1/4", "3/4", "1/10", "1/100", "1/3"].filter((z) => z !== t[0])).slice(0, 3)], a: 0 };
    },
    double() {
      const [nom, f] = pick([["le double", 2], ["la moitié", 0.5], ["le triple", 3], ["le tiers", 1 / 3], ["le quadruple", 4], ["le quart", 0.25]]);
      const base = f === 1 / 3 ? 3 * R(2, 33) : f === 0.25 ? 4 * R(2, 25) : f === 0.5 ? 2 * R(3, 60) : R(6, 60);
      const v = Math.round(base * f * 1e6) / 1e6; return { k: "i", q: `Quel est **${nom} de ${base}** ?`, a: [fmt(v)], num: v };
    },
    convLen() {
      const u = ["km", "hm", "dam", "m", "dm", "cm", "mm"]; let i = R(0, 6), j = R(0, 6); while (j === i || Math.abs(i - j) > 3) j = R(0, 6);
      const x = round6(R(1, 999) / pick([1, 10])); const r = round6(x * 10 ** (j - i));
      return { k: "i", q: `Convertis : **${fmt(x)} ${u[i]} = … ${u[j]}**`, a: [fmt(r)], num: r, x: "km, hm, dam, m, dm, cm, mm : chaque unité vaut 10 fois la suivante." };
    },
    durees() {
      return pick([
        () => { const h = R(1, 4), m = pick([0, 15, 30, 45]); return { k: "i", q: `Combien de minutes dans **${h} h ${m ? m + " min" : ""}** ?`, a: [String(h * 60 + m)], num: h * 60 + m }; },
        () => { const t = pick([["½ h", 30], ["¼ h", 15], ["¾ h", 45], ["1 h ½", 90]]); return { k: "i", q: `**${t[0]}** = combien de minutes ?`, a: [String(t[1])], num: t[1] }; },
        () => { const m = R(2, 5); return { k: "i", q: `Combien de secondes dans **${m} min** ?`, a: [String(m * 60)], num: m * 60 }; }
      ])();
    },
    grossissement() {
      const o = pick([5, 10, 15]), b = pick([4, 10, 40, 100]);
      return { k: "i", q: `Oculaire **×${o}**, objectif **×${b}**. Grossissement total ?`, a: [String(o * b)], num: o * b, x: "On multiplie : oculaire × objectif." };
    },
    convVol() {
      return pick([
        () => { const x = R(1, 40) / 2; return { k: "i", q: `**${fmt(x)} L** = combien de mL ?`, a: [fmt(x * 1000)], num: x * 1000 }; },
        () => { const x = R(1, 40) * 50; return { k: "i", q: `**${fmt(x)} mL** = combien de L ?`, a: [fmt(x / 1000)], num: x / 1000 }; },
        () => { const x = R(1, 9); return { k: "i", q: `**${x} dm³** = combien de L ?`, a: [String(x)], num: x, x: "1 dm³ = 1 L." }; },
        () => { const x = R(1, 20) * 25; return { k: "i", q: `**${x} cm³** = combien de mL ?`, a: [String(x)], num: x, x: "1 cm³ = 1 mL." }; }
      ])();
    },
    enNum() { const n = R(11, 100); return { k: "i", q: `Write in English: **${n}**`, a: [en(n), en(n).replace("-", " "), n === 100 ? "one hundred" : en(n)] }; },
    esNum() { const n = pick([R(0, 30), R(31, 100)]); return { k: "i", q: `Escribe en español: **${n}**`, a: [es(n)] }; },
    enDays() {
      const days = [["lundi", "Monday"], ["mardi", "Tuesday"], ["mercredi", "Wednesday"], ["jeudi", "Thursday"], ["vendredi", "Friday"], ["samedi", "Saturday"], ["dimanche", "Sunday"]];
      const months = [["janvier", "January"], ["février", "February"], ["mars", "March"], ["avril", "April"], ["mai", "May"], ["juin", "June"], ["juillet", "July"], ["août", "August"], ["septembre", "September"], ["octobre", "October"], ["novembre", "November"], ["décembre", "December"]];
      if (Math.random() < 0.3) { const i = R(0, 6); return { k: "i", q: `What day comes after **${days[i][1]}**?`, a: [days[(i + 1) % 7][1]], caseSensitive: true, x: "Les jours prennent une majuscule en anglais." }; }
      const t = pick(Math.random() < 0.5 ? days : months); return { k: "i", q: `Traduis en anglais : **${t[0]}**`, a: [t[1]], caseSensitive: true, x: "Majuscule obligatoire en anglais." };
    },
    esDays() {
      const days = [["lundi", "lunes"], ["mardi", "martes"], ["mercredi", "miércoles"], ["jeudi", "jueves"], ["vendredi", "viernes"], ["samedi", "sábado"], ["dimanche", "domingo"]];
      const months = [["janvier", "enero"], ["février", "febrero"], ["mars", "marzo"], ["avril", "abril"], ["mai", "mayo"], ["juin", "junio"], ["juillet", "julio"], ["août", "agosto"], ["septembre", "septiembre"], ["octobre", "octubre"], ["novembre", "noviembre"], ["décembre", "diciembre"]];
      const t = pick(Math.random() < 0.5 ? days : months); return { k: "i", q: `Traduis en espagnol : **${t[0]}**`, a: [t[1]], x: "Sans majuscule en espagnol." };
    },
    esColor() {
      const cols = [["rouge", "rojo", "#d62839"], ["bleu", "azul", "#2a6fdb"], ["vert", "verde", "#2e9e44"], ["jaune", "amarillo", "#f3c613"], ["noir", "negro", "#1b1b1b"], ["blanc", "blanco", "#ffffff"], ["gris", "gris", "#8a8a8a"], ["marron", "marrón", "#7a4a24"], ["rose", "rosa", "#f28dbb"], ["orange", "naranja", "#f07f1a"]];
      const t = pick(cols); const sw = `<div class="swatch" style="background:${t[2]}"></div>`;
      if (Math.random() < 0.5) return { k: "i", q: `¿De qué color es? (en espagnol)`, svg: sw, a: [t[1]] };
      return { k: "q", q: `« **${t[1]}** » veut dire…`, c: [t[0], ...shuffle(cols.filter((z) => z !== t)).slice(0, 3).map((z) => z[0])], a: 0 };
    }
  };

  // Tirage dans un tableau de conjugaison fourni par la carte : { tense, verbs: { verbe: [6 formes] ou [3 formes à l'impératif] } }
  G.tab = function (card) {
    const T = card.tab, v = pick(Object.keys(T.verbs)), forms = T.verbs[v], p = R(0, forms.length - 1), f = forms[p];
    const V = v.toUpperCase();
    if (forms.length === 3) {
      const lbl = ["2e pers. du singulier (tu)", "1re pers. du pluriel (nous)", "2e pers. du pluriel (vous)"][p];
      return { k: "i", q: `Conjugue **${V}** au **${T.tense}**, ${lbl} :`, a: [f, f + " !"], x: `${V} au ${T.tense} : ${forms.join(", ")}.` };
    }
    const el = p === 0 && /^[aeéèêiouhy]/i.test(f);
    const shown = ["je", "tu", "il / elle / on", "nous", "vous", "ils / elles"][p];
    const a = [f, (el ? "j'" : ["je ", "tu ", "il ", "nous ", "vous ", "ils "][p]) + f];
    if (p === 2) a.push("elle " + f, "on " + f); if (p === 5) a.push("elles " + f);
    return { k: "i", q: `**${V}** au **${T.tense}** :<br><span class="big">${el ? "j'" : shown + " "}…</span>`, a, x: `${V} au ${T.tense} : ${forms.map((x, i) => (i === 0 && /^[aeéèêiouhy]/i.test(x) ? "j'" : ["je ", "tu ", "il ", "nous ", "vous ", "ils "][i]) + x).join(", ")}.` };
  };
  window.GEN = { run: (id, card) => (G[id] ? G[id](card || {}) : null), list: Object.keys(G), fmt, lettres };
})();
