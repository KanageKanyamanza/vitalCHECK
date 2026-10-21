import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react'
import { Button, PentagonSegments } from '../ui/ds'

// Étapes affichées : elles décrivent ce que fait réellement le calcul côté serveur
const STEPS = ['reading', 'scoring', 'recommendations']
const STEP_MS = 450

/**
 * Écran affiché pendant le calcul du score, avant la page de résultats.
 * status : 'running' | 'error'
 */
const AnalysisScreen = ({ status, answeredCount, onRetry, onBack }) => {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [stepsDone, setStepsDone] = useState(reduceMotion ? STEPS.length : 0)
  const headingRef = useRef(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [status])

  // Les étapes se cochent l'une après l'autre pendant le calcul
  useEffect(() => {
    if (status !== 'running' || reduceMotion) return undefined
    setStepsDone(0)
    const timers = STEPS.map((_, i) => setTimeout(() => setStepsDone(i + 1), STEP_MS * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [status, reduceMotion])

  if (status === 'error') {
    return (
      <section
        aria-labelledby="analysis-title"
        className="ubb-card flex flex-col items-center px-5 py-10 text-center sm:px-10"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ubb-accent-100 text-ubb-accent-ink">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2
          id="analysis-title"
          ref={headingRef}
          tabIndex={-1}
          className="ubb-heading mt-5 text-ubb-subtitle focus:outline-none"
        >
          {t('diagnostic.analysis.errorTitle')}
        </h2>
        <p className="mt-3 max-w-md font-text text-ubb-body text-ubb-ink-muted">
          {t('diagnostic.analysis.errorText')}
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col-reverse gap-3 sm:flex-row">
          <Button variant="outline" onClick={onBack} className="sm:flex-1">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('diagnostic.analysis.back')}
          </Button>
          <Button onClick={onRetry} className="sm:flex-1">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t('diagnostic.analysis.retry')}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="analysis-title"
      aria-busy="true"
      className="ubb-card flex flex-col items-center px-5 py-10 text-center sm:px-10 sm:py-12"
    >
      <motion.div
        animate={reduceMotion ? undefined : { rotate: [0, 72] }}
        transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.3 }}
      >
        <PentagonSegments done={5} className="h-28 w-28 sm:h-32 sm:w-32" />
      </motion.div>

      <h2
        id="analysis-title"
        ref={headingRef}
        tabIndex={-1}
        className="ubb-heading mt-6 text-ubb-subtitle focus:outline-none sm:text-2xl"
      >
        {t('diagnostic.analysis.title')}
      </h2>
      <p className="mt-2 max-w-md font-text text-ubb-body text-ubb-ink-muted">
        {t('diagnostic.analysis.subtitle')}
      </p>

      <ol className="mt-8 w-full max-w-sm space-y-3 text-left" aria-live="polite">
        {STEPS.map((step, i) => {
          const done = i < stepsDone
          return (
            <li key={step} className="flex items-center gap-3 font-text text-ubb-body">
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  done ? 'bg-ubb-brand-900 text-white' : 'border-2 border-ubb-brand-900/20'
                }`}
              >
                {done && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
              </span>
              <span className={done ? 'text-ubb-ink' : 'text-ubb-ink-muted'}>
                {t(`diagnostic.analysis.steps.${step}`, { count: answeredCount })}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default AnalysisScreen
