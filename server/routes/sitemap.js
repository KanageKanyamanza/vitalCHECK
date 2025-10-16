const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// Route pour servir le sitemap XML (statique en priorité, dynamique en fallback)
router.get('/sitemap.xml', (req, res) => {
  try {
    // Chemin vers le sitemap statique
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
    
    // Vérifier si le fichier statique existe
    if (fs.existsSync(sitemapPath)) {
      console.log('📄 [SITEMAP] Servir le sitemap statique')
      res.set('Content-Type', 'application/xml; charset=utf-8')
      res.sendFile(sitemapPath)
    } else {
      console.log('⚠️  [SITEMAP] Fichier statique non trouvé, fallback vers génération dynamique')
      // Fallback vers la génération dynamique si le fichier statique n'existe pas
      generateDynamicSitemap(req, res)
    }
  } catch (error) {
    console.error('❌ [SITEMAP] Erreur lors du service du sitemap:', error)
    res.status(500).send('Erreur lors du service du sitemap')
  }
})

// Fonction de fallback pour générer le sitemap dynamiquement
async function generateDynamicSitemap(req, res) {
  try {
    const Blog = require('../models/Blog')
    
    // Récupérer tous les blogs publiés
    const blogs = await Blog.find({ 
      status: 'published',
      publishedAt: { $exists: true }
    })
    .select('slug updatedAt publishedAt')
    .sort({ publishedAt: -1 })

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
    ]

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
    ]

    // Déterminer l'URL de base selon l'environnement
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.checkmyenterprise.com' 
      : 'http://localhost:5173'

    // Générer le XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n'
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n'

    // Ajouter les pages statiques
    staticPages.forEach(page => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
      xml += `    <priority>${page.priority}</priority>\n`
      xml += '  </url>\n'
    })

    // Ajouter les pages multilingues
    languagePages.forEach(page => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
      xml += `    <priority>${page.priority}</priority>\n`
      xml += '  </url>\n'
    })

    // Ajouter les articles de blog
    blogs.forEach(blog => {
      // S'assurer que le blog a un slug valide (gérer le format bilingue)
      let blogSlug = null
      
      if (blog.slug) {
        if (typeof blog.slug === 'string') {
          // Ancien format (chaîne simple)
          blogSlug = blog.slug
        } else if (typeof blog.slug === 'object' && blog.slug !== null) {
          // Nouveau format bilingue - privilégier le français, sinon l'anglais
          blogSlug = blog.slug.fr || blog.slug.en
        }
      }
      
      if (blogSlug) {
        const lastmod = blog.updatedAt || blog.publishedAt
        // Nettoyer le slug pour éviter les caractères XML invalides
        const cleanSlug = blogSlug.replace(/[<>"&]/g, '')
        xml += '  <url>\n'
        xml += `    <loc>${baseUrl}/blog/${cleanSlug}</loc>\n`
        xml += `    <lastmod>${lastmod.toISOString()}</lastmod>\n`
        xml += '    <changefreq>monthly</changefreq>\n'
        xml += '    <priority>0.7</priority>\n'
        xml += '  </url>\n'
      }
    })

    xml += '\n</urlset>'

    // S'assurer que le XML commence bien par la déclaration
    if (!xml.startsWith('<?xml')) {
      console.error('❌ [SITEMAP] Erreur: Le sitemap XML ne commence pas correctement')
      return res.status(500).send('Erreur lors de la génération du sitemap')
    }

    res.set('Content-Type', 'application/xml; charset=utf-8')
    res.send(xml)
  } catch (error) {
    console.error('❌ [SITEMAP] Erreur lors de la génération dynamique du sitemap:', error)
    res.status(500).send('Erreur lors de la génération du sitemap')
  }
}

// Route pour robots.txt
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `# Robots.txt pour VitalCHECK Enterprise Health Check
# https://www.checkmyenterprise.com

User-agent: *
Allow: /

# Pages importantes
Allow: /assessment
Allow: /blog
Allow: /about
Allow: /contact

# Fichiers statiques
Allow: /assets/
Allow: /images/
Allow: /favicon.ico
Allow: /manifest.json
Allow: /sw.js

# Interdire l'accès aux pages admin et API
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

# Interdire l'accès aux fichiers de configuration
Disallow: /.env
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /yarn.lock

# Interdire l'accès aux fichiers de développement
Disallow: /src/
Disallow: /public/
Disallow: /.git/
Disallow: /.vscode/
Disallow: /logs/

# Sitemap
Sitemap: https://www.checkmyenterprise.com/sitemap.xml

# Crawl-delay pour éviter la surcharge
Crawl-delay: 1

# Directives spécifiques pour les principaux moteurs de recherche
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Bloquer les bots malveillants
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: BLEXBot
Disallow: /`

  res.set('Content-Type', 'text/plain')
  res.send(robotsTxt)
})

module.exports = router
