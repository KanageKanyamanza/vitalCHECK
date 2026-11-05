/**
 * vitalCHECK — F1 « Calculateur de pertes cachées » : configuration métier.
 *
 * Seule source des taux, de la correspondance question → catégorie et des textes métier.
 * Tant que `status` vaut "draft", les valeurs n'ont pas été validées par les consultants UBB
 * et l'interface affiche un bandeau « Valeurs provisoires » hors production.
 *
 * Remplacer une valeur ici ne demande aucune modification de code.
 */

const status = "draft";

// Règle d'accès gratuit : l'utilisateur gratuit voit le résultat des catégories pré-cochées
// (ses 3 catégories les plus faibles). Les autres sont réservées au Premium.
const freeAccess = { rule: "preselected", count: 3 };

// Nombre de catégories pré-cochées
const selectionSize = 3;

// Ordre de départage quand deux catégories ont la même moyenne
const categoryOrder = [
	"unpaid",
	"stockouts",
	"waste",
	"unbilledTime",
	"lateDeliveries",
	"avoidableExpenses",
	"clientDependency",
];

// Taux par défaut. Chaque secteur peut surcharger une ou plusieurs valeurs.
const defaultRates = {
	nonRecovery: 0.15, // PROVISOIRE — à remplacer par la fiche consultants (part des impayés jamais récupérée)
	financingMonthly: 0.015, // PROVISOIRE — à remplacer par la fiche consultants (coût du financement, par mois)
	grossMargin: 0.25, // PROVISOIRE — à remplacer par la fiche consultants (marge brute)
	waste: 0.05, // PROVISOIRE — à remplacer par la fiche consultants (part du CA perdue en gaspillage)
	cancellation: 0.1, // PROVISOIRE — à remplacer par la fiche consultants (commandes annulées après un retard)
};

// Secteurs = questionnaires proposés à l'inscription. Objet vide = taux par défaut.
const sectorRates = {
	universal: {}, // PROVISOIRE — à remplacer par la fiche consultants
	agriculture: {}, // PROVISOIRE — à remplacer par la fiche consultants
	retail: {}, // PROVISOIRE — à remplacer par la fiche consultants
	restaurant: {}, // PROVISOIRE — à remplacer par la fiche consultants
	construction: {}, // PROVISOIRE — à remplacer par la fiche consultants
	distribution: {}, // PROVISOIRE — à remplacer par la fiche consultants
	export: {}, // PROVISOIRE — à remplacer par la fiche consultants
	manufacturing: {}, // PROVISOIRE — à remplacer par la fiche consultants
};

// Valeurs appliquées par « Je ne sais pas » sur les champs non monétaires
const defaultFieldDefaults = {
	monthsLate: 3, // PROVISOIRE — à remplacer par la fiche consultants (mois de retard)
	stockoutDays: 2, // PROVISOIRE — à remplacer par la fiche consultants (jours de rupture par mois)
	unbilledHours: 10, // PROVISOIRE — à remplacer par la fiche consultants (heures non facturées par mois)
	lateOrders: 2, // PROVISOIRE — à remplacer par la fiche consultants (commandes en retard par mois)
	topClientShare: 30, // PROVISOIRE — à remplacer par la fiche consultants (part du plus gros client, en %)
};
const sectorFieldDefaults = {};

// « Je ne sais pas » sur un montant : estimation à partir du chiffre d'affaires mensuel
const defaultRevenueDerivations = {
	unpaidAmount: { type: "multiply", factor: 1 }, // PROVISOIRE — à remplacer par la fiche consultants (impayés ≈ 1 mois de CA)
	dailySales: { type: "divide", factor: 26 }, // PROVISOIRE — à remplacer par la fiche consultants (26 jours de vente par mois)
	wasteValue: { type: "rate", rate: "waste" }, // PROVISOIRE — à remplacer par la fiche consultants (CA × taux de gaspillage)
	hourlyRate: { type: "divide", factor: 160 }, // PROVISOIRE — à remplacer par la fiche consultants (CA ÷ 160 h de travail)
	orderValue: { type: "multiply", factor: 0.05 }, // PROVISOIRE — à remplacer par la fiche consultants (commande ≈ 5 % du CA)
	avoidableAmount: { type: "multiply", factor: 0.05 }, // PROVISOIRE — à remplacer par la fiche consultants (5 % du CA)
};
const sectorRevenueDerivations = {};

