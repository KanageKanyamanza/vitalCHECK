import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import { 
  Send, 
  RefreshCw, 
  Clock, 
  User, 
  ShieldCheck, 
  Mail, 
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const ConversationHistory = ({ contactId, contactModel, contactEmail, contactName }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [showFullBody, setShowFullBody] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (contactId) {
      fetchMessages();
    }
  }, [contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pré-remplir la signature
  useEffect(() => {
    if (contactId && !replyBody) {
      const storedAdmin = localStorage.getItem('adminData');
      const signature = storedAdmin ? JSON.parse(storedAdmin).signature : "";
      if (signature) {
        setReplyBody(`\n\n${signature}`);
      }
    }
  }, [contactId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/messages/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_BASE_URL}/messages/sync`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Synchronisation terminée');
        fetchMessages();
      }
    } catch (error) {
      toast.error('Échec de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyBody.trim()) return;

    try {
      setSending(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_BASE_URL}/messages/reply`, {
        contactId,
        contactModel,
        body: replyBody,
        subject: messages.length === 0 ? subject : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Réponse envoyée');
        setReplyBody('');
        fetchMessages();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const toggleBody = (id) => {
    setShowFullBody(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="text-gray-500 text-sm">Chargement de la conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-60">
            <MessageSquare className="w-12 h-12" />
            <p className="text-sm font-medium">Aucun échange par email répertorié</p>
            <button 
              onClick={handleSync}
              className="mt-2 text-xs text-primary-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Synchroniser maintenant
            </button>
          </div>
        ) : (
          messages.map((msg) => {
            const isInbound = msg.direction === 'inbound';
            return (
              <div 
                key={msg._id} 
                className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'} mb-2`}
              >
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md ${
                  isInbound 
                    ? 'bg-white border border-gray-100 rounded-tl-none text-gray-800' 
                    : 'bg-gradient-to-br from-primary-600 to-green-700 text-white rounded-tr-none'
                }`}>
                  <div className="flex items-center gap-2 mb-2 opacity-70">
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {isInbound ? <><User className="inline w-3 h-3 mr-1" /> {contactName || 'Client'}</> : <><ShieldCheck className="inline w-3 h-3 mr-1" /> Support vitalCHECK</>}
                    </span>
                    <span className="text-[9px] font-bold flex items-center gap-1 ml-auto">
                      {new Date(msg.date).toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="text-sm leading-relaxed">
                    {msg.subject && (
                      <div className={`font-black mb-2 text-xs uppercase tracking-tight pb-1 border-b ${isInbound ? 'border-gray-100 text-primary-600' : 'border-white/10 text-white/90'}`}>
                        {msg.subject}
                      </div>
                    )}
                    
                    <div className={`${!showFullBody[msg._id] && msg.body.length > 500 ? "line-clamp-6" : ""} whitespace-pre-wrap font-medium`}>
                       {msg.body.replace(/<[^>]*>?/gm, '')}
                    </div>
                    
                    {msg.body.length > 500 && (
                      <button 
                        onClick={() => toggleBody(msg._id)}
                        className={`mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest hover:opacity-100 opacity-60 ${isInbound ? 'text-primary-600' : 'text-white'}`}
                      >
                        {showFullBody[msg._id] ? <><ChevronUp className="w-3 h-3" /> Réduire</> : <><ChevronDown className="w-3 h-3" /> Lire la suite</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply input */}
      <div className="p-4 bg-white border-t border-gray-100">
        {messages.length === 0 && (
          <div className="mb-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Sujet du premier email</label>
            <input 
              type="text"
              placeholder="Ex: Informations sur votre évaluation..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
            <button 
                onClick={handleSync}
                disabled={syncing}
                className={`p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-all ${syncing ? 'animate-spin text-primary-600' : ''}`}
                title="Synchroniser"
            >
                <RefreshCw className="w-4 h-4" />
            </button>
            <div className="text-[10px] text-gray-400 font-medium italic">
                {syncing ? 'Synchronisation IMAP en cours...' : 'Synchronisé avec imap.ionos.fr'}
            </div>
        </div>
        
        <div className="relative">
          <textarea
            placeholder={`Répondre à ${contactEmail}...`}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium pr-12 min-h-[80px] max-h-40"
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            disabled={sending}
          />
          <button
            onClick={handleSendReply}
            disabled={sending || !replyBody.trim()}
            className={`absolute right-2 bottom-2 p-2 rounded-lg bg-primary-600 text-white shadow-lg transition-all ${
              sending || !replyBody.trim() ? 'opacity-40' : 'hover:bg-primary-700 active:scale-95'
            }`}
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;
