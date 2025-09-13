import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NavbarLanguageSelector } from '../ui'
import { useAssessment } from '../../context/AssessmentContext'
import logoIcon from '/icons/android-icon-96x96.png'

const Navbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  // Vérification sécurisée du contexte
  let state, dispatch
  try {
    const context = useAssessment()
    state = context
    dispatch = context.dispatch
  } catch (error) {
    console.warn('AssessmentContext not available in Navbar:', error.message)
    state = { language: 'fr' }
    dispatch = () => {}
  }

  const handleLanguageChange = (language) => {
    // Mettre à jour la langue dans le contexte global
    if (dispatch) {
      dispatch({ type: 'SET_LANGUAGE', payload: language })
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  // Plus de transparence - background solide

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          bg-white shadow-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src={logoIcon} 
                  alt="UBB Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* <div className="flex flex-col">
                <span className="text-lg font-display font-bold ubb-gradient-text">
                  UBB
                </span>
                <span className="text-xs font-medium text-gray-600">
                  Enterprise Health Check
                </span>
              </div> */}
            </div>
          </div>

          {/* Navigation et sélecteur de langue */}
          <div className="flex items-center space-x-6">
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {t('navigation.home')}
              </button>
              
              {location.pathname === '/assessment' && (
                <button
                  onClick={() => navigate('/assessment')}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/assessment') 
                      ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {t('navigation.assessment')}
                </button>
              )}
              
              {location.pathname === '/results' && (
                <button
                  onClick={() => navigate('/results')}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/results') 
                      ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {t('navigation.results')}
                </button>
              )}
            </div>

            {/* Sélecteur de langue */}
            <NavbarLanguageSelector 
              onLanguageChange={handleLanguageChange}
              selectedLanguage={state?.language || 'fr'}
              isScrolled={true}
            />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
