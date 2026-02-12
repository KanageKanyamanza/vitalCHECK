/**
 * Service de file d'attente pour l'envoi d'emails
 * Gère les jobs d'email avec retry automatique et nettoyage
 */

class EmailQueueService {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxRetries = 3;
    this.baseRetryDelay = 5000; // 5 secondes
    this.cleanupInterval = null;
  }

  /**
   * Ajouter un email à la file d'attente
   * @param {Object} emailData - Données de l'email
   * @param {string} emailData.to - Email destinataire
   * @param {string} emailData.subject - Sujet de l'email
   * @param {string} emailData.html - Contenu HTML
   * @param {string} emailData.text - Contenu texte (optionnel)
   * @param {Object} emailData.metadata - Métadonnées (newsletterId, subscriberId, etc.)
   */
  addToQueue(emailData) {
    const job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      emailData,
      status: 'pending',
      retries: 0,
      createdAt: new Date(),
      lastAttempt: null,
      error: null
    };

    this.queue.push(job);
    console.log(`📬 [QUEUE] Job ajouté à la file d'attente: ${job.id}`, {
      to: emailData.to,
      subject: emailData.subject
    });

    // Démarrer le traitement si pas déjà en cours
    if (!this.processing) {
      this.processQueue();
    }

    return job.id;
  }

  /**
   * Traiter la file d'attente
   */
  async processQueue() {
    if (this.processing) {
      return;
    }

    this.processing = true;
    console.log(`🔄 [QUEUE] Démarrage du traitement de la file d'attente (${this.queue.length} jobs)`);

    while (this.queue.length > 0) {
      const job = this.queue.shift();

      if (job.status === 'completed' || job.status === 'failed') {
        continue;
      }

      try {
        job.status = job.retries > 0 ? 'retrying' : 'processing';
        job.lastAttempt = new Date();

        console.log(`📧 [QUEUE] Traitement du job ${job.id} (tentative ${job.retries + 1}/${this.maxRetries + 1})`, {
          to: job.emailData.to,
          subject: job.emailData.subject
        });

        // Importer dynamiquement le service d'email
        const { sendEmail } = require('./emailService');
        const { sendEmailExternal } = require('./emailServiceExternal');

        // Essayer d'envoyer l'email
        let result;
        try {
          // Essayer d'abord avec le service principal
          result = await sendEmail({
            to: job.emailData.to,
            subject: job.emailData.subject,
            html: job.emailData.html,
            text: job.emailData.text
          });
        } catch (error) {
          // Fallback sur le service externe
          console.log(`⚠️  [QUEUE] Service principal échoué, tentative avec service externe...`);
          result = await sendEmailExternal({
            to: job.emailData.to,
            subject: job.emailData.subject,
            html: job.emailData.html
          });
        }

        // Succès
        job.status = 'completed';
        job.result = result;

        console.log(`✅ [QUEUE] Job ${job.id} complété avec succès`, {
          to: job.emailData.to,
          messageId: result.messageId
        });

        // Délai entre les emails pour éviter la surcharge
        await this.delay(100); // 100ms entre chaque email

      } catch (error) {
        job.retries++;
        job.error = error.message;
        job.lastAttempt = new Date();

        console.error(`❌ [QUEUE] Erreur lors du traitement du job ${job.id}`, {
          to: job.emailData.to,
          error: error.message,
          retries: job.retries
        });

        if (job.retries < this.maxRetries) {
          // Réinsérer dans la queue avec délai progressif
          const retryDelay = this.baseRetryDelay * job.retries;
          job.status = 'pending';
          
          console.log(`⏳ [QUEUE] Réinsertion du job ${job.id} dans ${retryDelay}ms`);
          
          setTimeout(() => {
            this.queue.push(job);
            if (!this.processing) {
              this.processQueue();
            }
          }, retryDelay);
        } else {
          // Échec définitif
          job.status = 'failed';
          console.error(`💀 [QUEUE] Job ${job.id} échoué définitivement après ${job.retries} tentatives`);
        }
      }
    }

    this.processing = false;
    console.log(`✅ [QUEUE] Traitement de la file d'attente terminé`);

    // Démarrer le nettoyage si pas déjà démarré
    if (!this.cleanupInterval) {
      this.startCleanup();
    }
  }

  /**
   * Démarrer le nettoyage automatique des jobs anciens
   */
  startCleanup() {
    // Nettoyer toutes les heures
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000); // 1 heure

    // Nettoyer immédiatement
    this.cleanup();
  }

  /**
   * Nettoyer les jobs anciens (> 24h)
   */
  cleanup() {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    const initialLength = this.queue.length;
    this.queue = this.queue.filter(job => {
      const age = now - job.createdAt;
      return age < maxAge || job.status === 'pending' || job.status === 'retrying';
    });

    const removed = initialLength - this.queue.length;
    if (removed > 0) {
      console.log(`🧹 [QUEUE] Nettoyage: ${removed} job(s) ancien(s) supprimé(s)`);
    }
  }

  /**
   * Obtenir les statistiques de la queue
   */
  getStats() {
    const stats = {
      total: this.queue.length,
      pending: this.queue.filter(j => j.status === 'pending').length,
      processing: this.queue.filter(j => j.status === 'processing').length,
      retrying: this.queue.filter(j => j.status === 'retrying').length,
      completed: this.queue.filter(j => j.status === 'completed').length,
      failed: this.queue.filter(j => j.status === 'failed').length,
      isProcessing: this.processing
    };

    return stats;
  }

  /**
   * Délai utilitaire
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Arrêter le service
   */
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.processing = false;
  }
}

// Instance singleton
const emailQueueService = new EmailQueueService();

module.exports = emailQueueService;
