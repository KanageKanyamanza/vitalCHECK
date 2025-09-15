import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Mail, 
  Download,
  BarChart3,
  Building2,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { clearCacheAndReload, forceServiceWorkerUpdate } from '../../utils/clearCache';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  
  // Utilisation du hook API
  const { loading, error, getStats, exportUsers, clearCache } = useAdminApi();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Fetch stats error:', error);
      // L'erreur est déjà gérée par le hook
    }
  };


  const handleClearCache = async () => {
    if (window.confirm('Voulez-vous nettoyer le cache et recharger l\'application ?')) {
      await clearCacheAndReload();
    }
  };

  const handleUpdateServiceWorker = async () => {
    await forceServiceWorkerUpdate();
    toast.success('Service Worker mis à jour');
  };

  const handleClearApiCache = () => {
    clearCache();
    toast.success('Cache API vidé');
  };

  const handleExport = async () => {
    try {
      await exportUsers();
      toast.success('Export réussi !');
    } catch (error) {
      console.error('Export error:', error);
      // L'erreur est déjà gérée par le hook
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
      <div className="p-4 lg:p-8 pb-20 lg:pb-8">
        {/* Debug Tools */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={handleUpdateServiceWorker}
            className="flex items-center px-3 py-2 text-sm text-primary-600 hover:text-primary-900 bg-primary-50 rounded-lg"
            title="Mettre à jour le Service Worker"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Mise à jour SW
          </button>
          <button
            onClick={handleClearCache}
            className="flex items-center px-3 py-2 text-sm text-warning-600 hover:text-warning-900 bg-warning-50 rounded-lg"
            title="Nettoyer le cache"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Nettoyer Cache
          </button>
          <button
            onClick={handleClearApiCache}
            className="flex items-center px-3 py-2 text-sm text-accent-600 hover:text-accent-900 bg-accent-50 rounded-lg"
            title="Vider le cache API"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Cache API
          </button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Utilisateurs
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats?.totalUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-success-600" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Évaluations Complétées
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats?.completedAssessments || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent-600" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Utilisateurs (7j)
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats?.recentUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-warning-600" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Évaluations (7j)
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats?.recentAssessments || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200">
                  <Users className="h-4 w-4 text-primary-600" />
                </div>
                Gérer les Utilisateurs
              </button>
              <button
                onClick={() => navigate('/admin/assessments')}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-success-50 hover:text-success-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-success-200">
                  <FileText className="h-4 w-4 text-success-600" />
                </div>
                Voir les Évaluations
              </button>
              <button
                onClick={() => navigate('/admin/emails')}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-earth-50 hover:text-earth-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-earth-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-earth-200">
                  <Mail className="h-4 w-4 text-earth-600" />
                </div>
                Envoyer des Emails
              </button>
              <button
                onClick={handleExport}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-accent-50 hover:text-accent-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-accent-200">
                  <Download className="h-4 w-4 text-accent-600" />
                </div>
                Exporter les Données
              </button>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Statistiques par Secteur</h3>
            <div className="space-y-3">
              {stats?.sectorStats?.slice(0, 5).map((sector, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">{sector._id}</span>
                  <span className="text-sm font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                    {sector.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Répartition par Taille d'Entreprise</h3>
            <div className="space-y-3">
              {stats?.sizeStats?.map((size, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {size._id === 'micro' ? 'Micro' : 
                     size._id === 'sme' ? 'PME' : 'Grande PME'}
                  </span>
                  <span className="text-sm font-bold text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
                    {size.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Statut des Évaluations</h3>
            <div className="space-y-3">
              {stats?.scoreStats?.map((status, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      status._id === 'green' ? 'bg-success-500' :
                      status._id === 'amber' ? 'bg-warning-500' : 'bg-danger-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status._id === 'green' ? 'Excellent' :
                       status._id === 'amber' ? 'Moyen' : 'Faible'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-full border">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
