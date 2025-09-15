const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const { sendEmail } = require('../utils/emailService');
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

// Obtenir les notifications (nouveaux questionnaires)
router.get('/notifications', authenticateAdmin, async (req, res) => {
  try {
    // Récupérer les évaluations des dernières 24h
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentAssessments = await Assessment.find({
      completedAt: { $gte: last24Hours }
    })
    .populate('user', 'companyName email sector companySize')
    .sort({ completedAt: -1 })
    .limit(10);

    const notifications = recentAssessments.map(assessment => ({
      id: assessment._id,
      type: 'new_assessment',
      title: 'Nouvelle évaluation complétée',
      message: `${assessment.user.companyName} a complété son évaluation`,
      user: {
        id: assessment.user._id,
        name: assessment.user.companyName,
        email: assessment.user.email,
        sector: assessment.user.sector,
        companySize: assessment.user.companySize
      },
      assessment: {
        id: assessment._id,
        score: assessment.overallScore,
        status: assessment.overallStatus,
        completedAt: assessment.completedAt
      },
      createdAt: assessment.completedAt,
      read: false
    }));

    res.json({
      success: true,
      notifications,
      count: notifications.length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">UBB Enterprise Health Check</h2>
          <p>Bonjour ${user.companyName},</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Si vous souhaitez compléter ou reprendre votre évaluation, vous pouvez accéder à notre plateforme.</p>
          <p>Cordialement,<br>L'équipe UBB</p>
        </div>
      `
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
  body('userIds').isArray({ min: 1 }),
  body('subject').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userIds, subject, message } = req.body;
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
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">UBB Enterprise Health Check</h2>
            <p>Bonjour ${user.companyName},</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>Si vous souhaitez compléter ou reprendre votre évaluation, vous pouvez accéder à notre plateforme.</p>
            <p>Cordialement,<br>L'équipe UBB</p>
          </div>
        `
      };
      return sendEmail(emailData);
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `${users.length} emails de relance envoyés avec succès`
    });

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

module.exports = router;
