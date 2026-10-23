import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { pentagonVertices, pentagonPoints } from '../ui/ds/Pentagon'

const CENTER = 160
const RADIUS = 100

/**
 * Radar des 5 piliers : un pentagone dont chaque sommet est un pilier, plus le point est loin
 * du centre, meilleur est le score. Les sommets sont numérotés ; la liste voisine donne les noms.
 * `pillars` : [{ score, color }] dans l'ordre d'affichage. `label` : résumé pour les lecteurs d'écran.
 */
const PillarRadar = ({ pillars, label }) => {
  const reduce = useReducedMotion()
  const axes = pentagonVertices(RADIUS, 0)
  const labels = pentagonVertices(RADIUS + 30, 0)
  const dataPoints = pillars.map((p, i) => {
    const [x, y] = axes[i]
    const k = Math.max(0, Math.min(100, p.score)) / 100
    return [x * k, y * k]
  })
  const polygon = dataPoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  return (
    <svg viewBox="0 0 320 310" className="mx-auto h-auto w-full max-w-[340px]" role="img" aria-label={label}>
      <g transform={`translate(${CENTER} 160)`}>
        {/* Grille : 25 / 50 / 75 / 100 */}
        {[0.25, 0.5, 0.75, 1].map((k) => (
          <polygon key={k} points={pentagonPoints(RADIUS * k, 0)} fill={k === 1 ? '#F8FAF8' : 'none'} stroke="#DCF0E0" strokeWidth="2" />
        ))}
        {axes.map(([x, y], i) => (
          <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#DCF0E0" strokeWidth="2" />
        ))}

        {/* Zone des scores */}
        <motion.polygon
          points={polygon}
          fill="#F4C542"
          fillOpacity="0.4"
          stroke="#00751B"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ transformOrigin: '0px 0px' }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
        {dataPoints.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" fill={pillars[i].color} stroke="#FFFFFF" strokeWidth="3" />
        ))}

        {/* Numéros des piliers */}
        {labels.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="14" fill="#00751B" />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#FFFFFF" fontFamily="Figtree, sans-serif">
              {i + 1}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default PillarRadar
