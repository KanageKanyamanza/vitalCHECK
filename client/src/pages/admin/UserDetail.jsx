import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Mail, 
  Trash2, 
  Calendar,
  Building2,
  Users,
  FileText,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Utilisation du hook API
  const { loading, getUser } = useAdminApi();

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const data = await getUser(userId);
      setUser(data.user);
    } catch (error) {
      console.error('Fetch user error:', error);
      navigate('/admin/users');
    }
  };

  const handleSendEmail = () => {
    navigate('/admin/emails', {
      state: {
        selectedUsers: [user._id],
        userEmails: [user.email]
      }
    });
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action supprimera également toutes ses évaluations.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Utilisateur supprimé avec succès');
        navigate('/admin/users');
      } else {
        toast.error(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete user error:', error);
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

  const getCompanySizeText = (size) => {
    switch (size) {
      case 'micro': return 'Micro-entreprise';
      case 'sme': return 'PME';
      case 'large-sme': return 'Grande PME';
      default: return size;
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

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilisateur non trouvé</h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Retour aux utilisateurs
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
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/users')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="md:w-auto w-full mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">{user.companyName}</h1>
                <p className="text-gray-600">{user.email}</p>
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
                onClick={handleDeleteUser}
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
        {/* User Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'entreprise</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nom de l'entreprise</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.companyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Secteur</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user.sector}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Taille de l'entreprise</dt>
                  <dd className="mt-1 text-sm text-gray-900">{getCompanySizeText(user.companySize)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date d'inscription</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Statut Premium</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isPremium ? 'Premium' : 'Freemium'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Évaluations complétées</p>
                  <p className="text-2xl font-bold text-gray-900">{user.assessments?.length || 0}</p>
                </div>
              </div>
              {user.assessments?.length > 0 && (
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Score moyen</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        user.assessments.reduce((sum, assessment) => sum + assessment.overallScore, 0) / 
                        user.assessments.length
                      )}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assessments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Évaluations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {user.assessments?.length > 0 ? (
              user.assessments.map((assessment, index) => (
                <div key={assessment._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BarChart3 className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Évaluation #{index + 1}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Complétée le {new Date(assessment.completedAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Score: {assessment.overallScore}%
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.overallStatus)}`}>
                          {getStatusText(assessment.overallStatus)}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/assessments/${assessment._id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                  
                  {/* Pillar Scores */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Scores par pilier :</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assessment.pillarScores?.map((pillar, pillarIndex) => (
                        <div key={pillarIndex} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-900">{pillar.pillarName}</span>
                            <span className="text-sm text-gray-600">{pillar.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                pillar.status === 'green' ? 'bg-green-500' :
                                pillar.status === 'amber' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${pillar.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune évaluation</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cet utilisateur n'a pas encore complété d'évaluation.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleSendEmail}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email de relance
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetail;
