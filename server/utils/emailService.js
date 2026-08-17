const nodemailer = require('nodemailer');
const { sendEmailExternal } = require('./emailServiceExternal');
const { createUnifiedEmailTemplate } = require('./emailTemplates');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const MailingContact = require('../models/MailingContact');
const User = require('../models/User');

const createTransporter = () => {
  // Configuration SMTP dynamique basée sur le .env (priorité Ionos)
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.ionos.fr',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465, // true pour 465, false pour 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    // Configuration optimisée
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    pool: false,
    maxConnections: 1,
    maxMessages: 1,
    debug: false,
    logger: false
  };

  console.log('🔧 [EMAIL] Configuration SMTP:', {
    host: config.host,
    port: config.port,
    user: process.env.EMAIL_USER ? 'Configuré' : 'Manquant',
    pass: process.env.EMAIL_PASS ? 'Configuré' : 'Manquant'
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
      from: `"vitalCHECK Enterprise Health Check" <${process.env.EMAIL_USER}>`,
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

    // Enregistrer le message sortant dans la base de données
    if (!emailOptions.skipTracking) {
      saveOutboundEmail(
        mailOptions, 
        result.messageId, 
        emailOptions.contactId, 
        emailOptions.contactModel,
        emailOptions.rawContent // Nouveau : passer le contenu brut
      ).catch(err => 
        console.error('❌ [EMAIL TRACKING] Erreur lors de l\'enregistrement du message sortant:', err.message)
      );
    }
    
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
    subject: 'Confirmation de réception - vitalCHECK Enterprise Health Check',
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Message reçu avec succès !',
      subtitle: `Bonjour <strong>${clientName}</strong>, nous avons bien reçu votre demande.`,
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
            Nous avons bien reçu votre message concernant : <strong>${subject}</strong>
          </p>
          
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
            Notre équipe examinera votre demande et vous répondra dans les plus brefs délais, généralement sous 24-48 heures.
          </p>
          
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #14532d; font-size: 16px;">En attendant notre réponse :</h4>
          <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.6;">
            <li>Découvrez notre <a href="https://www.checkmyenterprise.com" style="color: #3b82f6; text-decoration: none;">évaluation gratuite</a></li>
            <li>Consultez nos <a href="https://www.checkmyenterprise.com/contact" style="color: #3b82f6; text-decoration: none;">informations de contact</a></li>
              <li>Suivez-nous sur nos réseaux sociaux</li>
            </ul>
          </div>
          
        <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
            Merci pour votre confiance et à bientôt !
          </p>
      `,
      buttons: [
        {
          text: '🏠 Visiter notre site',
          url: 'https://www.checkmyenterprise.com',
          primary: true,
          icon: '🏠'
        },
        {
          text: '📞 Nous contacter',
          url: 'https://www.checkmyenterprise.com/contact',
          primary: false,
          icon: '📞'
        }
      ],
      note: 'Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.'
    })
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

// Send contact notification to vitalCHECK team
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
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Nouveau message de contact',
      subtitle: `Type de demande : <strong>${inquiryTypeLabels[inquiryType]}</strong>`,
      content: `
        <div style="background: #fefdf3; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #14532d; font-size: 16px;">📋 Informations du contact</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
            <div><strong>Nom :</strong> ${name}</div>
            <div><strong>Email :</strong> <a href="mailto:${email}" style="color: #00751B; text-decoration: none;">${email}</a></div>
            ${company ? `<div><strong>Entreprise :</strong> ${company}</div>` : ''}
            ${phone ? `<div><strong>Téléphone :</strong> ${phone}</div>` : ''}
            <div style="grid-column: 1 / -1;"><strong>Sujet :</strong> ${subject}</div>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #2d3748; font-size: 16px;">Message</h4>
          <p style="margin: 0; color: #4a5568; line-height: 1.5; font-size: 14px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #bbf7d0;">
          <p style="margin: 0; color: #15803d; font-size: 14px; font-weight: 600;">
            ⏰ Action requise : Répondre au client dans les 24-48 heures
          </p>
        </div>
      `,
      buttons: [
        {
          text: '📧 Répondre par email',
          url: `mailto:${email}?subject=Re: ${subject}`,
          primary: true,
          icon: '📧'
        }
      ],
      note: 'Système de notification automatique - vitalCHECK Enterprise Health Check'
    })
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
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Confirmation de paiement',
      subtitle: 'Votre transaction a été traitée avec succès',
      content: `
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #15803d; font-size: 16px; line-height: 1.5;">
              ${message.replace(/\n/g, '<br>')}
            </p>
        </div>
        
        <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Pour toute question concernant votre paiement, n'hésitez pas à nous contacter.
        </p>
      `,
      buttons: [
        {
          text: '📧 Nous contacter',
          url: 'mailto:info@checkmyenterprise.com',
          primary: true,
          icon: '📧'
        },
        {
          text: '🏠 Visiter notre site',
          url: 'https://www.checkmyenterprise.com',
          primary: false,
          icon: '🏠'
        }
      ],
      note: 'Cet email confirme le traitement de votre paiement. Conservez-le pour vos archives.'
    })
  };

  return sendEmail(mailOptions);
};

// Send welcome email with credentials
const sendWelcomeEmail = async (to, name, tempPassword = null) => {
  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Bienvenue sur vitalCHECK - Vos identifiants de connexion',
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Bienvenue sur vitalCHECK !',
      subtitle: `Bonjour <strong>${name}</strong>, votre compte a été créé avec succès !`,
      credentials: tempPassword ? {
        title: 'Vos identifiants de connexion',
        email: to,
        password: tempPassword,
        warning: 'Veuillez changer ce mot de passe lors de votre première connexion.'
      } : null,
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Avec votre compte vitalCHECK, vous pouvez maintenant :
        </p>
        
        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
              <li>Suivre l'historique de vos évaluations</li>
              <li>Accéder à votre tableau de bord personnalisé</li>
              <li>Télécharger vos rapports à tout moment</li>
          <li>Gérer votre abonnement et informations</li>
            </ul>
      `,
      buttons: [
        {
          text: 'Se connecter maintenant',
          url: 'https://checkmyenterprise.com/login',
          primary: true,
          icon: ''
        },
        {
          text: '🏠 Visiter notre site',
          url: 'https://www.checkmyenterprise.com',
          primary: false,
          icon: '🏠'
        }
      ],
      note: 'Votre compte vitalCHECK est maintenant actif. Conservez vos identifiants en sécurité.'
    })
  };

  return sendEmail(mailOptions);
};

