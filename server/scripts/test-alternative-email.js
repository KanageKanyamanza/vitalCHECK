#!/usr/bin/env node

/**
 * Script de test de la configuration email alternative pour Render
 * Usage: node scripts/test-alternative-email.js
 */

require('dotenv').config();
const { sendEmailAlternative, testAlternativeConnection } = require('../utils/emailServiceAlternative');

async function testAlternativeEmail() {
  console.log('🔍 [ALT EMAIL TEST] Test de la configuration email alternative...\n');

  // Forcer l'environnement de production
  process.env.NODE_ENV = 'production';
  process.env.RENDER = 'true';

  const testEmail = process.env.EMAIL_USER;

  try {
    // 1. Test de connexion
    console.log('🔧 [ALT EMAIL TEST] Test de connexion alternative...');
    const connectionOk = await testAlternativeConnection();
    
    if (!connectionOk) {
      console.log('❌ [ALT EMAIL TEST] Connexion alternative échouée');
      return;
    }

    // 2. Test d'envoi
    console.log('\n📧 [ALT EMAIL TEST] Test d\'envoi d\'email alternatif...');
    
    const emailData = {
      to: testEmail,
      subject: 'Test Configuration Alternative - VitalCheck',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Test Configuration Alternative</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Test de configuration alternative</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Ceci est un test de la configuration email alternative pour résoudre les problèmes de connexion sur Render.
            </p>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
              <h3 style="color: #155724; margin-top: 0;">✅ Configuration alternative</h3>
              <ul style="color: #155724; line-height: 1.6; margin: 0;">
                <li>Port: 465 (SSL)</li>
                <li>Secure: true</li>
                <li>Pool: false</li>
                <li>Timeout: 10 secondes</li>
                <li>Date: ${new Date().toLocaleString('fr-FR')}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous recevez cet email, la configuration alternative fonctionne correctement.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              VitalCheck Enterprise Health Check - Test configuration alternative
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmailAlternative(emailData);
    
    console.log('✅ [ALT EMAIL TEST] Email alternatif envoyé avec succès !');
    console.log('📊 [ALT EMAIL TEST] Détails:', {
      messageId: result.messageId,
      response: result.response,
      to: testEmail
    });
    console.log('');
    console.log('🎉 [ALT EMAIL TEST] Configuration alternative validée !');
    console.log('   Vérifiez votre boîte mail pour confirmer la réception.');
    
  } catch (error) {
    console.error('❌ [ALT EMAIL TEST] Erreur lors du test alternatif:', {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode
    });
    console.log('');
    console.log('🔧 [ALT EMAIL TEST] Solutions possibles:');
    console.log('   1. Vérifiez les identifiants Gmail');
    console.log('   2. Essayez un autre port (587 au lieu de 465)');
    console.log('   3. Vérifiez les paramètres de sécurité Gmail');
    console.log('   4. Considérez l\'utilisation d\'un service d\'email externe');
  }
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testAlternativeEmail()
    .then(() => {
      console.log('\n🏁 [ALT EMAIL TEST] Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [ALT EMAIL TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testAlternativeEmail };
