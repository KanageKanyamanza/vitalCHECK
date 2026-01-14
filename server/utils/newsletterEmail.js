/**
 * Classe Email pour l'envoi de newsletters
 * Gère le template HTML responsive avec tracking
 */

const htmlToText = require('html-to-text');

class NewsletterEmail {
  /**
   * Générer le template HTML de la newsletter
   * @param {Object} options - Options du template
   * @param {string} options.htmlContent - Contenu HTML de la newsletter
   * @param {string} options.subject - Sujet de l'email
   * @param {string} options.imageUrl - URL de l'image (optionnel)
   * @param {string} options.newsletterId - ID de la newsletter pour le tracking
   * @param {string} options.subscriberId - ID de l'abonné pour le tracking
   * @param {string} options.subscriberEmail - Email de l'abonné pour le lien de désinscription
   * @param {string} options.previewText - Texte d'aperçu (optionnel)
   */
  static generateTemplate({
    htmlContent,
    subject,
    imageUrl,
    newsletterId,
    subscriberId,
    subscriberEmail,
    previewText
  }) {
    const frontendUrl = process.env.FRONTEND_URL || 'https://www.checkmyenterprise.com';
    const backendUrl = process.env.BACKEND_URL || process.env.API_URL || 'https://ubb-enterprise-health-check.onrender.com/api';
    
    // URL du pixel de tracking
    const trackingPixelUrl = newsletterId && subscriberId
      ? `${backendUrl}/newsletters/track/${newsletterId}/${subscriberId}`
      : null;

    // URL de désinscription
    const unsubscribeUrl = `${frontendUrl}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;

    // Logo URL
    const logoUrl = `${frontendUrl}/ms-icon-310x310.png`;

    const template = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${subject || 'Newsletter'} - vitalCHECK</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
      .header-padding {
        padding: 15px 10px !important;
      }
      .content-padding {
        padding: 15px 10px !important;
      }
      .footer-padding {
        padding: 15px 10px !important;
      }
      .logo-size {
        width: 50px !important;
        height: 50px !important;
      }
      .title-size {
        font-size: 22px !important;
        line-height: 1.2 !important;
      }
      .subtitle-size {
        font-size: 14px !important;
        line-height: 1.4 !important;
      }
      .text-size {
        font-size: 14px !important;
        line-height: 1.6 !important;
      }
      .footer-text {
        font-size: 11px !important;
        line-height: 1.5 !important;
      }
      .contact-text {
        font-size: 11px !important;
        word-break: break-word !important;
        line-height: 1.6 !important;
      }
      table[class="responsive-table"] {
        width: 100% !important;
      }
      td[width="50%"] {
        width: 100% !important;
        display: block !important;
        padding: 6px !important;
      }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    .container { width: 600px !important; }
    td[width="50%"] { width: 50% !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header-padding" style="background: linear-gradient(135deg, #00751B 0%, #F4C542 100%); padding: 20px 15px; text-align: center;">
              <img src="${logoUrl}" alt="vitalCHECK Logo" class="logo-size" style="width: 50px; height: 50px; max-width: 100%; border-radius: 8px; object-fit: contain; margin-bottom: 10px; background: rgba(255,255,255,0.1); padding: 6px; border-radius: 12px; display: block; margin-left: auto; margin-right: auto;" />
              <h1 class="title-size" style="color: #ffffff; margin: 0; font-size: clamp(20px, 4vw, 28px); font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: -0.5px; line-height: 1.2;">
                ${subject || 'Newsletter vitalCHECK'}
              </h1>
              ${previewText ? `<p class="subtitle-size" style="color: rgba(255, 255, 255, 0.95); margin: 8px 0 0 0; font-size: clamp(14px, 2.5vw, 16px); font-weight: 400; line-height: 1.4;">${previewText}</p>` : ''}
            </td>
          </tr>

          ${imageUrl ? `
          <!-- Image de la newsletter -->
          <tr>
            <td style="padding: 0;">
              <img src="${imageUrl}" alt="${subject || 'Newsletter'}" style="width: 100%; max-width: 100%; height: auto; display: block;" />
            </td>
          </tr>
          ` : ''}

          <!-- Contenu principal -->
          <tr>
            <td class="content-padding" style="padding: 20px 15px;">
              <div class="text-size" style="color: #333333; font-size: clamp(14px, 2vw, 16px); line-height: 1.7; word-wrap: break-word;">
                ${htmlContent}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background: #1f2937; padding: 20px 15px; text-align: center;">
              <img src="${logoUrl}" alt="vitalCHECK Logo" style="width: 40px; height: 40px; max-width: 100%; border-radius: 8px; object-fit: contain; margin: 0 auto 10px auto; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 10px; display: block;" />
              <h3 style="color: #ffffff; margin: 0 0 6px 0; font-size: clamp(16px, 3vw, 18px); font-weight: 700; line-height: 1.2;">Enterprise Health Check</h3>
              <p class="text-size" style="color: #9ca3af; margin: 0; font-size: clamp(12px, 2vw, 13px); line-height: 1.5;">Évaluation Professionnelle d'Entreprise & Conseil en Croissance</p>
              <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #374151;">
                <p class="contact-text" style="color: #9ca3af; margin: 0 0 8px 0; font-size: clamp(12px, 2vw, 13px); line-height: 1.6; word-wrap: break-word;">📧 info@checkmyenterprise.com | 📞 +221 771970713 / +221 774536704</p>
                <p class="footer-text" style="color: #6b7280; margin: 0; font-size: clamp(11px, 1.8vw, 12px);"><a href="${frontendUrl}" style="color: #60a5fa; text-decoration: none;">www.checkmyenterprise.com</a></p>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
                <p class="footer-text" style="color: #6b7280; margin: 0; font-size: clamp(10px, 1.6vw, 11px); line-height: 1.5; word-wrap: break-word;">Vous recevez cet email car vous êtes abonné à la newsletter vitalCHECK.</p>
                <p class="footer-text" style="color: #6b7280; margin: 10px 0 0 0; font-size: clamp(10px, 1.6vw, 11px);">
                  <a href="${unsubscribeUrl}" style="color: #60a5fa; text-decoration: underline;">Se désabonner</a>
                </p>
                <p class="footer-text" style="color: #4b5563; margin: 10px 0 0 0; font-size: clamp(9px, 1.4vw, 10px);">&copy; ${new Date().getFullYear()} vitalCHECK Enterprise Health Check. Tous droits réservés.</p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  
  ${trackingPixelUrl ? `
  <!-- Pixel de tracking invisible -->
  <img src="${trackingPixelUrl}" width="1" height="1" style="display:none; width:1px; height:1px; border:0;" alt="" />
  ` : ''}
</body>
</html>
    `;

    return template.trim();
  }

