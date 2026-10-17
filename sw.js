/* Service worker: makes the installed app work offline.
   - App files are precached on install and served cache-first, refreshed in
     the background (a new version shows on the next launch).
   - Google Fonts are cached the first time they load, so every font you have
     used once keeps working offline.
   Bump VERSION whenever any file changes. */
const VERSION = 'v1';
const APP_CACHE = `prisetiketter-app-${VERSION}`;
const FONT_CACHE = 'prisetiketter-fonts';
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('prisetiketter-app-') && k !== APP_CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    // Any navigation inside the app falls back to the app shell.
    const key = request.mode === 'navigate' ? './index.html' : request;
    event.respondWith(staleWhileRevalidate(key, APP_CACHE, request));
  }
});

async function staleWhileRevalidate(key, cacheName, request = key) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(key, { ignoreSearch: true });
  const network = fetch(request)
    .then(response => {
      if (response && (response.ok || response.type === 'opaque')) cache.put(key, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}
