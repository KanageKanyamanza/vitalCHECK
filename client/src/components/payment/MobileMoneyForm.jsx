import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Smartphone, Check } from 'lucide-react'
import { Button, FormField } from '../ui/ds'
import { paymentsAPI } from '../../services/api'

// Même règle que le serveur : numéro mobile sénégalais, avec ou sans indicatif 221
const isValidSenegalPhone = (value) => {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.length === 9) digits = `221${digits}`
  return /^2217\d{8}$/.test(digits)
}

const ERROR_KEYS = {
  INVALID_OPERATOR: 'operator',
  INVALID_PHONE: 'phone',
  OTP_REQUIRED: 'otp',
  PAYIN_REJECTED: 'rejected',
  PROVIDER_DISABLED: 'unavailable',
  OPERATOR_UNAVAILABLE: 'operatorUnavailable',
}

/**
 * Paiement Mobile Money (AfribaPay). Le navigateur envoie l'offre, l'opérateur, le numéro
 * et le code Orange ; le montant est fixé par le serveur et l'activation décidée par lui seul.
 */
const MobileMoneyForm = ({ planId, amountLabel, operators }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [operator, setOperator] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const selected = operators.find((op) => op.code === operator)

  const validate = () => {
    const next = {}
    if (!selected) next.operator = t('mobileMoney.errors.operator')
    if (!isValidSenegalPhone(phone)) next.phone = t('mobileMoney.errors.phone')
    if (selected?.otpRequired && !/^\d{4,6}$/.test(otp)) next.otp = t('mobileMoney.errors.otp')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting || !validate()) return
    setSubmitting(true)
    try {
      const { data } = await paymentsAPI.initiateMobileMoney({
        planId,
        operator,
        phoneNumber: phone,
        otpCode: selected?.otpRequired ? otp : undefined,
        lang: (i18n.language || 'fr').slice(0, 2),
      })
      // Wave : le lien de paiement est ouvert depuis la page d'attente, qui reste ouverte et suit le paiement
      navigate(`/payment/pending?order=${encodeURIComponent(data.orderId)}`, {
        state: data.providerLink ? { providerLink: data.providerLink } : undefined,
      })
    } catch (error) {
      const code = error.response?.data?.code
      const key = ERROR_KEYS[code] || 'generic'
      const field = key === 'phone' || key === 'otp' || key === 'operator' ? key : 'form'
      setErrors({ [field]: t(`mobileMoney.errors.${key}`) })
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-5">
      <fieldset>
        <legend className="ubb-label">{t('mobileMoney.chooseOperator')}</legend>
        <div className="grid gap-2 sm:grid-cols-2" aria-describedby={errors.operator ? 'mm-operator-error' : undefined}>
          {operators.map((op) => {
            const checked = operator === op.code
            return (
              <label
                key={op.code}
                className={`flex min-h-[56px] focus-within:ring-2 focus-within:ring-ubb-brand-900 focus-within:ring-offset-2 cursor-pointer items-center gap-3 rounded-ubb-card border-2 px-4 py-3 transition-colors ${
                  checked ? 'border-ubb-brand-900 bg-ubb-brand-50' : 'border-ubb-brand-900/15 bg-white hover:border-ubb-brand-900/40'
                }`}
              >
                <input
                  type="radio"
                  name="operator"
                  value={op.code}
                  checked={checked}
                  onChange={() => {
                    setOperator(op.code)
                    setErrors((prev) => ({ ...prev, operator: undefined, form: undefined }))
                  }}
                  className="sr-only"
                />
                <Smartphone className="h-5 w-5 shrink-0 text-ubb-brand-900" aria-hidden="true" />
                <span className="flex-1 font-text text-base font-semibold text-ubb-ink">{op.name}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    checked ? 'border-ubb-brand-900 bg-ubb-brand-900' : 'border-ubb-brand-900/30'
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />}
                </span>
              </label>
            )
          })}
        </div>
        {errors.operator && (
          <p id="mm-operator-error" role="alert" className="mt-1.5 font-text text-sm font-medium text-red-700">
            {errors.operator}
          </p>
        )}
      </fieldset>

      <FormField id="mm-phone" label={t('mobileMoney.phoneLabel')} hint={t('mobileMoney.phoneHint')} error={errors.phone}>
        <div className="flex items-stretch gap-2">
          <span className="flex min-h-[48px] items-center rounded-ubb-field border border-ubb-brand-900/20 bg-ubb-mist px-3 font-text text-base text-ubb-ink" aria-hidden="true">
            +221
          </span>
          <input
            id="mm-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="77 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'mm-phone-error' : 'mm-phone-hint'}
            className="ubb-input"
          />
        </div>
      </FormField>

      {selected?.otpRequired && (
        <FormField
          id="mm-otp"
          label={t('mobileMoney.otpLabel')}
          hint={selected.ussdCode ? t('mobileMoney.otpHint', { ussd: selected.ussdCode }) : t('mobileMoney.otpHintNoUssd')}
          error={errors.otp}
        >
          <input
            id="mm-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            aria-invalid={errors.otp ? 'true' : undefined}
            aria-describedby={errors.otp ? 'mm-otp-error' : 'mm-otp-hint'}
            className="ubb-input tracking-[0.3em]"
          />
        </FormField>
      )}

      {errors.form && (
        <p role="alert" className="rounded-ubb-field bg-red-50 p-3 font-text text-sm font-medium text-red-700">
          {errors.form}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting} aria-busy={submitting}>
        {submitting ? t('mobileMoney.paying') : t('mobileMoney.pay', { amount: amountLabel })}
      </Button>
    </form>
  )
}

export default MobileMoneyForm
