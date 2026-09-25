// Questionnaire sectoriel Restaurant — Restauration structurée (Sénégal / Afrique de l'Ouest)
// Format identique à questions-agri-v1.js / questions-retail-v1.js : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// Contenu : VitalCHECK_Restaurant_Questions_Bilingue.md — Septembre 2026

const fr = {
  pillars: [
    {
      id: "pilotage",
      name: "Pilotage & Stratégie",
      questions: [
        {
          id: "resto_pilotage_1",
          text: "Connaissez-vous bien votre clientèle et adaptez-vous votre carte à ses attentes ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Carte adaptée à la clientèle cible et à l'emplacement" },
            { value: 2, shortLabel: "Partiellement", label: "Carte en partie adaptée, en partie par habitude" },
            { value: 0, shortLabel: "Non", label: "Carte constituée sans logique client", recommendation: "Observez ce que vos clients commandent le plus et ajustez votre carte en conséquence." },
          ],
        },
        {
          id: "resto_pilotage_2",
          text: "Vos prix reposent-ils sur vos coûts réels plutôt que sur la seule habitude du marché ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Prix fixés à partir des coûts et de la marge visée" },
            { value: 2, shortLabel: "Partiellement", label: "Prix alignés sur la concurrence, sans calcul de coût" },
            { value: 0, shortLabel: "Non", label: "Prix fixés à l'instinct", recommendation: "Calculez le coût matière de vos plats phares avant d'en fixer le prix." },
          ],
        },
        {
          id: "resto_pilotage_3",
          text: "Suivez-vous votre fréquentation et votre chiffre (couverts, ticket moyen) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Fréquentation et chiffre suivis régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi approximatif, de mémoire" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi", recommendation: "Notez chaque jour le nombre de couverts et vos recettes pour suivre votre activité." },
          ],
        },
        {
          id: "resto_pilotage_4",
          text: "Savez-vous quels plats vous rapportent le plus (les plus vendus et les plus rentables) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plats vedettes et rentables identifiés et mis en avant" },
            { value: 2, shortLabel: "Partiellement", label: "Idée approximative" },
            { value: 0, shortLabel: "Non", label: "Contribution des plats inconnue", recommendation: "Repérez vos plats les plus vendus et les plus rentables, et mettez-les en avant sur votre carte." },
          ],
        },
        {
          id: "resto_pilotage_5",
          text: "Avez-vous un plan pour développer votre établissement sur les 12 prochains mois ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plan de développement documenté avec actions" },
            { value: 2, shortLabel: "Partiellement", label: "Idées de développement informelles" },
            { value: 0, shortLabel: "Non", label: "Aucun plan de développement", recommendation: "Définissez 2 ou 3 actions concrètes pour développer votre établissement cette année (livraison, événements, capacité)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez chaque jour vos couverts et vos plats les plus commandés.",
          "Demandez à vos clients réguliers ce qu'ils aimeraient trouver sur votre carte.",
        ],
        mid: [
          "Simplifiez votre carte autour de vos plats les plus rentables.",
          "Fixez vos prix à partir du coût matière et d'une marge cible.",
        ],
        high: [
          "Mettez en place un suivi simple de vos ventes par plat.",
          "Étudiez un nouveau canal (livraison, traiteur, second point de vente).",
        ],
      },
    },
    {
      id: "foodcost",
      name: "Food cost & Approvisionnement",
      questions: [
        {
          id: "resto_foodcost_1",
          text: "Avez-vous des recettes standardisées (mêmes quantités, mêmes portions à chaque fois) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Fiches recettes écrites, portions constantes" },
            { value: 2, shortLabel: "Partiellement", label: "Recettes transmises oralement, portions variables" },
            { value: 0, shortLabel: "Non", label: "Recettes « à l'œil », portions au hasard", recommendation: "Écrivez les ingrédients et quantités de vos plats les plus vendus pour stabiliser vos portions." },
          ],
        },
        {
          id: "resto_foodcost_2",
          text: "Connaissez-vous le coût matière (food cost) de vos principaux plats ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Coût matière connu par plat" },
            { value: 2, shortLabel: "Partiellement", label: "Estimation approximative" },
            { value: 0, shortLabel: "Non", label: "Coût matière inconnu", recommendation: "Additionnez le coût des ingrédients d'un plat et comparez-le à son prix de vente." },
          ],
        },
        {
          id: "resto_foodcost_3",
          text: "Maîtrisez-vous votre gaspillage et vos pertes de denrées périssables ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Production ajustée à l'affluence, pertes limitées et suivies" },
            { value: 2, shortLabel: "Partiellement", label: "Pertes constatées mais non mesurées" },
            { value: 0, shortLabel: "Non", label: "Gaspillage important, surproduction fréquente", recommendation: "Suivez ce que vous jetez pendant une semaine pour ajuster vos achats et vos quantités préparées." },
          ],
        },
        {
          id: "resto_foodcost_4",
          text: "Gérez-vous vos stocks de denrées (sec et froid) pour éviter ruptures et pertes ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Stocks suivis, rotation des denrées (premier entré, premier sorti)" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi approximatif" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi, ruptures ou pertes fréquentes", recommendation: "Vérifiez vos stocks avant chaque commande et utilisez d'abord les denrées les plus anciennes." },
          ],
        },
        {
          id: "resto_foodcost_5",
          text: "Votre approvisionnement est-il diversifié et fiable (pas dépendant d'un seul fournisseur) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plusieurs fournisseurs, approvisionnement sécurisé" },
            { value: 2, shortLabel: "Partiellement", label: "Un fournisseur principal, quelques alternatives" },
            { value: 0, shortLabel: "Non", label: "Dépendance à un seul fournisseur", recommendation: "Identifiez un deuxième fournisseur pour vos denrées clés afin d'éviter les ruptures." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez les ingrédients et quantités de vos plats les plus vendus.",
          "Vérifiez vos stocks avant de passer commande.",
        ],
        mid: [
          "Calculez le coût matière de vos 10 plats les plus vendus.",
          "Adoptez la rotation « premier entré, premier sorti » pour limiter les pertes.",
        ],
        high: [
          "Ajustez vos prix et vos portions à partir de votre food cost réel.",
          "Suivez votre gaspillage pour optimiser vos achats et votre production.",
        ],
      },
    },
    {
      id: "hygiene",
      name: "Hygiène & Qualité",
      questions: [
        {
          id: "resto_hygiene_1",
          text: "Êtes-vous en règle sur l'hygiène (certificats, autorisations requises) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Certificats et autorisations à jour" },
            { value: 2, shortLabel: "Partiellement", label: "Documents partiels ou périmés" },
            { value: 0, shortLabel: "Non", label: "Aucune démarche de conformité", recommendation: "Renseignez-vous sur les certificats d'hygiène obligatoires pour votre établissement et mettez-vous en règle." },
          ],
        },
        {
          id: "resto_hygiene_2",
          text: "Maîtrisez-vous votre chaîne du froid (conservation des denrées à bonne température) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Froid maîtrisé, températures surveillées" },
            { value: 2, shortLabel: "Partiellement", label: "Froid présent mais peu surveillé" },
            { value: 0, shortLabel: "Non", label: "Froid insuffisant, risque sur les denrées", recommendation: "Vérifiez régulièrement la température de vos réfrigérateurs et congélateurs pour protéger vos denrées." },
          ],
        },
        {
          id: "resto_hygiene_3",
          text: "Votre personnel applique-t-il les bonnes pratiques d'hygiène (lavage des mains, séparation cru/cuit) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Personnel formé, bonnes pratiques appliquées" },
            { value: 2, shortLabel: "Partiellement", label: "Pratiques connues mais inégalement appliquées" },
            { value: 0, shortLabel: "Non", label: "Aucune règle d'hygiène appliquée", recommendation: "Affichez et expliquez les règles de base (lavage des mains, cru/cuit séparés) à toute votre équipe." },
          ],
        },
        {
          id: "resto_hygiene_4",
          text: "La propreté de votre cuisine et de votre salle est-elle assurée en continu ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Nettoyage régulier et organisé (plan de nettoyage)" },
            { value: 2, shortLabel: "Partiellement", label: "Nettoyage irrégulier" },
            { value: 0, shortLabel: "Non", label: "Propreté négligée", recommendation: "Mettez en place un planning de nettoyage simple (quoi, qui, quand) pour la cuisine et la salle." },
          ],
        },
        {
          id: "resto_hygiene_5",
          text: "La qualité de vos plats est-elle constante d'un service à l'autre ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Qualité constante grâce aux recettes et au contrôle" },
            { value: 2, shortLabel: "Partiellement", label: "Qualité variable selon le cuisinier ou l'affluence" },
            { value: 0, shortLabel: "Non", label: "Qualité irrégulière", recommendation: "Standardisez vos recettes et goûtez vos plats avant le service pour garantir une qualité constante." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Affichez les règles d'hygiène de base en cuisine.",
          "Vérifiez chaque jour la température de vos équipements de froid.",
        ],
        mid: [
          "Mettez en place un plan de nettoyage écrit pour la cuisine et la salle.",
          "Formez votre équipe aux bonnes pratiques (mains, cru/cuit, dates).",
        ],
        high: [
          "Mettez-vous en conformité avec les certificats d'hygiène requis.",
          "Adoptez une démarche qualité (contrôles réguliers, retours clients).",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance, Caisse & Digital",
      questions: [
        {
          id: "resto_finance_1",
          text: "Tenez-vous une caisse fiable (recettes et dépenses enregistrées chaque jour) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Caisse tenue quotidiennement, écarts vérifiés" },
            { value: 2, shortLabel: "Partiellement", label: "Enregistrement irrégulier" },
            { value: 0, shortLabel: "Non", label: "Aucun enregistrement fiable", recommendation: "Enregistrez chaque jour vos recettes et vos dépenses, même sur un simple cahier." },
          ],
        },
        {
          id: "resto_finance_2",
          text: "Séparez-vous les finances de l'établissement de votre argent personnel ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Séparation stricte, comptes distincts" },
            { value: 2, shortLabel: "Partiellement", label: "Séparation partielle" },
            { value: 0, shortLabel: "Non", label: "Finances établissement et personnel mélangées", recommendation: "Ouvrez un compte (bancaire ou mobile money) dédié uniquement à l'établissement." },
          ],
        },
        {
          id: "resto_finance_3",
          text: "Acceptez-vous le paiement par mobile money (Wave, Orange Money…) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Mobile money accepté et flux suivis" },
            { value: 2, shortLabel: "Partiellement", label: "Accepté mais mal suivi" },
            { value: 0, shortLabel: "Non", label: "Espèces uniquement", recommendation: "Proposez le paiement mobile money : de nombreux clients le préfèrent et vous perdez des ventes sans lui." },
          ],
        },
        {
          id: "resto_finance_4",
          text: "Si vous faites de la livraison, intégrez-vous les commissions des plateformes dans vos prix ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Commissions intégrées, marge livraison maîtrisée" },
            { value: 2, shortLabel: "Partiellement", label: "Livraison proposée sans vrai calcul de marge" },
            { value: 0, shortLabel: "Non", label: "Commissions subies (ou livraison non concernée)", recommendation: "Calculez ce que la plateforme prélève et ajustez vos prix de livraison pour rester rentable." },
          ],
        },
        {
          id: "resto_finance_5",
          text: "Gérez-vous votre trésorerie pour payer fournisseurs et personnel sans tension ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Trésorerie suivie, paiements assurés à temps" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier, tensions occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Trésorerie subie, retards fréquents", recommendation: "Suivez chaque semaine votre caisse et vos paiements à venir (fournisseurs, salaires, loyer)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Enregistrez vos recettes et dépenses chaque jour.",
          "Acceptez le mobile money pour ne pas perdre de clients.",
        ],
        mid: [
          "Ouvrez un compte séparé pour l'établissement.",
          "Réconciliez chaque jour votre caisse (espèces + mobile money) avec vos ventes.",
        ],
        high: [
          "Intégrez les commissions de livraison dans vos prix.",
          "Mettez en place un suivi de trésorerie mensuel.",
        ],
      },
    },
    {
      id: "personnel",
      name: "Personnel & Service",
      questions: [
        {
          id: "resto_personnel_1",
          text: "Les rôles sont-ils clairs dans votre équipe (cuisine, service, caisse), surtout aux heures de pointe ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Rôles définis, organisation des pics maîtrisée" },
            { value: 2, shortLabel: "Partiellement", label: "Rôles flous, organisation improvisée en rush" },
            { value: 0, shortLabel: "Non", label: "Aucune organisation claire", recommendation: "Définissez qui fait quoi pendant le service, en particulier aux heures d'affluence." },
          ],
        },
        {
          id: "resto_personnel_2",
          text: "Votre personnel est-il formé au service et à l'accueil client ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Personnel formé, accueil soigné" },
            { value: 2, shortLabel: "Partiellement", label: "Formation « sur le tas », inégale" },
            { value: 0, shortLabel: "Non", label: "Aucune formation au service", recommendation: "Expliquez à votre équipe les bases d'un bon accueil et d'un service rapide et courtois." },
          ],
        },
        {
          id: "resto_personnel_3",
          text: "Parvenez-vous à garder votre personnel (faible rotation) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Équipe stable, fidélisée" },
            { value: 2, shortLabel: "Partiellement", label: "Rotation moyenne" },
            { value: 0, shortLabel: "Non", label: "Rotation élevée, départs fréquents", recommendation: "Identifiez les raisons de départ de votre personnel et améliorez leurs conditions pour les fidéliser." },
          ],
        },
        {
          id: "resto_personnel_4",
          text: "Gérez-vous bien les pics d'affluence sans dégrader le service ni l'hygiène ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Pics anticipés (renforts, préparation), service maintenu" },
            { value: 2, shortLabel: "Partiellement", label: "Pics gérés dans l'urgence" },
            { value: 0, shortLabel: "Non", label: "Débordement fréquent (attente, erreurs)", recommendation: "Anticipez vos heures de pointe : préparez à l'avance et prévoyez des renforts." },
          ],
        },
        {
          id: "resto_personnel_5",
          text: "Recueillez-vous les avis de vos clients pour améliorer votre offre et votre service ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Avis clients écoutés et pris en compte" },
            { value: 2, shortLabel: "Partiellement", label: "Avis entendus mais rarement suivis d'effet" },
            { value: 0, shortLabel: "Non", label: "Aucune écoute des clients", recommendation: "Demandez régulièrement à vos clients ce qu'ils pensent de vos plats et de votre service, et agissez dessus." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Définissez clairement qui fait quoi pendant le service.",
          "Demandez leur avis à vos clients réguliers.",
        ],
        mid: [
          "Formez votre équipe à l'accueil et au service rapide.",
          "Anticipez vos heures de pointe (préparation, renforts).",
        ],
        high: [
          "Fidélisez votre personnel clé pour réduire la rotation.",
          "Mettez en place un suivi des retours clients pour vous améliorer en continu.",
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
          id: "resto_pilotage_1",
          text: "Do you know your customers well and adapt your menu to their expectations?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Menu adapted to target customers and location" },
            { value: 2, shortLabel: "Partially", label: "Menu partly adapted, partly by habit" },
            { value: 0, shortLabel: "No", label: "Menu built with no customer logic", recommendation: "Track what your customers order most and adjust your menu accordingly." },
          ],
        },
        {
          id: "resto_pilotage_2",
          text: "Are your prices based on your real costs rather than just the going market rate?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Prices set from costs and target margin" },
            { value: 2, shortLabel: "Partially", label: "Prices aligned with competitors, no cost calculation" },
            { value: 0, shortLabel: "No", label: "Prices set on instinct", recommendation: "Work out the food cost of your signature dishes before setting their price." },
          ],
        },
        {
          id: "resto_pilotage_3",
          text: "Do you track your footfall and revenue (covers, average ticket)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Footfall and revenue tracked regularly" },
            { value: 2, shortLabel: "Partially", label: "Rough tracking, from memory" },
            { value: 0, shortLabel: "No", label: "No tracking", recommendation: "Record your daily covers and takings to track your activity." },
          ],
        },
        {
          id: "resto_pilotage_4",
          text: "Do you know which dishes earn you the most (best-selling and most profitable)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Star and profitable dishes identified and promoted" },
            { value: 2, shortLabel: "Partially", label: "Rough idea" },
            { value: 0, shortLabel: "No", label: "Dish contribution unknown", recommendation: "Identify your best-selling and most profitable dishes and highlight them on your menu." },
          ],
        },
        {
          id: "resto_pilotage_5",
          text: "Do you have a plan to grow your restaurant over the next 12 months?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Documented development plan with actions" },
            { value: 2, shortLabel: "Partially", label: "Informal development ideas" },
            { value: 0, shortLabel: "No", label: "No development plan", recommendation: "Define 2 or 3 concrete actions to grow your restaurant this year (delivery, events, capacity)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record your daily covers and most-ordered dishes.",
          "Ask your regular customers what they would like to see on your menu.",
        ],
        mid: [
          "Streamline your menu around your most profitable dishes.",
          "Set your prices from food cost and a target margin.",
        ],
        high: [
          "Set up simple tracking of your sales by dish.",
          "Explore a new channel (delivery, catering, second outlet).",
        ],
      },
    },
    {
      id: "foodcost",
      name: "Food Cost & Sourcing",
      questions: [
        {
          id: "resto_foodcost_1",
          text: "Do you have standardized recipes (same quantities, same portions every time)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Written recipe sheets, consistent portions" },
            { value: 2, shortLabel: "Partially", label: "Recipes passed on verbally, variable portions" },
            { value: 0, shortLabel: "No", label: "Recipes done by eye, portions at random", recommendation: "Write down the ingredients and quantities of your best-sellers to stabilize your portions." },
          ],
        },
        {
          id: "resto_foodcost_2",
          text: "Do you know the food cost of your main dishes?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Food cost known per dish" },
            { value: 2, shortLabel: "Partially", label: "Rough estimate" },
            { value: 0, shortLabel: "No", label: "Food cost unknown", recommendation: "Add up the ingredient cost of a dish and compare it to its selling price." },
          ],
        },
        {
          id: "resto_foodcost_3",
          text: "Do you keep your waste and perishable losses under control?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Production matched to footfall, losses limited and tracked" },
            { value: 2, shortLabel: "Partially", label: "Losses noticed but not measured" },
            { value: 0, shortLabel: "No", label: "Significant waste, frequent overproduction", recommendation: "Track what you throw away for a week to adjust your purchasing and prepared quantities." },
          ],
        },
        {
          id: "resto_foodcost_4",
          text: "Do you manage your food stock (dry and cold) to avoid shortages and losses?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Stock tracked, food rotation (first in, first out)" },
            { value: 2, shortLabel: "Partially", label: "Rough tracking" },
            { value: 0, shortLabel: "No", label: "No tracking, frequent shortages or losses", recommendation: "Check your stock before each order and use the oldest food first." },
          ],
        },
        {
          id: "resto_foodcost_5",
          text: "Is your sourcing diversified and reliable (not dependent on a single supplier)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Several suppliers, secured sourcing" },
            { value: 2, shortLabel: "Partially", label: "One main supplier, a few alternatives" },
            { value: 0, shortLabel: "No", label: "Dependence on a single supplier", recommendation: "Find a second supplier for your key ingredients to avoid shortages." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Write down the ingredients and quantities of your best-selling dishes.",
          "Check your stock before placing an order.",
        ],
        mid: [
          "Calculate the food cost of your 10 best-selling dishes.",
          "Adopt \"first in, first out\" rotation to limit losses.",
        ],
        high: [
          "Adjust your prices and portions based on your real food cost.",
          "Track your waste to optimize your purchasing and production.",
        ],
      },
    },
    {
      id: "hygiene",
      name: "Hygiene & Quality",
      questions: [
        {
          id: "resto_hygiene_1",
          text: "Are you compliant on hygiene (required certificates and permits)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Certificates and permits up to date" },
            { value: 2, shortLabel: "Partially", label: "Partial or expired documents" },
            { value: 0, shortLabel: "No", label: "No compliance in place", recommendation: "Find out which hygiene certificates are required for your establishment and get compliant." },
          ],
        },
        {
          id: "resto_hygiene_2",
          text: "Do you control your cold chain (storing food at the right temperature)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cold chain controlled, temperatures monitored" },
            { value: 2, shortLabel: "Partially", label: "Refrigeration present but poorly monitored" },
            { value: 0, shortLabel: "No", label: "Insufficient refrigeration, risk to food", recommendation: "Regularly check the temperature of your fridges and freezers to protect your food." },
          ],
        },
        {
          id: "resto_hygiene_3",
          text: "Does your staff apply good hygiene practices (handwashing, separating raw/cooked)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Staff trained, good practices applied" },
            { value: 2, shortLabel: "Partially", label: "Practices known but unevenly applied" },
            { value: 0, shortLabel: "No", label: "No hygiene rules applied", recommendation: "Post and explain the basic rules (handwashing, raw/cooked separation) to your whole team." },
          ],
        },
        {
          id: "resto_hygiene_4",
          text: "Is the cleanliness of your kitchen and dining area maintained continuously?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular, organized cleaning (cleaning schedule)" },
            { value: 2, shortLabel: "Partially", label: "Irregular cleaning" },
            { value: 0, shortLabel: "No", label: "Cleanliness neglected", recommendation: "Set up a simple cleaning schedule (what, who, when) for the kitchen and dining area." },
          ],
        },
        {
          id: "resto_hygiene_5",
          text: "Is the quality of your dishes consistent from one service to the next?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Consistent quality thanks to recipes and checks" },
            { value: 2, shortLabel: "Partially", label: "Quality varies by cook or footfall" },
            { value: 0, shortLabel: "No", label: "Inconsistent quality", recommendation: "Standardize your recipes and taste your dishes before service to ensure consistent quality." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Post the basic hygiene rules in the kitchen.",
          "Check your refrigeration temperatures every day.",
        ],
        mid: [
          "Set up a written cleaning schedule for the kitchen and dining area.",
          "Train your team in good practices (hands, raw/cooked, dates).",
        ],
        high: [
          "Get compliant with the required hygiene certificates.",
          "Adopt a quality process (regular checks, customer feedback).",
        ],
      },
    },
    {
      id: "finance",
      name: "Finance, Cash & Digital",
      questions: [
        {
          id: "resto_finance_1",
          text: "Do you keep reliable cash records (income and expenses recorded daily)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash recorded daily, discrepancies checked" },
            { value: 2, shortLabel: "Partially", label: "Irregular recording" },
            { value: 0, shortLabel: "No", label: "No reliable recording", recommendation: "Record your income and expenses every day, even in a simple notebook." },
          ],
        },
        {
          id: "resto_finance_2",
          text: "Do you keep the restaurant's finances separate from your personal money?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Strict separation, distinct accounts" },
            { value: 2, shortLabel: "Partially", label: "Partial separation" },
            { value: 0, shortLabel: "No", label: "Restaurant and personal finances mixed", recommendation: "Open an account (bank or mobile money) used only for the restaurant." },
          ],
        },
        {
          id: "resto_finance_3",
          text: "Do you accept mobile money payments (Wave, Orange Money…)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Mobile money accepted and flows tracked" },
            { value: 2, shortLabel: "Partially", label: "Accepted but poorly tracked" },
            { value: 0, shortLabel: "No", label: "Cash only", recommendation: "Offer mobile money payment: many customers prefer it and you lose sales without it." },
          ],
        },
        {
          id: "resto_finance_4",
          text: "If you do delivery, do you factor platform commissions into your prices?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Commissions factored in, delivery margin controlled" },
            { value: 2, shortLabel: "Partially", label: "Delivery offered without real margin calculation" },
            { value: 0, shortLabel: "No", label: "Commissions absorbed blindly (or delivery not applicable)", recommendation: "Work out what the platform takes and adjust your delivery prices to stay profitable." },
          ],
        },
        {
          id: "resto_finance_5",
          text: "Do you manage your cash flow to pay suppliers and staff without strain?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash flow tracked, payments made on time" },
            { value: 2, shortLabel: "Partially", label: "Irregular tracking, occasional strain" },
            { value: 0, shortLabel: "No", label: "Cash flow out of control, frequent delays", recommendation: "Track your cash and upcoming payments (suppliers, wages, rent) every week." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Record your income and expenses every day.",
          "Accept mobile money so you don't lose customers.",
        ],
        mid: [
          "Open a separate account for the restaurant.",
          "Reconcile your cash (cash + mobile money) with your sales every day.",
        ],
        high: [
          "Factor delivery commissions into your prices.",
          "Set up monthly cash flow tracking.",
        ],
      },
    },
    {
      id: "personnel",
      name: "Staff & Service",
      questions: [
        {
          id: "resto_personnel_1",
          text: "Are roles clear in your team (kitchen, service, cash), especially at peak times?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Roles defined, peak-time organization under control" },
            { value: 2, shortLabel: "Partially", label: "Vague roles, improvised organization during rush" },
            { value: 0, shortLabel: "No", label: "No clear organization", recommendation: "Define who does what during service, especially at busy times." },
          ],
        },
        {
          id: "resto_personnel_2",
          text: "Is your staff trained in service and customer welcome?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Staff trained, attentive welcome" },
            { value: 2, shortLabel: "Partially", label: "On-the-job training, uneven" },
            { value: 0, shortLabel: "No", label: "No service training", recommendation: "Teach your team the basics of a good welcome and fast, courteous service." },
          ],
        },
        {
          id: "resto_personnel_3",
          text: "Are you able to retain your staff (low turnover)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Stable, loyal team" },
            { value: 2, shortLabel: "Partially", label: "Average turnover" },
            { value: 0, shortLabel: "No", label: "High turnover, frequent departures", recommendation: "Identify why staff leave and improve their conditions to retain them." },
          ],
        },
        {
          id: "resto_personnel_4",
          text: "Do you handle rush periods well without degrading service or hygiene?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Peaks anticipated (extra staff, prep), service maintained" },
            { value: 2, shortLabel: "Partially", label: "Peaks handled in a rush" },
            { value: 0, shortLabel: "No", label: "Frequent overload (waiting, mistakes)", recommendation: "Anticipate your rush hours: prep in advance and plan for extra help." },
          ],
        },
        {
          id: "resto_personnel_5",
          text: "Do you gather customer feedback to improve your offer and service?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Customer feedback heard and acted on" },
            { value: 2, shortLabel: "Partially", label: "Feedback heard but rarely acted on" },
            { value: 0, shortLabel: "No", label: "No listening to customers", recommendation: "Regularly ask customers what they think of your food and service, and act on it." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Clearly define who does what during service.",
          "Ask your regular customers for their feedback.",
        ],
        mid: [
          "Train your team in welcome and fast service.",
          "Anticipate your peak hours (prep, extra staff).",
        ],
        high: [
          "Retain your key staff to reduce turnover.",
          "Set up customer feedback tracking for continuous improvement.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques Restaurant
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Critique", en: "Critical" },
    interpretation: {
      fr: "Votre établissement fait face à des risques importants qui menacent sa viabilité. Une action rapide est nécessaire pour structurer sa gestion.",
      en: "Your restaurant faces significant risks that threaten its viability. Immediate action is needed to structure its management.",
    },
  },
  {
    id: "vulnerable",
    min: 40,
    max: 59,
    color: "#f97316",
    label: { fr: "Vulnérable", en: "Vulnerable" },
    interpretation: {
      fr: "Votre établissement fonctionne mais repose sur des bases fragiles. Plusieurs axes de gestion nécessitent une attention prioritaire.",
      en: "Your restaurant is running but rests on fragile foundations. Several management areas require priority attention.",
    },
  },
  {
    id: "stable",
    min: 60,
    max: 79,
    color: "#eab308",
    label: { fr: "Stable", en: "Stable" },
    interpretation: {
      fr: "Votre établissement a des bases solides. Quelques ajustements ciblés amélioreront votre marge et votre régularité.",
      en: "Your restaurant has solid foundations. A few targeted adjustments will improve your margin and consistency.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Prêt pour la croissance", en: "Growth-Ready" },
    interpretation: {
      fr: "Votre établissement est bien structuré et prêt à accélérer, à ouvrir un autre point de vente ou à développer la livraison.",
      en: "Your restaurant is well-structured and ready to accelerate, open another outlet or grow delivery.",
    },
  },
  {
    id: "haute_performance",
    min: 90,
    max: 100,
    color: "#6366f1",
    label: { fr: "Haute performance", en: "High Performance" },
    interpretation: {
      fr: "Votre établissement affiche une excellente maturité de gestion sur l'ensemble des piliers clés. Continuez sur cette lancée !",
      en: "Your restaurant shows excellent management maturity across all key pillars. Keep up the great work!",
    },
  },
];

module.exports = { fr, en, levels };
