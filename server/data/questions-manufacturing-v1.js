// Questionnaire sectoriel Manufacturing — PME industrielle / unité de transformation (Sénégal / Afrique de l'Ouest)
// Format identique aux autres questionnaires sectoriels : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// Contenu : VitalCHECK_Manufacturing_Questions_Bilingue.md — Octobre 2026

const fr = {
  pillars: [
    {
      id: "pilotage",
      name: "Pilotage & Stratégie",
      questions: [
        {
          id: "manufacturing_pilotage_1",
          text: "Planifiez-vous votre production en fonction de la demande (et non au coup par coup) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plan de production relié aux prévisions de vente" },
            { value: 2, shortLabel: "Partiellement", label: "Planification approximative" },
            { value: 0, shortLabel: "Non", label: "Production en mode réactif, sans plan", recommendation: "Établissez un plan de production simple basé sur vos commandes et prévisions pour éviter le mode réactif." },
          ],
        },
        {
          id: "manufacturing_pilotage_2",
          text: "Suivez-vous des indicateurs de performance (rendement, taux de rejet, volumes) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Indicateurs suivis régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques indicateurs, suivi irrégulier" },
            { value: 0, shortLabel: "Non", label: "Aucun indicateur suivi", recommendation: "Choisissez 2 ou 3 indicateurs simples (volume produit, rejets) et suivez-les chaque semaine." },
          ],
        },
        {
          id: "manufacturing_pilotage_3",
          text: "Savez-vous quel produit ou quelle ligne vous est le plus rentable ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Rentabilité comparée connue par produit" },
            { value: 2, shortLabel: "Partiellement", label: "Idée approximative" },
            { value: 0, shortLabel: "Non", label: "Rentabilité par produit inconnue", recommendation: "Comparez, même grossièrement, ce que chaque produit vous rapporte par rapport à ce qu'il coûte à produire." },
          ],
        },
        {
          id: "manufacturing_pilotage_4",
          text: "Avez-vous des objectifs de production et de vente pour l'année ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Objectifs définis et suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Objectifs vagues" },
            { value: 0, shortLabel: "Non", label: "Aucun objectif", recommendation: "Fixez un objectif simple de production et de vente pour les prochains mois et suivez-le." },
          ],
        },
        {
          id: "manufacturing_pilotage_5",
          text: "Avez-vous un plan de développement ou d'investissement sur les 12 à 24 prochains mois ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plan documenté (capacité, équipements, marchés)" },
            { value: 2, shortLabel: "Partiellement", label: "Idées de développement informelles" },
            { value: 0, shortLabel: "Non", label: "Aucun plan de développement", recommendation: "Définissez 2 ou 3 priorités de développement (capacité, nouveaux produits, équipements) pour les prochains mois." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Tenez un carnet de production pour suivre vos volumes et vos rejets.",
          "Notez vos commandes à venir pour anticiper votre production.",
        ],
        mid: [
          "Reliez votre production à vos prévisions de vente.",
          "Comparez la rentabilité de vos différents produits.",
        ],
        high: [
          "Mettez en place un tableau de bord de production (rendement, rejets, volumes).",
          "Élaborez un plan d'investissement pour monter en capacité.",
        ],
      },
    },
    {
      id: "production",
      name: "Production, Qualité & Énergie",
      questions: [
        {
          id: "manufacturing_production_1",
          text: "Vos machines et vos capacités sont-elles bien utilisées (peu d'arrêts) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Capacités bien utilisées, arrêts limités" },
            { value: 2, shortLabel: "Partiellement", label: "Sous-utilisation ou arrêts fréquents" },
            { value: 0, shortLabel: "Non", label: "Capacités très sous-utilisées (pannes, coupures, ruptures)", recommendation: "Identifiez les principales causes d'arrêt (pannes, coupures, ruptures de matières) et traitez la plus fréquente." },
          ],
        },
        {
          id: "manufacturing_production_2",
          text: "Avez-vous un contrôle qualité sur vos produits (au-delà de la simple inspection visuelle) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Contrôle qualité en place (procédures, tests)" },
            { value: 2, shortLabel: "Partiellement", label: "Contrôle limité à l'inspection visuelle" },
            { value: 0, shortLabel: "Non", label: "Aucun contrôle qualité", recommendation: "Mettez en place une vérification simple à chaque étape clé pour détecter les défauts avant l'expédition." },
          ],
        },
        {
          id: "manufacturing_production_3",
          text: "Maîtrisez-vous vos rebuts et pertes de matières en production ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Rebuts suivis et limités" },
            { value: 2, shortLabel: "Partiellement", label: "Rebuts constatés mais non mesurés" },
            { value: 0, shortLabel: "Non", label: "Rebuts importants non maîtrisés", recommendation: "Mesurez vos rebuts pendant deux semaines pour en identifier la cause principale et la réduire." },
          ],
        },
        {
          id: "manufacturing_production_4",
          text: "Mesurez-vous et cherchez-vous à maîtriser vos coûts d'énergie (électricité, carburant) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Consommation d'énergie suivie, efforts d'efficacité" },
            { value: 2, shortLabel: "Partiellement", label: "Coûts connus mais non maîtrisés" },
            { value: 0, shortLabel: "Non", label: "Énergie subie, coûts non mesurés", recommendation: "Relevez votre consommation d'énergie et repérez les postes les plus coûteux (machines, groupe électrogène)." },
          ],
        },
        {
          id: "manufacturing_production_5",
          text: "Vos procédés de production sont-ils documentés (modes opératoires) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Modes opératoires écrits et suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques documents, incomplets" },
            { value: 0, shortLabel: "Non", label: "Tout repose sur le savoir-faire de quelques personnes", recommendation: "Rédigez le mode opératoire de votre procédé le plus critique pour ne pas dépendre d'une seule personne." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez chaque arrêt de production et sa cause.",
          "Relevez votre consommation d'énergie chaque mois.",
        ],
        mid: [
          "Mettez en place un contrôle qualité à chaque étape clé.",
          "Mesurez vos rebuts pour en réduire la cause principale.",
        ],
        high: [
          "Documentez vos modes opératoires pour stabiliser la qualité.",
          "Lancez une démarche d'efficacité énergétique sur vos machines.",
        ],
      },
    },
    {
      id: "maintenance",
      name: "Matières premières & Maintenance",
      questions: [
        {
          id: "manufacturing_maintenance_1",
          text: "Sécurisez-vous votre approvisionnement en matières premières (anticipation, stock) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Approvisionnement anticipé et sécurisé" },
            { value: 2, shortLabel: "Partiellement", label: "Approvisionnement irrégulier" },
            { value: 0, shortLabel: "Non", label: "Ruptures fréquentes de matières", recommendation: "Fixez un niveau de stock minimum pour vos matières clés et commandez avant d'atteindre la rupture." },
          ],
        },
        {
          id: "manufacturing_maintenance_2",
          text: "Travaillez-vous avec plusieurs fournisseurs de matières plutôt qu'un seul ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plusieurs fournisseurs, dépendance limitée" },
            { value: 2, shortLabel: "Partiellement", label: "Un fournisseur principal, quelques alternatives" },
            { value: 0, shortLabel: "Non", label: "Dépendance à un seul fournisseur", recommendation: "Identifiez un fournisseur alternatif pour vos matières clés afin de sécuriser votre production." },
          ],
        },
        {
          id: "manufacturing_maintenance_3",
          text: "Gérez-vous vos stocks de matières pour éviter ruptures et pertes ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Stocks suivis, pertes limitées" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi approximatif" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi, ruptures ou pertes fréquentes", recommendation: "Tenez un suivi simple de vos entrées et sorties de matières pour éviter ruptures et péremption." },
          ],
        },
        {
          id: "manufacturing_maintenance_4",
          text: "Entretenez-vous vos équipements de façon préventive (pas seulement après la panne) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Maintenance préventive planifiée" },
            { value: 2, shortLabel: "Partiellement", label: "Entretien occasionnel" },
            { value: 0, shortLabel: "Non", label: "Maintenance uniquement curative (après la panne)", recommendation: "Mettez en place un entretien préventif simple de vos machines clés pour éviter les pannes en pleine production." },
          ],
        },
        {
          id: "manufacturing_maintenance_5",
          text: "Êtes-vous assuré contre les principaux risques de votre activité (personnel, machines/équipements, bâtiments, véhicules) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Couverture d'assurance en place sur les principaux risques" },
            { value: 2, shortLabel: "Partiellement", label: "Assurance partielle (un ou deux risques couverts)" },
            { value: 0, shortLabel: "Non", label: "Aucune assurance : un accident peut arrêter l'activité", recommendation: "Protégez la pérennité de votre unité : souscrivez au moins une assurance de base couvrant vos risques majeurs (accident du personnel, incendie/dégât du bâtiment, panne ou casse d'une machine clé, véhicules)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Fixez un stock minimum pour vos matières clés.",
          "Notez chaque panne de machine pour anticiper l'entretien.",
        ],
        mid: [
          "Identifiez un fournisseur alternatif pour vos matières clés.",
          "Gardez en stock les pièces d'usure de vos machines critiques.",
        ],
        high: [
          "Mettez en place un calendrier de maintenance préventive.",
          "Assurez vos risques majeurs (personnel, machines, bâtiments, véhicules) pour la pérennité de l'unité.",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance & Coût de revient",
      questions: [
        {
          id: "manufacturing_finance_1",
          text: "Connaissez-vous votre coût de revient par produit (matières, main-d'œuvre, énergie) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Coût de revient connu et suivi par produit" },
            { value: 2, shortLabel: "Partiellement", label: "Estimation approximative" },
            { value: 0, shortLabel: "Non", label: "Coût de revient inconnu", recommendation: "Additionnez matières, main-d'œuvre et énergie pour un produit afin de connaître son vrai coût de revient." },
          ],
        },
        {
          id: "manufacturing_finance_2",
          text: "Intégrez-vous l'amortissement de vos équipements dans vos coûts ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Amortissement pris en compte dans le coût de revient" },
            { value: 2, shortLabel: "Partiellement", label: "Pris en compte de façon approximative" },
            { value: 0, shortLabel: "Non", label: "Amortissement ignoré", recommendation: "Intégrez une part du coût de vos machines dans le prix de vos produits pour pouvoir les renouveler." },
          ],
        },
        {
          id: "manufacturing_finance_3",
          text: "Tenez-vous une comptabilité qui vous sert à piloter (pas seulement pour le fisc) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Comptabilité de pilotage, marges suivies" },
            { value: 2, shortLabel: "Partiellement", label: "Comptabilité tenue mais peu exploitée" },
            { value: 0, shortLabel: "Non", label: "Comptabilité absente ou informelle", recommendation: "Tenez un suivi régulier de vos recettes, coûts et marges pour piloter votre activité, pas seulement déclarer." },
          ],
        },
        {
          id: "manufacturing_finance_4",
          text: "Gérez-vous votre trésorerie et séparez-vous finances de l'unité et argent personnel ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Trésorerie suivie, séparation stricte" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier, séparation partielle" },
            { value: 0, shortLabel: "Non", label: "Trésorerie subie, finances mélangées", recommendation: "Ouvrez un compte dédié à l'unité et suivez chaque semaine votre trésorerie et vos échéances." },
          ],
        },
        {
          id: "manufacturing_finance_5",
          text: "Votre gestion vous permet-elle de présenter des documents à une banque pour financer vos équipements ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Documents de gestion prêts et présentables" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques documents, incomplets" },
            { value: 0, shortLabel: "Non", label: "Aucun document exploitable par une banque", recommendation: "Rassemblez et conservez vos comptes, factures et coûts : c'est ce qu'une banque exige pour financer vos équipements." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Enregistrez vos recettes et vos dépenses chaque jour.",
          "Ouvrez un compte séparé pour l'unité.",
        ],
        mid: [
          "Calculez le coût de revient de vos principaux produits.",
          "Intégrez l'amortissement de vos machines dans vos coûts.",
        ],
        high: [
          "Structurez votre comptabilité pour financer vos équipements.",
          "Pilotez vos prix à partir de votre coût de revient réel.",
        ],
      },
    },
    {
      id: "organisation",
      name: "Organisation, Main-d'œuvre & Compétences",
      questions: [
        {
          id: "manufacturing_organisation_1",
          text: "Les rôles et responsabilités sont-ils clairement définis dans votre atelier ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Rôles définis (production, qualité, maintenance)" },
            { value: 2, shortLabel: "Partiellement", label: "Rôles partiellement définis" },
            { value: 0, shortLabel: "Non", label: "Confusion des responsabilités", recommendation: "Définissez qui est responsable de la production, de la qualité et de la maintenance." },
          ],
        },
        {
          id: "manufacturing_organisation_2",
          text: "Disposez-vous d'une main-d'œuvre techniquement qualifiée pour vos machines et procédés ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Main-d'œuvre qualifiée et stable" },
            { value: 2, shortLabel: "Partiellement", label: "Compétences limitées, formation « sur le tas »" },
            { value: 0, shortLabel: "Non", label: "Manque chronique de compétences techniques", recommendation: "Identifiez la compétence technique qui vous manque le plus et formez ou recrutez pour la combler." },
          ],
        },
        {
          id: "manufacturing_organisation_3",
          text: "Investissez-vous dans la formation de votre personnel (sécurité, procédés, qualité) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Formation régulière du personnel" },
            { value: 2, shortLabel: "Partiellement", label: "Formation ponctuelle" },
            { value: 0, shortLabel: "Non", label: "Aucune formation", recommendation: "Organisez une courte formation sur votre point faible le plus coûteux (qualité, sécurité, conduite de machine)." },
          ],
        },
        {
          id: "manufacturing_organisation_4",
          text: "Prenez-vous en compte la sécurité au travail dans votre atelier ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Règles de sécurité appliquées, équipements fournis" },
            { value: 2, shortLabel: "Partiellement", label: "Sécurité partielle" },
            { value: 0, shortLabel: "Non", label: "Aucune mesure de sécurité", recommendation: "Fournissez les équipements de protection de base et affichez les règles de sécurité près des machines." },
          ],
        },
        {
          id: "manufacturing_organisation_5",
          text: "Votre atelier peut-il continuer à tourner sans votre présence permanente ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Continuité assurée, délégation en place" },
            { value: 2, shortLabel: "Partiellement", label: "Dépend fortement de vous" },
            { value: 0, shortLabel: "Non", label: "Tout s'arrête sans vous", recommendation: "Formez au moins une personne de confiance capable de faire tourner l'atelier en votre absence." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Définissez qui fait quoi dans l'atelier (production, qualité, maintenance).",
          "Fournissez les équipements de sécurité de base.",
        ],
        mid: [
          "Formez votre équipe sur votre point faible le plus coûteux.",
          "Identifiez et comblez votre principal manque de compétence technique.",
        ],
        high: [
          "Organisez la délégation pour que l'atelier tourne sans vous.",
          "Développez les compétences techniques pour monter en gamme.",
        ],
      },
    },
  ],
};

