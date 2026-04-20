import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Calendar,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const AssessmentManagement = () => {
  const [assessments, setAssessments] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    getAssessments, 
    deleteAssessment 
  } = useAdminApi();

  useEffect(() => {
    fetchAssessments();
  }, [pagination.current, filters]);

  const fetchAssessments = async () => {
    try {
      const params = {
        page: pagination.current,
        limit: 10,
        ...filters
      };

      const data = await getAssessments(params);
      setAssessments(data.assessments);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Fetch assessments error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleViewAssessment = (assessmentId) => {
    navigate(`/admin/assessments/${assessmentId}`);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      return;
    }

    try {
      const data = await deleteAssessment(assessmentId);

      if (data.success) {
        toast.success('Évaluation supprimée avec succès');
        fetchAssessments();
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete assessment error:', error);
      toast.error('Erreur lors de la suppression');
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
                    Démarches & Évaluations
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">
                    Suivi des diagnostics et rapports générés
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-accent-50 text-accent-700 rounded-lg border border-accent-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black">{pagination.total} Évaluations</span>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">
                Statut / Score
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="pl-9 w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
                >
                  <option value="">Tous les résultats</option>
                  <option value="green">Excellent</option>
                  <option value="amber">Moyen</option>
                  <option value="red">Faible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">
                Période (Du)
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest leading-none">
                Période (Au)
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', dateFrom: '', dateTo: '' })}
                className="w-full px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                Reset Filtrage
              </button>
            </div>
          </div>
        </div>

        {/* Assessments Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Utilisateur / Lead
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Entreprise / Secteur
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Score
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Statut
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Rapport
                  </th>
                  <th className="px-4 py-2 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50 font-bold">
                {assessments.map((assessment) => (
                  <tr key={assessment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-xs font-black text-gray-900 leading-tight">{assessment.user?.email || '—'}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-tight">{assessment.user?.firstName || 'Utilisateur anonyme'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="text-xs text-gray-900 leading-none">{assessment.user?.companyName || '—'}</div>
                      <div className="text-[9px] text-primary-600 uppercase mt-0.5">{assessment.user?.sector || 'Non spécifié'}</div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center text-xs font-black text-gray-900">
                        <TrendingUp className="h-3 w-3 text-gray-400 mr-1.5" />
                        <div>{assessment.overallScore}%</div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-black rounded-full leading-none ${getStatusColor(assessment.overallStatus)}`}>
                        {getStatusText(assessment.overallStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center text-[10px] text-gray-500">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1.5" />
                        <div>
                          {new Date(assessment.completedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${assessment.reportGenerated ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={`text-[10px] uppercase tracking-tighter ${assessment.reportGenerated ? 'text-green-700 font-black' : 'text-gray-400 font-bold'}`}>
                          {assessment.reportGenerated ? 'Généré' : 'En attente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-0.5">
                        <button
                          onClick={() => handleViewAssessment(assessment._id)}
                          className="p-1 px-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded transition-all border border-transparent hover:border-gray-100"
                          title="Détails"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(assessment._id)}
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
                    {pagination.total} EVALUATIONS
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

export default AssessmentManagement;
