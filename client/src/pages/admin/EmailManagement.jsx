import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Mail, 
  Send, 
  Users, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const EmailManagement = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Utilisation du hook API
  const { loading, sendReminderEmail, sendBulkEmails } = useAdminApi();

  useEffect(() => {
    // Récupérer les utilisateurs sélectionnés depuis la navigation
    if (location.state?.selectedUsers && location.state?.userEmails) {
      setSelectedUsers(location.state.selectedUsers);
      setUserEmails(location.state.userEmails);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error('Aucun utilisateur sélectionné');
      return;
    }

    try {
      const data = await sendBulkEmails({
        userIds: selectedUsers,
        subject: formData.subject,
        message: formData.message
      });

      toast.success(data.message);
      navigate('/admin/users');
    } catch (error) {
      console.error('Send email error:', error);
      // L'erreur est déjà gérée par le hook
    }
  };

  const handleSendSingleEmail = async (userId, email) => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await sendReminderEmail(userId, {
        subject: formData.subject,
        message: formData.message
      });

      toast.success('Email envoyé avec succès');
    } catch (error) {
      console.error('Send single email error:', error);
      // L'erreur est déjà gérée par le hook
    }
  };

  const predefinedTemplates = [
    {
      name: 'Relance évaluation incomplète',
      subject: 'Complétez votre évaluation UBB Enterprise Health Check',
      message: `Bonjour,

Nous avons remarqué que vous avez commencé votre évaluation UBB Enterprise Health Check mais ne l'avez pas encore terminée.

Cette évaluation vous permettra d'obtenir un rapport détaillé sur la santé de votre entreprise et des recommandations personnalisées pour l'améliorer.

Pour reprendre votre évaluation, cliquez sur le lien suivant : [LIEN]

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe UBB`
    },
    {
      name: 'Relance nouvelle évaluation',
      subject: 'Nouvelle évaluation UBB Enterprise Health Check disponible',
      message: `Bonjour,

Nous sommes ravis de vous informer qu'une nouvelle évaluation UBB Enterprise Health Check est maintenant disponible.

Cette mise à jour inclut de nouvelles questions et des recommandations améliorées basées sur les dernières tendances du marché.

Pour commencer votre nouvelle évaluation, cliquez sur le lien suivant : [LIEN]

Cordialement,
L'équipe UBB`
    },
    {
      name: 'Rappel de connexion',
      subject: 'Accédez à votre tableau de bord UBB',
      message: `Bonjour,

Nous vous rappelons que vous pouvez accéder à votre tableau de bord UBB à tout moment pour consulter vos évaluations précédentes et télécharger vos rapports.

Connectez-vous ici : [LIEN]

Cordialement,
L'équipe UBB`
    }
  ];

  const applyTemplate = (template) => {
    setFormData({
      subject: template.subject,
      message: template.message
    });
  };

  return (
    <AdminLayout>
      <div className="pb-10 ">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Emails</h1>
              <p className="text-gray-600">Envoyez des emails de relance aux utilisateurs</p>
            </div>
            {/* <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux utilisateurs
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Templates */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Modèles prédéfinis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predefinedTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => applyTemplate(template)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{template.subject}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Email Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <form onSubmit={handleSendEmail}>
            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Objet de l'email
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Objet de votre email..."
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre message..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Vous pouvez utiliser [LIEN] pour insérer un lien vers l'évaluation.
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/users')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || selectedUsers.length === 0}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer à {selectedUsers.length} utilisateur(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Utilisateurs sélectionnés ({selectedUsers.length})
            </h3>
            <div className="space-y-3">
              {userEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{email}</span>
                  </div>
                  <button
                    onClick={() => handleSendSingleEmail(selectedUsers[index], email)}
                    disabled={loading}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Envoyer individuellement
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Instructions</h4>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Utilisez [LIEN] dans votre message pour insérer automatiquement le lien vers l'évaluation</li>
                <li>• Les emails sont envoyés immédiatement après validation</li>
                <li>• Vous pouvez envoyer des emails individuels ou en masse</li>
                <li>• Assurez-vous que le contenu respecte les bonnes pratiques d'email marketing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default EmailManagement;
