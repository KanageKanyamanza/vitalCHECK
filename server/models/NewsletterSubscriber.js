const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  unsubscribeToken: {
    type: String,
    select: false
  },
  source: {
    type: String,
    enum: ['footer', 'landing', 'manual', 'import'],
    default: 'footer'
  },
  tags: [{
    type: String
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

// Index pour les recherches
newsletterSubscriberSchema.index({ email: 1 }, { unique: true });
newsletterSubscriberSchema.index({ isActive: 1 });
newsletterSubscriberSchema.index({ subscribedAt: -1 });

// Générer un token de désabonnement
newsletterSubscriberSchema.methods.generateUnsubscribeToken = function() {
  const crypto = require('crypto');
  this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  return this.unsubscribeToken;
};

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
