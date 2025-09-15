import { useState, useEffect } from 'react'

export const usePWAUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)
        
        // Écouter les mises à jour du service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                setUpdateAvailable(true)
              }
            })
          }
        })
      })

      // Écouter les changements de contrôle du service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })

      // Écouter les erreurs du service worker
      navigator.serviceWorker.addEventListener('error', (event) => {
        console.error('Erreur Service Worker:', event.error)
        
        // Si c'est l'erreur de cache POST, forcer la mise à jour
        if (event.error && event.error.message.includes('Request method \'POST\' is unsupported')) {
          console.log('Correction de l\'erreur de cache POST...')
          reg.update()
        }
      })
    }
  }, [])

  const updateApp = () => {
    if (registration && registration.waiting) {
      // Demander au service worker d'installer la nouvelle version
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  const checkForUpdate = () => {
    if (registration) {
      registration.update()
    }
  }

  return {
    updateAvailable,
    updateApp,
    checkForUpdate
  }
}
