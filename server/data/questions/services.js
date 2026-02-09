module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "services_finance_1",
					text: "Calculez-vous la rentabilité réelle par mission/projet (heures vendues vs heures passées) ?",
					options: [
						{
							label: "Rentabilité inconnue par projet",
							score: 0,
						},
						{
							label: "Estimation a posteriori",
							score: 1,
						},
						{
							label: "Suivi précis et temps réel (Timesheets)",
							score: 3,
						},
					],
				},
				{
					id: "services_finance_2",
					text: "Avez-vous automatisé la facturation récurrente (abonnements) pour sécuriser le cash-flow ?",
					options: [
						{
							label: "Facturation manuelle et irrégulière",
							score: 0,
						},
						{
							label: "Processus mensuel manuel",
							score: 1,
						},
						{
							label: "Prélèvement automatique et facturation automatisée",
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
					id: "services_operations_1",
					text: "Vos processus d'onboarding client sont-ils standardisés pour garantir une qualité constante ?",
					options: [
						{
							label: "Chaque onboarding est une improvisation",
							score: 0,
						},
						{
							label: "Checklist simple utilisée",
							score: 1,
						},
						{
							label: "Parcours client automatisé et standardisé",
							score: 3,
						},
					],
				},
				{
					id: "services_operations_2",
					text: "Utilisez-vous un outil de gestion de projet partagé pour le suivi des livrables ?",
					options: [
						{
							label: "Échanes par email uniquement",
							score: 0,
						},
						{
							label: "Outil interne non partagé",
							score: 1,
						},
						{
							label: "Plateforme collaborative avec le client",
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
					id: "services_sales_1",
					text: "Avez-vous une stratégie de recommandation active pour générer du bouche-à-oreille qualifié ?",
					options: [
						{
							label: "Attente passive des recommandations",
							score: 0,
						},
						{
							label: "Demande informelle ponctuelle",
							score: 1,
						},
						{
							label: "Programme de parrainage structuré",
							score: 3,
						},
					],
				},
				{
					id: "services_sales_2",
					text: "Votre proposition de valeur est-elle clairement différenciée des concurrents généralistes ?",
					options: [
						{
							label: 'Offre "Je fais tout" (Généraliste)',
							score: 0,
						},
						{
							label: "Spécialisation par secteur ou métier",
							score: 1,
						},
						{
							label: "Expertise de niche unique et reconnue",
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
					id: "services_people_1",
					text: "Comment partagez-vous la connaissance en interne pour ne pas dépendre d'un seul expert ?",
					options: [
						{
							label: "Silos de connaissances (Risque élevé)",
							score: 0,
						},
						{
							label: "Réunions de partage informelles",
							score: 1,
						},
						{
							label: "Base de connaissances (Wiki) et mentorat",
							score: 3,
						},
					],
				},
				{
					id: "services_people_2",
					text: "Vos collaborateurs sont-ils formés à la relation client en plus de leur expertise technique ?",
					options: [
						{
							label: "Profils techniques uniquement",
							score: 0,
						},
						{
							label: 'Sensibilisation aux "Soft Skills"',
							score: 1,
						},
						{
							label: "Formation continue Relation Client & Vente",
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
					id: "services_strategy_1",
					text: 'Cherchez-vous à "produitiser" vos services pour les rendre plus scalables ?',
					options: [
						{
							label: "Vente de temps uniquement (Taux horaire)",
							score: 0,
						},
						{
							label: "Forfaits packagés",
							score: 1,
						},
						{
							label: "Services 'produits' scalables et récurrents",
							score: 3,
						},
					],
				},
				{
					id: "services_strategy_2",
					text: "Avez-vous défini votre client idéal (Avatar) pour refuser les projets non rentables ?",
					options: [
						{
							label: "J'accepte tout client",
							score: 0,
						},
						{
							label: "Filtrage léger",
							score: 1,
						},
						{
							label: "Positionnement strict et sélectif",
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
					id: "services_technology_1",
					text: "Utilisez-vous des outils collaboratifs sécurisés pour échanger des documents sensibles ?",
					options: [
						{
							label: "Emails non sécurisés avec pièces jointes",
							score: 0,
						},
						{
							label: "Dossiers partagés basiques (Drive/Dropbox)",
							score: 1,
						},
						{
							label: "Portail client sécurisé et GED",
							score: 3,
						},
					],
				},
				{
					id: "services_technology_2",
					text: "Votre CRM permet-il de suivre tout l'historique des interactions avec chaque client ?",
					options: [
						{
							label: "Pas de CRM (mémoire ou carnet)",
							score: 0,
						},
						{
							label: "Fichier Excel ou CRM déconnecté",
							score: 1,
						},
						{
							label: "CRM centralisé et connecté aux emails/agenda",
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
					id: "services_risks_1",
					text: "Avez-vous une assurance Responsabilité Civile Professionnelle adaptée à vos enjeux ?",
					options: [
						{
							label: "Pas d'assurance spécifique",
							score: 0,
						},
						{
							label: "RC Pro standard minimale",
							score: 1,
						},
						{
							label: "Couverture complète auditée régulièrement",
							score: 3,
						},
					],
				},
				{
					id: "services_risks_2",
					text: "Vos contrats clients limitent-ils bien votre responsabilité et définissent-ils le périmètre ?",
					options: [
						{
							label: "Pas de contrat écrit / Accord oral",
							score: 0,
						},
						{
							label: "CGV ou contrat standard non adapté",
							score: 1,
						},
						{
							label: "Contrats sur-mesure et validés juridiquement",
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
					id: "services_branding_1",
					text: "Votre personal branding (dirigeants/experts) renforce-t-il la crédibilité de l'entreprise ?",
					options: [
						{
							label: "Profils LinkedIn incomplets ou inactifs",
							score: 0,
						},
						{
							label: "Présence correcte mais passive",
							score: 1,
						},
						{
							label: "Leaders d'opinion actifs et reconnus",
							score: 3,
						},
					],
				},
				{
					id: "services_branding_2",
					text: "Publiez-vous des études de cas ou des livres blancs pour prouver votre expertise ?",
					options: [
						{
							label: "Aucun contenu de preuve",
							score: 0,
						},
						{
							label: "Quelques articles de blog",
							score: 1,
						},
						{
							label: "Contenus experts réguliers et téléchargeables",
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
					id: "services_export_1",
					text: "Êtes-vous capables de délivrer vos services 100% à distance et en anglais ?",
					options: [
						{
							label: "Présentiel et langue locale impératifs",
							score: 0,
						},
						{
							label: "Possible mais difficile (barrière langue/outils)",
							score: 1,
						},
						{
							label: 'Organisation "Remote-first" et bilingue',
							score: 3,
						},
					],
				},
				{
					id: "services_export_2",
					text: "Avez-vous étudié la fiscalité des services (TVA, retenue à la source) à l'international ?",
					options: [
						{
							label: "Ignorance totale des règles",
							score: 0,
						},
						{
							label: "Gestion au cas par cas réactive",
							score: 1,
						},
						{
							label: "Cadre fiscal et légal maîtrisé",
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
