#!/usr/bin/env node

/**
 * Script pour configurer un service d'email externe
 * Usage: node scripts/setup-external-email.js
 * 
 * Ce script aide à configurer un service d'email externe quand SMTP est bloqué
 */

console.log('🔧 [EMAIL SETUP] Configuration d\'un service d\'email externe...\n');

console.log('📋 [EMAIL SETUP] Options disponibles:');
console.log('');
console.log('1. 📧 EmailJS (Recommandé)');
console.log('   - Gratuit: 200 emails/mois');
console.log('   - Facile à configurer');
console.log('   - Pas de blocage SMTP');
console.log('   - URL: https://www.emailjs.com/');
console.log('');
console.log('2. 📧 SendGrid');
console.log('   - Gratuit: 100 emails/jour');
console.log('   - API REST');
console.log('   - Très fiable');
console.log('   - URL: https://sendgrid.com/');
console.log('');
console.log('3. 📧 Mailgun');
console.log('   - Gratuit: 5000 emails/mois');
console.log('   - API REST');
console.log('   - Bon pour les développeurs');
console.log('   - URL: https://www.mailgun.com/');
console.log('');
console.log('4. 📧 Webhook personnalisé');
console.log('   - Zapier, Make.com, ou webhook custom');
console.log('   - Flexibilité maximale');
console.log('   - Coût variable');
console.log('');

console.log('🚀 [EMAIL SETUP] Configuration recommandée: EmailJS');
console.log('');
console.log('Étapes pour EmailJS:');
console.log('1. Créer un compte sur https://www.emailjs.com/');
console.log('2. Configurer un service email (Gmail)');
console.log('3. Créer un template d\'email');
console.log('4. Obtenir les clés API');
console.log('5. Ajouter les variables d\'environnement:');
console.log('   EMAILJS_SERVICE_ID=your_service_id');
console.log('   EMAILJS_TEMPLATE_ID=your_template_id');
console.log('   EMAILJS_PUBLIC_KEY=your_public_key');
console.log('   EMAILJS_PRIVATE_KEY=your_private_key');
console.log('');

console.log('🔧 [EMAIL SETUP] Pour implémenter EmailJS:');
console.log('1. Installer: npm install @emailjs/nodejs');
console.log('2. Créer un service emailServiceEmailJS.js');
console.log('3. Modifier emailServiceExternal.js pour utiliser EmailJS');
console.log('4. Tester avec: npm run test-emailjs');
console.log('');

console.log('📞 [EMAIL SETUP] Support:');
console.log('- Documentation EmailJS: https://www.emailjs.com/docs/');
console.log('- Exemples: https://github.com/emailjs/emailjs-nodejs');
console.log('- Support: support@emailjs.com');
console.log('');

console.log('✅ [EMAIL SETUP] Configuration terminée');
console.log('   Suivez les étapes ci-dessus pour configurer EmailJS');
console.log('   ou choisissez un autre service d\'email externe');
