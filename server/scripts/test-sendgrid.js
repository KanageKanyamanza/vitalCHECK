#!/usr/bin/env node

/**
 * Script de test pour SendGrid
 * Usage: node scripts/test-sendgrid.js
 */

require('dotenv').config();
const { sendEmailSendGrid } = require('../utils/emailServiceExternal');

async function testSendGrid() {
  console.log('🔍 [SENDGRID TEST] Test de configuration SendGrid...\n');

  const testEmail = process.env.EMAIL_USER;

  // Vérifier la configuration
  console.log('📋 [SENDGRID TEST] Vérification de la configuration:');
  console.log('   SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Configuré' : '❌ Manquant');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configuré' : '❌ Manquant');
  console.log('');

  if (!process.env.SENDGRID_API_KEY) {
    console.log('❌ [SENDGRID TEST] SENDGRID_API_KEY manquant');
    console.log('   Configurez SendGrid avec: npm run setup-sendgrid');
    process.exit(1);
  }

  try {
    console.log('📧 [SENDGRID TEST] Test d\'envoi d\'email via SendGrid...');
    
    const emailData = {
      to: testEmail,
      subject: 'Test SendGrid - VitalCheck Enterprise Health Check',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Test SendGrid</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Test SendGrid réussi !</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Ceci est un test pour vérifier que SendGrid fonctionne correctement et contourne les blocages SMTP sur Render.
            </p>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
              <h3 style="color: #155724; margin-top: 0;">✅ Configuration SendGrid validée</h3>
              <ul style="color: #155724; line-height: 1.6; margin: 0;">
                <li>Service: SendGrid API</li>
                <li>Expéditeur: ${process.env.EMAIL_USER}</li>
                <li>Date du test: ${new Date().toLocaleString('fr-FR')}</li>
                <li>Environnement: ${process.env.NODE_ENV || 'development'}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous recevez cet email, SendGrid fonctionne correctement et les emails de relance fonctionneront même si SMTP est bloqué.
            </p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-weight: 600;">
                🚀 Avantage: Pas de timeout de connexion SMTP
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              VitalCheck Enterprise Health Check - Test SendGrid automatique
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmailSendGrid(emailData);
    
    console.log('✅ [SENDGRID TEST] Email SendGrid envoyé avec succès !');
    console.log('📊 [SENDGRID TEST] Détails:', {
      messageId: result.messageId,
      response: result.response,
      to: testEmail
    });
    console.log('');
    console.log('🎉 [SENDGRID TEST] SendGrid configuré avec succès !');
    console.log('   Vérifiez votre boîte mail pour confirmer la réception.');
    console.log('   Les emails de relance fonctionneront maintenant même si SMTP est bloqué.');
    
  } catch (error) {
    console.error('❌ [SENDGRID TEST] Erreur SendGrid:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
    console.log('');
    console.log('🔧 [SENDGRID TEST] Solutions possibles:');
    console.log('   1. Vérifiez que SENDGRID_API_KEY est correct');
    console.log('   2. Vérifiez que l\'API Key a les permissions "Mail Send"');
    console.log('   3. Vérifiez que l\'expéditeur (EMAIL_USER) est vérifié dans SendGrid');
    console.log('   4. Consultez les logs SendGrid pour plus de détails');
  }
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testSendGrid()
    .then(() => {
      console.log('\n🏁 [SENDGRID TEST] Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [SENDGRID TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testSendGrid };
