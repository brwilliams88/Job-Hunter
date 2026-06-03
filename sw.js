// Job Hunter service worker — offline shell caching
const CACHE = 'job-hunter-v13';
const ASSETS = [
  './',
  './index.html',
  './appicon.png',
  './manifest.json',
  'https://unpkg.com/vue@3/dist/vue.global.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Never cache API calls (GitHub / OpenAI) — always go to network
  if (e.request.url.includes('api.github.com') || e.request.url.includes('api.openai.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
