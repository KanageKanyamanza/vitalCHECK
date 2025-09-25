const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (emailOptions) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      attachments: emailOptions.attachments || []
    };

    console.log('📧 [EMAIL] Envoi d\'email en cours...', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
      attachmentsCount: mailOptions.attachments.length
    });

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ [EMAIL] Email envoyé avec succès:', {
      messageId: result.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject,
      response: result.response
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ [EMAIL] Erreur lors de l\'envoi d\'email:', {
      to: emailOptions.to,
      subject: emailOptions.subject,
      error: error.message,
      code: error.code,
      responseCode: error.responseCode
    });
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
    subject: 'Confirmation de réception - UBB Enterprise Health Check',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">UBB Enterprise Health Check</h1>
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
            <strong>L'équipe UBB</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            UBB Enterprise Health Check - Douala, Cameroun<br>
            Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
          </p>
        </div>
      </div>
    `
  };

  return await sendEmail(emailOptions);
};

// Send contact notification to UBB team
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
          <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 600;">UBB Enterprise Health Check</h1>
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
            UBB Enterprise Health Check - Dakar, Sénégal | Système de notification automatique
          </p>
        </div>
      </div>
    `
  };

  return await sendEmail(emailOptions);
};

module.exports = {
  sendEmail,
  testEmailConfig,
  sendContactConfirmation,
  sendContactNotification,
  emailService: {
    sendContactConfirmation,
    sendContactNotification
  }
};
