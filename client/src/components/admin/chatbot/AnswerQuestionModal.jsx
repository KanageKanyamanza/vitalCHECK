import React, { useState } from 'react';
import { adminApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const AnswerQuestionModal = ({ question, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    answer: '',
    keywords: '',
    category: 'Autre'
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Autre', 'Évaluation', 'Prix', 'Support', 'Compte', 'Rapport'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.answer.trim()) {
      toast.error('La réponse est requise');
      return;
    }

    try {
      setLoading(true);
      await adminApiService.answerQuestion(question._id, {
        answer: formData.answer,
        keywords: formData.keywords,
        category: formData.category
      });
      toast.success('Réponse enregistrée avec succès');
      onSave();
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Erreur lors de l\'enregistrement de la réponse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Répondre à la question</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Question Display - Simplified */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Question</p>
            <p className="text-sm font-medium text-gray-900">{question.question}</p>
            <p className="text-xs text-gray-500 mt-1">Posée {question.frequency}x</p>
          </div>

          {/* Answer */}
          <div>
            <label htmlFor="answer-textarea" className="block text-xs font-medium text-gray-700 mb-1.5">
              Réponse <span className="text-red-500">*</span>
            </label>
            <textarea
              id="answer-textarea"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Tapez votre réponse ici..."
              rows={5}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              required
            />
          </div>

          {/* Keywords and Category in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="keywords-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                Mots-clés
              </label>
              <input
                id="keywords-input"
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="mot1, mot2, mot3"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="category-select" className="block text-xs font-medium text-gray-700 mb-1.5">
                Catégorie
              </label>
              <select
                id="category-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Les mots-clés aideront le bot à trouver cette réponse
          </p>

          {/* Actions - Simplified */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnswerQuestionModal;



