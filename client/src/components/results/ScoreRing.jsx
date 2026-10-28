import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const SIZE = 200
const STROKE = 16
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Jauge du score global (0-100). La couleur est celle du niveau de maturité
 * (rouge à vert) : c'est une information, pas de la décoration.
 */
const ScoreRing = ({ score, color, label }) => {
  const reduce = useReducedMotion()
  const value = Math.max(0, Math.min(100, score))

  return (
    <div className="relative mx-auto h-[200px] w-[200px]" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#EAF6EC" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={reduce ? false : { strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - value / 100) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="font-heading text-6xl font-bold leading-none tracking-tight text-ubb-ink">{score}</span>
        <span className="mt-1 font-text text-sm font-semibold text-ubb-ink-muted">/ 100</span>
      </div>
    </div>
  )
}

export default ScoreRing
