import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Send, Users, Mail } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import SimpleTextEditor from '../../components/admin/SimpleTextEditor';
import toast from 'react-hot-toast';
import axios from 'axios';

// Configuration de l'URL de l'API
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "https://ubb-enterprise-health-check.onrender.com/api";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

const NewsletterEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    subject: '',
    previewText: '',
    content: '',
    recipients: {
      type: 'all',
      tags: [],
      customEmails: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');
  const [recipientCount, setRecipientCount] = useState(0);
  const [customEmailInput, setCustomEmailInput] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchNewsletter();
    }
  }, [isEdit, id]);

  useEffect(() => {
    // Mettre à jour le comptage quand le type de destinataire change
    // Ne pas appeler si on est en train de charger une newsletter
    if (loading) return;

    if (formData.recipients?.type === 'custom') {
      setRecipientCount(formData.recipients.customEmails?.length || 0);
    } else if (formData.recipients?.type) {
      fetchRecipientCount();
    }
  }, [formData.recipients?.type, formData.recipients?.tags, loading]);

  const fetchNewsletter = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/newsletters/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const newsletter = response.data.newsletter;
        setFormData({
          subject: newsletter.subject || '',
          previewText: newsletter.previewText || '',
          content: newsletter.content || '',
          recipients: newsletter.recipients || {
            type: 'all',
            tags: [],
            customEmails: []
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la newsletter:', error);
      toast.error('Erreur lors du chargement de la newsletter');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientCount = async () => {
    try {
      // Ne pas appeler l'API si le type est custom (comptage côté client)
      if (formData.recipients.type === 'custom') {
        setRecipientCount(formData.recipients.customEmails?.length || 0);
        return;
      }

      const token = localStorage.getItem('adminToken');
      const params = {
        type: formData.recipients.type
      };

      if (formData.recipients.type === 'tags' && formData.recipients.tags?.length > 0) {
        params.tags = formData.recipients.tags.join(',');
      }

      const response = await axios.get(`${API_BASE_URL}/newsletters/admin/subscribers/count`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      if (response.data.success) {
        setRecipientCount(response.data.count || 0);
      }
    } catch (error) {
      console.error('Erreur lors du comptage des destinataires:', error);
      setRecipientCount(0);
    }
  };

  const handleSave = async () => {
    if (!formData.subject.trim()) {
      toast.error('Le sujet est requis');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Le contenu est requis');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/newsletters/admin/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Newsletter mise à jour avec succès');
      } else {
        const response = await axios.post(`${API_BASE_URL}/newsletters/admin/create`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.newsletter?._id) {
          toast.success('Newsletter créée avec succès');
          // Utiliser replace pour éviter d'ajouter une entrée dans l'historique
          // Attendre un peu pour que le toast s'affiche et que l'état se stabilise
          setTimeout(() => {
            navigate(`/admin/newsletters/edit/${response.data.newsletter._id}`, { replace: true });
          }, 300);
        } else {
          console.error('Réponse API invalide:', response.data);
          toast.error('Erreur: Newsletter créée mais ID non reçu');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const newsletterId = id || 'new';
      const response = await axios.post(
        `${API_BASE_URL}/newsletters/admin/${newsletterId}/preview`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setPreviewHTML(response.data.preview);
        setPreviewMode(true);
      }
    } catch (error) {
      console.error('Erreur lors de la prévisualisation:', error);
      // Si c'est une nouvelle newsletter, générer un aperçu local
      if (!id && formData.content) {
        const previewHTML = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #1a202c; font-size: 24px; margin-bottom: 10px;">${formData.subject || 'Sujet de la newsletter'}</h1>
            ${formData.previewText ? `<p style="color: #718096; font-size: 14px; margin-bottom: 20px;">${formData.previewText}</p>` : ''}
            <div style="color: #4a5568; line-height: 1.6;">
              ${formData.content}
            </div>
          </div>
        `;
        setPreviewHTML(previewHTML);
        setPreviewMode(true);
      } else {
        toast.error('Erreur lors de la prévisualisation');
      }
    }
  };

  const handleSend = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir envoyer cette newsletter à ${recipientCount} destinataires ?`)) {
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      let newsletterId = id;

      // Sauvegarder d'abord si c'est un nouveau brouillon
      if (!isEdit) {
        const saveResponse = await axios.post(`${API_BASE_URL}/newsletters/admin/create`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        newsletterId = saveResponse.data.newsletter._id;
      }

      const response = await axios.post(`${API_BASE_URL}/newsletters/admin/${newsletterId}/send`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Newsletter envoyée à ${response.data.stats.sent} destinataires`);
        navigate('/admin/newsletters');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setSaving(false);
    }
  };

  const addCustomEmail = () => {
    const email = customEmailInput.trim();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email invalide');
      return;
    }

    const currentEmails = formData.recipients.customEmails || [];
    if (currentEmails.includes(email)) {
      toast.error('Cet email est déjà dans la liste');
      return;
    }

    const newCustomEmails = [...currentEmails, email];
    setFormData({
      ...formData,
      recipients: {
        ...formData.recipients,
        customEmails: newCustomEmails
      }
    });

    setCustomEmailInput('');
    // Mettre à jour le comptage immédiatement pour le type custom
    if (formData.recipients.type === 'custom') {
      setRecipientCount(newCustomEmails.length);
    }
    toast.success('Email ajouté');
  };

  const removeCustomEmail = (email) => {
    const currentEmails = formData.recipients.customEmails || [];
    const newCustomEmails = currentEmails.filter(e => e !== email);
    setFormData({
      ...formData,
      recipients: {
        ...formData.recipients,
        customEmails: newCustomEmails
      }
    });
    // Mettre à jour le comptage immédiatement pour le type custom
    if (formData.recipients.type === 'custom') {
      setRecipientCount(newCustomEmails.length);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (previewMode) {
    return (
      <AdminLayout>
        <div className="p-4 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Aperçu de la Newsletter</h1>
            <button
              onClick={() => setPreviewMode(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
            >
              Retour à l'édition
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/newsletters')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Modifier la Newsletter' : 'Nouvelle Newsletter'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Modifiez votre newsletter' : 'Créez une nouvelle newsletter'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEdit && (
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Eye className="w-5 h-5" />
                Aperçu
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {isEdit && (
              <button
                onClick={handleSend}
                disabled={saving || recipientCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="w-5 h-5" />
                Envoyer
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sujet */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet de l'email *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Nouvelles fonctionnalités de vitalCHECK"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Texte d'aperçu */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte d'aperçu (optionnel)
              </label>
              <input
                type="text"
                value={formData.previewText}
                onChange={(e) => setFormData({ ...formData, previewText: e.target.value })}
                placeholder="Court texte qui apparaît dans l'aperçu de l'email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ce texte apparaît dans l'aperçu de l'email avant l'ouverture
              </p>
            </div>

            {/* Contenu */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu de la newsletter *
              </label>
              <SimpleTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Rédigez le contenu de votre newsletter..."
              />
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Destinataires */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Destinataires</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de destinataires
                  </label>
                  <select
                    value={formData.recipients.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipients: { ...formData.recipients, type: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Tous les abonnés actifs</option>
                    <option value="active">Abonnés actifs uniquement</option>
                    <option value="tags">Par tags (à venir)</option>
                    <option value="custom">Emails personnalisés</option>
                  </select>
                </div>

                {formData.recipients.type === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ajouter un email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={customEmailInput}
                        onChange={(e) => setCustomEmailInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomEmail()}
                        placeholder="email@exemple.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        onClick={addCustomEmail}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                      >
                        Ajouter
                      </button>
                    </div>

                    {formData.recipients.customEmails.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.recipients.customEmails.map((email) => (
                          <div
                            key={email}
                            className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">{email}</span>
                            <button
                              onClick={() => removeCustomEmail(email)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <span className="text-gray-700">
                      <strong>{recipientCount}</strong> destinataire{recipientCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aide */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Conseils</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Rédigez un sujet accrocheur</li>
                <li>• Utilisez le texte d'aperçu pour inciter à l'ouverture</li>
                <li>• Testez avec l'aperçu avant l'envoi</li>
                <li>• Vérifiez le nombre de destinataires</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsletterEditPage;
