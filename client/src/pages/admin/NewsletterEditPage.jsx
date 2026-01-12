import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Send, Users, Mail, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import SimpleTextEditor from '../../components/admin/SimpleTextEditor';
import toast from 'react-hot-toast';
import axios from 'axios';
import { parseMarkdown } from '../../utils/markdownParser';

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
  const [showPreview, setShowPreview] = useState(true); // Aperçu visible par défaut

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

  // Fonction pour convertir les classes Tailwind en styles inline pour l'email
  const convertToEmailHTML = (html) => {
    // Remplacer les classes Tailwind par des styles inline pour l'email
    let emailHTML = html
      // Adapter les images pour qu'elles s'ajustent à la largeur
      .replace(/<img([^>]*)>/gi, (match, attrs) => {
        // Ajouter max-width: 100% et height: auto si pas déjà présent
        if (!attrs.includes('style=')) {
          return `<img${attrs} style="max-width: 100%; height: auto;">`;
        }
        // Si style existe, ajouter max-width et height
        return match.replace(/style="([^"]*)"/i, (styleMatch, styleContent) => {
          if (!styleContent.includes('max-width')) {
            return `style="${styleContent}; max-width: 100%; height: auto;"`;
          }
          return styleMatch;
        });
      })
      // Adapter les tableaux pour qu'ils s'ajustent à la largeur
      .replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (!attrs.includes('style=')) {
          return `<table${attrs} style="width: 100%; max-width: 100%; table-layout: auto;">`;
        }
        return match.replace(/style="([^"]*)"/i, (styleMatch, styleContent) => {
          if (!styleContent.includes('width')) {
            return `style="${styleContent}; width: 100%; max-width: 100%; table-layout: auto;"`;
          }
          return styleMatch;
        });
      })
      .replace(/class="[^"]*text-2xl[^"]*"/g, 'style="font-size: 1.5em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #1a202c;"')
      .replace(/class="[^"]*text-3xl[^"]*"/g, 'style="font-size: 1.875em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #1a202c;"')
      .replace(/class="[^"]*text-4xl[^"]*"/g, 'style="font-size: 2.25em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #1a202c;"')
      .replace(/class="[^"]*font-bold[^"]*"/g, 'style="font-weight: 700;"')
      .replace(/class="[^"]*italic[^"]*"/g, 'style="font-style: italic;"')
      .replace(/class="[^"]*text-gray-900[^"]*"/g, 'style="color: #1a202c;"')
      .replace(/class="[^"]*text-gray-700[^"]*"/g, 'style="color: #4a5568;"')
      .replace(/class="[^"]*text-gray-600[^"]*"/g, 'style="color: #4a5568;"')
      .replace(/class="[^"]*text-primary-600[^"]*"/g, 'style="color: #00751B; text-decoration: underline;"')
      .replace(/class="[^"]*mb-4[^"]*"/g, 'style="margin-bottom: 1em;"')
      .replace(/class="[^"]*leading-relaxed[^"]*"/g, 'style="line-height: 1.7;"')
      .replace(/class="[^"]*list-disc[^"]*"/g, 'style="list-style-type: disc; padding-left: 1.5em; margin: 0.75em 0;"')
      .replace(/class="[^"]*list-decimal[^"]*"/g, 'style="list-style-type: decimal; padding-left: 1.5em; margin: 0.75em 0;"')
      .replace(/class="[^"]*border-l-4[^"]*border-primary-500[^"]*"/g, 'style="border-left: 4px solid #00751B; padding-left: 1em; margin: 1em 0; font-style: italic; color: #4a5568;"')
      .replace(/class="[^"]*bg-gray-100[^"]*"/g, 'style="background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 4px;"')
      .replace(/class="[^"]*font-mono[^"]*"/g, 'style="font-family: monospace;"')
      .replace(/class="[^"]*text-sm[^"]*"/g, 'style="font-size: 0.875em;"')
      .replace(/class="[^"]*px-2[^"]*py-1[^"]*"/g, 'style="padding: 0.2em 0.4em;"')
      .replace(/class="[^"]*rounded[^"]*"/g, 'style="border-radius: 4px;"')
      .replace(/class="[^"]*my-4[^"]*"/g, 'style="margin: 1em 0;"')
      .replace(/class="[^"]*my-8[^"]*"/g, 'style="margin: 2em 0;"')
      .replace(/class="[^"]*border-gray-300[^"]*"/g, 'style="border-color: #d1d5db;"')
      .replace(/class="[^"]*space-y-2[^"]*"/g, '')
      .replace(/class="[^"]*ml-6[^"]*mb-2[^"]*"/g, 'style="margin-left: 1.5em; margin-bottom: 0.5em;"')
      .replace(/class="[^"]*hover:[^"]*"/g, '')
      .replace(/class="[^"]*"/g, '')
    
    return emailHTML
  }

  // Générer l'aperçu en temps réel
  const generatePreview = useMemo(() => {
    // Convertir le Markdown en HTML
    const htmlContent = parseMarkdown(formData.content);
    
    // Convertir pour l'email (styles inline)
    const emailContent = convertToEmailHTML(htmlContent);
    
    // Générer le HTML de la newsletter avec le template (similaire au serveur)
    const newsletterHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.subject || 'Newsletter'} - vitalCHECK</title>
</head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00751B 0%, #F4C542 100%); padding: 20px 15px; text-align: center;">
              <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="vitalCHECK Logo" style="width: 50px; height: 50px; max-width: 100%; border-radius: 8px; object-fit: contain; margin-bottom: 10px; background: rgba(255,255,255,0.1); padding: 6px; border-radius: 12px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: clamp(20px, 4vw, 28px); font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: -0.5px;">
                ${formData.subject || 'Newsletter vitalCHECK'}
              </h1>
              ${formData.previewText ? `<p style="color: rgba(255, 255, 255, 0.95); margin: 8px 0 0 0; font-size: clamp(14px, 2.5vw, 16px); font-weight: 400; line-height: 1.4;">${formData.previewText}</p>` : ''}
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 20px 15px;">
              <div style="color: #333333; font-size: clamp(14px, 2vw, 16px); line-height: 1.7; word-wrap: break-word;">
                ${emailContent}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1f2937; padding: 20px 15px; text-align: center;">
              <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="vitalCHECK Logo" style="width: 40px; height: 40px; max-width: 100%; border-radius: 8px; object-fit: contain; margin: 0 auto 10px auto; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 10px; display: block;" />
              <h3 style="color: #ffffff; margin: 0 0 6px 0; font-size: clamp(16px, 3vw, 18px); font-weight: 700;">Enterprise Health Check</h3>
              <p style="color: #9ca3af; margin: 0; font-size: clamp(12px, 2vw, 13px); line-height: 1.5;">Évaluation Professionnelle d'Entreprise & Conseil en Croissance</p>
              <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #374151;">
                <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: clamp(12px, 2vw, 13px); line-height: 1.6; word-wrap: break-word;">📧 info@checkmyenterprise.com | 📞 +221 771970713 / +221 774536704</p>
                <p style="color: #6b7280; margin: 0; font-size: clamp(11px, 1.8vw, 12px);"><a href="https://www.checkmyenterprise.com" style="color: #60a5fa; text-decoration: none;">www.checkmyenterprise.com</a></p>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
                <p style="color: #6b7280; margin: 0; font-size: clamp(10px, 1.6vw, 11px); line-height: 1.5; word-wrap: break-word;">Vous recevez cet email car vous êtes abonné à la newsletter vitalCHECK.</p>
                <p style="color: #4b5563; margin: 10px 0 0 0; font-size: clamp(9px, 1.4vw, 10px);">&copy; ${new Date().getFullYear()} vitalCHECK Enterprise Health Check. Tous droits réservés.</p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
    
    return newsletterHTML;
  }, [formData.subject, formData.previewText, formData.content]);

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
      setPreviewHTML(generatePreview);
      setPreviewMode(true);
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
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={showPreview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title={showPreview ? "L'aperçu est déjà visible" : "Afficher l'aperçu"}
            >
              <Eye className="w-5 h-5" />
              Aperçu
            </button>
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

        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {/* Formulaire principal */}
          <div className={`space-y-6 ${showPreview ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
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

          {/* Aperçu en temps réel */}
          {showPreview && (
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-3 flex-shrink-0">
                  <h3 className="text-base font-semibold text-gray-900">Aperçu en temps réel</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Fermer l'aperçu"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <div className="p-2">
                      <div 
                        className="bg-white w-full"
                        style={{ 
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          overflow: 'hidden'
                        }}
                        dangerouslySetInnerHTML={{ __html: generatePreview }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panneau latéral - Destinataires (s'affiche à la place de l'aperçu quand il est fermé) */}
          {!showPreview && (
            <div className="space-y-6 lg:col-span-1">
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsletterEditPage;
