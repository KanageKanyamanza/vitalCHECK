import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'

const ContactPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, assessment } = useAssessment()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inquiryTypes = [
    { value: 'general', label: t('contact.form.inquiryTypes.general') },
    { value: 'assessment', label: t('contact.form.inquiryTypes.assessment') },
    { value: 'premium', label: t('contact.form.inquiryTypes.premium') },
    { value: 'technical', label: t('contact.form.inquiryTypes.technical') },
    { value: 'partnership', label: t('contact.form.inquiryTypes.partnership') },
    { value: 'other', label: t('contact.form.inquiryTypes.other') }
  ]

  // Pré-remplir les champs avec les données de l'évaluation
  useEffect(() => {
    if (user && (user.companyName || user.email)) {
      setFormData(prev => ({
        ...prev,
        name: user.companyName || '',
        email: user.email || '',
        company: user.companyName || '',
        // Pré-remplir le type de demande selon le contexte
        inquiryType: assessment ? 'premium' : 'general',
        // Sujet et message personnalisés si l'utilisateur vient de terminer une évaluation
        subject: assessment 
          ? `Demande de services premium - ${user.companyName}`
          : '',
        message: assessment 
          ? `Bonjour,\n\nJ'ai récemment terminé l'évaluation VitalCheck Enterprise Health Check pour ${user.companyName} et je souhaiterais en savoir plus sur vos services premium.\n\nMerci de me contacter pour discuter des options disponibles.\n\nCordialement`
          : ''
      }))
    }
  }, [user, assessment])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(t('contact.form.successMessage'))
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: ''
        })
      } else {
        throw new Error('Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(t('contact.form.errorMessage'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-2xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('contact.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Informations de contact */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t('contact.info.address.title')}</h4>
                    <p className="text-gray-600 text-xs md:text-sm">{t('contact.info.address.value')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t('contact.info.phone.title')}</h4>
                    <p className="text-gray-600 text-xs md:text-sm">{t('contact.info.phone.value')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t('contact.info.email.title')}</h4>
                    <p className="text-gray-600 text-xs md:text-sm">{t('contact.info.email.value')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t('contact.info.hours.title')}</h4>
                    <p className="text-gray-600 text-xs md:text-sm">{t('contact.info.hours.value')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 md:p-8 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                {t('contact.why.title')}
              </h3>
              <p className="text-primary-100 mb-6 text-sm md:text-base">
                {t('contact.why.description')}
              </p>
               <div className="text-center">
                 <button
                   onClick={() => navigate('/assessment')}
                   className="bg-white text-primary-600 hover:bg-gray-100 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-colors duration-200"
                 >
                   {t('contact.why.startAssessment')}
                 </button>
               </div>
            </motion.div>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              {t('contact.form.title')}
            </h3>
            
            {/* Indicateur de pré-remplissage */}
            {user && (user.companyName || user.email) && (
              <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-primary-700">
                    Vos informations ont été pré-remplies à partir de votre évaluation. Vous pouvez les modifier si nécessaire.
                  </p>
                </div>
              </div>
            )}

             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                     {t('contact.form.name')}
                   </label>
                   <input
                     id="name"
                     name="name"
                     type="text"
                     value={formData.name}
                     onChange={handleInputChange}
                     required
                     placeholder={t('contact.form.namePlaceholder')}
                     className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                   />
                 </div>
                 <div>
                   <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                     {t('contact.form.email')}
                   </label>
                   <input
                     id="email"
                     name="email"
                     type="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     required
                     placeholder={t('contact.form.emailPlaceholder')}
                     className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                   />
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label htmlFor="company" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                     {t('contact.form.company')}
                   </label>
                   <input
                     id="company"
                     name="company"
                     type="text"
                     value={formData.company}
                     onChange={handleInputChange}
                     placeholder={t('contact.form.companyPlaceholder')}
                     className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                   />
                 </div>
                 <div>
                   <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                     {t('contact.form.phone')}
                   </label>
                   <input
                     id="phone"
                     name="phone"
                     type="tel"
                     value={formData.phone}
                     onChange={handleInputChange}
                     placeholder={t('contact.form.phonePlaceholder')}
                     className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                   />
                 </div>
               </div>

               <div>
                 <label htmlFor="inquiryType" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                   {t('contact.form.inquiryType')}
                 </label>
                 <select
                   id="inquiryType"
                   name="inquiryType"
                   value={formData.inquiryType}
                   onChange={handleInputChange}
                   required
                   className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                 >
                   <option value="">{t('contact.form.inquiryTypePlaceholder')}</option>
                   {inquiryTypes.map((type) => (
                     <option key={type.value} value={type.value}>
                       {type.label}
                     </option>
                   ))}
                 </select>
               </div>

               <div>
                 <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                   {t('contact.form.subject')}
                 </label>
                 <input
                   id="subject"
                   name="subject"
                   type="text"
                   value={formData.subject}
                   onChange={handleInputChange}
                   required
                   placeholder={t('contact.form.subjectPlaceholder')}
                   className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                 />
               </div>

               <div>
                 <label htmlFor="message" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                   {t('contact.form.message')}
                 </label>
                 <textarea
                   id="message"
                   name="message"
                   value={formData.message}
                   onChange={handleInputChange}
                   required
                   rows={6}
                   placeholder={t('contact.form.messagePlaceholder')}
                   className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none text-sm md:text-base"
                 />
               </div>

               <button
                 type="submit"
                 disabled={isSubmitting}
                 className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm md:text-base"
               >
                 {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
               </button>
             </form>

            <div className="mt-6 p-3 md:p-4 bg-gray-50 rounded-xl">
              <p className="text-xs md:text-sm text-gray-600 text-center">
                {t('contact.form.privacy')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
