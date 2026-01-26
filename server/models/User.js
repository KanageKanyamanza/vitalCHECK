const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false // Ne pas inclure le password par défaut dans les queries
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
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
  phone: {
    type: String,
    trim: true
  },
  assessments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'standard', 'premium', 'diagnostic'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'inactive'
    },
    startDate: Date,
    endDate: Date,
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  hasAccount: {
    type: Boolean,
    default: false
  },
  accountCreatedAt: {
    type: Date,
    default: null
  },
  tempPassword: {
    type: String,
    default: null,
    select: false // Ne pas inclure par défaut dans les queries
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a temporary password
userSchema.methods.generateTempPassword = function() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Index for faster queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ 'subscription.status': 1 });

module.exports = mongoose.model('User', userSchema);
