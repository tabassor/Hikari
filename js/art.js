/* Graphismes : sensei Ren (renard), yōkai générés, sceaux de clan, figures de cours. Tout en SVG inline, aucune image externe. */
(function () {
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = seed || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }

  // ---------- Ren, le maître renard ----------
  function sensei(mood = "happy", size = 96) {
    const eyes = {
      happy: `<path d="M68 96 q10 -10 20 0" stroke="#1b1320" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M112 96 q10 -10 20 0" stroke="#1b1320" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      wow: `<circle cx="78" cy="94" r="9" fill="#1b1320"/><circle cx="122" cy="94" r="9" fill="#1b1320"/><circle cx="81" cy="90" r="3" fill="#fff"/><circle cx="125" cy="90" r="3" fill="#fff"/>`,
      think: `<path d="M68 94 h20" stroke="#1b1320" stroke-width="5" stroke-linecap="round"/><circle cx="122" cy="94" r="8" fill="#1b1320"/><circle cx="125" cy="91" r="2.5" fill="#fff"/>`,
      fire: `<path d="M66 90 l22 8" stroke="#1b1320" stroke-width="5" stroke-linecap="round"/><path d="M134 90 l-22 8" stroke="#1b1320" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="102" r="6" fill="#1b1320"/><circle cx="120" cy="102" r="6" fill="#1b1320"/>`
    }[mood] || "";
    const mouth = mood === "wow" ? `<ellipse cx="100" cy="128" rx="7" ry="9" fill="#1b1320"/>` : mood === "think" ? `<path d="M92 128 q8 4 16 0" stroke="#1b1320" stroke-width="4" fill="none" stroke-linecap="round"/>` : `<path d="M88 124 q12 12 24 0" stroke="#1b1320" stroke-width="4" fill="#e04b5b" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" class="sensei" aria-hidden="true">
      <path d="M40 30 L78 70 L52 92 Z" fill="#f08a2b" stroke="#1b1320" stroke-width="5" stroke-linejoin="round"/>
      <path d="M160 30 L122 70 L148 92 Z" fill="#f08a2b" stroke="#1b1320" stroke-width="5" stroke-linejoin="round"/>
      <path d="M50 44 L70 68 L56 80 Z" fill="#ffd8c2"/><path d="M150 44 L130 68 L144 80 Z" fill="#ffd8c2"/>
      <path d="M36 92 Q40 56 100 56 Q160 56 164 92 Q170 140 100 168 Q30 140 36 92 Z" fill="#f08a2b" stroke="#1b1320" stroke-width="5" stroke-linejoin="round"/>
      <path d="M44 110 Q70 116 100 150 Q130 116 156 110 Q150 146 100 166 Q50 146 44 110 Z" fill="#fff7f0"/>
      <path d="M86 58 q14 -8 28 0 l-6 10 h-16 z" fill="#c43c52" stroke="#1b1320" stroke-width="3"/>
      <text x="100" y="67" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" font-family="sans-serif">蓮</text>
      ${eyes}
      <ellipse cx="100" cy="116" rx="7" ry="5" fill="#1b1320"/>
      ${mouth}
      <ellipse cx="62" cy="116" rx="9" ry="5" fill="#ff9aa8" opacity=".7"/><ellipse cx="138" cy="116" rx="9" ry="5" fill="#ff9aa8" opacity=".7"/>
    </svg>`;
  }

  // ---------- Yōkai (boss puis allié) ----------
  const YPAL = [["#7b5cff", "#c6b8ff"], ["#ff5470", "#ffc2cc"], ["#12b886", "#b2f2e0"], ["#ff922b", "#ffd8a8"], ["#339af0", "#bde0ff"], ["#e64980", "#fcc2d7"], ["#5c7cfa", "#c5d0ff"], ["#94d82d", "#e3f7b8"]];
  function yokai(id, opts = {}) {
    const r = rng(hash(id)); const [c1, c2] = YPAL[Math.floor(r() * YPAL.length)];
    const size = opts.size || 140, defeated = !!opts.ally, angry = !!opts.angry;
    const N = 14, pts = [];
    for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2, rad = 58 + r() * 22 * (i % 2 ? 1 : 0.4); pts.push([100 + Math.cos(a) * rad, 108 + Math.sin(a) * rad * 0.92]); }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < N; i++) { const p = pts[i], q = pts[(i + 1) % N]; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
    d += " Z";
    const horns = r() < 0.7 ? `<path d="M70 58 L60 ${22 + r() * 12} L84 52 Z" fill="${c2}" stroke="#15101c" stroke-width="4" stroke-linejoin="round"/><path d="M130 58 L140 ${22 + r() * 12} L116 52 Z" fill="${c2}" stroke="#15101c" stroke-width="4" stroke-linejoin="round"/>` : "";
    const nEyes = 1 + Math.floor(r() * 3);
    let eyes = "";
    const ex = nEyes === 1 ? [100] : nEyes === 2 ? [78, 122] : [70, 100, 130];
    ex.forEach((x, i) => {
      const y = nEyes === 3 && i === 1 ? 80 : 94, rr = nEyes === 1 ? 20 : 13;
      if (defeated) eyes += `<path d="M${x - rr * .7} ${y} q${rr * .7} -${rr * .8} ${rr * 1.4} 0" stroke="#15101c" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      else eyes += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff" stroke="#15101c" stroke-width="4"/><circle cx="${x + 2}" cy="${y + 2}" r="${rr * .45}" fill="#15101c"/>${angry ? `<path d="M${x - rr} ${y - rr - 4} l${rr * 2} ${nEyes === 1 ? 6 : 8}" stroke="#15101c" stroke-width="5" stroke-linecap="round"/>` : ""}`;
    });
    const teeth = defeated ? `<path d="M84 134 q16 12 32 0" stroke="#15101c" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : `<path d="M72 128 Q100 ${150 + r() * 10} 128 128 Z" fill="#15101c"/><path d="M80 130 l5 9 l5 -8 M110 130 l5 8 l5 -9" fill="#fff"/>`;
    const blush = defeated ? `<ellipse cx="66" cy="120" rx="9" ry="5" fill="#ff8fa3" opacity=".8"/><ellipse cx="134" cy="120" rx="9" ry="5" fill="#ff8fa3" opacity=".8"/>` : "";
    const spots = Array.from({ length: 4 }, () => `<circle cx="${60 + r() * 80}" cy="${140 + r() * 20}" r="${3 + r() * 5}" fill="${c2}" opacity=".7"/>`).join("");
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" class="yokai${angry ? " shake" : ""}" aria-hidden="true">${horns}<path d="${d}" fill="${c1}" stroke="#15101c" stroke-width="5"/>${spots}${eyes}${teeth}${blush}</svg>`;
  }

  // ---------- Sceau de clan ----------
  function seal(kanji, color, size = 52, locked = false) {
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true" class="seal"><rect x="8" y="8" width="84" height="84" rx="14" fill="${locked ? "var(--mute)" : color}" transform="rotate(-4 50 50)"/><rect x="16" y="16" width="68" height="68" rx="9" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="${locked ? "4 4" : "none"}" transform="rotate(-4 50 50)"/><text x="50" y="66" text-anchor="middle" font-size="46" font-weight="900" fill="#fff" font-family="'Dela Gothic One','Hiragino Sans','Noto Sans JP',sans-serif">${kanji}</text></svg>`;
  }

  // ---------- Anneau de progression ----------
  function ring(pct, color, size = 64, label = "") {
    const r = 26, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, pct));
    return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(c * v).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/>${label ? `<text x="32" y="37" text-anchor="middle" class="ringtxt">${label}</text>` : ""}</svg>`;
  }

  // ---------- Figures de cours ----------
  const pt = (x, y, n, dx = 0, dy = -10) => `<path d="M${x - 5} ${y - 5} l10 10 M${x + 5} ${y - 5} l-10 10" stroke="currentColor" stroke-width="2"/><text x="${x + dx}" y="${y + dy}" text-anchor="middle" class="figtxt strong">${n}</text>`;
  const FIG = {
    droite: `<svg viewBox="0 0 320 70" class="fig"><line x1="10" y1="40" x2="310" y2="40" stroke="var(--accent)" stroke-width="3"/>${pt(100, 40, "A")}${pt(220, 40, "B")}<text x="300" y="64" text-anchor="end" class="figtxt">(AB)</text></svg>`,
    demidroite: `<svg viewBox="0 0 320 70" class="fig"><line x1="100" y1="40" x2="310" y2="40" stroke="var(--accent)" stroke-width="3"/>${pt(100, 40, "A")}${pt(220, 40, "B")}<text x="300" y="64" text-anchor="end" class="figtxt">[AB)</text></svg>`,
    segment: `<svg viewBox="0 0 320 70" class="fig"><line x1="100" y1="40" x2="220" y2="40" stroke="var(--accent)" stroke-width="3"/>${pt(100, 40, "A")}${pt(220, 40, "B")}<text x="160" y="64" text-anchor="middle" class="figtxt">[AB]</text></svg>`,
    milieu: `<svg viewBox="0 0 320 80" class="fig"><line x1="60" y1="40" x2="260" y2="40" stroke="currentColor" stroke-width="2.5"/>${pt(60, 40, "A")}${pt(260, 40, "B")}${pt(160, 40, "I")}<path d="M106 32 l6 16 M114 32 l6 16" stroke="var(--accent)" stroke-width="2.5"/><path d="M200 32 l6 16 M208 32 l6 16" stroke="var(--accent)" stroke-width="2.5"/><text x="160" y="72" text-anchor="middle" class="figtxt">IA = IB : I est le milieu de [AB]</text></svg>`,
    cercle: `<svg viewBox="0 0 320 200" class="fig"><circle cx="160" cy="100" r="80" fill="color-mix(in srgb, var(--accent) 10%, transparent)" stroke="currentColor" stroke-width="2.5"/>${pt(160, 100, "O", -12, 4)}<line x1="160" y1="100" x2="240" y2="100" stroke="var(--accent)" stroke-width="3"/><text x="205" y="94" text-anchor="middle" class="figtxt">rayon</text><line x1="103" y1="44" x2="217" y2="156" stroke="#159A6B" stroke-width="3"/><text x="110" y="70" class="figtxt">diamètre</text><line x1="100" y1="153" x2="200" y2="169" stroke="#D99A00" stroke-width="3"/><text x="150" y="192" text-anchor="middle" class="figtxt">corde</text></svg>`,
    notations: `<svg viewBox="0 0 320 150" class="fig"><line x1="10" y1="30" x2="310" y2="30" stroke="var(--accent)" stroke-width="3"/>${pt(110, 30, "A")}${pt(210, 30, "B")}<text x="310" y="50" text-anchor="end" class="figtxt">droite (AB)</text><line x1="110" y1="80" x2="310" y2="80" stroke="var(--accent)" stroke-width="3"/>${pt(110, 80, "A")}${pt(210, 80, "B")}<text x="310" y="100" text-anchor="end" class="figtxt">demi-droite [AB)</text><line x1="110" y1="130" x2="210" y2="130" stroke="var(--accent)" stroke-width="3"/>${pt(110, 130, "A")}${pt(210, 130, "B")}<text x="310" y="136" text-anchor="end" class="figtxt">segment [AB]</text></svg>`,
    cellules: `<svg viewBox="0 0 320 170" class="fig"><ellipse cx="80" cy="80" rx="62" ry="50" fill="#ffe3e8" stroke="currentColor" stroke-width="2.5"/><circle cx="92" cy="74" r="16" fill="#b197fc" stroke="currentColor" stroke-width="2"/><text x="80" y="156" text-anchor="middle" class="figtxt strong">Cellule animale</text><rect x="180" y="26" width="120" height="104" rx="6" fill="none" stroke="#159A6B" stroke-width="6"/><rect x="186" y="32" width="108" height="92" rx="4" fill="#e6fbef" stroke="currentColor" stroke-width="2"/><circle cx="262" cy="60" r="15" fill="#b197fc" stroke="currentColor" stroke-width="2"/>${[[205, 50], [215, 100], [250, 108], [280, 96], [200, 80]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="#2f9e44"/>`).join("")}<text x="240" y="156" text-anchor="middle" class="figtxt strong">Cellule végétale</text><text x="92" y="100" text-anchor="middle" class="figtxt">noyau</text><text x="160" y="22" text-anchor="middle" class="figtxt">paroi →</text></svg>`,
    groupes: `<svg viewBox="0 0 320 200" class="fig"><rect x="6" y="6" width="308" height="188" rx="16" fill="none" stroke="#6B45B8" stroke-width="2.5"/><text x="18" y="26" class="figtxt strong">Vertébrés (colonne vertébrale)</text><text x="24" y="176" class="figtxt">truite</text><rect x="100" y="38" width="206" height="148" rx="14" fill="none" stroke="#159A6B" stroke-width="2.5"/><text x="112" y="56" class="figtxt strong">Tétrapodes (4 membres)</text><text x="116" y="176" class="figtxt">grenouille</text><rect x="190" y="68" width="110" height="52" rx="10" fill="none" stroke="#D42A48" stroke-width="2.5"/><text x="200" y="86" class="figtxt strong">Poils</text><text x="200" y="106" class="figtxt">chat, baleine</text><rect x="190" y="126" width="110" height="52" rx="10" fill="none" stroke="#D99A00" stroke-width="2.5"/><text x="200" y="144" class="figtxt strong">Plumes</text><text x="200" y="164" class="figtxt">pigeon</text></svg>`,
    etats: `<svg viewBox="0 0 320 190" class="fig"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs><rect x="10" y="130" width="80" height="44" rx="10" fill="#d0ebff" stroke="currentColor" stroke-width="2"/><text x="50" y="157" text-anchor="middle" class="figtxt strong">Solide</text><rect x="120" y="10" width="80" height="44" rx="10" fill="#fff3bf" stroke="currentColor" stroke-width="2"/><text x="160" y="37" text-anchor="middle" class="figtxt strong">Gaz</text><rect x="230" y="130" width="80" height="44" rx="10" fill="#c5f6fa" stroke="currentColor" stroke-width="2"/><text x="270" y="157" text-anchor="middle" class="figtxt strong">Liquide</text><path d="M92 146 H228" stroke="currentColor" stroke-width="2" marker-end="url(#ah)"/><text x="160" y="140" text-anchor="middle" class="figtxt">fusion</text><path d="M228 164 H92" stroke="currentColor" stroke-width="2" marker-end="url(#ah)"/><text x="160" y="184" text-anchor="middle" class="figtxt">solidification</text><path d="M262 128 L196 58" stroke="currentColor" stroke-width="2" marker-end="url(#ah)"/><text x="262" y="92" class="figtxt">vaporisation</text><path d="M180 58 L246 128" stroke="currentColor" stroke-width="2" marker-end="url(#ah)" stroke-dasharray="5 4"/><text x="150" y="100" text-anchor="end" class="figtxt">liquéfaction</text></svg>`
  };

  // ---------- Petits éléments ----------
  const ELEMENTS = {
    feu: { k: "火", n: "Feu", c: "#E4572E", fx: ["BOUM !", "FLAMBÉ !", "GOOO !"] },
    eau: { k: "水", n: "Eau", c: "#2B7BD9", fx: ["SPLASH !", "FLOW !", "SHAA !"] },
    vent: { k: "風", n: "Vent", c: "#12A37A", fx: ["FWOOSH !", "ZAN !", "SHUU !"] },
    foudre: { k: "雷", n: "Foudre", c: "#C99700", fx: ["BZZT !", "DOON !", "KRAK !"] },
    lune: { k: "月", n: "Lune", c: "#7650D6", fx: ["SHIIN…", "KIRA !", "FWAA !"] },
    fleur: { k: "花", n: "Fleur", c: "#D6417B", fx: ["SAKU !", "HANA !", "POP !"] }
  };

  window.ART = { sensei, yokai, seal, ring, FIG, ELEMENTS, hash, rng };
})();
