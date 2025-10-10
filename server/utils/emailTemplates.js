// Fonction générique pour créer le design unifié des emails
const createUnifiedEmailTemplate = (config) => {
  const {
    language = 'fr',
    title,
    subtitle,
    content,
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
      version: 'VitalCheck Enterprise Health Check v1.0',
      contact: '📧 info@checkmyenterprise.com | 📞 +221 771970713 (SEN) / +44 7546756325 (GB)',
      tagline: 'Évaluation Professionnelle d\'Entreprise & Conseil en Croissance'
    },
    en: {
      generatedOn: 'Generated on',
      version: 'VitalCheck Enterprise Health Check v1.0',
      contact: '📧 info@checkmyenterprise.com | 📞 +221 771970713 (SEN) / +44 7546756325 (GB)',
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
      <title>${title} - VitalCheck Enterprise Health Check</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header avec logo VitalCheck -->
        <div style="background: linear-gradient(135deg, #F4C542 0%, #00751B 100%); padding: 20px 15px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==') repeat; opacity: 0.3;"></div>
              
              <!-- Logo VitalCheck -->
              <div style="position: relative; z-index: 2;">
                <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="VitalCheck Logo" style="width: 80px; height: 80px; border-radius: 8px; object-fit: contain; margin-bottom: 10px;" />
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  Enterprise Health Check
                </h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 5px 0 0 0; font-size: 16px; font-weight: 300;">
              ${t.tagline}
                </p>
              </div>
            </div>
            
            <!-- Contenu principal -->
        <div style="padding: 20px 15px;">
              <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: #1a202c; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
              ${title}
                </h2>
            ${subtitle ? `<p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.5;">${subtitle}</p>` : ''}
              </div>
              
          ${score ? `
              <!-- Score principal -->
              <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 15px; margin: 15px 0; text-align: center; border: 1px solid #e2e8f0;">
            <table style="width: 120px; height: 120px; margin: 0 auto 10px auto; border-radius: 50%; background: ${score.status === 'green' ? 'linear-gradient(135deg, #10B981, #059669)' : score.status === 'amber' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)'}; box-shadow: 0 8px 25px rgba(0,0,0,0.15);" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align: center; vertical-align: middle; width: 120px; height: 120px; border-radius: 50%;">
                  <div style="color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin: 0; padding: 0;">
                    ${score.value}
                  </div>
                </td>
              </tr>
            </table>
                <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">
              ${score.label}
                </h3>
                <p style="color: #4a5568; margin: 0; font-size: 16px;">
              ${score.message}
                </p>
              </div>
          ` : ''}
              
          ${companyInfo ? `
              <!-- Détails de l'entreprise -->
              <div style="background: white; border-radius: 12px; padding: 12px; margin: 15px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: #00751B; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; vertical-align: middle;"></span>
              ${companyInfo.title}
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              ${companyInfo.details.map(detail => `
                  <div style="padding: 6px; background: #f8fafc; border-radius: 8px;">
                  <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">${detail.label}</div>
                  <div style="color: #2d3748; font-weight: 600;">${detail.value}</div>
                  </div>
              `).join('')}
                </div>
              </div>
          ` : ''}
          
          ${credentials ? `
              <!-- Identifiants de connexion -->
              <div style="background: white; border-radius: 12px; padding: 12px; margin: 15px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
              <span style="background: #00751B; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-block; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; vertical-align: middle;"></span>
              ${credentials.title}
                </h3>
            <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
              <p style="margin: 0 0 10px 0; color: #2d3748;"><strong>Email :</strong> ${credentials.email}</p>
              ${credentials.password ? `<p style="margin: 0 0 15px 0; color: #2d3748;"><strong>Mot de passe temporaire :</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${credentials.password}</code></p>` : ''}
              ${credentials.warning ? `<p style="color: #dc2626; font-size: 14px; margin: 0;">⚠️ <strong>Important :</strong> ${credentials.warning}</p>` : ''}
            </div>
          </div>
          ` : ''}
          
              <!-- Contenu principal -->
              <div style="background: white; border-radius: 12px; padding: 12px; margin: 15px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            ${content}
              </div>
              
          ${buttons.length > 0 ? `
              <!-- Boutons d'action -->
              <div style="text-align: center; margin: 20px 0;">
            ${buttons.map(button => `
              <a href="${button.url}" 
                 style="background: ${button.primary ? 'linear-gradient(135deg, #00751B 0%, #F4C542 100%)' : 'transparent'}; color: ${button.primary ? 'white' : '#00751B'}; padding: 8px 16px; text-decoration: none; border: ${button.primary ? 'none' : '2px solid #00751B'}; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: ${button.primary ? '0 4px 12px rgba(0, 117, 27, 0.3)' : 'none'}; margin: 0 5px 5px 0;">
                ${button.icon ? `${button.icon} ` : ''}${button.text}
              </a>
            `).join('')}
              </div>
          ` : ''}
              
          ${note ? `
              <!-- Note importante -->
              <div style="background: #f0fdf4; padding: 10px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; color: #14532d; font-size: 14px; line-height: 1.5;">
              <strong>📋 Important :</strong> ${note}
                </p>
              </div>
          ` : ''}
            </div>
            
            <!-- Footer professionnel -->
        <div style="background: #2d3748; padding: 15px; text-align: center; color: #a0aec0;">
              <div style="margin-bottom: 10px;">
                <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="VitalCheck Logo" style="width: 50px; height: 50px; border-radius: 8px; object-fit: contain; margin: 0 auto 10px auto;" />
                <div style="color: #e2e8f0; font-weight: 600; font-size: 14px; margin-top: 5px;">
                  Enterprise Health Check
                </div>
              </div>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #e2e8f0;">
            ${t.tagline}
              </p>
              <div style="margin: 10px 0; padding: 10px 0; border-top: 1px solid #4a5568;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #a0aec0;">
              ${t.contact}
                </p>
                <p style="margin: 0; font-size: 11px; color: #718096;">
              ${t.generatedOn} ${new Date().toLocaleString(isFrench ? 'fr-FR' : 'en-US')} | ${t.version}
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
  `;
};

const emailTemplates = {
  en: {
    reportReady: {
      subject: 'Your VitalCheck Enterprise Health Check Report is Ready!',
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
      subject: 'Votre rapport VitalCheck Enterprise Health Check est prêt !',
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
