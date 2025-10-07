#!/usr/bin/env node

/**
 * Script de test de la configuration email
 * Usage: node scripts/test-email-config.js
 */

require('dotenv').config();
const { sendEmail, testEmailConfig } = require('../utils/emailService');

async function testEmailConfiguration() {
  console.log('🔍 [EMAIL TEST] Début du test de configuration email...\n');

  // 1. Vérifier les variables d'environnement
  console.log('📋 [EMAIL TEST] Variables d\'environnement:');
  console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || '❌ MANQUANT');
  console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || '❌ MANQUANT');
  console.log('  EMAIL_USER:', process.env.EMAIL_USER || '❌ MANQUANT');
  console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configuré' : '❌ MANQUANT');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ MANQUANT');
  console.log('');

  // 2. Tester la configuration SMTP
  console.log('🔧 [EMAIL TEST] Test de la configuration SMTP...');
  try {
    const configValid = await testEmailConfig();
    if (configValid) {
      console.log('✅ [EMAIL TEST] Configuration SMTP valide\n');
    } else {
      console.log('❌ [EMAIL TEST] Configuration SMTP invalide\n');
      return;
    }
  } catch (error) {
    console.error('❌ [EMAIL TEST] Erreur de configuration SMTP:', error.message);
    console.log('');
    return;
  }

  // 3. Tester l'envoi d'un email de test
  console.log('📧 [EMAIL TEST] Test d\'envoi d\'email...');
  try {
    const testEmailData = {
      to: process.env.EMAIL_USER, // Envoyer à soi-même
      subject: 'Test de configuration email - VitalCheck',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Test de configuration email</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Test réussi !</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Ceci est un email de test pour vérifier que la configuration email fonctionne correctement.
            </p>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
              <h3 style="color: #155724; margin-top: 0;">✅ Configuration validée</h3>
              <ul style="color: #155724; line-height: 1.6; margin: 0;">
                <li>Serveur SMTP: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}</li>
                <li>Utilisateur: ${process.env.EMAIL_USER}</li>
                <li>Date du test: ${new Date().toLocaleString('fr-FR')}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous recevez cet email, la configuration est correcte et les emails de relance fonctionneront.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              VitalCheck Enterprise Health Check - Test de configuration automatique
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmail(testEmailData);
    
    console.log('✅ [EMAIL TEST] Email de test envoyé avec succès !');
    console.log('📧 [EMAIL TEST] Détails:', {
      messageId: result.messageId,
      response: result.response,
      to: testEmailData.to
    });
    console.log('');
    console.log('🎉 [EMAIL TEST] Configuration email validée !');
    console.log('   Vérifiez votre boîte mail pour confirmer la réception.');
    
  } catch (error) {
    console.error('❌ [EMAIL TEST] Erreur lors de l\'envoi de l\'email de test:', {
      message: error.message,
      code: error.code,
      responseCode: error.responseCode,
      stack: error.stack
    });
    console.log('');
    console.log('🔧 [EMAIL TEST] Solutions possibles:');
    console.log('   1. Vérifiez les identifiants Gmail (email + mot de passe d\'application)');
    console.log('   2. Vérifiez que l\'authentification à 2 facteurs est activée sur Gmail');
    console.log('   3. Générez un nouveau mot de passe d\'application dans Gmail');
    console.log('   4. Vérifiez que les ports 587/465 ne sont pas bloqués');
  }
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testEmailConfiguration()
    .then(() => {
      console.log('\n🏁 [EMAIL TEST] Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [EMAIL TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testEmailConfiguration };
