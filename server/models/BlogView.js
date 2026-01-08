const mongoose = require('mongoose');

const blogViewSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  // Si l'utilisateur est connecté, on utilise userId
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Si l'utilisateur n'est pas connecté, on utilise un identifiant unique (UUID stocké dans localStorage)
  visitorId: {
    type: String,
    default: null
  },
  // IP address pour analytics uniquement (pas pour la vérification)
  ipAddress: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index unique pour empêcher les vues multiples
// Un utilisateur connecté ne peut compter qu'une vue par blog
blogViewSchema.index({ blog: 1, userId: 1 }, { 
  unique: true, 
  sparse: true // Permet les valeurs null
});

// Index unique pour les visiteurs non connectés
// Un navigateur spécifique (visitorId) ne peut compter qu'une seule vue par article
blogViewSchema.index({ blog: 1, visitorId: 1 }, { 
  unique: true, 
  sparse: true // Permet les valeurs null
});

// Index pour les recherches
blogViewSchema.index({ blog: 1 });
blogViewSchema.index({ userId: 1 });
blogViewSchema.index({ visitorId: 1 });
blogViewSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('BlogView', blogViewSchema);

