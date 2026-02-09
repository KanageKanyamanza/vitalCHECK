module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "education_finance_1",
					text: "Avez-vous diversifié vos sources de revenus (frais scolarité, subventions, formation continue) ?",
					options: [
						{
							label: "Dépendance unique (ex: frais de scolarité seuls)",
							score: 0,
						},
						{
							label: "2 sources de revenus (ex: Frais + Subventions)",
							score: 1,
						},
						{
							label: "Revenus multiples et équilibrés",
							score: 3,
						},
					],
				},
				{
					id: "education_finance_2",
					text: "Suivez-vous le coût d'acquisition par étudiant et sa valeur sur la durée (LTV) ?",
					options: [
						{
							label: "Pas de suivi des coûts de recrutement",
							score: 0,
						},
						{
							label: "Suivi global sans distinction par canal",
							score: 1,
						},
						{
							label: "Suivi précis du ROI par campagne/étudiant",
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
					id: "education_operations_1",
					text: "L'organisation des emplois du temps et des salles est-elle optimisée ?",
					options: [
						{
							label: "Gestion manuelle conflictuelle",
							score: 0,
						},
						{
							label: "Utilisation de tableurs (Excel)",
							score: 1,
						},
						{
							label: "Logiciel de planification automatisé",
							score: 3,
						},
					],
				},
				{
					id: "education_operations_2",
					text: "Avez-vous des processus de suivi pédagogique pour limiter le décrochage scolaire ?",
					options: [
						{
							label: "Absence de suivi structuré",
							score: 0,
						},
						{
							label: "Suivi informel par les professeurs",
							score: 1,
						},
						{
							label: "Système d'alerte et tutorat systématique",
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
			name: "Ventes (Admissions)",
			questions: [
				{
					id: "education_sales_1",
					text: "Participez-vous activement aux salons et journées portes ouvertes (physiques/virtuels) ?",
					options: [
						{
							label: "Aucune présence événementielle",
							score: 0,
						},
						{
							label: "Présence locale restreinte",
							score: 1,
						},
						{
							label: "Stratégie de recrutement multicanale active",
							score: 3,
						},
					],
				},
				{
					id: "education_sales_2",
					text: "Votre réseau d'anciens élèves (Alumni) est-il mobilisé pour attirer de nouveaux étudiants ?",
					options: [
						{
							label: "Réseau inexistant ou inactif",
							score: 0,
						},
						{
							label: "Annuaire simple des anciens",
							score: 1,
						},
						{
							label: "Réseau structuré et ambassadeurs actifs",
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
					id: "education_people_1",
					text: "Comment évaluez-vous la qualité pédagogique de vos enseignants ?",
					options: [
						{
							label: "Pas d'évaluation formelle",
							score: 0,
						},
						{
							label: "Questionnaires étudiants annuels",
							score: 1,
						},
						{
							label: "Audits pédagogiques et observation par les pairs",
							score: 3,
						},
					],
				},
				{
					id: "education_people_2",
					text: "Le personnel administratif est-il formé à l'accueil et au service aux étudiants ?",
					options: [
						{
							label: "Accueil informel sans standards",
							score: 0,
						},
						{
							label: "Formation ponctuelle",
							score: 1,
						},
						{
							label: "Culture de service et formation continue",
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
					id: "education_strategy_1",
					text: "Vos programmes sont-ils régulièrement mis à jour pour coller aux besoins du marché du travail ?",
					options: [
						{
							label: "Programmes figés depuis des années",
							score: 0,
						},
						{
							label: "Révision tous les 3-5 ans",
							score: 1,
						},
						{
							label: "Actualisation annuelle avec comités d'experts",
							score: 3,
						},
					],
				},
				{
					id: "education_strategy_2",
					text: "Avez-vous des partenariats stratégiques avec des entreprises ou d'autres écoles ?",
					options: [
						{
							label: "Isolement institutionnel",
							score: 0,
						},
						{
							label: "Quelques stages en entreprise",
							score: 1,
						},
						{
							label: "Double diplômes et chaires d'entreprises",
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
					id: "education_technology_1",
					text: "Disposez-vous d'une plateforme d'E-learning (LMS) performante et riche en contenu ?",
					options: [
						{
							label: "Cours papier uniquement",
							score: 0,
						},
						{
							label: "Dépôt de fichiers simple (PDF/Drive)",
							score: 1,
						},
						{
							label: "LMS interactif complet (Moodle, Canvas, etc.)",
							score: 3,
						},
					],
				},
				{
					id: "education_technology_2",
					text: "Les équipements informatiques mis à disposition des étudiants sont-ils à jour ?",
					options: [
						{
							label: "Matériel obsolète ou insuffisant",
							score: 0,
						},
						{
							label: "Matériel fonctionnel mais vieillissant",
							score: 1,
						},
						{
							label: "Parc récent et haut débit systématique",
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
					id: "education_risks_1",
					text: "Avez-vous une politique stricte contre le harcèlement et pour la sécurité des élèves ?",
					options: [
						{
							label: "Absence de politique définie",
							score: 0,
						},
						{
							label: "Sensibilisation ponctuelle",
							score: 1,
						},
						{
							label: "Cellule d'écoute et protocoles de protection",
							score: 3,
						},
					],
				},
				{
					id: "education_risks_2",
					text: "La protection des données personnelles des mineurs/étudiants est-elle assurée ?",
					options: [
						{
							label: "Aucune mesure RGPD spécifique",
							score: 0,
						},
						{
							label: "Conformité partielle",
							score: 1,
						},
						{
							label: "Conformité totale et audits réguliers",
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
					id: "education_branding_1",
					text: "Votre établissement est-il accrédité ou reconnu par les classements officiels ?",
					options: [
						{
							label: "Aucune reconnaissance officielle",
							score: 0,
						},
						{
							label: "Reconnaissance locale ou en cours",
							score: 1,
						},
						{
							label: "Accréditations nationales/internationales",
							score: 3,
						},
					],
				},
				{
					id: "education_branding_2",
					text: "Communiquez-vous sur les taux de réussite et d'insertion professionnelle ?",
					options: [
						{
							label: "Pas de suivi de l'insertion",
							score: 0,
						},
						{
							label: "Suivi déclaratif partiel",
							score: 1,
						},
						{
							label: "Statistiques certifiées et publiées",
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
					id: "education_export_1",
					text: "Avez-vous des programmes d'échange internationaux ou des doubles diplômes ?",
					options: [
						{
							label: "Focalisation locale uniquement",
							score: 0,
						},
						{
							label: "Quelques partenariats ponctuels",
							score: 1,
						},
						{
							label: "Vaste réseau Erasmus / Mobilité active",
							score: 3,
						},
					],
				},
				{
					id: "education_export_2",
					text: "Vos formations sont-elles accessibles aux étudiants étrangers (cours en anglais, visas) ?",
					options: [
						{
							label: "Cours en langue locale uniquement",
							score: 0,
						},
						{
							label: "Accueil ponctuel d'étrangers",
							score: 1,
						},
						{
							label: "Cursus internationaux et accompagnement visas",
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
