const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Newsletter = require('../models/Newsletter');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Admin = require('../models/Admin');
const { sendEmail } = require('../utils/emailService');
const { createUnifiedEmailTemplate } = require('../utils/emailTemplates');
const router = express.Router();

// Middleware d'authentification admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin non autorisé' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token invalide' 
    });
  }
};

// Route publique : S'abonner à la newsletter
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail(),
  body('firstName').optional().trim(),
  body('lastName').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, firstName, lastName, source = 'footer' } = req.body;

    // Vérifier si l'email existe déjà
    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà abonné à la newsletter'
        });
      } else {
        // Réactiver l'abonnement
        subscriber.isActive = true;
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        subscriber.firstName = firstName || subscriber.firstName;
        subscriber.lastName = lastName || subscriber.lastName;
        await subscriber.save();
        
        return res.json({
          success: true,
          message: 'Abonnement réactivé avec succès'
        });
      }
    }

    // Créer un nouvel abonné
    subscriber = new NewsletterSubscriber({
      email,
      firstName,
      lastName,
      source,
      isActive: true
    });
    await subscriber.save();

    res.json({
      success: true,
      message: 'Abonnement à la newsletter réussi'
    });
  } catch (error) {
    console.error('Erreur lors de l\'abonnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'abonnement'
    });
  }
});

// Route publique : Se désabonner
router.post('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const subscriber = await NewsletterSubscriber.findOne({ 
      unsubscribeToken: token 
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Token de désabonnement invalide'
      });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Désabonnement réussi'
    });
  } catch (error) {
    console.error('Erreur lors du désabonnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du désabonnement'
    });
  }
});

// ========== ROUTES ADMIN ==========

// Obtenir toutes les newsletters
router.get('/admin/list', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    const newsletters = await Newsletter.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments(query);

    res.json({
      success: true,
      newsletters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des newsletters:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des newsletters'
    });
  }
});

// Obtenir une newsletter spécifique
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter non trouvée'
      });
    }

    res.json({
      success: true,
      newsletter
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la newsletter'
    });
  }
});

// Créer une nouvelle newsletter
router.post('/admin/create', authenticateAdmin, [
  body('subject').trim().notEmpty().withMessage('Le sujet est requis'),
  body('content').notEmpty().withMessage('Le contenu est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { subject, content, previewText, imageUrl, recipients, scheduledAt } = req.body;

    const newsletter = new Newsletter({
      subject,
      content,
      previewText,
      imageUrl,
      recipients: recipients || { type: 'all' },
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? 'scheduled' : 'draft',
      createdBy: req.admin._id
    });

    await newsletter.save();

    res.status(201).json({
      success: true,
      message: 'Newsletter créée avec succès',
      newsletter
    });
  } catch (error) {
    console.error('Erreur lors de la création de la newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la newsletter'
    });
  }
});

// Mettre à jour une newsletter
router.put('/admin/:id', authenticateAdmin, [
  body('subject').optional().trim().notEmpty(),
  body('content').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { subject, content, previewText, imageUrl, recipients, scheduledAt } = req.body;

    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter non trouvée'
      });
    }

    // Ne pas permettre la modification si déjà envoyée
    if (newsletter.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une newsletter déjà envoyée'
      });
    }

    if (subject) newsletter.subject = subject;
    if (content) newsletter.content = content;
    if (previewText !== undefined) newsletter.previewText = previewText;
    if (imageUrl !== undefined) newsletter.imageUrl = imageUrl;
    if (recipients) newsletter.recipients = recipients;
    if (scheduledAt) {
      newsletter.scheduledAt = new Date(scheduledAt);
      newsletter.status = 'scheduled';
    }

    await newsletter.save();

    res.json({
      success: true,
      message: 'Newsletter mise à jour avec succès',
      newsletter
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la newsletter'
    });
  }
});

// Prévisualiser une newsletter (retourne le HTML formaté)
router.post('/admin/:id/preview', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, previewText, content, imageUrl } = req.body;

    let newsletter = null;
    
    // Si l'ID n'est pas "new", essayer de charger depuis la base de données
    if (id !== 'new') {
      newsletter = await Newsletter.findById(id);
    }

    // Utiliser les données de la requête si disponibles, sinon celles de la newsletter
    const newsletterSubject = subject || newsletter?.subject || 'Sujet de la newsletter';
    const newsletterPreviewText = previewText || newsletter?.previewText || '';
    const newsletterContent = content || newsletter?.content || '';
    const newsletterImageUrl = imageUrl || newsletter?.imageUrl || null;

    // Générer le HTML de prévisualisation
    const previewHTML = createUnifiedEmailTemplate({
      language: 'fr',
      title: newsletterSubject,
      subtitle: newsletterPreviewText,
      content: newsletterContent,
      imageUrl: newsletterImageUrl,
      buttons: [],
      note: 'Ceci est un aperçu de votre newsletter'
    });

    res.json({
      success: true,
      preview: previewHTML,
      newsletter: {
        subject: newsletterSubject,
        previewText: newsletterPreviewText,
        content: newsletterContent,
        imageUrl: newsletterImageUrl
      }
    });
  } catch (error) {
    console.error('Erreur lors de la prévisualisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la prévisualisation'
    });
  }
});

