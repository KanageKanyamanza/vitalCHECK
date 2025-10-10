import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, User, Mail, MapPin, CheckCircle, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const BlogVisitorModal = ({ 
  isOpen, 
  onClose, 
  blogId, 
  blogTitle, 
  blogSlug, 
  isReturningVisitor = false, 
  visitorData = null,
  onFormSubmit 
}) => {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  // Pré-remplir le formulaire si c'est un visiteur de retour
  useEffect(() => {
    if (isReturningVisitor && visitorData) {
      setFormData({
        firstName: visitorData.firstName || '',
        lastName: visitorData.lastName || '',
        email: visitorData.email || '',
        country: visitorData.country || ''
      })
    }
  }, [isReturningVisitor, visitorData])

  // Détecter les changements de langue
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log('🌐 [BLOG MODAL] Changement de langue détecté:', lng)
      setCurrentLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('blog.modal.validation.firstNameRequired')
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('blog.modal.validation.lastNameRequired')
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('blog.modal.validation.emailRequired')
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = t('blog.modal.validation.emailInvalid')
    }
    
    if (!formData.country.trim()) {
      newErrors.country = t('blog.modal.validation.countryRequired')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      await onFormSubmit({
        ...formData,
        blogId,
        blogTitle,
        blogSlug
      })
      
      toast.success(
        isReturningVisitor 
          ? t('blog.modal.returningSuccessMessage')
          : t('blog.modal.successMessage')
      )
      
      onClose()
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      toast.error(t('blog.modal.errorMessage'))
    } finally {
      setLoading(false)
    }
  }

  // Fermer la modale
  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      country: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isReturningVisitor ? (
                  <CheckCircle className="h-6 w-6 text-white mr-3" />
                ) : (
                  <User className="h-6 w-6 text-white mr-3" />
                )}
                <h3 className="text-lg font-semibold text-white">
                  {isReturningVisitor ? t('blog.modal.welcomeBack') : t('blog.modal.title')}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {isReturningVisitor ? (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {visitorData?.firstName && visitorData?.lastName 
                    ? t('blog.modal.welcomeBackMessage').replace('{firstName}', visitorData.firstName).replace('{lastName}', visitorData.lastName)
                    : t('blog.modal.welcomeBackMessage')
                  }
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  {t('blog.modal.welcomeBackDesc')}
                </p>
                
                {/* Bouton pour continuer */}
                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('blog.modal.continueReading')}
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm">
                    {t('blog.modal.description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prénom */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('blog.modal.firstName')} *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isReturningVisitor}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  } ${isReturningVisitor ? 'bg-gray-100' : ''}`}
                  placeholder={t('blog.modal.firstNamePlaceholder')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Nom de famille */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('blog.modal.lastName')} *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isReturningVisitor}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  } ${isReturningVisitor ? 'bg-gray-100' : ''}`}
                  placeholder={t('blog.modal.lastNamePlaceholder')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('blog.modal.email')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isReturningVisitor}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } ${isReturningVisitor ? 'bg-gray-100' : ''}`}
                    placeholder={t('blog.modal.emailPlaceholder')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Pays */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('blog.modal.country')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={isReturningVisitor}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.country ? 'border-red-300' : 'border-gray-300'
                    } ${isReturningVisitor ? 'bg-gray-100' : ''}`}
                    placeholder={t('blog.modal.countryPlaceholder')}
                  />
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

                  {/* Bouton */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? t('blog.modal.submitting') : t('blog.modal.submit')}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    {t('blog.modal.privacyMessage')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogVisitorModal
