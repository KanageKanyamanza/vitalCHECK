// Utilitaire pour nettoyer le cache et forcer la mise à jour du Service Worker
export const clearCacheAndReload = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Désinscrire tous les service workers
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map(registration => registration.unregister()))
      
      // Nettoyer tous les caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
      }
      
      console.log('Cache nettoyé avec succès')
      
      // Recharger la page
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error)
    }
  }
};

// Forcer la mise à jour du Service Worker
export const forceServiceWorkerUpdate = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.update()
      console.log('Service Worker mis à jour')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du Service Worker:', error)
    }
  }
};

// Vérifier si le Service Worker est à jour
export const checkServiceWorkerVersion = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      const currentVersion = registration.scope.includes('v1.0.1') ? '1.0.1' : 'unknown'
      console.log('Version actuelle du Service Worker:', currentVersion)
      return currentVersion
    } catch (error) {
      console.error('Erreur lors de la vérification de la version:', error)
      return 'unknown'
    }
  }
  return 'not-supported'
};
