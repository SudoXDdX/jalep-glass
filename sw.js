// JALEP Service Worker v3 — cache versioned for auto-invalidation
const CACHE_NAME = "jalep-v3-2026-09-16";
const STATIC_ASSETS = [
  "/jalep-glass/",
  "/jalep-glass/index.html",
  "/jalep-glass/servicos.html",
  "/jalep-glass/sobre.html",
  "/jalep-glass/lab.html",
  "/jalep-glass/contato.html",
  "/jalep-glass/faq.html",
  "/jalep-glass/portfolio.html",
  "/jalep-glass/timeline.html",
  "/jalep-glass/stack.html",
  "/jalep-glass/team.html",
  "/jalep-glass/pricing.html",
  "/jalep-glass/blog.html",
  "/jalep-glass/docs.html",
  "/jalep-glass/changelog.html",
  "/jalep-glass/status.html",
  "/jalep-glass/jalepos.html",
  "/jalep-glass/terminal.html",
  "/jalep-glass/wallpaper.html",
  "/jalep-glass/hardware.html",
  "/jalep-glass/parceiros.html",
  "/jalep-glass/depoimentos.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Activate immediately — don't wait for old SW to die
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  // Take control of all clients immediately
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Never cache API calls or non-GET requests
  if (url.hostname === 'generativelanguage.googleapis.com') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
