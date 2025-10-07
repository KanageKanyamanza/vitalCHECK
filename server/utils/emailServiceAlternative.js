const nodemailer = require('nodemailer');

/**
 * Service d'email alternatif pour Render
 * Utilise une configuration SMTP différente pour éviter les problèmes de connexion
 */

// Configuration alternative pour Render
const createAlternativeTransporter = () => {
  // Configuration alternative avec port 465 (SSL)
  const config = {
    host: 'smtp.gmail.com',
    port: 465, // Port SSL au lieu de 587
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Configuration minimale pour Render
    connectionTimeout: 10000, // 10 secondes seulement
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // Pas de pool sur Render
    pool: false,
    // Configuration TLS minimale
    tls: {
      rejectUnauthorized: false
    },
    // Configuration simple
    debug: false,
    logger: false
  };

  console.log('🔄 [EMAIL ALT] Configuration alternative SMTP:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    connectionTimeout: config.connectionTimeout
  });

  return nodemailer.createTransport(config);
};

// Fonction d'envoi alternative
const sendEmailAlternative = async (emailOptions) => {
  try {
    const transporter = createAlternativeTransporter();
    
    const mailOptions = {
      from: `"VitalCheck Enterprise Health Check" <${process.env.EMAIL_USER}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      attachments: emailOptions.attachments || []
    };

    console.log('📧 [EMAIL ALT] Envoi d\'email avec configuration alternative...', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from
    });

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ [EMAIL ALT] Email envoyé avec succès:', {
      messageId: result.messageId,
      to: mailOptions.to,
      response: result.response
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ [EMAIL ALT] Erreur lors de l\'envoi:', {
      to: emailOptions.to,
      error: error.message,
      code: error.code
    });
    throw error;
  }
};

// Test de connexion alternative
const testAlternativeConnection = async () => {
  try {
    const transporter = createAlternativeTransporter();
    await transporter.verify();
    console.log('✅ [EMAIL ALT] Connexion alternative réussie');
    return true;
  } catch (error) {
    console.error('❌ [EMAIL ALT] Connexion alternative échouée:', error.message);
    return false;
  }
};

module.exports = {
  sendEmailAlternative,
  testAlternativeConnection,
  createAlternativeTransporter
};
