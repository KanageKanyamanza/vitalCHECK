const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  planId: {
    type: String,
    required: true,
    enum: ['standard', 'premium', 'diagnostic']
  },
  planName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  customerEmail: {
    type: String,
    required: true
  },
  paypalOrderId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'processed', 'failed'],
    default: 'pending'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  paymentDetails: {
    type: Object
  },
  notificationSent: {
    type: Boolean,
    default: false
  },

  // ── Mobile Money (AfribaPay) ──
  provider: {
    type: String,
    enum: ['paypal', 'afribapay'],
    default: 'paypal'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Identifiant AfribaPay : unique, une transaction ne peut servir qu'une fois
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  operator: String,
  phoneNumber: String,
  // Dernier statut connu chez AfribaPay : INITIATED, PENDING, SUCCESS, FAILED, INIT_ERROR
  providerStatus: String,
  // Période achetée, calculée une seule fois au moment de l'activation
  periodStart: Date,
  periodEnd: Date,
  activatedAt: Date,
  activatedVia: String,
  planAppliedAt: Date,
  lastCheckedAt: Date,
  checkCount: {
    type: Number,
    default: 0
  },
  webhookReceivedAt: Date,
  // Désaccord à examiner à la main (montant, devise, statut final contradictoire) : jamais activé
  conflict: {
    type: Boolean,
    default: false
  },
  failureReason: String
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ provider: 1, status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

