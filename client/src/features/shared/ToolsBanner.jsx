import React from "react";
import { useTranslation } from "react-i18next";
import { BellRing, Calculator, ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/ds";
import { isF1HiddenLossesEnabled, isF2AlertCheckEnabled } from "../../utils/featureFlags";
import { openF1Tab } from "../f1/handoff";

const ToolCard = ({ icon: Icon, titleId, title, text, button, newTabLabel, ...buttonProps }) => (
	<div className="flex flex-col gap-4 rounded-ubb-field bg-white p-4 sm:p-5">
		<div className="flex items-start gap-3">
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-accent-50 text-ubb-accent-ink">
				<Icon className="h-5 w-5" aria-hidden="true" />
			</span>
			<div className="min-w-0">
				<h3 id={titleId} className="ubb-heading text-base font-semibold sm:text-lg">
					{title}
				</h3>
				<p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">{text}</p>
			</div>
		</div>
		{/* Taille « sm » : le libellé tient sur une ligne à 360 px (cible tactile de 44 px gardée) */}
		<Button size="sm" className="mt-auto w-full" {...buttonProps}>
			{button}
			<ExternalLink className="h-4 w-4" aria-hidden="true" />
			<span className="sr-only">{newTabLabel}</span>
		</Button>
	</div>
);

/**
 * Bandeau « Allez plus loin », en haut du rapport : les outils F1 et F2, chacun derrière son drapeau.
 * Les deux s'ouvrent dans un nouvel onglet. F1 garde le lien avec le rapport (transmission du diagnostic) ;
 * F2 n'en a pas besoin (lien simple, sans accès à cet onglet).
 */
const ToolsBanner = () => {
	const { t } = useTranslation();
	if (!isF1HiddenLossesEnabled && !isF2AlertCheckEnabled) return null;
	return (
		<section aria-labelledby="tools-banner-title" className="mt-6 rounded-ubb-panel border border-ubb-accent-100 bg-ubb-accent-50 p-4 sm:p-5">
			<h2 id="tools-banner-title" className="ubb-heading px-1 text-lg font-semibold">
				{t("tools.banner.title")}
			</h2>
			<div className={`mt-3 grid gap-3 ${isF1HiddenLossesEnabled && isF2AlertCheckEnabled ? "md:grid-cols-2" : ""}`}>
				{isF1HiddenLossesEnabled && (
					<ToolCard
						icon={Calculator}
						titleId="f1-cta-title"
						title={t("f1.cta.title")}
						text={t("f1.cta.text")}
						button={t("f1.cta.button")}
						newTabLabel={t("tools.newTab")}
						onClick={openF1Tab}
					/>
				)}
				{isF2AlertCheckEnabled && (
					<ToolCard
						icon={BellRing}
						titleId="f2-cta-title"
						title={t("f2.cta.title")}
						text={t("f2.cta.text")}
						button={t("f2.cta.button")}
						newTabLabel={t("tools.newTab")}
						href="/diagnostic/signaux-alerte"
						target="_blank"
						rel="noopener noreferrer"
					/>
				)}
			</div>
		</section>
	);
};

export default ToolsBanner;
