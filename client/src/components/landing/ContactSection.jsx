import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { Mail, Phone, CheckCircle2 } from 'lucide-react'
import { Button, Section, Container, SectionHeading } from '../ui/ds'
import { API_BASE_URL } from '../../services/api'

const INQUIRY_TYPES = ['general', 'assessment', 'premium', 'technical', 'partnership', 'other']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEFAULT_VALUES = {
  name: '',
  email: '',
  company: '',
  phone: '',
  inquiryType: 'general',
  message: '',
}

// Champ de formulaire : libellé, message d'erreur relié pour les lecteurs d'écran
const Field = ({ id, label, optional, error, children }) => (
  <div>
    <label htmlFor={id} className="ubb-label">
      {label}
      {optional && <span className="ml-1 font-normal text-ubb-ink-muted">{optional}</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 font-text text-sm font-medium text-red-700">
        {error}
      </p>
    )}
  </div>
)

const ContactSection = () => {
  const { t } = useTranslation()
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES })

  const onSubmit = async (values) => {
    const typeLabel = t(`contact.form.inquiryTypes.${values.inquiryType}`)
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          subject: t('landing.contact.subject', { type: typeLabel }),
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.success === false) throw new Error(data.message)

      setIsSent(true)
      reset(DEFAULT_VALUES)
      toast.success(t('contact.form.successMessage'))
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message de contact:', error)
      toast.error(t('contact.form.errorMessage'))
    }
  }

  const fieldProps = (name) => ({
    id: `landing-contact-${name}`,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `landing-contact-${name}-error` : undefined,
  })

  const optional = t('landing.contact.optional')

  return (
    <Section id="contact" tone="soft" aria-labelledby="contact-title">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Colonne d'introduction */}
        <div className="flex flex-col">
          <SectionHeading
            id="contact-title"
            title={t('landing.contact.title')}
            intro={t('landing.contact.intro')}
          />

          <ul className="mt-8 space-y-1 font-text">
            <li>
              <a
                href="mailto:info@checkmyenterprise.com"
                className="ubb-focus inline-flex min-h-[44px] items-center gap-3 rounded text-ubb-ink hover:text-ubb-brand-700"
              >
                <Mail className="h-5 w-5 text-ubb-accent-ink" aria-hidden="true" />
                info@checkmyenterprise.com
              </a>
            </li>
            <li>
              <a
                href="tel:+221788346969"
                className="ubb-focus inline-flex min-h-[44px] items-center gap-3 rounded text-ubb-ink hover:text-ubb-brand-700"
              >
                <Phone className="h-5 w-5 text-ubb-accent-ink" aria-hidden="true" />
                +221 78 834 69 69
              </a>
            </li>
          </ul>

          {/* CTA final : ceux qui ne sont pas prêts à écrire peuvent commencer seuls */}
          <div className="mt-10 rounded-ubb-card bg-ubb-brand-900 p-6 text-white sm:p-8 lg:mt-auto">
            <p className="font-heading text-ubb-subtitle">{t('landing.contact.cta.title')}</p>
            <p className="mt-2 font-text text-ubb-body text-ubb-brand-200">
              {t('landing.contact.cta.text')}
            </p>
            <Button to="/diagnostic" className="mt-6 w-full sm:w-auto focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900">
              {t('landing.contact.cta.button')}
            </Button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="ubb-card p-6 sm:p-8">
          {isSent ? (
            <div className="flex h-full flex-col items-start justify-center gap-4 py-8" role="status">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" aria-hidden="true" />
              <h3 className="ubb-heading text-ubb-subtitle">{t('landing.contact.sent.title')}</h3>
              <p className="max-w-ubb-prose font-text text-ubb-body text-ubb-ink-muted">
                {t('contact.form.successMessage')}
              </p>
              <Button variant="outline" onClick={() => setIsSent(false)}>
                {t('landing.contact.sent.again')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <p className="font-text text-ubb-small text-ubb-ink-muted">
                {t('landing.contact.requiredHint')}
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="landing-contact-name" label={t('contact.form.name')} error={errors.name?.message}>
                  <input
                    type="text"
                    autoComplete="name"
                    className="ubb-input"
                    placeholder={t('contact.form.namePlaceholder')}
                    {...fieldProps('name')}
                    {...register('name', {
                      validate: (v) => v.trim() !== '' || t('landing.contact.errors.name'),
                    })}
                  />
                </Field>

                <Field id="landing-contact-email" label={t('contact.form.email')} error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className="ubb-input"
                    placeholder={t('contact.form.emailPlaceholder')}
                    {...fieldProps('email')}
                    {...register('email', {
                      required: t('landing.contact.errors.email'),
                      pattern: { value: EMAIL_PATTERN, message: t('landing.contact.errors.emailInvalid') },
                    })}
                  />
                </Field>

                <Field id="landing-contact-company" label={t('contact.form.company')} optional={optional}>
                  <input
                    type="text"
                    autoComplete="organization"
                    className="ubb-input"
                    placeholder={t('contact.form.companyPlaceholder')}
                    {...fieldProps('company')}
                    {...register('company')}
                  />
                </Field>

                <Field id="landing-contact-phone" label={t('contact.form.phone')} optional={optional}>
                  <input
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className="ubb-input"
                    placeholder={t('landing.contact.phonePlaceholder')}
                    {...fieldProps('phone')}
                    {...register('phone')}
                  />
                </Field>
              </div>

              <Field id="landing-contact-inquiryType" label={t('contact.form.inquiryType')}>
                <select className="ubb-input" {...fieldProps('inquiryType')} {...register('inquiryType')}>
                  {INQUIRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`contact.form.inquiryTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="landing-contact-message" label={t('contact.form.message')} error={errors.message?.message}>
                <textarea
                  rows={5}
                  className="ubb-input resize-y"
                  placeholder={t('landing.contact.messagePlaceholder')}
                  {...fieldProps('message')}
                  {...register('message', {
                    validate: (v) => v.trim() !== '' || t('landing.contact.errors.message'),
                  })}
                />
              </Field>

              <Button type="submit" variant="secondary" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
              </Button>

              <p className="font-text text-ubb-small text-ubb-ink-muted">{t('contact.form.privacy')}</p>
            </form>
          )}
        </div>
      </Container>
    </Section>
  )
}

export default ContactSection
