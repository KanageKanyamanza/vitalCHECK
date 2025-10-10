import { useState, useEffect, useCallback } from 'react'
import { blogApiService } from '../services/api'

export const useBlogVisitorModal = (blogId, blogTitle, blogSlug) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReturningVisitor, setIsReturningVisitor] = useState(false)
  const [visitorData, setVisitorData] = useState(null)
  const [hasShownModal, setHasShownModal] = useState(false)
  const [scrollPercentage, setScrollPercentage] = useState(0)

  // Fonction pour calculer le pourcentage de scroll
  const calculateScrollPercentage = useCallback(() => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100
    return Math.min(Math.max(scrollPercent, 0), 100)
  }, [])

  // Fonction pour vérifier si un visiteur existe déjà
  const checkExistingVisitor = useCallback(async () => {
    try {
      const response = await blogApiService.checkVisitorByIP()
      if (response.data.exists) {
        setIsReturningVisitor(true)
        setVisitorData(response.data.visitor)
        return { isReturning: true, visitor: response.data.visitor }
      }
      return { isReturning: false, visitor: null }
    } catch (error) {
      console.error('Erreur lors de la vérification du visiteur:', error)
      return { isReturning: false, visitor: null }
    }
  }, [])

  // Fonction pour soumettre le formulaire
  const handleFormSubmit = useCallback(async (formData) => {
    try {
      // Récupérer les métriques actuelles du tracking service
      const trackingMetrics = window.trackingService?.getMetrics() || null
      
      // Ajouter les données de tracking au formulaire
      const formDataWithTracking = {
        ...formData,
        scrollDepth: trackingMetrics?.scrollDepth || 0,
        timeOnPage: trackingMetrics?.timeOnPage || 0
      }
      
      console.log('📊 [BLOG MODAL] Soumission avec données de tracking:', {
        formData: formDataWithTracking,
        trackingMetrics
      })
      
      const response = await blogApiService.submitVisitorForm(formDataWithTracking)
      
      if (response.data.isNewVisitor) {
        setIsReturningVisitor(false)
        setVisitorData(null)
      } else {
        setIsReturningVisitor(true)
        setVisitorData(response.data.visitor)
      }
      
      return response.data
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error)
      throw error
    }
  }, [])

  // Fonction pour ouvrir la modale
  const openModal = useCallback(async () => {
    if (hasShownModal) return
    
    // Validation : Ne pas continuer si les données du blog sont manquantes
    if (!blogId || !blogTitle || !blogSlug) {
      console.warn('⚠️ [BLOG MODAL] Données du blog manquantes, annulation', {
        blogId,
        blogTitle,
        blogSlug
      })
      return
    }
    
    setHasShownModal(true)
    
    // Vérifier si c'est un visiteur de retour
    const { isReturning, visitor } = await checkExistingVisitor()
    
    // Si c'est un visiteur de retour, soumettre automatiquement SANS afficher le modal
    if (isReturning && visitor) {
      try {
        // Récupérer les métriques actuelles du tracking service
        const trackingMetrics = window.trackingService?.getMetrics() || null
        
        console.log('👋 [BLOG MODAL] Visiteur de retour détecté - Soumission automatique', {
          email: visitor.email,
          blogTitle
        })
        
        await blogApiService.submitVisitorForm({
          firstName: visitor.firstName,
          lastName: visitor.lastName,
          email: visitor.email,
          country: visitor.country,
          blogId,
          blogTitle,
          blogSlug,
          scrollDepth: trackingMetrics?.scrollDepth || 0,
          timeOnPage: trackingMetrics?.timeOnPage || 0
        })
        
        console.log('✅ [BLOG MODAL] Vue comptabilisée pour visiteur de retour')
        
        // NE PAS ouvrir le modal pour les visiteurs de retour
        return
      } catch (error) {
        console.error('❌ [BLOG MODAL] Erreur lors de la soumission automatique:', error)
      }
    }
    
    // Ouvrir le modal UNIQUEMENT pour les nouveaux visiteurs
    setIsModalOpen(true)
  }, [hasShownModal, checkExistingVisitor, blogId, blogTitle, blogSlug])

  // Fonction pour fermer la modale
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPercent = calculateScrollPercentage()
      setScrollPercentage(currentScrollPercent)
      
      // Ouvrir la modale à 10% de scroll pour s'assurer qu'elle soit vue
      if (currentScrollPercent >= 10 && !hasShownModal) {
        openModal()
      }
    }

    // Ajouter l'écouteur de scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [calculateScrollPercentage, hasShownModal, openModal])

  // Effet pour vérifier le visiteur au chargement de la page
  useEffect(() => {
    const checkVisitor = async () => {
      await checkExistingVisitor()
    }
    
    checkVisitor()
  }, [checkExistingVisitor])

  // Effet pour ouvrir automatiquement le modal après 30 secondes si pas encore ouvert
  useEffect(() => {
    if (!hasShownModal) {
      const timer = setTimeout(() => {
        openModal()
      }, 30000) // 30 secondes

      return () => clearTimeout(timer)
    }
  }, [hasShownModal, openModal])

  return {
    isModalOpen,
    isReturningVisitor,
    visitorData,
    scrollPercentage,
    hasShownModal,
    openModal,
    closeModal,
    handleFormSubmit
  }
}
