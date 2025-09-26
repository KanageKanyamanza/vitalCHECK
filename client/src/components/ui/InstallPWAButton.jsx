import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Check } from 'lucide-react'

const InstallPWAButton = () => {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      // Vérifier si l'app est en mode standalone (installée)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setShowButton(false)
        return
      }

      // Vérifier si l'app est installée via d'autres moyens
      if (window.navigator.standalone === true) {
        setIsInstalled(true)
        setShowButton(false)
        return
      }

      // Vérifier si l'app est dans la liste des apps installées
      if ('getInstalledRelatedApps' in navigator) {
        navigator.getInstalledRelatedApps().then((relatedApps) => {
          if (relatedApps.length > 0) {
            setIsInstalled(true)
            setShowButton(false)
          }
        })
      }
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Empêcher l'affichage automatique du prompt
      e.preventDefault()
      // Stocker l'événement pour l'afficher plus tard
      setDeferredPrompt(e)
      setShowButton(true)
    }

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      console.log('PWA installée avec succès')
      setIsInstalled(true)
      setShowButton(false)
      setDeferredPrompt(null)
    }

    // Vérifier l'état initial
    checkIfInstalled()

    // Ajouter les écouteurs d'événements
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Afficher le prompt d'installation
      deferredPrompt.prompt()

      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('L\'utilisateur a accepté l\'installation')
        setIsInstalled(true)
        setShowButton(false)
      } else {
        console.log('L\'utilisateur a refusé l\'installation')
      }

      // Nettoyer la référence
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error)
    }
  }

  // Ne pas afficher le bouton si l'app est déjà installée ou si le prompt n'est pas disponible
  if (isInstalled || !showButton || !deferredPrompt) {
    return null
  }

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
      aria-label={t('pwa.installButton.ariaLabel', 'Installer l\'application VitalCheck')}
    >
      <Download className="w-4 h-4" />
      <span>{t('pwa.installButton.text', 'Installer l\'app')}</span>
    </button>
  )
}

export default InstallPWAButton
