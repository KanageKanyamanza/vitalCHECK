import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  CheckCircle, 
  Mail, 
  Star, 
  ArrowRight, 
  Home,
  Download,
  Users,
  Target,
  TrendingUp
} from 'lucide-react'

const ReportSuccessModal = ({ 
  isOpen, 
  onClose, 
  onGoHome, 
  onUpgradePremium,
  userEmail 
}) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  const premiumFeatures = [
    {
      icon: <Users className="w-5 h-5" />,
      title: t('premium.teamAnalysis'),
      description: t('premium.teamAnalysisDesc')
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: t('premium.actionPlan'),
      description: t('premium.actionPlanDesc')
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: t('premium.advancedAnalytics'),
      description: t('premium.advancedAnalyticsDesc')
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header avec succès */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-success-500" />
          </motion.div>
          
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            {t('results.reportSuccessTitle')}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {t('results.reportSuccessDesc')}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{t('results.reportSentTo')} <strong>{userEmail}</strong></span>
          </div>
        </div>

        {/* Section Premium */}
        <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg p-6 mb-6 border border-accent-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('premium.upgradeTitle')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('premium.upgradeSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onUpgradePremium}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>{t('premium.upgradeNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 btn-outline flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>{t('common.goHome')}</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{t('results.stayOnResults')}</span>
          </button>
        </div>

        {/* Note informative */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            {t('results.reportNote')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ReportSuccessModal
