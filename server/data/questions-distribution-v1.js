// Questionnaire sectoriel Distribution — Distributeurs / grossistes structurés (Sénégal / Afrique de l'Ouest)
// Format identique aux autres questionnaires sectoriels : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// Contenu : VitalCHECK_Distribution_Questions_Bilingue.md — Septembre 2026

const fr = {
  pillars: [
    {
      id: "pilotage",
      name: "Pilotage & Réseau commercial",
      questions: [
        {
          id: "distribution_pilotage_1",
          text: "Votre chiffre d'affaires dépend-il de plus d'un ou deux gros clients ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Clientèle diversifiée, pas de dépendance" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques gros clients pèsent lourd" },
            { value: 0, shortLabel: "Non", label: "Dépendance à un seul gros client", recommendation: "Cherchez activement de nouveaux clients pour réduire votre dépendance à un seul compte." },
          ],
        },
        {
          id: "distribution_pilotage_2",
          text: "Connaissez-vous vos meilleurs clients et vos produits les plus vendus ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Performance suivie par client et par produit" },
            { value: 2, shortLabel: "Partiellement", label: "Idée approximative" },
            { value: 0, shortLabel: "Non", label: "Aucune vision par client ou produit", recommendation: "Repérez vos 10 meilleurs clients et vos produits qui tournent le plus pour concentrer vos efforts." },
          ],
        },
        {
          id: "distribution_pilotage_3",
          text: "Vos sources d'approvisionnement sont-elles diversifiées (pas un seul fournisseur) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plusieurs fournisseurs, dépendance limitée" },
            { value: 2, shortLabel: "Partiellement", label: "Un fournisseur principal, quelques alternatives" },
            { value: 0, shortLabel: "Non", label: "Dépendance à un seul fournisseur", recommendation: "Identifiez un fournisseur alternatif pour vos produits clés afin de sécuriser vos approvisionnements." },
          ],
        },
        {
          id: "distribution_pilotage_4",
          text: "Suivez-vous des objectifs de vente et vos résultats ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Objectifs définis et résultats suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Objectifs vagues, suivi occasionnel" },
            { value: 0, shortLabel: "Non", label: "Aucun objectif ni suivi", recommendation: "Fixez un objectif de vente mensuel et comparez-le à vos résultats." },
          ],
        },
        {
          id: "distribution_pilotage_5",
          text: "Avez-vous un plan pour développer votre activité sur les 12 prochains mois ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plan de développement documenté avec actions" },
            { value: 2, shortLabel: "Partiellement", label: "Idées de développement informelles" },
            { value: 0, shortLabel: "Non", label: "Aucun plan de développement", recommendation: "Définissez 2 ou 3 actions concrètes pour développer votre réseau ou votre gamme cette année." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez vos ventes par client pour repérer vos comptes clés.",
          "Prenez contact avec un fournisseur alternatif pour vos produits clés.",
        ],
        mid: [
          "Analysez la contribution de chaque produit à votre marge.",
          "Fixez des objectifs de vente par mois et suivez-les.",
        ],
        high: [
          "Segmentez votre réseau de clients pour prioriser vos tournées et conditions.",
          "Diversifiez clients et fournisseurs pour renforcer votre résilience.",
        ],
      },
    },
    {
      id: "stock",
      name: "Stock & Logistique",
      questions: [
        {
          id: "distribution_stock_1",
          text: "Suivez-vous vos niveaux de stock pour éviter les ruptures sur vos produits qui tournent ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Niveaux suivis, réapprovisionnement anticipé" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi approximatif, ruptures occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi, ruptures fréquentes", recommendation: "Fixez un seuil d'alerte pour vos produits qui tournent le plus afin de les recommander à temps." },
          ],
        },
        {
          id: "distribution_stock_2",
          text: "Évitez-vous d'immobiliser trop d'argent dans du stock qui ne tourne pas (sur-stock) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Stock ajusté à la demande, peu de sur-stock" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques produits dorment en stock" },
            { value: 0, shortLabel: "Non", label: "Beaucoup de sur-stock, trésorerie bloquée", recommendation: "Identifiez les produits qui dorment et écoulez-les avant d'en racheter." },
          ],
        },
        {
          id: "distribution_stock_3",
          text: "Faites-vous des inventaires réguliers de votre entrepôt ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Inventaires réguliers, écarts analysés" },
            { value: 2, shortLabel: "Partiellement", label: "Inventaires occasionnels" },
            { value: 0, shortLabel: "Non", label: "Jamais d'inventaire", recommendation: "Comptez votre stock régulièrement pour repérer les écarts, les pertes et les vols." },
          ],
        },
        {
          id: "distribution_stock_4",
          text: "Votre entrepôt est-il organisé pour limiter pertes, casse et obsolescence ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Entrepôt organisé, pertes maîtrisées" },
            { value: 2, shortLabel: "Partiellement", label: "Organisation moyenne, quelques pertes" },
            { value: 0, shortLabel: "Non", label: "Entrepôt désorganisé, pertes fréquentes", recommendation: "Rangez votre entrepôt par famille de produits et sortez d'abord les plus anciens (premier entré, premier sorti)." },
          ],
        },
        {
          id: "distribution_stock_5",
          text: "Planifiez-vous vos tournées de livraison pour maîtriser vos coûts de transport ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Tournées planifiées, coûts de transport suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Livraisons organisées au cas par cas" },
            { value: 0, shortLabel: "Non", label: "Tournées improvisées, coûts subis", recommendation: "Regroupez vos livraisons par zone pour réduire vos déplacements et votre carburant." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Tenez une liste de vos produits clés et de leur niveau de stock.",
          "Rangez votre entrepôt pour repérer facilement ruptures et sur-stocks.",
        ],
        mid: [
          "Fixez un seuil de réapprovisionnement pour vos produits qui tournent le plus.",
          "Regroupez vos livraisons par zone pour réduire les coûts de transport.",
        ],
        high: [
          "Utilisez un outil de gestion de stock relié à vos ventes.",
          "Analysez la rotation de vos produits pour optimiser vos achats.",
        ],
      },
    },
    {
      id: "credit",
      name: "Crédit client & Trésorerie",
      questions: [
        {
          id: "distribution_credit_1",
          text: "Encadrez-vous le crédit que vous accordez à vos clients (plafond, délai) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Crédit encadré (plafond et délai définis)" },
            { value: 2, shortLabel: "Partiellement", label: "Crédit accordé « à la confiance », sans règle claire" },
            { value: 0, shortLabel: "Non", label: "Crédit sans aucune règle", recommendation: "Fixez un plafond et un délai de paiement clairs pour chaque client à qui vous faites crédit." },
          ],
        },
        {
          id: "distribution_credit_2",
          text: "Suivez-vous ce que chaque client vous doit et relancez-vous les retards ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Encours suivi, retards relancés" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi des créances, impayés subis", recommendation: "Tenez une liste de ce que chaque client vous doit et relancez dès qu'un paiement tarde." },
          ],
        },
        {
          id: "distribution_credit_3",
          text: "Gérez-vous votre trésorerie pour payer vos fournisseurs sans tension ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Trésorerie suivie, fournisseurs payés à temps" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier, tensions occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Trésorerie subie, retards fréquents", recommendation: "Suivez chaque semaine votre trésorerie et vos échéances fournisseurs à venir." },
          ],
        },
        {
          id: "distribution_credit_4",
          text: "Équilibrez-vous vos délais de paiement fournisseurs et clients pour préserver votre trésorerie ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Délais équilibrés, cycle stock-vente-encaissement maîtrisé" },
            { value: 2, shortLabel: "Partiellement", label: "Équilibre approximatif" },
            { value: 0, shortLabel: "Non", label: "Vous payez avant d'encaisser, tension permanente", recommendation: "Négociez des délais avec vos fournisseurs et raccourcissez ceux que vous accordez aux clients." },
          ],
        },
        {
          id: "distribution_credit_5",
          text: "Séparez-vous les finances de l'entreprise de votre argent personnel ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Séparation stricte, comptes distincts" },
            { value: 2, shortLabel: "Partiellement", label: "Séparation partielle" },
            { value: 0, shortLabel: "Non", label: "Finances entreprise et personnel mélangées", recommendation: "Ouvrez un compte dédié à l'entreprise et cessez de mélanger avec votre argent personnel." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez ce que chaque client vous doit et les dates de paiement.",
          "Ouvrez un compte séparé pour l'entreprise.",
        ],
        mid: [
          "Fixez un plafond de crédit clair par client.",
          "Relancez systématiquement les paiements en retard.",
        ],
        high: [
          "Équilibrez délais fournisseurs et clients pour préserver votre trésorerie.",
          "Mettez en place un suivi de trésorerie mensuel.",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance & Marges",
      questions: [
        {
          id: "distribution_finance_1",
          text: "Connaissez-vous votre marge sur vos principaux produits ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Marges connues par produit ou catégorie" },
            { value: 2, shortLabel: "Partiellement", label: "Marges connues de façon approximative" },
            { value: 0, shortLabel: "Non", label: "Marges gérées « à l'œil »", recommendation: "Pour vos produits phares, calculez la différence entre prix d'achat (rendu) et prix de vente." },
          ],
        },
        {
          id: "distribution_finance_2",
          text: "Tenez-vous une comptabilité (recettes, dépenses, achats) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Comptabilité tenue régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Notes informelles, irrégulières" },
            { value: 0, shortLabel: "Non", label: "Aucune comptabilité", recommendation: "Enregistrez chaque achat et chaque vente dans un registre dédié, même simple." },
          ],
        },
        {
          id: "distribution_finance_3",
          text: "Ajustez-vous vos prix et remises en connaissant votre marge réelle ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Prix et remises pilotés par la marge" },
            { value: 2, shortLabel: "Partiellement", label: "Remises accordées sans vrai calcul" },
            { value: 0, shortLabel: "Non", label: "Aucune vision de l'impact des remises", recommendation: "Avant d'accorder une remise, vérifiez qu'il vous reste une marge suffisante." },
          ],
        },
        {
          id: "distribution_finance_4",
          text: "Intégrez-vous vos coûts logistiques (transport, stockage) dans vos prix ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Coûts logistiques intégrés au prix de revient" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement pris en compte" },
            { value: 0, shortLabel: "Non", label: "Coûts logistiques ignorés dans le prix", recommendation: "Ajoutez le transport et le stockage à votre prix de revient pour ne pas vendre à perte." },
          ],
        },
        {
          id: "distribution_finance_5",
          text: "Votre gestion vous permet-elle de présenter des documents à une banque pour un financement ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Documents de gestion prêts et présentables" },
            { value: 2, shortLabel: "Partiellement", label: "Quelques documents, incomplets" },
            { value: 0, shortLabel: "Non", label: "Aucun document exploitable par une banque", recommendation: "Rassemblez et conservez vos relevés, factures et registres : ce sont les documents qu'une banque demande." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Enregistrez chaque achat et chaque vente.",
          "Ouvrez un compte séparé pour l'entreprise.",
        ],
        mid: [
          "Calculez votre marge réelle (prix de revient rendu inclus) sur vos produits clés.",
          "Intégrez vos coûts logistiques dans vos prix.",
        ],
        high: [
          "Structurez votre comptabilité pour accéder à un financement bancaire.",
          "Pilotez vos remises à partir de votre marge réelle.",
        ],
      },
    },
    {
      id: "digital",
      name: "Digitalisation & Outils",
      questions: [
        {
          id: "distribution_digital_1",
          text: "Utilisez-vous un outil de gestion (stock, ventes, clients) plutôt que le papier ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Outil de gestion utilisé au quotidien" },
            { value: 2, shortLabel: "Partiellement", label: "Outil basique ou partiellement utilisé" },
            { value: 0, shortLabel: "Non", label: "Tout à la main ou de mémoire", recommendation: "Testez un outil simple pour suivre vos stocks, vos ventes et vos créances clients." },
          ],
        },
        {
          id: "distribution_digital_2",
          text: "Encaissez-vous par mobile money (Wave, Orange Money…) pour réduire le cash ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Mobile money accepté et flux suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Accepté mais mal suivi" },
            { value: 0, shortLabel: "Non", label: "Espèces uniquement", recommendation: "Proposez le paiement mobile money : c'est plus sûr que le cash et cela trace vos encaissements." },
          ],
        },
        {
          id: "distribution_digital_3",
          text: "Vous appuyez-vous sur vos données de vente pour décider de vos achats ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Décisions d'achat basées sur les ventes réelles" },
            { value: 2, shortLabel: "Partiellement", label: "Décisions surtout à l'intuition" },
            { value: 0, shortLabel: "Non", label: "Aucune donnée pour décider", recommendation: "Servez-vous de ce qui se vend réellement pour décider quoi racheter et en quelle quantité." },
          ],
        },
        {
          id: "distribution_digital_4",
          text: "Réconciliez-vous régulièrement vos encaissements (espèces + mobile money) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Réconciliation régulière, écarts vérifiés" },
            { value: 2, shortLabel: "Partiellement", label: "Réconciliation occasionnelle" },
            { value: 0, shortLabel: "Non", label: "Aucune réconciliation", recommendation: "Comparez chaque jour vos encaissements (cash + mobile money) à vos ventes." },
          ],
        },
        {
          id: "distribution_digital_5",
          text: "Facilitez-vous la commande pour vos clients (téléphone, WhatsApp, plateforme) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Canaux de commande simples et suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Commandes prises de façon informelle" },
            { value: 0, shortLabel: "Non", label: "Aucun canal organisé pour commander", recommendation: "Mettez en place un canal simple (WhatsApp Business, liste de prix) pour que vos clients commandent facilement." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Acceptez le mobile money pour sécuriser vos encaissements.",
          "Enregistrez vos ventes et vos stocks chaque jour.",
        ],
        mid: [
          "Adoptez un outil de gestion reliant stock, ventes et créances.",
          "Créez un canal de commande simple (WhatsApp Business, liste de prix).",
        ],
        high: [
          "Servez-vous de vos données de vente pour piloter vos achats.",
          "Automatisez le suivi de vos créances et de vos réassorts.",
        ],
      },
    },
  ],
};

