const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Team = require('../models/Team');
const { authenticateAdmin, authenticateClient } = require('../middleware/auth');
const { verifyPayPalOrder, verifyPayPalWebhook } = require('../utils/paypalService');
const {
  sendPaymentEmail,
  sendAccountCreatedEmail,
  sendSubscriptionUpgradeEmail,
} = require('../utils/emailService');

// ──────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────────────────────────────────────

// Apply a validated plan to a user and persist the Payment record
const applyPlanToUser = async ({ user, planId, planName, orderId, amount, currency, paymentDetails, paypalOrderId }) => {
  const endDate = planId === 'diagnostic'
    ? null
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

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
    startDate: new Date(),
    endDate,
    paymentId: payment._id,
  };

  user.subscription = newSub;
  user.isPremium = ['premium', 'diagnostic'].includes(planId);
  await user.save();

  // Sync subscription to the user's team (Phase A+)
  if (user.team) {
    try {
      await Team.findByIdAndUpdate(user.team, { subscription: newSub });
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
    message: `Paiement ${amount} ${currency} — plan ${planName} (${user.email})`,
    user: { id: user._id, name: user.companyName, email: user.email },
  }).save().catch(err => console.error('[payments] notification failed:', err.message));

  return { payment, user, tempPassword };
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payments/record  (authenticated — requires valid client JWT)
// ──────────────────────────────────────────────────────────────────────────────
router.post('/record', authenticateClient, async (req, res) => {
  try {
    const { orderId, planId, planName, amount, currency = 'USD', paypalOrderId, paymentDetails } = req.body;

    if (!orderId || !planId) {
      return res.status(400).json({ message: 'orderId et planId requis' });
    }

    // ── 1. Verify the transaction with PayPal servers ──
    try {
      await verifyPayPalOrder(orderId, planId);
    } catch (verifyErr) {
      console.error('[payments/record] PayPal verification failed:', verifyErr.message);
      return res.status(402).json({
        message: 'Transaction PayPal non valide — paiement refusé',
        detail: verifyErr.message,
      });
    }

    // ── 2. The authenticated user is req.user (from JWT) ──
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // ── 3. Idempotency: already recorded? ──
    const existing = await Payment.findOne({ orderId });
    if (existing) {
      return res.status(200).json({ message: 'Paiement déjà enregistré', payment: existing });
    }

    // ── 4. Apply plan ──
    const { payment } = await applyPlanToUser({
      user, planId, planName, orderId,
      amount, currency, paymentDetails,
      paypalOrderId: paypalOrderId || orderId,
    });

    res.status(201).json({
      message: 'Paiement enregistré avec succès',
      payment,
    });
  } catch (error) {
    console.error('[payments/record] error:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/payments/webhook  (PayPal webhook — raw body, no auth middleware)
// ──────────────────────────────────────────────────────────────────────────────
router.post('/webhook', async (req, res) => {
  // Respond 200 immediately so PayPal doesn't retry — process asynchronously
  res.status(200).send('OK');

  try {
    const rawBody = req.rawBody;
    if (!rawBody) {
      console.warn('[webhook] rawBody absent — check index.js JSON verify callback');
      return;
    }

    // ── Verify PayPal signature ──
    const webhookIdConfigured = !!process.env.PAYPAL_WEBHOOK_ID;
    if (webhookIdConfigured) {
      let signatureValid = false;
      try {
        signatureValid = await verifyPayPalWebhook(req.headers, rawBody);
      } catch (sigErr) {
        console.error('[webhook] signature verification error:', sigErr.message);
        return;
      }
      if (!signatureValid) {
        console.warn('[webhook] Invalid PayPal signature — event ignored');
        return;
      }
    } else {
      console.warn('[webhook] PAYPAL_WEBHOOK_ID absent — signature verification skipped (sandbox only)');
    }

    const event = JSON.parse(rawBody.toString());
    console.log('[webhook] Received event:', event.event_type);

    if (event.event_type !== 'PAYMENT.CAPTURE.COMPLETED') return;

    const capture = event.resource;
    const orderId = capture.supplementary_data?.related_ids?.order_id || capture.id;

    // ── Idempotency: skip if already processed ──
    if (await Payment.findOne({ orderId })) {
      console.log('[webhook] Order already recorded, skipping:', orderId);
      return;
    }

    // ── Resolve plan from custom_id or description ──
    const description = (capture.purchase_units?.[0]?.description || '').toLowerCase();
    let planId = 'standard';
    if (description.includes('premium')) planId = 'premium';
    else if (description.includes('diagnostic')) planId = 'diagnostic';

    // ── Find user by payer email ──
    const payerEmail = event.resource?.payer?.email_address?.toLowerCase();
    if (!payerEmail) {
      console.warn('[webhook] No payer email in event');
      return;
    }

    let user = await User.findOne({ email: payerEmail });
    if (!user) {
      // Create a minimal user account (no password — they'll receive one via email)
      user = new User({
        email: payerEmail,
        companyName: payerEmail,
        sector: 'other',
        companySize: 'sme',
      });
    }

    const amount = parseFloat(capture.amount?.value || 0);

    await applyPlanToUser({
      user,
      planId,
      planName: planId.charAt(0).toUpperCase() + planId.slice(1),
      orderId,
      amount,
      currency: capture.amount?.currency_code || 'USD',
      paypalOrderId: capture.id,
      paymentDetails: capture,
    });

    console.log(`[webhook] Plan ${planId} applied to ${payerEmail}`);
  } catch (err) {
    console.error('[webhook] processing error:', err.message);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// Admin routes  (all protected)
// ──────────────────────────────────────────────────────────────────────────────

router.get('/payments', authenticateAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();
    res.json({ payments });
  } catch (error) {
    console.error('[payments admin list]', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/payments/:id/send-email', authenticateAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });

    await sendPaymentEmail(payment.customerEmail, req.body.subject, req.body.message);

    payment.emailSent = true;
    payment.emailSentAt = new Date();
    payment.status = 'processed';
    await payment.save();

    res.json({ message: 'Email envoyé', payment });
  } catch (error) {
    console.error('[payments admin email]', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.patch('/payments/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.json({ message: 'Statut mis à jour', payment });
  } catch (error) {
    console.error('[payments admin status]', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/payments/export', authenticateAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();
    const csvHeader = 'Date,Email,Plan,Montant,Devise,Statut,Email Envoyé,Order ID\n';
    const csvRows = payments.map(p => {
      const date = new Date(p.createdAt).toLocaleDateString('fr-FR');
      return `${date},"${p.customerEmail}","${p.planName}",${p.amount},${p.currency},${p.status},${p.emailSent ? 'Oui' : 'Non'},"${p.orderId}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    res.send(csvHeader + csvRows);
  } catch (error) {
    console.error('[payments admin export]', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