// Correspondance PROVISOIRE question → catégorie, par questionnaire.
// Une catégorie absente n'est jamais pré-cochée, mais reste au choix du dirigeant.
const questionMap = {
	universal: {
		unpaid: ["v2_finance_2"],
		waste: ["v2_operations_2", "v2_operations_1"],
		unbilledTime: ["v2_operations_5", "v2_operations_4"],
		lateDeliveries: ["v2_operations_2", "v2_operations_3"],
		avoidableExpenses: ["v2_leadership_3", "v2_finance_1"],
		clientDependency: ["v2_sales_2"],
	},
	retail: {
		unpaid: ["retail_finance_2"],
		stockouts: ["retail_stocks_1", "retail_stocks_5"],
		waste: ["retail_stocks_4", "retail_stocks_2"],
		avoidableExpenses: ["retail_client_3", "retail_finance_1"],
	},
	distribution: {
		unpaid: ["distribution_credit_1", "distribution_credit_2"],
		stockouts: ["distribution_stock_1", "distribution_digital_3"],
		waste: ["distribution_stock_4", "distribution_stock_2"],
		lateDeliveries: ["distribution_stock_5"],
		avoidableExpenses: ["distribution_finance_4", "distribution_finance_3"],
		clientDependency: ["distribution_pilotage_1"],
	},
	restaurant: {
		unpaid: ["resto_finance_5"],
		stockouts: ["resto_foodcost_4", "resto_foodcost_5"],
		waste: ["resto_foodcost_3", "resto_foodcost_1", "resto_hygiene_2"],
		avoidableExpenses: ["resto_foodcost_2", "resto_pilotage_2", "resto_finance_4"],
	},
	construction: {
		unpaid: ["construction_tresorerie_2", "construction_tresorerie_1"],
		stockouts: ["construction_approvisionnement_1"],
		waste: ["construction_approvisionnement_5", "construction_qualite_2"],
		unbilledTime: ["construction_chiffrage_5", "construction_chantier_2"],
		lateDeliveries: ["construction_chantier_3", "construction_chantier_4"],
		avoidableExpenses: [
			"construction_approvisionnement_4",
			"construction_chiffrage_3",
			"construction_approvisionnement_3",
		],
	},
	manufacturing: {
		unpaid: ["manufacturing_finance_4"],
		stockouts: ["manufacturing_maintenance_1", "manufacturing_maintenance_3"],
		waste: ["manufacturing_production_3", "manufacturing_production_2"],
		lateDeliveries: ["manufacturing_pilotage_1", "manufacturing_production_1"],
		avoidableExpenses: [
			"manufacturing_production_4",
			"manufacturing_maintenance_4",
			"manufacturing_finance_1",
		],
	},
	export: {
		unpaid: ["export_finance_2"],
		waste: ["export_conformite_4"],
		lateDeliveries: ["export_organisation_2", "export_logistique_1"],
		avoidableExpenses: ["export_logistique_5", "export_finance_4"],
		clientDependency: ["export_marches_3", "export_marches_2"],
	},
	agriculture: {
		unpaid: ["agri_finance_5"],
		waste: ["agri_production_4"],
		avoidableExpenses: ["agri_finance_2", "agri_production_4"],
		clientDependency: ["agri_marche_1", "agri_marche_2"],
	},
};

/**
 * Catégories : champs saisis, nature du résultat et textes.
 * kind : "annual" (perte annuelle, comptée dans le total), "stock" (impayés), "risk" (dépendance)
 * field.type : "money" (FCFA), "count", "months", "days", "hours", "percent"
 * field.shared : "revenue" = le chiffre d'affaires mensuel commun à toutes les catégories
 */
