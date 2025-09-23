const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  answer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
});

const pillarScoreSchema = new mongoose.Schema({
  pillarId: {
    type: String,
    required: true
  },
  pillarName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['red', 'amber', 'green'],
    required: true
  },
  recommendations: [{
    type: String
  }]
});

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  pillarScores: [pillarScoreSchema],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  overallStatus: {
    type: String,
    enum: ['red', 'amber', 'green']
  },
  language: {
    type: String,
    default: 'fr',
    enum: ['en', 'fr']
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  lastAnsweredAt: {
    type: Date,
    default: Date.now
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  resumeToken: {
    type: String
  },
  reportGenerated: {
    type: Boolean,
    default: false
  },
  reportUrl: {
    type: String
  },
  reportType: {
    type: String,
    enum: ['freemium', 'premium'],
    default: 'freemium'
  },
  pdfBuffer: {
    type: Buffer
  },
  pdfGeneratedAt: {
    type: Date
  },
  premiumInsights: {
    type: mongoose.Schema.Types.Mixed
  }
});

// Index for faster queries
assessmentSchema.index({ user: 1, completedAt: -1 });
assessmentSchema.index({ user: 1, status: 1, startedAt: -1 });
// Create sparse unique index for resumeToken
assessmentSchema.index({ resumeToken: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
