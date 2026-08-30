const CACHE_NAME = 'disastermesh-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/styles.css',
  '/src/App.jsx',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});