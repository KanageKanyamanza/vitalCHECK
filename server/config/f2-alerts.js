/**
 * vitalCHECK — F2 « Auto-contrôle d'alerte » : configuration métier.
 *
 * Seule source des seuils, gravités et textes. Tant que `status` vaut "draft", les valeurs
 * n'ont pas été validées par les consultants UBB : bandeau « Valeurs provisoires » hors production.
 * Remplacer une valeur ici ne demande aucune modification de code.
 *
 * Gravités : "critical" (critique), "moderate" (modérée), "low" (faible).
 */

const status = "draft";

// Ordre d'affichage à gravité égale
const ruleOrder = ["lowCash", "overdueReceivables", "salesDecline", "costsOutpaceSales", "clientDependency", "stockouts"];

const rules = {
	// Ventes en baisse : M-3 > M-2 > M-1, ou M-1 plus de 15 % sous la moyenne de M-3 et M-2
	// (interprétation PROVISOIRE, à confirmer par les consultants)
	salesDecline: {
		severity: "moderate", // PROVISOIRE — à remplacer par la fiche consultants
		dropVsAverage: 0.15, // PROVISOIRE — à remplacer par la fiche consultants
	},
	// Dépenses plus rapides que les ventes, en %, sur M-3→M-2 et M-2→M-1
	costsOutpaceSales: {
		severity: "moderate", // PROVISOIRE — à remplacer par la fiche consultants
	},
	// Créances en retard supérieures à 30 % des ventes de M-1
	overdueReceivables: {
		severity: "critical", // PROVISOIRE — à remplacer par la fiche consultants
		maxShareOfLastSales: 0.3, // PROVISOIRE — à remplacer par la fiche consultants
	},
	// Trésorerie inférieure à 1 mois de charges fixes
	lowCash: {
		severity: "critical", // PROVISOIRE — à remplacer par la fiche consultants
		minMonthsOfFixedCosts: 1, // PROVISOIRE — à remplacer par la fiche consultants
	},
	// Premier client au-dessus de 40 % des ventes
	clientDependency: {
		severity: "moderate", // PROVISOIRE — à remplacer par la fiche consultants
		maxTopClientShare: 40, // PROVISOIRE — à remplacer par la fiche consultants (en %)
	},
	// 3 ruptures de stock ou plus dans le mois
	stockouts: {
		severity: "low", // PROVISOIRE — à remplacer par la fiche consultants
		minStockoutsPerMonth: 3, // PROVISOIRE — à remplacer par la fiche consultants
	},
};

