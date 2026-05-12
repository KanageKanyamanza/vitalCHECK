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
							recommendation: "Procédez à une recapitalisation immédiate ou à une restructuration de votre dette pour rétablir vos ratios réglementaires.",
						},
						{
							label: "Conforme mais marges faibles",
							score: 1,
							recommendation: "Améliorez votre structure de bilan en optimisant votre allocation d'actifs et en réduisant vos passifs coûteux.",
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
							recommendation: "Élaborez une politique d'investissement pour vos fonds propres afin de générer des revenus financiers complémentaires.",
						},
						{
							label: "Placements prudents à faible rendement",
							score: 1,
							recommendation: "Diversifiez vos placements vers des actifs plus dynamiques tout en respectant votre profil de risque.",
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
					"Réalisez un audit indépendant de votre exposition aux risques pour identifier d'éventuelles pertes latentes.",
					"Mettez en place un reporting financier hebdomadaire extrêmement précis pour piloter votre liquidité.",
				],
				amber: [
					"Optimisez vos coûts de refinancement en diversifiant vos sources de financement (marchés, banques, dépôts).",
					"Revoyez votre politique de dividendes pour renforcer vos fonds propres réglementaires.",
				],
				green: [
					"Utilisez vos excédents de fonds propres pour financer des projets d'innovation technologique ou de croissance externe.",
					"Développez des modèles de scoring plus sophistiqués pour optimiser votre allocation de capital.",
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
							recommendation: "Digitalisez vos processus d'entrée en relation (Onboarding) avec des solutions de vérification d'identité automatisées.",
						},
						{
							label: "Mélange manuel/digital",
							score: 1,
							recommendation: "Intégrez des outils de filtrage automatique (AML/PEP) pour accélérer la validation des dossiers clients.",
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
							recommendation: "Automatisez vos workflows opérationnels pour réduire les délais de traitement des virements et des ouvertures de comptes.",
						},
						{
							label: "Traitement sous 24h",
							score: 1,
							recommendation: "Mettez en place un système de traitement en temps réel (Instant Payment) pour améliorer l'expérience client.",
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
					"Cartographiez tous vos processus opérationnels pour identifier les risques opérationnels et les inefficacités.",
					"Mettez en place un système de contrôle interne rigoureux sur toutes les transactions sensibles.",
				],
				amber: [
					"Externalisez les tâches de back-office non stratégiques pour vous concentrer sur le conseil client.",
					"Investissez dans la formation de vos équipes opérationnelles aux nouvelles réglementations bancaires.",
				],
				green: [
					"Adoptez une architecture micro-services pour rendre votre infrastructure opérationnelle plus agile et évolutive.",
					"Implémentez le Straight Through Processing (STP) sur l'ensemble de vos flux transactionnels.",
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
							recommendation: "Formez vos conseillers à la vente conseil et dotez-les d'outils de détection automatique des besoins clients.",
						},
						{
							label: "Suggestions ponctuelles",
							score: 1,
							recommendation: "Utilisez le Big Data pour proposer des offres personnalisées au bon moment (Next Best Action).",
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
							recommendation: "Supprimez les barrières à la sortie et misez sur l'excellence du service pour fidéliser vos clients par choix.",
						},
						{
							label: "Programmes de fidélité classiques",
							score: 1,
							recommendation: "Mettez en place un suivi systématique du Net Promoter Score (NPS) et traitez les détracteurs en moins de 24h.",
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
					"Simplifiez votre gamme de produits pour qu'elle soit plus lisible et transparente pour le client.",
					"Formez vos équipes commerciales à l'éthique de vente pour éviter tout risque de 'mis-selling'.",
				],
				amber: [
					"Développez des outils de self-care (Espace client digital) pour que les clients puissent gérer leurs opérations simples en autonomie.",
					"Analysez les motifs d'insatisfaction client pour améliorer vos produits de manière continue.",
				],
				green: [
					"Créez une communauté de clients ambassadeurs pour co-construire vos futurs services financiers.",
					"Développez des partenariats avec des plateformes digitales tierces pour distribuer vos produits là où se trouvent vos clients.",
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
							recommendation: "Rendez obligatoire une formation annuelle certifiante sur l'éthique et la lutte contre le blanchiment (LCB-FT).",
						},
						{
							label: "Formation annuelle basique",
							score: 1,
							recommendation: "Intégrez des mises en situation réelles dans vos formations pour tester les réflexes de conformité de vos équipes.",
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
							recommendation: "Modernisez votre environnement de travail et proposez des parcours de carrière plus agiles et transversaux.",
						},
						{
							label: "Politique salariale compétitive",
							score: 1,
							recommendation: "Développez votre marque employeur en mettant en avant vos engagements RSE et l'impact positif de votre activité.",
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
					"Clarifiez les responsabilités de chacun en matière de risques et de conformité (3 lignes de défense).",
					"Instaurez un système de signalement interne (Whistleblowing) sécurisé et anonyme.",
				],
				amber: [
					"Mettez en place un plan de succession pour tous les postes clés de l'institution.",
					"Favorisez la mobilité interne pour retenir les talents et diffuser les meilleures pratiques.",
				],
				green: [
					"Développez un programme de bien-être au travail pour réduire le stress lié aux métiers de la finance.",
					"Investissez dans des programmes de 'Leadership agile' pour vos managers.",
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
							recommendation: "Lancez un plan de transformation digitale profond touchant aussi bien l'IT que les processus métier.",
						},
						{
							label: "Digitalisation de la façade (App mobile)",
							score: 1,
							recommendation: "Modernisez votre Core Banking System (CBS) pour permettre l'ouverture vers l'Open Banking.",
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
							recommendation: "Identifiez vos segments clients les plus rentables et développez des offres sur-mesure pour ces niches.",
						},
						{
							label: "Spécialisation sur quelques produits",
							score: 1,
							recommendation: "Devenez le leader incontesté sur votre spécialité en misant sur l'innovation produit et la qualité de service.",
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
					"Rédigez une vision stratégique claire à 5 ans pour rassurer vos actionnaires et vos régulateurs.",
					"Analysez les menaces liées aux nouveaux entrants (Fintechs, Big Techs) sur votre cœur de métier.",
				],
				amber: [
					"Étudiez des opportunités de partenariats ou d'investissements dans des Fintechs innovantes.",
					"Mettez en place une veille stratégique sur les évolutions réglementaires internationales.",
				],
				green: [
					"Explorez des opportunités d'expansion géographique sur des marchés émergents à fort potentiel.",
					"Développez une stratégie de croissance externe par l'acquisition de portefeuilles clients ou de technologies.",
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
							recommendation: "Adoptez des outils de scoring automatique basés sur des algorithmes statistiques éprouvés.",
						},
						{
							label: "Règles métier statistiques simples",
							score: 1,
							recommendation: "Utilisez l'Intelligence Artificielle pour améliorer la précision de vos modèles de détection de fraude en temps réel.",
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
							recommendation: "Investissez dans la refonte de votre application mobile pour offrir les services bancaires de base de manière fluide.",
						},
						{
							label: "Interface fonctionnelle mais complexe",
							score: 1,
							recommendation: "Simplifiez le parcours utilisateur (UX Design) pour réduire le nombre de clics pour les opérations fréquentes.",
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
					"Assurez une sécurité absolue de vos infrastructures critiques (datacenter, cloud sécurisé).",
					"Modernisez votre architecture de données pour supprimer les silos d'information entre services.",
				],
				amber: [
					"Ouvrez vos systèmes via des API pour faciliter l'intégration avec des partenaires tiers (Open Finance).",
					"Utilisez le Cloud hybride pour gagner en scalabilité tout en respectant les contraintes réglementaires de données.",
				],
				green: [
					"Expérimentez la Blockchain pour automatiser et sécuriser vos transactions interbancaires.",
					"Développez des agents conversationnels (Chatbots) basés sur l'IA pour répondre aux questions simples des clients 24h/24.",
				],
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
							recommendation: "Créez une fonction d'audit interne indépendante et réalisez un plan d'audit annuel complet.",
						},
						{
							label: "Audit interne annuel",
							score: 1,
							recommendation: "Faites appel à des cabinets d'audit externes reconnus pour certifier la solidité de votre cadre de gestion des risques.",
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
							recommendation: "Généralisez la double authentification (MFA) pour tous les accès aux comptes clients et systèmes internes.",
						},
						{
							label: "Chiffrement et MFA activé",
							score: 1,
							recommendation: "Mettez en place un centre de sécurité opérationnel (SOC) pour surveiller vos réseaux en temps réel (24/7).",
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
					"Identifiez vos processus critiques et rédigez un Plan de Continuité d'Activité (PCA) testé annuellement.",
					"Assurez-vous d'avoir une assurance cyber-risque couvrant les pertes liées aux fraudes et aux piratages.",
				],
				amber: [
					"Réalisez des tests d'intrusion (Pen-tests) réguliers sur vos applications web et mobiles.",
					"Mettez en place une politique stricte de gestion des accès privilégiés (PAM).",
				],
				green: [
					"Adoptez une approche 'Zero Trust' pour la sécurité de l'ensemble de votre système d'information.",
					"Implémentez des outils d'analyse comportementale pour détecter les fraudes internes complexes.",
				],
			},
		},
		{
			id: "branding",
			name: "Branding",
			questions: [
				{
					id: "finance_branding_1",
					text: "Votre marque inspire-t-il la stabilité et la sécurité ?",
					options: [
						{
							label: "Image dégradée ou peu connue",
							score: 0,
							recommendation: "Lancez une campagne de communication institutionnelle axée sur la solidité financière et la confiance historique.",
						},
						{
							label: "Réputation neutre",
							score: 1,
							recommendation: "Humanisez votre marque en mettant en avant vos conseillers et votre impact sur l'économie locale.",
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
							recommendation: "Simplifiez votre grille tarifaire et communiquez de manière pédagogique sur les frais de vos services.",
						},
						{
							label: "Grille tarifaire standard",
							score: 1,
							recommendation: "Offrez des outils de simulation de frais en ligne pour que le client sache exactement ce qu'il va payer.",
						},
						{
							label: "Transparence totale et pédagogie tarifaire",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Clarifiez votre promesse client : qu'est-ce qui vous rend plus fiable que les concurrents digitaux ?",
					"Soignez l'identité visuelle de vos agences ou de vos supports digitaux pour inspirer le professionnalisme.",
				],
				amber: [
					"Participez à des événements de place ou des conférences pour asseoir votre expertise financière.",
					"Développez une stratégie de contenu pédagogique (éducation financière) pour vos clients.",
				],
				green: [
					"Obtenez des labels de finance responsable ou durable (ISR, Greenfin) pour valoriser vos engagements éthiques.",
					"Créez une marque haut de gamme dédiée à la gestion de patrimoine ou aux entreprises à forte valeur.",
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
							recommendation: "Étudiez les opportunités de passeporting financier ou de licences dans des juridictions étrangères stratégiques.",
						},
						{
							label: "Autorisation de passeporting financier",
							score: 1,
							recommendation: "Ouvrez des succursales ou des filiales dans les pays de votre zone économique pour servir vos clients à l'export.",
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
							recommendation: "Connectez-vous aux réseaux de paiement internationaux (SWIFT, SEPA) pour faciliter les transferts de fonds mondiaux.",
						},
						{
							label: "Connexion via banque correspondante",
							score: 1,
							recommendation: "Optimisez vos relations avec les banques correspondantes pour réduire les frais et les délais de transfert internationaux.",
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
					"Vérifiez que vos procédures de conformité (Sanctions, Embargos) sont aux standards internationaux.",
					"Analysez les besoins de vos clients locaux qui ont des activités à l'étranger.",
				],
				amber: [
					"Proposez des services de couverture de change (Hedging) pour accompagner vos clients exportateurs.",
					"Traduisez vos contrats et supports de communication en anglais pour vos clients internationaux.",
				],
				green: [
					"Développez des solutions de financement du commerce international (Trade Finance) pour vos clients corporate.",
					"Adhérez à des réseaux bancaires mondiaux pour offrir une continuité de service à vos clients partout dans le monde.",
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
