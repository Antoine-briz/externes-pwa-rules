// sw.js — Service Worker

const CACHE_NAME = 'livret-pwa-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/libs/pdf.min.js',         // Assurez-vous que pdf.js est mis en cache
  '/libs/pdf.worker.min.js',   // Assurez-vous d'inclure le worker
  '/img/couverture.png',
  '/img/echographie.png',
  '/img/ventilation.png',
  '/img/bacterio.png',
  '/img/dialyse.png',
  '/img/eeg.png',
  '/img/systeme.png',
  '/img/medicaments.png',
  '/img/titre.png',
  '/pdf/echographie.pdf',
  '/pdf/ventilation.pdf',
  '/pdf/bacterio.pdf',
  '/pdf/dialyse.pdf',
  '/pdf/eeg.pdf',
  '/pdf/systeme.pdf',
  '/pdf/medicaments.pdf',
  '/pdf/tablemetiere.pdf',
  '/pdf/tableabrev.pdf',
  // Ajoutez tous les autres fichiers PDF nécessaires ici
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Ajout des fichiers au cache:', FILES_TO_CACHE);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activation du service worker
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

// Gestion des requêtes fetch (pour servir depuis le cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Ressource récupérée depuis le cache:", event.request.url);  // Log pour vérifier la récupération depuis le cache
        return cachedResponse;  // Retourner la ressource depuis le cache
      }

      console.log("Ressource récupérée via le réseau:", event.request.url);
      return fetch(event.request).catch(() => {
        // Si la ressource n'est pas disponible en ligne, afficher une page de secours
        if (event.request.url.includes(".pdf")) {
          // Assurez-vous que vous avez bien un fichier offline.pdf dans /pdf/ 
          return caches.match('/offline.pdf');  // Ressource PDF de secours
        }
        return caches.match('/offline.html');  // Ressource HTML de secours
      });
    })
  );
});
