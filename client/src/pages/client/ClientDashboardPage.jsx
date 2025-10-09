import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  FileText,
  Download,
  TrendingUp,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Settings,
  Plus
} from 'lucide-react'
import { useClientAuth } from '../../context/ClientAuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ClientDashboardPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout, loading: authLoading } = useClientAuth()
  
  const [assessments, setAssessments] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/client/login')
    } else if (user) {
      loadDashboardData()
    }
  }, [user, authLoading, navigate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('clientToken')
      
      // Load assessments
      const assessmentsResponse = await axios.get(
        `${API_URL}/api/assessments/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAssessments(assessmentsResponse.data.assessments || [])

      // Load payments
      const paymentsResponse = await axios.get(
        `${API_URL}/api/client-auth/payments`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPayments(paymentsResponse.data.payments || [])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const badge = getSubscriptionBadge()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('clientDashboard.welcome')}, {user?.firstName || user?.companyName}!
              </h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/client/profile')}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t('clientDashboard.settings')}</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{t('clientDashboard.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="font-semibold text-gray-900">{t('clientDashboard.subscription.title')}</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                {badge.label}
              </div>
              <p className="text-sm text-gray-600">
                {user?.subscription?.status === 'active' 
                  ? t('clientDashboard.subscription.active')
                  : t('clientDashboard.subscription.inactive')
                }
              </p>
              {user?.subscription?.plan !== 'free' && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('clientDashboard.subscription.manage')} →
                </button>
              )}
            </div>
          </motion.div>

          {/* Assessments Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="font-semibold text-gray-900">{t('clientDashboard.assessments.title')}</h3>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{assessments.length}</div>
              <p className="text-sm text-gray-600">{t('clientDashboard.assessments.total')}</p>
              <button
                onClick={() => navigate('/assessment')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('clientDashboard.assessments.new')}
              </button>
            </div>
          </motion.div>

          {/* Payments Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="font-semibold text-gray-900">{t('clientDashboard.payments.title')}</h3>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{payments.length}</div>
              <p className="text-sm text-gray-600">{t('clientDashboard.payments.total')}</p>
            </div>
          </motion.div>
        </div>

        {/* Assessments History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow mb-8"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-primary-600" />
              {t('clientDashboard.history.title')}
            </h2>
          </div>
          <div className="p-6">
            {assessments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">{t('clientDashboard.history.noAssessments')}</p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {t('clientDashboard.history.startFirst')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {t('clientDashboard.history.evaluation')} - {new Date(assessment.createdAt).toLocaleDateString('fr-FR')}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-gray-600">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(assessment.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="font-semibold text-primary-600">
                            {t('clientDashboard.history.score')}: {assessment.totalScore?.toFixed(0)}/100
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/results?id=${assessment._id}`)}
                          className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {t('clientDashboard.history.viewReport')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Payments History */}
        {payments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                {t('clientDashboard.paymentsHistory.title')}
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('clientDashboard.paymentsHistory.date')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('clientDashboard.paymentsHistory.plan')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('clientDashboard.paymentsHistory.amount')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('clientDashboard.paymentsHistory.status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {payment.planName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${payment.amount} {payment.currency}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {t('clientDashboard.paymentsHistory.completed')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default ClientDashboardPage

