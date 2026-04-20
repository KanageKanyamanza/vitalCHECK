const mongoose = require('mongoose');

const mailingContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  companyName: {
    type: String,
    trim: true,
    default: ''
  },
  source: {
    type: String,
    enum: ['manual', 'import'],
    default: 'manual'
  },
  type: {
    type: String,
    trim: true,
    default: 'Prospect'
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  lastEmailedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
mailingContactSchema.index({ email: 'text', firstName: 'text', lastName: 'text', companyName: 'text' });

module.exports = mongoose.model('MailingContact', mailingContactSchema);
