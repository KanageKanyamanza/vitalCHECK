const { testEmailConfig, sendEmail } = require('./utils/emailService');
require('dotenv').config();

async function testEmail() {
  console.log('🧪 Test de la configuration email Gmail...\n');

  // Test 1: Vérifier la configuration
  console.log('1️⃣ Vérification de la configuration...');
  const configValid = await testEmailConfig();
  
  if (!configValid) {
    console.log('❌ Configuration email invalide');
    console.log('\n📋 Vérifiez :');
    console.log('- EMAIL_USER dans .env');
    console.log('- EMAIL_PASS (mot de passe d\'application Gmail)');
    console.log('- Authentification à 2 facteurs activée');
    console.log('- Mot de passe d\'application généré');
    return;
  }
  
  console.log('✅ Configuration email valide\n');

  // Test 2: Envoyer un email de test
  console.log('2️⃣ Envoi d\'un email de test...');
  
  const testEmailOptions = {
    to: process.env.EMAIL_USER, // Envoyer à soi-même
    subject: '🧪 Test UBB Health Check - Configuration Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">UBB Enterprise Health Check</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">✅ Configuration Email Réussie !</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Félicitations ! Votre configuration email Gmail fonctionne parfaitement.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">📧 Détails de la configuration :</h3>
            <ul style="color: #666;">
              <li><strong>Serveur SMTP :</strong> smtp.gmail.com:587</li>
              <li><strong>Authentification :</strong> Mot de passe d'application</li>
              <li><strong>Sécurité :</strong> TLS/SSL activé</li>
              <li><strong>Statut :</strong> ✅ Opérationnel</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Votre application UBB Health Check peut maintenant envoyer des rapports d'évaluation par email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🚀 Accéder à l'Application
            </a>
          </div>
        </div>
        
        <div style="background: #e9ecef; padding: 15px; text-align: center; color: #666; font-size: 12px;">
          <p style="margin: 0;">UBB Enterprise Health Check - Test de Configuration Email</p>
          <p style="margin: 5px 0 0 0;">Envoyé le ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>
    `
  };

  try {
    const result = await sendEmail(testEmailOptions);
    console.log('✅ Email de test envoyé avec succès !');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📬 Vérifiez votre boîte email : ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.log('❌ Erreur lors de l\'envoi de l\'email de test');
    console.error('Détails de l\'erreur:', error.message);
  }
}

// Exécuter le test
testEmail().then(() => {
  console.log('\n🎉 Test terminé !');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erreur lors du test:', error);
  process.exit(1);
});
