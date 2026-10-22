import React from 'react'
import { SCENES } from '../../illustrations/scenes'

/**
 * Page à formulaire : le formulaire à gauche, une illustration animée à droite.
 * Sous `lg`, l'illustration disparaît pour laisser toute la place au formulaire
 * (la cible utilise surtout un smartphone).
 *
 * - `scene` : clé d'illustration (components/illustrations/scenes.jsx)
 * - `panelTitle` / `panelText` : message de réassurance affiché sous l'illustration
 * - `width` : largeur max de la colonne du formulaire ("md" par défaut, "xl" pour les longs formulaires)
 */
const WIDTHS = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

const AuthLayout = ({ scene, title, subtitle, panelTitle, panelText, width = 'md', children, titleId = 'auth-title' }) => {
  const Scene = SCENES[scene]

  return (
    <div className="grid min-h-[calc(100vh-var(--ubb-header-h))] lg:grid-cols-2">
      {/* Formulaire */}
      <section aria-labelledby={titleId} className="flex items-center justify-center bg-ubb-paper-soft px-4 py-10 sm:px-8 lg:bg-white lg:px-12">
        <div className={`w-full ${WIDTHS[width]}`}>
          <h1 id={titleId} className="ubb-heading text-ubb-title">
            {title}
          </h1>
          {subtitle && <p className="mt-3 font-text text-ubb-body text-ubb-ink-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </section>

      {/* Illustration (décorative) : reste centrée dans l'écran pendant le défilement du formulaire */}
      <aside className="relative hidden overflow-clip bg-ubb-brand-900 lg:block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,rgb(var(--ubb-brand-700)/0.8),transparent_70%)]"
        />
        <div className="sticky top-[var(--ubb-header-h)] flex min-h-[calc(100vh-var(--ubb-header-h))] flex-col items-center justify-center px-12 py-12">
          <div className="relative w-full max-w-[460px]">{Scene && <Scene />}</div>
          {(panelTitle || panelText) && (
            <div className="relative mt-4 max-w-sm text-center">
              {panelTitle && <p className="font-heading text-2xl font-semibold text-white">{panelTitle}</p>}
              {panelText && <p className="mt-2 font-text text-ubb-body text-ubb-brand-200">{panelText}</p>}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default AuthLayout
