// Fonction générique pour créer le design unifié des emails
const createUnifiedEmailTemplate = (config) => {
  const {
    language = 'fr',
    title,
    subtitle,
    content,
    imageUrl = null,
    buttons = [],
    note = null,
    score = null,
    credentials = null,
    companyInfo = null
  } = config;

  const isFrench = language === 'fr';
  
  // Traductions
  const translations = {
    fr: {
      generatedOn: 'Généré le',
      version: 'vitalCHECK Enterprise Health Check v1.0',
      contact: '📧 info@checkmyenterprise.com | 📞 +221 771970713 / +221 774536704',
      tagline: 'Évaluation Professionnelle d\'Entreprise & Conseil en Croissance'
    },
    en: {
      generatedOn: 'Generated on',
      version: 'vitalCHECK Enterprise Health Check v1.0',
      contact: '📧 info@checkmyenterprise.com | 📞 +221 771970713 / +221 774536704',
      tagline: 'Professional Business Assessment & Growth Consulting'
    }
  };

  const t = translations[language];

  return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>${title} - vitalCHECK Enterprise Health Check</title>
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
                width: 60px !important;
                height: 60px !important;
              }
              .title-size {
                font-size: 22px !important;
                line-height: 1.2 !important;
              }
              .subtitle-size {
                font-size: 14px !important;
                line-height: 1.4 !important;
              }
              .h2-size {
                font-size: 18px !important;
                line-height: 1.3 !important;
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
              /* Table responsive */
              table[class="responsive-table"] {
                width: 100% !important;
              }
              td[width="50%"] {
                width: 100% !important;
                display: block !important;
                padding: 6px !important;
              }
              /* Button responsive */
              .button-table {
                width: 100% !important;
                max-width: 100% !important;
              }
              .button-link {
                width: 100% !important;
                display: block !important;
                padding: 14px 20px !important;
                font-size: 16px !important;
                text-align: center !important;
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
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #f8fafc;">
            <tr>
              <td align="center" style="padding: 20px 10px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
                  
                  <!-- Header avec logo vitalCHECK -->
                  <tr>
                    <td class="header-padding" style="background: linear-gradient(135deg, #F4C542 0%, #00751B 100%); padding: 20px 15px; text-align: center; position: relative;">
                      <div style="position: relative; z-index: 2;">
                        <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="vitalCHECK Logo" class="logo-size" style="width: 80px; height: 80px; max-width: 100%; border-radius: 8px; object-fit: contain; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" />
                        <h1 class="title-size" style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); line-height: 1.2;">
                          Enterprise Health Check
                        </h1>
                        <p class="subtitle-size" style="color: rgba(255, 255, 255, 0.9); margin: 5px 0 0 0; font-size: 16px; font-weight: 300; line-height: 1.4;">
                          ${t.tagline}
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Contenu principal -->
                  <tr>
                    <td class="content-padding" style="padding: 20px 15px;">
                      <div style="text-align: center; margin-bottom: 15px;">
                        <h2 class="h2-size" style="color: #1a202c; margin: 0 0 10px 0; font-size: 24px; font-weight: 600; line-height: 1.3;">
                          ${title}
                        </h2>
                        ${subtitle ? `<p class="text-size" style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.5;">${subtitle}</p>` : ''}
                      </div>
                      
                      ${imageUrl ? `
                      <!-- Image de la newsletter -->
                      <div style="text-align: center; margin: 20px 0;">
                        <img src="${imageUrl}" alt="${title}" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />
                      </div>
                      ` : ''}
              
                      ${score ? `
                      <!-- Score principal -->
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 15px; margin: 15px 0; text-align: center; border: 1px solid #e2e8f0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 120px; max-width: 100%; height: 120px; margin: 0 auto 10px auto; border-radius: 50%; background: ${score.status === 'green' ? 'linear-gradient(135deg, #10B981, #059669)' : score.status === 'amber' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)'}; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                          <tr>
                            <td style="text-align: center; vertical-align: middle; width: 120px; height: 120px; max-width: 100%; border-radius: 50%;">
                              <div style="color: white; font-size: clamp(24px, 5vw, 32px); font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin: 0; padding: 0; line-height: 1;">
                                ${score.value}
                              </div>
                            </td>
                          </tr>
                        </table>
                        <h3 class="h2-size" style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px; font-weight: 600; line-height: 1.3;">
                          ${score.label}
                        </h3>
                        <p class="text-size" style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.5;">
                          ${score.message}
                        </p>
                      </div>
                      ` : ''}
              
                      ${companyInfo ? `
                      <!-- Détails de l'entreprise -->
                      <div style="background: white; border-radius: 12px; padding: 12px; margin: 15px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h3 class="h2-size" style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600; line-height: 1.3;">
                          <span style="background: #00751B; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; vertical-align: middle;">●</span>
                          ${companyInfo.title}
                        </h3>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="responsive-table" style="width: 100%;">
                          <tr>
                            ${companyInfo.details.map((detail, index) => `
                              <td style="padding: 6px; background: #f8fafc; border-radius: 8px; ${index % 2 === 0 ? 'padding-right: 4px;' : 'padding-left: 4px;'}" width="50%">
                                <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">${detail.label}</div>
                                <div style="color: #2d3748; font-weight: 600; font-size: 14px; word-wrap: break-word; line-height: 1.4;">${detail.value}</div>
                              </td>
                              ${index % 2 === 1 ? '</tr><tr>' : ''}
                            `).join('')}
                            ${companyInfo.details.length % 2 === 1 ? '<td width="50%"></td></tr>' : '</tr>'}
                          </table>
                      </div>
                      ` : ''}
                      
                      ${credentials ? `
                      <!-- Identifiants de connexion -->
                      <div style="background: white; border-radius: 12px; padding: 12px; margin: 15px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <h3 class="h2-size" style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600; line-height: 1.3;">
                          <span style="background: #00751B; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; vertical-align: middle;">●</span>
                          ${credentials.title}
                        </h3>
                        <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
                          <p class="text-size" style="margin: 0 0 10px 0; color: #2d3748; font-size: 14px; line-height: 1.5; word-wrap: break-word;"><strong>Email :</strong> ${credentials.email}</p>
                          ${credentials.password ? `<p class="text-size" style="margin: 0 0 15px 0; color: #2d3748; font-size: 14px; line-height: 1.5; word-wrap: break-word;"><strong>Mot de passe temporaire :</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 14px; word-break: break-all;">${credentials.password}</code></p>` : ''}
                          ${credentials.warning ? `<p class="text-size" style="color: #dc2626; font-size: 14px; margin: 0; line-height: 1.5;">⚠️ <strong>Important :</strong> ${credentials.warning}</p>` : ''}
                        </div>
                      </div>
                      ` : ''}
                      
                      <!-- Contenu principal -->
                      <div style="background: white; border-radius: 12px; padding: 12px; margin: 15px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div class="text-size" style="color: #4a5568; font-size: 16px; line-height: 1.7; word-wrap: break-word;">
                          ${content}
                        </div>
                      </div>
                      
                      ${buttons.length > 0 ? `
                      <!-- Boutons d'action -->
                      <div style="text-align: center; margin: 20px 0;">
                        ${buttons.map(button => `
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="button-table" style="width: 100%; max-width: 300px; margin: 0 auto 10px auto;">
                            <tr>
                              <td align="center" style="background: ${button.primary ? 'linear-gradient(135deg, #00751B 0%, #F4C542 100%)' : 'transparent'}; border-radius: 8px; ${button.primary ? '' : 'border: 2px solid #00751B;'}">
                                <a href="${button.url}" 
                                   class="button-link"
                                   style="background: ${button.primary ? 'linear-gradient(135deg, #00751B 0%, #F4C542 100%)' : 'transparent'}; color: ${button.primary ? 'white' : '#00751B'}; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; ${button.primary ? 'box-shadow: 0 4px 12px rgba(0, 117, 27, 0.3);' : ''}">
                                  ${button.icon ? `${button.icon} ` : ''}${button.text}
                                </a>
                              </td>
                            </tr>
                          </table>
                        `).join('')}
                      </div>
                      ` : ''}
                      
                      ${note ? `
                      <!-- Note importante -->
                      <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; margin: 15px 0; border: 1px solid #bbf7d0;">
                        <p class="text-size" style="margin: 0; color: #14532d; font-size: 14px; line-height: 1.5;">
                          <strong>📋 Important :</strong> ${note}
                        </p>
                      </div>
                      ` : ''}
                    </td>
                  </tr>
                  
                  <!-- Footer professionnel -->
                  <tr>
                    <td class="footer-padding" style="background: #2d3748; padding: 15px; text-align: center; color: #a0aec0;">
                      <div style="margin-bottom: 10px;">
                        <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="vitalCHECK Logo" style="width: 50px; height: 50px; max-width: 100%; border-radius: 8px; object-fit: contain; margin: 0 auto 10px auto; display: block;" />
                        <div style="color: #e2e8f0; font-weight: 600; font-size: 14px; margin-top: 5px;">
                          Enterprise Health Check
                        </div>
                      </div>
                      <p class="text-size" style="margin: 0 0 10px 0; font-size: 14px; color: #e2e8f0; line-height: 1.4;">
                        ${t.tagline}
                      </p>
                      <div style="margin: 10px 0; padding: 10px 0; border-top: 1px solid #4a5568;">
                        <p class="contact-text" style="margin: 0 0 10px 0; font-size: 12px; color: #a0aec0; line-height: 1.6; word-wrap: break-word;">
                          ${t.contact}
                        </p>
                        <p class="footer-text" style="margin: 0; font-size: 11px; color: #718096; line-height: 1.5;">
                          ${t.generatedOn} ${new Date().toLocaleString(isFrench ? 'fr-FR' : 'en-US')} | ${t.version}
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
  `;
};

const emailTemplates = {
  en: {
    reportReady: {
      subject: 'Your vitalCHECK Enterprise Health Check Report is Ready!',
      html: (user, assessment, pdfDownloadUrl = null, tempPassword = null) => createUnifiedEmailTemplate({
        language: 'en',
        title: 'Your Report is Ready!',
        subtitle: `Dear <strong>${user.companyName}</strong>, your personalized enterprise health assessment is complete.`,
        score: {
          value: assessment.overallScore,
          label: 'Overall Health Score',
          status: assessment.overallStatus,
          message: assessment.overallStatus === 'green' ? '🟢 Healthy & Well-Positioned' : assessment.overallStatus === 'amber' ? '🟡 Needs Improvement' : '🔴 Critical Attention Required'
        },
        companyInfo: {
          title: 'Assessment Details',
          details: [
            { label: 'Company', value: user.companyName },
            { label: 'Sector', value: user.sector },
            { label: 'Company Size', value: user.companySize },
            { label: 'Assessment Date', value: new Date(assessment.completedAt).toLocaleDateString('en-US') }
          ]
        },
        credentials: tempPassword ? {
          title: 'Your Login Credentials',
          email: user.email,
          password: tempPassword,
          warning: 'Change this password on your first login.'
        } : null,
        content: `
          <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #00751B;">
            What's Next?
          </h3>
          <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
            Your detailed report includes personalized recommendations to strengthen your business operations and drive sustainable growth. Download your report to discover actionable insights tailored to your industry and company size.
          </p>
        `,
        buttons: [
          {
            text: '📄 Download PDF Report',
            url: pdfDownloadUrl || 'https://www.checkmyenterprise.com/results',
            primary: true,
            icon: ''
          },
          {
            text: '👁️ View Full Report',
            url: 'https://www.checkmyenterprise.com/results',
            primary: false,
            icon: ''
          },
          {
            text: 'Book Consultation',
            url: 'mailto:info@checkmyenterprise.com?subject=Consultation%20Request',
            primary: false,
            icon: ''
          }
        ],
        note: 'This report is based on your self-assessment responses and provides general guidance. For detailed analysis and customized recommendations, consider scheduling a consultation with our business experts.'
      })
    }
  },
  fr: {
    reportReady: {
      subject: 'Votre rapport vitalCHECK Enterprise Health Check est prêt !',
      html: (user, assessment, pdfDownloadUrl = null, tempPassword = null) => createUnifiedEmailTemplate({
        language: 'fr',
        title: 'Votre rapport est prêt !',
        subtitle: `Cher(e) <strong>${user.companyName}</strong>, votre évaluation personnalisée de santé d'entreprise est terminée.`,
        score: {
          value: assessment.overallScore,
          label: 'Score de Santé Global',
          status: assessment.overallStatus,
          message: assessment.overallStatus === 'green' ? '🟢 En bonne santé et bien positionnée' : assessment.overallStatus === 'amber' ? '🟡 Nécessite des améliorations' : '🔴 Attention critique requise'
        },
        companyInfo: {
          title: 'Détails de l\'Évaluation',
          details: [
            { label: 'Entreprise', value: user.companyName },
            { label: 'Secteur', value: user.sector },
            { label: 'Taille', value: user.companySize },
            { label: 'Date d\'Évaluation', value: new Date(assessment.completedAt).toLocaleDateString('fr-FR') }
          ]
        },
        credentials: tempPassword ? {
          title: 'Vos Identifiants de Connexion',
          email: user.email,
          password: tempPassword,
          warning: 'Changez ce mot de passe lors de votre première connexion.'
        } : null,
        content: `
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #00751B;">
                  Prochaines Étapes ?
                </h3>
                <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
                  Votre rapport détaillé inclut des recommandations personnalisées pour renforcer vos opérations commerciales et stimuler une croissance durable. Téléchargez votre rapport pour découvrir des insights actionnables adaptés à votre secteur et à la taille de votre entreprise.
                </p>
        `,
        buttons: [
          {
            text: '📄 Télécharger le Rapport PDF',
            url: pdfDownloadUrl || 'https://www.checkmyenterprise.com/results',
            primary: true,
            icon: ''
          },
          {
            text: '👁️ Voir le Rapport Complet',
            url: 'https://www.checkmyenterprise.com/results',
            primary: false,
            icon: ''
          },
          {
            text: 'Réserver une Consultation',
            url: 'mailto:info@checkmyenterprise.com?subject=Demande%20de%20Consultation',
            primary: false,
            icon: ''
          }
        ],
        note: 'Ce rapport est basé sur vos réponses à l\'auto-évaluation et fournit des conseils généraux. Pour une analyse détaillée et des recommandations personnalisées, envisagez de planifier une consultation avec nos experts en entreprise.'
      })
    }
  }
};

module.exports = { emailTemplates, createUnifiedEmailTemplate };
