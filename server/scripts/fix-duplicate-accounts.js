/**
 * Script de correction — transfère les assessments des comptes doublons
 * (créés par la normalisation email de Gmail) vers les vrais comptes.
 *
 * Usage: node server/scripts/fix-duplicate-accounts.js
 */

const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ubb-health-check');
  console.log('✅ MongoDB connecté');

  const User       = require('../models/User');
  const Assessment = require('../models/Assessment');

  // Paires [compte doublon normalisé → vrai compte]
  const pairs = [
    { from: 'kbnumerique10@gmail.com',  to: 'kbnumerique1.0@gmail.com'  },
    { from: 'kbnumerique20@gmail.com',  to: 'kbnumerique2.0@gmail.com'  },
  ];

  for (const { from, to } of pairs) {
    const fromUser = await User.findOne({ email: from });
    const toUser   = await User.findOne({ email: to });

    if (!fromUser) { console.log(`⚠️  Doublon introuvable: ${from}`); continue; }
    if (!toUser)   { console.log(`⚠️  Vrai compte introuvable: ${to}`); continue; }

    // Transférer les assessments
    const result = await Assessment.updateMany(
      { user: fromUser._id },
      { $set: { user: toUser._id } }
    );
    console.log(`\n🔄 ${from} → ${to} : ${result.modifiedCount} assessment(s) transféré(s)`);

    // Mettre à jour user.assessments sur le vrai compte
    const ids = await Assessment.find({ user: toUser._id }).distinct('_id');
    await User.findByIdAndUpdate(toUser._id, { $set: { assessments: ids } });
    console.log(`   ✅ ${ids.length} assessment(s) maintenant liés à ${to}`);

    // Vider le tableau du doublon
    await User.findByIdAndUpdate(fromUser._id, { $set: { assessments: [] } });
    console.log(`   🧹 Doublon ${from} nettoyé`);
  }

  console.log('\n🎉 Correction terminée.');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
