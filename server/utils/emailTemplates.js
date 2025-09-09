const emailTemplates = {
  en: {
    reportReady: {
      subject: 'Your UBB Enterprise Health Check Report is Ready!',
      html: (user, assessment) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">UBB Enterprise Health Check</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Your Enterprise Health Check Report is Ready!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${user.companyName},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for completing the UBB Enterprise Health Check. Your personalized report is now ready and attached to this email.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">📊 Your Results Summary:</h3>
              <ul style="color: #666;">
                <li><strong>Overall Health Score:</strong> ${assessment.overallScore}/100</li>
                <li><strong>Status:</strong> ${assessment.overallStatus.charAt(0).toUpperCase() + assessment.overallStatus.slice(1)}</li>
                <li><strong>Assessment Date:</strong> ${new Date(assessment.completedAt).toLocaleDateString('en-US')}</li>
                <li><strong>Company:</strong> ${user.companyName}</li>
                <li><strong>Sector:</strong> ${user.sector}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Your detailed report includes personalized recommendations to help strengthen your business operations and drive growth.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                🚀 Access Your Dashboard
              </a>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">UBB Enterprise Health Check - Personalized Business Assessment</p>
            <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleString('en-US')}</p>
          </div>
        </div>
      `
    }
  },
  fr: {
    reportReady: {
      subject: 'Votre rapport UBB Enterprise Health Check est prêt !',
      html: (user, assessment) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">UBB Enterprise Health Check</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Votre rapport UBB Enterprise Health Check est prêt !</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Cher(e) ${user.companyName},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Merci d'avoir complété l'évaluation UBB Enterprise Health Check. Votre rapport personnalisé est maintenant prêt et joint à cet email.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">📊 Résumé de vos résultats :</h3>
              <ul style="color: #666;">
                <li><strong>Score de santé global :</strong> ${assessment.overallScore}/100</li>
                <li><strong>Statut :</strong> ${assessment.overallStatus === 'red' ? 'Critique' : assessment.overallStatus === 'amber' ? 'À améliorer' : 'En bonne santé'}</li>
                <li><strong>Date d'évaluation :</strong> ${new Date(assessment.completedAt).toLocaleDateString('fr-FR')}</li>
                <li><strong>Entreprise :</strong> ${user.companyName}</li>
                <li><strong>Secteur :</strong> ${user.sector}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Votre rapport détaillé inclut des recommandations personnalisées pour vous aider à renforcer vos opérations commerciales et stimuler la croissance.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                🚀 Accéder à votre tableau de bord
              </a>
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 0;">UBB Enterprise Health Check - Évaluation personnalisée d'entreprise</p>
            <p style="margin: 5px 0 0 0;">Généré le ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      `
    }
  }
};

module.exports = emailTemplates;
