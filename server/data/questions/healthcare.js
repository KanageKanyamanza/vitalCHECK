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
							recommendation: "Mettez en place un suivi rigoureux des rejets de télétransmission et automatisez les relances auprès des mutuelles.",
						},
						{
							label: "Suivi manuel avec quelques délais",
							score: 1,
							recommendation: "Utilisez un logiciel de gestion tiers-payant intégré pour réduire les délais de paiement et les erreurs de saisie.",
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
							recommendation: "Établissez un plan pluriannuel d'investissement pour anticiper le renouvellement de votre plateau technique.",
						},
						{
							label: "Planification basique",
							score: 1,
							recommendation: "Étudiez les options de leasing ou de location évolutive pour maintenir vos équipements à la pointe sans peser sur votre trésorerie.",
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
					"Réalisez un audit de vos coûts de fonctionnement (consommables, maintenance) pour identifier les gaspillages.",
					"Séparez strictement la gestion des honoraires de la gestion des charges de la structure.",
				],
				amber: [
					"Négociez des contrats de maintenance groupés pour réduire les coûts fixes de vos équipements.",
					"Analysez la rentabilité par type d'acte ou par service de soins.",
				],
				green: [
					"Explorez des sources de revenus complémentaires (prévention, télémédecine payante).",
					"Investissez dans des outils de Business Intelligence pour optimiser le taux d'occupation de vos plateaux techniques.",
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
							recommendation: "Analysez les goulots d'étranglement de votre accueil et mettez en place un système de pré-enregistrement digital.",
						},
						{
							label: "Fluidité relative selon les jours",
							score: 1,
							recommendation: "Utilisez un outil de gestion des flux en temps réel pour mieux répartir la charge entre vos équipes soignantes.",
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
							recommendation: "Rédigez vos protocoles d'hygiène selon les normes en vigueur et réalisez un auto-audit trimestriel.",
						},
						{
							label: "Contrôles internes épisodiques",
							score: 1,
							recommendation: "Faites appel à un organisme externe pour un audit de stérilisation annuel et formez vos équipes aux nouvelles normes.",
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
					"Standardisez vos procédures d'accueil et de sortie des patients pour gagner en efficacité.",
					"Mettez en place un système de gestion des stocks de médicaments et consommables avec alertes de péremption.",
				],
				amber: [
					"Optimisez l'agencement de vos locaux pour réduire les déplacements inutiles du personnel soignant.",
					"Améliorez la traçabilité de tous vos actes et dispositifs médicaux utilisés.",
				],
				green: [
					"Engagez-vous dans une démarche de certification qualité (ex: HAS) pour valoriser votre organisation.",
					"Automatisez le reporting d'activité pour un pilotage opérationnel plus fin.",
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
							recommendation: "Adoptez une solution de prise de rendez-vous en ligne pour augmenter votre visibilité et réduire l'absentéisme (No-show).",
						},
						{
							label: "Formulaire web simple",
							score: 1,
							recommendation: "Intégrez vos rendez-vous web directement dans votre logiciel métier pour éviter les doubles saisies.",
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
							recommendation: "Mettez en place un questionnaire de satisfaction simple envoyé par SMS ou Email après chaque visite.",
						},
						{
							label: "Recueil de plaintes uniquement",
							score: 1,
							recommendation: "Analysez les retours patients de manière statistique pour identifier les axes d'amélioration prioritaire de votre accueil.",
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
					"Créez un site web professionnel présentant vos spécialités, vos tarifs et les informations pratiques.",
					"Optimisez votre fiche Google My Business pour faciliter la localisation de votre établissement.",
				],
				amber: [
					"Développez une communication axée sur la prévention et l'éducation thérapeutique pour fidéliser vos patients.",
					"Mettez en place un système de rappel automatique pour les suivis chroniques ou les examens de contrôle.",
				],
				green: [
					"Créez des contenus experts (articles, vidéos) pour devenir une référence sur votre spécialité médicale.",
					"Collaborez avec d'autres praticiens pour créer un parcours de soins complet et coordonné.",
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
							recommendation: "Instaurez des rituels d'écoute (staff, débriefings) et veillez au respect des temps de repos pour prévenir l'épuisement professionnel.",
						},
						{
							label: "Écoute informelle ponctuelle",
							score: 1,
							recommendation: "Mettez en place une véritable politique de Qualité de Vie au Travail (QVT) incluant des aménagements de plannings.",
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
							recommendation: "Identifiez les besoins en nouvelles compétences techniques et financez des formations certifiantes.",
						},
						{
							label: "Formations subies (obligatoires uniquement)",
							score: 1,
							recommendation: "Incitez vos collaborateurs à choisir des formations innovantes pour diversifier les compétences du centre.",
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
					"Clarifiez les fiches de poste et les délégations de tâches entre personnel médical et administratif.",
					"Réalisez des entretiens annuels pour évaluer les besoins d'évolution de chaque collaborateur.",
				],
				amber: [
					"Développez le travail en équipe pluridisciplinaire pour réduire l'isolement des praticiens.",
					"Mettez en place un système de primes basées sur des objectifs collectifs de qualité de soin.",
				],
				green: [
					"Développez un programme de tutorat pour l'accueil des nouveaux stagiaires et internes.",
					"Investissez dans la marque employeur pour attirer des profils soignants qualifiés sur un marché pénurique.",
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
							recommendation: "Identifiez une niche médicale porteuse et investissez dans la formation et l'équipement dédié.",
						},
						{
							label: "1 ou 2 services de bonne réputation",
							score: 1,
							recommendation: "Engagez une démarche de labellisation ou de certification pour vos pôles les plus performants.",
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
							recommendation: "Intégrez une Communauté Professionnelle Territoriale de Santé (CPTS) pour coordonner vos parcours de soins.",
						},
						{
							label: "Partenariats ponctuels",
							score: 1,
							recommendation: "Formalisez des conventions de partenariat avec des centres de diagnostic ou de rééducation complémentaires.",
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
					"Analysez les besoins de santé non pourvus dans votre zone géographique pour adapter votre offre.",
					"Rédigez un projet médical et soignant à 3 ans pour donner une vision claire à votre équipe.",
				],
				amber: [
					"Développez des indicateurs de performance clinique (résultats de soins) pour piloter votre stratégie.",
					"Étudiez les opportunités de regroupement ou de mutualisation avec d'autres structures locales.",
				],
				green: [
					"Anticipez les évolutions démographiques et épidémiologiques de votre territoire.",
					"Participez à des projets de recherche clinique ou d'innovation thérapeutique.",
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
							recommendation: "Passez à un Dossier Patient Informatisé (DPI) certifié et sécurisé pour garantir la traçabilité des soins.",
						},
						{
							label: "Logiciel métier non communicant",
							score: 1,
							recommendation: "Activez l'interopérabilité de votre logiciel pour échanger des données avec Mon Espace Santé.",
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
							recommendation: "Adoptez une solution de téléconsultation sécurisée pour faciliter le suivi des patients chroniques.",
						},
						{
							label: "Solution temporaire (ex: WhatsApp/Skype)",
							score: 1,
							recommendation: "Utilisez une plateforme de télémédecine conforme à la réglementation (HDS) pour garantir la confidentialité.",
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
					"Assurez-vous que vos données de santé sont hébergées sur des serveurs certifiés HDS.",
					"Formez votre personnel à la cybersécurité (protection contre le piratage des données médicales).",
				],
				amber: [
					"Utilisez une messagerie sécurisée de santé (ex: MSSanté) pour tous vos échanges avec vos confrères.",
					"Automatisez la sauvegarde de vos dossiers médicaux sur un support déporté sécurisé.",
				],
				green: [
					"Expérimentez l'aide au diagnostic par intelligence artificielle (IA) pour vos services d'imagerie ou de dépistage.",
					"Mettez en place un portail patient pour le partage sécurisé des résultats et documents.",
				],
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
							recommendation: "Nommez un référent RGPD et réalisez une analyse d'impact sur la protection des données de santé.",
						},
						{
							label: "Charte de confidentialité simple",
							score: 1,
							recommendation: "Réalisez un audit de sécurité informatique complet et formez vos équipes aux risques de fuite de données.",
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
							recommendation: "Souscrivez une Responsabilité Civile Professionnelle (RCP) couvrant l'intégralité de votre périmètre de soins.",
						},
						{
							label: "RCP standard minimale",
							score: 1,
							recommendation: "Vérifiez annuellement que vos plafonds de garantie sont cohérents avec les risques encourus sur vos plateaux techniques.",
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
					"Identifiez les risques sanitaires critiques (infections nosocomiales, erreurs médicamenteuses) et créez des fiches d'événements indésirables.",
					"Vérifiez la conformité de vos bâtiments aux normes de sécurité incendie et accessibilité (ERP).",
				],
				amber: [
					"Réalisez des exercices de gestion de crise (ex: panne informatique majeure) pour tester votre réactivité.",
					"Auditez vos contrats d'assurance pour couvrir les pertes d'exploitation en cas de fermeture administrative.",
				],
				green: [
					"Mettez en place une cellule de gestion des risques avec des indicateurs de suivi trimestriels.",
					"Obtenez une certification de gestion des risques reconnue dans le secteur de la santé.",
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
							recommendation: "Rénovez votre espace d'accueil et formez votre personnel à une posture de service centrée sur le patient.",
						},
						{
							label: "Standard hospitalier correct",
							score: 1,
							recommendation: "Travaillez sur le confort 'hôtelier' (signalétique, éclairage, calme) pour améliorer l'expérience patient.",
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
							recommendation: "Répondez systématiquement aux avis en ligne avec professionnalisme et dans le respect du secret médical.",
						},
						{
							label: "Surveillance irrégulière",
							score: 1,
							recommendation: "Encouragez vos patients satisfaits à laisser des avis positifs pour améliorer votre note globale.",
						},
						{
							label: "Modération proactive et image maîtrisée",
							score: 3,
						},
					],
				},
			],
			recommendations: {
				red: [
					"Définissez une charte graphique (logo, couleurs) qui inspire le soin et le sérieux.",
					"Clarifiez votre message : expliquez votre expertise médicale en termes simples et rassurants.",
				],
				amber: [
					"Mettez en avant les témoignages patients anonymisés ou les taux de réussite de vos soins.",
					"Modernisez votre signalétique intérieure pour faciliter l'orientation des patients.",
				],
				green: [
					"Organisez des conférences de santé publique pour asseoir votre autorité sur votre territoire.",
					"Créez une identité sonore et olfactive apaisante dans vos espaces d'attente.",
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
							recommendation: "Analysez quelles sont vos spécialités les plus attractives pour des patients étrangers.",
						},
						{
							label: "Quelques patients étrangers sporadiques",
							score: 1,
							recommendation: "Développez un 'Pack International' incluant l'accueil à l'aéroport et la conciergerie pour les patients étrangers.",
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
							recommendation: "Proposez des services de traduction médicale ou formez votre personnel aux bases de l'anglais médical.",
						},
						{
							label: "Soutien ponctuel par traduction",
							score: 1,
							recommendation: "Recrutez au moins un coordinateur multilingue pour l'accompagnement des patients internationaux.",
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
					"Identifiez les pays dont les systèmes de santé sont saturés sur vos spécialités d'excellence.",
					"Vérifiez les accords de prise en charge avec les assurances internationales.",
				],
				amber: [
					"Traduisez vos comptes-rendus médicaux et vos supports d'information en anglais.",
					"Participez à des salons internationaux du tourisme de santé pour faire connaître votre expertise.",
				],
				green: [
					"Développez des partenariats avec des plateformes internationales de référence patient.",
					"Adaptez vos menus et vos services hôteliers aux cultures de vos patients internationaux majoritaires.",
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
