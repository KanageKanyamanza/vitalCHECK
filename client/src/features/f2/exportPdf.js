// PDF d'une page de l'auto-contrôle, généré dans le navigateur. jsPDF est chargé à la demande.
import { triggeredAlerts, unverifiedRules } from "./alertRules";
import { factLines, pick } from "./facts";
import { colon } from "../shared/format";

// Les polices standard de jsPDF n'ont pas l'espace fine insécable
const clean = (text) => String(text).replace(/[  ]/g, " ");

// Jetons du design system (styles/tokens.css)
const BRAND = [0, 117, 27];
const MUTED = [74, 93, 80];
const INK = [15, 36, 22];
const CRITICAL = [185, 28, 28];
const SEVERITY_COLOR = { critical: CRITICAL, moderate: [138, 98, 0], low: BRAND };

export const exportF2Pdf = async ({ config, results, months, lang, t }) => {
	const { default: jsPDF } = await import("jspdf");
	const doc = new jsPDF({ unit: "mm", format: "a4" });
	const margin = 14;
	const width = doc.internal.pageSize.getWidth() - margin * 2;
	const pageHeight = doc.internal.pageSize.getHeight();
	let y = 16;

	// Mise en page serrée pour tenir sur une page ; les lignes au-delà de la page sont tronquées
	const write = (text, { size = 9, bold = false, color = INK, gap = 1.2, indent = 0 } = {}) => {
		doc.setFont("helvetica", bold ? "bold" : "normal");
		doc.setFontSize(size);
		doc.setTextColor(...color);
		const lines = doc.splitTextToSize(clean(text), width - indent);
		const lineHeight = size * 0.42;
		const room = Math.max(0, Math.floor((pageHeight - 16 - y) / lineHeight));
		const visible = lines.slice(0, room);
		if (visible.length > 0) doc.text(visible, margin + indent, y);
		y += visible.length * lineHeight + gap;
	};

	const dateLabel = new Date().toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });

	write("vitalCHECK", { size: 10, bold: true, color: BRAND, gap: 0.8 });
	write(t("f2.pdf.title"), { size: 16, bold: true, gap: 1 });
	write(`${dateLabel} - ${months.join(", ")}`, { color: MUTED, gap: 4 });

	const alerts = triggeredAlerts(results);
	if (alerts.length === 0) {
		write(t("f2.results.noAlertTitle"), { size: 12, bold: true, color: BRAND, gap: 1 });
		write(pick(config.messages.noAlert, lang), { gap: 4 });
	} else {
		write(t("f2.results.count", { count: alerts.length }), { size: 12, bold: true, gap: 3 });
	}

	for (const result of alerts) {
		const texts = config.texts[result.ruleId];
		doc.setDrawColor(220, 226, 223);
		doc.line(margin, y - 1.5, margin + width, y - 1.5);
		y += 2;
		write(`${t(`f2.results.severity.${result.severity}`).toUpperCase()} - ${pick(texts.title, lang)}`, {
			size: 11,
			bold: true,
			color: SEVERITY_COLOR[result.severity],
			gap: 1,
		});
		write(t("f2.results.facts"), { bold: true, gap: 0.5 });
		factLines(result, months, lang, t).forEach((line) => write(line, { gap: 0.5, indent: 3 }));
		write(`${t("f2.results.causes")} (${t("f2.results.causesNote")})`, { bold: true, gap: 0.5 });
		write((texts.causes[lang] || texts.causes.fr).join(" / "), { size: 8.5, color: MUTED, gap: 0.5, indent: 3 });
		write(`${t("f2.results.action")}${colon(lang)}${pick(texts.action, lang)}`, { size: 8.5, gap: 3 });
	}

	const unverified = unverifiedRules(results);
	if (unverified.length > 0) {
		write(`${t("f2.results.unverifiedTitle")}${colon(lang)}${unverified.map((r) => pick(config.texts[r.ruleId].title, lang)).join(", ")}`, {
			color: MUTED,
			gap: 2,
		});
	}
	write(t("f2.results.disclaimer"), { size: 8.5, bold: true, gap: 1 });

	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(...MUTED);
	doc.text(clean(t("f2.pdf.footer")), margin, pageHeight - 8);

	doc.save("vitalCHECK-auto-controle.pdf");
};
