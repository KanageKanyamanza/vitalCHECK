const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['new_assessment', 'assessment_updated', 'user_registered']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    email: String,
    sector: String,
    companySize: String
  },
  assessment: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    score: Number,
    status: String,
    completedAt: Date
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ 'user.id': 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
