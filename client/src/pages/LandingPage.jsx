import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, BarChart3, Users, Target, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAssessment } from '../context/AssessmentContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import LanguageSelector from '../components/LanguageSelector'

const LandingPage = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { dispatch, language } = useAssessment()
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    sector: '',
    companySize: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLanguageChange = async (newLanguage) => {
    // Change i18n language first
    await i18n.changeLanguage(newLanguage)
    
    // Then update global state
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.register(formData)
      
      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.user })
        toast.success(t('common.success'))
        navigate('/assessment')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('landing.features.complete'),
      description: t('landing.features.completeDesc')
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('landing.features.personalized'),
      description: t('landing.features.personalizedDesc')
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('landing.features.detailed'),
      description: t('landing.features.detailedDesc')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            {t('landing.title')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            {t('landing.subtitle')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-12"
          >
            <CheckCircle className="w-4 h-4 text-success-500" />
            <span>Gratuit • 10 minutes • Résultats instantanés</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('landing.form.title')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.form.language')} *
                </label>
                <LanguageSelector 
                  selectedLanguage={language}
                  onLanguageChange={handleLanguageChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'fr' ? '🇫🇷 Français sélectionné' : '🇺🇸 English selected'}
                </p>
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.form.companyName')} *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder={t('landing.form.companyNamePlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.form.sector')} *
                </label>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">{t('landing.form.sectorPlaceholder')}</option>
                  <option value="technology">{t('landing.sectors.technology')}</option>
                  <option value="commerce">{t('landing.sectors.commerce')}</option>
                  <option value="services">{t('landing.sectors.services')}</option>
                  <option value="manufacturing">{t('landing.sectors.manufacturing')}</option>
                  <option value="construction">{t('landing.sectors.construction')}</option>
                  <option value="health">{t('landing.sectors.health')}</option>
                  <option value="education">{t('landing.sectors.education')}</option>
                  <option value="finance">{t('landing.sectors.finance')}</option>
                  <option value="other">{t('landing.sectors.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.form.companySize')} *
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">{t('landing.form.companySizePlaceholder')}</option>
                  <option value="micro">{t('landing.sizes.micro')}</option>
                  <option value="sme">{t('landing.sizes.sme')}</option>
                  <option value="large-sme">{t('landing.sizes.large-sme')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.form.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder={t('landing.form.emailPlaceholder')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('landing.form.startButton')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('landing.features.title')}
            </h3>
            
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 UBB Enterprise Health Check. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
