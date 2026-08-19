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
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Lazy expiration: if subscription is active but endDate has passed, expire it now
    const sub = user.subscription;
    if (sub?.status === 'active' && sub?.endDate && sub.endDate < new Date()) {
      await User.findByIdAndUpdate(user._id, {
        'subscription.status': 'expired',
        isPremium: false,
      });
      user.subscription.status = 'expired';
      user.isPremium = false;
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
