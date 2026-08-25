const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const router = express.Router();

// Connexion unifiée - détecte automatiquement le rôle
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    console.log('🔍 [UNIFIED LOGIN] Tentative de connexion pour:', email);

    // Essayer d'abord la connexion admin
    try {
      const admin = await Admin.findOne({ email });
      
      if (admin) {
        console.log('🛡️ [UNIFIED LOGIN] Admin trouvé, vérification du mot de passe...');
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (isPasswordValid) {
          const token = jwt.sign(
            { 
              adminId: admin._id, 
              email: admin.email,
              role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );

          console.log('✅ [UNIFIED LOGIN] Connexion admin réussie');
          
          return res.json({
            success: true,
            message: 'Connexion admin réussie',
            token,
            user: {
              id: admin._id,
              email: admin.email,
              name: admin.name,
              role: admin.role
            }
          });
        } else {
          console.log('❌ [UNIFIED LOGIN] Mot de passe admin incorrect');
        }
      }
    } catch (adminError) {
      console.log('⚠️ [UNIFIED LOGIN] Erreur connexion admin:', adminError.message);
    }

    // Essayer ensuite la connexion client
    try {
      const user = await User.findOne({ email }).select('+password');
      
      if (user) {
        console.log('👥 [UNIFIED LOGIN] Client trouvé:', {
          email: user.email,
          hasPassword: !!user.password,
          passwordLength: user.password?.length
        });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔍 [UNIFIED LOGIN] Vérification mot de passe:', isPasswordValid);
        
        if (isPasswordValid) {
          const token = jwt.sign(
            { 
              userId: user._id, 
              email: user.email,
              role: 'client'
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );

          console.log('✅ [UNIFIED LOGIN] Connexion client réussie');
          
          return res.json({
            success: true,
            message: 'Connexion client réussie',
            token,
            user: {
              id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              companyName: user.companyName,
              role: 'client'
            }
          });
        } else {
          console.log('❌ [UNIFIED LOGIN] Mot de passe client incorrect');
        }
      }
    } catch (clientError) {
      console.log('⚠️ [UNIFIED LOGIN] Erreur connexion client:', clientError.message);
    }

    // Si aucune connexion n'a réussi
    console.log('❌ [UNIFIED LOGIN] Aucune connexion réussie pour:', email);
    
    res.status(401).json({
      success: false,
      message: 'Identifiants incorrects'
    });

  } catch (error) {
    console.error('❌ [UNIFIED LOGIN] Erreur serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role === 'admin') {
      // Récupérer les données admin
      const admin = await Admin.findById(decoded.adminId).select('-password');

      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Admin non autorisé'
        });
      }

      return res.json({
        success: true,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      });
    } else if (decoded.role === 'client' || (!decoded.role && decoded.userId)) {
      // Tokens avec role:'client' (login normal) ou sans role (issus du diagnostic gratuit)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      return res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          sector: user.sector,
          companySize: user.companySize,
          subscription: user.subscription,
          isPremium: user.isPremium,
          role: 'client'
        }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Rôle non reconnu'
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

module.exports = router;
