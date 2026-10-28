import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Mail, KeyRound, FileText } from 'lucide-react'
import { Button, Container } from '../components/ui/ds'
import { useClientAuth } from '../context/ClientAuthContext'

const PaymentSuccessPage = () => {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const { isAuthenticated } = useClientAuth()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const planId = searchParams.get('plan')

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  const NEXT_STEPS = [
    { key: 'confirmationEmail', icon: Mail },
    { key: 'accessInfo', icon: KeyRound },
    { key: 'support', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-ubb-paper-soft">
      <Container className="max-w-2xl py-10 sm:py-16">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          aria-labelledby="payment-success-title"
          className="ubb-card p-6 text-center sm:p-10"
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ubb-brand-50 text-ubb-brand-900">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </span>
          <h1 id="payment-success-title" className="ubb-heading mt-5 text-ubb-title">
            {t('paymentSuccess.title')}
          </h1>
          <p className="mx-auto mt-3 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">
            {t('paymentSuccess.subtitle')}
          </p>

          {/* Détails de la commande */}
          <dl className="mt-8 space-y-3 rounded-ubb-field bg-ubb-paper-soft p-5 text-left font-text text-ubb-small">
            {planId && (
              <div className="flex justify-between gap-4">
                <dt className="text-ubb-ink-muted">{t('paymentSuccess.plan')}</dt>
                <dd className="font-semibold text-ubb-ink">{t(`pricing.plans.${planId}.label`)}</dd>
              </div>
            )}
            {orderId && (
              <div className="flex justify-between gap-4">
                <dt className="text-ubb-ink-muted">{t('paymentSuccess.orderId')}</dt>
                <dd className="break-all text-right font-mono text-ubb-ink">{orderId}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-ubb-ink-muted">{t('paymentSuccess.status')}</dt>
              <dd className="font-semibold text-ubb-brand-900">{t('paymentSuccess.completed')}</dd>
            </div>
          </dl>

          {/* Et maintenant ? */}
          <div className="mt-8 text-left">
            <h2 className="font-heading text-lg font-semibold text-ubb-ink">{t('paymentSuccess.nextSteps')}</h2>
            <ul className="mt-4 space-y-3">
              {NEXT_STEPS.map(({ key, icon: Icon }) => (
                <li key={key} className="flex gap-3 font-text text-ubb-body text-ubb-ink">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="pt-1">{t(`paymentSuccess.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Button to="/client/dashboard" className="sm:flex-1">
                {t('paymentSuccess.goToDashboard')}
              </Button>
            ) : (
              <Button to="/" className="sm:flex-1">
                {t('paymentSuccess.backToHome')}
              </Button>
            )}
            <Button to="/contact" variant="outline" className="sm:flex-1">
              {t('paymentSuccess.contactSupport')}
            </Button>
          </div>
        </motion.section>

        <p className="mt-6 text-center font-text text-ubb-small text-ubb-ink-muted">
          {t('paymentSuccess.needHelp')}{' '}
          <a
            href="mailto:info@checkmyenterprise.com"
            className="ubb-focus rounded font-semibold text-ubb-brand-900 underline underline-offset-4"
          >
            info@checkmyenterprise.com
          </a>
        </p>
      </Container>
    </div>
  )
}

export default PaymentSuccessPage
