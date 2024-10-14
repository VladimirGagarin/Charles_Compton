// Define a cache name
const cacheName = 'Charles-Kihuyu';

// List of assets to cache
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/music2.mp3',
  '/music.mp3',
  '/music3.mp3',
  '/music4.mp3',
  '/male.mp3',
  '/female.mp3',
  '/images/img.jpg',
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/logo.jpg',
  '/images/love.jpg',
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate the service worker and clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Intercept fetch requests and serve cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
