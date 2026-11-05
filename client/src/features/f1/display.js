// Aides d'affichage communes à l'écran de résultats et au PDF
import { formatNumber, formatFcfa } from "./lossCalculator.js";

/** Texte FR/EN de la configuration, avec repli sur le français */
export const pick = (texts, lang) => texts?.[lang] || texts?.fr || "";

/** Valeur d'un champ avec son unité : « 2 400 000 FCFA », « 3 mois », « 30 % » */
export const formatFieldValue = (field, lang, t) => {
	if (field.type === "money") {
		return field.source === "user" ? `${formatNumber(field.value)} FCFA` : formatFcfa(field.value);
	}
	if (field.type === "percent") return formatPercent(field.value, lang);
	return `${formatNumber(field.value)} ${t(`f1.input.units.${field.type}`)}`;
};

/** Pourcentage : « 30 % » en français, « 30% » en anglais */
export const formatPercent = (n, lang) => (lang === "en" ? `${n}%` : `${n} %`);

/** Deux-points : espace insécable avant en français, aucune en anglais */
export const colon = (lang) => (lang === "en" ? ": " : " : ");

export const formatRate = (value, lang) => {
	const n = String(Math.round(value * 1000) / 10);
	return formatPercent(lang === "en" ? n : n.replace(".", ","), lang);
};

/** Lignes « Vos chiffres » : libellé, valeur et origine éventuelle */
export const figureLines = (result, category, lang, t) =>
	result.fields.map((field) => {
		const definition = category.fields.find((f) => f.id === field.id);
		const source = field.source === "user" ? "" : ` (${t(`f1.results.sources.${field.source}`)})`;
		return `${pick(definition.label, lang)}${colon(lang)}${formatFieldValue(field, lang, t)}${source}`;
	});

/** Lignes « Hypothèses » : taux du secteur puis période */
export const assumptionLines = (result, lang, t) => [
	...result.rates.map((rate) => `${t(`f1.results.rates.${rate.id}`)}${colon(lang)}${formatRate(rate.value, lang)}`),
	t(`f1.results.period.${result.kind}`),
];
