const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function initAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({ email: 'admin@VitalCheck.com' });
    if (existingAdmin) {
      console.log('✅ Admin existe déjà');
      return;
    }

    // Créer le premier admin (le mot de passe sera hashé automatiquement par le middleware pre('save'))
    const admin = new Admin({
      email: 'admin@VitalCheck.com',
      password: 'admin123', // Sera hashé automatiquement par le middleware
      name: 'Administrateur VitalCheck',
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
    console.log('✅ Admin créé avec succès:');
    console.log('📧 Email: admin@VitalCheck.com');
    console.log('🔑 Mot de passe: admin123');
    console.log('⚠️  IMPORTANT: Changez le mot de passe en production !');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  }
}

module.exports = { initAdmin };
