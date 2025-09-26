const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');
const { 
  exportUsersToExcel, 
  exportAssessmentsToExcel, 
  exportStatsToExcel, 
  exportStatsToPDF,
  exportUsersToPDF,
  exportAssessmentsToPDF
} = require('../utils/exportUtils');
const { generateReminderEmailHTML } = require('../utils/reminderEmailTemplate');
const router = express.Router();

// Middleware d'authentification admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin non autorisé' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token invalide' 
    });
  }
};

// Middleware de vérification des permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.admin.role === 'super-admin' || req.admin.permissions[permission]) {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Permissions insuffisantes' 
      });
    }
  };
};

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
        permissions: admin.permissions
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

    await sendEmail(emailData);

    res.json({
      success: true,
      message: 'Email de relance envoyé avec succès'
    });

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
      const emailPromises = emails.map(emailData => {
        // Créer un objet user fictif pour le template
        const user = { companyName: emailData.to.split('@')[0] };
        const html = generateReminderEmailHTML(user, emailData.message, emailData.subject);
        
        return sendEmail({
          to: emailData.to,
          subject: emailData.subject,
          html: html
        });
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

      const emailPromises = users.map(user => {
        const emailData = {
          to: user.email,
          subject: subject,
          html: generateReminderEmailHTML(user, message, subject)
        };
        return sendEmail(emailData);
      });

      await Promise.all(emailPromises);

      res.json({
        success: true,
        message: `${users.length} emails de relance envoyés avec succès`
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

    let csv = 'Email,Nom de l\'entreprise,Secteur,Taille,Évaluations,Score moyen,Statut moyen,Date de création\n';
    
    users.forEach(user => {
      const assessments = user.assessments || [];
      const avgScore = assessments.length > 0 
        ? (assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length).toFixed(2)
        : 'N/A';
      const avgStatus = assessments.length > 0 
        ? assessments[0].overallStatus 
        : 'N/A';
      
      csv += `"${user.email}","${user.companyName}","${user.sector}","${user.companySize}","${assessments.length}","${avgScore}","${avgStatus}","${user.createdAt.toISOString()}"\n`;
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

    const resumeLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/resume/${draftAssessment.resumeToken}`;

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

          const resumeLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/resume/${assessment.resumeToken}`;
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

module.exports = router;
