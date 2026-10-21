import React from 'react'

/**
 * Champ de formulaire du design system : libellé, aide facultative et message d'erreur
 * relié au champ pour les lecteurs d'écran (le champ porte aria-describedby={`${id}-error`}).
 */
const FormField = ({ id, label, optional, hint, error, children }) => (
  <div>
    <label htmlFor={id} className="ubb-label">
      {label}
      {optional && <span className="ml-1 font-normal text-ubb-ink-muted">{optional}</span>}
    </label>
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="mt-1.5 font-text text-ubb-small text-ubb-ink-muted">
        {hint}
      </p>
    )}
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 font-text text-sm font-medium text-red-700">
        {error}
      </p>
    )}
  </div>
)

export default FormField
