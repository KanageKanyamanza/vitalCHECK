import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import logoIcon from '/android-icon-96x96.png'

/**
 * En-tête réduit du parcours de diagnostic (mode « focus »).
 * La progression étant gardée pour la session, « Quitter » ne fait rien perdre.
 * `children` : zone sous l'en-tête (indicateur de progression pendant les questions).
 */
const DiagnosticHeader = ({ title, children }) => {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-ubb-brand-900/[0.08] bg-white/95 backdrop-blur">
      <div className="ubb-container flex h-14 items-center justify-between gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={logoIcon} alt="" width="32" height="32" className="h-8 w-8 shrink-0 rounded-ubb-chip" />
          <p className="min-w-0 truncate font-heading text-base font-semibold text-ubb-ink sm:text-lg">
            {title}
          </p>
        </div>

        <Link
          to="/"
          title={t('diagnostic.header.quitHint')}
          className="ubb-focus inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3 font-text text-sm font-semibold text-ubb-ink-muted hover:bg-ubb-brand-50 hover:text-ubb-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t('diagnostic.header.quit')}
        </Link>
      </div>
      {children}
    </header>
  )
}

export default DiagnosticHeader
