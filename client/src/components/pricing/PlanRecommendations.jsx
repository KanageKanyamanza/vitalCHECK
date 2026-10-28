import React from 'react'
import { useTranslation } from 'react-i18next'
import { Section, Container, SectionHeading } from '../ui/ds'
import { PLAN_IDS, POPULAR_PLAN, ENTERPRISE_TYPES } from './planData'

/**
 * « Quelle solution pour votre entreprise ? » : les types d'entreprise regroupés
 * sous le plan recommandé pour eux.
 */
const PlanRecommendations = () => {
  const { t } = useTranslation()

  return (
    <Section tone="soft" aria-labelledby="recommendations-title">
      <Container>
        <SectionHeading
          id="recommendations-title"
          align="center"
          title={t('pricing.enterpriseRecommendations.title')}
          intro={t('pricing.enterpriseRecommendations.subtitle')}
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLAN_IDS.map((planId) => (
            <section
              key={planId}
              aria-labelledby={`reco-${planId}`}
              className={`rounded-ubb-card bg-white p-6 ${
                planId === POPULAR_PLAN ? 'border-2 border-ubb-brand-900' : 'border border-ubb-brand-900/10'
              }`}
            >
              <p className="font-text text-xs font-semibold text-ubb-ink-muted">
                {t('pricing.enterpriseRecommendations.tableHeaders.recommendedPlan')}
              </p>
              <h3 id={`reco-${planId}`} className="ubb-heading mt-1 text-ubb-subtitle">
                {t(`pricing.plans.${planId}.label`)}
              </h3>
              <ul className="mt-5 space-y-4">
                {ENTERPRISE_TYPES.filter((type) => type.plan === planId).map(({ key, icon: Icon }) => (
                  <li key={key} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-text text-sm font-semibold text-ubb-ink">
                        {t(`pricing.enterpriseTypes.${key}`)}
                      </span>
                      <span className="block font-text text-ubb-small text-ubb-ink-muted">
                        {t(`pricing.enterpriseDescriptions.${key}`)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default PlanRecommendations
