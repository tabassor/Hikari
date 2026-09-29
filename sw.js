/* Service worker : réseau d'abord (mises à jour immédiates quand elle est connectée), cache en secours (hors ligne). */
const CACHE = "hikari-v13";
const SHELL = ["./", "index.html", "manifest.webmanifest", "css/app.css", "css/kaisei-kanji.woff2", "js/gen.js", "js/art.js", "js/fx.js", "js/store.js", "js/app.js",
  "data/programme.js", "data/c-fr.js", "data/c-ma.js", "data/c-hg.js", "data/c-sc.js", "data/c-lv-emc.js", "data/maps.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== "hikari-fonts").map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.hostname.includes("fonts.googleapis.com") || u.hostname.includes("fonts.gstatic.com")) {
    e.respondWith(caches.open("hikari-fonts").then(async (c) => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); c.put(e.request, r.clone()); return r; }).catch(() => new Response("", { status: 504 })));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const r = await fetch(e.request, { cache: "no-cache" });
      if (r.ok) c.put(e.request, r.clone());
      return r;
    } catch (err) {
      return (await c.match(e.request, { ignoreSearch: true })) || (await c.match("index.html")) || new Response("Hors ligne", { status: 503 });
    }
  })());
});
