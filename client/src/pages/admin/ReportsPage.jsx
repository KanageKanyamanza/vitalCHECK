import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  FileText,
  Users,
  Building2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    averageScore: 0,
    totalCompanies: 0
  });
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  
  // Utilisation du hook API
  const { getStats, exportUsers } = useAdminApi();

  // Charger les statistiques au montage du composant
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Fetching stats...'); // Debug
      const data = await getStats();
      console.log('Stats data received:', data); // Debug
      
      // Extraire les données de l'objet stats
      const statsData = data.stats || {};
      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalAssessments: statsData.totalAssessments || 0,
        averageScore: statsData.scoreStats && statsData.scoreStats.length > 0 
          ? Math.round(statsData.scoreStats.reduce((sum, stat) => sum + stat.avgScore, 0) / statsData.scoreStats.length)
          : 0,
        totalCompanies: statsData.totalUsers || 0 // Pour l'instant, on utilise le nombre d'utilisateurs
      });
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleGenerateReport = async (type) => {
    try {
      setLoading(true);
      
      switch (type) {
        case 'users':
          await exportUsers();
          toast.success('Rapport utilisateurs généré avec succès');
          break;
        case 'assessments':
          // TODO: Implémenter l'export des évaluations
          toast.info('Fonctionnalité en cours de développement');
          break;
        case 'statistics':
          // TODO: Implémenter l'export des statistiques
          toast.info('Fonctionnalité en cours de développement');
          break;
        default:
          toast.error('Type de rapport non reconnu');
      }
    } catch (error) {
      console.error('Generate report error:', error);
      // L'erreur est déjà gérée par le hook
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    {
      id: 'users',
      name: 'Rapport Utilisateurs',
      description: 'Export complet des utilisateurs et leurs informations',
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      hoverColor: 'hover:bg-primary-100'
    },
    {
      id: 'assessments',
      name: 'Rapport Évaluations',
      description: 'Export des évaluations et scores détaillés',
      icon: FileText,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      hoverColor: 'hover:bg-accent-100'
    },
    {
      id: 'statistics',
      name: 'Rapport Statistiques',
      description: 'Statistiques globales et analyses',
      icon: BarChart3,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      hoverColor: 'hover:bg-success-100'
    }
  ];

  return (
    <AdminLayout>
      <div className="pb-10 ">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Générez et téléchargez des rapports détaillés
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Du"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Au"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {report.description}
                </p>
                
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={loading}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${report.hoverColor} ${report.bgColor} ${report.color} border border-current disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Génération...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      Générer le rapport
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques Rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Utilisateurs</div>
              </div>
              <div className="text-center p-4 bg-accent-50 rounded-lg">
                <FileText className="h-8 w-8 text-accent-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent-600">{stats.totalAssessments}</div>
                <div className="text-sm text-gray-600">Évaluations</div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-success-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-success-600">{stats.averageScore}%</div>
                <div className="text-sm text-gray-600">Score Moyen</div>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-lg">
                <Building2 className="h-8 w-8 text-warning-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-warning-600">{stats.totalCompanies}</div>
                <div className="text-sm text-gray-600">Entreprises</div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Information sur les rapports
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Les rapports sont générés au format CSV</li>
                    <li>Vous pouvez filtrer par période en utilisant les dates</li>
                    <li>Les données sont exportées en temps réel</li>
                    <li>Les rapports incluent toutes les informations disponibles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
