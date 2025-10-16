const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Admin = require('../models/Admin');
require('dotenv').config();

const sampleBlogs = [
  {
    title: {
      fr: "Comment améliorer la santé financière de votre entreprise en 2024",
      en: "How to Improve Your Company's Financial Health in 2024"
    },
    excerpt: {
      fr: "Découvrez les 5 stratégies essentielles pour optimiser la trésorerie et renforcer la stabilité financière de votre PME cette année.",
      en: "Discover the 5 essential strategies to optimize cash flow and strengthen your SME's financial stability this year."
    },
    content: {
      fr: `<h2>Introduction</h2>
<p>La santé financière est le pilier fondamental de toute entreprise prospère. En 2024, face aux défis économiques actuels, il est crucial d'adopter une approche proactive pour gérer vos finances.</p>

<h2>1. Optimisez votre gestion de trésorerie</h2>
<p>La trésorerie est le nerf de la guerre pour toute entreprise. Voici comment l'optimiser :</p>
<ul>
  <li><strong>Prévisions précises :</strong> Établissez des prévisions de trésorerie sur 12 mois minimum</li>
  <li><strong>Délais de paiement :</strong> Négociez des délais favorables avec vos fournisseurs</li>
  <li><strong>Recouvrement :</strong> Mettez en place un système efficace de relance clients</li>
</ul>

<h2>2. Diversifiez vos sources de revenus</h2>
<p>Ne mettez pas tous vos œufs dans le même panier. La diversification réduit les risques et augmente la résilience de votre entreprise face aux fluctuations du marché.</p>

<h2>3. Contrôlez vos coûts opérationnels</h2>
<p>Analysez régulièrement vos dépenses et identifiez les opportunités d'optimisation sans compromettre la qualité de vos produits ou services.</p>

<h2>4. Investissez dans la technologie financière</h2>
<p>Les outils de gestion financière automatisés peuvent vous faire gagner du temps et améliorer la précision de vos analyses.</p>

<h2>5. Constituez une réserve de sécurité</h2>
<p>Visez un fonds de réserve équivalent à 3-6 mois de charges fixes pour faire face aux imprévus.</p>

<h2>Conclusion</h2>
<p>En appliquant ces stratégies, vous renforcerez significativement la santé financière de votre entreprise et serez mieux préparé pour saisir les opportunités de croissance.</p>`,
      en: `<h2>Introduction</h2>
<p>Financial health is the fundamental pillar of any thriving business. In 2024, facing current economic challenges, it's crucial to adopt a proactive approach to managing your finances.</p>

<h2>1. Optimize Your Cash Flow Management</h2>
<p>Cash flow is the lifeblood of any business. Here's how to optimize it:</p>
<ul>
  <li><strong>Accurate Forecasts:</strong> Establish cash flow forecasts for at least 12 months</li>
  <li><strong>Payment Terms:</strong> Negotiate favorable terms with your suppliers</li>
  <li><strong>Collections:</strong> Implement an efficient customer follow-up system</li>
</ul>

<h2>2. Diversify Your Revenue Streams</h2>
<p>Don't put all your eggs in one basket. Diversification reduces risks and increases your company's resilience to market fluctuations.</p>

<h2>3. Control Your Operating Costs</h2>
<p>Regularly analyze your expenses and identify optimization opportunities without compromising the quality of your products or services.</p>

<h2>4. Invest in Financial Technology</h2>
<p>Automated financial management tools can save you time and improve the accuracy of your analyses.</p>

<h2>5. Build a Safety Reserve</h2>
<p>Aim for a reserve fund equivalent to 3-6 months of fixed costs to handle unexpected situations.</p>

<h2>Conclusion</h2>
<p>By applying these strategies, you will significantly strengthen your company's financial health and be better prepared to seize growth opportunities.</p>`
    },
    type: 'article',
    category: 'finance',
    tags: ['trésorerie', 'finance', 'PME', 'gestion', 'optimisation'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    metaTitle: {
      fr: "Améliorer Santé Financière Entreprise | VitalCHECK",
      en: "Improve Company Financial Health | VitalCHECK"
    },
    metaDescription: {
      fr: "5 stratégies éprouvées pour optimiser la trésorerie et renforcer la stabilité financière de votre PME en 2024.",
      en: "5 proven strategies to optimize cash flow and strengthen your SME's financial stability in 2024."
    }
  },
  {
    title: {
      fr: "Transformation Digitale : Cas d'une PME manufacturière",
      en: "Digital Transformation: Case Study of a Manufacturing SME"
    },
    excerpt: {
      fr: "Comment TechManuf a multiplié sa productivité par 3 grâce à la digitalisation de ses processus.",
      en: "How TechManuf tripled its productivity through process digitalization."
    },
    content: {
      fr: `<h2>Le défi initial</h2>
<p>TechManuf, une PME manufacturière de 50 employés, faisait face à des défis majeurs : processus manuels chronophages, erreurs de production, et difficulté à suivre les commandes en temps réel.</p>

<h2>La stratégie de transformation</h2>
<p>L'entreprise a adopté une approche progressive :</p>
<ol>
  <li><strong>Audit complet</strong> des processus existants</li>
  <li><strong>Priorisation</strong> des domaines à fort impact</li>
  <li><strong>Formation</strong> des équipes aux nouveaux outils</li>
  <li><strong>Déploiement progressif</strong> sur 6 mois</li>
</ol>

<h2>Les outils implémentés</h2>
<ul>
  <li>ERP intégré pour la gestion de production</li>
  <li>Système de suivi en temps réel</li>
  <li>Automatisation des commandes</li>
  <li>Tableau de bord analytique</li>
</ul>

<h2>Les résultats impressionnants</h2>
<p>Après 12 mois :</p>
<ul>
  <li>🚀 <strong>+200%</strong> de productivité</li>
  <li>📉 <strong>-60%</strong> d'erreurs de production</li>
  <li>⏱️ <strong>-40%</strong> de délais de livraison</li>
  <li>💰 <strong>+150%</strong> de chiffre d'affaires</li>
</ul>

<h2>Les leçons à retenir</h2>
<p>La transformation digitale réussie repose sur trois piliers : l'engagement de la direction, la formation des équipes, et une approche progressive et mesurée.</p>`,
      en: `<h2>The Initial Challenge</h2>
<p>TechManuf, a manufacturing SME with 50 employees, faced major challenges: time-consuming manual processes, production errors, and difficulty tracking orders in real-time.</p>

<h2>The Transformation Strategy</h2>
<p>The company adopted a progressive approach:</p>
<ol>
  <li><strong>Complete audit</strong> of existing processes</li>
  <li><strong>Prioritization</strong> of high-impact areas</li>
  <li><strong>Team training</strong> on new tools</li>
  <li><strong>Progressive deployment</strong> over 6 months</li>
</ol>

<h2>Implemented Tools</h2>
<ul>
  <li>Integrated ERP for production management</li>
  <li>Real-time tracking system</li>
  <li>Order automation</li>
  <li>Analytical dashboard</li>
</ul>

<h2>Impressive Results</h2>
<p>After 12 months:</p>
<ul>
  <li>🚀 <strong>+200%</strong> productivity increase</li>
  <li>📉 <strong>-60%</strong> production errors</li>
  <li>⏱️ <strong>-40%</strong> delivery times</li>
  <li>💰 <strong>+150%</strong> revenue growth</li>
</ul>

<h2>Key Takeaways</h2>
<p>Successful digital transformation relies on three pillars: management commitment, team training, and a progressive, measured approach.</p>`
    },
    type: 'etude-cas',
    category: 'technologie',
    tags: ['transformation digitale', 'cas client', 'productivité', 'industrie 4.0'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    metaTitle: {
      fr: "Transformation Digitale PME | VitalCHECK",
      en: "SME Digital Transformation | VitalCHECK"
    },
    metaDescription: {
      fr: "Découvrez comment TechManuf a multiplié sa productivité par 3 grâce à une transformation digitale réussie.",
      en: "Discover how TechManuf tripled productivity through successful digital transformation."
    }
  },
  {
    title: {
      fr: "10 Indicateurs RH à Suivre pour une Équipe Performante",
      en: "10 HR Metrics to Track for a High-Performance Team"
    },
    excerpt: {
      fr: "Les KPIs essentiels pour mesurer et améliorer l'engagement, la productivité et la rétention de vos talents.",
      en: "Essential KPIs to measure and improve engagement, productivity, and talent retention."
    },
    content: {
      fr: `<h2>Pourquoi mesurer les indicateurs RH ?</h2>
<p>Dans un contexte de guerre des talents, mesurer la performance RH n'est plus optionnel. Les données vous permettent de prendre des décisions éclairées et d'anticiper les problèmes.</p>

<h2>Les 10 indicateurs incontournables</h2>

<h3>1. Taux de rétention des employés</h3>
<p>Formule : (Nombre d'employés restants / Nombre d'employés en début de période) × 100</p>

<h3>2. Taux de turnover</h3>
<p>Identifiez les départs volontaires vs involontaires pour cibler vos actions.</p>

<h3>3. eNPS (Employee Net Promoter Score)</h3>
<p>Mesurez la satisfaction et l'engagement de vos équipes avec une question simple.</p>

<h3>4. Coût par recrutement</h3>
<p>Optimisez vos processus de recrutement en suivant les coûts réels.</p>

<h3>5. Délai de recrutement</h3>
<p>Le temps moyen entre la publication d'une offre et l'embauche effective.</p>

<h3>6. Taux d'absentéisme</h3>
<p>Un indicateur clé de la santé et du bien-être au travail.</p>

<h3>7. Productivité par employé</h3>
<p>Revenus ou production par employé pour mesurer l'efficacité.</p>

<h3>8. Taux de formation</h3>
<p>Heures de formation par employé et par an.</p>

<h3>9. Diversité et inclusion</h3>
<p>Suivez la composition de vos équipes pour garantir l'équité.</p>

<h3>10. Ratio managers/employés</h3>
<p>Assurez un encadrement optimal de vos équipes.</p>

<h2>Comment utiliser ces indicateurs ?</h2>
<p>Créez un tableau de bord RH, définissez des objectifs, et analysez les tendances mensuellement pour des ajustements rapides.</p>`,
      en: `<h2>Why Measure HR Metrics?</h2>
<p>In the context of the war for talent, measuring HR performance is no longer optional. Data allows you to make informed decisions and anticipate problems.</p>

<h2>The 10 Essential Metrics</h2>

<h3>1. Employee Retention Rate</h3>
<p>Formula: (Number of remaining employees / Number of employees at start of period) × 100</p>

<h3>2. Turnover Rate</h3>
<p>Identify voluntary vs involuntary departures to target your actions.</p>

<h3>3. eNPS (Employee Net Promoter Score)</h3>
<p>Measure team satisfaction and engagement with a simple question.</p>

<h3>4. Cost per Hire</h3>
<p>Optimize your recruitment processes by tracking actual costs.</p>

<h3>5. Time to Hire</h3>
<p>Average time between job posting and actual hiring.</p>

<h3>6. Absenteeism Rate</h3>
<p>A key indicator of workplace health and well-being.</p>

<h3>7. Productivity per Employee</h3>
<p>Revenue or output per employee to measure efficiency.</p>

<h3>8. Training Rate</h3>
<p>Training hours per employee per year.</p>

<h3>9. Diversity and Inclusion</h3>
<p>Track team composition to ensure equity.</p>

<h3>10. Manager to Employee Ratio</h3>
<p>Ensure optimal team supervision.</p>

<h2>How to Use These Metrics?</h2>
<p>Create an HR dashboard, set objectives, and analyze trends monthly for quick adjustments.</p>`
    },
    type: 'article',
    category: 'ressources-humaines',
    tags: ['RH', 'KPI', 'performance', 'management', 'talents'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    metaTitle: {
      fr: "10 KPIs RH Essentiels | VitalCHECK",
      en: "10 Essential HR KPIs | VitalCHECK"
    },
    metaDescription: {
      fr: "Découvrez les 10 indicateurs RH indispensables pour mesurer et améliorer la performance de vos équipes.",
      en: "Discover the 10 essential HR metrics to measure and improve your team's performance."
    }
  },
  {
    title: {
      fr: "Guide Pratique : Créer une Stratégie Marketing Digital Efficace",
      en: "Practical Guide: Creating an Effective Digital Marketing Strategy"
    },
    excerpt: {
      fr: "Un tutoriel étape par étape pour développer une stratégie marketing digital qui génère des résultats mesurables.",
      en: "A step-by-step tutorial to develop a digital marketing strategy that generates measurable results."
    },
    content: {
      fr: `<h2>Introduction</h2>
<p>Une stratégie marketing digital bien conçue est essentielle pour attirer, convertir et fidéliser vos clients. Ce guide vous accompagne dans chaque étape.</p>

<h2>Étape 1 : Définir vos objectifs SMART</h2>
<p>Vos objectifs doivent être :</p>
<ul>
  <li><strong>S</strong>pécifiques : Clairement définis</li>
  <li><strong>M</strong>esurables : Quantifiables</li>
  <li><strong>A</strong>tteignables : Réalistes</li>
  <li><strong>R</strong>elevants : Alignés avec votre stratégie globale</li>
  <li><strong>T</strong>emporels : Avec une échéance précise</li>
</ul>

<h2>Étape 2 : Connaître votre audience</h2>
<p>Créez des personas détaillés :</p>
<ul>
  <li>Données démographiques</li>
  <li>Comportements d'achat</li>
  <li>Points de douleur</li>
  <li>Canaux de communication préférés</li>
</ul>

<h2>Étape 3 : Choisir vos canaux</h2>
<p>Concentrez-vous sur les canaux où se trouve votre audience :</p>
<ul>
  <li>🔍 <strong>SEO</strong> : Pour la visibilité organique</li>
  <li>📱 <strong>Réseaux sociaux</strong> : Pour l'engagement</li>
  <li>📧 <strong>Email marketing</strong> : Pour la conversion</li>
  <li>💰 <strong>Publicité payante</strong> : Pour l'acquisition rapide</li>
  <li>📝 <strong>Content marketing</strong> : Pour l'autorité</li>
</ul>

<h2>Étape 4 : Créer un calendrier éditorial</h2>
<p>Planifiez vos contenus sur 3 mois minimum avec :</p>
<ul>
  <li>Thématiques principales</li>
  <li>Formats variés (articles, vidéos, infographies)</li>
  <li>Fréquence de publication</li>
  <li>Responsables de création</li>
</ul>

<h2>Étape 5 : Définir votre budget</h2>
<p>Répartissez votre budget selon la règle 70-20-10 :</p>
<ul>
  <li>70% : Canaux prouvés et performants</li>
  <li>20% : Optimisations et tests</li>
  <li>10% : Expérimentations nouvelles</li>
</ul>

<h2>Étape 6 : Mesurer et optimiser</h2>
<p>Suivez ces KPIs clés :</p>
<ul>
  <li>Trafic web</li>
  <li>Taux de conversion</li>
  <li>Coût d'acquisition client (CAC)</li>
  <li>Retour sur investissement (ROI)</li>
  <li>Engagement sur les réseaux sociaux</li>
</ul>

<h2>Outils recommandés</h2>
<ul>
  <li>Google Analytics pour l'analyse</li>
  <li>Hootsuite pour les réseaux sociaux</li>
  <li>Mailchimp pour l'email marketing</li>
  <li>SEMrush pour le SEO</li>
</ul>

<h2>Conclusion</h2>
<p>Une stratégie marketing digital efficace est un processus continu d'apprentissage et d'optimisation. Commencez petit, mesurez, et ajustez régulièrement.</p>`,
      en: `<h2>Introduction</h2>
<p>A well-designed digital marketing strategy is essential to attract, convert, and retain your customers. This guide walks you through each step.</p>

<h2>Step 1: Define Your SMART Goals</h2>
<p>Your objectives must be:</p>
<ul>
  <li><strong>S</strong>pecific: Clearly defined</li>
  <li><strong>M</strong>easurable: Quantifiable</li>
  <li><strong>A</strong>chievable: Realistic</li>
  <li><strong>R</strong>elevant: Aligned with your overall strategy</li>
  <li><strong>T</strong>ime-bound: With a specific deadline</li>
</ul>

<h2>Step 2: Know Your Audience</h2>
<p>Create detailed personas:</p>
<ul>
  <li>Demographics</li>
  <li>Buying behaviors</li>
  <li>Pain points</li>
  <li>Preferred communication channels</li>
</ul>

<h2>Step 3: Choose Your Channels</h2>
<p>Focus on channels where your audience is:</p>
<ul>
  <li>🔍 <strong>SEO</strong>: For organic visibility</li>
  <li>📱 <strong>Social media</strong>: For engagement</li>
  <li>📧 <strong>Email marketing</strong>: For conversion</li>
  <li>💰 <strong>Paid advertising</strong>: For quick acquisition</li>
  <li>📝 <strong>Content marketing</strong>: For authority</li>
</ul>

<h2>Step 4: Create an Editorial Calendar</h2>
<p>Plan your content for at least 3 months with:</p>
<ul>
  <li>Main themes</li>
  <li>Varied formats (articles, videos, infographics)</li>
  <li>Publication frequency</li>
  <li>Content creators</li>
</ul>

<h2>Step 5: Define Your Budget</h2>
<p>Allocate your budget using the 70-20-10 rule:</p>
<ul>
  <li>70%: Proven and performing channels</li>
  <li>20%: Optimizations and tests</li>
  <li>10%: New experiments</li>
</ul>

<h2>Step 6: Measure and Optimize</h2>
<p>Track these key KPIs:</p>
<ul>
  <li>Web traffic</li>
  <li>Conversion rate</li>
  <li>Customer acquisition cost (CAC)</li>
  <li>Return on investment (ROI)</li>
  <li>Social media engagement</li>
</ul>

<h2>Recommended Tools</h2>
<ul>
  <li>Google Analytics for analysis</li>
  <li>Hootsuite for social media</li>
  <li>Mailchimp for email marketing</li>
  <li>SEMrush for SEO</li>
</ul>

<h2>Conclusion</h2>
<p>An effective digital marketing strategy is a continuous process of learning and optimization. Start small, measure, and adjust regularly.</p>`
    },
    type: 'tutoriel',
    category: 'marketing',
    tags: ['marketing digital', 'stratégie', 'tutoriel', 'SEO', 'réseaux sociaux'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    metaTitle: {
      fr: "Stratégie Marketing Digital | VitalCHECK",
      en: "Digital Marketing Strategy | VitalCHECK"
    },
    metaDescription: {
      fr: "Guide complet pour développer une stratégie marketing digital performante en 6 étapes avec outils et KPIs.",
      en: "Complete guide to develop a high-performing digital marketing strategy in 6 steps with tools and KPIs."
    }
  },
  {
    title: {
      fr: "Optimisation des Processus : 5 Méthodes Lean pour PME",
      en: "Process Optimization: 5 Lean Methods for SMEs"
    },
    excerpt: {
      fr: "Comment appliquer les principes Lean pour éliminer les gaspillages et améliorer l'efficacité opérationnelle.",
      en: "How to apply Lean principles to eliminate waste and improve operational efficiency."
    },
    content: {
      fr: `<h2>Qu'est-ce que le Lean Management ?</h2>
<p>Le Lean est une philosophie de gestion visant à maximiser la valeur pour le client tout en minimisant les gaspillages. Voici 5 méthodes adaptées aux PME.</p>

<h2>1. Les 5S : Organiser l'espace de travail</h2>
<p>Méthode japonaise pour optimiser l'environnement de travail :</p>
<ul>
  <li><strong>Seiri (Trier)</strong> : Éliminer l'inutile</li>
  <li><strong>Seiton (Ranger)</strong> : Organiser efficacement</li>
  <li><strong>Seiso (Nettoyer)</strong> : Maintenir la propreté</li>
  <li><strong>Seiketsu (Standardiser)</strong> : Créer des standards</li>
  <li><strong>Shitsuke (Respecter)</strong> : Pérenniser les bonnes pratiques</li>
</ul>

<h2>2. Le Kaizen : L'amélioration continue</h2>
<p>Principes clés :</p>
<ul>
  <li>Petites améliorations quotidiennes</li>
  <li>Implication de tous les employés</li>
  <li>Cycles PDCA (Plan-Do-Check-Act)</li>
  <li>Focus sur les processus, pas les personnes</li>
</ul>

<h2>3. La Value Stream Mapping (VSM)</h2>
<p>Cartographiez vos flux pour identifier :</p>
<ul>
  <li>Les activités à valeur ajoutée</li>
  <li>Les gaspillages (temps d'attente, surproduction, etc.)</li>
  <li>Les opportunités d'amélioration</li>
</ul>

<h2>4. Le Kanban : Gérer le flux de travail</h2>
<p>Visualisez votre travail avec des tableaux Kanban :</p>
<ul>
  <li>Limitez le travail en cours (WIP)</li>
  <li>Identifiez les goulots d'étranglement</li>
  <li>Améliorez la prévisibilité</li>
</ul>

<h2>5. Le Poka-Yoke : Détrompeurs anti-erreur</h2>
<p>Mettez en place des systèmes pour prévenir les erreurs :</p>
<ul>
  <li>Checklist de contrôle qualité</li>
  <li>Alertes automatiques</li>
  <li>Guides visuels</li>
  <li>Validation en deux étapes</li>
</ul>

<h2>Résultats attendus</h2>
<p>En appliquant ces méthodes, les PME observent généralement :</p>
<ul>
  <li>📈 +30% de productivité</li>
  <li>📉 -40% de défauts</li>
  <li>⏱️ -50% de délais</li>
  <li>💰 -25% de coûts opérationnels</li>
</ul>

<h2>Par où commencer ?</h2>
<p>Démarrez avec les 5S dans une zone pilote, mesurez les résultats, puis étendez progressivement aux autres domaines.</p>`,
      en: `<h2>What is Lean Management?</h2>
<p>Lean is a management philosophy aimed at maximizing customer value while minimizing waste. Here are 5 methods adapted for SMEs.</p>

<h2>1. The 5S: Organize the Workspace</h2>
<p>Japanese method to optimize work environment:</p>
<ul>
  <li><strong>Seiri (Sort)</strong>: Eliminate the unnecessary</li>
  <li><strong>Seiton (Set in order)</strong>: Organize efficiently</li>
  <li><strong>Seiso (Shine)</strong>: Maintain cleanliness</li>
  <li><strong>Seiketsu (Standardize)</strong>: Create standards</li>
  <li><strong>Shitsuke (Sustain)</strong>: Maintain good practices</li>
</ul>

<h2>2. Kaizen: Continuous Improvement</h2>
<p>Key principles:</p>
<ul>
  <li>Small daily improvements</li>
  <li>Involvement of all employees</li>
  <li>PDCA cycles (Plan-Do-Check-Act)</li>
  <li>Focus on processes, not people</li>
</ul>

<h2>3. Value Stream Mapping (VSM)</h2>
<p>Map your flows to identify:</p>
<ul>
  <li>Value-added activities</li>
  <li>Waste (waiting time, overproduction, etc.)</li>
  <li>Improvement opportunities</li>
</ul>

<h2>4. Kanban: Manage Workflow</h2>
<p>Visualize your work with Kanban boards:</p>
<ul>
  <li>Limit work in progress (WIP)</li>
  <li>Identify bottlenecks</li>
  <li>Improve predictability</li>
</ul>

<h2>5. Poka-Yoke: Error-Proofing</h2>
<p>Implement systems to prevent errors:</p>
<ul>
  <li>Quality control checklists</li>
  <li>Automatic alerts</li>
  <li>Visual guides</li>
  <li>Two-step validation</li>
</ul>

<h2>Expected Results</h2>
<p>By applying these methods, SMEs typically observe:</p>
<ul>
  <li>📈 +30% productivity</li>
  <li>📉 -40% defects</li>
  <li>⏱️ -50% lead times</li>
  <li>💰 -25% operational costs</li>
</ul>

<h2>Where to Start?</h2>
<p>Begin with 5S in a pilot area, measure results, then gradually expand to other areas.</p>`
    },
    type: 'article',
    category: 'operations',
    tags: ['lean', 'processus', 'optimisation', 'efficacité', 'kaizen'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    metaTitle: {
      fr: "5 Méthodes Lean Optimisation | VitalCHECK",
      en: "5 Lean Optimization Methods | VitalCHECK"
    },
    metaDescription: {
      fr: "Découvrez comment appliquer les principes Lean (5S, Kaizen, VSM) pour améliorer l'efficacité de votre PME.",
      en: "Discover how to apply Lean principles (5S, Kaizen, VSM) to improve your SME's efficiency."
    }
  },
  {
    title: {
      fr: "Gouvernance d'Entreprise : Structurer pour Mieux Grandir",
      en: "Corporate Governance: Structure for Better Growth"
    },
    excerpt: {
      fr: "Les fondamentaux d'une gouvernance solide pour préparer votre PME à la croissance et attirer les investisseurs.",
      en: "The fundamentals of solid governance to prepare your SME for growth and attract investors."
    },
    content: {
      fr: `<h2>Pourquoi la gouvernance est cruciale ?</h2>
<p>Une bonne gouvernance n'est pas réservée aux grandes entreprises. Pour une PME en croissance, elle est essentielle pour structurer la prise de décision et préparer l'avenir.</p>

<h2>Les 4 piliers d'une gouvernance efficace</h2>

<h3>1. Structure organisationnelle claire</h3>
<p>Définissez précisément :</p>
<ul>
  <li>Les rôles et responsabilités de chacun</li>
  <li>Les niveaux de décision</li>
  <li>Les processus d'escalade</li>
  <li>L'organigramme fonctionnel</li>
</ul>

<h3>2. Processus de prise de décision</h3>
<p>Établissez des règles claires :</p>
<ul>
  <li>Qui décide quoi et comment ?</li>
  <li>Niveaux d'approbation selon les montants</li>
  <li>Fréquence des comités de direction</li>
  <li>Documentation des décisions stratégiques</li>
</ul>

<h3>3. Gestion des risques</h3>
<p>Mettez en place un cadre de gestion des risques :</p>
<ul>
  <li>Identification des risques majeurs</li>
  <li>Évaluation (probabilité × impact)</li>
  <li>Plans d'atténuation</li>
  <li>Revue trimestrielle</li>
</ul>

<h3>4. Transparence et reporting</h3>
<p>Instaurez une culture de transparence :</p>
<ul>
  <li>Tableaux de bord mensuels</li>
  <li>Réunions régulières d'information</li>
  <li>Communication claire des objectifs</li>
  <li>Feedback bidirectionnel</li>
</ul>

<h2>Créer un comité consultatif</h2>
<p>Pour les PME, un comité consultatif peut apporter :</p>
<ul>
  <li>📊 Expertise externe</li>
  <li>🎯 Vision stratégique</li>
  <li>🤝 Réseau professionnel</li>
  <li>✅ Crédibilité auprès des investisseurs</li>
</ul>

<h2>Documents essentiels</h2>
<p>Mettez en place ces documents clés :</p>
<ol>
  <li>Pacte d'actionnaires</li>
  <li>Règlement intérieur</li>
  <li>Politique de délégation</li>
  <li>Code de conduite</li>
  <li>Politique de gestion des conflits d'intérêts</li>
</ol>

<h2>Les bénéfices mesurables</h2>
<p>Les entreprises avec une bonne gouvernance observent :</p>
<ul>
  <li>🚀 Croissance plus rapide et durable</li>
  <li>💼 Facilité accrue pour lever des fonds</li>
  <li>👥 Meilleure rétention des talents clés</li>
  <li>⚖️ Réduction des conflits internes</li>
  <li>📈 Valorisation supérieure en cas de cession</li>
</ul>

<h2>Par où commencer ?</h2>
<p>Commencez par un audit de gouvernance pour identifier les lacunes, puis priorisez les actions selon votre stade de développement et vos objectifs de croissance.</p>`,
      en: `<h2>Why is Governance Crucial?</h2>
<p>Good governance isn't reserved for large companies. For a growing SME, it's essential to structure decision-making and prepare for the future.</p>

<h2>The 4 Pillars of Effective Governance</h2>

<h3>1. Clear Organizational Structure</h3>
<p>Define precisely:</p>
<ul>
  <li>Everyone's roles and responsibilities</li>
  <li>Decision-making levels</li>
  <li>Escalation processes</li>
  <li>Functional organization chart</li>
</ul>

<h3>2. Decision-Making Process</h3>
<p>Establish clear rules:</p>
<ul>
  <li>Who decides what and how?</li>
  <li>Approval levels by amount</li>
  <li>Management committee frequency</li>
  <li>Documentation of strategic decisions</li>
</ul>

<h3>3. Risk Management</h3>
<p>Implement a risk management framework:</p>
<ul>
  <li>Identification of major risks</li>
  <li>Assessment (probability × impact)</li>
  <li>Mitigation plans</li>
  <li>Quarterly review</li>
</ul>

<h3>4. Transparency and Reporting</h3>
<p>Establish a culture of transparency:</p>
<ul>
  <li>Monthly dashboards</li>
  <li>Regular information meetings</li>
  <li>Clear communication of objectives</li>
  <li>Bidirectional feedback</li>
</ul>

<h2>Create an Advisory Board</h2>
<p>For SMEs, an advisory board can provide:</p>
<ul>
  <li>📊 External expertise</li>
  <li>🎯 Strategic vision</li>
  <li>🤝 Professional network</li>
  <li>✅ Credibility with investors</li>
</ul>

<h2>Essential Documents</h2>
<p>Implement these key documents:</p>
<ol>
  <li>Shareholders' agreement</li>
  <li>Internal regulations</li>
  <li>Delegation policy</li>
  <li>Code of conduct</li>
  <li>Conflict of interest policy</li>
</ol>

<h2>Measurable Benefits</h2>
<p>Companies with good governance observe:</p>
<ul>
  <li>🚀 Faster and sustainable growth</li>
  <li>💼 Increased ease in raising funds</li>
  <li>👥 Better retention of key talents</li>
  <li>⚖️ Reduction in internal conflicts</li>
  <li>📈 Higher valuation in case of sale</li>
</ul>

<h2>Where to Start?</h2>
<p>Begin with a governance audit to identify gaps, then prioritize actions based on your development stage and growth objectives.</p>`
    },
    type: 'article',
    category: 'gouvernance',
    tags: ['gouvernance', 'stratégie', 'croissance', 'investissement', 'structure'],
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    metaTitle: {
      fr: "Gouvernance PME Croissance | VitalCHECK",
      en: "SME Governance Growth | VitalCHECK"
    },
    metaDescription: {
      fr: "Guide complet pour structurer la gouvernance de votre PME et préparer la croissance. 4 piliers essentiels expliqués.",
      en: "Complete guide to structure your SME's governance and prepare for growth. 4 essential pillars explained."
    }
  }
];

async function createBlogs() {
  try {
    console.log('🚀 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VitalCHECK-health-check');
    console.log('✅ Connecté à MongoDB');

    // Trouver un admin pour l'auteur
    const admin = await Admin.findOne();
    if (!admin) {
      console.error('❌ Aucun admin trouvé. Veuillez d\'abord créer un admin.');
      process.exit(1);
    }

    console.log(`📝 Création de ${sampleBlogs.length} blogs...`);

    for (const blogData of sampleBlogs) {
      // Générer les slugs
      const slug = {
        fr: blogData.title.fr
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-'),
        en: blogData.title.en
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-')
      };

      const blog = new Blog({
        ...blogData,
        slug,
        author: admin._id,
        publishedAt: new Date()
      });

      await blog.save();
      console.log(`✅ Blog créé : ${blogData.title.fr}`);
    }

    console.log('\n🎉 Tous les blogs ont été créés avec succès !');
    console.log(`📊 Total : ${sampleBlogs.length} blogs`);
    
    // Afficher un résumé
    const stats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Répartition par catégorie :');
    stats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count} blog(s)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des blogs:', error);
    process.exit(1);
  }
}

createBlogs();
