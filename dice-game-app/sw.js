// Bump this on every change to any file in FILES_TO_CACHE (app.js especially) - this is a
// cache-first SW, so without a version bump returning users (and even fresh Play Store
// updates - the WebView's Cache Storage survives an app update, not just a reinstall)
// keep running the OLD cached JS indefinitely, silently.
const CACHE_NAME = 'dice-game-v15';
const FILES_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './scoring.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
