import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { SocialShare } from '../components/ui'
import { Button, Section, Container } from '../components/ui/ds'
import SEOHead from '../components/seo/SEOHead'
import PlanCard from '../components/pricing/PlanCard'
import DiagnosticServiceOffer from '../components/pricing/DiagnosticServiceOffer'
import PlanComparison from '../components/pricing/PlanComparison'
import PlanRecommendations from '../components/pricing/PlanRecommendations'
import { PLAN_IDS, POPULAR_PLAN } from '../components/pricing/planData'

const PricingPage = () => {
  const { t } = useTranslation()
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

  return (
    <>
      <SEOHead
        title={t('pricing.seo.title')}
        description={t('pricing.seo.description')}
        keywords={t('pricing.seo.keywords')}
        url="/pricing"
      />

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

        {/* Appel final */}
        <Section tone="brand" aria-labelledby="pricing-cta-title">
          <Container className="max-w-3xl text-center">
            <h2 id="pricing-cta-title" className="ubb-heading text-ubb-title text-white">
              {t('pricing.cta.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-ubb-prose font-text text-ubb-lead text-ubb-brand-200">
              {t('pricing.cta.subtitle')}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                to="/diagnostic"
                size="lg"
                className="focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900"
              >
                {t('pricing.cta.startFree')}
              </Button>
              <Button
                to="/contact"
                size="lg"
                variant="onDark"
                className="focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900"
              >
                {t('pricing.cta.contactUs')}
              </Button>
            </div>
          </Container>
        </Section>

        <SocialShare title={t('pricing.seo.title')} description={t('pricing.seo.shareDescription')} />
      </div>
    </>
  )
}

export default PricingPage
