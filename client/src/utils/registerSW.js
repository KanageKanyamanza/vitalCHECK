// Enregistrement du Service Worker pour le PWA
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          
          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouvelle version disponible
                  if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page ?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          // Échec silencieux de l'enregistrement du SW
        });
    });
  }
};

// Fonction pour demander l'autorisation de notification
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Fonction pour afficher une notification
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/android-icon-192x192.png',
      badge: '/android-icon-96x96.png',
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return notification;
  }
};

// Fonction pour installer le PWA (simplifiée - le bouton est maintenant dans le Footer)
export const installPWA = () => {
  // Cette fonction est maintenant simplifiée car le bouton d'installation
  // est géré par le composant InstallPWAButton dans le Footer
  
  // Détecter si l'app est installée
  window.addEventListener('appinstalled', () => {
    // PWA installée avec succès
  });
};
