const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Newsletter = require('../models/Newsletter');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { sendEmail } = require('../utils/emailService');
const { createUnifiedEmailTemplate } = require('../utils/emailTemplates');
const emailQueueService = require('../utils/emailQueueService');
const NewsletterEmail = require('../utils/newsletterEmail');
const { getTrackingPixelResponse } = require('../utils/trackingPixel');
const router = express.Router();

// Utilitaire: retourner les destinataires d'une newsletter (réutilisé pour l'envoi programmé)
async function getSubscribersForNewsletter(newsletter) {
  let subscribers = [];

  if (!newsletter?.recipients?.type) return subscribers;

  if (newsletter.recipients.type === 'all') {
    subscribers = await NewsletterSubscriber.find({ isActive: true });
  } else if (newsletter.recipients.type === 'active') {
    subscribers = await NewsletterSubscriber.find({ isActive: true });
  } else if (
    newsletter.recipients.type === 'tags' &&
    newsletter.recipients.tags &&
    newsletter.recipients.tags.length > 0
  ) {
    subscribers = await NewsletterSubscriber.find({
      isActive: true,
      tags: { $in: newsletter.recipients.tags }
    });
  } else if (
    newsletter.recipients.type === 'custom' &&
    newsletter.recipients.customEmails &&
    newsletter.recipients.customEmails.length > 0
  ) {
    const customEmails = newsletter.recipients.customEmails;

    // Récupérer les abonnés existants (même inactifs, on les inclut quand même)
    subscribers = await NewsletterSubscriber.find({
      email: { $in: customEmails.map(e => e.toLowerCase()) }
    });

    // Si certains emails ne sont pas des abonnés, les ajouter quand même
    const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));
    const missingEmails = customEmails.filter(e => !existingEmails.has(e.toLowerCase()));

    if (missingEmails.length > 0) {
      missingEmails.forEach(email => {
        subscribers.push({
          email: email.toLowerCase(),
          isActive: true,
          _id: null, // Pas un vrai document MongoDB
          generateUnsubscribeToken: function() {},
          save: async function() { return this; }
        });
      });
    }
  }

  return subscribers;
}

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

    // Vérifier si l'email correspond à un utilisateur de la plateforme
    const user = await User.findOne({ email: email.toLowerCase() });
    let finalFirstName = firstName;
    let finalLastName = lastName;

    // Si c'est un utilisateur de la plateforme, utiliser ses informations
    if (user) {
      finalFirstName = firstName || user.firstName || finalFirstName;
      finalLastName = lastName || user.lastName || finalLastName;
    }

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
        // Mettre à jour avec les informations de l'utilisateur si disponible
        subscriber.firstName = finalFirstName || subscriber.firstName;
        subscriber.lastName = finalLastName || subscriber.lastName;
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
      firstName: finalFirstName,
      lastName: finalLastName,
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

