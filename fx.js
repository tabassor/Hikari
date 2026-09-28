/* Effets : sons synthétisés (Web Audio, aucun fichier), vibrations, particules.
   Tout est désactivable dans Moi → Réglages, et coupé si « réduire les animations » est actif. */
(function () {
  const reduce = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set = () => (window.STORE && STORE.S && STORE.S.settings) || { sound: true, haptics: true };

  // ---------- Son ----------
  let ac = null, master = null;
  function ctx() {
    if (!set().sound) return null;
    try {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.22; master.connect(ac.destination); }
      if (ac.state === "suspended") ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  function tone(freq, t0, dur, { type = "sine", vol = 0.5, to = null, attack = 0.005 } = {}) {
    const a = ctx(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(); o.type = type;
    const t = a.currentTime + t0; o.frequency.setValueAtTime(freq, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(t0, dur, { vol = 0.4, freq = 1200, q = 0.8, type = "bandpass" } = {}) {
    const a = ctx(); if (!a) return;
    const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = buf; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(master); s.start(a.currentTime + t0);
  }
  const N = (n) => 440 * Math.pow(2, (n - 69) / 12); // note MIDI → Hz
  const SFX = {
    tap: () => tone(N(84), 0, 0.04, { type: "triangle", vol: 0.25 }),
    flip: () => noise(0, 0.12, { vol: 0.35, freq: 2400, q: 0.6 }),
    good: (combo = 0) => { const b = 76 + Math.min(combo, 8); tone(N(b), 0, 0.12, { type: "triangle", vol: 0.45 }); tone(N(b + 7), 0.08, 0.2, { type: "sine", vol: 0.45 }); },
    bad: () => { tone(196, 0, 0.22, { type: "square", vol: 0.12, to: 130 }); tone(185, 0.02, 0.22, { type: "sawtooth", vol: 0.06, to: 120 }); },
    combo: (n) => [0, 4, 7, 12].forEach((s, i) => tone(N(72 + s + Math.min(n, 12)), i * 0.05, 0.12, { type: "triangle", vol: 0.35 })),
    hit: () => { noise(0, 0.16, { vol: 0.6, freq: 900, q: 0.4 }); tone(110, 0, 0.18, { type: "sine", vol: 0.7, to: 50 }); },
    hurt: () => { tone(330, 0, 0.3, { type: "sawtooth", vol: 0.1, to: 110 }); noise(0, 0.2, { vol: 0.25, freq: 300 }); },
    win: () => [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => tone(N(n), i * 0.07, i === 6 ? 0.6 : 0.16, { type: i % 2 ? "sine" : "triangle", vol: 0.4 })),
    lose: () => [67, 63, 60, 55].forEach((n, i) => tone(N(n), i * 0.14, 0.24, { type: "triangle", vol: 0.3 })),
    level: () => [72, 76, 79, 84, 88].forEach((n, i) => tone(N(n), i * 0.06, 0.3, { type: "triangle", vol: 0.35 })),
    stamp: () => { tone(90, 0, 0.14, { type: "sine", vol: 0.8, to: 45 }); noise(0, 0.08, { vol: 0.4, freq: 500 }); tone(N(88), 0.1, 0.5, { type: "sine", vol: 0.18 }); },
    swipe: () => noise(0, 0.18, { vol: 0.3, freq: 1600, q: 0.5 }),
    pick: () => tone(N(79), 0, 0.05, { type: "triangle", vol: 0.25 }),
    drop: () => tone(N(72), 0, 0.07, { type: "sine", vol: 0.35 })
  };
  function sfx(name, arg) { try { SFX[name] && SFX[name](arg); } catch (e) { } }
  function buzz(p) { if (!set().haptics) return; try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } }

  // ---------- Particules ----------
  let cv = null, cx = null, parts = [], raf = 0;
  function ensure() {
    if (cv) return;
    cv = document.createElement("canvas"); cv.className = "fx-canvas"; document.body.appendChild(cv); cx = cv.getContext("2d");
    const rs = () => { const d = Math.min(2, window.devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px"; cx.setTransform(d, 0, 0, d, 0, 0); };
    rs(); addEventListener("resize", rs);
  }
  function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.life > 0);
    parts.forEach((p) => {
      p.life -= 1; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.985; p.rot += p.vr;
      const a = Math.max(0, p.life / p.max); cx.globalAlpha = a; cx.fillStyle = p.c; cx.strokeStyle = p.c;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
      if (p.shape === "star") { cx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? p.s * 0.4 : p.s; const an = (i * Math.PI) / 4; cx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } cx.closePath(); cx.fill(); }
      else if (p.shape === "shard") { cx.fillRect(-p.s, -p.s * 0.25, p.s * 2, p.s * 0.5); }
      else if (p.shape === "ring") { cx.lineWidth = 3; cx.beginPath(); cx.arc(0, 0, p.s * (1 + (1 - a) * 3), 0, Math.PI * 2); cx.stroke(); }
      else if (p.shape === "slash") { cx.lineWidth = 6 * a + 1; cx.lineCap = "round"; cx.beginPath(); cx.moveTo(-p.s, 0); cx.lineTo(p.s, 0); cx.stroke(); }
      else { cx.beginPath(); cx.arc(0, 0, p.s, 0, Math.PI * 2); cx.fill(); }
      cx.restore();
    });
    cx.globalAlpha = 1;
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  }
  function burst(x, y, { color = "#E4572E", n = 24, speed = 6, shapes = ["dot", "star", "shard"], g = 0.18, size = [3, 7], life = 50, colors } = {}) {
    if (reduce()) return; ensure();
    for (let i = 0; i < n; i++) {
      const an = Math.random() * Math.PI * 2, sp = speed * (0.4 + Math.random());
      parts.push({ x, y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp - speed * 0.3, g, s: size[0] + Math.random() * (size[1] - size[0]), c: colors ? colors[i % colors.length] : color, shape: shapes[i % shapes.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: life * (0.7 + Math.random() * 0.5), max: life * 1.2 });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function slash(x, y, color = "#fff") {
    if (reduce()) return; ensure();
    [-0.6, 0.5].forEach((ang, i) => parts.push({ x, y, vx: 0, vy: 0, g: 0, s: 90, c: i ? color : "#fff", shape: "slash", rot: ang, vr: 0, life: 16, max: 16 }));
    parts.push({ x, y, vx: 0, vy: 0, g: 0, s: 14, c: color, shape: "ring", rot: 0, vr: 0, life: 24, max: 24 });
    if (!raf) raf = requestAnimationFrame(loop);
  }
  const center = (el) => { if (!el) return [innerWidth / 2, innerHeight / 2]; const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  window.FX = { sfx, buzz, burst, slash, center, reduce };
})();
