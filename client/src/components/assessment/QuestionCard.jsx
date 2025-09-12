import React from 'react'
import { motion } from 'framer-motion'

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect }) => {
  if (!question) return null

  const handleOptionClick = (score) => {
    onAnswerSelect(question.id, score)
  }

  return (
    <div className="card">
      <div className="mb-6">
        <div className="text-sm font-medium text-primary-600 mb-2">
          {question.pillarName}
        </div>
        <h2 className="sm:text-2xl text-lg font-bold text-gray-900 leading-tight">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleOptionClick(option.score)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === option.score
                ? 'border-primary-500 bg-primary-50 text-primary-900'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === option.score
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option.score && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">{option.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
