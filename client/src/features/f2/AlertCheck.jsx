import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/ds";
import { useClientAuth } from "../../context/ClientAuthContext";
import BackLink from "../shared/BackLink";
import { leaveTool, useStepHistory } from "../shared/useStepHistory";
import { f2API } from "../../services/api";
import { trackEvent } from "../../utils/analytics";
import { isF2LocalHistoryEnabled, showDraftBanner } from "../../utils/featureFlags";
import { evaluateRules, lastThreeMonths, triggeredAlerts } from "./alertRules";
import { compareWithPrevious, createHistory } from "./history";
import { inSentence } from "./facts";
import MonthsStep from "./MonthsStep";
import SituationStep from "./SituationStep";
import ResultsView from "./ResultsView";

const STEPS = ["months", "situation", "results"];

const EMPTY_FIGURES = {
	sales: [null, null, null],
	expenses: [null, null, null],
	overdueReceivables: null,
	cash: null,
	fixedCosts: null,
	stockouts: null,
	topClientShare: null,
};

/**
 * F2 « Auto-contrôle d'alerte ». Les chiffres saisis restent dans l'état React :
 * aucun envoi ; seul l'historique facultatif (drapeau) les garde sur l'appareil.
 */
const AlertCheck = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language?.substring(0, 2) === "en" ? "en" : "fr";
	const months = useMemo(() => lastThreeMonths(new Date(), lang), [lang]);
	const history = useMemo(() => createHistory({ enabled: isF2LocalHistoryEnabled }), []);
	const previous = useMemo(() => history.load(), [history]);

	const [step, setStep] = useState("loading"); // loading | error | months | situation | results
	const [config, setConfig] = useState(null);
	const [figures, setFigures] = useState(EMPTY_FIGURES);
	const [unknownRows, setUnknownRows] = useState({ sales: false, expenses: false });
	const [unknownFields, setUnknownFields] = useState({});
	const [results, setResults] = useState([]);
	const navigate = useNavigate();
	const { user } = useClientAuth();
	// Bouton retour du téléphone et lien « Retour » : écran précédent ; depuis le 1er écran, on quitte l'outil
	const { goBack, goBackTo } = useStepHistory(step, setStep, STEPS);
	const handleBack = () => (step === "months" ? leaveTool(navigate, user ? "/client/dashboard" : "/") : goBack());
	const headingRef = useRef(null);
	const firstScreen = useRef(true);
	const started = useRef(false);

	const load = async () => {
		setStep("loading");
		try {
			const response = await f2API.getConfig();
			setConfig(response.data.config);
			setStep("months");
			trackEvent("f2_opened");
		} catch (error) {
			console.error("F2 config:", error);
			setStep("error");
		}
	};

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Focus et défilement sur le titre à chaque changement d'écran, sauf à l'ouverture
	useEffect(() => {
		if (step === "months" && firstScreen.current) {
			firstScreen.current = false;
			return;
		}
		if (["months", "situation", "results"].includes(step)) {
			headingRef.current?.focus();
			headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [step]);

	// « Je ne sais pas » : la valeur devient inconnue (null), la règle liée ne sera pas vérifiée
	const effectiveFigures = () => {
		const out = { ...figures };
		for (const row of ["sales", "expenses"]) if (unknownRows[row]) out[row] = [null, null, null];
		for (const [field, unknown] of Object.entries(unknownFields)) if (unknown) out[field] = null;
		return out;
	};

	const showResults = () => {
		const evaluated = evaluateRules(effectiveFigures(), config);
		setResults(evaluated);
		setStep("results");
		trackEvent("f2_completed");
		// Un compteur par règle déclenchée : le nom de la règle seulement, jamais les chiffres
		triggeredAlerts(evaluated).forEach((alert) => trackEvent(`f2_alert_${alert.ruleId}`));
	};

	const formStep = { months: 1, situation: 2 }[step];
	const stepTitle = {
		months: t("f2.months.title"),
		situation: t("f2.situation.title"),
		results: t("f2.results.title"),
	}[step];

	const comparison =
		step === "results" && previous
			? compareWithPrevious(previous, effectiveFigures(), triggeredAlerts(results).map((a) => a.ruleId))
			: null;

	return (
		<div>
			<p className="font-text text-ubb-small text-ubb-ink-muted">{t("f2.privacy")}</p>

			{config?.status === "draft" && showDraftBanner && (
				<p className="mt-4 rounded-ubb-field border border-dashed border-ubb-accent-ink/40 bg-ubb-accent-50 px-3 py-2 font-text text-xs font-semibold text-ubb-accent-ink">
					{t("f2.draftBanner")}
				</p>
			)}

			{step === "loading" && (
				<p role="status" className="mt-4 font-text text-ubb-body text-ubb-ink-muted">
					{t("f2.loading")}
				</p>
			)}

			{step === "error" && (
				<div>
					<p role="alert" className="mt-4 font-text text-sm font-medium text-red-700">
						{t("f2.loadError")}
					</p>
					<Button onClick={load} className="mt-4 w-full sm:w-auto">
						{t("f2.retry")}
					</Button>
				</div>
			)}

			{stepTitle && (
				<div className="mt-4">
					<BackLink label={t("tools.back")} onClick={handleBack} />
					{formStep && (
						<div className="mb-3">
							<p className="font-text text-xs font-semibold uppercase tracking-wide text-ubb-ink-muted">
								{t("f2.step", { current: formStep })}
							</p>
							<div className="mt-2 flex gap-1.5" aria-hidden="true">
								{[1, 2].map((n) => (
									<span key={n} className={`h-1.5 flex-1 rounded-full ${n <= formStep ? "bg-ubb-brand-900" : "bg-ubb-brand-100"}`} />
								))}
							</div>
						</div>
					)}
					<h2 ref={headingRef} tabIndex={-1} className="scroll-mt-24 font-heading text-xl font-semibold text-ubb-ink outline-none">
						{stepTitle}
					</h2>
					<div className="mt-3">
						{step === "months" && (
							<MonthsStep
								months={months}
								figures={figures}
								unknown={unknownRows}
								onFigures={setFigures}
								onUnknown={setUnknownRows}
								onContinue={() => setStep("situation")}
							/>
						)}
						{step === "situation" && (
							<SituationStep
								lastMonth={inSentence(months[2], lang)}
								figures={figures}
								unknown={unknownFields}
								onFigures={setFigures}
								onUnknown={setUnknownFields}
								onBack={goBack}
								onSubmit={showResults}
							/>
						)}
						{step === "results" && (
							<ResultsView
								config={config}
								results={results}
								months={months}
								lang={lang}
								figures={effectiveFigures()}
								history={history}
								comparison={comparison}
								onEdit={() => goBackTo("months")}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default AlertCheck;
