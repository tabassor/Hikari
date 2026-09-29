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
  function celebrate(title, body, cta = "Continuer", sound = "win") {
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
  const TABS = [["dojo", "道", "Dōjō"], ["revision", "修", "Réviser"], ["monde", "界", "Monde"], ["tresors", "宝", "Trésors"], ["moi", "我", "Moi"]];
  function renderTabs(cur) { $(".tabs").innerHTML = `<div class="in">${TABS.map(([id, k, n]) => `<button data-go="${id}" ${cur === id ? 'aria-current="page"' : ""}><span class="k">${k}</span>${n}</button>`).join("")}</div>`; }
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
    if (!S().profile) { renderTabs(""); renderHUD(); return viewOnboarding(main); }
    renderHUD();
    const [name, ...rest] = route.split("~"); const arg = rest.join("~");
    const tab = { dojo: "dojo", clan: "dojo", ch: "dojo", le: "dojo", revision: "revision", seance: "revision", boss: "dojo", monde: "monde", tresors: "tresors", moi: "moi" }[name] || "dojo";
    renderTabs(tab);
    ({ dojo: viewDojo, clan: viewClan, ch: viewChapter, le: viewLesson, revision: viewRevisionHub, seance: viewSession, boss: viewBoss, monde: viewWorld, tresors: viewTreasures, moi: viewMe }[name] || viewDojo)(main, arg);
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
        <button class="btn primary big ${ses ? "pulse" : ""}" data-go="seance" ${ses ? "" : "disabled"}>${ses ? `Révision du jour · ${ses}` : "Tout est révisé ✓"}</button>
        <button class="btn" id="flash">Entraînement éclair (10 questions)</button>
      </section>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Les sept clans</h2><button class="btn ghost sm" id="orb-toggle">${S().settings.clanList ? "Orbite" : "Liste"}</button></div>
        <div id="clans"></div><p class="small muted" style="text-align:center">${c.mastered} / ${c.total} cartes maîtrisées</p></section>`;
    $("#flash").onclick = () => startFlashQuiz();
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
    let q = card.k === "g" ? Object.assign({}, GEN.run(card.g, card), { id: card.id, ch: card.ch, le: card.le, g: card.g }) : Object.assign({}, card);
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
  function mountCard(host, card, { selfGrade = true, onDone } = {}) {
    const ch = STORE.CHI[card.ch], s = ch && sub(ch.s), le = card.le && STORE.LEI[card.le];
    const head = s ? `<div class="src">${ART.seal(s.kanji, s.color, 22)}<span>${esc(le ? le.title : ch.title)}</span></div>` : "";
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
    const opt = {}; if (arg && arg.startsWith("s:")) opt.subject = arg.slice(2); if (arg && arg.startsWith("c:")) opt.chapter = arg.slice(2); if (arg && arg.startsWith("l:")) opt.lesson = arg.slice(2);
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
          if (firstTime) { STORE.grade(card.id, grade); if (STORE.countReview()) setTimeout(() => { toast("Objectif du jour atteint : ta flamme brille ! 炎"); FX.sfx("level"); }, 300); done++; }
          if (ok) good++;
          const gain = ([2, 6, 10, 12][grade] || 2) * (1 + Math.min(combo, 10) * 0.05) * (firstTime ? 1 : 0.5);
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
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Yōkai alliés</h2><span class="small muted">${Object.values(S().bosses).filter((b) => b.won).length} / ${bossChs.length}</span></div>
        <div class="allies">${bossChs.length ? bossChs.map((c) => { const w = S().bosses[c.id] && S().bosses[c.id].won; return `<button class="ally ${w ? "" : "lock"}" data-go="ch~${c.id}">${ART.yokai(c.id, { size: 84, ally: w })}<span>${w ? esc(c.boss.name.split(",")[0]) : "???"}</span></button>`; }).join("") : `<p class="muted small" style="grid-column:1/-1">Ouvre des leçons pour réveiller les yōkai gardiens de leurs chapitres.</p>`}</div></section>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Emblèmes</h2><span class="small muted">${won} / ${STORE.BADGES.length}</span></div>
        <div class="badges">${STORE.BADGES.map(([id, k, n, d], i) => { const got = S().badges[id]; return `<div class="badge ${got ? "got" : "lock"}" style="--i:${i}">${ART.seal(k, got ? "var(--seal)" : "var(--mute)", 54, !got)}<span class="t">${n}</span><span class="d">${d}</span></div>`; }).join("")}</div></section>`;
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
      <details id="d-nl" ${arg === "nouvelle" ? "open" : ""}><summary>Nouvelle leçon photo</summary><div class="in" id="nl"></div></details>
      <details><summary>Importer un pack de leçon</summary><div class="in">
        <p class="small">Un pack ajoute des leçons, des fiches, des cartes, des repères de frise ou des lieux, rattachés au programme. Choisis le fichier <b>.json</b> reçu, ou colle son contenu.</p>
        <label class="btn">Choisir un fichier<input type="file" accept=".json,application/json" id="pk-file" hidden></label>
        <textarea id="pk-txt" placeholder='{"format":"hikari-pack", …}'></textarea><button class="btn primary" id="pk-go">Importer le texte collé</button><div id="pk-res"></div>
        ${(S().packs || []).length ? `<p class="eyebrow">Packs installés</p>${S().packs.map((p) => `<div class="small">• ${esc(p.title || p.id)} <span class="muted">(${esc(p.created || "")})</span></div>`).join("")}` : ""}
      </div></details>
      <details><summary>Réglages</summary><div class="in">
        <label class="stack"><span class="small"><b>Objectif du jour</b> (révisions pour remplir le Ki)</span><select id="st-goal">${[10, 15, 20, 30, 40].map((n) => `<option ${n === g ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="stack"><span class="small"><b>Nouvelles cartes par jour</b> au maximum : <b id="st-new-v">${S().settings.newPerDay}</b></span><input type="range" id="st-new" min="5" max="50" step="5" value="${S().settings.newPerDay}"><span class="tiny muted">Plus haut = découvre plus vite les nouvelles leçons, mais les révisions des jours suivants seront plus longues.</span></label>
        <label class="stack"><span class="small"><b>Zone de vacances scolaires</b> (pour le calendrier de la conjugaison)</span><select id="st-zone">${["A", "B", "C"].map((z) => `<option ${S().settings.zone === z ? "selected" : ""}>${z}</option>`).join("")}</select></label>
        <label class="row"><input type="checkbox" id="st-sound" ${S().settings.sound ? "checked" : ""} style="width:22px;height:22px"> <span class="small"><b>Sons</b></span></label>
        <label class="row"><input type="checkbox" id="st-hap" ${S().settings.haptics ? "checked" : ""} style="width:22px;height:22px"> <span class="small"><b>Vibrations</b></span></label>
        <span class="small"><b>Élément</b> <span class="muted">(change l'apparence, pas le jeu)</span></span>${elementPicker(S().profile.element, L.level)}
        <button class="btn" id="persist">Protéger mes données contre l'effacement</button>
      </div></details>
      <details><summary>Sauvegarde</summary><div class="in">
        <p class="small">Tes progrès sont enregistrés sur ce téléphone. Fais une sauvegarde de temps en temps (les photos ne sont pas incluses).</p>
        <button class="btn" id="bk-out">Télécharger une sauvegarde</button>
        <label class="btn">Restaurer une sauvegarde<input type="file" accept=".json,application/json" id="bk-in" hidden></label>
        <button class="btn ghost" id="reset">Tout effacer et recommencer</button>
      </div></details>
      <details id="d-parent"><summary>Suivi parent</summary><div class="in" id="parent"></div></details>
      <details><summary>Programme officiel et couverture</summary><div class="in" id="cov"></div></details>
      <details><summary>Sources et à propos</summary><div class="in small">
        <p>Hikari suit les programmes officiels de 6e en vigueur en 2026-2027. Les textes sont paraphrasés ; en cas de doute, la leçon de ta prof fait foi. Le découpage en leçons suit une progression type, non officielle.</p>
        ${Object.values(PROGRAMME.sources).map((s) => `<p>• <a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></p>`).join("")}
        <p>Fonds de carte : Natural Earth (domaine public). Police des kanji : Kaisei Decol (SIL Open Font License). Univers, personnages et yōkai : créations originales.</p></div></details>`;
    if (arg === "nouvelle") setTimeout(() => $("#d-nl").scrollIntoView({ behavior: "smooth" }), 200);
    drawParent();
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

  // ---------- Suivi parent ----------
  function parentSummary(R) {
    const d = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    const lines = [`Hikari · bilan de ${S().profile.name} au ${d}`, ""];
    R.subs.filter((x) => x.lOpen).forEach((x) => lines.push(`${x.s.name} : ${x.lOpen} leçon${x.lOpen > 1 ? "s" : ""} vue${x.lOpen > 1 ? "s" : ""} · ${x.k.seen}/${x.k.total} cartes découvertes · ${x.k.mastered} maîtrisées · programme abordé ${x.refs}/${x.refsAll}`));
    lines.push("", `Cartes jamais vues : ${R.fresh} (≈ ${R.days} jour${R.days > 1 ? "s" : ""} à ${R.perDay}/jour)`);
    if (R.hard.length) { lines.push("", "Leçons les plus difficiles :"); R.hard.forEach((L) => { lines.push(`- ${STORE.LEI[L.le] ? STORE.LEI[L.le].title : L.le} (${STORE.SUBI[STORE.CHI[L.ch].s].name}) : ${L.lapses} raté${L.lapses > 1 ? "s" : ""} sur ${L.tries} réponses`); L.cards.forEach((c) => lines.push(`   · ${c.q.replace(/\*\*|__/g, "")} (${c.lapses}×)`)); }); }
    return lines.join("\n");
  }
  function drawParent() {
    const box = $("#parent"); if (!box) return; const R = STORE.report();
    const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
    const bar = (v, c) => `<span class="pbar"><i style="width:${v}%;background:${c}"></i></span>`;
    box.innerHTML = `<p class="small muted">Ce que ta fille a vu et retenu, matière par matière. « Programme abordé » compte les points du programme officiel de l'année rattachés aux leçons ouvertes.</p>
      <div class="ptab">${R.subs.map((x) => `<div class="prow" style="--c:${x.s.color}"><div class="pname">${ART.seal(x.s.kanji, x.s.color, 30, !x.lOpen)}<b>${esc(x.s.short || x.s.name)}</b></div>
        ${x.lOpen ? `<div class="pmet"><span>Programme abordé</span>${bar(pct(x.refs, x.refsAll), x.s.color)}<b>${x.refs}/${x.refsAll}</b></div>
        <div class="pmet"><span>Cartes découvertes</span>${bar(pct(x.k.seen, x.k.total), x.s.color)}<b>${x.k.seen}/${x.k.total}</b></div>
        <div class="pmet"><span>Maîtrisées (≥ 3 sem.)</span>${bar(pct(x.k.mastered, x.k.total), "var(--good)")}<b>${x.k.mastered}</b></div>` : `<p class="tiny muted">Aucune leçon ouverte pour l'instant.</p>`}</div>`).join("")}</div>
      <div class="pnote ${R.days > 21 ? "warn" : ""}"><b>${R.fresh}</b> carte${R.fresh > 1 ? "s" : ""} jamais vue${R.fresh > 1 ? "s" : ""} : environ <b>${R.days} jour${R.days > 1 ? "s" : ""}</b> pour toutes les découvrir à ${R.perDay} par jour.${R.days > 21 ? " C'est long : tu peux relever le nombre de nouvelles cartes dans Réglages." : ""}</div>
      <p class="eyebrow">Leçons les plus difficiles</p>
      ${R.hard.length ? R.hard.map((L) => `<div class="phard"><div class="row" style="justify-content:space-between;align-items:flex-start"><b>${esc(STORE.LEI[L.le] ? STORE.LEI[L.le].title : L.le)}</b><span class="pill off">${Math.round(100 * L.rate)} % ratés</span></div>
        <span class="tiny muted">${esc(STORE.SUBI[STORE.CHI[L.ch].s].name)} · ${L.lapses} raté${L.lapses > 1 ? "s" : ""} sur ${L.tries} réponses</span>
        ${L.cards.length ? `<ul class="tiny">${L.cards.map((c) => `<li>${md(c.q)} <span class="muted">(${c.lapses}×)</span></li>`).join("")}</ul>` : ""}
        <button class="btn sm" data-go="le~${L.le}">Voir la leçon</button></div>`).join("") : `<p class="small muted">Pas encore assez de révisions pour le dire (il faut au moins 3 cartes vues et un raté dans une leçon).</p>`}
      <button class="btn primary" id="p-share">Envoyer le bilan</button><p class="tiny muted" id="p-share-msg"></p>`;
    $("#p-share").onclick = async () => {
      const txt = parentSummary(STORE.report());
      try { if (navigator.share) { await navigator.share({ title: "Bilan Hikari", text: txt }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(txt); $("#p-share-msg").textContent = "Bilan copié : colle-le dans un message."; } catch (e) { $("#p-share-msg").textContent = "Partage indisponible sur cet appareil."; }
    };
  }

  // ---------- Démarrage ----------
  function boot() {
    STORE.load(); STORE.buildContent(); STORE.migrate(); if (S().profile) STORE.autoOpen(); applyAccent();
    document.body.innerHTML = `<div id="app"><header class="hud" hidden></header><main></main></div><nav class="tabs" hidden></nav>`;
    history.replaceState({ d: 0 }, "", location.hash || "#dojo");
    splash(); render();
    document.addEventListener("pointerdown", () => FX.sfx && null, { once: true });
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => { });
  }
  window.HIKARI = { boot: () => (document.body ? boot() : document.addEventListener("DOMContentLoaded", boot)) };
})();
