const CACHE_NAME = 'typhoon-partner-cache-v3';
const urlsToCache = [
    '/manifest.json',
    '/favicon_io/android-chrome-192x192.png',
    '/favicon_io/android-chrome-512x512.png',
    '/favicon_io/apple-touch-icon.png',
    '/favicon_io/favicon-32x32.png',
    '/favicon_io/favicon-16x16.png',
];

self.addEventListener('install', event => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        }),
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
                }),
            );
        }),
    );
    // Claim all clients immediately
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip caching for service worker itself
    if (request.url.includes('service-worker.js')) {
        return;
    }

    // Network-only strategy for API calls and module scripts
    if (
        request.url.includes('/api/') ||
        request.destination === 'script' ||
        request.destination === 'worker'
    ) {
        event.respondWith(fetch(request));
        return;
    }

    // Network-first strategy for CSS and other assets
    if (request.url.includes('/assets/') || request.url.includes('.css')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Only cache successful responses
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(request);
                }),
        );
    } else {
        // Cache-first strategy for static assets (images, fonts, manifest)
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request);
            }),
        );
    }
});
