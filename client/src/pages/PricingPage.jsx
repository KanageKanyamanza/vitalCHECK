import React from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Check, X, Star } from 'lucide-react'
import { SocialShare } from '../components/ui'
import { Section, Container } from '../components/ui/ds'
import PlanCard from '../components/pricing/PlanCard'
import { PLAN_IDS, POPULAR_PLAN, ENTERPRISE_TYPES, SUPPORT } from '../components/pricing/planData'

const PricingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const enterpriseTypes = ENTERPRISE_TYPES

  const handleContactClick = () => {
    navigate('/contact')
  }

  const handleStartFreeAssessment = () => {
    navigate('/diagnostic')
  }

  return (
    <>
      <Helmet>
        <title>Tarifs - vitalCHECK | Plans d'abonnement pour votre entreprise</title>
        <meta name="description" content="Découvrez nos plans tarifaires vitalCHECK : GRATUIT, STANDARD et PREMIUM. Choisissez la solution adaptée à votre entreprise pour améliorer votre santé organisationnelle." />
        <meta name="keywords" content="tarifs, prix, abonnement, vitalCHECK, diagnostic entreprise, PME, TPE, coopératives" />
        <meta property="og:title" content="Tarifs - vitalCHECK | Plans d'abonnement" />
        <meta property="og:description" content="Choisissez le plan vitalCHECK adapté à votre entreprise. Plans GRATUIT, STANDARD et PREMIUM disponibles." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-ubb-paper-soft">
        {/* En-tête et plans */}
        <Section tone="soft" aria-labelledby="pricing-title" className="!pb-12">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 id="pricing-title" className="ubb-heading text-ubb-title sm:text-ubb-display">
                {t('pricing.title')}
              </h1>
              <p className="mt-4 font-text text-ubb-lead text-ubb-ink-muted">{t('pricing.subtitle')}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-text text-sm font-medium text-ubb-ink">
                {['freeEvaluation', 'noCommitment', 'supportIncluded'].map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-ubb-brand-900" strokeWidth={3} aria-hidden="true" />
                    {t(`pricing.heroFeatures.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3 md:items-start lg:gap-8">
              {PLAN_IDS.map((planId) => (
                <PlanCard key={planId} planId={planId} popular={planId === POPULAR_PLAN} />
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center font-text text-ubb-small text-ubb-ink-muted">
              {t('pricing.card.billingNote')}
            </p>
          </Container>
        </Section>

        {/* Special Diagnostic Service Pack */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Special Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                <Star className="w-4 h-4 mr-2 fill-current" />
                {t('pricing.plans.diagnostic.special')}
              </div>
            </div>

            {/* Diagnostic Service Card */}
            <div className="relative bg-yellow-50 rounded-2xl border-4 border-yellow-400 p-8 md:p-12 shadow-2xl">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {t('pricing.plans.diagnostic.name')}
                  </h2>
                  <p className="text-xl text-yellow-800 font-semibold mb-6">
                    {t('pricing.plans.diagnostic.subtitle')}
                  </p>
                  
                  {/* Pricing */}
                  <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                    <div className="bg-white rounded-lg px-6 py-3 shadow-md">
                      <span className="text-3xl md:text-4xl font-bold text-yellow-600">
                        {t('pricing.plans.diagnostic.price')}
                      </span>
                    </div>
                    <div className="text-gray-600 font-semibold">{t('pricing.common.or')}</div>
                    <div className="bg-white rounded-lg px-6 py-3 shadow-md">
                      <span className="text-3xl md:text-4xl font-bold text-yellow-600">
                        {t('pricing.plans.diagnostic.alternativePrice')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6 text-left">
                  <div className="bg-white/80 rounded-lg p-6 shadow-md">
                    <p className="text-gray-700 leading-relaxed">
                      {t('pricing.plans.diagnostic.description')}
                    </p>
                  </div>

                  <div className="bg-white/80 rounded-lg p-6 shadow-md">
                    <div className="flex items-start space-x-3">
                      <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">
                        {t('pricing.plans.diagnostic.includes')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-100 rounded-lg p-6 shadow-md border-2 border-yellow-300">
                    <div className="flex items-start space-x-3">
                      <Star className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1 fill-current" />
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {t('pricing.plans.diagnostic.retainer')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate('/checkout?plan=diagnostic')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
                  >
                    {t('pricing.plans.diagnostic.button')}
                  </button>
                </div>
              </div>
            </div>
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
                          <enterprise.icon className="mr-3 h-5 w-5 text-ubb-brand-900" aria-hidden="true" />
                          <span className="text-sm font-medium text-gray-900">{t(`pricing.enterpriseTypes.${enterprise.key}`)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-block rounded-full bg-ubb-brand-50 px-3 py-1 text-xs font-semibold text-ubb-brand-950">
                          {t(`pricing.plans.${enterprise.plan}.label`)}
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
                  {SUPPORT.map((support, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <support.icon className="h-5 w-5 text-ubb-brand-900" aria-hidden="true" />
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

        {/* Social Share */}
        <SocialShare 
          title="Tarifs vitalCHECK - Plans d'abonnement"
          description="Choisissez le plan adapté à votre entreprise : GRATUIT, STANDARD, PREMIUM ou SERVICE DE DIAGNOSTIC."
        />
      </div>
    </>
  )
}

export default PricingPage
