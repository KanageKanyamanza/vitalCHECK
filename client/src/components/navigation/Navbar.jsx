import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, User, LayoutDashboard } from 'lucide-react'
import { NavbarLanguageSelector, UserGuideButton } from '../ui'
import { useAssessment } from '../../context/AssessmentContext'
import { useClientAuth } from '../../context/ClientAuthContext'
import logoIcon from '/android-icon-96x96.png'

const Navbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Vérification sécurisée du contexte Assessment
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

  // Client Auth Context
  const { user: clientUser, isAuthenticated } = useClientAuth()
  
  // Admin Auth Context (depuis localStorage)
  const adminToken = localStorage.getItem('adminToken')
  const adminData = localStorage.getItem('adminData')
  const isAdminAuthenticated = !!adminToken

  const handleLanguageChange = (language) => {
    // Mettre à jour la langue dans le contexte global
    if (dispatch) {
      dispatch({ type: 'SET_LANGUAGE', payload: language })
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleDesktopNavigation = (path) => {
    navigate(path)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleSmartLogin = () => {
    // Vérifier si l'utilisateur a déjà un token admin
    const adminToken = localStorage.getItem('adminToken')
    const clientToken = localStorage.getItem('clientToken')
    
    if (adminToken) {
      // Si admin token existe, rediriger vers admin dashboard
      handleDesktopNavigation('/admin/dashboard')
    } else if (clientToken) {
      // Si client token existe, rediriger vers client dashboard
      handleDesktopNavigation('/client/dashboard')
    } else {
      // Aucun token, rediriger vers la page de connexion unifiée
      handleDesktopNavigation('/login')
    }
  }

  const handleSmartLoginMobile = () => {
    // Vérifier si l'utilisateur a déjà un token admin
    const adminToken = localStorage.getItem('adminToken')
    const clientToken = localStorage.getItem('clientToken')
    
    if (adminToken) {
      // Si admin token existe, rediriger vers admin dashboard
      handleNavigation('/admin/dashboard')
    } else if (clientToken) {
      // Si client token existe, rediriger vers client dashboard
      handleNavigation('/client/dashboard')
    } else {
      // Aucun token, rediriger vers la page de connexion unifiée
      handleNavigation('/login')
    }
  }


  const handleNavigation = (path) => {
    navigate(path)
    closeMobileMenu()
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
            <div className="flex items-center cursor-pointer" onClick={() => handleDesktopNavigation('/')}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src={logoIcon} 
                  alt="VitalCHECK Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex ms-1 ">
                <span className="text-[11px] sm:text-md md:text-lg font-display  text-primary-500">
                  Ubuntu Business Builders
                </span>
              </div>
            </div>
          </div>

          {/* Navigation et sélecteur de langue */}
          <div className="flex items-center space-x-6">
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleDesktopNavigation('/')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {t('navigation.home')}
              </button>
              
              <button
                onClick={() => handleDesktopNavigation('/about')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/about') 
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {t('navigation.about')}
              </button>
              
              <button
                onClick={() => handleDesktopNavigation('/blog')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/blog') 
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Blog
              </button>
              
              <button
                onClick={() => handleDesktopNavigation('/pricing')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/pricing') 
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {t('navigation.pricing')}
              </button>
              
              <button
                onClick={() => handleDesktopNavigation('/contact')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/contact') 
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {t('navigation.contact')}
              </button>
              
              {/* Guide d'utilisation */}
              <UserGuideButton variant="navbar" />
              
              {location.pathname === '/assessment' && (
                <button
                  onClick={() => handleDesktopNavigation('/assessment')}
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
                  onClick={() => handleDesktopNavigation('/results')}
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

            {/* Sélecteur de langue - Toujours visible */}
            <NavbarLanguageSelector 
              onLanguageChange={handleLanguageChange}
              isScrolled={true}
            />

            {/* Smart Login/Dashboard Button - Desktop */}
            <div className="hidden md:flex">
              <button
                onClick={handleSmartLogin}
                className="flex items-center space-x-2 px-4 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium"
              >
                {isAdminAuthenticated ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm">Admin Dashboard</span>
                  </>
                ) : isAuthenticated && clientUser ? (
                  <>
                    <User className="w-4 h-4" />
                    <span className="text-sm">{clientUser.firstName || clientUser.companyName || 'Mon Compte'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">{t('navigation.login')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Bouton hamburger mobile */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="px-4 py-4 space-y-3">
                {/* Liens de navigation mobile */}
                <button
                  onClick={() => handleNavigation('/')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {t('navigation.home')}
                </button>
                
                <button
                  onClick={() => handleNavigation('/about')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/about') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {t('navigation.about')}
                </button>
                
                <button
                  onClick={() => handleNavigation('/blog')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/blog') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  Blog
                </button>
                
                <button
                  onClick={() => handleNavigation('/pricing')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/pricing') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {t('navigation.pricing')}
                </button>
                
                <button
                  onClick={() => handleNavigation('/contact')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/contact') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {t('navigation.contact')}
                </button>
                
                {/* Guide d'utilisation mobile */}
                <div className="px-3 py-2">
                  <UserGuideButton variant="default" className="text-gray-600 hover:text-primary-600 transition-colors duration-200" />
                </div>

                {/* Smart Login Button - Mobile */}
                <button
                  onClick={handleSmartLoginMobile}
                  className="w-full text-left px-3 py-2 rounded-lg font-medium border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors duration-200 flex items-center"
                >
                  {isAdminAuthenticated ? (
                    <>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </>
                  ) : isAuthenticated && clientUser ? (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      {clientUser.firstName || clientUser.companyName || 'Mon Compte'}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      {t('navigation.login')}
                    </>
                  )}
                </button>
                
                {location.pathname === '/assessment' && (
                  <button
                    onClick={() => handleNavigation('/assessment')}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isActive('/assessment') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {t('navigation.assessment')}
                  </button>
                )}
                
                {location.pathname === '/results' && (
                  <button
                    onClick={() => handleNavigation('/results')}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isActive('/results') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {t('navigation.results')}
                  </button>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
