import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle } from 'lucide-react'
import bgHero from '../../assets/bg-hero.png'

const Hero = ({ onStartAssessment }) => {
  const { t } = useTranslation()

  return (
    <div 
    // className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center pt-16"
    className="min-h-screen bg-white relative flex items-center pt-16 overflow-hidden"

    // style={{ backgroundImage: `url(${bgHero})` }}
    >
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 sm:py-16 relative z-10 w-full">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:text-7xl text-6xl font-display font-bold mb-6"
          >
            <span className="text-accent-500 md:text-8xl">{t('landing.title1')}</span>
            <br />
            <span className="text-primary-500 ml-4">{t('landing.title2')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-3xl text-black mb-4 max-w-3xl px-2 mx-auto font-semibold"
          >
            {t('landing.subtitle1')}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-2xl text-gray-600 mb-8 max-w-3xl px-2 mx-auto"
            dangerouslySetInnerHTML={{ __html: t('landing.subtitle2') }}
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-2 text-sm text-black mb-12"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className='uppercase'>{t('landing.badge')}</span>
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