  /**
   * Convertir HTML en texte brut
   * @param {string} html - Contenu HTML
   */
  static htmlToText(html) {
    return htmlToText.convert(html, {
      wordwrap: 80,
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } }
      ]
    });
  }

  /**
   * Envoyer une newsletter
   * @param {Object} options - Options d'envoi
   * @param {string} options.to - Email destinataire
   * @param {string} options.subject - Sujet
   * @param {string} options.htmlContent - Contenu HTML
   * @param {string} options.imageUrl - URL de l'image (optionnel)
   * @param {string} options.newsletterId - ID de la newsletter
   * @param {string} options.subscriberId - ID de l'abonné
   * @param {string} options.subscriberEmail - Email de l'abonné
   * @param {string} options.previewText - Texte d'aperçu (optionnel)
   */
  static sendNewsletter(options) {
    try {
      const {
        to,
        subject,
        htmlContent,
        imageUrl,
        newsletterId,
        subscriberId,
        subscriberEmail,
        previewText
      } = options;

      // Générer le template HTML
      const html = this.generateTemplate({
        htmlContent,
        subject,
        imageUrl,
        newsletterId,
        subscriberId,
        subscriberEmail,
        previewText
      });

      // Convertir en texte brut (seulement le contenu, pas tout le template)
      let text = '';
      try {
        text = this.htmlToText(htmlContent || '');
      } catch (textError) {
        console.warn('⚠️  [NEWSLETTER EMAIL] Erreur lors de la conversion HTML vers texte:', textError.message);
        // Fallback: extraire le texte manuellement
        text = (htmlContent || '').replace(/<[^>]*>/g, '').trim();
      }

      return {
        html,
        text,
        subject
      };
    } catch (error) {
      console.error('❌ [NEWSLETTER EMAIL] Erreur dans sendNewsletter:', error);
      throw error;
    }
  }
}

module.exports = NewsletterEmail;
