import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BackToTop = ({ 
  showAfter = 0, // Afficher dès qu'on scroll (0px)
  smooth = true,
  duration = 800,
  className = ''
}) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, 0)
    }
  }

  // Fonction pour vérifier si le bouton doit être visible
  // Visible seulement si on a scrollé (scrollY > 0)
  const toggleVisibility = () => {
    if (window.pageYOffset > showAfter) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Écouter le scroll
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    // Vérifier immédiatement au montage
    toggleVisibility()
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showAfter])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={scrollToTop}
          className={`ubb-focus fixed bottom-5 right-3 z-40 sm:bottom-10 flex h-12 w-12 items-center justify-center rounded-full bg-ubb-accent-500 text-ubb-brand-950 shadow-ubb-md transition-colors duration-200 hover:bg-ubb-accent-600 ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('common.backToTop')}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
