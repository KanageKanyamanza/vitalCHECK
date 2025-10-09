import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react'

const PaymentSuccessPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const planId = searchParams.get('plan')

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  const getPlanName = () => {
    if (!planId) return ''
    return t(`pricing.plans.${planId}.name`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] pb-[50px] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            {t('paymentSuccess.title')}
          </h1>

          <p className="text-center text-gray-600 mb-8">
            {t('paymentSuccess.subtitle')}
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">
              {t('paymentSuccess.orderDetails')}
            </h2>
            <div className="space-y-2 text-sm">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('paymentSuccess.orderId')}:</span>
                  <span className="font-mono text-gray-900">{orderId}</span>
                </div>
              )}
              {planId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('paymentSuccess.plan')}:</span>
                  <span className="font-semibold text-primary-600">{getPlanName()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t('paymentSuccess.status')}:</span>
                <span className="text-green-600 font-semibold">{t('paymentSuccess.completed')}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary-600" />
              {t('paymentSuccess.nextSteps')}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t('paymentSuccess.confirmationEmail')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t('paymentSuccess.accessInfo')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t('paymentSuccess.support')}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {t('paymentSuccess.backToHome')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="flex-1 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t('paymentSuccess.contactSupport')}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('paymentSuccess.needHelp')}{' '}
          <a href="mailto:info@checkmyenterprise.com" className="text-primary-600 hover:underline">
            info@checkmyenterprise.com
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default PaymentSuccessPage

