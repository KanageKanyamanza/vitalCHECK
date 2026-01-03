import React, { useState, useEffect } from 'react';
import { adminApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle, X, Filter } from 'lucide-react';
import AnswerQuestionModal from './AnswerQuestionModal';

const UnansweredQuestions = ({ onUpdate }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getUnansweredQuestions({ status: statusFilter });
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (question) => {
    setSelectedQuestion(question);
    setShowAnswerModal(true);
  };

  const handleIgnore = async (questionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir ignorer cette question ?')) {
      return;
    }

    try {
      await adminApiService.ignoreQuestion(questionId);
      toast.success('Question ignorée');
      fetchQuestions();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error ignoring question:', error);
      toast.error('Erreur lors de l\'ignorance de la question');
    }
  };

  const handleAnswerSaved = () => {
    setShowAnswerModal(false);
    setSelectedQuestion(null);
    fetchQuestions();
    if (onUpdate) onUpdate();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filter - Simplified */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="pending">En attente</option>
            <option value="answered">Répondues</option>
            <option value="ignored">Ignorées</option>
          </select>
        </div>

        {/* Questions List - Simplified */}
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune question {statusFilter === 'pending' ? 'en attente' : statusFilter}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          question.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : question.status === 'answered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {question.status === 'pending'
                          ? 'En attente'
                          : question.status === 'answered'
                          ? 'Répondu'
                          : 'Ignoré'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.frequency}x
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium text-sm mb-2 break-words">{question.question}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>
                        {question.userId
                          ? `${question.userId.firstName || ''} ${question.userId.lastName || ''}`.trim() || question.userId.email
                          : question.visitorName || 'Visiteur'}
                      </span>
                      <span>•</span>
                      <span>
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
                  {question.status === 'pending' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAnswer(question)}
                        className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
                      >
                        Répondre
                      </button>
                      <button
                        onClick={() => handleIgnore(question._id)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                      >
                        Ignorer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAnswerModal && selectedQuestion && (
        <AnswerQuestionModal
          question={selectedQuestion}
          onClose={() => {
            setShowAnswerModal(false);
            setSelectedQuestion(null);
          }}
          onSave={handleAnswerSaved}
        />
      )}
    </>
  );
};

export default UnansweredQuestions;



