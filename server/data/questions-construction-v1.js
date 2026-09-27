// Questionnaire sectoriel Construction — PME de construction / BTP structurée (Sénégal / Afrique de l'Ouest)
// Format identique aux autres questionnaires sectoriels : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// Contenu : VitalCHECK_Construction_Questions_Bilingue.md — Septembre 2026

const fr = {
  pillars: [
    {
      id: "chiffrage",
      name: "Chiffrage & Devis",
      questions: [
        {
          id: "construction_chiffrage_1",
          text: "Établissez-vous des devis détaillés (métrés, matériaux, main-d'œuvre) avant de vous engager ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Devis détaillés poste par poste" },
            { value: 2, shortLabel: "Partiellement", label: "Devis approximatifs, au forfait sans détail" },
            { value: 0, shortLabel: "Non", label: "Prix donné « à l'estime », sans calcul", recommendation: "Décomposez vos prochains devis en postes (matériaux, main-d'œuvre, engins) pour ne rien oublier." },
          ],
        },
        {
          id: "construction_chiffrage_2",
          text: "Connaissez-vous la marge que vous visez sur chaque chantier avant de vous engager ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Marge cible définie et intégrée au devis" },
            { value: 2, shortLabel: "Partiellement", label: "Marge estimée vaguement" },
            { value: 0, shortLabel: "Non", label: "Marge inconnue au moment de signer", recommendation: "Fixez une marge minimale à préserver et vérifiez-la sur chaque devis avant de signer." },
          ],
        },
        {
          id: "construction_chiffrage_3",
          text: "Prenez-vous en compte les aléas et la hausse des prix des matériaux dans vos devis ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Provision pour aléas et révision de prix prévue" },
            { value: 2, shortLabel: "Partiellement", label: "Prise en compte partielle" },
            { value: 0, shortLabel: "Non", label: "Aucune marge de sécurité", recommendation: "Ajoutez une provision pour imprévus et hausses de prix dans vos devis (ex. matériaux)." },
          ],
        },
        {
          id: "construction_chiffrage_4",
          text: "Savez-vous quel type de chantier vous est le plus rentable ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Rentabilité comparée connue par type de chantier" },
            { value: 2, shortLabel: "Partiellement", label: "Idée approximative" },
            { value: 0, shortLabel: "Non", label: "Rentabilité par type de chantier inconnue", recommendation: "Comparez, même grossièrement, ce que chaque type de chantier vous laisse comme marge." },
          ],
        },
        {
          id: "construction_chiffrage_5",
          text: "Comparez-vous vos devis à ce que le chantier a réellement coûté (une fois terminé) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Bilan systématique devis vs coût réel" },
            { value: 2, shortLabel: "Partiellement", label: "Bilan occasionnel" },
            { value: 0, shortLabel: "Non", label: "Aucun retour sur les coûts réels", recommendation: "À la fin d'un chantier, comparez le coût réel à votre devis pour améliorer vos prochains chiffrages." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Décomposez vos devis en postes détaillés.",
          "Notez le prix d'achat à jour de vos principaux matériaux.",
        ],
        mid: [
          "Ajoutez systématiquement une provision pour aléas.",
          "Définissez une marge cible minimale par chantier.",
        ],
        high: [
          "Comparez devis et coût réel sur chaque chantier terminé.",
          "Identifiez vos types de chantiers les plus rentables et privilégiez-les.",
        ],
      },
    },
    {
      id: "chantier",
      name: "Gestion de projet & Chantier",
      questions: [
        {
          id: "construction_chantier_1",
          text: "Suivez-vous l'avancement de chaque chantier (délais, étapes) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Avancement suivi régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi informel" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi d'avancement", recommendation: "Fixez des étapes clés par chantier et vérifiez chaque semaine où vous en êtes." },
          ],
        },
        {
          id: "construction_chantier_2",
          text: "Comparez-vous, pendant le chantier, vos coûts réels à votre budget ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Suivi coût réel vs budget en cours de chantier" },
            { value: 2, shortLabel: "Partiellement", label: "Vérification en fin de chantier seulement" },
            { value: 0, shortLabel: "Non", label: "Aucun suivi des coûts en cours", recommendation: "Suivez vos dépenses au fur et à mesure du chantier pour détecter les dérives à temps." },
          ],
        },
        {
          id: "construction_chantier_3",
          text: "Respectez-vous généralement les délais promis à vos clients ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Délais tenus, planning maîtrisé" },
            { value: 2, shortLabel: "Partiellement", label: "Retards occasionnels" },
            { value: 0, shortLabel: "Non", label: "Retards fréquents", recommendation: "Planifiez chaque chantier de façon réaliste et anticipez les points de blocage (livraisons, main-d'œuvre)." },
          ],
        },
        {
          id: "construction_chantier_4",
          text: "Coordonnez-vous bien vos sous-traitants et vos livraisons de matériaux ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Coordination planifiée, peu d'attentes sur chantier" },
            { value: 2, shortLabel: "Partiellement", label: "Coordination improvisée" },
            { value: 0, shortLabel: "Non", label: "Retards et attentes fréquents (sous-traitants, livraisons)", recommendation: "Planifiez à l'avance l'intervention des sous-traitants et les livraisons pour éviter les temps morts." },
          ],
        },
        {
          id: "construction_chantier_5",
          text: "Documentez-vous vos chantiers (photos, notes, situations de travaux) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Suivi documenté, situations de travaux à jour" },
            { value: 2, shortLabel: "Partiellement", label: "Documentation partielle" },
            { value: 0, shortLabel: "Non", label: "Aucune documentation", recommendation: "Prenez des photos et notez l'avancement : c'est utile pour facturer, justifier et gérer les litiges." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Fixez des étapes clés et une date de fin par chantier.",
          "Notez chaque jour ce qui a été fait sur le chantier.",
        ],
        mid: [
          "Suivez vos coûts en cours de chantier, pas seulement à la fin.",
          "Planifiez sous-traitants et livraisons pour éviter les temps morts.",
        ],
        high: [
          "Mettez en place un suivi coût réel vs budget par chantier.",
          "Standardisez vos situations de travaux pour facturer sans retard.",
        ],
      },
    },
    {
      id: "tresorerie",
      name: "Trésorerie & Financement",
      questions: [
        {
          id: "construction_tresorerie_1",
          text: "Anticipez-vous votre besoin de trésorerie par chantier (avances, achats, paie) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Besoin de trésorerie anticipé et suivi" },
            { value: 2, shortLabel: "Partiellement", label: "Anticipation partielle" },
            { value: 0, shortLabel: "Non", label: "Trésorerie subie, tensions fréquentes", recommendation: "Estimez avant chaque chantier l'argent à avancer avant d'être payé, et assurez-vous de l'avoir." },
          ],
        },
        {
          id: "construction_tresorerie_2",
          text: "Suivez-vous le recouvrement de vos paiements clients (relances des impayés) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Recouvrement suivi, retards relancés" },
            { value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier" },
            { value: 0, shortLabel: "Non", label: "Impayés subis, aucun suivi", recommendation: "Tenez une liste de ce que chaque client vous doit et relancez dès qu'un paiement tarde." },
          ],
        },
        {
          id: "construction_tresorerie_3",
          text: "Séparez-vous les finances de l'entreprise de votre argent personnel ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Séparation stricte, comptes distincts" },
            { value: 2, shortLabel: "Partiellement", label: "Séparation partielle" },
            { value: 0, shortLabel: "Non", label: "Finances entreprise et personnel mélangées", recommendation: "Ouvrez un compte dédié à l'entreprise et cessez de mélanger avec votre argent personnel." },
          ],
        },
        {
          id: "construction_tresorerie_4",
          text: "Avez-vous accès à un financement ou à des cautions bancaires quand un chantier l'exige ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Accès à une ligne de trésorerie et/ou aux cautions" },
            { value: 2, shortLabel: "Partiellement", label: "Accès limité ou incertain" },
            { value: 0, shortLabel: "Non", label: "Aucun accès, autofinancement uniquement", recommendation: "Rapprochez-vous d'une banque pour préparer l'accès aux cautions et à une ligne de trésorerie." },
          ],
        },
        {
          id: "construction_tresorerie_5",
          text: "Tenez-vous une comptabilité qui vous permet de présenter des documents à une banque ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Documents de gestion prêts et présentables" },
            { value: 2, shortLabel: "Partiellement", label: "Documents partiels" },
            { value: 0, shortLabel: "Non", label: "Aucun document exploitable par une banque", recommendation: "Tenez et conservez vos comptes et factures : ce sont les documents qu'une banque exige." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Notez ce que chaque client vous doit et les dates de paiement.",
          "Ouvrez un compte séparé pour l'entreprise.",
        ],
        mid: [
          "Estimez le besoin de trésorerie avant de démarrer un chantier.",
          "Relancez systématiquement vos paiements en retard.",
        ],
        high: [
          "Préparez avec une banque l'accès aux cautions et à une ligne de crédit.",
          "Structurez votre comptabilité pour financer votre développement.",
        ],
      },
    },
    {
      id: "approvisionnement",
      name: "Matériaux & Équipements",
      questions: [
        {
          id: "construction_approvisionnement_1",
          text: "Planifiez-vous vos achats de matériaux à l'avance pour éviter les achats d'urgence ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Achats planifiés selon le planning de chantier" },
            { value: 2, shortLabel: "Partiellement", label: "Achats parfois anticipés, parfois en urgence" },
            { value: 0, shortLabel: "Non", label: "Achats systématiquement en urgence (plus chers)", recommendation: "Établissez la liste des matériaux nécessaires par chantier et commandez à l'avance." },
          ],
        },
        {
          id: "construction_approvisionnement_2",
          text: "Travaillez-vous avec plusieurs fournisseurs plutôt qu'un seul ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plusieurs fournisseurs, prix comparés" },
            { value: 2, shortLabel: "Partiellement", label: "Un fournisseur principal, quelques alternatives" },
            { value: 0, shortLabel: "Non", label: "Dépendance à un seul fournisseur", recommendation: "Identifiez un deuxième fournisseur pour vos matériaux clés afin de comparer et sécuriser." },
          ],
        },
        {
          id: "construction_approvisionnement_3",
          text: "Entretenez-vous vos équipements et engins pour éviter les pannes ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Entretien régulier, pannes limitées" },
            { value: 2, shortLabel: "Partiellement", label: "Entretien occasionnel" },
            { value: 0, shortLabel: "Non", label: "Aucun entretien, pannes fréquentes", recommendation: "Mettez en place un entretien simple et régulier de vos engins pour éviter les arrêts de chantier." },
          ],
        },
        {
          id: "construction_approvisionnement_4",
          text: "Choisissez-vous entre achat et location d'engins selon le coût réel ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Arbitrage achat/location réfléchi" },
            { value: 2, shortLabel: "Partiellement", label: "Choix au cas par cas, sans vrai calcul" },
            { value: 0, shortLabel: "Non", label: "Aucun raisonnement coût sur les engins", recommendation: "Comparez le coût de posséder un engin (entretien, immobilisation) à celui de le louer selon vos besoins." },
          ],
        },
        {
          id: "construction_approvisionnement_5",
          text: "Limitez-vous les pertes et le gaspillage de matériaux sur vos chantiers ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Pertes suivies et limitées" },
            { value: 2, shortLabel: "Partiellement", label: "Pertes constatées mais non mesurées" },
            { value: 0, shortLabel: "Non", label: "Gaspillage important non maîtrisé", recommendation: "Surveillez les matériaux les plus coûteux et sécurisez leur stockage sur chantier." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Faites la liste des matériaux nécessaires avant chaque chantier.",
          "Notez chaque panne d'engin pour anticiper l'entretien.",
        ],
        mid: [
          "Comparez les prix d'au moins deux fournisseurs.",
          "Adoptez un entretien préventif régulier de vos engins.",
        ],
        high: [
          "Arbitrez achat vs location selon le coût réel d'utilisation.",
          "Suivez et réduisez le gaspillage de matériaux sur chantier.",
        ],
      },
    },
    {
      id: "qualite",
      name: "Main-d'œuvre, Qualité & Formalisation",
      questions: [
        {
          id: "construction_qualite_1",
          text: "Assurez-vous l'encadrement et la supervision de vos chantiers ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Chef de chantier / supervision en place" },
            { value: 2, shortLabel: "Partiellement", label: "Supervision irrégulière" },
            { value: 0, shortLabel: "Non", label: "Peu ou pas de supervision", recommendation: "Désignez un responsable par chantier pour superviser le travail et la qualité." },
          ],
        },
        {
          id: "construction_qualite_2",
          text: "Maîtrisez-vous la qualité pour limiter les reprises et les malfaçons ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Qualité contrôlée, peu de reprises" },
            { value: 2, shortLabel: "Partiellement", label: "Reprises occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Malfaçons et reprises fréquentes (coûts, litiges)", recommendation: "Contrôlez les points sensibles avant de passer à l'étape suivante pour éviter les reprises coûteuses." },
          ],
        },
        {
          id: "construction_qualite_3",
          text: "Parvenez-vous à mobiliser une main-d'œuvre qualifiée quand vous en avez besoin ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Équipe qualifiée disponible et fidélisée" },
            { value: 2, shortLabel: "Partiellement", label: "Difficulté à trouver des profils qualifiés" },
            { value: 0, shortLabel: "Non", label: "Manque chronique de main-d'œuvre qualifiée", recommendation: "Constituez un réseau de compagnons qualifiés fiables que vous pouvez rappeler chantier après chantier." },
          ],
        },
        {
          id: "construction_qualite_4",
          text: "Prenez-vous en compte la sécurité sur vos chantiers ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Règles de sécurité appliquées, équipements fournis" },
            { value: 2, shortLabel: "Partiellement", label: "Sécurité partielle" },
            { value: 0, shortLabel: "Non", label: "Aucune mesure de sécurité", recommendation: "Fournissez les équipements de base (casques, gants) et rappelez les règles de sécurité à l'équipe." },
          ],
        },
        {
          id: "construction_qualite_5",
          text: "Votre entreprise est-elle assez formalisée pour accéder aux marchés (pièces, contrats) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Entreprise formalisée, apte aux marchés publics et privés" },
            { value: 2, shortLabel: "Partiellement", label: "Formalisation incomplète" },
            { value: 0, shortLabel: "Non", label: "Peu formalisée, exclue des marchés structurés", recommendation: "Mettez à jour vos pièces administratives et vos contrats pour accéder aux marchés publics et privés." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Désignez un responsable par chantier.",
          "Fournissez les équipements de sécurité de base.",
        ],
        mid: [
          "Contrôlez la qualité aux étapes clés pour éviter les reprises.",
          "Constituez un réseau de main-d'œuvre qualifiée fiable.",
        ],
        high: [
          "Formalisez votre entreprise pour accéder aux marchés publics.",
          "Mettez en place une démarche qualité et sécurité sur vos chantiers.",
        ],
      },
    },
  ],
};

