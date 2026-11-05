// « Ce que montrent vos chiffres » : faits observés, calculés avec les chiffres saisis.
// Partagé par l'écran de résultats et le PDF. Les causes restent à part : jamais présentées comme des faits.
import { formatFcfaExact, formatPercent } from "../shared/format.js";
import { trend } from "./alertRules.js";

const pick = (texts, lang) => texts?.[lang] || texts?.fr || "";
export { pick };

// Mois en minuscules dans une phrase française (« en août »), majuscule gardée en anglais
export const inSentence = (month, lang) => (lang === "en" ? month : month.toLocaleLowerCase("fr-FR"));

// « de » élidé devant un mois qui commence par une voyelle : « d'août », « d'octobre », « de mai »
const ofMonth = (month) => (/^[aeiouyhâéèêîôû]/i.test(month) ? `d'${month}` : `de ${month}`);
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const decimal = (n, lang) => {
	const rounded = String(Math.round(n * 10) / 10);
	return lang === "en" ? rounded : rounded.replace(".", ",");
};

const pct = (ratio, lang) => formatPercent(Math.abs(ratio) * 100, lang);

/** Lignes de faits pour une alerte, avec les noms des mois [M-3, M-2, M-1]. */
export const factLines = (result, months, lang, t) => {
	const f = result.facts;
	const [month3, month2, month1] = months.map((m) => inSentence(m, lang));
	// Formes avec « de » (français) ; les phrases anglaises utilisent les noms seuls
	const [ofMonth3, ofMonth2, ofMonth1] = [month3, month2, month1].map(ofMonth);
	switch (result.ruleId) {
		case "salesDecline": {
			const [m3, m2, m1] = f.sales.map(formatFcfaExact);
			const lines = [];
			if (f.continuous) lines.push(t("f2.facts.salesDecline.continuous", { month3, month2, month1, m3, m2, m1 }));
			if (f.drop > 0) {
				lines.push(
					t("f2.facts.salesDecline.drop", {
						month1,
						month2,
						month3,
						ofMonth2,
						ofMonth3,
						m1,
						drop: pct(f.drop, lang),
						average: formatFcfaExact(f.average),
					}),
				);
			}
			return lines;
		}
		case "costsOutpaceSales":
			return f.transitions.map((tr) => {
				const key = `${trend(tr.sales)}_${trend(tr.expenses)}`;
				const values = {
					from: inSentence(months[tr.from], lang),
					fromPhrase: capitalize(ofMonth(inSentence(months[tr.from], lang))),
					to: inSentence(months[tr.to], lang),
					sales: pct(tr.sales, lang),
					expenses: pct(tr.expenses, lang),
				};
				const sentence = t(`f2.facts.costsOutpaceSales.${key}`, { ...values, defaultValue: "" });
				return sentence || t("f2.facts.costsOutpaceSales.generic", values);
			});
		case "overdueReceivables":
			return [
				t("f2.facts.overdueReceivables", {
					receivables: formatFcfaExact(f.receivables),
					share: pct(f.share, lang),
					month1,
					ofMonth1,
					lastSales: formatFcfaExact(f.lastSales),
				}),
			];
		case "lowCash":
			return [
				t("f2.facts.lowCash", {
					cash: formatFcfaExact(f.cash),
					months: decimal(f.months, lang),
					fixedCosts: formatFcfaExact(f.fixedCosts),
				}),
			];
		case "clientDependency":
			return [t("f2.facts.clientDependency", { share: formatPercent(f.share, lang) })];
		case "stockouts":
			return [t("f2.facts.stockouts", { count: f.count, month1 })];
		default:
			return [];
	}
};
