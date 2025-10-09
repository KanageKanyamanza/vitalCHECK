const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
const questionsData = require('../data/questions');
const questionsDataFR = require('../data/questions-fr');
const { calculateScores, generateRecommendations } = require('../utils/scoring');
const { generateResumeToken, isValidResumeToken } = require('../utils/resumeToken');
const { sendAccountCreatedAfterAssessment, sendAssessmentCompletedExistingUser } = require('../utils/emailService');
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

// Create draft assessment
router.post('/draft', [
  body('userId').isMongoId(),
  body('language').optional().isString()
], async (req, res) => {
  try {
    // console.log('📝 [DRAFT] Création/récupération de draft pour userId:', req.body.userId);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, language = 'fr' } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ [DRAFT] Utilisateur non trouvé:', userId);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user already has a draft assessment
    let draftAssessment = await Assessment.findOne({ 
      user: userId, 
      status: 'draft' 
    });

    if (draftAssessment) {
      // console.log('📋 [DRAFT] Draft existant trouvé:', {
      //   id: draftAssessment._id,
      //   currentQuestionIndex: draftAssessment.currentQuestionIndex,
      //   answersCount: draftAssessment.answers.length,
      //   hasResumeToken: !!draftAssessment.resumeToken
      // });
      
      // Update resume token if needed
      if (!draftAssessment.resumeToken) {
        draftAssessment.resumeToken = generateResumeToken(userId, draftAssessment._id);
        await draftAssessment.save();
        // console.log('🔑 [DRAFT] ResumeToken généré pour draft existant');
      }
      
      return res.json({
        success: true,
        assessment: {
          id: draftAssessment._id,
          resumeToken: draftAssessment.resumeToken,
          currentQuestionIndex: draftAssessment.currentQuestionIndex,
          answers: draftAssessment.answers,
          language: draftAssessment.language,
          status: draftAssessment.status
        }
      });
    }

    // Get total questions count
    const selectedQuestions = language === 'fr' ? questionsDataFR : questionsData;
    const totalQuestions = selectedQuestions.pillars.reduce((total, pillar) => total + pillar.questions.length, 0);

    // console.log('🆕 [DRAFT] Création d\'un nouveau draft pour:', user.companyName);

    // Create new draft assessment
    const assessment = new Assessment({
      user: userId,
      language,
      status: 'draft',
      totalQuestions
      // resumeToken will be set after save
    });

    await assessment.save();

    // Generate resume token
    assessment.resumeToken = generateResumeToken(userId, assessment._id);
    await assessment.save();

    // console.log('✅ [DRAFT] Nouveau draft créé:', {
    //   id: assessment._id,
    //   resumeToken: assessment.resumeToken,
    //   totalQuestions: assessment.totalQuestions
    // });

    res.json({
      success: true,
      assessment: {
        id: assessment._id,
        resumeToken: assessment.resumeToken,
        currentQuestionIndex: 0,
        answers: [],
        language: assessment.language,
        status: assessment.status
      }
    });

  } catch (error) {
    console.error('Create draft assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during draft creation' 
    });
  }
});

