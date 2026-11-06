const crypto = require('crypto');
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const Payment = require('../models/Payment');
const { authenticateClient } = require('../middleware/auth');
const { PLANS, MOBILE_MONEY_CURRENCY, MOBILE_MONEY_COUNTRY } = require('../config/plans');
const afribapay = require('../utils/afribapayService');
const { settleAfribapayTransaction, amountMismatch, flagConflict } = require('../utils/paymentActivation');
const { claimCheck, checkPaymentStatus } = require('../utils/afribapayReconciler');

const FINAL_STATUSES = ['SUCCESS', 'FAILED'];

const getProvider = () => (process.env.PAYMENT_PROVIDER || 'paypal').toLowerCase() === 'afribapay' ? 'afribapay' : 'paypal';

// Identifiant de commande unique, sans espace, jamais réutilisé (même après un échec)
const newOrderId = () => `VC${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

// Statut présenté à la page d'attente
const publicStatus = (payment) => {
  if (payment.conflict) return 'pending';
  if (payment.status === 'completed' || payment.status === 'processed') return 'completed';
  if (payment.status === 'failed') return 'failed';
  return 'pending';
};

const userKey = (req) => String(req.user?._id || req.ip);
const initiateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, keyGenerator: userKey, standardHeaders: 'draft-7', legacyHeaders: false });
const statusLimiter = rateLimit({ windowMs: 60 * 1000, limit: 40, keyGenerator: userKey, standardHeaders: 'draft-7', legacyHeaders: false });

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payments/config  (public) — moyen de paiement actif, prix et opérateurs
// ──────────────────────────────────────────────────────────────────────────────
router.get('/config', async (req, res) => {
  const provider = getProvider();
  if (provider !== 'afribapay') return res.json({ provider });

  const operators = await afribapay.getOperatorsSafe(MOBILE_MONEY_COUNTRY, MOBILE_MONEY_CURRENCY);
  res.json({
    provider,
    country: MOBILE_MONEY_COUNTRY,
    currency: MOBILE_MONEY_CURRENCY,
    plans: Object.fromEntries(Object.entries(PLANS).map(([id, p]) => [id, { amount: p.amount }])),
    operators,
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payments/afribapay/initiate  (client connecté)
// Corps : { planId, operator, phoneNumber, otpCode?, lang? } — aucun montant accepté
// ──────────────────────────────────────────────────────────────────────────────
router.post('/afribapay/initiate', authenticateClient, initiateLimiter, async (req, res) => {
  if (getProvider() !== 'afribapay') {
    return res.status(404).json({ code: 'PROVIDER_DISABLED', message: 'Paiement Mobile Money indisponible' });
  }
  // Clés absentes : refus net, sans créer de commande
  if (!afribapay.isConfigured()) {
    console.error('[afribapay/initiate] configuration AfribaPay incomplète');
    return res.status(503).json({ code: 'PROVIDER_DISABLED', message: 'Paiement Mobile Money indisponible' });
  }

  const { planId, operator, phoneNumber, otpCode, lang } = req.body || {};
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ code: 'INVALID_PLAN', message: 'Offre invalide' });

  const operators = await afribapay.getOperatorsSafe(MOBILE_MONEY_COUNTRY, MOBILE_MONEY_CURRENCY);
  const op = operators.find((o) => o.code === operator);
  if (!op) return res.status(400).json({ code: 'INVALID_OPERATOR', message: 'Moyen de paiement invalide' });

  const phone = afribapay.normalizeSenegalPhone(phoneNumber);
  if (!phone) return res.status(400).json({ code: 'INVALID_PHONE', message: 'Numéro de téléphone invalide' });

  const otp = otpCode ? String(otpCode).trim() : '';
  if (op.otpRequired && !/^\d{4,6}$/.test(otp)) {
    return res.status(400).json({ code: 'OTP_REQUIRED', message: 'Code de paiement requis' });
  }

  const orderId = newOrderId();
  // La commande est enregistrée AVANT l'appel à AfribaPay : un webhook ne peut pas arriver sur une commande inconnue
  let payment;
  try {
    payment = await new Payment({
      orderId,
      provider: 'afribapay',
      user: req.user._id,
      planId,
      planName: plan.name,
      amount: plan.amount,
      currency: MOBILE_MONEY_CURRENCY,
      customerEmail: req.user.email,
      operator: op.code,
      phoneNumber: phone,
      status: 'pending',
      providerStatus: 'INITIATED',
    }).save();
  } catch (err) {
    console.error('[afribapay/initiate] enregistrement impossible:', err.message);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Erreur serveur' });
  }

  const frontendUrl = (process.env.FRONTEND_URL || '').trim().replace(/\/$/, '');
  // AfribaPay refuse les adresses de retour non publiques (ex. http://localhost) : HTTPS uniquement
  const pendingUrl = frontendUrl.startsWith('https://')
    ? `${frontendUrl}/payment/pending?order=${encodeURIComponent(orderId)}`
    : undefined;

  let tx;
  try {
    tx = await afribapay.payin({
      operator: op.code,
      phoneNumber: phone,
      amount: plan.amount,
      currency: MOBILE_MONEY_CURRENCY,
      country: MOBILE_MONEY_COUNTRY,
      orderId,
      otpCode: op.otpRequired ? otp : undefined,
      lang,
      returnUrl: pendingUrl,
      cancelUrl: pendingUrl,
    });
  } catch (err) {
    console.warn(`[afribapay/initiate] ${orderId} (${afribapay.maskPhone(phone)}, ${op.code}): ${err.message}`);
    // Délai dépassé ou erreur 5xx : le paiement a pu partir, on attend son statut réel
    if (!err.httpStatus || err.httpStatus >= 500 || err.httpStatus === 408) {
      await Payment.updateOne({ _id: payment._id }, { $set: { providerStatus: 'PENDING' } });
      return res.status(202).json({ orderId, status: 'pending', operator: op.code });
    }
    // Requête refusée (4xx) : la commande reste « pending » et sera revérifiée, le client peut réessayer
    await Payment.updateOne({ _id: payment._id }, { $set: { providerStatus: 'INIT_ERROR', failureReason: `initiate_${err.httpStatus}` } });
    // 404 « Operator configuration missing » : opérateur non activé sur le compte marchand
    if (err.httpStatus === 404) {
      return res.status(502).json({ code: 'OPERATOR_UNAVAILABLE', message: 'Ce moyen de paiement est indisponible pour le moment.' });
    }
    return res.status(502).json({ code: 'PAYIN_REJECTED', message: 'Le paiement a été refusé. Vérifiez le numéro et le code, puis réessayez.' });
  }

  const update = { providerStatus: String(tx.status || 'PENDING').toUpperCase() };
  if (tx.transaction_id) update.transactionId = tx.transaction_id;
  try {
    await Payment.updateOne({ _id: payment._id }, { $set: update });
  } catch (err) {
    console.error(`[afribapay/initiate] ${orderId} mise à jour impossible: ${err.message}`);
  }
  console.log(`[afribapay/initiate] ${orderId} ${op.code} ${afribapay.maskPhone(phone)} ${plan.amount} XOF -> ${update.providerStatus}`);

  // Statut déjà final dans la réponse : on le confirme par GET /v1/status, jamais par cette réponse seule
  let status = 'pending';
  if (FINAL_STATUSES.includes(update.providerStatus)) {
    const fresh = await Payment.findById(payment._id);
    const claimed = await claimCheck(fresh, 0);
    if (claimed) status = publicStatus(await checkPaymentStatus(claimed, 'initiate+status'));
  }

  res.status(201).json({
    orderId,
    status,
    operator: op.code,
    providerLink: op.code === 'wave' && typeof tx.provider_link === 'string' ? tx.provider_link : undefined,
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payments/afribapay/webhook  (AfribaPay — protégé par la signature uniquement)
// Le corps brut est fourni par express.raw dans index.js, avant express.json.
// ──────────────────────────────────────────────────────────────────────────────
router.post('/afribapay/webhook', async (req, res) => {
  const rawBody = req.body;
  if (!Buffer.isBuffer(rawBody) || rawBody.length === 0) {
    return res.status(400).type('text/plain').send('Empty webhook payload.');
  }

  const signature = req.get('Afribapay-Sign') || req.headers.afribapay_sign;
  if (!afribapay.verifySignature(rawBody, signature)) {
    console.warn('[afribapay/webhook] signature absente ou invalide');
    return res.status(403).type('text/plain').send('Invalid webhook signature.');
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).type('text/plain').send('Invalid JSON payload.');
  }
  if (!event || typeof event.order_id !== 'string' || typeof event.status !== 'string') {
    return res.status(400).type('text/plain').send('Missing or invalid transaction fields.');
  }

  try {
    const payment = await Payment.findOneAndUpdate(
      { orderId: event.order_id, provider: 'afribapay' },
      { $set: { webhookReceivedAt: new Date() } },
      { new: true }
    );
    if (!payment) {
      // Commande inconnue : aucune opération
      console.warn(`[afribapay/webhook] commande inconnue ${event.order_id}`);
      return res.status(200).type('text/plain').send('OK');
    }

    // Un SUCCESS signé dont le montant ou la devise diffère de la commande n'active jamais
    if (String(event.status).toUpperCase() === 'SUCCESS') {
      const mismatch = amountMismatch(event, payment);
      if (mismatch) {
        await flagConflict(payment, `webhook_${mismatch}`);
        return res.status(200).type('text/plain').send('OK');
      }
    }

    // Double vérification par GET /v1/status ; si elle n'est pas concluante, le webhook signé fait foi
    let tx = event;
    let via = 'webhook';
    try {
      const confirmed = await afribapay.getStatus(payment.orderId);
      const confirmedStatus = String(confirmed?.status || '').toUpperCase();
      if (FINAL_STATUSES.includes(confirmedStatus)) {
        if (FINAL_STATUSES.includes(String(event.status).toUpperCase()) && confirmedStatus !== String(event.status).toUpperCase()) {
          await Payment.updateOne({ _id: payment._id }, { $set: { conflict: true, failureReason: `webhook_${event.status}_vs_status_${confirmedStatus}` } });
          console.error(`[afribapay/webhook] statuts contradictoires pour ${payment.orderId}`);
          return res.status(200).type('text/plain').send('OK');
        }
        tx = confirmed;
        via = 'webhook+status';
      }
    } catch (err) {
      console.warn(`[afribapay/webhook] /v1/status indisponible pour ${payment.orderId}: ${err.message}`);
    }

    await settleAfribapayTransaction(payment, tx, via);
    // 200 seulement après enregistrement durable
    return res.status(200).type('text/plain').send('OK');
  } catch (err) {
    console.error('[afribapay/webhook] traitement impossible:', err.message);
    return res.status(500).type('text/plain').send('Webhook processing failed.');
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/payments/afribapay/orders/:orderId  (propriétaire de la commande)
// La page d'attente interroge ce serveur, jamais AfribaPay directement.
// ──────────────────────────────────────────────────────────────────────────────
router.get('/afribapay/orders/:orderId', authenticateClient, statusLimiter, async (req, res) => {
  try {
    let payment = await Payment.findOne({ orderId: String(req.params.orderId), provider: 'afribapay', user: req.user._id });
    if (!payment) return res.status(404).json({ code: 'NOT_FOUND', message: 'Commande introuvable' });

    if (payment.status === 'pending' && !payment.conflict) {
      const claimed = await claimCheck(payment, 10 * 1000);
      if (claimed) payment = await checkPaymentStatus(claimed, 'status');
    }

    res.json({
      orderId: payment.orderId,
      status: publicStatus(payment),
      planId: payment.planId,
      amount: payment.amount,
      currency: payment.currency,
      operator: payment.operator,
      periodEnd: payment.periodEnd || null,
    });
  } catch (err) {
    console.error('[afribapay/orders] erreur:', err.message);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Erreur serveur' });
  }
});

module.exports = router;
