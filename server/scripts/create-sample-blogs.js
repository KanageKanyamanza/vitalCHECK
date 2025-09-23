const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');
require('dotenv').config();

const createSampleBlogs = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer le premier admin pour l'auteur
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ Aucun admin trouvé');
      return;
    }

    // Blogs à créer
    const blogsData = [
      {
        title: "5 Signes que votre entreprise a besoin d'un diagnostic de santé",
        slug: "5-signes-entreprise-besoin-diagnostic-sante",
        excerpt: "Découvrez les 5 signaux d'alarme qui indiquent qu'il est temps de faire un diagnostic de santé de votre entreprise pour éviter les problèmes majeurs.",
        content: `
          <h2>1. Baisse de la productivité</h2>
          <p>Si vous remarquez une diminution constante de la productivité de vos équipes, c'est souvent le signe de problèmes organisationnels sous-jacents.</p>
          
          <h2>2. Taux de rotation élevé</h2>
          <p>Un taux de rotation du personnel élevé peut indiquer des problèmes de management, de culture d'entreprise ou de conditions de travail.</p>
          
          <h2>3. Difficultés financières récurrentes</h2>
          <p>Des problèmes de trésorerie réguliers peuvent révéler des inefficacités dans la gestion ou la planification.</p>
          
          <h2>4. Perte de clients</h2>
          <p>Une perte de clients peut indiquer des problèmes de qualité, de service ou de communication.</p>
          
          <h2>5. Stress et surcharge des équipes</h2>
          <p>Des équipes surchargées et stressées sont souvent le symptôme de problèmes organisationnels plus profonds.</p>
          
          <h2>Conclusion</h2>
          <p>Si vous reconnaissez ces signes dans votre entreprise, il est temps d'agir. Un diagnostic de santé peut vous aider à identifier les causes racines et à mettre en place des solutions durables.</p>
        `,
        type: 'article',
        category: 'strategie',
        tags: ['diagnostic', 'productivité', 'management', 'santé entreprise', 'signaux d\'alarme'],
        status: 'published',
        publishedAt: new Date(),
        author: admin._id,
        metaTitle: "5 Signes que votre entreprise a besoin d'un diagnostic",
        metaDescription: "Découvrez les 5 signaux d'alarme qui indiquent qu'il est temps de faire un diagnostic de santé de votre entreprise.",
        views: 0,
        likes: 0
      },
      {
        title: "Comment optimiser la gestion de votre trésorerie en 5 étapes",
        slug: "optimiser-gestion-tresorerie-5-etapes",
        excerpt: "Apprenez les techniques essentielles pour optimiser la gestion de votre trésorerie et éviter les problèmes de liquidité qui peuvent menacer votre entreprise.",
        content: `
          <h2>1. Établir un budget prévisionnel</h2>
          <p>Créez un budget détaillé sur 12 mois avec des mises à jour mensuelles pour anticiper les besoins de trésorerie.</p>
          
          <h2>2. Optimiser le recouvrement des créances</h2>
          <p>Mettez en place des procédures strictes de facturation et de relance pour réduire les délais de paiement.</p>
          
          <h2>3. Négocier avec les fournisseurs</h2>
          <p>Étendez vos délais de paiement fournisseurs tout en maintenant de bonnes relations commerciales.</p>
          
          <h2>4. Diversifier les sources de financement</h2>
          <p>Préparez des solutions de financement alternatives (lignes de crédit, factoring, etc.) pour faire face aux imprévus.</p>
          
          <h2>5. Surveiller les indicateurs clés</h2>
          <p>Suivez régulièrement le BFR, le délai de rotation des stocks et le délai de recouvrement des créances.</p>
          
          <h2>Conclusion</h2>
          <p>Une gestion optimisée de la trésorerie est cruciale pour la survie et la croissance de votre entreprise. Ces 5 étapes vous aideront à maintenir une situation financière saine.</p>
        `,
        type: 'tutoriel',
        category: 'finance',
        tags: ['trésorerie', 'finance', 'gestion', 'budget', 'optimisation'],
        status: 'published',
        publishedAt: new Date(),
        author: admin._id,
        metaTitle: "Comment optimiser la gestion de votre trésorerie",
        metaDescription: "Apprenez les techniques essentielles pour optimiser la gestion de votre trésorerie et éviter les problèmes de liquidité.",
        views: 0,
        likes: 0,
        tutorial: {
          difficulty: 'intermediaire',
          duration: '20 minutes',
          prerequisites: ['Notions de base en comptabilité', 'Connaissance des flux de trésorerie']
        }
      },
      {
        title: "Témoignage : Comment UBB nous a aidés à doubler notre chiffre d'affaires",
        slug: "temoignage-ubb-doubler-chiffre-affaires",
        excerpt: "Découvrez le témoignage de M. Jean-Baptiste, PDG d'une PME de services, qui a réussi à doubler son chiffre d'affaires grâce aux recommandations d'UBB Enterprise Health Check.",
        content: `
          <h2>Notre situation initiale</h2>
          <p>En tant que PDG d'une PME de services de 15 employés, nous avions des difficultés à identifier les leviers de croissance. Notre chiffre d'affaires stagnait autour de 500 millions FCFA par an.</p>
          
          <h2>Le diagnostic UBB</h2>
          <p>Le diagnostic UBB a révélé plusieurs opportunités d'amélioration que nous n'avions pas identifiées :</p>
          <ul>
            <li>Optimisation des processus de vente</li>
            <li>Amélioration de la gestion des ressources humaines</li>
            <li>Diversification des services proposés</li>
            <li>Mise en place d'un système de suivi des performances</li>
          </ul>
          
          <h2>Les résultats obtenus</h2>
          <p>En appliquant les recommandations d'UBB, nous avons réussi à :</p>
          <ul>
            <li>Doubler notre chiffre d'affaires en 18 mois</li>
            <li>Améliorer la satisfaction client de 40%</li>
            <li>Réduire les coûts opérationnels de 15%</li>
            <li>Augmenter la productivité de nos équipes de 25%</li>
          </ul>
          
          <h2>Notre recommandation</h2>
          <p>UBB Enterprise Health Check nous a donné une vision claire de notre entreprise et des actions concrètes à mettre en place. C'est un investissement qui s'est largement rentabilisé.</p>
        `,
        type: 'temoignage',
        category: 'marketing',
        tags: ['témoignage', 'croissance', 'chiffre d\'affaires', 'PME', 'services'],
        status: 'published',
        publishedAt: new Date(),
        author: admin._id,
        metaTitle: "Témoignage : Doubler le CA grâce à UBB",
        metaDescription: "Découvrez comment une PME a doublé son chiffre d'affaires grâce aux recommandations d'UBB Enterprise Health Check.",
        views: 0,
        likes: 0,
        testimonial: {
          clientName: "Jean-Baptiste Nguema",
          clientCompany: "Services Pro Cameroun",
          clientPosition: "PDG",
          clientPhoto: "",
          rating: 5
        }
      }
    ];

    // Créer chaque blog
    for (const blogData of blogsData) {
      const blog = new Blog(blogData);
      await blog.save();
      console.log(`✅ Blog créé : ${blog.title}`);
    }

    console.log(`🎉 ${blogsData.length} blogs créés avec succès !`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des blogs:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script
createSampleBlogs();
