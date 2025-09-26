const mongoose = require('mongoose');
const Blog = require('../models/Blog');

// Configuration de la base de données
const MONGODB_URI ='mongodb+srv://haurlyroll:cH7bRk7ogQyjd6Uj@cluster0.5dr5yol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function migrateProductionBlogs() {
  try {
    console.log('🚀 [PROD-MIGRATION] Démarrage de la migration de production...');
    
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ [PROD-MIGRATION] Connecté à MongoDB de production');
    
    // Trouver tous les blogs
    const blogs = await Blog.find({});
    console.log(`📊 [PROD-MIGRATION] ${blogs.length} blogs trouvés en production`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const blog of blogs) {
      try {
        console.log(`🔄 [PROD-MIGRATION] Traitement du blog: ${blog.title}`);
        
        // Vérifier si déjà au format bilingue
        if (typeof blog.title === 'object' && blog.title.fr && blog.title.en) {
          console.log('⏭️ [PROD-MIGRATION] Blog déjà au format bilingue, ignoré');
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
        const updateData = {
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
          updateData.metaTitle = {
            fr: oldMetaTitle,
            en: oldMetaTitle
          };
        }
        
        if (oldMetaDescription) {
          updateData.metaDescription = {
            fr: oldMetaDescription,
            en: oldMetaDescription
          };
        }
        
        // Mettre à jour le blog
        await Blog.findByIdAndUpdate(blog._id, updateData);
        console.log('✅ [PROD-MIGRATION] Blog migré avec succès');
        migratedCount++;
        
      } catch (error) {
        console.error(`❌ [PROD-MIGRATION] Erreur lors de la migration du blog ${blog._id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 [PROD-MIGRATION] Résumé de la migration:');
    console.log(`   ✅ Blogs migrés: ${migratedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📝 Total traités: ${blogs.length}`);
    
    if (errorCount === 0) {
      console.log('🎉 [PROD-MIGRATION] Migration de production terminée avec succès !');
    } else {
      console.log('⚠️ [PROD-MIGRATION] Migration terminée avec des erreurs');
    }
    
  } catch (error) {
    console.error('❌ [PROD-MIGRATION] Erreur générale:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 [PROD-MIGRATION] Déconnecté de MongoDB de production');
  }
}

// Exécuter la migration
migrateProductionBlogs();
