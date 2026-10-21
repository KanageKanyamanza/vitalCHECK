import React, { forwardRef, useRef } from 'react'
import { Check } from 'lucide-react'

/**
 * Carte de question du diagnostic : énoncé + 3 réponses (ordre fourni par le serveur :
 * Oui / Partiellement / Non), en boutons radio natifs stylés en grandes cartes tactiles.
 *
 * onAnswerSelect(questionId, value, { viaPointer }) : `viaPointer` vaut true pour un choix
 * au doigt ou à la souris (le parcours avance alors tout seul), false au clavier
 * (les flèches changent la sélection sans quitter la question).
 */
const DiagnosticQuestion = forwardRef(({ question, selectedAnswer, onAnswerSelect }, headingRef) => {
  const pointerRef = useRef(false)

  if (!question) return null

  const groupName = `question-${question.id}`

  return (
    <fieldset className="ubb-card p-5 sm:p-8" aria-labelledby={`${groupName}-title`}>
      <h2
        id={`${groupName}-title`}
        ref={headingRef}
        tabIndex={-1}
        className="ubb-heading text-ubb-subtitle font-semibold leading-snug focus:outline-none sm:text-2xl"
      >
        {question.text}
      </h2>

      <div className="mt-6 space-y-3">
        {question.options.map((option) => {
          const checked = selectedAnswer === option.value
          const inputId = `${groupName}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              onPointerDown={() => {
                pointerRef.current = true
              }}
              className={`flex min-h-[64px] cursor-pointer items-start gap-4 rounded-ubb-card border-2 px-4 py-3.5 transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ubb-brand-900 has-[:focus-visible]:ring-offset-2 sm:px-5 sm:py-4 ${
                checked
                  ? 'border-ubb-brand-900 bg-ubb-brand-50'
                  : 'border-ubb-brand-900/15 bg-white hover:border-ubb-brand-900/40 hover:bg-ubb-paper-soft'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                onChange={() => {
                  onAnswerSelect(question.id, option.value, { viaPointer: pointerRef.current })
                  pointerRef.current = false
                }}
                onKeyDown={() => {
                  pointerRef.current = false
                }}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  checked ? 'border-ubb-brand-900 bg-ubb-brand-900' : 'border-ubb-brand-900/30 bg-white'
                }`}
              >
                {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />}
              </span>
              <span className="min-w-0">
                <span className="block font-text text-base font-semibold text-ubb-ink sm:text-lg">
                  {option.shortLabel}
                </span>
                {option.label && (
                  <span className="mt-0.5 block font-text text-sm text-ubb-ink-muted sm:text-base">
                    {option.label}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
})

DiagnosticQuestion.displayName = 'DiagnosticQuestion'

export default DiagnosticQuestion
