import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Mail, Eye, Send, Trash2, Calendar, Users, FileText, Search, RotateCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Pagination from '../../components/admin/Pagination';
import toast from 'react-hot-toast';
import axios from 'axios';

// Configuration de l'URL de l'API
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "https://ubb-enterprise-health-check.onrender.com/api";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

const NewsletterManagement = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchNewsletters();
    fetchSubscriberStats();
  }, [pagination.page, statusFilter, searchTerm]);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter && { status: statusFilter })
      };

      const response = await axios.get(`${API_BASE_URL}/newsletters/admin/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        // Filtrer côté client pour la recherche
        let filteredNewsletters = response.data.newsletters;
        if (searchTerm) {
          filteredNewsletters = filteredNewsletters.filter(newsletter => 
            newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (newsletter.previewText && newsletter.previewText.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        setNewsletters(filteredNewsletters);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages
          }));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des newsletters:', error);
      toast.error('Erreur lors du chargement des newsletters');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriberStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/newsletters/admin/subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1 }
      });

      if (response.data.success) {
        setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // Initialiser avec des valeurs par défaut en cas d'erreur
      setStats({ total: 0, active: 0, inactive: 0 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette newsletter ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/newsletters/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Newsletter supprimée avec succès');
      fetchNewsletters();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleResend = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir renvoyer cette newsletter ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_BASE_URL}/newsletters/admin/${id}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Newsletter renvoyée à ${response.data.stats.sent} destinataires`);
        fetchNewsletters();
      }
    } catch (error) {
      console.error('Erreur lors du renvoi:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du renvoi');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const labels = {
      draft: 'Brouillon',
      scheduled: 'Programmée',
      sending: 'En cours',
      sent: 'Envoyée',
      cancelled: 'Annulée'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status] || badges.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Newsletters</h1>
            <p className="text-gray-600 mt-1">Créez et gérez vos newsletters</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/newsletters/subscribers')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Users className="w-5 h-5" />
              Voir les Abonnés
            </button>
            <button
              onClick={() => navigate('/admin/newsletters/create')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Newsletter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Newsletters</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pagination.total || newsletters.length}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abonnés Actifs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Envoyées</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {newsletters.filter(n => n.status === 'sent').length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {newsletters.filter(n => n.status === 'draft').length}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Mail className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par sujet..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tous les statuts</option>
                <option value="draft">Brouillon</option>
                <option value="scheduled">Programmée</option>
                <option value="sending">En cours</option>
                <option value="sent">Envoyée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Newsletters List */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Liste des Newsletters</h2>
          </div>

          {newsletters.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune newsletter pour le moment</p>
              <button
                onClick={() => navigate('/admin/newsletters/create')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                Créer votre première newsletter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sujet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destinataires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newsletters.map((newsletter) => (
                    <tr key={newsletter._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{newsletter.subject}</div>
                          {newsletter.previewText && (
                            <div className="text-sm text-gray-500 truncate max-w-md mt-1">
                              {newsletter.previewText}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(newsletter.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {newsletter.stats?.totalRecipients || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">
                              {newsletter.status === 'scheduled' && newsletter.scheduledAt
                                ? new Date(newsletter.scheduledAt).toLocaleDateString('fr-FR')
                                : newsletter.sentAt
                                ? new Date(newsletter.sentAt).toLocaleDateString('fr-FR')
                                : newsletter.createdAt
                                ? new Date(newsletter.createdAt).toLocaleDateString('fr-FR')
                                : '-'}
                            </span>
                            {newsletter.status === 'scheduled' && newsletter.scheduledAt && (
                              <span className="text-xs text-gray-500">
                                Programmée à {new Date(newsletter.scheduledAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/newsletters/edit/${newsletter._id}`)}
                            className="text-success-600 hover:text-success-900 p-1 rounded hover:bg-success-50 transition-colors"
                            title="Modifier"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {newsletter.status === 'sent' && (
                            <button
                              onClick={() => handleResend(newsletter._id)}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                              title="Renvoyer"
                            >
                              <RotateCw className="h-4 w-4" />
                            </button>
                          )}
                          {newsletter.status !== 'sent' && (
                            <button
                              onClick={() => handleDelete(newsletter._id)}
                              className="text-danger-600 hover:text-danger-900 p-1 rounded hover:bg-danger-50 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsletterManagement;
