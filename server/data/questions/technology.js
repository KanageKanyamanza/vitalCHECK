module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "technology_finance_1",
					text: "Suivez-vous les métriques SaaS clés (MRR, Churn, CAC, LTV) de manière mensuelle ?",
					options: [
						{
							label: "Pilotage au CA global uniquement",
							score: 0,
							recommendation: "Mettez en place un tableau de bord SaaS (MRR, Churn, LTV/CAC) pour piloter votre croissance.",
						},
						{
							label: "Suivi basique (MRR simple)",
							score: 1,
							recommendation: "Approfondissez votre analyse financière avec le suivi du coût d'acquisition client (CAC) et de la Lifetime Value (LTV).",
						},
						{
							label: "Dashboard SaaS complet (LTV/CAC, Cohortes)",
							score: 3,
						},
					],
				},
				{
					id: "technology_finance_2",
					text: "Avez-vous optimisé vos dépenses d'infrastructure cloud (AWS/Azure) pour éviter le gaspillage ?",
					options: [
						{
							label: "Aucun contrôle des coûts (Surprovisioning)",
							score: 0,
							recommendation: "Réalisez un audit FinOps pour identifier et supprimer les ressources cloud inutilisées.",
						},
						{
							label: "Revue ponctuelle des factures",
							score: 1,
							recommendation: "Implémentez des outils d'alerte de budget et l'auto-scaling pour optimiser vos coûts d'infrastructure.",
						},
						{
							label: "FinOps actif et auto-scaling",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Établissez un budget mensuel strict pour vos coûts de serveurs et licences SaaS.",
					"Désignez un responsable 'FinOps' pour surveiller la consommation cloud.",
				],
				amber: [
					"Améliorez la précision de vos rapports de marge brute par client SaaS.",
					"Optimisez vos instances réservées sur votre fournisseur cloud pour réduire les coûts fixes.",
				],
				green: [
					"Analysez la rentabilité par fonctionnalité produit pour orienter la R&D.",
					"Préparez une levée de fonds ou une ligne de crédit basée sur la récurrence de vos revenus (RBF).",
				],
			},
		},
		{
			id: "operations",
			name: "Opérations",
			questions: [
				{
					id: "technology_operations_1",
					text: "Utilisez-vous des méthodes agiles (Scrum/Kanban) pour gérer vos cycles de développement ?",
					options: [
						{
							label: "Développement en cycle en V ou sans méthode",
							score: 0,
							recommendation: "Adoptez une méthodologie Agile (Scrum ou Kanban) pour gagner en réactivité et qualité.",
						},
						{
							label: "Agilité partielle ou mal appliquée",
							score: 1,
							recommendation: "Renforcez vos rituels agiles (Daily, Retrospectives) pour améliorer la vélocité de l'équipe.",
						},
						{
							label: "Méthodologie Agile rodée (Sprints, Rituels)",
							score: 3,
						},
					],
				},
				{
					id: "technology_operations_2",
					text: "Vos processus de déploiement (CI/CD) sont-ils automatisés pour réduire les erreurs humaines ?",
					options: [
						{
							label: "Déploiements manuels (FTP, SSH)",
							score: 0,
							recommendation: "Mettez en place une pipeline CI/CD basique pour automatiser vos déploiements.",
						},
						{
							label: "Quelques scripts d'automatisation",
							score: 1,
							recommendation: "Intégrez des tests unitaires et d'intégration automatisés dans votre flux de déploiement.",
						},
						{
							label: "CI/CD complet avec tests automatisés",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Documentez vos processus critiques de mise en production (Runbook).",
					"Standardisez l'environnement de développement local pour tous les développeurs (Docker).",
				],
				amber: [
					"Réduisez le temps de cycle (Lead Time) entre l'idée et le déploiement.",
					"Implémentez une revue de code (Code Review) systématique pour chaque Pull Request.",
				],
				green: [
					"Explorez le déploiement continu complet (Continuous Deployment) vers la production.",
					"Mesurez la performance de l'équipe via les métriques DORA (Deployment Frequency, Lead Time, etc.).",
				],
			},
		},
		{
			id: "sales",
			name: "Ventes",
			questions: [
				{
					id: "technology_sales_1",
					text: "Votre site web convertit-il efficacement les visiteurs en utilisateurs d'essai ou démos ?",
					options: [
						{
							label: "Site vitrine passif",
							score: 0,
							recommendation: "Ajoutez des appels à l'action (CTA) clairs comme 'Essai gratuit' ou 'Réserver une démo'.",
						},
						{
							label: "Quelques conversions (formulaires)",
							score: 1,
							recommendation: "Optimisez vos Landing Pages avec de l'A/B testing pour augmenter le taux de conversion.",
						},
						{
							label: "Entonnoir de conversion optimisé (PLG/Sales-Led)",
							score: 3,
						},
					],
				},
				{
					id: "technology_sales_2",
					text: 'Avez-vous une stratégie de "Lead Nurturing" automatisée pour les prospects froids ?',
					options: [
						{
							label: "Aucune relance structurée",
							score: 0,
							recommendation: "Mettez en place une séquence d'emails automatique pour relancer les inscrits inactifs.",
						},
						{
							label: "Newsletter générique",
							score: 1,
							recommendation: "Segmentez vos emails selon le comportement des utilisateurs dans votre application.",
						},
						{
							label: "Séquences d'emails segmentées et automatisées",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez précisément votre Ideal Customer Profile (ICP) technologique.",
					"Installez un outil de tracking (Hotjar, Mixpanel) pour comprendre le parcours utilisateur.",
				],
				amber: [
					"Lancez des campagnes de prospection ciblées sur LinkedIn (Social Selling).",
					"Mettez en place un programme de parrainage pour vos utilisateurs actuels.",
				],
				green: [
					"Développez une stratégie de Product-Led Growth (PLG) pour réduire le coût de vente.",
					"Internationalisez vos campagnes marketing pour toucher de nouveaux marchés.",
				],
			},
		},
		{
			id: "people",
			name: "RH",
			questions: [
				{
					id: "technology_people_1",
					text: "Comment gérez-vous la rétention des développeurs face à la forte concurrence du marché ?",
					options: [
						{
							label: "Turnover élevé, pas de stratégie",
							score: 0,
							recommendation: "Créez une culture d'entreprise forte et offrez de la flexibilité (télétravail) pour attirer les talents.",
						},
						{
							label: "Salaire aligné marché uniquement",
							score: 1,
							recommendation: "Proposez des avantages non-financiers (formation, matériel) et des perspectives de carrière claires.",
						},
						{
							label: "Culture tech forte, Remote, BSPCE",
							score: 3,
						},
					],
				},
				{
					id: "technology_people_2",
					text: "Favorisez-vous la formation continue sur les nouvelles technologies ?",
					options: [
						{
							label: "Aucun temps dédié à la veille",
							score: 0,
							recommendation: "Allouez au moins 4 heures par semaine à l'équipe pour la veille technologique et l'auto-formation.",
						},
						{
							label: "Veille sur temps personnel",
							score: 1,
							recommendation: "Financez des certifications ou des accès à des plateformes d'apprentissage en ligne (Udemy, Pluralsight).",
						},
						{
							label: "Temps/Budget formation alloué (Conférences, Cours)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Rédigez une fiche de poste claire pour chaque profil technique.",
					"Instaurez des entretiens 'one-to-one' hebdomadaires pour écouter vos développeurs.",
				],
				amber: [
					"Mettez en place un plan d'intéressement au capital (BSPCE/Stock Options) pour fidéliser les piliers.",
					"Organisez des 'Lunch & Learn' internes pour partager les connaissances techniques.",
				],
				green: [
					"Développez votre marque employeur via des articles de blog technique ou des contributions Open Source.",
					"Mettez en place un programme de mentorat pour l'onboarding des nouveaux juniors.",
				],
			},
		},
		{
			id: "strategy",
			name: "Stratégie",
			questions: [
				{
					id: "technology_strategy_1",
					text: "Votre roadmap produit est-elle alignée avec les retours utilisateurs et la vision long terme ?",
					options: [
						{
							label: "Pilotage au gré des demandes clients (Feature factory)",
							score: 0,
							recommendation: "Adoptez un framework de priorisation (RICE, Kano) pour votre roadmap produit.",
						},
						{
							label: "Roadmap fluctuante",
							score: 1,
							recommendation: "Publiez une roadmap publique simplifiée pour aligner les attentes des clients et de l'équipe.",
						},
						{
							label: "Vision claire et priorisation basée sur la donnée",
							score: 3,
						},
					],
				},
				{
					id: "technology_strategy_2",
					text: "Avez-vous protégé votre propriété intellectuelle (code, brevets, marques) ?",
					options: [
						{
							label: "Code non protégé / Open source non maîtrisé",
							score: 0,
							recommendation: "Déposez votre marque et sécurisez la propriété du code source dans vos contrats de travail.",
						},
						{
							label: "Marque déposée uniquement",
							score: 1,
							recommendation: "Auditez vos dépendances Open Source pour éviter les risques de licence (Copyleft).",
						},
						{
							label: "Stratégie IP (Brevets, Dépôt, Contrats)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez votre proposition de valeur unique face aux géants du secteur.",
					"Réalisez une analyse SWOT focalisée sur vos barrières à l'entrée technologiques.",
				],
				amber: [
					"Validez votre 'Product-Market Fit' via des sondages NPS réguliers.",
					"Explorez des partenariats stratégiques pour intégrer votre solution dans des écosystèmes existants.",
				],
				green: [
					"Anticipez les prochaines ruptures technologiques (IA, Web3) dans votre roadmap à 2 ans.",
					"Envisagez une expansion géographique ou un pivot vers une offre Enterprise.",
				],
			},
		},
		{
			id: "technology",
			name: "Technologie",
			questions: [
				{
					id: "technology_technology_1",
					text: "Gérez-vous activement votre dette technique pour éviter le ralentissement du développement ?",
					options: [
						{
							label: "Dette ignorée, accumulation critique",
							score: 0,
							recommendation: "Allouez 20% du temps de chaque sprint au refactoring et à la réduction de la dette technique.",
						},
						{
							label: "Refactoring quand c'est bloquant",
							score: 1,
							recommendation: "Utilisez un outil d'analyse de code (SonarQube) pour identifier automatiquement la dette technique.",
						},
						{
							label: "Refactoring continu (Règle des 20%)",
							score: 3,
						},
					],
				},
				{
					id: "technology_technology_2",
					text: "Votre architecture est-elle scalable pour supporter une croissance rapide (x10) ?",
					options: [
						{
							label: "Monolithe fragile",
							score: 0,
							recommendation: "Prévoyez une transition progressive vers une architecture de micro-services ou serverless.",
						},
						{
							label: "Scalabilité verticale limitée",
							score: 1,
							recommendation: "Implémentez du caching (Redis) et optimisez vos requêtes base de données pour améliorer la performance.",
						},
						{
							label:
								"Architecture Cloud-Native scalable (Microservices/Serverless)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Implémentez une stratégie de sauvegarde (Backup) testée et déportée hors de votre cloud principal.",
					"Activez l'authentification à deux facteurs (2FA) sur tous les outils de développement.",
				],
				amber: [
					"Monitorez les performances applicatives (APM) en temps réel avec des outils comme Datadog ou New Relic.",
					"Préparez un plan de migration vers des containers (Kubernetes) pour plus de portabilité.",
				],
				green: [
					"Explorez l'intégration de l'IA générative pour automatiser certaines tâches au sein de votre produit.",
					"Documentez votre architecture technique pour faciliter le passage à l'échelle (Scale-up).",
				],
			},
		},
		{
			id: "risks",
			name: "Risques",
			questions: [
				{
					id: "technology_risks_1",
					text: "Des tests de pénétration et audits de sécurité sont-ils réalisés régulièrement ?",
					options: [
						{
							label: "Jamais réalisés",
							score: 0,
							recommendation: "Effectuez un audit de sécurité externe pour identifier vos failles critiques.",
						},
						{
							label: "Scan de vulnérabilités automatisé",
							score: 1,
							recommendation: "Mettez en place un programme de 'Bug Bounty' ou des pentests annuels complets.",
						},
						{
							label: "Pentests externes bisannuels",
							score: 3,
						},
					],
				},
				{
					id: "technology_risks_2",
					text: "Avez-vous un plan de reprise d'activité (PRA) en cas de panne majeure des serveurs ?",
					options: [
						{
							label: "Pas de PRA, risque de perte totale",
							score: 0,
							recommendation: "Définissez un Plan de Reprise d'Activité (PRA) et testez-le au moins une fois par an.",
						},
						{
							label: "Backups simples (RTO/RPO longs)",
							score: 1,
							recommendation: "Implémentez la réplication de base de données multi-régions pour minimiser les pertes de données.",
						},
						{
							label: "Redondance géographique et PRA testé",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Formez vos employés aux risques de Phishing et d'ingénierie sociale.",
					"Auditez les accès administrateurs de vos serveurs et révoquez les accès inutiles.",
				],
				amber: [
					"Obtenez une cyber-assurance pour couvrir les risques d'attaque par ransomware.",
					"Mettez en place un système de Logging et de monitoring de sécurité (SIEM).",
				],
				green: [
					"Préparez une certification de sécurité reconnue (ISO 27001 ou SOC2).",
					"Nommez un Délégué à la Protection des Données (DPO) pour garantir la conformité continue.",
				],
			},
		},
		{
			id: "branding",
			name: "Branding",
			questions: [
				{
					id: "technology_branding_1",
					text: "Votre UI/UX Design est-il moderne et reflète-t-il la qualité technologique de votre solution ?",
					options: [
						{
							label: 'Design daté ou "Ingénieur"',
							score: 0,
							recommendation: "Recrutez un Product Designer pour moderniser l'interface et améliorer l'expérience utilisateur.",
						},
						{
							label: "Fonctionnel mais sans âme",
							score: 1,
							recommendation: "Mettez en place un Design System pour assurer une cohérence visuelle sur toute la plateforme.",
						},
						{
							label: "Design System world-class",
							score: 3,
						},
					],
				},
				{
					id: "technology_branding_2",
					text: "Êtes-vous perçu comme un leader d'opinion (Thought Leader) dans votre niche tech ?",
					options: [
						{
							label: "Inconnu au bataillon",
							score: 0,
							recommendation: "Commencez à partager votre expertise sur un blog technique ou via des webinaires.",
						},
						{
							label: "Présence technique discrète",
							score: 1,
							recommendation: "Prenez la parole dans des conférences tech de référence pour renforcer votre autorité.",
						},
						{
							label: "Conférencier, Contributeur Open Source",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Créez une charte graphique cohérente (couleurs, typographie) pour votre site et app.",
					"Clarifiez votre 'Pitch' pour expliquer votre technologie complexe en 30 secondes.",
				],
				amber: [
					"Publiez des études de cas (Case Studies) détaillées pour prouver l'efficacité de votre solution.",
					"Améliorez la documentation technique publique de votre API.",
				],
				green: [
					"Lancez un podcast ou une série de vidéos sur le futur de votre secteur technologique.",
					"Créez une communauté d'utilisateurs ambassadeurs (Slack/Discord).",
				],
			},
		},
		{
			id: "export",
			name: "Export",
			questions: [
				{
					id: "technology_export_1",
					text: "Votre logiciel est-il localisé (i18n) pour supporter facilement plusieurs langues/devises ?",
					options: [
						{
							label: "Hardcodé en une seule langue",
							score: 0,
							recommendation: "Implémentez une bibliothèque d'internationalisation (i18n) pour préparer l'expansion mondiale.",
						},
						{
							label: "Traduction partielle ou complexe",
							score: 1,
							recommendation: "Utilisez un service de traduction professionnelle pour vos marchés prioritaires.",
						},
						{
							label: "Architecture i18n native et fluide",
							score: 3,
						},
					],
				},
				{
					id: "technology_export_2",
					text: "Avez-vous vérifié la conformité RGPD/GDPR pour les données des utilisateurs européens ?",
					options: [
						{
							label: "Données hébergées hors UE sans cadre",
							score: 0,
							recommendation: "Mettez en conformité vos conditions générales et assurez le stockage sécurisé des données.",
						},
						{
							label: "Conformité en cours d'analyse",
							score: 1,
							recommendation: "Obtenez un avis juridique sur la conformité de vos transferts de données transfrontaliers.",
						},
						{
							label: "Conformité RGPD/CCPA validée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Analysez la demande pour votre produit dans les pays voisins.",
					"Vérifiez les contraintes légales d'exportation de logiciels (cryptage, etc.).",
				],
				amber: [
					"Adaptez vos tarifs et moyens de paiement aux monnaies locales (Stripe/Adyen).",
					"Recrutez un Customer Success multilingue pour accompagner vos premiers clients étrangers.",
				],
				green: [
					"Ouvrez un bureau commercial dans votre marché export le plus porteur.",
					"Adaptez votre produit aux spécificités culturelles et réglementaires locales (ex: taxes).",
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
