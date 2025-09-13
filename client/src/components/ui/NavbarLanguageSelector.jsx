import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

const NavbarLanguageSelector = ({ onLanguageChange, selectedLanguage = 'fr', className = '', isScrolled = false }) => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇬🇧' },
    { code: 'fr', name: t('languages.fr'), flag: '🇫🇷' }
  ]

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  const handleLanguageSelect = async (languageCode) => {
    setIsOpen(false)
    
    // Change i18n language first
    await i18n.changeLanguage(languageCode)
    
    // Then notify parent component to update global state
    if (onLanguageChange) {
      onLanguageChange(languageCode)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isScrolled 
            ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' 
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="text-lg">{selectedLang.flag}</span>
        <span className="hidden sm:block">{selectedLang.name}</span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${
                    language.code === selectedLanguage ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {language.code === selectedLanguage && (
                    <Check className="w-3 h-3 text-primary-500" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavbarLanguageSelector
