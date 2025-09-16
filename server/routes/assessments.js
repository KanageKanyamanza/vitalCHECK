const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
const questionsData = require('../data/questions');
const questionsDataFR = require('../data/questions-fr');
const { calculateScores, generateRecommendations } = require('../utils/scoring');
const router = express.Router();

// Get supported languages
router.get('/languages', (req, res) => {
  try {
    const languages = {
      'en': 'English',
      'fr': 'Français'
    };
    
    res.json({
      success: true,
      languages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get questions
router.get('/questions', (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    // Select questions based on language
    let selectedQuestions = questionsData; // Default to English
    
    switch (lang) {
      case 'fr':
        selectedQuestions = questionsDataFR;
        break;
      // Add more languages here as needed
      default:
        selectedQuestions = questionsData;
    }
    
    res.json({
      success: true,
      data: selectedQuestions,
      language: lang
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Submit assessment
router.post('/submit', [
  body('userId').isMongoId(),
  body('answers').isArray({ min: 1 }),
  body('language').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, answers, language = 'en' } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Select questions based on language for scoring
    let selectedQuestions = questionsData;
    switch (language) {
      case 'fr':
        selectedQuestions = questionsDataFR;
        break;
      default:
        selectedQuestions = questionsData;
    }

    // Calculate scores
    const { pillarScores, overallScore, overallStatus } = calculateScores(answers, selectedQuestions);
    
    console.log('Calculated scores:', { pillarScores, overallScore, overallStatus }); // Debug

    // Generate recommendations
    const recommendations = generateRecommendations(pillarScores, selectedQuestions);

    // Create assessment
    const assessment = new Assessment({
      user: userId,
      answers,
      pillarScores: pillarScores.map((pillar, index) => ({
        pillarId: selectedQuestions.pillars[index].id,
        pillarName: selectedQuestions.pillars[index].name,
        score: pillar.score,
        status: pillar.status,
        recommendations: recommendations[index]
      })),
      overallScore,
      overallStatus,
      language
    });

    await assessment.save();

    // Update user with assessment reference
    user.assessments.push(assessment._id);
    await user.save();

    // Create notification for admin
    try {
      const notification = new Notification({
        type: 'new_assessment',
        title: 'Nouvelle évaluation complétée',
        message: `${user.companyName} a complété son évaluation`,
        user: {
          id: user._id,
          name: user.companyName,
          email: user.email,
          sector: user.sector,
          companySize: user.companySize
        },
        assessment: {
          id: assessment._id,
          score: overallScore,
          status: overallStatus,
          completedAt: assessment.completedAt
        },
        read: false
      });
      
      await notification.save();
    } catch (notificationError) {
      console.error('Erreur lors de la création de la notification:', notificationError);
      // Ne pas faire échouer la soumission pour une erreur de notification
    }

    res.status(201).json({
      success: true,
      assessment: {
        id: assessment._id,
        overallScore,
        overallStatus,
        pillarScores: assessment.pillarScores,
        completedAt: assessment.completedAt
      }
    });

  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during assessment submission' 
    });
  }
});

// Get user's assessments
router.get('/user/:userId', async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.params.userId })
      .sort({ completedAt: -1 })
      .populate('user', 'companyName email');

    res.json({
      success: true,
      assessments
    });

  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get specific assessment
router.get('/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'companyName email sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    res.json({
      success: true,
      assessment
    });

  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
