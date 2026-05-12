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
							recommendation: "Diversifiez vos revenus en lançant des programmes de formation continue ou en recherchant des subventions et mécénats.",
						},
						{
							label: "2 sources de revenus (ex: Frais + Subventions)",
							score: 1,
							recommendation: "Optimisez la rentabilité de vos formations courtes pour financer le développement de nouveaux cursus.",
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
							recommendation: "Calculez votre coût d'acquisition étudiant (marketing / nombre d'inscrits) pour optimiser vos budgets publicitaires.",
						},
						{
							label: "Suivi global sans distinction par canal",
							score: 1,
							recommendation: "Identifiez les canaux de recrutement les plus rentables (salons, réseaux sociaux, parrainage) pour y concentrer vos efforts.",
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
					"Analysez les retards de paiement des frais de scolarité et mettez en place un système de relance automatique dès le premier jour de retard.",
					"Auditez vos coûts de fonctionnement fixes (immobilier, énergie) pour identifier des sources d'économie.",
				],
				amber: [
					"Développez un plan de trésorerie prévisionnel prenant en compte la saisonnalité des inscriptions.",
					"Négociez des accords-cadres avec vos fournisseurs d'équipements et de consommables pédagogiques.",
				],
				green: [
					"Explorez la création d'une fondation pour collecter des fonds auprès des anciens élèves et des entreprises.",
					"Investissez vos excédents dans la modernisation des infrastructures et la recherche.",
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
							recommendation: "Adoptez un logiciel de gestion des emplois du temps pour éviter les conflits de salles et de professeurs.",
						},
						{
							label: "Utilisation de tableurs (Excel)",
							score: 1,
							recommendation: "Utilisez un outil de planification dynamique permettant aux étudiants de consulter leur emploi du temps en temps réel sur mobile.",
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
							recommendation: "Mettez en place un système d'alerte basé sur l'absentéisme et les notes pour identifier rapidement les étudiants en difficulté.",
						},
						{
							label: "Suivi informel par les professeurs",
							score: 1,
							recommendation: "Institutionnalisez un programme de tutorat ou de parrainage entre étudiants pour renforcer l'entraide.",
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
					"Documentez tous vos processus administratifs (inscriptions, examens, diplômes) pour garantir la continuité de service.",
					"Mettez en place un guichet unique (physique ou digital) pour répondre aux questions administratives des étudiants.",
				],
				amber: [
					"Optimisez l'utilisation de vos espaces (salles de cours, bibliothèques) en dehors des heures de pointe.",
					"Améliorez la logistique des examens pour réduire le stress des étudiants et les risques d'erreurs.",
				],
				green: [
					"Digitalisez l'intégralité du parcours administratif de l'étudiant, de l'inscription à la remise du diplôme.",
					"Implémentez une démarche d'amélioration continue basée sur les retours réguliers des étudiants et des professeurs.",
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
							recommendation: "Organisez au moins deux journées portes ouvertes par an et participez aux salons d'orientation majeurs de votre région.",
						},
						{
							label: "Présence locale restreinte",
							score: 1,
							recommendation: "Développez des webinaires de présentation et des visites virtuelles pour attirer des candidats au-delà de votre zone locale.",
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
							recommendation: "Créez un annuaire des anciens et organisez un événement annuel de retrouvailles pour lancer votre réseau Alumni.",
						},
						{
							label: "Annuaire simple des anciens",
							score: 1,
							recommendation: "Mobilisez vos anciens élèves comme ambassadeurs lors des salons ou via des témoignages vidéo sur vos réseaux sociaux.",
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
					"Refondez votre site web pour qu'il soit 'Mobile-First' et facilite la demande de brochure ou le dépôt de dossier.",
					"Formez votre équipe d'admission aux techniques de conseil et de relance bienveillante des prospects.",
				],
				amber: [
					"Utilisez un CRM pour suivre le cycle de vie de chaque candidat et personnaliser vos communications.",
					"Développez une stratégie de contenu (Social Media) montrant la vie étudiante et la réussite des diplômés.",
				],
				green: [
					"Lancez des campagnes de publicité ciblée (Google Ads, Social Ads) sur vos formations les plus porteuses.",
					"Créez des partenariats avec des prescripteurs (lycées, conseillers d'orientation) pour générer des leads qualifiés.",
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
							recommendation: "Mettez en place des questionnaires de satisfaction anonymes pour les étudiants après chaque module de cours.",
						},
						{
							label: "Questionnaires étudiants annuels",
							score: 1,
							recommendation: "Instaurez des revues pédagogiques par les pairs (observation mutuelle) pour favoriser l'échange de bonnes pratiques.",
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
							recommendation: "Définissez une charte de l'accueil et formez votre personnel administratif à la gestion de la relation étudiant.",
						},
						{
							label: "Formation ponctuelle",
							score: 1,
							recommendation: "Organisez des formations sur l'écoute active et la résolution de conflits pour améliorer l'expérience vécue par les étudiants.",
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
					"Clarifiez les attentes pédagogiques et les méthodes d'évaluation auprès de tous les enseignants (permanents et vacataires).",
					"Assurez-vous que tous vos contrats de travail sont conformes à la réglementation de l'enseignement.",
				],
				amber: [
					"Prévoyez un plan de formation continue sur les nouvelles méthodes pédagogiques (pédagogie active, classe inversée).",
					"Mettez en place un système de reconnaissance et de valorisation des initiatives pédagogiques innovantes.",
				],
				green: [
					"Développez une politique de recherche et de publication pour renforcer le prestige académique de votre établissement.",
					"Travaillez sur le bien-être au travail des professeurs pour limiter le turnover et garantir la stabilité pédagogique.",
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
							recommendation: "Réunissez un conseil de perfectionnement avec des professionnels du secteur pour actualiser vos programmes.",
						},
						{
							label: "Révision tous les 3-5 ans",
							score: 1,
							recommendation: "Mettez en place une veille active sur l'évolution des métiers pour intégrer des modules de compétences émergentes chaque année.",
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
							recommendation: "Signez des partenariats avec des entreprises locales pour faciliter les stages et les interventions professionnelles.",
						},
						{
							label: "Quelques stages en entreprise",
							score: 1,
							recommendation: "Développez des chaires d'entreprise ou des projets tutorés réels pour ancrer votre école dans le monde professionnel.",
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
					"Définissez votre 'Identité Pédagogique' : qu'est-ce qui rend votre enseignement unique et supérieur à la concurrence ?",
					"Réalisez une analyse SWOT pour identifier vos opportunités de croissance (nouveaux diplômes, zones géographiques).",
				],
				amber: [
					"Engagez une démarche de certification ou de labellisation qualité (ex: Qualiopi ou certifications internationales).",
					"Étudiez l'opportunité de développer des cursus en alternance pour répondre à la demande des étudiants et des entreprises.",
				],
				green: [
					"Explorez des opportunités de croissance externe ou de franchise pour dupliquer votre modèle.",
					"Anticipez les mutations de votre secteur (digitalisation, hybridation) dans votre plan stratégique à 5 ans.",
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
							recommendation: "Adoptez une plateforme LMS (Moodle, Canvas) pour centraliser vos ressources pédagogiques et permettre le travail à distance.",
						},
						{
							label: "Dépôt de fichiers simple (PDF/Drive)",
							score: 1,
							recommendation: "Enrichissez votre plateforme avec des contenus interactifs (vidéos, quiz, forums) pour engager davantage les étudiants.",
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
							recommendation: "Prévoyez un plan de renouvellement de votre parc informatique et assurez une connexion Wi-Fi haut débit dans tout l'établissement.",
						},
						{
							label: "Matériel fonctionnel mais vieillissant",
							score: 1,
							recommendation: "Encouragez le BYOD (Bring Your Own Device) en proposant des prises et des services cloud adaptés aux équipements des étudiants.",
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
					"Sécurisez les données personnelles des étudiants et des professeurs en conformité avec le RGPD.",
					"Formez votre personnel et vos enseignants à l'usage pédagogique des outils numériques.",
				],
				amber: [
					"Intégrez votre LMS avec votre système de gestion administrative pour automatiser les inscriptions aux cours et les notes.",
					"Mettez en place une politique de cybersécurité stricte pour protéger vos examens et vos diplômes.",
				],
				green: [
					"Expérimentez l'usage de l'IA générative dans l'apprentissage et formez les étudiants à son usage éthique.",
					"Développez des espaces d'apprentissage innovants (Learning Labs) équipés de technologies collaboratives.",
				],
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
							recommendation: "Rédigez et diffusez une charte de bonne conduite et créez une cellule d'écoute pour prévenir le harcèlement.",
						},
						{
							label: "Sensibilisation ponctuelle",
							score: 1,
							recommendation: "Formez tout votre personnel (enseignant et administratif) à la détection des signaux faibles de mal-être chez les étudiants.",
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
							recommendation: "Réalisez un audit de vos pratiques de traitement des données et nommez un DPO (Délégué à la Protection des Données).",
						},
						{
							label: "Conformité partielle",
							score: 1,
							recommendation: "Sensibilisez vos équipes aux risques de fuites de données et sécurisez les accès aux dossiers scolaires confidentiels.",
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
					"Vérifiez que votre établissement respecte toutes les normes de sécurité incendie et d'accessibilité (ERP).",
					"Assurez-vous que vos diplômes sont bien enregistrés au RNCP ou reconnus par les autorités compétentes.",
				],
				amber: [
					"Mettez en place un plan de gestion de crise en cas d'accident ou de bad buzz sur les réseaux sociaux.",
					"Auditez vos contrats d'assurance pour couvrir les risques liés aux activités extrascolaires et aux stages.",
				],
				green: [
					"Préparez une gestion de crise structurée avec des protocoles clairs de communication interne et externe.",
					"Mettez en place une veille juridique active sur les évolutions du droit de l'éducation.",
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
							recommendation: "Engagez les démarches pour obtenir une reconnaissance officielle ou un label de qualité académique.",
						},
						{
							label: "Reconnaissance locale ou en cours",
							score: 1,
							recommendation: "Communiquez sur vos classements et vos succès académiques pour renforcer votre attractivité.",
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
							recommendation: "Réalisez une enquête d'insertion professionnelle 6 mois après l'obtention du diplôme pour collecter vos premiers chiffres clés.",
						},
						{
							label: "Suivi déclaratif partiel",
							score: 1,
							recommendation: "Publiez annuellement vos statistiques certifiées de réussite aux examens et d'embauche de vos diplômés.",
						},
						{
							label: "Statistiques certifiées et publiées",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez une identité visuelle professionnelle et cohérente sur tous vos supports (brochures, site, réseaux sociaux).",
					"Soignez votre premier contact candidat : l'accueil lors des journées portes ouvertes est déterminant pour l'inscription.",
				],
				amber: [
					"Utilisez les témoignages de vos meilleurs diplômés pour humaniser votre promesse de réussite.",
					"Modernisez votre signalétique et l'aménagement de vos campus pour refléter une image d'excellence.",
				],
				green: [
					"Développez une stratégie de relations presse pour faire connaître vos innovations pédagogiques.",
					"Créez une marque forte autour de votre réseau d'anciens (ex: 'The [School Name] Network').",
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
							recommendation: "Établissez vos premiers partenariats avec des écoles étrangères pour permettre la mobilité étudiante.",
						},
						{
							label: "Quelques partenariats ponctuels",
							score: 1,
							recommendation: "Développez des doubles diplômes internationaux pour augmenter la valeur de votre cursus sur le marché mondial.",
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
							recommendation: "Lancez au moins un cursus anglophone et facilitez les démarches administratives pour les étudiants internationaux.",
						},
						{
							label: "Accueil ponctuel d'étrangers",
							score: 1,
							recommendation: "Créez un 'International Office' dédié à l'accompagnement des étudiants étrangers (logement, visas, intégration).",
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
					"Identifiez les zones géographiques où la demande pour vos formations est forte.",
					"Vérifiez si vos diplômes sont reconnus ou équivalents dans vos pays cibles.",
				],
				amber: [
					"Traduisez l'intégralité de vos supports de communication et de vos programmes en anglais.",
					"Participez à des salons de recrutement d'étudiants internationaux dans vos pays prioritaires.",
				],
				green: [
					"Ouvrez un campus ou un bureau de représentation à l'étranger pour recruter au plus près des candidats.",
					"Développez des cursus en ligne (MOOC) accessibles mondialement pour tester de nouveaux marchés.",
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
