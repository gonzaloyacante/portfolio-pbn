// Service Worker para Portfolio-PBN
// Versión del cache para control de actualizaciones
const CACHE_NAME = 'portfolio-pbn-v1';

// Recursos a cachear inicialmente
const urlsToCache = [
  '/',
  '/about-me',
  '/contact',
  '/favicon/favicon.ico',
  '/favicon/favicon-16x16.png',
  '/favicon/favicon-32x32.png'
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

// Estrategia: Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Solo interceptamos peticiones GET
  if (event.request.method !== 'GET') return;
  
  // Ignoramos solicitudes a Firebase y otras APIs
  if (
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('cloudinary.com/v1')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Verificar si la respuesta es válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clonar la respuesta porque se consume una vez
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => {
            // Almacenar en cache la nueva respuesta
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, intentamos recuperar del cache
        return caches.match(event.request);
      })
  );
});

// Evento de mensaje para controlar actualizaciones manuales
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
