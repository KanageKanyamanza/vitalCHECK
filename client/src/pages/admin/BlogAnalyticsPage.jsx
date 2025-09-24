import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  ExternalLink,
  Heart,
  MousePointer,
  ArrowLeft
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { adminBlogApiService } from '../../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const BlogAnalyticsPage = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [visits, setVisits] = useState([])
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    blogId: '',
    country: '',
    deviceType: '',
    dateFrom: '',
    dateTo: ''
  })
  const [pagination, setPagination] = useState({})
  const [selectedBlog, setSelectedBlog] = useState(null)
  const navigate = useNavigate()
  // Charger les statistiques
  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await adminBlogApiService.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  // Charger les visites
  const loadVisits = async () => {
    try {
      const response = await adminBlogApiService.getAllVisits(filters)
      setVisits(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error loading visits:', error)
      toast.error('Erreur lors du chargement des visites')
    }
  }

  // Charger les visites d'un blog spécifique
  const loadBlogVisits = async (blogId) => {
    try {
      const response = await adminBlogApiService.getBlogVisits(blogId)
      setSelectedBlog(response.data.data)
    } catch (error) {
      console.error('Error loading blog visits:', error)
      toast.error('Erreur lors du chargement des visites du blog')
    }
  }

  useEffect(() => {
    loadStats()
    loadVisits()
  }, [])

  useEffect(() => {
    loadVisits()
  }, [filters])

  // Formater la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Formater la durée
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Obtenir l'icône de l'appareil
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      case 'desktop': return Monitor
      default: return Monitor
    }
  }

  // Obtenir la couleur de l'appareil
  const getDeviceColor = (deviceType) => {
    switch (deviceType) {
      case 'mobile': return 'text-blue-600 bg-blue-100'
      case 'tablet': return 'text-green-600 bg-green-100'
      case 'desktop': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Exporter les données
  const exportData = () => {
    const csvContent = [
      ['Date', 'Article', 'Pays', 'Ville', 'Appareil', 'Navigateur', 'Durée', 'Scroll', 'Rebond', 'Référent'],
      ...visits.map(visit => [
        formatDate(visit.visitedAt),
        visit.blog?.title || 'N/A',
        visit.country || 'N/A',
        visit.city || 'N/A',
        visit.device?.type || 'N/A',
        visit.device?.browser || 'N/A',
        formatDuration(visit.timeOnPage || 0),
        `${visit.scrollDepth || 0}%`,
        visit.isBounce ? 'Oui' : 'Non',
        visit.referrerDomain || 'Direct'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visites-blog-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 pb-20 pt-5">
      <button onClick={() => navigate('/admin/blog/stats')} className="text-primary-600 hover:text-primary-700"><span className="flex items-center"><ArrowLeft className="h-4 w-4 mr-2" /> Retour</span></button>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
          <p className="text-gray-600">{t('analytics.subtitle')}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadStats}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('analytics.refresh')}
          </button>
          <button
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('analytics.exportCsv')}
          </button>
        </div>
      </div>

      {/* Statistiques générales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('analytics.totalViews')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('analytics.uniqueVisitors')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.tracking?.uniqueVisitors || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('analytics.totalVisits')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.tracking?.totalVisits || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{t('analytics.totalLikes')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalLikes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Répartition par appareil */}
      {stats?.tracking?.deviceBreakdown && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('analytics.deviceBreakdown')}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.tracking.deviceBreakdown.map((device, index) => {
                const DeviceIcon = getDeviceIcon(device._id)
                const total = stats.tracking.deviceBreakdown.reduce((sum, d) => sum + d.count, 0)
                const percentage = ((device.count / total) * 100).toFixed(1)
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DeviceIcon className={`h-6 w-6 mr-3 ${getDeviceColor(device._id).split(' ')[0]}`} />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{device._id}</p>
                        <p className="text-sm text-gray-500">{device.count} {t('analytics.visits')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{percentage}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top pays */}
      {stats?.tracking?.topCountries && stats.tracking.topCountries.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{t('analytics.topCountries')}</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.tracking.topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{country._id}</span>
                  </div>
                  <span className="text-sm text-gray-500">{country.count} {t('analytics.visits')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('analytics.filters')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('analytics.startDate')}</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('analytics.endDate')}</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('analytics.country')}</label>
            <input
              type="text"
              placeholder={`Filtrer par ${t('analytics.country').toLowerCase()}`}
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('analytics.device')}</label>
            <select
              value={filters.deviceType}
              onChange={(e) => setFilters({ ...filters, deviceType: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{t('analytics.allDevices')}</option>
              <option value="desktop">{t('analytics.desktop')}</option>
              <option value="mobile">{t('analytics.mobile')}</option>
              <option value="tablet">{t('analytics.tablet')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des visites */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{t('analytics.recentVisits')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.article')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.location')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.device')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.duration')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.scroll')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('analytics.referrer')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit, index) => {
                const DeviceIcon = getDeviceIcon(visit.device?.type)
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(visit.visitedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={visit.blog?.title}>
                        {visit.blog?.title || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {visit.country && <div>{visit.country}</div>}
                        {visit.city && <div className="text-xs text-gray-400">{visit.city}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <DeviceIcon className={`h-4 w-4 mr-2 ${getDeviceColor(visit.device?.type).split(' ')[0]}`} />
                        <div>
                          <div className="font-medium">{visit.device?.type || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{visit.device?.browser || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(visit.timeOnPage || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MousePointer className="h-4 w-4 mr-1" />
                        {visit.scrollDepth || 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {visit.referrerDomain ? (
                          <>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span className="max-w-xs truncate" title={visit.referrerDomain}>
                              {visit.referrerDomain}
                            </span>
                          </>
                        ) : (
                            <span className="text-gray-400">{t('analytics.direct')}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t('analytics.showing')} {((pagination.current - 1) * pagination.limit) + 1} {t('analytics.to')} {Math.min(pagination.current * pagination.limit, pagination.total)} {t('analytics.of')} {pagination.total} {t('analytics.results')}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('analytics.previous')}
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, filters.page + 1) })}
                  disabled={filters.page === pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('analytics.next')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogAnalyticsPage
