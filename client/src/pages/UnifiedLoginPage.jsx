import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Shield, Users } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useClientAuth } from "../context/ClientAuthContext";
import { AuthLayout, Button, FormField, PasswordInput } from "../components/ui/ds";

import { API_BASE_URL as API_URL } from "../services/api";

const UnifiedLoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setToken, setUser } = useClientAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedRole, setDetectedRole] = useState(null)
  const [hasRedirected, setHasRedirected] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (hasRedirected || loading) return // Éviter les redirections multiples et pendant le chargement
    
    const adminToken = localStorage.getItem('adminToken')
    const clientToken = localStorage.getItem('clientToken')
    
    // Redirection automatique seulement si pas en cours de connexion
    if (adminToken) {
      setHasRedirected(true)
      navigate('/admin/dashboard', { replace: true })
    } else if (clientToken) {
      setHasRedirected(true)
      navigate('/client/dashboard', { replace: true })
    }
  }, [navigate, loading, hasRedirected])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Utiliser l'API unifiée pour détecter automatiquement le rôle
      const response = await axios.post(`${API_URL}/unified-auth/login`, {
        email: formData.email,
        password: formData.password
      })

      if (response.data.success) {
        const { token, user } = response.data
        
        // Sauvegarder le token selon le rôle
        if (user.role && user.role !== 'client') {
          localStorage.setItem('adminToken', token)
          localStorage.setItem('adminData', JSON.stringify(user))
          setDetectedRole('admin')
          toast.success(t('auth.login.successAdmin'))
          
          // Arrêter le loader avant la redirection
          setLoading(false)
          setHasRedirected(true)
          
          // Petite pause pour que l'utilisateur voie le message de succès
          setTimeout(() => {
            navigate('/admin/dashboard', { replace: true })
          }, 500)
          
        } else if (user.role === 'client') {
          localStorage.setItem('clientToken', token)
          // Mettre à jour le contexte d'authentification client
          setToken(token)
          setUser(user)
          setDetectedRole('client')
          toast.success(t('auth.login.successClient'))
          
          // Arrêter le loader avant la redirection
          setLoading(false)
          setHasRedirected(true)
          
          // Petite pause pour que l'utilisateur voie le message de succès
          setTimeout(() => {
            navigate('/client/dashboard', { replace: true })
          }, 500)
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setError(t('auth.login.invalid'))
      setLoading(false) // Arrêter le loader en cas d'erreur
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  return (
    <AuthLayout
      scene="login"
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      panelTitle={t('auth.login.panelTitle')}
      panelText={t('auth.login.panelText')}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <p role="alert" className="rounded-ubb-field border border-red-200 bg-red-50 px-4 py-3 font-text text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        <FormField id="email" label={t('auth.common.email')}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="ubb-input"
            placeholder={t('auth.common.emailPlaceholder')}
          />
        </FormField>

        <FormField id="password" label={t('auth.common.password')}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder={t('auth.login.passwordPlaceholder')}
          />
        </FormField>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="ubb-focus inline-flex min-h-[44px] items-center rounded font-text text-sm font-semibold text-ubb-brand-900 underline underline-offset-4"
          >
            {t('auth.login.forgot')}
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? t('auth.login.loading') : t('auth.login.submit')}
        </Button>

        {detectedRole && (
          <p role="status" className="flex items-center gap-2 rounded-ubb-field bg-ubb-brand-50 px-4 py-3 font-text text-sm text-ubb-brand-950">
            {detectedRole === 'admin' ? (
              <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            {t(detectedRole === 'admin' ? 'auth.login.detectedAdmin' : 'auth.login.detectedClient')}
          </p>
        )}
      </form>

      <div className="mt-8 border-t border-ubb-brand-900/[0.08] pt-6">
        <p className="font-text text-ubb-small text-ubb-ink-muted">{t('auth.login.newHere')}</p>
        <Button to="/client/register" variant="outline" className="mt-3 w-full">
          {t('auth.login.createAccount')}
        </Button>
      </div>
    </AuthLayout>
  )
}

export default UnifiedLoginPage
