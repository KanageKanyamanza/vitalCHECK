/**
 * VitalCHECK - Questionnaire Niveau 1 (version simplifiée "v2")
 *
 * Structure universelle (indépendante du secteur) :
 * - 5 piliers x 5 questions = 25 questions
 * - Chaque option a une valeur (4 = Oui, 2 = Partiellement, 0 = Non)
 * - shortLabel : libellé court affiché sur le bouton (Oui / Partiellement / Non)
 * - label : description contextuelle affichée sous le bouton
 * - recommendation : conseil actionnable affiché si l'option "Non" est choisie
 *
 * Le contenu anglais (en) sera complété en phase 2.
 */

const fr = {
	pillars: [
		{
			id: "leadership",
			name: "Leadership & Stratégie",
			questions: [
				{
					id: "v2_leadership_1",
					text: "Avez-vous des objectifs d'entreprise écrits à 1 an et à 3 ans ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Objectifs chiffrés et datés, partagés avec l'équipe" },
						{ value: 2, shortLabel: "Partiellement", label: "Objectifs généraux, non formalisés par écrit" },
						{ value: 0, shortLabel: "Non", label: "Aucun objectif formel défini", recommendation: "Prenez 2h pour écrire 3 objectifs chiffrés pour les 12 prochains mois et partagez-les avec votre équipe." },
					],
				},
				{
					id: "v2_leadership_2",
					text: "Évaluez-vous régulièrement les performances de votre entreprise face à ces objectifs ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Revue mensuelle ou trimestrielle formalisée" },
						{ value: 2, shortLabel: "Partiellement", label: "Revue annuelle ou irrégulière" },
						{ value: 0, shortLabel: "Non", label: "Jamais évalué", recommendation: "Bloquez 30 minutes chaque mois pour comparer vos résultats à vos objectifs." },
					],
				},
				{
					id: "v2_leadership_3",
					text: "Disposez-vous d'un budget prévisionnel pour l'exercice en cours ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Budget détaillé et suivi mensuellement" },
						{ value: 2, shortLabel: "Partiellement", label: "Budget approximatif, rarement actualisé" },
						{ value: 0, shortLabel: "Non", label: "Aucun budget établi", recommendation: "Construisez un budget prévisionnel simple sur un tableur pour les 12 prochains mois." },
					],
				},
				{
					id: "v2_leadership_4",
					text: "Suivez-vous au moins 3 indicateurs clés (KPI) de votre activité ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "KPI suivis et affichés régulièrement" },
						{ value: 2, shortLabel: "Partiellement", label: "KPI définis mais peu suivis" },
						{ value: 0, shortLabel: "Non", label: "Aucun indicateur suivi", recommendation: "Choisissez 3 indicateurs clés (CA, marge, satisfaction client) et suivez-les chaque semaine." },
					],
				},
				{
					id: "v2_leadership_5",
					text: "Avez-vous un plan de croissance ou de développement pour les 12 prochains mois ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Plan documenté avec actions et échéances" },
						{ value: 2, shortLabel: "Partiellement", label: "Idées de croissance informelles" },
						{ value: 0, shortLabel: "Non", label: "Aucun plan de croissance", recommendation: "Identifiez 3 actions concrètes pour développer votre activité dans les 12 prochains mois." },
					],
				},
			],
			recommendationPool: {
				low: [
					"Définissez votre vision d'entreprise en une phrase et partagez-la avec votre équipe.",
					"Prenez 1h par semaine pour travailler SUR votre entreprise plutôt que DANS l'entreprise.",
				],
				mid: [
					"Réalisez une analyse SWOT (Forces, Faiblesses, Opportunités, Menaces) de votre activité.",
					"Mettez par écrit vos avantages concurrentiels et partagez-les avec votre équipe.",
				],
				high: [
					"Mettez en place un tableau de bord stratégique partagé avec vos équipes.",
					"Explorez de nouvelles opportunités de croissance (marchés, partenariats, produits).",
				],
			},
		},
		{
			id: "finance",
			name: "Finance",
			questions: [
				{
					id: "v2_finance_1",
					text: "Votre entreprise est-elle rentable et connaissez-vous votre marge nette ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Rentable, marge nette connue et suivie" },
						{ value: 2, shortLabel: "Partiellement", label: "Rentable mais marge nette imprécise" },
						{ value: 0, shortLabel: "Non", label: "Rentabilité incertaine ou inconnue", recommendation: "Calculez votre marge nette du dernier trimestre avec votre comptable." },
					],
				},
				{
					id: "v2_finance_2",
					text: "Gérez-vous votre trésorerie avec un suivi mensuel des entrées et sorties ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Tableau de trésorerie mensuel à jour" },
						{ value: 2, shortLabel: "Partiellement", label: "Suivi irrégulier de la trésorerie" },
						{ value: 0, shortLabel: "Non", label: "Pas de suivi de trésorerie", recommendation: "Mettez en place un tableau simple listant vos entrées et sorties chaque mois." },
					],
				},
				{
					id: "v2_finance_3",
					text: "Séparez-vous strictement les finances de l'entreprise et vos finances personnelles ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Séparation totale, comptes bancaires distincts" },
						{ value: 2, shortLabel: "Partiellement", label: "Séparation partielle, flux croisés occasionnels" },
						{ value: 0, shortLabel: "Non", label: "Mélange fréquent des finances", recommendation: "Ouvrez un compte bancaire dédié à l'entreprise et cessez les flux croisés." },
					],
				},
				{
					id: "v2_finance_4",
					text: "Disposez-vous d'états financiers (bilan, compte de résultat) à jour ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Documents à jour, consultés régulièrement" },
						{ value: 2, shortLabel: "Partiellement", label: "Documents établis mais rarement consultés" },
						{ value: 0, shortLabel: "Non", label: "Documents inexistants ou très anciens", recommendation: "Demandez à votre comptable vos derniers états financiers et passez-les en revue." },
					],
				},
				{
					id: "v2_finance_5",
					text: "Pouvez-vous faire face à 3 mois de charges fixes sans revenus (réserve de trésorerie) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Réserve de 3 mois de charges fixes constituée" },
						{ value: 2, shortLabel: "Partiellement", label: "Réserve partielle (1 à 2 mois)" },
						{ value: 0, shortLabel: "Non", label: "Aucune réserve de trésorerie", recommendation: "Mettez de côté chaque mois un petit pourcentage de votre chiffre d'affaires pour constituer une réserve." },
					],
				},
			],
			recommendationPool: {
				low: [
					"Identifiez vos 5 plus gros postes de dépenses et cherchez à les réduire de 10%.",
					"Prenez rendez-vous avec un comptable pour faire le point sur votre situation financière.",
				],
				mid: [
					"Établissez un budget prévisionnel détaillé pour l'année prochaine.",
					"Mettez en place un système de relance automatique pour vos factures impayées.",
				],
				high: [
					"Optimisez votre fiscalité en consultant un expert-comptable.",
					"Étudiez des options de financement pour accélérer votre croissance.",
				],
			},
		},
		{
			id: "sales",
			name: "Ventes & Marketing",
			questions: [
				{
					id: "v2_sales_1",
					text: "Savez-vous combien vous coûte l'acquisition d'un nouveau client (CAC) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "CAC calculé et suivi régulièrement" },
						{ value: 2, shortLabel: "Partiellement", label: "Estimation approximative du CAC" },
						{ value: 0, shortLabel: "Non", label: "CAC inconnu", recommendation: "Listez vos dépenses marketing du dernier mois et divisez-les par le nombre de nouveaux clients obtenus." },
					],
				},
				{
					id: "v2_sales_2",
					text: "Avez-vous un processus pour convertir vos prospects en clients (pipeline de vente) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Processus de conversion défini et documenté" },
						{ value: 2, shortLabel: "Partiellement", label: "Processus informel, non documenté" },
						{ value: 0, shortLabel: "Non", label: "Aucun suivi des prospects", recommendation: "Créez une feuille de suivi des prospects avec leur statut (contacté, devis envoyé, signé)." },
					],
				},
				{
					id: "v2_sales_3",
					text: "Mesurez-vous votre taux de fidélisation client ou de recommandation ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Taux mesuré avec un objectif défini" },
						{ value: 2, shortLabel: "Partiellement", label: "Suivi ponctuel de la satisfaction client" },
						{ value: 0, shortLabel: "Non", label: "Jamais mesuré", recommendation: "Demandez à vos 10 derniers clients s'ils vous recommanderaient et notez leurs réponses." },
					],
				},
				{
					id: "v2_sales_4",
					text: "Avez-vous une présence en ligne active (site web et/ou réseau social) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Présence active et régulièrement mise à jour" },
						{ value: 2, shortLabel: "Partiellement", label: "Présence minimale ou obsolète" },
						{ value: 0, shortLabel: "Non", label: "Aucune présence en ligne", recommendation: "Créez ou mettez à jour une page (site ou réseau social) avec vos coordonnées et vos offres." },
					],
				},
				{
					id: "v2_sales_5",
					text: "Disposez-vous d'objectifs de vente chiffrés pour l'année ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Objectifs définis par période (mois/trimestre)" },
						{ value: 2, shortLabel: "Partiellement", label: "Objectif annuel global uniquement" },
						{ value: 0, shortLabel: "Non", label: "Aucun objectif de vente", recommendation: "Fixez un objectif de chiffre d'affaires pour le mois prochain et suivez-le chaque semaine." },
					],
				},
			],
			recommendationPool: {
				low: [
					"Définissez votre 'client idéal' pour mieux cibler vos efforts marketing.",
					"Assurez-vous d'avoir une présence minimale en ligne (site web ou réseaux sociaux actifs).",
				],
				mid: [
					"Mettez en place un système de relance systématique pour vos devis envoyés.",
					"Développez un système de parrainage pour inciter vos clients à vous recommander.",
				],
				high: [
					"Testez de nouveaux canaux d'acquisition (publicité ciblée, partenariats).",
					"Mesurez votre taux de conversion (devis signés / devis envoyés) et cherchez à l'augmenter.",
				],
			},
		},
		{
			id: "operations",
			name: "Opérations",
			questions: [
				{
					id: "v2_operations_1",
					text: "Vos processus opérationnels clés sont-ils documentés (procédures, checklists) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Procédures écrites et accessibles à l'équipe" },
						{ value: 2, shortLabel: "Partiellement", label: "Quelques documents épars, incomplets" },
						{ value: 0, shortLabel: "Non", label: "Tout est dans la tête du dirigeant", recommendation: "Rédigez une checklist simple pour votre tâche la plus répétitive." },
					],
				},
				{
					id: "v2_operations_2",
					text: "Mesurez-vous régulièrement les retards ou erreurs dans votre production / service ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Suivi régulier avec tableau de bord qualité" },
						{ value: 2, shortLabel: "Partiellement", label: "Suivi informel, au cas par cas" },
						{ value: 0, shortLabel: "Non", label: "Aucune mesure", recommendation: "Notez chaque erreur ou retard pendant 2 semaines pour identifier les points de friction." },
					],
				},
				{
					id: "v2_operations_3",
					text: "Les responsabilités sont-elles clairement définies pour chaque activité critique ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Organigramme et rôles clairement définis" },
						{ value: 2, shortLabel: "Partiellement", label: "Rôles partiellement définis" },
						{ value: 0, shortLabel: "Non", label: "Confusion des responsabilités", recommendation: "Listez sur une seule page qui fait quoi dans votre équipe." },
					],
				},
				{
					id: "v2_operations_4",
					text: "Utilisez-vous des outils numériques pour gagner du temps (automatisation, cloud) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Outils intégrés et utilisés au quotidien" },
						{ value: 2, shortLabel: "Partiellement", label: "Quelques outils utilisés de façon isolée" },
						{ value: 0, shortLabel: "Non", label: "Outils papier ou manuels uniquement", recommendation: "Identifiez une tâche répétitive que vous pourriez automatiser avec un outil simple et gratuit." },
					],
				},
				{
					id: "v2_operations_5",
					text: "Avez-vous mesuré la productivité de votre équipe / de votre activité ce trimestre ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Productivité mesurée avec un objectif défini" },
						{ value: 2, shortLabel: "Partiellement", label: "Impression générale, sans mesure précise" },
						{ value: 0, shortLabel: "Non", label: "Jamais évaluée", recommendation: "Choisissez un indicateur simple (ex: commandes traitées/jour) et suivez-le pendant 2 semaines." },
					],
				},
			],
			recommendationPool: {
				low: [
					"Répertoriez les 3 principaux goulots d'étranglement qui ralentissent votre activité.",
					"Standardisez vos outils de travail pour éviter les pertes de temps et les erreurs.",
				],
				mid: [
					"Implémentez une méthode simple de gestion du temps pour gagner en efficacité.",
					"Centralisez vos documents sur un espace cloud partagé et sécurisé.",
				],
				high: [
					"Automatisez vos flux d'informations entre vos différents outils.",
					"Engagez-vous dans une démarche d'amélioration continue de vos processus.",
				],
			},
		},
		{
			id: "people",
			name: "Personnel & Organisation",
			questions: [
				{
					id: "v2_people_1",
					text: "Chaque collaborateur a-t-il des objectifs individuels clairs et écrits ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Objectifs écrits et évalués régulièrement" },
						{ value: 2, shortLabel: "Partiellement", label: "Objectifs communiqués oralement seulement" },
						{ value: 0, shortLabel: "Non", label: "Aucun objectif individuel", recommendation: "Définissez avec chaque collaborateur 1 à 2 objectifs simples pour le trimestre." },
					],
				},
				{
					id: "v2_people_2",
					text: "Réalisez-vous des entretiens d'évaluation réguliers avec votre équipe ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Entretiens formels planifiés (au moins annuels)" },
						{ value: 2, shortLabel: "Partiellement", label: "Discussions informelles occasionnelles" },
						{ value: 0, shortLabel: "Non", label: "Jamais d'entretien", recommendation: "Planifiez un entretien individuel de 30 minutes avec chaque collaborateur ce trimestre." },
					],
				},
				{
					id: "v2_people_3",
					text: "Votre taux de turnover est-il maîtrisé (moins de 15% par an) ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Turnover faible, fidélisation active" },
						{ value: 2, shortLabel: "Partiellement", label: "Turnover moyen, non suivi précisément" },
						{ value: 0, shortLabel: "Non", label: "Turnover élevé", recommendation: "Identifiez les 2 principales raisons de départ de vos derniers collaborateurs et agissez dessus." },
					],
				},
				{
					id: "v2_people_4",
					text: "Investissez-vous dans la formation et le développement des compétences ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Budget formation dédié et utilisé" },
						{ value: 2, shortLabel: "Partiellement", label: "Formation ponctuelle, non planifiée" },
						{ value: 0, shortLabel: "Non", label: "Aucune formation", recommendation: "Identifiez une compétence manquante clé et recherchez une formation courte et abordable." },
					],
				},
				{
					id: "v2_people_5",
					text: "Avez-vous identifié un successeur ou un second pour les postes clés ?",
					options: [
						{ value: 4, shortLabel: "Oui", label: "Succession planifiée pour les postes clés" },
						{ value: 2, shortLabel: "Partiellement", label: "Réflexion en cours, rien de formalisé" },
						{ value: 0, shortLabel: "Non", label: "Aucun plan de succession", recommendation: "Identifiez qui pourrait vous remplacer temporairement sur vos tâches critiques et commencez à le/la former." },
					],
				},
			],
			recommendationPool: {
				low: [
					"Clarifiez l'organigramme et les responsabilités au sein de votre équipe.",
					"Rédigez des fiches de poste claires définissant les missions de chacun.",
				],
				mid: [
					"Instaurez des rituels d'équipe pour améliorer la communication interne.",
					"Définissez une politique de rémunération équitable et motivante.",
				],
				high: [
					"Développez une culture d'entreprise forte pour attirer et fidéliser les talents.",
					"Mettez en place un système de management participatif.",
				],
			},
		},
	],
};

// Contenu anglais à compléter en phase 2 (structure prête)
const en = {
	pillars: [],
};

module.exports = {
	fr,
	en,
};
