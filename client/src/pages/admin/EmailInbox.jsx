import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import ConversationHistory from '../../components/admin/ConversationHistory';
import { 
  Inbox, 
  Search, 
  MessageSquare, 
  Mail, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Send,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmailInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  useEffect(() => {
    if (location.state?.openContactId) {
        setActiveConversation({
            _id: location.state.openContactId,
            name: location.state.contactName,
            email: location.state.contactEmail,
            model: location.state.contactModel || 'Contact'
        });
        window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchRecentMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/messages/inbox/recent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.messages);
        // Sélectionner la première conversation par défaut si aucune n'est active
        if (response.data.messages.length > 0 && !activeConversation) {
          const first = response.data.messages[0];
          setActiveConversation({
            _id: first.contactId?._id || first.contactId,
            email: first.direction === 'inbound' ? first.from : first.to,
            name: first.from,
            model: first.contactModel
          });
        }
      }
    } catch (error) {
      console.error('Error fetching recent messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_BASE_URL}/messages/sync`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Synchronisation terminée');
      fetchRecentMessages();
    } catch (error) {
      toast.error('Échec de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout noScroll={true}>
      <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
        {/* Sidebar: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Inbox className="w-6 h-6 text-primary-600" />
              Messagerie
            </h1>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className={`p-2 rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all ${syncing ? 'bg-primary-50 text-primary-600 shadow-inner' : 'bg-white shadow-sm'}`}
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="p-4 bg-gray-50/50">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher un échange..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200">
            {loading ? (
              <div className="p-10 flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Chargement</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-10 text-center opacity-40">
                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-bold uppercase tracking-wider">Aucun message</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredMessages.map((msg) => {
                  const isActive = activeConversation?._id === (msg.contactId?._id || msg.contactId);
                  return (
                    <div 
                      key={msg._id}
                      onClick={() => setActiveConversation({
                          _id: msg.contactId?._id || msg.contactId,
                          email: msg.direction === 'inbound' ? msg.from : msg.to,
                          name: msg.from,
                          model: msg.contactModel
                      })}
                      className={`p-4 transition-all cursor-pointer flex items-start gap-3 border-l-4 group ${
                        isActive 
                        ? 'bg-primary-50/40 border-l-primary-500' 
                        : 'hover:bg-gray-50 border-l-transparent'
                      }`}
                    >
                      <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-active:scale-90 ${
                        msg.direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                      }`}>
                        {msg.direction === 'inbound' ? <Inbox className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className={`text-sm truncate w-full pr-2 ${!msg.isRead && msg.direction === 'inbound' ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                            {msg.direction === 'inbound' ? msg.from : `À: ${msg.to}`}
                          </h4>
                        </div>
                        <p className={`text-xs truncate ${!msg.isRead && msg.direction === 'inbound' ? 'font-bold text-primary-600' : 'text-gray-500 font-medium'}`}>
                          {msg.subject || '(Sans sujet)'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                           <span className="text-[9px] font-black tracking-tighter text-gray-400 uppercase flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(msg.date).toLocaleDateString('fr-FR')}
                           </span>
                           {!msg.isRead && msg.direction === 'inbound' && (
                             <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-sm shadow-primary-200"></div>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 bg-white flex flex-col min-w-0 relative">
          {activeConversation ? (
            <>
              {/* Converation Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-primary-50">
                      {activeConversation.name?.charAt(0).toUpperCase() || activeConversation.email?.charAt(0).toUpperCase()}
                   </div>
                   <div className="min-w-0">
                      <h2 className="text-lg font-black text-gray-900 truncate">
                        {activeConversation.name || (activeConversation.email?.split('@')[0])}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-bold tracking-tight truncate">{activeConversation.email}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black p-1 bg-gray-100 text-gray-500 rounded px-1.5 uppercase">{activeConversation.model}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Chat Container */}
              <div className="flex-1 bg-gray-50/30 overflow-hidden">
                 <ConversationHistory 
                    contactId={activeConversation._id}
                    contactModel={activeConversation.model} 
                    contactEmail={activeConversation.email}
                    contactName={activeConversation.name}
                    fullHeader={false}
                 />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-gray-50/20">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-gray-50 flex items-center justify-center mb-6 animate-bounce duration-[3000ms]">
                <MessageSquare className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Sélectionnez une discussion</h3>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                Choisissez un client dans la liste de gauche pour consulter l'historique complet de vos échanges.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailInbox;
