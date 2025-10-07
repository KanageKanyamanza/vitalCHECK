#!/usr/bin/env node

/**
 * Script de test complet pour tous les types d'emails
 * Usage: node scripts/test-all-emails.js
 */

require('dotenv').config();
const { sendEmail, sendContactConfirmation, sendContactNotification } = require('../utils/emailService');
const { generateReminderEmailHTML } = require('../utils/reminderEmailTemplate');

async function testAllEmailTypes() {
  console.log('🔍 [EMAIL TEST] Début du test complet de tous les types d\'emails...\n');

  const testEmail = process.env.EMAIL_USER;
  const testResults = [];

  // 1. Test Email de relance (Reminder Email)
  console.log('📧 [EMAIL TEST] Test 1/4: Email de relance...');
  try {
    const reminderEmailData = {
      to: testEmail,
      subject: 'Test - Email de relance VitalCheck',
      html: generateReminderEmailHTML(
        { 
          companyName: 'Entreprise Test',
          email: testEmail 
        },
        'Ceci est un message de test pour vérifier que les emails de relance fonctionnent correctement.',
        'Test - Email de relance VitalCheck'
      )
    };

    const result1 = await sendEmail(reminderEmailData);
    testResults.push({ type: 'Email de relance', status: '✅ Succès', messageId: result1.messageId });
    console.log('✅ [EMAIL TEST] Email de relance envoyé avec succès');
  } catch (error) {
    testResults.push({ type: 'Email de relance', status: '❌ Échec', error: error.message });
    console.log('❌ [EMAIL TEST] Erreur email de relance:', error.message);
  }

  // 2. Test Email de confirmation de contact
  console.log('\n📧 [EMAIL TEST] Test 2/4: Email de confirmation de contact...');
  try {
    const result2 = await sendContactConfirmation(
      testEmail,
      'Client Test',
      'Test de configuration email'
    );
    testResults.push({ type: 'Confirmation de contact', status: '✅ Succès', messageId: result2.messageId });
    console.log('✅ [EMAIL TEST] Email de confirmation de contact envoyé avec succès');
  } catch (error) {
    testResults.push({ type: 'Confirmation de contact', status: '❌ Échec', error: error.message });
    console.log('❌ [EMAIL TEST] Erreur confirmation de contact:', error.message);
  }

  // 3. Test Email de notification de contact (pour l'équipe)
  console.log('\n📧 [EMAIL TEST] Test 3/4: Email de notification de contact...');
  try {
    const contactData = {
      name: 'Client Test',
      email: testEmail,
      company: 'Entreprise Test',
      phone: '+237 123 456 789',
      subject: 'Test de configuration email',
      message: 'Ceci est un message de test pour vérifier que les notifications de contact fonctionnent correctement.',
      inquiryType: 'technical'
    };

    const result3 = await sendContactNotification(contactData);
    testResults.push({ type: 'Notification de contact', status: '✅ Succès', messageId: result3.messageId });
    console.log('✅ [EMAIL TEST] Email de notification de contact envoyé avec succès');
  } catch (error) {
    testResults.push({ type: 'Notification de contact', status: '❌ Échec', error: error.message });
    console.log('❌ [EMAIL TEST] Erreur notification de contact:', error.message);
  }

  // 4. Test Email de rapport PDF (simulation)
  console.log('\n📧 [EMAIL TEST] Test 4/4: Email de rapport PDF...');
  try {
    const reportEmailData = {
      to: testEmail,
      subject: 'Test - Rapport VitalCheck Enterprise Health Check',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">VitalCheck Enterprise Health Check</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Rapport d'évaluation</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Bonjour Client Test,</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Votre rapport d'évaluation VitalCheck Enterprise Health Check est prêt !
            </p>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">Résumé de votre évaluation :</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li><strong>Score global :</strong> 75/100</li>
                <li><strong>Statut :</strong> En bonne santé</li>
                <li><strong>Date d'évaluation :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
                <li><strong>Entreprise :</strong> Entreprise Test</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="color: #856404; margin: 0; font-weight: 600;">
                📎 Votre rapport PDF détaillé est en pièce jointe
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Ce rapport contient une analyse détaillée de votre entreprise et des recommandations personnalisées pour améliorer votre performance.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Cordialement,<br>
              <strong>L'équipe VitalCheck</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              VitalCheck Enterprise Health Check - Test de configuration automatique<br>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'test-rapport-vitalcheck.txt',
          content: 'Ceci est un fichier de test pour simuler un rapport PDF.\n\nContenu du rapport:\n- Score global: 75/100\n- Statut: En bonne santé\n- Recommandations: Continuer les bonnes pratiques\n\nDate: ' + new Date().toISOString()
        }
      ]
    };

    const result4 = await sendEmail(reportEmailData);
    testResults.push({ type: 'Rapport PDF', status: '✅ Succès', messageId: result4.messageId });
    console.log('✅ [EMAIL TEST] Email de rapport PDF envoyé avec succès');
  } catch (error) {
    testResults.push({ type: 'Rapport PDF', status: '❌ Échec', error: error.message });
    console.log('❌ [EMAIL TEST] Erreur rapport PDF:', error.message);
  }

  // Résumé des résultats
  console.log('\n' + '='.repeat(60));
  console.log('📊 [EMAIL TEST] RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let failureCount = 0;

  testResults.forEach((result, index) => {
    const status = result.status === '✅ Succès' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.type}`);
    
    if (result.status === '✅ Succès') {
      console.log(`   Message ID: ${result.messageId}`);
      successCount++;
    } else {
      console.log(`   Erreur: ${result.error}`);
      failureCount++;
    }
    console.log('');
  });

  console.log('📈 [EMAIL TEST] STATISTIQUES:');
  console.log(`   ✅ Succès: ${successCount}/${testResults.length}`);
  console.log(`   ❌ Échecs: ${failureCount}/${testResults.length}`);
  console.log(`   📊 Taux de réussite: ${Math.round((successCount / testResults.length) * 100)}%`);

  if (successCount === testResults.length) {
    console.log('\n🎉 [EMAIL TEST] Tous les tests sont passés avec succès !');
    console.log('   Vérifiez votre boîte mail pour confirmer la réception de tous les emails.');
  } else {
    console.log('\n⚠️  [EMAIL TEST] Certains tests ont échoué.');
    console.log('   Vérifiez la configuration email et les logs ci-dessus.');
  }

  return { successCount, failureCount, total: testResults.length };
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testAllEmailTypes()
    .then((results) => {
      console.log('\n🏁 [EMAIL TEST] Test complet terminé');
      process.exit(results.failureCount > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('\n💥 [EMAIL TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testAllEmailTypes };
