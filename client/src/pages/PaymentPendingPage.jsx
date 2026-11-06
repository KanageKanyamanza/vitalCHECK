import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, XCircle, Clock, Loader2, Smartphone } from 'lucide-react'
import { Button, Container } from '../components/ui/ds'
import { paymentsAPI } from '../services/api'
import { useClientAuth } from '../context/ClientAuthContext'

// La page interroge notre serveur (jamais AfribaPay) toutes les 4 s, pendant 3 min au plus
const POLL_INTERVAL_MS = 4000
const MAX_WAIT_MS = 3 * 60 * 1000

const PaymentPendingPage = () => {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  // Lien de paiement Wave transmis par le formulaire (absent si la page est rouverte plus tard)
  const providerLink = useLocation().state?.providerLink
  const { refreshUser } = useClientAuth()
  const [order, setOrder] = useState(null)
  // loading | pending | completed | failed | timeout | notFound
  const [state, setState] = useState(orderId ? 'loading' : 'notFound')
  const startedAt = useRef(Date.now())
  const timer = useRef(null)

  const poll = useCallback(async () => {
    try {
      const { data } = await paymentsAPI.getMobileMoneyOrder(orderId)
      setOrder(data)
      if (data.status === 'completed') {
        setState('completed')
        refreshUser?.()
        return
      }
      if (data.status === 'failed') {
        setState('failed')
        return
      }
      setState('pending')
    } catch (error) {
      if (error.response?.status === 404) {
        setState('notFound')
        return
      }
      // Erreur réseau passagère : on continue d'attendre
    }
    if (Date.now() - startedAt.current >= MAX_WAIT_MS) {
      setState('timeout')
      return
    }
    timer.current = setTimeout(poll, POLL_INTERVAL_MS)
  }, [orderId, refreshUser])

  useEffect(() => {
    if (!orderId) return undefined
    window.scrollTo(0, 0)
    poll()
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const checkAgain = () => {
    clearTimeout(timer.current)
    startedAt.current = Date.now()
    setState('loading')
    poll()
  }

  const lang = (i18n.language || 'fr').slice(0, 2)
  const formatDate = (value) =>
    new Date(value).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const formatXOF = (value) => `${Number(value).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} FCFA`
  const planName = order?.planId ? t(`pricing.plans.${order.planId}.label`) : ''

  const pendingBody = () => {
    if (order?.operator === 'wave') return t('mobileMoney.pending.waveBody')
    if (order?.operator === 'orange') return t('mobileMoney.pending.orangeBody')
    return t('mobileMoney.pending.confirmBody')
  }

  let icon
  let title
  let body
  let actions = null

  if (state === 'completed') {
    icon = <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
    title = t('mobileMoney.pending.successTitle')
    body = order?.periodEnd ? t('mobileMoney.pending.successBody', { plan: planName, date: formatDate(order.periodEnd) }) : ''
    actions = <Button to="/client/dashboard" size="lg" className="w-full sm:w-auto">{t('mobileMoney.pending.goToDashboard')}</Button>
  } else if (state === 'failed') {
    icon = <XCircle className="h-9 w-9" aria-hidden="true" />
    title = t('mobileMoney.pending.failedTitle')
    body = t('mobileMoney.pending.failedBody')
    actions = (
      <Button to={`/checkout?plan=${order?.planId || 'premium'}`} size="lg" className="w-full sm:w-auto">
        {t('mobileMoney.pending.retry')}
      </Button>
    )
  } else if (state === 'timeout') {
    icon = <Clock className="h-9 w-9" aria-hidden="true" />
    title = t('mobileMoney.pending.stillPendingTitle')
    body = t('mobileMoney.pending.stillPendingBody')
    actions = (
      <Button variant="outline" onClick={checkAgain} className="w-full sm:w-auto">
        {t('mobileMoney.pending.checkAgain')}
      </Button>
    )
  } else if (state === 'notFound') {
    icon = <XCircle className="h-9 w-9" aria-hidden="true" />
    title = t('mobileMoney.pending.notFound')
    actions = <Button to="/pricing" variant="outline" className="w-full sm:w-auto">{t('mobileMoney.pending.backToPricing')}</Button>
  } else {
    icon = order?.operator && order.operator !== 'wave' && order.operator !== 'orange'
      ? <Smartphone className="h-9 w-9" aria-hidden="true" />
      : <Loader2 className="h-9 w-9 motion-safe:animate-spin" aria-hidden="true" />
    title = order?.operator && order.operator !== 'wave' && order.operator !== 'orange'
      ? t('mobileMoney.pending.confirmTitle')
      : t('mobileMoney.pending.title')
    body = pendingBody()
    if (providerLink && order?.operator === 'wave') {
      actions = (
        <Button href={providerLink} target="_blank" rel="noopener noreferrer" size="lg" className="w-full sm:w-auto">
          {t('mobileMoney.pending.openWave')}
        </Button>
      )
    }
  }

  const waiting = state === 'loading' || state === 'pending'

  return (
    <div className="min-h-screen bg-ubb-paper-soft">
      <Container className="max-w-xl py-10 sm:py-16">
        <section aria-labelledby="payment-pending-title" className="ubb-card p-6 text-center sm:p-10">
          <span
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              state === 'failed' || state === 'notFound' ? 'bg-red-50 text-red-700' : 'bg-ubb-brand-50 text-ubb-brand-900'
            }`}
          >
            {icon}
          </span>

          <div aria-live="polite">
            <h1 id="payment-pending-title" className="ubb-heading mt-5 text-ubb-subtitle">{title}</h1>
            {body && <p className="mt-3 font-text text-ubb-body text-ubb-ink">{body}</p>}
          </div>

          {order && (
            <p className="mt-4 font-text text-ubb-small text-ubb-ink-muted">
              {planName} · {formatXOF(order.amount)}
            </p>
          )}

          {waiting && (
            <p className="mt-6 flex items-center justify-center gap-2 font-text text-ubb-small text-ubb-ink-muted">
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
              {t('mobileMoney.pending.keepOpen')}
            </p>
          )}

          {actions && <div className="mt-8 flex justify-center">{actions}</div>}
        </section>
      </Container>
    </div>
  )
}

export default PaymentPendingPage
