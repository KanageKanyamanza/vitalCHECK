#!/usr/bin/env node

/**
 * Script pour mettre à jour le sitemap en production
 * Ce script génère un sitemap avec l'URL de production correcte
 */

const { generateSitemap } = require('./generate-sitemap');

// Forcer l'environnement de production
process.env.NODE_ENV = 'production';

async function updateProductionSitemap() {
  try {
    console.log('🚀 [SITEMAP PROD] Génération du sitemap pour la production...');
    
    // Générer le sitemap avec l'URL de production
    await generateSitemap();
    
    console.log('✅ [SITEMAP PROD] Sitemap de production généré avec succès !');
    console.log('🌐 [SITEMAP PROD] URL de base: https://www.checkmyenterprise.com');
    
  } catch (error) {
    console.error('❌ [SITEMAP PROD] Erreur lors de la génération:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  updateProductionSitemap();
}

module.exports = { updateProductionSitemap };
