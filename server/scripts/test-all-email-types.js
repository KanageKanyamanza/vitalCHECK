#!/usr/bin/env node

/**
 * Script de test pour tous les types d'emails avec le système de fallback
 * Usage: node scripts/test-all-email-types.js
 */

require('dotenv').config();
const { sendEmail } = require('../utils/emailService');
const { sendEmailAlternative } = require('../utils/emailServiceAlternative');
const { sendEmailExternal } = require('../utils/emailServiceExternal');
const { sendContactConfirmation, sendContactNotification } = require('../utils/emailService');
const { generateReminderEmailHTML } = require('../utils/reminderEmailTemplate');

// Email de test
const testEmail = process.env.TEST_EMAIL || 'haurlyroll@gmail.com';

console.log('🧪 [TEST EMAILS] Début des tests pour tous les types d\'emails...\n');

// Test 1: Email de relance (comme dans admin.js)
async function testReminderEmail() {
  console.log('📧 [TEST 1] Test email de relance...');
  
  const emailData = {
    to: testEmail,
    subject: 'Test - Relance - Évaluation VitalCheck Enterprise Health Check',
    html: generateReminderEmailHTML(
      { companyName: 'Test Company', email: testEmail },
      'Ceci est un test du système de relance.',
      'Test de relance'
    )
  };

  let emailSent = false;
  let lastError = null;

  // Niveau 1: Configuration normale
  try {
    console.log('  🔄 Tentative avec configuration normale...');
    await sendEmail(emailData);
    emailSent = true;
    console.log('  ✅ Email de relance envoyé avec succès (configuration normale)');
  } catch (error) {
    console.log('  ❌ Erreur avec configuration normale:', error.message);
    lastError = error;
  }

  // Niveau 2: Configuration alternative
  if (!emailSent) {
    try {
      console.log('  🔄 Tentative avec configuration alternative...');
      await sendEmailAlternative(emailData);
      emailSent = true;
      console.log('  ✅ Email de relance envoyé avec succès (configuration alternative)');
    } catch (error) {
      console.log('  ❌ Erreur avec configuration alternative:', error.message);
      lastError = error;
    }
  }

  // Niveau 3: Service externe
  if (!emailSent) {
    try {
      console.log('  🔄 Tentative avec service externe...');
      await sendEmailExternal(emailData);
      emailSent = true;
      console.log('  ✅ Email de relance envoyé avec succès (service externe)');
    } catch (error) {
      console.log('  ❌ Erreur avec service externe:', error.message);
      lastError = error;
    }
  }

  if (!emailSent) {
    console.log('  ❌ ÉCHEC: Impossible d\'envoyer l\'email de relance');
    return false;
  }

  return true;
}

// Test 2: Email de confirmation de contact
async function testContactConfirmation() {
  console.log('\n📧 [TEST 2] Test email de confirmation de contact...');
  
  try {
    await sendContactConfirmation(testEmail, 'Test User', 'Test de confirmation');
    console.log('  ✅ Email de confirmation de contact envoyé avec succès');
    return true;
  } catch (error) {
    console.log('  ❌ Erreur email de confirmation de contact:', error.message);
    return false;
  }
}

// Test 3: Email de notification de contact
async function testContactNotification() {
  console.log('\n📧 [TEST 3] Test email de notification de contact...');
  
  const contactData = {
    name: 'Test User',
    email: testEmail,
    company: 'Test Company',
    phone: '+237 123 456 789',
    subject: 'Test de notification',
    message: 'Ceci est un test du système de notification de contact.',
    inquiryType: 'general'
  };

  try {
    await sendContactNotification(contactData);
    console.log('  ✅ Email de notification de contact envoyé avec succès');
    return true;
  } catch (error) {
    console.log('  ❌ Erreur email de notification de contact:', error.message);
    return false;
  }
}

// Test 4: Email de rapport PDF (simulation)
async function testReportEmail() {
  console.log('\n📧 [TEST 4] Test email de rapport PDF...');
  
  const emailData = {
    to: testEmail,
    subject: 'Test - Votre rapport VitalCheck Enterprise Health Check est prêt !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>Test - Rapport VitalCheck</h1>
        <p>Ceci est un test du système d'envoi de rapport PDF.</p>
        <p>En production, le PDF serait attaché à cet email.</p>
      </div>
    `,
    attachments: [{
      filename: 'test-report.pdf',
      content: Buffer.from('Test PDF content')
    }]
  };

  let emailSent = false;
  let lastError = null;

  // Niveau 1: Configuration normale
  try {
    console.log('  🔄 Tentative avec configuration normale...');
    await sendEmail(emailData);
    emailSent = true;
    console.log('  ✅ Email de rapport envoyé avec succès (configuration normale)');
  } catch (error) {
    console.log('  ❌ Erreur avec configuration normale:', error.message);
    lastError = error;
  }

  // Niveau 2: Configuration alternative
  if (!emailSent) {
    try {
      console.log('  🔄 Tentative avec configuration alternative...');
      await sendEmailAlternative(emailData);
      emailSent = true;
      console.log('  ✅ Email de rapport envoyé avec succès (configuration alternative)');
    } catch (error) {
      console.log('  ❌ Erreur avec configuration alternative:', error.message);
      lastError = error;
    }
  }

  // Niveau 3: Service externe
  if (!emailSent) {
    try {
      console.log('  🔄 Tentative avec service externe...');
      await sendEmailExternal(emailData);
      emailSent = true;
      console.log('  ✅ Email de rapport envoyé avec succès (service externe)');
    } catch (error) {
      console.log('  ❌ Erreur avec service externe:', error.message);
      lastError = error;
    }
  }

  if (!emailSent) {
    console.log('  ❌ ÉCHEC: Impossible d\'envoyer l\'email de rapport');
    return false;
  }

  return true;
}

// Fonction principale
async function runAllTests() {
  const results = {
    reminder: false,
    contactConfirmation: false,
    contactNotification: false,
    report: false
  };

  try {
    results.reminder = await testReminderEmail();
    results.contactConfirmation = await testContactConfirmation();
    results.contactNotification = await testContactNotification();
    results.report = await testReportEmail();

    // Résumé
    console.log('\n📊 [RÉSUMÉ] Résultats des tests:');
    console.log('================================');
    console.log(`📧 Email de relance: ${results.reminder ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    console.log(`📧 Email de confirmation de contact: ${results.contactConfirmation ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    console.log(`📧 Email de notification de contact: ${results.contactNotification ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    console.log(`📧 Email de rapport PDF: ${results.report ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;

    console.log(`\n🎯 Score: ${successCount}/${totalCount} tests réussis`);

    if (successCount === totalCount) {
      console.log('🎉 Tous les tests sont passés avec succès !');
      process.exit(0);
    } else {
      console.log('⚠️  Certains tests ont échoué. Vérifiez la configuration email.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

// Lancer les tests
runAllTests();