// Send account creation email with credentials after payment
const sendAccountCreatedEmail = async (to, name, tempPassword, planName) => {
  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Votre compte vitalCHECK ${planName} est prêt !`,
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Paiement Confirmé ✓',
      subtitle: `Bonjour <strong>${name}</strong>, merci pour votre abonnement au plan <strong>${planName}</strong> !`,
      credentials: {
        title: 'Identifiants de connexion',
        email: to,
        password: tempPassword,
        warning: 'Veuillez changer ce mot de passe lors de votre première connexion pour sécuriser votre compte.'
      },
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Nous avons créé votre compte vitalCHECK. Avec votre compte, vous pouvez :
        </p>
        
        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li>Accéder à votre tableau de bord personnalisé</li>
          <li>Consulter l'historique de toutes vos évaluations</li>
          <li>Télécharger vos rapports à tout moment</li>
          <li>Suivre votre progression dans le temps</li>
          <li>Gérer votre abonnement et informations</li>
            </ul>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #14532d; font-size: 14px;">
              <strong>Besoin d'aide ?</strong> Notre équipe vous contactera sous 24h pour vous accompagner dans vos premiers pas.
            </p>
        </div>
      `,
      buttons: [
        {
          text: 'Se connecter maintenant',
          url: 'https://checkmyenterprise.com/login',
          primary: true,
          icon: ''
        },
        {
          text: 'Voir mon dashboard',
          url: 'https://checkmyenterprise.com/client/dashboard',
          primary: false,
          icon: ''
        }
      ],
      note: 'Votre compte vitalCHECK est maintenant actif avec votre abonnement. Conservez vos identifiants en sécurité.'
    })
  };

  return sendEmail(mailOptions);
};

