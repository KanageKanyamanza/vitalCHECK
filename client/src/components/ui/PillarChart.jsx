import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { getStatusColor, chartColors } from '../../utils/colors'

const PillarChart = ({ pillarScores }) => {
  // Utilise la fonction centralisée

  const data = pillarScores.map(pillar => ({
    name: pillar.pillarName.split(' ')[0], // Short name for display
    fullName: pillar.pillarName,
    score: pillar.score,
    status: pillar.status,
    fill: getStatusColor(pillar.status)
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <p className="text-sm text-gray-600">
            Score: <span className="font-medium">{data.score}/100</span>
          </p>
          <p className="text-sm text-gray-600">
            Statut: <span className="font-medium capitalize">{data.status}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: -3, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis 
            dataKey="name" 
            stroke={chartColors.text}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={chartColors.text}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="score" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default PillarChart
