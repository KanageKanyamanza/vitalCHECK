const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

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

// User (client) JWT authentication
const authenticateClient = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password').populate('team');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Lazy expiration: read subscription from team (Phase A+) with fallback to user
    const teamSub = user.team?.subscription;
    const sub = teamSub || user.subscription;
    if (sub?.status === 'active' && sub?.endDate && sub.endDate < new Date()) {
      const expireUpdate = { 'subscription.status': 'expired', isPremium: false };
      await User.findByIdAndUpdate(user._id, expireUpdate);
      user.subscription.status = 'expired';
      user.isPremium = false;
      if (user.team) {
        const Team = require('../models/Team');
        await Team.findByIdAndUpdate(user.team._id, { 'subscription.status': 'expired' });
        user.team.subscription.status = 'expired';
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = {
  authenticateAdmin,
  checkPermission,
  authenticateClient,
};
