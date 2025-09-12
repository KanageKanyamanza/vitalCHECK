import React from 'react'
import { motion } from 'framer-motion'
import { getStatusColor, chartColors } from '../../utils/colors'

const ScoreGauge = ({ score, status }) => {
  // Utilise la fonction centralisée

  const color = getStatusColor(status)
  const circumference = 2 * Math.PI * 60 // radius = 60
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r="60"
          stroke={chartColors.grid}
          strokeWidth="12"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="70"
          cy="70"
          r="60"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <div className="text-4xl font-bold text-gray-900">
            {score}
          </div>
          <div className="text-sm text-gray-500">
            / 100
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ScoreGauge
