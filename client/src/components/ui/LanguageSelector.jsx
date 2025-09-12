import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'

const LanguageSelector = ({ onLanguageChange, selectedLanguage = 'fr', className = '' }) => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
    { code: 'fr', name: t('languages.fr'), flag: '🇫🇷' }
  ]

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  const handleLanguageSelect = async (languageCode) => {
    setIsOpen(false)
    
    // Change i18n language
    await i18n.changeLanguage(languageCode)
    
    // Notify parent component
    if (onLanguageChange) {
      onLanguageChange(languageCode)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 bg-white"
      >
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {selectedLang.flag} {selectedLang.name}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
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
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    language.code === selectedLanguage ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {language.name}
                    </span>
                  </div>
                  {language.code === selectedLanguage && (
                    <Check className="w-4 h-4 text-primary-500" />
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

export default LanguageSelector
