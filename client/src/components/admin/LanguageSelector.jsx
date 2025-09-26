import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative group">
      {/* Bouton du sélecteur */}
      <button
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        title={t('admin.languageSelector.title', 'Changer de langue')}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden lg:inline text-sm font-medium">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="lg:hidden text-sm">
          {currentLanguage.flag}
        </span>
      </button>

      {/* Menu déroulant */}
      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                i18n.language === language.code 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <Check className="w-4 h-4 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
