import React from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import SEOHead from '../components/seo/SEOHead'
import LegalDocument from '../components/legal/LegalDocument'

const TermsOfService = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-ubb-paper-soft">
      <SEOHead title={`${t('terms.title')} - vitalCHECK`} description={t('terms.seoDescription')} url="/terms" />
      <LegalDocument ns="terms" icon={FileText} showCompany />
    </div>
  )
}

export default TermsOfService
