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

  const sectorDiagnostics = [
    {
      name: 'Agriculture',
      title: 'Diagnostic Exploitation Agricole +10 ha',
      description: '25 questions spécifiques aux exploitations agricoles — pilotage, finance, marchés, production et organisation. Résultats instantanés et gratuits.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Champs cultivés dans un paysage agricole',
      badge: 'bg-green-100 text-green-800',
      button: 'bg-green-600 hover:bg-green-700',
      questionnaire: 'agriculture',
    },
    {
      name: 'Commerce de Détail',
      title: 'Diagnostic Commerce de Détail',
      description: '25 questions spécifiques aux commerces de détail — pilotage, stocks, finance, client et digitalisation. Résultats instantanés et gratuits.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Intérieur d’une boutique de prêt-à-porter',
      badge: 'bg-blue-100 text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
      questionnaire: 'retail',
    },
    {
      name: 'Restauration',
      title: 'Diagnostic Restaurant',
      description: '25 questions spécifiques à la restauration — pilotage, food cost, hygiène, finance et personnel. Résultats instantanés et gratuits.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85',
      imageAlt: 'Salle de restaurant dressée pour le service',
      badge: 'bg-orange-100 text-orange-800',
      button: 'bg-orange-600 hover:bg-orange-700',
      questionnaire: 'restaurant',
    },
  ]

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

      {/* Diagnostics sectoriels */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sectorDiagnostics.map((diagnostic, index) => (
              <motion.article
                key={diagnostic.questionnaire}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={diagnostic.image}
                    alt={diagnostic.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className={`mb-3 inline-block w-fit rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide ${diagnostic.badge}`}>
                    Nouveau · Secteur {diagnostic.name}
                  </span>
                  <h3 className="mb-2 text-xl font-display font-bold text-gray-900">
                    {diagnostic.title}
                  </h3>
                  <p className="mb-6 flex-1 text-sm leading-6 text-gray-600">
                    {diagnostic.description}
                  </p>
                  <button
                    onClick={() => navigate(`/diagnostic?questionnaire=${diagnostic.questionnaire}`)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white shadow-sm transition-colors ${diagnostic.button}`}
                  >
                    <span>Démarrer</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

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
