import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAssessment } from '../context/AssessmentContext'
import { assessmentAPI } from '../services/api'
import toast from 'react-hot-toast'
import { ProgressBar, QuestionCard, SubmissionProgress } from '../components/assessment'
import useSmoothScroll from '../hooks/useSmoothScroll'

const AssessmentPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { scrollToTop } = useSmoothScroll()
  const { 
    user, 
    questions, 
    currentQuestionIndex, 
    answers, 
    loading, 
    language,
    assessmentId,
    dispatch 
  } = useAssessment()
  
  const [submitting, setSubmitting] = useState(false)
  const [submissionStep, setSubmissionStep] = useState(null)
  const [submissionError, setSubmissionError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    loadQuestions()
    createDraftAssessment()
  }, [user, navigate])

  const createDraftAssessment = async () => {
    try {
      console.log('🆕 [FRONTEND] Création du draft assessment pour userId:', user.id);
      
      const response = await assessmentAPI.createDraft({
        userId: user.id,
        language
      });

      if (response.data.success) {
        const { assessment } = response.data;
        console.log('✅ [FRONTEND] Draft créé:', {
          id: assessment.id,
          resumeToken: assessment.resumeToken,
          currentQuestionIndex: assessment.currentQuestionIndex
        });
        
        dispatch({ type: 'SET_ASSESSMENT_ID', payload: assessment.id });
        dispatch({ type: 'SET_RESUME_TOKEN', payload: assessment.resumeToken });
        
        // Si on a des réponses existantes, les charger
        if (assessment.answers && assessment.answers.length > 0) {
          console.log('📋 [FRONTEND] Chargement des réponses existantes:', assessment.answers.length);
          assessment.answers.forEach(answer => {
            dispatch({
              type: 'SET_ANSWER',
              payload: { questionId: answer.questionId, answer: answer.answer }
            });
          });
          dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: assessment.currentQuestionIndex });
        }
      }
    } catch (error) {
      console.error('❌ [FRONTEND] Erreur création draft:', error);
      // Ne pas bloquer l'évaluation si la création du draft échoue
    }
  }

  const saveProgress = async () => {
    try {
      if (!assessmentId) {
        console.log('⚠️ [FRONTEND] Pas d\'assessmentId, impossible de sauvegarder');
        return;
      }

      console.log('💾 [FRONTEND] Sauvegarde de la progression:', {
        assessmentId,
        answersCount: answers.length,
        currentQuestionIndex
      });

      await assessmentAPI.saveProgress(assessmentId, {
        answers,
        currentQuestionIndex
      });

      console.log('✅ [FRONTEND] Progression sauvegardée avec succès');
    } catch (error) {
      console.error('❌ [FRONTEND] Erreur sauvegarde progression:', error);
      // Ne pas bloquer l'évaluation si la sauvegarde échoue
    }
  }

  const loadQuestions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Mode développement : utiliser des questions statiques si l'API échoue
      try {
        const response = await assessmentAPI.getQuestions(language)
        
        if (response.data.success) {
          dispatch({ type: 'SET_QUESTIONS', payload: response.data.data })
          return
        }
      } catch (apiError) {
        console.warn('API not available, using static questions:', apiError)
        
        // Utiliser des questions statiques en mode développement
        const staticQuestions = {
          pillars: [
            {
              id: "finance",
              name: "Finance & Cash Flow",
              questions: [
                {
                  id: "f1",
                  text: "Do you have up-to-date financial statements (P&L, Balance Sheet, Cash Flow)?",
                  options: [
                    { label: "No records", score: 0 },
                    { label: "Basic records, not updated", score: 1 },
                    { label: "Updated quarterly", score: 2 },
                    { label: "Updated monthly", score: 3 }
                  ]
                },
                {
                  id: "f2",
                  text: "How many months of cash reserves can your business cover?",
                  options: [
                    { label: "< 1 month", score: 0 },
                    { label: "1–3 months", score: 1 },
                    { label: "3–6 months", score: 2 },
                    { label: "> 6 months", score: 3 }
                  ]
                }
              ],
              recommendations: {
                red: ["Start keeping monthly records.", "Separate personal and business finances."],
                amber: ["Build a 3–6 month cash forecast.", "Track receivables more closely."],
                green: ["Explore funding options for growth.", "Use financial dashboards to monitor KPIs."]
              }
            },
            {
              id: "operations",
              name: "Operations & Processes",
              questions: [
                {
                  id: "o1",
                  text: "Are your business processes documented?",
                  options: [
                    { label: "Not at all", score: 0 },
                    { label: "Some processes only", score: 1 },
                    { label: "Most processes documented", score: 2 },
                    { label: "Fully standardized & automated", score: 3 }
                  ]
                },
                {
                  id: "o2",
                  text: "How do you monitor operational efficiency?",
                  options: [
                    { label: "No monitoring", score: 0 },
                    { label: "Ad-hoc checks", score: 1 },
                    { label: "Regular reviews", score: 2 },
                    { label: "Data-driven KPIs", score: 3 }
                  ]
                }
              ],
              recommendations: {
                red: ["Document at least your core processes."],
                amber: ["Standardize workflows and add simple KPIs."],
                green: ["Automate processes and consider ERP systems."]
              }
            }
          ],
          scoring: {
            thresholds: { red: [0, 39], amber: [40, 69], green: [70, 100] },
            logic: "Average question scores × 25 = pillar score. Overall score = mean of all pillar scores."
          }
        }
        
        dispatch({ type: 'SET_QUESTIONS', payload: staticQuestions })
        toast.success('Mode développement : Questions chargées localement')
        return
      }
      
      throw new Error('Failed to load questions')
    } catch (error) {
      console.error('Error loading questions:', error)
      toast.error('Erreur lors du chargement des questions')
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des questions' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getCurrentQuestion = () => {
    if (!questions?.pillars) return null

    let questionIndex = 0
    for (const pillar of questions.pillars) {
      for (const question of pillar.questions) {
        if (questionIndex === currentQuestionIndex) {
          return {
            ...question,
            pillarName: pillar.name,
            pillarId: pillar.id
          }
        }
        questionIndex++
      }
    }
    return null
  }

  const getTotalQuestions = () => {
    return questions?.pillars?.reduce((total, pillar) => total + pillar.questions.length, 0) || 0
  }

  const handleAnswerSelect = (questionId, score) => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { questionId, answer: score }
    })
    
    // Sauvegarder automatiquement la progression
    saveProgress()
  }

  const handleNext = () => {
    const totalQuestions = getTotalQuestions()
    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch({ type: 'NEXT_QUESTION' })
      // Sauvegarder la progression après changement de question
      saveProgress()
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' })
    }
  }

  const handleSubmit = async () => {
    if (answers.length !== getTotalQuestions()) {
      toast.error('Veuillez répondre à toutes les questions')
      return
    }

    setSubmitting(true)
    setSubmissionError(null)
    setSubmissionStep('validating')

    try {
      // Étape 1: Validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmissionStep('calculating')

      // Étape 2: Calcul des scores
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmissionStep('generating')

      // Étape 3: Génération du rapport
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmissionStep('saving')

      // Étape 4: Soumission réelle
      const response = await assessmentAPI.submitAssessment({
        userId: user.id,
        answers,
        language
      })

      if (response.data.success) {
        setSubmissionStep('complete')
        
        // Attendre un peu pour montrer la completion
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        dispatch({ type: 'SET_ASSESSMENT', payload: response.data.assessment })
        toast.success('Évaluation terminée avec succès !')
        
        // Scroll smooth vers le haut avant la navigation
        scrollToTop(500)
        
        // Attendre un peu pour que le scroll se termine
        await new Promise(resolve => setTimeout(resolve, 300))
        
        navigate('/results')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmissionError({
        message: error.response?.data?.message || 'Une erreur est survenue lors de la soumission'
      })
      toast.error('Erreur lors de la soumission de l\'évaluation')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setSubmissionError(null)
    setSubmissionStep(null)
    handleSubmit()
  }

  const getCurrentAnswer = () => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return null
    
    return answers.find(answer => answer.questionId === currentQuestion.id)
  }

  const isLastQuestion = currentQuestionIndex === getTotalQuestions() - 1
  const currentAnswer = getCurrentAnswer()
  const canProceed = currentAnswer !== null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des questions...</p>
          <p className="text-sm text-gray-500 mt-2">
            Si ce chargement prend trop de temps, vérifiez que le serveur backend est démarré
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-outline text-sm"
          >
            Recharger la page
          </button>
        </div>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('common.error')}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            {t('navigation.home')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-[70px] bg-gray-50">
      {/* Submission Progress Modal */}
      {submitting && (
        <SubmissionProgress
          currentStep={submissionStep}
          error={submissionError}
          onRetry={handleRetry}
        />
      )}

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="sm:text-lg font-bold text-gray-900">{t('assessment.title')}</span>
            </div>
            <div className="text-lg text-gray-600">
              {user?.companyName}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <ProgressBar 
          current={currentQuestionIndex + 1}
          total={getTotalQuestions()}
        />

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={getCurrentQuestion()}
              selectedAnswer={currentAnswer?.answer}
              onAnswerSelect={handleAnswerSelect}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className='hidden sm:block'>{t('common.previous')}</span>
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4" />
            <span>{answers.length} / {getTotalQuestions()} {t('assessment.responses')}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed || submitting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className='hidden sm:block'>{isLastQuestion ? t('common.finish') : t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentPage
