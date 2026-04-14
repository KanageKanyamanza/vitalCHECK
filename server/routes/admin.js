const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
const ChatbotInteraction = require('../models/ChatbotInteraction');
const ChatbotResponse = require('../models/ChatbotResponse');
const { sendEmail } = require('../utils/emailService');
const { 
  exportUsersToExcel, 
  exportAssessmentsToExcel, 
  exportStatsToExcel, 
  exportStatsToPDF,
  exportUsersToPDF,
  exportAssessmentsToPDF
} = require('../utils/exportUtils');
const { generateReminderEmailHTML, generateGenericEmailHTML } = require('../utils/reminderEmailTemplate');
const { uploadSingleImage, uploadToCloudinary, deleteImage } = require('../config/cloudinary');
const router = express.Router();
const { authenticateAdmin, checkPermission } = require('../middleware/auth');

// Connexion admin
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants invalides' 
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants invalides' 
      });
    }

    // Mettre à jour la dernière connexion
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
        avatar: admin.avatar
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Obtenir les notifications
router.get('/notifications', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const unreadCount = await Notification.countDocuments({ read: false });

    // Transformer les _id en id pour le frontend
    const transformedNotifications = notifications.map(notification => ({
      ...notification.toObject(),
      id: notification._id,
      assessment: {
        ...notification.assessment,
        id: notification.assessment.id
      }
    }));

    res.json({
      success: true,
      notifications: transformedNotifications,
      count: notifications.length,
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Marquer une notification comme lue
router.put('/notifications/:id/read', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de notification invalide'
      });
    }
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { 
        read: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    res.json({
      success: true,
      notification: {
        ...notification.toObject(),
        id: notification._id,
        assessment: {
          ...notification.assessment,
          id: notification.assessment.id
        }
      }
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Marquer toutes les notifications comme lues
router.put('/notifications/read-all', authenticateAdmin, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { read: false },
      { 
        read: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Obtenir les statistiques générales
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const completedAssessments = await Assessment.countDocuments({ reportGenerated: true });
    
    // Statistiques par secteur
    const sectorStats = await User.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par taille d'entreprise
    const sizeStats = await User.aggregate([
      { $group: { _id: '$companySize', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques des scores
    const scoreStats = await Assessment.aggregate([
      {
        $group: {
          _id: '$overallStatus',
          count: { $sum: 1 },
          avgScore: { $avg: '$overallScore' }
        }
      }
    ]);

    // Utilisateurs récents (7 derniers jours)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Évaluations récentes (7 derniers jours)
    const recentAssessments = await Assessment.countDocuments({
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAssessments,
        completedAssessments,
        recentUsers,
        recentAssessments,
        sectorStats,
        sizeStats,
        scoreStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Obtenir tous les utilisateurs avec pagination
router.get('/users', authenticateAdmin, checkPermission('viewUsers'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sector = req.query.sector || '';
    const companySize = req.query.companySize || '';

    const query = {};
    
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (sector) query.sector = sector;
    if (companySize) query.companySize = companySize;

    const users = await User.find(query)
      .populate('assessments', 'overallScore overallStatus completedAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Obtenir un utilisateur spécifique avec ses évaluations
router.get('/users/:userId', authenticateAdmin, checkPermission('viewUsers'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'assessments',
        options: { sort: { completedAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Obtenir toutes les évaluations avec pagination
router.get('/assessments', authenticateAdmin, checkPermission('viewAssessments'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const dateFrom = req.query.dateFrom || '';
    const dateTo = req.query.dateTo || '';

    const query = {};
    
    if (status) query.overallStatus = status;
    
    if (dateFrom || dateTo) {
      query.completedAt = {};
      if (dateFrom) query.completedAt.$gte = new Date(dateFrom);
      if (dateTo) query.completedAt.$lte = new Date(dateTo);
    }

    const assessments = await Assessment.find(query)
      .populate('user', 'companyName email sector companySize')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assessment.countDocuments(query);

    res.json({
      success: true,
      assessments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Obtenir une évaluation spécifique
router.get('/assessments/:assessmentId', authenticateAdmin, checkPermission('viewAssessments'), async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'companyName email sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Évaluation non trouvée' 
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
      message: 'Erreur serveur' 
    });
  }
});

// Envoyer un email de relance
router.post('/users/:userId/remind', authenticateAdmin, checkPermission('sendEmails'), [
  body('subject').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, message } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    const emailData = {
      to: user.email,
      subject: subject,
      html: generateReminderEmailHTML(user, message, subject)
    };

    // Vérifier la configuration email avant d'envoyer
    console.log('🔍 [EMAIL] Vérification de la configuration email...', {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER ? 'Configuré' : 'Manquant',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Configuré' : 'Manquant',
      EMAIL_FROM: process.env.EMAIL_FROM
    });

    // Essayer d'abord la méthode normale, puis l'externe
    try {
      console.log('📧 [EMAIL] Tentative d\'envoi avec configuration normale...');
      const result = await sendEmail(emailData);
      
      console.log('✅ [EMAIL] Email de relance envoyé avec succès à:', user.email, {
        messageId: result.messageId,
        response: result.response
      });

      res.json({
        success: true,
        message: 'Email de relance envoyé avec succès !'
      });
    } catch (emailError) {
      console.error('❌ [EMAIL] Erreur avec configuration normale:', {
        userId: user._id,
        email: user.email,
        error: emailError.message,
        code: emailError.code
      });

      // Dernier recours: service externe
      try {
        console.log('🌐 [EMAIL] Tentative avec service externe...');
          const { sendEmailExternal } = require('../utils/emailServiceExternal');
          const result = await sendEmailExternal(emailData);
          
          console.log('✅ [EMAIL] Email de relance envoyé avec succès (externe) à:', user.email, {
            messageId: result.messageId,
            response: result.response
          });

          res.json({
            success: true,
            message: 'Email de relance envoyé avec succès !'
          });
        } catch (extError) {
          console.error('❌ [EMAIL] Erreur avec service externe:', {
            userId: user._id,
            email: user.email,
            error: extError.message
          });

          res.status(500).json({
            success: false,
            message: `Erreur lors de l'envoi de l'email: ${extError.message}`
          });
        }
      }

  } catch (error) {
    console.error('Send reminder email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi de l\'email' 
    });
  }
});

// Envoyer un email de relance en masse
router.post('/users/remind-bulk', authenticateAdmin, checkPermission('sendEmails'), [
  body('userIds').optional().isArray({ min: 1 }),
  body('emails').optional().isArray({ min: 1 }),
  body('subject').optional().trim().isLength({ min: 1 }),
  body('message').optional().trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userIds, emails, subject, message } = req.body;

    // Support pour les deux formats : userIds + message commun OU emails personnalisés
    if (emails && emails.length > 0) {
      // Format avec emails personnalisés
      const emailPromises = emails.map(async (emailData) => {
        // Utiliser le nouveau template générique pour les contacts importés/manuels
        const html = generateGenericEmailHTML(emailData.message, emailData.subject);
        
        const emailOptions = {
          to: emailData.to,
          subject: emailData.subject,
          html: html
        };

        // Essayer d'abord la méthode normale, puis l'externe
        try {
          return await sendEmail(emailOptions);
        } catch (error) {
          console.error('❌ [EMAIL BULK] Erreur configuration normale:', error.message);
          
          try {
            const { sendEmailExternal } = require('../utils/emailServiceExternal');
            return await sendEmailExternal(emailOptions);
          } catch (extError) {
            console.error('❌ [EMAIL BULK] Erreur service externe:', extError.message);
            throw extError;
          }
        }
      });

      await Promise.all(emailPromises);

      res.json({
        success: true,
        message: `${emails.length} emails personnalisés envoyés avec succès`
      });
    } else if (userIds && userIds.length > 0) {
      // Format classique avec userIds et message commun
      const users = await User.find({ _id: { $in: userIds } });

      if (users.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Aucun utilisateur trouvé' 
        });
      }

      // Répondre immédiatement au client
      res.json({
        success: true,
        message: `Envoi de ${users.length} emails de relance en cours...`
      });

      // Envoyer les emails de manière asynchrone avec fallback
      const emailPromises = users.map(async (user) => {
        const emailData = {
          to: user.email,
          subject: subject,
          html: generateReminderEmailHTML(user, message, subject)
        };

        // Essayer d'abord la méthode normale, puis l'externe
        try {
          const result = await sendEmail(emailData);
          console.log('✅ [EMAIL BULK] Email de relance envoyé avec succès à:', user.email);
          return result;
        } catch (error) {
          console.error('❌ [EMAIL BULK] Erreur configuration normale:', {
            userId: user._id,
            email: user.email,
            error: error.message
          });
          
          try {
            const { sendEmailExternal } = require('../utils/emailServiceExternal');
            const result = await sendEmailExternal(emailData);
            console.log('✅ [EMAIL BULK] Email de relance envoyé avec succès (externe) à:', user.email);
            return result;
          } catch (extError) {
            console.error('❌ [EMAIL BULK] Erreur service externe:', {
              userId: user._id,
              email: user.email,
              error: extError.message
            });
            throw extError;
          }
        }
      });

      // Traiter les emails en arrière-plan
      Promise.allSettled(emailPromises)
        .then((results) => {
          const successful = results.filter(r => r.status === 'fulfilled').length;
          const failed = results.filter(r => r.status === 'rejected').length;
          console.log(`📊 [EMAIL] Résultats de l'envoi en masse: ${successful} réussis, ${failed} échoués`);
        });
    } else {
      return res.status(400).json({
        success: false,
        message: 'userIds ou emails requis'
      });
    }

  } catch (error) {
    console.error('Send bulk reminder emails error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi des emails' 
    });
  }
});

// Supprimer un utilisateur
router.delete('/users/:userId', authenticateAdmin, checkPermission('manageUsers'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Supprimer les évaluations associées
    await Assessment.deleteMany({ user: user._id });
    
    // Supprimer l'utilisateur
    await User.findByIdAndDelete(req.params.userId);

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Supprimer une évaluation
router.delete('/assessments/:assessmentId', authenticateAdmin, checkPermission('manageAssessments'), async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    
    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Évaluation non trouvée' 
      });
    }

    // Retirer la référence de l'évaluation de l'utilisateur
    await User.findByIdAndUpdate(assessment.user, {
      $pull: { assessments: assessment._id }
    });

    // Supprimer l'évaluation
    await Assessment.findByIdAndDelete(req.params.assessmentId);

    res.json({
      success: true,
      message: 'Évaluation supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Exporter les données (CSV)
router.get('/export/users', authenticateAdmin, checkPermission('viewUsers'), async (req, res) => {
  try {
    const users = await User.find({})
      .populate('assessments', 'overallScore overallStatus completedAt')
      .sort({ createdAt: -1 });

    let csv = 'Email,Téléphone,Nom de l\'entreprise,Secteur,Taille,Évaluations,Score moyen,Statut moyen,Date de création\n';
    
    users.forEach(user => {
      const assessments = user.assessments || [];
      const avgScore = assessments.length > 0 
        ? (assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length).toFixed(2)
        : 'N/A';
      const avgStatus = assessments.length > 0 
        ? assessments[0].overallStatus 
        : 'N/A';
      const phone = user.phone ? user.phone.replace(/"/g, '""') : '';
      
      csv += `"${user.email}","${phone}","${user.companyName}","${user.sector}","${user.companySize}","${assessments.length}","${avgScore}","${avgStatus}","${user.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
    res.send(csv);

  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export' 
    });
  }
});

// Export utilisateurs en Excel
router.get('/export/users/excel', authenticateAdmin, checkPermission('viewUsers'), async (req, res) => {
  try {
    const users = await User.find({})
      .populate('assessments', 'overallScore overallStatus completedAt')
      .sort({ createdAt: -1 });

    const buffer = await exportUsersToExcel(users);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="utilisateurs-export.xlsx"');
    res.send(buffer);

  } catch (error) {
    console.error('Export users Excel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export Excel' 
    });
  }
});

// Export utilisateurs en PDF
router.get('/export/users/pdf', authenticateAdmin, checkPermission('viewUsers'), async (req, res) => {
  try {
    const users = await User.find({})
      .populate('assessments', 'overallScore overallStatus completedAt')
      .sort({ createdAt: -1 });

    const pdf = await exportUsersToPDF(users);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="utilisateurs-rapport.pdf"');
    res.send(pdf);

  } catch (error) {
    console.error('Export users PDF error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export PDF' 
    });
  }
});

// Export évaluations en Excel
router.get('/export/assessments/excel', authenticateAdmin, checkPermission('viewAssessments'), async (req, res) => {
  try {
    const assessments = await Assessment.find({})
      .populate('user', 'companyName email sector companySize')
      .sort({ completedAt: -1 });

    const buffer = await exportAssessmentsToExcel(assessments);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="evaluations-export.xlsx"');
    res.send(buffer);

  } catch (error) {
    console.error('Export assessments Excel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export Excel' 
    });
  }
});

// Export évaluations en PDF
router.get('/export/assessments/pdf', authenticateAdmin, checkPermission('viewAssessments'), async (req, res) => {
  try {
    const assessments = await Assessment.find({})
      .populate('user', 'companyName email sector companySize')
      .sort({ completedAt: -1 });

    const pdf = await exportAssessmentsToPDF(assessments);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="evaluations-rapport.pdf"');
    res.send(pdf);

  } catch (error) {
    console.error('Export assessments PDF error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export PDF' 
    });
  }
});

// Export statistiques en Excel
router.get('/export/stats/excel', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const completedAssessments = await Assessment.countDocuments({ reportGenerated: true });
    
    // Statistiques par secteur
    const sectorStats = await User.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par taille d'entreprise
    const sizeStats = await User.aggregate([
      { $group: { _id: '$companySize', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques des scores
    const scoreStats = await Assessment.aggregate([
      {
        $group: {
          _id: '$overallStatus',
          count: { $sum: 1 },
          avgScore: { $avg: '$overallScore' }
        }
      }
    ]);

    // Utilisateurs récents (7 derniers jours)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Évaluations récentes (7 derniers jours)
    const recentAssessments = await Assessment.countDocuments({
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const stats = {
      totalUsers,
      totalAssessments,
      completedAssessments,
      recentUsers,
      recentAssessments,
      sectorStats,
      sizeStats,
      scoreStats
    };

    const buffer = await exportStatsToExcel(stats);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="statistiques-export.xlsx"');
    res.send(buffer);

  } catch (error) {
    console.error('Export stats Excel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export Excel' 
    });
  }
});

// Export statistiques en PDF
router.get('/export/stats/pdf', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const completedAssessments = await Assessment.countDocuments({ reportGenerated: true });
    
    // Statistiques par secteur
    const sectorStats = await User.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par taille d'entreprise
    const sizeStats = await User.aggregate([
      { $group: { _id: '$companySize', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Utilisateurs récents (7 derniers jours)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Évaluations récentes (7 derniers jours)
    const recentAssessments = await Assessment.countDocuments({
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const stats = {
      totalUsers,
      totalAssessments,
      completedAssessments,
      recentUsers,
      recentAssessments,
      sectorStats,
      sizeStats
    };

    const pdf = await exportStatsToPDF(stats);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="statistiques-rapport.pdf"');
    res.send(pdf);

  } catch (error) {
    console.error('Export stats PDF error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'export PDF' 
    });
  }
});

// Get user's draft assessment and generate resume link
router.get('/users/:userId/draft-assessment', authenticateAdmin, checkPermission('viewAssessments'), async (req, res) => {
  try {
    const draftAssessment = await Assessment.findOne({ 
      user: req.params.userId, 
      status: 'draft' 
    }).populate('user', 'companyName email');

    if (!draftAssessment) {
      return res.json({
        success: true,
        hasDraft: false,
        message: 'No draft assessment found'
      });
    }

    // Ensure resume token exists
    if (!draftAssessment.resumeToken) {
      const { generateResumeToken } = require('../utils/resumeToken');
      draftAssessment.resumeToken = generateResumeToken(req.params.userId, draftAssessment._id);
      await draftAssessment.save();
    }

    const resumeLink = `${process.env.CLIENT_URL || 'https://www.checkmyenterprise.com'}/resume/${draftAssessment.resumeToken}`;

    res.json({
      success: true,
      hasDraft: true,
      assessment: {
        id: draftAssessment._id,
        resumeToken: draftAssessment.resumeToken,
        resumeLink,
        currentQuestionIndex: draftAssessment.currentQuestionIndex,
        totalQuestions: draftAssessment.totalQuestions,
        answersCount: draftAssessment.answers.length,
        startedAt: draftAssessment.startedAt,
        lastAnsweredAt: draftAssessment.lastAnsweredAt,
        user: {
          companyName: draftAssessment.user.companyName,
          email: draftAssessment.user.email
        }
      }
    });

  } catch (error) {
    console.error('Get draft assessment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get all draft assessments (incomplete evaluations)
router.get('/draft-assessments', authenticateAdmin, checkPermission('viewAssessments'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = { status: 'draft' };
    if (search) {
      searchQuery = {
        ...searchQuery,
        $or: [
          { 'user.companyName': { $regex: search, $options: 'i' } },
          { 'user.email': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const draftAssessments = await Assessment.find(searchQuery)
      .populate('user', 'companyName email sector companySize')
      .sort({ lastAnsweredAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Assessment.countDocuments(searchQuery);

    // Generate resume links for all assessments
    const { generateResumeToken } = require('../utils/resumeToken');
    const assessmentsWithLinks = await Promise.all(
      draftAssessments
        .filter(assessment => assessment.user) // Filtrer les assessments sans utilisateur
        .map(async (assessment) => {
          // Ensure resume token exists
          if (!assessment.resumeToken) {
            assessment.resumeToken = generateResumeToken(assessment.user._id, assessment._id);
            await assessment.save();
          }

          const resumeLink = `${process.env.CLIENT_URL || 'https://www.checkmyenterprise.com'}/resume/${assessment.resumeToken}`;
          const progressPercentage = assessment.totalQuestions > 0 
            ? Math.round((assessment.answers.length / assessment.totalQuestions) * 100)
            : 0;

          return {
            id: assessment._id,
            resumeToken: assessment.resumeToken,
            resumeLink,
            currentQuestionIndex: assessment.currentQuestionIndex,
            totalQuestions: assessment.totalQuestions,
            answersCount: assessment.answers.length,
            progressPercentage,
            startedAt: assessment.startedAt,
            lastAnsweredAt: assessment.lastAnsweredAt,
            language: assessment.language,
            user: {
              id: assessment.user._id,
              companyName: assessment.user.companyName,
              email: assessment.user.email,
              sector: assessment.user.sector,
              companySize: assessment.user.companySize
            }
          };
        })
    );

    res.json({
      success: true,
      assessments: assessmentsWithLinks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get draft assessments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ===== GESTION DES ADMINISTRATEURS =====

// Upload d'avatar pour l'administrateur
router.post('/profile/avatar', authenticateAdmin, uploadSingleImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier image fourni'
      });
    }

    // Upload vers Cloudinary avec dossier spécifique pour les avatars
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'vitalCHECK-admin-avatars',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Récupérer l'admin actuel
    const admin = await Admin.findById(req.admin._id);
    
    // Supprimer l'ancien avatar s'il existe
    if (admin.avatar && admin.avatar.publicId) {
      try {
        await deleteImage(admin.avatar.publicId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ancien avatar:', error);
        // Continuer même si la suppression échoue
      }
    }

    // Mettre à jour l'avatar de l'admin
    admin.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };
    
    await admin.save();

    res.json({
      success: true,
      message: 'Avatar mis à jour avec succès',
      avatar: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'upload de l\'avatar' 
    });
  }
});

// Obtenir tous les administrateurs
router.get('/admins', authenticateAdmin, checkPermission('manageAdmins'), async (req, res) => {
  try {
    const admins = await Admin.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Mettre à jour le profil de l'admin connecté
router.put('/profile', authenticateAdmin, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('currentPassword').optional().isLength({ min: 6 }),
  body('newPassword').optional().isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    // Vérifier le mot de passe actuel si un nouveau mot de passe est fourni
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel requis pour changer le mot de passe'
        });
      }

      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }

      admin.password = newPassword;
    }

    // Mettre à jour les autres champs
    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();

    // Retourner l'admin mis à jour sans le mot de passe
    const updatedAdmin = await Admin.findById(admin._id).select('-password');

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Créer un nouvel administrateur
router.post('/admins', authenticateAdmin, checkPermission('manageAdmins'), [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'super_admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { name, email, password, role = 'admin' } = req.body;

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Un administrateur avec cet email existe déjà'
      });
    }

    // Créer le nouvel admin
    const newAdmin = new Admin({
      name,
      email,
      password,
      role,
      isActive: true
    });

    await newAdmin.save();

    // Retourner l'admin créé sans le mot de passe
    const createdAdmin = await Admin.findById(newAdmin._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'Administrateur créé avec succès',
      admin: createdAdmin
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Supprimer un administrateur
router.delete('/admins/:adminId', authenticateAdmin, checkPermission('manageAdmins'), async (req, res) => {
  try {
    const { adminId } = req.params;

    // Empêcher la suppression de soi-même
    if (adminId === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      });
    }

    // Désactiver au lieu de supprimer
    admin.isActive = false;
    await admin.save();

    res.json({
      success: true,
      message: 'Administrateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Get all PDFs reports
router.get('/reports/pdfs', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = { pdfGeneratedAt: { $exists: true, $ne: null } };
    
    if (search) {
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      searchQuery.user = { $in: userIds };
    }

    // Get assessments with PDF
    const assessments = await Assessment.find(searchQuery)
      .populate('user', 'email companyName sector companySize')
      .select('_id user overallScore overallStatus completedAt pdfGeneratedAt language')
      .sort({ pdfGeneratedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Assessment.countDocuments(searchQuery);

    const pdfs = assessments.map(assessment => ({
      _id: assessment._id,
      user: assessment.user,
      overallScore: assessment.overallScore,
      overallStatus: assessment.overallStatus,
      completedAt: assessment.completedAt,
      pdfGeneratedAt: assessment.pdfGeneratedAt,
      language: assessment.language || 'fr',
      downloadUrl: `/api/reports/download/${assessment._id}`
    }));

    res.json({
      success: true,
      pdfs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get PDFs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Resend PDF report by email
router.post('/reports/resend/:assessmentId', authenticateAdmin, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('user', 'email companyName sector companySize');

    if (!assessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assessment not found' 
      });
    }

    if (!assessment.pdfBuffer) {
      return res.status(404).json({ 
        success: false, 
        message: 'PDF not found for this assessment' 
      });
    }

    const { sendEmail } = require('../utils/emailService');
    const emailTemplates = require('../utils/emailTemplates');
    
    const template = assessment.language === 'en' ? emailTemplates.en : emailTemplates.fr;
    const clientUrl = process.env.CLIENT_URL || 'https://www.checkmyenterprise.com';
    const downloadUrl = `${clientUrl}/report/download/${assessment._id}`;
    
    const pdfFilename = `vitalCHECK-Health-Check-${assessment.user.companyName}-${new Date(assessment.completedAt).toISOString().split('T')[0]}.pdf`;

    const emailData = {
      to: assessment.user.email,
      subject: template.reportReady.subject,
      html: template.reportReady.html(assessment.user, assessment, downloadUrl),
      attachments: [{
        filename: pdfFilename,
        content: assessment.pdfBuffer
      }]
    };

    await sendEmail(emailData);

    res.json({
      success: true,
      message: `Rapport renvoyé à ${assessment.user.email}`
    });
  } catch (error) {
    console.error('Resend PDF error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi du rapport' 
    });
  }
});

// ===== ROUTES CHATBOT ADMIN =====

// GET /admin/chatbot/stats - Statistiques du chatbot
router.get('/chatbot/stats', authenticateAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const totalInteractions = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate }
    });

    const uniqueUsers = await ChatbotInteraction.distinct('userId', {
      createdAt: { $gte: startDate },
      userId: { $ne: null }
    });

    const answeredCount = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate },
      status: 'answered'
    });

    const pendingCount = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate },
      status: 'pending'
    });

    const responseRate = totalInteractions > 0 
      ? ((answeredCount / totalInteractions) * 100).toFixed(1) 
      : '0';

    // Feedback
    const usefulCount = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate },
      feedback: 'useful'
    });

    const uselessCount = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate },
      feedback: 'useless'
    });

    // Activité des 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const withResponse = await ChatbotInteraction.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
        status: 'answered'
      });

      const withoutResponse = await ChatbotInteraction.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
        status: 'pending'
      });

      dailyActivity.push({
        date: date.toISOString().split('T')[0],
        withResponse,
        withoutResponse
      });
    }

    // Top questions sans réponse
    const topUnanswered = await ChatbotInteraction.find({
      status: 'pending',
      createdAt: { $gte: startDate }
    })
      .sort({ frequency: -1, createdAt: -1 })
      .limit(5)
      .select('question frequency createdAt')
      .lean();

    res.json({
      success: true,
      stats: {
        totalInteractions,
        uniqueUsers: uniqueUsers.length,
        responseRate: parseFloat(responseRate),
        pendingQuestions: pendingCount,
        feedback: {
          useful: usefulCount,
          useless: uselessCount
        },
        dailyActivity,
        topUnanswered
      }
    });
  } catch (error) {
    console.error('Get chatbot stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /admin/chatbot/analytics - Analytics avancées
router.get('/chatbot/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Croissance vs période précédente
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(days));
    
    const currentPeriod = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    const previousPeriod = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: startDate }
    });

    const growth = previousPeriod > 0 
      ? (((currentPeriod - previousPeriod) / previousPeriod) * 100).toFixed(1)
      : '0';

    // Taux de satisfaction
    const totalFeedback = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate },
      feedback: { $in: ['useful', 'useless'] }
    });

    const usefulCount = await ChatbotInteraction.countDocuments({
      createdAt: { $gte: startDate },
      feedback: 'useful'
    });

    const satisfactionRate = totalFeedback > 0 
      ? ((usefulCount / totalFeedback) * 100).toFixed(1)
      : '0';

    // Temps de réponse moyen (simulation - à améliorer avec timestamps réels)
    const avgResponseTime = 148; // ms

    // Types de questions
    const questionTypes = await ChatbotInteraction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$responseType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Intentions détectées
    const intents = await ChatbotInteraction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          responseType: 'intent'
        }
      },
      {
        $group: {
          _id: '$responseType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Activité par heure
    const hourlyActivity = [];
    for (let hour = 0; hour < 24; hour++) {
      const count = await ChatbotInteraction.countDocuments({
        createdAt: { $gte: startDate },
        $expr: {
          $eq: [{ $hour: '$createdAt' }, hour]
        }
      });
      hourlyActivity.push({ hour, count });
    }

    // Questions les plus fréquentes
    const mostFrequent = await ChatbotInteraction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$question',
          count: { $sum: '$frequency' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      analytics: {
        growth: parseFloat(growth),
        satisfactionRate: parseFloat(satisfactionRate),
        avgResponseTime,
        questionTypes,
        intents,
        hourlyActivity,
        mostFrequent: mostFrequent.map(item => ({
          question: item._id,
          count: item.count
        }))
      }
    });
  } catch (error) {
    console.error('Get chatbot analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /admin/chatbot/unanswered - Questions sans réponse
router.get('/chatbot/unanswered', authenticateAdmin, async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { status };
    if (status === 'pending') {
      query.status = 'pending';
    }

    const total = await ChatbotInteraction.countDocuments(query);
    
    const questions = await ChatbotInteraction.find(query)
      .sort({ frequency: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email companyName')
      .lean();

    res.json({
      success: true,
      questions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get unanswered questions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /admin/chatbot/interactions - Toutes les interactions
router.get('/chatbot/interactions', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      responseType = 'all',
      feedback = 'all',
      startDate,
      endDate
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Recherche
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { response: { $regex: search, $options: 'i' } }
      ];
    }

    // Type de réponse
    if (responseType !== 'all') {
      query.responseType = responseType;
    }

    // Feedback
    if (feedback !== 'all') {
      query.feedback = feedback === 'none' ? null : feedback;
    }

    // Dates
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const total = await ChatbotInteraction.countDocuments(query);
    
    const interactions = await ChatbotInteraction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email companyName')
      .populate('answeredBy', 'name email')
      .lean();

    res.json({
      success: true,
      interactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get interactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /admin/chatbot/answer/:id - Répondre à une question
router.post('/chatbot/answer/:id', authenticateAdmin, async (req, res) => {
  try {
    const { answer, keywords, category = 'Autre' } = req.body;
    
    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'La réponse est requise'
      });
    }

    const interaction = await ChatbotInteraction.findById(req.params.id);
    
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Question non trouvée'
      });
    }

    // Préparer les mots-clés
    let keywordsArray = keywords 
      ? keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k)
      : [];

    // Si aucun mot-clé fourni, extraire automatiquement des mots importants de la question
    if (keywordsArray.length === 0 && interaction.question) {
      const questionWords = interaction.question
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(/\s+/)
        .filter(word => {
          // Filtrer les mots vides, les mots trop courts, et les mots courants
          const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'pour', 'avec', 'sans', 'sur', 'dans', 'par', 'est', 'sont', 'a', 'as', 'avez', 'ont', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'ce', 'cette', 'ces', 'que', 'qui', 'quoi', 'comment', 'pourquoi', 'quand', 'où', 'combien', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'without', 'on', 'in', 'at', 'to', 'of', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'i', 'you', 'he', 'she', 'we', 'they', 'it', 'this', 'that', 'these', 'those', 'what', 'who', 'how', 'why', 'when', 'where', 'how', 'much', 'many'];
          return word.length > 3 && !stopWords.includes(word);
        })
        .slice(0, 5); // Prendre les 5 premiers mots pertinents
      
      keywordsArray = questionWords;
    }

    // Créer ou mettre à jour une réponse personnalisée réutilisable
    let chatbotResponse = null;
    try {
      // Chercher si une réponse similaire existe déjà
      const existingResponse = await ChatbotResponse.findOne({
        question: { $regex: new RegExp(interaction.question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        lang: interaction.lang
      });

      if (existingResponse) {
        // Mettre à jour la réponse existante
        existingResponse.answer = answer.trim();
        existingResponse.keywords = keywordsArray;
        existingResponse.category = category;
        existingResponse.updatedBy = req.admin._id;
        existingResponse.updatedAt = new Date();
        await existingResponse.save();
        chatbotResponse = existingResponse;
      } else {
        // Créer une nouvelle réponse personnalisée
        chatbotResponse = await ChatbotResponse.create({
          question: interaction.question.trim(),
          answer: answer.trim(),
          keywords: keywordsArray,
          category,
          lang: interaction.lang || 'fr',
          priority: 0,
          isActive: true,
          createdBy: req.admin._id
        });
      }
    } catch (err) {
      console.warn('[CHATBOT] Erreur lors de la création de la réponse personnalisée:', err.message);
      // Continuer même si la création de la réponse personnalisée échoue
    }

    // Mettre à jour l'interaction
    interaction.response = answer.trim();
    interaction.status = 'answered';
    interaction.answeredBy = req.admin._id;
    interaction.answeredAt = new Date();
    interaction.responseType = 'custom';
    interaction.customAnswer = {
      answer: answer.trim(),
      keywords: keywordsArray,
      category,
      createdAt: new Date(),
      createdBy: req.admin._id
    };

    await interaction.save();

    res.json({
      success: true,
      message: 'Réponse enregistrée avec succès. Elle sera automatiquement utilisée pour les questions similaires.',
      interaction,
      chatbotResponse: chatbotResponse ? {
        _id: chatbotResponse._id,
        question: chatbotResponse.question,
        answer: chatbotResponse.answer
      } : null
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /admin/chatbot/ignore/:id - Ignorer une question
router.post('/chatbot/ignore/:id', authenticateAdmin, async (req, res) => {
  try {
    const interaction = await ChatbotInteraction.findById(req.params.id);
    
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Question non trouvée'
      });
    }

    interaction.status = 'ignored';
    interaction.answeredBy = req.admin._id;
    interaction.answeredAt = new Date();

    await interaction.save();

    res.json({
      success: true,
      message: 'Question ignorée'
    });
  } catch (error) {
    console.error('Ignore question error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /admin/chatbot/feedback/:id - Enregistrer le feedback
router.post('/chatbot/feedback/:id', authenticateAdmin, async (req, res) => {
  try {
    const { feedback } = req.body;
    
    if (!['useful', 'useless'].includes(feedback)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback invalide'
      });
    }

    const interaction = await ChatbotInteraction.findById(req.params.id);
    
    if (!interaction) {
      return res.status(404).json({
        success: false,
        message: 'Interaction non trouvée'
      });
    }

    interaction.feedback = feedback;
    await interaction.save();

    res.json({
      success: true,
      message: 'Feedback enregistré'
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// ===== ROUTES GESTION RÉPONSES PERSONNALISÉES =====

// GET /admin/chatbot/responses - Liste des réponses personnalisées
router.get('/chatbot/responses', authenticateAdmin, async (req, res) => {
  try {
    const { category, lang, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (lang && lang !== 'all') query.lang = lang;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await ChatbotResponse.countDocuments(query);
    const responses = await ChatbotResponse.find(query)
      .sort({ priority: -1, usageCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();

    res.json({
      success: true,
      responses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /admin/chatbot/responses - Créer une nouvelle réponse
router.post('/chatbot/responses', authenticateAdmin, async (req, res) => {
  try {
    const { question, answer, keywords, category, lang, priority } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question et réponse sont requises'
      });
    }

    const response = await ChatbotResponse.create({
      question: question.trim(),
      answer: answer.trim(),
      keywords: keywords ? keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k) : [],
      category: category || 'Autre',
      lang: lang || 'fr',
      priority: priority || 0,
      createdBy: req.admin._id
    });

    await response.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Réponse créée avec succès',
      response
    });
  } catch (error) {
    console.error('Create response error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// PUT /admin/chatbot/responses/:id - Mettre à jour une réponse
router.put('/chatbot/responses/:id', authenticateAdmin, async (req, res) => {
  try {
    const { question, answer, keywords, category, lang, priority, isActive } = req.body;
    
    const response = await ChatbotResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Réponse non trouvée'
      });
    }

    if (question) response.question = question.trim();
    if (answer) response.answer = answer.trim();
    if (keywords) response.keywords = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    if (category) response.category = category;
    if (lang) response.lang = lang;
    if (priority !== undefined) response.priority = priority;
    if (isActive !== undefined) response.isActive = isActive;
    response.updatedBy = req.admin._id;
    response.updatedAt = new Date();

    await response.save();
    await response.populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Réponse mise à jour',
      response
    });
  } catch (error) {
    console.error('Update response error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// DELETE /admin/chatbot/responses/:id - Supprimer une réponse
router.delete('/chatbot/responses/:id', authenticateAdmin, async (req, res) => {
  try {
    const response = await ChatbotResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Réponse non trouvée'
      });
    }

    await response.deleteOne();

    res.json({
      success: true,
      message: 'Réponse supprimée'
    });
  } catch (error) {
    console.error('Delete response error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /admin/chatbot/responses/stats - Statistiques des réponses
router.get('/chatbot/responses/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalResponses = await ChatbotResponse.countDocuments();
    const activeResponses = await ChatbotResponse.countDocuments({ isActive: true });
    const totalUsage = await ChatbotResponse.aggregate([
      { $group: { _id: null, total: { $sum: '$usageCount' } } }
    ]);

    const byCategory = await ChatbotResponse.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, usage: { $sum: '$usageCount' } } },
      { $sort: { count: -1 } }
    ]);

    const byLang = await ChatbotResponse.aggregate([
      { $group: { _id: '$lang', count: { $sum: 1 } } }
    ]);

    const mostUsed = await ChatbotResponse.find()
      .sort({ usageCount: -1 })
      .limit(5)
      .select('question usageCount')
      .lean();

    res.json({
      success: true,
      stats: {
        total: totalResponses,
        active: activeResponses,
        totalUsage: totalUsage[0]?.total || 0,
        byCategory,
        byLang,
        mostUsed
      }
    });
  } catch (error) {
    console.error('Get responses stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

module.exports = router;
