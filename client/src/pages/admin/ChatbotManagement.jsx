import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApiService } from '../../services/api';
import { toast } from 'react-hot-toast';
import AllInteractions from '../../components/admin/chatbot/AllInteractions';
import ChatbotOverview from '../../components/admin/chatbot/ChatbotOverview';
import { 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  BookOpen,
  Tag,
  Mail,
  Calendar
} from 'lucide-react';

const ChatbotManagement = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    answered: 0,
    responseStats: null
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, searchTerm, categoryFilter, langFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'questions') {
        // Stats
        const statsRes = await adminApiService.getChatbotStats(30);
        if (statsRes.data.stats) {
          setStats(prev => ({
            ...prev,
            total: statsRes.data.stats.totalInteractions || 0,
            pending: statsRes.data.stats.pendingQuestions || 0,
            answered: statsRes.data.stats.totalInteractions - (statsRes.data.stats.pendingQuestions || 0)
          }));
        }

        // Questions en attente
        const questionsRes = await adminApiService.getUnansweredQuestions({ status: 'pending' });
        setQuestions(questionsRes.data.questions || []);
      } else if (activeTab === 'responses') {
        // Réponses personnalisées
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter !== 'all') params.category = categoryFilter;
        if (langFilter !== 'all') params.lang = langFilter;
        
        const responsesRes = await adminApiService.getChatbotResponses(params);
        setResponses(responsesRes.data.responses || []);

        // Stats des réponses
        const statsRes = await adminApiService.getChatbotResponsesStats();
        setStats(prev => ({ ...prev, responseStats: statsRes.data.stats }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (question) => {
    setSelectedQuestion(question);
    setShowAnswerModal(true);
  };

  const handleSaveAnswer = async (formData) => {
    try {
      await adminApiService.answerQuestion(selectedQuestion._id, formData);
      toast.success('Réponse enregistrée');
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      fetchData();
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleIgnore = async (questionId) => {
    if (!window.confirm('Ignorer cette question ?')) return;

    try {
      await adminApiService.ignoreQuestion(questionId);
      toast.success('Question ignorée');
      fetchData();
    } catch (error) {
      console.error('Error ignoring question:', error);
      toast.error('Erreur');
    }
  };

  const handleCreateResponse = () => {
    setSelectedResponse(null);
    setShowResponseModal(true);
  };

  const handleEditResponse = (response) => {
    setSelectedResponse(response);
    setShowResponseModal(true);
  };

  const handleSaveResponse = async (formData) => {
    try {
      if (selectedResponse) {
        await adminApiService.updateChatbotResponse(selectedResponse._id, formData);
        toast.success('Réponse mise à jour');
      } else {
        await adminApiService.createChatbotResponse(formData);
        toast.success('Réponse créée');
      }
      setShowResponseModal(false);
      setSelectedResponse(null);
      fetchData();
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteResponse = async (id) => {
    if (!window.confirm('Supprimer cette réponse ?')) return;

    try {
      await adminApiService.deleteChatbotResponse(id);
      toast.success('Réponse supprimée');
      fetchData();
    } catch (error) {
      console.error('Error deleting response:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const tabs = [
    { id: 'questions', label: 'Questions sans réponse', icon: AlertCircle, badge: stats.pending },
    { id: 'responses', label: 'Réponses personnalisées', icon: BookOpen },
    { id: 'interactions', label: 'Toutes les interactions', icon: MessageCircle },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 }
  ];

  if (loading && questions.length === 0 && responses.length === 0) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary-600" />
                Gestion du Chatbot
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Gérez les questions et réponses du chatbot
              </p>
            </div>
            {activeTab === 'responses' && (
              <button
                onClick={handleCreateResponse}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouvelle réponse</span>
                <span className="sm:hidden">Nouveau</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 lg:p-6">
            <p className="text-xs text-gray-600 mb-1">Total interactions</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 lg:p-6">
            <p className="text-xs text-gray-600 mb-1">En attente</p>
            <p className="text-2xl lg:text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 lg:p-6">
            <p className="text-xs text-gray-600 mb-1">Répondues</p>
            <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.answered}</p>
          </div>
          {stats.responseStats && (
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 lg:p-6">
              <p className="text-xs text-gray-600 mb-1">Réponses actives</p>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.responseStats.active}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1 overflow-x-auto px-4 lg:px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-3 lg:px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap
                      ${isActive
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 lg:p-6">
            {activeTab === 'questions' && (
              <QuestionsTab 
                questions={questions}
                onAnswer={handleAnswer}
                onIgnore={handleIgnore}
              />
            )}
            
            {activeTab === 'responses' && (
              <ResponsesTab
                responses={responses}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                langFilter={langFilter}
                setLangFilter={setLangFilter}
                onEdit={handleEditResponse}
                onDelete={handleDeleteResponse}
                onCreate={handleCreateResponse}
                stats={stats.responseStats}
              />
            )}
            
            {activeTab === 'interactions' && (
              <InteractionsTab />
            )}
            
            {activeTab === 'stats' && (
              <StatsTab stats={stats} />
            )}
          </div>
        </div>
      </div>

      {/* Modal Répondre */}
      {showAnswerModal && selectedQuestion && (
        <AnswerModal
          question={selectedQuestion}
          onClose={() => {
            setShowAnswerModal(false);
            setSelectedQuestion(null);
          }}
          onSave={handleSaveAnswer}
        />
      )}

      {/* Modal Réponse personnalisée */}
      {showResponseModal && (
        <ResponseModal
          response={selectedResponse}
          onClose={() => {
            setShowResponseModal(false);
            setSelectedResponse(null);
          }}
          onSave={handleSaveResponse}
        />
      )}
    </AdminLayout>
  );
};

// Composant Questions sans réponse
const QuestionsTab = ({ questions, onAnswer, onIgnore }) => (
  <div>
    {questions.length === 0 ? (
      <div className="p-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-gray-500">Aucune question en attente</p>
      </div>
    ) : (
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question._id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-2 break-words">{question.question}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Posée {question.frequency}x
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {question.userId
                      ? `${question.userId.firstName || ''} ${question.userId.lastName || ''}`.trim() || question.userId.email
                      : question.visitorName || 'Visiteur'}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(question.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  onClick={() => onAnswer(question)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Répondre
                </button>
                <button
                  onClick={() => onIgnore(question._id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <span className="hidden sm:inline">Ignorer</span>
                  <X className="w-4 h-4 sm:hidden" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Composant Réponses personnalisées
const ResponsesTab = ({ 
  responses, 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter,
  langFilter,
  setLangFilter,
  onEdit,
  onDelete,
  onCreate,
  stats
}) => {
  const categories = ['Autre', 'Évaluation', 'Prix', 'Support', 'Compte', 'Rapport', 'Technique', 'Général'];

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">Toutes les langues</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Actives</p>
            <p className="text-xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Utilisations</p>
            <p className="text-xl font-bold text-blue-600">{stats.totalUsage}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-600 mb-1">Catégories</p>
            <p className="text-xl font-bold text-purple-600">{stats.byCategory?.length || 0}</p>
          </div>
        </div>
      )}

      {/* Liste des réponses */}
      {responses.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Aucune réponse personnalisée</p>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer une réponse
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <div key={response._id} className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {response.category}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                      {response.lang.toUpperCase()}
                    </span>
                    {!response.isActive && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                    {response.usageCount > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Utilisée {response.usageCount}x
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2 break-words">{response.question}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">{response.answer}</p>
                  {response.keywords && response.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {response.keywords.slice(0, 5).map((keyword, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          <Tag className="w-3 h-3 mr-1" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 sm:flex-shrink-0">
                  <button
                    onClick={() => onEdit(response)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(response._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant Toutes les interactions
const InteractionsTab = () => {
  return <AllInteractions />;
};

// Composant Statistiques
const StatsTab = ({ stats }) => {
  return <ChatbotOverview dateRange={30} onStatsUpdate={() => {}} />;
};

// Modal pour répondre
const AnswerModal = ({ question, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    answer: '',
    keywords: '',
    category: 'Autre'
  });

  const categories = ['Autre', 'Évaluation', 'Prix', 'Support', 'Compte', 'Rapport', 'Technique', 'Général'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.answer.trim()) {
      toast.error('La réponse est requise');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Répondre à la question</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Question</p>
            <p className="text-sm font-medium text-gray-900 break-words">{question.question}</p>
            <p className="text-xs text-gray-500 mt-2">Posée {question.frequency}x</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Réponse <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Tapez votre réponse..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mots-clés</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="mot1, mot2, mot3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal pour créer/modifier une réponse personnalisée
const ResponseModal = ({ response, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    question: response?.question || '',
    answer: response?.answer || '',
    keywords: response?.keywords?.join(', ') || '',
    category: response?.category || 'Autre',
    lang: response?.lang || 'fr',
    priority: response?.priority || 0,
    isActive: response?.isActive !== undefined ? response.isActive : true
  });

  const categories = ['Autre', 'Évaluation', 'Prix', 'Support', 'Compte', 'Rapport', 'Technique', 'Général'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question et réponse sont requises');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {response ? 'Modifier la réponse' : 'Nouvelle réponse personnalisée'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Ex: Comment créer un compte ?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.lang}
                onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                required
              >
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Réponse <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Tapez la réponse complète..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mots-clés</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="compte, créer, inscription"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Séparés par des virgules</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Plus élevé = priorité plus haute</p>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Réponse active</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {response ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotManagement;
