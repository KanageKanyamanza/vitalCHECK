import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useClientAuth } from '../../context/ClientAuthContext'
import { AuthLayout, Button, FormField, PasswordInput } from '../../components/ui/ds'

const ClientRegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register, isAuthenticated, loading: authLoading } = useClientAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    sector: '',
    companySize: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const focusFirstError = useRef(false)

  // Après un envoi refusé, le focus va sur le premier champ en erreur
  useEffect(() => {
    if (!focusFirstError.current) return
    focusFirstError.current = false
    const first = Object.keys(errors).find((key) => errors[key])
    if (first) document.getElementById(`register-${first}`)?.focus()
  }, [errors])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/client/dashboard')
    }
  }, [isAuthenticated, authLoading, navigate])

  const validate = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = t('clientAuth.register.errors.firstNameRequired')
    if (!formData.lastName.trim()) newErrors.lastName = t('clientAuth.register.errors.lastNameRequired')
    if (!formData.email.trim()) newErrors.email = t('clientAuth.register.errors.emailRequired')
    if (!formData.password) newErrors.password = t('clientAuth.register.errors.passwordRequired')
    if (formData.password.length < 6) newErrors.password = t('clientAuth.register.errors.passwordTooShort')
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('clientAuth.register.errors.passwordMismatch')
    }
    if (!formData.companyName.trim()) newErrors.companyName = t('clientAuth.register.errors.companyNameRequired')
    if (!formData.companySize) newErrors.companySize = t('clientAuth.register.errors.companySizeRequired')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      focusFirstError.current = true
      return
    }

    setLoading(true)

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      companyName: formData.companyName,
      sector: formData.sector,
      companySize: formData.companySize,
      phone: formData.phone
    })

    if (result.success) {
      navigate('/client/dashboard')
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t('common.processing')}>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" />
      </div>
    )
  }

  const field = (name) => ({
    id: `register-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `register-${name}-error` : undefined,
  })

  return (
    <AuthLayout
      scene="register"
      width="xl"
      title={t('clientAuth.register.title')}
      subtitle={t('clientAuth.register.subtitle')}
      panelTitle={t('auth.register.panelTitle')}
      panelText={t('auth.register.panelText')}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="register-firstName" label={t('clientAuth.register.firstName')} error={errors.firstName}>
            <input type="text" autoComplete="given-name" className="ubb-input" placeholder={t('clientAuth.register.firstNamePlaceholder')} required {...field('firstName')} />
          </FormField>
          <FormField id="register-lastName" label={t('clientAuth.register.lastName')} error={errors.lastName}>
            <input type="text" autoComplete="family-name" className="ubb-input" placeholder={t('clientAuth.register.lastNamePlaceholder')} required {...field('lastName')} />
          </FormField>
        </div>

        <FormField id="register-email" label={t('clientAuth.register.email')} error={errors.email}>
          <input type="email" autoComplete="email" inputMode="email" className="ubb-input" placeholder={t('clientAuth.register.emailPlaceholder')} required {...field('email')} />
        </FormField>

        <FormField id="register-companyName" label={t('clientAuth.register.companyName')} error={errors.companyName}>
          <input type="text" autoComplete="organization" className="ubb-input" placeholder={t('clientAuth.register.companyNamePlaceholder')} required {...field('companyName')} />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="register-companySize" label={t('clientAuth.register.companySize')} error={errors.companySize}>
            <select className="ubb-input" required {...field('companySize')}>
              <option value="">{t('clientAuth.register.companySizePlaceholder')}</option>
              <option value="micro">{t('landing.sizes.micro')}</option>
              <option value="sme">{t('landing.sizes.sme')}</option>
              <option value="large-sme">{t('landing.sizes.large-sme')}</option>
            </select>
          </FormField>
          <FormField id="register-phone" label={t('clientAuth.register.phone')} optional={t('common.optional')}>
            <input type="tel" autoComplete="tel" inputMode="tel" className="ubb-input" placeholder={t('clientAuth.register.phonePlaceholder')} {...field('phone')} />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="register-password" label={t('clientAuth.register.password')} error={errors.password}>
            <PasswordInput autoComplete="new-password" placeholder={t('clientAuth.register.passwordPlaceholder')} required {...field('password')} />
          </FormField>
          <FormField id="register-confirmPassword" label={t('clientAuth.register.confirmPassword')} error={errors.confirmPassword}>
            <PasswordInput autoComplete="new-password" placeholder={t('clientAuth.register.confirmPasswordPlaceholder')} required {...field('confirmPassword')} />
          </FormField>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? t('common.processing') : t('clientAuth.register.submit')}
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-1 border-t border-ubb-brand-900/[0.08] pt-6 font-text text-ubb-small text-ubb-ink-muted">
        <p>
          {t('clientAuth.register.hasAccount')}{' '}
          <Link to="/login" className="ubb-focus rounded font-semibold text-ubb-brand-900 underline underline-offset-4">
            {t('clientAuth.register.login')}
          </Link>
        </p>
        <Link to="/" className="ubb-focus inline-flex min-h-[44px] items-center rounded underline underline-offset-4 hover:text-ubb-ink">
          {t('clientAuth.register.backToHome')}
        </Link>
      </div>
    </AuthLayout>
  )
}

export default ClientRegisterPage

