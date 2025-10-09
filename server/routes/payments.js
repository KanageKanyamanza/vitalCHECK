const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { authenticateAdmin } = require('../utils/auth');
const { sendPaymentEmail, sendAccountCreatedEmail, sendSubscriptionUpgradeEmail } = require('../utils/emailService');

// Enregistrer un nouveau paiement (public - appelé depuis le frontend)
router.post('/record', async (req, res) => {
  try {
    const {
      orderId,
      planId,
      planName,
      amount,
      currency,
      customerEmail,
      paypalOrderId,
      status,
      paymentDetails
    } = req.body;

    // Vérifier si le paiement existe déjà
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(200).json({
        message: 'Payment already recorded',
        payment: existingPayment
      });
    }

    // Créer le paiement
    const payment = new Payment({
      orderId,
      planId,
      planName,
      amount,
      currency,
      customerEmail,
      paypalOrderId,
      status: status || 'pending',
      paymentDetails
    });

    await payment.save();

    // Créer ou mettre à jour le compte utilisateur
    let user = await User.findOne({ email: customerEmail });
    let tempPassword = null;
    let accountCreated = false;

    if (!user) {
      // Créer un nouveau compte utilisateur
      const userModel = new User();
      tempPassword = userModel.generateTempPassword();
      
      user = new User({
        email: customerEmail,
        password: tempPassword,
        companyName: planName, // Temporaire
        sector: 'other',
        companySize: 'sme',
        subscription: {
          plan: planId,
          status: 'active',
          startDate: new Date(),
          endDate: planId === 'diagnostic' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an pour standard/premium
          paymentId: payment._id
        },
        isPremium: ['premium', 'diagnostic'].includes(planId),
        hasAccount: true
      });
      await user.save();
      accountCreated = true;
    } else if (!user.hasAccount) {
      // L'utilisateur existe mais n'a pas de compte actif, créer un mot de passe
      const userModel = new User();
      tempPassword = userModel.generateTempPassword();
      
      user.password = tempPassword;
      user.subscription = {
        plan: planId,
        status: 'active',
        startDate: new Date(),
        endDate: planId === 'diagnostic' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        paymentId: payment._id
      };
      user.isPremium = ['premium', 'diagnostic'].includes(planId);
      user.hasAccount = true;
      await user.save();
      accountCreated = true;
    } else {
      // L'utilisateur a déjà un compte, mettre à jour l'abonnement
      user.subscription = {
        plan: planId,
        status: 'active',
        startDate: new Date(),
        endDate: planId === 'diagnostic' ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        paymentId: payment._id
      };
      user.isPremium = ['premium', 'diagnostic'].includes(planId);
      await user.save();
    }

    // Envoyer l'email selon le contexte
    try {
      if (accountCreated && tempPassword) {
        // NOUVEAU COMPTE - Email avec identifiants
        await sendAccountCreatedEmail(
          customerEmail,
          user.firstName || user.companyName,
          tempPassword,
          planName
        );
        console.log('✅ Email création compte envoyé après paiement à:', customerEmail);
      } else {
        // COMPTE EXISTANT - Email de mise à jour d'abonnement
        await sendSubscriptionUpgradeEmail(
          customerEmail,
          user.firstName || user.companyName,
          planName,
          planId
        );
        console.log('✅ Email mise à jour abonnement envoyé à:', customerEmail);
      }
    } catch (emailError) {
      console.error('❌ Erreur envoi email paiement:', emailError);
      // Continue même si l'email échoue
    }

    // Créer une notification pour l'admin
    try {
      const notification = new Notification({
        type: 'payment',
        title: 'Nouveau paiement reçu',
        message: `Paiement de ${amount} ${currency} pour le plan ${planName}`,
        priority: 'high',
        metadata: {
          paymentId: payment._id,
          orderId,
          planId,
          amount,
          customerEmail,
          accountCreated
        }
      });
      await notification.save();
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Continue even if notification fails
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment,
      accountCreated
    });

  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      message: 'Error recording payment',
      error: error.message
    });
  }
});

// Routes admin (protégées)

// Récupérer tous les paiements
router.get('/payments', authenticateAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      message: 'Error fetching payments',
      error: error.message
    });
  }
});

// Envoyer un email à un client
router.post('/payments/:id/send-email', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Envoyer l'email
    await sendPaymentEmail(payment.customerEmail, subject, message);

    // Mettre à jour le statut de l'email ET marquer comme processed
    payment.emailSent = true;
    payment.emailSentAt = new Date();
    payment.status = 'processed'; // Automatiquement marquer comme traité
    await payment.save();

    res.json({
      message: 'Email sent successfully',
      payment
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      message: 'Error sending email',
      error: error.message
    });
  }
});

// Mettre à jour le statut d'un paiement
router.patch('/payments/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      message: 'Payment status updated',
      payment
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      message: 'Error updating payment status',
      error: error.message
    });
  }
});

// Exporter les paiements en CSV
router.get('/payments/export', authenticateAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();

    // Créer le CSV
    const csvHeader = 'Date,Email,Plan,Montant,Devise,Statut,Email Envoyé,Order ID\n';
    const csvRows = payments.map(p => {
      const date = new Date(p.createdAt).toLocaleDateString('fr-FR');
      return `${date},"${p.customerEmail}","${p.planName}",${p.amount},${p.currency},${p.status},${p.emailSent ? 'Oui' : 'Non'},"${p.orderId}"`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting payments:', error);
    res.status(500).json({
      message: 'Error exporting payments',
      error: error.message
    });
  }
});

module.exports = router;

