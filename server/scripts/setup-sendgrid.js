#!/usr/bin/env node

/**
 * Script pour configurer SendGrid
 * Usage: node scripts/setup-sendgrid.js
 */

console.log('🔧 [SENDGRID SETUP] Configuration de SendGrid pour contourner les blocages SMTP...\n');

console.log('📋 [SENDGRID SETUP] Étapes pour configurer SendGrid:');
console.log('');
console.log('1. 🌐 Créer un compte SendGrid');
console.log('   - Aller sur https://sendgrid.com/');
console.log('   - Créer un compte gratuit (100 emails/jour)');
console.log('   - Vérifier votre email');
console.log('');
console.log('2. 🔑 Créer une API Key');
console.log('   - Aller dans Settings > API Keys');
console.log('   - Cliquer sur "Create API Key"');
console.log('   - Choisir "Restricted Access"');
console.log('   - Donner les permissions "Mail Send"');
console.log('   - Copier la clé API générée');
console.log('');
console.log('3. ⚙️  Configurer les variables d\'environnement');
console.log('   - Ajouter dans votre .env:');
console.log('   SENDGRID_API_KEY=your-sendgrid-api-key');
console.log('   - Garder EMAIL_USER et EMAIL_PASS pour l\'expéditeur');
console.log('');
console.log('4. 🧪 Tester la configuration');
console.log('   - Lancer: npm run test-sendgrid');
console.log('   - Vérifier que l\'email est reçu');
console.log('');
console.log('5. 🚀 Déployer');
console.log('   - Ajouter SENDGRID_API_KEY dans les variables d\'environnement Render');
console.log('   - Redéployer l\'application');
console.log('');

console.log('✅ [SENDGRID SETUP] Avantages de SendGrid:');
console.log('   - ✅ Pas de blocage SMTP sur Render');
console.log('   - ✅ Gratuit: 100 emails/jour');
console.log('   - ✅ Très fiable et rapide');
console.log('   - ✅ API REST moderne');
console.log('   - ✅ Support des pièces jointes');
console.log('   - ✅ Analytics et tracking');
console.log('');

console.log('🔧 [SENDGRID SETUP] Configuration automatique:');
console.log('   - Le système essaie d\'abord nodemailer (Gmail SMTP)');
console.log('   - Si échec → Configuration alternative (port 465)');
console.log('   - Si échec → SendGrid (si configuré)');
console.log('   - Fallback transparent pour l\'utilisateur');
console.log('');

console.log('📞 [SENDGRID SETUP] Support:');
console.log('   - Documentation: https://docs.sendgrid.com/');
console.log('   - Guide API: https://docs.sendgrid.com/api-reference/mail-send/mail-send');
console.log('   - Support: https://support.sendgrid.com/');
console.log('');

console.log('🎯 [SENDGRID SETUP] Une fois configuré:');
console.log('   - Les emails fonctionneront même si SMTP est bloqué');
console.log('   - Performance améliorée (API REST vs SMTP)');
console.log('   - Logs détaillés pour le suivi');
console.log('   - Pas de timeout de connexion');
