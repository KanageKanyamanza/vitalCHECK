import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { PentagonSegments } from '../ui/ds'

// Durée moyenne par question : 25 questions en 5 à 7 minutes, soit environ 15 secondes
const SECONDS_PER_QUESTION = 15

/**
 * Indicateur de progression, collé sous l'en-tête du diagnostic.
 * - pilier en cours et question dans le pilier (« Pilier 2 sur 5 », « Question 3 sur 5 »)
 * - 25 segments groupés par pilier : répondu (vert), en cours (jaune), à venir (clair)
 * - temps restant estimé à partir des questions sans réponse
 */
const DiagnosticProgress = ({ questions, currentIndex, answeredIds, pillarNames }) => {
  const { t } = useTranslation()

  const current = questions[currentIndex]
  if (!current) return null

  const pillarCount = pillarNames.length
  const pillarQuestions = questions.filter((q) => q.pillarIndex === current.pillarIndex)
  const indexInPillar = pillarQuestions.findIndex((q) => q.id === current.id)
  const pillarsDone = pillarNames.filter((_, p) =>
    questions.filter((q) => q.pillarIndex === p).every((q) => answeredIds.has(q.id)),
  ).length

  const remaining = questions.filter((q) => !answeredIds.has(q.id)).length
  const minutesLeft = Math.round((remaining * SECONDS_PER_QUESTION) / 60)

  const pillarLabel = t('diagnostic.progress.pillar', { current: current.pillarIndex + 1, total: pillarCount })
  const questionLabel = t('diagnostic.progress.question', {
    current: indexInPillar + 1,
    total: pillarQuestions.length,
  })

  return (
    <div className="ubb-container pb-3 pt-1">
      {/* Annonce pour les lecteurs d'écran à chaque nouvelle question */}
      <p className="sr-only" aria-live="polite">
        {t('diagnostic.progress.announce', {
          pillar: pillarLabel,
          name: current.pillarName,
          question: questionLabel,
        })}
      </p>

      <div className="flex items-center gap-3" aria-hidden="true">
        <PentagonSegments
          done={pillarsDone}
          current={current.pillarIndex}
          className="h-9 w-9 shrink-0"
          strokeWidth={4}
        />
        <div className="min-w-0 flex-1">
          <p className="font-text text-xs font-medium text-ubb-ink-muted">{pillarLabel}</p>
          <p className="truncate font-heading text-sm font-semibold text-ubb-ink sm:text-base">
            {current.pillarName}
          </p>
        </div>
        <p className="shrink-0 font-text text-sm font-semibold text-ubb-ink">{questionLabel}</p>
      </div>

      <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
        {pillarNames.map((name, p) => (
          <div key={name} className="flex flex-1 gap-0.5">
            {questions
              .filter((q) => q.pillarIndex === p)
              .map((q) => {
                const isCurrent = q.id === current.id
                const isAnswered = answeredIds.has(q.id)
                return (
                  <span
                    key={q.id}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      isCurrent ? 'bg-ubb-accent-500' : isAnswered ? 'bg-ubb-brand-900' : 'bg-ubb-brand-100'
                    }`}
                  />
                )
              })}
          </div>
        ))}
      </div>

      <p className="mt-1.5 flex items-center justify-end gap-1 font-text text-xs text-ubb-ink-muted">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        {minutesLeft <= 1
          ? t('diagnostic.progress.lastMinute')
          : t('diagnostic.progress.timeLeft', { count: minutesLeft })}
      </p>
    </div>
  )
}

export default DiagnosticProgress
