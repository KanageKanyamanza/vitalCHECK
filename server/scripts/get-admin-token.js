const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAdminToken = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer le premier admin
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ Aucun admin trouvé');
      return;
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('🔑 Token admin généré :');
    console.log(token);
    console.log('\n📧 Email admin :', admin.email);

  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await mongoose.connection.close();
  }
};

getAdminToken();
