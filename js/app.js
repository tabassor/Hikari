/* Hikari 光 — application. Écrans : Dōjō, Clan, Chapitre, Révision, Boss, Monde (frise + carte), Trésors, Moi. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = (s) => String(s ?? "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/__(.+?)__/g, "<u>$1</u>");
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const S = () => STORE.S;
  const sub = (id) => STORE.SUBI[id];
  const el = () => ART.ELEMENTS[(S().profile && S().profile.element) || "feu"];

  // ---------- Petits outils d'interface ----------
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2700); }
  function fx(text) { const f = document.createElement("div"); f.className = "fx"; f.textContent = text; document.body.appendChild(f); setTimeout(() => f.remove(), 950); }
  function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } }
  function celebrate(title, body, cta = "Continuer") {
    return new Promise((res) => {
      const c = document.createElement("div"); c.className = "celebrate";
      c.innerHTML = `<div class="burst"></div><div class="panel"><div class="title">${title}</div>${body}<button class="btn primary big" id="cel-ok">${cta}</button></div>`;
      document.body.appendChild(c); $("#cel-ok", c).focus();
      $("#cel-ok", c).onclick = () => { c.remove(); res(); };
    });
  }
  function senseiLine(text, mood = "happy") { return `<div class="sensei-line">${ART.sensei(mood, 80)}<div class="bubble">${text}</div></div>`; }
  function applyAccent() { document.documentElement.style.setProperty("--accent", el().c); }
  function afterAction() {
    const won = STORE.checkBadges(); STORE.save();
    won.forEach((id, i) => { const b = STORE.BADGES.find((x) => x[0] === id); setTimeout(() => toast(`Nouveau sceau : ${b[1]} ${b[2]} !`), 400 + i * 2800); });
    renderHUD();
  }

  // ---------- HUD & navigation ----------
  function renderHUD() {
    const p = S().profile; if (!p) { $(".hud").hidden = true; $(".tabs").hidden = true; return; }
    $(".hud").hidden = false; $(".tabs").hidden = false;
    const L = STORE.levelInfo(); const d = S().days[STORE.today()] || { n: 0 };
    $(".hud").innerHTML = `${ART.seal(el().k, el().c, 44)}
      <div class="who"><div class="name">${esc(p.name)}</div><div class="rank">Niv. ${L.level} · ${L.rank[1]} ${L.rank[2]}</div><div class="xpbar" title="${L.into}/${L.need} XP"><i style="width:${(100 * L.into / L.need).toFixed(1)}%"></i></div></div>
      <div class="chips"><span class="chip flame" title="Flamme : jours d'affilée avec l'objectif atteint"><span class="k">炎</span>${STORE.streakAlive()}</span><span class="chip ki" title="Ki du jour : révisions faites / objectif"><span class="k">気</span>${Math.min(d.n, S().settings.goal)}/${S().settings.goal}</span></div>`;
  }
  const TABS = [["dojo", "道", "Dōjō"], ["revision", "修", "Réviser"], ["monde", "界", "Monde"], ["tresors", "宝", "Trésors"], ["moi", "我", "Moi"]];
  function renderTabs(cur) {
    $(".tabs").innerHTML = `<div class="in">${TABS.map(([id, k, n]) => `<button data-go="${id}" ${cur === id ? 'aria-current="page"' : ""}><span class="k">${k}</span>${n}</button>`).join("")}</div>`;
  }
  let leaveGuard = null;
  function go(route, replace) {
    if (leaveGuard && !leaveGuard()) return;
    leaveGuard = null;
    const h = "#" + route; if (location.hash !== h) { replace ? history.replaceState(null, "", h) : history.pushState(null, "", h); }
    render();
  }
  function render() {
    const route = (location.hash || "#dojo").slice(1);
    const main = $("main"); main.innerHTML = ""; window.scrollTo(0, 0);
    if (!S().profile) { renderTabs(""); renderHUD(); return viewOnboarding(main); }
    renderHUD();
    const [name, ...rest] = route.split("~"); const arg = rest.join("~");
    const tab = { dojo: "dojo", clan: "dojo", ch: "dojo", revision: "revision", seance: "revision", boss: "dojo", monde: "monde", tresors: "tresors", moi: "moi" }[name] || "dojo";
    renderTabs(tab);
    ({ dojo: viewDojo, clan: viewClan, ch: viewChapter, revision: viewRevisionHub, seance: viewSession, boss: viewBoss, monde: viewWorld, tresors: viewTreasures, moi: viewMe }[name] || viewDojo)(main, arg);
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) { e.preventDefault(); go(b.dataset.go); } });
  window.addEventListener("popstate", () => { leaveGuard = null; render(); });

  // ---------- Onboarding ----------
  function viewOnboarding(main) {
    let element = "feu", step = 1; const picked = new Set();
    function draw() {
      if (step === 1) {
        main.innerHTML = `<div class="panel hero tone stack"><div class="speed"></div><p class="eyebrow">Académie Hikari 光</p><h1>Bienvenue, nouvelle recrue !</h1>
          ${senseiLine("Je suis <b>Ren</b>, maître renard de l'Académie. Ici, chaque leçon apprise devient du <b>Ki</b>. Sept clans t'attendent. Comment t'appelles-tu ?")}
          <label class="stack"><span class="eyebrow">Ton nom de guerrière</span><input type="text" id="ob-name" maxlength="20" autocomplete="off" placeholder="Ton prénom ou ton pseudo"></label>
          <span class="eyebrow">Choisis ton élément</span>
          <div class="elements">${Object.entries(ART.ELEMENTS).map(([id, e]) => `<button class="el" data-el="${id}" aria-pressed="${id === element}" style="--c:${e.c}"><span class="k" style="color:${id === element ? "inherit" : e.c}">${e.k}</span>${e.n}</button>`).join("")}</div>
          <button class="btn primary big" id="ob-next">Entrer à l'Académie</button></div>`;
        $$(".el", main).forEach((b) => (b.onclick = () => { element = b.dataset.el; document.documentElement.style.setProperty("--accent", ART.ELEMENTS[element].c); const n = $("#ob-name").value; draw(); $("#ob-name").value = n; }));
        $("#ob-next").onclick = () => { const n = $("#ob-name").value.trim(); if (!n) { $("#ob-name").focus(); toast("Écris ton nom pour continuer."); return; } S().profile = { name: n, element, created: STORE.today() }; step = 2; draw(); };
      } else {
        const p1 = STORE.CH.filter((c) => c.period === 1 && !c.stub);
        main.innerHTML = `<div class="stack"><h1>Qu'as-tu déjà commencé en classe ?</h1>
          ${senseiLine("Coche les chapitres que ta prof a <b>déjà commencés</b>. Seuls ceux-là entreront dans tes révisions. Tu pourras en ouvrir d'autres plus tard, dans chaque clan.", "think")}
          ${PROGRAMME.subjects.map((s) => { const cs = p1.filter((c) => c.s === s.id); if (!cs.length) return ""; return `<div class="flat stack"><div class="row">${ART.seal(s.kanji, s.color, 34)}<b>${s.name}</b></div>${cs.map((c) => `<label class="row"><input type="checkbox" data-ch="${c.id}" ${picked.has(c.id) ? "checked" : ""} style="width:22px;height:22px"> <span>${esc(c.title)}</span></label>`).join("")}</div>`; }).join("")}
          <button class="btn primary big" id="ob-go">C'est parti !</button></div>`;
        $$("[data-ch]", main).forEach((i) => (i.onchange = () => (i.checked ? picked.add(i.dataset.ch) : picked.delete(i.dataset.ch))));
        $("#ob-go").onclick = async () => {
          picked.forEach((id) => (S().chapters[id] = { state: "active", since: STORE.today() }));
          STORE.save(); applyAccent();
          await celebrate("始め！", `${ART.sensei("fire", 110)}<p><b>${esc(S().profile.name)}</b>, ton entraînement commence. Un peu chaque jour vaut mieux que beaucoup une fois : c'est le secret des maîtres.</p>`, "Au dōjō !");
          afterAction(); go("dojo", true);
        };
      }
    }
    draw();
  }

  // ---------- Dōjō (accueil) ----------
  const TIPS = [
    "Réviser <b>juste avant</b> d'oublier, c'est ce qui grave une notion pour longtemps. Je m'occupe du bon moment, toi tu frappes !",
    "Une nouvelle leçon en classe ? <b>Débloque le chapitre</b> dans son clan pour qu'il entre dans tes révisions.",
    "Ta prof a ajouté des choses au cours ? <b>Photographie la page</b> dans le chapitre : on pourra l'enrichir.",
    "Dire la réponse <b>à voix haute</b> avant de la révéler, c'est deux fois plus efficace.",
    "Un yōkai te bloque ? Révise le chapitre, puis retente. Même les légendes ont perdu leurs premiers combats.",
    "« Facile » repousse la carte loin dans le temps, « Raté » la fait revenir tout de suite. Sois honnête : c'est toi que tu entraînes."
  ];
  function viewDojo(main) {
    const c = STORE.counts(); const d = S().days[STORE.today()] || { n: 0 }; const goal = S().settings.goal;
        const ses = STORE.buildSession().length;
    const mood = d.n >= goal ? "fire" : ses ? "happy" : "wow";
    const line = !STORE.activeChapters().length ? "Ouvre un premier chapitre dans un clan pour commencer ton entraînement !"
      : d.n >= goal ? `Objectif du jour atteint, <b>${esc(S().profile.name)}</b> ! Ta flamme brûle. Tu peux continuer ou défier un yōkai.`
        : ses ? `<b>${ses} carte${ses > 1 ? "s" : ""}</b> t'attendent aujourd'hui. ${pick(TIPS)}` : `Rien à réviser pour l'instant : tes souvenirs sont frais ! ${pick(TIPS)}`;
    main.innerHTML = `
      <section class="panel hero tone stack"><div class="speed"></div>
        ${senseiLine(line, mood)}
        <div><div class="row" style="justify-content:space-between"><span class="eyebrow">Ki du jour</span><span class="small muted">${Math.min(d.n, goal)} / ${goal} révisions</span></div>
        <div class="ki-meter">${Array.from({ length: 10 }, (_, i) => `<i class="${d.n >= ((i + 1) * goal) / 10 ? "on" : ""}"></i>`).join("")}</div></div>
        <button class="btn primary big" data-go="seance" ${ses ? "" : "disabled"}>${ses ? `Révision du jour · ${ses}` : "Tout est révisé ✓"}</button>
        <button class="btn" id="flash">Entraînement éclair (10 questions)</button>
      </section>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Les sept clans</h2><span class="small muted">${c.mastered} / ${c.total} cartes maîtrisées</span></div>
        <div class="clans">${PROGRAMME.subjects.map((s) => { const k = STORE.counts((ch) => ch.s === s.id); const nAct = STORE.activeChapters().filter((ch) => ch.s === s.id).length; return `<button class="clan" data-go="clan~${s.id}">${ART.seal(s.kanji, s.color, 42, !nAct)}<span><span class="nm">${s.short || s.name}</span><br><span class="sb">${s.clan}</span><br><span class="sb">${nAct ? `${k.total ? Math.round((100 * k.seen) / k.total) : 0} % découvert` : "à ouvrir"}</span></span>${k.due ? `<span class="due">${k.due}</span>` : ""}</button>`; }).join("")}</div>
      </section>`;
    $("#flash").onclick = () => startFlashQuiz();
  }

  // ---------- Clan ----------
  function viewClan(main, sid) {
    const s = sub(sid); if (!s) return go("dojo", true);
    const chs = STORE.CH.filter((c) => c.s === sid).sort((a, b) => (a.period || 9) - (b.period || 9));
    const k = STORE.counts((ch) => ch.s === sid);
    main.innerHTML = `<button class="back" data-go="dojo">← Dōjō</button>
      <section class="panel tone clan-head" style="--accent:${s.color}">${ART.seal(s.kanji, s.color, 64)}<div><p class="eyebrow">${s.clan}</p><h1>${s.name}</h1><p class="motto small">${s.motto}</p></div>${ART.ring(k.total ? k.mastered / k.total : 0, s.color, 58, k.total ? Math.round((100 * k.mastered) / k.total) + "%" : "–")}</section>
      <div class="row wrap"><button class="btn primary" data-go="seance~s:${sid}" ${STORE.buildSession({ subject: sid }).length ? "" : "disabled"}>Réviser ce clan</button><span class="small muted">${k.due} à revoir · ${k.fresh} nouvelles · ${k.mastered} maîtrisées</span></div>
      <section class="stack"><h2>Chapitres</h2>${chs.map((c) => { const st = STORE.chapterState(c.id); return `<button class="chapter ${st !== "locked" ? "on" : "off"}" data-go="ch~${c.id}"><span class="kj" style="color:${st !== "locked" ? s.color : ""}">${c.kanji || s.kanji}</span><span><span class="t">${esc(c.title)}</span><br><span class="tiny muted">${c.userMade ? "Leçon photo" : c.stub ? "Contenu à venir (pack de leçon)" : `${STORE.cardList(c).length} cartes`}${c.fromPack ? " · pack" : ""}</span></span>${st === "done" ? '<span class="pill done">terminé</span>' : st === "active" ? '<span class="pill on">en cours</span>' : '<span class="pill off">fermé</span>'}</button>`; }).join("")}</section>
      <p class="tiny muted">Source : ${esc(PROGRAMME.sources[s.src].label)}.</p>`;
  }

  // ---------- Chapitre ----------
  function renderFiche(blocks) {
    return (blocks || []).map((b) => {
      if (b.h) return `<h3>${md(b.h)}</h3>`;
      if (b.p) return `<p>${md(b.p)}</p>`;
      if (b.def) return `<div class="def"><b>${md(b.def[0])}</b>${md(b.def[1])}</div>`;
      if (b.list) return `<ul>${b.list.map((x) => `<li>${md(x)}</li>`).join("")}</ul>`;
      if (b.tip) return `<div class="tip">${ART.sensei("happy", 44)}<span>${md(b.tip)}</span></div>`;
      if (b.fig) return ART.FIG[b.fig] || "";
      if (b.table) return `<div class="tablewrap"><table><thead><tr>${b.table[0].map((x) => `<th>${md(x)}</th>`).join("")}</tr></thead><tbody>${b.table.slice(1).map((r) => `<tr>${r.map((x) => `<td>${md(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      return "";
    }).join("");
  }
  async function viewChapter(main, cid) {
    const c = STORE.CHI[cid]; if (!c) return go("dojo", true);
    const s = sub(c.s), st = STORE.chapterState(cid), cards = STORE.cardList(c);
    const seen = cards.filter((x) => !STORE.isNew(x.id)).length, ratio = cards.length ? seen / cards.length : 0;
    const bossOk = st !== "locked" && c.boss && cards.length >= 4 && ratio >= 0.5; const bw = S().bosses[cid];
    main.innerHTML = `<button class="back" data-go="clan~${c.s}">← ${s.clan}</button>
      <section class="panel stack" style="--accent:${s.color}">
        <div class="row"><span class="kj" style="font-family:var(--f-display);font-size:2.2rem;color:${s.color}">${c.kanji || s.kanji}</span><div><p class="eyebrow">${s.name}${c.period ? ` · période ${c.period}` : ""}</p><h1>${esc(c.title)}</h1></div></div>
        ${c.sum ? `<p class="muted">${md(c.sum)}</p>` : ""}
        <div class="row wrap">${st === "locked" ? `<button class="btn primary" id="unlock">Commencé en classe : ouvrir</button>` : `<button class="btn primary" data-go="seance~c:${cid}" ${cards.length ? "" : "disabled"}>Réviser (${cards.length})</button>${st === "active" ? `<button class="btn" id="finish">Terminé en classe</button>` : `<span class="pill done">terminé en classe</span>`}`}</div>
        ${st !== "locked" && cards.length ? `<div class="small muted">${seen} / ${cards.length} cartes découvertes${c.boss ? ` · yōkai ${bossOk ? "prêt au combat" : "réveillé à 50 %"}` : ""}</div>` : ""}
      </section>
      ${c.boss && st !== "locked" ? `<section class="panel row" style="justify-content:space-between">${ART.yokai(cid, { size: 84, ally: bw && bw.won, angry: !(bw && bw.won) })}<div class="stack" style="flex:1"><b>${esc(c.boss.name)}</b><span class="small muted">${bw && bw.won ? "Vaincu : il a rejoint tes alliés !" : "Gardien du chapitre"}</span><button class="btn sm ${bossOk ? "primary" : ""}" data-go="boss~${cid}" ${bossOk ? "" : "disabled"}>${bw && bw.won ? "Revanche" : "Combattre"}</button></div></section>` : ""}
      <details ${st === "locked" ? "open" : ""}><summary>Programme officiel lié (${(c.refs || []).length})</summary><div class="in refs">${(c.refs || []).map((r) => { const it = STORE.REFI[r]; return `<div class="ref"><code>${esc(r)}</code><span><b>${esc(it ? it.t : "Référence inconnue")}</b>${it ? ` — ${esc(it.d)}` : ""}</span></div>`; }).join("")}</div></details>
      ${c.fiche ? `<section class="panel fiche" style="--accent:${s.color}"><p class="eyebrow">Fiche de leçon</p>${renderFiche(c.fiche)}</section>` : c.stub ? `<section class="flat">${senseiLine("Ce chapitre n'a pas encore de contenu. Quand il commence en classe, photographie ton cours ci-dessous : il sera transformé en cartes et en exercices.", "think")}</section>` : ""}
      ${(c.extra || []).map((x) => `<section class="extra fiche"><p class="eyebrow">Ajouts de ta prof${x.date ? ` · ${esc(x.date)}` : ""}</p>${x.note ? `<p>${md(x.note)}</p>` : ""}${renderFiche(x.fiche)}</section>`).join("")}
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Mes photos de cours</h2><label class="btn sm">Ajouter<input type="file" accept="image/*" capture="environment" multiple id="ph-in" hidden></label></div><div class="photos" id="ph"></div><div id="ph-share"></div></section>`;
    const un = $("#unlock"); if (un) un.onclick = () => { S().chapters[cid] = { state: "active", since: STORE.today() }; STORE.addXP(20); STORE.save(); fx("開！"); afterAction(); render(); };
    const fin = $("#finish"); if (fin) fin.onclick = () => { S().chapters[cid].state = "done"; STORE.save(); toast("Chapitre marqué comme terminé en classe. Il reste dans tes révisions."); render(); };
    $("#ph-in").onchange = async (e) => { const files = Array.from(e.target.files || []); for (const f of files) await STORE.addPhoto(cid, f); toast(files.length > 1 ? `${files.length} photos ajoutées` : "Photo ajoutée"); afterAction(); drawPhotos(); };
    async function drawPhotos() {
      const ps = await STORE.photos(cid); const box = $("#ph"); if (!box) return;
      box.innerHTML = ps.length ? "" : `<p class="small muted" style="grid-column:1/-1">Aucune photo. Photographie les pages de ton cahier pour garder les notions ajoutées par ta prof.</p>`;
      ps.forEach((p) => { const u = URL.createObjectURL(p.blob); const im = document.createElement("img"); im.src = u; im.alt = "Photo de cours"; im.onclick = () => lightbox(u, p.id, drawPhotos); box.appendChild(im); });
      const sh = $("#ph-share");
      if (ps.length && navigator.canShare) {
        const files = ps.map((p, i) => new File([p.blob], `hikari-${cid}-${i + 1}.jpg`, { type: "image/jpeg" }));
        if (navigator.canShare({ files })) {
          sh.innerHTML = `<button class="btn sm" id="ph-send">Envoyer les photos pour enrichissement</button>`;
          $("#ph-send").onclick = () => navigator.share({ files, title: `Hikari — ${c.title}`, text: `Hikari · chapitre ${cid} (${s.name}) : ${c.title}\nRéférences : ${(c.refs || []).join(", ")}` }).catch(() => { });
        }
      }
    }
    drawPhotos();
  }
  function lightbox(url, id, redraw) {
    const l = document.createElement("div"); l.className = "lightbox";
    l.innerHTML = `<div class="stack" style="align-items:center"><img src="${url}" alt="Photo de cours"><div class="row"><button class="btn sm" id="lb-close">Fermer</button><button class="btn sm" id="lb-del">Supprimer</button></div></div>`;
    document.body.appendChild(l);
    $("#lb-close", l).onclick = () => l.remove();
    $("#lb-del", l).onclick = async (e) => { if (e.target.dataset.sure) { await STORE.delPhoto(id); l.remove(); redraw(); } else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer la suppression"; } };
  }

  // ---------- Vérification des réponses ----------
  const norm = (s) => String(s).toLowerCase().normalize("NFC").replace(/[’`´]/g, "'").replace(/[.!?¡¿«»"]+/g, "").replace(/\s+/g, " ").trim();
  const noAcc = (s) => norm(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  function checkInput(val, card) {
    if (card.num != null) {
      const m = String(val).replace(/[\s  ]/g, "").replace(",", ".").match(/^-?\d*\.?\d+/);
      return { ok: !!m && Math.abs(parseFloat(m[0]) - card.num) < 1e-9 };
    }
    const answers = card.a || [];
    if (card.caseSensitive) { const v = String(val).trim().replace(/[.!?]+$/, ""); if (answers.some((a) => a === v)) return { ok: true }; if (answers.some((a) => norm(a) === norm(v))) return { ok: false, note: "Presque : attention à la majuscule !" }; }
    if (answers.some((a) => norm(a) === norm(val))) return { ok: true };
    if (answers.some((a) => noAcc(a) === noAcc(val))) return { ok: true, note: "Juste, mais attention aux accents !" };
    return { ok: false };
  }
  // Instancie une carte (générateur → question concrète, QCM → mélange)
  function instantiate(card) {
    let q = card.k === "g" ? Object.assign({}, GEN.run(card.g), { id: card.id, ch: card.ch, g: card.g }) : Object.assign({}, card);
    if (q.k === "q") { const order = shuffle(q.c.map((_, i) => i)); q.choices = order.map((i) => q.c[i]); q.good = order.indexOf(q.a); }
    return q;
  }

  // ---------- Carte d'exercice (partagée par révision, boss, éclair) ----------
  // onDone(result) avec result = { ok, grade }
  function mountCard(host, card, { selfGrade = true, onDone, compact } = {}) {
    const ch = STORE.CHI[card.ch], s = ch && sub(ch.s);
    const head = s ? `<div class="src">${ART.seal(s.kanji, s.color, 22)}<span>${esc(ch.title)}</span></div>` : "";
    const q = card;
    const expl = (extra) => (q.x || extra ? `<p class="x">${md(q.x || "")} ${extra || ""}</p>` : "");
    const body = document.createElement("div"); body.className = "panel card"; body.style.setProperty("--accent", s ? s.color : "");
    host.innerHTML = ""; host.appendChild(body);

    if (q.k === "f") {
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div>${q.fig ? ART.FIG[q.fig] || "" : ""}<div class="ans" hidden>${md(q.a)}${expl()}</div><div class="stack" id="act"><button class="btn primary big" id="rev">Révéler</button></div>`;
      $("#rev", body).onclick = () => {
        $(".ans", body).hidden = false;
        if (!selfGrade) { $("#act", body).innerHTML = `<div class="row"><button class="btn" data-g="0" style="flex:1">Je ne savais pas</button><button class="btn primary" data-g="2" style="flex:1">Je savais</button></div>`; }
        else {
          const prev = (g) => { const saved = S().cards[q.id]; const tmp = JSON.parse(JSON.stringify(saved || null)); const r = STORE.grade(q.id, g); if (tmp) S().cards[q.id] = tmp; else delete S().cards[q.id]; return g === 0 ? "10 min" : r.ivl + " j"; };
          $("#act", body).innerHTML = `<div class="grades">${[["Raté", 0], ["Dur", 1], ["Bien", 2], ["Facile", 3]].map(([n, g]) => `<button class="g${g}" data-g="${g}">${n}<span>${prev(g)}</span></button>`).join("")}</div>`;
        }
        $$("[data-g]", body).forEach((b) => (b.onclick = () => onDone({ ok: +b.dataset.g > 0, grade: +b.dataset.g })));
      };
      return;
    }
    if (q.k === "q") {
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div>${q.svg || ""}<div class="choices">${q.choices.map((c, i) => `<button class="choice" data-i="${i}">${md(c)}</button>`).join("")}</div><div id="after"></div>`;
      $$(".choice", body).forEach((b) => (b.onclick = () => {
        const i = +b.dataset.i, ok = i === q.good;
        $$(".choice", body).forEach((x) => { x.disabled = true; if (+x.dataset.i === q.good) x.classList.add("good"); });
        if (!ok) b.classList.add("bad");
        feedback(ok);
        $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? pick(["Excellent !", "Sugoi !", "Parfait !", "Bien vu !"]) : "Pas cette fois…"}</p>${expl()}<button class="btn primary big" id="nx">Suite</button>`;
        $("#nx", body).focus(); $("#nx", body).onclick = () => onDone({ ok, grade: ok ? 2 : 0 });
      }));
      return;
    }
    if (q.k === "i") {
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div>${q.svg || ""}<form id="f" class="stack"><input type="text" id="inp" autocomplete="off" autocapitalize="off" spellcheck="false" ${q.num != null ? 'inputmode="decimal"' : ""} placeholder="Ta réponse"><button class="btn primary big">Valider</button></form><div id="after"></div>`;
      const inp = $("#inp", body); setTimeout(() => inp.focus(), 50);
      $("#f", body).onsubmit = (e) => {
        e.preventDefault(); const v = inp.value; if (!v.trim()) return;
        const r = checkInput(v, q); inp.disabled = true; $("#f button", body).hidden = true; feedback(r.ok);
        $("#after", body).innerHTML = `<p class="verdict ${r.ok ? "good" : "bad"}">${r.ok ? pick(["Juste !", "Yatta !", "Impeccable !"]) : "Réponse attendue :"}</p>${r.ok ? "" : `<p class="big">${md(q.a[0])}</p>`}${r.note ? `<p class="small"><b>${r.note}</b></p>` : ""}${expl()}<div class="row wrap"><button class="btn primary" id="nx" style="flex:1">Suite</button>${r.ok ? "" : `<button class="btn ghost sm" id="override">J'avais juste (faute de frappe)</button>`}</div>`;
        $("#nx", body).focus(); $("#nx", body).onclick = () => onDone({ ok: r.ok, grade: r.ok ? 2 : 0 });
        const ov = $("#override", body); if (ov) ov.onclick = () => onDone({ ok: true, grade: 1 });
      };
      return;
    }
    if (q.k === "m") {
      const p = q.place, M = MAPS[p.map || "world"];
      body.innerHTML = `${head}<div class="q">${md(q.q)}</div><div class="map">${mapSVG(M, { id: "mq" })}</div><div id="after"></div>`;
      const svg = $("#mq", body); let done = false;
      svg.addEventListener("click", (e) => {
        if (done) return; done = true;
        const pt = svgPoint(svg, e), [tx, ty] = proj(M, p.lon, p.lat), dist = Math.hypot(pt.x - tx, pt.y - ty), ok = dist < M.W * 0.05;
        svg.insertAdjacentHTML("beforeend", `<line x1="${pt.x}" y1="${pt.y}" x2="${tx}" y2="${ty}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 5"/><circle cx="${pt.x}" cy="${pt.y}" r="8" fill="${ok ? "var(--good)" : "var(--bad)"}" stroke="var(--ink)" stroke-width="2"/>${pin(tx, ty, p.n, "var(--accent)")}`);
        if (ok) S().stats.mapWins++;
        feedback(ok);
        $("#after", body).innerHTML = `<p class="verdict ${ok ? "good" : "bad"}">${ok ? "Dans le mille !" : "Raté, c'était ici."}</p><button class="btn primary big" id="nx">Suite</button>`;
        $("#nx", body).onclick = () => onDone({ ok, grade: ok ? 2 : 0 });
      });
    }
  }
  let combo = 0;
  function feedback(ok) {
    if (ok) { combo++; S().stats.bestCombo = Math.max(S().stats.bestCombo, combo); if (combo >= 3) fx(combo % 5 === 0 ? `COMBO ×${combo} !` : pick(el().fx)); buzz(20); }
    else { combo = 0; document.body.classList.remove("flash-bad"); void document.body.offsetWidth; document.body.classList.add("flash-bad"); buzz([40, 40, 40]); }
    const cb = $(".combo"); if (cb) cb.textContent = combo >= 2 ? `×${combo}` : "";
  }

  // ---------- Révision (séance SRS) ----------
  function viewRevisionHub(main) {
    const subjects = PROGRAMME.subjects.map((s) => ({ s, n: STORE.buildSession({ subject: s.id }).length })).filter((x) => STORE.activeChapters().some((c) => c.s === x.s.id));
    const all = STORE.buildSession().length;
    main.innerHTML = `<h1>Salle d'entraînement</h1>
      ${senseiLine(all ? `Ta séance mélange les matières : c'est plus efficace que de tout réviser d'un bloc. <b>${all}</b> cartes sont prêtes.` : "Tout est à jour ! Reviens demain, ou lance un entraînement éclair pour garder la main.", all ? "happy" : "wow")}
      <button class="btn primary big" data-go="seance" ${all ? "" : "disabled"}>Séance complète · ${all}</button>
      <button class="btn" id="flash2">Entraînement éclair</button>
      <section class="stack"><h2>Par clan</h2>${subjects.length ? subjects.map(({ s, n }) => `<button class="chapter on" data-go="seance~s:${s.id}" ${n ? "" : "disabled"}><span class="kj" style="color:${s.color}">${s.kanji}</span><span><span class="t">${s.name}</span><br><span class="tiny muted">${n} carte${n > 1 ? "s" : ""} prête${n > 1 ? "s" : ""}</span></span><span class="pill ${n ? "new" : "off"}">${n ? "go" : "à jour"}</span></button>`).join("") : `<p class="muted">Ouvre des chapitres dans les clans pour remplir tes révisions.</p>`}</section>
      <section class="flat stack"><h3>Comment ça marche ?</h3><p class="small">Chaque carte revient juste avant que tu l'oublies. Si tu réponds juste, elle revient plus tard (1 jour, 3 jours, une semaine, un mois…). Si tu te trompes, elle revient vite. Une carte revue avec un intervalle de 21 jours ou plus est <b>maîtrisée</b>.</p></section>`;
    $("#flash2").onclick = () => startFlashQuiz();
  }
  function viewSession(main, arg) {
    const opt = {}; if (arg && arg.startsWith("s:")) opt.subject = arg.slice(2); if (arg && arg.startsWith("c:")) opt.chapter = arg.slice(2);
    const queue = STORE.buildSession(opt); if (!queue.length) { toast("Rien à réviser ici pour le moment."); return go("revision", true); }
    const total = queue.length; let done = 0, good = 0, xp = 0, lvlUp = 0; const requeued = new Set(); combo = 0;
    main.innerHTML = `<div class="session-top"><button class="back" id="quit">✕</button><div class="prog"><i style="width:0"></i></div><span class="combo"></span></div><div id="stage"></div>`;
    leaveGuard = () => done === 0 || done >= total || confirmLeave();
    $("#quit").onclick = () => { leaveGuard = null; finish(true); };
    function next() {
      if (!queue.length) return finish();
      const card = instantiate(queue.shift());
      mountCard($("#stage"), card, {
        onDone: ({ ok, grade }) => {
          const firstTime = !requeued.has(card.id);
          if (firstTime) { STORE.grade(card.id, grade); if (STORE.countReview()) setTimeout(() => toast("Objectif du jour atteint : ta flamme brille ! 炎"), 300); done++; }
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
      await celebrate(early ? "Pause !" : "お疲れ様！", `${ART.sensei(good / done > 0.7 ? "fire" : "happy", 100)}<p><b>${done}</b> carte${done > 1 ? "s" : ""} révisée${done > 1 ? "s" : ""} · <b>${Math.round(100 * good / Math.max(1, done))} %</b> de réussite<br><b>+${Math.round(xp)} XP</b> · meilleur combo ${S().stats.bestCombo}</p>${lvlUp ? `<p class="big">Niveau ${lvlUp} atteint : ${L.rank[1]} ${L.rank[2]} !</p>` : ""}`);
      afterAction(); go("dojo", true);
    }
    next();
  }
  function confirmLeave() { toast("Touche ✕ pour terminer la séance et garder tes points."); return false; }

  // ---------- Entraînement éclair ----------
  function autoCards(filter) { return STORE.allActiveCards(filter).filter((c) => c.k !== "f"); }
  function startFlashQuiz() {
    const pool = shuffle(autoCards()); if (pool.length < 3) { toast("Ouvre d'abord quelques chapitres pour t'entraîner."); return; }
    const main = $("main"); const list = pool.slice(0, 10); let i = 0, good = 0; combo = 0;
    history.pushState(null, "", "#revision");
    main.innerHTML = `<div class="session-top"><button class="back" id="quit">✕</button><div class="prog"><i style="width:0"></i></div><span class="combo"></span></div><div id="stage"></div>`;
    $("#quit").onclick = () => go("dojo", true);
    const next = async () => {
      if (i >= list.length) { const g = good * 5; STORE.addXP(g); await celebrate("Éclair !", `${ART.sensei(good >= 8 ? "fire" : "happy", 100)}<p><b>${good} / ${list.length}</b> bonnes réponses · <b>+${g} XP</b></p>`); afterAction(); return go("dojo", true); }
      mountCard($("#stage"), instantiate(list[i]), { selfGrade: false, onDone: ({ ok }) => { if (ok) good++; i++; $(".prog > i").style.width = (100 * i / list.length) + "%"; STORE.save(); next(); } });
    };
    next();
  }

  // ---------- Boss ----------
  function viewBoss(main, cid) {
    const c = STORE.CHI[cid]; if (!c || !c.boss) return go("dojo", true);
    const s = sub(c.s); let pool = shuffle(STORE.cardList(c).filter((x) => x.k !== "f"));
    if (pool.length < 3) pool = shuffle(STORE.cardList(c));
    const maxHp = c.boss.hp || 10; let hp = maxHp, hearts = 3, qi = 0; combo = 0;
    main.innerHTML = `<button class="back" id="flee">← Fuir</button>
      <section class="panel arena tone" style="--accent:${s.color}"><span class="boss-name">${esc(c.boss.name)}</span><div id="yk">${ART.yokai(cid, { size: 140, angry: true })}</div><div class="hp"><i style="width:100%"></i></div><div class="row" style="gap:18px"><span class="hearts" id="hearts">♥♥♥</span><span class="combo"></span></div></section><div id="stage"></div>`;
    $("#flee").onclick = () => go("ch~" + cid, true);
    function next() {
      if (hp <= 0) return win(); if (hearts <= 0) return lose();
      const card = instantiate(pool[qi++ % pool.length]);
      mountCard($("#stage"), card, {
        selfGrade: false, onDone: ({ ok }) => {
          if (ok) { hp--; fx(pick(el().fx)); const y = $("#yk svg"); y.classList.remove("shake"); void y.offsetWidth; y.classList.add("shake"); }
          else { hearts--; }
          $(".hp > i").style.width = (100 * hp / maxHp) + "%"; $("#hearts").textContent = "♥".repeat(hearts) + "♡".repeat(3 - hearts);
          next();
        }
      });
    }
    async function win() {
      const first = !(S().bosses[cid] && S().bosses[cid].won), perfect = hearts === 3;
      S().bosses[cid] = { won: true, perfect: perfect || !!(S().bosses[cid] && S().bosses[cid].perfect), date: STORE.today() };
      const g = first ? 150 + (perfect ? 50 : 0) : 30; STORE.addXP(g); STORE.save();
      await celebrate("勝利！", `${ART.yokai(cid, { size: 120, ally: true })}<p><b>${esc(c.boss.name)}</b> est vaincu${first ? " et rejoint tes alliés" : ""} !</p><p><b>+${g} XP</b>${perfect ? " · sans une égratignure !" : ""}</p>`);
      afterAction(); go("ch~" + cid, true);
    }
    async function lose() {
      await celebrate("まだまだ…", `${ART.sensei("think", 100)}<p>Le yōkai résiste encore. Révise ce chapitre un jour ou deux, puis reviens : il sera plus faible face à toi.</p>`, "Retour au chapitre");
      go("ch~" + cid, true);
    }
    next();
  }

  // ---------- Cartes géographiques ----------
  const proj = (M, lon, lat) => [((lon - M.lon0) / (M.lon1 - M.lon0)) * M.W, ((M.lat1 - lat) / (M.lat1 - M.lat0)) * M.H];
  function svgPoint(svg, e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  const pin = (x, y, label, color) => `<g><circle cx="${x}" cy="${y}" r="9" fill="${color}" stroke="var(--ink)" stroke-width="2.5"/><text x="${x}" y="${y - 15}" text-anchor="middle" class="pin-lbl">${esc(label)}</text></g>`;
  function mapSVG(M, { id = "", inner = "" } = {}) { return `<svg id="${id}" viewBox="0 0 ${M.W} ${M.H}" role="img" aria-label="Carte"><rect class="sea" width="${M.W}" height="${M.H}"/><path class="land" d="${M.land}"/><path class="borders" d="${M.borders}"/>${inner}</svg>`; }
  function routePath(M, pts) {
    let d = "", prev = null;
    pts.forEach(([lon, lat]) => { const [x, y] = proj(M, lon, lat); d += (prev === null || Math.abs(lon - prev) > 180 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " "; prev = lon; });
    return d;
  }

  // ---------- Monde : frise + carte ----------
  let worldTab = "frise", worldMap = "world";
  function viewWorld(main) {
    main.innerHTML = `<h1>Le Monde d'Hikari</h1><div class="seg" role="group"><button aria-pressed="${worldTab === "frise"}" data-t="frise">Rouleau du temps</button><button aria-pressed="${worldTab === "carte"}" data-t="carte">Carte</button></div><div id="w"></div>`;
    $$("[data-t]", main).forEach((b) => (b.onclick = () => { worldTab = b.dataset.t; viewWorld(main); }));
    worldTab === "frise" ? drawTimeline($("#w")) : drawMap($("#w"));
  }
  // Échelle par morceaux : la Préhistoire est immense, l'Antiquité courte
  const TL_BREAKS = [[-3500000, 0], [-100000, 0.3], [-10000, 0.48], [-3500, 0.62], [500, 1]];
  function tlX(y, W) { for (let i = 1; i < TL_BREAKS.length; i++) { const [y0, f0] = TL_BREAKS[i - 1], [y1, f1] = TL_BREAKS[i]; if (y <= y1) return 90 + (f0 + ((y - y0) / (y1 - y0)) * (f1 - f0)) * (W - 180); } return W - 90; }
  function yearLbl(y) { if (y <= -1000000) return `−${String(-y / 1e6).replace(".", ",")} Ma`; if (y < 0) return `−${GEN.fmt(-y)}`; return String(y); }
  function yearLong(y) { if (y <= -1000000) return `il y a environ ${String(-y / 1e6).replace(".", ",")} millions d'années`; if (y < -20000) return `il y a environ ${GEN.fmt(-y)} ans`; if (y < 0) return `${GEN.fmt(-y)} av. J.-C.`; return `${y} ap. J.-C.`; }
  function drawTimeline(host) {
    const evs = []; STORE.CH.forEach((c) => (c.events || []).forEach((e) => evs.push(Object.assign({ ch: c, open: STORE.chapterState(c.id) !== "locked" }, e))));
    evs.sort((a, b) => a.y - b.y);
    const W = 2200, H = 360, axis = 190; const lanes = [[], [], [], []]; const laneY = [120, 260, 60, 320];
    evs.forEach((e) => { e.x = tlX(e.y, W); let l = 0; for (; l < 4; l++) { const last = lanes[l][lanes[l].length - 1]; if (!last || e.x - last.x > 150) break; } e.lane = Math.min(l, 3); lanes[e.lane].push(e); });
    const eras = [["PALÉOLITHIQUE", -3500000, -10000], ["NÉOLITHIQUE", -10000, -3300], ["ANTIQUITÉ", -3300, 476]];
    const ticks = [-3000000, -2000000, -1000000, -100000, -50000, -10000, -5000, -3000, -2000, -1000, 0, 500];
    const nOpen = evs.filter((e) => e.open).length;
    host.innerHTML = `${senseiLine(nOpen ? `Ton rouleau compte <b>${nOpen}</b> repère${nOpen > 1 ? "s" : ""}. Il s'allonge à chaque chapitre ouvert. Fais-le défiler !` : "Ton rouleau est encore vide : ouvre un chapitre d'histoire pour y faire apparaître les premiers repères.", "happy")}
      <div class="scroll-x" id="tlw"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Frise chronologique">
        ${eras.map(([n, a, b], i) => `<rect x="${tlX(a, W)}" y="${axis - 14}" width="${tlX(b, W) - tlX(a, W)}" height="28" fill="${["#b197fc", "#8ce99a", "#ffd43b"][i]}" opacity=".55"/><text x="${(tlX(a, W) + tlX(b, W)) / 2}" y="${axis + 5}" text-anchor="middle" class="tl-era">${n}</text>`).join("")}
        <line x1="0" y1="${axis}" x2="${W}" y2="${axis}" stroke="var(--ink)" stroke-width="3" opacity=".25"/>
        ${ticks.map((t) => `<line x1="${tlX(t, W)}" y1="${axis + 14}" x2="${tlX(t, W)}" y2="${axis + 22}" stroke="var(--ink)" stroke-width="2"/><text x="${tlX(t, W)}" y="${axis + 36}" text-anchor="middle" class="tl-yr">${t === 0 ? "0" : yearLbl(t)}</text>`).join("")}
        <line x1="${tlX(-3300, W)}" y1="20" x2="${tlX(-3300, W)}" y2="${H - 10}" stroke="var(--seal)" stroke-width="2" stroke-dasharray="6 5"/><text x="${tlX(-3300, W) + 6}" y="30" class="tl-yr" style="fill:var(--seal)">Préhistoire | Histoire (écriture)</text>
        ${evs.map((e, i) => { const y = laneY[e.lane], col = e.open ? sub(e.ch.s).color : "var(--mute)"; return `<g class="tl-ev" data-i="${i}"><line x1="${e.x}" y1="${axis}" x2="${e.x}" y2="${y}" stroke="${col}" stroke-width="2"/><circle cx="${e.x}" cy="${axis}" r="${e.key ? 7 : 5}" fill="${col}" stroke="var(--ink)" stroke-width="2"/><rect x="${e.x - 70}" y="${y - 20}" width="140" height="38" rx="6" fill="var(--panel)" stroke="${col}" stroke-width="${e.key ? 3 : 2}"/><text x="${e.x}" y="${y - 4}" text-anchor="middle" class="tl-lbl">${e.open ? esc(e.label.length > 22 ? e.label.slice(0, 21) + "…" : e.label) : "? ? ?"}</text><text x="${e.x}" y="${y + 11}" text-anchor="middle" class="tl-yr">${e.open ? yearLbl(e.y) : "verrouillé"}</text></g>`; }).join("")}
      </svg></div>
      <p class="tiny muted">L'échelle n'est pas régulière : la Préhistoire est « compressée », sinon l'Antiquité tiendrait sur un millimètre ! Ma = millions d'années.</p>
      <div class="flat detail" id="tl-d"><span class="muted small">Touche un repère pour le détail.</span></div>
      <button class="btn primary" id="order" ${nOpen >= 4 ? "" : "disabled"}>Défi : remettre 4 repères dans l'ordre</button><div id="order-box"></div>`;
    const w = $("#tlw"); const firstOpen = evs.find((e) => e.open); if (firstOpen) w.scrollLeft = Math.max(0, firstOpen.x - 60);
    $$(".tl-ev", host).forEach((g) => (g.onclick = () => { const e = evs[+g.dataset.i]; $("#tl-d").innerHTML = e.open ? `<b>${esc(e.label)}</b><br><span class="small">${yearLong(e.y)}${e.note ? " · " + esc(e.note) : ""}</span><br><button class="btn sm" data-go="ch~${e.ch.id}" style="margin-top:6px">${esc(e.ch.title)}</button>` : `<b>Repère verrouillé</b><br><span class="small">Il apparaîtra quand le chapitre « ${esc(e.ch.title)} » sera ouvert.</span>`; }));
    $("#order").onclick = () => orderGame(evs.filter((e) => e.open), $("#order-box"));
  }
  function orderGame(open, box) {
    const set = shuffle(open).slice(0, 4); const sorted = set.slice().sort((a, b) => a.y - b.y); const picked = []; let errors = 0;
    function draw() {
      box.innerHTML = `<div class="panel stack"><b>Touche les repères du plus ancien au plus récent</b><div class="choices">${set.map((e, i) => { const k = picked.indexOf(e); return `<button class="choice ${k >= 0 ? "good" : ""}" data-i="${i}" ${k >= 0 ? "disabled" : ""}>${k >= 0 ? k + 1 + ". " : ""}${esc(e.label)}${k >= 0 ? ` <span class="small">(${yearLbl(e.y)})</span>` : ""}</button>`; }).join("")}</div></div>`;
      $$(".choice", box).forEach((b) => (b.onclick = async () => {
        const e = set[+b.dataset.i];
        if (e === sorted[picked.length]) { picked.push(e); feedback(true); if (picked.length === 4) { if (!errors) S().stats.orderWins++; const g = errors ? 10 : 30; STORE.addXP(g); STORE.save(); draw(); await celebrate(errors ? "Bien joué !" : "Chronomancienne !", `<p>${errors ? `${errors} erreur${errors > 1 ? "s" : ""}, mais tu y es arrivée.` : "Aucune erreur !"} <b>+${g} XP</b></p>`); afterAction(); return; } draw(); }
        else { errors++; feedback(false); b.classList.add("bad"); setTimeout(() => b.classList.remove("bad"), 500); }
      }));
    }
    draw();
  }
  function drawMap(host) {
    const places = [], routes = [];
    STORE.CH.forEach((c) => { const open = STORE.chapterState(c.id) !== "locked"; if (!open) return; (c.places || []).forEach((p) => places.push(Object.assign({ ch: c }, p))); (c.routes || []).forEach((r) => routes.push(Object.assign({ ch: c }, r))); });
    const maps = { world: "Monde", medit: "Méditerranée et Proche-Orient", europe: "Europe" };
    const M = MAPS[worldMap]; const here = places.filter((p) => (p.map || "world") === worldMap);
    const rts = worldMap === "world" ? routes : [];
    const inner = rts.map((r) => `<path d="${routePath(M, r.pts)}" fill="none" stroke="var(--seal)" stroke-width="3" stroke-dasharray="10 7" stroke-linecap="round" opacity=".8"/>`).join("") + here.map((p, i) => { const [x, y] = proj(M, p.lon, p.lat); return `<g data-p="${i}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="16" fill="transparent"/><circle cx="${x}" cy="${y}" r="7" fill="${sub(p.ch.s).color}" stroke="var(--ink)" stroke-width="2.5"/></g>`; }).join("");
    host.innerHTML = `<div class="seg" role="group">${Object.entries(maps).map(([k, n]) => `<button aria-pressed="${k === worldMap}" data-m="${k}">${n.split(" ")[0]}</button>`).join("")}</div>
      <div class="scroll-x map">${mapSVG(M, { id: "wm", inner })}</div>
      <div class="flat detail" id="m-d">${here.length ? `<span class="muted small">${here.length} lieu${here.length > 1 ? "x" : ""} débloqué${here.length > 1 ? "s" : ""} sur cette carte. Touche un point.${rts.length ? " Les pointillés rouges montrent les migrations d'Homo sapiens." : ""}</span>` : `<span class="muted small">Aucun lieu débloqué sur cette carte pour l'instant.</span>`}</div>
      <button class="btn primary" id="mgame" ${places.length >= 3 ? "" : "disabled"}>Défi cartographe : 5 lieux à trouver</button>`;
    $$("[data-m]", host).forEach((b) => (b.onclick = () => { worldMap = b.dataset.m; drawMap(host); }));
    $$("[data-p]", host).forEach((g) => (g.onclick = (e) => { e.stopPropagation(); const p = here[+g.dataset.p]; $("#m-d").innerHTML = `<b>${esc(p.n)}</b><br><span class="small">${esc(sub(p.ch.s).name)} · </span><button class="btn sm" data-go="ch~${p.ch.id}">${esc(p.ch.title)}</button>`; }));
    $("#mgame").onclick = () => {
      const list = shuffle(places).slice(0, 5); let i = 0, good = 0; const main = $("main"); combo = 0;
      main.innerHTML = `<div class="session-top"><button class="back" id="quit">✕</button><div class="prog"><i style="width:0"></i></div><span class="combo"></span></div><div id="stage"></div>`;
      $("#quit").onclick = () => viewWorld(main);
      const next = async () => {
        if (i >= list.length) { const g = good * 8; STORE.addXP(g); STORE.save(); await celebrate(good >= 4 ? "Cartographe !" : "Bien essayé !", `<p><b>${good} / ${list.length}</b> lieux trouvés · <b>+${g} XP</b></p>`); afterAction(); return viewWorld(main); }
        const p = list[i]; mountCard($("#stage"), { k: "m", place: p, ch: p.ch.id, q: `Touche la carte là où se trouve **${p.n}**.` }, { onDone: ({ ok }) => { if (ok) good++; i++; $(".prog > i").style.width = (100 * i / list.length) + "%"; next(); } });
      };
      next();
    };
  }

  // ---------- Trésors ----------
  function viewTreasures(main) {
    const L = STORE.levelInfo(); const won = Object.keys(S().badges).length;
    const bossChs = STORE.CH.filter((c) => c.boss && STORE.chapterState(c.id) !== "locked");
    main.innerHTML = `<h1>Salle des trésors</h1>
      <section class="panel stack"><div class="row" style="justify-content:space-between"><h2>Rang</h2><span class="small muted">${S().xp} XP au total</span></div>
        <div class="ladder">${STORE.RANKS.map((r) => `<div class="r ${L.rank === r ? "cur" : ""}"><span class="jp">${r[1]}</span><span><b>${r[2]}</b></span><span class="small muted">niv. ${r[0]}</span></div>`).join("")}</div>
        ${L.next ? `<p class="small muted">Prochain rang, ${L.next[2]}, au niveau ${L.next[0]}.</p>` : ""}</section>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Yōkai alliés</h2><span class="small muted">${Object.values(S().bosses).filter((b) => b.won).length} / ${bossChs.length}</span></div>
        <div class="allies">${bossChs.length ? bossChs.map((c) => { const w = S().bosses[c.id] && S().bosses[c.id].won; return `<button class="ally ${w ? "" : "lock"}" data-go="ch~${c.id}" style="background:none;border:0;cursor:pointer">${ART.yokai(c.id, { size: 84, ally: w })}<span>${w ? esc(c.boss.name.split(",")[0]) : "???"}</span></button>`; }).join("") : `<p class="muted small" style="grid-column:1/-1">Ouvre des chapitres pour réveiller leurs yōkai gardiens.</p>`}</div></section>
      <section class="stack"><div class="row" style="justify-content:space-between"><h2>Sceaux</h2><span class="small muted">${won} / ${STORE.BADGES.length}</span></div>
        <div class="badges">${STORE.BADGES.map(([id, k, n, d]) => { const got = S().badges[id]; return `<div class="badge ${got ? "" : "lock"}">${ART.seal(k, got ? "var(--seal)" : "var(--mute)", 54, !got)}<span class="t">${n}</span><span class="d">${d}</span></div>`; }).join("")}</div></section>`;
  }

  // ---------- Moi (profil, suivi parent, packs, sauvegarde, programme) ----------
  function viewMe(main) {
    const L = STORE.levelInfo(); const mast = Object.keys(S().cards).filter(STORE.mastered).length;
    const days = []; for (let i = 34; i >= 0; i--) { const d = STORE.today(new Date(Date.now() - i * 86400000)); days.push([d, (S().days[d] || { n: 0 }).n]); }
    const g = S().settings.goal;
    main.innerHTML = `<h1>${esc(S().profile.name)}</h1>
      <section class="panel stack"><div class="stats-row"><div class="stat"><b>${L.level}</b><span>niveau</span></div><div class="stat"><b>${S().streak.best}</b><span>record de flamme</span></div><div class="stat"><b>${mast}</b><span>cartes maîtrisées</span></div></div>
        <div><p class="eyebrow">Activité des 5 dernières semaines</p><div class="heat">${days.map(([d, n], i) => `<i class="${n >= g ? "l3" : n >= g / 2 ? "l2" : n > 0 ? "l1" : ""} ${i === days.length - 1 ? "today" : ""}" title="${d} : ${n} révisions"></i>`).join("")}</div></div>
        <div class="grid2">${PROGRAMME.subjects.map((s) => { const k = STORE.counts((c) => c.s === s.id); return `<div class="row">${ART.ring(k.total ? k.mastered / k.total : 0, s.color, 44)}<span class="small"><b>${s.name}</b><br>${k.seen}/${k.total} vues · ${k.mastered} maîtrisées</span></div>`; }).join("")}</div></section>
      <details><summary>Nouvelle leçon photo</summary><div class="in" id="nl"></div></details>
      <details><summary>Importer un pack de leçon</summary><div class="in">
        <p class="small">Un pack ajoute des fiches, des cartes, des repères de frise ou des lieux, rattachés au programme. Choisis le fichier <b>.json</b> reçu, ou colle son contenu.</p>
        <label class="btn">Choisir un fichier<input type="file" accept=".json,application/json" id="pk-file" hidden></label>
        <textarea id="pk-txt" placeholder='{"format":"hikari-pack", …}'></textarea><button class="btn primary" id="pk-go">Importer le texte collé</button><div id="pk-res"></div>
        ${(S().packs || []).length ? `<p class="eyebrow">Packs installés</p>${S().packs.map((p) => `<div class="small">• ${esc(p.title || p.id)} <span class="muted">(${esc(p.created || "")})</span></div>`).join("")}` : ""}
      </div></details>
      <details><summary>Réglages</summary><div class="in">
        <label class="stack"><span class="small"><b>Objectif du jour</b> (révisions pour remplir le Ki)</span><select id="st-goal">${[10, 15, 20, 30, 40].map((n) => `<option ${n === g ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="stack"><span class="small"><b>Nouvelles cartes par jour</b> au maximum</span><select id="st-new">${[5, 10, 15, 20, 30].map((n) => `<option ${n === S().settings.newPerDay ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <span class="small"><b>Élément</b></span><div class="elements">${Object.entries(ART.ELEMENTS).map(([id, e]) => `<button class="el" data-el="${id}" aria-pressed="${id === S().profile.element}"><span class="k">${e.k}</span>${e.n}</button>`).join("")}</div>
        <button class="btn" id="persist">Protéger mes données contre l'effacement</button>
      </div></details>
      <details><summary>Sauvegarde</summary><div class="in">
        <p class="small">Tes progrès sont enregistrés sur ce téléphone. Fais une sauvegarde de temps en temps (les photos ne sont pas incluses).</p>
        <button class="btn" id="bk-out">Télécharger une sauvegarde</button>
        <label class="btn">Restaurer une sauvegarde<input type="file" accept=".json,application/json" id="bk-in" hidden></label>
        <button class="btn ghost" id="reset">Tout effacer et recommencer</button>
      </div></details>
      <details><summary>Programme officiel et couverture</summary><div class="in" id="cov"></div></details>
      <details><summary>Sources et à propos</summary><div class="in small">
        <p>Hikari suit les programmes officiels de 6e en vigueur en 2026-2027. Les textes sont paraphrasés ; en cas de doute, la leçon de ta prof fait foi.</p>
        ${Object.values(PROGRAMME.sources).map((s) => `<p>• <a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></p>`).join("")}
        <p>Fonds de carte : Natural Earth (domaine public). Univers, personnages et yōkai : créations originales.</p></div></details>`;
    // Nouvelle leçon photo
    const nl = $("#nl"); let nlSub = "fr";
    function drawNL() {
      const s = sub(nlSub);
      nl.innerHTML = `<p class="small">Ta prof commence une leçon ? Crée-la ici, rattache-la au programme et ajoute tes photos. Elle pourra ensuite être enrichie par un pack.</p>
        <select id="nl-s">${PROGRAMME.subjects.map((x) => `<option value="${x.id}" ${x.id === nlSub ? "selected" : ""}>${x.name}</option>`).join("")}</select>
        <input type="text" id="nl-t" placeholder="Titre de la leçon" maxlength="80">
        <span class="small"><b>Points du programme concernés</b></span>
        <div class="checks">${s.domains.map((d) => `<span class="eyebrow">${esc(d.name)}</span>${d.items.map((it) => `<label><input type="checkbox" value="${it.id}"><span><b>${esc(it.t)}</b> <span class="muted">${it.id}</span></span></label>`).join("")}`).join("")}</div>
        <label class="btn">Ajouter les photos<input type="file" accept="image/*" capture="environment" multiple id="nl-ph" hidden></label><span class="small muted" id="nl-n">0 photo</span>
        <button class="btn primary" id="nl-go">Créer la leçon</button>`;
      let files = [];
      $("#nl-s").onchange = (e) => { nlSub = e.target.value; drawNL(); };
      $("#nl-ph").onchange = (e) => { files = Array.from(e.target.files || []); $("#nl-n").textContent = files.length + " photo" + (files.length > 1 ? "s" : ""); };
      $("#nl-go").onclick = async () => {
        const t = $("#nl-t").value.trim(), refs = $$(".checks input:checked", nl).map((i) => i.value);
        if (!t) return toast("Donne un titre à ta leçon.");
        if (!refs.length) return toast("Coche au moins un point du programme.");
        const ts = Date.now(), id = `u-${nlSub}-${ts}`;
        STORE.importPack({ format: "hikari-pack", version: 1, id: "photo-" + ts, title: "Leçon photo : " + t, created: STORE.today(), chapters: [{ id, s: nlSub, title: t, refs, userMade: true, kanji: "写", sum: "Leçon photographiée en classe. Elle sera enrichie de cartes et d'exercices.", cards: [] }] });
        for (const f of files) await STORE.addPhoto(id, f);
        toast("Leçon créée !"); afterAction(); go("ch~" + id);
      };
    }
    drawNL();
    // Import pack
    const doImport = (txt) => { let p; try { p = JSON.parse(txt); } catch (e) { $("#pk-res").innerHTML = `<p class="small" style="color:var(--bad)"><b>Fichier illisible</b> : ce n'est pas du JSON valide.</p>`; return; } const r = STORE.importPack(p); $("#pk-res").innerHTML = r.errs.length ? `<p class="small" style="color:var(--bad)"><b>Import refusé</b><br>${r.errs.map(esc).join("<br>")}</p>` : `<p class="small" style="color:var(--good)"><b>Pack importé : ${esc(p.title || p.id)}</b></p>${r.warns.length ? `<p class="tiny muted">${r.warns.map(esc).join("<br>")}</p>` : ""}`; if (!r.errs.length) { STORE.addXP(15); afterAction(); fx("巻！"); } };
    $("#pk-file").onchange = async (e) => { const f = e.target.files[0]; if (f) doImport(await f.text()); };
    $("#pk-go").onclick = () => doImport($("#pk-txt").value);
    // Réglages
    $("#st-goal").onchange = (e) => { S().settings.goal = +e.target.value; STORE.save(); renderHUD(); };
    $("#st-new").onchange = (e) => { S().settings.newPerDay = +e.target.value; STORE.save(); };
    $$("[data-el]", main).forEach((b) => (b.onclick = () => { S().profile.element = b.dataset.el; STORE.save(); applyAccent(); viewMe(main); }));
    $("#persist").onclick = async () => { try { const ok = navigator.storage && navigator.storage.persist && (await navigator.storage.persist()); toast(ok ? "Données protégées sur ce téléphone." : "Le navigateur n'a pas accordé la protection. Installe l'application pour l'obtenir."); } catch (e) { toast("Protection indisponible ici."); } };
    // Sauvegarde
    $("#bk-out").onclick = () => { const blob = new Blob([STORE.exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `hikari-sauvegarde-${STORE.today()}.json`; document.body.appendChild(a); a.click(); a.remove(); toast("Sauvegarde téléchargée."); };
    $("#bk-in").onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { STORE.importAll(JSON.parse(await f.text())); applyAccent(); toast("Sauvegarde restaurée."); render(); } catch (err) { toast(err.message || "Fichier illisible."); } };
    $("#reset").onclick = (e) => { if (e.target.dataset.sure) { STORE.reset(); location.hash = "#dojo"; render(); } else { e.target.dataset.sure = 1; e.target.textContent = "Confirmer : tout effacer définitivement"; e.target.classList.add("primary"); } };
    // Couverture du programme
    const covered = {}; STORE.CH.forEach((c) => (c.refs || []).forEach((r) => { covered[r] = covered[r] || []; covered[r].push(c); }));
    $("#cov").innerHTML = `<p class="small">Pour chaque point officiel : les chapitres Hikari qui s'y rattachent.</p>` + PROGRAMME.subjects.map((s) => `<details><summary>${s.name}</summary><div class="in cov">${s.domains.map((d) => `<span class="eyebrow">${esc(d.name)}</span>${d.items.map((it) => { const cs = covered[it.id] || []; const withContent = cs.filter((c) => !c.stub); return `<div class="it"><span><b>${esc(it.t)}</b> <span class="muted tiny">${it.id}</span></span><span class="pill ${withContent.length ? "on" : cs.length ? "new" : "off"}">${withContent.length ? "contenu" : cs.length ? "prévu" : "—"}</span></div>`; }).join("")}`).join("")}<p class="tiny muted">${esc(PROGRAMME.sources[s.src].label)}</p></div></details>`).join("");
  }

  // ---------- Démarrage ----------
  function boot() {
    STORE.load(); STORE.buildContent(); applyAccent();
    document.body.innerHTML = `<div id="app"><header class="hud" hidden></header><main></main></div><nav class="tabs" hidden></nav>`;
    render();
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => { });
  }
  window.HIKARI = { boot: () => (document.body ? boot() : document.addEventListener("DOMContentLoaded", boot)) };
})();
