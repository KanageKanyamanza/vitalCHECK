import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'


const SplashScreen = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true)

  // Simulation du chargement avec ping-pong
  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Ping-pong avec le backend avec timeout
        const pingBackend = async (timeoutMs = 3000) => {
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/ping`, {
              signal: controller.signal
            })
            
            clearTimeout(timeoutId)
            return response.ok
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log('Backend ping timeout, continuing...')
            } else {
              console.log('Backend not ready, continuing...')
            }
            return false
          }
        }

        // Délai minimum de 1 seconde
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Tentative de ping du backend
        console.log('Tentative de connexion au backend...')
        const backendReady = await pingBackend(3000)
        
        if (backendReady) {
          console.log('Backend connecté avec succès')
        } else {
          console.log('Backend non disponible, démarrage sans connexion')
        }

        // Délai supplémentaire pour que l'utilisateur voie le splash
        await new Promise(resolve => setTimeout(resolve, 2000))

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
            className="absolute bottom-8 w-full flex items-center content-center justify-center"
          >
            <h1 className="text-2xl text-center text-primary-500 font-semibold">
              VitalCHECK
              <br />
              <span className="text-sm text-gray-500">Enterprise Health Check</span>
            </h1>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default SplashScreen
