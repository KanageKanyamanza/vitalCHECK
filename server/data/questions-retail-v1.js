// Questionnaire sectoriel Retail — Commerce de détail structuré (Sénégal / Afrique de l'Ouest)
// Format identique à questions-agri-v1.js : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// Contenu : VitalCHECK_Retail_Questions_Bilingue.md — Septembre 2026

const fr = {
  pillars: [
    {
      id: "pilotage",
      name: "Pilotage & Stratégie commerciale",
      questions: [
        {
          id: "retail_pilotage_1",
          text: "Connaissez-vous bien votre clientèle et adaptez-vous votre assortiment à ses besoins ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Assortiment choisi selon la clientèle et l'emplacement" },
            { value: 2, shortLabel: "Partiellement", label: "Assortiment en partie adapté, en partie par habitude" },
            { value: 0, shortLabel: "Non", label: "Assortiment constitué sans logique client", recommendation: "Observez ce que vos clients demandent le plus et ajustez votre assortiment en conséquence." },
          ],
        },
        {
          id: "retail_pilotage_2",
          text: "Avez-vous des objectifs de vente et suivez-vous vos résultats ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Objectifs définis et résultats suivis régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Objectifs vagues, suivi occasionnel" },
            { value: 0, shortLabel: "Non", label: "Aucun objectif ni suivi", recommendation: "Fixez un objectif de vente simple pour le mois prochain et comparez-le à vos résultats." },
          ],
        },
        {
          id: "retail_pilotage_3",
          text: "Votre positionnement (prix, offre) est-il réfléchi face à la concurrence proche ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Positionnement clair, différencié de la concurrence" },
            { value: 2, shortLabel: "Partiellement", label: "Prix alignés sur les voisins, sans vraie stratégie" },
            { value: 0, shortLabel: "Non", label: "Aucune réflexion sur la concurrence", recommendation: "Identifiez ce qui vous distingue des commerces voisins et mettez-le en avant." },
          ],
        },
        {
          id: "retail_pilotage_4",
          text: "Savez-vous quels produits ou familles vous rapportent le plus ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Produits les plus rentables identifiés et mis en avant" },
            { value: 2, shortLabel: "Partiellement", label: "Idée approximative, sans certitude" },
            { value: 0, shortLabel: "Non", label: "Contribution des produits inconnue", recommendation: "Repérez vos produits qui se vendent le plus et rapportent le plus, et donnez-leur la priorité." },
          ],
        },
        {
          id: "retail_pilotage_5",
          text: "Avez-vous un plan pour développer votre commerce sur les 12 prochains mois ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plan de développement documenté avec actions" },
            { value: 2, shortLabel: "Partiellement", label: "Idées de développement informelles" },
            { value: 0, shortLabel: "Non", label: "Aucun plan de développement", recommendation: "Définissez 2 ou 3 actions concrètes pour développer votre commerce cette année." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez chaque jour vos ventes pour repérer vos produits phares.",
          "Demandez à vos clients réguliers ce qu'ils aimeraient trouver chez vous.",
        ],
        mid: [
          "Analysez ce que proposent les commerces voisins pour mieux vous différencier.",
          "Fixez des objectifs de vente par mois et suivez-les.",
        ],
        high: [
          "Mettez en place un tableau de bord simple de vos ventes et de vos marges.",
          "Étudiez l'ouverture d'un nouveau point de vente ou d'un canal en ligne.",
        ],
      },
    },
    {
      id: "stocks",
      name: "Gestion des stocks",
      questions: [
        {
          id: "retail_stocks_1",
          text: "Suivez-vous vos niveaux de stock pour éviter les ruptures sur vos produits qui se vendent ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Niveaux suivis, réapprovisionnement anticipé" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi approximatif, ruptures occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi, ruptures fréquentes", recommendation: "Repérez vos produits qui se vendent vite et fixez un seuil pour les recommander à temps." },
          ],
        },
        {
          id: "retail_stocks_2",
          text: "Évitez-vous d'immobiliser votre argent dans des produits qui ne se vendent pas (invendus) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Stock ajusté à la demande, peu d'invendus" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques invendus qui s'accumulent" },
            { value: 0, shortLabel: "Non", label: "Beaucoup d'invendus qui bloquent la trésorerie", recommendation: "Identifiez les produits qui dorment en stock et écoulez-les (promotion) avant d'en racheter." },
          ],
        },
        {
          id: "retail_stocks_3",
          text: "Faites-vous des inventaires réguliers de votre stock ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Inventaires réguliers, écarts analysés" },
            { value: 2, shortLabel: "Partiellement", label: "Inventaires occasionnels" },
            { value: 0, shortLabel: "Non", label: "Jamais d'inventaire", recommendation: "Comptez votre stock au moins une fois par mois pour repérer les écarts et les pertes." },
          ],
        },
        {
          id: "retail_stocks_4",
          text: "Maîtrisez-vous vos pertes (vol, casse, péremption) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Pertes suivies et limitées, accès au stock sécurisé" },
            { value: 2, shortLabel: "Partiellement", label: "Pertes constatées mais non mesurées" },
            { value: 0, shortLabel: "Non", label: "Pertes subies, ni suivies ni maîtrisées", recommendation: "Notez vos pertes pendant un mois pour en identifier la cause principale et agir dessus." },
          ],
        },
        {
          id: "retail_stocks_5",
          text: "Gérez-vous bien vos réapprovisionnements avec vos fournisseurs ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Réassorts planifiés, fournisseurs diversifiés" },
            { value: 2, shortLabel: "Partiellement", label: "Réassorts au dernier moment, un seul fournisseur" },
            { value: 0, shortLabel: "Non", label: "Réapprovisionnement subi, en urgence", recommendation: "Planifiez vos commandes à l'avance et identifiez un deuxième fournisseur pour vos produits clés." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Tenez une liste de vos produits clés et de leur niveau de stock.",
          "Rangez votre stock pour repérer facilement les ruptures et les invendus.",
        ],
        mid: [
          "Fixez un seuil de réapprovisionnement pour vos produits les plus vendus.",
          "Faites un inventaire mensuel et comparez-le à vos ventes.",
        ],
        high: [
          "Utilisez un outil de gestion de stock relié à votre caisse.",
          "Analysez la rotation de vos produits pour optimiser vos achats.",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance & Trésorerie",
      questions: [
        {
          id: "retail_finance_1",
          text: "Connaissez-vous votre marge sur vos principaux produits ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Marges connues par produit ou famille" },
            { value: 2, shortLabel: "Partiellement", label: "Marges connues de façon approximative" },
            { value: 0, shortLabel: "Non", label: "Prix fixés sans connaître la marge", recommendation: "Pour vos produits phares, calculez la différence entre prix d'achat et prix de vente." },
          ],
        },
        {
          id: "retail_finance_2",
          text: "Gérez-vous votre trésorerie pour payer vos fournisseurs sans tension ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Trésorerie suivie, fournisseurs payés à temps" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier, tensions occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Trésorerie subie, retards fréquents", recommendation: "Suivez chaque semaine votre caisse et vos paiements fournisseurs à venir." },
          ],
        },
        {
          id: "retail_finance_3",
          text: "Séparez-vous la caisse du commerce de votre argent personnel ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Séparation stricte, comptes distincts" },
            { value: 2, shortLabel: "Partiellement", label: "Séparation partielle" },
            { value: 0, shortLabel: "Non", label: "Caisse et argent personnel mélangés", recommendation: "Ouvrez un compte (bancaire ou mobile money) dédié uniquement au commerce." },
          ],
        },
        {
          id: "retail_finance_4",
          text: "Tenez-vous une caisse fiable (recettes et dépenses enregistrées) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Caisse tenue, écarts rares et vérifiés" },
            { value: 2, shortLabel: "Partiellement", label: "Enregistrement irrégulier" },
            { value: 0, shortLabel: "Non", label: "Aucun enregistrement fiable", recommendation: "Enregistrez chaque jour vos recettes et vos dépenses, même sur un simple cahier." },
          ],
        },
        {
          id: "retail_finance_5",
          text: "Gérez-vous bien le crédit fournisseur (délais de paiement) sans vous mettre en difficulté ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Crédit fournisseur maîtrisé et suivi" },
            { value: 2, shortLabel: "Partiellement", label: "Crédit utilisé sans vraiment le suivre" },
            { value: 0, shortLabel: "Non", label: "Crédit subi, dettes fournisseurs mal maîtrisées", recommendation: "Notez ce que vous devez à chaque fournisseur et les dates de paiement pour éviter les mauvaises surprises." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Enregistrez vos recettes et dépenses chaque jour.",
          "Ouvrez un compte séparé pour le commerce.",
        ],
        mid: [
          "Calculez votre marge sur vos 10 produits les plus vendus.",
          "Suivez vos dettes fournisseurs et vos échéances de paiement.",
        ],
        high: [
          "Établissez un suivi de trésorerie mensuel pour anticiper vos besoins.",
          "Analysez vos marges pour ajuster vos prix et vos achats.",
        ],
      },
    },
    {
      id: "client",
      name: "Client & Point de vente",
      questions: [
        {
          id: "retail_client_1",
          text: "Fidélisez-vous vos clients réguliers ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Clients réguliers connus et fidélisés" },
            { value: 2, shortLabel: "Partiellement", label: "Relation cordiale mais sans vraie fidélisation" },
            { value: 0, shortLabel: "Non", label: "Relation purement transactionnelle", recommendation: "Reconnaissez vos clients fidèles et offrez-leur une petite attention pour les garder." },
          ],
        },
        {
          id: "retail_client_2",
          text: "Soignez-vous la présentation et l'exposition de vos produits ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Produits bien exposés, point de vente soigné" },
            { value: 2, shortLabel: "Partiellement", label: "Présentation moyenne, améliorable" },
            { value: 0, shortLabel: "Non", label: "Produits mal exposés, point de vente négligé", recommendation: "Mettez en avant vos meilleurs produits à hauteur des yeux et gardez votre espace de vente propre." },
          ],
        },
        {
          id: "retail_client_3",
          text: "Vos promotions sont-elles réfléchies (adaptées à vos marges) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Promotions réfléchies, effet suivi" },
            { value: 2, shortLabel: "Partiellement", label: "Promotions ponctuelles, sans calcul" },
            { value: 0, shortLabel: "Non", label: "Promotions à l'aveugle ou jamais", recommendation: "Avant une promotion, vérifiez qu'elle reste rentable et servez-vous-en pour écouler vos invendus." },
          ],
        },
        {
          id: "retail_client_4",
          text: "Recueillez-vous les avis ou réclamations de vos clients pour vous améliorer ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Avis clients écoutés et pris en compte" },
            { value: 2, shortLabel: "Partiellement", label: "Avis entendus mais rarement suivis d'effet" },
            { value: 0, shortLabel: "Non", label: "Aucune écoute des clients", recommendation: "Demandez régulièrement à vos clients ce qu'ils pensent de votre commerce et agissez sur les retours." },
          ],
        },
        {
          id: "retail_client_5",
          text: "Faites-vous la promotion de votre commerce (bouche-à-oreille, réseaux, enseigne) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Promotion active (enseigne visible, réseaux sociaux)" },
            { value: 2, shortLabel: "Partiellement", label: "Promotion minimale" },
            { value: 0, shortLabel: "Non", label: "Aucune promotion, commerce peu visible", recommendation: "Rendez votre commerce plus visible : enseigne claire, page sur un réseau social, bouche-à-oreille encouragé." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Saluez et reconnaissez vos clients réguliers par leur nom.",
          "Gardez votre point de vente propre et bien rangé.",
        ],
        mid: [
          "Mettez en avant vos produits phares à un endroit visible.",
          "Créez une page sur un réseau social pour montrer vos produits.",
        ],
        high: [
          "Mettez en place un système simple de fidélité pour vos meilleurs clients.",
          "Mesurez l'effet de vos promotions sur vos ventes et vos marges.",
        ],
      },
    },
    {
      id: "digital",
      name: "Digitalisation & Outils",
      questions: [
        {
          id: "retail_digital_1",
          text: "Utilisez-vous un outil de caisse ou de gestion (logiciel, application) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Outil de caisse / gestion utilisé au quotidien" },
            { value: 2, shortLabel: "Partiellement", label: "Outil basique ou utilisé partiellement" },
            { value: 0, shortLabel: "Non", label: "Tout à la main ou de mémoire", recommendation: "Testez un outil de caisse simple pour enregistrer vos ventes et suivre votre stock." },
          ],
        },
        {
          id: "retail_digital_2",
          text: "Acceptez-vous le paiement par mobile money (Wave, Orange Money…) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Mobile money accepté et flux suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Accepté mais mal suivi" },
            { value: 0, shortLabel: "Non", label: "Espèces uniquement", recommendation: "Proposez le paiement mobile money : de nombreux clients le préfèrent et vous perdez des ventes sans lui." },
          ],
        },
        {
          id: "retail_digital_3",
          text: "Vous appuyez-vous sur vos données de vente pour décider de vos achats ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Décisions d'achat basées sur les ventes réelles" },
            { value: 2, shortLabel: "Partiellement", label: "Décisions surtout à l'intuition" },
            { value: 0, shortLabel: "Non", label: "Aucune donnée pour décider", recommendation: "Servez-vous de ce qui se vend réellement pour décider quoi racheter et en quelle quantité." },
          ],
        },
        {
          id: "retail_digital_4",
          text: "Réconciliez-vous régulièrement vos encaissements (espèces + mobile money) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Réconciliation régulière, écarts vérifiés" },
            { value: 2, shortLabel: "Partiellement", label: "Réconciliation occasionnelle" },
            { value: 0, shortLabel: "Non", label: "Aucune réconciliation", recommendation: "Comparez chaque jour votre caisse physique et vos encaissements mobile money à vos ventes." },
          ],
        },
        {
          id: "retail_digital_5",
          text: "Explorez-vous les canaux en ligne pour vendre ou vous faire connaître ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Présence en ligne active (vente ou visibilité)" },
            { value: 2, shortLabel: "Partiellement", label: "Présence en ligne minimale" },
            { value: 0, shortLabel: "Non", label: "Aucune présence en ligne", recommendation: "Créez une page simple (réseau social, WhatsApp Business) pour présenter vos produits et attirer des clients." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Acceptez le mobile money pour ne pas perdre de clients.",
          "Enregistrez vos ventes chaque jour, même simplement.",
        ],
        mid: [
          "Adoptez un outil de caisse relié à votre stock.",
          "Créez une page WhatsApp Business ou réseau social pour vos produits.",
        ],
        high: [
          "Servez-vous de vos données de vente pour piloter vos achats et vos promotions.",
          "Développez un canal de vente en ligne complémentaire à votre boutique.",
        ],
      },
    },
  ],
};

