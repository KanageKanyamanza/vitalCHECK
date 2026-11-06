const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Team = require('../models/Team');
const { PERIOD_DAYS, MOBILE_MONEY_COUNTRY } = require('../config/plans');
const { maskPhone } = require('./afribapayService');
const {
  sendAccountCreatedEmail,
  sendSubscriptionUpgradeEmail,
} = require('./emailService');

const DAY_MS = 24 * 60 * 60 * 1000;

// ──────────────────────────────────────────────────────────────────────────────
// Partie commune à PayPal et AfribaPay : donner un plan à un utilisateur
// ──────────────────────────────────────────────────────────────────────────────
const grantPlan = async ({ user, planId, planName, payment, startDate, endDate }) => {
  const wasNewAccount = !user.hasAccount;
  let tempPassword = null;

  if (!user.hasAccount) {
    const tmp = new User();
    tempPassword = tmp.generateTempPassword();
    user.password = tempPassword;
    user.tempPassword = tempPassword;
    user.hasAccount = true;
    user.accountCreatedAt = new Date();
  }

  const newSub = {
    plan: planId,
    status: 'active',
    startDate,
    endDate,
    paymentId: payment._id,
  };

  user.subscription = newSub;
  user.isPremium = ['premium', 'diagnostic'].includes(planId);
  await user.save();

  // Sync subscription to the user's team + update maxMembers by plan (Phase A+)
  if (user.team) {
    try {
      const maxMembers = ['premium', 'diagnostic'].includes(planId) ? 5 : 1;
      await Team.findByIdAndUpdate(user.team, { subscription: newSub, maxMembers });
    } catch (teamErr) {
      console.error('[payments] team subscription sync failed:', teamErr.message);
    }
  }

  // Send email (non-blocking)
  try {
    if (wasNewAccount && tempPassword) {
      await sendAccountCreatedEmail(user.email, user.companyName, tempPassword, planName);
    } else {
      await sendSubscriptionUpgradeEmail(user.email, user.companyName, planName, planId);
    }
  } catch (emailErr) {
    console.error('[payments] email failed:', emailErr.message);
  }

  // Admin notification (non-blocking)
  new Notification({
    type: 'new_assessment',
    title: 'Nouveau paiement reçu',
    message: `Paiement ${payment.amount} ${payment.currency} — plan ${planName} (${user.email})`,
    user: { id: user._id, name: user.companyName, email: user.email },
  }).save().catch(err => console.error('[payments] notification failed:', err.message));

  return { user, tempPassword };
};

// PayPal : crée le Payment s'il n'existe pas puis applique le plan (comportement inchangé)
const applyPlanToUser = async ({ user, planId, planName, orderId, amount, currency, paymentDetails, paypalOrderId }) => {
  const endDate = planId === 'diagnostic'
    ? null
    : new Date(Date.now() + 30 * DAY_MS); // 30 days

  // Create or find the Payment document (idempotent)
  let payment = await Payment.findOne({ orderId });
  if (!payment) {
    payment = await new Payment({
      orderId,
      planId,
      planName,
      amount,
      currency,
      customerEmail: user.email,
      paypalOrderId,
      status: 'completed',
      paymentDetails,
    }).save();
  }

  const { tempPassword } = await grantPlan({ user, planId, planName, payment, startDate: new Date(), endDate });
  return { payment, user, tempPassword };
};

// ──────────────────────────────────────────────────────────────────────────────
// AfribaPay
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Période achetée. Même plan encore actif : les 30 jours s'ajoutent à la fin actuelle.
 * Autre plan (ex. Standard -> Premium) ou plan expiré : la période commence maintenant.
 */
const computePeriod = (currentSub, planId, now = new Date()) => {
  const extends_ = currentSub?.status === 'active'
    && currentSub.plan === planId
    && currentSub.endDate
    && new Date(currentSub.endDate) > now;
  const from = extends_ ? new Date(currentSub.endDate) : now;
  return {
    periodStart: extends_ && currentSub.startDate ? new Date(currentSub.startDate) : now,
    periodEnd: new Date(from.getTime() + PERIOD_DAYS * DAY_MS),
  };
};

/**
 * Montant initial (avant frais AfribaPay), devise et pays doivent être ceux de la commande enregistrée.
 * Renvoie la raison du désaccord, ou null.
 */
const amountMismatch = (tx, payment) => {
  const paidAmount = Number(tx.original_amount ?? tx.amount_total);
  if (paidAmount !== payment.amount || tx.currency !== payment.currency) {
    return `amount_mismatch (${tx.original_amount ?? tx.amount_total} ${tx.currency})`;
  }
  if (tx.country && tx.country !== MOBILE_MONEY_COUNTRY) return `country_mismatch (${tx.country})`;
  return null;
};

