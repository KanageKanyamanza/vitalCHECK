import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ClipboardCheck, Info, UserCheck } from 'lucide-react'
import { Button, Section, Container } from '../ui/ds'

/**
 * Service de diagnostic : l'accompagnement par un expert UBB (paiement unique).
 * Ancre #service-diagnostic : cible du lien « Accompagnement par un expert UBB » de la landing.
 * La commission de performance est affichée en clair, au même niveau que le prix.
 */
const DiagnosticServiceOffer = () => {
  const { t } = useTranslation()
  const key = 'pricing.plans.diagnostic'

  return (
    <Section id="service-diagnostic" tone="mist" aria-labelledby="diagnostic-service-title">
      <Container>
        <div className="grid overflow-hidden rounded-ubb-panel bg-white shadow-ubb-md lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 sm:p-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-ubb-accent-100 px-3 py-1 font-text text-xs font-semibold text-ubb-brand-950">
              <UserCheck className="h-4 w-4" aria-hidden="true" />
              {t('pricing.service.badge')}
            </p>
            <h2 id="diagnostic-service-title" className="ubb-heading mt-4 text-ubb-title">
              {t(`${key}.label`)}
            </h2>
            <p className="mt-2 font-heading text-lg font-semibold text-ubb-brand-900">{t(`${key}.subtitle`)}</p>
            <p className="mt-4 max-w-ubb-prose font-text text-ubb-body text-ubb-ink-muted">{t(`${key}.description`)}</p>

            <ul className="mt-6">
              <li className="flex gap-3">
                <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-ubb-brand-900" aria-hidden="true" />
                <p className="font-text text-ubb-body text-ubb-ink">{t(`${key}.includes`)}</p>
              </li>
            </ul>
          </div>

          {/* Prix et conditions */}
          <div className="flex flex-col bg-ubb-brand-900 p-6 text-white sm:p-10">
            <p className="font-text text-sm font-semibold text-ubb-brand-200">{t('checkout.oneTime')}</p>
            <p className="mt-2 font-heading text-5xl font-bold tracking-tight">{t(`${key}.price`)}</p>
            <p className="mt-1 font-text text-ubb-body text-ubb-brand-100">
              {t('pricing.common.or')} {t(`${key}.alternativePrice`)}
            </p>

            <div className="mt-6 flex gap-3 rounded-ubb-field bg-white/10 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-ubb-accent-500" aria-hidden="true" />
              <div>
                <p className="font-text text-sm font-semibold text-white">{t('pricing.service.feeTitle')}</p>
                <p className="mt-1 font-text text-sm text-ubb-brand-100">{t(`${key}.retainer`)}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:mt-auto lg:pt-8">
              <Button to="/checkout?plan=diagnostic" className="w-full focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900">
                {t(`${key}.button`)}
              </Button>
              <Link
                to="/contact"
                className="ubb-focus inline-flex min-h-[44px] items-center justify-center rounded font-text text-sm font-semibold text-white underline decoration-ubb-accent-500 decoration-2 underline-offset-4 hover:decoration-white focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900"
              >
                {t('pricing.service.question')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default DiagnosticServiceOffer
