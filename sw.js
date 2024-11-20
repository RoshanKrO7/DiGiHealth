const CACHE_NAME = 'diGiHealth-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/view-reports.html',
    '/add-report.html',
    '/delete-report.html',
    '/update-report.html',
    '/dashboardstyle.css',
    '/main.js',
    '/dashboard.js',
    '/menuHandlers.js',
    '/utils.js',
    'https://kit.fontawesome.com/8805295f1b.js',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
