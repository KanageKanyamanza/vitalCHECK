const mongoose = require('mongoose');

const chatbotResponseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    default: 'Autre',
    enum: ['Autre', 'Évaluation', 'Prix', 'Support', 'Compte', 'Rapport', 'Technique', 'Général']
  },
  lang: {
    type: String,
    default: 'fr',
    enum: ['fr', 'en']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0 // Plus élevé = priorité plus haute
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
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
  timestamps: false
});

// Index pour les recherches
chatbotResponseSchema.index({ question: 'text', answer: 'text' });
chatbotResponseSchema.index({ category: 1, lang: 1, isActive: 1 });
chatbotResponseSchema.index({ keywords: 1 });
chatbotResponseSchema.index({ priority: -1, usageCount: -1 });
chatbotResponseSchema.index({ createdAt: -1 });

// Méthode pour incrémenter l'utilisation
chatbotResponseSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('ChatbotResponse', chatbotResponseSchema);

