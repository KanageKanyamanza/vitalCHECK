import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Scale, AlertTriangle, CheckCircle, Users, Globe } from 'lucide-react'
import { BackButton } from '../components/navigation'
import useSmoothScroll from '../hooks/useSmoothScroll'

const TermsOfService = () => {
  const { t } = useTranslation()
  const { scrollToTop } = useSmoothScroll()

  useEffect(() => {
    // Scroll to top when page loads
    scrollToTop(600)
  }, [scrollToTop])

  return (
    <div className="min-h-screen bg-gray-50 py-[70px]">
      {/* Back Button */}
      <div className="m-4">
          <BackButton />
        </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-display font-bold VitalCheck-gradient-text mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('terms.lastUpdated')}: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.introduction.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('terms.introduction.content')}
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('terms.acceptance.title')}
              </h2>
            </div>
            <p className="text-gray-700">
              {t('terms.acceptance.content')}
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.serviceDescription.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('terms.serviceDescription.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('terms.serviceDescription.features.assessment')}</li>
                <li>{t('terms.serviceDescription.features.reports')}</li>
                <li>{t('terms.serviceDescription.features.consultation')}</li>
                <li>{t('terms.serviceDescription.features.support')}</li>
              </ul>
            </div>
          </section>

          {/* User Obligations */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('terms.userObligations.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('terms.userObligations.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('terms.userObligations.obligations.accuracy')}</li>
                <li>{t('terms.userObligations.obligations.authorization')}</li>
                <li>{t('terms.userObligations.obligations.compliance')}</li>
                <li>{t('terms.userObligations.obligations.responsibility')}</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.intellectualProperty.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('terms.intellectualProperty.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('terms.intellectualProperty.rights.VitalCheck')}</li>
                <li>{t('terms.intellectualProperty.rights.user')}</li>
                <li>{t('terms.intellectualProperty.rights.license')}</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.paymentTerms.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('terms.paymentTerms.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('terms.paymentTerms.conditions.free')}</li>
                <li>{t('terms.paymentTerms.conditions.premium')}</li>
                <li>{t('terms.paymentTerms.conditions.refund')}</li>
                <li>{t('terms.paymentTerms.conditions.currency')}</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('terms.limitationLiability.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('terms.limitationLiability.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('terms.limitationLiability.limitations.advice')}</li>
                <li>{t('terms.limitationLiability.limitations.accuracy')}</li>
                <li>{t('terms.limitationLiability.limitations.damages')}</li>
                <li>{t('terms.limitationLiability.limitations.force')}</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {t('terms.governingLaw.title')}
              </h2>
            </div>
            <p className="text-gray-700">
              {t('terms.governingLaw.content')}
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.disputeResolution.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                {t('terms.disputeResolution.content')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>{t('terms.disputeResolution.steps.negotiation')}</li>
                <li>{t('terms.disputeResolution.steps.mediation')}</li>
                <li>{t('terms.disputeResolution.steps.arbitration')}</li>
                <li>{t('terms.disputeResolution.steps.courts')}</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.termination.title')}
            </h2>
            <p className="text-gray-700">
              {t('terms.termination.content')}
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.contact.title')}
            </h2>
            <p className="text-gray-700 mb-4">
              {t('terms.contact.content')}
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong> info@checkmyenterprise.com
              </p>
              <p className="text-gray-700">
                <strong>Sénégal:</strong> +221 771970713
              </p>
              <p className="text-gray-700">
                <strong>Royaume-Uni:</strong> +44 7546756325
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {t('terms.updates.title')}
            </h2>
            <p className="text-gray-700">
              {t('terms.updates.content')}
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}

export default TermsOfService
