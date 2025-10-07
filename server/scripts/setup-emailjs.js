#!/usr/bin/env node

/**
 * Script pour configurer EmailJS
 * Usage: node scripts/setup-emailjs.js
 */

console.log('🔧 [EMAILJS SETUP] Configuration d\'EmailJS pour contourner les blocages SMTP...\n');

console.log('📋 [EMAILJS SETUP] Étapes pour configurer EmailJS:');
console.log('');
console.log('1. 🌐 Accéder à votre compte EmailJS existant');
console.log('   - Aller sur https://www.emailjs.com/');
console.log('   - Se connecter avec votre compte existant');
console.log('');
console.log('2. 📧 Configurer un service email');
console.log('   - Aller dans Email Services');
console.log('   - Ajouter un service (Gmail, Outlook, etc.)');
console.log('   - Configurer avec votre email: ' + (process.env.EMAIL_USER || 'your-email@gmail.com'));
console.log('   - Copier le SERVICE_ID');
console.log('');
console.log('3. 📝 Créer un template simple');
console.log('   - Aller dans Email Templates');
console.log('   - Créer un nouveau template');
console.log('   - Utiliser ce template simple:');
console.log('');
console.log('   Subject: {{subject}}');
console.log('   Content:');
console.log('   {{html_content}}');
console.log('');
console.log('   - Copier le TEMPLATE_ID');
console.log('');
console.log('4. 🔑 Obtenir les clés API');
console.log('   - Aller dans Account > API Keys');
console.log('   - Copier la Public Key');
console.log('   - Copier la Private Key (si disponible)');
console.log('');
console.log('5. ⚙️  Configurer les variables d\'environnement');
console.log('   - Ajouter dans votre .env:');
console.log('   EMAILJS_SERVICE_ID=your-service-id');
console.log('   EMAILJS_TEMPLATE_ID=your-template-id');
console.log('   EMAILJS_PUBLIC_KEY=your-public-key');
console.log('   EMAILJS_PRIVATE_KEY=your-private-key');
console.log('');
console.log('6. 🧪 Tester la configuration');
console.log('   - Lancer: npm run test-emailjs');
console.log('   - Vérifier que l\'email est reçu');
console.log('');

console.log('✅ [EMAILJS SETUP] Avantages d\'EmailJS:');
console.log('   - ✅ Utilise vos templates HTML existants');
console.log('   - ✅ Pas de blocage SMTP sur Render');
console.log('   - ✅ Gratuit: 200 emails/mois');
console.log('   - ✅ Configuration rapide (vous avez déjà un compte)');
console.log('   - ✅ Garde vos templates personnalisés');
console.log('');

console.log('🔧 [EMAILJS SETUP] Configuration automatique:');
console.log('   - Le système essaie d\'abord nodemailer (Gmail SMTP)');
console.log('   - Si échec → Configuration alternative (port 465)');
console.log('   - Si échec → EmailJS (si configuré)');
console.log('   - Si échec → SendGrid (si configuré)');
console.log('   - Fallback transparent pour l\'utilisateur');
console.log('');

console.log('📞 [EMAILJS SETUP] Support:');
console.log('   - Documentation: https://www.emailjs.com/docs/');
console.log('   - Guide Node.js: https://www.emailjs.com/docs/nodejs/');
console.log('   - Support: support@emailjs.com');
console.log('');

console.log('🎯 [EMAILJS SETUP] Une fois configuré:');
console.log('   - Vos templates HTML existants seront utilisés');
console.log('   - Les emails fonctionneront même si SMTP est bloqué');
console.log('   - Configuration rapide avec votre compte existant');
console.log('   - Pas de timeout de connexion');
