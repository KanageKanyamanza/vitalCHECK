import React from "react";
import { useTranslation } from "react-i18next";
import { Calculator, ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/ds";
import { openF1Tab } from "./handoff";

/** Bandeau en haut du rapport : ouvre le calculateur de pertes cachées dans un nouvel onglet. */
const HiddenLossesCta = () => {
	const { t } = useTranslation();
	return (
		<section
			aria-labelledby="f1-cta-title"
			className="mt-6 flex flex-col gap-4 rounded-ubb-panel border border-ubb-accent-100 bg-ubb-accent-50 p-5 sm:flex-row sm:items-center sm:p-6"
		>
			<span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-ubb-field bg-white text-ubb-accent-ink sm:flex">
				<Calculator className="h-5 w-5" aria-hidden="true" />
			</span>
			<div className="min-w-0 flex-1">
				<h2 id="f1-cta-title" className="ubb-heading text-lg font-semibold">
					{t("f1.cta.title")}
				</h2>
				<p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">{t("f1.cta.text")}</p>
			</div>
			<Button onClick={openF1Tab} className="w-full shrink-0 sm:w-auto">
				{t("f1.cta.button")}
				<ExternalLink className="h-4 w-4" aria-hidden="true" />
				<span className="sr-only">{t("f1.cta.newTab")}</span>
			</Button>
		</section>
	);
};

export default HiddenLossesCta;
