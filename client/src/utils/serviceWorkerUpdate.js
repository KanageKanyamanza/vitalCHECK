// Utilitaire pour gérer les mises à jour du Service Worker
export const updateServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Vérifier s'il y a une mise à jour disponible
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              console.log('Nouvelle version du Service Worker disponible');
              
              // Notifier l'utilisateur ou forcer la mise à jour
              if (window.confirm('Une nouvelle version de l\'application est disponible. Voulez-vous la charger maintenant ?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          }
        });
      });
    });
  }
};

// Forcer la mise à jour du Service Worker
export const forceServiceWorkerUpdate = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
};

// Vérifier et corriger les erreurs du Service Worker
export const checkServiceWorkerErrors = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('error', (event) => {
      console.error('Erreur Service Worker:', event.error);
      
      // Si c'est l'erreur de cache POST, forcer la mise à jour
      if (event.error && event.error.message.includes('Request method \'POST\' is unsupported')) {
        console.log('Correction de l\'erreur de cache POST...');
        forceServiceWorkerUpdate();
      }
    });
  }
};
