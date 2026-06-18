const CACHE_NAME = 'alex-tracker-v8';

// Instantly kill the old service worker when a new one is found
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

// Instantly take control of the app
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); 
});

// Network-first strategy for the HTML file so you never get stuck again
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
