module.exports = {
	pillars: [
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "manufacturing_finance_1",
					text: "Connaissez-vous le coût de revient industriel exact de chaque unité produite ?",
					options: [
						{
							label: "Non, estimation globale uniquement",
							score: 0,
							recommendation: "Calculez précisément votre coût de revient industriel (matières, main d'œuvre, amortissements) par produit.",
						},
						{
							label: "Calcul périodique (trimestriel/annuel)",
							score: 1,
							recommendation: "Mettez en place un suivi des coûts en temps réel pour identifier immédiatement les dérives de production.",
						},
						{
							label: "Oui, coût standard vs réel suivi en temps réel",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_finance_2",
					text: "Avez-vous calculé le seuil de rentabilité de vos équipements majeurs ?",
					options: [
						{
							label: "Non, achat basé sur le besoin immédiat",
							score: 0,
							recommendation: "Analysez le Taux de Rendement Synthétique (TRS) de vos machines pour justifier vos futurs investissements.",
						},
						{
							label: "Calcul théorique à l'achat",
							score: 1,
							recommendation: "Suivez le Retour sur Investissement (ROI) réel de vos équipements pour optimiser le renouvellement de votre parc.",
						},
						{
							label: "Suivi précis du ROI et taux d'utilisation",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Réalisez un audit de vos stocks de matières premières pour libérer de la trésorerie immobilisée.",
					"Identifiez vos produits les moins rentables et étudiez leur arrêt ou leur re-conception (Design-to-cost).",
				],
				amber: [
					"Optimisez vos consommations énergétiques industrielles par des investissements ciblés.",
					"Négociez des contrats de volume avec vos fournisseurs de matières stratégiques.",
				],
				green: [
					"Investissez dans des technologies d'économie circulaire pour valoriser vos déchets de production.",
					"Étudiez l'opportunité d'une intégration verticale pour sécuriser vos marges.",
				],
			},
		},
		{
			id: "operations",
			name: "Opérations",
			questions: [
				{
					id: "manufacturing_operations_1",
					text: "Avez-vous une démarche d'amélioration continue (Lean, Kaizen) pour réduire les déchets ?",
					options: [
						{
							label: "Production traditionnelle sans méthode",
							score: 0,
							recommendation: "Initiez une démarche Lean Manufacturing simple (ex: méthode 5S) pour organiser vos ateliers.",
						},
						{
							label: "Actions ponctuelles de nettoyage/rangement",
							score: 1,
							recommendation: "Standardisez vos postes de travail et formez vos opérateurs à la détection des gaspillages (Muda).",
						},
						{
							label: "Démarche Lean/5S structurée et active",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_operations_2",
					text: "La maintenance préventive de vos machines est-elle planifiée et respectée ?",
					options: [
						{
							label: "Maintenance corrective (quand ça casse)",
							score: 0,
							recommendation: "Mettez en place un plan de maintenance préventive pour éviter les arrêts de production coûteux.",
						},
						{
							label: "Planification théorique peu suivie",
							score: 1,
							recommendation: "Integrez la maintenance dans le planning de production et responsabilisez les opérateurs sur le premier niveau de maintenance (TPM).",
						},
						{
							label: "Maintenance prédictive ou préventive rigoureuse",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Supprimez les goulots d'étranglement qui limitent la capacité globale de votre usine.",
					"Mettez en place un contrôle qualité rigoureux à chaque étape critique de fabrication.",
				],
				amber: [
					"Optimisez l'implantation de vos machines (Layout) pour réduire les flux logistiques internes.",
					"Réduisez vos temps de changement de série par la méthode SMED.",
				],
				green: [
					"Implémentez un système de maintenance prédictive basé sur des capteurs IoT.",
					"Visez une production zéro défaut par le déploiement du Poka-Yoke (systèmes anti-erreur).",
				],
			},
		},
		{
			id: "sales",
			name: "Ventes",
			questions: [
				{
					id: "manufacturing_sales_1",
					text: "Votre carnet de commandes offre-t-il une visibilité suffisante sur la production à venir ?",
					options: [
						{
							label: "Flux tendu sans visibilité (< 1 semaine)",
							score: 0,
							recommendation: "Développez votre force commerciale pour stabiliser votre carnet de commandes et mieux planifier votre production.",
						},
						{
							label: "Visibilité moyenne (1 mois)",
							score: 1,
							recommendation: "Mettez en place des contrats cadres ou des prévisions glissantes avec vos principaux clients.",
						},
						{
							label: "Visibilité forte (> 3 mois) sécurisée",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_sales_2",
					text: "Travaillez-vous avec des distributeurs ou en vente directe aux industriels/consommateurs ?",
					options: [
						{
							label: "Dépendance à un seul canal/intermédiaire",
							score: 0,
							recommendation: "Diversifiez vos canaux de vente (vente directe, distributeurs, e-commerce B2B) pour limiter vos risques.",
						},
						{
							label: "Mixte mais peu optimisé",
							score: 1,
							recommendation: "Animez votre réseau de distribution avec des outils d'aide à la vente et des formations produits régulières.",
						},
						{
							label: "Stratégie multicanale maîtrisée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez clairement votre Proposition de Valeur : pourquoi choisir votre fabrication plutôt qu'une importation ?",
					"Créez un catalogue produit professionnel et à jour.",
				],
				amber: [
					"Mettez en place un processus de réponse aux appels d'offres plus structuré et rapide.",
					"Mesurez la satisfaction client après chaque livraison et analysez les causes de retours produits.",
				],
				green: [
					"Développez une offre de services associée à vos produits (maintenance, formation, recyclage).",
					"Positionnez-vous sur des marchés de niche à forte valeur ajoutée technologique.",
				],
			},
		},
		{
			id: "people",
			name: "RH",
			questions: [
				{
					id: "manufacturing_people_1",
					text: "La sécurité au travail (EPI, formations) est-elle votre priorité absolue ?",
					options: [
						{
							label: "Respect minimal des obligations légales",
							score: 0,
							recommendation: "Instaurez une culture sécurité 'Zéro Accident' et réalisez des causeries sécurité hebdomadaires.",
						},
						{
							label: "Actions de sensibilisation régulières",
							score: 1,
							recommendation: "Auditez les comportements de sécurité sur le terrain et impliquez les opérateurs dans l'analyse des presqu'accidents.",
						},
						{
							label: "Culture sécurité « Zéro accident » proactive",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_people_2",
					text: "Avez-vous des plans de polyvalence pour pallier l'absence d'opérateurs clés ?",
					options: [
						{
							label: "Forte dépendance aux individus",
							score: 0,
							recommendation: "Créez une matrice de polyvalence pour identifier les postes critiques sans remplaçant formé.",
						},
						{
							label: "Polyvalence informelle",
							score: 1,
							recommendation: "Planifiez des sessions de formation croisée pour que chaque poste clé puisse être tenu par au moins 2 personnes.",
						},
						{
							label: "Matrice de polyvalence gérée et à jour",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Clarifiez les consignes de poste et assurez-vous qu'elles sont comprises et appliquées par tous.",
					"Mettez en place un système de remontée d'idées d'amélioration venant du terrain.",
				],
				amber: [
					"Améliorez l'ergonomie des postes de travail pour réduire la pénibilité et les TMS.",
					"Développez un plan de formation technique pour accompagner l'évolution de vos outils industriels.",
				],
				green: [
					"Développez l'autonomie des équipes (îlots de production autonomes).",
					"Investissez dans votre marque employeur pour attirer des jeunes vers les métiers de l'industrie.",
				],
			},
		},
		{
			id: "strategy",
			name: "Stratégie",
			questions: [
				{
					id: "manufacturing_strategy_1",
					text: "Avez-vous sécurisé vos approvisionnements stratégiques (double sourcing) ?",
					options: [
						{
							label: "Fournisseurs uniques critiques",
							score: 0,
							recommendation: "Identifiez et validez des sources d'approvisionnement alternatives pour vos composants critiques.",
						},
						{
							label: "Quelques alternatives identifiées",
							score: 1,
							recommendation: "Développez des partenariats de long terme avec vos fournisseurs clés (co-développement).",
						},
						{
							label: "Double sourcing actif sur composants clés",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_strategy_2",
					text: "Investissez-vous dans la modernisation de l'outil industriel (Industrie 4.0) ?",
					options: [
						{
							label: "Parc machine vieillissant",
							score: 0,
							recommendation: "Établissez un plan directeur industriel pour moderniser votre parc machine sur 3 à 5 ans.",
						},
						{
							label: "Renouvellement ponctuel",
							score: 1,
							recommendation: "Étudiez l'intégration de technologies numériques (capteurs, cobotique) pour gagner en agilité.",
						},
						{
							label: "Investissement continu et digitalisation",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez votre cœur de métier : que devez-vous fabriquer en interne et que pouvez-vous sous-traiter ?",
					"Analysez les risques de rupture de votre supply chain globale.",
				],
				amber: [
					"Engagez une démarche d'écoconception de vos produits pour anticiper les futures réglementations.",
					"Réalisez une veille technologique sur les nouveaux matériaux et procédés de fabrication.",
				],
				green: [
					"Explorez des modèles de production à la demande ou de personnalisation de masse.",
					"Visez une production neutre en carbone par l'optimisation énergétique et les énergies renouvelables.",
				],
			},
		},
		{
			id: "technology",
			name: "Technologie",
			questions: [
				{
					id: "manufacturing_technology_1",
					text: "Utilisez-vous un ERP/GPAO pour piloter la production et les stocks en temps réel ?",
					options: [
						{
							label: "Aucun outil ou Excel dispersé",
							score: 0,
							recommendation: "Déployez un logiciel de GPAO (Gestion de la Production Assistée par Ordinateur) pour piloter vos ordres de fabrication.",
						},
						{
							label: "ERP/GPAO basique ou mal utilisé",
							score: 1,
							recommendation: "Formez vos équipes à l'utilisation avancée de votre ERP pour fiabiliser vos stocks et vos délais.",
						},
						{
							label: "Système intégré pilotant toute l'usine",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_technology_2",
					text: "Avez-vous digitalisé les fiches de suivi de production (zéro papier) ?",
					options: [
						{
							label: "Tout papier (risques d'erreurs)",
							score: 0,
							recommendation: "Adoptez des terminaux ou tablettes en atelier pour une saisie de production en temps réel.",
						},
						{
							label: "Saisie informatique a posteriori",
							score: 1,
							recommendation: "Connectez vos machines directement à votre système d'information (MES) pour automatiser la remontée des données.",
						},
						{
							label: "Saisie atelier sur tablettes/terminaux",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Assurez la cybersécurité de vos systèmes industriels pour éviter tout arrêt d'usine par piratage.",
					"Centralisez vos données techniques (CAO, nomenclatures) dans un système unique et sécurisé.",
				],
				amber: [
					"Mettez en place des tableaux de bord de performance (KPI) visuels en temps réel dans vos ateliers.",
					"Utilisez des outils de simulation de flux pour optimiser l'organisation de vos lignes de production.",
				],
				green: [
					"Expérimentez la réalité augmentée pour l'assistance à la maintenance ou à la formation des opérateurs.",
					"Créez un jumeau numérique de votre usine pour tester vos changements d'organisation virtuellement.",
				],
			},
		},
		{
			id: "risks",
			name: "Risques",
			questions: [
				{
					id: "manufacturing_risks_1",
					text: "Vos installations sont-elles aux normes environnementales et incendie ?",
					options: [
						{
							label: "Non-conformités connues",
							score: 0,
							recommendation: "Réalisez une mise en conformité immédiate de vos installations critiques (incendie, rejets).",
						},
						{
							label: "Conforme à l'essentiel",
							score: 1,
							recommendation: "Préparez une certification ISO 14001 pour structurer votre gestion des risques environnementaux.",
						},
						{
							label: "Certification ISO 14001 / Conformité totale",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_risks_2",
					text: "Avez-vous un plan de continuité en cas de rupture de la chaîne logistique ?",
					options: [
						{
							label: "Aucun plan de secours",
							score: 0,
							recommendation: "Rédigez un Plan de Continuité d'Activité (PCA) pour faire face aux pannes machines majeures ou ruptures d'approvisionnement.",
						},
						{
							label: "Stocks de sécurité augmentés",
							score: 1,
							recommendation: "Diversifiez géographiquement vos sources de matières premières pour réduire la dépendance à une seule zone.",
						},
						{
							label: "PCA formalisé et chaîne logistique agile",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Vérifiez que votre assurance industrielle couvre bien la valeur de remplacement de vos machines à neuf.",
					"Mettez en place un système de détection des fuites et des anomalies énergétiques.",
				],
				amber: [
					"Auditez vos procédures de sécurité machine (Consignation/LOTO) pour protéger vos agents de maintenance.",
					"Mettez en place une veille réglementaire environnementale active.",
				],
				green: [
					"Réalisez une Analyse de Cycle de Vie (ACV) complète de vos produits phares.",
					"Obtenez des labels de fabrication responsable (ex: Origine France Garantie, B-Corp).",
				],
			},
		},
		{
			id: "branding",
			name: "Branding",
			questions: [
				{
					id: "manufacturing_branding_1",
					text: "Le design industriel de vos produits est-il un facteur de différenciation ?",
					options: [
						{
							label: "Design fonctionnel basique",
							score: 0,
							recommendation: "Travaillez sur le design industriel pour rendre vos produits plus esthétiques et ergonomiques.",
						},
						{
							label: "Design soigné mais standard",
							score: 1,
							recommendation: "Faites appel à un designer pour créer une signature visuelle propre à votre marque industrielle.",
						},
						{
							label: "Design innovant et marque de fabrique",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_branding_2",
					text: "Communiquez-vous sur la qualité de fabrication et l'origine (Made in...) ?",
					options: [
						{
							label: "Absence de communication",
							score: 0,
							recommendation: "Mettez en avant votre savoir-faire industriel et votre ancrage territorial sur vos supports de communication.",
						},
						{
							label: "Mention simple",
							score: 1,
							recommendation: "Utilisez le 'Storytelling' industriel (vidéos d'usine, coulisses de fabrication) pour rassurer vos clients sur la qualité.",
						},
						{
							label: "Qualité/Origine comme argument central",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Créez une identité de marque qui reflète la robustesse et la précision de votre production.",
					"Modernisez votre packaging pour qu'il protège mieux et valorise davantage vos produits.",
				],
				amber: [
					"Participez à des salons professionnels de référence pour asseoir votre notoriété industrielle.",
					"Affichez vos certifications qualité (ISO 9001) de manière visible sur tous vos supports.",
				],
				green: [
					"Organisez des visites d'usine pour vos clients clés afin de démontrer votre excellence opérationnelle.",
					"Développez une stratégie de marque pour vos composants (Intel Inside style) si vous êtes en B2B.",
				],
			},
		},
		{
			id: "export",
			name: "Export",
			questions: [
				{
					id: "manufacturing_export_1",
					text: "Vos produits respectent-ils les normes techniques (CE, UL, ISO) des pays cibles ?",
					options: [
						{
							label: "Normes locales uniquement",
							score: 0,
							recommendation: "Lancez les démarches d'homologation internationale (CE, UL, CCC) indispensables pour l'export.",
						},
						{
							label: "En cours d'homologation",
							score: 1,
							recommendation: "Anticipez les futures normes techniques internationales pour concevoir des produits 'Global by Design'.",
						},
						{
							label: "Certifications internationales valides",
							score: 3,
						},
					],
				},
				{
					id: "manufacturing_export_2",
					text: "Avez-vous un réseau de partenaires locaux pour le SAV et la maintenance à l'export ?",
					options: [
						{
							label: "Pas de SAV export",
							score: 0,
							recommendation: "Identifiez des partenaires techniques locaux capables d'assurer la maintenance de vos machines à l'étranger.",
						},
						{
							label: "SAV depuis le siège (délais longs)",
							score: 1,
							recommendation: "Formez des techniciens locaux ou mettez en place une assistance de télé-maintenance à distance.",
						},
						{
							label: "Réseau de maintenance agréé localement",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Étudiez la faisabilité logistique de vos exportations (poids, volume, fragilité).",
					"Identifiez les barrières douanières et les taxes applicables à vos produits par pays.",
				],
				amber: [
					"Adaptez vos notices techniques et vos interfaces machines dans la langue de vos marchés cibles.",
					"Sécurisez vos paiements export par des crédits documentaires ou des assurances export.",
				],
				green: [
					"Envisagez l'assemblage local (SKD/CKD) dans vos pays cibles pour réduire les taxes et les coûts logistiques.",
					"Créez un centre logistique régional pour servir plus rapidement vos clients internationaux.",
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
