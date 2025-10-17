import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  User, 
  Building2, 
  Mail, 
  Calendar,
  ExternalLink,
  Copy,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';
import { useNavigate } from 'react-router-dom';

const DraftAssessmentsPage = () => {
  const navigate = useNavigate();
  const { sendReminderEmail } = useAdminApi();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingEmail, setSendingEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAssessments, setSelectedAssessments] = useState([]);

  const { getDraftAssessments } = useAdminApi();

  useEffect(() => {
    fetchDraftAssessments();
  }, [currentPage, searchTerm]);

  const fetchDraftAssessments = async () => {
    try {
      setLoading(true);
      const response = await getDraftAssessments({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });

      if (response.success) {
        setAssessments(response.assessments);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      console.error('Error fetching draft assessments:', error);
      toast.error('Erreur lors du chargement des évaluations en cours');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchDraftAssessments();
  };

  const copyResumeLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Lien de reprise copié dans le presse-papiers');
  };

  const handleSendReminderEmail = async (assessment) => {
    try {
      setSendingEmail(assessment.id);
      
      const subject = 'Relance - Évaluation VitalCHECK Enterprise Health Check';
      const message = `Nous avons remarqué que votre évaluation VitalCHECK Enterprise Health Check n'est pas encore terminée.

Vous pouvez reprendre votre évaluation à tout moment en cliquant sur le lien suivant :
${assessment.resumeLink}

Cette évaluation vous permettra d'obtenir un rapport personnalisé sur la santé de votre entreprise.`;

      await sendReminderEmail(assessment.user.id, {
        subject,
        message
      });

      // Le toast est déjà géré par le hook
    } catch (error) {
      console.error('Erreur envoi email:', error);
      // L'erreur est déjà gérée par le hook
    } finally {
      setSendingEmail(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (percentage) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDaysSinceLastActivity = (lastAnsweredAt) => {
    const now = new Date();
    const lastActivity = new Date(lastAnsweredAt);
    const diffTime = Math.abs(now - lastActivity);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (days) => {
    if (days >= 7) return { level: 'high', color: 'text-red-600', bg: 'bg-red-50' };
    if (days >= 3) return { level: 'medium', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  return (
    <AdminLayout>
      <div className="pb-10">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Évaluations en Cours</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Utilisateurs qui n'ont pas terminé leur évaluation
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par entreprise ou email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {totalItems} évaluation{totalItems > 1 ? 's' : ''} en cours
                </div>
              </div>
            </div>
          </div>

          {/* Assessments List */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Chargement...</span>
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune évaluation en cours
                </h3>
                <p className="text-gray-500">
                  Tous les utilisateurs ont terminé leur évaluation.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progrès
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière activité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Urgence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assessments.map((assessment) => {
                      const daysSince = getDaysSinceLastActivity(assessment.lastAnsweredAt);
                      const urgency = getUrgencyLevel(daysSince);
                      
                      return (
                        <tr key={assessment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {assessment.user.companyName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {assessment.user.email}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {assessment.user.sector} • {assessment.user.companySize}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 mr-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {assessment.answersCount}/{assessment.totalQuestions} questions
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {assessment.progressPercentage}%
                                  </span>
                                </div>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${getProgressColor(assessment.progressPercentage)}`}
                                    style={{ width: `${assessment.progressPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(assessment.lastAnsweredAt)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Commencé le {formatDate(assessment.startedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgency.bg} ${urgency.color}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {daysSince} jour{daysSince > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => copyResumeLink(assessment.resumeLink)}
                                className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-gray-100"
                                title="Copier le lien de reprise"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <a
                                href={assessment.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-gray-100"
                                title="Ouvrir le lien de reprise"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() => handleSendReminderEmail(assessment)}
                                disabled={sendingEmail === assessment.id}
                                className="text-orange-600 hover:text-orange-900 p-1 rounded-full hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Envoyer un email de relance"
                              >
                                {sendingEmail === assessment.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                                ) : (
                                  <Mail className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * 10, totalItems)}
                      </span>{' '}
                      sur <span className="font-medium">{totalItems}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
      </div>
    </AdminLayout>
  );
};

export default DraftAssessmentsPage;
