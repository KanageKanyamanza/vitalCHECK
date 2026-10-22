import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff } from 'lucide-react'

/** Champ mot de passe avec bouton afficher / masquer (cible tactile de 44 px). */
const PasswordInput = ({ className = '', ...props }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={`ubb-input pr-12 ${className}`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-label={visible ? t('auth.common.hidePassword') : t('auth.common.showPassword')}
        className="ubb-focus absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-ubb-field text-ubb-ink-muted hover:text-ubb-ink"
      >
        {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  )
}

export default PasswordInput
