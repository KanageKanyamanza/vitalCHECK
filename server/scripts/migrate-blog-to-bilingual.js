#!/usr/bin/env node

/**
 * Script de migration pour convertir les blogs existants au format bilingue
 * Usage: node scripts/migrate-blog-to-bilingual.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

async function migrateBlogs() {
  try {
    console.log('🚀 [MIGRATION] Démarrage de la migration des blogs vers le format bilingue...\n');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ubb-health-check');
    console.log('✅ [MIGRATION] Connecté à MongoDB');
    
    // Récupérer tous les blogs existants
    const blogs = await Blog.find({});
    console.log(`📊 [MIGRATION] ${blogs.length} blogs trouvés`);
    
    if (blogs.length === 0) {
      console.log('ℹ️ [MIGRATION] Aucun blog à migrer');
      return;
    }
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const blog of blogs) {
      try {
        console.log(`\n🔄 [MIGRATION] Migration du blog: ${blog.title || 'Sans titre'}`);
        
        // Vérifier si le blog est déjà au format bilingue
        if (blog.title && typeof blog.title === 'object' && blog.title.fr && blog.title.en) {
          console.log('⏭️ [MIGRATION] Blog déjà au format bilingue, ignoré');
          continue;
        }
        
        // Sauvegarder les anciennes valeurs
        const oldTitle = blog.title;
        const oldSlug = blog.slug;
        const oldExcerpt = blog.excerpt;
        const oldContent = blog.content;
        const oldMetaTitle = blog.metaTitle;
        const oldMetaDescription = blog.metaDescription;
        
        // Créer le nouveau format bilingue
        const newBlogData = {
          title: {
            fr: oldTitle || 'Titre par défaut',
            en: oldTitle || 'Default title'
          },
          slug: {
            fr: oldSlug ? `${oldSlug}-fr` : `blog-${blog._id}-fr`,
            en: oldSlug ? `${oldSlug}-en` : `blog-${blog._id}-en`
          },
          excerpt: {
            fr: oldExcerpt || 'Résumé par défaut',
            en: oldExcerpt || 'Default excerpt'
          },
          content: {
            fr: oldContent || 'Contenu par défaut',
            en: oldContent || 'Default content'
          }
        };
        
        // Ajouter les métadonnées SEO si elles existent
        if (oldMetaTitle) {
          newBlogData.metaTitle = {
            fr: oldMetaTitle,
            en: oldMetaTitle
          };
        }
        
        if (oldMetaDescription) {
          newBlogData.metaDescription = {
            fr: oldMetaDescription,
            en: oldMetaDescription
          };
        }
        
        // Mettre à jour le blog
        Object.assign(blog, newBlogData);
        await blog.save();
        
        console.log('✅ [MIGRATION] Blog migré avec succès');
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ [MIGRATION] Erreur lors de la migration du blog ${blog._id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 [MIGRATION] Résumé de la migration:`);
    console.log(`   ✅ Blogs migrés: ${migratedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📝 Total traités: ${blogs.length}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 [MIGRATION] Migration terminée avec succès !');
    } else {
      console.log('\n⚠️ [MIGRATION] Migration terminée avec des erreurs');
    }
    
  } catch (error) {
    console.error('💥 [MIGRATION] Erreur fatale:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 [MIGRATION] Déconnecté de MongoDB');
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ [MIGRATION] Erreur non gérée:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ [MIGRATION] Exception non capturée:', error);
  process.exit(1);
});

migrateBlogs();
