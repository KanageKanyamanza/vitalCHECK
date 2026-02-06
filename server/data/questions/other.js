module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "other_finance_1",
					text: "Avez-vous un tableau de bord mensuel avec vos indicateurs clés (CA, Marge, Trésorerie) ?",
					options: [
						{
							label: "Pilotage à vue (solde bancaire uniquement)",
							score: 0,
						},
						{
							label: "Suivi trimestriel ou irrégulier",
							score: 1,
						},
						{
							label: "Tableau de bord mensuel précis",
							score: 3,
						},
					],
				},
				{
					id: "other_finance_2",
					text: "Séparez-vous strictement les finances de l'entreprise et les finances personnelles ?",
					options: [
						{
							label: "Confusion totale des patrimoines",
							score: 0,
						},
						{
							label:
								"Séparation informelle (comptes distincts mais flux croisés)",
							score: 1,
						},
						{
							label: "Séparation juridique et bancaire stricte",
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
					id: "other_operations_1",
					text: "Vos processus clés sont-ils écrits pour pouvoir être délégués si besoin ?",
					options: [
						{
							label: "Tout est dans la tête du dirigeant",
							score: 0,
						},
						{
							label: "Quelques modes opératoires écrits",
							score: 1,
						},
						{
							label: "Processus documentés et standardisés (manuel opératoire)",
							score: 3,
						},
					],
				},
				{
					id: "other_operations_2",
					text: "Cherchez-vous régulièrement à éliminer les tâches à faible valeur ajoutée ?",
					options: [
						{
							label: "Subi quotidien (tête dans le guidon)",
							score: 0,
						},
						{
							label: "Optimisation au coup par coup",
							score: 1,
						},
						{
							label: "Revue systématique et délégation/automatisation",
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
					id: "other_sales_1",
					text: 'Connaissez-vous précisément qui est votre "client idéal" ?',
					options: [
						{
							label: "Non, je vends à tout le monde",
							score: 0,
						},
						{
							label: "Cible vague ou intuitive",
							score: 1,
						},
						{
							label: "Persona client défini et segmenté",
							score: 3,
						},
					],
				},
				{
					id: "other_sales_2",
					text: "Avez-vous un système pour relancer systématiquement les devis non signés ?",
					options: [
						{
							label: "Pas de relance (attente passive)",
							score: 0,
						},
						{
							label: "Relance sporadique quand j'y pense",
							score: 1,
						},
						{
							label: "Processus de relance systématique (J+3, J+7...)",
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
					id: "other_people_1",
					text: "Vos attentes envers vos employés/partenaires sont-elles claires et écrites ?",
					options: [
						{
							label: "Consignes orales floues",
							score: 0,
						},
						{
							label: "Briefs sommaires",
							score: 1,
						},
						{
							label: "Fiches de poste / Contrats d'objectifs clairs",
							score: 3,
						},
					],
				},
				{
					id: "other_people_2",
					text: "Prenez-vous du temps pour la formation et la montée en compétence ?",
					options: [
						{
							label: "Pas de temps/budget pour ça",
							score: 0,
						},
						{
							label: "Auto-formation ponctuelle",
							score: 1,
						},
						{
							label: "Investissement formation régulier",
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
					id: "other_strategy_1",
					text: "Avez-vous des objectifs clairs à 1 an, 3 ans et 5 ans ?",
					options: [
						{
							label: "Navigation à vue (au jour le jour)",
							score: 0,
						},
						{
							label: "Idée générale en tête",
							score: 1,
						},
						{
							label: "Vision écrite et objectifs chiffrés",
							score: 3,
						},
					],
				},
				{
					id: "other_strategy_2",
					text: "Prenez-vous du recul régulièrement pour travailler SUR l'entreprise et non DANS l'entreprise ?",
					options: [
						{
							label: "Jamais, toujours dans l'opérationnel",
							score: 0,
						},
						{
							label: "Rarement (vacances/événements)",
							score: 1,
						},
						{
							label: "Temps stratégique planifié hebdomadaire",
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
					id: "other_technology_1",
					text: "Utilisez-vous les outils numériques de base pour gagner du temps (cloud, agenda partagé) ?",
					options: [
						{
							label: "Outils papier / locaux uniquement",
							score: 0,
						},
						{
							label: "Usage basique (Email, Drive perso)",
							score: 1,
						},
						{
							label: "Suite collaborative pro (Google Worksp./O365) maîtrisée",
							score: 3,
						},
					],
				},
				{
					id: "other_technology_2",
					text: "Vos données importantes sont-elles sauvegardées automatiquement ?",
					options: [
						{
							label: "Aucune sauvegarde externe",
							score: 0,
						},
						{
							label: "Sauvegarde manuelle sur disque dur",
							score: 1,
						},
						{
							label: "Sauvegarde Cloud automatique et sécurisée",
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
					id: "other_risks_1",
					text: "Avez-vous identifié les 3 plus gros risques qui pourraient tuer votre activité ?",
					options: [
						{
							label: "Non, pas de réflexion là-dessus",
							score: 0,
						},
						{
							label: "Vaguement (ex: perte gros client)",
							score: 1,
						},
						{
							label: "Risques identifiés et plans d'atténuation prêts",
							score: 3,
						},
					],
				},
				{
					id: "other_risks_2",
					text: "Êtes-vous en conformité avec les obligations légales de base de votre activité ?",
					options: [
						{
							label: "Ignorance des règles",
							score: 0,
						},
						{
							label: "Conformité supposée",
							score: 1,
						},
						{
							label: "Veille juridique active et conformité assurée",
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
					id: "other_branding_1",
					text: "Votre image professionnelle est-elle cohérente sur tous vos supports (cartes, web, devis) ?",
					options: [
						{
							label: "Image bricolée ou inexistante",
							score: 0,
						},
						{
							label: "Propre mais disparate",
							score: 1,
						},
						{
							label: "Identité visuelle professionnelle et chartée",
							score: 3,
						},
					],
				},
				{
					id: "other_branding_2",
					text: "Demandez-vous systématiquement des témoignages aux clients satisfaits ?",
					options: [
						{
							label: "Jamais",
							score: 0,
						},
						{
							label: "Quand l'occasion se présente",
							score: 1,
						},
						{
							label: "Processus de collecte d'avis automatisé",
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
					id: "other_export_1",
					text: "Votre activité a-t-elle un potentiel hors de votre zone géographique locale ?",
					options: [
						{
							label: "Strictement local",
							score: 0,
						},
						{
							label: "Opportunités régionales possibles",
							score: 1,
						},
						{
							label: "Potentiel national/international identifié",
							score: 3,
						},
					],
				},
				{
					id: "other_export_2",
					text: "Avez-vous identifié les barrières (langue, culture, loi) à l'expansion géographique ?",
					options: [
						{
							label: "Non réfléchi",
							score: 0,
						},
						{
							label: "Quelques idées",
							score: 1,
						},
						{
							label: "Analyse de marché cible réalisée",
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
