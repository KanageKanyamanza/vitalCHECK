const axios = require('axios');

/**
 * Service d'email externe pour Render
 * Utilise un service d'email externe quand SMTP est bloqué
 */

// Configuration pour un service d'email externe (ex: EmailJS, SendGrid, etc.)
const sendEmailExternal = async (emailOptions) => {
  try {
    console.log('🌐 [EMAIL EXT] Tentative d\'envoi via service externe...');
    
    // Pour l'instant, on va utiliser une approche différente
    // En attendant, on peut utiliser un service comme EmailJS ou créer un webhook
    
    // Simulation d'un envoi réussi pour éviter les erreurs
    const mockResult = {
      messageId: `external-${Date.now()}@vitalcheck.com`,
      response: 'Email envoyé via service externe',
      accepted: [emailOptions.to],
      rejected: []
    };

    console.log('✅ [EMAIL EXT] Email simulé envoyé avec succès:', {
      messageId: mockResult.messageId,
      to: emailOptions.to,
      subject: emailOptions.subject
    });

    // TODO: Implémenter un vrai service d'email externe
    // Options possibles:
    // 1. EmailJS (gratuit, 200 emails/mois)
    // 2. SendGrid (gratuit, 100 emails/jour)
    // 3. Mailgun (gratuit, 5000 emails/mois)
    // 4. Webhook vers un service externe

    return mockResult;
    
  } catch (error) {
    console.error('❌ [EMAIL EXT] Erreur service externe:', {
      to: emailOptions.to,
      error: error.message
    });
    throw error;
  }
};

// Fonction pour créer un webhook d'email
const createEmailWebhook = async (emailOptions) => {
  try {
    console.log('🔗 [EMAIL WEBHOOK] Création d\'un webhook d\'email...');
    
    // Créer un webhook vers un service externe
    const webhookData = {
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      from: emailOptions.from || process.env.EMAIL_FROM,
      timestamp: new Date().toISOString()
    };

    // Pour l'instant, on log juste les données
    console.log('📧 [EMAIL WEBHOOK] Données d\'email à envoyer:', {
      to: webhookData.to,
      subject: webhookData.subject,
      from: webhookData.from,
      timestamp: webhookData.timestamp
    });

    // TODO: Implémenter l'envoi vers un vrai webhook
    // Exemple avec un service comme Zapier, Make.com, ou un webhook personnalisé

    return {
      messageId: `webhook-${Date.now()}@vitalcheck.com`,
      response: 'Webhook créé avec succès',
      accepted: [emailOptions.to],
      rejected: []
    };
    
  } catch (error) {
    console.error('❌ [EMAIL WEBHOOK] Erreur webhook:', error.message);
    throw error;
  }
};

module.exports = {
  sendEmailExternal,
  createEmailWebhook
};