// Resume assessment by token
router.get('/resume/:token', async (req, res) => {
  try {
    console.log('🔄 [RESUME] Tentative de reprise avec token:', req.params.token);
    
    const { token } = req.params;

    if (!isValidResumeToken(token)) {
      console.log('❌ [RESUME] Token invalide:', token);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid resume token' 
      });
    }

    const assessment = await Assessment.findOne({ 
      resumeToken: token, 
      status: 'draft' 
    }).populate('user', 'companyName email');

    if (!assessment) {
      console.log('❌ [RESUME] Évaluation non trouvée ou terminée pour token:', token);
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found or already completed' 
      });
    }

    console.log('✅ [RESUME] Évaluation trouvée:', {
      assessmentId: assessment._id,
      companyName: assessment.user.companyName,
      currentQuestionIndex: assessment.currentQuestionIndex,
      answersCount: assessment.answers.length,
      progressPercentage: Math.round((assessment.answers.length / assessment.totalQuestions) * 100)
    });

    res.json({
      success: true,
      assessment: {
        id: assessment._id,
        resumeToken: assessment.resumeToken,
        currentQuestionIndex: assessment.currentQuestionIndex,
        answers: assessment.answers,
        language: assessment.language,
        status: assessment.status,
        user: {
          id: assessment.user._id,
          companyName: assessment.user.companyName,
          email: assessment.user.email
        }
      }
    });

  } catch (error) {
    console.error('Resume assessment error:', error);
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

// Save assessment progress
router.put('/progress/:assessmentId', [
  body('answers').isArray(),
  body('currentQuestionIndex').isInt({ min: 0 })
], async (req, res) => {
  try {
    // console.log('💾 [PROGRESS] Sauvegarde de progression pour assessmentId:', req.params.assessmentId);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log('❌ [PROGRESS] Erreurs de validation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { assessmentId } = req.params;
    const { answers, currentQuestionIndex } = req.body;

    // Validate assessmentId
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      // console.log('❌ [PROGRESS] AssessmentId invalide:', assessmentId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid assessment ID' 
      });
    }

    // console.log('📊 [PROGRESS] Données reçues:', {
    //   answersCount: answers.length,
    //   currentQuestionIndex,
    //   assessmentId
    // });

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      // console.log('❌ [PROGRESS] Assessment non trouvé:', assessmentId);
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    if (assessment.status === 'completed') {
      // console.log('⚠️ [PROGRESS] Tentative de sauvegarde sur évaluation terminée:', assessmentId);
      return res.status(400).json({ 
        success: false, 
        message: 'Assessment already completed' 
      });
    }

    // Filter valid answers before saving
    const validAnswers = answers.filter(answer => 
      answer && 
      answer.questionId && 
      answer.answer !== undefined && 
      answer.answer !== null &&
      typeof answer.answer === 'number'
    );

    // console.log('📊 [PROGRESS] Réponses valides filtrées:', {
    //   originalCount: answers.length,
    //   validCount: validAnswers.length,
    //   invalidAnswers: answers.length - validAnswers.length
    // });

    // Update assessment progress
    const previousAnswersCount = assessment.answers.length;
    assessment.answers = validAnswers;
    assessment.currentQuestionIndex = currentQuestionIndex;
    assessment.lastAnsweredAt = new Date();
    await assessment.save();

    // console.log('✅ [PROGRESS] Progression sauvegardée:', {
    //   assessmentId,
    //   previousAnswersCount,
    //   newAnswersCount: validAnswers.length,
    //   currentQuestionIndex,
    //   progressPercentage: Math.round((validAnswers.length / assessment.totalQuestions) * 100)
    // });

    res.json({
      success: true,
      message: 'Progress saved successfully'
    });

  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during progress save' 
    });
  }
});

// Submit assessment
router.post('/submit', [
  body('userId').isMongoId(),
  body('answers').isArray({ min: 1 }),
  body('language').optional().isString(),
  body('assessmentId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, answers, language = 'en', assessmentId } = req.body;

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

    // Generate recommendations
    const recommendations = generateRecommendations(pillarScores, selectedQuestions);

    let assessment;

    if (assessmentId) {
      // Update existing draft assessment
      assessment = await Assessment.findById(assessmentId);
      if (!assessment || assessment.user.toString() !== userId) {
        return res.status(404).json({ 
          success: false, 
          message: 'Assessment not found' 
        });
      }

      // Update assessment with final data
      assessment.answers = answers;
      assessment.pillarScores = pillarScores.map((pillar, index) => ({
        pillarId: selectedQuestions.pillars[index].id,
        pillarName: selectedQuestions.pillars[index].name,
        score: pillar.score,
        status: pillar.status,
        recommendations: recommendations[index]
      }));
      assessment.overallScore = overallScore;
      assessment.overallStatus = overallStatus;
      assessment.status = 'completed';
      assessment.completedAt = new Date();
      // Remove resume token field completely as assessment is completed
      assessment.resumeToken = undefined;
      delete assessment.resumeToken;

      await assessment.save();
    } else {
      // Create new assessment
      assessment = new Assessment({
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
        language,
        status: 'completed',
        completedAt: new Date()
      });

      await assessment.save();
    }

    // Update user with assessment reference
    user.assessments.push(assessment._id);
    await user.save();

    // Créer un compte automatiquement après l'évaluation (si pas déjà de compte)
    let tempPassword = null;
    let accountCreated = false;

    if (!user.hasAccount) {
      // Générer un mot de passe temporaire
      tempPassword = user.generateTempPassword();
      user.password = tempPassword;
      user.hasAccount = true;
      await user.save();
      accountCreated = true;

      // Envoyer l'email avec les identifiants (NOUVEAU COMPTE)
      try {
        await sendAccountCreatedAfterAssessment(
          user.email,
          user.firstName || user.companyName,
          tempPassword,
          overallScore
        );
        console.log('✅ Email de création de compte envoyé après évaluation à:', user.email);
      } catch (emailError) {
        console.error('❌ Erreur envoi email création compte:', emailError);
        // Continue même si l'email échoue
      }
    } else {
      // L'utilisateur a déjà un compte, envoyer email de notification d'évaluation
      try {
        await sendAssessmentCompletedExistingUser(
          user.email,
          user.firstName || user.companyName,
          overallScore
        );
        console.log('✅ Email de nouvelle évaluation envoyé à:', user.email);
      } catch (emailError) {
        console.error('❌ Erreur envoi email évaluation:', emailError);
        // Continue même si l'email échoue
      }
    }

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
