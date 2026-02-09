module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "finance_finance_1",
					text: "Vos ratios de liquidité et de solvabilité sont-ils conformes aux normes réglementaires ?",
					options: [
						{
							label: "Non-conformité critique",
							score: 0,
						},
						{
							label: "Conforme mais marges faibles",
							score: 1,
						},
						{
							label: "Ratios solides et audités",
							score: 3,
						},
					],
				},
				{
					id: "finance_finance_2",
					text: "Avez-vous une stratégie de placement rentable pour vos fonds propres ?",
					options: [
						{
							label: "Pas de stratégie (fonds dormants)",
							score: 0,
						},
						{
							label: "Placements prudents à faible rendement",
							score: 1,
						},
						{
							label: "Portefeuille diversifié et performant",
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
					id: "finance_operations_1",
					text: "Vos processus de KYC (Know Your Customer) sont-ils efficaces sans être trop lourds ?",
					options: [
						{
							label: "Processus manuel et lent",
							score: 0,
						},
						{
							label: "Mélange manuel/digital",
							score: 1,
						},
						{
							label: "Workflow digitalisé et automatisé",
							score: 3,
						},
					],
				},
				{
					id: "finance_operations_2",
					text: "Le temps de traitement des opérations clients est-il compétitif ?",
					options: [
						{
							label: "Traitement supérieur à 48h",
							score: 0,
						},
						{
							label: "Traitement sous 24h",
							score: 1,
						},
						{
							label: "Traitement quasi-instantané (Real-time)",
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
					id: "finance_sales_1",
					text: "Vos conseillers ont-ils une approche proactive pour proposer des produits adaptés ?",
					options: [
						{
							label: "Gestion réactive uniquement",
							score: 0,
						},
						{
							label: "Suggestions ponctuelles",
							score: 1,
						},
						{
							label: "Conseil personnalisé basé sur la donnée",
							score: 3,
						},
					],
				},
				{
					id: "finance_sales_2",
					text: "La satisfaction client est-elle votre premier levier de fidélisation ?",
					options: [
						{
							label: "Fidélisation par contrainte (frais de sortie)",
							score: 0,
						},
						{
							label: "Programmes de fidélité classiques",
							score: 1,
						},
						{
							label: "Satisfaction élevée (NPS positif)",
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
					id: "finance_people_1",
					text: "Vos équipes sont-elles formées à l'éthique et à la conformité financière ?",
					options: [
						{
							label: "Formation inexistante",
							score: 0,
						},
						{
							label: "Formation annuelle basique",
							score: 1,
						},
						{
							label: "Formation continue et culture d'éthique",
							score: 3,
						},
					],
				},
				{
					id: "finance_people_2",
					text: "Comment attirez-vous les talents face à la concurrence des Fintechs ?",
					options: [
						{
							label: "Difficultés majeures de recrutement",
							score: 0,
						},
						{
							label: "Politique salariale compétitive",
							score: 1,
						},
						{
							label: "Marque employeur forte et environnement agile",
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
					id: "finance_strategy_1",
					text: "Avez-vous intégré la transformation digitale pour ne pas être ubérisé ?",
					options: [
						{
							label: 'Modèle traditionnel "Legacy"',
							score: 0,
						},
						{
							label: "Digitalisation de la façade (App mobile)",
							score: 1,
						},
						{
							label: "Digital-first et innovation continue",
							score: 3,
						},
					],
				},
				{
					id: "finance_strategy_2",
					text: "Ciblez-vous des niches spécifiques ou restez-vous généraliste ?",
					options: [
						{
							label: "Généraliste sans avantage compétitif",
							score: 0,
						},
						{
							label: "Spécialisation sur quelques produits",
							score: 1,
						},
						{
							label: "Domination d'une niche à forte valeur",
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
					id: "finance_technology_1",
					text: "Utilisez-vous l'IA ou le Big Data pour la détection de fraude ou le scoring ?",
					options: [
						{
							label: "Analyse humaine uniquement",
							score: 0,
						},
						{
							label: "Règles métier statistiques simples",
							score: 1,
						},
						{
							label: "Modèles prédictifs et Machine Learning",
							score: 3,
						},
					],
				},
				{
					id: "finance_technology_2",
					text: "Vos applications mobiles offrent-elles une expérience utilisateur fluide ?",
					options: [
						{
							label: "Application instable ou limitée",
							score: 0,
						},
						{
							label: "Interface fonctionnelle mais complexe",
							score: 1,
						},
						{
							label: "Expérience fluide et intuitive (UX-driven)",
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
					id: "finance_risks_1",
					text: "Votre gestion des risques (crédit, marché, opérationnel) est-elle auditée régulièrement ?",
					options: [
						{
							label: "Pas d'audit formel",
							score: 0,
						},
						{
							label: "Audit interne annuel",
							score: 1,
						},
						{
							label: "Audits externes réguliers et reporting",
							score: 3,
						},
					],
				},
				{
					id: "finance_risks_2",
					text: "Les mesures de cybersécurité sont-elles maximales pour protéger les avoirs clients ?",
					options: [
						{
							label: "Protection basique (Antivirus/Pare-feu)",
							score: 0,
						},
						{
							label: "Chiffrement et MFA activé",
							score: 1,
						},
						{
							label: "SOC, Tests d'intrusion et résilience totale",
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
					id: "finance_branding_1",
					text: "Votre marque inspire-t-elle la stabilité et la sécurité ?",
					options: [
						{
							label: "Image dégradée ou peu connue",
							score: 0,
						},
						{
							label: "Réputation neutre",
							score: 1,
						},
						{
							label: "Réputation d'institution pilier et sécurisée",
							score: 3,
						},
					],
				},
				{
					id: "finance_branding_2",
					text: "La transparence des frais est-elle un atout de votre communication ?",
					options: [
						{
							label: "Frais cachés ou complexes",
							score: 0,
						},
						{
							label: "Grille tarifaire standard",
							score: 1,
						},
						{
							label: "Transparence totale et pédagogie tarifaire",
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
					id: "finance_export_1",
					text: "Disposez-vous des licences pour opérer sur d'autres marchés financiers ?",
					options: [
						{
							label: "Licence locale uniquement",
							score: 0,
						},
						{
							label: "Autorisation de passeporting financier",
							score: 1,
						},
						{
							label: "Licences internationales multi-juridictionnelles",
							score: 3,
						},
					],
				},
				{
					id: "finance_export_2",
					text: "Êtes-vous connecté aux réseaux de paiement internationaux (SWIFT, SEPA, etc.) ?",
					options: [
						{
							label: "Réseau de transfert local uniquement",
							score: 0,
						},
						{
							label: "Connexion via banque correspondante",
							score: 1,
						},
						{
							label: "Accès direct et complet aux réseaux mondiaux",
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
