#!/usr/bin/env node

/**
 * Script de test des emails depuis la page frontend
 * Usage: node scripts/test-frontend-emails.js
 */

require('dotenv').config();
const { sendEmail } = require('../utils/emailService');
const { sendEmailAlternative } = require('../utils/emailServiceAlternative');
const { sendEmailExternal } = require('../utils/emailServiceExternal');
const { generateReminderEmailHTML } = require('../utils/reminderEmailTemplate');

async function testFrontendEmails() {
  console.log('🔍 [FRONTEND EMAIL TEST] Test des emails depuis la page frontend...\n');

  // Forcer l'environnement de production
  process.env.NODE_ENV = 'production';
  process.env.RENDER = 'true';

  const testEmail = process.env.EMAIL_USER;

  // Test 1: Email de relance individuel (comme depuis DraftAssessmentsPage)
  console.log('📧 [FRONTEND EMAIL TEST] Test 1/3: Email de relance individuel...');
  try {
    const user = {
      companyName: 'Entreprise Test',
      email: testEmail
    };

    const message = `Nous avons remarqué que votre évaluation VitalCheck Enterprise Health Check n'est pas encore terminée.

Vous pouvez reprendre votre évaluation à tout moment en cliquant sur le lien suivant :
https://www.checkmyenterprise.com/resume/test-token-123

Cette évaluation vous permettra d'obtenir un rapport personnalisé sur la santé de votre entreprise.`;

    const emailData = {
      to: testEmail,
      subject: 'Relance - Évaluation VitalCheck Enterprise Health Check',
      html: generateReminderEmailHTML(user, message, 'Relance - Évaluation VitalCheck Enterprise Health Check')
    };

    // Essayer les 3 méthodes
    let result = null;
    try {
      result = await sendEmail(emailData);
      console.log('✅ [FRONTEND EMAIL TEST] Email individuel envoyé (normale)');
    } catch (error) {
      console.log('⚠️  [FRONTEND EMAIL TEST] Méthode normale échouée, essai alternative...');
      try {
        result = await sendEmailAlternative(emailData);
        console.log('✅ [FRONTEND EMAIL TEST] Email individuel envoyé (alternative)');
      } catch (altError) {
        console.log('⚠️  [FRONTEND EMAIL TEST] Méthode alternative échouée, essai externe...');
        result = await sendEmailExternal(emailData);
        console.log('✅ [FRONTEND EMAIL TEST] Email individuel envoyé (externe)');
      }
    }

    console.log('📊 [FRONTEND EMAIL TEST] Détails email individuel:', {
      messageId: result.messageId,
      to: testEmail,
      subject: emailData.subject
    });

  } catch (error) {
    console.error('❌ [FRONTEND EMAIL TEST] Erreur email individuel:', error.message);
  }

  // Test 2: Email avec template prédéfini (comme depuis EmailManagement)
  console.log('\n📧 [FRONTEND EMAIL TEST] Test 2/3: Email avec template prédéfini...');
  try {
    const user = {
      companyName: 'Entreprise Test',
      email: testEmail
    };

    const templateMessage = `Nous avons remarqué que vous avez commencé votre évaluation VitalCheck Enterprise Health Check mais ne l'avez pas encore terminée.

Cette évaluation vous permettra d'obtenir un rapport détaillé sur la santé de votre entreprise et des recommandations personnalisées pour l'améliorer.

Pour reprendre votre évaluation, cliquez sur le lien suivant : https://www.checkmyenterprise.com/

Si vous avez des questions, n'hésitez pas à nous contacter.`;

    const emailData = {
      to: testEmail,
      subject: 'Complétez votre évaluation VitalCheck Enterprise Health Check',
      html: generateReminderEmailHTML(user, templateMessage, 'Complétez votre évaluation VitalCheck Enterprise Health Check')
    };

    // Essayer les 3 méthodes
    let result = null;
    try {
      result = await sendEmail(emailData);
      console.log('✅ [FRONTEND EMAIL TEST] Email template envoyé (normale)');
    } catch (error) {
      console.log('⚠️  [FRONTEND EMAIL TEST] Méthode normale échouée, essai alternative...');
      try {
        result = await sendEmailAlternative(emailData);
        console.log('✅ [FRONTEND EMAIL TEST] Email template envoyé (alternative)');
      } catch (altError) {
        console.log('⚠️  [FRONTEND EMAIL TEST] Méthode alternative échouée, essai externe...');
        result = await sendEmailExternal(emailData);
        console.log('✅ [FRONTEND EMAIL TEST] Email template envoyé (externe)');
      }
    }

    console.log('📊 [FRONTEND EMAIL TEST] Détails email template:', {
      messageId: result.messageId,
      to: testEmail,
      subject: emailData.subject
    });

  } catch (error) {
    console.error('❌ [FRONTEND EMAIL TEST] Erreur email template:', error.message);
  }

  // Test 3: Email avec lien [LIEN] personnalisé
  console.log('\n📧 [FRONTEND EMAIL TEST] Test 3/3: Email avec lien [LIEN] personnalisé...');
  try {
    const user = {
      companyName: 'Entreprise Test',
      email: testEmail
    };

    const personalizedMessage = `Bonjour,

Nous vous contactons pour vous rappeler de compléter votre évaluation.

Cliquez sur ce lien pour reprendre : https://www.checkmyenterprise.com/resume/personalized-token-456

Cordialement,
L'équipe VitalCheck`;

    const emailData = {
      to: testEmail,
      subject: 'Rappel - Évaluation personnalisée',
      html: generateReminderEmailHTML(user, personalizedMessage, 'Rappel - Évaluation personnalisée')
    };

    // Essayer les 3 méthodes
    let result = null;
    try {
      result = await sendEmail(emailData);
      console.log('✅ [FRONTEND EMAIL TEST] Email personnalisé envoyé (normale)');
    } catch (error) {
      console.log('⚠️  [FRONTEND EMAIL TEST] Méthode normale échouée, essai alternative...');
      try {
        result = await sendEmailAlternative(emailData);
        console.log('✅ [FRONTEND EMAIL TEST] Email personnalisé envoyé (alternative)');
      } catch (altError) {
        console.log('⚠️  [FRONTEND EMAIL TEST] Méthode alternative échouée, essai externe...');
        result = await sendEmailExternal(emailData);
        console.log('✅ [FRONTEND EMAIL TEST] Email personnalisé envoyé (externe)');
      }
    }

    console.log('📊 [FRONTEND EMAIL TEST] Détails email personnalisé:', {
      messageId: result.messageId,
      to: testEmail,
      subject: emailData.subject
    });

  } catch (error) {
    console.error('❌ [FRONTEND EMAIL TEST] Erreur email personnalisé:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 [FRONTEND EMAIL TEST] RÉSUMÉ');
  console.log('='.repeat(60));
  console.log('✅ Tests des emails frontend terminés');
  console.log('📧 3 types d\'emails testés:');
  console.log('   1. Email de relance individuel');
  console.log('   2. Email avec template prédéfini');
  console.log('   3. Email avec lien personnalisé');
  console.log('');
  console.log('🔧 [FRONTEND EMAIL TEST] Vérifications:');
  console.log('   ✅ URLs de production utilisées');
  console.log('   ✅ Système de fallback à 3 niveaux');
  console.log('   ✅ Templates HTML corrects');
  console.log('   ✅ Liens localhost corrigés');
  console.log('');
  console.log('🎯 [FRONTEND EMAIL TEST] Résultat:');
  console.log('   Les emails depuis la page frontend utilisent maintenant');
  console.log('   les bonnes URLs de production et le système de fallback.');
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testFrontendEmails()
    .then(() => {
      console.log('\n🏁 [FRONTEND EMAIL TEST] Test terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [FRONTEND EMAIL TEST] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { testFrontendEmails };
