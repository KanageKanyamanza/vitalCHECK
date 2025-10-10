const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

async function cleanupDraftAssessments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à MongoDB réussie.');

    // Trouver tous les utilisateurs avec des évaluations complétées
    const usersWithCompletedAssessments = await User.find({
      assessments: { $exists: true, $not: { $size: 0 } }
    }).populate('assessments');

    let totalDraftsDeleted = 0;
    let usersProcessed = 0;

    for (const user of usersWithCompletedAssessments) {
      // Séparer les évaluations complétées et les brouillons
      const completedAssessments = user.assessments.filter(assessment => assessment.status === 'completed');
      const draftAssessments = user.assessments.filter(assessment => assessment.status === 'draft');

      if (completedAssessments.length > 0 && draftAssessments.length > 0) {
        console.log(`\n👤 Utilisateur: ${user.companyName} (${user.email})`);
        console.log(`   ✅ Évaluations complétées: ${completedAssessments.length}`);
        console.log(`   📝 Brouillons à supprimer: ${draftAssessments.length}`);

        // Supprimer tous les brouillons pour cet utilisateur
        for (const draft of draftAssessments) {
          await Assessment.deleteOne({ _id: draft._id });
          console.log(`   🗑️  Brouillon supprimé: ${draft._id}`);
          totalDraftsDeleted++;
        }

        // Mettre à jour le tableau assessments de l'utilisateur pour ne garder que les évaluations complétées
        user.assessments = completedAssessments.map(assessment => assessment._id);
        await user.save();
        console.log(`   ✅ Utilisateur mis à jour: ${completedAssessments.length} évaluation(s) conservée(s)`);
        
        usersProcessed++;
      }
    }

    console.log(`\n🧹 Nettoyage terminé:`);
    console.log(`   👥 Utilisateurs traités: ${usersProcessed}`);
    console.log(`   🗑️  Brouillons supprimés: ${totalDraftsDeleted}`);

    // Statistiques générales
    const totalDrafts = await Assessment.countDocuments({ status: 'draft' });
    const totalCompleted = await Assessment.countDocuments({ status: 'completed' });
    
    console.log(`\n📊 Statistiques finales:`);
    console.log(`   📝 Brouillons restants: ${totalDrafts}`);
    console.log(`   ✅ Évaluations complétées: ${totalCompleted}`);

  } catch (error) {
    console.error('Erreur lors du nettoyage des brouillons:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDéconnexion de MongoDB.');
  }
}

// Exécuter le nettoyage
cleanupDraftAssessments();
