const Newsletter = require('../models/Newsletter');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const NewsletterEmail = require('./newsletterEmail');
const emailQueueService = require('./emailQueueService');

class NewsletterScheduler {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
  }

  /**
   * Démarrer le scheduler pour vérifier les newsletters programmées
   */
  start() {
    if (this.isRunning) {
      console.log('📅 [NEWSLETTER SCHEDULER] Déjà en cours d\'exécution');
      return;
    }

    console.log('📅 [NEWSLETTER SCHEDULER] Démarrage du scheduler...');
    this.isRunning = true;

    // Vérifier toutes les minutes
    this.checkInterval = setInterval(() => {
      this.checkScheduledNewsletters();
    }, 60 * 1000); // 1 minute

    // Vérifier immédiatement au démarrage
    this.checkScheduledNewsletters();
  }

  /**
   * Arrêter le scheduler
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      this.isRunning = false;
      console.log('📅 [NEWSLETTER SCHEDULER] Arrêté');
    }
  }

  /**
   * Vérifier et envoyer les newsletters programmées
   */
  async checkScheduledNewsletters() {
    try {
      const now = new Date();
      
      // Trouver les newsletters programmées dont l'heure est arrivée
      const scheduledNewsletters = await Newsletter.find({
        status: 'scheduled',
        scheduledAt: { $lte: now },
        archived: { $ne: true }
      });

      if (scheduledNewsletters.length === 0) {
        return;
      }

      console.log(`📅 [NEWSLETTER SCHEDULER] ${scheduledNewsletters.length} newsletter(s) programmée(s) à envoyer`);

      for (const newsletter of scheduledNewsletters) {
        await this.sendScheduledNewsletter(newsletter);
      }
    } catch (error) {
      console.error('❌ [NEWSLETTER SCHEDULER] Erreur lors de la vérification:', error);
    }
  }

  /**
   * Envoyer une newsletter programmée
   */
  async sendScheduledNewsletter(newsletter) {
    try {
      console.log(`📧 [NEWSLETTER SCHEDULER] Envoi de la newsletter ${newsletter._id} (${newsletter.subject})`);

      // Mettre à jour le statut
      newsletter.status = 'sending';
      await newsletter.save();

      // Obtenir la liste des destinataires
      let subscribers = [];

      if (newsletter.recipients.type === 'all') {
        subscribers = await NewsletterSubscriber.find({ isActive: true });
      } else if (newsletter.recipients.type === 'active') {
        subscribers = await NewsletterSubscriber.find({ isActive: true });
      } else if (newsletter.recipients.type === 'tags' && newsletter.recipients.tags && newsletter.recipients.tags.length > 0) {
        subscribers = await NewsletterSubscriber.find({
          isActive: true,
          tags: { $in: newsletter.recipients.tags }
        });
      } else if (newsletter.recipients.type === 'custom' && newsletter.recipients.customEmails && newsletter.recipients.customEmails.length > 0) {
        const customEmails = newsletter.recipients.customEmails;
        subscribers = await NewsletterSubscriber.find({ 
          email: { $in: customEmails.map(e => e.toLowerCase()) }
        });
        
        // Ajouter les emails qui ne sont pas des abonnés
        const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));
        const missingEmails = customEmails.filter(e => !existingEmails.has(e.toLowerCase()));
        
        missingEmails.forEach(email => {
          subscribers.push({ 
            email: email.toLowerCase(),
            isActive: true,
            _id: null,
            generateUnsubscribeToken: function() {},
            save: async function() { return this; }
          });
        });
      }

      const totalRecipients = subscribers.length;

      if (totalRecipients === 0) {
        console.error(`❌ [NEWSLETTER SCHEDULER] Aucun destinataire pour la newsletter ${newsletter._id}`);
        newsletter.status = 'draft';
        await newsletter.save();
        return;
      }

      // Mettre à jour les statistiques
      newsletter.stats.totalRecipients = totalRecipients;
      await newsletter.save();

      // Ajouter tous les emails à la file d'attente
      let jobsAdded = 0;
      
      for (const subscriber of subscribers) {
        const email = subscriber.email || subscriber.emailAddress;
        
        if (!email) {
          console.error('📧 [NEWSLETTER SCHEDULER] Email manquant pour le subscriber:', subscriber);
          continue;
        }

        const subscriberId = subscriber._id ? subscriber._id.toString() : null;
        
        // Générer le contenu de l'email
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

      console.log(`📬 [NEWSLETTER SCHEDULER] ${jobsAdded} email(s) ajouté(s) à la file d'attente pour la newsletter ${newsletter._id}`);

      // Mettre à jour le statut
      newsletter.status = 'sent';
      newsletter.sentAt = new Date();
      newsletter.stats.sent = jobsAdded;
      await newsletter.save();

      console.log(`✅ [NEWSLETTER SCHEDULER] Newsletter ${newsletter._id} envoyée avec succès`);
    } catch (error) {
      console.error(`❌ [NEWSLETTER SCHEDULER] Erreur lors de l'envoi de la newsletter ${newsletter._id}:`, error);
      
      // Remettre le statut en scheduled en cas d'erreur
      try {
        newsletter.status = 'scheduled';
        await newsletter.save();
      } catch (saveError) {
        console.error('❌ [NEWSLETTER SCHEDULER] Erreur lors de la restauration du statut:', saveError);
      }
    }
  }
}

// Instance singleton
const newsletterScheduler = new NewsletterScheduler();

module.exports = newsletterScheduler;
