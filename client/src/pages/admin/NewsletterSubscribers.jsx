import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Users, Search, Download, CheckCircle, XCircle, Calendar, Filter, Send, ArrowLeft } from 'lucide-react';
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

const NewsletterSubscribers = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchSubscribers();
  }, [pagination.page, statusFilter, searchTerm, dateRangeFilter]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter && { isActive: statusFilter === 'active' ? 'true' : 'false' }),
        ...(searchTerm && { search: searchTerm }),
        ...(dateRangeFilter && { dateRange: dateRangeFilter })
      };

      const response = await axios.get(`${API_BASE_URL}/newsletters/admin/subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setSubscribers(response.data.subscribers);
        setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des abonnés');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Prénom', 'Nom', 'Statut', 'Date d\'inscription', 'Source'];
    const rows = subscribers.map(sub => [
      sub.email,
      sub.firstName || '',
      sub.lastName || '',
      sub.isActive ? 'Actif' : 'Inactif',
      new Date(sub.subscribedAt).toLocaleDateString('fr-FR'),
      sub.source || 'footer'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `abonnes_newsletter_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Export CSV réussi');
  };

  const handleSendToSelected = () => {
    if (selectedSubscribers.length === 0) {
      toast.error('Veuillez sélectionner au moins un abonné');
      return;
    }

    // Récupérer les emails des abonnés sélectionnés
    const selectedEmails = subscribers
      .filter(sub => selectedSubscribers.includes(sub._id))
      .map(sub => sub.email);

    // Sauvegarder les emails dans localStorage pour les passer à la page d'envoi
    localStorage.setItem('newsletterSelectedEmails', JSON.stringify(selectedEmails));
    
    // Rediriger vers la page de création/édition de newsletter
    navigate('/admin/newsletters/create');
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? (
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Actif
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Inactif
          </span>
        )}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    const sources = {
      footer: { label: 'Footer', color: 'bg-blue-100 text-blue-800' },
      landing: { label: 'Landing', color: 'bg-purple-100 text-purple-800' },
      manual: { label: 'Manuel', color: 'bg-gray-100 text-gray-800' },
      import: { label: 'Import', color: 'bg-orange-100 text-orange-800' }
    };

    const sourceInfo = sources[source] || sources.footer;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceInfo.color}`}>
        {sourceInfo.label}
      </span>
    );
  };

  if (loading && subscribers.length === 0) {
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Abonnés à la Newsletter</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez les abonnés à votre newsletter</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate('/admin/newsletters')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Retourner aux Newsletters</span>
              <span className="sm:hidden">Newsletters</span>
            </button>
            {selectedSubscribers.length > 0 && (
              <button
                onClick={handleSendToSelected}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Envoyer à {selectedSubscribers.length} abonné{selectedSubscribers.length > 1 ? 's' : ''}</span>
                <span className="sm:hidden">Envoyer ({selectedSubscribers.length})</span>
              </button>
            )}
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Exporter CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Abonnés</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abonnés Actifs</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abonnés Inactifs</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par email, prénom, nom..."
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
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs uniquement</option>
                  <option value="inactive">Inactifs uniquement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={dateRangeFilter}
                  onChange={(e) => {
                    setDateRangeFilter(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">7 derniers jours</option>
                  <option value="month">30 derniers jours</option>
                  <option value="year">12 derniers mois</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setDateRangeFilter('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Liste des Abonnés ({pagination.total})
            </h2>
          </div>

          {subscribers.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Aucun abonné trouvé</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubscribers(subscribers.map(s => s._id));
                            } else {
                              setSelectedSubscribers([]);
                            }
                          }}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all hover:border-primary-400 checked:bg-primary-600 checked:border-primary-600"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom complet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber) => (
                      <tr 
                        key={subscriber._id} 
                        className={`hover:bg-gray-50 transition-colors ${selectedSubscribers.includes(subscriber._id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(subscriber._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSubscribers([...selectedSubscribers, subscriber._id]);
                              } else {
                                setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber._id));
                              }
                            }}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all hover:border-primary-400 checked:bg-primary-600 checked:border-primary-600"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {subscriber.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {subscriber.firstName || subscriber.lastName
                              ? `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim()
                              : '-'}
                            {subscriber.isPlatformUser && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Utilisateur
                              </span>
                            )}
                          </div>
                          {subscriber.companyName && (
                            <div className="text-xs text-gray-500 mt-1">
                              {subscriber.companyName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(subscriber.isActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getSourceBadge(subscriber.source)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <div 
                    key={subscriber._id} 
                    className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${selectedSubscribers.includes(subscriber._id) ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers([...selectedSubscribers, subscriber._id]);
                          } else {
                            setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber._id));
                          }
                        }}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all hover:border-primary-400 checked:bg-primary-600 checked:border-primary-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {subscriber.email}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-900 mb-1">
                          {subscriber.firstName || subscriber.lastName
                            ? `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim()
                            : '-'}
                          {subscriber.isPlatformUser && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Utilisateur
                            </span>
                          )}
                        </div>
                        {subscriber.companyName && (
                          <div className="text-xs text-gray-500 mb-2">
                            {subscriber.companyName}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getStatusBadge(subscriber.isActive)}
                          {getSourceBadge(subscriber.source)}
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default NewsletterSubscribers;
