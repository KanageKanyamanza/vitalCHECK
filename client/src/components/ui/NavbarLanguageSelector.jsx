import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'

const LANGUAGE_CODES = ['fr', 'en']

/**
 * Sélecteur de langue de l'en-tête.
 * - variant "dropdown" (desktop) : bouton + liste déroulante
 * - variant "segmented" (menu mobile) : deux boutons côte à côte
 */
const NavbarLanguageSelector = ({ onLanguageChange, className = '', variant = 'dropdown' }) => {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const currentLanguage = (i18n.language || 'fr').slice(0, 2)

  const handleLanguageSelect = async (languageCode) => {
    setIsOpen(false)
    await i18n.changeLanguage(languageCode)
    if (onLanguageChange) {
      onLanguageChange(languageCode)
    }
  }

  // Fermer la liste au clic extérieur ou avec Échap
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false)
    }
    const handleKey = (e) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label={t('navigation.language')}
        className={`inline-flex rounded-full bg-ubb-brand-50 p-1 ${className}`}
      >
        {LANGUAGE_CODES.map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => handleLanguageSelect(code)}
            aria-pressed={code === currentLanguage}
            className={`ubb-focus min-h-[44px] rounded-full px-4 font-text text-sm font-semibold transition-colors ${
              code === currentLanguage
                ? 'bg-ubb-brand-900 text-white'
                : 'text-ubb-ink hover:bg-white'
            }`}
          >
            {t(`languages.${code}`)}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('navigation.language')}
        className="ubb-focus inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 font-text text-sm font-semibold uppercase text-ubb-ink hover:bg-ubb-brand-50"
      >
        {currentLanguage}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-20 mt-2 min-w-[150px] overflow-hidden rounded-ubb-field border border-ubb-brand-900/10 bg-white py-1 shadow-ubb-md"
          >
            {LANGUAGE_CODES.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  lang={code}
                  onClick={() => handleLanguageSelect(code)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left font-text text-sm hover:bg-ubb-brand-50 focus:bg-ubb-brand-50 focus:outline-none ${
                    code === currentLanguage ? 'font-semibold text-ubb-ink' : 'text-ubb-ink-muted'
                  }`}
                >
                  {t(`languages.${code}`)}
                  {code === currentLanguage && (
                    <Check className="h-4 w-4 text-ubb-accent-ink" aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavbarLanguageSelector
