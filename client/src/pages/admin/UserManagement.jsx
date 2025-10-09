import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Mail, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Building2,
  Users,
  Calendar,
  FileText
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    companySize: ''
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  
  // Utilisation du hook API
  const { 
    loading, 
    error, 
    getUsers, 
    deleteUser, 
    sendReminderEmail, 
    sendBulkEmails 
  } = useAdminApi();

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, filters]);

  const fetchUsers = async () => {
    try {
      const params = {
        page: pagination.current,
        limit: 10,
        ...filters
      };

      const data = await getUsers(params);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Fetch users error:', error);
      // L'erreur est déjà gérée par le hook
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const handleSendEmail = (user) => {
    navigate('/admin/emails', { 
      state: { 
        selectedUsers: [user._id],
        userEmails: [user.email]
      } 
    });
  };

  const handleBulkEmail = () => {
    if (selectedUsers.length === 0) {
      toast.error('Sélectionnez au moins un utilisateur');
      return;
    }
    
    const userEmails = users
      .filter(user => selectedUsers.includes(user._id))
      .map(user => user.email);
    
    navigate('/admin/emails', { 
      state: { 
        selectedUsers,
        userEmails
      } 
    });
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      // L'erreur est déjà gérée par le hook
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return 'text-green-600 bg-green-100';
      case 'amber': return 'text-yellow-600 bg-yellow-100';
      case 'red': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'green': return 'Excellent';
      case 'amber': return 'Moyen';
      case 'red': return 'Faible';
      default: return 'N/A';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Filters */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom ou email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteur
              </label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tous les secteurs</option>
                <option value="technologie">Technologie</option>
                <option value="finance">Finance</option>
                <option value="sante">Santé</option>
                <option value="education">Éducation</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille
              </label>
              <select
                value={filters.companySize}
                onChange={(e) => handleFilterChange('companySize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Toutes les tailles</option>
                <option value="micro">Micro</option>
                <option value="sme">PME</option>
                <option value="large-sme">Grande PME</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleBulkEmail}
                disabled={selectedUsers.length === 0}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Secteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Évaluations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernier Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">
                          Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{user.companyName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{user.sector}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-secondary-100 text-secondary-800">
                        {user.companySize === 'micro' ? 'Micro' : 
                         user.companySize === 'sme' ? 'PME' : 'Grande PME'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{user.assessments?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.assessments?.length > 0 ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.assessments[0].overallScore}%
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.assessments[0].overallStatus)}`}>
                            {getStatusText(user.assessments[0].overallStatus)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Aucune</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendEmail(user)}
                          className="text-earth-600 hover:text-earth-900 p-1 rounded hover:bg-earth-50"
                          title="Envoyer un email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="text-success-600 hover:text-success-900 p-1 rounded hover:bg-success-50"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-danger-600 hover:text-danger-900 p-1 rounded hover:bg-danger-50"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(pagination.current - 1) * 10 + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(pagination.current * 10, pagination.total)}
                    </span>{' '}
                    sur <span className="font-medium">{pagination.total}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.current === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
