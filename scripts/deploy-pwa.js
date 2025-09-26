#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement PWA VitalCheck Enterprise Health Check');
console.log('==============================================\n');

// Fonction pour exécuter une commande
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} terminé\n`);
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    process.exit(1);
  }
}

// Fonction pour incrémenter la version
function incrementVersion(version) {
  const parts = version.split('.');
  const patch = parseInt(parts[2]) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}

// Fonction pour mettre à jour les versions
function updateVersions(newVersion) {
  console.log(`🔄 Mise à jour des versions vers ${newVersion}...`);
  
  // Mettre à jour package.json
  const packagePath = path.join(__dirname, '../client/package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  // Mettre à jour le Service Worker
  const swPath = path.join(__dirname, '../client/public/sw.js');
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(
    /const CACHE_NAME = 'VitalCheck-health-check-v[\d.]+';/,
    `const CACHE_NAME = 'VitalCheck-health-check-v${newVersion}';`
  );
  fs.writeFileSync(swPath, swContent);
  
  // Mettre à jour le manifest
  const manifestPath = path.join(__dirname, '../client/public/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = newVersion;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Versions mises à jour vers ${newVersion}\n`);
}

// Fonction principale
function main() {
  try {
    // 1. Vérifier le statut git
    console.log('📊 Vérification du statut Git...');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      console.log('⚠️  Des modifications non commitées détectées:');
      console.log(gitStatus);
      console.log('Veuillez commiter vos modifications avant de déployer.\n');
      process.exit(1);
    }
    console.log('✅ Aucune modification non commitée\n');
    
    // 2. Récupérer la version actuelle
    const packagePath = path.join(__dirname, '../client/package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const currentVersion = packageJson.version;
    const newVersion = incrementVersion(currentVersion);
    
    console.log(`📦 Version actuelle: ${currentVersion}`);
    console.log(`📦 Nouvelle version: ${newVersion}\n`);
    
    // 3. Mettre à jour les versions
    updateVersions(newVersion);
    
    // 4. Builder l'application
    runCommand('cd client && npm run build', 'Build de l\'application');
    
    // 5. Commiter les changements
    runCommand('git add .', 'Ajout des fichiers modifiés');
    runCommand(
      `git commit -m "chore: Mise à jour PWA vers v${newVersion}"`,
      'Commit des modifications'
    );
    
    // 6. Pousser vers le repository
    runCommand('git push', 'Push vers le repository');
    
    console.log('🎉 Déploiement PWA terminé avec succès !');
    console.log(`📱 Version ${newVersion} déployée`);
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Déployer les fichiers du dossier client/dist/ sur votre serveur');
    console.log('2. Vérifier que le Service Worker est bien chargé');
    console.log('3. Tester la mise à jour sur un appareil mobile');
    
  } catch (error) {
    console.error('❌ Erreur lors du déploiement:', error.message);
    process.exit(1);
  }
}

main();
