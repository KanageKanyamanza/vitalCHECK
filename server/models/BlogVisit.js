const mongoose = require('mongoose');

const blogVisitSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  
  // Informations de l'utilisateur
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null pour les visiteurs anonymes
  },
  
  // Informations de session
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // Informations géographiques
  ipAddress: {
    type: String,
    required: true
  },
  
  country: {
    type: String,
    default: null
  },
  
  region: {
    type: String,
    default: null
  },
  
  city: {
    type: String,
    default: null
  },
  
  // Informations de l'appareil
  userAgent: {
    type: String,
    required: true
  },
  
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      required: true
    },
    brand: String,
    model: String,
    os: String,
    osVersion: String,
    browser: String,
    browserVersion: String
  },
  
  // Informations de la visite
  referrer: {
    type: String,
    default: null
  },
  
  referrerDomain: {
    type: String,
    default: null
  },
  
  utmSource: {
    type: String,
    default: null
  },
  
  utmMedium: {
    type: String,
    default: null
  },
  
  utmCampaign: {
    type: String,
    default: null
  },
  
  // Métriques de comportement
  timeOnPage: {
    type: Number, // en secondes
    default: 0
  },
  
  scrollDepth: {
    type: Number, // pourcentage de scroll (0-100)
    default: 0
  },
  
  isBounce: {
    type: Boolean,
    default: true
  },
  
  // Informations de la page
  pageTitle: {
    type: String,
    required: true
  },
  
  pageUrl: {
    type: String,
    required: true
  },
  
  // Statut de la visite
  status: {
    type: String,
    enum: ['active', 'completed', 'bounced'],
    default: 'active'
  },
  
  // Timestamps
  visitedAt: {
    type: Date,
    default: Date.now
  },
  
  leftAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
blogVisitSchema.index({ blog: 1, visitedAt: -1 });
blogVisitSchema.index({ sessionId: 1 });
blogVisitSchema.index({ ipAddress: 1 });
blogVisitSchema.index({ country: 1, region: 1 });
blogVisitSchema.index({ 'device.type': 1 });
blogVisitSchema.index({ visitedAt: -1 });

// Méthode pour calculer la durée de la visite
blogVisitSchema.methods.calculateDuration = function() {
  if (this.leftAt) {
    this.timeOnPage = Math.floor((this.leftAt - this.visitedAt) / 1000);
  }
  return this.timeOnPage;
};

// Méthode pour marquer la visite comme terminée
blogVisitSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  this.leftAt = new Date();
  this.calculateDuration();
  return this.save();
};

// Méthode pour marquer comme rebond
blogVisitSchema.methods.markAsBounced = function() {
  this.status = 'bounced';
  this.isBounce = true;
  this.leftAt = new Date();
  this.calculateDuration();
  return this.save();
};

module.exports = mongoose.model('BlogVisit', blogVisitSchema);
