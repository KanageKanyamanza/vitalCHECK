import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, CreditCard, Building2 } from 'lucide-react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { PayPalButton } from '../components/payment'
import { PAYPAL_CONFIG, PLAN_PRICES } from '../config/paypal'
import toast from 'react-hot-toast'
import { paymentsAPI } from '../services/api'

const CheckoutPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('plan')
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)

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
    
    // Enregistrer le paiement dans la base de données
    try {
      await paymentsAPI.recordPayment({
        orderId: order.id,
        planId: planId,
        planName: planDetails.name,
        amount: planDetails.price,
        currency: 'USD',
        customerEmail: order.payer?.email_address || 'N/A',
        paypalOrderId: order.id,
        status: 'completed',
        paymentDetails: order
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

  return (
    <PayPalScriptProvider options={{ 
      'client-id': PAYPAL_CONFIG.clientId,
      currency: PAYPAL_CONFIG.currency,
      intent: PAYPAL_CONFIG.intent
    }}>
      <div className="min-h-screen bg-gray-50 pt-[50px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          {/* Back Button */}
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('checkout.backToPricing')}
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Plan Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('checkout.orderSummary')}
                </h2>
                
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <h3 className="text-xl font-semibold text-primary-600 mb-2">
                    {planDetails.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {planDetails.subtitle}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{t('checkout.price')}:</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${planDetails.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{t('checkout.or')}</span>
                      <span className="text-lg font-semibold text-gray-700">
                        {planDetails.priceXOF.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {planDetails.period}
                    </div>
                  </div>

                  {planDetails.annualPrice && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{t('checkout.annualPrice')}:</span>
                        <span className="text-lg font-bold text-green-700">
                          ${planDetails.annualPrice}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {t('pricing.common.twoMonthsFree')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{planDetails.description}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Payment Methods */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('checkout.selectPaymentMethod')}
                </h2>

                <div className="space-y-4">
                  {/* PayPal Payment Method */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'paypal'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {t('checkout.paypal')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t('checkout.paypalDescription')}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'paypal'
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPaymentMethod === 'paypal' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {selectedPaymentMethod === 'paypal' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <PayPalButton
                          planId={planId}
                          planName={planDetails.name}
                          amount={planDetails.price}
                          currency="USD"
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Bank Transfer / Contact Method */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'contact'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('contact')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {t('checkout.bankTransfer')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t('checkout.bankTransferDescription')}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'contact'
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPaymentMethod === 'contact' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {selectedPaymentMethod === 'contact' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <p className="text-sm text-gray-600 mb-4">
                          {t('checkout.contactUsForPayment')}
                        </p>
                        <button
                          onClick={handleContactPayment}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                          {t('checkout.contactUs')}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    {t('checkout.securePayment')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  )
}

export default CheckoutPage

