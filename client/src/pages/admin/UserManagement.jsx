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
    deleteUser
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
    // Rediriger vers la messagerie avec l'ID de l'utilisateur
    navigate('/admin/inbox', { 
      state: { 
        openContactId: user._id,
        contactName: user.companyName,
        contactEmail: user.email,
        contactModel: 'User'
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
      <div className="p-4 lg:p-5">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
            <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">
                    Utilisateurs
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">
                    Gestion des comptes et structures inscrits
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-primary-50 text-primary-700 rounded-lg border border-primary-100 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black">{pagination.total} Total</span>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom ou email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9 w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs text-gray-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">
                Secteur
              </label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
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
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">
                Taille
              </label>
              <select
                value={filters.companySize}
                onChange={(e) => handleFilterChange('companySize', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
              >
                <option value="">Toutes les tailles</option>
                <option value="micro">Micro</option>
                <option value="sme">PME</option>
                <option value="large-sme">Grande PME</option>
              </select>
            </div>

            <div className="flex items-end">
                <button 
                  onClick={() => setFilters({search: '', sector: '', companySize: ''})}
                  className="w-full px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    Reset Filtrage
                </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Utilisateur / Email
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Téléphone
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Entreprise
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Secteur
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Taille
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Éval.
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Dernier Score
                  </th>
                  <th className="px-4 py-2 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50 font-bold">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-xs font-black text-gray-900 leading-tight">{user.email}</div>
                        <div className="text-[10px] text-gray-400">
                          Depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-[11px] text-gray-600">{user.phone || '—'}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-3.5 w-3.5 text-gray-400 mr-2" />
                        <div className="text-xs text-gray-900 leading-none">{user.companyName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-[10px] text-primary-600 uppercase tracking-tight">{user.sector}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex px-1.5 py-0.5 text-[10px] font-black rounded bg-gray-100 text-gray-600 border border-gray-200/50">
                        {user.companySize === 'micro' ? 'Micro' : 
                         user.companySize === 'sme' ? 'PME' : 'Grande PME'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center text-[11px] text-gray-900">
                        <FileText className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{user.assessments?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {user.assessments?.length > 0 ? (
                        <div className="flex flex-col">
                          <div className="text-[10px] font-black text-gray-900">
                            {user.assessments[0].overallScore}%
                          </div>
                          <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-black rounded-full w-fit leading-none ${getStatusColor(user.assessments[0].overallStatus)}`}>
                            {getStatusText(user.assessments[0].overallStatus)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Aucune</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-0.5">
                        <button
                          onClick={() => handleSendEmail(user)}
                          className="p-1 px-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded transition-all border border-transparent hover:border-gray-100"
                          title="Message"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="p-1 px-1.5 text-gray-400 hover:text-green-600 hover:bg-white rounded transition-all border border-transparent hover:border-gray-100"
                          title="Détails"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1 px-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-all border border-transparent hover:border-gray-100"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
            <div className="bg-gray-50/50 px-4 py-2 flex items-center justify-between border-t border-gray-100 font-bold">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {pagination.total} RESULTATS
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px bg-white">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-3 py-1.5 border text-[10px] font-black transition-all ${
                          pagination.current === i + 1
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current === pagination.pages}
                      className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
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
