import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, 
  Mail, 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Star,
  Users,
  Target
} from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'
import { reportsAPI } from '../services/api'
import toast from 'react-hot-toast'
import ScoreGauge from '../components/ScoreGauge'
import PillarChart from '../components/PillarChart'
import RecommendationsList from '../components/RecommendationsList'
import ReportGenerationProgress from '../components/ReportGenerationProgress'

const ResultsPage = () => {
  const navigate = useNavigate()
  const { user, assessment, dispatch } = useAssessment()
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportError, setReportError] = useState(null)

  useEffect(() => {
    if (!assessment) {
      navigate('/')
      return
    }
  }, [assessment, navigate])

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    setReportError(null)
    
    try {
      // Simuler les étapes de génération
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response = await reportsAPI.generateReport(assessment.id)
      
      if (response.data.success) {
        setReportGenerated(true)
        toast.success('Rapport généré et envoyé par email !')
      }
    } catch (error) {
      console.error('Report generation error:', error)
      setReportError({
        message: error.response?.data?.message || 'Une erreur est survenue lors de la génération du rapport'
      })
      toast.error('Erreur lors de la génération du rapport')
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleRetryReport = () => {
    setReportError(null)
    handleGenerateReport()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'amber':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />
      case 'red':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'green':
        return 'En bonne santé'
      case 'amber':
        return 'À améliorer'
      case 'red':
        return 'Critique'
      default:
        return 'Inconnu'
    }
  }

  const getOverallMessage = () => {
    switch (assessment.overallStatus) {
      case 'green':
        return 'Félicitations ! Votre entreprise est en excellente santé et bien positionnée pour la croissance.'
      case 'amber':
        return 'Votre entreprise se développe mais a besoin de renforcement dans certains domaines.'
      case 'red':
        return 'Votre entreprise fait face à des défis critiques qui nécessitent une attention immédiate.'
      default:
        return 'Analyse en cours...'
    }
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Aucune évaluation trouvée</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Report Generation Progress Modal */}
      <ReportGenerationProgress
        isGenerating={generatingReport}
        error={reportError}
        onRetry={handleRetryReport}
      />

      {/* Action Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-gray-900">Health Check - Résultats</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="btn-outline flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Nouvelle évaluation</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.companyName}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Secteur: {user?.sector}</span>
            <span>•</span>
            <span>Taille: {user?.companySize}</span>
            <span>•</span>
            <span>Date: {new Date(assessment.completedAt).toLocaleDateString()}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Score */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Score Global de Santé
              </h2>
              
              <ScoreGauge 
                score={assessment.overallScore}
                status={assessment.overallStatus}
              />
              
              <div className="mt-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  {getStatusIcon(assessment.overallStatus)}
                  <span className="font-semibold text-gray-900">
                    {getStatusText(assessment.overallStatus)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {getOverallMessage()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chart and Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Pillar Chart */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Résultats par Pilier
              </h3>
              <PillarChart pillarScores={assessment.pillarScores} />
            </div>

            {/* Pillar Details */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Détail des Piliers
              </h3>
              <div className="space-y-4">
                {assessment.pillarScores.map((pillar, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(pillar.status)}
                      <span className="font-medium text-gray-900">{pillar.pillarName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-900">{pillar.score}</span>
                      <span className="text-sm text-gray-500">/100</span>
                      <span className={`status-badge status-${pillar.status}`}>
                        {getStatusText(pillar.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <RecommendationsList pillarScores={assessment.pillarScores} />
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Prochaines Étapes
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Report */}
              <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Download className="w-6 h-6 text-primary-500" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Rapport Gratuit
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Recevez votre rapport détaillé par email avec des recommandations personnalisées.
                </p>
                <button
                  onClick={handleGenerateReport}
                  disabled={generatingReport || reportGenerated}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {generatingReport ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : reportGenerated ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Rapport envoyé</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Générer le rapport</span>
                    </>
                  )}
                </button>
              </div>

              {/* Premium Upgrade */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-6 h-6 text-purple-500" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Rapport Premium
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Analyse approfondie, benchmarking sectoriel et consultation avec nos experts.
                </p>
                <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Débloquer Premium</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultsPage
