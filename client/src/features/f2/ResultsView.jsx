import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowDown, ArrowUp, CalendarPlus, CheckCircle2, Download, Minus, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/ds";
import { trackEvent } from "../../utils/analytics";
import { colon, formatFcfaExact, formatPercent } from "../shared/format";
import { hasCritical, triggeredAlerts, unverifiedRules } from "./alertRules";
import { factLines, pick } from "./facts";
import { buildReminderIcs, downloadIcs, reminderDate } from "./ics";

const SEVERITY_STYLE = {
	critical: "bg-red-50 text-red-800 border-red-200",
	moderate: "bg-ubb-accent-50 text-ubb-accent-ink border-ubb-accent-100",
	low: "bg-ubb-brand-50 text-ubb-brand-900 border-ubb-brand-100",
};

const AlertCard = ({ result, config, months, lang }) => {
	const { t } = useTranslation();
	const texts = config.texts[result.ruleId];
	return (
		<article className="ubb-card p-5">
			<div className="flex flex-wrap items-center gap-2">
				<span className={`rounded-full border px-2.5 py-0.5 font-text text-xs font-bold uppercase tracking-wide ${SEVERITY_STYLE[result.severity]}`}>
					{t(`f2.results.severity.${result.severity}`)}
				</span>
				<h3 className="font-heading text-lg font-semibold text-ubb-ink">{pick(texts.title, lang)}</h3>
			</div>

			<h4 className="mt-4 font-text text-sm font-semibold text-ubb-ink">{t("f2.results.facts")}</h4>
			<ul className="mt-1 space-y-1 font-text text-ubb-small text-ubb-ink">
				{factLines(result, months, lang, t).map((line) => (
					<li key={line}>{line}</li>
				))}
			</ul>

			<h4 className="mt-4 font-text text-sm font-semibold text-ubb-ink">{t("f2.results.causes")}</h4>
			<p className="font-text text-xs text-ubb-ink-muted">{t("f2.results.causesNote")}</p>
			<ul className="mt-1 list-disc space-y-1 pl-5 font-text text-ubb-small text-ubb-ink-muted">
				{(texts.causes[lang] || texts.causes.fr).map((cause) => (
					<li key={cause}>{cause}</li>
				))}
			</ul>

			<div className="mt-4 rounded-ubb-field bg-ubb-paper-soft p-3">
				<h4 className="font-text text-sm font-semibold text-ubb-ink">{t("f2.results.action")}</h4>
				<p className="mt-1 font-text text-ubb-small text-ubb-ink">{pick(texts.action, lang)}</p>
			</div>
		</article>
	);
};

const TREND_ICON = { 1: ArrowUp, "-1": ArrowDown, 0: Minus };
const TREND_KEY = { 1: "up", "-1": "down", 0: "same" };

const formatField = (field, value, lang) => {
	if (field === "topClientShare") return formatPercent(value, lang);
	if (field === "stockouts") return String(value);
	return formatFcfaExact(value);
};

/** Comparaison avec le contrôle précédent (historique sur l'appareil) */
const Comparison = ({ diff, config, lang }) => {
	const { t } = useTranslation();
	const date = new Date(diff.date).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });
	const title = (id) => pick(config.texts[id].title, lang);
	return (
		<div className="rounded-ubb-field border border-ubb-brand-900/10 bg-white p-4">
			<h3 className="font-heading text-base font-semibold text-ubb-ink">{t("f2.history.compareTitle", { date })}</h3>
			<ul className="mt-2 space-y-1.5">
				{diff.figures.map((item) => {
					const Icon = TREND_ICON[item.trend];
					return (
						<li key={item.field} className="flex items-center justify-between gap-3 font-text text-ubb-small text-ubb-ink">
							<span>{t(`f2.history.fields.${item.field}`)}</span>
							<span className="flex items-center gap-1.5 font-semibold">
								{formatField(item.field, item.after, lang)}
								<Icon className="h-4 w-4 text-ubb-ink-muted" aria-hidden="true" />
								<span className="sr-only">{t(`f2.history.trend.${TREND_KEY[item.trend]}`)}</span>
							</span>
						</li>
					);
				})}
			</ul>
			{diff.newAlerts.length > 0 && (
				<p className="mt-3 font-text text-ubb-small text-ubb-ink">
					<span className="font-semibold">{t("f2.history.newAlerts")}{colon(lang)}</span>
					{diff.newAlerts.map(title).join(", ")}
				</p>
			)}
			{diff.goneAlerts.length > 0 && (
				<p className="mt-1 font-text text-ubb-small text-ubb-ink">
					<span className="font-semibold">{t("f2.history.goneAlerts")}{colon(lang)}</span>
					{diff.goneAlerts.map(title).join(", ")}
				</p>
			)}
		</div>
	);
};

