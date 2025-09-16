import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Target,
  Users,
  DollarSign,
  Building2,
  Briefcase,
  Zap
} from 'lucide-react'
import { UBBLogo } from '../ui'

const SplashScreen = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [fallingElements, setFallingElements] = useState([])

  // Configuration des éléments graphiques
  const chartElements = [
    { icon: BarChart3, color: '#3B82F6', size: 'w-8 h-8', delay: 0 },
    { icon: PieChart, color: '#10B981', size: 'w-6 h-6', delay: 0.5 },
    { icon: TrendingUp, color: '#F59E0B', size: 'w-10 h-10', delay: 1 },
    { icon: Activity, color: '#EF4444', size: 'w-7 h-7', delay: 1.5 },
    { icon: Target, color: '#8B5CF6', size: 'w-9 h-9', delay: 2 },
    { icon: Users, color: '#06B6D4', size: 'w-8 h-8', delay: 2.5 },
    { icon: DollarSign, color: '#84CC16', size: 'w-6 h-6', delay: 3 },
    { icon: Building2, color: '#F97316', size: 'w-10 h-10', delay: 3.5 },
    { icon: Briefcase, color: '#EC4899', size: 'w-7 h-7', delay: 4 },
    { icon: Zap, color: '#F59E0B', size: 'w-8 h-8', delay: 4.5 }
  ]

  // Fonction pour créer un nouvel élément qui tombe
  const createFallingElement = (element, index) => {
    const newElement = {
      id: Date.now() + index,
      ...element,
      x: Math.random() * (window.innerWidth - 100),
      y: -50,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    }
    return newElement
  }

  // Fonction pour faire tomber les éléments
  const animateFallingElements = () => {
    const interval = setInterval(() => {
      if (fallingElements.length < 20) { // Limite le nombre d'éléments
        const randomElement = chartElements[Math.floor(Math.random() * chartElements.length)]
        const newElement = createFallingElement(randomElement, fallingElements.length)
        
        setFallingElements(prev => [...prev, newElement])
      }
    }, 800)

    return interval
  }

  // Animation de chute des éléments
  useEffect(() => {
    const interval = animateFallingElements()
    
    // Animation de chute
    const fallInterval = setInterval(() => {
      setFallingElements(prev => 
        prev.map(element => ({
          ...element,
          y: element.y + 3 + Math.random() * 2, // Vitesse de chute variable
          rotation: element.rotation + 2
        })).filter(element => element.y < window.innerHeight + 100) // Supprimer les éléments hors écran
      )
    }, 50)

    return () => {
      clearInterval(interval)
      clearInterval(fallInterval)
    }
  }, [fallingElements.length])

  // Simulation du chargement avec ping-pong et timeout
  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Ping-pong avec le backend avec timeout
        const pingBackend = async (timeoutMs = 5000) => {
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

        // Simulation du chargement progressif
        for (let i = 0; i <= 100; i += 2) {
          setLoadingProgress(i)
          
          // Ping le backend toutes les 20% avec timeout de 1 seconde
          if (i % 20 === 0) {
            await pingBackend(1000)
          }
          
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // Tentative finale avec timeout de 5 secondes maximum
        console.log('Tentative finale de connexion au backend...')
        const backendReady = await pingBackend(5000)
        
        if (backendReady) {
          console.log('Backend connecté avec succès')
        } else {
          console.log('Backend non disponible, démarrage sans connexion')
        }

        setLoading(false)
        setTimeout(() => {
          onLoadingComplete?.()
        }, 1000)

      } catch (error) {
        console.error('Loading error:', error)
        setLoading(false)
        onLoadingComplete?.()
      }
    }

    simulateLoading()
  }, [onLoadingComplete])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden"
        >
          {/* Éléments qui tombent */}
          <div className="absolute inset-0 pointer-events-none">
            {fallingElements.map((element) => {
              const IconComponent = element.icon
              return (
                <motion.div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: element.x,
                    top: element.y,
                    transform: `rotate(${element.rotation}deg) scale(${element.scale})`
                  }}
                  initial={{ opacity: 0.8 }}
                  animate={{ 
                    opacity: [0.8, 1, 0.6],
                    scale: [element.scale, element.scale * 1.1, element.scale * 0.9]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  <IconComponent 
                    className={`${element.size} text-opacity-60`}
                    style={{ color: element.color }}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Montagne d'éléments accumulés */}
          <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
            {fallingElements
              .filter(element => element.y > window.innerHeight - 200)
              .map((element, index) => {
                const IconComponent = element.icon
                return (
                  <motion.div
                    key={`mountain-${element.id}`}
                    className="absolute bottom-0"
                    style={{
                      left: element.x,
                      opacity: 0.3
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: element.scale * 0.7 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IconComponent 
                      className={`${element.size} text-opacity-40`}
                      style={{ color: element.color }}
                    />
                  </motion.div>
                )
              })}
          </div>

          {/* Contenu principal */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            {/* Logo UBB */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <UBBLogo 
                size="large" 
                showText={true} 
                animated={true}
              />
            </motion.div>

            {/* Barre de progression */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "300px", opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-80 bg-gray-200 rounded-full h-2 mb-4 overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Texte de chargement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-600 font-medium">
                {loadingProgress < 30 ? "Initialisation..." :
                 loadingProgress < 60 ? "Chargement des données..." :
                 loadingProgress < 90 ? "Préparation de l'évaluation..." :
                 "Finalisation..."}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {loadingProgress}%
              </p>
            </motion.div>

            {/* Animation de points */}
            <motion.div
              className="flex space-x-1 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-accent-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Effet de particules en arrière-plan */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-500 rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen
