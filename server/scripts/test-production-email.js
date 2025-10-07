#!/usr/bin/env node

/**
 * Script de test d'envoi d'email en production
 * Usage: node scripts/test-production-email.js
 */

require('dotenv').config();
const { sendEmail } = require('../utils/emailService');

async function testProductionEmail() {
  console.log('🔍 [PROD EMAIL TEST] Test d\'envoi d\'email en production...\n');

  // Forcer l'environnement de production
  process.env.NODE_ENV = 'production';

  const testEmail = process.env.EMAIL_USER;
  const startTime = Date.now();

  try {
    console.log('📧 [PROD EMAIL TEST] Envoi d\'un email de test...');
    console.log('⏱️  [PROD EMAIL TEST] Timeout configuré: 90 secondes');
    console.log('🌐 [PROD EMAIL TEST] Environnement: Production');
    console.log('📬 [PROD EMAIL TEST] Destinataire:', testEmail);
    console.log('');

    const emailData = {
      to: testEmail,
      subject: 'Test Production - VitalCheck Email System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Test de production</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Test d'envoi en production</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Ceci est un test pour vérifier que le système d'email fonctionne correctement en production.
            </p>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
              <h3 style="color: #155724; margin-top: 0;">✅ Configuration de production</h3>
              <ul style="color: #155724; line-height: 1.6; margin: 0;">
                <li>Environnement: Production</li>
                <li>Timeout: 90 secondes</li>
                <li>Serveur SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}</li>
                <li>Date du test: ${new Date().toLocaleString('fr-FR')}</li>
                <li>Temps d'envoi: ${Math.round((Date.now() - startTime) / 1000)}s</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous recevez cet email, le système d'email fonctionne correctement en production.
            </p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-weight: 600;">
                ⚡ Performance: Email envoyé en ${Math.round((Date.now() - startTime) / 1000)} secondes
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              VitalCheck Enterprise Health Check - Test de production automatique
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmail(emailData);
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('✅ [PROD EMAIL TEST] Email envoyé avec succès !');
    console.log('📊 [PROD EMAIL TEST] Détails:', {
      messageId: result.messageId,
      response: result.response,
      to: testEmail,
      duration: `${duration} secondes`,
      timeout: '90 secondes'
    });
    console.log('');
    console.log('🎉 [PROD EMAIL TEST] Test de production réussi !');
    console.log(`⏱️  [PROD EMAIL TEST] Temps d'envoi: ${duration} secondes`);
    console.log('   Vérifiez votre boîte mail pour confirmer la réception.');
    
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.error('❌ [PROD EMAIL TEST] Erreur lors de l\'envoi:', {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      duration: `${duration} secondes`,
      timeout: '90 secondes'
    });
    console.log('');
    console.log('🔧 [PROD EMAIL TEST] Solutions possibles:');
    console.log('   1. Vérifiez la connexion réseau du serveur Render');
    console.log('   2. Vérifiez les identifiants Gmail');
    console.log('   3. Augmentez encore le timeout si nécessaire');
    console.log('   4. Vérifiez les logs du serveur Render');
  }
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testProductionEmail()
    .then(() => {
      console.log('\n🏁 [PROD EMAIL TEST] Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [PROD EMAIL TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testProductionEmail };