const flagConflict = async (payment, reason) => {
  console.error(`[afribapay] conflit sur ${payment.orderId}: ${reason}`);
  await Payment.updateOne({ _id: payment._id }, { $set: { conflict: true, failureReason: reason } });
};

/**
 * Applique la période payée au compte. Idempotent : ne fait rien si c'est déjà fait,
 * et la date de fin vient du paiement (calculée une fois), jamais recalculée.
 */
const applyPaidPeriod = async (payment) => {
  if (payment.status !== 'completed' || payment.planAppliedAt) return false;
  const user = await User.findById(payment.user);
  if (!user) {
    await flagConflict(payment, 'user_not_found');
    return false;
  }
  if (!user.subscription?.paymentId || !user.subscription.paymentId.equals(payment._id)) {
    await grantPlan({
      user,
      planId: payment.planId,
      planName: payment.planName,
      payment,
      startDate: payment.periodStart,
      endDate: payment.periodEnd,
    });
  }
  await Payment.updateOne({ _id: payment._id, planAppliedAt: null }, { $set: { planAppliedAt: new Date() } });
  console.log(`[afribapay] plan ${payment.planId} appliqué (${payment.orderId}, ${maskPhone(payment.phoneNumber)})`);
  return true;
};

/**
 * Traite un statut AfribaPay déjà authentifié (webhook signé ou réponse de GET /v1/status).
 * Seul SUCCESS active, et seulement si commande, transaction, montant et devise concordent.
 * Renvoie le paiement à jour.
 */
const settleAfribapayTransaction = async (payment, tx, via) => {
  const status = String(tx?.status || '').toUpperCase();
  const now = new Date();

  if (!tx || tx.order_id !== payment.orderId) {
    await flagConflict(payment, 'order_id_mismatch');
    return Payment.findById(payment._id);
  }
  if (payment.transactionId && tx.transaction_id && tx.transaction_id !== payment.transactionId) {
    await flagConflict(payment, 'transaction_id_mismatch');
    return Payment.findById(payment._id);
  }

  // PENDING (ou inconnu) : on note seulement, sans activer, annuler ni rembourser
  if (status !== 'SUCCESS' && status !== 'FAILED') {
    await Payment.updateOne({ _id: payment._id, status: 'pending' }, { $set: { providerStatus: 'PENDING' } });
    return Payment.findById(payment._id);
  }

  // Statut final contradictoire avec un statut final déjà enregistré : examen manuel, pas d'inversion
  const alreadyFinal = payment.status === 'completed' || payment.status === 'processed' || payment.status === 'failed';
  if (alreadyFinal) {
    const same = (status === 'SUCCESS') === (payment.status !== 'failed');
    if (!same) await flagConflict(payment, `final_status_conflict_${status}`);
    else if (payment.status !== 'failed') await applyPaidPeriod(payment); // reprise si l'application avait été interrompue
    return Payment.findById(payment._id);
  }

  const txFields = { providerStatus: status };
  if (tx.transaction_id) txFields.transactionId = tx.transaction_id;

  if (status === 'FAILED') {
    try {
      await Payment.updateOne({ _id: payment._id, status: 'pending' }, { $set: { ...txFields, status: 'failed', failureReason: 'provider_failed' } });
    } catch (err) {
      if (err.code === 11000) await flagConflict(payment, 'transaction_id_reused');
      else throw err;
    }
    return Payment.findById(payment._id);
  }

  const mismatch = amountMismatch(tx, payment);
  if (mismatch) {
    await flagConflict(payment, mismatch);
    return Payment.findById(payment._id);
  }

  const user = await User.findById(payment.user).select('subscription');
  const { periodStart, periodEnd } = computePeriod(user?.subscription, payment.planId, now);

  // Passage pending -> completed atomique : un seul appel gagne, les doublons ne font rien
  let claimed;
  try {
    claimed = await Payment.findOneAndUpdate(
      { _id: payment._id, status: 'pending', conflict: { $ne: true } },
      { $set: { ...txFields, status: 'completed', activatedAt: now, activatedVia: via, periodStart, periodEnd } },
      { new: true }
    );
  } catch (err) {
    if (err.code === 11000) {
      await flagConflict(payment, 'transaction_id_reused');
      return Payment.findById(payment._id);
    }
    throw err;
  }
  if (claimed) await applyPaidPeriod(claimed);
  return Payment.findById(payment._id);
};

module.exports = {
  grantPlan,
  applyPlanToUser,
  computePeriod,
  amountMismatch,
  flagConflict,
  applyPaidPeriod,
  settleAfribapayTransaction,
};