// Obtenir la liste des abonnés (DOIT être avant /admin/:id pour éviter les conflits de route)
router.get('/admin/subscribers', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive, search, dateRange } = req.query;
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

    // Filtrer par période (jour, semaine, mois, année)
    if (dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          break;
      }

      if (dateRange === 'today' || dateRange === 'week' || dateRange === 'month' || dateRange === 'year') {
        query.subscribedAt = {
          $gte: startDate,
          $lte: now
        };
      }
    }

    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Enrichir les données avec les informations des utilisateurs de la plateforme
    const enrichedSubscribers = await Promise.all(
      subscribers.map(async (subscriber) => {
        const subscriberObj = subscriber.toObject();
        
        // Vérifier si l'email correspond à un utilisateur de la plateforme
        const user = await User.findOne({ email: subscriber.email.toLowerCase() })
          .select('firstName lastName companyName');
        
        // Si c'est un utilisateur de la plateforme et qu'on n'a pas de nom dans le subscriber
        if (user && (!subscriberObj.firstName || !subscriberObj.lastName)) {
          subscriberObj.firstName = subscriberObj.firstName || user.firstName || '';
          subscriberObj.lastName = subscriberObj.lastName || user.lastName || '';
          subscriberObj.isPlatformUser = true;
          subscriberObj.companyName = user.companyName || null;
        } else if (user) {
          // Même si on a déjà un nom, marquer comme utilisateur de la plateforme
          subscriberObj.isPlatformUser = true;
          subscriberObj.companyName = user.companyName || null;
        } else {
          subscriberObj.isPlatformUser = false;
        }
        
        return subscriberObj;
      })
    );

    const total = await NewsletterSubscriber.countDocuments(query);
    const activeCount = await NewsletterSubscriber.countDocuments({ isActive: true });

    res.json({
      success: true,
      subscribers: enrichedSubscribers,
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

// Obtenir le nombre d'abonnés actifs (DOIT être avant /admin/:id pour éviter les conflits)
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

// Obtenir une newsletter spécifique (DOIT être après les routes spécifiques)
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

    // Gestion de la programmation:
    // - scheduledAt string/date => programmé
    // - scheduledAt null/''      => annuler la programmation (retour en draft si pas envoyé)
    if (scheduledAt === null || scheduledAt === '') {
      newsletter.scheduledAt = null;
      if (newsletter.status !== 'sent') {
        newsletter.status = 'draft';
      }
    } else if (scheduledAt) {
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

// ========== ENVOI PROGRAMMÉ ==========
// Route admin: envoyer toutes les newsletters programmées arrivées à échéance
router.post('/admin/send-scheduled', authenticateAdmin, async (req, res) => {
  try {
    const now = new Date();

    const scheduledNewsletters = await Newsletter.find({
      status: 'scheduled',
      scheduledAt: { $lte: now }
    });

    if (scheduledNewsletters.length === 0) {
      return res.json({
        success: true,
        message: 'Aucune newsletter programmée à envoyer pour le moment',
        processed: 0,
        results: []
      });
    }

    const results = [];

    for (const newsletter of scheduledNewsletters) {
      try {
        if (newsletter.status === 'sending') {
          results.push({ id: newsletter._id, subject: newsletter.subject, status: 'skipped_sending' });
          continue;
        }

        const subscribers = await getSubscribersForNewsletter(newsletter);
        const totalRecipients = subscribers.length;

        if (totalRecipients === 0) {
          results.push({ id: newsletter._id, subject: newsletter.subject, status: 'error', error: 'Aucun destinataire trouvé' });
          continue;
        }

        newsletter.status = 'sending';
        newsletter.stats.totalRecipients = totalRecipients;
        await newsletter.save();

        let jobsAdded = 0;

        for (const subscriber of subscribers) {
          const email = subscriber.email || subscriber.emailAddress;
          if (!email) continue;

          const subscriberId = subscriber._id ? subscriber._id.toString() : null;

          const emailContent = NewsletterEmail.sendNewsletter({
            to: email,
            subject: newsletter.subject,
            htmlContent: newsletter.content,
            imageUrl: newsletter.imageUrl,
            newsletterId: newsletter._id.toString(),
            subscriberId: subscriberId,
            subscriberEmail: email,
            previewText: newsletter.previewText
          });

          emailQueueService.addToQueue({
            to: email,
            subject: newsletter.subject,
            html: emailContent.html,
            text: emailContent.text,
            metadata: {
              newsletterId: newsletter._id.toString(),
              subscriberId: subscriberId,
              emailType: 'newsletter'
            }
          });

          jobsAdded++;
        }

        newsletter.status = 'sent';
        newsletter.sentAt = new Date();
        newsletter.stats.sent = jobsAdded;
        await newsletter.save();

        results.push({
          id: newsletter._id,
          subject: newsletter.subject,
          status: 'sent',
          totalRecipients,
          queued: jobsAdded
        });
      } catch (err) {
        console.error('❌ [NEWSLETTER SEND SCHEDULED] Erreur pour', newsletter?._id, err);
        results.push({
          id: newsletter._id,
          subject: newsletter.subject,
          status: 'error',
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Traitement des newsletters programmées terminé',
      processed: results.length,
      results
    });
  } catch (error) {
    console.error('❌ [NEWSLETTER SEND SCHEDULED] Erreur globale:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi des newsletters programmées'
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

    // Permettre le renvoi même si déjà envoyée
    // Seulement bloquer si en cours d'envoi
    if (newsletter.status === 'sending') {
      return res.status(400).json({
        success: false,
        message: 'Cette newsletter est en cours d\'envoi'
      });
    }

    // Obtenir la liste des destinataires
    let subscribers = [];

    console.log('📧 [NEWSLETTER SEND] Type de destinataires:', newsletter.recipients.type);
    console.log('📧 [NEWSLETTER SEND] Données recipients:', JSON.stringify(newsletter.recipients, null, 2));

    if (newsletter.recipients.type === 'all') {
      subscribers = await NewsletterSubscriber.find({ isActive: true });
      console.log('📧 [NEWSLETTER SEND] Tous les abonnés actifs trouvés:', subscribers.length);
    } else if (newsletter.recipients.type === 'active') {
      subscribers = await NewsletterSubscriber.find({ isActive: true });
      console.log('📧 [NEWSLETTER SEND] Abonnés actifs trouvés:', subscribers.length);
    } else if (newsletter.recipients.type === 'tags' && newsletter.recipients.tags && newsletter.recipients.tags.length > 0) {
      subscribers = await NewsletterSubscriber.find({
        isActive: true,
        tags: { $in: newsletter.recipients.tags }
      });
      console.log('📧 [NEWSLETTER SEND] Abonnés par tags trouvés:', subscribers.length);
    } else if (newsletter.recipients.type === 'custom' && newsletter.recipients.customEmails && newsletter.recipients.customEmails.length > 0) {
      // Pour les emails personnalisés, récupérer les abonnés existants
      const customEmails = newsletter.recipients.customEmails;
      console.log('📧 [NEWSLETTER SEND] Emails personnalisés:', customEmails.length, customEmails);
      
      // Récupérer les abonnés existants (même inactifs, on les inclut quand même)
      subscribers = await NewsletterSubscriber.find({ 
        email: { $in: customEmails.map(e => e.toLowerCase()) }
      });
      
      console.log('📧 [NEWSLETTER SEND] Abonnés existants trouvés:', subscribers.length);
      
      // Si certains emails ne sont pas des abonnés, les ajouter quand même
      const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));
      const missingEmails = customEmails.filter(e => !existingEmails.has(e.toLowerCase()));
      
      if (missingEmails.length > 0) {
        console.log('📧 [NEWSLETTER SEND] Emails non trouvés dans les abonnés:', missingEmails.length, missingEmails);
        // Pour les emails qui ne sont pas des abonnés, créer des objets temporaires
        missingEmails.forEach(email => {
          subscribers.push({ 
            email: email.toLowerCase(),
            isActive: true,
            _id: null, // Pas un vrai document MongoDB
            generateUnsubscribeToken: function() {},
            save: async function() { return this; }
          });
        });
      }
    }

    const totalRecipients = subscribers.length;
    console.log('📧 [NEWSLETTER SEND] Total destinataires:', totalRecipients);

    if (totalRecipients === 0) {
      console.error('❌ [NEWSLETTER SEND] Aucun destinataire trouvé!');
      console.error('❌ [NEWSLETTER SEND] Newsletter ID:', newsletter._id);
      console.error('❌ [NEWSLETTER SEND] Recipients type:', newsletter.recipients?.type);
      console.error('❌ [NEWSLETTER SEND] Recipients data:', JSON.stringify(newsletter.recipients, null, 2));
      return res.status(400).json({
        success: false,
        message: `Aucun destinataire trouvé. Type: ${newsletter.recipients?.type || 'non défini'}. Vérifiez que les destinataires sélectionnés existent et sont actifs.`
      });
    }

    // Mettre à jour le statut
    newsletter.status = 'sending';
    newsletter.stats.totalRecipients = totalRecipients;
    await newsletter.save();

    // Ajouter tous les emails à la file d'attente
    let jobsAdded = 0;
    
    for (const subscriber of subscribers) {
      const email = subscriber.email || subscriber.emailAddress;
      
      if (!email) {
        console.error('📧 [NEWSLETTER SEND] Email manquant pour le subscriber:', subscriber);
        continue;
      }

      // Obtenir l'ID de l'abonné (peut être null pour les emails personnalisés)
      const subscriberId = subscriber._id ? subscriber._id.toString() : null;
      
      // Générer le contenu de l'email avec le template NewsletterEmail
      const emailContent = NewsletterEmail.sendNewsletter({
        to: email,
        subject: newsletter.subject,
        htmlContent: newsletter.content,
        imageUrl: newsletter.imageUrl,
        newsletterId: newsletter._id.toString(),
        subscriberId: subscriberId,
        subscriberEmail: email,
        previewText: newsletter.previewText
      });

      // Ajouter à la file d'attente
      emailQueueService.addToQueue({
        to: email,
        subject: newsletter.subject,
        html: emailContent.html,
        text: emailContent.text,
        metadata: {
          newsletterId: newsletter._id.toString(),
          subscriberId: subscriberId,
          emailType: 'newsletter'
        }
      });

      jobsAdded++;
    }

    console.log(`📬 [NEWSLETTER SEND] ${jobsAdded} email(s) ajouté(s) à la file d'attente`);

    // Mettre à jour le statut (l'envoi se fera en arrière-plan via la queue)
    newsletter.status = 'sent';
    newsletter.sentAt = new Date();
    newsletter.stats.sent = jobsAdded;
    await newsletter.save();

    res.json({
      success: true,
      message: `Newsletter ajoutée à la file d'attente. ${jobsAdded} email(s) seront envoyé(s) progressivement.`,
      stats: {
        totalRecipients,
        sent: jobsAdded,
        queued: jobsAdded
      }
    });
  } catch (error) {
    console.error('❌ [NEWSLETTER SEND] Erreur lors de l\'envoi de la newsletter:', error);
    console.error('❌ [NEWSLETTER SEND] Stack:', error.stack);
    
    // Remettre le statut en draft en cas d'erreur
    try {
      const newsletter = await Newsletter.findById(req.params.id);
      if (newsletter && newsletter.status === 'sending') {
        newsletter.status = 'draft';
        await newsletter.save();
      }
    } catch (saveError) {
      console.error('❌ [NEWSLETTER SEND] Erreur lors de la restauration du statut:', saveError);
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Envoyer une newsletter directement à des emails spécifiques (sans créer de newsletter dans la DB)
router.post('/admin/send-direct', authenticateAdmin, [
  body('subject').trim().notEmpty().withMessage('Le sujet est requis'),
  body('content').notEmpty().withMessage('Le contenu est requis'),
  body('emails').isArray().withMessage('Les emails doivent être un tableau'),
  body('emails.*').isEmail().withMessage('Chaque email doit être valide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { subject, content, previewText, imageUrl, emails } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun email fourni'
      });
    }

    // Générer le HTML de la newsletter
    const newsletterHTML = createUnifiedEmailTemplate({
      language: 'fr',
      title: subject,
      subtitle: previewText || '',
      content: content,
      imageUrl: imageUrl || null,
      buttons: [],
      note: 'Vous recevez cet email car vous êtes abonné à la newsletter vitalCHECK.'
    });

    // Envoyer les emails (en arrière-plan)
    let sent = 0;
    let delivered = 0;
    let bounced = 0;

    // Envoyer par lots pour éviter de surcharger le serveur
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (email) => {
          try {
            // Récupérer le subscriber pour générer le token de désabonnement
            const subscriber = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
            
            let unsubscribeUrl = '';
            if (subscriber) {
              if (!subscriber.unsubscribeToken) {
                subscriber.generateUnsubscribeToken();
                await subscriber.save();
              }
              unsubscribeUrl = `${process.env.CLIENT_URL || 'https://www.checkmyenterprise.com'}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
            }

            // Ajouter le lien de désabonnement au bas de l'email
            const emailHTML = unsubscribeUrl
              ? newsletterHTML.replace(
                  '</body>',
                  `<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="font-size: 12px; color: #718096;">
                      <a href="${unsubscribeUrl}" style="color: #718096; text-decoration: underline;">Se désabonner</a>
                    </p>
                  </div></body>`
                )
              : newsletterHTML;

            await sendEmail({
              to: email,
              subject: subject,
              html: emailHTML
            });

            sent++;
            delivered++;
          } catch (error) {
            console.error(`Erreur lors de l'envoi à ${email}:`, error);
            bounced++;
          }
        })
      );

      // Petite pause entre les lots
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      message: `Newsletter envoyée à ${sent} destinataire(s)`,
      stats: {
        totalRecipients: emails.length,
        sent,
        delivered,
        bounced
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi direct de la newsletter:', error);
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

// Route publique : Tracking des ouvertures d'email (pixel invisible)
router.get('/track/:id/:subscriberId', async (req, res) => {
  try {
    const { id: newsletterId, subscriberId } = req.params;

    // Vérifier que la newsletter existe
    const newsletter = await Newsletter.findById(newsletterId);
    if (!newsletter) {
      console.error(`❌ [TRACK] Newsletter ${newsletterId} non trouvée`);
      // Retourner quand même le pixel pour ne pas révéler l'erreur
      const pixelResponse = getTrackingPixelResponse();
      res.set(pixelResponse.headers);
      return res.send(pixelResponse.buffer);
    }

    // Vérifier que l'abonné existe
    const subscriber = await NewsletterSubscriber.findById(subscriberId);
    if (!subscriber) {
      console.error(`❌ [TRACK] Subscriber ${subscriberId} non trouvé`);
      // Retourner quand même le pixel
      const pixelResponse = getTrackingPixelResponse();
      res.set(pixelResponse.headers);
      return res.send(pixelResponse.buffer);
    }

    // Ajouter le subscriberId au tableau opens si pas déjà présent
    const subscriberObjectId = subscriber._id;
    if (!newsletter.opens.includes(subscriberObjectId)) {
      newsletter.opens.push(subscriberObjectId);
      newsletter.stats.opened = newsletter.opens.length;
      await newsletter.save();
      
      console.log(`✅ [TRACK] Ouverture enregistrée pour newsletter ${newsletterId}, subscriber ${subscriberId}`);
    } else {
      console.log(`ℹ️  [TRACK] Ouverture déjà enregistrée pour newsletter ${newsletterId}, subscriber ${subscriberId}`);
    }

    // Retourner le pixel GIF transparent
    const pixelResponse = getTrackingPixelResponse();
    res.set(pixelResponse.headers);
    res.send(pixelResponse.buffer);

  } catch (error) {
    console.error('❌ [TRACK] Erreur lors du tracking:', error);
    // Retourner quand même le pixel pour ne pas révéler l'erreur
    const pixelResponse = getTrackingPixelResponse();
    res.set(pixelResponse.headers);
    res.send(pixelResponse.buffer);
  }
});

module.exports = router;
