import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progression
        </span>
        <span className="text-sm font-medium text-gray-700">
          {current} / {total}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="text-center mt-2">
        <span className="text-lg font-semibold text-primary-600">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  )
}

export default ProgressBar
