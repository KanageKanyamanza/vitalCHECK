import React from 'react'
import { useTranslation } from 'react-i18next'
import { Hero } from '../components/layout'
import ServicesSection from '../components/landing/ServicesSection'
import SectorDiagnostics from '../components/landing/SectorDiagnostics'
import VisionSection from '../components/landing/VisionSection'
import ContactSection from '../components/landing/ContactSection'
import { Footer } from '../components/navigation'
import { SocialShare } from '../components/ui'
import SEOHead from '../components/seo/SEOHead'
import { getHomePageStructuredData, getWebSiteStructuredData, getBrandOrganizationStructuredData } from '../utils/seoData'

const LandingPage = () => {
  const { t } = useTranslation()

  return (
    <div>
      <SEOHead
        title={t('landing.seo.title')}
        description={t('landing.seo.description')}
        keywords={t('landing.seo.keywords')}
        url="/"
        structuredData={[getWebSiteStructuredData(), getBrandOrganizationStructuredData(), getHomePageStructuredData()]}
      />

      <Hero />

      <ServicesSection />

      <SectorDiagnostics />

      <VisionSection />

      <ContactSection />

      {/* Social Share */}
      <SocialShare
        title={t('landing.seo.title')}
        description={t('landing.seo.shareDescription')}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
