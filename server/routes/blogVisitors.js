const express = require('express');
const router = express.Router();
const BlogVisitor = require('../models/BlogVisitor');
const Blog = require('../models/Blog');
const { authenticateAdmin } = require('../utils/auth');
const { getClientIP, getDeviceInfo, getLocationInfo } = require('../utils/visitorUtils');

// ===== ROUTES PUBLIQUES =====

// Vérifier si un visiteur existe par IP
router.get('/check', async (req, res) => {
  try {
    const ipAddress = getClientIP(req);
    const visitor = await BlogVisitor.findByIP(ipAddress);
    
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
router.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, email, country, blogId, blogTitle, blogSlug, scrollDepth = 0, timeOnPage = 0 } = req.body;
    
    console.log('📊 [BLOG VISITORS] Soumission formulaire avec données de tracking:', {
      firstName,
      lastName,
      email,
      country,
      blogId,
      blogTitle,
      blogSlug,
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
    
    // Incrémenter les vues du blog uniquement lors de la soumission du formulaire
    await blog.incrementViews();
    console.log(`📈 [BLOG VIEWS] Vue incrémentée pour le blog: ${blogTitle} (Total: ${blog.views + 1})`);
    
    // Vérifier si un visiteur existe déjà avec cette IP
    let visitor = await BlogVisitor.findByIP(ipAddress);
    let isNewVisitor = false;
    
    if (visitor) {
      // Visiteur existant - marquer comme visiteur de retour
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
      // Nouveau visiteur
      isNewVisitor = true;
      visitor = new BlogVisitor({
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
