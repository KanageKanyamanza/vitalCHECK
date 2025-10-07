#!/usr/bin/env node

/**
 * Script de test pour EmailJS
 * Usage: node scripts/test-emailjs.js
 */

require('dotenv').config();
const { sendEmailEmailJS } = require('../utils/emailServiceExternal');

async function testEmailJS() {
  console.log('🔍 [EMAILJS TEST] Test de configuration EmailJS...\n');

  const testEmail = process.env.EMAIL_USER;

  // Vérifier la configuration
  console.log('📋 [EMAILJS TEST] Vérification de la configuration:');
  console.log('   EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID ? '✅ Configuré' : '❌ Manquant');
  console.log('   EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID ? '✅ Configuré' : '❌ Manquant');
  console.log('   EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY ? '✅ Configuré' : '❌ Manquant');
  console.log('   EMAILJS_PRIVATE_KEY:', process.env.EMAILJS_PRIVATE_KEY ? '✅ Configuré' : '❌ Manquant');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configuré' : '❌ Manquant');
  console.log('');

  if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
    console.log('❌ [EMAILJS TEST] Configuration EmailJS incomplète');
    console.log('   Configurez EmailJS avec: npm run setup-emailjs');
    process.exit(1);
  }

  try {
    console.log('📧 [EMAILJS TEST] Test d\'envoi d\'email via EmailJS...');
    
    const emailData = {
      to: testEmail,
      subject: 'Test EmailJS - VitalCheck Enterprise Health Check',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Test EmailJS</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Test EmailJS réussi !</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Ceci est un test pour vérifier qu'EmailJS fonctionne correctement et utilise vos templates HTML existants.
            </p>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
              <h3 style="color: #155724; margin-top: 0;">✅ Configuration EmailJS validée</h3>
              <ul style="color: #155724; line-height: 1.6; margin: 0;">
                <li>Service: EmailJS API</li>
                <li>Expéditeur: ${process.env.EMAIL_USER}</li>
                <li>Date du test: ${new Date().toLocaleString('fr-FR')}</li>
                <li>Environnement: ${process.env.NODE_ENV || 'development'}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous recevez cet email, EmailJS fonctionne correctement et vos templates HTML existants sont utilisés.
            </p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-weight: 600;">
                🚀 Avantage: Utilise vos templates HTML existants
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              VitalCheck Enterprise Health Check - Test EmailJS automatique
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmailEmailJS(emailData);
    
    console.log('✅ [EMAILJS TEST] Email EmailJS envoyé avec succès !');
    console.log('📊 [EMAILJS TEST] Détails:', {
      messageId: result.messageId,
      response: result.response,
      to: testEmail
    });
    console.log('');
    console.log('🎉 [EMAILJS TEST] EmailJS configuré avec succès !');
    console.log('   Vérifiez votre boîte mail pour confirmer la réception.');
    console.log('   Vos templates HTML existants sont maintenant utilisés via EmailJS.');
    
  } catch (error) {
    console.error('❌ [EMAILJS TEST] Erreur EmailJS:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    console.log('');
    console.log('🔧 [EMAILJS TEST] Solutions possibles:');
    console.log('   1. Vérifiez que EMAILJS_SERVICE_ID est correct');
    console.log('   2. Vérifiez que EMAILJS_TEMPLATE_ID est correct');
    console.log('   3. Vérifiez que EMAILJS_PUBLIC_KEY est correct');
    console.log('   4. Vérifiez que le service email est configuré dans EmailJS');
    console.log('   5. Vérifiez que le template utilise les bonnes variables');
  }
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testEmailJS()
    .then(() => {
      console.log('\n🏁 [EMAILJS TEST] Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [EMAILJS TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testEmailJS };
