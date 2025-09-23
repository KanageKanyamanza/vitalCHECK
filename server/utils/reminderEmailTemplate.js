const generateReminderEmailHTML = (user, message, subject) => {
  // Extraire le lien du message s'il y en a un
  const linkMatch = message.match(/https?:\/\/[^\s]+/);
  const link = linkMatch ? linkMatch[0] : '#';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>UBB Enterprise Health Check</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header avec logo UBB -->
        <div style="background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==') repeat; opacity: 0.3;"></div>
          
          <!-- Logo UBB -->
          <div style="position: relative; z-index: 2;">
            <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 50%; margin-bottom: 20px; backdrop-filter: blur(10px);">
              <img src="https://www.checkmyenterprise.com/icons/ms-icon-310x310.png" alt="UBB Logo" style="width: 80px; height: 80px; border-radius: 50%; object-fit: contain;" />
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              Enterprise Health Check
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
              Évaluation Professionnelle d'Entreprise
            </p>
          </div>
        </div>
        
        <!-- Contenu principal -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1a202c; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
              Bonjour ${user.companyName},
            </h2>
            <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.5;">
              Nous vous contactons concernant votre évaluation d'entreprise.
            </p>
          </div>

          <!-- Message principal -->
          <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border: 1px solid #e2e8f0;">
            <div style="color: #2d3748; font-size: 16px; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <!-- Call to action -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
               style="display: inline-block; background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(251, 195, 80, 0.3);">
              Accéder à l'évaluation
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 40px; text-align: center;">
            <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">
              Cordialement,<br>
              <strong style="color: #fbc350;">L'équipe UBB</strong>
            </p>
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
              UBB Enterprise Health Check - Évaluation professionnelle d'entreprise
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateReminderEmailHTML
};
