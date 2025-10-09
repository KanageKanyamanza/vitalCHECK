const nodemailer = require('nodemailer');
const { sendEmailExternal } = require('./emailServiceExternal');

// Create transporter
const createTransporter = () => {
  // Configuration SMTP directe dans le code (plus fiable sur Render)
  const config = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    // Configuration optimisée pour Render
    connectionTimeout: 15000, // 15 secondes
    greetingTimeout: 15000,   // 15 secondes
    socketTimeout: 15000,     // 15 secondes
    // Pas de pool sur Render pour éviter les problèmes
    pool: false,
    maxConnections: 1,
    maxMessages: 1,
    // Configuration simple
    debug: false,
    logger: false
  };

  console.log('🔧 [EMAIL] Configuration SMTP directe:', {
    host: config.host,
    port: config.port,
    user: process.env.EMAIL_USER ? 'Configuré' : 'Manquant',
    pass: process.env.EMAIL_PASS ? 'Configuré' : 'Manquant',
    connectionTimeout: config.connectionTimeout,
    pool: config.pool
  });

  return nodemailer.createTransport(config);
};

// Send email function with timeout and retry
const sendEmail = async (emailOptions, retryCount = 0) => {
  const maxRetries = 0; // Réduit à 0 tentative (1 au total)
  const timeoutMs = process.env.NODE_ENV === 'production' ? 90000 : 45000; // 90s en prod, 45s en dev
  
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"VitalCheck Enterprise Health Check" <${process.env.EMAIL_USER}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      attachments: emailOptions.attachments || []
    };

    console.log(`📧 [EMAIL] Envoi d'email en cours... (tentative ${retryCount + 1}/${maxRetries + 1})`, {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
      attachmentsCount: mailOptions.attachments.length
    });

    // Créer une promesse avec timeout
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Email timeout after ${timeoutMs/1000} seconds`)), timeoutMs);
    });

    const result = await Promise.race([emailPromise, timeoutPromise]);
    
    console.log('✅ [EMAIL] Email envoyé avec succès:', {
      messageId: result.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject,
      response: result.response,
      attempt: retryCount + 1
    });
    
    return result;
    
  } catch (error) {
    console.error(`❌ [EMAIL] Erreur lors de l'envoi d'email (tentative ${retryCount + 1}/${maxRetries + 1}):`, {
      to: emailOptions.to,
      subject: emailOptions.subject,
      error: error.message,
      code: error.code,
      responseCode: error.responseCode
    });

    // Retry logic
    if (retryCount < maxRetries && (
      error.message.includes('timeout') || 
      error.code === 'ECONNRESET' || 
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNABORTED'
    )) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`🔄 [EMAIL] Nouvelle tentative dans ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendEmail(emailOptions, retryCount + 1);
    }
    
    throw error;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Send contact confirmation email to client
