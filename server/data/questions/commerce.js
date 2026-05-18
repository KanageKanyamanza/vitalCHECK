module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "commerce_finance_1",
					text: "Surveillez-vous quotidiennement la marge par produit et le taux de rotation des stocks ?",
					options: [
						{
							label: "Pas de suivi précis",
							score: 0,
							recommendation: "Mettez en place un tableau de bord quotidien pour suivre vos marges réelles et la rotation de vos stocks.",
						},
						{
							label: "Suivi hebdomadaire/mensuel",
							score: 1,
							recommendation: "Automatisez vos rapports de vente pour identifier plus rapidement les produits 'dormants' qui pèsent sur votre trésorerie.",
						},
						{
							label: "Suivi quotidien automatisé",
							score: 3,
						},
					],
				},
				{
					id: "commerce_finance_2",
					text: "Avez-vous un plan de trésorerie pour financer les gros achats de stock saisonniers ?",
					options: [
						{
							label: "Non, achats au coup par coup",
							score: 0,
							recommendation: "Élaborez un plan de trésorerie annuel pour anticiper et financer vos pics de stocks saisonniers.",
						},
						{
							label: "Budget prévisionnel simple",
							score: 1,
							recommendation: "Négociez des lignes de crédit de campagne avec votre banque pour profiter de remises sur volumes auprès de vos fournisseurs.",
						},
						{
							label: "Plan de trésorerie détaillé et lignes de crédit",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Réalisez un inventaire complet pour assainir vos données financières.",
					"Calculez précisément votre point mort (seuil de rentabilité) mensuel.",
				],
				amber: [
					"Réduisez vos délais de paiement clients (si B2B) pour améliorer votre fonds de roulement.",
					"Analysez la rentabilité de chaque canal de vente (boutique vs web).",
				],
				green: [
					"Réinvestissez vos marges dans l'acquisition de nouveaux segments de clientèle.",
					"Explorez des modèles de revenus récurrents (abonnements, box) pour stabiliser votre trésorerie.",
				],
			},
		},
		{
			id: "operations",
			name: "Opérations",
			questions: [
				{
					id: "commerce_operations_1",
					text: "Votre gestion des stocks est-elle connectée en temps réel à vos points de vente (physique/web) ?",
					options: [
						{
							label: "Non, inventaires manuels périodiques",
							score: 0,
							recommendation: "Investissez dans un logiciel de gestion de stock (ERP/POS) synchronisé en temps réel.",
						},
						{
							label: "Connexion partielle (décalage)",
							score: 1,
							recommendation: "Fiabilisez la synchronisation entre votre stock physique et votre boutique en ligne pour éviter les ruptures.",
						},
						{
							label: "Oui, synchronisation temps réel omnicanale",
							score: 3,
						},
					],
				},
				{
					id: "commerce_operations_2",
					text: "Avez-vous optimisé votre processus de traitement des retours et du SAV ?",
					options: [
						{
							label: "Gestion informelle et lente",
							score: 0,
							recommendation: "Définissez une politique de retour claire et un processus standard pour traiter les réclamations en moins de 48h.",
						},
						{
							label: "Processus défini mais perfectible",
							score: 1,
							recommendation: "Automatisez les étiquettes de retour et le suivi des remboursements pour améliorer l'expérience client.",
						},
						{
							label: "Gestion fluide et automatisée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Standardisez vos processus de réception et d'étiquetage des marchandises.",
					"Mettez en place des procédures de contrôle qualité à l'expédition pour réduire les erreurs.",
				],
				amber: [
					"Optimisez l'agencement de votre zone de stockage pour réduire le temps de préparation des commandes (Picking).",
					"Négociez de meilleurs tarifs avec vos prestataires de transport (colis).",
				],
				green: [
					"Externalisez votre logistique (3PL) si votre volume dépasse vos capacités internes.",
					"Implémentez une solution de Business Intelligence pour prédire vos besoins de stocks.",
				],
			},
		},
		{
			id: "sales",
			name: "Ventes",
			questions: [
				{
					id: "commerce_sales_1",
					text: "Utilisez-vous un programme de fidélité pour augmenter le panier moyen et la fréquence d'achat ?",
					options: [
						{
							label: "Aucun programme",
							score: 0,
							recommendation: "Lancez un programme de fidélité simple pour récompenser vos clients réguliers.",
						},
						{
							label: "Programme simple (carte à points)",
							score: 1,
							recommendation: "Digitalisez votre programme de fidélité pour envoyer des offres personnalisées par SMS ou Email.",
						},
						{
							label: "Programme personnalisé (CRM/Automation)",
							score: 3,
						},
					],
				},
				{
					id: "commerce_sales_2",
					text: "Analysez-vous le trafic en magasin/site pour optimiser les taux de conversion ?",
					options: [
						{
							label: "Pas d'analyse de trafic",
							score: 0,
							recommendation: "Installez des compteurs de passage en magasin ou Google Analytics sur votre site pour mesurer votre attractivité.",
						},
						{
							label: "Estimation du flux",
							score: 1,
							recommendation: "Calculez votre taux de transformation (achats / visites) et formez l'équipe à l'accueil pour l'améliorer.",
						},
						{
							label: "Analyse précise (taux de transformation mesuré)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Améliorez votre merchandising visuel (vitrines, photos produits) pour attirer l'œil.",
					"Assurez-vous que vos coordonnées et horaires sont à jour sur Google My Business.",
				],
				amber: [
					"Mettez en place des techniques de vente additionnelle (Cross-selling) au moment du passage en caisse.",
					"Utilisez le Retargeting publicitaire pour relancer les paniers abandonnés sur votre site.",
				],
				green: [
					"Développez une stratégie de contenu (Social Commerce) pour vendre directement via Instagram ou TikTok.",
					"Créez des événements exclusifs (ventes privées) pour vos meilleurs clients.",
				],
			},
		},
		{
			id: "people",
			name: "RH",
			questions: [
				{
					id: "commerce_people_1",
					text: "Vos vendeurs sont-ils formés et incentivés sur les ventes additionnelles (cross-selling) ?",
					options: [
						{
							label: "Non, salaire fixe sans formation",
							score: 0,
							recommendation: "Formez vos équipes aux techniques de vente et instaurez une prime sur les objectifs de vente.",
						},
						{
							label: "Formation ponctuelle / Primes floues",
							score: 1,
							recommendation: "Créez un challenge de vente mensuel pour motiver les équipes sur des produits spécifiques.",
						},
						{
							label: "Formation continue et commissions structurées",
							score: 3,
						},
					],
				},
				{
					id: "commerce_people_2",
					text: "Comment gérez-vous la flexibilité des plannings lors des pics d'activité (soldes, fêtes) ?",
					options: [
						{
							label: "Surcharge ou manque de personnel",
							score: 0,
							recommendation: "Anticipez vos besoins en personnel 3 mois avant les périodes fortes et prévoyez des renforts.",
						},
						{
							label: "Recours ponctuel à des extras",
							score: 1,
							recommendation: "Constituez un vivier de freelances ou d'étudiants déjà formés à vos processus pour les pics d'activité.",
						},
						{
							label: "Plannings optimisés et vivier de renforts",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez un code de conduite et des standards de service client pour toute l'équipe.",
					"Réalisez des points d'équipe hebdomadaires pour partager les chiffres de vente et les retours clients.",
				],
				amber: [
					"Déléguez davantage de responsabilités opérationnelles à vos responsables de rayon ou adjoints.",
					"Mettez en place un plan de formation sur la connaissance produit (Storytelling).",
				],
				green: [
					"Implémentez un outil de gestion des plannings en ligne pour faciliter la communication RH.",
					"Développez un programme de bien-être au travail pour réduire le turnover en boutique.",
				],
			},
		},
		{
			id: "strategy",
			name: "Stratégie",
			questions: [
				{
					id: "commerce_strategy_1",
					text: "Avez-vous une stratégie omnicanale claire unifiant l'expérience client physique et digitale ?",
					options: [
						{
							label: "Canaux isolés (Silo)",
							score: 0,
							recommendation: "Mettez en place le Click & Collect pour lier votre boutique physique et votre site web.",
						},
						{
							label: "Début d'unification",
							score: 1,
							recommendation: "Unifiez votre base de données client pour qu'un client soit reconnu aussi bien en ligne qu'en magasin.",
						},
						{
							label: "Expérience client sans couture (Click & Collect, etc.)",
							score: 3,
						},
					],
				},
				{
					id: "commerce_strategy_2",
					text: "Surveillez-vous activement les prix et l'assortiment de la concurrence directe ?",
					options: [
						{
							label: "Aucune veille",
							score: 0,
							recommendation: "Identifiez vos 3 concurrents principaux et surveillez leurs promotions chaque semaine.",
						},
						{
							label: "Veille manuelle irrégulière",
							score: 1,
							recommendation: "Utilisez un outil de veille tarifaire automatique pour rester compétitif sur vos produits phares.",
						},
						{
							label: "Veille concurrentielle automatisée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Clarifiez votre positionnement : êtes-vous un discounter, une boutique de niche ou un commerce de proximité ?",
					"Réalisez un diagnostic de votre zone de chalandise pour comprendre le potentiel local.",
				],
				amber: [
					"Diversifiez votre assortiment avec des produits exclusifs ou des marques propres.",
					"Renforcez votre image de marque locale par des partenariats avec d'autres commerçants.",
				],
				green: [
					"Explorez l'ouverture d'un nouveau point de vente ou d'un showroom.",
					"Développez une stratégie de franchise ou d'affiliation si votre concept est rodé.",
				],
			},
		},
		{
			id: "technology",
			name: "Technologie",
			questions: [
				{
					id: "commerce_technology_1",
					text: "Utilisez-vous un CRM pour segmenter votre base client et personnaliser les offres ?",
					options: [
						{
							label: "Pas de CRM",
							score: 0,
							recommendation: "Adoptez un CRM simple pour collecter les emails et dates d'anniversaire de vos clients.",
						},
						{
							label: "Fichier client simple",
							score: 1,
							recommendation: "Segmentez vos clients selon leur fréquence d'achat pour envoyer des offres ultra-ciblées.",
						},
						{
							label: "CRM intégré avec segmentation et historique",
							score: 3,
						},
					],
				},
				{
					id: "commerce_technology_2",
					text: "Votre site e-commerce est-il optimisé pour le mobile (m-commerce) ?",
					options: [
						{
							label: "Site non responsive",
							score: 0,
							recommendation: "Refondez votre site web pour qu'il soit 'Mobile-First', c'est là que se font la majorité des achats.",
						},
						{
							label: "Site responsive basique",
							score: 1,
							recommendation: "Simplifiez le processus de paiement (One-click payment) pour réduire l'abandon de panier sur mobile.",
						},
						{
							label: "Expérience mobile fluide / App dédiée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Modernisez votre équipement de caisse avec une solution de paiement moderne (sans contact, mobile).",
					"Sécurisez votre connexion Wi-Fi client et vos terminaux de paiement.",
				],
				amber: [
					"Intégrez votre logiciel de caisse avec votre logiciel de comptabilité pour gagner du temps.",
					"Utilisez des outils de marketing automation pour envoyer des rappels de panier abandonné.",
				],
				green: [
					"Expérimentez l'IA pour recommander des produits complémentaires sur votre site e-commerce.",
					"Mettez en place des bornes interactives ou des QR codes en magasin pour enrichir l'expérience client.",
				],
			},
		},
		{
			id: "risks",
			name: "Risques",
			questions: [
				{
					id: "commerce_risks_1",
					text: "Quelles mesures avez-vous contre la démarque inconnue (vol interne/externe) ?",
					options: [
						{
							label: "Aucune mesure particulière",
							score: 0,
							recommendation: "Installez un système de vidéosurveillance et réalisez des inventaires tournants sur les produits sensibles.",
						},
						{
							label: "Vidéosurveillance de base",
							score: 1,
							recommendation: "Mettez en place des portails antivol (EAS) et formez le personnel à la détection des comportements suspects.",
						},
						{
							label: "Système complet (EAS, inventaires tournants, procédures)",
							score: 3,
						},
					],
				},
				{
					id: "commerce_risks_2",
					text: "Vos fournisseurs sont-ils diversifiés pour éviter les ruptures d'approvisionnement ?",
					options: [
						{
							label: "Dépendance à 1 seul fournisseur",
							score: 0,
							recommendation: "Identifiez au moins 2 fournisseurs alternatifs pour vos produits les plus vendus.",
						},
						{
							label: "Quelques alternatives",
							score: 1,
							recommendation: "Diversifiez vos sources d'approvisionnement géographiquement pour limiter les risques logistiques globaux.",
						},
						{
							label: "Sourcing multiple et diversifié",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Vérifiez que votre assurance couvre bien les pertes d'exploitation en cas de sinistre.",
					"Sécurisez physiquement vos zones de stockage et votre coffre-fort.",
				],
				amber: [
					"Auditez vos procédures de clôture de caisse pour éviter les écarts financiers.",
					"Mettez en place un plan de gestion de crise en cas de bad buzz sur les réseaux sociaux.",
				],
				green: [
					"Mettez en place une charte éthique fournisseurs pour garantir la qualité et la provenance de vos produits.",
					"Obtenez une certification de sécurité pour votre site de paiement en ligne (PCI DSS).",
				],
			},
		},
		{
			id: "branding",
			name: "Branding",
			questions: [
				{
					id: "commerce_branding_1",
					text: "L'expérience d'unboxing ou en magasin est-elle \"instagrammable\" ou mémorable ?",
					options: [
						{
							label: "Expérience neutre",
							score: 0,
							recommendation: "Soignez votre packaging avec un petit mot de remerciement ou un emballage personnalisé.",
						},
						{
							label: "Soignée et propre",
							score: 1,
							recommendation: "Créez un élément visuel fort dans votre boutique (mur végétal, néon) pour inciter les clients à partager des photos.",
						},
						{
							label: "Expérience de marque unique et valorisante",
							score: 3,
						},
					],
				},
				{
					id: "commerce_branding_2",
					text: "Les avis clients sont-ils visibles et gérés activement pour rassurer les prospects ?",
					options: [
						{
							label: "Avis ignorés ou absents",
							score: 0,
							recommendation: "Sollicitez systématiquement un avis après un achat et répondez à tous les avis, même négatifs.",
						},
						{
							label: "Avis surveillés",
							score: 1,
							recommendation: "Affichez vos meilleurs avis clients sur votre page d'accueil et dans votre magasin pour rassurer.",
						},
						{
							label: "Gestion proactive (réponse systématique, sollicitation)",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Créez une identité visuelle forte qui se décline sur vos sacs, étiquettes et site web.",
					"Rédigez l'histoire de votre marque (À propos) pour humaniser votre commerce.",
				],
				amber: [
					"Collaborez avec des influenceurs locaux pour faire découvrir votre boutique à une nouvelle audience.",
					"Améliorez la qualité de votre éclairage en boutique pour mettre en valeur les produits.",
				],
				green: [
					"Créez une marque propre (Private Label) pour renforcer votre identité et vos marges.",
					"Développez une identité olfactive ou sonore unique pour votre point de vente.",
				],
			},
		},
		{
			id: "export",
			name: "Export",
			questions: [
				{
					id: "commerce_export_1",
					text: "Avez-vous résolu les défis logistiques et douaniers pour l'expédition internationale ?",
					options: [
						{
							label: "Non, livraison locale uniquement",
							score: 0,
							recommendation: "Configurez des options de livraison internationale simple sur votre site (ex: Europe).",
						},
						{
							label: "Livraison frontalière ponctuelle",
							score: 1,
							recommendation: "Négociez des tarifs d'expédition internationale avec des transporteurs globaux (DHL, UPS, FedEx).",
						},
						{
							label: "Logistique export structurée et tarifs négociés",
							score: 3,
						},
					],
				},
				{
					id: "commerce_export_2",
					text: "Vendez-vous sur des marketplaces internationales (Amazon, etc.) pour tester de nouveaux marchés ?",
					options: [
						{
							label: "Uniquement en direct",
							score: 0,
							recommendation: "Ouvrez une boutique sur une marketplace internationale pour tester la demande sans investissement lourd.",
						},
						{
							label: "Présence sur 1 marketplace locale",
							score: 1,
							recommendation: "Utilisez les services de logistique des marketplaces (ex: FBA) pour simplifier votre export.",
						},
						{
							label: "Vente multicanale sur plusieurs marketplaces globales",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Vérifiez si vos produits sont exportables légalement et quelles sont les taxes applicables.",
					"Analysez quels pays visitent déjà votre site web via vos analytics.",
				],
				amber: [
					"Traduisez vos fiches produits dans la langue de votre marché export prioritaire.",
					"Adaptez votre politique de retour aux contraintes de l'international.",
				],
				green: [
					"Adaptez votre assortiment aux goûts et aux saisons des pays de l'hémisphère opposé.",
					"Mettez en place un service client multilingue natif pour vos marchés clés.",
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
