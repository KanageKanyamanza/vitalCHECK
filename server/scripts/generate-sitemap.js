#!/usr/bin/env node

/**
 * Script de génération automatique du sitemap
 * Usage: node scripts/generate-sitemap.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import des modèles
const Blog = require('../models/Blog');

async function generateSitemap() {
  try {
    console.log('🚀 [SITEMAP] Début de la génération du sitemap...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCheck-health-check');
    console.log('✅ [SITEMAP] Connecté à MongoDB');
    
    // Récupérer tous les blogs publiés
    const blogs = await Blog.find({ 
      status: 'published',
      publishedAt: { $exists: true }
    })
    .select('slug updatedAt publishedAt')
    .sort({ publishedAt: -1 });

    console.log(`📝 [SITEMAP] ${blogs.length} blogs publiés trouvés`);

    // Pages statiques
    const staticPages = [
      {
        url: '/',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '1.0'
      },
      {
        url: '/assessment',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: '/blog',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.8'
      },
      {
        url: '/about',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/contact',
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.6'
      },
      {
        url: '/privacy',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: '0.3'
      },
      {
        url: '/terms',
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: '0.3'
      }
    ];

    // Pages multilingues
    const languagePages = [
      {
        url: '/?lang=en',
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        url: '/blog?lang=en',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.7'
      }
    ];

    // Déterminer l'URL de base selon l'environnement
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.checkmyenterprise.com' 
      : 'http://localhost:5173';

    // Générer le XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';

    // Ajouter les pages statiques
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Ajouter les pages multilingues
    languagePages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Ajouter les articles de blog
    let blogCount = 0;
    blogs.forEach(blog => {
      // S'assurer que le blog a un slug valide (gérer le format bilingue)
      let blogSlug = null;
      
      if (blog.slug) {
        if (typeof blog.slug === 'string') {
          // Ancien format (chaîne simple)
          blogSlug = blog.slug;
        } else if (typeof blog.slug === 'object' && blog.slug !== null) {
          // Nouveau format bilingue - privilégier le français, sinon l'anglais
          blogSlug = blog.slug.fr || blog.slug.en;
        }
      }
      
      if (blogSlug) {
        const lastmod = blog.updatedAt || blog.publishedAt;
        // Nettoyer le slug pour éviter les caractères XML invalides
        const cleanSlug = blogSlug.replace(/[<>"&]/g, '');
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/blog/${cleanSlug}</loc>\n`;
        xml += `    <lastmod>${lastmod.toISOString()}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
        blogCount++;
      }
    });

    xml += '\n</urlset>';

    // S'assurer que le XML commence bien par la déclaration
    if (!xml.startsWith('<?xml')) {
      throw new Error('Le sitemap XML ne commence pas correctement');
    }

    // Écrire le fichier sitemap
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');

    console.log(`✅ [SITEMAP] Sitemap généré avec succès !`);
    console.log(`📊 [SITEMAP] Statistiques:`);
    console.log(`   - Pages statiques: ${staticPages.length}`);
    console.log(`   - Pages multilingues: ${languagePages.length}`);
    console.log(`   - Articles de blog: ${blogCount}`);
    console.log(`   - Total URLs: ${staticPages.length + languagePages.length + blogCount}`);
    console.log(`📁 [SITEMAP] Fichier sauvegardé: ${sitemapPath}`);

    // Afficher un aperçu du contenu
    console.log('\n📄 [SITEMAP] Aperçu du sitemap:');
    console.log(xml.substring(0, 500) + '...');

  } catch (error) {
    console.error('❌ [SITEMAP] Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion MongoDB
    await mongoose.connection.close();
    console.log('🔌 [SITEMAP] Connexion MongoDB fermée');
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };
