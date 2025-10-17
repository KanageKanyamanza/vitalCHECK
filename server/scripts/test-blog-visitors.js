const mongoose = require('mongoose');
const BlogVisitor = require('../models/BlogVisitor');
const Blog = require('../models/Blog');
require('dotenv').config();

async function testBlogVisitors() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCHECK-health-check');
    console.log('✅ Connecté à MongoDB');

    // Vérifier s'il y a des blogs
    const blogs = await Blog.find({ status: 'published' });
    console.log(`📚 ${blogs.length} blogs publiés trouvés`);

    // Vérifier s'il y a des visiteurs
    const visitors = await BlogVisitor.find();
    console.log(`👥 ${visitors.length} visiteurs trouvés`);

    if (visitors.length > 0) {
      console.log('\n📊 Détails des visiteurs :');
      visitors.forEach((visitor, index) => {
        console.log(`  ${index + 1}. ${visitor.firstName} ${visitor.lastName} (${visitor.email})`);
        console.log(`     - Pays: ${visitor.country}`);
        console.log(`     - Visiteur de retour: ${visitor.isReturningVisitor ? 'Oui' : 'Non'}`);
        console.log(`     - Blogs visités: ${visitor.totalBlogsVisited}`);
        console.log(`     - Dernière visite: ${visitor.lastVisitAt}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Aucun visiteur trouvé dans la base de données.');
      console.log('\n💡 Pour tester le système de tracking :');
      console.log('   1. Visitez un blog : http://localhost:5173/blog');
      console.log('   2. Cliquez sur un article');
      console.log('   3. Scrollez à 20% de la page');
      console.log('   4. Remplissez le formulaire qui apparaît');
      console.log('   5. Relancez ce script pour voir les visiteurs');
    }

    // Tester les statistiques
    const stats = await BlogVisitor.getGlobalStats();
    console.log('\n📈 Statistiques globales :');
    console.log(`   - Total visiteurs: ${stats.totalVisitors}`);
    console.log(`   - Visiteurs de retour: ${stats.returningVisitors}`);
    console.log(`   - Total visites: ${stats.totalBlogVisits}`);
    console.log(`   - Temps moyen: ${Math.floor(stats.averageTimeSpent / 60)}m`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testBlogVisitors();
