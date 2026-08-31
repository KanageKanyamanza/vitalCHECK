/**
 * migrate-teams.js
 * Phase A — crée une équipe personnelle pour chaque utilisateur qui n'en a pas.
 * Idempotente : relancer le script ne crée pas de doublons.
 *
 * Usage:
 *   node server/scripts/migrate-teams.js
 *   node server/scripts/migrate-teams.js --dry-run   (simulation sans écriture)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Team = require('../models/Team');

const DRY_RUN = process.argv.includes('--dry-run');

const migrate = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalCHECK-health-check';
  await mongoose.connect(uri);
  console.log('✅ MongoDB connecté');
  if (DRY_RUN) console.log('⚠️  Mode simulation (--dry-run) : aucune écriture');

  // Tous les users sans champ team renseigné
  const users = await User.find({ $or: [{ team: null }, { team: { $exists: false } }] });
  console.log(`📋 ${users.length} utilisateur(s) sans équipe`);

  let created = 0;
  let skipped = 0;
  let errors  = 0;

  for (const user of users) {
    try {
      // Garde-fou supplémentaire : team peut avoir été remplie entre-temps
      if (user.team) { skipped++; continue; }

      const teamData = {
        name:      user.companyName || user.email,
        owner:     user._id,
        members:   [{ user: user._id, role: 'owner', joinedAt: user.createdAt || new Date() }],
        subscription: {
          plan:      user.subscription?.plan      || 'free',
          status:    user.subscription?.status    || 'inactive',
          startDate: user.subscription?.startDate || null,
          endDate:   user.subscription?.endDate   || null,
          paymentId: user.subscription?.paymentId || null,
        },
        maxMembers: 5,
        createdAt:  user.createdAt || new Date(),
      };

      if (!DRY_RUN) {
        const team = await Team.create(teamData);
        await User.findByIdAndUpdate(user._id, { team: team._id });
        console.log(`  ✅ ${user.email} → équipe "${team.name}" (${team._id})`);
      } else {
        console.log(`  [dry] ${user.email} → équipe "${teamData.name}" (plan: ${teamData.subscription.plan})`);
      }
      created++;
    } catch (err) {
      console.error(`  ❌ Erreur pour ${user.email}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Migration terminée : ${created} équipes créées, ${skipped} ignorées, ${errors} erreurs`);
  await mongoose.disconnect();
};

migrate().catch(err => {
  console.error('Migration échouée :', err);
  process.exit(1);
});
