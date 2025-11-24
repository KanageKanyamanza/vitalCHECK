import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react'
import { BackButton } from '../components/navigation'
import useSmoothScroll from '../hooks/useSmoothScroll'

const PrivacyPolicy = () => {
  const { t } = useTranslation()
  const { scrollToTop } = useSmoothScroll()

  useEffect(() => {
    // Scroll to top when page loads
    scrollToTop(600)
  }, [scrollToTop])

  return (
    <div className="min-h-screen bg-gray-50 pb-[50px]">
      {/* Back Button */}
      <div className="m-4">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-display font-bold vitalCHECK-gradient-text mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('privacy.introduction.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacy.introduction.content')}
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('privacy.dataCollection.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('privacy.dataCollection.personalData.title')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{t('privacy.dataCollection.personalData.items.name')}</li>
                  <li>{t('privacy.dataCollection.personalData.items.email')}</li>
                  <li>{t('privacy.dataCollection.personalData.items.company')}</li>
                  <li>{t('privacy.dataCollection.personalData.items.sector')}</li>
                  <li>{t('privacy.dataCollection.personalData.items.size')}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('privacy.dataCollection.assessmentData.title')}
                </h3>
                <p className="text-gray-700">
                  {t('privacy.dataCollection.assessmentData.content')}
                </p>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('privacy.dataUsage.title')}
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{t('privacy.dataUsage.items.assessment')}</li>
              <li>{t('privacy.dataUsage.items.reports')}</li>
              <li>{t('privacy.dataUsage.items.communication')}</li>
              <li>{t('privacy.dataUsage.items.improvement')}</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('privacy.dataProtection.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('privacy.dataProtection.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('privacy.dataProtection.measures.encryption')}</li>
                <li>{t('privacy.dataProtection.measures.access')}</li>
                <li>{t('privacy.dataProtection.measures.backup')}</li>
                <li>{t('privacy.dataProtection.measures.monitoring')}</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('privacy.dataSharing.title')}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              {t('privacy.dataSharing.content')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>{t('privacy.dataSharing.exceptions.legal')}</li>
              <li>{t('privacy.dataSharing.exceptions.consent')}</li>
              <li>{t('privacy.dataSharing.exceptions.aggregated')}</li>
            </ul>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('privacy.userRights.title')}
            </h2>
            <p className="text-gray-700 mb-4">
              {t('privacy.userRights.content')}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>{t('privacy.userRights.rights.access')}</li>
              <li>{t('privacy.userRights.rights.rectification')}</li>
              <li>{t('privacy.userRights.rights.erasure')}</li>
              <li>{t('privacy.userRights.rights.portability')}</li>
              <li>{t('privacy.userRights.rights.objection')}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('privacy.cookies.title')}
            </h2>
            <p className="text-gray-700">
              {t('privacy.cookies.content')}
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('privacy.internationalTransfers.title')}
              </h2>
            </div>
            <p className="text-gray-700">
              {t('privacy.internationalTransfers.content')}
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('privacy.contact.title')}
            </h2>
            <p className="text-gray-700 mb-4">
              {t('privacy.contact.content')}
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong> info@checkmyenterprise.com
              </p>
              <p className="text-gray-700">
                <strong>Sénégal:</strong> +221 771970713 | +221 774536704
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('privacy.updates.title')}
            </h2>
            <p className="text-gray-700">
              {t('privacy.updates.content')}
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
