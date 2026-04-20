const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contactModel',
    required: true
  },
  contactModel: {
    type: String,
    required: true,
    enum: ['Contact', 'MailingContact', 'User']
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  htmlBody: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  messageId: {
    type: String, // ID d'origine du serveur de messagerie pour éviter les doublons
    unique: true,
    sparse: true
  },
  threadId: {
    type: String // Pour regrouper les conversations
  }
}, {
  timestamps: true
});

messageSchema.index({ contactId: 1, date: -1 });
messageSchema.index({ messageId: 1 }, { unique: true });

module.exports = mongoose.model('Message', messageSchema);
