const mongoose = require('mongoose');

const chatbotInteractionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  response: {
    type: String,
    trim: true,
    default: null
  },
  responseType: {
    type: String,
    enum: ['intent', 'faq', 'no_answer', 'custom'],
    default: 'no_answer'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  visitorName: {
    type: String,
    trim: true,
    default: null
  },
  visitorEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  lang: {
    type: String,
    default: 'fr',
    enum: ['fr', 'en']
  },
  feedback: {
    type: String,
    enum: ['useful', 'useless'],
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'ignored'],
    default: 'pending'
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  answeredAt: {
    type: Date,
    default: null
  },
  customAnswer: {
    answer: String,
    keywords: [String],
    category: {
      type: String,
      default: 'Autre'
    },
    createdAt: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  frequency: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // On gère manuellement les timestamps
});

// Index pour les requêtes fréquentes
chatbotInteractionSchema.index({ status: 1, createdAt: -1 });
chatbotInteractionSchema.index({ userId: 1 });
chatbotInteractionSchema.index({ question: 'text' });
chatbotInteractionSchema.index({ createdAt: -1 });
chatbotInteractionSchema.index({ responseType: 1 });

// Méthode pour incrémenter la fréquence d'une question similaire
chatbotInteractionSchema.statics.incrementFrequency = async function(question) {
  try {
    if (!question || typeof question !== 'string') {
      return null;
    }
    
    const normalizedQuestion = question.toLowerCase().trim();
    if (!normalizedQuestion) {
      return null;
    }
    
    const existing = await this.findOne({
      question: { $regex: new RegExp(normalizedQuestion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      status: 'pending'
    });
    
    if (existing) {
      existing.frequency += 1;
      existing.updatedAt = new Date();
      await existing.save();
      return existing;
    }
    return null;
  } catch (error) {
    console.error('[ChatbotInteraction] Erreur incrementFrequency:', error);
    return null;
  }
};

module.exports = mongoose.model('ChatbotInteraction', chatbotInteractionSchema);



