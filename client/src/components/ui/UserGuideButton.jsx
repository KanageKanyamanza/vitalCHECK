import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, BookOpen, FileText } from 'lucide-react';

const GUIDE_FILE = 'vitalCHECK_Guide_Utilisateur_Vert.docx';

const UserGuideButton = ({ variant = 'default', className = '' }) => {
  const { t } = useTranslation();

  const handleDownloadGuide = () => {
    const link = document.createElement('a');
    link.href = `/${GUIDE_FILE}`;
    link.download = GUIDE_FILE;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      case 'footer':  return <FileText className="w-4 h-4" />;
      case 'navbar':  return <BookOpen className="w-4 h-4" />;
      case 'button':  return <Download className="w-4 h-4" />;
      default:        return <FileText className="w-4 h-4" />;
    }
  };

  const getText = () => {
    if (variant === 'footer')  return t('footer.userGuide', "Guide d'utilisation");
    if (variant === 'navbar')  return t('navigation.userGuide', 'Guide');
    if (variant === 'button')  return t('common.downloadGuide', 'Télécharger le guide');
    return t('common.userGuide', "Guide d'utilisation");
  };

  const btnTitle = t('common.downloadUserGuide', "Télécharger le guide d'utilisation");

  if (variant === 'footer') {
    return (
      <button onClick={handleDownloadGuide} className={`${getVariantClasses()} ${className}`} title={btnTitle}>
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span>{getText()}</span>
        </div>
      </button>
    );
  }

  if (variant === 'navbar') {
    return (
      <button onClick={handleDownloadGuide} className={`${getVariantClasses()} ${className}`} title={btnTitle}>
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="hidden sm:inline">{getText()}</span>
        </div>
      </button>
    );
  }

  return (
    <button onClick={handleDownloadGuide} className={`${getVariantClasses()} ${className}`} title={btnTitle}>
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
};

export default UserGuideButton;
