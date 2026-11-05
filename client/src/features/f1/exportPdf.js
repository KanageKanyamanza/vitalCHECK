// PDF du calculateur, généré dans le navigateur. Chargé à la demande (import dynamique) avec jsPDF,
// pour ne pas alourdir le rapport sur réseau mobile. Aucun envoi au serveur.
import { formatFcfa, simulatedGain, totalAnnualLoss, totalSimulatedGain } from "./lossCalculator";
import { pick, figureLines, assumptionLines, colon, formatPercent } from "./display";

// Les polices standard de jsPDF n'ont pas l'espace fine insécable
const clean = (text) => String(text).replace(/[  ]/g, " ");

// Jetons du design system (styles/tokens.css)
const BRAND = [0, 117, 27];
const MUTED = [74, 93, 80];
const INK = [15, 36, 22];

export const exportF1Pdf = async ({ config, results, lockedIds, reductions, lang, t, companyName }) => {
	const { default: jsPDF } = await import("jspdf");
	const doc = new jsPDF({ unit: "mm", format: "a4" });
	const margin = 16;
	const width = doc.internal.pageSize.getWidth() - margin * 2;
	const bottom = doc.internal.pageSize.getHeight() - 18;
	let y = 20;

	const ensureSpace = (needed) => {
		if (y + needed > bottom) {
			doc.addPage();
			y = 20;
		}
	};

	const write = (text, { size = 10, bold = false, color = INK, gap = 1.5 } = {}) => {
		doc.setFont("helvetica", bold ? "bold" : "normal");
		doc.setFontSize(size);
		doc.setTextColor(...color);
		const lines = doc.splitTextToSize(clean(text), width);
		const lineHeight = size * 0.45;
		ensureSpace(lines.length * lineHeight);
		doc.text(lines, margin, y);
		y += lines.length * lineHeight + gap;
	};

	const dateLabel = new Date().toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	write("vitalCHECK", { size: 11, bold: true, color: BRAND, gap: 1 });
	write(t("f1.pdf.title"), { size: 18, bold: true, gap: 2 });
	write([companyName, dateLabel].filter(Boolean).join(" - "), { color: MUTED, gap: 6 });

	if (config.showTotal) {
		write(t("f1.results.totalLabel"), { size: 11, bold: true, color: MUTED, gap: 1 });
		write(`${formatFcfa(totalAnnualLoss(results))} ${t("f1.results.perYear")}`, { size: 16, bold: true, color: BRAND, gap: 1 });
		write(t("f1.results.totalNote"), { size: 9, color: MUTED, gap: 2 });
		const totalGain = totalSimulatedGain(results, reductions);
		if (config.simulator && totalGain > 0) {
			write(t("f1.results.simulator.total", { amount: formatFcfa(totalGain) }), { bold: true, gap: 2 });
		}
		y += 3;
	}

	for (const result of results) {
		const category = config.categories[result.categoryId];
		ensureSpace(30);
		doc.setDrawColor(220, 226, 223);
		doc.line(margin, y - 2, margin + width, y - 2);
		y += 3;
		write(pick(category.title, lang), { size: 13, bold: true, gap: 1 });

		if (result.status !== "ok") {
			write(t("f1.results.missing"), { color: MUTED, gap: 5 });
			continue;
		}

		write(formatFcfa(result.amount), { size: 14, bold: true, color: BRAND, gap: 1 });
		write(pick(category.resultLabel, lang) + (result.kind !== "annual" ? ` - ${t("f1.results.separate")}` : ""), {
			size: 9,
			color: MUTED,
			gap: 3,
		});

		write(t("f1.results.figures"), { bold: true, gap: 1 });
		figureLines(result, category, lang, t).forEach((line) => write(`- ${line}`, { size: 9, gap: 0.5 }));
		y += 1.5;
		write(t("f1.results.assumptions"), { bold: true, gap: 1 });
		assumptionLines(result, lang, t).forEach((line) => write(`- ${line}`, { size: 9, gap: 0.5 }));
		y += 1.5;
		write(`${t("f1.results.confidence.label")}${colon(lang)}${t(`f1.results.confidence.${result.confidence}`)}`, { size: 9, gap: 2 });

		if (category.action) {
			write(t("f1.results.action"), { bold: true, gap: 1 });
			write(pick(category.action, lang), { size: 9, gap: 2 });
		}

		const reduction = reductions[result.categoryId] || 0;
		const gain = simulatedGain(result, reduction);
		if (config.simulator && gain !== null && reduction > 0) {
			const key = result.kind === "stock" ? "avoided" : "gain";
			write(`${t("f1.results.simulator.label")} ${formatPercent(reduction, lang)}${colon(lang)}${t(`f1.results.simulator.${key}`, { amount: formatFcfa(gain) })}`, {
				size: 9,
				bold: true,
				gap: 2,
			});
		}
		y += 3;
	}

	for (const id of lockedIds) {
		ensureSpace(14);
		write(`${pick(config.categories[id].title, lang)} - ${t("f1.pdf.lockedLine")}`, { color: MUTED, gap: 3 });
	}

	y += 2;
	write(t("f1.results.disclaimer"), { size: 9, bold: true, gap: 2 });

	const pages = doc.getNumberOfPages();
	for (let page = 1; page <= pages; page += 1) {
		doc.setPage(page);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text(clean(`${t("f1.pdf.footer")} - ${page}/${pages}`), margin, doc.internal.pageSize.getHeight() - 10);
	}

	const slug = (companyName || "entreprise").replace(/[^\w-]+/g, "-").slice(0, 40);
	doc.save(`vitalCHECK-pertes-cachees-${slug}.pdf`);
};
