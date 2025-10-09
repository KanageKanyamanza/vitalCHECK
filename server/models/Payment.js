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
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

