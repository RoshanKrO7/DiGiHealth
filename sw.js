const CACHE_NAME = 'digihealth-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon_io/android-chrome-192x192.png',
  '/favicon_io/android-chrome-512x512.png'
];

// Install Event: Cache resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Event: Remove old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event: Serve cached files or fetch from network
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Optional: Add a fallback for offline (e.g., /offline.html)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html'); // Fallback for navigation requests
        }
      });
    })
  );
});
