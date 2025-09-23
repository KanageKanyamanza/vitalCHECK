import React, { useState, useEffect } from 'react'
import { X, BarChart3, Eye, Heart, FileText, TrendingUp, Calendar, Users } from 'lucide-react'
import { adminBlogApiService } from '../../services/api'

const BlogStatsModal = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadStats()
    }
  }, [isOpen])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await adminBlogApiService.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Statistiques du Blog
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Vue d'ensemble */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total des blogs</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Publiés</p>
                      <p className="text-2xl font-bold text-green-900">{stats.published}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Brouillons</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.draft}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Total vues</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques détaillées */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Blogs par type */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Blogs par type</h3>
                  <div className="space-y-3">
                    {stats.byType.map((item, index) => {
                      const typeLabels = {
                        'article': 'Articles',
                        'etude-cas': 'Études de cas',
                        'tutoriel': 'Tutoriels',
                        'actualite': 'Actualités',
                        'temoignage': 'Témoignages'
                      }
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              {typeLabels[item._id] || item._id}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Blogs par catégorie */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Blogs par catégorie</h3>
                  <div className="space-y-3">
                    {stats.byCategory.map((item, index) => {
                      const categoryLabels = {
                        'strategie': 'Stratégie',
                        'technologie': 'Technologie',
                        'finance': 'Finance',
                        'ressources-humaines': 'Ressources Humaines',
                        'marketing': 'Marketing',
                        'operations': 'Opérations',
                        'gouvernance': 'Gouvernance'
                      }
                      const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-rose-500']
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              {categoryLabels[item._id] || item._id}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Métriques d'engagement */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques d'engagement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Vues totales</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Likes totales</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalViews > 0 ? Math.round(stats.totalLikes / stats.totalViews * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Taux d'engagement</p>
                  </div>
                </div>
              </div>

              {/* Résumé */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Résumé</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><strong>Total des blogs :</strong> {stats.total}</p>
                    <p><strong>Blogs publiés :</strong> {stats.published}</p>
                    <p><strong>Blogs en brouillon :</strong> {stats.draft}</p>
                  </div>
                  <div>
                    <p><strong>Vues totales :</strong> {stats.totalViews.toLocaleString()}</p>
                    <p><strong>Likes totales :</strong> {stats.totalLikes.toLocaleString()}</p>
                    <p><strong>Moyenne vues par blog :</strong> {stats.total > 0 ? Math.round(stats.totalViews / stats.total) : 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune donnée disponible</h3>
              <p className="mt-1 text-sm text-gray-500">
                Les statistiques ne sont pas encore disponibles.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogStatsModal
