/**
 * F1 « Calculateur de pertes cachées » : module de calcul pur (aucun appel réseau, aucun stockage).
 * Les taux, valeurs par défaut et règles d'estimation viennent de la configuration servie par le serveur.
 *
 * inputs = {
 *   values:  { [fieldId]: number | null },   // chiffres saisis
 *   unknown: { [fieldId]: boolean },         // « Je ne sais pas »
 *   revenue: { value: number | null, unknown: boolean }  // CA mensuel commun
 * }
 */

const MONTHS = 12;

const FORMULAS = {
	unpaid: (f, r) => f.unpaidAmount * r.nonRecovery + f.unpaidAmount * r.financingMonthly * f.monthsLate,
	stockouts: (f, r) => f.dailySales * r.grossMargin * f.stockoutDays * MONTHS,
	waste: (f) => f.wasteValue * MONTHS,
	unbilledTime: (f) => f.unbilledHours * f.hourlyRate * MONTHS,
	lateDeliveries: (f, r) => f.lateOrders * f.orderValue * r.cancellation * MONTHS,
	avoidableExpenses: (f) => f.avoidableAmount * MONTHS,
	clientDependency: (f) => f.monthlyRevenue * (f.topClientShare / 100) * MONTHS,
};

const isNumber = (v) => typeof v === "number" && Number.isFinite(v);

const deriveFromRevenue = (fieldId, revenue, config) => {
	const rule = config.revenueDerivations[fieldId];
	if (!rule || !isNumber(revenue)) return null;
	if (rule.type === "multiply") return revenue * rule.factor;
	if (rule.type === "divide") return revenue / rule.factor;
	if (rule.type === "rate") return revenue * config.rates[rule.rate];
	return null;
};

/** Valeur retenue pour un champ et son origine : "user", "default" (secteur) ou "revenue" (estimée). */
export const resolveField = (field, inputs, config) => {
	if (field.shared === "revenue") {
		const { value, unknown } = inputs.revenue || {};
		return !unknown && isNumber(value) ? { value, source: "user" } : null;
	}
	if (!inputs.unknown?.[field.id]) {
		const value = inputs.values?.[field.id];
		return isNumber(value) ? { value, source: "user" } : null;
	}
	if (field.type === "money") {
		const { value, unknown } = inputs.revenue || {};
		const derived = unknown ? null : deriveFromRevenue(field.id, value, config);
		return isNumber(derived) ? { value: derived, source: "revenue" } : null;
	}
	const fallback = config.fieldDefaults[field.id];
	return isNumber(fallback) ? { value: fallback, source: "default" } : null;
};

/**
 * Niveau de confiance :
 * - faible : un montant est estimé à partir du chiffre d'affaires (« Je ne sais pas » sur un montant)
 * - moyen  : un taux du secteur ou une valeur par défaut du secteur est utilisé
 * - élevé  : tous les chiffres viennent du dirigeant et la formule n'utilise aucun taux
 */
export const confidenceLevel = (category, fields) => {
	if (fields.some((f) => f.source === "revenue")) return "low";
	if (category.rates.length > 0 || fields.some((f) => f.source === "default")) return "medium";
	return "high";
};

/** Calcule une catégorie. status "missing" = il manque un chiffre pour estimer. */
export const computeCategory = (categoryId, inputs, config) => {
	const category = config.categories[categoryId];
	const fields = [];
	for (const field of category.fields) {
		const resolved = resolveField(field, inputs, config);
		if (!resolved) return { categoryId, kind: category.kind, status: "missing" };
		fields.push({ id: field.id, type: field.type, ...resolved });
	}

	const values = Object.fromEntries(fields.map((f) => [f.id, f.value]));
	const amount = FORMULAS[categoryId](values, config.rates);
	return {
		categoryId,
		kind: category.kind,
		status: "ok",
		amount,
		fields,
		rates: category.rates.map((id) => ({ id, value: config.rates[id] })),
		confidence: confidenceLevel(category, fields),
	};
};

/** Le total n'additionne que les pertes annuelles ; impayés (stock) et dépendance (risque) restent à part. */
export const totalAnnualLoss = (results) =>
	results.filter((r) => r.status === "ok" && r.kind === "annual").reduce((sum, r) => sum + r.amount, 0);

/** Résultats triés du montant le plus élevé au plus faible ; les catégories incomplètes à la fin. */
export const sortResults = (results) =>
	[...results].sort((a, b) => (b.status === "ok" ? b.amount : -1) - (a.status === "ok" ? a.amount : -1));

/** Gain estimé pour une réduction de 0 à 100 %. La dépendance (un risque) n'a pas de simulateur. */
export const simulatedGain = (result, reductionPercent) => {
	if (result.status !== "ok" || result.kind === "risk") return null;
	return result.amount * (reductionPercent / 100);
};

export const totalSimulatedGain = (results, reductions) =>
	results
		.filter((r) => r.status === "ok" && r.kind === "annual")
		.reduce((sum, r) => sum + simulatedGain(r, reductions[r.categoryId] || 0), 0);

/** Le CA mensuel est demandé seulement s'il sert : dépendance choisie ou « Je ne sais pas » sur un montant. */
export const needsRevenue = (categoryIds, inputs, config) =>
	categoryIds.some((id) =>
		config.categories[id].fields.some(
			(f) => f.shared === "revenue" || (f.type === "money" && inputs.unknown?.[f.id]),
		),
	);

/** Arrondi d'affichage au millier de FCFA (les calculs restent exacts). */
export const roundDisplay = (amount) => Math.round(amount / 1000) * 1000;

/** 2 400 000 FCFA — espaces insécables entre les milliers, quelle que soit la langue. */
export const formatNumber = (n) =>
	Math.round(n)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const formatFcfa = (amount) => `${formatNumber(roundDisplay(amount))} FCFA`;
