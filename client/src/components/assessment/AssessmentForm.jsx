import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAssessment } from '../../context/AssessmentContext'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { LanguageSelector } from '../ui'

const AssessmentForm = ({ onFormSubmit }) => {
  const { t, i18n } = useTranslation()
  const { dispatch, language, user } = useAssessment()
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    sector: user?.sector || '',
    companySize: user?.companySize || '',
    email: user?.email || ''
  })
  const [loading, setLoading] = useState(false)

  // Synchroniser avec les données du contexte
  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || '',
        sector: user.sector || '',
        companySize: user.companySize || '',
        email: user.email || ''
      })
    }
  }, [user])

  // Sauvegarder automatiquement les changements dans le contexte avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.companyName || formData.sector || formData.companySize || formData.email) {
        // Créer un objet user temporaire pour la sauvegarde
        const tempUser = {
          companyName: formData.companyName,
          sector: formData.sector,
          companySize: formData.companySize,
          email: formData.email
        }
        dispatch({ type: 'SET_USER', payload: tempUser })
      }
    }, 500) // Attendre 500ms après le dernier changement

    return () => clearTimeout(timeoutId)
  }, [formData.companyName, formData.sector, formData.companySize, formData.email])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage)
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let userToSubmit = user

      // Si l'utilisateur n'existe pas encore, le créer
      if (!user || !user.id) {
        const userResponse = await authAPI.register(formData)
        userToSubmit = userResponse.data.user
        dispatch({ type: 'SET_USER', payload: userToSubmit })
      } else {
        // Si l'utilisateur existe déjà, utiliser les données actuelles
        userToSubmit = {
          ...user,
          ...formData
        }
        dispatch({ type: 'SET_USER', payload: userToSubmit })
      }

      // Call parent callback
      onFormSubmit(userToSubmit)

      toast.success(t('common.success'))
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <div className="w-6 h-6">📊</div>,
      title: t('landing.features.complete'),
      description: t('landing.features.completeDesc')
    },
    {
      icon: <div className="w-6 h-6">🎯</div>,
      title: t('landing.features.personalized'),
      description: t('landing.features.personalizedDesc')
    },
    {
      icon: <div className="w-6 h-6">📄</div>,
      title: t('landing.features.detailed'),
      description: t('landing.features.detailedDesc')
    }
  ]

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="ubb-card relative z-10"
          >
            <h2 className="text-2xl font-display font-bold ubb-gradient-text mb-6">
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
                  {language === 'fr' ? '🇫🇷 Français sélectionné' : '🇬🇧 English selected'}
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
                  <option value="agriculture">{t('landing.sectors.agriculture')}</option>
                  <option value="healthcare">{t('landing.sectors.healthcare')}</option>
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
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 transition-all duration-300 shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('landing.form.startAssessment')}</span>
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
            className="space-y-8 relative z-10"
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
                <div className="flex-shrink-0 w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center text-white">
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
      </div>
    </div>
  )
}

export default AssessmentForm
