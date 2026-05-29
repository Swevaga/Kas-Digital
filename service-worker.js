// ==============================
// # SERVICE WORKER CONFIG
// ==============================
const CACHE_NAME = 'kas-digital-v1';
const urlsToCache = [
    '.',
    'index.html',
    'styles.css',
    'app.js',
    'manifest.json'
];

// ==============================
// # INSTALL EVENT
// ==============================
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// ==============================
// # FETCH EVENT
// ==============================
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// ==============================
// # ACTIVATE EVENT
// ==============================
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});