// Obtenir la liste des abonnés
router.get('/admin/subscribers', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NewsletterSubscriber.countDocuments(query);
    const activeCount = await NewsletterSubscriber.countDocuments({ isActive: true });

    res.json({
      success: true,
      subscribers,
      stats: {
        total,
        active: activeCount,
        inactive: total - activeCount
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des abonnés'
    });
  }
});

// Obtenir le nombre d'abonnés actifs
router.get('/admin/subscribers/count', authenticateAdmin, async (req, res) => {
  try {
    const { type, tags, customEmails } = req.query;

    let count = 0;

    if (type === 'all') {
      count = await NewsletterSubscriber.countDocuments({ isActive: true });
    } else if (type === 'active') {
      count = await NewsletterSubscriber.countDocuments({ isActive: true });
    } else if (type === 'tags' && tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      count = await NewsletterSubscriber.countDocuments({
        isActive: true,
        tags: { $in: tagArray }
      });
    } else if (type === 'custom' && customEmails) {
      const emailArray = Array.isArray(customEmails) ? customEmails : customEmails.split(',');
      count = emailArray.length;
    }

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Erreur lors du comptage des abonnés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des abonnés'
    });
  }
});

// Envoyer une newsletter
router.post('/admin/:id/send', authenticateAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter non trouvée'
      });
    }

    if (newsletter.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cette newsletter a déjà été envoyée'
      });
    }

    if (newsletter.status === 'sending') {
      return res.status(400).json({
        success: false,
        message: 'Cette newsletter est en cours d\'envoi'
      });
    }

    // Obtenir la liste des destinataires
    let subscribers = [];

    if (newsletter.recipients.type === 'all') {
      subscribers = await NewsletterSubscriber.find({ isActive: true });
    } else if (newsletter.recipients.type === 'active') {
      subscribers = await NewsletterSubscriber.find({ isActive: true });
    } else if (newsletter.recipients.type === 'tags' && newsletter.recipients.tags) {
      subscribers = await NewsletterSubscriber.find({
        isActive: true,
        tags: { $in: newsletter.recipients.tags }
      });
    } else if (newsletter.recipients.type === 'custom' && newsletter.recipients.customEmails) {
      subscribers = newsletter.recipients.customEmails.map(email => ({ email }));
    }

    const totalRecipients = subscribers.length;

    if (totalRecipients === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun destinataire trouvé'
      });
    }

    // Mettre à jour le statut
    newsletter.status = 'sending';
    newsletter.stats.totalRecipients = totalRecipients;
    await newsletter.save();

    // Générer le HTML de la newsletter
    const newsletterHTML = createUnifiedEmailTemplate({
      language: 'fr',
      title: newsletter.subject,
      subtitle: newsletter.previewText || '',
      content: newsletter.content,
      imageUrl: newsletter.imageUrl || null,
      buttons: [],
      note: 'Vous recevez cet email car vous êtes abonné à la newsletter vitalCHECK.'
    });

    // Envoyer les emails (en arrière-plan)
    let sent = 0;
    let delivered = 0;
    let bounced = 0;

    // Envoyer par lots pour éviter de surcharger le serveur
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (subscriber) => {
          try {
            // Générer le token de désabonnement si nécessaire
            if (!subscriber.unsubscribeToken) {
              subscriber.generateUnsubscribeToken();
              await subscriber.save();
            }

            const unsubscribeUrl = `${process.env.CLIENT_URL || 'https://www.checkmyenterprise.com'}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;

            // Ajouter le lien de désabonnement au bas de l'email
            const emailHTML = newsletterHTML.replace(
              '</body>',
              `<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="font-size: 12px; color: #718096;">
                  <a href="${unsubscribeUrl}" style="color: #718096; text-decoration: underline;">Se désabonner</a>
                </p>
              </div></body>`
            );

            await sendEmail({
              to: subscriber.email,
              subject: newsletter.subject,
              html: emailHTML
            });

            sent++;
            delivered++;
          } catch (error) {
            console.error(`Erreur lors de l'envoi à ${subscriber.email}:`, error);
            bounced++;
          }
        })
      );

      // Petite pause entre les lots
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Mettre à jour les statistiques
    newsletter.status = 'sent';
    newsletter.sentAt = new Date();
    newsletter.stats.sent = sent;
    newsletter.stats.delivered = delivered;
    newsletter.stats.bounced = bounced;
    await newsletter.save();

    res.json({
      success: true,
      message: `Newsletter envoyée à ${sent} destinataires`,
      stats: {
        totalRecipients,
        sent,
        delivered,
        bounced
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la newsletter:', error);
    
    // Remettre le statut en draft en cas d'erreur
    const newsletter = await Newsletter.findById(req.params.id);
    if (newsletter && newsletter.status === 'sending') {
      newsletter.status = 'draft';
      await newsletter.save();
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la newsletter'
    });
  }
});

// Supprimer une newsletter
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter non trouvée'
      });
    }

    if (newsletter.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une newsletter déjà envoyée'
      });
    }

    await Newsletter.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Newsletter supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la newsletter'
    });
  }
});

module.exports = router;
