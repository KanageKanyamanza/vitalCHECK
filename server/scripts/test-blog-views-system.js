const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const BlogVisitor = require('../models/BlogVisitor');
require('dotenv').config();

async function testBlogViewsSystem() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalCHECK-health-check');
    console.log('✅ Connecté à MongoDB');

    // Récupérer tous les blogs
    const blogs = await Blog.find({ status: 'published' });
    console.log(`\n📝 ${blogs.length} blogs publiés trouvés`);

    // Afficher les statistiques actuelles
    console.log('\n📊 Statistiques actuelles des vues :');
    for (const blog of blogs) {
      const localizedContent = blog.getLocalizedContent('fr');
      console.log(`   - ${localizedContent.title}: ${blog.views} vues`);
    }

    // Statistiques des visiteurs
    const visitorStats = await BlogVisitor.getGlobalStats();
    console.log('\n👥 Statistiques des visiteurs :');
    console.log(`   - Total visiteurs: ${visitorStats.totalVisitors}`);
    console.log(`   - Visiteurs de retour: ${visitorStats.returningVisitors}`);
    console.log(`   - Total visites: ${visitorStats.totalBlogVisits}`);

    // Vérifier la cohérence
    const totalViewsFromBlogs = blogs.reduce((sum, blog) => sum + blog.views, 0);
    const totalVisitsFromVisitors = visitorStats.totalBlogVisits;
    
    console.log('\n🔍 Vérification de cohérence :');
    console.log(`   - Total vues (Blogs): ${totalViewsFromBlogs}`);
    console.log(`   - Total visites (Visiteurs): ${totalVisitsFromVisitors}`);
    
    if (totalViewsFromBlogs === totalVisitsFromVisitors) {
      console.log('   ✅ Système cohérent !');
    } else {
      console.log('   ⚠️ Différence détectée - normal après la migration');
    }

    console.log('\n💡 Instructions de test :');
    console.log('   1. Visitez un blog : http://localhost:5173/blog');
    console.log('   2. Cliquez sur un article');
    console.log('   3. Le modal apparaîtra automatiquement');
    console.log('   4. Remplissez OBLIGATOIREMENT le formulaire');
    console.log('   5. Les vues ne seront comptabilisées QUE après soumission !');
    console.log('   6. Relancez ce script pour voir les nouvelles statistiques');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

testBlogViewsSystem();
