import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle } from 'lucide-react'
import bgHero from '../assets/bg-hero.png'

const Hero = ({ onStartAssessment }) => {
  const { t } = useTranslation()

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center pt-16"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 sm:py-16 relative z-10 w-full">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl md:text-6xl font-display font-bold ubb-gradient-text mb-6"
          >
            {t('landing.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white mb-8 max-w-3xl px-2 mx-auto"
            dangerouslySetInnerHTML={{ __html: t('landing.subtitle') }}
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-2 text-sm text-white/90 mb-12"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>{t('landing.badge')}</span>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={onStartAssessment}
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm md:text-lg px-6 md:px-12 py-3 md:py-4 rounded-lg flex items-center space-x-2 md:space-x-3 mx-auto transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="hidden md:inline">{t('landing.form.startButton')}</span>
              <span className="md:hidden">{t('landing.form.startButtonShort')}</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero
