import React, { createContext, useContext, useReducer } from 'react'

const AssessmentContext = createContext()

const initialState = {
  user: null,
  questions: null,
  currentQuestionIndex: 0,
  answers: [],
  assessment: null,
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
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    
    case 'RESET_ASSESSMENT':
      return { 
        ...state, 
        currentQuestionIndex: 0, 
        answers: [], 
        assessment: null,
        error: null
      }
    
    default:
      return state
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState)

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
