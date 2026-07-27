import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, 
  ChevronLeft, 
  Eye, 
  Edit3, 
  Users, 
  Mail as MailIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const EmailBroadcast = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSubscribers = [], contactModel = 'MailingContact' } = location.state || {};

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Si aucun contact n'est sélectionné, on retourne à la liste
    if (!selectedSubscribers.length) {
      toast.error("Aucun contact sélectionné");
      navigate('/admin/contacts');
      return;
    }

    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setAdminData(admin);
      if (admin.signature) {
        setBody(`\n\n${admin.signature}`);
      }
    }
  }, [selectedSubscribers, navigate]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Le sujet et le message sont obligatoires");
      return;
    }

    try {
      setIsSending(true);
      const token = localStorage.getItem("adminToken");
      
      const response = await axios.post(`${API_BASE_URL}/messages/bulk-send`, {
        recipientIds: selectedSubscribers,
        contactModel,
        subject,
        body
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`${selectedSubscribers.length} messages envoyés avec succès`);
        navigate('/admin/contacts');
      }
    } catch (error) {
      console.error("Bulk send error:", error);
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  // Rendu de l'aperçu formaté HTML
  const getPreviewHtml = () => {
    const formattedBody = body.replace(/\n/g, '<br>');
    return formattedBody;
  };

  return (
    <AdminLayout noScroll={true}>
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Studio d'Envoi Direct</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{selectedSubscribers.length} destinataires sélectionnés</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending}
            className={`flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Envoyer à {selectedSubscribers.length} contacts</span>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* LOBE DE GAUCHE : SAISIE */}
          <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-200 bg-white shadow-inner">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                  <Edit3 className="w-5 h-5" />
                  <span>Rédaction du message</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sujet de l'email</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Votre mise à jour vitalCHECK..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Votre Message & Signature</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Rédigez votre email ici..."
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all min-h-[450px] font-medium leading-relaxed"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800 leading-relaxed">
                  <strong>Mode Direct :</strong> Ces emails seront envoyés individuellement via votre serveur configuré. Le template vitalCHECK est automatiquement appliqué autour de votre texte.
                </div>
              </div>
            </div>
          </div>

          {/* LOBE DE DROITE : APERÇU RENDU */}
          <div className="w-1/2 p-8 bg-gray-100 overflow-y-auto">
            <div className="flex items-center gap-2 text-gray-500 font-bold mb-6 justify-center">
              <Eye className="w-5 h-5" />
              <span>Aperçu du rendu final</span>
            </div>

            {/* Email Template Wrapper Replica */}
            <div className="max-w-[600px] mx-auto bg-white shadow-2xl rounded-sm overflow-hidden text-gray-800 font-sans border border-gray-200">
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #F4C542 0%, #00751B 100%)', padding: '25px 15px', textAlign: 'center' }}>
                <img 
                  src="https://www.checkmyenterprise.com/ms-icon-310x310.png" 
                  alt="Logo" 
                  style={{ width: '60px', height: '60px', borderRadius: '8px', marginBottom: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} 
                />
                <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {subject || "Objet du message"}
                </h1>
              </div>
              
              {/* Content Area (Flat) */}
              <div className="p-10 min-h-[300px]">
                <div 
                  className="prose prose-green max-w-none text-gray-800 leading-relaxed text-base"
                  dangerouslySetInnerHTML={{ __html: getPreviewHtml() || '<span className="text-gray-300 italic">En attente de saisie...</span>' }}
                />
              </div>

              {/* Footer */}
              <div className="bg-[#1a202c] p-8 text-center text-xs text-gray-400">
                <div className="mb-4">
                  <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="Logo" style={{ width: '40px', height: '40px', margin: '0 auto 10px auto', display: 'block' }} />
                  <p className="font-bold text-gray-200 uppercase tracking-widest text-[10px]">Enterprise Health Check</p>
                </div>
                
                <p className="mb-4 italic text-gray-500">Évaluation Professionnelle d'Entreprise & Conseil en Croissance</p>
                
                <div className="border-t border-gray-800 pt-6 space-y-2">
                  <p className="text-gray-300">📧 info@checkmyenterprise.com | 📞 +221 788346969</p>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    UBUNTU BUSINESS BUILDERS (UBB) – SARL<br />
                    Dakar, Sénégal<br />
                    RCCM : SN.DKR.2026.B.1650 | NINEA : 012753069
                  </p>
                </div>
                
                <p className="mt-8 text-[9px] text-gray-600">
                  © {new Date().getFullYear()} vitalCHECK Enterprise Health Check. Tous droits réservés.
                </p>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-8">
              Ceci est une simulation fidèle du rendu que vos {selectedSubscribers.length} contacts recevront.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailBroadcast;
