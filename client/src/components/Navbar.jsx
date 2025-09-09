import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import NavbarLanguageSelector from './NavbarLanguageSelector'
import { useAssessment } from '../context/AssessmentContext'

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

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                UBB Enterprise Health Check
              </span>
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
            />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
