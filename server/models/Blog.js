const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  excerpt: {
    type: String,
    required: [true, 'Le résumé est requis'],
    maxlength: [500, 'Le résumé ne peut pas dépasser 500 caractères']
  },
  
  content: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  
  type: {
    type: String,
    enum: ['article', 'etude-cas', 'tutoriel', 'actualite', 'temoignage'],
    default: 'article',
    required: true
  },
  
  category: {
    type: String,
    enum: ['strategie', 'technologie', 'finance', 'ressources-humaines', 'marketing', 'operations', 'gouvernance'],
    required: [true, 'La catégorie est requise']
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  
  images: [{
    url: String,
    alt: String,
    caption: String,
    position: {
      type: String,
      enum: ['top', 'middle', 'bottom', 'inline'],
      default: 'inline'
    }
  }],
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  publishedAt: {
    type: Date,
    default: null
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  
  // Métadonnées SEO
  metaTitle: {
    type: String,
    maxlength: [60, 'Le titre SEO ne peut pas dépasser 60 caractères']
  },
  
  metaDescription: {
    type: String,
    maxlength: [160, 'La description SEO ne peut pas dépasser 160 caractères']
  },
  
  // Statistiques
  views: {
    type: Number,
    default: 0
  },
  
  likes: {
    type: Number,
    default: 0
  },
  
  // Configuration spéciale pour les études de cas
  caseStudy: {
    company: String,
    sector: String,
    companySize: String,
    challenge: String,
    solution: String,
    results: String,
    metrics: [{
      label: String,
      value: String,
      description: String
    }]
  },
  
  // Configuration pour les tutoriels
  tutorial: {
    difficulty: {
      type: String,
      enum: ['debutant', 'intermediaire', 'avance'],
      default: 'debutant'
    },
    duration: String, // ex: "15 minutes"
    prerequisites: [String]
  },
  
  // Configuration pour les témoignages
  testimonial: {
    clientName: String,
    clientCompany: String,
    clientPosition: String,
    clientPhoto: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

// Index pour les recherches
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ type: 1, category: 1 });
blogSchema.index({ tags: 1 });

// Middleware pour générer le slug
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Middleware pour définir publishedAt
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Méthode pour incrémenter les vues
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Méthode pour incrémenter les likes
blogSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

module.exports = mongoose.model('Blog', blogSchema);
