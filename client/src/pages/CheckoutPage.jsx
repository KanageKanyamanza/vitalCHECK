import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, CreditCard, Building2, Lock } from 'lucide-react'
import { Button, Container } from '../components/ui/ds'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { PayPalButton } from '../components/payment'
import { PAYPAL_CONFIG, PLAN_PRICES } from '../config/paypal'
import toast from 'react-hot-toast'
import { paymentsAPI } from '../services/api'
import { useAssessment } from '../context/AssessmentContext'
import { useClientAuth } from '../context/ClientAuthContext'

// Options du SDK PayPal, créées une seule fois : un nouvel objet à chaque rendu
// ferait recharger le SDK et détruirait les boutons déjà affichés.
const PAYPAL_SCRIPT_OPTIONS = {
  'client-id': PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
}

const CheckoutPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plan')
  
  // Récupérer les données utilisateur
  const { user: assessmentUser } = useAssessment()
  const { user: clientUser } = useClientAuth()
  
  // Priorité au client connecté, sinon utilisateur d'évaluation
  const user = clientUser || assessmentUser
  const [showPayPal, setShowPayPal] = useState(false)
  
  useEffect(() => {
    if (!planId || !['standard', 'premium', 'diagnostic'].includes(planId)) {
      toast.error(t('checkout.invalidPlan'))
      navigate('/pricing')
    }
  }, [planId, navigate, t])

  if (!planId) return null

  const getPlanDetails = () => {
    const baseDetails = {
      name: t(`pricing.plans.${planId}.name`),
      subtitle: t(`pricing.plans.${planId}.subtitle`),
      description: t(`pricing.plans.${planId}.description`)
    }

    if (planId === 'diagnostic') {
      return {
        ...baseDetails,
        price: PLAN_PRICES.diagnostic.oneTime.USD,
        priceXOF: PLAN_PRICES.diagnostic.oneTime.XOF,
        period: t('checkout.oneTime')
      }
    }

    return {
      ...baseDetails,
      price: PLAN_PRICES[planId].monthly.USD,
      priceXOF: PLAN_PRICES[planId].monthly.XOF,
      annualPrice: PLAN_PRICES[planId].annual.USD,
      annualPriceXOF: PLAN_PRICES[planId].annual.XOF,
      period: t('checkout.monthly')
    }
  }

  const planDetails = getPlanDetails()

  const handlePaymentSuccess = async (order) => {
    console.log('Payment successful:', order)
    
    // Utiliser l'email de l'utilisateur, pas l'email PayPal
    const userEmail = user?.email || order.payer?.email_address || 'N/A'
    const companyName = user?.companyName || 'Entreprise'
    
    
    // Enregistrer le paiement dans la base de données
    try {
      await paymentsAPI.recordPayment({
        orderId: order.id,
        planId: planId,
        planName: planDetails.name,
        amount: planDetails.price,
        currency: 'USD',
        customerEmail: userEmail, // Utiliser l'email de l'utilisateur
        paypalOrderId: order.id,
        status: 'completed',
        paymentDetails: {
          ...order,
          userCompanyName: companyName, // Ajouter le nom de l'entreprise
          userEmail: userEmail
        }
      })
      
      console.log('Payment recorded successfully')
    } catch (error) {
      console.error('Error recording payment:', error)
      // Continue anyway - don't block the user
    }
    
    navigate(`/payment-success?orderId=${order.id}&plan=${planId}`)
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    toast.error(t('payment.error'))
  }

  const handleContactPayment = () => {
    navigate(`/contact?plan=${planId}`)
  }

  const lang = (i18n.language || 'fr').slice(0, 2)
  const formatUSD = (value) =>
    new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  const formatXOF = (value) => `${value.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR')} FCFA`

  return (
    <PayPalScriptProvider options={PAYPAL_SCRIPT_OPTIONS}>
      <div className="min-h-screen bg-ubb-paper-soft">
        <Container className="max-w-5xl py-8 sm:py-12">
          <Link
            to="/pricing"
            className="ubb-focus inline-flex min-h-[44px] items-center gap-2 rounded font-text text-sm font-semibold text-ubb-brand-900 hover:text-ubb-brand-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('checkout.backToPricing')}
          </Link>

          <h1 className="ubb-heading mt-4 text-ubb-title">{t('checkout.title')}</h1>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-start lg:gap-8">
            {/* Récapitulatif : ce qui sera payé aujourd'hui */}
            <section aria-labelledby="order-summary-title" className="ubb-card p-6 sm:p-8 md:sticky md:top-[calc(var(--ubb-header-h)+1.5rem)]">
              <h2 id="order-summary-title" className="font-text text-sm font-semibold text-ubb-ink-muted">
                {t('checkout.orderSummary')}
              </h2>
              <p className="ubb-heading mt-2 text-ubb-subtitle">{t(`pricing.plans.${planId}.label`)}</p>
              <p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">{planDetails.subtitle}</p>

              <dl className="mt-6 space-y-3 border-t border-ubb-brand-900/[0.08] pt-6 font-text">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-ubb-body text-ubb-ink">{t('checkout.dueToday')}</dt>
                  <dd className="font-heading text-3xl font-bold text-ubb-ink">{formatUSD(planDetails.price)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 text-ubb-small text-ubb-ink-muted">
                  <dt>{t('checkout.or')}</dt>
                  <dd>{formatXOF(planDetails.priceXOF)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 text-ubb-small text-ubb-ink-muted">
                  <dt>{t('checkout.billing')}</dt>
                  <dd>{planDetails.period}</dd>
                </div>
                {planDetails.annualPrice && (
                  <p className="pt-1 text-ubb-small text-ubb-ink-muted">
                    {t('checkout.annualInfo', {
                      price: formatUSD(planDetails.annualPrice),
                      priceXOF: formatXOF(planDetails.annualPriceXOF),
                    })}
                  </p>
                )}
              </dl>

              <p className="mt-6 flex gap-2.5 rounded-ubb-field bg-ubb-mist p-4 font-text text-ubb-small text-ubb-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-ubb-brand-900" strokeWidth={3} aria-hidden="true" />
                {planDetails.description}
              </p>

              {user?.email && (
                <p className="mt-4 font-text text-ubb-small text-ubb-ink-muted">
                  {t('checkout.account', { email: user.email })}
                </p>
              )}
            </section>

            {/* Paiement */}
            <section aria-labelledby="payment-title" className="ubb-card p-6 sm:p-8">
              <h2 id="payment-title" className="ubb-heading text-ubb-subtitle">
                {t('checkout.selectPaymentMethod')}
              </h2>

              {/* Les boutons PayPal ne sont montés qu'après le choix explicite du mode de paiement
                  (comme avant la refonte) : montés dès l'arrivée sur la page, le SDK les détruisait
                  de façon intermittente pendant le chargement. */}
              <button
                type="button"
                onClick={() => setShowPayPal(true)}
                aria-expanded={showPayPal}
                aria-controls="paypal-buttons"
                className={`ubb-focus mt-6 flex w-full items-center gap-4 rounded-ubb-card border-2 p-4 text-left transition-colors ${
                  showPayPal
                    ? 'border-ubb-brand-900 bg-ubb-brand-50'
                    : 'border-ubb-brand-900/15 bg-white hover:border-ubb-brand-900/40'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-text font-semibold text-ubb-ink">{t('checkout.paypal')}</span>
                  <span className="block font-text text-ubb-small text-ubb-ink-muted">
                    {t('checkout.paypalDescription')}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    showPayPal ? 'border-ubb-brand-900 bg-ubb-brand-900' : 'border-ubb-brand-900/30'
                  }`}
                >
                  {showPayPal && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />}
                </span>
              </button>

              {showPayPal && (
                <div id="paypal-buttons" className="mt-4">
                  <PayPalButton
                    planId={planId}
                    planName={planDetails.name}
                    amount={planDetails.price}
                    currency="USD"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}

              <p className="mt-4 flex items-center justify-center gap-2 font-text text-xs text-ubb-ink-muted">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                {t('checkout.secureNote')}
              </p>

              {/* Autre moyen de paiement : virement ou échange avec l'équipe */}
              <div className="mt-8 border-t border-ubb-brand-900/[0.08] pt-6">
                <p className="font-text text-sm font-semibold text-ubb-ink">{t('checkout.otherMethodTitle')}</p>
                <p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">{t('checkout.contactUsForPayment')}</p>
                <Button variant="outline" size="sm" onClick={handleContactPayment} className="mt-4">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {t('checkout.contactUs')}
                </Button>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </PayPalScriptProvider>
  )
}

export default CheckoutPage

