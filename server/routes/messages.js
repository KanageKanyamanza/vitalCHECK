const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const emailSyncService = require('../utils/emailSyncService');
const { emailService } = require('../utils/emailService');
const { authenticateAdmin } = require('../middleware/auth');
const Contact = require('../models/Contact');
const MailingContact = require('../models/MailingContact');
const User = require('../models/User');
const { createUnifiedEmailTemplate } = require('../utils/emailTemplates');

/**
 * @route   POST /api/messages/sync
 * @desc    Déclencher manuellement la synchronisation IMAP
 * @access  Admin
 */
router.post('/sync', authenticateAdmin, async (req, res) => {
  try {
    const result = await emailSyncService.sync();
    res.json({ success: true, message: 'Synchronisation effectuée' });
  } catch (error) {
    console.error('Sync route error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la synchronisation', 
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/messages/:contactId
 * @desc    Récupérer l'historique des messages pour un contact spécifique
 * @access  Admin
 */
router.get('/:contactId', authenticateAdmin, async (req, res) => {
  try {
    const { contactId } = req.params;
    const messages = await Message.find({ contactId })
      .sort({ date: 1 });
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des messages' });
  }
});

/**
 * @route   GET /api/messages/inbox/recent
 * @desc    Récupérer les derniers messages reçus (tous contacts confondus)
 * @access  Admin
 */
router.get('/inbox/recent', authenticateAdmin, async (req, res) => {
  try {
    const messages = await Message.find({ direction: 'inbound' })
      .sort({ date: -1 })
      .limit(20)
      .populate('contactId');
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get recent messages error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * @route   POST /api/messages/reply
 * @desc    Envoyer une réponse directe à un contact
 * @access  Admin
 */
router.post('/reply', authenticateAdmin, async (req, res) => {
  try {
    const { contactId, body, subject, contactModel } = req.body;

    if (!contactId || !body) {
      return res.status(400).json({ success: false, message: 'ID contact et corps du message requis' });
    }

    // 1. Trouver l'email du contact
    let contact;
    if (contactModel === 'User') contact = await User.findById(contactId);
    else if (contactModel === 'MailingContact') contact = await MailingContact.findById(contactId);
    else contact = await Contact.findById(contactId);

    if (!contact || !contact.email) {
      return res.status(404).json({ success: false, message: 'Contact ou email non trouvé' });
    }

    // 2. Trouver le dernier sujet de conversation
    let finalSubject = subject;
    if (!finalSubject) {
      const lastMessage = await Message.findOne({ contactId }).sort({ createdAt: -1 });
      if (lastMessage && lastMessage.subject) {
        finalSubject = lastMessage.subject;
      } else {
        finalSubject = `Votre demande vitalCHECK`;
      }
    }

    // 3. Préparer le contenu
    const formattedContent = body.replace(/\n/g, '<br>');

    // 4. Envoyer l'email avec le template unifié
    const mailOptions = {
      to: contact.email,
      from: `"${req.admin.name} - vitalCHECK" <${process.env.EMAIL_USER}>`,
      subject: finalSubject,
      html: createUnifiedEmailTemplate({
        language: 'fr',
        title: finalSubject,
        subtitle: `Nouvelle réponse de l'équipe vitalCHECK`,
        content: formattedContent
      }),
      contactId: contact._id,
      contactModel: contactModel || 'Contact',
      rawContent: body // Garder le message pur pour l'historique
    };

    const result = await emailService.sendEmail(mailOptions);

    // Note: saveOutboundEmail est déjà appelé par emailService.sendEmail grâce à notre hook précédent.
    // Cependant, emailService.sendEmail utilise une recherche par email qui pourrait être ambiguë 
    // si l'email existe dans plusieurs modèles. Mais c'est acceptable ici.

    res.json({ 
      success: true, 
      message: 'Réponse envoyée avec succès',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Reply route error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de la réponse' });
  }
});

/**
 * @route   POST /api/messages/bulk-send
 * @desc    Envoyer un message direct à plusieurs contacts sélectionnés
 * @access  Admin
 */
router.post('/bulk-send', authenticateAdmin, async (req, res) => {
  try {
    const { recipientIds, contactModel, subject, body } = req.body;

    if (!recipientIds || !recipientIds.length || !subject || !body) {
      return res.status(400).json({ success: false, message: 'Données manquantes pour l\'envoi groupé' });
    }

    // 1. Trouver tous les destinataires
    let recipients = [];
    if (contactModel === 'User') {
      recipients = await User.find({ _id: { $in: recipientIds } });
    } else if (contactModel === 'MailingContact') {
      recipients = await MailingContact.find({ _id: { $in: recipientIds } });
    } else {
      recipients = await Contact.find({ _id: { $in: recipientIds } });
    }

    // 2. Préparer le contenu
    const formattedContent = body.replace(/\n/g, '<br>');

    // 3. Envoyer à chaque destinataire de manière asynchrone
    const sendPromises = recipients.map(async (recipient) => {
      if (!recipient.email) return null;

      const mailOptions = {
        to: recipient.email,
        from: `"${req.admin.name} - vitalCHECK" <${process.env.EMAIL_USER}>`,
        subject: subject,
          html: createUnifiedEmailTemplate({
            language: 'fr',
            title: subject,
            content: formattedContent
          }),
          contactId: recipient._id,
          contactModel: contactModel || 'Contact',
          rawContent: body // Garder le message pur pour l'historique
        };

      try {
        return await emailService.sendEmail(mailOptions);
      } catch (err) {
        console.error(`Error sending bulk to ${recipient.email}:`, err.message);
        return null;
      }
    });

    // On attend que les envois soient initiés
    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r !== null).length;

    res.json({ 
      success: true, 
      message: `${successCount} messages envoyés avec succès sur ${recipientIds.length}`,
      details: { total: recipientIds.length, success: successCount }
    });
  } catch (error) {
    console.error('Bulk send route error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi groupé' });
  }
});

module.exports = router;
