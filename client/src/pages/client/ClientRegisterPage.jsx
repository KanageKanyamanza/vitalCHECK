import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { User, Mail, Lock, Building2, Phone, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react'
import { useClientAuth } from '../../context/ClientAuthContext'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
    if (!formData.sector) newErrors.sector = t('clientAuth.register.errors.sectorRequired')
    if (!formData.companySize) newErrors.companySize = t('clientAuth.register.errors.companySizeRequired')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t('clientAuth.register.title')}
            </h1>
            <p className="text-gray-600">
              {t('clientAuth.register.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('clientAuth.register.firstName')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('clientAuth.register.firstNamePlaceholder')}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('clientAuth.register.lastName')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('clientAuth.register.lastNamePlaceholder')}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clientAuth.register.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('clientAuth.register.emailPlaceholder')}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Company Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clientAuth.register.companyName')}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('clientAuth.register.companyNamePlaceholder')}
                  required
                />
              </div>
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            {/* Sector & Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('clientAuth.register.sector')}
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.sector ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">{t('clientAuth.register.sectorPlaceholder')}</option>
                  <option value="technology">{t('landing.sectors.technology')}</option>
                  <option value="commerce">{t('landing.sectors.commerce')}</option>
                  <option value="services">{t('landing.sectors.services')}</option>
                  <option value="manufacturing">{t('landing.sectors.manufacturing')}</option>
                  <option value="agriculture">{t('landing.sectors.agriculture')}</option>
                  <option value="education">{t('landing.sectors.education')}</option>
                  <option value="finance">{t('landing.sectors.finance')}</option>
                  <option value="other">{t('landing.sectors.other')}</option>
                </select>
                {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('clientAuth.register.companySize')}
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.companySize ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">{t('clientAuth.register.companySizePlaceholder')}</option>
                  <option value="micro">{t('landing.sizes.micro')}</option>
                  <option value="sme">{t('landing.sizes.sme')}</option>
                  <option value="large-sme">{t('landing.sizes.large-sme')}</option>
                </select>
                {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clientAuth.register.phone')} {t('common.optional')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('clientAuth.register.phonePlaceholder')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clientAuth.register.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('clientAuth.register.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clientAuth.register.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('clientAuth.register.confirmPasswordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('common.processing')}
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t('clientAuth.register.submit')}
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              {t('clientAuth.register.hasAccount')}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                {t('clientAuth.register.login')}
              </Link>
            </p>
            <Link to="/" className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-700">
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
              {t('clientAuth.register.backToHome')}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ClientRegisterPage

