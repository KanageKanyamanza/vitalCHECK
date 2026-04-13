import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Mail, 
  Send, 
  Users, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  Plus
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
  const { loading, sendReminderEmail, sendBulkEmails, getUserDraftAssessment } = useAdminApi();

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
    
    const hasRecipients = selectedUsers.length > 0 || userEmails.length > 0;
    if (!hasRecipients) {
      toast.error('Aucun destinataire sélectionné');
      return;
    }

    try {
      // Si le message contient [LIEN], récupérer les liens de reprise pour chaque utilisateur
      if (formData.message.includes('[LIEN]')) {
        const emailsWithLinks = [];
        
        for (const userId of selectedUsers) {
          try {
            const response = await getUserDraftAssessment(userId);
            let personalizedMessage = formData.message;
            
            if (response.success && response.hasDraft) {
              personalizedMessage = formData.message.replace('[LIEN]', response.assessment.resumeLink);
            } else {
              // Si pas d'évaluation en cours, utiliser le lien de connexion par défaut
              personalizedMessage = formData.message.replace('[LIEN]', `${window.location.origin}/`);
            }
            
            emailsWithLinks.push({
              userId,
              to: userEmails.find(u => u.id === userId)?.email || '',
              subject: formData.subject,
              message: personalizedMessage
            });
          } catch (error) {
            console.error(`Error getting draft assessment for user ${userId}:`, error);
            // En cas d'erreur, utiliser le message original
            emailsWithLinks.push({
              userId,
              to: userEmails.find(u => u.id === userId)?.email || '',
              subject: formData.subject,
              message: formData.message.replace('[LIEN]', `${window.location.origin}/`)
            });
          }
        }
        
        // Envoyer les emails avec les liens personnalisés
        const data = await sendBulkEmails({
          emails: emailsWithLinks
        });
        
        // Le toast est déjà géré par le hook
        navigate('/admin/users');
      } else {
        // Si pas de [LIEN], envoyer normalement
        const data = await sendBulkEmails({
          ...(selectedUsers.length > 0 && { userIds: selectedUsers }),
          ...(selectedUsers.length === 0 && { emails: userEmails.map(e => ({ to: e, subject: formData.subject, message: formData.message })) }),
          subject: formData.subject,
          message: formData.message
        });

        // Le toast est déjà géré par le hook
        navigate('/admin/contacts');
      }
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
      let messageToSend = formData.message;
      
      // Si le message contient [LIEN], récupérer le lien de reprise
      if (formData.message.includes('[LIEN]')) {
        if (userId) {
          try {
            const response = await getUserDraftAssessment(userId);
            
            if (response.success && response.hasDraft) {
              messageToSend = formData.message.replace('[LIEN]', response.assessment.resumeLink);
            } else {
              messageToSend = formData.message.replace('[LIEN]', `${window.location.origin}/`);
            }
          } catch (error) {
            console.error('Error getting draft assessment:', error);
            messageToSend = formData.message.replace('[LIEN]', `${window.location.origin}/`);
          }
        } else {
          messageToSend = formData.message.replace('[LIEN]', `${window.location.origin}/`);
        }
      }

      if (userId) {
        await sendReminderEmail(userId, {
          subject: formData.subject,
          message: messageToSend
        });
      } else {
        // Envoi direct par email si pas de userId
        await sendBulkEmails({
            emails: [{
                to: email,
                subject: formData.subject,
                message: messageToSend
            }]
        });
      }

      // Le toast est déjà géré par le hook
    } catch (error) {
      console.error('Send single email error:', error);
      // L'erreur est déjà gérée par le hook
    }
  };

  const predefinedTemplates = [
    {
      name: 'Relance évaluation incomplète',
      subject: 'Complétez votre évaluation vitalCHECK Enterprise Health Check',
      message: `Nous avons remarqué que vous avez commencé votre évaluation vitalCHECK Enterprise Health Check mais ne l'avez pas encore terminée.

Cette évaluation vous permettra d'obtenir un rapport détaillé sur la santé de votre entreprise et des recommandations personnalisées pour l'améliorer.

Pour reprendre votre évaluation, cliquez sur le lien suivant : ${window.location.origin}/

Si vous avez des questions, n'hésitez pas à nous contacter.`
    },
    {
      name: 'Relance nouvelle évaluation',
      subject: 'Nouvelle évaluation vitalCHECK Enterprise Health Check disponible',
      message: `Nous sommes ravis de vous informer qu'une nouvelle évaluation vitalCHECK Enterprise Health Check est maintenant disponible.

Cette mise à jour inclut de nouvelles questions et des recommandations améliorées basées sur les dernières tendances du marché.

Pour commencer votre nouvelle évaluation, cliquez sur le lien suivant : ${window.location.origin}/`
    },
    {
      name: 'Rappel de connexion',
      subject: 'Accédez à votre tableau de bord vitalCHECK',
      message: `Nous vous rappelons que vous pouvez accéder à votre tableau de bord vitalCHECK à tout moment pour consulter vos évaluations précédentes et télécharger vos rapports.

Connectez-vous ici : ${window.location.origin}/`
    }
  ];

  const applyTemplate = async (template) => {
    try {
      // Si c'est un template de relance d'évaluation incomplète, récupérer le lien de reprise personnalisé
      if (template.name === 'Relance évaluation incomplète' && selectedUsers.length === 1) {
        const userId = selectedUsers[0];
        const response = await getUserDraftAssessment(userId);
        
        if (response.success && response.hasDraft) {
          const resumeLink = response.assessment.resumeLink;
          // Remplacer le lien générique par le lien de reprise spécifique
          const messageWithLink = template.message.replace(`${window.location.origin}/`, resumeLink);
          
          setFormData({
            subject: template.subject,
            message: messageWithLink
          });
          return;
        }
      }
      
      // Pour les autres cas, utiliser le template tel quel
      setFormData({
        subject: template.subject,
        message: template.message
      });
    } catch (error) {
      console.error('Error getting draft assessment:', error);
      // En cas d'erreur, utiliser le template tel quel
      setFormData({
        subject: template.subject,
        message: template.message
      });
    }
  };

  return (
    <AdminLayout>
      <div className="pb-10 ">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion des Emails</h1>
              <p className="text-sm text-gray-600">Envoyez des emails de relance aux utilisateurs</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/contacts')}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Mes Contacts
              </button>
              <button
                onClick={() => navigate('/admin/emails/import')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Templates */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h3 className="text-md font-medium text-gray-900 mb-3">Modèles prédéfinis</h3>
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
            <div className="space-y-4">
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
                  disabled={loading || (selectedUsers.length === 0 && userEmails.length === 0)}
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
                      Envoyer à {selectedUsers.length || userEmails.length} destinataire(s)
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Selected Users */}
        {(selectedUsers.length > 0 || userEmails.length > 0) && (
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Destinataires sélectionnés ({selectedUsers.length || userEmails.length})
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
