import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, Gift, ListChecks } from 'lucide-react'
import { Button, FormField } from '../ui/ds'
import { NavbarLanguageSelector } from '../ui'
import SectorPicker from './SectorPicker'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const COMPANY_SIZES = ['micro', 'sme', 'large-sme']

const REASSURANCE = [
  { key: 'time', icon: Clock },
  { key: 'free', icon: Gift },
  { key: 'noFigures', icon: ListChecks },
]

/**
 * Écran d'accueil du diagnostic : ce que c'est, réassurance, secteur, langue,
 * puis les 3 informations nécessaires (l'email sert à l'envoi automatique du rapport).
 */
const DiagnosticIntro = ({
  questionnaireType,
  onSectorChange,
  onLanguageChange,
  formData,
  onFormChange,
  onStart,
  questionsReady,
}) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!formData.companyName.trim()) next.companyName = t('diagnostic.intro.errors.companyName')
    if (!formData.companySize) next.companySize = t('diagnostic.intro.errors.companySize')
    if (!formData.email.trim()) next.email = t('diagnostic.intro.errors.email')
    else if (!EMAIL_PATTERN.test(formData.email.trim())) next.email = t('diagnostic.intro.errors.emailInvalid')
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    const firstInvalid = Object.keys(next)[0]
    if (firstInvalid) {
      document.getElementById(`diagnostic-${firstInvalid}`)?.focus()
      return
    }
    onStart()
  }

  const handleChange = (e) => {
    onFormChange(e)
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const fieldProps = (name) => ({
    id: `diagnostic-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name]
      ? `diagnostic-${name}-error`
      : name === 'email'
        ? 'diagnostic-email-hint'
        : undefined,
  })

  return (
    <div className="ubb-container max-w-2xl py-8 sm:py-12">
      <h1 className="ubb-heading text-ubb-title">
        {t([`diagnostic.${questionnaireType}.title`, 'diagnostic.intro.title'])}
      </h1>
      <p className="mt-3 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">
        {t([`diagnostic.${questionnaireType}.subtitle`, 'diagnostic.intro.subtitle'])}
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {REASSURANCE.map(({ key, icon: Icon }) => (
          <li key={key} className="flex items-start gap-3 rounded-ubb-field bg-ubb-mist px-4 py-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ubb-brand-900" aria-hidden="true" />
            <span className="font-text text-sm font-medium text-ubb-ink">
              {t(`diagnostic.intro.reassurance.${key}`)}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} noValidate className="ubb-card mt-8 space-y-7 p-5 sm:p-8">
        <SectorPicker value={questionnaireType} onChange={onSectorChange} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="ubb-label mb-0" id="diagnostic-language-label">
            {t('diagnostic.intro.language')}
          </span>
          <NavbarLanguageSelector variant="segmented" onLanguageChange={onLanguageChange} />
        </div>

        <div className="space-y-5 border-t border-ubb-brand-900/[0.08] pt-6">
          <h2 className="font-heading text-lg font-semibold text-ubb-ink">
            {t('diagnostic.intro.aboutCompany')}
          </h2>

          <FormField id="diagnostic-companyName" label={t('diagnostic.intro.companyName')} error={errors.companyName}>
            <input
              type="text"
              autoComplete="organization"
              className="ubb-input"
              placeholder={t('diagnostic.intro.companyNamePlaceholder')}
              {...fieldProps('companyName')}
            />
          </FormField>

          <FormField id="diagnostic-companySize" label={t('diagnostic.intro.companySize')} error={errors.companySize}>
            <select className="ubb-input" {...fieldProps('companySize')}>
              <option value="">{t('diagnostic.intro.companySizePlaceholder')}</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {t(`diagnostic.sizes.${size}`)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="diagnostic-email"
            label={t('diagnostic.intro.email')}
            hint={t('diagnostic.intro.emailHint')}
            error={errors.email}
          >
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              className="ubb-input"
              placeholder={t('diagnostic.intro.emailPlaceholder')}
              {...fieldProps('email')}
            />
          </FormField>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={!questionsReady}>
          {questionsReady ? t('diagnostic.intro.startButton') : t('diagnostic.loading.questions')}
        </Button>
      </form>
    </div>
  )
}

export default DiagnosticIntro
