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
							recommendation: "Recherchez un financement de campagne ou une ligne de crédit de court terme pour sécuriser vos cycles d'exploitation.",
						},
						{
							label: "Oui, mais sans marge de sécurité",
							score: 1,
							recommendation: "Établissez un plan de trésorerie prévisionnel glissant sur 12 mois pour anticiper les périodes creuses.",
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
							recommendation: "Mettez en place une comptabilité analytique pour identifier vos cultures les plus rentables.",
						},
						{
							label: "Partiellement, estimation approximative",
							score: 1,
							recommendation: "Utilisez un outil de gestion parcellaire pour calculer précisément vos marges par culture.",
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
					"Commencez à noter quotidiennement toutes vos dépenses d'exploitation (intrants, carburant).",
					"Séparez strictement votre compte bancaire personnel de celui de l'exploitation.",
				],
				amber: [
					"Comparez vos coûts de production avec les moyennes régionales pour identifier des économies possibles.",
					"Négociez des délais de paiement plus longs avec vos fournisseurs d'engrais et de semences.",
				],
				green: [
					"Investissez vos excédents dans l'amélioration de la fertilité des sols (capital sol).",
					"Explorez les subventions pour la transition écologique ou l'agroforesterie.",
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
							recommendation: "Réalisez des analyses de sol régulières pour ajuster précisément vos apports en fertilisants.",
						},
						{
							label: "Oui, suivi des quantités consommées",
							score: 1,
							recommendation: "Installez des sondes capacitives pour piloter votre irrigation au plus juste des besoins de la plante.",
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
							recommendation: "Évaluez la rentabilité de l'achat ou de la location de matériel pour réduire la pénibilité du travail.",
						},
						{
							label: "Partiellement mécanisé",
							score: 1,
							recommendation: "Adhérez à une CUMA (Coopérative d'Utilisation de Matériel Agricole) pour accéder à du matériel performant à moindre coût.",
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
					"Documentez vos protocoles de culture (calendrier de semis, doses d'application).",
					"Mettez en place un plan de maintenance préventive pour votre matériel agricole.",
				],
				amber: [
					"Standardisez vos flux de travail pour gagner du temps lors des périodes de pointe (moisson, vendanges).",
					"Optimisez vos zones de stockage pour réduire les pertes post-récolte.",
				],
				green: [
					"Automatisez le suivi de vos stocks d'intrants avec des alertes de réapprovisionnement.",
					"Implémentez une démarche de certification qualité (HVE, Bio, etc.) pour valoriser vos pratiques.",
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
							recommendation: "Étudiez la possibilité de vendre une partie de votre production en circuit court pour augmenter vos marges.",
						},
						{
							label: "Mixte (Gros + un peu de direct)",
							score: 1,
							recommendation: "Développez une activité de transformation (confitures, jus, découpe) pour capter plus de valeur ajoutée.",
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
							recommendation: "Commencez à utiliser des contrats à terme pour sécuriser un prix de vente minimum.",
						},
						{
							label: "Quelques contrats verbaux ou partiels",
							score: 1,
							recommendation: "Formalisez vos accords de vente par des contrats écrits pour sécuriser vos débouchés.",
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
					"Identifiez vos clients finaux et comprenez leurs attentes en termes de qualité.",
					"Créez une fiche produit simple détaillant les caractéristiques de votre production.",
				],
				amber: [
					"Développez une présence sur les réseaux sociaux pour communiquer sur votre métier et vos produits.",
					"Rejoignez un groupement de producteurs pour peser davantage dans les négociations commerciales.",
				],
				green: [
					"Optimisez votre logistique de livraison pour réduire les coûts du dernier kilomètre.",
					"Créez un site de vente en ligne ou de pré-commande pour vos clients fidèles.",
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
							recommendation: "Anticipez vos besoins de main-d'œuvre et vérifiez la conformité des logements saisonniers.",
						},
						{
							label: "Recrutement anticipé mais logement précaire",
							score: 1,
							recommendation: "Améliorez les conditions d'accueil pour fidéliser vos saisonniers d'une année sur l'autre.",
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
							recommendation: "Rédigez des consignes de sécurité simples et affichez-les près du matériel dangereux.",
						},
						{
							label: "Partielle / Oralement seulement",
							score: 1,
							recommendation: "Organisez une journée de formation sécurité annuelle pour tous les salariés et saisonniers.",
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
					"Définissez clairement les responsabilités de chacun au sein de l'exploitation.",
					"Assurez-vous que le Document Unique d'Évaluation des Risques (DUER) est à jour.",
				],
				amber: [
					"Proposez des formations techniques (ex: Certiphyto) à vos salariés pour monter en compétence.",
					"Mettez en place un système de primes simples basées sur la qualité du travail (ex: propreté des récoltes).",
				],
				green: [
					"Préparez la transmission de l'exploitation en formant un successeur ou un chef de culture.",
					"Améliorez le bien-être au travail pour réduire l'accidentologie et l'absentéisme.",
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
							recommendation: "Réalisez une étude de marché sur les opportunités de diversification (agrotourisme, photovoltaïque, etc.).",
						},
						{
							label: "Réflexion en cours / Tests",
							score: 1,
							recommendation: "Lancez un projet pilote de diversification à petite échelle pour tester la viabilité.",
						},
						{
							label: "Oui / Revenus diversifiés",
							score: 3,
						},
					],
				},
				{
					id: "agriculture_strategy_2",
					text: "Pratiquez-vous une agriculture durable pour préserver la valeur de vos terres à long terme ?",
					options: [
						{
							label: "Non, culture intensive classique",
							score: 0,
							recommendation: "Introduisez des cultures intermédiaires (couverts végétaux) pour protéger et enrichir vos sols.",
						},
						{
							label: "Démarches isolées (ex: rotation raisonnée)",
							score: 1,
							recommendation: "Engagez-vous dans une démarche globale d'agriculture de conservation ou de régénération.",
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
					"Rédigez un projet d'exploitation à 5 ans pour donner une direction claire à votre activité.",
					"Analysez vos forces et faiblesses face au changement climatique.",
				],
				amber: [
					"Échangez avec d'autres agriculteurs au sein d'un groupe de progrès ou d'un GIEE.",
					"Réalisez un bilan carbone de votre exploitation pour identifier des leviers d'amélioration.",
				],
				green: [
					"Participez à des projets de recherche et développement locaux (ferme pilote).",
					"Développez des partenariats avec des acteurs du territoire (collectivités, écoles).",
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
							recommendation: "Équipez votre tracteur principal d'un système de guidage GPS pour réduire les chevauchements et les manques.",
						},
						{
							label: "Oui, quelques outils (ex: barre de guidage)",
							score: 1,
							recommendation: "Utilisez la modulation de dose (VRA) pour optimiser l'épandage d'engrais selon le potentiel de chaque zone.",
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
							recommendation: "Passez à un logiciel de gestion parcellaire simple (ou application mobile) pour sécuriser votre traçabilité.",
						},
						{
							label: "Tableur Excel classique",
							score: 1,
							recommendation: "Adoptez un logiciel métier connecté à vos outils de bord pour automatiser la saisie des travaux.",
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
					"Installez des outils de gestion de base (station météo connectée).",
					"Sauvegardez vos données d'exploitation sur un support numérique sécurisé.",
				],
				amber: [
					"Utilisez des images satellites gratuites (ex: Sentinel) pour surveiller l'état de vos cultures.",
					"Intégrez vos données de gestion avec les outils de votre conseiller technique.",
				],
				green: [
					"Expérimentez l'utilisation de capteurs IoT pour le suivi en temps réel de vos stocks ou du bien-être animal.",
					"Explorez l'utilisation de l'intelligence artificielle pour prédire les risques de maladies.",
				],
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
							recommendation: "Souscrivez une assurance multirisque climatique (MRC) pour protéger votre chiffre d'affaires.",
						},
						{
							label: "Assurance partielle (Grêle/Incendie uniquement)",
							score: 1,
							recommendation: "Étudiez le coût d'une couverture complète contre la sécheresse et les inondations.",
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
							recommendation: "Instaurez des mesures d'hygiène strictes (sas sanitaires, pédiluves) pour limiter l'entrée de pathogènes.",
						},
						{
							label: "Mesures d'hygiène de base",
							score: 1,
							recommendation: "Formez votre personnel aux signes précoces de maladies pour intervenir le plus tôt possible.",
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
					"Identifiez les dépendances critiques de votre exploitation (ex: unique fournisseur de pièces).",
					"Vérifiez que tous vos contrats d'assurance couvrent bien la valeur réelle de vos stocks.",
				],
				amber: [
					"Mettez en place un plan de continuité en cas d'incapacité prolongée de l'exploitant.",
					"Réalisez un audit de sécurité incendie de vos bâtiments agricoles.",
				],
				green: [
					"Implémentez un système de surveillance vidéo ou d'alarmes pour protéger vos stocks et votre matériel.",
					"Travaillez sur la résilience de l'exploitation face aux crises sanitaires mondiales.",
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
							recommendation: "Évaluez l'intérêt de vous engager dans un label reconnu pour mieux valoriser vos produits.",
						},
						{
							label: "En conversion ou certification partielle",
							score: 1,
							recommendation: "Communiquez activement sur votre démarche de progrès et vos efforts environnementaux.",
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
							recommendation: "Créez une identité visuelle (logo) et racontez l'histoire de votre ferme sur vos emballages.",
						},
						{
							label: "Un peu de communication locale",
							score: 1,
							recommendation: "Organisez des journées 'ferme ouverte' pour recréer du lien avec les consommateurs locaux.",
						},
						{
							label: "Oui, Storytelling fort (Terroir, Savoir-faire)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez le nom de votre exploitation comme une marque à part entière.",
					"Uniformisez la présentation de vos produits sur les lieux de vente.",
				],
				amber: [
					"Améliorez la qualité de vos emballages pour qu'ils reflètent la qualité de vos produits.",
					"Sollicitez des articles dans la presse locale ou spécialisée pour faire connaître votre exploitation.",
				],
				green: [
					"Collaborez avec des chefs cuisiniers locaux pour qu'ils deviennent les ambassadeurs de vos produits.",
					"Développez une gamme de coffrets cadeaux premium pour les entreprises locales.",
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
							recommendation: "Mettez-vous aux normes internationales (ex: GlobalGAP) pour ouvrir les portes des marchés étrangers.",
						},
						{
							label: "En cours de mise aux normes",
							score: 1,
							recommendation: "Faites auditer votre exploitation par un organisme agréé export pour valider votre conformité.",
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
							recommendation: "Associez-vous à un exportateur ou une coopérative maîtrisant la logistique internationale.",
						},
						{
							label: "Sous-traitance logistique",
							score: 1,
							recommendation: "Optimisez vos emballages de transport pour garantir la fraîcheur sur de longues distances.",
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
					"Étudiez quels pays voisins importent des produits similaires aux vôtres.",
					"Identifiez les barrières tarifaires et douanières pour vos produits.",
				],
				amber: [
					"Participez à des salons professionnels internationaux pour rencontrer des acheteurs étrangers.",
					"Traduisez vos supports commerciaux et fiches produits dans les langues de vos pays cibles.",
				],
				green: [
					"Développez un partenariat exclusif avec un distributeur dans un pays stratégique.",
					"Adaptez vos variétés ou vos produits aux goûts spécifiques des consommateurs étrangers.",
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
