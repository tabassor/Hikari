/* Hikari 光 — application (v2 : leçons, orbite des clans, cartes à glisser, glisser-déposer, combats animés, sons).
   Écrans : Dōjō, Clan, Chapitre, Leçon, Révision, Boss, Monde (frise + carte), Trésors, Moi. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = (s) => String(s ?? "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "<u>$1</u>");
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const shuffleNot = (arr) => { if (arr.length < 2) return arr.slice(); let a; do { a = shuffle(arr); } while (a.every((x, i) => x === arr[i])); return a; };
  const S = () => STORE.S;
  const sub = (id) => STORE.SUBI[id];
  const el = () => ART.ELEMENTS[(S().profile && S().profile.element) || "feu"];
  const plural = (n, w) => `${n} ${w}${n > 1 ? "s" : ""}`;

  // ---------- Petits outils d'interface ----------
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2700); }
  function stampToast(kanji, title) {
    const t = document.createElement("div"); t.className = "stamp-toast";
    t.innerHTML = `${ART.seal(kanji, "var(--seal)", 46)}<span><span class="tiny">Nouvel emblème</span><br><b>${esc(title)}</b></span>`;
    document.body.appendChild(t); FX.sfx("stamp"); FX.buzz(30); setTimeout(() => t.remove(), 3200);
  }
  function fxText(text, x, y) { const f = document.createElement("div"); f.className = "fx"; f.textContent = text; if (x != null) { f.style.left = x + "px"; f.style.top = y + "px"; } document.body.appendChild(f); setTimeout(() => f.remove(), 950); }
  // Une seule fenêtre à la fois : les annonces se suivent au lieu de s'empiler.
  let celQueue = Promise.resolve();
  function celebrate(title, body, cta, sound) { const run = () => celebrateNow(title, body, cta, sound); const pr = celQueue.then(run, run); celQueue = pr.then(() => new Promise((r) => setTimeout(r, 250))); return pr; }
  function celebrateNow(title, body, cta = "Continuer", sound = "win") {
    return new Promise((res) => {
      const c = document.createElement("div"); c.className = "celebrate";
      c.innerHTML = `<div class="burst"></div><div class="panel"><div class="title">${title}</div>${body}<button class="btn primary big" id="cel-ok">${cta}</button></div>`;
      document.body.appendChild(c); $("#cel-ok", c).focus();
      if (sound) FX.sfx(sound);
      if (sound === "win" || sound === "level") setTimeout(() => FX.burst(innerWidth / 2, innerHeight * 0.35, { n: 60, speed: 9, colors: [el().c, "#E8B923", "#fff", "#D8334A"], life: 70 }), 120);
      $("#cel-ok", c).onclick = () => { FX.sfx("tap"); c.remove(); res(); };
    });
  }
  function senseiLine(text, mood = "happy") { return `<div class="sensei-line">${ART.sensei(mood, 80)}<div class="bubble">${text}</div></div>`; }
  function elementPicker(cur, level = 1) {
    const e = ART.ELEMENTS[cur];
    return `<div class="elements">${Object.entries(ART.ELEMENTS).map(([id, x]) => `<button class="el" data-el="${id}" aria-pressed="${id === cur}"><span class="k" style="color:${id === cur ? "inherit" : x.c}">${x.k}</span>${x.n}</button>`).join("")}</div>
      <div class="el-desc" style="--c:${e.c}">${ART.avatar(cur, level, 64)}<p><b>${e.k} ${e.n}</b><br>${e.d}</p></div>`;
  }
  function applyAccent() { document.documentElement.style.setProperty("--accent", el().c); }
  function afterAction() {
    const won = STORE.checkBadges(); STORE.save();
    STORE.checkDefis().forEach((m, i) => { const r = (S().msgs[m.id] = S().msgs[m.id] || {}); if (r.cheered) return; r.cheered = STORE.today(); STORE.save(); setTimeout(() => revealDefi(m), 700 + i * 2800); });
    won.forEach((id, i) => { const b = STORE.BADGES.find((x) => x[0] === id); setTimeout(() => stampToast(b[1], b[2]), 500 + i * 3300); });
    const lv = STORE.levelInfo().level, t = ART.tierOf(lv);
    if (S().profile && (S().sealTier ?? 0) < t) {
      S().sealTier = t; STORE.save();
      setTimeout(() => celebrate("進化！", `<div class="evolve">${ART.avatar(S().profile.element, lv, 140)}</div><p><b>Ton sceau évolue : ${ART.TIERS[t].n} !</b><br>${ART.TIERS[t].d}</p>`, "Magnifique", "level"), 600);
    }
    renderHUD();
  }
  function levelUpCheck(lv) { if (lv) { const L = STORE.levelInfo(); setTimeout(() => celebrate(`Niveau ${lv} !`, `${ART.avatar(S().profile.element, lv, 110)}<p><b>${L.rank[1]} ${L.rank[2]}</b></p>`, "Continuer", "level"), 200); } }
  const ring = (pct, color, size, label) => ART.ring(pct, color, size, label).replace("<svg", '<svg class="ring-anim"');

  // ---------- Écran d'ouverture (inspiré de Michi : ensō tracé, sceau qui s'imprime) ----------
  function splash() {
    if (FX.reduce()) return;
    const s = document.createElement("div"); s.id = "splash";
    s.innerHTML = `<svg viewBox="0 0 200 200" width="170" height="170" aria-hidden="true"><circle class="sp-ring" cx="100" cy="100" r="74"/><g class="sp-seal"><rect x="62" y="62" width="76" height="76" rx="12" fill="var(--seal)" transform="rotate(-5 100 100)"/><text x="100" y="118" text-anchor="middle" class="sp-k">光</text></g></svg><div class="sp-nom">HIKARI</div><div class="sp-sous">Académie de révision</div>`;
    document.body.appendChild(s); s.onclick = () => s.remove(); setTimeout(() => s.remove(), 2100);
  }

  // ---------- HUD & navigation ----------
  function renderHUD() {
    const p = S().profile; if (!p) { $(".hud").hidden = true; $(".tabs").hidden = true; return; }
    $(".hud").hidden = false; $(".tabs").hidden = false;
    const L = STORE.levelInfo(); const d = S().days[STORE.today()] || { n: 0 };
    $(".hud").innerHTML = `${ART.avatar(S().profile.element, L.level, 50)}
      <div class="who"><div class="name">${esc(p.name)}</div><div class="rank">Niv. ${L.level} · <span class="kj-f">${L.rank[1]}</span> ${L.rank[2]}</div><div class="xpbar" title="${L.into}/${L.need} XP"><i style="width:${(100 * L.into / L.need).toFixed(1)}%"></i></div></div>
      <div class="chips"><span class="chip flame" title="Flamme : jours d'affilée avec l'objectif atteint"><span class="k">炎</span>${STORE.streakAlive()}</span><span class="chip ki" title="Ki du jour : révisions faites / objectif"><span class="k">気</span>${Math.min(d.n, S().settings.goal)}/${S().settings.goal}</span></div>`;
  }
  const TABS = [["dojo", "道", "Dōjō"], ["revision", "修", "Réviser"], ["monde", "界", "Monde"], ["foyer", "家", "Foyer"], ["tresors", "宝", "Trésors"], ["moi", "我", "Moi"]];
  let curTab = "dojo";
  function renderTabs(cur) { curTab = cur; const dot = window.FOYER && foyerAlert(); $(".tabs").innerHTML = `<div class="in">${TABS.map(([id, k, n]) => `<button data-go="${id}" ${cur === id ? 'aria-current="page"' : ""}><span class="k">${k}</span>${n}${id === "foyer" && dot ? '<i class="tab-dot" aria-label="Mission à faire"></i>' : ""}</button>`).join("")}</div>`; }
  let leaveGuard = null, navDir = "fwd", depth = 0, orbitStop = null;
  function go(route, replace) {
    if (leaveGuard && !leaveGuard()) return;
    leaveGuard = null; FX.sfx("tap");
    const h = "#" + route;
    if (location.hash !== h) { if (replace) history.replaceState({ d: depth }, "", h); else { depth++; history.pushState({ d: depth }, "", h); } }
    navDir = "fwd"; render();
  }
  function render() {
    if (orbitStop) { orbitStop(); orbitStop = null; }
    const route = (location.hash || "#dojo").slice(1);
    const main = $("main"); main.innerHTML = ""; window.scrollTo(0, 0);
    main.className = ""; void main.offsetWidth; main.className = "anim nav-" + navDir;
    if (route.startsWith("bilan~")) { if (S().profile) renderHUD(); return viewBilan(main, route.slice(6)); }
    if (!S().profile) { renderTabs(""); renderHUD(); return viewOnboarding(main); }
    renderHUD();
    const [name, ...rest] = route.split("~"); const arg = rest.join("~");
    const tab = { dojo: "dojo", clan: "dojo", ch: "dojo", le: "dojo", revision: "revision", seance: "revision", boss: "dojo", epreuve: "dojo", foyer: "foyer", agenda: "dojo", edt: "dojo", fprep: "moi", fcfg: "moi", monde: "monde", tresors: "tresors", moi: "moi" }[name] || "dojo";
    renderTabs(tab);
    ({ dojo: viewDojo, clan: viewClan, ch: viewChapter, le: viewLesson, revision: viewRevisionHub, seance: viewSession, boss: viewBoss, epreuve: viewEpreuve, foyer: viewFoyer, agenda: viewAgenda, edt: viewEdtEdit, fprep: viewFoyerPrep, fcfg: viewFoyerImport, monde: viewWorld, tresors: viewTreasures, moi: viewMe }[name] || viewDojo)(main, arg);
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b && !b.disabled) { e.preventDefault(); go(b.dataset.go); } });
  window.addEventListener("popstate", (e) => { leaveGuard = null; const d = (e.state && e.state.d) || 0; navDir = d < depth ? "back" : "fwd"; depth = d; render(); });

  // ---------- Onboarding ----------
  function viewOnboarding(main) {
    let element = "feu", step = 1; const picked = new Set();
    function draw() {
      if (step === 1) {
        main.innerHTML = `<div class="panel hero tone stack"><div class="speed"></div><p class="eyebrow">Académie Hikari <span class="kj-f">光</span></p><h1>Bienvenue, nouvelle recrue !</h1>
          ${senseiLine("Je suis <b>Ren</b>, maître renard de l'Académie. Ici, chaque leçon apprise devient du <b>Ki</b>. Sept clans t'attendent. Comment t'appelles-tu ?")}
          <label class="stack"><span class="eyebrow">Ton nom de guerrière</span><input type="text" id="ob-name" maxlength="20" autocomplete="off" placeholder="Ton prénom ou ton pseudo"></label>
          <span class="eyebrow">Choisis ton élément</span>${elementPicker(element)}
          <button class="btn primary big pulse" id="ob-next">Entrer à l'Académie</button></div>`;
        $$(".el", main).forEach((b) => (b.onclick = () => { element = b.dataset.el; FX.sfx("pick"); document.documentElement.style.setProperty("--accent", ART.ELEMENTS[element].c); const n = $("#ob-name").value; draw(); $("#ob-name").value = n; }));
        $("#ob-next").onclick = () => { const n = $("#ob-name").value.trim(); if (!n) { $("#ob-name").focus(); toast("Écris ton nom pour continuer."); return; } S().profile = { name: n, element, created: STORE.today() }; step = 2; FX.sfx("tap"); draw(); };
      } else {
        const p1 = STORE.CH.filter((c) => c.period === 1 && !c.stub);
        main.innerHTML = `<div class="stack"><h1>Qu'as-tu déjà vu en classe ?</h1>
          ${senseiLine("Coche les leçons que ta prof a <b>déjà faites</b>. Seules celles-là entreront dans tes révisions. Tu ouvriras les suivantes au fil des semaines, dans chaque clan.", "think")}
          ${PROGRAMME.subjects.map((s) => { const cs = p1.filter((c) => c.s === s.id); if (!cs.length) return ""; return `<div class="flat stack"><div class="row">${ART.seal(s.kanji, s.color, 34)}<b>${s.name}</b></div>${cs.map((c) => `<details class="ob-ch"><summary><label class="row" onclick="event.stopPropagation()"><input type="checkbox" data-all="${c.id}" style="width:22px;height:22px"> <span><b>${esc(c.title)}</b></span></label></summary><div class="in">${c.lessons.filter((l) => !l.stub).map((l) => `<label class="row small"><input type="checkbox" data-le="${l.id}" data-of="${c.id}" style="width:20px;height:20px"> ${esc(l.title)}</label>`).join("")}</div></details>`).join("")}</div>`; }).join("")}
          <button class="btn primary big" id="ob-go">C'est parti !</button></div>`;
        $$("[data-all]", main).forEach((i) => (i.onchange = () => { $$(`[data-of="${i.dataset.all}"]`, main).forEach((x) => { x.checked = i.checked; x.checked ? picked.add(x.dataset.le) : picked.delete(x.dataset.le); }); }));
        $$("[data-le]", main).forEach((i) => (i.onchange = () => { i.checked ? picked.add(i.dataset.le) : picked.delete(i.dataset.le); const all = $$(`[data-of="${i.dataset.of}"]`, main); $(`[data-all="${i.dataset.of}"]`, main).checked = all.every((x) => x.checked); }));
        $("#ob-go").onclick = async () => {
          picked.forEach((id) => STORE.openLesson(id)); S().v = 2; S().migrated2 = true;
          STORE.save(); applyAccent();
          await celebrate("始め！", `${ART.sensei("fire", 110)}<p><b>${esc(S().profile.name)}</b>, ton entraînement commence. Un peu chaque jour vaut mieux que beaucoup une fois : c'est le secret des maîtres.</p>`, "Au dōjō !");
          afterAction(); go("dojo", true);
        };
      }
    }
    draw();
  }

  // ---------- Dōjō : orbite des sept clans ----------
  const TIPS = [
    "Réviser <b>juste avant</b> d'oublier, c'est ce qui grave une notion pour longtemps. Je m'occupe du bon moment, toi tu frappes !",
    "Une nouvelle leçon en classe ? Ouvre-la dans son chapitre : <b>« Vu en classe »</b>.",
    "Ta prof a ajouté des choses au cours ? <b>Photographie la page</b> dans la leçon : on pourra l'enrichir.",
    "Dire la réponse <b>à voix haute</b> avant de retourner la carte, c'est deux fois plus efficace.",
    "Glisse une carte à <b>droite</b> si tu savais, à <b>gauche</b> si tu ne savais pas, <b>vers le haut</b> si c'était facile.",
    "Un yōkai te bloque ? Révise le chapitre, puis retente. Même les légendes ont perdu leurs premiers combats."
  ];
  function viewDojo(main) {
    const c = STORE.counts(); const d = S().days[STORE.today()] || { n: 0 }; const goal = S().settings.goal;
    const ses = STORE.buildSession().length, L = STORE.levelInfo();
    const mood = d.n >= goal ? "fire" : ses ? "happy" : "wow";
    const line = !STORE.activeChapters().length ? "Ouvre une première leçon dans un clan pour commencer ton entraînement !"
      : d.n >= goal ? `Objectif du jour atteint, <b>${esc(S().profile.name)}</b> ! Ta flamme brûle. Tu peux continuer ou défier un yōkai.`
        : ses ? `<b>${plural(ses, "carte")}</b> t'attendent aujourd'hui. ${pick(TIPS)}` : `Rien à réviser pour l'instant : tes souvenirs sont frais ! ${pick(TIPS)}`;
    main.innerHTML = `
      <section class="panel hero tone stack"><div class="speed"></div>
        ${senseiLine(line, mood)}
        <div><div class="row" style="justify-content:space-between"><span class="eyebrow">Ki du jour</span><span class="small muted">${Math.min(d.n, goal)} / ${goal} révisions</span></div>
        <div class="ki-meter">${Array.from({ length: 10 }, (_, i) => `<i class="${d.n >= ((i + 1) * goal) / 10 ? "on" : ""}" style="--i:${i}"></i>`).join("")}</div></div>
        ${ses ? `<button class="btn primary big pulse" data-go="seance">Révision du jour · ${ses}</button>` : `<button class="btn primary big" disabled>Tout est révisé ✓</button>${c.fresh ? `<button class="btn" id="more-new">Encore motivée ? +10 nouvelles cartes</button>` : ""}`}
        <button class="btn" id="flash">Entraînement éclair (10 questions)</button>
      </section>
      <div id="cartable" class="stack"></div>
      <div id="defis" class="stack"></div>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Les sept clans</h2><button class="btn ghost sm" id="orb-toggle">${S().settings.clanList ? "Orbite" : "Liste"}</button></div>
        <div id="clans"></div>${(() => { const g = STORE.stagesOf(STORE.allActiveCards()); return `<div class="stages"><div><b>${g.seen}</b><span>étudiées</span></div><div><b>${g.solid}</b><span>solides<br><i>tenues 1 sem.</i></span></div><div><b>${g.mastered}</b><span>maîtrisées<br><i>tenues 3 sem.</i></span></div><div><b>${c.total}</b><span>cartes<br><i>ouvertes</i></span></div></div>`; })()}</section>`;
    $("#flash").onclick = () => startFlashQuiz();
    const mn = $("#more-new"); if (mn) mn.onclick = () => { const t = STORE.today(); S().extraNew = { d: t, n: ((S().extraNew && S().extraNew.d === t) ? S().extraNew.n : 0) + 10 }; STORE.save(); go("seance"); };
    drawCartable(); drawDefis(); setTimeout(foyerReminder, 3600);
    const nw = S().newWeek;
    if (nw && STORE.CHI[nw.ch]) {
      S().newWeek = null; STORE.save();
      const c = STORE.CHI[nw.ch], row = c.schedule.grid[nw.week - 1] || [];
      setTimeout(() => celebrate("今週の型！", `${ART.sensei("fire", 100)}<p><b>${esc(c.title)}</b> · semaine ${nw.week}</p><p>À apprendre : <b>${fichesTxt(row.slice(0, 2))}</b>${row.length > 2 ? `<br>À réviser : <b>${fichesTxt(row.slice(2))}</b> (je les remets en tête de tes révisions)` : ""}</p>`, "C'est parti !", "level"), (S().newFromRepo || []).length ? 3200 : 500);
    }
    const fresh = (S().newFromRepo || []).filter((id) => STORE.LEI[id]);
    if (fresh.length) {
      S().newFromRepo = []; STORE.save();
      setTimeout(() => celebrate("新しい巻物！", `${ART.sensei("wow", 100)}<p>Ren t'apporte <b>${plural(fresh.length, "leçon")}</b> tirée${fresh.length > 1 ? "s" : ""} du cours de ta prof :</p><ul class="small" style="text-align:left">${fresh.slice(0, 6).map((id) => `<li>${esc(STORE.LEI[id].title)} <span class="muted">(${esc(STORE.SUBI[STORE.CHI[STORE.LEI[id].ch].s].name)})</span></li>`).join("")}${fresh.length > 6 ? `<li class="muted">… et ${fresh.length - 6} autres</li>` : ""}</ul>`, "Au travail !", "win"), 400);
    }
    $("#orb-toggle").onclick = () => { S().settings.clanList = !S().settings.clanList; STORE.save(); render(); };
    const clans = PROGRAMME.subjects.map((s) => { const k = STORE.counts((ch) => ch.s === s.id); const nAct = STORE.activeChapters().filter((ch) => ch.s === s.id).length; return { s, k, nAct }; });
    if (S().settings.clanList) {
      $("#clans").innerHTML = `<div class="clans">${clans.map(({ s, k, nAct }) => `<button class="clan" data-go="clan~${s.id}">${ART.seal(s.kanji, s.color, 42, !nAct)}<span><span class="nm">${s.short || s.name}</span><br><span class="sb">${s.clan}</span><br><span class="sb">${nAct ? `${k.total ? Math.round((100 * k.seen) / k.total) : 0} % découvert` : "à ouvrir"}</span></span>${k.due ? `<span class="due">${k.due}</span>` : ""}</button>`).join("")}</div>`;
      return;
    }
    $("#clans").innerHTML = `<div class="orbit" id="orbit"><div class="orb-center">${ART.avatar(S().profile.element, L.level, 96)}<span class="tiny muted">niv. ${L.level}</span></div>
      ${clans.map(({ s, k, nAct }, i) => `<button class="orb-v" data-go="clan~${s.id}" style="--i:${i};--c:${s.color}" aria-label="${s.name}">${ART.seal(s.kanji, s.color, 58, !nAct)}<span class="orb-n">${s.short || s.name}</span>${k.due ? `<span class="due">${k.due}</span>` : ""}</button>`).join("")}</div>
      <div class="orb-nav"><button class="btn ghost sm" id="orb-prev" aria-label="Tourner vers la gauche">‹</button><span class="tiny muted">Tourne la roue · touche le clan de devant</span><button class="btn ghost sm" id="orb-next" aria-label="Tourner vers la droite">›</button></div>`;
    orbitStop = startOrbit($("#orbit"));
  }
  // Roue des clans : elle ne tourne que sous le doigt. Glisser pour tourner (avec élan), la roue se cale
  // sur un clan ; toucher le clan de devant l'ouvre, toucher un autre clan l'amène devant.
  function startOrbit(box) {
    const sats = $$(".orb-v", box), n = sats.length, step = (2 * Math.PI) / n, FRONT = Math.PI / 2;
    const norm = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const frontIdx = (b) => { let best = 0, bd = 9; sats.forEach((_, i) => { const d = Math.abs(norm(b + i * step - FRONT + Math.PI) - Math.PI); if (d < bd) { bd = d; best = i; } }); return best; };
    let base = FRONT - (S().settings.orbitFront || 0) * step, raf = 0, vel = 0, anim = null, drag = null, lastFront = -1;
    const place = () => {
      const W = box.clientWidth, H = box.clientHeight, R = W * 0.38;
      sats.forEach((s, i) => {
        const a = base + i * step, depthv = (Math.sin(a) + 1) / 2; // 0 = derrière, 1 = devant
        s.style.left = W / 2 + Math.cos(a) * R + "px"; s.style.top = H / 2 - 10 + Math.sin(a) * R * 0.58 + "px";
        s.style.setProperty("--ech", (0.72 + depthv * 0.36).toFixed(3)); s.style.zIndex = Math.round(depthv * 10) + (depthv > 0.5 ? 3 : 0);
        s.style.setProperty("--lbl", depthv < 0.3 ? 0 : Math.min(1, (depthv - 0.3) * 3).toFixed(2)); s.style.setProperty("--fl", ((1 - depthv) * 1.2).toFixed(2) + "px"); s.style.opacity = (0.55 + depthv * 0.45).toFixed(2);
      });
      const f = frontIdx(base);
      if (f !== lastFront) { sats.forEach((s, i) => s.classList.toggle("front", i === f)); if (lastFront >= 0 && drag) FX.sfx("tap"); lastFront = f; }
    };
    const snapTo = (target) => {
      cancelAnimationFrame(raf); const from = base, t0 = performance.now(), dur = FX.reduce() ? 1 : 420;
      anim = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); base = from + (target - from) * e; place(); if (k < 1) raf = requestAnimationFrame(anim); else { anim = null; S().settings.orbitFront = frontIdx(base); STORE.save(); } };
      raf = requestAnimationFrame(anim);
    };
    const nearest = (b) => { const i = frontIdx(b); let t = FRONT - i * step; while (t - b > Math.PI) t -= 2 * Math.PI; while (b - t > Math.PI) t += 2 * Math.PI; return t; };
    const bringFront = (i) => { let t = FRONT - i * step; while (t - base > Math.PI) t -= 2 * Math.PI; while (base - t > Math.PI) t += 2 * Math.PI; snapTo(t); };
    const coast = () => { // élan après le lâcher, puis calage
      cancelAnimationFrame(raf); let last = performance.now();
      const run = (t) => { const dt = Math.min(40, t - last); last = t; base += vel * dt; vel *= Math.pow(0.992, dt); place(); if (Math.abs(vel) > 0.0006 && !FX.reduce()) raf = requestAnimationFrame(run); else snapTo(nearest(base)); };
      raf = requestAnimationFrame(run);
    };
    box.style.touchAction = "pan-y";
    box.addEventListener("pointerdown", (e) => { cancelAnimationFrame(raf); drag = { x: e.clientX, b: base, t: performance.now(), moved: false, lx: e.clientX, lt: performance.now() }; vel = 0; });
    box.addEventListener("pointermove", (e) => {
      if (!drag) return; const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; box.setPointerCapture && box.setPointerCapture(e.pointerId); }
      if (!drag.moved) return;
      const R = box.clientWidth * 0.38, nb = drag.b - dx / R, now = performance.now();
      vel = (nb - base) / Math.max(8, now - drag.lt); drag.lt = now; base = nb; place();
    });
    const end = () => { if (!drag) return; const moved = drag.moved; drag = moved ? { moved: true, done: true } : null; if (moved) coast(); setTimeout(() => (drag = null), 0); };
    box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end);
    // Clic : après un glissé on ignore ; sur un clan qui n'est pas devant, on l'amène devant au lieu d'ouvrir.
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".orb-v"); if (!b) return;
      if (drag && drag.moved) { e.preventDefault(); e.stopPropagation(); return; }
      const i = sats.indexOf(b);
      if (i !== frontIdx(base)) { e.preventDefault(); e.stopPropagation(); FX.sfx("tap"); bringFront(i); }
    }, true);
    const prev = $("#orb-prev"), next = $("#orb-next");
    if (prev) prev.onclick = () => { FX.sfx("tap"); bringFront((frontIdx(base) + 1) % n); };
    if (next) next.onclick = () => { FX.sfx("tap"); bringFront((frontIdx(base) + n - 1) % n); };
    box.tabIndex = 0; box.setAttribute("aria-label", "Roue des clans : flèches gauche et droite pour tourner, Entrée pour ouvrir");
    box.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { e.preventDefault(); prev && prev.click(); } else if (e.key === "ArrowRight") { e.preventDefault(); next && next.click(); } else if (e.key === "Enter") { e.preventDefault(); go(sats[frontIdx(base)].dataset.go); } });
    place();
    addEventListener("resize", place);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", place); };
  }

  // ---------- Clan ----------
  function viewClan(main, sid) {
    const s = sub(sid); if (!s) return go("dojo", true);
    const chs = STORE.CH.filter((c) => c.s === sid).sort((a, b) => (a.period || 9) - (b.period || 9));
    const k = STORE.counts((ch) => ch.s === sid);
    main.innerHTML = `<button class="back" data-go="dojo">← Dōjō</button>
      <section class="panel tone clan-head" style="--accent:${s.color}">${ART.seal(s.kanji, s.color, 64)}<div><p class="eyebrow">${s.clan}</p><h1>${s.name}</h1><p class="motto small">${s.motto}</p></div>${ring(k.total ? k.mastered / k.total : 0, s.color, 58, k.total ? Math.round((100 * k.mastered) / k.total) + "%" : "–")}</section>
      <div class="row wrap"><button class="btn primary" data-go="seance~s:${sid}" ${STORE.buildSession({ subject: sid }).length ? "" : "disabled"}>Réviser ce clan</button><span class="small muted">${k.due} à revoir · ${k.fresh} nouvelles · ${k.mastered} maîtrisées</span></div>
      <section class="stack"><h2>Chapitres</h2>${chs.map((c) => { const st = STORE.chapterState(c.id); const nOpen = STORE.openLessons(c).length; return `<button class="chapter ${st !== "locked" ? "on" : "off"}" data-go="ch~${c.id}"><span class="kj" style="color:${st !== "locked" ? s.color : ""}">${c.kanji || s.kanji}</span><span><span class="t">${esc(c.title)}</span><br><span class="tiny muted">${nOpen}/${c.lessons.length} leçons ouvertes${c.stub ? " · plan à venir" : ""}${c.fromPack ? " · pack" : ""}</span><span class="lessbar">${c.lessons.map((l) => `<i class="${STORE.lessonOpen(l.id) ? "on" : l.stub ? "plan" : ""}"></i>`).join("")}</span></span>${st === "done" ? '<span class="pill done">terminé</span>' : st === "active" ? '<span class="pill on">en cours</span>' : '<span class="pill off">fermé</span>'}</button>`; }).join("")}</section>
      <p class="tiny muted">Source : ${esc(PROGRAMME.sources[s.src].label)}. Le découpage en leçons suit une progression type, non officielle.</p>`;
  }

  // ---------- Fiche ----------
  function renderFiche(blocks) {
    return (blocks || []).map((b) => {
      if (b.h) return `<h3>${md(b.h)}</h3>`;
      if (b.p) return `<p>${md(b.p)}</p>`;
      if (b.def) return `<div class="def"><span class="dt">${md(b.def[0])}</span>${md(b.def[1])}</div>`;
      if (b.list) return `<ul>${b.list.map((x) => `<li>${md(x)}</li>`).join("")}</ul>`;
      if (b.tip) return `<div class="tip">${ART.sensei("happy", 44)}<span>${md(b.tip)}</span></div>`;
      if (b.fig) return ART.FIG[b.fig] || "";
      if (b.svg) return `<div class="figbox">${b.svg}</div>`;
      if (b.table) return `<div class="tablewrap"><table><thead><tr>${b.table[0].map((x) => `<th>${md(x)}</th>`).join("")}</tr></thead><tbody>${b.table.slice(1).map((r) => `<tr>${r.map((x) => `<td>${md(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      return "";
    }).join("");
  }
  const refsBlock = (refs) => `<div class="refs">${(refs || []).map((r) => { const it = STORE.REFI[r]; return `<div class="ref"><code>${esc(r)}</code><span><b>${esc(it ? it.t : "Référence inconnue")}</b>${it ? ` — ${esc(it.d)}` : ""}</span></div>`; }).join("")}</div>`;

  // ---------- Chapitre ----------
  function viewChapter(main, cid) {
    const c = STORE.CHI[cid]; if (!c) return go("dojo", true);
    const s = sub(c.s), st = STORE.chapterState(cid), cards = STORE.cardList(c);
    const seen = cards.filter((x) => !STORE.isNew(x.id)).length, ratio = cards.length ? seen / cards.length : 0;
    const bossOk = st !== "locked" && c.boss && cards.length >= 4 && ratio >= 0.5; const bw = S().bosses[cid];
    const closedFilled = c.lessons.filter((l) => !l.stub && !STORE.lessonOpen(l.id));
    main.innerHTML = `<button class="back" data-go="clan~${c.s}">← ${s.clan}</button>
      <section class="panel stack" style="--accent:${s.color}">
        <div class="row"><span class="kj big-kj" style="color:${s.color}">${c.kanji || s.kanji}</span><div><p class="eyebrow">${s.name}${c.period ? ` · période ${c.period}` : ""}</p><h1>${esc(c.title)}</h1></div></div>
        ${c.sum ? `<p class="muted">${md(c.sum)}</p>` : ""}
        <div class="row wrap">${cards.length ? `<button class="btn primary" data-go="seance~c:${cid}">Réviser le chapitre (${cards.length})</button>` : ""}${closedFilled.length ? `<button class="btn" id="open-all">Tout ouvrir</button>` : ""}${st === "active" ? `<button class="btn ghost sm" id="finish">Terminé en classe</button>` : st === "done" ? `<span class="pill done">terminé en classe</span>` : ""}</div>
        ${st !== "locked" && cards.length && c.boss ? `<div class="small muted">${seen} / ${cards.length} cartes découvertes · yōkai ${bossOk ? "prêt au combat" : "réveillé à 50 %"}</div>` : ""}
      </section>
      ${c.schedule ? weekPanel(c) : ""}
      ${(c.photos || []).length ? `<section class="stack"><h2>Pages du cahier</h2>${photoStrip(c.photos)}</section>` : ""}
      <section class="stack"><h2>Leçons</h2><div class="lessons">${c.lessons.map((l, i) => { const open = STORE.lessonOpen(l.id), lc = STORE.lessonCards(c, l), k = STORE.countsOf(lc); return `<div class="lesson ${open ? "on" : l.stub ? "plan" : ""}" style="--i:${i}"><button class="lesson-main" data-go="le~${l.id}"><span class="num">${i + 1}</span><span><span class="t">${esc(l.title)}</span><br><span class="tiny muted">${l.userMade ? "Leçon photo · " : ""}${l.stub ? "Plan · à remplir par photo ou pack" : `${plural(lc.length, "carte")}${open ? ` · ${k.seen} vues` : ""}`}</span></span></button>${open ? `<span class="pill on">ouverte</span>` : `<button class="btn sm ${l.stub ? "ghost" : "primary"}" data-open="${l.id}">Vu en classe</button>`}</div>`; }).join("")}</div>
        <button class="btn ghost" id="add-lesson">＋ Nouvelle leçon photo dans ce chapitre</button></section>
      ${c.boss && st !== "locked" ? `<section class="panel boss-card">${ART.yokai(cid, { size: 84, ally: bw && bw.won, angry: !(bw && bw.won) })}<div class="stack" style="flex:1"><b>${esc(c.boss.name)}</b><span class="small muted">${bw && bw.won ? "Vaincu : il a rejoint tes alliés !" : "Gardien du chapitre"}</span><button class="btn sm ${bossOk ? "primary" : ""}" data-go="boss~${cid}" ${bossOk ? "" : "disabled"}>${bw && bw.won ? "Revanche" : "Combattre"}</button></div></section>` : ""}
      <details><summary>Programme officiel lié (${(c.refs || []).length})</summary><div class="in">${refsBlock(c.refs)}</div></details>`;
    $$("[data-open]", main).forEach((b) => (b.onclick = (e) => { e.stopPropagation(); unlockLesson(b.dataset.open, b); }));
    bindPhotoStrip(main, c.photos || []);
    const oa = $("#open-all"); if (oa) oa.onclick = () => { closedFilled.forEach((l) => STORE.openLesson(l.id)); STORE.addXP(10 * closedFilled.length); STORE.save(); FX.sfx("stamp"); FX.burst(...FX.center(oa), { color: s.color, n: 30 }); afterAction(); render(); };
    const fin = $("#finish"); if (fin) fin.onclick = () => { S().chapters[cid] = Object.assign(S().chapters[cid] || {}, { state: "done" }); STORE.save(); toast("Chapitre terminé en classe. Il reste dans tes révisions."); render(); };
    $("#add-lesson").onclick = () => { newLessonTarget = { s: c.s, ch: cid }; go("moi~nouvelle"); };
  }
  const fichesTxt = (a) => a.length ? a.map((f) => "n° " + f).join(", ") : "—";
  function weekPanel(c) {
    const sc = c.schedule, w = STORE.classWeek(sc), row = sc.grid[w - 1] || [], next = sc.grid[w] || null;
    const zoneWarn = !S().settings.zone && STORE.today() >= "2027-01-20" ? `<p class="small" style="color:var(--bad)"><b>Choisis ta zone de vacances</b> dans Moi → Réglages, pour que les semaines sautent bien les vacances d'hiver et de printemps.</p>` : "";
    if (!w) return `<section class="flat"><p class="small">Le programme commence le ${esc(sc.start)}.</p></section>`;
    if (w > sc.grid.length) return `<section class="flat"><p class="small">Toutes les fiches de la grille sont débloquées. Bravo !</p></section>`;
    return `<section class="panel week"><p class="eyebrow">Semaine de cours ${w} · depuis le ${esc(STORE.weekStart(sc, w).split("-").reverse().join("/"))}</p>
      <div class="week-row"><span class="pill new">À apprendre</span><b>${fichesTxt(row.slice(0, 2))}</b></div>
      ${row.length > 2 ? `<div class="week-row"><span class="pill on">À réviser</span><b>${fichesTxt(row.slice(2))}</b></div>` : ""}
      ${next ? `<p class="tiny muted">Semaine prochaine : ${fichesTxt(next.slice(0, 2))}${next.length > 2 ? ` · révision ${fichesTxt(next.slice(2))}` : ""}. Les fiches s'ouvrent toutes seules chaque lundi de cours (vacances sautées).</p>` : ""}${zoneWarn}</section>`;
  }
  function photoStrip(list) { return `<div class="photos cahier">${list.map((p, i) => `<figure><img src="${esc(p.src)}" alt="${esc(p.cap || "Page du cahier")}" loading="lazy" data-ph="${i}"><figcaption>${esc(p.cap || "")}</figcaption></figure>`).join("")}</div>`; }
  function bindPhotoStrip(root, list) { $$(".cahier img", root).forEach((im) => (im.onclick = () => lightbox(im.src, null, null, list[+im.dataset.ph].cap))); }
  function unlockLesson(lid, btn) {
    const l = STORE.LEI[lid]; STORE.openLesson(lid); const up = STORE.addXP(20); STORE.save();
    FX.sfx("stamp"); FX.buzz(25);
    const [x, y] = FX.center(btn); FX.burst(x, y, { color: sub(STORE.CHI[l.ch].s).color, n: 26, speed: 5 }); fxText("開！", x, y);
    if (l.stub) toast("Leçon ouverte. Ajoute les photos de ton cours pour la remplir.");
    afterAction(); levelUpCheck(up); setTimeout(render, 350);
  }

  // ---------- Leçon ----------
  let newLessonTarget = null;
  async function viewLesson(main, lid) {
    const l = STORE.LEI[lid]; if (!l) return go("dojo", true);
    const c = STORE.CHI[l.ch], s = sub(c.s), open = STORE.lessonOpen(lid), lc = STORE.lessonCards(c, l), idx = c.lessons.indexOf(l);
    const kinds = { f: "par cœur", q: "QCM", i: "à taper", g: "générés", s: "à classer", o: "à ordonner", p: "à associer", m: "sur la carte" };
    const kc = {}; lc.forEach((x) => (kc[x.k] = (kc[x.k] || 0) + 1));
    main.innerHTML = `<button class="back" data-go="ch~${c.id}">← ${esc(c.title)}</button>
      <section class="panel stack" style="--accent:${s.color}">
        <p class="eyebrow">${s.name} · leçon ${idx + 1}/${c.lessons.length}</p><h1>${esc(l.title)}</h1>
        ${lc.length ? `<div class="kinds">${Object.entries(kc).map(([k, n]) => `<span class="pill">${n} ${kinds[k] || k}</span>`).join("")}</div>` : ""}
        <div class="row wrap">${open ? (lc.length ? `<button class="btn primary" data-go="seance~l:${lid}">Réviser cette leçon</button>` : "") : `<button class="btn primary pulse" id="le-open">Vu en classe : ouvrir</button>`}${open ? `<button class="btn ghost sm" id="le-close">Refermer</button>` : ""}</div>
      </section>
      ${l.fiche ? `<section class="panel fiche" style="--accent:${s.color}"><p class="eyebrow">${l.fromTeacher ? "Fiche · d'après le cours de ta prof" : "Fiche"}</p>${l.note ? `<p class="small muted">${md(l.note)}</p>` : ""}${renderFiche(l.fiche)}</section>` : l.stub ? `<section class="flat">${senseiLine("Cette leçon est encore vide : c'est un <b>plan</b>. Quand ta prof la fait en classe, photographie ton cours ci-dessous et envoie-le pour qu'il devienne cartes et exercices.", "think")}</section>` : ""}
      ${(l.extra || []).map((x) => `<section class="extra fiche"><p class="eyebrow">Ajouts de ta prof</p>${x.note ? `<p>${md(x.note)}</p>` : ""}${renderFiche(x.fiche)}</section>`).join("")}
      ${(l.photos || []).length ? `<section class="stack"><h2>Pages du cahier</h2>${photoStrip(l.photos)}</section>` : ""}
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Mes photos de cours</h2><label class="btn sm">Ajouter<input type="file" accept="image/*" capture="environment" multiple id="ph-in" hidden></label></div><div class="photos" id="ph"></div><div id="ph-share"></div></section>
      <details><summary>Programme officiel lié</summary><div class="in">${refsBlock(l.refs || c.refs)}</div></details>
      <div class="row" style="justify-content:space-between">${c.lessons[idx - 1] ? `<button class="btn ghost sm" data-go="le~${c.lessons[idx - 1].id}">← Précédente</button>` : "<span></span>"}${c.lessons[idx + 1] ? `<button class="btn ghost sm" data-go="le~${c.lessons[idx + 1].id}">Suivante →</button>` : ""}</div>`;
    const lo = $("#le-open"); if (lo) lo.onclick = () => unlockLesson(lid, lo);
    bindPhotoStrip(main, l.photos || []);
    const lcb = $("#le-close"); if (lcb) lcb.onclick = (e) => { if (e.target.dataset.sure) { STORE.closeLesson(lid); STORE.save(); render(); } else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer (tes progrès sont gardés)"; } };
    $("#ph-in").onchange = async (e) => { const files = Array.from(e.target.files || []); for (const f of files) await STORE.addPhoto(lid, f); toast(files.length > 1 ? `${files.length} photos ajoutées` : "Photo ajoutée"); FX.sfx("drop"); afterAction(); drawPhotos(); };
    async function drawPhotos() {
      const ps = (await STORE.photos(lid)).concat(idx === 0 ? await STORE.photos(c.id) : []); const box = $("#ph"); if (!box) return;
      box.innerHTML = ps.length ? "" : `<p class="small muted" style="grid-column:1/-1">Aucune photo. Photographie les pages de ton cahier pour garder les notions ajoutées par ta prof.</p>`;
      ps.forEach((p) => { const u = URL.createObjectURL(p.blob); const im = document.createElement("img"); im.src = u; im.alt = "Photo de cours"; im.onclick = () => lightbox(u, p.id, drawPhotos); box.appendChild(im); });
      const sh = $("#ph-share");
      if (ps.length && navigator.canShare) {
        const files = ps.map((p, i) => new File([p.blob], `hikari-${lid}-${i + 1}.jpg`, { type: "image/jpeg" }));
        if (navigator.canShare({ files })) {
          sh.innerHTML = `<button class="btn sm" id="ph-send">Envoyer les photos pour enrichissement</button>`;
          $("#ph-send").onclick = () => navigator.share({ files, title: `Hikari — ${l.title}`, text: `Hikari · chapitre ${c.id} · leçon ${lid} (${s.name}) : ${l.title}\nRéférences : ${(l.refs || c.refs || []).join(", ")}` }).catch(() => { });
        }
      } else if (ps.length) sh.innerHTML = `<p class="tiny muted">Identifiant à transmettre avec les photos : <code>${esc(lid)}</code></p>`;
    }
    drawPhotos();
  }
  function lightbox(url, id, redraw, cap) {
    const l = document.createElement("div"); l.className = "lightbox";
    l.innerHTML = `<div class="stack sheetbox" style="align-items:center"><img src="${url}" alt="Photo de cours">${cap ? `<p class="small" style="color:#fff">${esc(cap)}</p>` : ""}<div class="row"><button class="btn sm" id="lb-close">Fermer</button>${id ? `<button class="btn sm" id="lb-del">Supprimer</button>` : ""}</div></div>`;
    document.body.appendChild(l);
    $("#lb-close", l).onclick = () => l.remove();
    l.onclick = (e) => { if (e.target === l) l.remove(); };
    if (id) $("#lb-del", l).onclick = async (e) => { if (e.target.dataset.sure) { await STORE.delPhoto(id); l.remove(); redraw(); } else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer la suppression"; } };
  }

  // ---------- Vérification des réponses tapées ----------
  const norm = (s) => String(s).toLowerCase().normalize("NFC").replace(/[’`´]/g, "'").replace(/[.!?¡¿«»"]+/g, "").replace(/\s+/g, " ").trim();
  const noAcc = (s) => norm(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  function checkInput(val, card) {
    if (card.num != null) { const m = String(val).replace(/[\s  ]/g, "").replace(",", ".").match(/^-?\d*\.?\d+/); return { ok: !!m && Math.abs(parseFloat(m[0]) - card.num) < 1e-9 }; }
    const answers = card.a || [];
    if (card.caseSensitive) { const v = String(val).trim().replace(/[.!?]+$/, ""); if (answers.some((a) => a === v)) return { ok: true }; if (answers.some((a) => norm(a) === norm(v))) return { ok: false, note: "Presque : attention à la majuscule !" }; }
    if (answers.some((a) => norm(a) === norm(val))) return { ok: true };
    if (answers.some((a) => noAcc(a) === noAcc(val))) return { ok: true, note: "Juste, mais attention aux accents !" };
    return { ok: false };
  }
  function instantiate(card) {
    let q = card.k === "g" ? Object.assign({}, GEN.run(card.g, card), { id: card.id, ch: card.ch, le: card.le, g: card.g, bonus: card.bonus, focus: card.focus }) : Object.assign({}, card);
    if (q.k === "q") { const order = shuffle(q.c.map((_, i) => i)); q.choices = order.map((i) => q.c[i]); q.good = order.indexOf(q.a); }
    return q;
  }

  // ---------- Glisser au doigt (pointer events, fonctionne au tactile) ----------
  function dragChip(elm, { onMove, onDrop, onTap }) {
    elm.addEventListener("pointerdown", (e) => {
      if (elm.classList.contains("placed")) return;
      e.preventDefault(); const r = elm.getBoundingClientRect(); const ox = e.clientX - r.left, oy = e.clientY - r.top; let moved = false, ghost = null;
      const mv = (ev) => {
        if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 6) return;
        if (!moved) { moved = true; ghost = elm.cloneNode(true); ghost.classList.add("drag-ghost"); ghost.style.width = r.width + "px"; document.body.appendChild(ghost); elm.classList.add("lifted"); FX.sfx("pick"); FX.buzz(8); }
        ghost.style.left = ev.clientX - ox + "px"; ghost.style.top = ev.clientY - oy + "px"; onMove && onMove(ev.clientX, ev.clientY);
      };
      const up = (ev) => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); if (ghost) ghost.remove(); elm.classList.remove("lifted"); if (moved) onDrop(ev.clientX, ev.clientY); else onTap && onTap(); };
      addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
    });
  }
  const under = (x, y, sel) => { const t = document.elementFromPoint(x, y); return t && t.closest(sel); };

  // ---------- Carte d'exercice (révision, boss, éclair) ----------
  let combo = 0;
  function feedback(ok, host) {
    const [x, y] = FX.center(host);
    if (ok) {
      combo++; S().stats.bestCombo = Math.max(S().stats.bestCombo, combo);
      FX.sfx("good", combo); FX.buzz(15); FX.burst(x, y, { color: el().c, n: 14 + Math.min(combo, 10) * 2, speed: 4 + Math.min(combo, 10) * 0.4, life: 40 });
      if (host) { host.classList.remove("glow-ok"); void host.offsetWidth; host.classList.add("glow-ok"); }
      if (combo >= 3) fxText(combo % 5 === 0 ? `COMBO ×${combo} !` : pick(el().fx));
      if (combo % 5 === 0) { FX.sfx("combo", combo); FX.burst(innerWidth / 2, innerHeight * 0.35, { n: 50, speed: 9, colors: [el().c, "#E8B923", "#fff"] }); }
    } else {
      combo = 0; FX.sfx("bad"); FX.buzz([40, 40, 40]);
      if (host) { host.classList.remove("shake-soft"); void host.offsetWidth; host.classList.add("shake-soft"); }
    }
    const cb = $(".combo"); if (cb) { cb.innerHTML = combo >= 2 ? `<span class="k">炎</span>×${combo}` : ""; cb.style.setProperty("--heat", Math.min(combo, 15) / 15); }
  }
  // « Je ne sais pas » : montre la réponse et compte la carte comme ratée (pas de chance au hasard).
  function mountCard(host, card, opts = {}) {
    let settled = false; const onDone = (r) => { if (settled) return; settled = true; opts.onDone && opts.onDone(r); };
    mountCardCore(host, card, Object.assign({}, opts, { onDone }));
    const q = card, body = host.querySelector(".card"), after = body && $("#after", body);
    if (!body || !after || !"qisop".includes(q.k)) return;
    const b = document.createElement("button"); b.className = "btn ghost idk"; b.type = "button"; b.textContent = "Je ne sais pas"; after.after(b);
    b.onclick = () => {
      if (after.innerHTML.trim()) return;
      body.classList.add("idk-lock"); b.remove(); FX.sfx("flip");
      if (q.k === "q") $$(".choice", body).forEach((x) => { x.disabled = true; if (+x.dataset.i === q.good) x.classList.add("good"); });
      const ans = q.k === "q" ? md(q.choices[q.good]) : q.k === "i" ? md(q.a[0])
        : q.k === "s" ? q.bins.map((bn, bi) => `<b>${md(bn)}</b> : ${q.items.filter((it) => it[1] === bi).map((it) => md(it[0])).join(", ")}`).join("<br>")
        : q.k === "o" ? q.items.map((t, i) => `${i + 1}. ${md(t)}`).join("<br>") : q.pairs.map(([l, r]) => `${md(l)} ↔ ${md(r)}`).join("<br>");
      after.innerHTML = `<p class="verdict idk-v">Pas grave : bien joué d'être honnête. Voici la réponse :</p>${q.k === "q" ? "" : `<p class="${q.k === "i" ? "big" : "small"}">${ans}</p>`}${q.x ? `<p class="x">${md(q.x)}</p>` : ""}<p class="tiny muted">Cette carte reviendra bientôt pour que tu la retiennes.</p><button class="btn primary big" id="nx">Suite</button>`;
      const nx = $("#nx", after); nx.focus(); nx.onclick = () => onDone({ ok: false, grade: 0, idk: true });
    };
  }
  function mountCardCore(host, card, { selfGrade = true, onDone } = {}) {
    const ch = STORE.CHI[card.ch], s = ch && sub(ch.s), le = card.le && STORE.LEI[card.le];
    const head = s ? `<div class="src">${ART.seal(s.kanji, s.color, 22)}<span>${esc(le ? le.title : ch.title)}</span>${card.bonus ? `<span class="revanche" title="Carte tirée d'une erreur d'interro : XP ×3">⚔ Revanche ×3</span>` : ""}${card.focus ? `<span class="revanche focus-b" title="Leçon de ton agenda">${AGENDA.TYPES[card.focus.type] ? AGENDA.TYPES[card.focus.type][1] : "🎯"} ${esc(focusWhen(card.focus))}</span>` : ""}</div>` : "";
    const q = card;
    const expl = () => (q.x ? `<p class="x">${md(q.x)}</p>` : "");
    const body = document.createElement("div"); body.className = "panel card enter"; body.style.setProperty("--accent", s ? s.color : "");
    host.innerHTML = ""; host.appendChild(body);
    let finished = false; const done = (r) => { if (finished) return; finished = true; onDone(r); };

    // --- Par cœur : carte qui se retourne, puis se glisse ---
    if (q.k === "f") {
      body.classList.add("flipcard"); body.classList.remove("panel");
      body.innerHTML = `<div class="flip-in"><div class="face front panel">${head}<div class="q">${md(q.q)}</div>${q.fig ? ART.FIG[q.fig] || "" : ""}${q.svg || ""}<p class="hint">Touche la carte pour la retourner</p></div><div class="face back panel">${head}<div class="q small-q">${md(q.q)}</div><div class="ans">${md(q.a)}${expl()}</div><p class="hint">← je ne savais pas · je savais → · ↑ facile</p></div><div class="stamp-lbl l">RATÉ</div><div class="stamp-lbl r">BIEN</div><div class="stamp-lbl u">FACILE</div></div>`;
      const act = document.createElement("div"); act.className = "stack"; act.innerHTML = `<button class="btn primary big" id="rev">Retourner</button>`; host.appendChild(act);
      const inner = $(".flip-in", body); let flipped = false;
      const flip = () => { if (flipped) return; flipped = true; body.classList.add("flipped"); FX.sfx("flip");
        const prev = (g) => { const saved = S().cards[q.id]; const tmp = saved ? JSON.parse(JSON.stringify(saved)) : null; const r = STORE.grade(q.id, g); if (tmp) S().cards[q.id] = tmp; else delete S().cards[q.id]; return g === 0 ? "10 min" : r.ivl + " j"; };
        act.innerHTML = selfGrade ? `<div class="grades">${[["Raté", 0], ["Dur", 1], ["Bien", 2], ["Facile", 3]].map(([n, g]) => `<button class="g${g}" data-g="${g}">${n}<span>${prev(g)}</span></button>`).join("")}</div>`
          : `<div class="row"><button class="btn" data-g="0" style="flex:1">Je ne savais pas</button><button class="btn primary" data-g="2" style="flex:1">Je savais</button></div>`;
        $$("[data-g]", act).forEach((b) => (b.onclick = () => fly(+b.dataset.g)));
      };
      const fly = (g) => { FX.sfx("swipe"); const dx = g === 0 ? -1 : g === 3 ? 0 : 1; inner.style.transition = "transform .35s ease-in, opacity .35s"; inner.style.transform = `translate(${dx * 140}%, ${g === 3 ? -120 : 10}%) rotate(${dx * 18}deg)`; inner.style.opacity = "0"; setTimeout(() => done({ ok: g > 0, grade: g }), 300); };
      $("#rev", act).onclick = flip;
      // gestes : tap = retourner ; glisser = noter
      let sx = 0, sy = 0, dragging = false;
      inner.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; dragging = flipped; if (dragging) inner.setPointerCapture(e.pointerId); inner.style.transition = "none"; });
      inner.addEventListener("pointermove", (e) => {
        if (!dragging) return; const dx = e.clientX - sx, dy = e.clientY - sy;
        inner.style.transform = `translate(${dx}px, ${Math.min(0, dy) * 0.9}px) rotate(${dx / 18}deg)`;
        body.style.setProperty("--l", Math.max(0, -dx / 110).toFixed(2)); body.style.setProperty("--r", Math.max(0, dx / 110).toFixed(2)); body.style.setProperty("--u", Math.max(0, -dy / 110 - Math.abs(dx) / 200).toFixed(2));
      });
      inner.addEventListener("pointerup", (e) => {
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!flipped) { if (Math.hypot(dx, dy) < 10) flip(); return; }
        dragging = false; body.style.setProperty("--l", 0); body.style.setProperty("--r", 0); body.style.setProperty("--u", 0);
        if (dy < -100 && Math.abs(dx) < 90 && selfGrade) return fly(3);
        if (dx > 100) return fly(2); if (dx < -100) return fly(0);
        inner.style.transition = "transform .25s cubic-bezier(.3,1.4,.5,1)"; inner.style.transform = "";
      });
      return;
    }
    // --- QCM ---
    if (q.k === "q") {
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div>${q.svg || ""}<div class="choices">${q.choices.map((c, i) => `<button class="choice" data-i="${i}" style="--i:${i}">${md(c)}</button>`).join("")}</div><div id="after"></div>`;
      $$(".choice", body).forEach((b) => (b.onclick = () => {
        const i = +b.dataset.i, ok = i === q.good;
        $$(".choice", body).forEach((x) => { x.disabled = true; if (+x.dataset.i === q.good) x.classList.add("good"); });
        if (!ok) b.classList.add("bad");
        feedback(ok, ok ? b : body);
        $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? pick(["Excellent !", "Sugoi !", "Parfait !", "Bien vu !"]) : "Pas cette fois…"}</p>${expl()}<button class="btn primary big" id="nx">Suite</button>`;
        $("#nx", body).focus(); $("#nx", body).onclick = () => done({ ok, grade: ok ? 2 : 0 });
      }));
      return;
    }
    // --- Réponse tapée ---
    if (q.k === "i") {
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div>${q.svg || ""}<form id="f" class="stack"><input type="text" id="inp" autocomplete="off" autocapitalize="off" spellcheck="false" ${q.num != null ? 'inputmode="decimal"' : ""} placeholder="Ta réponse"><button class="btn primary big">Valider</button></form><div id="after"></div>`;
      const inp = $("#inp", body); setTimeout(() => inp.focus(), 60);
      $("#f", body).onsubmit = (e) => {
        e.preventDefault(); const v = inp.value; if (!v.trim()) return;
        const r = checkInput(v, q); inp.disabled = true; $("#f button", body).hidden = true; inp.classList.add(r.ok ? "ok" : "ko"); feedback(r.ok, inp);
        $("#after", body).innerHTML = `<p class="verdict ${r.ok ? "good" : "bad"}">${r.ok ? pick(["Juste !", "Yatta !", "Impeccable !"]) : "Réponse attendue :"}</p>${r.ok ? "" : `<p class="big">${md(q.a[0])}</p>`}${r.note ? `<p class="small"><b>${r.note}</b></p>` : ""}${expl()}<div class="row wrap"><button class="btn primary" id="nx" style="flex:1">Suite</button>${r.ok ? "" : `<button class="btn ghost sm" id="override">J'avais juste (faute de frappe)</button>`}</div>`;
        $("#nx", body).focus(); $("#nx", body).onclick = () => done({ ok: r.ok, grade: r.ok ? 2 : 0 });
        const ov = $("#override", body); if (ov) ov.onclick = () => done({ ok: true, grade: 1 });
      };
      return;
    }
    // --- Carte géographique ---
    if (q.k === "m") {
      const p = q.place, M = MAPS[p.map || "world"];
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div><div class="map">${mapSVG(M, { id: "mq" })}</div><div id="after"></div>`;
      const svg = $("#mq", body); let clicked = false;
      svg.addEventListener("click", (e) => {
        if (clicked) return; clicked = true;
        const pt = svgPoint(svg, e), [tx, ty] = proj(M, p.lon, p.lat), ok = Math.hypot(pt.x - tx, pt.y - ty) < M.W * 0.05;
        svg.insertAdjacentHTML("beforeend", `<line class="trace-line" x1="${pt.x}" y1="${pt.y}" x2="${tx}" y2="${ty}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 5"/><circle cx="${pt.x}" cy="${pt.y}" r="8" fill="${ok ? "var(--good)" : "var(--bad)"}" stroke="var(--ink)" stroke-width="2"/>${pin(tx, ty, p.n, "var(--accent)")}<circle class="map-ping" cx="${tx}" cy="${ty}" r="10"/>`);
        if (ok) S().stats.mapWins++;
        feedback(ok, svg);
        $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? "Dans le mille !" : "Raté, c'était ici."}</p><button class="btn primary big" id="nx">Suite</button>`;
        $("#nx", body).onclick = () => done({ ok, grade: ok ? 2 : 0 });
      });
      return;
    }
    // --- Classer : glisser chaque étiquette dans la bonne boîte ---
    if (q.k === "s") {
      const items = shuffle(q.items.map((it, i) => ({ t: it[0], b: it[1], i }))); let errors = 0, placed = 0, sel = null;
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div><p class="tiny muted">Glisse chaque étiquette dans sa boîte (ou touche l'étiquette, puis la boîte).</p><div class="bins" style="--n:${q.bins.length}">${q.bins.map((b, i) => `<div class="bin" data-b="${i}"><div class="bin-h">${md(b)}</div><div class="bin-in"></div></div>`).join("")}</div><div class="pool">${items.map((it) => `<span class="chip-d" data-i="${it.i}">${md(it.t)}</span>`).join("")}</div><div id="after"></div>`;
      const tryDrop = (chip, binEl) => {
        if (!binEl) return; const it = q.items[+chip.dataset.i];
        if (+binEl.dataset.b === it[1]) { chip.classList.add("placed", "good"); chip.classList.remove("sel"); $(".bin-in", binEl).appendChild(chip); FX.sfx("drop"); FX.buzz(10); binEl.classList.remove("pop"); void binEl.offsetWidth; binEl.classList.add("pop"); placed++; }
        else { errors++; FX.sfx("bad"); FX.buzz([30, 30]); chip.classList.remove("shake-soft"); void chip.offsetWidth; chip.classList.add("shake-soft", "was-bad"); binEl.classList.remove("nope"); void binEl.offsetWidth; binEl.classList.add("nope"); }
        sel = null; $$(".bin", body).forEach((b) => b.classList.remove("hover"));
        if (placed === items.length) finish();
      };
      $$(".chip-d", body).forEach((chip) => dragChip(chip, {
        onMove: (x, y) => { $$(".bin", body).forEach((b) => b.classList.toggle("hover", b === under(x, y, ".bin"))); },
        onDrop: (x, y) => tryDrop(chip, under(x, y, ".bin")),
        onTap: () => { $$(".chip-d", body).forEach((c) => c.classList.remove("sel")); sel = chip; chip.classList.add("sel"); FX.sfx("pick"); }
      }));
      $$(".bin", body).forEach((b) => b.addEventListener("click", () => { if (sel) tryDrop(sel, b); }));
      const finish = () => { const ok = errors === 0; if (ok) S().stats.dragWins++; feedback(ok, body); $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? "Tout est rangé, sans faute !" : `Rangé, avec ${plural(errors, "erreur")}.`}</p>${expl()}<button class="btn primary big" id="nx">Suite</button>`; $("#nx", body).onclick = () => done({ ok, grade: ok ? 2 : errors <= 1 ? 1 : 0 }); };
      return;
    }
    // --- Ordonner : faire glisser les lignes pour les remettre dans l'ordre ---
    if (q.k === "o") {
      let order = shuffleNot(q.items.map((_, i) => i)); let tapSel = null;
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div><p class="tiny muted">Fais glisser les lignes (ou touche-en deux pour les échanger).</p><div class="olist"></div><button class="btn primary big" id="chk">Vérifier</button><div id="after"></div>`;
      const list = $(".olist", body);
      const draw = () => {
        list.innerHTML = order.map((i, pos) => `<div class="orow" data-i="${i}"><span class="grip">⋮⋮</span><span class="pos">${pos + 1}</span><span>${md(q.items[i])}</span></div>`).join("");
        $$(".orow", list).forEach((row) => {
          row.addEventListener("pointerdown", (e) => {
            if (list.classList.contains("locked")) return; e.preventDefault();
            const startY = e.clientY; let moved = false; const h = row.getBoundingClientRect().height + 8;
            const from = order.indexOf(+row.dataset.i);
            const mv = (ev) => { const dy = ev.clientY - startY; if (!moved && Math.abs(dy) < 6) return; if (!moved) { moved = true; row.classList.add("dragging"); FX.sfx("pick"); } row.style.transform = `translateY(${dy}px)`; };
            const up = (ev) => {
              removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up);
              if (!moved) { // échange par deux touches
                if (tapSel === null) { tapSel = from; row.classList.add("sel"); FX.sfx("pick"); }
                else { const a = tapSel; tapSel = null; if (a !== from) { [order[a], order[from]] = [order[from], order[a]]; FX.sfx("drop"); } draw(); }
                return;
              }
              const to = Math.max(0, Math.min(order.length - 1, from + Math.round((ev.clientY - startY) / h)));
              const [x] = order.splice(from, 1); order.splice(to, 0, x); FX.sfx("drop"); FX.buzz(8); draw();
            };
            addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
          });
        });
      };
      draw();
      $("#chk", body).onclick = () => {
        list.classList.add("locked"); $("#chk", body).hidden = true;
        const ok = order.every((i, p) => i === p);
        $$(".orow", list).forEach((r, p) => { const good = +r.dataset.i === p; r.classList.add(good ? "good" : "bad"); r.style.setProperty("--i", p); });
        if (ok) { S().stats.dragWins++; if (card.timeline) S().stats.orderWins++; }
        feedback(ok, list);
        $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? "Ordre parfait !" : "Le bon ordre :"}</p>${ok ? "" : `<ol class="small">${q.items.map((t) => `<li>${md(t)}</li>`).join("")}</ol>`}${expl()}<button class="btn primary big" id="nx">Suite</button>`;
        $("#nx", body).onclick = () => done({ ok, grade: ok ? 2 : 0 });
      };
      return;
    }
    // --- Associer : relier chaque élément de gauche à celui de droite ---
    if (q.k === "p") {
      const L = shuffle(q.pairs.map((p, i) => ({ t: p[0], i }))), Rr = shuffle(q.pairs.map((p, i) => ({ t: p[1], i }))); let selL = null, errors = 0, matched = 0;
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div><p class="tiny muted">Touche un élément à gauche, puis son partenaire à droite (ou fais-le glisser dessus).</p><div class="pairs"><div class="pcol">${L.map((x) => `<button class="pbtn" data-side="l" data-i="${x.i}">${md(x.t)}</button>`).join("")}</div><div class="pcol">${Rr.map((x) => `<button class="pbtn" data-side="r" data-i="${x.i}">${md(x.t)}</button>`).join("")}</div></div><div id="after"></div>`;
      const COLORS = ["#3F51D6", "#D42A48", "#159A6B", "#D99A00", "#6B45B8", "#E8641E", "#12889A"];
      const match = (lb, rb) => {
        const li = +lb.dataset.i, ri = +rb.dataset.i;
        if (q.pairs[li][1] === q.pairs[ri][1]) { const col = COLORS[matched % COLORS.length]; [lb, rb].forEach((b) => { b.classList.add("done"); b.disabled = true; b.style.setProperty("--pc", col); }); matched++; FX.sfx("good", matched); FX.buzz(10); const [x, y] = FX.center(rb); FX.burst(x, y, { color: col, n: 12, speed: 3.5, life: 30 }); }
        else { errors++; FX.sfx("bad"); FX.buzz([30, 30]); [lb, rb].forEach((b) => { b.classList.remove("shake-soft"); void b.offsetWidth; b.classList.add("shake-soft"); }); }
        lb.classList.remove("sel"); selL = null;
        if (matched === q.pairs.length) { const ok = errors === 0; if (ok) S().stats.dragWins++; combo = ok ? combo : 0; $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? "Tous les liens sont justes !" : `Terminé, avec ${plural(errors, "erreur")}.`}</p>${expl()}<button class="btn primary big" id="nx">Suite</button>`; if (ok) feedback(true, body); $("#nx", body).onclick = () => done({ ok, grade: ok ? 2 : errors <= 1 ? 1 : 0 }); }
      };
      $$(".pbtn[data-side=l]", body).forEach((b) => dragChip(b, {
        onMove: (x, y) => $$(".pbtn[data-side=r]", body).forEach((r) => r.classList.toggle("hover", r === under(x, y, ".pbtn[data-side=r]"))),
        onDrop: (x, y) => { const r = under(x, y, ".pbtn[data-side=r]"); $$(".pbtn", body).forEach((z) => z.classList.remove("hover")); if (r && !r.disabled) match(b, r); },
        onTap: () => { if (b.disabled) return; $$(".pbtn[data-side=l]", body).forEach((z) => z.classList.remove("sel")); selL = b; b.classList.add("sel"); FX.sfx("pick"); }
      }));
      $$(".pbtn[data-side=r]", body).forEach((r) => (r.onclick = () => { if (selL && !r.disabled) match(selL, r); }));
      return;
    }
  }

  // ---------- Révision ----------
  function viewRevisionHub(main) {
    const subjects = PROGRAMME.subjects.map((s) => ({ s, n: STORE.buildSession({ subject: s.id }).length })).filter((x) => STORE.activeChapters().some((c) => c.s === x.s.id));
    const all = STORE.buildSession().length;
    main.innerHTML = `<h1>Salle d'entraînement</h1>
      ${senseiLine(all ? `Ta séance mélange les matières : c'est plus efficace que de tout réviser d'un bloc. <b>${all}</b> cartes sont prêtes.` : "Tout est à jour ! Reviens demain, ou lance un entraînement éclair pour garder la main.", all ? "happy" : "wow")}
      <button class="btn primary big ${all ? "pulse" : ""}" data-go="seance" ${all ? "" : "disabled"}>Séance complète · ${all}</button>
      <button class="btn" id="flash2">Entraînement éclair</button>
      <section class="stack"><h2>Par clan</h2>${subjects.length ? subjects.map(({ s, n }) => `<button class="chapter on" data-go="seance~s:${s.id}" ${n ? "" : "disabled"}><span class="kj" style="color:${s.color}">${s.kanji}</span><span><span class="t">${s.name}</span><br><span class="tiny muted">${plural(n, "carte")} prête${n > 1 ? "s" : ""}</span></span><span class="pill ${n ? "new" : "off"}">${n ? "go" : "à jour"}</span></button>`).join("") : `<p class="muted">Ouvre des leçons dans les clans pour remplir tes révisions.</p>`}</section>
      <section class="flat stack"><h3>Comment ça marche ?</h3><p class="small">Chaque carte revient juste avant que tu l'oublies. Si tu réponds juste, elle revient plus tard (1 jour, 3 jours, une semaine, un mois…). Si tu te trompes, elle revient vite. Une carte revue avec un intervalle de 21 jours ou plus est <b>maîtrisée</b>.</p><p class="small">Cartes par cœur : touche pour retourner, puis glisse à <b>droite</b> (je savais), à <b>gauche</b> (je ne savais pas) ou vers le <b>haut</b> (facile).</p></section>`;
    $("#flash2").onclick = () => startFlashQuiz();
  }
  function sessionShell(main) {
    main.innerHTML = `<div class="session-top"><button class="back" id="quit" aria-label="Terminer">✕</button><div class="prog"><i style="width:0"></i></div><span class="combo"></span></div><div id="stage"></div>`;
  }
  function viewSession(main, arg) {
    const opt = {}; if (arg && arg.startsWith("s:")) opt.subject = arg.slice(2); if (arg && arg.startsWith("c:")) opt.chapter = arg.slice(2); if (arg && arg.startsWith("l:")) opt.lesson = arg.slice(2); if (arg && arg.startsWith("a:")) opt.agenda = arg.slice(2);
    const queue = STORE.buildSession(opt); if (!queue.length) { toast("Rien à réviser ici pour le moment."); return go("revision", true); }
    const total = queue.length; let done = 0, good = 0, xp = 0, lvlUp = 0; const requeued = new Set(); combo = 0;
    sessionShell(main);
    leaveGuard = () => done === 0 || done >= total || (toast("Touche ✕ pour terminer la séance et garder tes points."), false);
    $("#quit").onclick = () => { leaveGuard = null; finish(true); };
    function next() {
      if (!queue.length) return finish();
      const card = instantiate(queue.shift());
      mountCard($("#stage"), card, {
        onDone: ({ ok, grade }) => {
          const firstTime = !requeued.has(card.id);
          if (firstTime) { STORE.grade(card.id, grade, card.bonus, !!card.focus); if (STORE.countReview()) setTimeout(() => { toast("Objectif du jour atteint : ta flamme brille ! 炎"); FX.sfx("level"); }, 300); done++; }
          if (ok) good++;
          const gain = ([2, 6, 10, 12][grade] || 2) * (1 + Math.min(combo, 10) * 0.05) * (firstTime ? 1 : 0.5) * (card.bonus && ok ? 3 : 1);
          if (card.bonus && ok && firstTime) setTimeout(() => fxText("REVANCHE ×3 !"), 350);
          xp += gain; const up = STORE.addXP(gain); if (up) lvlUp = up;
          if (grade === 0 && firstTime) { requeued.add(card.id); queue.splice(Math.min(queue.length, 3 + Math.floor(Math.random() * 3)), 0, STORE.allActiveCards().find((c) => c.id === card.id) || card); }
          $(".prog > i").style.width = (100 * done / total).toFixed(1) + "%";
          STORE.save(); renderHUD(); next();
        }
      });
    }
    async function finish(early) {
      leaveGuard = null; STORE.save();
      if (done === 0) return go("revision", true);
      const L = STORE.levelInfo();
      await celebrate(early ? "Pause !" : "お疲れ様！", `${ART.sensei(good / done > 0.7 ? "fire" : "happy", 100)}<p><b>${plural(done, "carte")}</b> révisée${done > 1 ? "s" : ""} · <b>${Math.round(100 * good / Math.max(1, done))} %</b> de réussite<br><b>+${Math.round(xp)} XP</b> · meilleur combo ${S().stats.bestCombo}</p>${lvlUp ? `<p class="big">Niveau ${lvlUp} atteint : ${L.rank[1]} ${L.rank[2]} !</p>` : ""}`, "Continuer", lvlUp ? "level" : "win");
      afterAction(); go("dojo", true);
    }
    next();
  }
  function autoCards(filter) { return STORE.allActiveCards(filter).filter((c) => c.k !== "f"); }
  function startFlashQuiz() {
    const pool = shuffle(autoCards()); if (pool.length < 3) { toast("Ouvre d'abord quelques leçons pour t'entraîner."); return; }
    const main = $("main"); const list = pool.slice(0, 10); let i = 0, good = 0; combo = 0;
    history.pushState({ d: ++depth }, "", "#revision"); sessionShell(main);
    $("#quit").onclick = () => go("dojo", true);
    const next = async () => {
      if (i >= list.length) { const g = good * 5; const up = STORE.addXP(g); await celebrate("Éclair !", `${ART.sensei(good >= 8 ? "fire" : "happy", 100)}<p><b>${good} / ${list.length}</b> bonnes réponses · <b>+${g} XP</b></p>`); afterAction(); levelUpCheck(up); return go("dojo", true); }
      mountCard($("#stage"), instantiate(list[i]), { selfGrade: false, onDone: ({ ok }) => { if (ok) good++; i++; $(".prog > i").style.width = (100 * i / list.length) + "%"; STORE.save(); next(); } });
    };
    next();
  }

  // ---------- Boss (combat animé) ----------
  function viewBoss(main, cid) {
    const c = STORE.CHI[cid]; if (!c || !c.boss) return go("dojo", true);
    const s = sub(c.s); let pool = shuffle(STORE.cardList(c).filter((x) => x.k !== "f"));
    if (pool.length < 3) pool = shuffle(STORE.cardList(c));
    const maxHp = c.boss.hp || 10; let hp = maxHp, hearts = 3, qi = 0; combo = 0;
    main.innerHTML = `<button class="back" id="flee">← Fuir</button>
      <section class="panel arena tone" style="--accent:${s.color}"><span class="boss-name">${esc(c.boss.name)}</span><div id="yk" class="yk-enter">${ART.yokai(cid, { size: 150, angry: true })}</div><div class="hp"><i style="width:100%"></i></div><div class="row" style="gap:18px"><span class="hearts" id="hearts">${"<b>♥</b>".repeat(3)}</span><span class="combo"></span></div></section><div id="stage"></div>`;
    $("#flee").onclick = () => go("ch~" + cid, true);
    // Écran « VS »
    if (!FX.reduce()) { const vs = document.createElement("div"); vs.className = "vs"; vs.innerHTML = `<div class="vs-a">${ART.avatar(S().profile.element, STORE.levelInfo().level, 110)}</div><div class="vs-t">VS</div><div class="vs-b">${ART.yokai(cid, { size: 120, angry: true })}</div>`; document.body.appendChild(vs); FX.sfx("hit"); setTimeout(() => vs.remove(), 1300); }
    function next() {
      if (hp <= 0) return win(); if (hearts <= 0) return lose();
      const card = instantiate(pool[qi++ % pool.length]);
      mountCard($("#stage"), card, {
        selfGrade: false, onDone: ({ ok }) => {
          const yk = $("#yk");
          if (ok) {
            hp--; const [x, y] = FX.center(yk); FX.sfx("hit"); FX.slash(x, y, el().c); FX.burst(x, y, { color: el().c, n: 22, speed: 7, shapes: ["shard", "star"] }); fxText(pick(el().fx), x, y - 40);
            const dmg = document.createElement("div"); dmg.className = "dmg"; dmg.textContent = "−1"; dmg.style.left = x + 30 + "px"; dmg.style.top = y - 20 + "px"; document.body.appendChild(dmg); setTimeout(() => dmg.remove(), 900);
            yk.classList.remove("yk-hit"); void yk.offsetWidth; yk.classList.add("yk-hit");
          } else {
            hearts--; FX.sfx("hurt"); FX.buzz([60, 40, 60]); yk.classList.remove("yk-atk"); void yk.offsetWidth; yk.classList.add("yk-atk");
            document.body.classList.remove("quake"); void document.body.offsetWidth; document.body.classList.add("quake");
            const hs = $$("#hearts b"); const h = hs[hearts]; if (h) h.classList.add("broken");
          }
          $(".hp > i").style.width = (100 * hp / maxHp) + "%"; $(".hp").classList.remove("hp-hit"); void $(".hp").offsetWidth; $(".hp").classList.add("hp-hit");
          setTimeout(next, ok ? 450 : 650);
        }
      });
    }
    async function win() {
      const first = !(S().bosses[cid] && S().bosses[cid].won), perfect = hearts === 3;
      S().bosses[cid] = { won: true, perfect: perfect || !!(S().bosses[cid] && S().bosses[cid].perfect), date: STORE.today() };
      const g = first ? 150 + (perfect ? 50 : 0) : 30; const up = STORE.addXP(g); STORE.save();
      const yk = $("#yk"); yk.classList.add("yk-defeat"); const [x, y] = FX.center(yk); FX.burst(x, y, { n: 70, speed: 10, colors: [el().c, "#E8B923", "#fff"], life: 80 });
      await new Promise((r) => setTimeout(r, 800));
      await celebrate("勝利！", `<div class="evolve">${ART.yokai(cid, { size: 120, ally: true })}</div><p><b>${esc(c.boss.name)}</b> est vaincu${first ? " et rejoint tes alliés" : ""} !</p><p><b>+${g} XP</b>${perfect ? " · sans une égratignure !" : ""}</p>`);
      afterAction(); levelUpCheck(up); go("ch~" + cid, true);
    }
    async function lose() {
      await celebrate("まだまだ…", `${ART.sensei("think", 100)}<p>Le yōkai résiste encore. Révise ce chapitre un jour ou deux, puis reviens : il sera plus faible face à toi.</p>`, "Retour au chapitre", "lose");
      go("ch~" + cid, true);
    }
    setTimeout(next, FX.reduce() ? 0 : 900);
  }

  // ---------- Cartes géographiques ----------
  const proj = (M, lon, lat) => [((lon - M.lon0) / (M.lon1 - M.lon0)) * M.W, ((M.lat1 - lat) / (M.lat1 - M.lat0)) * M.H];
  function svgPoint(svg, e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  const pin = (x, y, label, color) => `<g class="pin"><circle cx="${x}" cy="${y}" r="9" fill="${color}" stroke="var(--ink)" stroke-width="2.5"/><text x="${x}" y="${y - 15}" text-anchor="middle" class="pin-lbl">${esc(label)}</text></g>`;
  function mapSVG(M, { id = "", inner = "" } = {}) { return `<svg id="${id}" viewBox="0 0 ${M.W} ${M.H}" role="img" aria-label="Carte"><rect class="sea" width="${M.W}" height="${M.H}"/><path class="land" d="${M.land}"/><path class="borders" d="${M.borders}"/>${inner}</svg>`; }
  function routePath(M, pts) { let d = "", prev = null; pts.forEach(([lon, lat]) => { const [x, y] = proj(M, lon, lat); d += (prev === null || Math.abs(lon - prev) > 180 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " "; prev = lon; }); return d; }
  // Événements / lieux / routes des leçons (ouvertes ou non)
  function worldItems(kind) { const out = []; STORE.CH.forEach((c) => c.lessons.forEach((l) => (l[kind] || []).forEach((x) => out.push(Object.assign({ ch: c, le: l, open: STORE.lessonOpen(l.id) }, x))))); return out; }

  // ---------- Monde : frise + carte ----------
  let worldTab = "frise", worldMap = "world";
  function viewWorld(main) {
    main.innerHTML = `<h1>Le Monde d'Hikari</h1><div class="seg" role="group"><button aria-pressed="${worldTab === "frise"}" data-t="frise">Rouleau du temps</button><button aria-pressed="${worldTab === "carte"}" data-t="carte">Carte</button></div><div id="w"></div>`;
    $$("[data-t]", main).forEach((b) => (b.onclick = () => { worldTab = b.dataset.t; FX.sfx("tap"); viewWorld(main); }));
    worldTab === "frise" ? drawTimeline($("#w")) : drawMap($("#w"));
  }
  const TL_BREAKS = [[-3500000, 0], [-100000, 0.3], [-10000, 0.48], [-3500, 0.62], [500, 1]];
  function tlX(y, W) { for (let i = 1; i < TL_BREAKS.length; i++) { const [y0, f0] = TL_BREAKS[i - 1], [y1, f1] = TL_BREAKS[i]; if (y <= y1) return 90 + (f0 + ((y - y0) / (y1 - y0)) * (f1 - f0)) * (W - 180); } return W - 90; }
  function yearLbl(y) { if (y <= -1000000) return `−${String(-y / 1e6).replace(".", ",")} Ma`; if (y < 0) return `−${GEN.fmt(-y)}`; return String(y); }
  function yearLong(y) { if (y <= -1000000) return `il y a environ ${String(-y / 1e6).replace(".", ",")} millions d'années`; if (y < -20000) return `il y a environ ${GEN.fmt(-y)} ans`; if (y < 0) return `${GEN.fmt(-y)} av. J.-C.`; return `${y} ap. J.-C.`; }
  function drawTimeline(host) {
    const evs = worldItems("events").sort((a, b) => a.y - b.y);
    const W = 2200, H = 360, axis = 190; const lanes = [[], [], [], []]; const laneY = [120, 260, 60, 320];
    evs.forEach((e) => { e.x = tlX(e.y, W); let l = 0; for (; l < 4; l++) { const last = lanes[l][lanes[l].length - 1]; if (!last || e.x - last.x > 150) break; } e.lane = Math.min(l, 3); lanes[e.lane].push(e); });
    const eras = [["PALÉOLITHIQUE", -3500000, -10000], ["NÉOLITHIQUE", -10000, -3300], ["ANTIQUITÉ", -3300, 476]];
    const ticks = [-3000000, -2000000, -1000000, -100000, -50000, -10000, -5000, -3000, -2000, -1000, 0, 500];
    const nOpen = evs.filter((e) => e.open).length;
    host.innerHTML = `${senseiLine(nOpen ? `Ton rouleau compte <b>${plural(nOpen, "repère")}</b>. Il s'allonge à chaque leçon ouverte. Fais-le défiler !` : "Ton rouleau est encore vide : ouvre une leçon d'histoire pour y faire apparaître les premiers repères.", "happy")}
      <div class="scroll-x" id="tlw"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Frise chronologique">
        ${eras.map(([n, a, b], i) => `<rect x="${tlX(a, W)}" y="${axis - 14}" width="${tlX(b, W) - tlX(a, W)}" height="28" fill="${["#b197fc", "#8ce99a", "#ffd43b"][i]}" opacity=".55"/><text x="${(tlX(a, W) + tlX(b, W)) / 2}" y="${axis + 5}" text-anchor="middle" class="tl-era">${n}</text>`).join("")}
        <line x1="0" y1="${axis}" x2="${W}" y2="${axis}" stroke="var(--ink)" stroke-width="3" opacity=".25"/>
        ${ticks.map((t) => `<line x1="${tlX(t, W)}" y1="${axis + 14}" x2="${tlX(t, W)}" y2="${axis + 22}" stroke="var(--ink)" stroke-width="2"/><text x="${tlX(t, W)}" y="${axis + 36}" text-anchor="middle" class="tl-yr">${t === 0 ? "0" : yearLbl(t)}</text>`).join("")}
        <line x1="${tlX(-3300, W)}" y1="20" x2="${tlX(-3300, W)}" y2="${H - 10}" stroke="var(--seal)" stroke-width="2" stroke-dasharray="6 5"/><text x="${tlX(-3300, W) + 6}" y="30" class="tl-yr" style="fill:var(--seal)">Préhistoire | Histoire (écriture)</text>
        ${evs.map((e, i) => { const y = laneY[e.lane], col = e.open ? sub(e.ch.s).color : "var(--mute)"; return `<g class="tl-ev ${e.open ? "open" : ""}" data-i="${i}" style="--i:${i}"><line class="stem" x1="${e.x}" y1="${axis}" x2="${e.x}" y2="${y}" stroke="${col}" stroke-width="2"/><circle cx="${e.x}" cy="${axis}" r="${e.key ? 7 : 5}" fill="${col}" stroke="var(--ink)" stroke-width="2"/><rect x="${e.x - 70}" y="${y - 20}" width="140" height="38" rx="6" fill="var(--panel)" stroke="${col}" stroke-width="${e.key ? 3 : 2}"/><text x="${e.x}" y="${y - 4}" text-anchor="middle" class="tl-lbl">${e.open ? esc(e.label.length > 22 ? e.label.slice(0, 21) + "…" : e.label) : "? ? ?"}</text><text x="${e.x}" y="${y + 11}" text-anchor="middle" class="tl-yr">${e.open ? yearLbl(e.y) : "verrouillé"}</text></g>`; }).join("")}
      </svg></div>
      <p class="tiny muted">L'échelle n'est pas régulière : la Préhistoire est « compressée », sinon l'Antiquité tiendrait sur un millimètre ! Ma = millions d'années.</p>
      <div class="flat detail" id="tl-d"><span class="muted small">Touche un repère pour le détail.</span></div>
      <button class="btn primary" id="order" ${nOpen >= 4 ? "" : "disabled"}>Défi : remettre 5 repères dans l'ordre</button><div id="order-box"></div>`;
    const w = $("#tlw"); const firstOpen = evs.find((e) => e.open); if (firstOpen) w.scrollLeft = Math.max(0, firstOpen.x - 60);
    $$(".tl-ev", host).forEach((g) => (g.onclick = () => { FX.sfx("tap"); const e = evs[+g.dataset.i]; $("#tl-d").innerHTML = e.open ? `<b>${esc(e.label)}</b><br><span class="small">${yearLong(e.y)}${e.note ? " · " + esc(e.note) : ""}</span><br><button class="btn sm" data-go="le~${e.le.id}" style="margin-top:6px">${esc(e.le.title)}</button>` : `<b>Repère verrouillé</b><br><span class="small">Il apparaîtra quand la leçon « ${esc(e.le.title)} » sera ouverte.</span>`; }));
    $("#order").onclick = () => {
      const set = shuffle(evs.filter((e) => e.open)).slice(0, 5).sort((a, b) => a.y - b.y);
      const box = $("#order-box");
      mountCard(box, { k: "o", timeline: true, q: "Remets ces repères dans l'ordre chronologique (du plus ancien au plus récent).", items: set.map((e) => `${e.label}`), x: set.map((e) => `${e.label} : ${yearLbl(e.y)}`).join(" · ") }, { onDone: ({ ok }) => { const g = ok ? 30 : 10; STORE.addXP(g); STORE.save(); afterAction(); toast(`+${g} XP`); drawTimeline(host); } });
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }
  function drawMap(host) {
    const places = worldItems("places").filter((p) => p.open), routes = worldItems("routes").filter((r) => r.open);
    const maps = { world: "Monde", medit: "Méditerranée", europe: "Europe" };
    const M = MAPS[worldMap]; const here = places.filter((p) => (p.map || "world") === worldMap);
    const rts = worldMap === "world" ? routes : [];
    const inner = rts.map((r) => `<path class="route" d="${routePath(M, r.pts)}" fill="none" stroke="var(--seal)" stroke-width="3" stroke-dasharray="10 7" stroke-linecap="round" opacity=".8"/>`).join("") + here.map((p, i) => { const [x, y] = proj(M, p.lon, p.lat); return `<g data-p="${i}" class="mpin" style="cursor:pointer;--i:${i}"><circle cx="${x}" cy="${y}" r="16" fill="transparent"/><circle class="halo" cx="${x}" cy="${y}" r="7" fill="${sub(p.ch.s).color}"/><circle cx="${x}" cy="${y}" r="7" fill="${sub(p.ch.s).color}" stroke="var(--ink)" stroke-width="2.5"/></g>`; }).join("");
    host.innerHTML = `<div class="seg" role="group">${Object.entries(maps).map(([k, n]) => `<button aria-pressed="${k === worldMap}" data-m="${k}">${n}</button>`).join("")}</div>
      <div class="scroll-x map">${mapSVG(M, { id: "wm", inner })}</div>
      <div class="flat detail" id="m-d">${here.length ? `<span class="muted small">${plural(here.length, "lieu")} débloqué${here.length > 1 ? "s" : ""} sur cette carte. Touche un point.${rts.length ? " Les pointillés rouges montrent les migrations d'Homo sapiens." : ""}</span>` : `<span class="muted small">Aucun lieu débloqué sur cette carte pour l'instant.</span>`}</div>
      <button class="btn primary" id="mgame" ${places.length >= 3 ? "" : "disabled"}>Défi cartographe : 5 lieux à trouver</button>`;
    $$("[data-m]", host).forEach((b) => (b.onclick = () => { worldMap = b.dataset.m; FX.sfx("tap"); drawMap(host); }));
    $$("[data-p]", host).forEach((g) => (g.onclick = (e) => { e.stopPropagation(); FX.sfx("pick"); const p = here[+g.dataset.p]; $("#m-d").innerHTML = `<b>${esc(p.n)}</b><br><span class="small">${esc(sub(p.ch.s).name)} · </span><button class="btn sm" data-go="le~${p.le.id}">${esc(p.le.title)}</button>`; }));
    $("#mgame").onclick = () => {
      const list = shuffle(places).slice(0, 5); let i = 0, good = 0; const main = $("main"); combo = 0;
      sessionShell(main); $("#quit").onclick = () => viewWorld(main);
      const next = async () => {
        if (i >= list.length) { const g = good * 8; STORE.addXP(g); STORE.save(); await celebrate(good >= 4 ? "Cartographe !" : "Bien essayé !", `<p><b>${good} / ${list.length}</b> lieux trouvés · <b>+${g} XP</b></p>`); afterAction(); return viewWorld(main); }
        const p = list[i]; mountCard($("#stage"), { k: "m", place: p, ch: p.ch.id, le: p.le.id, q: `Touche la carte là où se trouve **${p.n}**.` }, { onDone: ({ ok }) => { if (ok) good++; i++; $(".prog > i").style.width = (100 * i / list.length) + "%"; next(); } });
      };
      next();
    };
  }

  // ---------- Trésors ----------
  function viewTreasures(main) {
    const L = STORE.levelInfo(); const won = Object.keys(S().badges).length; const tNow = ART.tierOf(L.level);
    const bossChs = STORE.CH.filter((c) => c.boss && STORE.chapterState(c.id) !== "locked");
    main.innerHTML = `<h1>Salle des trésors</h1>
      <section class="panel stack"><h2>Ton sceau</h2>
        <div class="row" style="gap:16px">${ART.avatar(S().profile.element, L.level, 110)}<p><b>${ART.TIERS[tNow].n}</b><br><span class="small muted">${ART.TIERS[tNow].d}</span>${ART.TIERS[tNow + 1] ? `<br><span class="small">Prochaine évolution au niveau ${ART.TIERS[tNow + 1].lv}.</span>` : ""}</p></div>
        <div class="evo">${ART.TIERS.map((t, i) => `<div class="${i > tNow ? "lock" : ""}">${ART.avatar(S().profile.element, t.lv, 54)}<span>niv. ${t.lv}</span></div>`).join("")}</div></section>
      <section class="panel stack"><div class="row" style="justify-content:space-between"><h2>Rang</h2><span class="small muted">${S().xp} XP au total</span></div>
        <div class="ladder">${STORE.RANKS.map((r) => `<div class="r ${L.rank === r ? "cur" : ""}"><span class="jp">${r[1]}</span><span><b>${r[2]}</b></span><span class="small muted">niv. ${r[0]}</span></div>`).join("")}</div>
        ${L.next ? `<p class="small muted">Prochain rang, ${L.next[2]}, au niveau ${L.next[0]}.</p>` : ""}</section>
      ${defisSection()}
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Yōkai alliés</h2><span class="small muted">${Object.values(S().bosses).filter((b) => b.won).length} / ${bossChs.length}</span></div>
        <div class="allies">${bossChs.length ? bossChs.map((c) => { const w = S().bosses[c.id] && S().bosses[c.id].won; return `<button class="ally ${w ? "" : "lock"}" data-go="ch~${c.id}">${ART.yokai(c.id, { size: 84, ally: w })}<span>${w ? esc(c.boss.name.split(",")[0]) : "???"}</span></button>`; }).join("") : `<p class="muted small" style="grid-column:1/-1">Ouvre des leçons pour réveiller les yōkai gardiens de leurs chapitres.</p>`}</div></section>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Emblèmes</h2><span class="small muted">${won} / ${STORE.BADGES.length}</span></div>
        <div class="badges">${STORE.BADGES.map(([id, k, n, d], i) => { const got = S().badges[id]; return `<div class="badge ${got ? "got" : "lock"}" style="--i:${i}">${ART.seal(k, got ? "var(--seal)" : "var(--mute)", 54, !got)}<span class="t">${n}</span><span class="d">${d}</span></div>`; }).join("")}</div></section>`;
    bindUse(main);
  }

  // ---------- Moi ----------
  function viewMe(main, arg) {
    const L = STORE.levelInfo(); const mast = Object.keys(S().cards).filter(STORE.mastered).length;
    const days = []; for (let i = 34; i >= 0; i--) { const d = STORE.today(new Date(Date.now() - i * 86400000)); days.push([d, (S().days[d] || { n: 0 }).n]); }
    const g = S().settings.goal;
    main.innerHTML = `<h1>${esc(S().profile.name)}</h1>
      <section class="panel stack"><div class="stats-row"><div class="stat"><b>${L.level}</b><span>niveau</span></div><div class="stat"><b>${S().streak.best}</b><span>record de flamme</span></div><div class="stat"><b>${mast}</b><span>cartes maîtrisées</span></div></div>
        <div><p class="eyebrow">Activité des 5 dernières semaines</p><div class="heat">${days.map(([d, n], i) => `<i class="${n >= g ? "l3" : n >= g / 2 ? "l2" : n > 0 ? "l1" : ""} ${i === days.length - 1 ? "today" : ""}" title="${d} : ${n} révisions" style="--i:${i}"></i>`).join("")}</div></div>
        <div class="grid2">${PROGRAMME.subjects.map((s) => { const k = STORE.counts((c) => c.s === s.id); return `<div class="row">${ring(k.total ? k.mastered / k.total : 0, s.color, 44)}<span class="small"><b>${s.name}</b><br>${k.seen}/${k.total} vues · ${k.mastered} maîtrisées</span></div>`; }).join("")}</div></section>
      ${notesPanel()}
      <details id="d-nl" ${arg === "nouvelle" ? "open" : ""}><summary>Nouvelle leçon photo</summary><div class="in" id="nl"></div></details>
      <details><summary>Réglages</summary><div class="in">
        <label class="stack"><span class="small"><b>Objectif du jour</b> (révisions pour remplir le Ki)</span><select id="st-goal">${[10, 15, 20, 30, 40].map((n) => `<option ${n === g ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="row"><input type="checkbox" id="st-sound" ${S().settings.sound ? "checked" : ""} style="width:22px;height:22px"> <span class="small"><b>Sons</b></span></label>
        <label class="row"><input type="checkbox" id="st-hap" ${S().settings.haptics ? "checked" : ""} style="width:22px;height:22px"> <span class="small"><b>Vibrations</b></span></label>
        <span class="small"><b>Élément</b> <span class="muted">(change l'apparence, pas le jeu)</span></span>${elementPicker(S().profile.element, L.level)}
        <button class="btn" id="persist">Protéger mes données contre l'effacement</button>
      </div></details>
      <details><summary>Sauvegarde</summary><div class="in">
        <p class="small">Tes progrès sont enregistrés sur ce téléphone. Fais une sauvegarde de temps en temps (les photos ne sont pas incluses).</p>
        <button class="btn" id="bk-out">Télécharger une sauvegarde</button>
      </div></details>
      <details id="d-parent" ${arg === "parent" ? "open" : ""}><summary>🔒 Espace parent</summary><div class="in">
        <div id="p-lock"></div>
        <div id="p-zone" class="stack" hidden>
          <p class="eyebrow">Suivi</p><div id="parent" class="stack"></div>
          <p class="eyebrow">Notes</p><div id="p-notes" class="stack"></div>
          <p class="eyebrow">Foyer</p><p class="small">Missions de la maison, défis de la Voie du mois et prénoms des parents. Tout reste sur ce téléphone.</p><button class="btn" data-go="fprep">Préparer le Foyer</button>
          <p class="eyebrow">Réglages</p>
        <label class="stack"><span class="small"><b>Nouvelles cartes par jour</b> au maximum : <b id="st-new-v">${S().settings.newPerDay}</b></span><input type="range" id="st-new" min="5" max="50" step="5" value="${S().settings.newPerDay}"><span class="tiny muted">Plus haut = découvre plus vite les nouvelles leçons, mais les révisions des jours suivants seront plus longues.</span></label>
        <label class="stack"><span class="small"><b>Zone de vacances scolaires</b> (pour le calendrier de la conjugaison)</span><select id="st-zone">${["A", "B", "C"].map((z) => `<option ${S().settings.zone === z ? "selected" : ""}>${z}</option>`).join("")}</select></label>
          <p class="eyebrow">Importer un pack de leçon</p>
        <p class="small">Un pack ajoute des leçons, des fiches, des cartes, des repères de frise ou des lieux, rattachés au programme. Choisis le fichier <b>.json</b> reçu, ou colle son contenu.</p>
        <label class="btn">Choisir un fichier<input type="file" accept=".json,application/json" id="pk-file" hidden></label>
        <textarea id="pk-txt" placeholder='{"format":"hikari-pack", …}'></textarea><button class="btn primary" id="pk-go">Importer le texte collé</button><div id="pk-res"></div>
        ${(S().packs || []).length ? `<p class="eyebrow">Packs installés</p>${S().packs.map((p) => `<div class="small">• ${esc(p.title || p.id)} <span class="muted">(${esc(p.created || "")})</span></div>`).join("")}` : ""}
          <p class="eyebrow">Sauvegarde et remise à zéro</p>
        <label class="btn">Restaurer une sauvegarde<input type="file" accept=".json,application/json" id="bk-in" hidden></label>
        <button class="btn ghost" id="reset">Tout effacer et recommencer</button>
          <button class="btn ghost sm" id="p-chg">Changer le code parent</button> <button class="btn ghost sm" id="p-out">Verrouiller</button>
        </div></div></details>
      <details><summary>Programme officiel et couverture</summary><div class="in" id="cov"></div></details>
      <details><summary>Sources et à propos</summary><div class="in small">
        <p>Hikari suit les programmes officiels de 6e en vigueur en 2026-2027. Les textes sont paraphrasés ; en cas de doute, la leçon de ta prof fait foi. Le découpage en leçons suit une progression type, non officielle.</p>
        ${Object.values(PROGRAMME.sources).map((s) => `<p>• <a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></p>`).join("")}
        <p>Fonds de carte : Natural Earth (domaine public). Police des kanji : Kaisei Decol (SIL Open Font License). Univers, personnages et yōkai : créations originales.</p></div></details>`;
    if (arg === "nouvelle") setTimeout(() => $("#d-nl").scrollIntoView({ behavior: "smooth" }), 200);
    drawLock();
    // Nouvelle leçon photo : matière → chapitre → titre, points du programme, photos
    const nl = $("#nl"); let tgt = newLessonTarget || { s: "fr", ch: null }; newLessonTarget = null;
    function drawNL() {
      const s = sub(tgt.s); const chs = STORE.CH.filter((c) => c.s === tgt.s); if (!tgt.ch || !STORE.CHI[tgt.ch] || STORE.CHI[tgt.ch].s !== tgt.s) tgt.ch = (chs.find((c) => STORE.chapterState(c.id) !== "locked") || chs[0]).id;
      const chRefs = new Set(STORE.CHI[tgt.ch].refs || []);
      nl.innerHTML = `<p class="small">Ta prof fait une nouvelle leçon ? Crée-la dans son chapitre, rattache-la au programme et ajoute tes photos. Elle sera enrichie ensuite par un pack.</p>
        <select id="nl-s">${PROGRAMME.subjects.map((x) => `<option value="${x.id}" ${x.id === tgt.s ? "selected" : ""}>${x.name}</option>`).join("")}</select>
        <select id="nl-c">${chs.map((c) => `<option value="${c.id}" ${c.id === tgt.ch ? "selected" : ""}>${esc(c.title)}</option>`).join("")}</select>
        <input type="text" id="nl-t" placeholder="Titre de la leçon (comme dans ton cahier)" maxlength="80">
        <span class="small"><b>Points du programme concernés</b> <span class="muted">(ceux du chapitre sont pré-cochés)</span></span>
        <div class="checks">${s.domains.map((d) => `<span class="eyebrow">${esc(d.name)}</span>${d.items.map((it) => `<label><input type="checkbox" value="${it.id}" ${chRefs.has(it.id) ? "checked" : ""}><span><b>${esc(it.t)}</b> <span class="muted">${it.id}</span></span></label>`).join("")}`).join("")}</div>
        <label class="btn">Ajouter les photos<input type="file" accept="image/*" capture="environment" multiple id="nl-ph" hidden></label><span class="small muted" id="nl-n">0 photo</span>
        <button class="btn primary" id="nl-go">Créer la leçon</button>`;
      let files = [];
      $("#nl-s").onchange = (e) => { tgt = { s: e.target.value, ch: null }; drawNL(); };
      $("#nl-c").onchange = (e) => { tgt.ch = e.target.value; drawNL(); };
      $("#nl-ph").onchange = (e) => { files = Array.from(e.target.files || []); $("#nl-n").textContent = plural(files.length, "photo"); };
      $("#nl-go").onclick = async () => {
        const t = $("#nl-t").value.trim(), refs = $$(".checks input:checked", nl).map((i) => i.value);
        if (!t) return toast("Donne un titre à ta leçon.");
        if (!refs.length) return toast("Coche au moins un point du programme.");
        const ts = Date.now(), lid = `u-${tgt.ch}-${ts}`;
        STORE.importPack({ format: "hikari-pack", version: 2, id: "photo-" + ts, title: "Leçon photo : " + t, created: STORE.today(), activate: false, extend: [{ chapter: tgt.ch, lessons: [{ id: lid, title: t, refs, userMade: true, cards: [] }] }] });
        STORE.openLesson(lid); STORE.save();
        for (const f of files) await STORE.addPhoto(lid, f);
        FX.sfx("stamp"); toast("Leçon créée !"); afterAction(); go("le~" + lid);
      };
    }
    drawNL();
    const doImport = (txt) => { let p; try { p = JSON.parse(txt); } catch (e) { $("#pk-res").innerHTML = `<p class="small" style="color:var(--bad)"><b>Fichier illisible</b> : ce n'est pas du JSON valide.</p>`; return; } const r = STORE.importPack(p); $("#pk-res").innerHTML = r.errs.length ? `<p class="small" style="color:var(--bad)"><b>Import refusé</b><br>${r.errs.map(esc).join("<br>")}</p>` : `<p class="small" style="color:var(--good)"><b>Pack importé : ${esc(p.title || p.id)}</b></p>${r.warns.length ? `<p class="tiny muted">${r.warns.map(esc).join("<br>")}</p>` : ""}`; if (!r.errs.length) { STORE.addXP(15); FX.sfx("win"); fxText("巻！"); afterAction(); } };
    $("#pk-file").onchange = async (e) => { const f = e.target.files[0]; if (f) doImport(await f.text()); };
    $("#pk-go").onclick = () => doImport($("#pk-txt").value);
    $("#st-goal").onchange = (e) => { S().settings.goal = +e.target.value; STORE.save(); renderHUD(); };
    $("#st-new").oninput = (e) => { $("#st-new-v").textContent = e.target.value; };
    $("#st-new").onchange = (e) => { S().settings.newPerDay = +e.target.value; STORE.save(); toast(`${e.target.value} nouvelles cartes par jour au maximum.`); };
    $("#st-zone").onchange = (e) => { S().settings.zone = e.target.value; STORE.save(); toast(`Zone ${e.target.value} enregistrée.`); };
    $("#st-sound").onchange = (e) => { S().settings.sound = e.target.checked; STORE.save(); FX.sfx("good"); };
    $("#st-hap").onchange = (e) => { S().settings.haptics = e.target.checked; STORE.save(); FX.buzz(30); };
    $$("[data-el]", main).forEach((b) => (b.onclick = () => { S().profile.element = b.dataset.el; STORE.save(); FX.sfx("pick"); applyAccent(); viewMe(main); }));
    $("#persist").onclick = async () => { try { const ok = navigator.storage && navigator.storage.persist && (await navigator.storage.persist()); toast(ok ? "Données protégées sur ce téléphone." : "Le navigateur n'a pas accordé la protection. Installe l'application pour l'obtenir."); } catch (e) { toast("Protection indisponible ici."); } };
    $("#bk-out").onclick = () => { const blob = new Blob([STORE.exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `hikari-sauvegarde-${STORE.today()}.json`; document.body.appendChild(a); a.click(); a.remove(); toast("Sauvegarde téléchargée."); };
    $("#bk-in").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { STORE.importAll(JSON.parse(await f.text())); applyAccent(); toast("Sauvegarde restaurée."); render(); } catch (err) { toast(err.message || "Fichier illisible."); } };
    $("#reset").onclick = (e) => { if (e.target.dataset.sure) { STORE.reset(); location.hash = "#dojo"; render(); } else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer : tout effacer définitivement"; e.target.classList.add("primary"); } };
    const covered = {}; STORE.CH.forEach((c) => { (c.refs || []).forEach((r) => ((covered[r] = covered[r] || []).push({ c, filled: !c.stub }))); c.lessons.forEach((l) => (l.refs || []).forEach((r) => ((covered[r] = covered[r] || []).push({ c, filled: !l.stub })))); });
    $("#cov").innerHTML = `<p class="small">Pour chaque point officiel : y a-t-il du contenu Hikari qui s'y rattache ?</p>` + PROGRAMME.subjects.map((s) => `<details><summary>${s.name}</summary><div class="in cov">${s.domains.map((d) => `<span class="eyebrow">${esc(d.name)}</span>${d.items.map((it) => { const cs = covered[it.id] || []; const withContent = cs.filter((x) => x.filled); return `<div class="it"><span><b>${esc(it.t)}</b> <span class="muted tiny">${it.id}</span></span><span class="pill ${withContent.length ? "on" : cs.length ? "new" : "off"}">${withContent.length ? "contenu" : cs.length ? "prévu" : "—"}</span></div>`; }).join("")}`).join("")}<p class="tiny muted">${esc(PROGRAMME.sources[s.src].label)}</p></div></details>`).join("");
  }


  // =================== Emploi du temps et agenda ===================
  const dLong = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  const whenTxt = (iso) => { const n = AGENDA.daysTo(iso); return n === 0 ? "aujourd'hui" : n === 1 ? "demain" : n < 7 ? `${new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", timeZone: "UTC" })} (dans ${n} j)` : `le ${new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" })}`; };
  function focusWhen(it) { const sj = AGENDA.subj(it.s); return `${AGENDA.TYPES[it.type] ? AGENDA.TYPES[it.type][0] : "Échéance"} de ${sj.n} ${whenTxt(it.date)}`; }
  const sjChip = (sl) => { const sj = AGENDA.subj(sl.s); return `<span class="sj-chip" style="--c:${sj.c}">${sj.ic} ${esc(sl.lab || sj.n)}</span>`; };
  const nowHM = () => { const d = new Date(); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
  // Carte du Dōjō : le cartable (aujourd'hui le matin, le lendemain ensuite) et les échéances proches
  function drawCartable() {
    const box = $("#cartable"); if (!box || !window.AGENDA) return;
    const t = STORE.today(), e = AGENDA.E(), up = AGENDA.upcoming().filter((x) => AGENDA.daysTo(x.date) <= AGENDA.WINDOW);
    if (!e.slots.length && !AGENDA.A().length) { box.innerHTML = `<button class="panel cartable-empty" data-go="agenda"><span class="ct-k">時</span><span class="stack" style="gap:2px;text-align:left"><b>Mon emploi du temps et mon agenda</b><span class="small muted">Recopie ton emploi du temps une fois, note tes interros : Ren t'aide à préparer les bonnes leçons.</span></span></button>`; return; }
    const morning = nowHM() < "13:00" && AGENDA.slotsOn(t).length, day = morning ? t : AGENDA.nextSchoolDay(t), bag = day ? AGENDA.bag(day) : [];
    box.innerHTML = `<section class="panel stack cartable" data-go="agenda">
      ${e.slots.length ? `<div class="row" style="justify-content:space-between"><span class="eyebrow">${morning ? "Aujourd'hui" : day ? (AGENDA.daysTo(day) === 1 ? "Demain dans ton sac" : `Dans ton sac pour ${new Date(day + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", timeZone: "UTC" })}`) : "Vacances !"}</span>${AGENDA.E().ref ? `<span class="tiny muted">semaine ${AGENDA.weekNo(day || t)}</span>` : ""}</div>
        <div class="row wrap" style="gap:6px">${bag.map(sjChip).join("") || `<span class="small muted">Pas de cours.</span>`}</div>` : ""}
      ${up.length ? up.slice(0, 3).map((x) => { const sj = AGENDA.subj(x.s); return `<div class="due-row" style="--c:${sj.c}"><span class="due-ic">${AGENDA.TYPES[x.type][1]}</span><span class="stack" style="gap:0"><b>${esc(AGENDA.TYPES[x.type][0])} de ${esc(sj.n)} ${whenTxt(x.date)}</b><span class="tiny muted">${x.lessons.length ? "Ces leçons passent en tête de tes révisions." : esc(x.title || "")}</span></span></div>`; }).join("") : ""}
    </section>`;
  }
  function viewAgenda(main, arg) {
    const tab = arg || "semaine";
    main.innerHTML = `<div class="foyer-head"><h1>Ma semaine</h1><p class="small muted">Ton emploi du temps et tes échéances. Tes cours de l'agenda remontent dans tes révisions 7 jours avant.</p></div>
      <div class="seg">${[["semaine", "Emploi du temps"], ["agenda", "Agenda"]].map(([id, n]) => `<button aria-pressed="${tab === id}" data-go="agenda~${id}">${n}</button>`).join("")}</div><div id="ag"></div>`;
    (tab === "agenda" ? drawAgendaList : drawEdt)($("#ag"));
  }
  // ---------- Emploi du temps (grille) ----------
  function drawEdt(box, wShow) {
    const e = AGENDA.E(), t = STORE.today();
    if (!e.slots.length) { box.innerHTML = `<section class="panel stack" style="align-items:center;text-align:center">${ART.sensei("happy", 96)}<p><b>Recopie ton emploi du temps</b>, une seule fois pour l'année, avec les semaines 1 et 2.</p><button class="btn primary" data-go="edt">Commencer</button></section>`; return; }
    const cur = AGENDA.weekNo(t) || 1, w = wShow || cur, days = e.slots.some((s) => s.d === 5) ? 6 : 5;
    const sl = e.slots.filter((s) => !s.w || s.w === w), toMin = (hm) => { const [h, m] = hm.split(":"); return +h * 60 + +m; };
    const lo = Math.min(...sl.map((s) => toMin(s.start))), hi = Math.max(...sl.map((s) => toMin(s.end))), K = 1.05;
    const todayCol = w === cur && !AGENDA.isHoliday(t) ? AGENDA.dowOf(t) : -1, nm = toMin(nowHM());
    const hours = []; for (let h = Math.ceil(lo / 60); h * 60 <= hi; h++) hours.push(h);
    box.innerHTML = `<section class="stack"><div class="row" style="justify-content:space-between;align-items:center"><div class="seg wk-seg">${[1, 2].map((n) => `<button aria-pressed="${n === w}" data-w="${n}">Semaine ${n}${n === cur ? " ·  en cours" : ""}</button>`).join("")}</div></div>
      <div class="edt" style="--cols:${days};height:${(hi - lo) * K + 30}px">
        <div class="edt-hours">${hours.map((h) => `<span style="top:${(h * 60 - lo) * K + 26}px">${h}h</span>`).join("")}</div>
        ${Array.from({ length: days }, (_, d) => `<div class="edt-col ${d === todayCol ? "today" : ""}"><span class="edt-day">${AGENDA.DAYS[d].slice(0, 3)}</span>
          ${sl.filter((s) => s.d === d).map((s) => { const sj = AGENDA.subj(s.s), top = (toMin(s.start) - lo) * K + 26, h = (toMin(s.end) - toMin(s.start)) * K - 3, now = d === todayCol && nm >= toMin(s.start) && nm < toMin(s.end);
            return `<button class="edt-b ${now ? "now" : ""}" style="top:${top}px;height:${h}px;--c:${sj.c}" data-sl="${s.id}"><span class="eb-ic">${sj.ic}</span><span class="eb-n">${esc(s.lab || sj.n)}</span>${h > 44 ? `<span class="eb-t">${s.start}${s.room ? " · " + esc(s.room) : ""}</span>` : ""}</button>`; }).join("")}
          ${d === todayCol && nm > lo && nm < hi ? `<i class="edt-now" style="top:${(nm - lo) * K + 26}px"></i>` : ""}</div>`).join("")}
      </div>
      <div class="row wrap"><button class="btn" data-go="edt">Modifier mon emploi du temps</button><button class="btn ghost sm" id="wk-fix">On n'est pas en semaine ${cur} ?</button></div>
      <p class="tiny muted">L'alternance saute les vacances scolaires (zone ${esc(S().settings.zone)}). Si le collège compte autrement, corrige la semaine en cours : la suite se recale.</p></section>`;
    $$("[data-w]", box).forEach((b) => (b.onclick = () => drawEdt(box, +b.dataset.w)));
    $("#wk-fix").onclick = () => { AGENDA.setWeek(cur === 1 ? 2 : 1); toast(`C'est noté : cette semaine est une semaine ${cur === 1 ? 2 : 1}.`); drawEdt(box); };
    $$("[data-sl]", box).forEach((b) => (b.onclick = () => { const s = e.slots.find((x) => x.id === b.dataset.sl), sj = AGENDA.subj(s.s); toast(`${sj.ic} ${s.lab || sj.n} · ${AGENDA.DAYS[s.d].toLowerCase()} ${s.start}–${s.end}${s.room ? " · salle " + s.room : ""}${s.w ? " · semaine " + s.w + " seulement" : ""}`); }));
  }
  // ---------- Saisie de l'emploi du temps (par l'élève) ----------
  function viewEdtEdit(main) {
    const e = AGENDA.E(), slots = JSON.parse(JSON.stringify(e.slots)), icons = Object.assign({}, e.icons); let ref = e.ref ? AGENDA.weekNo() : 0, sat = slots.some((s) => s.d === 5);
    const SJ = () => AGENDA.subjects();
    const paint = () => {
      const days = sat ? 6 : 5;
      main.innerHTML = `<section class="stack"><p class="eyebrow">Ma semaine</p><h1>Mon emploi du temps</h1><p class="small muted">Recopie-le depuis ton carnet ou École Directe. Un cours qui n'a lieu qu'une semaine sur deux : choisis « Sem. 1 » ou « Sem. 2 ».</p></section>
        <section class="panel stack"><b>Cette semaine, on est en…</b><div class="seg">${[1, 2].map((n) => `<button aria-pressed="${ref === n}" data-ref="${n}">Semaine ${n}</button>`).join("")}</div></section>
        ${Array.from({ length: days }, (_, d) => `<section class="panel stack"><h2>${AGENDA.DAYS[d]}</h2>
          ${slots.map((s, i) => [s, i]).filter(([s]) => s.d === d).sort((a, b) => (a[0].start < b[0].start ? -1 : 1)).map(([s, i]) => `<div class="prep-it" data-si="${i}" style="border-left:5px solid ${AGENDA.subj(s.s).c}">
            <div class="row"><input type="time" data-f="start" value="${s.start}" style="width:auto"><span class="small">à</span><input type="time" data-f="end" value="${s.end}" style="width:auto"><button class="btn ghost sm" data-sdel="${i}" style="margin-left:auto" aria-label="Supprimer">✕</button></div>
            <div class="row"><select data-f="s" style="flex:1">${SJ().map((x) => `<option value="${x.id}" ${x.id === s.s ? "selected" : ""}>${x.ic} ${esc(x.n)}</option>`).join("")}</select><select data-f="w" style="width:auto">${[["", "Sem. 1 et 2"], ["1", "Sem. 1"], ["2", "Sem. 2"]].map(([v, n]) => `<option value="${v}" ${String(s.w || "") === v ? "selected" : ""}>${n}</option>`).join("")}</select></div>
            <div class="row">${s.s === "autre" ? `<input data-f="lab" value="${esc(s.lab || "")}" placeholder="Nom (ex. Chorale)" maxlength="30" style="flex:1">` : ""}<input data-f="room" value="${esc(s.room || "")}" placeholder="Salle" maxlength="12" style="width:6em"></div></div>`).join("") || `<p class="small muted">Pas de cours.</p>`}
          <button class="btn sm" data-sadd="${d}">+ Ajouter un cours</button></section>`).join("")}
        <label class="row small" style="gap:8px"><input type="checkbox" id="sat" ${sat ? "checked" : ""}> J'ai cours le samedi</label>
        <details><summary>Les icônes de mes matières</summary><div class="in stack">${SJ().map((x) => `<label class="row" style="gap:8px"><input class="prep-ic" data-ic="${x.id}" value="${esc(x.ic)}" maxlength="4"><span class="sj-chip" style="--c:${x.c}">${esc(x.n)}</span></label>`).join("")}<p class="tiny muted">Choisis un emoji sur ton clavier pour chaque matière.</p></div></details>
        <div class="row wrap"><button class="btn primary" id="edt-save" style="flex:1">Enregistrer</button><button class="btn ghost" data-go="agenda">Annuler</button></div>`;
      const read = () => { $$("[data-si]", main).forEach((r) => { const s = slots[+r.dataset.si]; $$("[data-f]", r).forEach((x) => (s[x.dataset.f] = x.dataset.f === "w" ? (+x.value || 0) : x.value.trim())); }); $$("[data-ic]", main).forEach((x) => { if (x.value.trim()) icons[x.dataset.ic] = x.value.trim(); }); };
      $$("[data-ref]", main).forEach((b) => (b.onclick = () => { read(); ref = +b.dataset.ref; paint(); }));
      $$("[data-sadd]", main).forEach((b) => (b.onclick = () => { read(); const d = +b.dataset.sadd, same = slots.filter((s) => s.d === d).sort((a, c) => (a.end < c.end ? 1 : -1))[0];
        const start = same ? same.end : "08:00", [h, m] = start.split(":").map(Number), end = String(h + 1).padStart(2, "0") + ":" + String(m).padStart(2, "0");
        slots.push({ id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 4), d, start, end, s: "fr", w: 0 }); paint(); }));
      $$("[data-sdel]", main).forEach((b) => (b.onclick = () => { read(); slots.splice(+b.dataset.sdel, 1); paint(); }));
      $$("[data-f=s]", main).forEach((x) => (x.onchange = () => { read(); paint(); }));
      $("#sat").onchange = (ev) => { read(); sat = ev.target.checked; paint(); };
      $("#edt-save").onclick = () => { read();
        const bad = slots.find((s) => !(s.start < s.end)); if (bad) return toast(`${AGENDA.DAYS[bad.d]} : l'heure de fin doit être après l'heure de début.`);
        if (slots.some((s) => s.w) && !ref) return toast("Dis-moi si cette semaine est une semaine 1 ou 2.");
        e.slots = slots.filter((s) => sat || s.d < 5); e.icons = icons; if (ref && ref !== (e.ref ? AGENDA.weekNo() : 0)) AGENDA.setWeek(ref); else if (!e.ref && ref) AGENDA.setWeek(ref);
        STORE.save(); FX.sfx("stamp"); toast("Emploi du temps enregistré."); go("agenda", true); };
    };
    paint();
  }
  // ---------- Agenda ----------
  function drawAgendaList(box) {
    const up = AGENDA.upcoming(), past = AGENDA.past().slice(0, 10);
    const row = (x, old) => { const sj = AGENDA.subj(x.s), ty = AGENDA.TYPES[x.type] || AGENDA.TYPES.ctrl, n = STORE.buildSession({ agenda: x.id }).length;
      return `<div class="ag-it ${old ? "old" : ""}" style="--c:${sj.c}"><div class="row" style="gap:10px;align-items:flex-start"><span class="due-ic">${ty[1]}</span><span class="stack" style="gap:2px;flex:1"><b>${esc(ty[0])} · ${sj.ic} ${esc(sj.n)}</b><span class="small">${old ? dLong(x.date) : whenTxt(x.date)}${x.title ? " · " + esc(x.title) : ""}</span>
        ${x.lessons.length ? `<span class="tiny muted">${x.lessons.map((l) => STORE.LEI[l] ? esc(STORE.LEI[l].title) : "").filter(Boolean).join(" · ")}</span>` : `<span class="tiny muted">Aucune leçon liée dans Hikari.</span>`}</span><button class="btn ghost sm" data-adel="${x.id}" aria-label="Supprimer">✕</button></div>
        ${!old && n ? `<button class="btn sm primary" data-go="seance~a:${x.id}">S'entraîner maintenant · ${n}</button>` : ""}</div>`; };
    box.innerHTML = `<button class="btn primary" id="ag-new">+ Noter une interro ou une leçon</button>
      <section class="stack"><h2>À venir</h2>${up.length ? up.map((x) => row(x)).join("") : `<p class="small muted">Rien de prévu. Dès qu'une prof annonce une interro, note-la ici.</p>`}</section>
      ${past.length ? `<details><summary>Passées</summary><div class="in stack">${past.map((x) => row(x, true)).join("")}</div></details>` : ""}`;
    $("#ag-new").onclick = () => agendaForm(box);
    $$("[data-adel]", box).forEach((b) => (b.onclick = () => { if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = "Sûr ?"; return; } AGENDA.del(b.dataset.adel); drawAgendaList(box); }));
  }
  function agendaForm(box) {
    const st = { type: "ctrl", s: "ma", date: "", lessons: [], title: "" };
    const paint = () => {
      const sj = AGENDA.subj(st.s), nc = AGENDA.nextClass(st.s), hk = sj.hk;
      const ls = []; if (hk) STORE.CH.forEach((c) => { if (c.s !== st.s) return; c.lessons.forEach((l) => { if (STORE.lessonOpen(l.id)) ls.push({ l, c, since: (S().lessons[l.id] && S().lessons[l.id].since) || "" }); }); });
      ls.sort((a, b) => (a.since < b.since ? 1 : -1));
      box.innerHTML = `<section class="panel stack"><h2>Noter une échéance</h2>
        <div class="row wrap" style="gap:6px">${Object.entries(AGENDA.TYPES).map(([k, [n, ic]]) => `<button class="pday ${st.type === k ? "on" : ""}" data-ty="${k}">${ic} ${n}</button>`).join("")}</div>
        <label class="stack"><span class="small"><b>Matière</b></span><select id="af-s">${AGENDA.subjects().filter((x) => x.id !== "etude" && x.id !== "vdc").map((x) => `<option value="${x.id}" ${x.id === st.s ? "selected" : ""}>${x.ic} ${esc(x.n)}</option>`).join("")}</select></label>
        <label class="stack"><span class="small"><b>Pour quand ?</b></span><div class="row wrap" style="gap:6px">${nc ? `<button class="pday ${st.date === nc ? "on" : ""}" data-dt="${nc}">Prochain cours : ${new Date(nc + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", timeZone: "UTC" })}</button>` : ""}<input type="date" id="af-d" value="${st.date}" min="${STORE.today()}" style="width:auto"></div></label>
        <label class="stack"><span class="small"><b>Sur quoi ?</b> (facultatif)</span><input id="af-t" value="${esc(st.title)}" maxlength="80" placeholder="Ex. les fractions, la poésie à réciter"></label>
        ${hk ? `<div class="stack"><span class="small"><b>Les leçons de Hikari à réviser</b></span>${ls.length ? `<div class="fix-list">${ls.map(({ l, c }) => `<label class="fix-row"><input type="checkbox" data-l="${l.id}" ${st.lessons.includes(l.id) ? "checked" : ""}> <span class="small">${esc(l.title)} <span class="muted tiny">· ${esc(c.title)}</span></span></label>`).join("")}</div>` : `<p class="small muted">Aucune leçon ouverte dans cette matière.</p>`}<p class="tiny muted">La leçon n'y est pas ? Demande à Papa d'envoyer la photo de ton cours.</p></div>` : ""}
        <div class="row wrap"><button class="btn primary" id="af-ok" style="flex:1">Enregistrer</button><button class="btn ghost" id="af-x">Annuler</button></div></section>`;
      const read = () => { st.title = $("#af-t").value.trim(); if ($("#af-d").value) st.date = $("#af-d").value; st.lessons = $$("[data-l]", box).filter((c) => c.checked).map((c) => c.dataset.l); };
      $$("[data-ty]", box).forEach((b) => (b.onclick = () => { read(); st.type = b.dataset.ty; paint(); }));
      $$("[data-dt]", box).forEach((b) => (b.onclick = () => { read(); st.date = b.dataset.dt; paint(); }));
      $("#af-d").onchange = () => { read(); paint(); };
      $("#af-s").onchange = (ev) => { read(); st.s = ev.target.value; st.lessons = []; paint(); };
      $("#af-x").onclick = () => drawAgendaList(box);
      $("#af-ok").onclick = () => { read(); if (!st.date) return toast("Choisis la date."); if (st.date < STORE.today()) return toast("Cette date est déjà passée.");
        AGENDA.add({ type: st.type, s: st.s, date: st.date, title: st.title, lessons: st.lessons }); FX.sfx("stamp");
        toast(st.lessons.length ? "Noté ! Ces leçons passeront en tête de tes révisions 7 jours avant." : "Noté !"); drawAgendaList(box); };
    };
    paint();
  }

  // =================== Foyer : missions, Voie du mois, Jardin des bienfaits ===================
  // Rappel : uniquement à partir de l'heure de la mission (19 h), jamais avant.
  function foyerPending() { const t = FOYER.paris(); return FOYER.due(t.iso).filter((m) => !FOYER.doneOf(t.iso, m.id) && t.hm >= FOYER.atMin(m)); }
  function foyerAlert() { try { return S().profile && foyerPending().length > 0; } catch (e) { return false; } }
  function foyerReminder() {
    const p = foyerPending(); if (!p.length) return; const f = FOYER.F(), t = FOYER.paris(); f.reminded = f.reminded || {};
    if (f.reminded[t.iso]) return; f.reminded[t.iso] = 1; STORE.save();
    celebrate("家の任務！", `${ART.sensei("think", 96)}<p>Il est l'heure de ta mission du soir :</p><ul class="small" style="text-align:left">${p.map((m) => `<li>${m.ic} <b>${esc(m.n)}</b></li>`).join("")}</ul><p class="tiny muted">Coche-la dans Foyer quand c'est fait.</p>`, "J'y vais !", "level").then(() => go("foyer"));
  }
  function viewFoyer(main, arg) {
    const tab = arg || "missions";
    main.innerHTML = `<div class="foyer-head"><h1>Foyer</h1><p class="small muted">La vie de la maison. Ça ne compte pas pour tes révisions, et tes révisions ne comptent pas ici.</p></div>
      <div class="seg foyer-seg">${[["missions", "Missions"], ["voie", "Voie du mois"], ["jardin", "Jardin"]].map(([id, n]) => `<button aria-pressed="${tab === id}" data-go="foyer~${id}">${n}</button>`).join("")}</div><div id="fy"></div>`;
    if (!FOYER.ready() && tab !== "jardin") { $("#fy").innerHTML = `<section class="panel stack" style="align-items:center;text-align:center">${ART.sensei("think", 96)}<p><b>Le Foyer n'est pas encore préparé.</b></p><p class="small">Demande à tes parents : ils choisissent tes missions et tes défis dans <b>Moi → Espace parent → Foyer</b>.</p><button class="btn" data-go="fprep">Espace parent</button></section>`; return; }
    ({ missions: foyerMissions, voie: foyerVoie, jardin: foyerJardin })[tab]($("#fy"));
  }
  const dShort = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", timeZone: "UTC" });
  const medal = (r) => !r ? "" : r.t === "gold" ? `<span class="medal gold" title="Faite d'elle-même">金</span>` : r.t === "silver" ? `<span class="medal silver" title="Faite après le rappel">銀</span>` : `<span class="medal parent" title="Validée par un parent">✓</span>`;
  function foyerMissions(box) {
    const won = FOYER.checkTokens(); const t = FOYER.paris(), today = FOYER.due(t.iso), w = FOYER.week(FOYER.mondayOf(t.iso)), f = FOYER.F();
    const beforeDeadline = (m) => t.hm < FOYER.atMin(m);
    box.innerHTML = `<section class="panel stack"><div class="row" style="justify-content:space-between"><h2>Aujourd'hui</h2><span class="small muted">${FOYER.DOW[t.dow]}</span></div>
        ${today.map((m) => { const r = FOYER.doneOf(t.iso, m.id); return `<button class="mission ${r ? "done" : ""} ${!r && !beforeDeadline(m) ? "late" : ""}" data-m="${m.id}"><span class="mi">${m.ic}</span><span class="mt"><b>${esc(m.n)}</b><span class="tiny muted">${r ? (r.t === "gold" ? "Faite d'elle-même : médaille d'or" : r.t === "silver" ? "Faite après le rappel : médaille d'argent" : "Validée par un parent") : beforeDeadline(m) ? `avant ${m.at}` : `il est l'heure : à faire maintenant`}</span></span>${r ? medal(r) : `<span class="check" aria-hidden="true"></span>`}</button>`; }).join("")}
        ${today.length ? `<p class="tiny muted">Coche avant l'heure indiquée pour la médaille d'or 金. Après, c'est la médaille d'argent 銀.</p>` : `<p class="small muted">Pas de mission aujourd'hui : profite !</p>`}</section>
      <section class="panel stack"><div class="row" style="justify-content:space-between"><h2>Ma semaine</h2><span class="small muted">${w.done} / ${w.total}</span></div>
        <div class="wk">${w.days.map((d) => `<div class="wd ${d.iso === t.iso ? "today" : ""}"><span class="tiny">${dShort(d.iso)}</span>${d.ms.map((x) => `<span class="wm ${x.r ? "ok" : d.iso < t.iso ? "miss" : ""}" title="${esc(x.m.n)}">${x.r ? medal(x.r) : x.m.ic}</span>`).join("")}</div>`).join("")}</div>
        <div class="dbar"><i style="width:${w.total ? Math.round((100 * w.done) / w.total) : 0}%"></i></div>
        <p class="small">${w.complete ? `Semaine complète : ton jeton est gagné${w.allGold ? ", et tout en or !" : " !"}` : `Toutes les missions de la semaine = un jeton à échanger avec ${esc(FOYER.tokenWith())} en fin de semaine.`}</p>
        <button class="btn ghost sm" id="fy-fix" style="justify-self:start">Corriger un jour (parent)</button></section>
      <section class="stack"><h2>Mes jetons</h2>${Object.keys(f.tokens).length ? Object.entries(f.tokens).sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([mon, tk]) => `<div class="ticket ${tk.used ? "used" : ""}"><div class="tk-l token-face ${tk.gold ? "gold" : ""}"><span>家</span></div><div class="tk-r stack" style="gap:3px"><span class="who">Jeton de la semaine${tk.gold ? " · tout en or" : ""}</span><b>Semaine du ${new Date(mon + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" })}</b>
          ${tk.used ? `<span class="stamp-used">Échangé le ${new Date(tk.used + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" })}</span>` : `<button class="btn sm primary" data-tok="${mon}" style="justify-self:start">Échanger avec ${esc(FOYER.tokenWith())}</button>`}</div></div>`).join("") : `<p class="small muted">Pas encore de jeton : termine toutes les missions d'une semaine.</p>`}</section>`;
    $$("[data-m]", box).forEach((b) => (b.onclick = () => {
      const id = b.dataset.m; if (FOYER.doneOf(t.iso, id)) { if (!b.dataset.sure) { b.dataset.sure = 1; toast("Touche encore pour décocher."); return; } FOYER.untick(id); return foyerMissions(box); }
      const r = FOYER.tick(id); FX.sfx(r.t === "gold" ? "level" : "good"); const [x, y] = FX.center(b); FX.burst(x, y, { n: r.t === "gold" ? 40 : 20, colors: r.t === "gold" ? ["#E8B923", "#FFD36E", "#fff"] : ["#C0C7D1", "#fff"] });
      fxText(r.t === "gold" ? "金 BRAVO !" : "銀 FAIT !"); setTimeout(() => { foyerMissions(box); renderTabs("foyer"); const nw = FOYER.checkTokens(); if (nw.length) celebrate("家の印！", `<div class="token-face big ${FOYER.F().tokens[nw[0]].gold ? "gold" : ""}"><span>家</span></div><p><b>Semaine complète !</b></p><p class="small">Ton jeton t'attend : montre-le à ${esc(FOYER.tokenWith())}.</p>`, "Génial !", "level"); }, 650);
    }));
    $$("[data-tok]", box).forEach((b) => (b.onclick = async () => { if (!(await pinPrompt("Échanger le jeton de la semaine : code parent"))) return; FOYER.F().tokens[b.dataset.tok].used = FOYER.paris().iso; STORE.save(); FX.sfx("stamp"); toast("Jeton échangé. Merci pour ton aide !"); foyerMissions(box); }));
    $("#fy-fix").onclick = async () => {
      if (!(await pinPrompt("Corriger les missions : code parent"))) return;
      const mon = FOYER.mondayOf(t.iso), prev = FOYER.week(FOYER.addDays(mon, -7)), cur = FOYER.week(mon);
      const rows = prev.days.concat(cur.days).filter((d) => d.iso <= t.iso && d.ms.length);
      const o = document.createElement("div"); o.className = "celebrate";
      o.innerHTML = `<div class="panel stack" style="align-items:stretch;text-align:left"><b>Corriger les 2 dernières semaines</b><div class="fix-list">${rows.map((d) => d.ms.map((x) => `<label class="fix-row"><input type="checkbox" data-d="${d.iso}" data-id="${x.m.id}" ${x.r ? "checked" : ""}> <span class="small">${dShort(d.iso)} · ${x.m.ic} ${esc(x.m.n)}</span></label>`).join("")).join("")}</div><button class="btn primary" id="fix-ok">Terminé</button></div>`;
      document.body.appendChild(o);
      $$("input[data-d]", o).forEach((c) => (c.onchange = () => { if (c.checked) FOYER.tick(c.dataset.id, true, c.dataset.d); else FOYER.untick(c.dataset.id, c.dataset.d); }));
      $("#fix-ok", o).onclick = () => { o.remove(); FOYER.checkTokens(); foyerMissions(box); renderTabs("foyer"); };
    };
  }
  function foyerVoie(box) {
    const t = FOYER.paris(), y = FOYER.addDays(t.iso, -1), m = FOYER.monthOf(t.iso), pts = FOYER.voiePoints(m), { L, next } = FOYER.levelOf(pts), best = FOYER.bestMonth(), f = FOYER.F();
    const monthName = new Date(t.iso + "T12:00:00Z").toLocaleDateString("fr-FR", { month: "long", timeZone: "UTC" });
    const row = (v, iso) => { const on = !!(f.voie[iso] && f.voie[iso][v.id]), other = v.freq === "semaine" && FOYER.voieDoneThisWeek(v.id, iso);
      return `<button class="voie-it ${on ? "on" : ""}" data-v="${v.id}" data-d="${iso}" ${other && !on ? "disabled" : ""}><span class="mi">${v.ic}</span><span class="mt"><b>${esc(v.n)}</b><span class="tiny muted">${v.freq === "semaine" ? `+${v.p} · une fois par semaine${other && !on ? " : déjà fait cette semaine" : ""}` : `+${v.p}`}</span></span><span class="check ${on ? "on" : ""}" aria-hidden="true"></span></button>`; };
    box.innerHTML = `<section class="panel stack voie-head"><div class="lvl"><span class="lvl-k">${L[2]}</span><div><span class="eyebrow">Voie de ${monthName}</span><b class="lvl-n">${L[1]}</b><span class="small muted">${pts} points${next ? ` · encore ${next[0] - pts} pour ${next[1]}` : " · niveau maximal !"}</span></div></div>
        <div class="lvl-bar">${FOYER.levels().slice(1).map((l) => `<span class="${pts >= l[0] ? "on" : ""}" style="--w:${l[0]}"><i>${l[2]}</i><small>${l[0]}</small></span>`).join("")}<b style="width:${Math.min(100, (pts / FOYER.levels()[4][0]) * 100)}%"></b></div>
        <p class="tiny muted">Tout repart de zéro le 1er du mois.${best && best.m !== m ? ` Ton record : ${best.p} points (${new Date(best.m + "-15T12:00:00Z").toLocaleDateString("fr-FR", { month: "long", timeZone: "UTC" })}).` : ""}</p></section>
      <section class="stack"><h2>Aujourd'hui</h2>${FOYER.voieList().length ? FOYER.voieList().map((v) => row(v, t.iso)).join("") : `<p class="small muted">Pas encore de défi ce mois-ci.</p>`}</section>
      <details><summary>Hier (${FOYER.DOW[(t.dow + 6) % 7]}) : j'ai oublié de cocher</summary><div class="in">${FOYER.monthOf(y) === m ? FOYER.voieList().map((v) => row(v, y)).join("") : `<p class="small muted">Hier, c'était le mois dernier : on repart de zéro.</p>`}</div></details>`;
    $$("[data-v]", box).forEach((b) => (b.onclick = () => {
      const d = b.dataset.d, id = b.dataset.v; f.voie[d] = f.voie[d] || {};
      if (f.voie[d][id]) delete f.voie[d][id]; else { f.voie[d][id] = 1; FX.sfx("good"); const [x, yy] = FX.center(b); FX.burst(x, yy, { n: 14 }); }
      const before = L[1]; STORE.save(); const after = FOYER.levelOf(FOYER.voiePoints(m)).L;
      if (after[1] !== before && FOYER.voiePoints(m) >= after[0] && after[0] > 0 && f.voie[d][id]) celebrate("昇段！", `<div class="lvl-k big">${after[2]}</div><p><b>Niveau ${after[1]} atteint !</b></p><p class="small">Continue jusqu'à la fin du mois pour monter encore.</p>`, "Continuer", "level");
      foyerVoie(box);
    }));
  }
  function gardenHTML(list, month) {
    const G = (window.IMAGES && IMAGES.garden) || {};
    // Profondeur : plus une fleur est haute dans la prairie (loin), plus elle est petite
    const depth = (y) => (0.6 + Math.max(0, Math.min(1, (y - 44) / 50)) * 0.55).toFixed(2);
    const deco = FOYER.DECOS.filter(([n]) => list.length >= n).map(([n, k, em, x, y, sc]) => `<span class="flower deco" style="left:${x}%;top:${y}%;--s:${(sc * depth(y)).toFixed(2)};z-index:${k === "arbre" ? 1 : y}" title="Débloqué à ${n} bienfaits">${G[k] ? `<img src="${G[k]}" alt="">` : em}</span>`).join("");
    const fl = deco + list.map((b, i) => `<span class="flower" style="left:${b.x}%;top:${b.y}%;--i:${i};--s:${depth(b.y)};z-index:${Math.round(b.y)}" title="${esc(b.txt)}">${G[b.fl] ? `<img src="${G[b.fl]}" alt="">` : FOYER.FLOWER_EMOJI[b.fl] || "🌸"}</span>`).join("");
    return `<div class="garden ${G.bg ? "has-bg" : ""}" ${G.bg ? `style="background-image:url(${G.bg})"` : ""}>${G.bg ? "" : `<div class="g-sky"></div><div class="g-hill"></div><div class="g-path"></div>`}${fl}${list.length ? "" : `<p class="g-empty">Ton jardin de ${month} attend sa première fleur.</p>`}</div>`;
  }
  function foyerJardin(box, monthSel) {
    const t = FOYER.paris(), f = FOYER.F(), m = monthSel || FOYER.monthOf(t.iso), months = Array.from(new Set(f.bienfaits.map((b) => b.d.slice(0, 7)).concat([FOYER.monthOf(t.iso)]))).sort().reverse();
    const list = f.bienfaits.filter((b) => b.d.slice(0, 7) === m), mName = (mm) => new Date(mm + "-15T12:00:00Z").toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
    const isCur = m === FOYER.monthOf(t.iso);
    box.innerHTML = `<section class="stack"><div class="row" style="justify-content:space-between"><h2>Jardin des bienfaits</h2><select id="g-m" style="width:auto">${months.map((x) => `<option value="${x}" ${x === m ? "selected" : ""}>${mName(x)}</option>`).join("")}</select></div>
        ${gardenHTML(list, mName(m).split(" ")[0])}<p class="small muted">${list.length} bienfait${list.length > 1 ? "s" : ""} ${isCur ? "ce mois-ci" : `en ${mName(m)}`}. Chaque geste fait éclore une fleur ; les jardins des mois passés restent.</p></section>
      ${isCur ? `<section class="panel stack"><b>Noter un bienfait</b><textarea id="bf-t" maxlength="160" placeholder="Ex. J'ai aidé Maman à porter les courses." style="min-height:70px;font-family:inherit;font-size:1rem"></textarea>
        <div class="row wrap"><button class="btn primary" id="bf-me" style="flex:1">C'est moi qui l'ai fait</button><button class="btn ghost sm" id="bf-par">Ajouté par un parent</button></div></section>` : ""}
      <section class="stack"><h2>Carnet</h2>${list.length ? list.slice().reverse().map((b) => `<div class="bf-row"><span class="bf-f">${(window.IMAGES && IMAGES.garden && IMAGES.garden[b.fl]) ? `<img src="${IMAGES.garden[b.fl]}" alt="" width="32" height="32">` : FOYER.FLOWER_EMOJI[b.fl] || "🌸"}</span><span class="stack" style="gap:2px"><span>${esc(b.txt)}</span><span class="tiny muted">${dShort(b.d)} · ${b.by === "moi" ? "noté par moi" : `noté par ${esc(b.by)}`}</span></span></div>`).join("") : `<p class="small muted">Rien encore ce mois-ci.</p>`}</section>`;
    $("#g-m").onchange = (e) => foyerJardin(box, e.target.value);
    const add = (by) => { const v = $("#bf-t").value.trim(); if (!v) return toast("Écris ton bienfait en une phrase."); FOYER.addBienfait(v, by); FX.sfx("level"); fxText("花 !"); foyerJardin(box); };
    if (isCur) {
      $("#bf-me").onclick = () => add("moi");
      $("#bf-par").onclick = async () => { if (!$("#bf-t").value.trim()) return toast("Écris d'abord le bienfait."); if (!(await pinPrompt("Bienfait noté par un parent : code parent"))) return;
        const o = document.createElement("div"); o.className = "celebrate"; o.innerHTML = `<div class="panel stack" style="align-items:center"><b>Qui le note ?</b><div class="row wrap" style="justify-content:center">${FOYER.parents().map((p) => `<button class="btn primary" data-by="${esc(p)}">${esc(p)}</button>`).join("")}</div></div>`;
        document.body.appendChild(o); $$("[data-by]", o).forEach((b) => (b.onclick = () => { o.remove(); add(b.dataset.by); })); };
    }
  }

  // ---------- Messages et défis de papa ----------
  // Récompense : visible, ou « surprise » (silhouette qui se remplit avec la progression, dévoilée à la fin).
  function prize(m, st, size = 64) {
    const r = m.reward; if (!r) return "";
    const em = r.image ? `<img src="${esc(r.image)}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;object-fit:contain">` : esc(r.emoji || "🎁"), hidden = r.surprise && !st.done, pct = Math.round(100 * st.p);
    if (!hidden) return `<span class="prize" style="--sz:${size}px"><span class="pz-full">${em}</span></span>`;
    return `<span class="prize surprise${st.p > 0 ? "" : " none"}" style="--sz:${size}px;--fill:${100 - pct}%" title="Récompense surprise : ${pct} %"><span class="pz-shadow">${em}</span><span class="pz-full">${em}</span><span class="pz-q">?</span></span>`;
  }
  const defiGoal = (m, st) => st.type === "boss" ? `Bats ${esc(STORE.CHI[m.boss] ? STORE.CHI[m.boss].boss.name : "le yōkai")}` : st.type === "revisions" ? `${st.prog[0]} / ${st.prog[1]} révisions`
    : st.type === "hard" ? `${st.prog[0]} / ${st.prog[1]} cartes difficiles réussies` : st.type === "streak" ? `${st.prog[0]} / ${st.prog[1]} jours de flamme`
    : `Épreuve : meilleur score ${(S().msgs[m.id] || {}).best || 0}, il faut ${st.prog[1]}`;
  const rewardTxt = (m, st) => !m.reward ? "" : m.reward.surprise && !st.done ? `Récompense surprise : ${Math.round(100 * st.p)} % dévoilée` : `Récompense : ${esc(m.reward.text)}`;
  function revealDefi(m) {
    const r = m.reward;
    return celebrate("達成！", `${r ? `<div class="reveal">${prize(m, { done: true, p: 1 }, 110)}</div>` : ART.sensei("fire", 100)}<p><b>Défi de ${esc(m.from)} réussi !</b></p><p class="small">${md(esc(m.text))}</p>
      ${r ? `<p>${r.surprise ? "La surprise était…" : "Tu gagnes :"} <b>${esc(r.text)}</b></p><p class="tiny muted">Ton bon d'échange t'attend dans Trésors. Montre-le à ${esc(m.from)} !</p>` : ""}`, "Génial !", "level");
  }
  function drawDefis() {
    const box = $("#defis"); if (!box) return;
    STORE.checkDefis(); STORE.save();
    const ms = STORE.messages(), seen = S().msgs;
    const live = ms.filter((m) => { const st = STORE.defiState(m); return st.isDefi && !st.expired && !(st.done && seen[m.id] && seen[m.id].cheered); });
    box.innerHTML = live.map((m) => { const st = STORE.defiState(m);
      const until = m.until ? new Date(m.until + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
      return `<section class="panel defi ${st.done ? "done" : ""}">${m.reward ? prize(m, st, 58) : ART.sensei(st.done ? "fire" : "wow", 56)}<div class="stack" style="gap:4px"><span class="who">Défi de ${esc(m.from)}</span><b>${md(esc(m.text))}</b>
        <div class="dbar"><i style="width:${Math.round(100 * st.p)}%"></i></div>
        <span class="tiny muted">${st.done ? "Réussi !" : defiGoal(m, st)}${until && !st.done ? ` · jusqu'à ${until}` : ""}</span>${m.reward ? `<span class="tiny">${rewardTxt(m, st)}</span>` : ""}
        ${st.type === "boss" && !st.done ? `<button class="btn sm primary" data-go="ch~${m.boss}" style="justify-self:start">Aller au chapitre</button>` : ""}
        ${st.type === "epreuve" && !st.done ? `<button class="btn sm primary" data-go="epreuve~${m.id}" style="justify-self:start">Passer l'épreuve</button>` : ""}</div></section>`; }).join("");
    const fresh = ms.filter((m) => !seen[m.id] || !seen[m.id].seen).filter((m) => !(m.until && STORE.today() > m.until));
    const won = ms.filter((m) => { const st = STORE.defiState(m); return st.isDefi && st.done && seen[m.id] && seen[m.id].seen && !seen[m.id].cheered; });
    let delay = 900;
    fresh.forEach((m) => { const st = STORE.defiState(m); seen[m.id] = Object.assign(seen[m.id] || {}, { seen: STORE.today() });
      setTimeout(() => celebrate("お便り！", `${m.reward ? `<div>${prize(m, st, 96)}</div>` : ART.sensei("wow", 100)}<p class="small muted">Ren t'apporte un message de <b>${esc(m.from)}</b> :</p><p class="big" style="font-size:1.1rem">${md(esc(m.text))}</p>
        ${m.reward ? (m.reward.surprise ? `<p class="small">Une <b>récompense surprise</b> se cache dans cette ombre. Elle se dévoile au fil de tes réussites…</p>` : `<p class="small">Récompense : <b>${esc(m.reward.text)}</b></p>`) : ""}`, st.isDefi ? "Défi accepté !" : "Merci !", "level"), delay); delay += 2600; });
    won.forEach((m) => { seen[m.id].cheered = STORE.today(); setTimeout(() => revealDefi(m), delay); delay += 2600; });
    if (fresh.length || won.length) STORE.save();
  }
  // Épreuve : série de questions (choisies dans le pack, ou ses cartes les plus difficiles)
  function viewEpreuve(main, id) {
    const m = STORE.messages().find((x) => x.id === id); if (!m || !m.epreuve) return go("dojo", true);
    const e = m.epreuve, n = e.n || 10, pass = e.pass || Math.ceil(n * 0.8);
    let list = Array.isArray(e.cards) ? shuffle(e.cards.map((c, i) => Object.assign({ id: `defi:${id}:${i}`, ch: "defi", le: "defi" }, c))).slice(0, n) : shuffle(STORE.hardCards(n));
    if (list.length < 3) { toast("Pas encore assez de cartes difficiles : révise un peu, puis reviens !"); return go("dojo", true); }
    let i = 0, good = 0; combo = 0; sessionShell(main); $("#quit").onclick = () => go("dojo", true);
    const next = async () => {
      if (i >= list.length) {
        const rec = (S().msgs[id] = S().msgs[id] || {}); rec.best = Math.max(rec.best || 0, good); STORE.save();
        const ok = good >= pass;
        if (ok) { STORE.checkDefis(); rec.cheered = STORE.today(); STORE.save(); await revealDefi(m); }
        else await celebrate("まだまだ…", `${ART.sensei("think", 100)}<p><b>${good} / ${list.length}</b> : il en fallait ${pass}.</p><p class="small">${m.reward && m.reward.surprise ? "La surprise se précise… " : ""}Revois ces cartes, puis retente l'épreuve : tu peux la repasser autant que tu veux.</p>`, "Retour au Dōjō", "lose");
        afterAction(); return go("dojo", true);
      }
      mountCard($("#stage"), instantiate(list[i]), { selfGrade: false, onDone: ({ ok }) => { if (ok) good++; i++; $(".prog > i").style.width = (100 * i / list.length) + "%"; next(); } });
    };
    next();
  }
  // Bons d'échange et trophées (Trésors)
  function defisSection() {
    const ms = STORE.messages().map((m) => [m, STORE.defiState(m)]).filter(([, st]) => st.isDefi && (st.done || !st.expired));
    if (!ms.length) return `<section class="stack"><h2>Défis et bons d'échange</h2><div class="ticket todo"><div class="tk-l"><span class="trophy dim">🏆</span></div><div class="tk-r"><p class="small muted">Aucun défi pour l'instant. Quand ton père t'en lance un, Ren te l'apporte : réussis-le pour gagner un trophée et un bon d'échange.</p></div></div></section>`;
    return `<section class="stack"><div class="row" style="justify-content:space-between"><h2>Défis et bons d'échange</h2><span class="small muted">${ms.filter(([, st]) => st.done).length} trophée${ms.filter(([, st]) => st.done).length > 1 ? "s" : ""}</span></div>
      ${ms.map(([m, st]) => st.done ? `<div class="ticket ${st.used ? "used" : ""}"><div class="tk-l">${m.reward ? prize(m, st, 54) : `<span class="trophy">🏆</span>`}</div><div class="tk-r stack" style="gap:3px">
          <span class="who">Trophée · défi de ${esc(m.from)}</span><b>${m.reward ? esc(m.reward.text) : "Défi réussi"}</b><span class="tiny muted">${md(esc(m.text))} · gagné le ${new Date(st.won + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>
          ${m.reward ? (st.used ? `<span class="stamp-used">Échangé le ${new Date(st.used + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>` : `<button class="btn sm primary" data-use="${esc(m.id)}" style="justify-self:start">Échanger avec ${esc(m.from)}</button>`) : ""}</div></div>`
        : `<div class="ticket todo"><div class="tk-l">${m.reward ? prize(m, st, 54) : `<span class="trophy dim">🏆</span>`}</div><div class="tk-r stack" style="gap:3px"><span class="who">En cours · défi de ${esc(m.from)}</span><b>${md(esc(m.text))}</b><div class="dbar"><i style="width:${Math.round(100 * st.p)}%"></i></div><span class="tiny muted">${defiGoal(m, st)}</span></div></div>`).join("")}
    </section>`;
  }
  function bindUse(root) {
    $$("[data-use]", root).forEach((b) => (b.onclick = async () => {
      const id = b.dataset.use, m = STORE.messages().find((x) => x.id === id);
      if (!(await pinPrompt(`Échanger le bon « ${m.reward.text} » : code parent`))) return;
      S().msgs[id].used = STORE.today(); STORE.save(); FX.sfx("stamp"); toast("Bon échangé. Profite bien !"); render();
    }));
  }

  // ---------- Notes ----------
  const fmtN = (x) => (Math.round(x * 10) / 10).toString().replace(".", ",");
  function notesPanel() {
    const G = STORE.grades(); if (!G.length) return "";
    const A = STORE.gradeAverages();
    return `<section class="panel stack"><div class="row" style="justify-content:space-between"><h2>Mes notes</h2><span class="tiny muted">moyennes sur 20</span></div>
      <div class="avgs">${PROGRAMME.subjects.filter((x) => A[x.id]).map((x) => `<div class="avg" style="--c:${x.color}"><b>${fmtN(A[x.id].avg)}</b><span>${esc(x.short || x.name)}</span></div>`).join("")}</div>
      <div class="stack" style="gap:6px">${G.slice(0, 6).map((g) => { const x = sub(g.s), R = STORE.remedFor(g);
        return `<div class="grade-row" style="--c:${x ? x.color : "#888"}"><span class="gn">${fmtN(g.note)}<small>/${g.sur || 20}</small></span><span class="gt"><b>${esc(g.title)}</b><span class="tiny muted">${esc(x ? x.name : g.s)} · ${new Date(g.date + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
          ${R.map((r) => `<button class="rev-link" data-go="le~${r.l.id}">⚔ Revanche : ${r.won}/${r.total} erreurs reconquises</button>`).join("")}</span></div>`; }).join("")}</div></section>`;
  }
  function drawNotesEditor() {
    const box = $("#p-notes"); if (!box) return; const G = STORE.grades(), today = STORE.today();
    box.innerHTML = `<div class="note-form"><select id="n-s">${PROGRAMME.subjects.map((x) => `<option value="${x.id}">${x.name}</option>`).join("")}</select>
      <input type="text" id="n-t" placeholder="Intitulé (ex. Interro nombres décimaux)" maxlength="60">
      <label class="stack" style="gap:4px"><span class="tiny muted">Date de l'évaluation</span><input type="date" id="n-d" value="${today}"></label>
      <div class="nf-row"><label><span class="tiny muted">Note</span><input type="text" id="n-n" placeholder="ex. 14,5" inputmode="decimal" autocomplete="off"></label><label><span class="tiny muted">sur</span><input type="number" id="n-u" value="20" min="1" inputmode="numeric"></label><label><span class="tiny muted">coef.</span><input type="number" id="n-c" value="1" min="0.5" step="0.5" inputmode="decimal"></label></div>
      <span class="tiny muted">Les notes restent sur ce téléphone : elles ne sont jamais publiées.</span>
      <button class="btn primary" id="n-add">Ajouter la note</button></div>
      ${G.map((g) => `<div class="grade-row" style="--c:${(sub(g.s) || {}).color || "#888"}"><span class="gn">${fmtN(g.note)}<small>/${g.sur || 20}</small></span><span class="gt"><b>${esc(g.title)}</b><span class="tiny muted">${esc((sub(g.s) || {}).name || g.s)} · ${g.date}${g.coef && g.coef !== 1 ? ` · coef ${fmtN(g.coef)}` : ""}</span></span><button class="btn ghost sm" data-del="${esc(g.id)}" aria-label="Supprimer">✕</button></div>`).join("")}`;
    $("#n-add").onclick = () => {
      const t = $("#n-t").value.trim(), n = parseFloat(String($("#n-n").value).replace(",", ".")), u = parseFloat($("#n-u").value) || 20, c = parseFloat($("#n-c").value) || 1, d = $("#n-d").value || today;
      if (!t) return toast("Donne un intitulé à l'évaluation."); if (isNaN(n) || n < 0 || n > u) return toast(`La note doit être entre 0 et ${u}.`);
      S().grades = (S().grades || []).concat([{ id: "g" + Date.now(), s: $("#n-s").value, date: d, title: t, note: n, sur: u, coef: c }]); STORE.save(); FX.sfx("stamp"); toast("Note ajoutée."); drawNotesEditor();
    };
    $$("[data-del]", box).forEach((b) => (b.onclick = () => { if (!b.dataset.sure) { b.dataset.sure = 1; b.textContent = "Supprimer ?"; return; } S().grades = S().grades.filter((g) => g.id !== b.dataset.del); STORE.save(); drawNotesEditor(); }));
  }

  // ---------- Code parent ----------
  // Code à 4 chiffres, stocké haché (SHA-256 + sel). Déverrouillé pour 10 minutes.
  // Code de secours (connu de Felipe seulement) si le code est oublié.
  let parentUntil = 0;
  const RESCUE = "b3d4cb4fcb9b6210368d0638929a2f760b28e4712ef4b6878c07fb4ebab106eb";
  async function sha(t) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join(""); }
  function pinPrompt(title) {
    return new Promise((res) => {
      const P = S().settings.parentPin;
      if (!P) { celebrate("Code parent", `<p>Le parent doit d'abord créer son code dans <b>Moi → Espace parent</b>.</p>`, "Compris", "lose").then(() => res(false)); return; }
      const o = document.createElement("div"); o.className = "celebrate"; let code = "";
      const paint = (msg) => { o.innerHTML = `<div class="panel stack" style="align-items:center"><p class="small"><b>${esc(title)}</b></p><div class="pin-dots">${[0, 1, 2, 3].map((i) => `<i class="${i < code.length ? "on" : ""}"></i>`).join("")}</div>${msg ? `<p class="small pin-msg">${msg}</p>` : ""}
        <div class="pinpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => k === "" ? "<span></span>" : `<button class="btn" data-k="${k}">${k}</button>`).join("")}</div><button class="btn ghost sm" id="pp-x">Annuler</button></div>`;
        $$("[data-k]", o).forEach((b) => (b.onclick = () => press(b.dataset.k))); $("#pp-x", o).onclick = () => { o.remove(); res(false); }; };
      const press = async (k) => { FX.sfx("tap"); if (k === "⌫") { code = code.slice(0, -1); return paint(); } if (code.length >= 4) return; code += k; paint(); if (code.length < 4) return;
        if ((await sha(P.salt + ":" + code)) === P.h) { o.remove(); parentUntil = Date.now() + 10 * 60000; res(true); } else { code = ""; FX.buzz(80); paint("Code incorrect."); } };
      paint(); document.body.appendChild(o);
    });
  }
  function drawLock() {
    const lock = $("#p-lock"), zone = $("#p-zone"); if (!lock) return;
    const set = !!S().settings.parentPin, open = parentUntil > Date.now();
    zone.hidden = !open; lock.hidden = open;
    if (open) { drawParent(); drawNotesEditor(); return; }
    let mode = set ? "enter" : "create", first = "", code = "";
    const paint = (msg) => {
      lock.innerHTML = `<p class="small">${mode === "create" ? "Choisis un <b>code parent à 4 chiffres</b>. Il protège le suivi, le nombre de nouvelles cartes, la zone de vacances, l'import de packs et la remise à zéro." : mode === "confirm" ? "Tape le code une seconde fois." : "Réservé aux parents : tape le code parent."}</p>
        <div class="pin-dots">${[0, 1, 2, 3].map((i) => `<i class="${i < code.length ? "on" : ""}"></i>`).join("")}</div>${msg ? `<p class="small pin-msg">${msg}</p>` : ""}
        <div class="pinpad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => k === "" ? "<span></span>" : `<button class="btn" data-k="${k}">${k}</button>`).join("")}</div>
        ${mode === "enter" ? `<details class="rescue"><summary class="tiny">Code oublié ?</summary><div class="in"><input type="text" id="p-rescue" placeholder="Code de secours" autocomplete="off"><button class="btn sm" id="p-rescue-go">Réinitialiser le code</button></div></details>` : ""}`;
      $$("[data-k]", lock).forEach((b) => (b.onclick = () => press(b.dataset.k)));
      const rg = $("#p-rescue-go"); if (rg) rg.onclick = async () => { if ((await sha("hikari-secours:" + $("#p-rescue").value.trim().toUpperCase())) === RESCUE) { delete S().settings.parentPin; STORE.save(); toast("Code effacé : choisis-en un nouveau."); drawLock(); } else toast("Code de secours incorrect."); };
    };
    const press = async (k) => {
      FX.sfx("tap");
      if (k === "⌫") { code = code.slice(0, -1); return paint(); }
      if (code.length >= 4) return; code += k; paint();
      if (code.length < 4) return;
      if (mode === "create") { first = code; code = ""; mode = "confirm"; return setTimeout(() => paint(), 150); }
      if (mode === "confirm") {
        if (code !== first) { code = ""; mode = "create"; return setTimeout(() => paint("Les deux codes sont différents : recommence."), 150); }
        const salt = Math.random().toString(36).slice(2, 10); S().settings.parentPin = { salt, h: await sha(salt + ":" + code) }; STORE.save();
        parentUntil = Date.now() + 10 * 60000; toast("Code parent enregistré."); return drawLock();
      }
      const P = S().settings.parentPin;
      if ((await sha(P.salt + ":" + code)) === P.h) { parentUntil = Date.now() + 10 * 60000; FX.sfx("good"); drawLock(); }
      else { code = ""; FX.buzz(80); lock.classList.add("shake-soft"); setTimeout(() => lock.classList.remove("shake-soft"), 400); paint("Code incorrect."); }
    };
    paint();
    const chg = $("#p-chg"), out = $("#p-out");
    if (chg) chg.onclick = () => { delete S().settings.parentPin; STORE.save(); parentUntil = 0; drawLock(); };
    if (out) out.onclick = () => { parentUntil = 0; drawLock(); };
  }

  // ---------- Suivi parent ----------
  // Données compactes du bilan (aussi transportées dans le lien envoyé au parent).
  // ---------- Foyer : préparation par les parents ----------
  const DAYS1 = ["L", "Ma", "Me", "J", "V", "S", "D"];
  async function viewFoyerPrep(main) {
    if (parentUntil <= Date.now() && !(await pinPrompt("Préparer le Foyer : code parent"))) return go("moi", true);
    const c = JSON.parse(JSON.stringify(FOYER.exportCfg()));
    const paint = () => {
      const lv = FOYER.levels(c.voie), mx = FOYER.maxMonth(c.voie);
      main.innerHTML = `<section class="stack"><p class="eyebrow">Espace parent</p><h1>Préparer le Foyer</h1><p class="small muted">Les changements s'appliquent à partir d'aujourd'hui : les jours passés gardent leurs anciennes missions, les points déjà gagnés restent.</p></section>
      <section class="panel stack"><h2>Missions de la maison</h2><p class="tiny muted">Chaque mission a ses jours et son heure limite. Avant l'heure : médaille d'or, aucun rappel. Après : rappel de Ren et médaille d'argent. Toutes les missions de la semaine = un jeton.</p>
        ${c.missions.map((m, i) => `<div class="prep-it" data-mi="${i}"><div class="row"><input class="prep-ic" data-f="ic" value="${esc(m.ic)}" maxlength="4" aria-label="Icône"><input data-f="n" value="${esc(m.n)}" maxlength="80" placeholder="Nom de la mission" style="flex:1"><button class="btn ghost sm" data-del="m${i}" aria-label="Supprimer">✕</button></div>
          <div class="row wrap prep-days">${DAYS1.map((d, k) => `<button class="pday ${m.days.includes(k) ? "on" : ""}" data-day="${k}" aria-pressed="${m.days.includes(k)}">${d}</button>`).join("")}<button class="pday all" data-day="all">Tous</button><label class="small row" style="gap:4px;margin-left:auto">avant <input type="time" data-f="at" value="${esc(m.at)}" style="width:auto"></label></div></div>`).join("") || `<p class="small muted">Aucune mission pour l'instant.</p>`}
        <button class="btn" id="pm-add">+ Ajouter une mission</button>
        <div class="row wrap prep-sugg"><span class="tiny muted">Idées :</span>${FOYER.SUGG_M.map(([ic, n], k) => c.missions.some((m) => m.n === n) ? "" : `<button class="pday" data-sm="${k}">${ic} ${esc(n)}</button>`).join("")}</div></section>
      <section class="panel stack"><h2>Voie du mois</h2><p class="tiny muted">Défis quotidiens : +1 par jour. Défis de la semaine : +3, une fois par semaine. Les niveaux s'ajustent tout seuls au nombre de points possibles.</p>
        ${c.voie.map((v, i) => `<div class="prep-it" data-vi="${i}"><div class="row"><input class="prep-ic" data-f="ic" value="${esc(v.ic)}" maxlength="4" aria-label="Icône"><input data-f="n" value="${esc(v.n)}" maxlength="80" placeholder="Nom du défi" style="flex:1"><button class="btn ghost sm" data-del="v${i}" aria-label="Supprimer">✕</button></div>
          <div class="row"><select data-f="freq" style="width:auto"><option value="jour" ${v.freq !== "semaine" ? "selected" : ""}>Chaque jour · +1</option><option value="semaine" ${v.freq === "semaine" ? "selected" : ""}>Une fois par semaine · +3</option></select></div></div>`).join("") || `<p class="small muted">Aucun défi pour l'instant.</p>`}
        <button class="btn" id="pv-add">+ Ajouter un défi</button>
        <div class="row wrap prep-sugg"><span class="tiny muted">Idées :</span>${FOYER.SUGG_V.map(([ic, n], k) => c.voie.some((v) => v.n === n) ? "" : `<button class="pday" data-sv="${k}">${ic} ${esc(n)}</button>`).join("")}</div>
        <p class="small">${mx ? `Jusqu'à environ <b>${mx} points</b> par mois. Niveaux : ${lv.slice(1).map((l) => `${l[1]} ${l[0]}`).join(" · ")}.` : "Ajoute des défis pour voir les niveaux."}</p></section>
      <section class="panel stack"><h2>Parents</h2><label class="stack"><span class="small">Prénoms ou noms affichés (séparés par des virgules), pour signer les bienfaits</span><input id="pp-n" value="${esc(c.parents.join(", "))}"></label>
        <label class="stack"><span class="small">Le jeton de la semaine s'échange avec</span><select id="pp-t" style="width:auto">${c.parents.map((p) => `<option ${p === c.tokenWith ? "selected" : ""}>${esc(p)}</option>`).join("")}</select></label></section>
      <div class="row wrap"><button class="btn primary" id="pf-save" style="flex:1">Enregistrer</button><button class="btn ghost" data-go="moi~parent">Annuler</button></div>`;
      // lecture des champs avant chaque action
      const read = () => {
        $$("[data-mi]", main).forEach((r) => { const m = c.missions[+r.dataset.mi]; $$("[data-f]", r).forEach((x) => (m[x.dataset.f] = x.value.trim())); });
        $$("[data-vi]", main).forEach((r) => { const v = c.voie[+r.dataset.vi]; $$("[data-f]", r).forEach((x) => (v[x.dataset.f] = x.value.trim())); });
        c.parents = $("#pp-n").value.split(",").map((x) => x.trim()).filter(Boolean); c.tokenWith = $("#pp-t").value;
      };
      $$("[data-day]", main).forEach((b) => (b.onclick = () => { read(); const m = c.missions[+b.closest("[data-mi]").dataset.mi]; const k = b.dataset.day;
        if (k === "all") m.days = m.days.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]; else m.days = m.days.includes(+k) ? m.days.filter((d) => d !== +k) : m.days.concat(+k); paint(); }));
      $$("[data-del]", main).forEach((b) => (b.onclick = () => { read(); const k = b.dataset.del; (k[0] === "m" ? c.missions : c.voie).splice(+k.slice(1), 1); paint(); }));
      $("#pm-add").onclick = () => { read(); c.missions.push({ ic: "⭐", n: "", days: [0, 1, 2, 3, 4, 5, 6], at: "19:00" }); paint(); $$("[data-mi] [data-f=n]", main).pop().focus(); };
      $("#pv-add").onclick = () => { read(); c.voie.push({ ic: "⭐", n: "", freq: "jour" }); paint(); $$("[data-vi] [data-f=n]", main).pop().focus(); };
      $$("[data-sm]", main).forEach((b) => (b.onclick = () => { read(); const [ic, n] = FOYER.SUGG_M[+b.dataset.sm]; c.missions.push({ ic, n, days: [0, 1, 2, 3, 4, 5, 6], at: "19:00" }); paint(); }));
      $$("[data-sv]", main).forEach((b) => (b.onclick = () => { read(); const [ic, n, freq] = FOYER.SUGG_V[+b.dataset.sv]; c.voie.push({ ic, n, freq }); paint(); }));
      $("#pp-n").onchange = () => { read(); paint(); };
      $("#pf-save").onclick = () => { read();
        const bad = c.missions.find((m) => m.n && !m.days.length); if (bad) return toast(`Choisis au moins un jour pour « ${bad.n} ».`);
        FOYER.saveCfg(c); FX.sfx("stamp"); toast("Foyer enregistré."); go("foyer", true); };
    };
    paint();
  }
  // Configuration reçue par lien (#fcfg~…) : appliquée sur ce téléphone après le code parent
  async function viewFoyerImport(main, arg) {
    let c; try { c = await unpackReport(arg); if (!c || !Array.isArray(c.missions)) throw 0; } catch (e) { main.innerHTML = `<section class="panel stack"><h1>Lien illisible</h1><p>Le lien de configuration semble coupé.</p></section>`; return; }
    main.innerHTML = `<section class="stack"><p class="eyebrow">Espace parent</p><h1>Configuration du Foyer</h1><p class="small">Ce lien prépare ${c.missions.length} mission${c.missions.length > 1 ? "s" : ""} et ${c.voie.length} défi${c.voie.length > 1 ? "s" : ""}. ${FOYER.ready() ? "Il remplace la configuration actuelle à partir d'aujourd'hui." : ""}</p>
      <div class="panel stack small">${c.missions.map((m) => `<div>${esc(m.ic)} ${esc(m.n)} <span class="muted">· ${m.days.length === 7 ? "tous les jours" : m.days.map((d) => FOYER.DOW[d]).join(", ")} · avant ${esc(m.at)}</span></div>`).join("")}<hr style="border:0;border-top:1px solid var(--hair);width:100%">${c.voie.map((v) => `<div>${esc(v.ic)} ${esc(v.n)} <span class="muted">· ${v.freq === "semaine" ? "+3 par semaine" : "+1 par jour"}</span></div>`).join("")}</div>
      <button class="btn primary" id="fc-ok">Appliquer (code parent)</button><button class="btn ghost" data-go="dojo">Ignorer</button></section>`;
    $("#fc-ok").onclick = async () => { if (!(await pinPrompt("Appliquer la configuration du Foyer : code parent"))) return; FOYER.saveCfg(c, c.from && c.from < FOYER.paris().iso && !FOYER.ready() ? c.from : undefined); FX.sfx("stamp"); toast("Foyer préparé."); history.replaceState({ d: depth }, "", "#foyer"); render(); };
  }
  function reportData() {
    const R = STORE.report(), L = STORE.levelInfo();
    const act = []; for (let i = 34; i >= 0; i--) { const d = STORE.today(new Date(Date.now() - i * 86400000)); act.push((S().days[d] || { n: 0 }).n); }
    return { v: 1, n: S().profile.name, d: STORE.today(), lv: L.level, fl: STORE.streakAlive(), g: S().settings.goal, a: act, f: R.fresh, p: R.perDay, dy: R.days,
      nt: STORE.grades().slice(0, 12).map((g) => [g.s, g.date, g.title, g.note, g.sur || 20]),
      s: R.subs.map((x) => [x.s.id, x.lOpen, x.lTot, x.refs, x.refsAll, x.k.seen, x.k.total, x.k.mastered]),
      h: R.hard.map((H) => [STORE.LEI[H.le] ? STORE.LEI[H.le].title : H.le, STORE.CHI[H.ch].s, H.lapses, H.tries, H.cards.map((c) => [String(c.q).slice(0, 140), c.lapses]), H.le]) };
  }
  const b64u = (u8) => { let s = ""; u8.forEach((b) => (s += String.fromCharCode(b))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = (t) => { const s = atob(t.replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(s, (c) => c.charCodeAt(0)); };
  async function packReport(D) {
    const raw = new TextEncoder().encode(JSON.stringify(D));
    if (window.CompressionStream) { const z = new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer()); return "z" + b64u(z); }
    return "j" + b64u(raw);
  }
  async function unpackReport(t) {
    const kind = t[0], bytes = unb64u(t.slice(1));
    const raw = kind === "z" ? new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer()) : bytes;
    return JSON.parse(new TextDecoder().decode(raw));
  }
  function reportHTML(D, own) {
    const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
    const bar = (v, c) => `<span class="pbar"><i style="width:${v}%;background:${c}"></i></span>`;
    const SB = (id) => PROGRAMME.subjects.find((x) => x.id === id) || { name: id, color: "#888", kanji: "?" };
    const goal = D.g || 20, act = D.a || [], week = act.slice(-7).reduce((a, b) => a + b, 0), daysOn = act.slice(-7).filter((n) => n > 0).length;
    return `<div class="pkpi"><div><b>${D.lv}</b><span>niveau</span></div><div><b>${D.fl}</b><span>jours de flamme</span></div><div><b>${week}</b><span>révisions sur 7 j</span></div><div><b>${daysOn}/7</b><span>jours actifs</span></div></div>
      <div class="heat">${act.map((n, i) => `<i class="${n >= goal ? "l3" : n >= goal / 2 ? "l2" : n > 0 ? "l1" : ""} ${i === act.length - 1 ? "today" : ""}" title="${n} révisions" style="--i:${i}"></i>`).join("")}</div>
      ${(D.nt || []).length ? `<p class="eyebrow">Notes</p><div class="stack" style="gap:6px">${(() => { const A = {}; D.nt.forEach(([sid, , , n, u]) => { A[sid] = A[sid] || []; A[sid].push((n / u) * 20); }); return `<div class="avgs">${Object.entries(A).map(([sid, v]) => `<div class="avg" style="--c:${SB(sid).color}"><b>${fmtN(v.reduce((a, b) => a + b, 0) / v.length)}</b><span>${esc(SB(sid).short || SB(sid).name)}</span></div>`).join("")}</div>`; })()}
        ${D.nt.map(([sid, d, t, n, u]) => `<div class="grade-row" style="--c:${SB(sid).color}"><span class="gn">${fmtN(n)}<small>/${u}</small></span><span class="gt"><b>${esc(t)}</b><span class="tiny muted">${esc(SB(sid).name)} · ${d}</span></span></div>`).join("")}</div>` : ""}
      <div class="ptab">${D.s.map(([id, lOpen, lTot, refs, refsAll, seen, total, mast]) => { const x = SB(id); return `<div class="prow" style="--c:${x.color}"><div class="pname">${ART.seal(x.kanji, x.color, 30, !lOpen)}<b>${esc(x.short || x.name)}</b></div>
        ${lOpen ? `<div class="pmet"><span>Programme abordé</span>${bar(pct(refs, refsAll), x.color)}<b>${refs}/${refsAll}</b></div>
        <div class="pmet"><span>Cartes découvertes</span>${bar(pct(seen, total), x.color)}<b>${seen}/${total}</b></div>
        <div class="pmet"><span>Maîtrisées (≥ 3 sem.)</span>${bar(pct(mast, total), "var(--good)")}<b>${mast}</b></div>` : `<p class="tiny muted">Aucune leçon ouverte pour l'instant.</p>`}</div>`; }).join("")}</div>
      <div class="pnote ${D.dy > 21 ? "warn" : ""}"><b>${D.f}</b> carte${D.f > 1 ? "s" : ""} jamais vue${D.f > 1 ? "s" : ""} : environ <b>${D.dy} jour${D.dy > 1 ? "s" : ""}</b> pour toutes les découvrir à ${D.p} par jour.${D.dy > 21 && own ? " C'est long : tu peux relever le nombre de nouvelles cartes ci-dessous." : ""}</div>
      <p class="eyebrow">Leçons les plus difficiles</p>
      ${D.h.length ? D.h.map(([title, sid, lapses, tries, cards, le]) => `<div class="phard"><div class="row" style="justify-content:space-between;align-items:flex-start"><b>${esc(title)}</b><span class="pill off">${pct(lapses, tries)} % ratés</span></div>
        <span class="tiny muted">${esc(SB(sid).name)} · ${lapses} raté${lapses > 1 ? "s" : ""} sur ${tries} réponses</span>
        ${cards.length ? `<ul class="tiny">${cards.map(([q, n]) => `<li>${md(esc(q))} <span class="muted">(${n}×)</span></li>`).join("")}</ul>` : ""}
        ${own && le ? `<button class="btn sm" data-go="le~${le}">Voir la leçon</button>` : ""}</div>`).join("") : `<p class="small muted">Pas encore assez de révisions pour le dire (il faut au moins 3 cartes vues et un raté dans une leçon).</p>`}`;
  }
  function drawParent() {
    const box = $("#parent"); if (!box) return; const D = reportData();
    box.innerHTML = `<p class="small muted">Ce que ta fille a vu et retenu. « Programme abordé » compte les points du programme officiel de l'année rattachés aux leçons ouvertes.</p>${reportHTML(D, true)}
      <button class="btn primary" id="p-share">Envoyer le bilan</button><p class="tiny muted" id="p-share-msg">Le bilan part sous forme de lien : en l'ouvrant, le parent voit ce tableau sur son téléphone. Rien n'est stocké en ligne.</p>`;
    $("#p-share").onclick = async () => {
      const url = location.origin + location.pathname + "#bilan~" + (await packReport(reportData()));
      const txt = `Bilan Hikari de ${S().profile.name} au ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
      try { if (navigator.share) { await navigator.share({ title: "Bilan Hikari", text: txt, url }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(txt + "\n" + url); $("#p-share-msg").textContent = "Lien du bilan copié : colle-le dans un message."; } catch (e) { $("#p-share-msg").textContent = "Partage indisponible sur cet appareil."; }
    };
  }
  // Bilan reçu par lien (mode parent) : lisible même sans profil sur ce téléphone.
  async function viewBilan(main, arg) {
    renderTabs(S().profile ? "moi" : ""); $(".hud") && ($(".hud").hidden = !S().profile);
    main.innerHTML = `<p class="muted">Ouverture du bilan…</p>`;
    let D; try { D = await unpackReport(arg); } catch (e) { main.innerHTML = `<section class="panel stack"><h1>Bilan illisible</h1><p>Le lien semble coupé. Demande-lui de renvoyer le bilan.</p></section>`; return; }
    const age = Math.round((Date.now() - new Date(D.d + "T12:00").getTime()) / 86400000);
    main.innerHTML = `<section class="stack"><p class="eyebrow">Bilan · mode parent</p><h1>${esc(D.n)}</h1><p class="small muted">Arrêté au ${new Date(D.d + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}${age > 0 ? ` (il y a ${age} jour${age > 1 ? "s" : ""})` : ""}. Ce bilan est une photo du moment : il ne se met pas à jour tout seul.</p></section>
      <section class="panel stack">${reportHTML(D, false)}</section>
      ${S().profile ? `<button class="btn" data-go="dojo">Retour à mon Dōjō</button>` : ""}`;
  }

  // ---------- Démarrage ----------
  function boot() {
    STORE.load(); STORE.buildContent(); STORE.migrate(); if (S().profile) STORE.autoOpen(); applyAccent();
    document.body.innerHTML = `<div id="app"><header class="hud" hidden></header><main></main></div><nav class="tabs" hidden></nav>`;
    history.replaceState({ d: 0 }, "", location.hash || "#dojo");
    splash(); render();
    if (window.FOYER) { FOYER.syncClock().then(() => S().profile && renderTabs(curTab)); setInterval(() => S().profile && $(".tabs") && renderTabs(curTab), 60000); }
    document.addEventListener("pointerdown", () => FX.sfx && null, { once: true });
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => { });
  }
  window.HIKARI = { boot: () => (document.body ? boot() : document.addEventListener("DOMContentLoaded", boot)) };
})();
