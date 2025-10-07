#!/usr/bin/env node

/**
 * Script de génération du sitemap côté client
 * Usage: node scripts/generate-sitemap.js
 * Ce script génère le sitemap dans le dossier public du client
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateClientSitemap() {
  try {
    console.log('🚀 [SITEMAP CLIENT] Début de la génération du sitemap côté client...');
    
    // URL de l'API pour récupérer les blogs
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000/api';
    
    let blogs = [];
    try {
      console.log('📡 [SITEMAP CLIENT] Récupération des blogs depuis l\'API...');
      const response = await axios.get(`${apiUrl}/blogs`, {
        params: { 
          status: 'published',
          limit: 100 
        },
        timeout: 10000
      });
      blogs = response.data.blogs || [];
      console.log(`📝 [SITEMAP CLIENT] ${blogs.length} blogs publiés récupérés`);
    } catch (error) {
      console.warn('⚠️  [SITEMAP CLIENT] Impossible de récupérer les blogs depuis l\'API:', error.message);
      console.log('📝 [SITEMAP CLIENT] Utilisation d\'une liste de blogs par défaut');
      // Liste de blogs par défaut si l'API n'est pas disponible
      blogs = [
        { slug: { fr: 'du-cahier-au-digital-comment-structurer-vos-operations-sans-gros-budget' }, updatedAt: new Date() },
        { slug: { fr: 'afrique-du-sud-le-leader-africain-du-march-des-aliments-emballs' }, updatedAt: new Date() },
        { slug: { fr: '5-signes-entreprise-diagnostic-sante' }, updatedAt: new Date() },
        { slug: { fr: 'optimiser-gestion-tresorerie-5-etapes' }, updatedAt: new Date() },
        { slug: { fr: 'temoignage-ubb-doubler-chiffre-affaires' }, updatedAt: new Date() },
        { slug: { fr: '5-signaux-alarme-diagnostic-urgent' }, updatedAt: new Date() },
        { slug: { fr: 'etude-cas-transformation-digitale-pme' }, updatedAt: new Date() }
      ];
    }

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
        const lastmod = blog.updatedAt || blog.publishedAt || new Date();
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

    // Écrire le fichier sitemap dans le dossier public du client
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');

    console.log(`✅ [SITEMAP CLIENT] Sitemap généré avec succès !`);
    console.log(`📊 [SITEMAP CLIENT] Statistiques:`);
    console.log(`   - Pages statiques: ${staticPages.length}`);
    console.log(`   - Pages multilingues: ${languagePages.length}`);
    console.log(`   - Articles de blog: ${blogCount}`);
    console.log(`   - Total URLs: ${staticPages.length + languagePages.length + blogCount}`);
    console.log(`📁 [SITEMAP CLIENT] Fichier sauvegardé: ${sitemapPath}`);
    console.log(`🌐 [SITEMAP CLIENT] URL de base: ${baseUrl}`);

    // Afficher un aperçu du contenu
    console.log('\n📄 [SITEMAP CLIENT] Aperçu du sitemap:');
    console.log(xml.substring(0, 500) + '...');

  } catch (error) {
    console.error('❌ [SITEMAP CLIENT] Erreur lors de la génération du sitemap:', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
generateClientSitemap();

export { generateClientSitemap };
