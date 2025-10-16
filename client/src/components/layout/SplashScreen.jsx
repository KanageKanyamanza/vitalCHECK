import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SplashScreen = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Simulation du chargement simple
  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Simulation du chargement progressif
        for (let i = 0; i <= 100; i += 2) {
          setLoadingProgress(i)
          await new Promise(resolve => setTimeout(resolve, 50))
        }

        // Délai avant de fermer le splash
        setTimeout(() => {
          setLoading(false)
          onLoadingComplete?.()
        }, 500)

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
            className="flex flex-col items-center"
          >
            <img 
              src="/ms-icon-310x310.png" 
              alt="VitalCHECK Logo" 
              className="w-24 h-24 mb-6 rounded-lg"
            />
            <h1 className="text-2xl font-semibold text-gray-800">
              VitalCHECK
            </h1>
          </motion.div>

          {/* Barre de progression simple */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 w-52 bg-gray-200 rounded-full h-1 overflow-hidden"
          >
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Pourcentage */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-sm text-gray-600"
          >
            {loadingProgress}%
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default SplashScreen