const en = {
  pillars: [
    {
      id: "pilotage",
      name: "Management & Strategy",
      questions: [
        {
          id: "manufacturing_pilotage_1",
          text: "Do you plan your production according to demand (rather than ad hoc)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Production plan linked to sales forecasts" },
            { value: 2, shortLabel: "Partially", label: "Rough planning" },
            { value: 0, shortLabel: "No", label: "Reactive production, no plan", recommendation: "Set up a simple production plan based on your orders and forecasts to avoid reactive mode." },
          ],
        },
        {
          id: "manufacturing_pilotage_2",
          text: "Do you track performance indicators (yield, reject rate, volumes)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Indicators tracked regularly" },
            { value: 2, shortLabel: "Partially", label: "A few indicators, irregular tracking" },
            { value: 0, shortLabel: "No", label: "No indicators tracked", recommendation: "Choose 2 or 3 simple indicators (output volume, rejects) and track them every week." },
          ],
        },
        {
          id: "manufacturing_pilotage_3",
          text: "Do you know which product or line is most profitable for you?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Comparative profitability known by product" },
            { value: 2, shortLabel: "Partially", label: "Rough idea" },
            { value: 0, shortLabel: "No", label: "Profitability by product unknown", recommendation: "Compare, even roughly, what each product earns you against what it costs to make." },
          ],
        },
        {
          id: "manufacturing_pilotage_4",
          text: "Do you have production and sales targets for the year?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Targets defined and tracked" },
            { value: 2, shortLabel: "Partially", label: "Vague targets" },
            { value: 0, shortLabel: "No", label: "No targets", recommendation: "Set a simple production and sales target for the coming months and track it." },
          ],
        },
        {
          id: "manufacturing_pilotage_5",
          text: "Do you have a development or investment plan for the next 12 to 24 months?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Documented plan (capacity, equipment, markets)" },
            { value: 2, shortLabel: "Partially", label: "Informal development ideas" },
            { value: 0, shortLabel: "No", label: "No development plan", recommendation: "Define 2 or 3 development priorities (capacity, new products, equipment) for the coming months." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Keep a production logbook to track your volumes and rejects.",
          "Note your upcoming orders to anticipate your production.",
        ],
        mid: [
          "Link your production to your sales forecasts.",
          "Compare the profitability of your different products.",
        ],
        high: [
          "Set up a production dashboard (yield, rejects, volumes).",
          "Build an investment plan to scale up capacity.",
        ],
      },
    },
    {
      id: "production",
      name: "Production, Quality & Energy",
      questions: [
        {
          id: "manufacturing_production_1",
          text: "Are your machines and capacity well used (few stoppages)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Capacity well used, stoppages limited" },
            { value: 2, shortLabel: "Partially", label: "Under-use or frequent stoppages" },
            { value: 0, shortLabel: "No", label: "Capacity heavily under-used (breakdowns, outages, shortages)", recommendation: "Identify the main causes of stoppages (breakdowns, outages, material shortages) and tackle the most frequent one." },
          ],
        },
        {
          id: "manufacturing_production_2",
          text: "Do you have quality control on your products (beyond simple visual inspection)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Quality control in place (procedures, tests)" },
            { value: 2, shortLabel: "Partially", label: "Control limited to visual inspection" },
            { value: 0, shortLabel: "No", label: "No quality control", recommendation: "Set up a simple check at each key stage to catch defects before shipping." },
          ],
        },
        {
          id: "manufacturing_production_3",
          text: "Do you keep your scrap and material losses under control in production?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Scrap tracked and limited" },
            { value: 2, shortLabel: "Partially", label: "Scrap noticed but not measured" },
            { value: 0, shortLabel: "No", label: "Significant, uncontrolled scrap", recommendation: "Measure your scrap for two weeks to identify the main cause and reduce it." },
          ],
        },
        {
          id: "manufacturing_production_4",
          text: "Do you measure and try to control your energy costs (electricity, fuel)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Energy use tracked, efficiency efforts made" },
            { value: 2, shortLabel: "Partially", label: "Costs known but not managed" },
            { value: 0, shortLabel: "No", label: "Energy absorbed blindly, costs not measured", recommendation: "Record your energy use and identify the most expensive items (machines, generator)." },
          ],
        },
        {
          id: "manufacturing_production_5",
          text: "Are your production processes documented (operating procedures)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Written operating procedures, followed" },
            { value: 2, shortLabel: "Partially", label: "A few documents, incomplete" },
            { value: 0, shortLabel: "No", label: "Everything relies on a few people's know-how", recommendation: "Write the operating procedure for your most critical process so you don't depend on one person." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Log each production stoppage and its cause.",
          "Record your energy consumption each month.",
        ],
        mid: [
          "Set up a quality check at each key stage.",
          "Measure your scrap to reduce its main cause.",
        ],
        high: [
          "Document your operating procedures to stabilize quality.",
          "Launch an energy-efficiency effort on your machines.",
        ],
      },
    },
    {
      id: "maintenance",
      name: "Raw Materials & Maintenance",
      questions: [
        {
          id: "manufacturing_maintenance_1",
          text: "Do you secure your raw material supply (anticipation, stock)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Supply anticipated and secured" },
            { value: 2, shortLabel: "Partially", label: "Irregular supply" },
            { value: 0, shortLabel: "No", label: "Frequent material shortages", recommendation: "Set a minimum stock level for your key materials and reorder before running out." },
          ],
        },
        {
          id: "manufacturing_maintenance_2",
          text: "Do you work with several material suppliers rather than just one?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Several suppliers, limited dependence" },
            { value: 2, shortLabel: "Partially", label: "One main supplier, a few alternatives" },
            { value: 0, shortLabel: "No", label: "Dependence on a single supplier", recommendation: "Find an alternative supplier for your key materials to secure your production." },
          ],
        },
        {
          id: "manufacturing_maintenance_3",
          text: "Do you manage your material stock to avoid shortages and losses?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Stock tracked, losses limited" },
            { value: 2, shortLabel: "Partially", label: "Rough tracking" },
            { value: 0, shortLabel: "No", label: "No tracking, frequent shortages or losses", recommendation: "Keep simple tracking of your material inflows and outflows to avoid shortages and expiry." },
          ],
        },
        {
          id: "manufacturing_maintenance_4",
          text: "Do you maintain your equipment preventively (not just after a breakdown)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Preventive maintenance planned" },
            { value: 2, shortLabel: "Partially", label: "Occasional maintenance" },
            { value: 0, shortLabel: "No", label: "Maintenance only curative (after breakdown)", recommendation: "Set up simple preventive maintenance of your key machines to avoid breakdowns mid-production." },
          ],
        },
        {
          id: "manufacturing_maintenance_5",
          text: "Are you insured against your main business risks (staff, machines/equipment, buildings, vehicles)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Insurance coverage in place for the main risks" },
            { value: 2, shortLabel: "Partially", label: "Partial insurance (one or two risks covered)" },
            { value: 0, shortLabel: "No", label: "No insurance: a single accident can halt the business", recommendation: "Protect your business continuity: take out at least basic insurance covering your major risks (staff accident, fire/building damage, breakdown or loss of a key machine, vehicles)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Set a minimum stock for your key materials.",
          "Log each machine breakdown to anticipate maintenance.",
        ],
        mid: [
          "Find an alternative supplier for your key materials.",
          "Keep the wear parts of your critical machines in stock.",
        ],
        high: [
          "Set up a preventive maintenance schedule.",
          "Insure your major risks (staff, machines, buildings, vehicles) for business continuity.",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance & Unit Cost",
      questions: [
        {
          id: "manufacturing_finance_1",
          text: "Do you know your unit cost per product (materials, labor, energy)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Unit cost known and tracked per product" },
            { value: 2, shortLabel: "Partially", label: "Rough estimate" },
            { value: 0, shortLabel: "No", label: "Unit cost unknown", recommendation: "Add up materials, labor and energy for one product to know its true unit cost." },
          ],
        },
        {
          id: "manufacturing_finance_2",
          text: "Do you factor equipment depreciation into your costs?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Depreciation included in unit cost" },
            { value: 2, shortLabel: "Partially", label: "Roughly accounted for" },
            { value: 0, shortLabel: "No", label: "Depreciation ignored", recommendation: "Build a share of your machine cost into your product prices so you can renew them." },
          ],
        },
        {
          id: "manufacturing_finance_3",
          text: "Do you keep accounts that help you steer the business (not just for tax)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Management accounting, margins tracked" },
            { value: 2, shortLabel: "Partially", label: "Accounts kept but little used" },
            { value: 0, shortLabel: "No", label: "Accounts absent or informal", recommendation: "Keep regular tracking of your income, costs and margins to steer the business, not just to file taxes." },
          ],
        },
        {
          id: "manufacturing_finance_4",
          text: "Do you manage your cash flow and separate business finances from personal money?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash flow tracked, strict separation" },
            { value: 2, shortLabel: "Partially", label: "Irregular tracking, partial separation" },
            { value: 0, shortLabel: "No", label: "Cash flow out of control, finances mixed", recommendation: "Open a dedicated business account and track your cash and deadlines every week." },
          ],
        },
        {
          id: "manufacturing_finance_5",
          text: "Does your record-keeping let you present documents to a bank to finance your equipment?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Management documents ready and presentable" },
            { value: 2, shortLabel: "Partially", label: "Some documents, incomplete" },
            { value: 0, shortLabel: "No", label: "No documents usable by a bank", recommendation: "Gather and keep your accounts, invoices and costs: that's what a bank requires to finance your equipment." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record your income and expenses every day.",
          "Open a separate account for the business.",
        ],
        mid: [
          "Calculate the unit cost of your main products.",
          "Factor machine depreciation into your costs.",
        ],
        high: [
          "Structure your accounts to finance your equipment.",
          "Steer your prices from your real unit cost.",
        ],
      },
    },
    {
      id: "organisation",
      name: "Organization, Workforce & Skills",
      questions: [
        {
          id: "manufacturing_organisation_1",
          text: "Are roles and responsibilities clearly defined in your workshop?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Roles defined (production, quality, maintenance)" },
            { value: 2, shortLabel: "Partially", label: "Roles partly defined" },
            { value: 0, shortLabel: "No", label: "Unclear responsibilities", recommendation: "Define who is responsible for production, quality and maintenance." },
          ],
        },
        {
          id: "manufacturing_organisation_2",
          text: "Do you have technically skilled labor for your machines and processes?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Skilled, stable workforce" },
            { value: 2, shortLabel: "Partially", label: "Limited skills, on-the-job training" },
            { value: 0, shortLabel: "No", label: "Chronic shortage of technical skills", recommendation: "Identify the technical skill you lack most and train or hire to fill it." },
          ],
        },
        {
          id: "manufacturing_organisation_3",
          text: "Do you invest in training your staff (safety, processes, quality)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular staff training" },
            { value: 2, shortLabel: "Partially", label: "Occasional training" },
            { value: 0, shortLabel: "No", label: "No training", recommendation: "Run a short training session on your most costly weak point (quality, safety, machine operation)." },
          ],
        },
        {
          id: "manufacturing_organisation_4",
          text: "Do you address workplace safety in your workshop?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Safety rules applied, equipment provided" },
            { value: 2, shortLabel: "Partially", label: "Partial safety measures" },
            { value: 0, shortLabel: "No", label: "No safety measures", recommendation: "Provide basic protective equipment and post safety rules near the machines." },
          ],
        },
        {
          id: "manufacturing_organisation_5",
          text: "Can your workshop keep running without your constant presence?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Continuity ensured, delegation in place" },
            { value: 2, shortLabel: "Partially", label: "Depends heavily on you" },
            { value: 0, shortLabel: "No", label: "Everything stops without you", recommendation: "Train at least one trusted person able to run the workshop in your absence." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Define who does what in the workshop (production, quality, maintenance).",
          "Provide basic safety equipment.",
        ],
        mid: [
          "Train your team on your most costly weak point.",
          "Identify and fill your main technical skill gap.",
        ],
        high: [
          "Organize delegation so the workshop runs without you.",
          "Develop technical skills to move up in quality.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques Manufacturing
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Critique", en: "Critical" },
    interpretation: {
      fr: "Votre unité fait face à des risques importants qui menacent sa viabilité. Une action rapide est nécessaire pour structurer sa gestion.",
      en: "Your manufacturing business faces significant risks that threaten its viability. Immediate action is needed to structure its management.",
    },
  },
  {
    id: "vulnerable",
    min: 40,
    max: 59,
    color: "#f97316",
    label: { fr: "Vulnérable", en: "Vulnerable" },
    interpretation: {
      fr: "Votre unité fonctionne mais repose sur des bases fragiles. Plusieurs axes de gestion nécessitent une attention prioritaire.",
      en: "Your business is running but rests on fragile foundations. Several management areas require priority attention.",
    },
  },
  {
    id: "stable",
    min: 60,
    max: 79,
    color: "#eab308",
    label: { fr: "Stable", en: "Stable" },
    interpretation: {
      fr: "Votre unité a des bases solides. Quelques ajustements ciblés sécuriseront vos marges et votre production.",
      en: "Your business has solid foundations. A few targeted adjustments will secure your margins and production.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Prêt pour la croissance", en: "Growth-Ready" },
    interpretation: {
      fr: "Votre unité est bien structurée et prête à investir, à monter en capacité et à sécuriser son financement.",
      en: "Your business is well-structured and ready to invest, scale up capacity and secure financing.",
    },
  },
  {
    id: "haute_performance",
    min: 90,
    max: 100,
    color: "#6366f1",
    label: { fr: "Haute performance", en: "High Performance" },
    interpretation: {
      fr: "Votre unité affiche une excellente maturité de gestion sur l'ensemble des piliers clés. Continuez sur cette lancée !",
      en: "Your business shows excellent management maturity across all key pillars. Keep up the great work!",
    },
  },
];

module.exports = { fr, en, levels };
