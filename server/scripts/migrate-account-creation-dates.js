const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

async function migrateAccountCreationDates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à MongoDB réussie.');

    // Trouver tous les utilisateurs qui ont hasAccount: true mais pas d'accountCreatedAt
    const usersToUpdate = await User.find({
      hasAccount: true,
      accountCreatedAt: { $exists: false }
    });

    console.log(`Trouvé ${usersToUpdate.length} utilisateurs à mettre à jour.`);

    let updatedCount = 0;
    for (const user of usersToUpdate) {
      // Utiliser une date par défaut (il y a 30 jours) pour les comptes existants
      const defaultDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 jours ago
      
      user.accountCreatedAt = defaultDate;
      await user.save();
      
      console.log(`✅ Mis à jour l'utilisateur: ${user.email} avec accountCreatedAt: ${defaultDate.toISOString()}`);
      updatedCount++;
    }

    console.log(`\n🧹 Migration terminée. ${updatedCount} utilisateurs mis à jour.`);

    // Vérification finale
    const remainingUsers = await User.find({
      hasAccount: true,
      accountCreatedAt: { $exists: false }
    });

    if (remainingUsers.length === 0) {
      console.log('✅ Tous les utilisateurs avec hasAccount: true ont maintenant un accountCreatedAt.');
    } else {
      console.log(`⚠️ ${remainingUsers.length} utilisateurs n'ont toujours pas d'accountCreatedAt.`);
    }

  } catch (error) {
    console.error('Erreur lors de la migration des dates de création de compte:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB.');
  }
}

migrateAccountCreationDates();
