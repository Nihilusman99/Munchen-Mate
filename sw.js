const CACHE_NAME = 'munchen-mate-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './data/attractions.json',
  './data/clothing.json',
  './data/phrases.json',
  './data/transport.json',
  './images/icon.png'
  // If you have the maps/photos downloaded, add them here too:
  // './images/map_city.jpg',
  // './images/marienplatz.jpg', etc.
];

// 1. Install Event: Cache the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Event: Serve from Cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );

});
