/* Service worker : l'application fonctionne hors ligne. Incrémenter VERSION à chaque mise à jour du contenu. */
const VERSION = "hikari-2026-09-28d";
const SHELL = ["./", "index.html", "manifest.webmanifest", "css/app.css", "js/gen.js", "js/art.js", "js/fx.js", "css/kaisei-kanji.woff2", "js/store.js", "js/app.js",
  "data/programme.js", "data/c-fr.js", "data/c-ma.js", "data/c-hg.js", "data/c-sc.js", "data/c-lv-emc.js", "data/maps.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== "hikari-fonts").map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.hostname.includes("fonts.googleapis.com") || u.hostname.includes("fonts.gstatic.com")) {
    e.respondWith(caches.open("hikari-fonts").then(async (c) => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); c.put(e.request, r.clone()); return r; }).catch(() => new Response("", { status: 504 })));
    return;
  }
  if (u.origin === location.origin) e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)));
});
