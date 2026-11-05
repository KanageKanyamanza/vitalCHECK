/**
 * F2 « Auto-contrôle d'alerte » : les 6 règles, en module pur (aucun appel réseau, aucun stockage).
 * Seuils et gravités lus dans la configuration servie par le serveur.
 *
 * figures = {
 *   sales:    [M-3, M-2, M-1],   // null = « Je ne sais pas »
 *   expenses: [M-3, M-2, M-1],
 *   overdueReceivables, cash, fixedCosts, stockouts, topClientShare   // null = « Je ne sais pas »
 * }
 * Chaque règle renvoie { ruleId, severity, status: "triggered" | "clear" | "unverified", facts }.
 */

const SEVERITY_RANK = { critical: 0, moderate: 1, low: 2 };

const known = (...values) => values.every((v) => typeof v === "number" && Number.isFinite(v));
const change = (from, to) => (to - from) / from;

const CHECKS = {
	// M-3 > M-2 > M-1, ou M-1 plus de X % sous la moyenne de M-3 et M-2 (M-1 exclu de la moyenne)
	salesDecline: (f, rule) => {
		const [m3, m2, m1] = f.sales;
		if (!known(m3, m2, m1)) return null;
		const continuous = m3 > m2 && m2 > m1;
		const average = (m3 + m2) / 2;
		const drop = average > 0 ? (average - m1) / average : 0;
		return { triggered: continuous || drop > rule.dropVsAverage, facts: { sales: [m3, m2, m1], continuous, average, drop } };
	},

	// Variation des dépenses supérieure à celle des ventes (en %, signe compris), sur les deux passages
	costsOutpaceSales: (f) => {
		const [s3, s2, s1] = f.sales;
		const [e3, e2, e1] = f.expenses;
		if (!known(s3, s2, s1, e3, e2, e1)) return null;
		if ([s3, s2, e3, e2].some((v) => v === 0)) return null; // division impossible : non vérifiée
		const transitions = [
			{ from: 0, to: 1, sales: change(s3, s2), expenses: change(e3, e2) },
			{ from: 1, to: 2, sales: change(s2, s1), expenses: change(e2, e1) },
		];
		return { triggered: transitions.every((t) => t.expenses > t.sales), facts: { transitions } };
	},

	// Créances en retard supérieures à X % des ventes de M-1
	overdueReceivables: (f, rule) => {
		const lastSales = f.sales[2];
		if (!known(f.overdueReceivables, lastSales) || lastSales === 0) return null;
		const share = f.overdueReceivables / lastSales;
		return { triggered: share > rule.maxShareOfLastSales, facts: { receivables: f.overdueReceivables, lastSales, share } };
	},

	// Trésorerie inférieure à N mois de charges fixes
	lowCash: (f, rule) => {
		if (!known(f.cash, f.fixedCosts) || f.fixedCosts === 0) return null;
		const months = f.cash / f.fixedCosts;
		return { triggered: months < rule.minMonthsOfFixedCosts, facts: { cash: f.cash, fixedCosts: f.fixedCosts, months } };
	},

	// Premier client au-dessus de X % des ventes
	clientDependency: (f, rule) => {
		if (!known(f.topClientShare)) return null;
		return { triggered: f.topClientShare > rule.maxTopClientShare, facts: { share: f.topClientShare } };
	},

	// N ruptures de stock ou plus dans le mois
	stockouts: (f, rule) => {
		if (!known(f.stockouts)) return null;
		return { triggered: f.stockouts >= rule.minStockoutsPerMonth, facts: { count: f.stockouts } };
	},
};

/** Évalue les 6 règles, dans l'ordre de la configuration. */
export const evaluateRules = (figures, config) =>
	config.ruleOrder.map((ruleId) => {
		const rule = config.rules[ruleId];
		const outcome = CHECKS[ruleId](figures, rule);
		if (!outcome) return { ruleId, severity: rule.severity, status: "unverified", facts: null };
		return { ruleId, severity: rule.severity, status: outcome.triggered ? "triggered" : "clear", facts: outcome.facts };
	});

/** Alertes déclenchées, de la plus grave à la moins grave (ordre de la configuration à gravité égale). */
export const triggeredAlerts = (results) =>
	results
		.filter((r) => r.status === "triggered")
		.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);

export const unverifiedRules = (results) => results.filter((r) => r.status === "unverified");

export const hasCritical = (results) => results.some((r) => r.status === "triggered" && r.severity === "critical");

/** Signe d'une variation pour choisir la phrase : -1 baisse, 0 stable, 1 hausse */
export const trend = (value) => (value > 0 ? 1 : value < 0 ? -1 : 0);

/**
 * Noms des 3 derniers mois complets [M-3, M-2, M-1] à partir d'une date,
 * avec une majuscule (« Août », « September »).
 */
export const lastThreeMonths = (date, lang) => {
	const format = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "fr-FR", { month: "long" });
	return [3, 2, 1].map((back) => {
		const name = format.format(new Date(date.getFullYear(), date.getMonth() - back, 1));
		return name.charAt(0).toUpperCase() + name.slice(1);
	});
};
