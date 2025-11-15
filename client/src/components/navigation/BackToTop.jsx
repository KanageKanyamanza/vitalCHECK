import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

const BackToTop = ({ 
  showAfter = 300, // Afficher après 300px de scroll
  smooth = true,
  duration = 800,
  className = ''
}) => {
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
          className={`fixed sm:bottom-10 bottom-24 right-3 z-50 bg-accent-500 text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-accent-200 ${className}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