const sendContactConfirmation = async (clientEmail, clientName, subject) => {
  const emailOptions = {
    to: clientEmail,
    subject: 'Confirmation de réception - VitalCheck Enterprise Health Check',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Confirmation de réception</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin-top: 0;">Bonjour ${clientName},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Nous avons bien reçu votre message concernant : <strong>${subject}</strong>
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Notre équipe examinera votre demande et vous répondra dans les plus brefs délais, généralement sous 24-48 heures.
          </p>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">En attendant notre réponse :</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Découvrez notre <a href="https://www.checkmyenterprise.com" style="color: #1976d2;">évaluation gratuite</a></li>
              <li>Consultez nos <a href="https://www.checkmyenterprise.com/contact" style="color: #1976d2;">informations de contact</a></li>
              <li>Suivez-nous sur nos réseaux sociaux</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Merci pour votre confiance et à bientôt !
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Cordialement,<br>
            <strong>L'équipe VitalCheck</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            VitalCheck Enterprise Health Check - Douala, Cameroun<br>
            Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
          </p>
        </div>
      </div>
    `
  };

  // Utiliser le système de fallback à 2 niveaux
  const { sendEmailExternal } = require('./emailServiceExternal');

  let emailSent = false;
  let lastError = null;

  // Niveau 1: Configuration normale Nodemailer
  try {
    console.log('📧 [CONTACT CONFIRM] Tentative avec configuration normale...');
    await sendEmail(emailOptions);
    emailSent = true;
    console.log('✅ [CONTACT CONFIRM] Email envoyé avec succès (configuration normale)');
  } catch (error) {
    console.log('❌ [CONTACT CONFIRM] Erreur avec configuration normale:', {
      clientEmail,
      error: error.message,
      code: error.code
    });
    lastError = error;
  }

  // Niveau 2: Service externe (EmailJS/SendGrid)
  if (!emailSent) {
    try {
      console.log('🌐 [CONTACT CONFIRM] Tentative avec service externe...');
      await sendEmailExternal(emailOptions);
      emailSent = true;
      console.log('✅ [CONTACT CONFIRM] Email envoyé avec succès (service externe)');
    } catch (error) {
      console.log('❌ [CONTACT CONFIRM] Erreur avec service externe:', {
        clientEmail,
        error: error.message
      });
      lastError = error;
    }
  }

  if (!emailSent) {
    throw new Error(`Impossible d'envoyer l'email de confirmation de contact: ${lastError?.message || 'Erreur inconnue'}`);
  }

  return { success: true, message: 'Email de confirmation envoyé' };
};

// Send contact notification to VitalCheck team
const sendContactNotification = async (contactData) => {
  const { name, email, company, phone, subject, message, inquiryType } = contactData;
  
  const inquiryTypeLabels = {
    general: 'Demande générale',
    assessment: 'Questions sur l\'évaluation',
    premium: 'Services premium',
    technical: 'Support technique',
    partnership: 'Partenariat',
    other: 'Autre'
  };

  const emailOptions = {
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `Nouveau message de contact - ${inquiryTypeLabels[inquiryType]} - ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 5px;">
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #16a34a 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 15px;">
          <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">VitalCheck Enterprise Health Check</h1>
          <p style="color: white; margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Nouveau message de contact</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <div style="background: #fef9e7; padding: 10px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #F4C542;">
            <strong style="color: #92400e;">Type de demande :</strong> <span style="color: #92400e;">${inquiryTypeLabels[inquiryType]}</span>
          </div>
          
          <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Informations du contact :</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #666; width: 30%; font-size: 14px;">Nom :</td>
              <td style="padding: 4px 0; color: #333; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #666; font-size: 14px;">Email :</td>
              <td style="padding: 4px 0; color: #333; font-size: 14px;"><a href="mailto:${email}" style="color: #4CAF50; text-decoration: none;">${email}</a></td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #666; font-size: 14px;">Entreprise :</td>
              <td style="padding: 4px 0; color: #333; font-size: 14px;">${company}</td>
            </tr>
            ` : ''}
            ${phone ? `
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #666; font-size: 14px;">Téléphone :</td>
              <td style="padding: 4px 0; color: #333; font-size: 14px;">${phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 4px 0; font-weight: 600; color: #666; font-size: 14px;">Sujet :</td>
              <td style="padding: 4px 0; color: #333; font-size: 14px;">${subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin: 15px 0 8px 0; font-size: 16px; font-weight: 600;">Message :</h3>
          <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
            <p style="color: #333; line-height: 1.5; margin: 0; font-size: 14px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background: #dcfce7; padding: 12px; border-radius: 6px; text-align: center; border: 1px solid #bbf7d0;">
            <p style="color: #15803d; margin: 0; font-size: 14px; font-weight: 600;">
              ⏰ Action requise : Répondre au client dans les 24-48 heures
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
          <p style="color: #999; font-size: 11px; margin: 0;">
            VitalCheck Enterprise Health Check - Dakar, Sénégal | Système de notification automatique
          </p>
        </div>
      </div>
    `
  };

  // Utiliser le système de fallback à 2 niveaux
  const { sendEmailExternal } = require('./emailServiceExternal');

  let emailSent = false;
  let lastError = null;

  // Niveau 1: Configuration normale Nodemailer
  try {
    console.log('📧 [CONTACT NOTIF] Tentative avec configuration normale...');
    await sendEmail(emailOptions);
    emailSent = true;
    console.log('✅ [CONTACT NOTIF] Email envoyé avec succès (configuration normale)');
  } catch (error) {
    console.log('❌ [CONTACT NOTIF] Erreur avec configuration normale:', {
      clientEmail: email,
      error: error.message,
      code: error.code
    });
    lastError = error;
  }

  // Niveau 2: Service externe (EmailJS/SendGrid)
  if (!emailSent) {
    try {
      console.log('🌐 [CONTACT NOTIF] Tentative avec service externe...');
      await sendEmailExternal(emailOptions);
      emailSent = true;
      console.log('✅ [CONTACT NOTIF] Email envoyé avec succès (service externe)');
    } catch (error) {
      console.log('❌ [CONTACT NOTIF] Erreur avec service externe:', {
        clientEmail: email,
        error: error.message
      });
      lastError = error;
    }
  }

  if (!emailSent) {
    throw new Error(`Impossible d'envoyer l'email de notification de contact: ${lastError?.message || 'Erreur inconnue'}`);
  }

  return { success: true, message: 'Email de notification envoyé' };
};

// Send payment confirmation email
const sendPaymentEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"VitalCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">VitalCheck</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Enterprise Health Check</p>
          </div>
          <div class="content">
            <div class="message">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666;">
              Pour toute question, n'hésitez pas à nous contacter à 
              <a href="mailto:info@checkmyenterprise.com">info@checkmyenterprise.com</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VitalCheck. Tous droits réservés.</p>
            <p>Dakar, Sénégal</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return sendEmail(mailOptions);
};

// Send welcome email with credentials
const sendWelcomeEmail = async (to, name, tempPassword = null) => {
  const mailOptions = {
    from: `"VitalCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Bienvenue sur VitalCheck - Vos identifiants de connexion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Bienvenue sur VitalCheck!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Enterprise Health Check</p>
          </div>
          <div class="content">
            <h2 style="color: #059669;">Bonjour ${name},</h2>
            <p>Votre compte VitalCheck a été créé avec succès !</p>
            
            <div class="credentials">
              <h3 style="margin-top: 0; color: #059669;">Vos identifiants de connexion :</h3>
              <p><strong>Email :</strong> ${to}</p>
              ${tempPassword ? `<p><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
              <p style="color: #dc2626; font-size: 14px;">⚠️ Veuillez changer ce mot de passe lors de votre première connexion.</p>` : ''}
            </div>

            <p>Avec votre compte, vous pouvez maintenant :</p>
            <ul>
              <li>Suivre l'historique de vos évaluations</li>
              <li>Accéder à votre tableau de bord personnalisé</li>
              <li>Télécharger vos rapports à tout moment</li>
              <li>Gérer votre abonnement</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://checkmyenterprise.com/client/login" class="button">
                Se connecter maintenant
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VitalCheck. Tous droits réservés.</p>
            <p>Dakar, Sénégal</p>
            <p style="margin-top: 10px;">
              <a href="mailto:info@checkmyenterprise.com" style="color: #10b981;">info@checkmyenterprise.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return sendEmail(mailOptions);
};

// Send account creation email with credentials after payment
const sendAccountCreatedEmail = async (to, name, tempPassword, planName) => {
  const mailOptions = {
    from: `"VitalCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Votre compte VitalCheck ${planName} est prêt !`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Paiement Confirmé ✓</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre compte est prêt !</p>
          </div>
          <div class="content">
            <h2 style="color: #059669;">Bonjour ${name},</h2>
            <p>Merci pour votre abonnement au plan <span class="badge">${planName}</span> !</p>
            
            <p>Nous avons créé votre compte VitalCheck. Voici vos identifiants de connexion :</p>
            
            <div class="credentials">
              <h3 style="margin-top: 0; color: #059669;">🔐 Identifiants de connexion</h3>
              <p><strong>Email :</strong> ${to}</p>
              <p><strong>Mot de passe temporaire :</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
              <p style="color: #dc2626; font-size: 14px; margin-top: 15px;">
                ⚠️ <strong>Important :</strong> Veuillez changer ce mot de passe lors de votre première connexion pour sécuriser votre compte.
              </p>
            </div>

            <h3 style="color: #059669;">📊 Avec votre compte, vous pouvez :</h3>
            <ul style="line-height: 1.8;">
              <li>✓ Accéder à votre tableau de bord personnalisé</li>
              <li>✓ Consulter l'historique de toutes vos évaluations</li>
              <li>✓ Télécharger vos rapports à tout moment</li>
              <li>✓ Suivre votre progression dans le temps</li>
              <li>✓ Gérer votre abonnement et informations</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://checkmyenterprise.com/client/login" class="button">
                Se connecter maintenant
              </a>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              <strong>Besoin d'aide ?</strong> Notre équipe vous contactera sous 24h pour vous accompagner dans vos premiers pas.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VitalCheck. Tous droits réservés.</p>
            <p>Dakar, Sénégal</p>
            <p style="margin-top: 10px;">
              <a href="mailto:info@checkmyenterprise.com" style="color: #10b981;">info@checkmyenterprise.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return sendEmail(mailOptions);
};

// Send account created email after assessment (free evaluation)
const sendAccountCreatedAfterAssessment = async (to, name, tempPassword, score) => {
  const mailOptions = {
    from: `"VitalCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Votre rapport VitalCheck est prêt - Accédez à votre compte !',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .score-box { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 3px solid #10b981; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 Évaluation Complétée !</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre compte VitalCheck est créé</p>
          </div>
          <div class="content">
            <h2 style="color: #059669;">Bravo ${name} !</h2>
            <p>Vous avez complété votre évaluation VitalCheck avec succès.</p>
            
            <div class="score-box">
              <h3 style="margin: 0; color: #059669;">Votre Score Global</h3>
              <div style="font-size: 48px; font-weight: bold; color: #10b981; margin: 10px 0;">${Math.round(score)}/100</div>
            </div>

            <p>Nous avons créé votre compte VitalCheck <strong>GRATUIT</strong> pour que vous puissiez :</p>
            <ul style="line-height: 1.8;">
              <li>✓ Accéder à votre rapport détaillé en ligne</li>
              <li>✓ Consulter l'historique de vos évaluations</li>
              <li>✓ Suivre votre progression dans le temps</li>
              <li>✓ Télécharger vos rapports PDF à tout moment</li>
            </ul>
            
            <div class="credentials">
              <h3 style="margin-top: 0; color: #059669;">🔐 Vos Identifiants de Connexion</h3>
              <p><strong>Email :</strong> ${to}</p>
              <p><strong>Mot de passe temporaire :</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${tempPassword}</code></p>
              <p style="color: #dc2626; font-size: 14px; margin-top: 15px;">
                ⚠️ <strong>Important :</strong> Changez ce mot de passe lors de votre première connexion.
              </p>
            </div>

            <div style="text-align: center;">
              <a href="https://checkmyenterprise.com/client/login" class="button">
                Accéder à Mon Dashboard
              </a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h4 style="margin-top: 0; color: #1e40af;">💡 Envie d'aller plus loin ?</h4>
              <p style="margin-bottom: 10px;">Découvrez nos plans STANDARD et PREMIUM pour :</p>
              <ul style="margin: 0;">
                <li>Recommandations personnalisées avancées</li>
                <li>Consultation avec nos experts</li>
                <li>Analyse comparative sectorielle</li>
                <li>Suivi continu de votre performance</li>
              </ul>
              <a href="https://checkmyenterprise.com/pricing" style="color: #2563eb; font-weight: bold;">Voir nos offres →</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VitalCheck. Tous droits réservés.</p>
            <p>Dakar, Sénégal</p>
            <p style="margin-top: 10px;">
              <a href="mailto:info@checkmyenterprise.com" style="color: #10b981;">info@checkmyenterprise.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return sendEmail(mailOptions);
};

// Send email to existing account holder after assessment
const sendAssessmentCompletedExistingUser = async (to, name, score) => {
  const mailOptions = {
    from: `"VitalCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Nouvelle évaluation complétée - VitalCheck',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .score-box { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 3px solid #10b981; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Nouvelle Évaluation !</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Consultez vos résultats</p>
          </div>
          <div class="content">
            <h2 style="color: #059669;">Bonjour ${name},</h2>
            <p>Vous avez complété une nouvelle évaluation VitalCheck !</p>
            
            <div class="score-box">
              <h3 style="margin: 0; color: #059669;">Votre Nouveau Score</h3>
              <div style="font-size: 48px; font-weight: bold; color: #10b981; margin: 10px 0;">${Math.round(score)}/100</div>
            </div>

            <p>Connectez-vous à votre dashboard pour :</p>
            <ul style="line-height: 1.8;">
              <li>✓ Consulter votre rapport détaillé</li>
              <li>✓ Comparer avec vos évaluations précédentes</li>
              <li>✓ Suivre votre progression</li>
              <li>✓ Télécharger le PDF</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://checkmyenterprise.com/client/dashboard" class="button">
                Voir Mon Dashboard
              </a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VitalCheck. Tous droits réservés.</p>
            <p>Dakar, Sénégal</p>
            <p style="margin-top: 10px;">
              <a href="mailto:info@checkmyenterprise.com" style="color: #10b981;">info@checkmyenterprise.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return sendEmail(mailOptions);
};

// Send subscription upgrade email (for existing account holders who pay)
const sendSubscriptionUpgradeEmail = async (to, name, planName, planId) => {
  const mailOptions = {
    from: `"VitalCheck" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Votre abonnement ${planName} est activé ! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .badge { background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 18px; display: inline-block; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Paiement Confirmé !</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre abonnement a été mis à jour</p>
          </div>
          <div class="content">
            <h2 style="color: #059669;">Bonjour ${name},</h2>
            <p>Excellent choix ! Votre paiement a été confirmé et votre abonnement a été mis à jour.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 10px; color: #666;">Votre nouveau plan :</p>
              <span class="badge">${planName}</span>
              <p style="margin-top: 10px; color: #059669; font-weight: bold;">Actif maintenant !</p>
            </div>

            <h3 style="color: #059669;">🎯 Vos nouveaux avantages :</h3>
            <ul style="line-height: 1.8;">
              ${planId === 'premium' || planId === 'diagnostic' ? `
              <li>✓ Consultation avec nos experts</li>
              <li>✓ Analyse comparative sectorielle</li>
              <li>✓ Plan d'action personnalisé</li>
              <li>✓ Support prioritaire</li>
              ` : `
              <li>✓ Recommandations personnalisées</li>
              <li>✓ Évaluations multiples</li>
              <li>✓ Historique et suivi</li>
              <li>✓ Support WhatsApp</li>
              `}
              <li>✓ Accès illimité à votre dashboard</li>
              <li>✓ Rapports PDF avancés</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://checkmyenterprise.com/client/dashboard" class="button">
                Accéder à Mon Dashboard
              </a>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              <strong>Besoin d'aide ?</strong> Notre équipe vous contactera sous 24h pour vous accompagner.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VitalCheck. Tous droits réservés.</p>
            <p>Dakar, Sénégal</p>
            <p style="margin-top: 10px;">
              <a href="mailto:info@checkmyenterprise.com" style="color: #10b981;">info@checkmyenterprise.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return sendEmail(mailOptions);
};

module.exports = {
  sendEmail,
  testEmailConfig,
  sendContactConfirmation,
  sendContactNotification,
  sendPaymentEmail,
  sendWelcomeEmail,
  sendAccountCreatedEmail,
  sendAccountCreatedAfterAssessment,
  sendAssessmentCompletedExistingUser,
  sendSubscriptionUpgradeEmail,
  emailService: {
    sendContactConfirmation,
    sendContactNotification,
    sendPaymentEmail,
    sendWelcomeEmail,
    sendAccountCreatedEmail,
    sendAccountCreatedAfterAssessment,
    sendAssessmentCompletedExistingUser,
    sendSubscriptionUpgradeEmail
  }
};