const en = {
  pillars: [
    {
      id: "chiffrage",
      name: "Estimating & Quotes",
      questions: [
        {
          id: "construction_chiffrage_1",
          text: "Do you prepare detailed quotes (measurements, materials, labor) before committing?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Detailed quotes, line by line" },
            { value: 2, shortLabel: "Partially", label: "Rough quotes, lump sum with no detail" },
            { value: 0, shortLabel: "No", label: "Price given by rough guess, no calculation", recommendation: "Break your next quotes into line items (materials, labor, equipment) so nothing is missed." },
          ],
        },
        {
          id: "construction_chiffrage_2",
          text: "Do you know the margin you target on each project before committing?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Target margin defined and built into the quote" },
            { value: 2, shortLabel: "Partially", label: "Margin roughly estimated" },
            { value: 0, shortLabel: "No", label: "Margin unknown at signing", recommendation: "Set a minimum margin to protect and check it on every quote before signing." },
          ],
        },
        {
          id: "construction_chiffrage_3",
          text: "Do you factor contingencies and material price rises into your quotes?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Contingency and price-revision allowance included" },
            { value: 2, shortLabel: "Partially", label: "Partly accounted for" },
            { value: 0, shortLabel: "No", label: "No safety margin", recommendation: "Add an allowance for contingencies and price rises in your quotes (e.g. materials)." },
          ],
        },
        {
          id: "construction_chiffrage_4",
          text: "Do you know which type of project is most profitable for you?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Comparative profitability known by project type" },
            { value: 2, shortLabel: "Partially", label: "Rough idea" },
            { value: 0, shortLabel: "No", label: "Profitability by project type unknown", recommendation: "Compare, even roughly, the margin each type of project leaves you." },
          ],
        },
        {
          id: "construction_chiffrage_5",
          text: "Do you compare your quotes to what the project actually cost (once finished)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Systematic quote-vs-actual review" },
            { value: 2, shortLabel: "Partially", label: "Occasional review" },
            { value: 0, shortLabel: "No", label: "No review of actual costs", recommendation: "At the end of a project, compare the actual cost to your quote to improve your future estimates." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Break your quotes into detailed line items.",
          "Keep an up-to-date purchase price for your main materials.",
        ],
        mid: [
          "Always add a contingency allowance.",
          "Define a minimum target margin per project.",
        ],
        high: [
          "Compare quote and actual cost on every finished project.",
          "Identify your most profitable project types and prioritize them.",
        ],
      },
    },
    {
      id: "chantier",
      name: "Project & Site Management",
      questions: [
        {
          id: "construction_chantier_1",
          text: "Do you track the progress of each project (deadlines, milestones)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Progress tracked regularly" },
            { value: 2, shortLabel: "Partially", label: "Informal tracking" },
            { value: 0, shortLabel: "No", label: "No progress tracking", recommendation: "Set key milestones per project and check your progress every week." },
          ],
        },
        {
          id: "construction_chantier_2",
          text: "During the project, do you compare your actual costs to your budget?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Actual-vs-budget tracking during the project" },
            { value: 2, shortLabel: "Partially", label: "Checked only at the end" },
            { value: 0, shortLabel: "No", label: "No cost tracking during the project", recommendation: "Track your spending as the project progresses to catch overruns in time." },
          ],
        },
        {
          id: "construction_chantier_3",
          text: "Do you generally meet the deadlines promised to your clients?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Deadlines met, schedule under control" },
            { value: 2, shortLabel: "Partially", label: "Occasional delays" },
            { value: 0, shortLabel: "No", label: "Frequent delays", recommendation: "Plan each project realistically and anticipate bottlenecks (deliveries, labor)." },
          ],
        },
        {
          id: "construction_chantier_4",
          text: "Do you coordinate your subcontractors and material deliveries well?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Coordination planned, little downtime on site" },
            { value: 2, shortLabel: "Partially", label: "Improvised coordination" },
            { value: 0, shortLabel: "No", label: "Frequent delays and waiting (subcontractors, deliveries)", recommendation: "Plan subcontractor work and deliveries ahead to avoid downtime." },
          ],
        },
        {
          id: "construction_chantier_5",
          text: "Do you document your projects (photos, notes, progress reports)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Documented tracking, progress reports up to date" },
            { value: 2, shortLabel: "Partially", label: "Partial documentation" },
            { value: 0, shortLabel: "No", label: "No documentation", recommendation: "Take photos and note progress: useful for invoicing, proof and handling disputes." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Set key milestones and an end date per project.",
          "Note each day what was done on site.",
        ],
        mid: [
          "Track your costs during the project, not just at the end.",
          "Plan subcontractors and deliveries to avoid downtime.",
        ],
        high: [
          "Set up actual-vs-budget tracking per project.",
          "Standardize your progress reports to invoice without delay.",
        ],
      },
    },
    {
      id: "tresorerie",
      name: "Cash Flow & Financing",
      questions: [
        {
          id: "construction_tresorerie_1",
          text: "Do you anticipate your cash needs per project (advances, purchases, payroll)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Cash needs anticipated and tracked" },
            { value: 2, shortLabel: "Partially", label: "Partial anticipation" },
            { value: 0, shortLabel: "No", label: "Cash flow out of control, frequent strain", recommendation: "Before each project, estimate the cash to advance before being paid, and make sure you have it." },
          ],
        },
        {
          id: "construction_tresorerie_2",
          text: "Do you track collection of client payments (following up unpaid invoices)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Collection tracked, late payments chased" },
            { value: 2, shortLabel: "Partially", label: "Irregular tracking" },
            { value: 0, shortLabel: "No", label: "Unpaid invoices left unmanaged", recommendation: "Keep a list of what each client owes you and follow up as soon as a payment is late." },
          ],
        },
        {
          id: "construction_tresorerie_3",
          text: "Do you keep the company's finances separate from your personal money?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Strict separation, distinct accounts" },
            { value: 2, shortLabel: "Partially", label: "Partial separation" },
            { value: 0, shortLabel: "No", label: "Company and personal finances mixed", recommendation: "Open a dedicated company account and stop mixing it with your personal money." },
          ],
        },
        {
          id: "construction_tresorerie_4",
          text: "Do you have access to financing or bank guarantees when a project requires it?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Access to a credit line and/or guarantees" },
            { value: 2, shortLabel: "Partially", label: "Limited or uncertain access" },
            { value: 0, shortLabel: "No", label: "No access, self-financing only", recommendation: "Approach a bank to set up access to guarantees and a credit line." },
          ],
        },
        {
          id: "construction_tresorerie_5",
          text: "Do you keep accounts that let you present documents to a bank?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Management documents ready and presentable" },
            { value: 2, shortLabel: "Partially", label: "Partial documents" },
            { value: 0, shortLabel: "No", label: "No documents usable by a bank", recommendation: "Keep and store your accounts and invoices: these are the documents a bank requires." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Note what each client owes you and the payment dates.",
          "Open a separate account for the company.",
        ],
        mid: [
          "Estimate the cash need before starting a project.",
          "Systematically follow up on late payments.",
        ],
        high: [
          "Set up bank access to guarantees and a credit line.",
          "Structure your accounts to finance your growth.",
        ],
      },
    },
    {
      id: "approvisionnement",
      name: "Materials & Equipment",
      questions: [
        {
          id: "construction_approvisionnement_1",
          text: "Do you plan your material purchases ahead to avoid emergency buying?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Purchases planned according to the project schedule" },
            { value: 2, shortLabel: "Partially", label: "Sometimes planned, sometimes urgent" },
            { value: 0, shortLabel: "No", label: "Systematically emergency buying (more expensive)", recommendation: "Draw up the list of materials needed per project and order ahead." },
          ],
        },
        {
          id: "construction_approvisionnement_2",
          text: "Do you work with several suppliers rather than just one?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Several suppliers, prices compared" },
            { value: 2, shortLabel: "Partially", label: "One main supplier, a few alternatives" },
            { value: 0, shortLabel: "No", label: "Dependence on a single supplier", recommendation: "Find a second supplier for your key materials to compare and secure supply." },
          ],
        },
        {
          id: "construction_approvisionnement_3",
          text: "Do you maintain your equipment and machinery to avoid breakdowns?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Regular maintenance, breakdowns limited" },
            { value: 2, shortLabel: "Partially", label: "Occasional maintenance" },
            { value: 0, shortLabel: "No", label: "No maintenance, frequent breakdowns", recommendation: "Set up simple, regular maintenance of your machinery to avoid site stoppages." },
          ],
        },
        {
          id: "construction_approvisionnement_4",
          text: "Do you choose between buying and renting machinery based on real cost?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Considered buy-vs-rent decisions" },
            { value: 2, shortLabel: "Partially", label: "Case-by-case, without real calculation" },
            { value: 0, shortLabel: "No", label: "No cost reasoning on machinery", recommendation: "Compare the cost of owning a machine (maintenance, idle time) to renting it based on your needs." },
          ],
        },
        {
          id: "construction_approvisionnement_5",
          text: "Do you limit material losses and waste on your sites?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Losses tracked and limited" },
            { value: 2, shortLabel: "Partially", label: "Losses noticed but not measured" },
            { value: 0, shortLabel: "No", label: "Significant, uncontrolled waste", recommendation: "Watch your most expensive materials and secure their storage on site." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "List the materials needed before each project.",
          "Log each machinery breakdown to anticipate maintenance.",
        ],
        mid: [
          "Compare prices from at least two suppliers.",
          "Adopt regular preventive maintenance of your machinery.",
        ],
        high: [
          "Decide buy vs rent based on real usage cost.",
          "Track and reduce material waste on site.",
        ],
      },
    },
    {
      id: "qualite",
      name: "Workforce, Quality & Compliance",
      questions: [
        {
          id: "construction_qualite_1",
          text: "Do you ensure supervision and oversight of your sites?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Site manager / supervision in place" },
            { value: 2, shortLabel: "Partially", label: "Irregular supervision" },
            { value: 0, shortLabel: "No", label: "Little or no supervision", recommendation: "Appoint a lead per project to oversee the work and quality." },
          ],
        },
        {
          id: "construction_qualite_2",
          text: "Do you control quality to limit rework and defects?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Quality checked, little rework" },
            { value: 2, shortLabel: "Partially", label: "Occasional rework" },
            { value: 0, shortLabel: "No", label: "Frequent defects and rework (costs, disputes)", recommendation: "Check critical points before moving to the next stage to avoid costly rework." },
          ],
        },
        {
          id: "construction_qualite_3",
          text: "Are you able to mobilize skilled labor when you need it?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Skilled team available and retained" },
            { value: 2, shortLabel: "Partially", label: "Difficulty finding skilled workers" },
            { value: 0, shortLabel: "No", label: "Chronic shortage of skilled labor", recommendation: "Build a network of reliable skilled workers you can call back project after project." },
          ],
        },
        {
          id: "construction_qualite_4",
          text: "Do you address safety on your sites?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Safety rules applied, equipment provided" },
            { value: 2, shortLabel: "Partially", label: "Partial safety measures" },
            { value: 0, shortLabel: "No", label: "No safety measures", recommendation: "Provide basic equipment (helmets, gloves) and remind the team of safety rules." },
          ],
        },
        {
          id: "construction_qualite_5",
          text: "Is your company formalized enough to access contracts (documents, agreements)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Formalized company, eligible for public and private contracts" },
            { value: 2, shortLabel: "Partially", label: "Incomplete formalization" },
            { value: 0, shortLabel: "No", label: "Barely formalized, excluded from structured contracts", recommendation: "Update your administrative documents and contracts to access public and private contracts." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Appoint a lead per project.",
          "Provide basic safety equipment.",
        ],
        mid: [
          "Check quality at key stages to avoid rework.",
          "Build a reliable skilled-labor network.",
        ],
        high: [
          "Formalize your company to access public contracts.",
          "Set up a quality and safety approach on your sites.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques Construction
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Critique", en: "Critical" },
    interpretation: {
      fr: "Votre entreprise fait face à des risques importants qui menacent sa viabilité. Une action rapide est nécessaire pour structurer sa gestion.",
      en: "Your construction business faces significant risks that threaten its viability. Immediate action is needed to structure its management.",
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
      fr: "Votre entreprise a des bases solides. Quelques ajustements ciblés sécuriseront vos marges et vos chantiers.",
      en: "Your business has solid foundations. A few targeted adjustments will secure your margins and projects.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Prêt pour la croissance", en: "Growth-Ready" },
    interpretation: {
      fr: "Votre entreprise est bien structurée et prête à décrocher de plus gros marchés et à sécuriser son financement.",
      en: "Your business is well-structured and ready to win larger contracts and secure financing.",
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
