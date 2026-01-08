const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const BlogVisit = require('../models/BlogVisit');
const BlogLike = require('../models/BlogLike');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { analyzeDevice, extractReferrerDomain, extractUTMParameters, generateSessionId, isBounce } = require('../utils/deviceAnalyzer');
const { getClientIP } = require('../utils/visitorUtils');
const axios = require('axios');
const fetch = require('node-fetch');
const router = express.Router();

// Middleware de debug pour toutes les requêtes (désactivé en production)
// router.use((req, res, next) => {
//   console.log('📝 [BLOGS ROUTER] Requête reçue:', {
//     method: req.method,
//     url: req.url,
//     originalUrl: req.originalUrl,
//     path: req.path,
//     baseUrl: req.baseUrl
//   });
//   next();
// });

// Fonction utilitaire pour détecter la langue
function detectLanguage(req) {
  // 1. Vérifier le paramètre de langue dans l'URL
  if (req.query.lang && ['fr', 'en'].includes(req.query.lang)) {
    return req.query.lang;
  }
  
  // 2. Vérifier le header Accept-Language
  const acceptLanguage = req.get('Accept-Language');
  if (acceptLanguage) {
    if (acceptLanguage.includes('en')) return 'en';
    if (acceptLanguage.includes('fr')) return 'fr';
  }
  
  // 3. Fallback par défaut
  return 'fr';
}

