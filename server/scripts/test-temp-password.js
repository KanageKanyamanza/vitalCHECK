const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalCHECK-health-check';

async function testTempPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connexion à MongoDB réussie.');

    // Trouver un utilisateur avec hasAccount: true pour tester
    const user = await User.findOne({ hasAccount: true }).select('+tempPassword');
    
    if (!user) {
      console.log('❌ Aucun utilisateur avec hasAccount: true trouvé.');
      return;
    }

    console.log('🔍 Utilisateur trouvé:', {
      email: user.email,
      hasAccount: user.hasAccount,
      accountCreatedAt: user.accountCreatedAt,
      tempPassword: user.tempPassword,
      hasPassword: !!user.password
    });

    // Test de génération d'un nouveau mot de passe temporaire
    const tempPassword = user.generateTempPassword();
    console.log('🔑 Mot de passe temporaire généré:', tempPassword);

    // Simuler la sauvegarde
    user.tempPassword = tempPassword;
    await user.save();

    // Vérifier la récupération
    const userAfterSave = await User.findById(user._id).select('+tempPassword');
    console.log('✅ Après sauvegarde:', {
      tempPassword: userAfterSave.tempPassword,
      matches: userAfterSave.tempPassword === tempPassword
    });

    // Nettoyer
    userAfterSave.tempPassword = null;
    await userAfterSave.save();
    console.log('🧹 Mot de passe temporaire nettoyé.');

  } catch (error) {
    console.error('Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB.');
  }
}

testTempPassword();