const en = {
  pillars: [
    {
      id: "pilotage",
      name: "Management & Commercial Strategy",
      questions: [
        {
          id: "retail_pilotage_1",
          text: "Do you know your customers well and adapt your product range to their needs?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Product range chosen to match customers and location" },
            { value: 2, shortLabel: "Partially", label: "Range partly adapted, partly by habit" },
            { value: 0, shortLabel: "No", label: "Range put together with no customer logic", recommendation: "Track what your customers ask for most and adjust your range accordingly." },
          ],
        },
        {
          id: "retail_pilotage_2",
          text: "Do you have sales targets and do you track your results?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Targets set and results tracked regularly" },
            { value: 2, shortLabel: "Partially", label: "Vague targets, occasional tracking" },
            { value: 0, shortLabel: "No", label: "No targets and no tracking", recommendation: "Set a simple sales target for next month and compare it to your results." },
          ],
        },
        {
          id: "retail_pilotage_3",
          text: "Is your positioning (prices, offer) considered against nearby competitors?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Clear positioning, differentiated from competitors" },
            { value: 2, shortLabel: "Partially", label: "Prices aligned with neighbors, no real strategy" },
            { value: 0, shortLabel: "No", label: "No thinking about competition", recommendation: "Identify what sets you apart from nearby shops and highlight it." },
          ],
        },
        {
          id: "retail_pilotage_4",
          text: "Do you know which products or categories earn you the most?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Most profitable products identified and prioritized" },
            { value: 2, shortLabel: "Partially", label: "Rough idea, without certainty" },
            { value: 0, shortLabel: "No", label: "Product contribution unknown", recommendation: "Identify the products that sell most and earn most, and give them priority." },
          ],
        },
        {
          id: "retail_pilotage_5",
          text: "Do you have a plan to grow your business over the next 12 months?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Documented development plan with actions" },
            { value: 2, shortLabel: "Partially", label: "Informal development ideas" },
            { value: 0, shortLabel: "No", label: "No development plan", recommendation: "Define 2 or 3 concrete actions to grow your business this year." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record your sales each day to spot your best-selling products.",
          "Ask your regular customers what they would like to find in your shop.",
        ],
        mid: [
          "Analyze what neighboring shops offer to differentiate yourself better.",
          "Set monthly sales targets and track them.",
        ],
        high: [
          "Set up a simple dashboard of your sales and margins.",
          "Look into opening a new outlet or an online channel.",
        ],
      },
    },
    {
      id: "stocks",
      name: "Inventory Management",
      questions: [
        {
          id: "retail_stocks_1",
          text: "Do you track your stock levels to avoid running out of your best-selling products?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Levels tracked, restocking anticipated" },
            { value: 2, shortLabel: "Partially", label: "Rough tracking, occasional stockouts" },
            { value: 0, shortLabel: "No", label: "No tracking, frequent stockouts", recommendation: "Identify your fast-selling products and set a threshold to reorder them in time." },
          ],
        },
        {
          id: "retail_stocks_2",
          text: "Do you avoid tying up your money in products that don't sell (unsold stock)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Stock matched to demand, few unsold items" },
            { value: 2, shortLabel: "Partially", label: "Some unsold items building up" },
            { value: 0, shortLabel: "No", label: "A lot of unsold stock tying up cash", recommendation: "Identify slow-moving stock and clear it (promotion) before buying more." },
          ],
        },
        {
          id: "retail_stocks_3",
          text: "Do you carry out regular stock counts?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular counts, discrepancies analyzed" },
            { value: 2, shortLabel: "Partially", label: "Occasional counts" },
            { value: 0, shortLabel: "No", label: "No stock counts ever", recommendation: "Count your stock at least once a month to spot discrepancies and losses." },
          ],
        },
        {
          id: "retail_stocks_4",
          text: "Do you keep your losses under control (theft, breakage, expiry)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Losses tracked and limited, stock access secured" },
            { value: 2, shortLabel: "Partially", label: "Losses noticed but not measured" },
            { value: 0, shortLabel: "No", label: "Losses suffered, neither tracked nor controlled", recommendation: "Log your losses for a month to identify the main cause and act on it." },
          ],
        },
        {
          id: "retail_stocks_5",
          text: "Do you manage your restocking well with your suppliers?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Restocking planned, suppliers diversified" },
            { value: 2, shortLabel: "Partially", label: "Last-minute restocking, single supplier" },
            { value: 0, shortLabel: "No", label: "Restocking done under pressure, in a rush", recommendation: "Plan your orders ahead and find a second supplier for your key products." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Keep a list of your key products and their stock levels.",
          "Organize your stock so you can easily spot stockouts and unsold items.",
        ],
        mid: [
          "Set a reorder threshold for your best-selling products.",
          "Do a monthly stock count and compare it to your sales.",
        ],
        high: [
          "Use a stock management tool linked to your point of sale.",
          "Analyze your product turnover to optimize your purchasing.",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance & Cash Flow",
      questions: [
        {
          id: "retail_finance_1",
          text: "Do you know your margin on your main products?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Margins known by product or category" },
            { value: 2, shortLabel: "Partially", label: "Margins known only roughly" },
            { value: 0, shortLabel: "No", label: "Prices set without knowing the margin", recommendation: "For your key products, work out the difference between purchase and selling price." },
          ],
        },
        {
          id: "retail_finance_2",
          text: "Do you manage your cash flow to pay suppliers without strain?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash flow tracked, suppliers paid on time" },
            { value: 2, shortLabel: "Partially", label: "Irregular tracking, occasional strain" },
            { value: 0, shortLabel: "No", label: "Cash flow out of control, frequent delays", recommendation: "Track your cash and upcoming supplier payments every week." },
          ],
        },
        {
          id: "retail_finance_3",
          text: "Do you keep the shop's cash separate from your personal money?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Strict separation, distinct accounts" },
            { value: 2, shortLabel: "Partially", label: "Partial separation" },
            { value: 0, shortLabel: "No", label: "Shop cash and personal money mixed", recommendation: "Open an account (bank or mobile money) used only for the shop." },
          ],
        },
        {
          id: "retail_finance_4",
          text: "Do you keep reliable cash records (income and expenses recorded)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash records kept, discrepancies rare and checked" },
            { value: 2, shortLabel: "Partially", label: "Irregular recording" },
            { value: 0, shortLabel: "No", label: "No reliable recording", recommendation: "Record your income and expenses every day, even in a simple notebook." },
          ],
        },
        {
          id: "retail_finance_5",
          text: "Do you manage supplier credit (payment terms) well without getting into trouble?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Supplier credit controlled and tracked" },
            { value: 2, shortLabel: "Partially", label: "Credit used without really tracking it" },
            { value: 0, shortLabel: "No", label: "Credit out of control, supplier debts poorly managed", recommendation: "Note what you owe each supplier and the payment dates to avoid nasty surprises." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record your income and expenses every day.",
          "Open a separate account for the shop.",
        ],
        mid: [
          "Calculate your margin on your 10 best-selling products.",
          "Track your supplier debts and payment deadlines.",
        ],
        high: [
          "Set up monthly cash flow tracking to anticipate your needs.",
          "Analyze your margins to adjust your prices and purchasing.",
        ],
      },
    },
    {
      id: "client",
      name: "Customer & Point of Sale",
      questions: [
        {
          id: "retail_client_1",
          text: "Do you build loyalty with your regular customers?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular customers known and rewarded" },
            { value: 2, shortLabel: "Partially", label: "Friendly relationship but no real loyalty effort" },
            { value: 0, shortLabel: "No", label: "Purely transactional relationship", recommendation: "Recognize your loyal customers and offer them a small perk to keep them." },
          ],
        },
        {
          id: "retail_client_2",
          text: "Do you take care of how your products are displayed and presented?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Products well displayed, tidy point of sale" },
            { value: 2, shortLabel: "Partially", label: "Average presentation, could be improved" },
            { value: 0, shortLabel: "No", label: "Poorly displayed products, neglected shop", recommendation: "Put your best products at eye level and keep your sales area clean." },
          ],
        },
        {
          id: "retail_client_3",
          text: "Are your promotions considered (matched to your margins)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Promotions considered, impact tracked" },
            { value: 2, shortLabel: "Partially", label: "Occasional promotions, without calculation" },
            { value: 0, shortLabel: "No", label: "Promotions done blindly, or never", recommendation: "Before a promotion, check it stays profitable and use it to clear unsold stock." },
          ],
        },
        {
          id: "retail_client_4",
          text: "Do you gather customer feedback or complaints to improve?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Customer feedback heard and acted on" },
            { value: 2, shortLabel: "Partially", label: "Feedback heard but rarely acted on" },
            { value: 0, shortLabel: "No", label: "No listening to customers", recommendation: "Regularly ask your customers what they think of your shop and act on the feedback." },
          ],
        },
        {
          id: "retail_client_5",
          text: "Do you promote your shop (word of mouth, social media, signage)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Active promotion (visible signage, social media)" },
            { value: 2, shortLabel: "Partially", label: "Minimal promotion" },
            { value: 0, shortLabel: "No", label: "No promotion, shop barely visible", recommendation: "Make your shop more visible: clear signage, a social media page, encouraged word of mouth." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Greet and recognize your regular customers by name.",
          "Keep your point of sale clean and tidy.",
        ],
        mid: [
          "Display your key products in a visible spot.",
          "Create a social media page to showcase your products.",
        ],
        high: [
          "Set up a simple loyalty scheme for your best customers.",
          "Measure the impact of your promotions on your sales and margins.",
        ],
      },
    },
    {
      id: "digital",
      name: "Digital & Tools",
      questions: [
        {
          id: "retail_digital_1",
          text: "Do you use a point-of-sale or management tool (software, app)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "POS / management tool used daily" },
            { value: 2, shortLabel: "Partially", label: "Basic tool or used only partly" },
            { value: 0, shortLabel: "No", label: "Everything done by hand or from memory", recommendation: "Try a simple POS tool to record your sales and track your stock." },
          ],
        },
        {
          id: "retail_digital_2",
          text: "Do you accept mobile money payments (Wave, Orange Money…)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Mobile money accepted and flows tracked" },
            { value: 2, shortLabel: "Partially", label: "Accepted but poorly tracked" },
            { value: 0, shortLabel: "No", label: "Cash only", recommendation: "Offer mobile money payment: many customers prefer it and you lose sales without it." },
          ],
        },
        {
          id: "retail_digital_3",
          text: "Do you use your sales data to decide what to buy?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Purchasing decisions based on actual sales" },
            { value: 2, shortLabel: "Partially", label: "Decisions mostly on intuition" },
            { value: 0, shortLabel: "No", label: "No data to decide with", recommendation: "Use what actually sells to decide what to reorder and in what quantity." },
          ],
        },
        {
          id: "retail_digital_4",
          text: "Do you regularly reconcile your takings (cash + mobile money)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular reconciliation, discrepancies checked" },
            { value: 2, shortLabel: "Partially", label: "Occasional reconciliation" },
            { value: 0, shortLabel: "No", label: "No reconciliation", recommendation: "Each day, compare your physical cash and mobile money takings against your sales." },
          ],
        },
        {
          id: "retail_digital_5",
          text: "Do you explore online channels to sell or get known?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Active online presence (sales or visibility)" },
            { value: 2, shortLabel: "Partially", label: "Minimal online presence" },
            { value: 0, shortLabel: "No", label: "No online presence", recommendation: "Create a simple page (social media, WhatsApp Business) to show your products and attract customers." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Accept mobile money so you don't lose customers.",
          "Record your sales every day, even simply.",
        ],
        mid: [
          "Adopt a POS tool linked to your stock.",
          "Create a WhatsApp Business or social media page for your products.",
        ],
        high: [
          "Use your sales data to steer your purchasing and promotions.",
          "Develop an online sales channel to complement your shop.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques Retail
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Critique", en: "Critical" },
    interpretation: {
      fr: "Votre commerce fait face à des risques importants qui menacent sa viabilité. Une action rapide est nécessaire pour structurer sa gestion.",
      en: "Your retail business faces significant risks that threaten its viability. Immediate action is needed to structure its management.",
    },
  },
  {
    id: "vulnerable",
    min: 40,
    max: 59,
    color: "#f97316",
    label: { fr: "Vulnérable", en: "Vulnerable" },
    interpretation: {
      fr: "Votre commerce fonctionne mais repose sur des bases fragiles. Plusieurs axes de gestion nécessitent une attention prioritaire.",
      en: "Your retail business is running but rests on fragile foundations. Several management areas require priority attention.",
    },
  },
  {
    id: "stable",
    min: 60,
    max: 79,
    color: "#eab308",
    label: { fr: "Stable", en: "Stable" },
    interpretation: {
      fr: "Votre commerce a des bases solides. Quelques ajustements ciblés amélioreront votre marge et votre disponibilité produit.",
      en: "Your retail business has solid foundations. A few targeted adjustments will improve your margin and product availability.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Prêt pour la croissance", en: "Growth-Ready" },
    interpretation: {
      fr: "Votre commerce est bien structuré et prêt à accélérer, à ouvrir d'autres points de vente ou à investir.",
      en: "Your retail business is well-structured and ready to accelerate, open new outlets or invest.",
    },
  },
  {
    id: "haute_performance",
    min: 90,
    max: 100,
    color: "#6366f1",
    label: { fr: "Haute performance", en: "High Performance" },
    interpretation: {
      fr: "Votre commerce affiche une excellente maturité de gestion sur l'ensemble des piliers clés. Continuez sur cette lancée !",
      en: "Your retail business shows excellent management maturity across all key pillars. Keep up the great work!",
    },
  },
];

module.exports = { fr, en, levels };
