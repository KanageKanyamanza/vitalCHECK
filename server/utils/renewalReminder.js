const User = require('../models/User');
const Team = require('../models/Team');
const Assessment = require('../models/Assessment');
const { PLANS } = require('../config/plans');
const { sendRenewalReminderEmail } = require('./emailService');

const DAY_MS = 24 * 60 * 60 * 1000;
const REMINDER_DAYS = 3;
const MONTHLY_PLANS = Object.keys(PLANS); // standard, premium

// Langue du dernier diagnostic, sinon français
const userLanguage = async (userId) => {
  const last = await Assessment.findOne({ user: userId }).sort({ completedAt: -1, createdAt: -1 }).select('language').lean();
  return last?.language === 'en' ? 'en' : 'fr';
};

const renewUrl = (planId) => `${(process.env.FRONTEND_URL || 'https://www.checkmyenterprise.com').replace(/\/$/, '')}/checkout?plan=${planId}`;

const notify = async (user, { expired }) => {
  const sub = user.subscription;
  try {
    await sendRenewalReminderEmail(user.email, user.companyName, {
      planName: PLANS[sub.plan]?.name || sub.plan,
      endDate: sub.endDate,
      lang: await userLanguage(user._id),
      renewUrl: renewUrl(sub.plan),
      expired,
    });
  } catch (err) {
    console.error(`[renewal] e-mail non envoyé (${user._id}): ${err.message}`);
  }
};

/**
 * Rappel J-3 puis expiration réelle (statut « expired », isPremium à false, équipe synchronisée).
 * Chaque envoi est réservé par une mise à jour conditionnelle : jamais deux fois pour la même date de fin.
 */
const runRenewalReminders = async (now = new Date()) => {
  // 1. Rappel avant échéance
  const soon = await User.find({
    'subscription.status': 'active',
    'subscription.plan': { $in: MONTHLY_PLANS },
    'subscription.endDate': { $gt: now, $lte: new Date(now.getTime() + REMINDER_DAYS * DAY_MS) },
  }).select('email companyName subscription').limit(200);

  for (const user of soon) {
    const endDate = user.subscription.endDate;
    if (user.subscription.reminderSentFor && user.subscription.reminderSentFor.getTime() === endDate.getTime()) continue;
    const { modifiedCount } = await User.updateOne(
      { _id: user._id, 'subscription.endDate': endDate, 'subscription.reminderSentFor': { $ne: endDate } },
      { $set: { 'subscription.reminderSentFor': endDate } }
    );
    if (modifiedCount) await notify(user, { expired: false });
  }

  // 2. Échéance dépassée : expiration + avis
  const ended = await User.find({
    'subscription.status': 'active',
    'subscription.plan': { $in: MONTHLY_PLANS },
    'subscription.endDate': { $lte: now },
  }).select('email companyName subscription team').limit(200);

  for (const user of ended) {
    const endDate = user.subscription.endDate;
    // Condition sur la date de fin : un renouvellement payé entre-temps n'est pas expiré par erreur
    const { modifiedCount } = await User.updateOne(
      { _id: user._id, 'subscription.status': 'active', 'subscription.endDate': endDate },
      { $set: { 'subscription.status': 'expired', 'subscription.expiryNoticeSentFor': endDate, isPremium: false } }
    );
    if (!modifiedCount) continue;
    if (user.team && user.subscription.paymentId) {
      await Team.updateOne(
        { _id: user.team, 'subscription.paymentId': user.subscription.paymentId, 'subscription.status': 'active' },
        { $set: { 'subscription.status': 'expired' } }
      ).catch((err) => console.error(`[renewal] équipe non expirée (${user.team}): ${err.message}`));
    }
    await notify(user, { expired: true });
  }
};

function startRenewalReminder({ enabled = false, intervalMs = 60 * 60 * 1000, logger = console } = {}) {
  if (!enabled) return null;
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      await runRenewalReminders();
    } catch (err) {
      logger.error('❌ [RENEWAL REMINDER] Erreur:', err.message);
    } finally {
      running = false;
    }
  };
  logger.log(`⏱️  [RENEWAL REMINDER] Activé (intervalle: ${intervalMs}ms)`);
  const timer = setInterval(tick, intervalMs);
  timer.unref?.();
  return timer;
}

module.exports = { startRenewalReminder, runRenewalReminders };
