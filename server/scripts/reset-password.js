const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI    = 'mongodb://127.0.0.1:27017/ubb-health-check';
const TARGET_EMAIL = 'kbnumerique1.0@gmail.com';
const NEW_PASSWORD = 'VitalCheck2026!';

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connecté');

  const User = require('../models/User');
  const user = await User.findOne({ email: TARGET_EMAIL });

  if (!user) {
    console.error('❌ Utilisateur introuvable:', TARGET_EMAIL);
    process.exit(1);
  }
  console.log('👤 Compte trouvé:', user.companyName);

  const hashed = await bcrypt.hash(NEW_PASSWORD, 12);
  await User.findByIdAndUpdate(user._id, { password: hashed, tempPassword: null });

  console.log('🔑 Mot de passe réinitialisé avec succès');
  console.log('   Email    :', TARGET_EMAIL);
  console.log('   Password :', NEW_PASSWORD);
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
