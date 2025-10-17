const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCHECK-health-check');
    console.log('Connecté à MongoDB');

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({ email: 'admin@VitalCHECK.com' });
    if (existingAdmin) {
      console.log('Un admin avec cet email existe déjà');
      process.exit(0);
    }

    // Créer le premier admin
    const admin = new Admin({
      email: 'admin@VitalCHECK.com',
      password: 'admin123', // À changer en production
      name: 'Administrateur VitalCHECK',
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
    console.log('Admin créé avec succès:');
    console.log('Email: admin@VitalCHECK.com');
    console.log('Mot de passe: admin123');
    console.log('⚠️  IMPORTANT: Changez le mot de passe en production !');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

createAdmin();
