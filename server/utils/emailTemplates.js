const emailTemplates = {
  en: {
    reportReady: {
      subject: 'Your UBB Enterprise Health Check Report is Ready!',
      html: (user, assessment) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>UBB Enterprise Health Check Report</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header avec logo UBB -->
            <div style="background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==') repeat; opacity: 0.3;"></div>
              
              <!-- Logo UBB -->
              <div style="position: relative; z-index: 2;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 50%; margin-bottom: 20px; backdrop-filter: blur(10px);">
                  <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="UBB Logo" style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  Enterprise Health Check
                </h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
                  Professional Business Assessment Report
                </p>
              </div>
            </div>
            
            <!-- Contenu principal -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1a202c; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                  Your Report is Ready!
                </h2>
                <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.5;">
                  Dear <strong>${user.companyName}</strong>, your personalized enterprise health assessment is complete.
                </p>
              </div>
              
              <!-- Score principal -->
              <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; border: 1px solid #e2e8f0;">
                <div style="width: 120px; height: 120px; border-radius: 50%; background: ${assessment.overallStatus === 'green' ? 'linear-gradient(135deg, #10B981, #059669)' : assessment.overallStatus === 'amber' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                  <div style="color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    ${assessment.overallScore}
                  </div>
                </div>
                <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">
                  Overall Health Score
                </h3>
                <p style="color: #4a5568; margin: 0; font-size: 16px;">
                  ${assessment.overallStatus === 'green' ? '🟢 Healthy & Well-Positioned' : assessment.overallStatus === 'amber' ? '🟡 Needs Improvement' : '🔴 Critical Attention Required'}
                </p>
              </div>
              
              <!-- Détails de l'entreprise -->
              <div style="background: white; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: #fbc350; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px;">📊</span>
                  Assessment Details
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Company</div>
                    <div style="color: #2d3748; font-weight: 600;">${user.companyName}</div>
                  </div>
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Sector</div>
                    <div style="color: #2d3748; font-weight: 600;">${user.sector}</div>
                  </div>
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Company Size</div>
                    <div style="color: #2d3748; font-weight: 600;">${user.companySize}</div>
                  </div>
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Assessment Date</div>
                    <div style="color: #2d3748; font-weight: 600;">${new Date(assessment.completedAt).toLocaleDateString('en-US')}</div>
                  </div>
                </div>
              </div>
              
              <!-- Message personnalisé -->
              <div style="background: white; border: 2px solid #fbc350; border-radius: 12px; padding: 25px; margin: 30px 0; color: #2d3748; text-align: center;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #fbc350;">
                  🚀 What's Next?
                </h3>
                <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
                  Your detailed report includes personalized recommendations to strengthen your business operations and drive sustainable growth. Download your report to discover actionable insights tailored to your industry and company size.
                </p>
              </div>
              
              <!-- Boutons d'action -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://www.checkmyenterprise.com/results" 
                   style="background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(251, 195, 80, 0.3); margin: 0 10px 10px 0;">
                  📊 View Full Report
                </a>
                <a href="mailto:ambrose.nzeyi@gmail.com?subject=Consultation%20Request" 
                   style="background: transparent; color: #fbc350; padding: 16px 32px; text-decoration: none; border: 2px solid #fbc350; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; margin: 0 0 10px 10px;">
                  💬 Book Consultation
                </a>
              </div>
              
              <!-- Note importante -->
              <div style="background: #fef5e7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  <strong>📋 Important:</strong> This report is based on your self-assessment responses and provides general guidance. For detailed analysis and customized recommendations, consider scheduling a consultation with our business experts.
                </p>
              </div>
            </div>
            
            <!-- Footer professionnel -->
            <div style="background: #2d3748; padding: 30px; text-align: center; color: #a0aec0;">
              <div style="margin-bottom: 20px;">
                <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="UBB Logo" style="width: 50px; height: 50px; border-radius: 50%; object-fit: contain; margin: 0 auto 10px auto;" />
                <div style="color: #e2e8f0; font-weight: 600; font-size: 14px; margin-top: 5px;">
                  Enterprise Health Check
                </div>
              </div>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #e2e8f0;">
                Professional Business Assessment & Growth Consulting
              </p>
              <div style="margin: 20px 0; padding: 20px 0; border-top: 1px solid #4a5568;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #a0aec0;">
                  📧 ambrose.nzeyi@gmail.com | 📞 +221 771970713 (SEN) / +44 7546756325 (GB)
                </p>
                <p style="margin: 0; font-size: 11px; color: #718096;">
                  Generated on ${new Date().toLocaleString('en-US')} | UBB Enterprise Health Check v1.0
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }
  },
  fr: {
    reportReady: {
      subject: 'Votre rapport UBB Enterprise Health Check est prêt !',
      html: (user, assessment) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rapport UBB Enterprise Health Check</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header avec logo UBB -->
            <div style="background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==') repeat; opacity: 0.3;"></div>
              
              <!-- Logo UBB -->
              <div style="position: relative; z-index: 2;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 50%; margin-bottom: 20px; backdrop-filter: blur(10px);">
                  <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="UBB Logo" style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                  Enterprise Health Check
                </h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
                  Rapport d'Évaluation Professionnelle d'Entreprise
                </p>
              </div>
            </div>
            
            <!-- Contenu principal -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1a202c; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                  Votre rapport est prêt !
                </h2>
                <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.5;">
                  Cher(e) <strong>${user.companyName}</strong>, votre évaluation personnalisée de santé d'entreprise est terminée.
                </p>
              </div>
              
              <!-- Score principal -->
              <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; border: 1px solid #e2e8f0;">
                <div style="width: 120px; height: 120px; border-radius: 50%; background: ${assessment.overallStatus === 'green' ? 'linear-gradient(135deg, #10B981, #059669)' : assessment.overallStatus === 'amber' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #EF4444, #DC2626)'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                  <div style="color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    ${assessment.overallScore}
                  </div>
                </div>
                <h3 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">
                  Score de Santé Global
                </h3>
                <p style="color: #4a5568; margin: 0; font-size: 16px;">
                  ${assessment.overallStatus === 'green' ? '🟢 En bonne santé et bien positionnée' : assessment.overallStatus === 'amber' ? '🟡 Nécessite des améliorations' : '🔴 Attention critique requise'}
                </p>
              </div>
              
              <!-- Détails de l'entreprise -->
              <div style="background: white; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: #fbc350; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px;">📊</span>
                  Détails de l'Évaluation
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Entreprise</div>
                    <div style="color: #2d3748; font-weight: 600;">${user.companyName}</div>
                  </div>
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Secteur</div>
                    <div style="color: #2d3748; font-weight: 600;">${user.sector}</div>
                  </div>
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Taille</div>
                    <div style="color: #2d3748; font-weight: 600;">${user.companySize}</div>
                  </div>
                  <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #718096; font-size: 12px; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Date d'Évaluation</div>
                    <div style="color: #2d3748; font-weight: 600;">${new Date(assessment.completedAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </div>
              
              <!-- Message personnalisé -->
              <div style="background: white; border: 2px solid #fbc350; border-radius: 12px; padding: 25px; margin: 30px 0; color: #2d3748; text-align: center;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #fbc350;">
                  🚀 Prochaines Étapes ?
                </h3>
                <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
                  Votre rapport détaillé inclut des recommandations personnalisées pour renforcer vos opérations commerciales et stimuler une croissance durable. Téléchargez votre rapport pour découvrir des insights actionnables adaptés à votre secteur et à la taille de votre entreprise.
                </p>
              </div>
              
              <!-- Boutons d'action -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://www.checkmyenterprise.com/results" 
                   style="background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(251, 195, 80, 0.3); margin: 0 10px 10px 0;">
                  📊 Voir le Rapport Complet
                </a>
                <a href="mailto:ambrose.nzeyi@gmail.com?subject=Demande%20de%20Consultation" 
                   style="background: transparent; color: #fbc350; padding: 16px 32px; text-decoration: none; border: 2px solid #fbc350; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; margin: 0 0 10px 10px;">
                  💬 Réserver une Consultation
                </a>
              </div>
              
              <!-- Note importante -->
              <div style="background: #fef5e7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  <strong>📋 Important :</strong> Ce rapport est basé sur vos réponses à l'auto-évaluation et fournit des conseils généraux. Pour une analyse détaillée et des recommandations personnalisées, envisagez de planifier une consultation avec nos experts en entreprise.
                </p>
              </div>
            </div>
            
            <!-- Footer professionnel -->
            <div style="background: #2d3748; padding: 30px; text-align: center; color: #a0aec0;">
              <div style="margin-bottom: 20px;">
                <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="UBB Logo" style="width: 50px; height: 50px; border-radius: 50%; object-fit: contain; margin: 0 auto 10px auto;" />
                <div style="color: #e2e8f0; font-weight: 600; font-size: 14px; margin-top: 5px;">
                  Enterprise Health Check
                </div>
              </div>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #e2e8f0;">
                Évaluation Professionnelle d'Entreprise & Conseil en Croissance
              </p>
              <div style="margin: 20px 0; padding: 20px 0; border-top: 1px solid #4a5568;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #a0aec0;">
                  📧 ambrose.nzeyi@gmail.com | 📞 +221 771970713 (SEN) / +44 7546756325 (GB)
                </p>
                <p style="margin: 0; font-size: 11px; color: #718096;">
                  Généré le ${new Date().toLocaleString('fr-FR')} | UBB Enterprise Health Check v1.0
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }
  }
};

module.exports = emailTemplates;