const en = {
  pillars: [
    {
      id: "pilotage",
      name: "Management & Sales Network",
      questions: [
        {
          id: "distribution_pilotage_1",
          text: "Does your revenue rely on more than just one or two big customers?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Diversified customer base, no dependence" },
            { value: 2, shortLabel: "Partially", label: "A few big customers weigh heavily" },
            { value: 0, shortLabel: "No", label: "Dependence on a single big customer", recommendation: "Actively seek new customers to reduce your dependence on a single account." },
          ],
        },
        {
          id: "distribution_pilotage_2",
          text: "Do you know your best customers and your best-selling products?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Performance tracked by customer and product" },
            { value: 2, shortLabel: "Partially", label: "Rough idea" },
            { value: 0, shortLabel: "No", label: "No visibility by customer or product", recommendation: "Identify your top 10 customers and best-moving products to focus your efforts." },
          ],
        },
        {
          id: "distribution_pilotage_3",
          text: "Are your supply sources diversified (not a single supplier)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Several suppliers, limited dependence" },
            { value: 2, shortLabel: "Partially", label: "One main supplier, a few alternatives" },
            { value: 0, shortLabel: "No", label: "Dependence on a single supplier", recommendation: "Find an alternative supplier for your key products to secure your supply." },
          ],
        },
        {
          id: "distribution_pilotage_4",
          text: "Do you track sales targets and your results?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Targets defined and results tracked" },
            { value: 2, shortLabel: "Partially", label: "Vague targets, occasional tracking" },
            { value: 0, shortLabel: "No", label: "No targets and no tracking", recommendation: "Set a monthly sales target and compare it to your results." },
          ],
        },
        {
          id: "distribution_pilotage_5",
          text: "Do you have a plan to grow your business over the next 12 months?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Documented development plan with actions" },
            { value: 2, shortLabel: "Partially", label: "Informal development ideas" },
            { value: 0, shortLabel: "No", label: "No development plan", recommendation: "Define 2 or 3 concrete actions to grow your network or product range this year." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record your sales by customer to spot your key accounts.",
          "Reach out to an alternative supplier for your key products.",
        ],
        mid: [
          "Analyze each product's contribution to your margin.",
          "Set monthly sales targets and track them.",
        ],
        high: [
          "Segment your customer network to prioritize routes and terms.",
          "Diversify customers and suppliers to strengthen resilience.",
        ],
      },
    },
    {
      id: "stock",
      name: "Inventory & Logistics",
      questions: [
        {
          id: "distribution_stock_1",
          text: "Do you track your stock levels to avoid running out of your fast-moving products?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Levels tracked, restocking anticipated" },
            { value: 2, shortLabel: "Partially", label: "Rough tracking, occasional stockouts" },
            { value: 0, shortLabel: "No", label: "No tracking, frequent stockouts", recommendation: "Set an alert threshold for your fastest-moving products to reorder them in time." },
          ],
        },
        {
          id: "distribution_stock_2",
          text: "Do you avoid tying up too much cash in stock that doesn't move (overstock)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Stock matched to demand, little overstock" },
            { value: 2, shortLabel: "Partially", label: "Some products sitting in stock" },
            { value: 0, shortLabel: "No", label: "A lot of overstock, cash tied up", recommendation: "Identify slow-moving stock and clear it before buying more." },
          ],
        },
        {
          id: "distribution_stock_3",
          text: "Do you carry out regular warehouse stock counts?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular counts, discrepancies analyzed" },
            { value: 2, shortLabel: "Partially", label: "Occasional counts" },
            { value: 0, shortLabel: "No", label: "No stock counts ever", recommendation: "Count your stock regularly to spot discrepancies, losses and theft." },
          ],
        },
        {
          id: "distribution_stock_4",
          text: "Is your warehouse organized to limit losses, breakage and obsolescence?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Organized warehouse, losses controlled" },
            { value: 2, shortLabel: "Partially", label: "Average organization, some losses" },
            { value: 0, shortLabel: "No", label: "Disorganized warehouse, frequent losses", recommendation: "Organize your warehouse by product family and move the oldest stock out first (first in, first out)." },
          ],
        },
        {
          id: "distribution_stock_5",
          text: "Do you plan your delivery routes to control your transport costs?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Routes planned, transport costs tracked" },
            { value: 2, shortLabel: "Partially", label: "Deliveries organized case by case" },
            { value: 0, shortLabel: "No", label: "Improvised routes, costs absorbed blindly", recommendation: "Group your deliveries by area to cut down on trips and fuel." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Keep a list of your key products and their stock levels.",
          "Organize your warehouse to easily spot stockouts and overstock.",
        ],
        mid: [
          "Set a reorder threshold for your fastest-moving products.",
          "Group deliveries by area to reduce transport costs.",
        ],
        high: [
          "Use a stock management tool linked to your sales.",
          "Analyze your product turnover to optimize your purchasing.",
        ],
      },
    },
    {
      id: "credit",
      name: "Customer Credit & Cash Flow",
      questions: [
        {
          id: "distribution_credit_1",
          text: "Do you set limits on the credit you extend to customers (cap, terms)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Credit framed (defined cap and terms)" },
            { value: 2, shortLabel: "Partially", label: "Credit given on trust, no clear rule" },
            { value: 0, shortLabel: "No", label: "Credit with no rules at all", recommendation: "Set a clear limit and payment term for each customer you give credit to." },
          ],
        },
        {
          id: "distribution_credit_2",
          text: "Do you track what each customer owes you and follow up on late payments?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Outstanding balances tracked, late payments chased" },
            { value: 2, shortLabel: "Partially", label: "Irregular tracking" },
            { value: 0, shortLabel: "No", label: "No tracking of receivables, unpaid amounts absorbed", recommendation: "Keep a list of what each customer owes you and follow up as soon as a payment is late." },
          ],
        },
        {
          id: "distribution_credit_3",
          text: "Do you manage your cash flow to pay suppliers without strain?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash flow tracked, suppliers paid on time" },
            { value: 2, shortLabel: "Partially", label: "Irregular tracking, occasional strain" },
            { value: 0, shortLabel: "No", label: "Cash flow out of control, frequent delays", recommendation: "Track your cash and upcoming supplier payments every week." },
          ],
        },
        {
          id: "distribution_credit_4",
          text: "Do you balance your supplier and customer payment terms to protect your cash flow?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Balanced terms, stock-sale-collection cycle controlled" },
            { value: 2, shortLabel: "Partially", label: "Rough balance" },
            { value: 0, shortLabel: "No", label: "You pay before you collect, permanent strain", recommendation: "Negotiate terms with your suppliers and shorten the ones you give to customers." },
          ],
        },
        {
          id: "distribution_credit_5",
          text: "Do you keep the company's finances separate from your personal money?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Strict separation, distinct accounts" },
            { value: 2, shortLabel: "Partially", label: "Partial separation" },
            { value: 0, shortLabel: "No", label: "Company and personal finances mixed", recommendation: "Open a dedicated company account and stop mixing it with your personal money." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Note what each customer owes you and the payment dates.",
          "Open a separate account for the company.",
        ],
        mid: [
          "Set a clear credit limit per customer.",
          "Systematically follow up on late payments.",
        ],
        high: [
          "Balance supplier and customer terms to protect your cash flow.",
          "Set up monthly cash flow tracking.",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance & Margins",
      questions: [
        {
          id: "distribution_finance_1",
          text: "Do you know your margin on your main products?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Margins known by product or category" },
            { value: 2, shortLabel: "Partially", label: "Margins known only roughly" },
            { value: 0, shortLabel: "No", label: "Margins managed by guesswork", recommendation: "For your key products, work out the gap between landed cost and selling price." },
          ],
        },
        {
          id: "distribution_finance_2",
          text: "Do you keep accounts (income, expenses, purchases)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Accounts kept regularly" },
            { value: 2, shortLabel: "Partially", label: "Informal, irregular notes" },
            { value: 0, shortLabel: "No", label: "No accounts kept", recommendation: "Record every purchase and sale in a dedicated ledger, even a simple one." },
          ],
        },
        {
          id: "distribution_finance_3",
          text: "Do you adjust your prices and discounts knowing your real margin?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Prices and discounts driven by margin" },
            { value: 2, shortLabel: "Partially", label: "Discounts given without real calculation" },
            { value: 0, shortLabel: "No", label: "No view of the impact of discounts", recommendation: "Before granting a discount, check that you keep a sufficient margin." },
          ],
        },
        {
          id: "distribution_finance_4",
          text: "Do you factor your logistics costs (transport, storage) into your prices?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Logistics costs built into landed cost" },
            { value: 2, shortLabel: "Partially", label: "Partly accounted for" },
            { value: 0, shortLabel: "No", label: "Logistics costs ignored in pricing", recommendation: "Add transport and storage to your landed cost so you don't sell at a loss." },
          ],
        },
        {
          id: "distribution_finance_5",
          text: "Does your record-keeping let you present documents to a bank for financing?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Management documents ready and presentable" },
            { value: 2, shortLabel: "Partially", label: "Some documents, incomplete" },
            { value: 0, shortLabel: "No", label: "No documents usable by a bank", recommendation: "Gather and keep your statements, invoices and ledgers: these are what a bank asks for." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record every purchase and every sale.",
          "Open a separate account for the company.",
        ],
        mid: [
          "Calculate your real margin (landed cost included) on your key products.",
          "Factor your logistics costs into your prices.",
        ],
        high: [
          "Structure your accounts to access bank financing.",
          "Steer your discounts from your real margin.",
        ],
      },
    },
    {
      id: "digital",
      name: "Digital & Tools",
      questions: [
        {
          id: "distribution_digital_1",
          text: "Do you use a management tool (stock, sales, customers) rather than paper?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Management tool used daily" },
            { value: 2, shortLabel: "Partially", label: "Basic tool or partly used" },
            { value: 0, shortLabel: "No", label: "Everything by hand or from memory", recommendation: "Try a simple tool to track your stock, sales and customer receivables." },
          ],
        },
        {
          id: "distribution_digital_2",
          text: "Do you collect payments by mobile money (Wave, Orange Money…) to reduce cash?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Mobile money accepted and flows tracked" },
            { value: 2, shortLabel: "Partially", label: "Accepted but poorly tracked" },
            { value: 0, shortLabel: "No", label: "Cash only", recommendation: "Offer mobile money payment: it's safer than cash and traces your takings." },
          ],
        },
        {
          id: "distribution_digital_3",
          text: "Do you use your sales data to decide what to buy?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Purchasing decisions based on actual sales" },
            { value: 2, shortLabel: "Partially", label: "Decisions mostly on intuition" },
            { value: 0, shortLabel: "No", label: "No data to decide with", recommendation: "Use what actually sells to decide what to reorder and in what quantity." },
          ],
        },
        {
          id: "distribution_digital_4",
          text: "Do you regularly reconcile your takings (cash + mobile money)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular reconciliation, discrepancies checked" },
            { value: 2, shortLabel: "Partially", label: "Occasional reconciliation" },
            { value: 0, shortLabel: "No", label: "No reconciliation", recommendation: "Each day, compare your takings (cash + mobile money) against your sales." },
          ],
        },
        {
          id: "distribution_digital_5",
          text: "Do you make ordering easy for your customers (phone, WhatsApp, platform)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Simple, tracked ordering channels" },
            { value: 2, shortLabel: "Partially", label: "Orders taken informally" },
            { value: 0, shortLabel: "No", label: "No organized channel to order", recommendation: "Set up a simple channel (WhatsApp Business, price list) so your customers can order easily." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Accept mobile money to secure your takings.",
          "Record your sales and stock every day.",
        ],
        mid: [
          "Adopt a tool linking stock, sales and receivables.",
          "Create a simple ordering channel (WhatsApp Business, price list).",
        ],
        high: [
          "Use your sales data to steer your purchasing.",
          "Automate the tracking of your receivables and restocking.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques Distribution
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Critique", en: "Critical" },
    interpretation: {
      fr: "Votre entreprise fait face à des risques importants qui menacent sa viabilité. Une action rapide est nécessaire pour structurer sa gestion.",
      en: "Your distribution business faces significant risks that threaten its viability. Immediate action is needed to structure its management.",
    },
  },
  {
    id: "vulnerable",
    min: 40,
    max: 59,
    color: "#f97316",
    label: { fr: "Vulnérable", en: "Vulnerable" },
    interpretation: {
      fr: "Votre entreprise fonctionne mais repose sur des bases fragiles. Plusieurs axes de gestion nécessitent une attention prioritaire.",
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
      fr: "Votre entreprise a des bases solides. Quelques ajustements ciblés sécuriseront votre trésorerie et vos marges.",
      en: "Your business has solid foundations. A few targeted adjustments will secure your cash flow and margins.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Prêt pour la croissance", en: "Growth-Ready" },
    interpretation: {
      fr: "Votre entreprise est bien structurée et prête à élargir son réseau et à accélérer.",
      en: "Your business is well-structured and ready to expand its network and accelerate.",
    },
  },
  {
    id: "haute_performance",
    min: 90,
    max: 100,
    color: "#6366f1",
    label: { fr: "Haute performance", en: "High Performance" },
    interpretation: {
      fr: "Votre entreprise affiche une excellente maturité de gestion sur l'ensemble des piliers clés. Continuez sur cette lancée !",
      en: "Your business shows excellent management maturity across all key pillars. Keep up the great work!",
    },
  },
];

module.exports = { fr, en, levels };
