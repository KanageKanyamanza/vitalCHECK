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
							recommendation: "Mettez en place un tableau de bord mensuel simple pour suivre votre chiffre d'affaires et vos charges.",
						},
						{
							label: "Suivi trimestriel ou irrégulier",
							score: 1,
							recommendation: "Augmentez la fréquence de votre suivi financier pour réagir plus vite en cas de baisse d'activité.",
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
							recommendation: "Ouvrez un compte bancaire dédié à votre activité et cessez de payer des dépenses personnelles avec les fonds de l'entreprise.",
						},
						{
							label:
								"Séparation informelle (comptes distincts mais flux croisés)",
							score: 1,
							recommendation: "Formalisez vos retraits de rémunération et évitez les transferts irréguliers entre vos comptes.",
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
					"Prenez rendez-vous avec un comptable pour régulariser votre situation financière.",
					"Identifiez vos 5 plus gros postes de dépenses et cherchez à les réduire de 10%.",
				],
				amber: [
					"Établissez un budget prévisionnel pour l'année prochaine.",
					"Mettez en place un système de relance automatique pour vos factures impayées.",
				],
				green: [
					"Constituez une réserve de trésorerie de sécurité équivalente à 3 mois de charges fixes.",
					"Optimisez votre fiscalité en consultant un expert-comptable ou un conseiller fiscal.",
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
							recommendation: "Rédigez des guides opératoires simples (checklists) pour les tâches répétitives.",
						},
						{
							label: "Quelques modes opératoires écrits",
							score: 1,
							recommendation: "Centralisez vos procédures dans un manuel opératoire accessible à toute l'équipe.",
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
							recommendation: "Bloquez 2 heures par semaine pour réfléchir à comment simplifier votre organisation.",
						},
						{
							label: "Optimisation au coup par coup",
							score: 1,
							recommendation: "Identifiez les tâches que vous pourriez déléguer à un assistant ou automatiser avec un logiciel.",
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
					"Répertoriez tous les goulots d'étranglement qui ralentissent votre activité quotidienne.",
					"Standardisez vos outils de travail pour éviter les pertes de temps et les erreurs.",
				],
				amber: [
					"Implémentez une méthode de gestion du temps (ex: Pomodoro ou Time Blocking) pour gagner en efficacité.",
					"Améliorez l'ergonomie de votre espace de travail ou de production.",
				],
				green: [
					"Automatisez vos flux d'informations entre vos différents logiciels (ex: via Zapier).",
					"Engagez-vous dans une démarche d'amélioration continue (Lean Management).",
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
							recommendation: "Définissez votre 'Persona' (client idéal) pour mieux cibler vos efforts marketing.",
						},
						{
							label: "Cible vague ou intuitive",
							score: 1,
							recommendation: "Interrogez vos 10 meilleurs clients pour comprendre pourquoi ils ont choisi votre entreprise.",
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
							recommendation: "Mettez en place un calendrier de relance systématique pour tous vos devis envoyés.",
						},
						{
							label: "Relance sporadique quand j'y pense",
							score: 1,
							recommendation: "Utilisez un logiciel de CRM simple pour ne plus oublier aucun prospect à relancer.",
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
					"Créez une présentation commerciale impactante mettant en avant les bénéfices clients.",
					"Assurez-vous d'avoir une présence minimale en ligne (site web ou réseaux sociaux actifs).",
				],
				amber: [
					"Développez un système de parrainage pour inciter vos clients actuels à vous recommander.",
					"Améliorez la qualité de vos devis pour qu'ils soient plus lisibles et professionnels.",
				],
				green: [
					"Testez de nouveaux canaux d'acquisition (publicité ciblée, partenariats).",
					"Mesurez votre taux de conversion (devis signés / devis envoyés) et cherchez à l'augmenter.",
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
							recommendation: "Rédigez des fiches de poste claires définissant les missions et les objectifs de chacun.",
						},
						{
							label: "Briefs sommaires",
							score: 1,
							recommendation: "Organisez des entretiens de cadrage plus réguliers pour aligner les attentes.",
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
							recommendation: "Identifiez les compétences manquantes dans votre entreprise et prévoyez un plan de formation.",
						},
						{
							label: "Auto-formation ponctuelle",
							score: 1,
							recommendation: "Utilisez votre budget formation (OPCO) pour financer des formations qualifiantes.",
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
					"Clarifiez l'organigramme et les responsabilités au sein de votre équipe.",
					"Assurez-vous d'être en conformité avec la réglementation du travail.",
				],
				amber: [
					"Instaurez des rituels d'équipe pour améliorer la communication interne.",
					"Définissez une politique de rémunération équitable et motivante.",
				],
				green: [
					"Développez une culture d'entreprise forte pour attirer et fidéliser les talents.",
					"Mettez en place un système de management participatif.",
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
							recommendation: "Prenez une journée pour définir votre vision et vos objectifs à long terme.",
						},
						{
							label: "Idée générale en tête",
							score: 1,
							recommendation: "Mettez vos objectifs par écrit et déclinez-les en étapes concrètes pour les prochains mois.",
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
							recommendation: "Dégagez-vous du temps chaque semaine pour réfléchir à l'avenir de votre activité.",
						},
						{
							label: "Rarement (vacances/événements)",
							score: 1,
							recommendation: "Organisez un séminaire stratégique (même seul) une fois par trimestre.",
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
					"Analysez votre environnement concurrentiel pour identifier vos opportunités de croissance.",
					"Définissez vos valeurs d'entreprise pour guider vos prises de décision.",
				],
				amber: [
					"Réalisez une analyse SWOT (Forces, Faiblesses, Opportunités, Menaces) de votre activité.",
					"Identifiez vos avantages concurrentiels durables.",
				],
				green: [
					"Mettez en place un tableau de bord prospectif (Balanced Scorecard).",
					"Explorez des opportunités de croissance externe ou de nouveaux marchés.",
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
							recommendation: "Adoptez une suite d'outils collaboratifs (Google Workspace ou Office 365) pour simplifier votre travail.",
						},
						{
							label: "Usage basique (Email, Drive perso)",
							score: 1,
							recommendation: "Centralisez vos documents sur un espace cloud partagé et sécurisé.",
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
							recommendation: "Mettez en place une sauvegarde automatique de vos données vers un cloud sécurisé.",
						},
						{
							label: "Sauvegarde manuelle sur disque dur",
							score: 1,
							recommendation: "Automatisez vos sauvegardes pour éviter tout risque de perte de données en cas d'oubli.",
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
					"Équipez votre entreprise d'outils numériques modernes adaptés à votre activité.",
					"Sensibilisez votre équipe à la cybersécurité (mots de passe forts, vigilance emails).",
				],
				amber: [
					"Utilisez un gestionnaire de mots de passe pour sécuriser vos accès.",
					"Intégrez vos différents outils pour éviter les doubles saisies.",
				],
				green: [
					"Expérimentez de nouveaux outils basés sur l'intelligence artificielle pour booster votre productivité.",
					"Mettez en place une veille technologique pour rester à la pointe de votre secteur.",
				],
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
							recommendation: "Identifiez les risques majeurs (financiers, juridiques, opérationnels) et prévoyez des solutions.",
						},
						{
							label: "Vaguement (ex: perte gros client)",
							score: 1,
							recommendation: "Rédigez un plan de continuité d'activité pour faire face aux imprévus majeurs.",
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
							recommendation: "Consultez un conseiller juridique pour faire le point sur vos obligations réglementaires.",
						},
						{
							label: "Conformité supposée",
							score: 1,
							recommendation: "Réalisez un audit de conformité pour vous assurer de respecter toutes les normes en vigueur.",
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
					"Vérifiez vos contrats d'assurance et assurez-vous d'être bien couvert pour vos activités réelles.",
					"Sécurisez vos données sensibles et respectez la réglementation RGPD.",
				],
				amber: [
					"Mettez en place une veille juridique régulière.",
					"Auditez vos contrats fournisseurs pour limiter vos risques de dépendance.",
				],
				green: [
					"Préparez une gestion de crise structurée avec des porte-paroles identifiés.",
					"Obtenez des labels ou certifications de qualité pour rassurer vos partenaires.",
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
							recommendation: "Créez une charte graphique professionnelle simple (logo, couleurs, police).",
						},
						{
							label: "Propre mais disparate",
							score: 1,
							recommendation: "Harmonisez tous vos supports de communication pour renforcer votre crédibilité.",
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
							recommendation: "Commencez à recueillir des avis clients pour les afficher sur votre site web.",
						},
						{
							label: "Quand l'occasion se présente",
							score: 1,
							recommendation: "Automatisez la demande d'avis après chaque vente ou prestation réussie.",
						},
						{
							label: "Processus de collecte d'avis automatisé",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez votre 'Promesse de marque' : ce que vos clients peuvent attendre de vous sans faute.",
					"Soignez votre premier contact client (accueil téléphonique, réponse email).",
				],
				amber: [
					"Créez du contenu (articles, vidéos) pour démontrer votre expertise sur les réseaux sociaux.",
					"Participez à des événements de réseautage local pour faire connaître votre marque.",
				],
				green: [
					"Développez une stratégie de relations presse pour gagner en visibilité médiatique.",
					"Créez une expérience client unique et mémorable à chaque étape du parcours.",
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
							recommendation: "Étudiez si votre concept pourrait être dupliqué dans d'autres régions.",
						},
						{
							label: "Opportunités régionales possibles",
							score: 1,
							recommendation: "Analysez la demande pour vos services ou produits au-delà de vos frontières habituelles.",
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
							recommendation: "Listez les contraintes légales et logistiques pour une expansion géographique.",
						},
						{
							label: "Quelques idées",
							score: 1,
							recommendation: "Réalisez une étude de marché sur une zone géographique cible prioritaire.",
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
					"Vérifiez si vos produits ou services sont adaptés à d'autres cultures ou marchés.",
					"Informez-vous sur les dispositifs d'aide à l'exportation.",
				],
				amber: [
					"Testez votre offre sur un nouveau marché géographique à petite échelle.",
					"Traduisez vos supports de communication les plus importants.",
				],
				green: [
					"Recrutez un responsable export ou expansion si le potentiel est confirmé.",
					"Adaptez votre logistique pour livrer plus loin tout en restant rentable.",
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
