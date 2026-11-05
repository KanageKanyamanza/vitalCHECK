import React from "react";
import { useTranslation } from "react-i18next";
import SEOHead from "../components/seo/SEOHead";
import { AuthLayout } from "../components/ui/ds";
import AlertCheck from "../features/f2/AlertCheck";

/**
 * F2 « Auto-contrôle d'alerte », ouvert dans un nouvel onglet depuis le rapport ou l'espace client.
 * Fonctionne seul (aucune donnée du diagnostic) : la page peut être gardée en favori et refaite chaque mois.
 */
const AlertCheckPage = () => {
	const { t } = useTranslation();
	return (
		<>
			<SEOHead title={t("f2.page.metaTitle")} description={t("f2.cta.text")} url="/diagnostic/signaux-alerte" noindex />
			<AuthLayout
				scene="alerts"
				width="lg"
				compactTitle
				titleId="f2-page-title"
				title={t("f2.page.title")}
				subtitle={t("f2.page.subtitle")}
				panelTitle={t("f2.page.panelTitle")}
				panelText={t("f2.page.panelText")}
			>
				<AlertCheck />
			</AuthLayout>
		</>
	);
};

export default AlertCheckPage;
