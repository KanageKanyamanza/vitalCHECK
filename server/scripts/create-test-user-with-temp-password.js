const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCheck-health-check';

async function createTestUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à MongoDB réussie.');

    // Créer un utilisateur de test
    const testUser = new User({
      email: 'test@example.com',
      companyName: 'Test Company',
      sector: 'Technology',
      companySize: 'sme',
      hasAccount: false
    });

    await testUser.save();
    console.log('✅ Utilisateur de test créé:', testUser.email);

    // Simuler la création de compte
    const tempPassword = testUser.generateTempPassword();
    testUser.password = tempPassword;
    testUser.tempPassword = tempPassword;
    testUser.hasAccount = true;
    testUser.accountCreatedAt = new Date();
    
    await testUser.save();
    console.log('✅ Compte créé avec mot de passe temporaire:', tempPassword);

    // Vérifier la récupération
    const userFromDB = await User.findById(testUser._id).select('+tempPassword');
    console.log('🔍 Utilisateur récupéré:', {
      email: userFromDB.email,
      hasAccount: userFromDB.hasAccount,
      accountCreatedAt: userFromDB.accountCreatedAt,
      tempPassword: userFromDB.tempPassword,
      tempPasswordMatches: userFromDB.tempPassword === tempPassword,
      hasPassword: !!userFromDB.password
    });

    // Nettoyer
    await User.deleteOne({ _id: testUser._id });
    console.log('🧹 Utilisateur de test supprimé.');

  } catch (error) {
    console.error('Erreur lors de la création du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB.');
  }
}

createTestUser();
