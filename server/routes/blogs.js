const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');
const router = express.Router();

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

    const query = { status: 'published' };
    
    // Filtres
    if (type) query.type = type;
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    // Options de tri
    const sortOptions = {};
    if (sort === 'publishedAt') sortOptions.publishedAt = -1;
    if (sort === 'views') sortOptions.views = -1;
    if (sort === 'likes') sortOptions.likes = -1;
    if (sort === 'title') sortOptions.title = 1;

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Exclure le contenu complet pour la liste

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
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    // Incrémenter les vues
    await blog.incrementViews();

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération du blog' 
    });
  }
});

// POST /blogs/:id/like - Liker un blog
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog non trouvé' 
      });
    }

    await blog.incrementLikes();

    res.json({
      success: true,
      data: { likes: blog.likes }
    });

  } catch (error) {
    console.error('Like blog error:', error);
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
  body('title').trim().isLength({ min: 1 }).withMessage('Le titre est requis'),
  body('excerpt').trim().isLength({ min: 1 }).withMessage('Le résumé est requis'),
  body('content').trim().isLength({ min: 1 }).withMessage('Le contenu est requis'),
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

    // Générer le slug si pas fourni
    if (!blogData.slug && blogData.title) {
      blogData.slug = slugify(blogData.title, { 
        lower: true, 
        strict: true, 
        locale: 'fr' 
      });
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
  body('title').optional().trim().isLength({ min: 1 }),
  body('excerpt').optional().trim().isLength({ min: 1 }),
  body('content').optional().trim().isLength({ min: 1 }),
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

    // Générer le slug si le titre a changé et qu'aucun slug n'est fourni
    if (req.body.title && req.body.title !== blog.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title, { 
        lower: true, 
        strict: true, 
        locale: 'fr' 
      });
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.json({
      success: true,
      data: blog,
      message: 'Blog mis à jour avec succès'
    });

  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du blog' 
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

    res.json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        byType: blogsByType,
        byCategory: blogsByCategory,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0
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

module.exports = router;
