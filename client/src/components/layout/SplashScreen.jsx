import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SplashScreen = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true)

  // Simulation du chargement simple
  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Délai simple de 2 secondes
        await new Promise(resolve => setTimeout(resolve, 3000))

        setLoading(false)
        onLoadingComplete?.()

      } catch (error) {
        console.error('Loading error:', error)
        setLoading(false)
        onLoadingComplete?.()
      }
    }

    simulateLoading()
  }, [onLoadingComplete])

  return (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
        >
          {/* Logo au centre */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <img 
              src="/ms-icon-310x310.png" 
              alt="VitalCHECK Logo" 
              className="w-24 h-24 rounded-lg"
            />
          </motion.div>

          {/* Texte en bas de l'écran */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <h1 className="text-2xl font-semibold text-gray-800">
              VitalCHECK
            </h1>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default SplashScreen
