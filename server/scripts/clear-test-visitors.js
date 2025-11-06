const mongoose = require('mongoose');
const BlogVisitor = require('../models/BlogVisitor');
require('dotenv').config();

async function clearTestVisitors() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalCHECK-health-check');
    console.log('✅ Connecté à MongoDB');

    // Supprimer tous les visiteurs de test
    const result = await BlogVisitor.deleteMany({});
    console.log(`🗑️ ${result.deletedCount} visiteurs supprimés`);

    // Vérifier les statistiques
    const stats = await BlogVisitor.getGlobalStats();
    console.log('\n📊 Statistiques après nettoyage :');
    console.log(`   - Total visiteurs: ${stats.totalVisitors}`);
    console.log(`   - Visiteurs de retour: ${stats.returningVisitors}`);
    console.log(`   - Total visites: ${stats.totalBlogVisits}`);

    console.log('\n✅ Nettoyage terminé !');
    console.log('\n💡 Vous pouvez maintenant tester le nouveau système obligatoire :');
    console.log('   1. Visitez un blog : http://localhost:5173/blog');
    console.log('   2. Cliquez sur un article');
    console.log('   3. Le modal apparaîtra automatiquement à 10% de scroll');
    console.log('   4. Remplissez OBLIGATOIREMENT le formulaire pour continuer');
    console.log('   5. Plus de bouton X - impossible de fermer sans remplir !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  }
}

clearTestVisitors();
