import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LEVELS_V2, getLevelV2 } from '../../utils/colors'

// Score d'exemple affiché sur la landing (clairement présenté comme un exemple)
const SAMPLE_SCORE = 72

const CENTER = 60
const RING_STEP = 11

// Sommets d'un pentagone régulier, pointe en haut
const pentagonPoints = (radius) =>
  Array.from({ length: 5 }, (_, i) => {
    const angle = (-90 + i * 72) * (Math.PI / 180)
    return `${(CENTER + radius * Math.cos(angle)).toFixed(2)},${(CENTER + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')

// Du niveau 1 (centre) au niveau 5 (extérieur) : les niveaux atteints sont dorés
const REACHED_FILLS = ['#E8972A', '#F5A83C', '#F8C478', '#FCE3BE', '#FEF5E7']
const PENDING_FILL = '#E8ECF3'

/**
 * Signature visuelle de la landing : les 5 niveaux de maturité UBB
 * représentés en pentagones concentriques, le niveau atteint en or.
 */
const HeroScoreCard = ({ className = '' }) => {
  const { t, i18n } = useTranslation()
  const reduceMotion = useReducedMotion()
  const lang = (i18n.language || 'fr').slice(0, 2)

  const level = getLevelV2(SAMPLE_SCORE)
  const levelIndex = LEVELS_V2.findIndex((l) => l.id === level.id)
  const levelLabel = level.label[lang] || level.label.fr

  // Dessin de l'extérieur vers l'intérieur pour que chaque anneau recouvre le précédent
  const rings = [4, 3, 2, 1, 0]

  return (
    <motion.figure
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
      className={`ubb-card flex items-center gap-4 p-4 shadow-ubb-lg sm:gap-5 sm:p-5 ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
        role="img"
        aria-label={t('landing.hero.scoreCard.chartLabel', {
          level: levelIndex + 1,
          name: levelLabel,
        })}
      >
        {rings.map((ring) => (
          <motion.polygon
            key={ring}
            points={pentagonPoints(RING_STEP * (ring + 1) + 3)}
            fill={ring <= levelIndex ? REACHED_FILLS[ring] : PENDING_FILL}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
            initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.55 + (4 - ring) * 0.08, ease: 'easeOut' }}
          />
        ))}
      </svg>

      <figcaption className="min-w-0 font-text">
        <p className="text-ubb-small text-ubb-ink-muted">{t('landing.hero.scoreCard.label')}</p>
        <p className="mt-1 flex items-baseline gap-1 text-ubb-ink">
          <span className="font-heading text-4xl font-bold leading-none tracking-tight">
            {SAMPLE_SCORE}
          </span>
          <span className="text-sm font-semibold text-ubb-ink-muted">/100</span>
        </p>
        <p className="mt-2 text-sm font-semibold text-ubb-ink">{levelLabel}</p>
        <p className="text-ubb-small text-ubb-ink-muted">
          {t('landing.hero.scoreCard.levelOf', { level: levelIndex + 1, total: LEVELS_V2.length })}
        </p>
      </figcaption>
    </motion.figure>
  )
}

export default HeroScoreCard
