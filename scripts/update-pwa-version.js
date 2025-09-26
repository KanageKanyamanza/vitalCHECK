#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour incrémenter la version
function incrementVersion(version) {
  const parts = version.split('.');
  const patch = parseInt(parts[2]) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}

// Fonction pour mettre à jour le Service Worker
function updateServiceWorker(newVersion) {
  const swPath = path.join(__dirname, '../client/public/sw-update.js');
  
  if (fs.existsSync(swPath)) {
    let content = fs.readFileSync(swPath, 'utf8');
    
    // Remplacer la version dans le cache name
    content = content.replace(
      /const CACHE_NAME = 'VitalCheck-health-check-v[\d.]+';/,
      `const CACHE_NAME = 'VitalCheck-health-check-v${newVersion}';`
    );
    
    fs.writeFileSync(swPath, content);
    console.log(`✅ Service Worker mis à jour avec la version ${newVersion}`);
  }
}

// Fonction pour mettre à jour le manifest
function updateManifest(newVersion) {
  const manifestPath = path.join(__dirname, '../client/public/manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.version = newVersion;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest mis à jour avec la version ${newVersion}`);
  }
}

// Fonction pour mettre à jour package.json
function updatePackageJson(newVersion) {
  const packagePath = path.join(__dirname, '../client/package.json');
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = newVersion;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Package.json mis à jour avec la version ${newVersion}`);
  }
}

// Fonction principale
function main() {
  const packagePath = path.join(__dirname, '../client/package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.error('❌ Package.json non trouvé');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const currentVersion = packageJson.version;
  const newVersion = incrementVersion(currentVersion);
  
  console.log(`🔄 Mise à jour de la version ${currentVersion} → ${newVersion}`);
  
  // Mettre à jour tous les fichiers
  updateServiceWorker(newVersion);
  updateManifest(newVersion);
  updatePackageJson(newVersion);
  
  console.log(`🎉 Version ${newVersion} prête pour le déploiement !`);
  console.log('\n📋 Prochaines étapes :');
  console.log('1. git add .');
  console.log('2. git commit -m "chore: Mise à jour PWA vers v' + newVersion + '"');
  console.log('3. git push');
  console.log('4. npm run build');
  console.log('5. Déployer les fichiers build/');
}

main();
