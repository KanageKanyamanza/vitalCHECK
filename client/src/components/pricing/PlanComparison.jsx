import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Minus } from 'lucide-react'
import { Section, Container, SectionHeading } from '../ui/ds'
import { PLAN_IDS, POPULAR_PLAN, FEATURES, SUPPORT } from './planData'

// Coche « inclus » / tiret « non inclus », avec un libellé lisible par les lecteurs d'écran
const Availability = ({ included }) => {
  const { t } = useTranslation()
  return included ? (
    <>
      <Check className="mx-auto h-5 w-5 text-ubb-brand-900" strokeWidth={3} aria-hidden="true" />
      <span className="sr-only">{t('pricing.comparison.included')}</span>
    </>
  ) : (
    <>
      <Minus className="mx-auto h-5 w-5 text-ubb-ink-muted/50" aria-hidden="true" />
      <span className="sr-only">{t('pricing.comparison.notIncluded')}</span>
    </>
  )
}

/**
 * Comparatif des plans : tableau sur grand écran ; sur mobile, un plan à la fois
 * (sélecteur) pour éviter le défilement horizontal.
 */
const PlanComparison = () => {
  const { t } = useTranslation()
  const [mobilePlan, setMobilePlan] = useState(POPULAR_PLAN)

  const groups = [
    {
      id: 'features',
      title: t('pricing.featuresComparison.featuresLabel'),
      rows: FEATURES.map((f) => ({ ...f, label: t(`pricing.features.${f.key}`) })),
    },
    {
      id: 'support',
      title: t('pricing.support.title'),
      rows: SUPPORT.map((s) => ({
        ...s,
        label: t(`pricing.supportTypes.${s.key}`),
        detail: t(`pricing.supportDescriptions.${s.key}`),
      })),
    },
  ]

  return (
    <Section tone="white" aria-labelledby="comparison-title">
      <Container className="max-w-5xl">
        <SectionHeading
          id="comparison-title"
          align="center"
          title={t('pricing.featuresComparison.title')}
          intro={t('pricing.featuresComparison.subtitle')}
        />

        {/* Mobile : un plan à la fois */}
        <div className="mt-10 md:hidden">
          <div
            role="radiogroup"
            aria-label={t('pricing.comparison.choosePlan')}
            className="grid grid-cols-3 gap-1 rounded-full bg-ubb-brand-50 p-1"
          >
            {PLAN_IDS.map((planId) => (
              <button
                key={planId}
                type="button"
                role="radio"
                aria-checked={mobilePlan === planId}
                onClick={() => setMobilePlan(planId)}
                className={`ubb-focus min-h-[44px] rounded-full font-text text-sm font-semibold transition-colors ${
                  mobilePlan === planId ? 'bg-ubb-brand-900 text-white' : 'text-ubb-ink hover:bg-white'
                }`}
              >
                {t(`pricing.plans.${planId}.label`)}
              </button>
            ))}
          </div>

          {groups.map((group) => (
            <div key={group.id} className="mt-8">
              <h3 className="font-heading text-base font-semibold text-ubb-ink">{group.title}</h3>
              <ul className="mt-3 divide-y divide-ubb-brand-900/[0.08] rounded-ubb-card border border-ubb-brand-900/10 bg-white">
                {group.rows.map((row) => (
                  <li key={row.key} className="flex items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1 font-text text-ubb-small text-ubb-ink">
                      {row.label}
                      {row.detail && <span className="block text-ubb-ink-muted">{row.detail}</span>}
                    </span>
                    <span className="w-6 shrink-0">
                      <Availability included={row[mobilePlan]} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Grand écran : tableau */}
        <div className="mt-12 hidden overflow-hidden rounded-ubb-card border border-ubb-brand-900/10 shadow-ubb-sm md:block">
          <table className="w-full border-collapse bg-white text-left">
            <caption className="sr-only">{t('pricing.featuresComparison.title')}</caption>
            <thead>
              <tr className="border-b border-ubb-brand-900/10">
                <td className="w-1/2 px-6 py-4" />
                {PLAN_IDS.map((planId) => (
                  <th
                    key={planId}
                    scope="col"
                    className={`px-4 py-4 text-center font-heading text-base font-semibold text-ubb-ink ${
                      planId === POPULAR_PLAN ? 'bg-ubb-brand-50' : ''
                    }`}
                  >
                    {t(`pricing.plans.${planId}.label`)}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.id}>
                <tr className="bg-ubb-paper-soft">
                  <th
                    scope="colgroup"
                    colSpan={PLAN_IDS.length + 1}
                    className="px-6 py-3 font-text text-sm font-semibold text-ubb-ink-muted"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.key} className="border-t border-ubb-brand-900/[0.06]">
                    <th scope="row" className="px-6 py-3.5 font-text text-ubb-small font-medium text-ubb-ink">
                      {row.label}
                      {row.detail && (
                        <span className="block font-normal text-ubb-ink-muted">{row.detail}</span>
                      )}
                    </th>
                    {PLAN_IDS.map((planId) => (
                      <td key={planId} className={`px-4 py-3.5 ${planId === POPULAR_PLAN ? 'bg-ubb-brand-50' : ''}`}>
                        <Availability included={row[planId]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Container>
    </Section>
  )
}

export default PlanComparison
