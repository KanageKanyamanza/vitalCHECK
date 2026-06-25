import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { Hero } from '../components/layout'
import { Footer } from '../components/navigation'
import { SocialShare } from '../components/ui'
import SEOHead from '../components/seo/SEOHead'
import { getHomePageStructuredData, getWebSiteStructuredData, getBrandOrganizationStructuredData } from '../utils/seoData'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleStartAssessment = () => {
    navigate('/diagnostic')
  }

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
      <Hero onStartAssessment={handleStartAssessment} />

      {/* Diagnostic gratuit "Niveau 1" */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 text-primary-600 mb-3">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">5 à 7 minutes · 100% gratuit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-3">
              Découvrez votre score de santé d'entreprise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Répondez à 25 questions rapides et obtenez instantanément votre score
              global, vos points forts et vos premières recommandations.
            </p>
            <button
              onClick={() => navigate('/diagnostic')}
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center space-x-2 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span>Obtenir mon score gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

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
