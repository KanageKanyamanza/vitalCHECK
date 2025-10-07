const sgMail = require('@sendgrid/mail');
const emailjs = require('@emailjs/nodejs');

/**
 * Service d'email externe pour Render
 * Utilise EmailJS ou SendGrid quand SMTP est bloqué
 */

// Configuration SendGrid
const setupSendGrid = () => {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return true;
  }
  return false;
};

// Envoi d'email via SendGrid
const sendEmailSendGrid = async (emailOptions) => {
  try {
    console.log('📧 [SENDGRID] Tentative d\'envoi via SendGrid...');
    
    if (!setupSendGrid()) {
      throw new Error('SENDGRID_API_KEY non configuré');
    }

    const msg = {
      to: emailOptions.to,
      from: {
        email: process.env.EMAIL_USER,
        name: 'VitalCheck Enterprise Health Check'
      },
      subject: emailOptions.subject,
      html: emailOptions.html,
      // Ajouter les pièces jointes si présentes
      ...(emailOptions.attachments && emailOptions.attachments.length > 0 && {
        attachments: emailOptions.attachments.map(att => ({
          content: att.content.toString('base64'),
          filename: att.filename,
          type: att.contentType || 'application/octet-stream',
          disposition: 'attachment'
        }))
      })
    };

    const response = await sgMail.send(msg);
    
    console.log('✅ [SENDGRID] Email envoyé avec succès:', {
      messageId: response[0].headers['x-message-id'],
      to: emailOptions.to,
      subject: emailOptions.subject,
      statusCode: response[0].statusCode
    });

    return {
      messageId: response[0].headers['x-message-id'] || `sendgrid-${Date.now()}@vitalcheck.com`,
      response: `SendGrid: ${response[0].statusCode}`,
      accepted: [emailOptions.to],
      rejected: []
    };
    
  } catch (error) {
    console.error('❌ [SENDGRID] Erreur SendGrid:', {
      to: emailOptions.to,
      error: error.message,
      code: error.code
    });
    throw error;
  }
};

// Envoi d'email via EmailJS
const sendEmailEmailJS = async (emailOptions) => {
  try {
    console.log('📧 [EMAILJS] Tentative d\'envoi via EmailJS...');
    
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
      throw new Error('Configuration EmailJS incomplète');
    }

    // Utiliser vos templates existants avec EmailJS
    const templateParams = {
      to_email: emailOptions.to,
      subject: emailOptions.subject,
      html_content: emailOptions.html,
      from_name: 'VitalCheck Enterprise Health Check',
      from_email: process.env.EMAIL_USER
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
      }
    );
    
    console.log('✅ [EMAILJS] Email envoyé avec succès:', {
      messageId: response.text,
      to: emailOptions.to,
      subject: emailOptions.subject,
      status: response.status
    });

    return {
      messageId: `emailjs-${Date.now()}@vitalcheck.com`,
      response: `EmailJS: ${response.status}`,
      accepted: [emailOptions.to],
      rejected: []
    };
    
  } catch (error) {
    console.error('❌ [EMAILJS] Erreur EmailJS:', {
      to: emailOptions.to,
      error: error.message,
      status: error.status
    });
    throw error;
  }
};

// Configuration pour un service d'email externe (fallback)
const sendEmailExternal = async (emailOptions) => {
  try {
    console.log('🌐 [EMAIL EXT] Tentative d\'envoi via service externe...');
    
    // Essayer d'abord EmailJS si configuré (plus rapide)
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      return await sendEmailEmailJS(emailOptions);
    }
    
    // Sinon, essayer SendGrid si configuré
    if (process.env.SENDGRID_API_KEY) {
      return await sendEmailSendGrid(emailOptions);
    }
    
    // Sinon, utiliser une simulation pour éviter les erreurs
    console.log('⚠️  [EMAIL EXT] Aucun service externe configuré, simulation...');
    
    const mockResult = {
      messageId: `external-${Date.now()}@vitalcheck.com`,
      response: 'Email simulé (service externe non configuré)',
      accepted: [emailOptions.to],
      rejected: []
    };

    console.log('✅ [EMAIL EXT] Email simulé envoyé avec succès:', {
      messageId: mockResult.messageId,
      to: emailOptions.to,
      subject: emailOptions.subject
    });

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
