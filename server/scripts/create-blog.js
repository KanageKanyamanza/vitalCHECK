const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');
require('dotenv').config();

const createBlog = async () => {
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

    // Données du blog
    const blogData = {
      title: "Étude de cas : Free vs Premium – Comment VitalCHECK Enterprise Health Check a sauvé une PME d'un échec coûteux",
      slug: "etude-cas-free-vs-premium-VitalCHECK-sauve-pme-echec-couteux",
      excerpt: "Découvrez comment une PME de distribution agroalimentaire à Douala a évité des pertes de 25 millions FCFA grâce à l'Option Premium d'VitalCHECK Enterprise Health Check, comparé aux limitations de l'option gratuite.",
      content: `
        <h2>Contexte</h2>
        <p>Une PME de distribution agroalimentaire à Douala connaissait une forte croissance mais souffrait de retards de livraison, d'inefficacités internes et d'un logiciel de facturation vieillissant. Le risque : une défaillance pouvant bloquer la trésorerie et provoquer des pertes évaluées à 25 millions FCFA.</p>
        
        <h2>Scénario 1 : Option Gratuite</h2>
        <p>Avec l'option gratuite, l'entreprise a accès à un diagnostic en ligne de base, générant un rapport automatique.</p>
        <ul>
          <li><strong>Résultat :</strong> le rapport met en évidence un manque de coordination générale, mais ne détecte pas la gravité du problème lié au logiciel de facturation.</li>
          <li><strong>Impact :</strong> le risque critique reste non traité. Quelques semaines plus tard, le système bloque les paiements, entraînant des retards clients et une perte estimée de 20 millions FCFA avant correction.</li>
        </ul>
        
        <h2>Scénario 2 : Option Premium</h2>
        <p>Avec l'Option Premium, l'entreprise bénéficie d'un diagnostic approfondi, d'une validation par un expert et d'un suivi de mise en œuvre.</p>
        <ul>
          <li><strong>Résultat :</strong> le logiciel obsolète est identifié immédiatement comme risque critique. Une migration sécurisée est mise en place en urgence.</li>
          <li><strong>Impact :</strong> perte évitée de 25 millions FCFA, amélioration de la productivité (+18 %), et économies additionnelles de 5 millions FCFA sur les coûts de gestion grâce à une meilleure coordination.</li>
        </ul>
        
        <h2>Comparaison en chiffres</h2>
        <ul>
          <li><strong>Option Gratuite :</strong> pertes réelles ≈ 20 millions FCFA</li>
          <li><strong>Option Premium :</strong> pertes évitées + gains ≈ 30 millions FCFA</li>
          <li><strong>Différence nette :</strong> 50 millions FCFA en faveur de l'option Premium.</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>L'option gratuite peut sensibiliser aux problèmes, mais elle ne suffit pas à protéger une entreprise des risques systémiques critiques. L'Option Premium, elle, transforme un simple diagnostic en levier stratégique de protection et de croissance.</p>
      `,
      type: 'etude-cas',
      category: 'strategie',
      tags: ['étude de cas', 'PME', 'diagnostic', 'premium', 'gratuit', 'risques', 'productivité', 'agroalimentaire', 'Douala'],
      status: 'published',
      publishedAt: new Date(),
      author: admin._id,
      metaTitle: "Étude de cas VitalCHECK : Free vs Premium - Éviter 25M FCFA",
      metaDescription: "Découvrez comment une PME a évité 25 millions FCFA de pertes grâce à l'Option Premium d'VitalCHECK Enterprise Health Check vs les limitations de l'option gratuite.",
      views: 0,
      likes: 0,
      caseStudy: {
        company: "PME Distribution Agroalimentaire",
        sector: "Agroalimentaire",
        companySize: "PME",
        challenge: "Retards de livraison, inefficacités internes et logiciel de facturation vieillissant menaçant la trésorerie",
        solution: "Diagnostic approfondi avec validation expert et suivi de mise en œuvre via l'Option Premium",
        results: "Perte évitée de 25 millions FCFA, amélioration productivité +18%, économies 5M FCFA",
        metrics: [
          {
            label: "Pertes évitées",
            value: "25 millions FCFA",
            description: "Grâce à l'identification précoce du risque critique"
          },
          {
            label: "Amélioration productivité",
            value: "+18%",
            description: "Suite à la migration du logiciel de facturation"
          },
          {
            label: "Économies additionnelles",
            value: "5 millions FCFA",
            description: "Sur les coûts de gestion grâce à une meilleure coordination"
          },
          {
            label: "Différence nette",
            value: "50 millions FCFA",
            description: "En faveur de l'Option Premium vs gratuite"
          }
        ]
      }
    };

    // Créer le blog
    const blog = new Blog(blogData);
    await blog.save();

    console.log('✅ Blog créé avec succès !');
    console.log('📝 Titre:', blog.title);
    console.log('🔗 Slug:', blog.slug);
    console.log('📊 Type:', blog.type);
    console.log('🏷️ Catégorie:', blog.category);
    console.log('📈 Statut:', blog.status);

  } catch (error) {
    console.error('❌ Erreur lors de la création du blog:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script
createBlog();
