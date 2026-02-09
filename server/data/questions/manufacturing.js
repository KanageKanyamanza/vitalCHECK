module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "manufacturing_finance_1",
					text: "Connaissez-vous le coût de revient industriel exact de chaque unité produite ?",
					options: [
						{
							label: "Non, estimation globale uniquement",
							score: 0,
						},
						{
							label: "Calcul périodique (trimestriel/annuel)",
							score: 1,
						},
						{
							label: "Oui, coût standard vs réel suivi en temps réel",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_finance_2",
					text: "Avez-vous calculé le seuil de rentabilité de vos équipements majeurs ?",
					options: [
						{
							label: "Non, achat basé sur le besoin immédiat",
							score: 0,
						},
						{
							label: "Calcul théorique à l'achat",
							score: 1,
						},
						{
							label: "Suivi précis du ROI et taux d'utilisation",
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
					id: "manufacturing_operations_1",
					text: "Avez-vous une démarche d'amélioration continue (Lean, Kaizen) pour réduire les déchets ?",
					options: [
						{
							label: "Production traditionnelle sans méthode",
							score: 0,
						},
						{
							label: "Actions ponctuelles de nettoyage/rangement",
							score: 1,
						},
						{
							label: "Démarche Lean/5S structurée et active",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_operations_2",
					text: "La maintenance préventive de vos machines est-elle planifiée et respectée ?",
					options: [
						{
							label: "Maintenance corrective (quand ça casse)",
							score: 0,
						},
						{
							label: "Planification théorique peu suivie",
							score: 1,
						},
						{
							label: "Maintenance prédictive ou préventive rigoureuse",
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
					id: "manufacturing_sales_1",
					text: "Votre carnet de commandes offre-t-il une visibilité suffisante sur la production à venir ?",
					options: [
						{
							label: "Flux tendu sans visibilité (< 1 semaine)",
							score: 0,
						},
						{
							label: "Visibilité moyenne (1 mois)",
							score: 1,
						},
						{
							label: "Visibilité forte (> 3 mois) sécurisée",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_sales_2",
					text: "Travaillez-vous avec des distributeurs ou en vente directe aux industriels/consommateurs ?",
					options: [
						{
							label: "Dépendance à un seul canal/intermédiaire",
							score: 0,
						},
						{
							label: "Mixte mais peu optimisé",
							score: 1,
						},
						{
							label: "Stratégie multicanale maîtrisée",
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
					id: "manufacturing_people_1",
					text: "La sécurité au travail (EPI, formations) est-elle votre priorité absolue ?",
					options: [
						{
							label: "Respect minimal des obligations légales",
							score: 0,
						},
						{
							label: "Actions de sensibilisation régulières",
							score: 1,
						},
						{
							label: "Culture sécurité « Zéro accident » proactive",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_people_2",
					text: "Avez-vous des plans de polyvalence pour pallier l'absence d'opérateurs clés ?",
					options: [
						{
							label: "Forte dépendance aux individus",
							score: 0,
						},
						{
							label: "Polyvalence informelle",
							score: 1,
						},
						{
							label: "Matrice de polyvalence gérée et à jour",
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
					id: "manufacturing_strategy_1",
					text: "Avez-vous sécurisé vos approvisionnements stratégiques (double sourcing) ?",
					options: [
						{
							label: "Fournisseurs uniques critiques",
							score: 0,
						},
						{
							label: "Quelques alternatives identifiées",
							score: 1,
						},
						{
							label: "Double sourcing actif sur composants clés",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_strategy_2",
					text: "Investissez-vous dans la modernisation de l'outil industriel (Industrie 4.0) ?",
					options: [
						{
							label: "Parc machine vieillissant",
							score: 0,
						},
						{
							label: "Renouvellement ponctuel",
							score: 1,
						},
						{
							label: "Investissement continu et digitalisation",
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
					id: "manufacturing_technology_1",
					text: "Utilisez-vous un ERP/GPAO pour piloter la production et les stocks en temps réel ?",
					options: [
						{
							label: "Aucun outil ou Excel dispersé",
							score: 0,
						},
						{
							label: "ERP/GPAO basique ou mal utilisé",
							score: 1,
						},
						{
							label: "Système intégré pilotant toute l'usine",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_technology_2",
					text: "Avez-vous digitalisé les fiches de suivi de production (zéro papier) ?",
					options: [
						{
							label: "Tout papier (risques d'erreurs)",
							score: 0,
						},
						{
							label: "Saisie informatique a posteriori",
							score: 1,
						},
						{
							label: "Saisie atelier sur tablettes/terminaux",
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
					id: "manufacturing_risks_1",
					text: "Vos installations sont-elles aux normes environnementales et incendie ?",
					options: [
						{
							label: "Non-conformités connues",
							score: 0,
						},
						{
							label: "Conforme à l'essentiel",
							score: 1,
						},
						{
							label: "Certification ISO 14001 / Conformité totale",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_risks_2",
					text: "Avez-vous un plan de continuité en cas de rupture de la chaîne logistique ?",
					options: [
						{
							label: "Aucun plan de secours",
							score: 0,
						},
						{
							label: "Stocks de sécurité augmentés",
							score: 1,
						},
						{
							label: "PCA formalisé et chaîne logistique agile",
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
					id: "manufacturing_branding_1",
					text: "Le design industriel de vos produits est-il un facteur de différenciation ?",
					options: [
						{
							label: "Design fonctionnel basique",
							score: 0,
						},
						{
							label: "Design soigné mais standard",
							score: 1,
						},
						{
							label: "Design innovant et marque de fabrique",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_branding_2",
					text: "Communiquez-vous sur la qualité de fabrication et l'origine (Made in...) ?",
					options: [
						{
							label: "Absence de communication",
							score: 0,
						},
						{
							label: "Mention simple",
							score: 1,
						},
						{
							label: "Qualité/Origine comme argument central",
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
					id: "manufacturing_export_1",
					text: "Vos produits respectent-ils les normes techniques (CE, UL, ISO) des pays cibles ?",
					options: [
						{
							label: "Normes locales uniquement",
							score: 0,
						},
						{
							label: "En cours d'homologation",
							score: 1,
						},
						{
							label: "Certifications internationales valides",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_export_2",
					text: "Avez-vous un réseau de partenaires locaux pour le SAV et la maintenance à l'export ?",
					options: [
						{
							label: "Pas de SAV export",
							score: 0,
						},
						{
							label: "SAV depuis le siège (délais longs)",
							score: 1,
						},
						{
							label: "Réseau de maintenance agréé localement",
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
