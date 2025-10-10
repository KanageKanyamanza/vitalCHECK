import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Mail, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SubmissionProgress = ({ currentStep, error, onRetry }) => {
  const { t } = useTranslation()
  
  const steps = [
    {
      id: 'validating',
      title: t('results.submissionProgress.steps.validating.title'),
      description: t('results.submissionProgress.steps.validating.description'),
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'calculating',
      title: t('results.submissionProgress.steps.calculating.title'),
      description: t('results.submissionProgress.steps.calculating.description'),
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'generating',
      title: t('results.submissionProgress.steps.generating.title'),
      description: t('results.submissionProgress.steps.generating.description'),
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'saving',
      title: t('results.submissionProgress.steps.saving.title'),
      description: t('results.submissionProgress.steps.saving.description'),
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'complete',
      title: t('results.submissionProgress.steps.complete.title'),
      description: t('results.submissionProgress.steps.complete.description'),
      icon: <CheckCircle className="w-5 h-5" />
    }
  ]

  const getStepStatus = (stepId) => {
    if (error && stepId === currentStep) return 'error'
    if (steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === stepId)) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-500 bg-success-100'
      case 'active':
        return 'text-primary-500 bg-primary-100'
      case 'error':
        return 'text-danger-500 bg-danger-100'
      default:
        return 'text-gray-400 bg-gray-100'
    }
  }

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5 
        }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {t('results.submissionProgress.title')}
          </h3>
          <p className="text-gray-600 text-sm">
            {t('results.submissionProgress.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const isCompleted = status === 'completed'
            const isActive = status === 'active'
            const isError = status === 'error'

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-primary-50 border border-primary-200' : 
                  isCompleted ? 'bg-success-50 border border-success-200' :
                  isError ? 'bg-danger-50 border border-danger-200' :
                  'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${getStepColor(status)}`}>
                  {isError ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      {step.icon}
                    </motion.div>
                  ) : (
                    step.icon
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={`font-semibold transition-colors duration-300 ${
                    isActive ? 'text-primary-900' :
                    isCompleted ? 'text-success-900' :
                    isError ? 'text-danger-900' :
                    'text-gray-700'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm transition-colors duration-300 ${
                    isActive ? 'text-primary-700' :
                    isCompleted ? 'text-success-700' :
                    isError ? 'text-danger-700' :
                    'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {isActive && (
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-danger-500" />
              <div className="flex-1">
                <h4 className="font-semibold text-danger-900">{t('results.submissionProgress.error.title')}</h4>
                <p className="text-sm text-danger-700 mt-1">
                  {error.message || t('results.submissionProgress.error.message')}
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={onRetry}
                className="btn-primary text-sm px-4 py-2"
              >
                {t('results.submissionProgress.error.retry')}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-outline text-sm px-4 py-2"
              >
                {t('results.submissionProgress.error.reload')}
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-4 text-center">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.max(0, ((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100)}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('results.submissionProgress.stepCounter', { 
              current: Math.max(1, steps.findIndex(s => s.id === currentStep) + 1), 
              total: steps.length 
            })}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SubmissionProgress
