import React from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

// Doit rester aligné avec SECTOR_QUESTIONNAIRE_TYPES (page) et SECTOR_QUESTIONNAIRES (serveur)
export const SECTOR_OPTIONS = [
  'universal',
  'agriculture',
  'retail',
  'restaurant',
  'construction',
  'distribution',
  'export',
  'manufacturing',
]

/**
 * Choix du questionnaire sectoriel, en boutons radio natifs (navigation au clavier par flèches).
 * Libellés repris de la landing (landing.sectorCards.items.<secteur>.name).
 */
const SectorPicker = ({ value, onChange, name = 'questionnaire' }) => {
  const { t } = useTranslation()

  const labelFor = (type) =>
    type === 'universal'
      ? t('diagnostic.intro.sectorUniversal')
      : t(`landing.sectorCards.items.${type}.name`)

  return (
    <fieldset>
      <legend className="ubb-label">{t('diagnostic.intro.sector')}</legend>
      <p className="mb-3 font-text text-ubb-small text-ubb-ink-muted">{t('diagnostic.intro.sectorHint')}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SECTOR_OPTIONS.map((type) => {
          const checked = value === type
          return (
            <label
              key={type}
              className={`relative flex min-h-[48px] cursor-pointer items-center gap-2 rounded-ubb-field border px-3 py-2 font-text text-sm font-semibold sm:gap-1.5 sm:px-2.5 sm:text-[0.8125rem] transition-colors focus-within:ring-2 focus-within:ring-ubb-brand-900 focus-within:ring-offset-2 ${
                checked
                  ? 'border-ubb-brand-900 bg-ubb-brand-50 text-ubb-brand-950'
                  : 'border-ubb-brand-900/15 bg-white text-ubb-ink hover:border-ubb-brand-900/40'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={type}
                checked={checked}
                onChange={() => onChange(type)}
                className="sr-only"
              />
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  checked ? 'border-ubb-brand-900 bg-ubb-brand-900' : 'border-ubb-brand-900/30'
                }`}
                aria-hidden="true"
              >
                {checked && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
              </span>
              <span className="leading-tight">{labelFor(type)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default SectorPicker
