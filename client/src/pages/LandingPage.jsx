import React from 'react'
import { Hero } from '../components/layout'
import ServicesSection from '../components/landing/ServicesSection'
import SectorDiagnostics from '../components/landing/SectorDiagnostics'
import VisionSection from '../components/landing/VisionSection'
import { Footer } from '../components/navigation'
import { SocialShare } from '../components/ui'
import SEOHead from '../components/seo/SEOHead'
import { getHomePageStructuredData, getWebSiteStructuredData, getBrandOrganizationStructuredData } from '../utils/seoData'

const LandingPage = () => {
  return (
    <div>
      <SEOHead
        title="vitalCHECK Enterprise Health Check - Évaluez la santé de votre entreprise"
        description="Évaluez la santé organisationnelle de votre entreprise africaine avec vitalCHECK. Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé."
        keywords="entreprise, santé organisationnelle, évaluation, vitalCHECK, Afrique, business, conseil, croissance, PME, diagnostic, management, finance, opérations, marketing, RH, gouvernance, technologie"
        url="/"
        structuredData={[getWebSiteStructuredData(), getBrandOrganizationStructuredData(), getHomePageStructuredData()]}
      />

      {/* Hero Section */}
      <Hero />

      <ServicesSection />

      <SectorDiagnostics />

      <VisionSection />

      {/* Social Share */}
      <SocialShare
        title="vitalCHECK Enterprise Health Check - Évaluez la santé de votre entreprise"
        description="Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé."
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
