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
      <div className="p-4 lg:p-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 transition-all hover:shadow-lg">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-[11px] font-black uppercase text-gray-400 tracking-wider truncate">
                      Total Utilisateurs
                    </dt>
                    <dd className="text-xl font-black text-gray-900 leading-tight">
                      {stats?.totalUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 transition-all hover:shadow-lg">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-success-600" />
                  </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-[11px] font-black uppercase text-gray-400 tracking-wider truncate">
                      Évaluations Complétées
                    </dt>
                    <dd className="text-xl font-black text-gray-900 leading-tight">
                      {stats?.completedAssessments || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 transition-all hover:shadow-lg">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-accent-600" />
                  </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-[11px] font-black uppercase text-gray-400 tracking-wider truncate">
                      Utilisateurs (7j)
                    </dt>
                    <dd className="text-xl font-black text-gray-900 leading-tight">
                      {stats?.recentUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100 transition-all hover:shadow-lg">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-warning-600" />
                  </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-[11px] font-black uppercase text-gray-400 tracking-wider truncate">
                      Évaluations (7j)
                    </dt>
                    <dd className="text-xl font-black text-gray-900 leading-tight">
                      {stats?.recentAssessments || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Sector Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              Actions Rapides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-all border border-transparent hover:border-primary-100 group"
              >
                <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-primary-200 shadow-sm">
                  <Users className="h-3.5 w-3.5 text-primary-600" />
                </div>
                Gérer les Utilisateurs
              </button>
              <button
                onClick={() => navigate('/admin/assessments')}
                className="flex items-center px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-success-50 hover:text-success-700 rounded-lg transition-all border border-transparent hover:border-success-100 group"
              >
                <div className="w-7 h-7 bg-success-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-success-200 shadow-sm">
                  <FileText className="h-3.5 w-3.5 text-success-600" />
                </div>
                Voir les Évaluations
              </button>
              <button
                onClick={() => navigate('/admin/emails/broadcast')}
                className="flex items-center px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-all border border-transparent hover:border-orange-100 group"
              >
                <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-orange-200 shadow-sm">
                  <Mail className="h-3.5 w-3.5 text-orange-600" />
                </div>
                Envoyer des Emails
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-accent-50 hover:text-accent-700 rounded-lg transition-all border border-transparent hover:border-accent-100 group"
              >
                <div className="w-7 h-7 bg-accent-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-accent-200 shadow-sm">
                  <Download className="h-3.5 w-3.5 text-accent-600" />
                </div>
                Exporter les Données
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-600" />
              Statistiques par Secteur
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stats?.sectorStats?.slice(0, 6).map((sector, index) => (
                <div key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50/50 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-600 capitalize truncate pr-2">{sector._id}</span>
                  <span className="text-[11px] font-black text-primary-600 bg-white px-2 py-0.5 rounded border border-primary-100 shadow-sm whitespace-nowrap">
                    {sector.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts / Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary-600" />
              Répartition par Taille d'Entreprise
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stats?.sizeStats?.map((size, index) => (
                <div key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50/50 rounded-lg border border-gray-100 transition-all hover:bg-gray-50">
                  <span className="text-[11px] font-bold text-gray-600 capitalize">
                    {size._id === 'micro' ? 'Micro' : 
                     size._id === 'sme' ? 'PME' : 'Grande PME'}
                  </span>
                  <span className="text-[11px] font-black text-secondary-600 bg-white px-2 py-0.5 rounded border border-secondary-100 shadow-sm">
                    {size.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl border border-gray-100 p-5">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-success-600" />
              Statut des Évaluations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stats?.scoreStats?.map((status, index) => (
                <div key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50/50 rounded-lg border border-gray-100 transition-all hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mr-2 shadow-sm ${
                      status._id === 'green' ? 'bg-success-500' :
                      status._id === 'amber' ? 'bg-warning-500' : 'bg-danger-500'
                    }`}></div>
                    <span className="text-[11px] font-bold text-gray-600 capitalize">
                      {status._id === 'green' ? 'Excellent' :
                       status._id === 'amber' ? 'Moyen' : 'Faible'}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
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