// Send account created email after assessment (free evaluation)
const sendAccountCreatedAfterAssessment = async (to, name, tempPassword, score) => {
  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'vitalCHECK - Votre compte est créé ! Accédez à vos identifiants',
    html: createUnifiedEmailTemplate({
      language: 'fr',
        title: 'Votre Compte vitalCHECK est Créé !',
      subtitle: `Bravo <strong>${name}</strong>, vous avez complété votre évaluation vitalCHECK avec succès !`,
      score: {
        value: `${Math.round(score)}/100`,
        label: 'Votre Score Global',
        status: score >= 70 ? 'green' : score >= 50 ? 'amber' : 'red',
        message: score >= 70 ? '🟢 Excellent résultat !' : score >= 50 ? '🟡 Bon potentiel d\'amélioration' : '🔴 Besoin d\'attention'
      },
      credentials: {
        title: 'Vos Identifiants de Connexion',
        email: to,
        password: tempPassword,
        warning: 'Changez ce mot de passe lors de votre première connexion.'
      },
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Nous avons créé votre compte vitalCHECK <strong>GRATUIT</strong> pour que vous puissiez :
        </p>
        
        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li>Accéder à votre rapport détaillé en ligne</li>
          <li>Consulter l'historique de vos évaluations</li>
          <li>Suivre votre progression dans le temps</li>
          <li>Télécharger vos rapports PDF à tout moment</li>
            </ul>
            
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">Envie d'aller plus loin ?</h4>
          <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">Découvrez nos plans STANDARD et PREMIUM pour :</p>
          <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                <li>Recommandations personnalisées avancées</li>
                <li>Consultation avec nos experts</li>
                <li>Analyse comparative sectorielle</li>
                <li>Suivi continu de votre performance</li>
              </ul>
          <a href="https://checkmyenterprise.com/pricing" style="color: #2563eb; font-weight: bold; text-decoration: none;">Voir nos offres →</a>
        </div>
      `,
      buttons: [
        {
          text: 'Accéder à Mon Dashboard',
          url: 'https://checkmyenterprise.com/login',
          primary: true,
          icon: ''
        },
        {
          text: 'Voir nos offres',
          url: 'https://checkmyenterprise.com/pricing',
          primary: false,
          icon: ''
        }
      ],
      note: 'Votre compte vitalCHECK gratuit est maintenant actif. Conservez vos identifiants en sécurité.'
    })
  };

  return sendEmail(mailOptions);
};

// Send email to existing account holder after assessment
const sendAssessmentCompletedExistingUser = async (to, name, score) => {
  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Nouvelle évaluation complétée - vitalCHECK',
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Nouvelle Évaluation !',
      subtitle: `Bonjour <strong>${name}</strong>, vous avez complété une nouvelle évaluation vitalCHECK !`,
      score: {
        value: `${Math.round(score)}/100`,
        label: 'Votre Nouveau Score',
        status: score >= 70 ? 'green' : score >= 50 ? 'amber' : 'red',
        message: score >= 70 ? '🟢 Excellent progrès !' : score >= 50 ? '🟡 Continuez vos efforts' : '🔴 Focus sur l\'amélioration'
      },
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Connectez-vous à votre dashboard pour :
        </p>
        
        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li>Consulter votre rapport détaillé</li>
          <li>Comparer avec vos évaluations précédentes</li>
          <li>Suivre votre progression dans le temps</li>
          <li>Télécharger le PDF de votre rapport</li>
            </ul>
      `,
      buttons: [
        {
          text: 'Voir Mon Dashboard',
          url: 'https://checkmyenterprise.com/client/dashboard',
          primary: true,
          icon: ''
        },
        {
          text: 'Télécharger le rapport',
          url: 'https://checkmyenterprise.com/results',
          primary: false,
          icon: ''
        }
      ],
      note: 'Votre nouvelle évaluation a été ajoutée à votre historique. Consultez votre dashboard pour voir tous vos résultats.'
    })
  };

  return sendEmail(mailOptions);
};

