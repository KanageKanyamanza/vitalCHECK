import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Sprout, Store, UtensilsCrossed } from 'lucide-react'
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

      {/* Diagnostic sectoriel Agriculture */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-8 bg-green-50 border border-green-200 rounded-2xl p-8"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block text-xs font-semibold text-green-700 uppercase tracking-wide bg-green-100 px-2 py-1 rounded mb-2">
                Nouveau · Secteur Agriculture
              </span>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-1">
                Diagnostic Exploitation Agricole +10 ha
              </h3>
              <p className="text-sm text-gray-600">
                25 questions spécifiques aux exploitations agricoles — pilotage, finance, marchés, production et organisation. Résultats instantanés et gratuits.
              </p>
            </div>
            <button
              onClick={() => navigate('/diagnostic?questionnaire=agriculture')}
              className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center space-x-2 transform hover:scale-105 transition-all duration-300 shadow-md whitespace-nowrap"
            >
              <span>Démarrer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Diagnostic sectoriel Retail */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-8 bg-blue-50 border border-blue-200 rounded-2xl p-8"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block text-xs font-semibold text-blue-700 uppercase tracking-wide bg-blue-100 px-2 py-1 rounded mb-2">
                Nouveau · Secteur Commerce de Détail
              </span>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-1">
                Diagnostic Commerce de Détail
              </h3>
              <p className="text-sm text-gray-600">
                25 questions spécifiques aux commerces de détail — pilotage, stocks, finance, client et digitalisation. Résultats instantanés et gratuits.
              </p>
            </div>
            <button
              onClick={() => navigate('/diagnostic?questionnaire=retail')}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center space-x-2 transform hover:scale-105 transition-all duration-300 shadow-md whitespace-nowrap"
            >
              <span>Démarrer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Diagnostic sectoriel Restaurant */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-8 bg-orange-50 border border-orange-200 rounded-2xl p-8"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block text-xs font-semibold text-orange-700 uppercase tracking-wide bg-orange-100 px-2 py-1 rounded mb-2">
                Nouveau · Secteur Restauration
              </span>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-1">
                Diagnostic Restaurant
              </h3>
              <p className="text-sm text-gray-600">
                25 questions spécifiques à la restauration — pilotage, food cost, hygiène, finance et personnel. Résultats instantanés et gratuits.
              </p>
            </div>
            <button
              onClick={() => navigate('/diagnostic?questionnaire=restaurant')}
              className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center space-x-2 transform hover:scale-105 transition-all duration-300 shadow-md whitespace-nowrap"
            >
              <span>Démarrer</span>
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
