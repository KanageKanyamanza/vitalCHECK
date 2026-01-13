const mongoose = require('mongoose');

const blogVisitorSchema = new mongoose.Schema({
  // Informations personnelles
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  
  lastName: {
    type: String,
    required: [true, 'Le nom de famille est requis'],
    trim: true,
    maxlength: [50, 'Le nom de famille ne peut pas dépasser 50 caractères']
  },
  
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  
  country: {
    type: String,
    required: [true, 'Le pays est requis'],
    trim: true,
    maxlength: [100, 'Le nom du pays ne peut pas dépasser 100 caractères']
  },
  
  // Informations de localisation
  ipAddress: {
    type: String,
    required: true
  },
  
  city: {
    type: String,
    default: null,
    trim: true
  },
  
  region: {
    type: String,
    default: null,
    trim: true
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
    browser: String,
    os: String
  },
  
  // Historique des blogs consultés
  blogsVisited: [{
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true
    },
    blogTitle: {
      type: String,
      required: true
    },
    blogSlug: {
      type: String,
      required: true
    },
    visitedAt: {
      type: Date,
      default: Date.now
    },
    scrollDepth: {
      type: Number,
      default: 0
    },
    timeOnPage: {
      type: Number,
      default: 0
    },
    isFormSubmitted: {
      type: Boolean,
      default: true
    }
  }],
  
  // Statistiques globales
  totalBlogsVisited: {
    type: Number,
    default: 1
  },
  
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  
  averageScrollDepth: {
    type: Number,
    default: 0
  },
  
  // Statut et préférences
  isReturningVisitor: {
    type: Boolean,
    default: false
  },
  
  lastVisitAt: {
    type: Date,
    default: Date.now
  },
  
  // Identifiant unique du navigateur (visitorId)
  // Chaque navigateur a son propre visitorId, donc chaque navigateur crée un nouveau BlogVisitor
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Informations de session
  sessionId: {
    type: String,
    required: true
  },
  
  // Métadonnées
  source: {
    type: String,
    enum: ['blog_form', 'manual_entry'],
    default: 'blog_form'
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
blogVisitorSchema.index({ visitorId: 1 }); // Index unique pour identifier les visiteurs par navigateur
blogVisitorSchema.index({ ipAddress: 1 });
blogVisitorSchema.index({ email: 1 });
blogVisitorSchema.index({ sessionId: 1 });
blogVisitorSchema.index({ 'blogsVisited.blog': 1 });
blogVisitorSchema.index({ lastVisitAt: -1 });
blogVisitorSchema.index({ country: 1 });

// Méthode pour ajouter une nouvelle visite de blog
blogVisitorSchema.methods.addBlogVisit = function(blogId, blogTitle, blogSlug, scrollDepth = 0, timeOnPage = 0) {
  // Vérifier si ce blog a déjà été visité
  const existingVisit = this.blogsVisited.find(visit => visit.blog.toString() === blogId.toString());
  
  if (existingVisit) {
    // Mettre à jour la visite existante
    existingVisit.visitedAt = new Date();
    existingVisit.scrollDepth = Math.max(existingVisit.scrollDepth, scrollDepth);
    existingVisit.timeOnPage = Math.max(existingVisit.timeOnPage, timeOnPage);
  } else {
    // Ajouter une nouvelle visite
    this.blogsVisited.push({
      blog: blogId,
      blogTitle,
      blogSlug,
      visitedAt: new Date(),
      scrollDepth,
      timeOnPage,
      isFormSubmitted: true
    });
    this.totalBlogsVisited += 1;
  }
  
  // Mettre à jour les statistiques
  this.lastVisitAt = new Date();
  this.totalTimeSpent += timeOnPage;
  this.averageScrollDepth = this.blogsVisited.reduce((sum, visit) => sum + visit.scrollDepth, 0) / this.blogsVisited.length;
  
  return this.save();
};

// Méthode pour marquer comme visiteur de retour
blogVisitorSchema.methods.markAsReturningVisitor = function() {
  this.isReturningVisitor = true;
  return this.save();
};

// Méthode pour obtenir les statistiques du visiteur
blogVisitorSchema.methods.getStats = function() {
  return {
    totalBlogsVisited: this.totalBlogsVisited,
    totalTimeSpent: this.totalTimeSpent,
    averageScrollDepth: this.averageScrollDepth,
    isReturningVisitor: this.isReturningVisitor,
    firstVisit: this.createdAt,
    lastVisit: this.lastVisitAt,
    blogsVisited: this.blogsVisited.map(visit => ({
      blogTitle: visit.blogTitle,
      blogSlug: visit.blogSlug,
      visitedAt: visit.visitedAt,
      scrollDepth: visit.scrollDepth,
      timeOnPage: visit.timeOnPage
    }))
  };
};

// Méthode statique pour trouver un visiteur par visitorId (navigateur spécifique)
blogVisitorSchema.statics.findByVisitorId = function(visitorId) {
  return this.findOne({ visitorId }).populate('blogsVisited.blog', 'title slug');
};

// Méthode statique pour trouver un visiteur par IP (conservée pour compatibilité)
blogVisitorSchema.statics.findByIP = function(ipAddress) {
  return this.findOne({ ipAddress }).populate('blogsVisited.blog', 'title slug');
};

// Méthode statique pour obtenir les statistiques globales
blogVisitorSchema.statics.getGlobalStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalVisitors: { $sum: 1 },
        returningVisitors: { $sum: { $cond: ['$isReturningVisitor', 1, 0] } },
        totalBlogVisits: { $sum: '$totalBlogsVisited' },
        averageTimeSpent: { $avg: '$totalTimeSpent' },
        averageScrollDepth: { $avg: '$averageScrollDepth' }
      }
    }
  ]);
  
  const countryStats = await this.aggregate([
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
        returningCount: { $sum: { $cond: ['$isReturningVisitor', 1, 0] } }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  const deviceStats = await this.aggregate([
    {
      $group: {
        _id: '$device.type',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  return {
    totalVisitors: stats[0]?.totalVisitors || 0,
    returningVisitors: stats[0]?.returningVisitors || 0,
    totalBlogVisits: stats[0]?.totalBlogVisits || 0,
    averageTimeSpent: stats[0]?.averageTimeSpent || 0,
    averageScrollDepth: stats[0]?.averageScrollDepth || 0,
    topCountries: countryStats,
    deviceBreakdown: deviceStats
  };
};

// Validation personnalisée
blogVisitorSchema.pre('save', function(next) {
  // S'assurer que les statistiques sont cohérentes
  if (this.blogsVisited.length > 0) {
    this.totalBlogsVisited = this.blogsVisited.length;
    this.averageScrollDepth = this.blogsVisited.reduce((sum, visit) => sum + visit.scrollDepth, 0) / this.blogsVisited.length;
  }
  
  next();
});

module.exports = mongoose.model('BlogVisitor', blogVisitorSchema);
