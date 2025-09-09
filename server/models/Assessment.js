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
    required: true,
    min: 0,
    max: 100
  },
  overallStatus: {
    type: String,
    enum: ['red', 'amber', 'green'],
    required: true
  },
  language: {
    type: String,
    default: 'fr',
    enum: ['en', 'fr']
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  reportGenerated: {
    type: Boolean,
    default: false
  },
  reportUrl: {
    type: String
  }
});

// Index for faster queries
assessmentSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
