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
                    <td class="header-padding" style="background: linear-gradient(135deg, #F4C542 0%, #00751B 100%); padding: 25px 15px; text-align: center; position: relative;">
                      <div style="position: relative; z-index: 2;">
                        <img src="data:image/png;base64,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Pf7Nl8fc/JtwkAjmMVel4dRGwz1tVrW5YUqG0ZmCOoXF/mDyrhFwNZrhEDUsy3htHf7tN4UvP1HyykUoqy6mPZAeimJuSO4jy/mYG48UPHRX5Oc+2OPO65VD2Xnuuy7nxs+s8cmHAl/9q5K/eeYsr272GbGKSofABG8VIiXqhG89NebRH6/wsbs38bHmAftU7qV2XLnaRK2ubQ6xfYI+tXdPgqjp7B4i2U4SNOujMTFpJjz+co//7V9l/NG3hdNDRTQQ8ASn5IwIboIXw/AMNOfMpQ7Pvig88aTw7Ks55D0OrhxkrXeRG49f4MP3RO69M7Dci4xHA0bViLFOKMmJdPARJkNP1wZ8+N4uuS+YZ8KtOSxozrlETqwhw7br3KfA2oUEvWsxVKwWQXcRydxUP6hJlSTXpDnwBGBCwRJ//oOMf/pHF3nx7QNEOYQ3RUwx8agX8BGIiCYPmUdxZigdVIzoBhzoKR+9teLRD8ND9/a4dskgDBia58yFLs+9Enjmx5u8erbDxjCn40Z0Vxwf+kDk1z4JK70JNhVD07z2EkOb62JSi62R9h5w2xCwlxh6WQQ0xrHtg9kbAVbLwqnnhIBk0ohOkjLkC77yo1X+ly/AqUuCc0qG0PHgOxXBeUCZRGUygSpmIP20I8MmYl1EPclVCBKNXn/InTc5fvGDHT72kHHtwREdyUAdpXo2ozIphRAqQp7RDUJgWC8WB2YzBIjuioBmlTtJPuv3goDL84DaJ7nDm7UroWtsRwvENDOcGULJJB7lr57e5Ox64NbjjttvMe6+ccINxzxr3Q55CJSqbG4Jr51RXj4d+fHpS5x6x7M+7BERxCerSxYDkDMocr77woCnXh1z7zcDn7y7y4fuF268ccJqv2StU+CtAFeBdEC7aMwxl5zuiQy1Lb57gMUaqee9tcvvAGJaZeLmEOAkPTevCTeDN1zL29mQIFCEDO8mXCoO8LtfLwj9jI/dC9cezFh2QwIRcVaLeoIQiQYjW+XCVuD504HvvagAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0wOVQxMzoyNzozOCswMDowMGM4ZLUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMDlUMTM6Mjc6MzgrMDA6MDASZdwJAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADE5MkBdcVUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTky06whCAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNzU3NDI0NDU4gqUJQAAAAA90RVh0VGh1bWI6OlNpemUAMEJClKI+7AAAAFZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL21udGxvZy9mYXZpY29ucy8yMDI1LTA5LTA5LzU3MGRjNThlNjYxM2JkMDFhNWI0Mjk2N2FlYTBhMDllLmljby5wbmfxLlk4AAAAAElFTkSuQmCC" alt="vitalCHECK" width="64" height="64" style="width:64px;height:64px;border-radius:10px;display:block;margin:0 auto 12px auto;" />
                        <h1 class="title-size" style="color: white; margin: 0; font-size: 24px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.1); line-height: 1.2; text-transform: uppercase;">
                          ${title}
                        </h1>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Contenu principal -->
                  <tr>
                    <td class="content-padding" style="padding: 15px 25px;">
                      
                      ${imageUrl ? `
                      <div style="text-align: center; margin-bottom: 15px;">
                        <img src="${imageUrl}" alt="${title}" style="max-width: 100%; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: block;" />
                      </div>
                      ` : ''}

                      ${score ? `
                      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 15px; margin: 15px 0; text-align: center; border: 1px solid #e2e8f0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100px; height: 100px; margin: 0 auto 10px auto; border-radius: 50%; background: ${score.status === 'green' ? 'linear-gradient(135deg, #10B981, #059669)' : score.status === 'amber' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)'};">
                          <tr>
                            <td align="center" valign="middle" style="color: white; font-size: 24px; font-weight: 700;">${score.value}</td>
                          </tr>
                        </table>
                        <h3 style="color: #2d3748; margin: 0 0 5px 0; font-size: 18px;">${score.label}</h3>
                        <p style="color: #4a5568; margin: 0; font-size: 14px;">${score.message}</p>
                      </div>
                      ` : ''}

                      ${companyInfo ? `
                      <div style="margin: 15px 0; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
                        <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">● ${companyInfo.title}</h3>
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            ${companyInfo.details.map((detail, index) => `
                              <td style="padding: 5px;" width="50%">
                                <div style="color: #718096; font-size: 11px; text-transform: uppercase;">${detail.label}</div>
                                <div style="color: #2d3748; font-weight: 600; font-size: 13px;">${detail.value}</div>
                              </td>
                              ${index % 2 === 1 ? '</tr><tr>' : ''}
                            `).join('')}
                          </tr>
                        </table>
                      </div>
                      ` : ''}

                      ${credentials ? `
                      <div style="margin: 15px 0; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                         <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 16px;">● ${credentials.title}</h3>
                         <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Email:</strong> ${credentials.email}</p>
                         ${credentials.password ? `<p style="margin: 0; font-size: 14px;"><strong>Pass:</strong> <code>${credentials.password}</code></p>` : ''}
                      </div>
                      ` : ''}
              
                      <!-- Zone de message épurée -->
                      <div class="text-size" style="color: #2d3748; font-size: 16px; line-height: 1.7; word-wrap: break-word;">
                        ${content}
                      </div>

                      ${buttons.length > 0 ? `
                      <div style="text-align: center; margin: 25px 0;">
                        ${buttons.map(button => `
                          <a href="${button.url}" style="background: ${button.primary ? 'linear-gradient(135deg, #00751B, #F4C542)' : 'white'}; color: ${button.primary ? 'white' : '#00751B'}; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin: 5px; border: ${button.primary ? 'none' : '2px solid #00751B'}">
                            ${button.text}
                          </a>
                        `).join('')}
                      </div>
                      ` : ''}

                      ${note ? `
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
                    <td class="footer-padding" style="background: #1a202c; padding: 30px 20px; text-align: center; color: #a0aec0;">
                      <div style="margin-bottom: 15px;">
                        <img src="data:image/png;base64,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Pf7Nl8fc/JtwkAjmMVel4dRGwz1tVrW5YUqG0ZmCOoXF/mDyrhFwNZrhEDUsy3htHf7tN4UvP1HyykUoqy6mPZAeimJuSO4jy/mYG48UPHRX5Oc+2OPO65VD2Xnuuy7nxs+s8cmHAl/9q5K/eeYsr272GbGKSofABG8VIiXqhG89NebRH6/wsbs38bHmAftU7qV2XLnaRK2ubQ6xfYI+tXdPgqjp7B4i2U4SNOujMTFpJjz+co//7V9l/NG3hdNDRTQQ8ASn5IwIboIXw/AMNOfMpQ7Pvig88aTw7Ks55D0OrhxkrXeRG49f4MP3RO69M7Dci4xHA0bViLFOKMmJdPARJkNP1wZ8+N4uuS+YZ8KtOSxozrlETqwhw7br3KfA2oUEvWsxVKwWQXcRydxUP6hJlSTXpDnwBGBCwRJ//oOMf/pHF3nx7QNEOYQ3RUwx8agX8BGIiCYPmUdxZigdVIzoBhzoKR+9teLRD8ND9/a4dskgDBia58yFLs+9Enjmx5u8erbDxjCn40Z0Vxwf+kDk1z4JK70JNhVD07z2EkOb62JSi62R9h5w2xCwlxh6WQQ0xrHtg9kbAVbLwqnnhIBk0ohOkjLkC77yo1X+ly/AqUuCc0qG0PHgOxXBeUCZRGUygSpmIP20I8MmYl1EPclVCBKNXn/InTc5fvGDHT72kHHtwREdyUAdpXo2ozIphRAqQp7RDUJgWC8WB2YzBIjuioBmlTtJPuv3goDL84DaJ7nDm7UroWtsRwvENDOcGULJJB7lr57e5Ox64NbjjttvMe6+ccINxzxr3Q55CJSqbG4Jr51RXj4d+fHpS5x6x7M+7BERxCerSxYDkDMocr77woCnXh1z7zcDn7y7y4fuF268ccJqv2StU+CtAFeBdEC7aMwxl5zuiQy1Lb57gMUaqee9tcvvAGJaZeLmEOAkPTevCTeDN1zL29mQIFCEDO8mXCoO8LtfLwj9jI/dC9cezFh2QwIRcVaLeoIQiQYjW+XCVuD504HvvagAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wOS0wOVQxMzoyNzozOCswMDowMGM4ZLUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDktMDlUMTM6Mjc6MzgrMDA6MDASZdwJAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADE5MkBdcVUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTky06whCAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNzU3NDI0NDU4gqUJQAAAAA90RVh0VGh1bWI6OlNpemUAMEJClKI+7AAAAFZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL21udGxvZy9mYXZpY29ucy8yMDI1LTA5LTA5LzU3MGRjNThlNjYxM2JkMDFhNWI0Mjk2N2FlYTBhMDllLmljby5wbmfxLlk4AAAAAElFTkSuQmCC" alt="vitalCHECK" width="50" height="50" style="width:50px;height:50px;border-radius:8px;display:block;margin:0 auto 8px auto;" />
                        <div style="color: #e2e8f0; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                          Enterprise Health Check
                        </div>
                      </div>
                      <p class="text-size" style="margin: 0 0 15px 0; font-size: 13px; color: #cbd5e0; line-height: 1.4; font-style: italic;">
                        ${t.tagline}
                      </p>
                      <div style="margin: 15px 0; padding: 15px 0; border-top: 1px solid #2d3748;">
                        <p class="contact-text" style="margin: 0 0 12px 0; font-size: 12px; color: #cbd5e0; line-height: 1.6; word-wrap: break-word;">
                          ${t.contact}
                        </p>
                        <p class="footer-text" style="margin: 0; font-size: 11px; color: #718096; line-height: 1.5;">
                           UBUNTU BUSINESS BUILDERS (UBB) – SARL<br>
                           Dakar, Sénégal<br>
                           RCCM : SN.DKR.2026.B.1650 | NINEA : 012753069<br><br>
                           ${t.generatedOn} ${new Date().toLocaleString(isFrench ? 'fr-FR' : 'en-US')}
                        </p>
                      </div>
                      <p style="margin-top: 20px; font-size: 10px; color: #4a5568;">
                        © ${new Date().getFullYear()} vitalCHECK Enterprise Health Check. Tous droits réservés.
                      </p>
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
