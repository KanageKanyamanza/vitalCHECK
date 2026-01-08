const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const BlogVisitor = require('../models/BlogVisitor');
const Blog = require('../models/Blog');
const BlogView = require('../models/BlogView');
const { authenticateAdmin } = require('../utils/auth');
const { getClientIP, getDeviceInfo, getLocationInfo } = require('../utils/visitorUtils');

// ===== ROUTES PUBLIQUES =====

// Vérifier si un visiteur existe par visitorId (navigateur spécifique)
// Chaque navigateur a son propre visitorId, donc chaque navigateur est traité séparément
router.get('/check', async (req, res) => {
  try {
    // Récupérer le visitorId depuis les query params
    const visitorId = req.query.visitorId;
    
    if (!visitorId) {
      return res.json({ exists: false });
    }
    
    const visitor = await BlogVisitor.findByVisitorId(visitorId);
    
    if (visitor) {
      return res.json({
        exists: true,
        visitor: {
          firstName: visitor.firstName,
          lastName: visitor.lastName,
          email: visitor.email,
          country: visitor.country,
          isReturningVisitor: visitor.isReturningVisitor,
          totalBlogsVisited: visitor.totalBlogsVisited,
          lastVisitAt: visitor.lastVisitAt
        }
      });
    }
    
    res.json({ exists: false });
  } catch (error) {
    console.error('Erreur lors de la vérification du visiteur:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification du visiteur' 
    });
  }
});

// Soumettre le formulaire de visiteur
// Chaque navigateur (visitorId) crée son propre BlogVisitor
// Si on change de navigateur, un nouveau BlogVisitor est créé
router.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, email, country, blogId, blogTitle, blogSlug, visitorId, scrollDepth = 0, timeOnPage = 0 } = req.body;
    
    // Validation: visitorId est requis pour identifier le navigateur
    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'visitorId est requis pour identifier le navigateur'
      });
    }
    
    console.log('📊 [BLOG VISITORS] Soumission formulaire avec données de tracking:', {
      firstName,
      lastName,
      email,
      country,
      blogId,
      blogTitle,
      blogSlug,
      visitorId,
      scrollDepth,
      timeOnPage
    });
    
    const ipAddress = getClientIP(req);
    const userAgent = req.get('User-Agent');
    const device = getDeviceInfo(userAgent);
    const sessionId = req.sessionID || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Vérifier si le blog existe
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog non trouvé'
      });
    }
    
    // Récupérer l'utilisateur si connecté (optionnel)
    let userId = null;
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
          userId = decoded.userId;
        }
      }
    } catch (error) {
      // Token invalide ou absent, continuer sans userId
    }
    
    // Vérifier si ce userId ou visitorId a déjà compté une vue pour ce blog
    // On utilise UNIQUEMENT userId ou visitorId, JAMAIS l'IP
    let existingView = null;
    let query = { blog: blogId };
    
    if (userId) {
      // Utilisateur connecté: vérifier par userId uniquement
      query.userId = userId;
      existingView = await BlogView.findOne(query);
    } else if (visitorId) {
      // Utilisateur non connecté: vérifier par visitorId uniquement
      query.visitorId = visitorId;
      existingView = await BlogView.findOne(query);
    }
    
    let isNewView = false;
    
    if (!existingView) {
      // Ce navigateur/utilisateur n'a pas encore compté de vue pour ce blog
      try {
        // Créer l'enregistrement de vue
        const blogView = new BlogView({
          blog: blogId,
          userId: userId || null,
          visitorId: visitorId || null,
          ipAddress: ipAddress || null // Stocké pour analytics uniquement
        });
        
        await blogView.save();
        
        // Incrémenter les vues du blog
        await blog.incrementViews();
        isNewView = true;
        console.log(`📈 [BLOG VIEWS] Vue incrémentée pour le blog: ${blogTitle} (Total: ${blog.views + 1}) - ${userId ? `userId: ${userId}` : `visitorId: ${visitorId}`}`);
      } catch (saveError) {
        // Gérer les erreurs de duplication (index unique MongoDB)
        // Code 11000 = duplicate key error
        if (saveError.code === 11000) {
          // Vérifier à nouveau si la vue existe maintenant (requête simultanée)
          let checkQuery = { blog: blogId };
          if (userId) {
            checkQuery.userId = userId;
          } else if (visitorId) {
            checkQuery.visitorId = visitorId;
          }
          
          existingView = await BlogView.findOne(checkQuery);
          
          if (existingView) {
            // La vue existe maintenant (créée par une requête simultanée)
            console.log(`⚠️ [BLOG VIEWS] Vue déjà comptée - ${userId ? `userId: ${userId}` : `visitorId: ${visitorId}`}`);
          } else {
            // Erreur de duplication mais la vue n'existe pas (cas rare)
            console.error('❌ [BLOG VIEWS] Erreur lors de l\'enregistrement de la vue:', saveError);
          }
        } else {
          // Autre erreur lors de la sauvegarde
          throw saveError;
        }
      }
    } else {
      // Ce navigateur/utilisateur a déjà compté une vue pour ce blog
      console.log(`ℹ️ [BLOG VIEWS] Vue déjà comptée - ${userId ? `userId: ${userId}` : `visitorId: ${visitorId}`} - Blog: ${blogTitle}`);
    }
    
    // Vérifier si un visiteur existe déjà avec ce visitorId (navigateur spécifique)
    // Chaque navigateur a son propre visitorId, donc chaque navigateur crée un nouveau BlogVisitor
    let visitor = await BlogVisitor.findByVisitorId(visitorId);
    let isNewVisitor = false;
    
    if (visitor) {
      // Visiteur existant pour ce navigateur - marquer comme visiteur de retour
      visitor.isReturningVisitor = true;
      visitor.lastVisitAt = new Date();
      
      // Ajouter cette visite de blog avec les données de tracking
      await visitor.addBlogVisit(blogId, blogTitle, blogSlug, scrollDepth, timeOnPage);
      
      // Mettre à jour les informations si elles ont changé
      if (visitor.firstName !== firstName || visitor.lastName !== lastName || 
          visitor.email !== email || visitor.country !== country) {
        visitor.firstName = firstName;
        visitor.lastName = lastName;
        visitor.email = email;
        visitor.country = country;
        await visitor.save();
      }
    } else {
      // Nouveau visiteur pour ce navigateur
      // Chaque navigateur crée son propre BlogVisitor
      isNewVisitor = true;
      visitor = new BlogVisitor({
        visitorId, // Identifiant unique du navigateur
        firstName,
        lastName,
        email,
        country,
        ipAddress,
        userAgent,
        device,
        sessionId,
        blogsVisited: [{
          blog: blogId,
          blogTitle,
          blogSlug,
          visitedAt: new Date(),
          scrollDepth: scrollDepth,
          timeOnPage: timeOnPage,
          isFormSubmitted: true
        }],
        totalBlogsVisited: 1,
        totalTimeSpent: timeOnPage,
        averageScrollDepth: scrollDepth,
        isReturningVisitor: false,
        lastVisitAt: new Date()
      });
      
      await visitor.save();
    }
    
    res.json({
      success: true,
      isNewVisitor,
      visitor: {
        firstName: visitor.firstName,
        lastName: visitor.lastName,
        email: visitor.email,
        country: visitor.country,
        isReturningVisitor: visitor.isReturningVisitor,
        totalBlogsVisited: visitor.totalBlogsVisited,
        lastVisitAt: visitor.lastVisitAt
      },
      message: isNewVisitor ? 'Visiteur créé avec succès' : 'Visiteur mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission du formulaire'
    });
  }
});


module.exports = router;
