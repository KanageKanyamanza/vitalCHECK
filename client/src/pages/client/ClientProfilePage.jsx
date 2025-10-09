import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  User,
  Mail,
  Building2,
  Phone,
  Lock,
  ArrowLeft,
  Save,
  CreditCard,
  Shield
} from 'lucide-react'
import { useClientAuth } from '../../context/ClientAuthContext'

const ClientProfilePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, updateProfile, changePassword, logout } = useClientAuth()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    companyName: user?.companyName || '',
    sector: user?.sector || '',
    companySize: user?.companySize || '',
    phone: user?.phone || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await updateProfile(profileData)
    setLoading(false)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('clientProfile.errors.passwordMismatch'))
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(t('clientProfile.errors.passwordTooShort'))
      return
    }

    setLoading(true)
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)
    
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
    
    setLoading(false)
  }

  const getSubscriptionBadge = () => {
    const plan = user?.subscription?.plan || 'free'
    const badges = {
      free: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'GRATUIT' },
      standard: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'STANDARD' },
      premium: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'PREMIUM' },
      diagnostic: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'DIAGNOSTIC' }
    }
    return badges[plan]
  }

  const badge = getSubscriptionBadge()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/client/dashboard')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('clientProfile.title')}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                {t('clientProfile.tabs.profile')}
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'subscription'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                {t('clientProfile.tabs.subscription')}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Shield className="w-5 h-5 inline mr-2" />
                {t('clientProfile.tabs.security')}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('clientProfile.firstName')}
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('clientProfile.lastName')}
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('clientProfile.email')}
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('clientProfile.emailNote')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('clientProfile.companyName')}
                  </label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('clientProfile.sector')}
                    </label>
                    <select
                      value={profileData.sector}
                      onChange={(e) => setProfileData({ ...profileData, sector: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="technology">{t('landing.sectors.technology')}</option>
                      <option value="commerce">{t('landing.sectors.commerce')}</option>
                      <option value="services">{t('landing.sectors.services')}</option>
                      <option value="manufacturing">{t('landing.sectors.manufacturing')}</option>
                      <option value="agriculture">{t('landing.sectors.agriculture')}</option>
                      <option value="education">{t('landing.sectors.education')}</option>
                      <option value="finance">{t('landing.sectors.finance')}</option>
                      <option value="other">{t('landing.sectors.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('clientProfile.companySize')}
                    </label>
                    <select
                      value={profileData.companySize}
                      onChange={(e) => setProfileData({ ...profileData, companySize: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="micro">{t('landing.sizes.micro')}</option>
                      <option value="sme">{t('landing.sizes.sme')}</option>
                      <option value="large-sme">{t('landing.sizes.large-sme')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('clientProfile.phone')}
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? t('common.processing') : t('clientProfile.saveChanges')}
                </button>
              </form>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{t('clientProfile.currentPlan')}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-flex px-4 py-2 rounded-full text-lg font-bold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                      <p className="text-sm text-gray-600 mt-2">
                        {user?.subscription?.status === 'active' 
                          ? t('clientProfile.statusActive')
                          : t('clientProfile.statusInactive')
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {t('clientProfile.upgradePlan')}
                    </button>
                  </div>
                </div>

                {user?.subscription?.startDate && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('clientProfile.subscriptionDetails')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('clientProfile.startDate')}:</span>
                        <span className="font-medium">
                          {new Date(user.subscription.startDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {user?.subscription?.endDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t('clientProfile.endDate')}:</span>
                          <span className="font-medium">
                            {new Date(user.subscription.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('clientProfile.currentPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('clientProfile.newPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('clientProfile.passwordHint')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('clientProfile.confirmNewPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {loading ? t('common.processing') : t('clientProfile.changePassword')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClientProfilePage

