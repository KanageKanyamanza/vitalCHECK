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

// Fonction d'envoi alternative avec retry
const sendEmailAlternative = async (emailOptions, retryCount = 0) => {
  const maxRetries = 0; // Réduit à 0 tentative (1 au total)
  const timeoutMs = process.env.NODE_ENV === 'production' ? 60000 : 30000; // 60s en prod, 30s en dev
  
  try {
    const transporter = createAlternativeTransporter();
    
    const mailOptions = {
      from: `"VitalCHECK Enterprise Health Check" <${process.env.EMAIL_USER}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      attachments: emailOptions.attachments || []
    };

    console.log(`📧 [EMAIL ALT] Envoi d'email avec configuration alternative... (tentative ${retryCount + 1}/${maxRetries + 1})`, {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from
    });

    // Créer une promesse avec timeout
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Email timeout after ${timeoutMs/1000} seconds`)), timeoutMs);
    });

    const result = await Promise.race([emailPromise, timeoutPromise]);
    
    console.log('✅ [EMAIL ALT] Email envoyé avec succès:', {
      messageId: result.messageId,
      to: mailOptions.to,
      response: result.response,
      attempt: retryCount + 1
    });
    
    return result;
    
  } catch (error) {
    console.error(`❌ [EMAIL ALT] Erreur lors de l'envoi (tentative ${retryCount + 1}/${maxRetries + 1}):`, {
      to: emailOptions.to,
      error: error.message,
      code: error.code
    });

    // Retry logic
    if (retryCount < maxRetries && (
      error.message.includes('timeout') || 
      error.code === 'ECONNRESET' || 
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNABORTED'
    )) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`🔄 [EMAIL ALT] Nouvelle tentative dans ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendEmailAlternative(emailOptions, retryCount + 1);
    }
    
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
