#!/usr/bin/env node

/**
 * Script de génération automatique du sitemap
 * À exécuter via un cron job pour maintenir le sitemap à jour
 * 
 * Usage:
 * - Manuel: node scripts/sitemap-cron.js
 * - Cron: 0 */6 * * * cd /path/to/project/server && node scripts/sitemap-cron.js
 */

const { generateSitemap } = require('./generate-sitemap');
const fs = require('fs');
const path = require('path');

async function sitemapCron() {
  const startTime = Date.now();
  
  try {
    console.log(`🕐 [SITEMAP CRON] Début de la génération automatique - ${new Date().toISOString()}`);
    
    // Générer le sitemap
    await generateSitemap();
    
    // Vérifier que le fichier a été créé
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      const stats = fs.statSync(sitemapPath);
      const fileSize = (stats.size / 1024).toFixed(2);
      
      console.log(`✅ [SITEMAP CRON] Sitemap généré avec succès !`);
      console.log(`📊 [SITEMAP CRON] Taille du fichier: ${fileSize} KB`);
      console.log(`📅 [SITEMAP CRON] Dernière modification: ${stats.mtime.toISOString()}`);
    } else {
      throw new Error('Le fichier sitemap.xml n\'a pas été créé');
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  [SITEMAP CRON] Génération terminée en ${duration}s`);
    
  } catch (error) {
    console.error(`❌ [SITEMAP CRON] Erreur lors de la génération automatique:`, error);
    
    // En cas d'erreur, essayer de générer un sitemap minimal
    try {
      console.log('🔄 [SITEMAP CRON] Tentative de génération d\'un sitemap minimal...');
      await generateMinimalSitemap();
      console.log('✅ [SITEMAP CRON] Sitemap minimal généré avec succès');
    } catch (fallbackError) {
      console.error('❌ [SITEMAP CRON] Échec de la génération du sitemap minimal:', fallbackError);
      process.exit(1);
    }
  }
}

async function generateMinimalSitemap() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.checkmyenterprise.com' 
    : 'http://localhost:5173';

  const minimalPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/assessment', priority: '0.9', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' }
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  minimalPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
}

// Exécuter le script si appelé directement
if (require.main === module) {
  sitemapCron();
}

module.exports = { sitemapCron, generateMinimalSitemap };
