const mongoose = require('mongoose');

const blogLikeSchema = new mongoose.Schema({
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
  // IP address comme backup pour les utilisateurs non connectés
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

// Index unique pour empêcher les likes multiples
// Un utilisateur connecté ne peut liker qu'une fois
blogLikeSchema.index({ blog: 1, userId: 1 }, { 
  unique: true, 
  sparse: true // Permet les valeurs null
});

// Index unique pour les visiteurs non connectés
// Un navigateur spécifique (visitorId) ne peut liker qu'une seule fois par article
blogLikeSchema.index({ blog: 1, visitorId: 1 }, { 
  unique: true, 
  sparse: true // Permet les valeurs null
});

// Index pour les recherches
blogLikeSchema.index({ blog: 1 });
blogLikeSchema.index({ userId: 1 });
blogLikeSchema.index({ visitorId: 1 });
blogLikeSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('BlogLike', blogLikeSchema);

