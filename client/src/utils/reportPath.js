/**
 * Page du rapport d'un diagnostic selon sa version :
 * v2 (diagnostic simplifié, 25 questions) -> /diagnostic/resultats, v1 (ancien questionnaire) -> /results.
 * La page v1 ne sait pas lire un diagnostic v2 (secteur, niveaux et piliers « inconnus »).
 */
export const reportPath = (assessment) =>
	assessment?.version === "v2"
		? `/diagnostic/resultats?assessmentId=${assessment._id}`
		: `/results?id=${assessment._id}`;
