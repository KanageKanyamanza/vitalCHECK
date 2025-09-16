import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Trash2, 
  Calendar,
  Building2,
  Mail,
  FileText,
  TrendingUp,
  BarChart3,
  Download
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const AssessmentDetail = () => {
  console.log('AssessmentDetail component rendering'); // Debug
  const [assessment, setAssessment] = useState(null);
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  
  console.log('AssessmentDetail - assessmentId from params:', assessmentId); // Debug
  
  // Utilisation du hook API
  console.log('About to call useAdminApi'); // Debug
  const { loading, getAssessment } = useAdminApi();
  console.log('useAdminApi called successfully'); // Debug

  useEffect(() => {
    console.log('AssessmentDetail mounted, assessmentId:', assessmentId); // Debug
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    console.log('fetchAssessment called with assessmentId:', assessmentId); // Debug
    try {
      console.log('Calling getAssessment...'); // Debug
      const data = await getAssessment(assessmentId);
      console.log('Assessment data received:', data); // Debug
      setAssessment(data.assessment);
    } catch (error) {
      console.error('Fetch assessment error:', error);
      navigate('/admin/assessments');
    }
  };

  const handleDeleteAssessment = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/assessments/${assessmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Évaluation supprimée avec succès');
        navigate('/admin/assessments');
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete assessment error:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSendEmail = () => {
    navigate('/admin/emails', {
      state: {
        selectedUsers: [assessment.user._id],
        userEmails: [assessment.user.email]
      }
    });
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!assessment) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Évaluation non trouvée</h2>
            <button
              onClick={() => navigate('/admin/assessments')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Retour aux évaluations
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-10">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-6">
            <div className="flex flex-col sm:flex-row sm:items-center md:w-auto w-full mb-4 md:mb-0">
              <button
                onClick={() => navigate('/admin/assessments')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Détails de l'évaluation</h1>
                <p className="text-gray-600">{assessment.user?.companyName} - {assessment.user?.email}</p>
              </div>
            </div>
            <div className="flex justify-between md:w-auto md:justify-end md:space-x-4 w-full">
              <button
                onClick={handleSendEmail}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Envoyer un email
              </button>
              <button
                onClick={handleDeleteAssessment}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assessment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Utilisateur</dt>
                  <dd className="mt-1 text-sm text-gray-900">{assessment.user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                  <dd className="mt-1 text-sm text-gray-900">{assessment.user?.companyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Secteur</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{assessment.user?.sector}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Taille</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{assessment.user?.companySize}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date de completion</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(assessment.completedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Langue</dt>
                  <dd className="mt-1 text-sm text-gray-900 uppercase">{assessment.language}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Score global</h3>
            <div className="text-center">
              {assessment.overallScore !== undefined ? (
                <>
                  <div className={`text-4xl font-bold ${getScoreColor(assessment.overallScore)}`}>
                    {assessment.overallScore}%
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(assessment.overallStatus)}`}>
                      {getStatusText(assessment.overallStatus)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          assessment.overallStatus === 'green' ? 'bg-green-500' :
                          assessment.overallStatus === 'amber' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${assessment.overallScore}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">Données de score non disponibles</div>
              )}
            </div>
          </div>
        </div>

        {/* Pillar Scores */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Scores par pilier</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessment.pillarScores && assessment.pillarScores.length > 0 ? (
                assessment.pillarScores.map((pillar, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-900">{pillar.pillarName}</h4>
                    <span className={`text-sm font-semibold ${getScoreColor(pillar.score)}`}>
                      {pillar.score}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${
                        pillar.status === 'green' ? 'bg-green-500' :
                        pillar.status === 'amber' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pillar.score}%` }}
                    ></div>
                  </div>
                  
                  <div className="mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pillar.status)}`}>
                      {getStatusText(pillar.status)}
                    </span>
                  </div>
                  
                  {pillar.recommendations && pillar.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Recommandations :</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {pillar.recommendations.slice(0, 3).map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  Aucun score de pilier disponible
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answers Detail */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Réponses détaillées</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {assessment.answers?.map((answer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-2">
                        Question {index + 1} (ID: {answer.questionId})
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Réponse :</span>
                        <div className="flex space-x-2">
                          {[0, 1, 2, 3].map((value) => (
                            <div
                              key={value}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                answer.answer === value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {answer.answer === 0 ? 'Pas du tout' :
                         answer.answer === 1 ? 'Un peu' :
                         answer.answer === 2 ? 'Modérément' : 'Beaucoup'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default AssessmentDetail;
