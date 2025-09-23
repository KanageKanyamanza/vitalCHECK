const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  sector: {
    type: String,
    required: [true, 'Sector is required'],
    trim: true
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
    enum: ['micro', 'sme', 'large-sme']
  },
  assessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
