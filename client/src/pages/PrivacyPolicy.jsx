import React from 'react'
import { useTranslation } from 'react-i18next'
import { Shield } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import LegalDocument from '../components/legal/LegalDocument'

const PrivacyPolicy = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-ubb-paper-soft">
      <SEOHead title={`${t('privacy.title')} - vitalCHECK`} description={t('privacy.seoDescription')} url="/privacy" />
      <LegalDocument ns="privacy" icon={Shield} />
    </div>
  )
}

export default PrivacyPolicy
