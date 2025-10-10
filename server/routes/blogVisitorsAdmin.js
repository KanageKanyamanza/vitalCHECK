const express = require('express');
const router = express.Router();
const BlogVisitor = require('../models/BlogVisitor');
const Blog = require('../models/Blog');
const { authenticateAdmin } = require('../utils/auth');

// ===== ROUTES ADMIN POUR LES VISITEURS =====

// Récupérer les statistiques des visiteurs (admin) - DOIT être AVANT /visitors/:id
router.get('/visitors/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await BlogVisitor.getGlobalStats();
    
    // Statistiques supplémentaires
    const totalVisitors = await BlogVisitor.countDocuments();
    const returningVisitors = await BlogVisitor.countDocuments({ isReturningVisitor: true });
    const newVisitors = totalVisitors - returningVisitors;
    
    // Visiteurs par mois (derniers 12 mois)
    const monthlyStats = await BlogVisitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          returningCount: { $sum: { $cond: ['$isReturningVisitor', 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalVisitors: stats.totalVisitors || 0,
        returningVisitors: stats.returningVisitors || 0,
        totalBlogVisits: stats.totalBlogVisits || 0,
        averageTimeSpent: stats.averageTimeSpent || 0,
        averageScrollDepth: stats.averageScrollDepth || 0,
        topCountries: stats.topCountries || [],
        deviceBreakdown: stats.deviceBreakdown || [],
        newVisitors,
        monthlyStats
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Exporter les données des visiteurs (admin) - DOIT être AVANT /visitors/:id
router.get('/visitors/export/:format', authenticateAdmin, async (req, res) => {
  try {
    const { format } = req.params;
    const { country = '', search = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    const visitors = await BlogVisitor.find(query)
      .populate('blogsVisited.blog', 'title slug')
      .sort({ lastVisitAt: -1 });
    
    if (format === 'excel') {
      // Générer un fichier Excel
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Visiteurs');
      
      // En-têtes
      worksheet.columns = [
        { header: 'Prénom', key: 'firstName', width: 15 },
        { header: 'Nom', key: 'lastName', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Pays', key: 'country', width: 20 },
        { header: 'IP', key: 'ipAddress', width: 15 },
        { header: 'Ville', key: 'city', width: 15 },
        { header: 'Région', key: 'region', width: 15 },
        { header: 'Appareil', key: 'deviceType', width: 15 },
        { header: 'Navigateur', key: 'browser', width: 15 },
        { header: 'OS', key: 'os', width: 15 },
        { header: 'Visiteur de retour', key: 'isReturningVisitor', width: 15 },
        { header: 'Total blogs visités', key: 'totalBlogsVisited', width: 20 },
        { header: 'Temps total passé', key: 'totalTimeSpent', width: 20 },
        { header: 'Profondeur de scroll moyenne', key: 'averageScrollDepth', width: 25 },
        { header: 'Première visite', key: 'firstVisit', width: 20 },
        { header: 'Dernière visite', key: 'lastVisit', width: 20 },
        { header: 'Blogs visités', key: 'blogsVisited', width: 50 }
      ];
      
      // Données
      visitors.forEach(visitor => {
        worksheet.addRow({
          firstName: visitor.firstName,
          lastName: visitor.lastName,
          email: visitor.email,
          country: visitor.country,
          ipAddress: visitor.ipAddress,
          city: visitor.city || '',
          region: visitor.region || '',
          deviceType: visitor.device?.type || '',
          browser: visitor.device?.browser || '',
          os: visitor.device?.os || '',
          isReturningVisitor: visitor.isReturningVisitor ? 'Oui' : 'Non',
          totalBlogsVisited: visitor.totalBlogsVisited,
          totalTimeSpent: `${Math.floor(visitor.totalTimeSpent / 60)} min`,
          averageScrollDepth: `${Math.round(visitor.averageScrollDepth)}%`,
          firstVisit: visitor.createdAt.toLocaleDateString('fr-FR'),
          lastVisit: visitor.lastVisitAt.toLocaleDateString('fr-FR'),
          blogsVisited: visitor.blogsVisited.map(v => v.blogTitle).join(', ')
        });
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=visiteurs-blog.xlsx');
      
      await workbook.xlsx.write(res);
      res.end();
      
    } else if (format === 'csv') {
      // Générer un fichier CSV
      const csv = [
        'Prénom,Nom,Email,Pays,IP,Ville,Région,Appareil,Navigateur,OS,Visiteur de retour,Total blogs visités,Temps total passé,Profondeur de scroll moyenne,Première visite,Dernière visite,Blogs visités'
      ];
      
      visitors.forEach(visitor => {
        csv.push([
          visitor.firstName,
          visitor.lastName,
          visitor.email,
          visitor.country,
          visitor.ipAddress,
          visitor.city || '',
          visitor.region || '',
          visitor.device?.type || '',
          visitor.device?.browser || '',
          visitor.device?.os || '',
          visitor.isReturningVisitor ? 'Oui' : 'Non',
          visitor.totalBlogsVisited,
          `${Math.floor(visitor.totalTimeSpent / 60)} min`,
          `${Math.round(visitor.averageScrollDepth)}%`,
          visitor.createdAt.toLocaleDateString('fr-FR'),
          visitor.lastVisitAt.toLocaleDateString('fr-FR'),
          `"${visitor.blogsVisited.map(v => v.blogTitle).join(', ')}"`
        ].join(','));
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=visiteurs-blog.csv');
      res.send(csv.join('\n'));
      
    } else {
      res.status(400).json({
        success: false,
        message: 'Format non supporté. Utilisez "excel" ou "csv"'
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'export des visiteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des visiteurs'
    });
  }
});

// Récupérer tous les visiteurs (admin)
router.get('/visitors', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      country = '', 
      sortBy = 'lastVisitAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = {};
    
    // Filtres
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    // Tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const visitors = await BlogVisitor.find(query)
      .populate('blogsVisited.blog', 'title slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await BlogVisitor.countDocuments(query);
    
    res.json({
      success: true,
      data: visitors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des visiteurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des visiteurs'
    });
  }
});

// Récupérer un visiteur par ID (admin) - DOIT être à la FIN (après toutes les routes spécifiques)
router.get('/visitors/:id', authenticateAdmin, async (req, res) => {
  try {
    const visitor = await BlogVisitor.findById(req.params.id)
      .populate('blogsVisited.blog', 'title slug category type publishedAt');
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visiteur non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: visitor
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération du visiteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du visiteur'
    });
  }
});

module.exports = router;
