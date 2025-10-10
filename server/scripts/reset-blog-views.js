const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const BlogVisitor = require('../models/BlogVisitor');
require('dotenv').config();

async function resetBlogViews() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCheck-health-check');
    console.log('✅ Connecté à MongoDB');

    // Réinitialiser toutes les vues des blogs à 0
    const result = await Blog.updateMany({}, { views: 0 });
    console.log(`🔄 ${result.modifiedCount} blogs réinitialisés (vues = 0)`);

    // Supprimer tous les visiteurs de test
    const deleteResult = await BlogVisitor.deleteMany({});
    console.log(`🗑️ ${deleteResult.deletedCount} visiteurs supprimés`);

    // Vérifier les statistiques après réinitialisation
    const blogs = await Blog.find({ status: 'published' });
    const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
    
    console.log('\n📊 Statistiques après réinitialisation :');
    console.log(`   - Total vues: ${totalViews}`);
    console.log(`   - Total visiteurs: 0`);

    console.log('\n✅ Système réinitialisé !');
    console.log('\n🎯 Nouveau comportement :');
    console.log('   - Les vues ne sont PLUS comptabilisées automatiquement');
    console.log('   - Les vues sont comptabilisées UNIQUEMENT après soumission du formulaire');
    console.log('   - Plus de "fausses vues" - chaque vue = un formulaire rempli !');
    console.log('\n🧪 Prêt pour les tests !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  }
}

resetBlogViews();
