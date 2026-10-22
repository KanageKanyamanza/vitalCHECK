import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { SocialShare } from '../components/ui'
import { Section, Container } from '../components/ui/ds'
import PlanCard from '../components/pricing/PlanCard'
import DiagnosticServiceOffer from '../components/pricing/DiagnosticServiceOffer'
import PlanComparison from '../components/pricing/PlanComparison'
import PlanRecommendations from '../components/pricing/PlanRecommendations'
import { PLAN_IDS, POPULAR_PLAN } from '../components/pricing/planData'

const PricingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()


  // Lien direct vers une section (ex. /pricing#service-diagnostic depuis la landing).
  // App.jsx remonte en haut (défilement fluide) à chaque changement de page : on attend
  // la fin de ce retour avant de descendre vers la section.
  useEffect(() => {
    if (!location.hash) return
    const timer = setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' })
    }, 600)
    return () => clearTimeout(timer)
  }, [location.hash])

  const handleContactClick = () => {
    navigate('/contact')
  }

  const handleStartFreeAssessment = () => {
    navigate('/diagnostic')
  }

  return (
    <>
      <Helmet>
        <title>Tarifs - vitalCHECK | Plans d'abonnement pour votre entreprise</title>
        <meta name="description" content="Découvrez nos plans tarifaires vitalCHECK : GRATUIT, STANDARD et PREMIUM. Choisissez la solution adaptée à votre entreprise pour améliorer votre santé organisationnelle." />
        <meta name="keywords" content="tarifs, prix, abonnement, vitalCHECK, diagnostic entreprise, PME, TPE, coopératives" />
        <meta property="og:title" content="Tarifs - vitalCHECK | Plans d'abonnement" />
        <meta property="og:description" content="Choisissez le plan vitalCHECK adapté à votre entreprise. Plans GRATUIT, STANDARD et PREMIUM disponibles." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-ubb-paper-soft">
        {/* En-tête et plans */}
        <Section tone="soft" aria-labelledby="pricing-title" className="!pb-12">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 id="pricing-title" className="ubb-heading text-ubb-title sm:text-ubb-display">
                {t('pricing.title')}
              </h1>
              <p className="mt-4 font-text text-ubb-lead text-ubb-ink-muted">{t('pricing.subtitle')}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-text text-sm font-medium text-ubb-ink">
                {['freeEvaluation', 'noCommitment', 'supportIncluded'].map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-ubb-brand-900" strokeWidth={3} aria-hidden="true" />
                    {t(`pricing.heroFeatures.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3 md:items-start lg:gap-8">
              {PLAN_IDS.map((planId) => (
                <PlanCard key={planId} planId={planId} popular={planId === POPULAR_PLAN} />
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center font-text text-ubb-small text-ubb-ink-muted">
              {t('pricing.card.billingNote')}
            </p>
          </Container>
        </Section>

        <DiagnosticServiceOffer />

        <PlanComparison />

        <PlanRecommendations />

        {/* CTA Section */}
        <div className="bg-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {t('pricing.cta.title')}
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                {t('pricing.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleStartFreeAssessment}
                >
                  {t('pricing.cta.startFree')}
                </button>
                <button 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                  onClick={handleContactClick}
                >
                  {t('pricing.cta.contactUs')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Social Share */}
        <SocialShare 
          title="Tarifs vitalCHECK - Plans d'abonnement"
          description="Choisissez le plan adapté à votre entreprise : GRATUIT, STANDARD, PREMIUM ou SERVICE DE DIAGNOSTIC."
        />
      </div>
    </>
  )
}

export default PricingPage
