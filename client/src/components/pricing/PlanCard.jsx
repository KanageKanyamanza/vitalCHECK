import React from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Star } from 'lucide-react'
import { Button } from '../ui/ds'
import { PLAN_IDS, featuresAddedBy } from './planData'

// Le plan gratuit mène au diagnostic gratuit ; les plans payants au paiement
const PLAN_LINKS = {
  free: '/diagnostic',
  standard: '/checkout?plan=standard',
  premium: '/checkout?plan=premium',
}

const BUTTON_VARIANTS = { free: 'outline', standard: 'primary', premium: 'secondary' }

/**
 * Carte d'un plan d'abonnement : nom, public visé, prix, ce que le plan ajoute au précédent, CTA.
 * Le prix annuel est une information : le paiement en ligne se fait au mois.
 */
const PlanCard = ({ planId, popular = false }) => {
  const { t } = useTranslation()
  const key = `pricing.plans.${planId}`
  const previous = PLAN_IDS[PLAN_IDS.indexOf(planId) - 1]
  const added = featuresAddedBy(planId)
  const period = t(`${key}.period`)
  const hasAnnual = !!t(`${key}.annualPrice`, { defaultValue: '' })

  return (
    <article
      aria-labelledby={`plan-${planId}-title`}
      className={`relative flex flex-col rounded-ubb-panel bg-white p-6 sm:p-8 ${
        popular ? 'border-2 border-ubb-brand-900 shadow-ubb-lg' : 'border border-ubb-brand-900/10 shadow-ubb-sm'
      }`}
    >
      {popular && (
        <p className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-ubb-brand-900 px-3 py-1 font-text text-xs font-semibold text-white">
          <Star className="h-3.5 w-3.5 fill-current text-ubb-accent-500" aria-hidden="true" />
          {t('pricing.plans.standard.popular')}
        </p>
      )}

      <h3 id={`plan-${planId}-title`} className="ubb-heading text-ubb-subtitle">
        {t(`${key}.label`)}
      </h3>
      <p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">{t(`${key}.subtitle`)}</p>

      <p className="mt-6 flex flex-wrap items-baseline gap-x-1.5 text-ubb-ink">
        <span className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">{t(`${key}.price`)}</span>
        <span className="font-text text-sm font-semibold text-ubb-ink-muted">
          {t(`${key}.currency`)}
          {period}
        </span>
      </p>
      <p className="mt-1 min-h-[1.5rem] font-text text-ubb-small text-ubb-ink-muted">
        {hasAnnual
          ? t('pricing.card.annual', {
              price: t(`${key}.annualPrice`),
              currency: t(`${key}.currency`),
              period: t(`${key}.annualPeriod`),
            })
          : t('pricing.card.noCard')}
      </p>

      <Button
        to={PLAN_LINKS[planId]}
        variant={BUTTON_VARIANTS[planId]}
        className="mt-6 w-full"
        aria-label={`${t(`${key}.button`)} : ${t(`${key}.label`)}`}
      >
        {t(`${key}.button`)}
      </Button>

      <div className="mt-8 border-t border-ubb-brand-900/[0.08] pt-6">
        <p className="font-text text-sm font-semibold text-ubb-ink">
          {previous
            ? t('pricing.card.everythingIn', { plan: t(`pricing.plans.${previous}.label`) })
            : t('pricing.card.included')}
        </p>
        <ul className="mt-3 space-y-2.5">
          {added.map((feature) => (
            <li key={feature} className="flex gap-2.5 font-text text-ubb-small text-ubb-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-ubb-brand-900" strokeWidth={3} aria-hidden="true" />
              {t(`pricing.features.${feature}`)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default PlanCard
