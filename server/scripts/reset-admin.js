const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function resetAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ubb-health-check');
    console.log('Connecté à MongoDB');

    // Supprimer l'admin existant
    await Admin.deleteOne({ email: 'admin@ubb.com' });
    console.log('✅ Admin existant supprimé');

    // Créer le nouvel admin
    const admin = new Admin({
      email: 'admin@ubb.com',
      password: 'admin123', // Sera hashé automatiquement par le middleware
      name: 'Administrateur UBB',
      role: 'super-admin',
      permissions: {
        viewUsers: true,
        manageUsers: true,
        viewAssessments: true,
        manageAssessments: true,
        sendEmails: true,
        viewReports: true,
        manageAdmins: true
      }
    });

    await admin.save();
    console.log('✅ Nouvel admin créé avec succès:');
    console.log('📧 Email: admin@ubb.com');
    console.log('🔑 Mot de passe: admin123');
    console.log('⚠️  IMPORTANT: Changez le mot de passe en production !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation de l\'admin:', error);
    process.exit(1);
  }
}

resetAdmin();
