const CACHE_NAME = 'vitalCHECK-health-check-v1.0.1';
const urlsToCache = [
  '/',
  '/assessment',
  '/results',
  '/privacy',
  '/terms',
  '/android-icon-192x192.png',
  '/android-icon-144x144.png',
  '/favicon.ico',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Forcer l'activation immédiate
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre le contrôle de tous les clients
      return self.clients.claim();
    })
  );
});

// Interception des requêtes avec stratégie "Network First"
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes vers l'API ou les requêtes POST
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  // Ne pas intercepter les requêtes admin
  if (event.request.url.includes('/admin/')) {
    return;
  }

  // Ne pas intercepter les requêtes de développement Vite ou les schémas non supportés
  if (
    event.request.url.includes('/src/') || 
    event.request.url.includes('/@vite/') || 
    event.request.url.includes('/node_modules/') ||
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier si la réponse est valide
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cloner la réponse pour la mettre en cache
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            try {
              cache.put(event.request, responseToCache);
            } catch (cacheError) {
              console.warn('Service Worker: Erreur lors de la mise en cache:', cacheError);
            }
          });

        return response;
      })
      .catch(() => {
        // En cas d'erreur réseau, retourner depuis le cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Si pas de cache, retourner la page d'accueil
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { notification: { body: event.data.text() } };
    }
  }

  const notification = data.notification || {};
  const options = {
    body: notification.body || 'Nouvelle notification vitalCHECK',
    icon: notification.icon || '/android-icon-192x192.png',
    badge: notification.badge || '/android-icon-96x96.png',
    vibrate: notification.vibrate || [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: notification.data?.url || '/'
    },
    actions: notification.actions && notification.actions.length > 0 ? notification.actions : [
      {
        action: 'explore',
        title: 'Voir les détails',
        icon: '/android-icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/android-icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notification.title || 'vitalCHECK Enterprise Health Check', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  if (event.action !== 'close') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        // Si une fenêtre est déjà ouverte sur l'URL, on la focalise
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon on ouvre une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Gestion des messages pour les mises à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
