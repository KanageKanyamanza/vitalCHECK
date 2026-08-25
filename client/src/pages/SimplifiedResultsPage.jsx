import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Download,
	Mail,
	Star,
	TrendingDown,
	TrendingUp,
	CheckCircle,
	ListChecks,
	Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import axios from "axios";
import { assessmentV2API, API_BASE_URL as API_URL } from "../services/api";
import { getLevelV2ById } from "../utils/colors";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";
import { useClientAuth } from "../context/ClientAuthContext";

const RESULT_STORAGE_KEY = "vitalcheck-v2-result";

const rankPillars = (pillarScores) => {
	const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
	return {
		weakest: sorted.slice(0, 2),
		strongest: [...sorted].reverse().slice(0, 2),
	};
};

const PAID_PLANS = ["standard", "premium", "diagnostic"];

const SimplifiedResultsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const { scrollToTop } = useSmoothScroll();
	const { t, i18n } = useTranslation();
	const { user } = useClientAuth();

	const [data, setData] = useState(location.state || null);
	const [loading, setLoading] = useState(!location.state);
	const [savedAssessmentId, setSavedAssessmentId] = useState(
		searchParams.get("assessmentId") || null,
	);
	const [saved, setSaved] = useState(!!searchParams.get("assessmentId"));
	const [emailInput, setEmailInput] = useState("");
	const [saving, setSaving] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [downloadingPremium, setDownloadingPremium] = useState(false);

	// Vrai si l'utilisateur connecté a un abonnement payant actif
	const isPremiumUser =
		user?.subscription?.status === "active" &&
		PAID_PLANS.includes(user?.subscription?.plan);

	// Langue de l'assessment (stockée dans data) ou langue UI courante
	const language = data?.language || i18n.language?.substring(0, 2) || "fr";

	useEffect(() => {
		scrollToTop(400);

		if (data) return;

		const assessmentId = searchParams.get("assessmentId");

		if (assessmentId) {
			assessmentV2API
				.getAssessment(assessmentId)
				.then((response) => {
					if (!response.data.success) {
						throw new Error("Assessment not found");
					}

					const assessment = response.data.assessment;
					const pillarScores = assessment.pillarScores.map((pillar) => ({
						pillarId: pillar.pillarId,
						pillarName: pillar.pillarName,
						score: pillar.score,
						level: pillar.level,
					}));
					const recommendations = assessment.pillarScores.map((pillar) => ({
						pillarId: pillar.pillarId,
						pillarName: pillar.pillarName,
						recommendations: pillar.recommendations || [],
					}));
					const { weakest, strongest } = rankPillars(pillarScores);

					setData({
						result: {
							pillarScores,
							overallScore: assessment.overallScore,
							overallLevel: assessment.overallLevel,
							overallLevelLabel: getLevelV2ById(assessment.overallLevel, assessment.language || "fr").label,
							recommendations,
							weakest,
							strongest,
						},
						formData: {
							companyName: assessment.companyName,
							email: assessment.email,
							companySize: assessment.companySize,
							sector: assessment.sector,
						},
						language: assessment.language || "fr",
						completedAt: assessment.completedAt,
					});
					setEmailInput(assessment.email || "");
				})
				.catch(() => {
					toast.error(t("diagnostic.errors.resultsNotFound"));
					navigate("/diagnostic");
				})
				.finally(() => setLoading(false));
			return;
		}

		try {
			const storedRaw = sessionStorage.getItem(RESULT_STORAGE_KEY);
			if (storedRaw) {
				const stored = JSON.parse(storedRaw);
				setData(stored);
				setEmailInput(stored.formData?.email || "");
				setLoading(false);
				return;
			}
		} catch {
			// Ignorer les erreurs de lecture du stockage
		}

		navigate("/diagnostic");
	}, []);

	const handleSaveAndSend = async (e) => {
		e.preventDefault();
		if (!data || saving) return;

		if (!emailInput.trim()) {
			toast.error(t("diagnostic.errors.noEmail"));
			return;
		}

		setSaving(true);
		try {
			const token = localStorage.getItem("clientToken");
			const response = await assessmentV2API.saveAssessment(
				{
					answers: data.answers,
					language,
					companyName: data.formData?.companyName,
					email: emailInput.trim(),
					companySize: data.formData?.companySize,
					sector: data.formData?.sector || undefined,
				},
				token ? { Authorization: `Bearer ${token}` } : {},
			);

			if (response.data.success) {
				setSavedAssessmentId(response.data.assessment.id);
				setSaved(true);

				// Store JWT if a new account was created — needed to authenticate payment requests
				if (response.data.account?.created && response.data.clientToken) {
					localStorage.setItem('clientToken', response.data.clientToken);
					axios.defaults.headers.common['Authorization'] =
						`Bearer ${response.data.clientToken}`;
				}

				toast.success(t("diagnostic.results.reportSentToast"));
			}
		} catch (error) {
			console.error("Erreur de sauvegarde du diagnostic v2:", error);
			toast.error(t("diagnostic.errors.saveError"));
		} finally {
			setSaving(false);
		}
	};

	const handleDownload = async () => {
		if (!savedAssessmentId || downloading) return;

		setDownloading(true);
		try {
			const response = await assessmentV2API.downloadReport(savedAssessmentId);
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `vitalCHECK-diagnostic-${data?.formData?.companyName || "entreprise"}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Erreur de téléchargement du rapport v2:", error);
			toast.error(t("diagnostic.errors.reportNotReady"));
		} finally {
			setDownloading(false);
		}
	};

	const handleNewAssessment = () => {
		try {
			sessionStorage.removeItem(RESULT_STORAGE_KEY);
		} catch {
			// Ignorer
		}
		navigate("/diagnostic");
	};

	const handlePremiumUpgrade = () => {
		navigate("/checkout?plan=premium");
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleDownloadPremium = async () => {
		if (!savedAssessmentId || downloadingPremium) return;
		setDownloadingPremium(true);
		try {
			const token = localStorage.getItem("clientToken");
			const response = await axios.get(
				`${API_URL}/assessments-v2/${savedAssessmentId}/pdf/premium`,
				{ headers: { Authorization: `Bearer ${token}` }, responseType: "blob" },
			);
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `vitalCHECK-rapport-premium-${data?.formData?.companyName || "entreprise"}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			toast.success("Rapport Premium IA téléchargé !");
		} catch (err) {
			console.error("Erreur téléchargement rapport premium:", err);
			const code = err.response?.data?.code;
			if (code === "SUBSCRIPTION_INACTIVE" || code === "SUBSCRIPTION_EXPIRED" || code === "PLAN_UPGRADE_REQUIRED") {
				toast.error("Abonnement premium requis pour accéder à ce rapport.");
			} else if (err.response?.status === 403) {
				toast.error("Accès refusé — ce diagnostic ne vous appartient pas.");
			} else if (err.response?.status === 401) {
				toast.error("Veuillez vous connecter pour télécharger le rapport premium.");
			} else {
				toast.error("Erreur lors du téléchargement du rapport premium.");
			}
		} finally {
			setDownloadingPremium(false);
		}
	};

	if (loading || !data) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">{t("diagnostic.loading.results")}</p>
				</div>
			</div>
		);
	}

	const { result, formData = {}, completedAt } = data;
	const { pillarScores, overallScore, overallLevel, recommendations, weakest, strongest } = result;

	const overallLevelInfo = getLevelV2ById(overallLevel, language);

	const dateLocale = language === "en" ? "en-US" : "fr-FR";
	const dateLabel = new Date(completedAt || Date.now()).toLocaleDateString(dateLocale, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const findRecommendations = (pillarId) =>
		recommendations.find((r) => r.pillarId === pillarId)?.recommendations || [];

	const nextSteps = weakest
		.flatMap((pillar) =>
			findRecommendations(pillar.pillarId).map((text) => ({
				pillarName: pillar.pillarName,
				text,
			})),
		)
		.slice(0, 3);

	const premiumBenefits = t("diagnostic.results.premiumBenefits", { returnObjects: true });

	return (
		<div className="min-h-screen pb-[50px] bg-gray-50">
			<SEOHead
				title={t("diagnostic.meta.resultsTitle")}
				description={t("diagnostic.meta.resultsDescription")}
				url="/diagnostic/resultats"
				noindex
			/>

			{/* Action Bar */}
			<div className="bg-white shadow-sm">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-wrap gap-2 items-center justify-between">
						<span className="text-lg font-bold text-gray-900">
							{t("diagnostic.results.pageTitle")}
						</span>
						<button
							onClick={handleNewAssessment}
							className="btn-outline flex items-center space-x-2"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>{t("diagnostic.results.redo")}</span>
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Score global */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="card"
				>
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900">
							{formData.companyName}
						</h1>
						<p className="text-sm text-gray-500">
							{t("diagnostic.results.freeLabel")} · {dateLabel}
						</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-8 items-center mb-8">
						<div className="text-center">
							<div
								className="inline-flex items-center justify-center w-36 h-36 rounded-full border-8"
								style={{ borderColor: overallLevelInfo.color }}
							>
								<span
									className="text-4xl font-bold"
									style={{ color: overallLevelInfo.color }}
								>
									{overallScore}
								</span>
							</div>
							<div className="mt-4">
								<span
									className="inline-block px-4 py-1 rounded-full text-white font-semibold"
									style={{ backgroundColor: overallLevelInfo.color }}
								>
									{overallLevelInfo.label}
								</span>
							</div>
						</div>

						<div className="lg:col-span-2">
							<h2 className="text-lg font-semibold text-gray-900 mb-2">
								{t("diagnostic.results.overallTitle")}
							</h2>
							<p className="text-gray-700 leading-relaxed">
								{overallLevelInfo.interpretation}
							</p>
						</div>
					</div>

					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						{t("diagnostic.results.pillarsTitle")}
					</h3>
					<div className="space-y-4">
						{pillarScores.map((pillar) => {
							const levelInfo = getLevelV2ById(pillar.level, language);
							return (
								<div key={pillar.pillarId}>
									<div className="flex justify-between mb-1 text-sm">
										<span className="font-medium text-gray-900">
											{pillar.pillarName}
										</span>
										<span className="font-bold text-gray-900">
											{pillar.score}/100
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
										<motion.div
											className="h-full rounded-full"
											style={{ backgroundColor: levelInfo.color }}
											initial={{ width: 0 }}
											animate={{ width: `${pillar.score}%` }}
											transition={{ duration: 0.6, ease: "easeOut" }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</motion.div>

				{/* Risques & Forces */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="grid md:grid-cols-2 gap-8"
				>
					<div className="card">
						<div className="flex items-center space-x-2 mb-4">
							<TrendingDown className="w-5 h-5 text-danger-500" />
							<h3 className="text-lg font-bold text-gray-900">
								{t("diagnostic.results.risksTitle")}
							</h3>
						</div>
						<div className="space-y-4">
							{weakest.map((pillar) => (
								<div key={pillar.pillarId}>
									<div className="font-semibold text-gray-900 mb-1">
										{pillar.pillarName} — {pillar.score}/100
									</div>
									<ul className="space-y-1">
										{findRecommendations(pillar.pillarId).map((rec, i) => (
											<li
												key={i}
												className="text-sm text-gray-600 flex items-start space-x-2"
											>
												<span className="text-danger-500 mt-1">•</span>
												<span>{rec}</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>

					<div className="card">
						<div className="flex items-center space-x-2 mb-4">
							<TrendingUp className="w-5 h-5 text-success-500" />
							<h3 className="text-lg font-bold text-gray-900">
								{t("diagnostic.results.strengthsTitle")}
							</h3>
						</div>
						<div className="space-y-4">
							{strongest.map((pillar) => (
								<div key={pillar.pillarId} className="flex items-center justify-between">
									<span className="font-semibold text-gray-900">
										{pillar.pillarName}
									</span>
									<span className="text-2xl font-bold text-success-600">
										{pillar.score}/100
									</span>
								</div>
							))}
						</div>
					</div>
				</motion.div>

				{/* Prochaines étapes */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="card"
				>
					<div className="flex items-center space-x-2 mb-4">
						<ListChecks className="w-5 h-5 text-primary-500" />
						<h3 className="text-lg font-bold text-gray-900">
							{t("diagnostic.results.nextStepsTitle")}
						</h3>
					</div>
					<ol className="space-y-3">
						{nextSteps.map((step, index) => (
							<li key={index} className="flex items-start space-x-3">
								<span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center">
									{index + 1}
								</span>
								<span className="text-gray-700">{step.text}</span>
							</li>
						))}
					</ol>
				</motion.div>

				{/* Envoyer le rapport */}
				{!saved && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="card"
					>
						<div className="flex items-center space-x-2 mb-2">
							<Mail className="w-5 h-5 text-primary-500" />
							<h3 className="text-lg font-bold text-gray-900">
								{t("diagnostic.results.emailSectionTitle")}
							</h3>
						</div>

						{/* Email déjà connu → un seul bouton de confirmation */}
						{emailInput ? (
							<>
								<p className="text-gray-600 mb-4">
									{t("diagnostic.results.emailSectionSubtitle")}
								</p>
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
									<div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 text-sm flex-1">
										<Mail className="w-4 h-4 text-gray-400 shrink-0" />
										<span className="font-medium truncate">{emailInput}</span>
									</div>
									<button
										onClick={handleSaveAndSend}
										disabled={saving}
										className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap"
									>
										{saving ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										) : (
											<>
												<Mail className="w-4 h-4" />
												<span>{t("diagnostic.results.sendReportButton")}</span>
											</>
										)}
									</button>
								</div>
								<button
									onClick={() => setEmailInput("")}
									className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
								>
									Utiliser un autre email
								</button>
							</>
						) : (
							/* Pas d'email → formulaire complet */
							<>
								<p className="text-gray-600 mb-4">
									{t("diagnostic.results.emailSectionSubtitle")}
								</p>
								<form onSubmit={handleSaveAndSend} className="flex flex-col sm:flex-row gap-3">
									<input
										type="email"
										value={emailInput}
										onChange={(e) => setEmailInput(e.target.value)}
										placeholder={t("diagnostic.results.emailPlaceholder")}
										className="input-field flex-1"
										required
									/>
									<button
										type="submit"
										disabled={saving}
										className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
									>
										{saving ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										) : (
											<>
												<Mail className="w-4 h-4" />
												<span>{t("diagnostic.results.sendReportButton")}</span>
											</>
										)}
									</button>
								</form>
							</>
						)}
					</motion.div>
				)}

				{saved && savedAssessmentId && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="card"
					>
						<div className="flex items-center space-x-2 mb-4">
							<CheckCircle className="w-5 h-5 text-success-500" />
							<h3 className="text-lg font-bold text-gray-900">
								{t("diagnostic.results.reportReadyTitle")}
							</h3>
						</div>
						<p className="text-gray-600 mb-4">
							{t("diagnostic.results.reportReadySubtitle")}
						</p>
						<button
							onClick={handleDownload}
							disabled={downloading}
							className="btn-outline flex items-center space-x-2 disabled:opacity-50"
						>
							{downloading ? (
								<div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
							) : (
								<>
									<Download className="w-4 h-4" />
									<span>{t("diagnostic.results.downloadButton")}</span>
								</>
							)}
						</button>
					</motion.div>
				)}

				{/* Bouton Rapport Premium IA — visible uniquement pour les abonnés payants avec diagnostic sauvegardé */}
				{isPremiumUser && savedAssessmentId && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="card border-2 border-green-400 bg-gradient-to-r from-green-50 to-yellow-50"
					>
						<div className="flex items-center space-x-2 mb-3">
							<Sparkles className="w-6 h-6 text-green-600" />
							<h3 className="text-xl font-bold text-gray-900">
								Votre Rapport Premium IA est disponible
							</h3>
						</div>
						<p className="text-gray-600 mb-5">
							En tant qu'abonné premium, vous bénéficiez d'une analyse approfondie générée par intelligence artificielle : recommandations personnalisées, plan d'action priorisé et insights stratégiques adaptés à votre secteur.
						</p>
						<button
							onClick={handleDownloadPremium}
							disabled={downloadingPremium}
							className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{downloadingPremium ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Génération en cours… (10–20 sec)</span>
								</>
							) : (
								<>
									<Download className="w-5 h-5" />
									<span>Télécharger mon Rapport Premium IA</span>
								</>
							)}
						</button>
					</motion.div>
				)}

				{/* Premium CTA — uniquement pour les non-abonnés */}
				{!isPremiumUser && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
					>
						<div className="flex items-center space-x-2 mb-4">
							<Star className="w-6 h-6 text-purple-500" />
							<h3 className="text-xl font-bold text-gray-900">
								{t("diagnostic.results.premiumTitle")}
							</h3>
						</div>
						<ul className="space-y-2 mb-6">
							{Array.isArray(premiumBenefits) && premiumBenefits.map((benefit, i) => (
								<li key={i} className="flex items-start space-x-2 text-gray-700">
									<CheckCircle className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
									<span>{benefit}</span>
								</li>
							))}
						</ul>
						<button
							onClick={handlePremiumUpgrade}
							className="btn-secondary flex items-center justify-center space-x-2"
						>
							<Star className="w-4 h-4" />
							<span>{t("diagnostic.results.premiumCta")}</span>
						</button>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default SimplifiedResultsPage;
