/**
 * VitalCHECK - Moteur de scoring "Niveau 1" (version simplifiée "v2")
 *
 * Règles :
 * - Chaque question est notée 0 (Non), 2 (Partiellement) ou 4 (Oui)
 * - Score d'un pilier = round((somme des réponses du pilier / 20) * 100) -> 0-100
 *   (20 = 5 questions x score max 4)
 * - Score global = round(moyenne des scores des 5 piliers) -> 0-100
 * - 5 paliers de maturité (remplacent les anciens statuts red/amber/green)
 */

// Paliers de maturité (du plus faible au plus élevé)
const LEVELS = [
	{
		id: "critique",
		min: 0,
		max: 39,
		label: "Critique",
		color: "#EF4444", // red-500
		interpretation:
			"Votre entreprise fait face à des risques importants qui menacent sa pérennité. Une action rapide est nécessaire pour stabiliser les fondations.",
	},
	{
		id: "vulnerable",
		min: 40,
		max: 59,
		label: "Vulnérable",
		color: "#F59E0B", // amber-500
		interpretation:
			"Votre entreprise tient le coup mais repose sur des bases fragiles. Plusieurs axes nécessitent une attention prioritaire.",
	},
	{
		id: "stable",
		min: 60,
		max: 79,
		label: "Stable",
		color: "#EAB308", // yellow-500
		interpretation:
			"Votre entreprise a des bases solides. Quelques ajustements ciblés permettront de passer à la vitesse supérieure.",
	},
	{
		id: "pret",
		min: 80,
		max: 89,
		label: "Prêt pour la croissance",
		color: "#3B82F6", // blue-500
		interpretation:
			"Votre entreprise est bien structurée et prête à accélérer son développement avec une stratégie de croissance ambitieuse.",
	},
	{
		id: "haute_performance",
		min: 90,
		max: 100,
		label: "Haute performance",
		color: "#10B981", // emerald-500
		interpretation:
			"Votre entreprise affiche une excellente maturité organisationnelle sur l'ensemble des piliers clés. Continuez sur cette lancée !",
	},
];

// Mappe un palier vers le pool de recommandations générique du pilier (low/mid/high)
const LEVEL_TO_POOL = {
	critique: "low",
	vulnerable: "low",
	stable: "mid",
	pret: "high",
	haute_performance: "high",
};

// Retourne la définition du palier correspondant à un score 0-100
function getLevelFromScore(score) {
	return LEVELS.find((level) => score >= level.min && score <= level.max) || LEVELS[0];
}

function getLevelColor(levelId) {
	const level = LEVELS.find((l) => l.id === levelId);
	return level ? level.color : LEVELS[0].color;
}

function getLevelLabel(levelId) {
	const level = LEVELS.find((l) => l.id === levelId);
	return level ? level.label : LEVELS[0].label;
}

function getLevelInterpretation(levelId) {
	const level = LEVELS.find((l) => l.id === levelId);
	return level ? level.interpretation : LEVELS[0].interpretation;
}

/**
 * Calcule les scores par pilier et le score global
 * @param {Array<{questionId: string, answer: number}>} answers
 * @param {{pillars: Array}} questionsData - questions-v2.js[lang]
 */
function calculateScoresV2(answers, questionsData) {
	const pillarScores = questionsData.pillars.map((pillar) => {
		let pillarTotal = 0;
		let maxTotal = 0;

		pillar.questions.forEach((question) => {
			const answer = answers.find((a) => a.questionId === question.id);
			pillarTotal += answer ? answer.answer : 0;
			maxTotal += 4;
		});

		const score = maxTotal > 0 ? Math.round((pillarTotal / maxTotal) * 100) : 0;
		const level = getLevelFromScore(score);

		return {
			pillarId: pillar.id,
			pillarName: pillar.name,
			score,
			level: level.id,
		};
	});

	const overallScore = pillarScores.length > 0
		? Math.round(pillarScores.reduce((sum, p) => sum + p.score, 0) / pillarScores.length)
		: 0;
	const overallLevel = getLevelFromScore(overallScore);

	return {
		pillarScores,
		overallScore,
		overallLevel: overallLevel.id,
	};
}

/**
 * Génère les recommandations par pilier : recommandations spécifiques liées
 * aux réponses "Non"/"Partiellement", complétées par le pool générique du pilier.
 * @returns {Array<{pillarId: string, pillarName: string, recommendations: string[]}>}
 */
function generateRecommendationsV2(answers, pillarScores, questionsData) {
	return pillarScores.map((pillarScore, index) => {
		const pillarData = questionsData.pillars[index];
		let selectedRecommendations = [];

		// 1. Recommandations spécifiques liées aux réponses de l'utilisateur
		pillarData.questions.forEach((question) => {
			const answer = answers.find((a) => a.questionId === question.id);
			if (answer) {
				const selectedOption = question.options.find((opt) => opt.value === answer.answer);
				if (selectedOption && selectedOption.recommendation) {
					selectedRecommendations.push(selectedOption.recommendation);
				}
			}
		});

		// 2. Compléter avec le pool générique du pilier selon le palier obtenu
		const poolKey = LEVEL_TO_POOL[pillarScore.level] || "mid";
		const pillarPool = (pillarData.recommendationPool && pillarData.recommendationPool[poolKey]) || [];
		const remainingCount = 2 - selectedRecommendations.length;

		if (remainingCount > 0 && pillarPool.length > 0) {
			const additionalRecs = pillarPool
				.filter((rec) => !selectedRecommendations.includes(rec))
				.slice(0, remainingCount);
			selectedRecommendations = [...selectedRecommendations, ...additionalRecs];
		}

		return {
			pillarId: pillarScore.pillarId,
			pillarName: pillarScore.pillarName,
			recommendations: selectedRecommendations.slice(0, 2),
		};
	});
}

/**
 * Classe les piliers du plus faible au plus fort (pour identifier risques/forces)
 */
function rankPillars(pillarScores) {
	const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
	return {
		weakest: sorted.slice(0, 2),
		strongest: sorted.slice(-2).reverse(),
	};
}

module.exports = {
	LEVELS,
	getLevelFromScore,
	getLevelColor,
	getLevelLabel,
	getLevelInterpretation,
	calculateScoresV2,
	generateRecommendationsV2,
	rankPillars,
};
