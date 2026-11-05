import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/ds";
import { f1API } from "../../services/api";
import { trackEvent } from "../../utils/analytics";
import { showDraftBanner } from "../../utils/featureFlags";
import { computeCategory, sortResults } from "./lossCalculator";
import CategoryStep from "./CategoryStep";
import InputStep from "./InputStep";
import ResultsStep from "./ResultsStep";

const EMPTY_INPUTS = { values: {}, unknown: {}, revenue: { value: null, unknown: false } };

/**
 * F1 « Calculateur de pertes cachées », dans l'onglet ouvert depuis le rapport. Démarre seul.
 * Les chiffres saisis restent dans l'état React : aucun envoi, aucun stockage.
 * Seule la configuration est demandée au serveur, qui décide de ce qui est débloqué.
 */
const HiddenLossesSection = ({ answers, questionnaireType, companyName }) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language?.substring(0, 2) === "en" ? "en" : "fr";
	const headingRef = useRef(null);
	const started = useRef(false);

	const [step, setStep] = useState("loading"); // loading | error | select | input | results
	const [config, setConfig] = useState(null);
	const [selected, setSelected] = useState([]);
	const [inputs, setInputs] = useState(EMPTY_INPUTS);
	const [results, setResults] = useState([]);

	useEffect(() => {
		if (["select", "input", "results"].includes(step)) {
			headingRef.current?.focus();
			headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, [step]);

	const open = async () => {
		setStep("loading");
		trackEvent("f1_opened");
		try {
			const response = await f1API.getConfig({ questionnaireType, answers });
			const loaded = response.data.config;
			setConfig(loaded);
			setSelected(loaded.preselected);
			setStep("select");
		} catch (error) {
			console.error("F1 config:", error);
			setStep("error");
		}
	};

	// Démarre sans second clic, une seule fois (même en StrictMode)
	useEffect(() => {
		if (started.current) return;
		started.current = true;
		open();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const unlockedSelection = config ? selected.filter((id) => config.unlocked.includes(id)) : [];
	const lockedSelection = config ? selected.filter((id) => !config.unlocked.includes(id)) : [];

	const showResults = () => {
		setResults(sortResults(unlockedSelection.map((id) => computeCategory(id, inputs, config))));
		setStep("results");
		trackEvent("f1_results_shown");
	};

	const stepNumber = { select: 1, input: 2, results: 3 }[step];
	const stepTitle = {
		select: t("f1.select.title"),
		input: t("f1.input.title"),
		results: t("f1.results.title"),
	}[step];

	return (
		<section aria-labelledby="f1-title" className="ubb-card mt-6 scroll-mt-24 p-6 sm:p-8">
			{/* La page porte déjà le titre visible */}
			<h2 id="f1-title" className="sr-only">
				{t("f1.cta.title")}
			</h2>
			<p className="font-text text-ubb-small text-ubb-ink-muted">{t("f1.cta.privacy")}</p>

			{config?.status === "draft" && showDraftBanner && (
				<p className="mt-4 rounded-ubb-field border border-dashed border-ubb-accent-ink/40 bg-ubb-accent-50 px-3 py-2 font-text text-xs font-semibold text-ubb-accent-ink">
					{t("f1.draftBanner")}
				</p>
			)}

			{step === "loading" && (
				<p role="status" className="mt-4 font-text text-ubb-body text-ubb-ink-muted">
					{t("f1.page.waiting")}
				</p>
			)}

			{step === "error" && (
				<div>
					<p role="alert" className="mt-4 font-text text-sm font-medium text-red-700">
						{t("f1.loadError")}
					</p>
					<Button onClick={open} className="mt-4 w-full sm:w-auto">
						{t("f1.retry")}
					</Button>
				</div>
			)}

			{stepNumber && (
				<div className="mt-5">
					<p className="font-text text-xs font-semibold uppercase tracking-wide text-ubb-ink-muted">
						{t("f1.step", { current: stepNumber })}
					</p>
					<h4 ref={headingRef} tabIndex={-1} className="mt-1 scroll-mt-24 font-heading text-lg font-semibold text-ubb-ink outline-none">
						{stepTitle}
					</h4>
					<div className="mt-3">
						{step === "select" && (
							<CategoryStep
								config={config}
								selected={selected}
								onChange={setSelected}
								onContinue={() => (unlockedSelection.length > 0 ? setStep("input") : showResults())}
								lang={lang}
							/>
						)}
						{step === "input" && (
							<InputStep
								config={config}
								categoryIds={unlockedSelection}
								inputs={inputs}
								onChange={setInputs}
								onBack={() => setStep("select")}
								onSubmit={showResults}
								lang={lang}
							/>
						)}
						{step === "results" && (
							<ResultsStep
								config={config}
								results={results}
								lockedIds={lockedSelection}
								lang={lang}
								companyName={companyName}
								onEdit={() => setStep("input")}
							/>
						)}
					</div>
				</div>
			)}
		</section>
	);
};

export default HiddenLossesSection;