// Fonction pour obtenir la géolocalisation par IP
async function getLocationFromIP(ipAddress) {
  try {
    // Vérifier si l'IP est valide
    if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1') {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local'
      };
    }

    // Vérifier les plages d'IP privées
    const isPrivateIP = (ip) => {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4) return false;
      
      // 192.168.x.x
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 10.x.x.x
      if (parts[0] === 10) return true;
      // 172.16.x.x - 172.31.x.x
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      
      return false;
    };

    if (isPrivateIP(ipAddress)) {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local'
      };
    }

    
    // Utiliser ipapi.co (gratuit, 1000 requêtes/jour)
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`, {
      timeout: 60000, // 60 secondes (1 minute)
      headers: {
        'User-Agent': 'vitalCHECK-Health-Check/1.0'
      }
    });

    const data = response.data;

    // Vérifier si la réponse est valide
    if (data.error) {
      return {
        country: 'Inconnu',
        region: 'Inconnu',
        city: 'Inconnu'
      };
    }

    return {
      country: data.country_name || 'Inconnu',
      region: data.region || 'Inconnu', 
      city: data.city || 'Inconnu'
    };
  } catch (error) {
    console.error('❌ [GEOLOCATION] Erreur lors de la géolocalisation:', {
      ip: ipAddress,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // En cas d'erreur, essayer une API de fallback
    try {
      const fallbackResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
        timeout: 60000 // 60 secondes (1 minute)
      });
      
      const fallbackData = fallbackResponse.data;
      if (fallbackData.status === 'success') {
        console.log('🌍 [GEOLOCATION] Fallback réussi:', {
          country: fallbackData.country,
          region: fallbackData.regionName,
          city: fallbackData.city
        });
        
        return {
          country: fallbackData.country || 'Inconnu',
          region: fallbackData.regionName || 'Inconnu',
          city: fallbackData.city || 'Inconnu'
        };
      }
    } catch (fallbackError) {
      console.error('❌ [GEOLOCATION] Fallback échoué:', fallbackError.message);
    }
    
    return {
      country: 'Inconnu',
      region: 'Inconnu',
      city: 'Inconnu'
    };
  }
}

// Middleware d'authentification admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id || decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Token invalide' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// ===== ROUTES PUBLIQUES =====

// POST /translate - Route de traduction (DOIT être avant /:slug pour éviter les conflits)
router.post('/translate', authenticateAdmin, async (req, res) => {
  try {
    console.log('🌐 [TRANSLATE] Requête de traduction reçue:', {
      method: req.method,
      url: req.url,
      body: req.body
    });
    
    const { text, fromLang = 'fr', toLang = 'en' } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Texte à traduire requis'
      });
    }

    // Essayer d'abord MyMemory
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
      
      const response = await fetch(myMemoryUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.responseData && data.responseData.translatedText) {
          return res.json({
            success: true,
            translatedText: data.responseData.translatedText
          });
        }
      }
    } catch (myMemoryError) {
      }

    // Fallback vers LibreTranslate
    try {
      const libreTranslateUrl = 'https://libretranslate.de/translate';
      
      const response = await fetch(libreTranslateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          q: text,
          source: fromLang === 'auto' ? 'fr' : fromLang,
          target: toLang,
          format: 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.translatedText) {
          return res.json({
            success: true,
            translatedText: data.translatedText
          });
        }
      }
    } catch (libreError) {
      }

    // Si tout échoue, retourner le texte original
    return res.json({
      success: true,
      translatedText: text
    });

  } catch (error) {
    console.error('❌ [TRANSLATE] Erreur de traduction serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la traduction',
      error: error.message
    });
  }
});

// GET /blogs - Récupérer tous les blogs publiés
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category, 
      tag, 
      search,
      sort = 'publishedAt' 
    } = req.query;

    const language = detectLanguage(req);
    const query = { status: 'published' };
    
    // Filtres
    if (type) query.type = type;
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      // Recherche dans la langue appropriée
      if (language === 'en') {
        query.$text = { $search: search };
      } else {
        query.$text = { $search: search };
      }
    }

    // Options de tri
    const sortOptions = {};
    if (sort === 'publishedAt') sortOptions.publishedAt = -1;
    if (sort === 'views') sortOptions.views = -1;
    if (sort === 'likes') sortOptions.likes = -1;
    if (sort === 'title') {
      sortOptions[`title.${language}`] = 1;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    // Transformer les données pour inclure le contenu localisé
    const localizedBlogs = blogs.map(blog => {
      const blogObj = blog.toObject();
      const localizedContent = blog.getLocalizedContent(language);
      
      return {
        ...blogObj,
        title: localizedContent.title,
        slug: localizedContent.slug,
        excerpt: localizedContent.excerpt,
        metaTitle: localizedContent.metaTitle,
        metaDescription: localizedContent.metaDescription,
        // Préserver featuredImage et images
        featuredImage: blogObj.featuredImage,
        images: blogObj.images,
        // Exclure le contenu complet pour la liste
        content: undefined
      };
    });

    res.json({
      success: true,
      data: localizedBlogs,
      language,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des blogs' 
    });
  }
});

// GET /blogs/:slug - Récupérer un blog par son slug
router.get('/:slug', async (req, res) => {
  try {
    const language = detectLanguage(req);
    
    // Chercher le blog par slug dans la langue appropriée
    const blog = await Blog.findOne({ 
      [`slug.${language}`]: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: language === 'en' ? 'Blog not found' : 'Blog non trouvé' 
      });
    }

    // Les vues ne sont plus incrémentées automatiquement
    // Elles le seront uniquement lors de la soumission du formulaire de visiteur

    // Enregistrer la visite détaillée
    try {
      const userAgent = req.get('User-Agent') || '';
      const referrer = req.get('Referer') || '';
      
      // Récupérer l'IP réelle en tenant compte des proxies
      const getRealIP = (req) => {
        // Vérifier les headers de proxy en premier
        const forwardedFor = req.get('X-Forwarded-For');
        if (forwardedFor) {
          // X-Forwarded-For peut contenir plusieurs IPs séparées par des virgules
          // La première est généralement l'IP du client
          return forwardedFor.split(',')[0].trim();
        }
        
        const realIP = req.get('X-Real-IP');
        if (realIP) {
          return realIP;
        }
        
        // Fallback sur les méthodes standard
        return req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      };
      
      const ipAddress = getRealIP(req);
      
      console.log('🔍 [TRACKING] Données de base:', {
        userAgent: userAgent.substring(0, 50) + '...',
        referrer: referrer.substring(0, 50) + '...',
        ipAddress,
        blogId: blog._id,
        headers: {
          'X-Forwarded-For': req.get('X-Forwarded-For'),
          'X-Real-IP': req.get('X-Real-IP'),
          'CF-Connecting-IP': req.get('CF-Connecting-IP')
        }
      });
      
      // Générer un ID de session si pas présent
      let sessionId = null;
      
      // Vérifier les cookies de manière plus robuste
      if (req.cookies && typeof req.cookies === 'object') {
        sessionId = req.cookies.sessionId;
      }
      
      if (!sessionId) {
        sessionId = generateSessionId();
        res.cookie('sessionId', sessionId, { 
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      // Analyser l'appareil
      const deviceInfo = analyzeDevice(userAgent);
      // Extraire les informations du référent
      const referrerDomain = extractReferrerDomain(referrer);
      // Extraire les paramètres UTM
      const utmParams = extractUTMParameters(req.originalUrl);
      // Obtenir la géolocalisation
      const location = await getLocationFromIP(ipAddress);
      // Créer l'enregistrement de visite
      const visitData = {
        blog: blog._id,
        user: req.user?._id || null,
        sessionId,
        ipAddress,
        country: location.country,
        region: location.region,
        city: location.city,
        userAgent,
        device: deviceInfo,
        referrer,
        referrerDomain,
        ...utmParams,
        pageTitle: blog.title,
        pageUrl: req.originalUrl
      };
      
      console.log('🔍 [TRACKING] Données de visite à sauvegarder:', {
        blog: visitData.blog,
        sessionId: visitData.sessionId,
        deviceType: visitData.device.type,
        referrerDomain: visitData.referrerDomain
      });
      
      const visit = new BlogVisit(visitData);
      const savedVisit = await visit.save();
      
      console.log('✅ [TRACKING] Visite sauvegardée avec succès:', {
        visitId: savedVisit._id,
        blogTitle: blog.title,
        sessionId: savedVisit.sessionId
      });
      
      // Ajouter l'ID de visite à la réponse pour le tracking côté client
      const blogObj = blog.toObject();
      const localizedContent = blog.getLocalizedContent(language);
      
      res.json({
        success: true,
        data: {
          ...blogObj,
          title: localizedContent.title,
          slug: localizedContent.slug,
          excerpt: localizedContent.excerpt,
          content: localizedContent.content,
          metaTitle: localizedContent.metaTitle,
          metaDescription: localizedContent.metaDescription,
          // Préserver featuredImage et images
          featuredImage: blogObj.featuredImage,
          images: blogObj.images
        },
        language,
        visitId: visit._id
      });
      
    } catch (trackingError) {
      console.error('❌ [TRACKING] Erreur lors du tracking:', trackingError);
      console.error('❌ [TRACKING] Stack trace:', trackingError.stack);
      // Ne pas faire échouer la requête si le tracking échoue
      const blogObj = blog.toObject();
      const localizedContent = blog.getLocalizedContent(language);
      
      res.json({
        success: true,
        data: {
          ...blogObj,
          title: localizedContent.title,
          slug: localizedContent.slug,
          excerpt: localizedContent.excerpt,
          content: localizedContent.content,
          metaTitle: localizedContent.metaTitle,
          metaDescription: localizedContent.metaDescription,
          // Préserver featuredImage et images
          featuredImage: blogObj.featuredImage,
          images: blogObj.images
        },
        language
      });
    }

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération du blog' 
    });
  }
});

// GET /blogs/:id/like/status - Vérifier si l'utilisateur a déjà liké
// Comportement: Chaque navigateur (visitorId) est traité indépendamment
router.get('/:id/like/status', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    // Récupérer l'utilisateur si connecté
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

    // Récupérer le visitorId depuis les query params (GET request)
    const visitorId = req.query.visitorId;

    // Vérifier si l'utilisateur a déjà liké
    // Si l'utilisateur est connecté ET qu'un visitorId est fourni, vérifier les deux
    // Cela permet de détecter si un visiteur a liké avant de se connecter
    let hasLiked = false;
    
    if (userId) {
      // Utilisateur connecté: vérifier d'abord par userId
      let existingLike = await BlogLike.findOne({ blog: req.params.id, userId });
      
      // Si pas de like trouvé par userId ET qu'un visitorId est fourni, vérifier aussi par visitorId
      // Cela permet de détecter si l'utilisateur a liké avant de se connecter
      if (!existingLike && visitorId) {
        existingLike = await BlogLike.findOne({ blog: req.params.id, visitorId });
        
        // Si un like existe avec le visitorId, le migrer vers le userId
        if (existingLike) {
          existingLike.userId = userId;
          // Garder le visitorId pour l'historique (les index sparse permettent cela)
          await existingLike.save();
        }
      }
      
      hasLiked = !!existingLike;
    } else if (visitorId) {
      // Utilisateur non connecté: vérifier par visitorId (navigateur spécifique)
      // Chaque navigateur a son propre visitorId, donc chaque navigateur peut liker indépendamment
      const existingLike = await BlogLike.findOne({ blog: req.params.id, visitorId });
      hasLiked = !!existingLike;
    }
    // Si ni userId ni visitorId, hasLiked reste false

    res.json({
      success: true,
      data: { hasLiked }
    });

  } catch (error) {
    console.error('Check like status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification du like' 
    });
  }
});

// POST /blogs/:id/like - Toggle like/unlike d'un blog
// Comportement:
// - Chaque navigateur (visitorId) est traité indépendamment
// - Un navigateur peut liker une seule fois par article
// - Un navigateur peut retirer son like (unlike)
// - Les likes d'un navigateur n'affectent pas les autres navigateurs
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    // Récupérer l'utilisateur si connecté
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

    // Récupérer le visitorId depuis le body
    const visitorId = req.body.visitorId;
    
    // Validation: pour les utilisateurs non connectés, visitorId est requis
    if (!userId && !visitorId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifiant visiteur requis pour les utilisateurs non connectés' 
      });
    }
    
    // Récupérer l'adresse IP du client (pour tracking/analytics, pas pour la contrainte)
    const ipAddress = getClientIP(req);

    // Vérifier si l'utilisateur a déjà liké
    let existingLike = null;
    if (userId) {
      // Utilisateur connecté: vérifier d'abord par userId
      existingLike = await BlogLike.findOne({ blog: req.params.id, userId });
      
      // Si pas de like trouvé par userId ET qu'un visitorId est fourni, vérifier aussi par visitorId
      // Cela permet de détecter si l'utilisateur a liké avant de se connecter
      if (!existingLike && visitorId) {
        existingLike = await BlogLike.findOne({ blog: req.params.id, visitorId });
        
        // Si un like existe avec le visitorId, le migrer vers le userId
        if (existingLike) {
          existingLike.userId = userId;
          // Garder le visitorId pour l'historique (les index sparse permettent cela)
          await existingLike.save();
        }
      }
    } else if (visitorId) {
      // Utilisateur non connecté: vérifier par visitorId (navigateur spécifique)
      // Chaque navigateur a son propre visitorId, donc chaque navigateur peut liker indépendamment
      existingLike = await BlogLike.findOne({ blog: req.params.id, visitorId });
    }

    if (existingLike) {
      // L'utilisateur a déjà liké, on retire le like (unlike)
      await BlogLike.findByIdAndDelete(existingLike._id);
      
      // Décrémenter le compteur de likes
      await blog.decrementLikes();
      
      // Récupérer le blog mis à jour
      const updatedBlog = await Blog.findById(req.params.id);

      res.json({
        success: true,
        data: { 
          likes: updatedBlog.likes,
          hasLiked: false
        }
      });
    } else {
      // L'utilisateur n'a pas encore liké, on ajoute le like
      const blogLike = new BlogLike({
        blog: req.params.id,
        userId: userId || null,
        visitorId: visitorId || null,
        ipAddress: ipAddress || null
      });

      await blogLike.save();

      // Incrémenter le compteur de likes
      await blog.incrementLikes();

      // Récupérer le blog mis à jour
      const updatedBlog = await Blog.findById(req.params.id);

      res.json({
        success: true,
        data: { 
          likes: updatedBlog.likes,
          hasLiked: true
        }
      });
    }

  } catch (error) {
    console.error('Like blog error:', error);
    
    // Gérer les erreurs de duplication (index unique)
    // Cela peut arriver en cas de requête simultanée
    if (error.code === 11000) {
      // Vérifier à nouveau l'état actuel
      try {
        const blog = await Blog.findById(req.params.id);
        let existingLike = null;
        
        if (req.body.visitorId) {
          existingLike = await BlogLike.findOne({ 
            blog: req.params.id, 
            visitorId: req.body.visitorId 
          });
        }
        
        if (existingLike) {
          // Le like existe déjà, retourner l'état actuel
          return res.json({
            success: true,
            data: { 
              likes: blog.likes,
              hasLiked: true
            }
          });
        }
      } catch (checkError) {
        // Ignorer l'erreur de vérification
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'Vous avez déjà aimé cet article' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du like' 
    });
  }
});

// ===== ROUTES ADMIN =====

// GET /admin/blogs - Récupérer tous les blogs (admin)
router.get('/admin/blogs', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      type, 
      category 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des blogs' 
    });
  }
});

// GET /admin/blogs/:id - Récupérer un blog par ID (admin)
router.get('/admin/blogs/:id', authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get admin blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération du blog' 
    });
  }
});

// POST /admin/blogs - Créer un nouveau blog
router.post('/admin/blogs', authenticateAdmin, [
  // Validation flexible pour supporter la traduction automatique
  body('title').custom((value) => {
    if (!value || typeof value !== 'object') {
      throw new Error('Le titre est requis');
    }
    if (!value.fr?.trim() && !value.en?.trim()) {
      throw new Error('Au moins un titre (français ou anglais) est requis');
    }
    return true;
  }),
  body('excerpt').custom((value) => {
    if (!value || typeof value !== 'object') {
      return true; // Excerpt est optionnel
    }
    return true;
  }),
  body('content').custom((value) => {
    if (!value || typeof value !== 'object') {
      throw new Error('Le contenu est requis');
    }
    if (!value.fr?.trim() && !value.en?.trim()) {
      throw new Error('Au moins un contenu (français ou anglais) est requis');
    }
    return true;
  }),
  body('type').isIn(['article', 'etude-cas', 'tutoriel', 'actualite', 'temoignage']).withMessage('Type invalide'),
  body('category').isIn(['strategie', 'technologie', 'finance', 'ressources-humaines', 'marketing', 'operations', 'gouvernance']).withMessage('Catégorie invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blogData = {
      ...req.body,
      author: req.admin._id
    };

    // Générer les slugs si pas fournis - seulement pour les langues remplies
    if (!blogData.slug) {
      blogData.slug = {};
    }
    
    // Générer le slug français si le titre français existe
    if (!blogData.slug.fr && blogData.title?.fr?.trim()) {
      blogData.slug.fr = blogData.title.fr
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
    
    // Générer le slug anglais si le titre anglais existe
    if (!blogData.slug.en && blogData.title?.en?.trim()) {
      blogData.slug.en = blogData.title.en
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog créé avec succès'
    });

  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création du blog' 
    });
  }
});

// PUT /admin/blogs/:id - Mettre à jour un blog
router.put('/admin/blogs/:id', authenticateAdmin, [
  // Validation flexible pour supporter la traduction automatique
  body('title').optional().custom((value) => {
    if (value && typeof value === 'object') {
      if (!value.fr?.trim() && !value.en?.trim()) {
        throw new Error('Au moins un titre (français ou anglais) est requis');
      }
    }
    return true;
  }),
  body('excerpt').optional(),
  body('content').optional().custom((value) => {
    if (value && typeof value === 'object') {
      if (!value.fr?.trim() && !value.en?.trim()) {
        throw new Error('Au moins un contenu (français ou anglais) est requis');
      }
    }
    return true;
  }),
  body('type').optional().isIn(['article', 'etude-cas', 'tutoriel', 'actualite', 'temoignage']),
  body('category').optional().isIn(['strategie', 'technologie', 'finance', 'ressources-humaines', 'marketing', 'operations', 'gouvernance'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    // Vérifier que l'admin est l'auteur ou a les permissions
    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à modifier ce blog' 
      });
    }

    // Préparer les données de mise à jour
    const updateData = {};
    
    // Fonction pour nettoyer les valeurs vides (ne pas envoyer de chaînes vides)
    const cleanValue = (value) => {
      if (typeof value === 'string' && value.trim() === '') {
        return undefined; // Ne pas inclure les chaînes vides
      }
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Pour les objets bilingues (metaTitle, metaDescription, title, etc.)
        if (value.hasOwnProperty('fr') || value.hasOwnProperty('en')) {
          const cleaned = {};
          if (value.fr !== undefined && value.fr !== null && String(value.fr).trim() !== '') {
            cleaned.fr = String(value.fr).trim();
          }
          if (value.en !== undefined && value.en !== null && String(value.en).trim() !== '') {
            cleaned.en = String(value.en).trim();
          }
          return Object.keys(cleaned).length > 0 ? cleaned : undefined;
        }
        // Pour les autres objets (featuredImage, caseStudy, etc.), les garder tels quels
        return value;
      }
      return value;
    };

    // Copier uniquement les champs fournis et non vides
    const fieldsToUpdate = [
      'title', 'slug', 'excerpt', 'content', 'type', 'category', 
      'tags', 'status', 'featuredImage', 'images', 'caseStudy', 
      'tutorial', 'testimonial', 'metaTitle', 'metaDescription'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        // Traitement spécial pour featuredImage
        if (field === 'featuredImage') {
          const featuredImage = req.body.featuredImage;
          // Si featuredImage est un objet avec une URL vide, ne pas l'inclure
          if (featuredImage && typeof featuredImage === 'object' && (!featuredImage.url || featuredImage.url.trim() === '')) {
            // Ne pas inclure featuredImage si l'URL est vide
            return;
          }
          // Sinon, inclure featuredImage tel quel
          if (featuredImage && typeof featuredImage === 'object') {
            updateData[field] = featuredImage;
          }
          return;
        }
        
        const cleaned = cleanValue(req.body[field]);
        if (cleaned !== undefined) {
          updateData[field] = cleaned;
        }
      }
    });

    // Générer les slugs si les titres ont changé
    if (updateData.title) {
      if (!updateData.slug) {
        updateData.slug = blog.slug || {};
      }
      
      if (updateData.title.fr && updateData.title.fr !== blog.title?.fr && !updateData.slug.fr) {
        updateData.slug.fr = updateData.title.fr
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
      
      if (updateData.title.en && updateData.title.en !== blog.title?.en && !updateData.slug.en) {
        updateData.slug.en = updateData.title.en
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
    }

    // Gérer publishedAt si le statut passe à published
    if (updateData.status === 'published' && blog.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    // Utiliser findByIdAndUpdate avec $set pour ne pas écraser les champs non fournis
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé après mise à jour' 
      });
    }

    res.json({
      success: true,
      data: updatedBlog,
      message: 'Blog mis à jour avec succès'
    });

  } catch (error) {
    console.error('Update blog error:', error);
    
    // Logger l'erreur de validation complète
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({ 
        success: false, 
        message: 'Erreur de validation',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du blog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /admin/blogs/:id - Supprimer un blog
router.delete('/admin/blogs/:id', authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    // Vérifier que l'admin est l'auteur ou a les permissions
    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à supprimer ce blog' 
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la suppression du blog' 
    });
  }
});

// POST /blogs/track - Mettre à jour le tracking d'une visite
router.post('/track', async (req, res) => {
  try {
    const { visitId, timeOnPage, scrollDepth, action } = req.body;
    
    console.log('🔄 [TRACKING UPDATE] Mise à jour du tracking:', {
      visitId,
      timeOnPage,
      scrollDepth,
      action
    });
    
    if (!visitId) {
      console.log('❌ [TRACKING UPDATE] ID de visite manquant');
      return res.status(400).json({
        success: false,
        message: 'ID de visite requis'
      });
    }

    const visit = await BlogVisit.findById(visitId);
    if (!visit) {
      console.log('❌ [TRACKING UPDATE] Visite non trouvée:', visitId);
      return res.status(404).json({
        success: false,
        message: 'Visite non trouvée'
      });
    }

    console.log('✅ [TRACKING UPDATE] Visite trouvée:', {
      visitId: visit._id,
      blogId: visit.blog,
      sessionId: visit.sessionId
    });

    // Mettre à jour les métriques
    if (timeOnPage !== undefined) {
      visit.timeOnPage = timeOnPage;
      }
    
    if (scrollDepth !== undefined) {
      visit.scrollDepth = scrollDepth;
      }

    // Marquer la visite selon l'action
    if (action === 'leave') {
      await visit.markAsCompleted();
    } else if (action === 'bounce') {
      await visit.markAsBounced();
    } else {
      await visit.save();
    }


    res.json({
      success: true,
      message: 'Tracking mis à jour'
    });

  } catch (error) {
    console.error('❌ [TRACKING UPDATE] Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du tracking'
    });
  }
});

// GET /admin/stats - Statistiques des blogs
router.get('/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    
    const blogsByType = await Blog.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const blogsByCategory = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    
    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
    ]);

    console.log('📊 [ADMIN STATS] Vues et likes:', {
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0
    });

    // Statistiques de tracking détaillées
    const totalVisits = await BlogVisit.countDocuments();
    const uniqueVisitors = await BlogVisit.distinct('sessionId').length;
    
    console.log('📊 [ADMIN STATS] Tracking:', {
      totalVisits,
      uniqueVisitors
    });
    
    const deviceStats = await BlogVisit.aggregate([
      {
        $group: {
          _id: '$device.type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const countryStats = await BlogVisit.aggregate([
      { $match: { country: { $ne: null } } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const referrerStats = await BlogVisit.aggregate([
      { $match: { referrerDomain: { $ne: null } } },
      {
        $group: {
          _id: '$referrerDomain',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        byType: blogsByType,
        byCategory: blogsByCategory,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        tracking: {
          totalVisits,
          uniqueVisitors,
          deviceBreakdown: deviceStats,
          topCountries: countryStats,
          topReferrers: referrerStats
        }
      }
    });

  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
});

// GET /admin/blogs/:id/visits - Statistiques détaillées d'un blog
router.get('/admin/blogs/:id/visits', authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog non trouvé'
      });
    }

    const visitStats = await blog.getVisitStats();
    
    // Visites récentes
    const recentVisits = await BlogVisit.find({ blog: blog._id })
      .sort({ visitedAt: -1 })
      .limit(50)
      .select('sessionId ipAddress country city device userAgent visitedAt timeOnPage scrollDepth isBounce referrerDomain utmSource utmMedium utmCampaign');

    res.json({
      success: true,
      data: {
        blog: {
          _id: blog._id,
          title: blog.title,
          slug: blog.slug
        },
        stats: visitStats,
        recentVisits
      }
    });

  } catch (error) {
    console.error('Get blog visits error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des visites'
    });
  }
});

// GET /admin/visits - Toutes les visites (admin)
router.get('/admin/visits', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      blogId,
      country,
      deviceType,
      dateFrom,
      dateTo
    } = req.query;

    const query = {};
    if (blogId) query.blog = blogId;
    if (country) query.country = country;
    if (deviceType) query['device.type'] = deviceType;
    
    if (dateFrom || dateTo) {
      query.visitedAt = {};
      if (dateFrom) query.visitedAt.$gte = new Date(dateFrom);
      if (dateTo) query.visitedAt.$lte = new Date(dateTo);
    }

    const visits = await BlogVisit.find(query)
      .populate('blog', 'title slug')
      .populate('user', 'name email companyName')
      .sort({ visitedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BlogVisit.countDocuments(query);

    res.json({
      success: true,
      data: visits,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get visits error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des visites'
    });
  }
});

module.exports = router;
