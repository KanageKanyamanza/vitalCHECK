import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Lock, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/ds";
import { formatFcfa, simulatedGain, totalAnnualLoss, totalSimulatedGain } from "./lossCalculator";
import { pick, figureLines, assumptionLines, colon, formatPercent } from "./display";
import { trackEvent } from "../../utils/analytics";

const CONFIDENCE_DOTS = { high: 3, medium: 2, low: 1 };

const Confidence = ({ level, lang }) => {
	const { t } = useTranslation();
	return (
		<p className="flex items-center gap-2 font-text text-ubb-small text-ubb-ink">
			<span className="font-semibold">{t("f1.results.confidence.label")}{colon(lang).trimEnd()}</span>
			<span className="flex gap-1" aria-hidden="true">
				{[1, 2, 3].map((n) => (
					<span
						key={n}
						className={`h-2.5 w-2.5 rounded-full ${n <= CONFIDENCE_DOTS[level] ? "bg-ubb-brand-900" : "bg-ubb-brand-100"}`}
					/>
				))}
			</span>
			{t(`f1.results.confidence.${level}`)}
		</p>
	);
};

const LossCard = ({ result, config, lang, reduction, onReduction }) => {
	const { t } = useTranslation();
	const category = config.categories[result.categoryId];
	const title = pick(category.title, lang);

	if (result.status !== "ok") {
		return (
			<article className="ubb-card p-5">
				<h4 className="font-heading text-lg font-semibold text-ubb-ink">{title}</h4>
				<p className="mt-2 font-text text-ubb-body text-ubb-ink-muted">{t("f1.results.missing")}</p>
			</article>
		);
	}

	const gain = simulatedGain(result, reduction);
	const sliderId = `f1-slider-${result.categoryId}`;

	return (
		<article className="ubb-card p-5">
			<h4 className="font-heading text-lg font-semibold text-ubb-ink">{title}</h4>
			<p className="mt-2 font-heading text-2xl font-bold text-ubb-brand-900 sm:text-3xl">{formatFcfa(result.amount)}</p>
			<p className="font-text text-ubb-small font-semibold text-ubb-ink-muted">
				{pick(category.resultLabel, lang)}
				{result.kind !== "annual" && <span className="block font-normal">{t("f1.results.separate")}</span>}
			</p>

			<div className="mt-4 grid gap-4 border-t border-ubb-brand-900/[0.08] pt-4">
				<div>
					<h5 className="font-text text-sm font-semibold text-ubb-ink">{t("f1.results.figures")}</h5>
					<ul className="mt-1 space-y-1 font-text text-ubb-small text-ubb-ink-muted">
						{figureLines(result, category, lang, t).map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</div>
				<div>
					<h5 className="font-text text-sm font-semibold text-ubb-ink">{t("f1.results.assumptions")}</h5>
					<ul className="mt-1 space-y-1 font-text text-ubb-small text-ubb-ink-muted">
						{assumptionLines(result, lang, t).map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</div>
			</div>

			<div className="mt-4">
				<Confidence level={result.confidence} lang={lang} />
			</div>

			{category.action && (
				<div className="mt-4 rounded-ubb-field bg-ubb-paper-soft p-3">
					<h5 className="font-text text-sm font-semibold text-ubb-ink">{t("f1.results.action")}</h5>
					<p className="mt-1 font-text text-ubb-small text-ubb-ink">{pick(category.action, lang)}</p>
				</div>
			)}

			{config.simulator && gain !== null && (
				<div className="mt-4 border-t border-ubb-brand-900/[0.08] pt-4">
					<label htmlFor={sliderId} className="flex items-center justify-between gap-3 font-text text-sm font-semibold text-ubb-ink">
						{t("f1.results.simulator.label")}
						<span className="font-heading text-base text-ubb-brand-900">{formatPercent(reduction, lang)}</span>
					</label>
					<input
						id={sliderId}
						type="range"
						min="0"
						max="100"
						step="10"
						value={reduction}
						onChange={(e) => onReduction(Number(e.target.value))}
						aria-valuetext={formatPercent(reduction, lang)}
						className="ubb-focus mt-1 h-11 w-full cursor-pointer accent-[rgb(var(--ubb-brand-900))]"
					/>
					<p className="font-text text-ubb-body font-semibold text-ubb-ink" aria-live="polite">
						{result.kind === "stock"
							? t("f1.results.simulator.avoided", { amount: formatFcfa(gain) })
							: t("f1.results.simulator.gain", { amount: formatFcfa(gain) })}
					</p>
				</div>
			)}
		</article>
	);
};

/** Un seul encart pour tous les sujets réservés au Premium */
const LockedCard = ({ titles }) => {
	const { t } = useTranslation();
	return (
		<article className="rounded-ubb-panel border border-dashed border-ubb-brand-900/25 bg-white p-5">
			<h4 className="flex items-center gap-2 font-heading text-lg font-semibold text-ubb-ink">
				<Lock className="h-4 w-4 text-ubb-ink-muted" aria-hidden="true" />
				{t("f1.results.locked.title")}
			</h4>
			<ul className="mt-2 flex flex-wrap gap-2">
				{titles.map((title) => (
					<li key={title} className="rounded-full bg-ubb-brand-50 px-3 py-1 font-text text-sm font-semibold text-ubb-ink">
						{title}
					</li>
				))}
			</ul>
			<p className="mt-3 font-text text-ubb-small text-ubb-ink-muted">{t("f1.results.locked.text")}</p>
			<Button to="/checkout?plan=premium" size="sm" className="mt-4">
				{t("f1.results.locked.cta")}
			</Button>
		</article>
	);
};

/** Écran 3 : cartes triées, total des pertes annuelles (abonnés), simulateur et PDF. */
const ResultsStep = ({ config, results, lockedIds, lang, companyName, onEdit }) => {
	const { t } = useTranslation();
	const [reductions, setReductions] = useState({});
	const [exporting, setExporting] = useState(false);

	const okAnnual = results.filter((r) => r.status === "ok" && r.kind === "annual");
	const total = totalAnnualLoss(results);
	const totalGain = totalSimulatedGain(results, reductions);

	const handlePdf = async () => {
		if (exporting) return;
		setExporting(true);
		try {
			const { exportF1Pdf } = await import("./exportPdf");
			await exportF1Pdf({ config, results, lockedIds, reductions, lang, t, companyName });
			trackEvent("f1_pdf_downloaded");
		} catch (error) {
			console.error("F1 PDF:", error);
			toast.error(t("f1.results.pdfError"));
		} finally {
			setExporting(false);
		}
	};

	return (
		<div>
			{config.showTotal && (
				<div className="rounded-ubb-panel bg-ubb-brand-900 p-5 text-white sm:p-6">
					<p className="font-text text-sm font-semibold text-ubb-brand-100">{t("f1.results.totalLabel")}</p>
					{okAnnual.length > 0 ? (
						<p className="mt-1 font-heading text-3xl font-bold sm:text-4xl">
							{formatFcfa(total)} <span className="font-text text-base font-semibold text-ubb-brand-100">{t("f1.results.perYear")}</span>
						</p>
					) : (
						<p className="mt-1 font-text text-ubb-body">{t("f1.results.noAnnual")}</p>
					)}
					<p className="mt-2 font-text text-ubb-small text-ubb-brand-100">{t("f1.results.totalNote")}</p>
					{config.simulator && totalGain > 0 && (
						<p className="mt-3 font-text text-ubb-body font-semibold text-ubb-accent-500" aria-live="polite">
							{t("f1.results.simulator.total", { amount: formatFcfa(totalGain) })}
						</p>
					)}
				</div>
			)}

			<div className="mt-5 space-y-4">
				{results.map((result) => (
					<LossCard
						key={result.categoryId}
						result={result}
						config={config}
						lang={lang}
						reduction={reductions[result.categoryId] || 0}
						onReduction={(value) => setReductions((prev) => ({ ...prev, [result.categoryId]: value }))}
					/>
				))}
				{lockedIds.length > 0 && <LockedCard titles={lockedIds.map((id) => pick(config.categories[id].title, lang))} />}
			</div>

			<p className="mt-5 font-text text-ubb-small text-ubb-ink-muted">{t("f1.results.disclaimer")}</p>

			<div className="mt-5 flex flex-col gap-3 sm:flex-row">
				<Button onClick={handlePdf} disabled={exporting}>
					<Download className="h-4 w-4" aria-hidden="true" />
					{exporting ? t("f1.results.pdfGenerating") : t("f1.results.pdf")}
				</Button>
				<Button variant="outline" onClick={onEdit}>
					<Pencil className="h-4 w-4" aria-hidden="true" />
					{t("f1.results.edit")}
				</Button>
			</div>
		</div>
	);
};

export default ResultsStep;
