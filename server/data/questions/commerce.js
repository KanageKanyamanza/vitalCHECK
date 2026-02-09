module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "commerce_finance_1",
					text: "Surveillez-vous quotidiennement la marge par produit et le taux de rotation des stocks ?",
					options: [
						{
							label: "Pas de suivi précis",
							score: 0,
						},
						{
							label: "Suivi hebdomadaire/mensuel",
							score: 1,
						},
						{
							label: "Suivi quotidien automatisé",
							score: 3,
						},
					],
				},
				{
					id: "commerce_finance_2",
					text: "Avez-vous un plan de trésorerie pour financer les gros achats de stock saisonniers ?",
					options: [
						{
							label: "Non, achats au coup par coup",
							score: 0,
						},
						{
							label: "Budget prévisionnel simple",
							score: 1,
						},
						{
							label: "Plan de trésorerie détaillé et lignes de crédit",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Commencez à tenir des registres financiers mensuels.",
					"Séparez les finances personnelles et professionnelles.",
				],
				amber: [
					"Construisez un prévisionnel de trésorerie.",
					"Suivez de plus près les créances.",
				],
				green: [
					"Explorez les options de financement.",
					"Utilisez des tableaux de bord financiers.",
				],
			},
		},
		{
			id: "operations",
			name: "Opérations",
			questions: [
				{
					id: "commerce_operations_1",
					text: "Votre gestion des stocks est-elle connectée en temps réel à vos points de vente (physique/web) ?",
					options: [
						{
							label: "Non, inventaires manuels périodiques",
							score: 0,
						},
						{
							label: "Connexion partielle (décalage)",
							score: 1,
						},
						{
							label: "Oui, synchronisation temps réel omnicanale",
							score: 3,
						},
					],
				},
				{
					id: "commerce_operations_2",
					text: "Avez-vous optimisé votre processus de traitement des retours et du SAV ?",
					options: [
						{
							label: "Gestion informelle et lente",
							score: 0,
						},
						{
							label: "Processus défini mais perfectible",
							score: 1,
						},
						{
							label: "Gestion fluide et automatisée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Documentez au moins vos processus de base.",
					"Identifiez les goulots d'étranglement.",
				],
				amber: [
					"Standardisez les flux de travail.",
					"Mettez en place des révisions régulières.",
				],
				green: [
					"Automatisez les processus.",
					"Implémentez des analyses avancées.",
				],
			},
		},
		{
			id: "sales",
			name: "Ventes",
			questions: [
				{
					id: "commerce_sales_1",
					text: "Utilisez-vous un programme de fidélité pour augmenter le panier moyen et la fréquence d'achat ?",
					options: [
						{
							label: "Aucun programme",
							score: 0,
						},
						{
							label: "Programme simple (carte à points)",
							score: 1,
						},
						{
							label: "Programme personnalisé (CRM/Automation)",
							score: 3,
						},
					],
				},
				{
					id: "commerce_sales_2",
					text: "Analysez-vous le trafic en magasin/site pour optimiser les taux de conversion ?",
					options: [
						{
							label: "Pas d'analyse de trafic",
							score: 0,
						},
						{
							label: "Estimation du flux",
							score: 1,
						},
						{
							label: "Analyse précise (taux de transformation mesuré)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez clairement vos clients cibles.",
					"Mettez en place une présence numérique de base.",
				],
				amber: [
					"Lancez des campagnes marketing structurées.",
					"Suivez systématiquement les prospects.",
				],
				green: [
					"Optimisez la valeur vie client.",
					"Utilisez l'analyse de données.",
				],
			},
		},
		{
			id: "people",
			name: "RH",
			questions: [
				{
					id: "commerce_people_1",
					text: "Vos vendeurs sont-ils formés et incentivés sur les ventes additionnelles (cross-selling) ?",
					options: [
						{
							label: "Non, salaire fixe sans formation",
							score: 0,
						},
						{
							label: "Formation ponctuelle / Primes floues",
							score: 1,
						},
						{
							label: "Formation continue et commissions structurées",
							score: 3,
						},
					],
				},
				{
					id: "commerce_people_2",
					text: "Comment gérez-vous la flexibilité des plannings lors des pics d'activité (soldes, fêtes) ?",
					options: [
						{
							label: "Surcharge ou manque de personnel",
							score: 0,
						},
						{
							label: "Recours ponctuel à des extras",
							score: 1,
						},
						{
							label: "Plannings optimisés et vivier de renforts",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez clairement les rôles.",
					"Créez des descriptions de poste de base.",
				],
				amber: [
					"Introduisez des évaluations de performance.",
					"Développez des parcours de carrière.",
				],
				green: [
					"Construisez un pipeline de leadership.",
					"Implémentez un logiciel RH complet.",
				],
			},
		},
		{
			id: "strategy",
			name: "Stratégie",
			questions: [
				{
					id: "commerce_strategy_1",
					text: "Avez-vous une stratégie omnicanale claire unifiant l'expérience client physique et digitale ?",
					options: [
						{
							label: "Canaux isolés (Silo)",
							score: 0,
						},
						{
							label: "Début d'unification",
							score: 1,
						},
						{
							label: "Expérience client sans couture (Click & Collect, etc.)",
							score: 3,
						},
					],
				},
				{
					id: "commerce_strategy_2",
					text: "Surveillez-vous activement les prix et l'assortiment de la concurrence directe ?",
					options: [
						{
							label: "Aucune veille",
							score: 0,
						},
						{
							label: "Veille manuelle irrégulière",
							score: 1,
						},
						{
							label: "Veille concurrentielle automatisée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Rédigez un plan d'entreprise d'une page.",
					"Définissez vos avantages concurrentiels.",
				],
				amber: [
					"Tenez des révisions de performance trimestrielles.",
					"Développez des KPI stratégiques.",
				],
				green: [
					"Mettez en place un conseil consultatif.",
					"Implémentez la planification de scénarios.",
				],
			},
		},
		{
			id: "technology",
			name: "Technologie",
			questions: [
				{
					id: "commerce_technology_1",
					text: "Utilisez-vous un CRM pour segmenter votre base client et personnaliser les offres ?",
					options: [
						{
							label: "Pas de CRM",
							score: 0,
						},
						{
							label: "Fichier client simple",
							score: 1,
						},
						{
							label: "CRM intégré avec segmentation et historique",
							score: 3,
						},
					],
				},
				{
					id: "commerce_technology_2",
					text: "Votre site e-commerce est-il optimisé pour le mobile (m-commerce) ?",
					options: [
						{
							label: "Site non responsive",
							score: 0,
						},
						{
							label: "Site responsive basique",
							score: 1,
						},
						{
							label: "Expérience mobile fluide / App dédiée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Adoptez des logiciels métier de base.",
					"Implémentez des sauvegardes régulières.",
				],
				amber: [
					"Sauvegardez régulièrement les données.",
					"Intégrez les systèmes métier.",
				],
				green: ["Intégrez des systèmes avancés (CRM + ERP).", "Explorez l'IA."],
			},
		},
		{
			id: "risks",
			name: "Risques",
			questions: [
				{
					id: "commerce_risks_1",
					text: "Quelles mesures avez-vous contre la démarque inconnue (vol interne/externe) ?",
					options: [
						{
							label: "Aucune mesure particulière",
							score: 0,
						},
						{
							label: "Vidéosurveillance de base",
							score: 1,
						},
						{
							label: "Système complet (EAS, inventaires tournants, procédures)",
							score: 3,
						},
					],
				},
				{
					id: "commerce_risks_2",
					text: "Vos fournisseurs sont-ils diversifiés pour éviter les ruptures d'approvisionnement ?",
					options: [
						{
							label: "Dépendance à 1 seul fournisseur",
							score: 0,
						},
						{
							label: "Quelques alternatives",
							score: 1,
						},
						{
							label: "Sourcing multiple et diversifié",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Identifiez les principaux risques.",
					"Consultez les réglementations applicables.",
				],
				amber: [
					"Développez un processus de gestion des risques.",
					"Effectuez des audits réguliers.",
				],
				green: [
					"Implémentez un système complet de gestion des risques.",
					"Obtenez des certifications.",
				],
			},
		},
		{
			id: "branding",
			name: "Branding",
			questions: [
				{
					id: "commerce_branding_1",
					text: "L'expérience d'unboxing ou en magasin est-elle \"instagrammable\" ou mémorable ?",
					options: [
						{
							label: "Expérience neutre",
							score: 0,
						},
						{
							label: "Soignée et propre",
							score: 1,
						},
						{
							label: "Expérience de marque unique et valorisante",
							score: 3,
						},
					],
				},
				{
					id: "commerce_branding_2",
					text: "Les avis clients sont-ils visibles et gérés activement pour rassurer les prospects ?",
					options: [
						{
							label: "Avis ignorés ou absents",
							score: 0,
						},
						{
							label: "Avis surveillés",
							score: 1,
						},
						{
							label: "Gestion proactive (réponse systématique, sollicitation)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: ["Définissez votre identité de marque.", "Créez un logo de base."],
				amber: [
					"Harmonisez votre branding.",
					"Améliorez la qualité du packaging.",
				],
				green: [
					"Créez une expérience de marque premium.",
					"Investissez dans un packaging innovant.",
				],
			},
		},
		{
			id: "export",
			name: "Export",
			questions: [
				{
					id: "commerce_export_1",
					text: "Avez-vous résolu les défis logistiques et douaniers pour l'expédition internationale ?",
					options: [
						{
							label: "Non, livraison locale uniquement",
							score: 0,
						},
						{
							label: "Livraison frontalière ponctuelle",
							score: 1,
						},
						{
							label: "Logistique export structurée et tarifs négociés",
							score: 3,
						},
					],
				},
				{
					id: "commerce_export_2",
					text: "Vendez-vous sur des marketplaces internationales (Amazon, etc.) pour tester de nouveaux marchés ?",
					options: [
						{
							label: "Uniquement en direct",
							score: 0,
						},
						{
							label: "Présence sur 1 marketplace locale",
							score: 1,
						},
						{
							label: "Vente multicanale sur plusieurs marketplaces globales",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Évaluez le potentiel d'exportation.",
					"Renseignez-vous sur les réglementations.",
				],
				amber: [
					"Développez un plan d'exportation.",
					"Établissez des partenariats locaux.",
				],
				green: [
					"Implémentez une stratégie d'exportation complète.",
					"Créez une présence internationale.",
				],
			},
		},
	],
	scoring: {
		thresholds: {
			red: [0, 39],
			amber: [40, 69],
			green: [70, 100],
		},
		logic:
			"Scores des questions (0, 1, 3) convertis en pourcentage par pilier.",
	},
};
