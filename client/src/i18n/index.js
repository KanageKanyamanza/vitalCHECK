import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: import.meta.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true,
      convertDetectedLanguage: (lng) => {
        // Convertir les codes de langue détectés vers nos codes supportés
        if (lng && typeof lng === 'string' && lng.startsWith('en')) return 'en'
        if (lng && typeof lng === 'string' && lng.startsWith('fr')) return 'fr'
        return 'fr' // Fallback par défaut
      }
    },

    supportedLngs: ['fr', 'en'],
    nonExplicitSupportedLngs: false,

    interpolation: {
      escapeValue: false
    }
  });

// Forcer la langue par défaut si aucune n'est détectée
if (!i18n.language || !['fr', 'en'].includes(i18n.language)) {
  i18n.changeLanguage('fr')
}

export default i18n;
