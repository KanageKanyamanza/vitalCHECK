import React, { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button, PentagonSegments } from '../ui/ds'

/**
 * Respiration entre deux piliers : pilier terminé, encouragement, pilier suivant.
 * Pas de minuterie : la personne repart quand elle le décide.
 */
const PillarTransition = ({ pillarIndex, pillarNames, nextPillarQuestionCount, onContinue, onBack }) => {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [pillarIndex])

  const done = pillarIndex + 1
  const total = pillarNames.length
  const nextName = pillarNames[pillarIndex + 1]

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      aria-labelledby="pillar-break-title"
      className="ubb-card flex flex-col items-center px-5 py-8 text-center sm:px-10 sm:py-12"
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 0.85, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        <PentagonSegments
          done={done}
          className="h-32 w-32 sm:h-40 sm:w-40"
          strokeWidth={3}
          title={t('diagnostic.pillarBreak.pentagonLabel', { count: done, total })}
        />
      </motion.div>

      <p className="mt-6 font-text text-sm font-semibold text-ubb-brand-900">
        {t('diagnostic.pillarBreak.count', { count: done, total })}
      </p>
      <h2
        id="pillar-break-title"
        ref={headingRef}
        tabIndex={-1}
        className="ubb-heading mt-1 max-w-md text-ubb-subtitle focus:outline-none sm:text-2xl"
      >
        {t('diagnostic.pillarBreak.title', { name: pillarNames[pillarIndex] })}
      </h2>
      <p className="mt-3 max-w-md font-text text-ubb-body text-ubb-ink-muted">
        {t(`diagnostic.pillarBreak.encouragement.${Math.min(pillarIndex, 3)}`)}
      </p>

      {nextName && (
        <div className="mt-8 w-full max-w-md rounded-ubb-field bg-ubb-mist px-5 py-4 text-left">
          <p className="font-text text-xs font-semibold text-ubb-ink-muted">
            {t('diagnostic.pillarBreak.nextLabel', { number: pillarIndex + 2, total })}
          </p>
          <p className="mt-0.5 font-heading text-lg font-semibold text-ubb-ink">{nextName}</p>
          <p className="mt-0.5 font-text text-sm text-ubb-ink-muted">
            {t('diagnostic.pillarBreak.nextMeta', { count: nextPillarQuestionCount })}
          </p>
        </div>
      )}

      <div className="mt-8 flex w-full max-w-md flex-col-reverse gap-3 sm:flex-row">
        <Button variant="outline" onClick={onBack} className="sm:flex-1">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('diagnostic.pillarBreak.back')}
        </Button>
        <Button onClick={onContinue} className="sm:flex-1">
          {t('diagnostic.pillarBreak.continue')}
        </Button>
      </div>
    </motion.section>
  )
}

export default PillarTransition