const categories = {
	unpaid: {
		kind: "stock",
		rates: ["nonRecovery", "financingMonthly"],
		fields: [
			{ id: "unpaidAmount", type: "money", label: { fr: "Montant que vos clients vous doivent", en: "Amount your customers owe you" } },
			{ id: "monthsLate", type: "months", label: { fr: "Retard moyen de paiement", en: "Average payment delay" } },
		],
		title: { fr: "Impayés", en: "Unpaid invoices" },
		description: { fr: "L'argent que vos clients vous doivent et qui tarde à rentrer.", en: "Money your customers owe you that is slow to come in." },
		resultLabel: { fr: "Coût de vos impayés actuels", en: "Cost of your current unpaid invoices" },
		action: {
			fr: "[À VALIDER] Relancez chaque semaine les clients en retard et demandez un acompte avant de livrer.",
			en: "[TO VALIDATE] Follow up late customers every week and ask for a deposit before delivering.",
		},
	},
	stockouts: {
		kind: "annual",
		rates: ["grossMargin"],
		fields: [
			{ id: "stockoutDays", type: "days", label: { fr: "Jours de rupture de stock par mois", en: "Out-of-stock days per month" } },
			{ id: "dailySales", type: "money", label: { fr: "Ventes moyennes par jour", en: "Average sales per day" } },
		],
		title: { fr: "Ruptures de stock", en: "Stock-outs" },
		description: { fr: "Les ventes perdues quand un produit manque.", en: "Sales lost when a product is missing." },
		resultLabel: { fr: "Perte annuelle estimée", en: "Estimated annual loss" },
		action: {
			fr: "[À VALIDER] Fixez un stock minimum pour vos 10 produits les plus vendus et commandez dès qu'il est atteint.",
			en: "[TO VALIDATE] Set a minimum stock for your 10 best sellers and reorder as soon as it is reached.",
		},
	},
	waste: {
		kind: "annual",
		rates: [],
		fields: [{ id: "wasteValue", type: "money", label: { fr: "Valeur perdue par mois (casse, périmés, rebuts)", en: "Value lost per month (breakage, expired goods, scrap)" } }],
		title: { fr: "Gaspillage", en: "Waste" },
		description: { fr: "Ce qui se perd, se casse ou se périme.", en: "What gets lost, broken or expires." },
		resultLabel: { fr: "Perte annuelle estimée", en: "Estimated annual loss" },
		action: {
			fr: "[À VALIDER] Notez chaque perte pendant un mois pour repérer les 3 causes principales.",
			en: "[TO VALIDATE] Write down every loss for one month to find the 3 main causes.",
		},
	},
	unbilledTime: {
		kind: "annual",
		rates: [],
		fields: [
			{ id: "unbilledHours", type: "hours", label: { fr: "Heures travaillées non facturées par mois", en: "Hours worked but not billed per month" } },
			{ id: "hourlyRate", type: "money", label: { fr: "Prix de votre heure de travail", en: "Price of one hour of your work" } },
		],
		title: { fr: "Temps non facturé", en: "Unbilled time" },
		description: { fr: "Le travail fait pour vos clients mais jamais payé.", en: "Work done for customers but never paid for." },
		resultLabel: { fr: "Perte annuelle estimée", en: "Estimated annual loss" },
		action: {
			fr: "[À VALIDER] Notez vos heures par client et facturez les travaux en plus avant de les faire.",
			en: "[TO VALIDATE] Log your hours per customer and bill extra work before doing it.",
		},
	},
	lateDeliveries: {
		kind: "annual",
		rates: ["cancellation"],
		fields: [
			{ id: "lateOrders", type: "count", label: { fr: "Commandes livrées en retard par mois", en: "Orders delivered late per month" } },
			{ id: "orderValue", type: "money", label: { fr: "Valeur moyenne d'une commande", en: "Average value of an order" } },
		],
		title: { fr: "Retards de livraison", en: "Late deliveries" },
		description: { fr: "Les commandes perdues parce qu'elles arrivent trop tard.", en: "Orders lost because they arrive too late." },
		resultLabel: { fr: "Perte annuelle estimée", en: "Estimated annual loss" },
		action: {
			fr: "[À VALIDER] Annoncez des délais réalistes et prévenez le client dès qu'un retard se profile.",
			en: "[TO VALIDATE] Promise realistic lead times and warn the customer as soon as a delay is likely.",
		},
	},
	avoidableExpenses: {
		kind: "annual",
		rates: [],
		fields: [{ id: "avoidableAmount", type: "money", label: { fr: "Dépenses que vous pourriez éviter, par mois", en: "Expenses you could avoid, per month" } }],
		title: { fr: "Dépenses évitables", en: "Avoidable expenses" },
		description: { fr: "Les achats d'urgence, abonnements oubliés et frais inutiles.", en: "Rush purchases, forgotten subscriptions and needless fees." },
		resultLabel: { fr: "Perte annuelle estimée", en: "Estimated annual loss" },
		action: {
			fr: "[À VALIDER] Relisez vos dépenses du dernier mois et supprimez ou renégociez les 3 plus grosses inutiles.",
			en: "[TO VALIDATE] Review last month's expenses and cut or renegotiate the 3 biggest unnecessary ones.",
		},
	},
	clientDependency: {
		kind: "risk",
		rates: [],
		fields: [
			{ id: "monthlyRevenue", type: "money", shared: "revenue", label: { fr: "Chiffre d'affaires mensuel", en: "Monthly revenue" } },
			{ id: "topClientShare", type: "percent", label: { fr: "Part de votre plus gros client dans vos ventes", en: "Share of your biggest customer in your sales" } },
		],
		title: { fr: "Dépendance à un client", en: "Dependence on one customer" },
		description: { fr: "Ce que vous risquez si votre plus gros client s'en va.", en: "What you risk if your biggest customer leaves." },
		resultLabel: { fr: "Montant exposé si ce client part", en: "Amount at risk if this customer leaves" },
		action: {
			fr: "[À VALIDER] Fixez-vous un objectif de 3 nouveaux clients réguliers dans les 6 prochains mois.",
			en: "[TO VALIDATE] Aim for 3 new regular customers in the next 6 months.",
		},
	},
};

module.exports = {
	status,
	freeAccess,
	selectionSize,
	categoryOrder,
	defaultRates,
	sectorRates,
	defaultFieldDefaults,
	sectorFieldDefaults,
	defaultRevenueDerivations,
	sectorRevenueDerivations,
	questionMap,
	categories,
};
