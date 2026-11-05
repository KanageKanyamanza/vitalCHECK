/**
 * F1 « Calculateur de pertes cachées » : logique serveur pure (sans base de données).
 * - pré-sélection des catégories à partir des réponses au diagnostic (0 / 2 / 4)
 * - construction de la configuration renvoyée au navigateur, filtrée selon l'abonnement
 */

const defaultConfig = require("../config/f1-losses");

const resolveSector = (questionnaireType, config = defaultConfig) =>
	Object.prototype.hasOwnProperty.call(config.sectorRates, questionnaireType) ? questionnaireType : "universal";

/**
 * Moyenne des réponses liées à chaque catégorie ; les plus faibles d'abord.
 * Les catégories sans question répondue ne sont pas pré-cochées, sauf pour compléter la sélection.
 */
const preselectCategories = (questionnaireType, answers = [], config = defaultConfig) => {
	const sector = resolveSector(questionnaireType, config);
	const map = config.questionMap[sector] || {};
	const values = new Map(answers.map((a) => [a.questionId, a.answer]));

	const scored = [];
	for (const categoryId of config.categoryOrder) {
		const answered = (map[categoryId] || []).filter((id) => values.has(id)).map((id) => values.get(id));
		if (answered.length > 0) {
			scored.push({ categoryId, average: answered.reduce((s, v) => s + v, 0) / answered.length });
		}
	}

	const order = (id) => config.categoryOrder.indexOf(id);
	scored.sort((a, b) => a.average - b.average || order(a.categoryId) - order(b.categoryId));

	const selection = scored.slice(0, config.selectionSize).map((s) => s.categoryId);
	for (const categoryId of config.categoryOrder) {
		if (selection.length >= config.selectionSize) break;
		if (!selection.includes(categoryId)) selection.push(categoryId);
	}
	return selection;
};

/**
 * Configuration envoyée au navigateur.
 * Public : taux, valeurs par défaut, champs et titres des 7 catégories, pré-sélection.
 * Réservé aux abonnés : action recommandée au-delà de la catégorie gratuite, simulateur.
 */
const buildClientConfig = ({ questionnaireType, answers, isPaid }, config = defaultConfig) => {
	const sector = resolveSector(questionnaireType, config);
	const preselected = preselectCategories(sector, answers, config);
	const unlocked = isPaid ? [...config.categoryOrder] : preselected.slice(0, config.freeAccess.count);

	const categories = {};
	for (const categoryId of config.categoryOrder) {
		const { action, ...publicPart } = config.categories[categoryId];
		categories[categoryId] = unlocked.includes(categoryId) ? { ...publicPart, action } : publicPart;
	}

	return {
		status: config.status,
		access: isPaid ? "paid" : "free",
		sector,
		selectionSize: config.selectionSize,
		categoryOrder: config.categoryOrder,
		preselected,
		unlocked,
		rates: { ...config.defaultRates, ...config.sectorRates[sector] },
		fieldDefaults: { ...config.defaultFieldDefaults, ...(config.sectorFieldDefaults[sector] || {}) },
		revenueDerivations: { ...config.defaultRevenueDerivations, ...(config.sectorRevenueDerivations[sector] || {}) },
		categories,
		simulator: !!isPaid,
		showTotal: !!isPaid,
	};
};

module.exports = { resolveSector, preselectCategories, buildClientConfig };