/** Écran de résultats : alertes par gravité, non vérifiées, consultant, rappel, PDF, historique. */
const ResultsView = ({ config, results, months, lang, figures, history, comparison, onEdit }) => {
	const { t } = useTranslation();
	const [exporting, setExporting] = useState(false);
	const [kept, setKept] = useState(false);

	const alerts = triggeredAlerts(results);
	const unverified = unverifiedRules(results);
	const critical = hasCritical(results);

	const addReminder = () => {
		const now = new Date();
		const ics = buildReminderIcs({
			title: pick(config.messages.reminderTitle, lang),
			description: pick(config.messages.reminderDescription, lang),
			start: reminderDate(now),
			now,
			uid: `${now.getTime()}-${Math.random().toString(36).slice(2)}@vitalcheck`,
		});
		downloadIcs(ics, "rappel-vitalcheck.ics");
		trackEvent("f2_reminder_added");
		toast.success(t("f2.results.reminderDone"));
	};

	const handlePdf = async () => {
		if (exporting) return;
		setExporting(true);
		try {
			const { exportF2Pdf } = await import("./exportPdf");
			await exportF2Pdf({ config, results, months, lang, t });
			trackEvent("f2_pdf_downloaded");
		} catch (error) {
			console.error("F2 PDF:", error);
			toast.error(t("f2.results.pdfError"));
		} finally {
			setExporting(false);
		}
	};

	const toggleKeep = (checked) => {
		setKept(checked);
		if (checked) {
			history.save({ date: new Date().toISOString(), figures, alerts: alerts.map((a) => a.ruleId) });
			toast.success(t("f2.history.saved"));
		} else {
			history.clear();
		}
	};

	const clearHistory = () => {
		history.clear();
		setKept(false);
		toast.success(t("f2.history.cleared"));
	};

	return (
		<div>
			{alerts.length > 0 ? (
				<p className="flex items-center gap-2 font-heading text-lg font-semibold text-ubb-ink">
					<AlertTriangle className="h-5 w-5 text-ubb-accent-ink" aria-hidden="true" />
					{t("f2.results.count", { count: alerts.length })}
				</p>
			) : (
				<div className="rounded-ubb-panel border border-ubb-brand-100 bg-ubb-brand-50 p-5">
					<p className="flex items-center gap-2 font-heading text-lg font-semibold text-ubb-brand-900">
						<CheckCircle2 className="h-5 w-5" aria-hidden="true" />
						{t("f2.results.noAlertTitle")}
					</p>
					<p className="mt-2 font-text text-ubb-body text-ubb-ink">{pick(config.messages.noAlert, lang)}</p>
				</div>
			)}

			<div className="mt-4 space-y-4">
				{alerts.map((result) => (
					<AlertCard key={result.ruleId} result={result} config={config} months={months} lang={lang} />
				))}
			</div>

			{unverified.length > 0 && (
				<div className="mt-4 rounded-ubb-field border border-dashed border-ubb-brand-900/20 p-4">
					<h3 className="font-text text-sm font-semibold text-ubb-ink">{t("f2.results.unverifiedTitle")}</h3>
					<p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">
						{t("f2.results.unverifiedText")} {unverified.map((r) => pick(config.texts[r.ruleId].title, lang)).join(", ")}
					</p>
				</div>
			)}

			{critical && (
				<div className="mt-4 rounded-ubb-panel bg-ubb-brand-900 p-5 text-white">
					<p className="font-text text-ubb-body">{pick(config.messages.consultant, lang)}</p>
					<Button to="/contact?topic=f2-critical" target="_blank" rel="noopener" variant="onDark" className="mt-4 w-full sm:w-auto">
						{t("f2.results.consultant")}
					</Button>
				</div>
			)}

			{history.enabled && (
				<div className="mt-6 space-y-3">
					{comparison && <Comparison diff={comparison} config={config} lang={lang} />}
					<label className="flex min-h-[44px] cursor-pointer items-center gap-3 font-text text-ubb-small font-semibold text-ubb-ink">
						<input
							type="checkbox"
							checked={kept}
							onChange={(e) => toggleKeep(e.target.checked)}
							className="ubb-focus h-5 w-5 shrink-0 accent-[rgb(var(--ubb-brand-900))]"
						/>
						{t("f2.history.keep")}
					</label>
					<p className="font-text text-ubb-small text-ubb-ink-muted">{t("f2.history.privacy")}</p>
					<button
						type="button"
						onClick={clearHistory}
						className="ubb-focus inline-flex min-h-[44px] items-center rounded font-text text-sm font-semibold text-ubb-brand-900 underline underline-offset-4"
					>
						{t("f2.history.clear")}
					</button>
				</div>
			)}

			<p className="mt-5 font-text text-ubb-small text-ubb-ink-muted">{t("f2.results.disclaimer")}</p>

			<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<Button onClick={addReminder}>
					<CalendarPlus className="h-4 w-4" aria-hidden="true" />
					{t("f2.results.reminder")}
				</Button>
				<Button variant="outline" onClick={handlePdf} disabled={exporting}>
					<Download className="h-4 w-4" aria-hidden="true" />
					{exporting ? t("f2.results.pdfGenerating") : t("f2.results.pdf")}
				</Button>
				<Button variant="outline" onClick={onEdit}>
					<Pencil className="h-4 w-4" aria-hidden="true" />
					{t("f2.results.edit")}
				</Button>
			</div>
		</div>
	);
};

export default ResultsView;
