import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, BookOpen, FileText } from 'lucide-react';

const UserGuideButton = ({ variant = 'default', className = '' }) => {
  const { t, i18n } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadGuide = async () => {
    setIsDownloading(true);
    
    try {
      // Choisir le guide selon la langue
      const guidePath = i18n.language === 'fr' ? '/UBB_EHC_Guide_Client.html' : '/UBB_EHC_Guide_Client_EN.html';
      
      // Ouvrir le guide dans une nouvelle fenêtre
      const newWindow = window.open(guidePath, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      
      if (newWindow) {
        newWindow.focus();
        
        // Attendre que la page se charge, puis déclencher l'impression
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.print();
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du guide:', error);
      // Fallback : ouvrir directement le fichier HTML
      const guidePath = i18n.language === 'fr' ? '/UBB_EHC_Guide_Client.html' : '/UBB_EHC_Guide_Client_EN.html';
      window.open(guidePath, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'footer':
        return 'text-white hover:text-gray-200 transition-colors duration-200 text-left';
      case 'navbar':
        return 'text-gray-600 hover:text-primary-600 transition-colors duration-200';
      case 'button':
        return 'bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center space-x-2';
      default:
        return 'text-primary-600 hover:text-primary-700 transition-colors duration-200 flex items-center space-x-2';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'footer':
        return <FileText className="w-4 h-4" />;
      case 'navbar':
        return <BookOpen className="w-4 h-4" />;
      case 'button':
        return isDownloading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Download className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getText = () => {
    if (variant === 'footer') {
      return t('footer.userGuide', 'Guide d\'utilisation');
    } else if (variant === 'navbar') {
      return t('navigation.userGuide', 'Guide');
    } else if (variant === 'button') {
      return isDownloading ? t('common.downloading', 'Téléchargement...') : t('common.downloadGuide', 'Télécharger le guide');
    } else {
      return t('common.userGuide', 'Guide d\'utilisation');
    }
  };

  if (variant === 'footer') {
    return (
      <button
        onClick={handleDownloadGuide}
        disabled={isDownloading}
        className={`${getVariantClasses()} ${className}`}
        title={t('common.downloadUserGuide', 'Télécharger le guide d\'utilisation en PDF')}
      >
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span>{getText()}</span>
        </div>
      </button>
    );
  }

  if (variant === 'navbar') {
    return (
      <button
        onClick={handleDownloadGuide}
        disabled={isDownloading}
        className={`${getVariantClasses()} ${className}`}
        title={t('common.downloadUserGuide', 'Télécharger le guide d\'utilisation en PDF')}
      >
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="hidden sm:inline">{getText()}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownloadGuide}
      disabled={isDownloading}
      className={`${getVariantClasses()} ${className}`}
      title={t('common.downloadUserGuide', 'Télécharger le guide d\'utilisation en PDF')}
    >
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
};

export default UserGuideButton;
