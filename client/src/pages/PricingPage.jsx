import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Check, X, Star, Phone, Mail, MessageCircle } from 'lucide-react'

const PricingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('standard')
  const [isLoading, setIsLoading] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'GRATUIT',
      subtitle: 'Freemium d\'Accès',
      price: '0',
      currency: 'FCFA',
      period: '',
      color: 'gray'
    },
    {
      id: 'standard',
      name: 'STANDARD',
      subtitle: 'Abonnement PME classique',
      price: '10 000',
      currency: 'FCFA',
      period: '/mois',
      annualPrice: '100 000',
      annualPeriod: '/an',
      color: 'blue',
      popular: true
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      subtitle: 'Accompagnement & Décision',
      price: '25 000 - 35 000',
      currency: 'FCFA',
      period: '/mois',
      annualPrice: '250 000 - 350 000',
      annualPeriod: '/an',
      color: 'purple'
    }
  ]

  const enterpriseTypes = [
    {
      key: 'tpePmeUnstructured',
      recommended: 'GRATUIT',
      icon: '🏪'
    },
    {
      key: 'cooperativesIndividual',
      recommended: 'GRATUIT',
      icon: '🤝'
    },
    {
      key: 'structuredPme',
      recommended: 'STANDARD',
      icon: '🏢'
    },
    {
      key: 'accountingCoaches',
      recommended: 'STANDARD',
      icon: '💼'
    },
    {
      key: 'growthExportPme',
      recommended: 'PREMIUM',
      icon: '🚀'
    },
    {
      key: 'financingEntrepreneurs',
      recommended: 'PREMIUM',
      icon: '💰'
    },
    {
      key: 'incubationPrograms',
      recommended: 'PREMIUM',
      icon: '🌱'
    }
  ]

  const getButtonClasses = (color, isPopular = false, isLoading = false) => {
    const baseClasses = 'w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center'
    if (isLoading) {
      return `${baseClasses} bg-gray-400 text-white cursor-not-allowed`
    }
    if (isPopular) {
      return `${baseClasses} bg-primary-600 text-white hover:bg-primary-700 shadow-lg transform hover:scale-105`
    }
    
    const colors = {
      gray: 'bg-gray-600 text-white hover:bg-gray-700',
      blue: 'bg-blue-600 text-white hover:bg-blue-700',
      purple: 'bg-purple-600 text-white hover:bg-purple-700'
    }
    return `${baseClasses} ${colors[color]}`
  }

  const handlePlanSelection = async (planId) => {
    setIsLoading(true)
    setSelectedPlan(planId)
    
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    switch (planId) {
      case 'free':
        // Redirection vers l'évaluation gratuite
        navigate('/assessment')
        break
      case 'standard':
        // Redirection vers une page de souscription Standard
        navigate('/contact?plan=standard')
        break
      case 'premium':
        // Redirection vers une page de souscription Premium
        navigate('/contact?plan=premium')
        break
      default:
        break
    }
    
    setIsLoading(false)
  }

  const handleContactClick = () => {
    navigate('/contact')
  }

  const handleStartFreeAssessment = () => {
    navigate('/assessment')
  }

  return (
    <>
      <Helmet>
        <title>Tarifs - VitalCHECK | Plans d'abonnement pour votre entreprise</title>
        <meta name="description" content="Découvrez nos plans tarifaires VitalCHECK : GRATUIT, STANDARD et PREMIUM. Choisissez la solution adaptée à votre entreprise pour améliorer votre santé organisationnelle." />
        <meta name="keywords" content="tarifs, prix, abonnement, VitalCHECK, diagnostic entreprise, PME, TPE, coopératives" />
        <meta property="og:title" content="Tarifs - VitalCHECK | Plans d'abonnement" />
        <meta property="og:description" content="Choisissez le plan VitalCHECK adapté à votre entreprise. Plans GRATUIT, STANDARD et PREMIUM disponibles." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-[50px]">
        {/* Hero Section */}
        <div className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('pricing.title')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t('pricing.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center border border-primary-600 bg-white/10 rounded-full px-4 py-2">
                  <Check className="text-primary-600 w-4 h-4 mr-2" />
                  <span>{t('pricing.heroFeatures.freeEvaluation')}</span>
                </div>
                <div className="flex items-center border border-primary-600 bg-white/10 rounded-full px-4 py-2">
                  <Check className="text-primary-600 w-4 h-4 mr-2" />
                  <span>{t('pricing.heroFeatures.noCommitment')}</span>
                </div>
                <div className="flex items-center border border-primary-600 bg-white/10 rounded-full px-4 py-2">
                  <Check className="text-primary-600 w-4 h-4 mr-2" />
                  <span>{t('pricing.heroFeatures.supportIncluded')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`relative rounded-2xl border-2 p-3 md:p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-primary-500 shadow-lg scale-105 bg-white' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white md:px-6 px-3 md:py-2 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {t('pricing.plans.standard.popular')}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{t(`pricing.plans.${plan.id}.name`)}</h3>
                  <p className="text-gray-600 mb-6">{t(`pricing.plans.${plan.id}.subtitle`)}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">{t(`pricing.plans.${plan.id}.price`)}</span>
                    <span className="text-gray-600 ml-1">{t(`pricing.plans.${plan.id}.currency`)}</span>
                    {t(`pricing.plans.${plan.id}.period`) && (
                      <span className="text-gray-600">{t(`pricing.plans.${plan.id}.period`)}</span>
                    )}
                  </div>
                  
                  {plan.annualPrice && (
                    <div className="text-xs md:text-sm text-gray-500 mb-2">
                      <span className="font-semibold">{t(`pricing.plans.${plan.id}.annualPrice`)} {t(`pricing.plans.${plan.id}.currency`)}</span>
                      <span>{t(`pricing.plans.${plan.id}.annualPeriod`)}</span>
                      <span className="text-green-600 ml-2">{t('pricing.common.twoMonthsFree')}</span>
                    </div>
                  )}

                  <button 
                    className={getButtonClasses(plan.color, plan.popular, isLoading && selectedPlan === plan.id)}
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={isLoading}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('common.processing')}
                      </>
                    ) : (
                      t(`pricing.plans.${plan.id}.button`)
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Features Comparison Table */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('pricing.featuresComparison.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('pricing.featuresComparison.subtitle')}
              </p>
            </motion.div>

            <div className="flex justify-center">
              <div className="overflow-x-auto">
                <table className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-black">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b-2 border-black">
                      {t('pricing.featuresComparison.featuresLabel')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b-2 border-black">
                      {t('pricing.plans.free.name')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b-2 border-black bg-primary-50">
                      {t('pricing.plans.standard.name')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b-2 border-black">
                      {t('pricing.plans.premium.name')}
                    </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { key: 'accessEvaluation', free: true, standard: true, premium: true },
                    { key: 'globalScorePillars', free: true, standard: true, premium: true },
                    { key: 'basicPdfReport', free: true, standard: true, premium: true },
                    { key: 'personalizedRecommendations', free: false, standard: true, premium: true },
                    { key: 'multipleEvaluations', free: false, standard: true, premium: true },
                    { key: 'historyTracking', free: false, standard: true, premium: true },
                    { key: 'comparativeAnalysis', free: false, standard: false, premium: true },
                    { key: 'expertConsultation', free: false, standard: false, premium: true },
                    { key: 'dashboardAdvancedExport', free: false, standard: true, premium: true },
                    { key: 'evaluatedCompanyBadge', free: false, standard: false, premium: true },
                    { key: 'emailSupport', free: true, standard: true, premium: true },
                    { key: 'whatsappPhoneSupport', free: false, standard: true, premium: true },
                    { key: 'multipleUsers', free: false, standard: false, premium: true }
                  ].map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {t(`pricing.features.${feature.key}`)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-primary-50">
                        {feature.standard ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.premium ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Type Recommendations Table */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('pricing.enterpriseRecommendations.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('pricing.enterpriseRecommendations.subtitle')}
              </p>
            </motion.div>

            <div className="flex justify-center">
              <div className="overflow-x-auto">
                <table className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-black">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">
                        {t('pricing.enterpriseRecommendations.tableHeaders.enterpriseType')}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b">
                        {t('pricing.enterpriseRecommendations.tableHeaders.recommendedPlan')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">
                        {t('pricing.enterpriseRecommendations.tableHeaders.description')}
                      </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200">
                  {enterpriseTypes.map((enterprise, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{enterprise.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{t(`pricing.enterpriseTypes.${enterprise.key}`)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          enterprise.recommended === 'GRATUIT' ? 'bg-gray-100 text-gray-800' :
                          enterprise.recommended === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {enterprise.recommended}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t(`pricing.enterpriseDescriptions.${enterprise.key}`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information Table */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('pricing.support.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('pricing.support.subtitle')}
              </p>
            </motion.div>

            <div className="flex justify-center">
              <div className="overflow-x-auto">
                <table className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-black">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b-2 border-black">
                      {t('pricing.support.tableHeaders.supportType')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b-2 border-black">
                      {t('pricing.plans.free.name')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b-2 border-black bg-primary-50">
                      {t('pricing.plans.standard.name')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b-2 border-black">
                      {t('pricing.plans.premium.name')}
                    </th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { 
                      key: 'emailSupport', 
                      icon: <Mail className="w-5 h-5 text-primary-600" />,
                      free: true, 
                      standard: true, 
                      premium: true
                    },
                    { 
                      key: 'whatsappSupport', 
                      icon: <MessageCircle className="w-5 h-5 text-blue-600" />,
                      free: false, 
                      standard: true, 
                      premium: true
                    },
                    { 
                      key: 'phoneSupport', 
                      icon: <Phone className="w-5 h-5 text-purple-600" />,
                      free: false, 
                      standard: false, 
                      premium: true
                    }
                  ].map((support, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {support.icon}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{t(`pricing.supportTypes.${support.key}`)}</div>
                            <div className="text-sm text-gray-500">{t(`pricing.supportDescriptions.${support.key}`)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {support.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-primary-50">
                        {support.standard ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {support.premium ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                {t('pricing.cta.title')}
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                {t('pricing.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleStartFreeAssessment}
                >
                  {t('pricing.cta.startFree')}
                </button>
                <button 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
                  onClick={handleContactClick}
                >
                  {t('pricing.cta.contactUs')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PricingPage
