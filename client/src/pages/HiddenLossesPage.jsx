import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SEOHead from "../components/seo/SEOHead";
import { Button, Container } from "../components/ui/ds";
import HiddenLossesSection from "../features/f1/HiddenLossesSection";
import { requestHandoff } from "../features/f1/handoff";

/**
 * F1 « Calculateur de pertes cachées », ouvert dans un nouvel onglet depuis le rapport.
 * Le diagnostic (réponses et questionnaire) est transmis par l'onglet du rapport.
 */
const HiddenLossesPage = () => {
	const { t } = useTranslation();
	const [state, setState] = useState({ status: "waiting", payload: null });

	useEffect(() => {
		let active = true;
		requestHandoff().then((payload) => {
			if (active) setState({ status: payload ? "ready" : "missing", payload });
		});
		return () => {
			active = false;
		};
	}, []);

	return (
		<div className="min-h-screen bg-ubb-paper-soft">
			<SEOHead title={t("f1.page.metaTitle")} description={t("f1.cta.text")} url="/diagnostic/pertes-cachees" noindex />
			<Container className="max-w-3xl py-8 sm:py-12">
				{state.payload?.companyName && (
					<p className="font-text text-sm font-semibold text-ubb-ink-muted">{state.payload.companyName}</p>
				)}
				<h1 className="ubb-heading mt-1 text-ubb-title">{t("f1.page.title")}</h1>

				{state.status === "waiting" && (
					<div className="mt-8 flex items-center gap-3" role="status">
						<div className="h-6 w-6 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" aria-hidden="true" />
						<p className="font-text text-ubb-body text-ubb-ink-muted">{t("f1.page.waiting")}</p>
					</div>
				)}

				{state.status === "missing" && (
					<div className="ubb-card mt-6 p-6">
						<p className="font-text text-ubb-body text-ubb-ink">{t("f1.page.missing")}</p>
						<Button to="/diagnostic/resultats" variant="outline" className="mt-5">
							{t("f1.page.backToReport")}
						</Button>
					</div>
				)}

				{state.status === "ready" && (
					<HiddenLossesSection
						answers={state.payload.answers}
						questionnaireType={state.payload.questionnaireType}
						companyName={state.payload.companyName}
					/>
				)}
			</Container>
		</div>
	);
};

export default HiddenLossesPage;
