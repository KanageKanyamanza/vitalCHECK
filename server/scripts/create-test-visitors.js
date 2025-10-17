const mongoose = require('mongoose');
const BlogVisitor = require('../models/BlogVisitor');
const Blog = require('../models/Blog');
require('dotenv').config();

const testVisitors = [
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    country: 'France',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'Windows'
    },
    sessionId: 'test_session_001',
    totalBlogsVisited: 3,
    totalTimeSpent: 450, // 7 minutes 30 secondes
    averageScrollDepth: 75,
    isReturningVisitor: false,
    lastVisitAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
    blogsVisited: [
      {
        blog: null, // sera rempli
        blogTitle: 'Comment améliorer la santé financière de votre entreprise en 2024',
        blogSlug: 'ameliorer-sante-financiere-entreprise',
        visitedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        scrollDepth: 80,
        timeOnPage: 180,
        isFormSubmitted: true
      },
      {
        blog: null, // sera rempli
        blogTitle: 'Transformation Digitale : Cas d\'une PME manufacturière',
        blogSlug: 'transformation-digitale-pme',
        visitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        scrollDepth: 70,
        timeOnPage: 270,
        isFormSubmitted: true
      }
    ]
  },
  {
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    country: 'Canada',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    device: {
      type: 'desktop',
      browser: 'Safari',
      os: 'macOS'
    },
    sessionId: 'test_session_002',
    totalBlogsVisited: 2,
    totalTimeSpent: 320,
    averageScrollDepth: 85,
    isReturningVisitor: true,
    lastVisitAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 heure ago
    blogsVisited: [
      {
        blog: null, // sera rempli
        blogTitle: '10 Indicateurs RH à Suivre pour une Équipe Performante',
        blogSlug: '10-indicateurs-rh-equipe-performante',
        visitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        scrollDepth: 90,
        timeOnPage: 200,
        isFormSubmitted: true
      }
    ]
  },
  {
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@example.com',
    country: 'Maroc',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    device: {
      type: 'mobile',
      browser: 'Safari Mobile',
      os: 'iOS'
    },
    sessionId: 'test_session_003',
    totalBlogsVisited: 4,
    totalTimeSpent: 680,
    averageScrollDepth: 65,
    isReturningVisitor: true,
    lastVisitAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    blogsVisited: [
      {
        blog: null, // sera rempli
        blogTitle: 'Guide Pratique : Créer une Stratégie Marketing Digital Efficace',
        blogSlug: 'guide-strategie-marketing-digital',
        visitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        scrollDepth: 60,
        timeOnPage: 300,
        isFormSubmitted: true
      }
    ]
  },
  {
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@example.com',
    country: 'Belgique',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    device: {
      type: 'desktop',
      browser: 'Firefox',
      os: 'Linux'
    },
    sessionId: 'test_session_004',
    totalBlogsVisited: 1,
    totalTimeSpent: 150,
    averageScrollDepth: 50,
    isReturningVisitor: false,
    lastVisitAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    blogsVisited: [
      {
        blog: null, // sera rempli
        blogTitle: 'Optimisation des Processus : 5 Méthodes Lean pour PME',
        blogSlug: 'optimisation-processus-methodes-lean-pme',
        visitedAt: new Date(Date.now() - 45 * 60 * 1000),
        scrollDepth: 50,
        timeOnPage: 150,
        isFormSubmitted: true
      }
    ]
  }
];

async function createTestVisitors() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCHECK-health-check');
    console.log('✅ Connecté à MongoDB');

    // Récupérer les blogs existants
    const blogs = await Blog.find({ status: 'published' });
    console.log(`📚 ${blogs.length} blogs trouvés`);

    if (blogs.length === 0) {
      console.log('❌ Aucun blog trouvé. Créez d\'abord des blogs.');
      process.exit(1);
    }

    console.log('📝 Création des visiteurs de test...');

    for (const visitorData of testVisitors) {
      // Assigner des blogs réels aux visites
      for (let i = 0; i < visitorData.blogsVisited.length; i++) {
        const blogIndex = i % blogs.length;
        visitorData.blogsVisited[i].blog = blogs[blogIndex]._id;
      }

      const visitor = new BlogVisitor(visitorData);
      await visitor.save();
      console.log(`✅ Visiteur créé : ${visitorData.firstName} ${visitorData.lastName} (${visitorData.country})`);
    }

    // Afficher les statistiques
    const stats = await BlogVisitor.getGlobalStats();
    console.log('\n🎉 Visiteurs de test créés avec succès !');
    console.log('\n📊 Statistiques mises à jour :');
    console.log(`   - Total visiteurs: ${stats.totalVisitors}`);
    console.log(`   - Visiteurs de retour: ${stats.returningVisitors}`);
    console.log(`   - Total visites: ${stats.totalBlogVisits}`);
    console.log(`   - Temps moyen: ${Math.floor(stats.averageTimeSpent / 60)}m`);
    
    console.log('\n💡 Vous pouvez maintenant voir les visiteurs dans votre tableau de bord admin !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des visiteurs:', error);
    process.exit(1);
  }
}

createTestVisitors();
