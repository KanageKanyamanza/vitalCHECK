import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, BookOpen, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const UserGuideButton = ({ variant = 'default', className = '' }) => {
  const { t, i18n } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const guidePath = () =>
    i18n.language === 'fr' ? '/UBB_EHC_Guide_Client.html' : '/UBB_EHC_Guide_Client_EN.html';

  const handleDownloadGuide = async () => {
    setIsDownloading(true);

    try {
      // Load the guide in a hidden same-origin iframe — html2canvas can capture it
      const iframe = document.createElement('iframe');
      iframe.src = guidePath();
      iframe.style.cssText =
        'position:fixed;top:0;left:-9999px;width:900px;height:1200px;opacity:0;pointer-events:none;border:none;';
      document.body.appendChild(iframe);

      await new Promise((resolve, reject) => {
        iframe.onload = resolve;
        iframe.onerror = reject;
        setTimeout(reject, 15000);
      });

      // Short pause so fonts and layout settle
      await new Promise(r => setTimeout(r, 600));

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeBody = iframeDoc.documentElement;

      const canvas = await html2canvas(iframeBody, {
        scale: 1.8,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 900,
        windowHeight: iframeBody.scrollHeight,
        width: 900,
        height: iframeBody.scrollHeight,
      });

      document.body.removeChild(iframe);

      // Build multi-page PDF (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const pageH = 297;
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      let remaining = imgH;
      let offset = 0;

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, offset, imgW, imgH);
      remaining -= pageH;

      while (remaining > 0) {
        offset = remaining - imgH;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, offset, imgW, imgH);
        remaining -= pageH;
      }

      const lang = i18n.language === 'fr' ? 'FR' : 'EN';
      pdf.save(`vitalCHECK-Guide-Utilisateur-${lang}-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (err) {
      console.error('[UserGuideButton] PDF generation failed:', err);
      // Fallback: open in new tab with print dialog
      const win = window.open(guidePath(), '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      if (win) win.onload = () => setTimeout(() => win.print(), 600);
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
        return isDownloading
          ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          : <Download className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getText = () => {
    if (variant === 'footer')  return t('footer.userGuide', "Guide d'utilisation");
    if (variant === 'navbar')  return t('navigation.userGuide', 'Guide');
    if (variant === 'button')  return isDownloading
      ? t('common.downloading', 'Téléchargement...')
      : t('common.downloadGuide', 'Télécharger le guide');
    return t('common.userGuide', "Guide d'utilisation");
  };

  const btnTitle = t('common.downloadUserGuide', "Télécharger le guide d'utilisation en PDF");

  if (variant === 'footer') {
    return (
      <button onClick={handleDownloadGuide} disabled={isDownloading}
        className={`${getVariantClasses()} ${className}`} title={btnTitle}>
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span>{getText()}</span>
        </div>
      </button>
    );
  }

  if (variant === 'navbar') {
    return (
      <button onClick={handleDownloadGuide} disabled={isDownloading}
        className={`${getVariantClasses()} ${className}`} title={btnTitle}>
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="hidden sm:inline">{getText()}</span>
        </div>
      </button>
    );
  }

  return (
    <button onClick={handleDownloadGuide} disabled={isDownloading}
      className={`${getVariantClasses()} ${className}`} title={btnTitle}>
      {getIcon()}
      <span>{getText()}</span>
    </button>
  );
};

export default UserGuideButton;
