import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MapPin, 
  Calendar,
  TrendingUp,
  UserCheck,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'
import { adminBlogApiService } from '../../services/api'
import toast from 'react-hot-toast'

const BlogVisitorsPage = () => {
  const { t } = useTranslation()
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    sortBy: 'lastVisitAt',
    sortOrder: 'desc'
  })
  const [expandedVisitor, setExpandedVisitor] = useState(null)
  const [showStats, setShowStats] = useState(true)

  // Charger les visiteurs
  const loadVisitors = async () => {
    try {
      setLoading(true)
      const response = await adminBlogApiService.getVisitors({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        country: filters.country,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })
      
      setVisitors(response.data.data)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Erreur lors du chargement des visiteurs:', error)
      toast.error('Erreur lors du chargement des visiteurs')
    } finally {
      setLoading(false)
    }
  }

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const response = await adminBlogApiService.getVisitorStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  useEffect(() => {
    loadVisitors()
    loadStats()
  }, [pagination.page, filters])

  // Gérer les changements de filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPagination(prev => ({
      ...prev,
      page: 1 // Reset à la première page
    }))
  }

  // Exporter les données
  const handleExport = async (format) => {
    try {
      const response = await adminBlogApiService.exportVisitors(format)
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `visiteurs-blog.${format === 'excel' ? 'xlsx' : 'csv'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success(`Export ${format.toUpperCase()} généré avec succès`)
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  // Obtenir l'icône du type d'appareil
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone
      case 'tablet':
        return Tablet
      case 'desktop':
        return Monitor
      default:
        return Monitor
    }
  }

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
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    
    return `${remainingSeconds}s`
  }

  return (
    <div className="space-y-6 pb-20">
      {/* En-tête */}
      <div className="flex flex-wrap gap-1 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-3 text-primary-600" />
            Visiteurs du Blog
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion et analyse des visiteurs du blog
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport('excel')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      {showStats && stats && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Statistiques Globales</h2>
            <button
              onClick={() => setShowStats(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{stats.totalVisitors || 0}</div>
              <div className="text-sm text-gray-600">Total Visiteurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.returningVisitors || 0}</div>
              <div className="text-sm text-gray-600">Visiteurs de Retour</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalBlogVisits || 0}</div>
              <div className="text-sm text-gray-600">Total Visites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.averageTimeSpent ? Math.floor(stats.averageTimeSpent / 60) : 0}m
              </div>
              <div className="text-sm text-gray-600">Temps Moyen</div>
            </div>
          </div>

          {/* Top pays */}
          {stats.topCountries && stats.topCountries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Top Pays</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.topCountries.slice(0, 5).map((country, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{country._id}</div>
                    <div className="text-sm text-gray-600">{country.count} visiteurs</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Répartition des appareils */}
          {stats.deviceBreakdown && stats.deviceBreakdown.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Répartition des Appareils</h3>
              <div className="flex space-x-6">
                {stats.deviceBreakdown.map((device, index) => {
                  const DeviceIcon = getDeviceIcon(device._id)
                  return (
                    <div key={index} className="flex items-center">
                      <DeviceIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {device._id}: {device.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {!showStats && (
        <button
          onClick={() => setShowStats(true)}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          Afficher les statistiques
        </button>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nom, email..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pays
            </label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="Filtrer par pays..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="lastVisitAt">Dernière visite</option>
              <option value="createdAt">Date d'inscription</option>
              <option value="totalBlogsVisited">Nombre de blogs</option>
              <option value="firstName">Prénom</option>
              <option value="lastName">Nom</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordre
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des visiteurs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Chargement des visiteurs...</p>
          </div>
        ) : visitors.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun visiteur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visiteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appareil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistiques
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière visite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitors.map((visitor) => {
                  const DeviceIcon = getDeviceIcon(visitor.device?.type)
                  return (
                    <React.Fragment key={visitor._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {visitor.firstName} {visitor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{visitor.email}</div>
                              {visitor.isReturningVisitor && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Visiteur de retour
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            {visitor.country}
                          </div>
                          {visitor.city && (
                            <div className="text-sm text-gray-500">{visitor.city}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <DeviceIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {visitor.device?.type || 'Inconnu'}
                          </div>
                          {visitor.device?.browser && (
                            <div className="text-sm text-gray-500">{visitor.device.browser}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{visitor.totalBlogsVisited} blogs</div>
                          <div className="text-gray-500">
                            {formatDuration(visitor.totalTimeSpent)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(visitor.lastVisitAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setExpandedVisitor(
                              expandedVisitor === visitor._id ? null : visitor._id
                            )}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            {expandedVisitor === visitor._id ? 'Masquer' : 'Détails'}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Ligne détaillée */}
                      {expandedVisitor === visitor._id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Blogs visités
                                </h4>
                                <div className="space-y-2">
                                  {visitor.blogsVisited.map((visit, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {visit.blogTitle}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {formatDate(visit.visitedAt)}
                                        </div>
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        <div>Scroll: {Math.round(visit.scrollDepth)}%</div>
                                        <div>Temps: {formatDuration(visit.timeOnPage)}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Informations techniques
                                  </h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div>IP: {visitor.ipAddress}</div>
                                    <div>Session: {visitor.sessionId}</div>
                                    <div>OS: {visitor.device?.os || 'Inconnu'}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Statistiques
                                  </h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div>Profondeur moyenne: {Math.round(visitor.averageScrollDepth)}%</div>
                                    <div>Première visite: {formatDate(visitor.createdAt)}</div>
                                    <div>Statut: {visitor.status}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  sur <span className="font-medium">{pagination.total}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogVisitorsPage
