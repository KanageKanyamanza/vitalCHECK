import { useCallback } from 'react'

const useSmoothScroll = () => {
  // Fonction pour faire défiler vers le haut
  const scrollToTop = useCallback((duration = 800) => {
    const start = window.pageYOffset
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Fonction d'easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      window.scrollTo(0, start * (1 - easeOut))
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }, [])

  // Fonction pour faire défiler vers un élément
  const scrollToElement = useCallback((elementId, offset = 0, duration = 800) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const start = window.pageYOffset
    const target = element.offsetTop - offset
    const distance = target - start
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Fonction d'easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      window.scrollTo(0, start + distance * easeOut)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }, [])

  // Fonction pour faire défiler vers une position spécifique
  const scrollToPosition = useCallback((position, duration = 800) => {
    const start = window.pageYOffset
    const distance = position - start
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Fonction d'easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      window.scrollTo(0, start + distance * easeOut)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }, [])

  return {
    scrollToTop,
    scrollToElement,
    scrollToPosition
  }
}

export default useSmoothScroll
