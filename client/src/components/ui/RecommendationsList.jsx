import React from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, Target, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const RecommendationsList = ({ pillarScores }) => {
  const { t } = useTranslation()
  const getStatusIcon = (status) => {
    switch (status) {
      case 'green':
        return <TrendingUp className="w-5 h-5 text-success-500" />
      case 'amber':
        return <Target className="w-5 h-5 text-warning-500" />
      case 'red':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />
      default:
        return <Lightbulb className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'green':
        return 'border-success-200 bg-success-50'
      case 'amber':
        return 'border-warning-200 bg-warning-50'
      case 'red':
        return 'border-danger-200 bg-danger-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'green':
        return t('results.optimization')
      case 'amber':
        return t('results.improvement')
      case 'red':
        return t('results.priority')
      default:
        return 'Recommandation'
    }
  }

  // Filter pillars that have recommendations and are not green
  const pillarsWithRecommendations = pillarScores.filter(
    pillar => pillar.recommendations && pillar.recommendations.length > 0 && pillar.status !== 'green'
  )

  // If all pillars are green, show optimization recommendations
  const allGreen = pillarScores.every(pillar => pillar.status === 'green')

  if (allGreen) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-success-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Félicitations ! {t('results.optimization')}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border border-success-200 bg-success-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-success-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-success-900 mb-2">
                  Maintenir l'Excellence
                </h4>
                <p className="text-success-700 text-sm">
                  Votre entreprise est en excellente santé. Continuez à surveiller vos indicateurs 
                  et explorez des opportunités d'expansion et d'innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg p-4 bg-white shadow-lg border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {t('results.keyRecommendations')}
        </h3>
      </div>
      
      <div className="sm:space-y-6 space-y-2">
        {pillarsWithRecommendations.map((pillar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`sm:p-6 p-2 border rounded-lg ${getStatusColor(pillar.status)}`}
          >
            <div className="flex items-center sm:space-x-3 space-x-1 mb-4">
              {getStatusIcon(pillar.status)}
              <h4 className="text-lg font-semibold text-gray-900">
                {pillar.pillarName}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                pillar.status === 'red' ? 'bg-danger-100 text-danger-800' :
                pillar.status === 'amber' ? 'bg-warning-100 text-warning-800' :
                'bg-success-100 text-success-800'
              }`}>
                {getStatusText(pillar.status)}
              </span>
            </div>
            
            <div className="space-y-3">
              {pillar.recommendations.slice(0, 2).map((recommendation, recIndex) => (
                <div key={recIndex} className="flex items-start sm:space-x-3 space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full mt-2 opacity-60" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Target className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">
              {t('results.premiumReport2.title')}
            </h4>
            <p className="text-blue-700 text-sm">
              {t('results.premiumReport2.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsList
