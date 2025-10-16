import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AssessmentContext = createContext()

const initialState = {
  user: null,
  questions: null,
  currentQuestionIndex: 0,
  answers: [],
  assessment: null,
  assessmentId: null,
  resumeToken: null,
  loading: false,
  error: null,
  language: 'fr'
}

function assessmentReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_USER':
      return { ...state, user: action.payload, error: null }
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload, error: null }
    
    case 'SET_ANSWER':
      const newAnswers = [...state.answers]
      const existingAnswerIndex = newAnswers.findIndex(
        answer => answer.questionId === action.payload.questionId
      )
      
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = action.payload
      } else {
        newAnswers.push(action.payload)
      }
      
      return { ...state, answers: newAnswers }
    
    case 'NEXT_QUESTION':
      return { 
        ...state, 
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1, 
          (state.questions?.pillars?.reduce((total, pillar) => total + pillar.questions.length, 0) || 1) - 1
        )
      }
    
    case 'PREVIOUS_QUESTION':
      return { 
        ...state, 
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      }
    
    case 'SET_ASSESSMENT':
      return { ...state, assessment: action.payload, loading: false }
    
    case 'SET_ASSESSMENT_ID':
      return { ...state, assessmentId: action.payload }
    
    case 'SET_RESUME_TOKEN':
      return { ...state, resumeToken: action.payload }
    
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload }
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    
    case 'RESET_ASSESSMENT':
      return { 
        ...state, 
        currentQuestionIndex: 0, 
        answers: [], 
        assessment: null,
        assessmentId: null,
        resumeToken: null,
        error: null
      }
    
    case 'CLEAR_STORAGE':
      localStorage.removeItem('VitalCHECK-assessment-data')
      return initialState
    
    default:
      return state
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('VitalCHECK-assessment-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedData })
      } catch (error) {
        localStorage.removeItem('VitalCHECK-assessment-data')
      }
    }
  }, [])

  // Save to localStorage whenever state changes (except loading and error states)
  useEffect(() => {
    const dataToSave = {
      user: state.user,
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      answers: state.answers,
      assessment: state.assessment,
      assessmentId: state.assessmentId,
      resumeToken: state.resumeToken,
      language: state.language
    }
    
    // Only save if we have meaningful data
    if (state.user || state.assessment || state.answers.length > 0) {
      localStorage.setItem('VitalCHECK-assessment-data', JSON.stringify(dataToSave))
    }
  }, [state.user, state.questions, state.currentQuestionIndex, state.answers, state.assessment, state.assessmentId, state.resumeToken, state.language])

  const value = {
    ...state,
    dispatch
  }

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider')
  }
  return context
}
