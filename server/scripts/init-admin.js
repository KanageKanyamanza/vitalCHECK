const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

async function initAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({ email: 'admin@ubb.com' });
    if (existingAdmin) {
      console.log('✅ Admin existe déjà');
      return;
    }

    // Créer le premier admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      email: 'admin@ubb.com',
      password: hashedPassword,
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
    console.log('✅ Admin créé avec succès:');
    console.log('📧 Email: admin@ubb.com');
    console.log('🔑 Mot de passe: admin123');
    console.log('⚠️  IMPORTANT: Changez le mot de passe en production !');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  }
}

module.exports = { initAdmin };
