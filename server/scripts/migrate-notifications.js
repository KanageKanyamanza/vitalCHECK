const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
require('dotenv').config();

async function migrateNotifications() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCHECK-health-check');
    console.log('Connecté à MongoDB');

    // Récupérer les évaluations des dernières 7 jours
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentAssessments = await Assessment.find({
      completedAt: { $gte: last7Days }
    })
    .populate('user', 'companyName email sector companySize')
    .sort({ completedAt: -1 });

    console.log(`Trouvé ${recentAssessments.length} évaluations récentes`);

    // Créer les notifications
    const notifications = recentAssessments.map(assessment => ({
      type: 'new_assessment',
      title: 'Nouvelle évaluation complétée',
      message: `${assessment.user.companyName} a complété son évaluation`,
      user: {
        id: assessment.user._id,
        name: assessment.user.companyName,
        email: assessment.user.email,
        sector: assessment.user.sector,
        companySize: assessment.user.companySize
      },
      assessment: {
        id: assessment._id,
        score: assessment.overallScore,
        status: assessment.overallStatus,
        completedAt: assessment.completedAt
      },
      read: false,
      createdAt: assessment.completedAt
    }));

    // Insérer les notifications
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`Créé ${notifications.length} notifications`);
    } else {
      console.log('Aucune notification à créer');
    }

    console.log('Migration terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter la migration
migrateNotifications();
