import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { useAssessment } from '../context/AssessmentContext'
import { assessmentAPI } from '../services/api'
import toast from 'react-hot-toast'
import { ProgressBar, QuestionCard, SubmissionProgress } from '../components/assessment'
import useSmoothScroll from '../hooks/useSmoothScroll'
import { useTranslation } from 'react-i18next'

const ResumeAssessmentPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { scrollToTop } = useSmoothScroll()
  const { t } = useTranslation()
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
  
  const [resumeLoading, setResumeLoading] = useState(true)
  const [resumeError, setResumeError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissionStep, setSubmissionStep] = useState(null)
  const [submissionError, setSubmissionError] = useState(null)
  const [hasResumed, setHasResumed] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }

    if (!hasResumed) {
      resumeAssessment()
    }
  }, [token, hasResumed])

  const resumeAssessment = async () => {
    try {
      console.log('🔄 [RESUME] Début de la reprise avec token:', token);
      setResumeLoading(true)
      setResumeError(null)

      const response = await assessmentAPI.resumeAssessment(token)
      
      if (response.data.success) {
        const { assessment } = response.data
        console.log('✅ [RESUME] Données reçues:', {
          id: assessment.id,
          resumeToken: assessment.resumeToken,
          currentQuestionIndex: assessment.currentQuestionIndex,
          answersCount: assessment.answers.length,
          user: assessment.user?.companyName
        });
        
        // Set user data
        dispatch({ type: 'SET_USER', payload: assessment.user })
        
        // Set assessment data
        dispatch({ type: 'SET_ASSESSMENT_ID', payload: assessment.id })
        dispatch({ type: 'SET_RESUME_TOKEN', payload: assessment.resumeToken })
        dispatch({ type: 'SET_LANGUAGE', payload: assessment.language })
        
        // Load existing answers
        if (assessment.answers && assessment.answers.length > 0) {
          console.log('📋 [RESUME] Chargement des réponses existantes:', assessment.answers.length);
          
          // Filtrer les réponses valides (avec questionId et answer définis)
          const validAnswers = assessment.answers.filter(answer => 
            answer && 
            answer.questionId && 
            answer.answer !== undefined && 
            answer.answer !== null
          );
          
          console.log('📋 [RESUME] Réponses valides trouvées:', validAnswers.length);
          
          validAnswers.forEach(answer => {
            dispatch({
              type: 'SET_ANSWER',
              payload: { questionId: answer.questionId, answer: answer.answer }
            });
          });
        }
        
        dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: assessment.currentQuestionIndex })
        
        // Load questions
        await loadQuestions(assessment.language)
        
        console.log('✅ [RESUME] Évaluation reprise avec succès');
        toast.success(t('resume.success'))
        setHasResumed(true)
      }
    } catch (error) {
      console.error('❌ [RESUME] Erreur reprise:', error)
      setResumeError(error.response?.data?.message || t('resume.errorMessage'))
      toast.error(t('resume.errorMessage'))
    } finally {
      setResumeLoading(false)
    }
  }

  const loadQuestions = async (lang = 'fr') => {
    try {
      console.log('📚 [RESUME] Chargement des questions pour langue:', lang);
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await assessmentAPI.getQuestions(lang)
      
      if (response.data.success) {
        console.log('✅ [RESUME] Questions chargées:', response.data.data?.pillars?.length || 0, 'piliers');
        dispatch({ type: 'SET_QUESTIONS', payload: response.data.data })
      }
    } catch (error) {
      console.error('❌ [RESUME] Erreur chargement questions:', error)
      dispatch({ type: 'SET_ERROR', payload: t('resume.loadingQuestions') })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const saveProgress = async () => {
    try {
      console.log('💾 [RESUME] Tentative de sauvegarde - État actuel:', {
        assessmentId,
        answersCount: answers.length,
        currentQuestionIndex,
        hasAssessmentId: !!assessmentId
      });

      if (!assessmentId) {
        console.log('⚠️ [RESUME] Pas d\'assessmentId, impossible de sauvegarder');
        return;
      }

      console.log('💾 [RESUME] Sauvegarde de la progression:', {
        assessmentId,
        answersCount: answers.length,
        currentQuestionIndex
      });

      const response = await assessmentAPI.saveProgress(assessmentId, {
        answers,
        currentQuestionIndex
      });

      console.log('✅ [RESUME] Progression sauvegardée avec succès:', response.data);
    } catch (error) {
      console.error('❌ [RESUME] Erreur sauvegarde progression:', error);
      console.error('❌ [RESUME] Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Ne pas bloquer l'évaluation si la sauvegarde échoue
    }
  }

  const saveProgressWithCurrentState = async () => {
    try {
      // Utiliser les valeurs actuelles du contexte via une fonction callback
      const currentAnswers = answers;
      const currentIndex = currentQuestionIndex;
      
      console.log('💾 [RESUME] Sauvegarde avec état actuel:', {
        assessmentId,
        answersCount: currentAnswers.length,
        currentQuestionIndex: currentIndex,
        hasAssessmentId: !!assessmentId
      });

      if (!assessmentId) {
        console.log('⚠️ [RESUME] Pas d\'assessmentId, impossible de sauvegarder');
        return;
      }

      const response = await assessmentAPI.saveProgress(assessmentId, {
        answers: currentAnswers,
        currentQuestionIndex: currentIndex
      });

      console.log('✅ [RESUME] Progression sauvegardée avec succès:', response.data);
    } catch (error) {
      console.error('❌ [RESUME] Erreur sauvegarde progression:', error);
      console.error('❌ [RESUME] Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Ne pas bloquer l'évaluation si la sauvegarde échoue
    }
  }

  const saveProgressWithAnswers = async (answersToSave, questionIndex) => {
    try {
      console.log('💾 [RESUME] Sauvegarde avec réponses spécifiques:', {
        assessmentId,
        answersCount: answersToSave.length,
        currentQuestionIndex: questionIndex,
        hasAssessmentId: !!assessmentId
      });

      if (!assessmentId) {
        console.log('⚠️ [RESUME] Pas d\'assessmentId, impossible de sauvegarder');
        return;
      }

      const response = await assessmentAPI.saveProgress(assessmentId, {
        answers: answersToSave,
        currentQuestionIndex: questionIndex
      });

      console.log('✅ [RESUME] Progression sauvegardée avec succès:', response.data);
    } catch (error) {
      console.error('❌ [RESUME] Erreur sauvegarde progression:', error);
      console.error('❌ [RESUME] Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Ne pas bloquer l'évaluation si la sauvegarde échoue
    }
  }

  const handleAnswerSelect = (questionId, score) => {
    // Créer la nouvelle réponse
    const newAnswer = { questionId, answer: score }
    
    // Mettre à jour le contexte
    dispatch({
      type: 'SET_ANSWER',
      payload: newAnswer
    })
    
    // Créer le nouveau tableau de réponses pour la sauvegarde
    const updatedAnswers = answers.filter(a => a.questionId !== questionId)
    updatedAnswers.push(newAnswer)
    
    // Sauvegarder immédiatement avec les nouvelles valeurs
    setTimeout(() => {
      saveProgressWithAnswers(updatedAnswers, currentQuestionIndex)
    }, 100)
  }

  const handleNext = () => {
    const totalQuestions = getTotalQuestions()
    if (currentQuestionIndex < totalQuestions - 1) {
      const newIndex = currentQuestionIndex + 1
      const currentAnswers = answers // Capturer les réponses actuelles
      dispatch({ type: 'NEXT_QUESTION' })
      scrollToTop()
      // Sauvegarder la progression après changement de question
      setTimeout(() => {
        saveProgressWithAnswers(currentAnswers, newIndex)
      }, 100)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' })
    scrollToTop()
  }

  const handleSubmit = async () => {
    if (answers.length !== getTotalQuestions()) {
      toast.error(t('assessment.pleaseAnswerAll'))
      return
    }

    setSubmitting(true)
    setSubmissionError(null)
    setSubmissionStep('validating')

    try {
      console.log('🚀 [RESUME] Soumission de l\'évaluation:', {
        assessmentId,
        answersCount: answers.length,
        userId: user.id
      });

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
        language,
        assessmentId // Utiliser l'ID existant pour mettre à jour le draft
      })

      if (response.data.success) {
        setSubmissionStep('complete')
        
        // Attendre un peu pour montrer la completion
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        dispatch({ type: 'SET_ASSESSMENT', payload: response.data.assessment })
        toast.success(t('assessment.completedSuccessfully'))
        
        // Scroll smooth vers le haut avant la navigation
        scrollToTop(500)
        
        // Attendre un peu pour que le scroll se termine
        await new Promise(resolve => setTimeout(resolve, 300))
        
        navigate('/results')
      }
    } catch (error) {
      console.error('❌ [RESUME] Erreur soumission:', error)
      setSubmissionError({
        message: error.response?.data?.message || t('assessment.submissionError')
      })
      toast.error(t('assessment.submissionError'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setSubmissionError(null)
    setSubmissionStep(null)
    handleSubmit()
  }

  const getCurrentQuestion = () => {
    if (!questions?.pillars) return null
    
    let questionIndex = 0
    for (const pillar of questions.pillars) {
      if (currentQuestionIndex < questionIndex + pillar.questions.length) {
        return {
          ...pillar.questions[currentQuestionIndex - questionIndex],
          pillarName: pillar.name,
          pillarId: pillar.id
        }
      }
      questionIndex += pillar.questions.length
    }
    return null
  }

  const getTotalQuestions = () => {
    return questions?.pillars?.reduce((total, pillar) => total + pillar.questions.length, 0) || 0
  }

  const getCurrentAnswer = () => {
    const currentQuestion = getCurrentQuestion()
    if (!currentQuestion) return null
    
    return answers.find(answer => answer.questionId === currentQuestion.id)
  }

  const isLastQuestion = currentQuestionIndex === getTotalQuestions() - 1
  const currentAnswer = getCurrentAnswer()
  const canProceed = currentAnswer !== null

  if (resumeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('resume.loading')}</p>
        </div>
      </div>
    )
  }

  if (resumeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('resume.error')}</h1>
          <p className="text-gray-600 mb-6">{resumeError}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('resume.backToHome')}
          </button>
        </div>
      </div>
    )
  }


  if (!questions || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('resume.loadingQuestions')}</p>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('resume.questionNotFound')}</h1>
          <p className="text-gray-600 mb-6">{t('resume.questionNotFoundMessage')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('resume.backToHome')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-[70px] bg-gray-50">
      {/* Submission Progress Modal */}
      <AnimatePresence>
        {submitting && (
          <SubmissionProgress
            currentStep={submissionStep}
            error={submissionError}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="sm:text-lg font-bold text-gray-900">{t('resume.title')}</span>
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

export default ResumeAssessmentPage
