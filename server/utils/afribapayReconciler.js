const Payment = require('../models/Payment');
const { getStatus } = require('./afribapayService');
const { settleAfribapayTransaction, applyPaidPeriod } = require('./paymentActivation');

const MINUTE_MS = 60 * 1000;
// Au-delà, on arrête d'interroger AfribaPay ; la commande reste « pending » (jamais annulée)
const MAX_AGE_MS = 7 * 24 * 60 * MINUTE_MS;

// Délai entre deux vérifications d'une même commande : 2 min, 4 min, 8 min… plafonné à 6 h
const backoffMs = (checkCount) => Math.min(2 * MINUTE_MS * 2 ** Math.max(0, checkCount - 1), 6 * 60 * MINUTE_MS);

/**
 * Réserve une vérification : un seul appel à /v1/status à la fois par commande,
 * et pas plus d'un toutes les `minIntervalMs`.
 */
const claimCheck = (payment, minIntervalMs, now = new Date()) =>
  Payment.findOneAndUpdate(
    {
      _id: payment._id,
      status: 'pending',
      conflict: { $ne: true },
      $or: [{ lastCheckedAt: null }, { lastCheckedAt: { $lte: new Date(now.getTime() - minIntervalMs) } }],
    },
    { $set: { lastCheckedAt: now }, $inc: { checkCount: 1 } },
    { new: true }
  );

// Interroge GET /v1/status côté serveur puis traite le résultat (aucune décision prise par le navigateur)
const checkPaymentStatus = async (payment, via) => {
  try {
    const tx = await getStatus(payment.orderId);
    return await settleAfribapayTransaction(payment, tx, via);
  } catch (err) {
    console.warn(`[afribapay] statut de ${payment.orderId} indisponible: ${err.message}`);
    return payment;
  }
};

const runReconciliation = async (now = new Date()) => {
  // 1. Commandes restées PENDING
  const pending = await Payment.find({
    provider: 'afribapay',
    status: 'pending',
    conflict: { $ne: true },
    createdAt: { $gte: new Date(now.getTime() - MAX_AGE_MS), $lte: new Date(now.getTime() - 30 * 1000) },
  }).sort({ lastCheckedAt: 1 }).limit(50);

  for (const payment of pending) {
    const claimed = await claimCheck(payment, backoffMs(payment.checkCount), now);
    if (claimed) await checkPaymentStatus(claimed, 'reconciler');
  }

  // 2. Paiements confirmés dont l'application au compte a été interrompue (arrêt du serveur…)
  const unapplied = await Payment.find({
    provider: 'afribapay',
    status: 'completed',
    planAppliedAt: null,
    conflict: { $ne: true },
    activatedAt: { $lte: new Date(now.getTime() - 2 * MINUTE_MS) },
  }).limit(20);

  for (const payment of unapplied) {
    try {
      await applyPaidPeriod(payment);
    } catch (err) {
      console.error(`[afribapay] application du plan ${payment.orderId} échouée: ${err.message}`);
    }
  }
};

function startAfribapayReconciler({ enabled = false, intervalMs = 2 * MINUTE_MS, logger = console } = {}) {
  if (!enabled) return null;
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      await runReconciliation();
    } catch (err) {
      logger.error('❌ [AFRIBAPAY RECONCILER] Erreur:', err.message);
    } finally {
      running = false;
    }
  };
  logger.log(`⏱️  [AFRIBAPAY RECONCILER] Activé (intervalle: ${intervalMs}ms)`);
  const timer = setInterval(tick, intervalMs);
  timer.unref?.();
  return timer;
}

module.exports = { startAfribapayReconciler, runReconciliation, claimCheck, checkPaymentStatus, backoffMs };
