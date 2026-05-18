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
							recommendation: "Mettez en place un suivi des temps (Timesheets) pour calculer la rentabilité réelle de chaque mission.",
						},
						{
							label: "Estimation a posteriori",
							score: 1,
							recommendation: "Utilisez un outil de gestion de projet avec suivi budgétaire pour piloter la rentabilité en cours de mission.",
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
							recommendation: "Automatisez votre facturation récurrente et proposez le prélèvement automatique pour sécuriser votre trésorerie.",
						},
						{
							label: "Processus mensuel manuel",
							score: 1,
							recommendation: "Utilisez un outil de gestion des abonnements pour réduire le temps administratif lié à la facturation.",
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
					"Définissez précisément votre taux journalier moyen (TJM) plancher pour couvrir vos charges et marger.",
					"Mettez en place un acompte systématique de 30% à la signature de chaque devis.",
				],
				amber: [
					"Analysez vos écarts entre le temps vendu et le temps réellement passé pour ajuster vos futurs devis.",
					"Optimisez vos charges fixes (bureaux, abonnements logiciels inutilisés).",
				],
				green: [
					"Diversifiez vos sources de revenus vers des produits à haute marge (formation, conseil stratégique).",
					"Constituez une réserve de trésorerie équivalente à 6 mois de salaires.",
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
							recommendation: "Créez une checklist d'onboarding standard pour ne rien oublier lors du démarrage d'un nouveau client.",
						},
						{
							label: "Checklist simple utilisée",
							score: 1,
							recommendation: "Automatisez l'envoi des documents de bienvenue et la collecte des informations client initiales.",
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
							label: "Échanges par email uniquement",
							score: 0,
							recommendation: "Adoptez un outil de gestion de projet (Asana, Trello, Notion) pour centraliser les tâches et les échanges.",
						},
						{
							label: "Outil interne non partagé",
							score: 1,
							recommendation: "Donnez un accès limité à vos clients sur votre outil de gestion de projet pour plus de transparence.",
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
					"Documentez vos méthodes de travail pour pouvoir déléguer la production sans perte de qualité.",
					"Clarifiez les délais de livraison (SLA) dans tous vos contrats de service.",
				],
				amber: [
					"Mettez en place une revue de qualité systématique avant chaque livraison client.",
					"Standardisez vos modèles de documents (comptes-rendus, rapports, présentations).",
				],
				green: [
					"Automatisez vos tâches administratives récurrentes (relances, reporting) pour libérer du temps de conseil.",
					"Implémentez une démarche de certification qualité (ISO 9001) pour valoriser votre organisation.",
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
							recommendation: "Sollicitez activement des recommandations auprès de vos clients les plus satisfaits à la fin de chaque mission.",
						},
						{
							label: "Demande informelle ponctuelle",
							score: 1,
							recommendation: "Mettez en place un programme de parrainage récompensant les clients qui vous apportent de nouveaux projets.",
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
							recommendation: "Spécialisez votre offre sur une niche ou une expertise précise pour devenir la référence sur ce marché.",
						},
						{
							label: "Spécialisation par secteur ou métier",
							score: 1,
							recommendation: "Développez une méthodologie propre (signature) qui vous distingue des autres experts du secteur.",
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
					"Identifiez les 3 bénéfices majeurs que vous apportez à vos clients et mettez-les en avant.",
					"Créez une page de vente claire pour chaque service que vous proposez.",
				],
				amber: [
					"Développez votre réseau professionnel via des clubs d'entreprises ou des réseaux d'experts.",
					"Mettez en place un suivi CRM pour relancer vos anciens clients et générer du 'Repeat Business'.",
				],
				green: [
					"Lancez une stratégie de contenu expert (livres blancs, webinaires) pour attirer des prospects qualifiés (Inbound).",
					"Internationalisez votre prospection commerciale si votre expertise est exportable.",
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
							recommendation: "Mettez en place une base de connaissances partagée (Wiki) pour documenter vos expertises clés.",
						},
						{
							label: "Réunions de partage informelles",
							score: 1,
							recommendation: "Instaurez des sessions de mentorat ou de binomage pour diffuser les compétences rares dans l'équipe.",
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
							recommendation: "Formez vos experts aux 'Soft Skills' (communication, écoute active, gestion de projet) pour améliorer la satisfaction client.",
						},
						{
							label: 'Sensibilisation aux "Soft Skills"',
							score: 1,
							recommendation: "Proposez des mises en situation de gestion de crise ou de négociation commerciale à vos équipes.",
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
					"Clarifiez les fiches de poste et les niveaux de séniorité pour chaque collaborateur.",
					"Réalisez des entretiens de feedback mensuels pour suivre l'engagement de vos équipes.",
				],
				amber: [
					"Déléguez la gestion de projet aux collaborateurs seniors pour libérer du temps stratégique à la direction.",
					"Définissez un plan de formation annuel aligné sur l'évolution des besoins de vos clients.",
				],
				green: [
					"Mettez en place un système de partage des profits ou d'intéressement pour fidéliser les talents.",
					"Développez la marque employeur pour attirer des profils d'experts sur un marché tendu.",
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
							recommendation: "Transformez vos services récurrents en 'packs' ou 'produits' avec un prix et un périmètre fixes.",
						},
						{
							label: "Forfaits packagés",
							score: 1,
							recommendation: "Créez une offre de service automatisée ou digitale (SaaS-light) pour décorréler vos revenus du temps passé.",
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
							recommendation: "Définissez des critères de sélection de projets (Go/No-Go) pour vous concentrer sur les missions à haute valeur ajoutée.",
						},
						{
							label: "Filtrage léger",
							score: 1,
							recommendation: "Osez refuser les clients qui ne correspondent pas à votre expertise ou dont la rentabilité est trop faible.",
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
					"Analysez votre mix de services pour identifier ceux qui ont la meilleure marge et le meilleur potentiel de croissance.",
					"Rédigez votre vision stratégique à 3 ans et partagez-la avec votre équipe.",
				],
				amber: [
					"Développez des partenariats stratégiques avec des entreprises aux services complémentaires.",
					"Réalisez une veille concurrentielle sur les nouvelles méthodes de délivrance de service dans votre secteur.",
				],
				green: [
					"Explorez l'expansion géographique via des agences ou des partenaires locaux.",
					"Envisagez une stratégie de croissance par acquisition de petits cabinets spécialisés.",
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
							recommendation: "Mettez en place un espace de partage documentaire sécurisé (GED) pour vos échanges clients.",
						},
						{
							label: "Dossiers partagés basiques (Drive/Dropbox)",
							score: 1,
							recommendation: "Configurez des permissions d'accès strictes et la double authentification sur vos espaces de stockage.",
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
							recommendation: "Adoptez un CRM (Hubspot, Pipedrive) pour centraliser l'historique et les besoins de vos clients.",
						},
						{
							label: "Fichier Excel ou CRM déconnecté",
							score: 1,
							recommendation: "Intégrez votre CRM à votre messagerie pour capturer automatiquement tous les échanges clients.",
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
					"Modernisez votre matériel informatique pour garantir la sécurité et la productivité de vos experts.",
					"Installez un gestionnaire de mots de passe d'équipe (Bitwarden, LastPass).",
				],
				amber: [
					"Automatisez la génération de vos rapports ou livrables standards avec des outils de publipostage ou no-code.",
					"Utilisez des outils de signature électronique pour accélérer la validation de vos devis et contrats.",
				],
				green: [
					"Intégrez l'IA générative dans vos processus de production pour accélérer la rédaction ou l'analyse de données.",
					"Développez vos propres outils digitaux internes pour créer un avantage concurrentiel technologique.",
				],
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
							recommendation: "Souscrivez une assurance RC Professionnelle couvrant spécifiquement vos risques de conseil ou de prestation.",
						},
						{
							label: "RC Pro standard minimale",
							score: 1,
							recommendation: "Faites auditer vos plafonds de garantie par un courtier pour vous assurer qu'ils couvrent vos plus gros contrats.",
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
							recommendation: "Ne démarrez aucune mission sans un contrat écrit ou un devis signé incluant vos conditions générales de service.",
						},
						{
							label: "CGV ou contrat standard non adapté",
							score: 1,
							recommendation: "Faites valider vos modèles de contrats par un avocat spécialisé pour limiter vos clauses de responsabilité.",
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
					"Vérifiez que vous ne dépendez pas d'un seul client pour plus de 30% de votre chiffre d'affaires (Risque de dépendance économique).",
					"Sécurisez la propriété intellectuelle de vos livrables dans vos contrats.",
				],
				amber: [
					"Mettez en place une veille sur la solvabilité de vos nouveaux clients avant de démarrer des missions importantes.",
					"Prévoyez des clauses de résiliation claires dans tous vos contrats de prestation récurrente.",
				],
				green: [
					"Obtenez des certifications de sécurité (Cyber Essentials) pour rassurer vos clients grands comptes.",
					"Diversifiez vos prestataires technologiques critiques pour éviter tout risque d'interruption de service.",
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
							recommendation: "Optimisez les profils LinkedIn des experts de l'entreprise et publiez régulièrement du contenu de valeur.",
						},
						{
							label: "Présence correcte mais passive",
							score: 1,
							recommendation: "Encouragez vos experts à prendre la parole lors de webinaires ou d'événements pour asseoir leur autorité.",
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
							recommendation: "Rédigez au moins 3 études de cas détaillant les résultats obtenus pour vos clients.",
						},
						{
							label: "Quelques articles de blog",
							score: 1,
							recommendation: "Regroupez vos expertises dans un 'Guide Blanc' téléchargeable contre un email pour générer des leads.",
						},
						{
							label: "Contenus experts réguliers et téléchargeables",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez un ton et une identité éditoriale qui reflètent le professionnalisme de votre cabinet.",
					"Uniformisez la signature email et les supports de présentation de tous les collaborateurs.",
				],
				amber: [
					"Sollicitez des témoignages vidéo de vos clients pour humaniser votre preuve sociale.",
					"Participez à des trophées ou des classements professionnels pour gagner en visibilité institutionnelle.",
				],
				green: [
					"Lancez un podcast expert ou une newsletter de référence dans votre secteur.",
					"Développez une stratégie de relations presse pour devenir le 'bon client' des journalistes sur votre sujet.",
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
							recommendation: "Adaptez vos outils de collaboration pour permettre la délivrance de service à distance (visio, outils partagés).",
						},
						{
							label: "Possible mais difficile (barrière langue/outils)",
							score: 1,
							recommendation: "Formez vos équipes à l'anglais professionnel pour pouvoir répondre à des appels d'offres internationaux.",
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
							recommendation: "Consultez un fiscaliste pour comprendre les règles de TVA et de retenue à la source sur vos prestations export.",
						},
						{
							label: "Gestion au cas par cas réactive",
							score: 1,
							recommendation: "Établissez une grille de facturation export incluant les contraintes fiscales par zone géographique.",
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
					"Identifiez un premier pays cible dont la culture de service est proche de la vôtre.",
					"Vérifiez si vos diplômes ou certifications sont reconnus à l'étranger.",
				],
				amber: [
					"Créez une version anglaise complète de votre site web et de vos plaquettes commerciales.",
					"Établissez des partenariats avec des cabinets locaux dans vos pays cibles pour sous-traiter la partie 'locale'.",
				],
				green: [
					"Recrutez un business developer natif pour votre marché export prioritaire.",
					"Envisagez la création d'une structure légère à l'étranger si le volume d'affaires le justifie.",
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
