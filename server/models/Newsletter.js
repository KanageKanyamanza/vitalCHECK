const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  previewText: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'],
    default: 'draft'
  },
  scheduledAt: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  recipients: {
    type: {
      type: String,
      enum: ['all', 'active', 'tags', 'custom'],
      default: 'all'
    },
    tags: [{
      type: String
    }],
    customEmails: [{
      type: String,
      lowercase: true,
      trim: true
    }]
  },
  opens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsletterSubscriber'
  }],
  stats: {
    totalRecipients: {
      type: Number,
      default: 0
    },
    sent: {
      type: Number,
      default: 0
    },
    delivered: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Number,
      default: 0
    },
    bounced: {
      type: Number,
      default: 0
    },
    unsubscribed: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les recherches
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });
newsletterSchema.index({ sentAt: -1 });
newsletterSchema.index({ createdBy: 1 });

// Mettre à jour updatedAt avant de sauvegarder
newsletterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
