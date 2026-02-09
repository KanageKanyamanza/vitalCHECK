module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "healthcare_finance_1",
					text: "Avez-vous optimisé la gestion des remboursements tiers-payant et assurances ?",
					options: [
						{
							label: "Taux élevé de rejets ou non-suivi",
							score: 0,
						},
						{
							label: "Suivi manuel avec quelques délais",
							score: 1,
						},
						{
							label: "Télétransmission rapide et réconciliation automatisée",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_finance_2",
					text: "Avez-vous un plan d'amortissement clair pour les équipements médicaux coûteux ?",
					options: [
						{
							label: "Pas de planification (achat réactif)",
							score: 0,
						},
						{
							label: "Planification basique",
							score: 1,
						},
						{
							label: "Plan d'investissement et renouvellement à 5 ans",
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
					id: "healthcare_operations_1",
					text: "Le parcours patient est-il fluidifié pour réduire les temps d'attente ?",
					options: [
						{
							label: "Temps d'attente imprévisibles et longs",
							score: 0,
						},
						{
							label: "Fluidité relative selon les jours",
							score: 1,
						},
						{
							label: "Parcours optimisé (digital, tri, rappels)",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_operations_2",
					text: "Vos protocoles d'hygiène et de stérilisation sont-ils audités régulièrement ?",
					options: [
						{
							label: "Aucun audit formel",
							score: 0,
						},
						{
							label: "Contrôles internes épisodiques",
							score: 1,
						},
						{
							label: "Protocoles stricts et audités systématiquement",
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
			name: "Ventes (Patientèle)",
			questions: [
				{
					id: "healthcare_sales_1",
					text: "Utilisez-vous des plateformes de prise de rendez-vous en ligne pour acquérir des patients ?",
					options: [
						{
							label: "Prise de rendez-vous téléphonique seule",
							score: 0,
						},
						{
							label: "Formulaire web simple",
							score: 1,
						},
						{
							label: "Plateforme spécialisée (Doctolib, etc.)",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_sales_2",
					text: "Mesurez-vous la satisfaction patient (NPS) après les consultations ?",
					options: [
						{
							label: "Aucun retour structuré",
							score: 0,
						},
						{
							label: "Recueil de plaintes uniquement",
							score: 1,
						},
						{
							label: "Enquêtes systématiques et score NPS suivi",
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
					id: "healthcare_people_1",
					text: "Comment prévenez-vous le burn-out et assurez-vous le bien-être de votre personnel soignant ?",
					options: [
						{
							label: "Absence de mesures (turnover élevé)",
							score: 0,
						},
						{
							label: "Écoute informelle ponctuelle",
							score: 1,
						},
						{
							label: "Politique de QVT et soutien psychologique",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_people_2",
					text: "La formation médicale continue est-elle encouragée et financée ?",
					options: [
						{
							label: "Maintenance minimale des acquis",
							score: 0,
						},
						{
							label: "Formations subies (obligatoires uniquement)",
							score: 1,
						},
						{
							label: "Plan de formation d'excellence proactif",
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
					id: "healthcare_strategy_1",
					text: "Avez-vous développé des spécialités ou des pôles d'excellence reconnus ?",
					options: [
						{
							label: "Offre généraliste standard",
							score: 0,
						},
						{
							label: "1 ou 2 services de bonne réputation",
							score: 1,
						},
						{
							label: "Pôles d'excellence certifiés et référents",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_strategy_2",
					text: "Collaborez-vous avec d'autres structures pour compléter votre offre de soins ?",
					options: [
						{
							label: "Pratique isolée",
							score: 0,
						},
						{
							label: "Partenariats ponctuels",
							score: 1,
						},
						{
							label: "Intégration dans un réseau/parcours de soins",
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
					id: "healthcare_technology_1",
					text: "Votre dossier patient informatisé est-il interopérable et sécurisé ?",
					options: [
						{
							label: "Dossiers papier ou bureautiques isolés",
							score: 0,
						},
						{
							label: "Logiciel métier non communicant",
							score: 1,
						},
						{
							label: "DPI complet, connecté et certifié HDS",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_technology_2",
					text: "Proposez-vous de la téléconsultation pour les suivis simples ?",
					options: [
						{
							label: "Consultations présentielles uniquement",
							score: 0,
						},
						{
							label: "Solution temporaire (ex: WhatsApp/Skype)",
							score: 1,
						},
						{
							label: "Plateforme de téléconsultation intégrée",
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
					id: "healthcare_risks_1",
					text: "La confidentialité des données de santé (RGPD/HDS) est-elle strictement garantie ?",
					options: [
						{
							label: "Absence de procédure de protection",
							score: 0,
						},
						{
							label: "Charte de confidentialité simple",
							score: 1,
						},
						{
							label: "Conformité totale (DPO, Audit, HDS)",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_risks_2",
					text: "Êtes-vous couvert par une RCP médicale adaptée à tous vos actes pratiqués ?",
					options: [
						{
							label: "Pas de RCP ou inadaptée",
							score: 0,
						},
						{
							label: "RCP standard minimale",
							score: 1,
						},
						{
							label: "Couverture complète et réévaluée annuellement",
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
					id: "healthcare_branding_1",
					text: "Votre établissement inspire-t-il confiance, propreté et professionnalisme dès l'accueil ?",
					options: [
						{
							label: "Locaux ou accueil négligés",
							score: 0,
						},
						{
							label: "Standard hospitalier correct",
							score: 1,
						},
						{
							label: "Image d'excellence et confort patient",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_branding_2",
					text: "Gérez-vous votre e-réputation (avis Google, forums santé) ?",
					options: [
						{
							label: "Avis ignorés ou subis",
							score: 0,
						},
						{
							label: "Surveillance irrégulière",
							score: 1,
						},
						{
							label: "Modération proactive et image maîtrisée",
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
					id: "healthcare_export_1",
					text: "Accueillez-vous une patientèle internationale (tourisme médical) ?",
					options: [
						{
							label: "Patientèle locale uniquement",
							score: 0,
						},
						{
							label: "Quelques patients étrangers sporadiques",
							score: 1,
						},
						{
							label: "Stratégie d'accueil internationale (Convergences, etc.)",
							score: 3,
						},
					],
				},
				{
					id: "healthcare_export_2",
					text: "Vos praticiens parlent-ils plusieurs langues pour faciliter la prise en charge ?",
					options: [
						{
							label: "Langue locale uniquement",
							score: 0,
						},
						{
							label: "Soutien ponctuel par traduction",
							score: 1,
						},
						{
							label: "Bilinguisme fluide de l'équipe soignante",
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
