// Service Worker para Portfolio-PBN
// Versión del cache para control de actualizaciones
const CACHE_NAME = 'portfolio-pbn-v3';

// Recursos a cachear inicialmente
const urlsToCache = [
  '/',
  '/about-me',
  '/contact',
  '/favicon/favicon.ico',
  '/favicon/favicon-16x16.png',
  '/favicon/favicon-32x32.png',
  '/offline.html',
];

// Instalación del service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  // Esperar hasta que el caché esté listo
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  
  // Limpiar caches anteriores
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Limpiando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategias
// - Navegaciones (HTML): NetworkFirst con fallback a caché y luego offline.html
// - Estáticos (CSS/JS/Imágenes/Fuentes): StaleWhileRevalidate
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;
  const url = new URL(request.url);

  // Ignorar APIs dinámicas o de terceros sensibles
  if (
    url.origin.includes('firestore.googleapis.com') ||
    url.origin.includes('googleapis.com') ||
    url.href.includes('cloudinary.com/v1')
  ) {
    return;
  }

  // Navegaciones (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match('/offline.html');
          return offline || new Response('Offline', { status: 503, statusText: 'Offline' });
        }
      })()
    );
    return;
  }

  // Estáticos: Stale-While-Revalidate
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkPromise;
      })()
    );
    return;
  }

  // Por defecto: intentar red, si falla ir a caché
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Evento de mensaje para controlar actualizaciones manuales
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