const texts = {
	salesDecline: {
		title: { fr: "Ventes en baisse", en: "Falling sales" },
		causes: {
			fr: [
				"[À VALIDER] Un concurrent attire une partie de vos clients.",
				"[À VALIDER] Une saison creuse ou un client régulier qui commande moins.",
				"[À VALIDER] Des ruptures de stock qui font perdre des ventes.",
			],
			en: [
				"[TO VALIDATE] A competitor is attracting some of your customers.",
				"[TO VALIDATE] A low season or a regular customer ordering less.",
				"[TO VALIDATE] Stock-outs causing lost sales.",
			],
		},
		action: {
			fr: "[À VALIDER] Appelez vos 5 meilleurs clients cette semaine pour savoir ce qui a changé.",
			en: "[TO VALIDATE] Call your 5 best customers this week to find out what changed.",
		},
	},
	costsOutpaceSales: {
		title: { fr: "Dépenses plus rapides que les ventes", en: "Costs growing faster than sales" },
		causes: {
			fr: [
				"[À VALIDER] Une hausse des prix de vos fournisseurs non répercutée.",
				"[À VALIDER] Des dépenses ajoutées sans suivi (abonnements, personnel, transport).",
				"[À VALIDER] Des ventes qui ralentissent alors que les charges restent les mêmes.",
			],
			en: [
				"[TO VALIDATE] Supplier price rises not passed on to your prices.",
				"[TO VALIDATE] Expenses added without tracking (subscriptions, staff, transport).",
				"[TO VALIDATE] Sales slowing down while costs stay the same.",
			],
		},
		action: {
			fr: "[À VALIDER] Listez vos 10 plus grosses dépenses du mois et repérez celles qui ont augmenté.",
			en: "[TO VALIDATE] List your 10 biggest expenses this month and spot the ones that went up.",
		},
	},
	overdueReceivables: {
		title: { fr: "Trop de créances en retard", en: "Too many overdue receivables" },
		causes: {
			fr: [
				"[À VALIDER] Des délais de paiement accordés sans limite écrite.",
				"[À VALIDER] Pas de relance régulière des clients en retard.",
				"[À VALIDER] Un gros client qui paie de plus en plus tard.",
			],
			en: [
				"[TO VALIDATE] Payment terms granted without a written limit.",
				"[TO VALIDATE] No regular follow-up of late customers.",
				"[TO VALIDATE] A large customer paying later and later.",
			],
		},
		action: {
			fr: "[À VALIDER] Relancez cette semaine les 3 clients qui vous doivent le plus.",
			en: "[TO VALIDATE] This week, follow up the 3 customers who owe you the most.",
		},
	},
	lowCash: {
		title: { fr: "Trésorerie trop courte", en: "Cash running short" },
		causes: {
			fr: [
				"[À VALIDER] Des clients qui paient en retard.",
				"[À VALIDER] Un achat important ou un stock trop élevé.",
				"[À VALIDER] Des charges fixes trop lourdes pour le niveau des ventes.",
			],
			en: [
				"[TO VALIDATE] Customers paying late.",
				"[TO VALIDATE] A large purchase or too much stock.",
				"[TO VALIDATE] Fixed costs too heavy for your level of sales.",
			],
		},
		action: {
			fr: "[À VALIDER] Faites la liste de vos paiements des 4 prochaines semaines et de vos rentrées attendues.",
			en: "[TO VALIDATE] List your payments for the next 4 weeks and the money you expect to come in.",
		},
	},
	clientDependency: {
		title: { fr: "Dépendance à un client", en: "Dependence on one customer" },
		causes: {
			fr: [
				"[À VALIDER] Un gros contrat qui a pris toute la place.",
				"[À VALIDER] Peu de temps consacré à trouver de nouveaux clients.",
			],
			en: [
				"[TO VALIDATE] A large contract that took up all the room.",
				"[TO VALIDATE] Little time spent finding new customers.",
			],
		},
		action: {
			fr: "[À VALIDER] Fixez-vous un objectif de 3 nouveaux clients réguliers dans les 6 prochains mois.",
			en: "[TO VALIDATE] Aim for 3 new regular customers in the next 6 months.",
		},
	},
	stockouts: {
		title: { fr: "Ruptures de stock fréquentes", en: "Frequent stock-outs" },
		causes: {
			fr: [
				"[À VALIDER] Pas de stock minimum fixé pour les produits qui se vendent le plus.",
				"[À VALIDER] Un fournisseur qui livre en retard.",
				"[À VALIDER] Un manque de trésorerie pour commander à temps.",
			],
			en: [
				"[TO VALIDATE] No minimum stock set for your best-selling products.",
				"[TO VALIDATE] A supplier delivering late.",
				"[TO VALIDATE] Not enough cash to reorder on time.",
			],
		},
		action: {
			fr: "[À VALIDER] Fixez un stock minimum pour vos 10 produits les plus vendus et commandez dès qu'il est atteint.",
			en: "[TO VALIDATE] Set a minimum stock for your 10 best sellers and reorder as soon as it is reached.",
		},
	},
};

const messages = {
	noAlert: {
		fr: "[À VALIDER] Aucun signal d'alerte ce mois-ci. Bravo ! Refaites ce contrôle le mois prochain pour garder le cap.",
		en: "[TO VALIDATE] No warning signs this month. Well done! Check again next month to stay on course.",
	},
	reminderTitle: {
		fr: "vitalCHECK : refaire mon auto-contrôle d'alerte",
		en: "vitalCHECK: redo my warning signs check",
	},
	reminderDescription: {
		fr: "2 minutes pour vérifier vos signaux d'alerte : ventes, dépenses, trésorerie, créances.",
		en: "2 minutes to check your warning signs: sales, expenses, cash, receivables.",
	},
	consultant: {
		fr: "[À VALIDER] Une alerte critique mérite un regard extérieur. Un consultant UBB peut vous aider à y voir clair.",
		en: "[TO VALIDATE] A critical alert deserves an outside view. A UBB consultant can help you see clearly.",
	},
};

module.exports = { status, ruleOrder, rules, texts, messages };