// Send results email for the simplified Niveau 1 diagnostic (v2), with the 2-page PDF attached
const sendV2ResultEmail = async (to, name, overallScore, levelLabel, levelId, resultsUrl, pdfBuffer) => {
  const statusByLevel = {
    critique: 'red',
    vulnerable: 'red',
    stable: 'amber',
    pret: 'green',
    haute_performance: 'green'
  };

  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'vitalCHECK - Votre diagnostic gratuit est prêt !',
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Votre diagnostic vitalCHECK est prêt !',
      subtitle: `Bonjour <strong>${name}</strong>, voici les résultats de votre diagnostic gratuit (Niveau 1).`,
      score: {
        value: `${Math.round(overallScore)}/100`,
        label: `Niveau : ${levelLabel}`,
        status: statusByLevel[levelId] || 'amber',
        message: 'Retrouvez le détail de votre score par pilier dans le rapport ci-joint.'
      },
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Vous trouverez en pièce jointe votre rapport complet (2 pages) avec :
        </p>

        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li>Votre score détaillé pour chacun des 5 piliers</li>
          <li>Votre niveau de maturité global et son interprétation</li>
          <li>Vos principaux risques et points forts</li>
          <li>Vos 3 prochaines actions prioritaires</li>
        </ul>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #14532d; font-size: 14px;">
            <strong>Envie d'aller plus loin ?</strong> Notre diagnostic Premium vous propose une analyse approfondie et un accompagnement personnalisé.
          </p>
        </div>
      `,
      buttons: [
        {
          text: 'Voir mes résultats en ligne',
          url: resultsUrl,
          primary: true,
          icon: ''
        }
      ],
      note: 'Ce rapport correspond à votre auto-évaluation gratuite (Niveau 1) et constitue un point de départ pour identifier vos priorités.'
    }),
    attachments: pdfBuffer ? [
      {
        filename: 'vitalCHECK-diagnostic-niveau1.pdf',
        content: pdfBuffer
      }
    ] : []
  };

  return sendEmail(mailOptions);
};

// Send subscription upgrade email (for existing account holders who pay)
const sendSubscriptionUpgradeEmail = async (to, name, planName, planId) => {
  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Votre abonnement ${planName} est activé !`,
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Paiement Confirmé !',
      subtitle: `Bonjour <strong>${name}</strong>, excellent choix ! Votre abonnement a été mis à jour.`,
      content: `
        <div style="text-align: center; margin: 20px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border: 2px solid #10b981;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 16px;">Votre nouveau plan :</p>
          <div style="background: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-size: 18px; font-weight: bold; display: inline-block;">
            ${planName}
          </div>
          <p style="margin: 10px 0 0 0; color: #10b981; font-weight: bold; font-size: 16px;">Actif maintenant !</p>
            </div>

        <h3 style="color: #00751B; margin: 20px 0 15px 0; font-size: 18px;">🎯 Vos nouveaux avantages :</h3>
        <ul style="margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8;">
              ${planId === 'premium' || planId === 'diagnostic' ? `
          <li>Consultation avec nos experts</li>
          <li>Analyse comparative sectorielle</li>
          <li>Plan d'action personnalisé</li>
          <li>Support prioritaire</li>
          ` : `
          <li>Recommandations personnalisées</li>
          <li>Évaluations multiples</li>
          <li>Historique et suivi</li>
          <li>Support WhatsApp</li>
          `}
          <li>Accès illimité à votre dashboard</li>
          <li>Rapports PDF avancés</li>
            </ul>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #14532d; font-size: 14px;">
              <strong>Besoin d'aide ?</strong> Notre équipe vous contactera sous 24h pour vous accompagner.
            </p>
        </div>
      `,
      buttons: [
        {
          text: 'Accéder à Mon Dashboard',
          url: 'https://checkmyenterprise.com/client/dashboard',
          primary: true,
          icon: ''
        },
        {
          text: 'Nous contacter',
          url: 'mailto:info@checkmyenterprise.com',
          primary: false,
          icon: ''
        }
      ],
      note: 'Votre abonnement est maintenant actif. Profitez de tous vos nouveaux avantages !'
    })
  };

  return sendEmail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (to, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'https://checkmyenterprise.com'}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: `"vitalCHECK" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Réinitialisation de votre mot de passe - vitalCHECK',
    html: createUnifiedEmailTemplate({
      language: 'fr',
      title: 'Réinitialisation de mot de passe',
      subtitle: `Bonjour <strong>${name}</strong>, vous avez demandé à réinitialiser votre mot de passe.`,
      content: `
        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
          Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien est valide pendant <strong>1 heure</strong>.
        </p>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>⚠️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe ne sera pas modifié.
          </p>
        </div>
      `,
      buttons: [
        {
          text: 'Réinitialiser mon mot de passe',
          url: resetUrl,
          primary: true,
          icon: '🔒'
        }
      ],
      note: 'Ce lien expirera dans 1 heure. Pour des raisons de sécurité, ne partagez jamais ce lien avec personne.'
    })
  };

  return sendEmail(mailOptions);
};

/**
 * Utilitaire pour enregistrer un email sortant dans la collection Message
 */
const saveOutboundEmail = async (mailOptions, messageId, providedContactId = null, providedContactModel = null, rawContent = null) => {
  try {
    const toEmail = Array.isArray(mailOptions.to) ? mailOptions.to[0] : mailOptions.to;
    const cleanEmail = (toEmail || '').toLowerCase().trim();
    
    let contactId = providedContactId;
    let contactModel = providedContactModel || 'Contact';
    
    // Si l'ID n'est pas fourni, on cherche par email
    if (!contactId) {
      const contact = await Contact.findOne({ email: cleanEmail });
      if (contact) {
        contactId = contact._id;
        contactModel = 'Contact';
      } else {
        const user = await User.findOne({ email: cleanEmail });
        if (user) {
          contactId = user._id;
          contactModel = 'User';
        } else {
          const mailing = await MailingContact.findOne({ email: cleanEmail });
          if (mailing) {
            contactId = mailing._id;
            contactModel = 'MailingContact';
          }
        }
      }
    }
    
    if (contactId) {
      const newMessage = new Message({
        contactId,
        contactModel,
        direction: 'outbound',
        from: mailOptions.from?.includes('<') ? mailOptions.from.split('<')[1].replace('>', '') : mailOptions.from,
        to: cleanEmail,
        subject: mailOptions.subject,
        body: rawContent || mailOptions.text || mailOptions.html || '', // Utiliser rawContent si disponible
        htmlBody: mailOptions.html,
        date: new Date(),
        messageId: messageId,
        isRead: true
      });
      await newMessage.save();
    }
  } catch (error) {
    console.error('Error saving outbound email:', error);
  }
};

// Send admin notification emails for dashboard events (registration + report_printed)
const sendAdminNotificationEmail = async (admins, type, data) => {
  const levelLabels = {
    critique: 'Critique',
    vulnerable: 'Vulnérable',
    stable: 'Stable',
    pret: 'Prêt',
    haute_performance: 'Haute performance',
  };

  const subjects = {
    user_registered: `[vitalCHECK] Nouvelle inscription — ${data.user.companyName}`,
    report_printed: `[vitalCHECK] Rapport généré — ${data.user.companyName}`,
  };

  const htmlBodies = {
    user_registered: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e40af;">Nouvelle inscription</h2>
        <p>Un nouvel utilisateur vient de s'inscrire sur vitalCHECK :</p>
        <ul style="line-height: 1.8;">
          <li><strong>Entreprise :</strong> ${data.user.companyName}</li>
          <li><strong>Email :</strong> ${data.user.email}</li>
          <li><strong>Taille :</strong> ${data.user.companySize || '—'}</li>
          <li><strong>Secteur :</strong> ${data.user.sector || '—'}</li>
        </ul>
        <p style="color: #6b7280; font-size: 12px;">Notification automatique — vitalCHECK Admin</p>
      </div>
    `,
    report_printed: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e40af;">Rapport de diagnostic généré</h2>
        <p>Un rapport a été généré pour :</p>
        <ul style="line-height: 1.8;">
          <li><strong>Entreprise :</strong> ${data.user.companyName}</li>
          <li><strong>Email :</strong> ${data.user.email}</li>
          <li><strong>Score global :</strong> ${data.assessment.overallScore}/100</li>
          <li><strong>Niveau :</strong> ${levelLabels[data.assessment.overallLevel] || data.assessment.overallLevel}</li>
          <li><strong>Date :</strong> ${new Date(data.assessment.completedAt).toLocaleString('fr-FR')}</li>
        </ul>
        <p style="color: #6b7280; font-size: 12px;">Notification automatique — vitalCHECK Admin</p>
      </div>
    `,
  };

  const subject = subjects[type] || `[vitalCHECK] Notification admin`;
  const html = htmlBodies[type] || `<p>Notification de type ${type}</p>`;

  for (const admin of admins) {
    try {
      await sendEmail({ to: admin.email, subject, html, skipTracking: true });
    } catch (err) {
      console.error(`[adminNotif] email to ${admin.email} failed:`, err.message);
    }
  }
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
  sendV2ResultEmail,
  sendSubscriptionUpgradeEmail,
  sendPasswordResetEmail,
  sendAdminNotificationEmail,
  emailService: {
    sendEmail,
    sendContactConfirmation,
    sendContactNotification,
    sendPaymentEmail,
    sendWelcomeEmail,
    sendAccountCreatedEmail,
    sendAccountCreatedAfterAssessment,
    sendAssessmentCompletedExistingUser,
    sendV2ResultEmail,
    sendSubscriptionUpgradeEmail,
    sendPasswordResetEmail
  }
};
