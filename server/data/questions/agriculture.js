module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "agriculture_finance_1",
					text: "Avez-vous une trésorerie suffisante pour couvrir les cycles longs entre semence et récolte ?",
					options: [
						{
							label: "Non, trésorerie tendue",
							score: 0,
						},
						{
							label: "Oui, mais sans marge de sécurité",
							score: 1,
						},
						{
							label: "Oui, fonds de roulement solide",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_finance_2",
					text: "Analysez-vous la rentabilité par hectare ou par type de culture/élevage ?",
					options: [
						{
							label: "Non, comptabilité globale uniquement",
							score: 0,
						},
						{
							label: "Partiellement, estimation approximative",
							score: 1,
						},
						{
							label: "Oui, comptabilité analytique précise",
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
					id: "agriculture_operations_1",
					text: "Optimisez-vous l'utilisation des intrants (eau, engrais) pour réduire les coûts et l'impact ?",
					options: [
						{
							label: "Non, pilotage visuel uniquement",
							score: 0,
						},
						{
							label: "Oui, suivi des quantités consommées",
							score: 1,
						},
						{
							label: "Oui, pilotage de précision (dosages optimisés)",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_operations_2",
					text: "Avez-vous mécanisé les tâches les plus pénibles et répétitives ?",
					options: [
						{
							label: "Non, travail essentiellement manuel",
							score: 0,
						},
						{
							label: "Partiellement mécanisé",
							score: 1,
						},
						{
							label: "Oui, mécanisation avancée",
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
					id: "agriculture_sales_1",
					text: "Vendez-vous au prix du marché mondial ou valorisez-vous votre production (circuit court, transformé) ?",
					options: [
						{
							label: "Vente en gros uniquement (prix subis)",
							score: 0,
						},
						{
							label: "Mixte (Gros + un peu de direct)",
							score: 1,
						},
						{
							label: "Majorité valorisée (Transformation/Circuit court)",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_sales_2",
					text: "Avez-vous sécurisé des contrats de vente avant la récolte ?",
					options: [
						{
							label: "Non, vente au spot après récolte",
							score: 0,
						},
						{
							label: "Quelques contrats verbaux ou partiels",
							score: 1,
						},
						{
							label: "Oui, contrats écrits sur la majorité de la production",
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
					id: "agriculture_people_1",
					text: "Comment gérez-vous le recrutement et le logement des travailleurs saisonniers ?",
					options: [
						{
							label: "Gestion informelle / Difficultés de logement",
							score: 0,
						},
						{
							label: "Recrutement anticipé mais logement précaire",
							score: 1,
						},
						{
							label: "Processus structuré et logements aux normes",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_people_2",
					text: "La formation à la sécurité et à l'utilisation du matériel est-elle systématique ?",
					options: [
						{
							label: "Non, apprentissage sur le tas",
							score: 0,
						},
						{
							label: "Partielle / Oralement seulement",
							score: 1,
						},
						{
							label: "Oui, formation complète et documentée",
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
					id: "agriculture_strategy_1",
					text: "Envisagez-vous une diversification (tourisme, énergie, transformation) pour sécuriser vos revenus ?",
					options: [
						{
							label: "Non / Monoproduction risquée",
							score: 0,
						},
						{
							label: "Réflexion en cours / Tests",
							score: 1,
						},
						{
							label: "Oui / Revenus diversifiés",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_strategy_2",
					text: "Pradiquez-vous une agriculture durable pour préserver la valeur de vos terres à long terme ?",
					options: [
						{
							label: "Non, culture intensive classique",
							score: 0,
						},
						{
							label: "Démarches isolées (ex: rotation raisonnée)",
							score: 1,
						},
						{
							label: "Oui, pratiques durables systémiques (Sols vivants...)",
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
					id: "agriculture_technology_1",
					text: "Utilisez-vous l'agriculture de précision (drones, capteurs, GPS) ?",
					options: [
						{
							label: "Non, équipements standards",
							score: 0,
						},
						{
							label: "Oui, quelques outils (ex: barre de guidage)",
							score: 1,
						},
						{
							label: "Oui, équipement complet (Modulation de dose, GPS RTK...)",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_technology_2",
					text: "Avez-vous des logiciels de gestion de parcelles ou de troupeau ?",
					options: [
						{
							label: "Non, carnet papier",
							score: 0,
						},
						{
							label: "Tableur Excel classique",
							score: 1,
						},
						{
							label: "Oui, logiciel métier spécialisé",
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
					id: "agriculture_risks_1",
					text: "Êtes-vous assuré contre les aléas climatiques et les pertes de récolte ?",
					options: [
						{
							label: "Non, aucune assurance spécifique",
							score: 0,
						},
						{
							label: "Assurance partielle (Grêle/Incendie uniquement)",
							score: 1,
						},
						{
							label: "Oui, assurance multirisque climatique complète",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_risks_2",
					text: "Avez-vous un plan de biosécurité pour protéger vos cultures/élevages des maladies ?",
					options: [
						{
							label: "Non, réaction curative uniquement",
							score: 0,
						},
						{
							label: "Mesures d'hygiène de base",
							score: 1,
						},
						{
							label: "Oui, protocole sanitaire strict et préventif",
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
					id: "agriculture_branding_1",
					text: "Avez-vous des labels de qualité (Bio, AOC, équitable) valorisables auprès du consommateur ?",
					options: [
						{
							label: "Non, agriculture conventionnelle",
							score: 0,
						},
						{
							label: "En conversion ou certification partielle",
							score: 1,
						},
						{
							label: "Oui, labels reconnus et affichés",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_branding_2",
					text: 'Racontez-vous "l\'histoire" de vos produits pour créer un lien émotionnel ?',
					options: [
						{
							label: "Non, produit standardisé",
							score: 0,
						},
						{
							label: "Un peu de communication locale",
							score: 1,
						},
						{
							label: "Oui, Storytelling fort (Terroir, Savoir-faire)",
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
					id: "agriculture_export_1",
					text: "Vos produits répondent-ils aux normes phytosanitaires strictes de l'export ?",
					options: [
						{
							label: "Non, normes locales uniquement",
							score: 0,
						},
						{
							label: "En cours de mise aux normes",
							score: 1,
						},
						{
							label: "Oui, certifications export valides (GlobalGAP...)",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_export_2",
					text: "Avez-vous la capacité logistique (chaîne du froid) pour exporter des produits frais ?",
					options: [
						{
							label: "Non, vente locale uniquement",
							score: 0,
						},
						{
							label: "Sous-traitance logistique",
							score: 1,
						},
						{
							label: "Oui, logistique export maîtrisée",
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
