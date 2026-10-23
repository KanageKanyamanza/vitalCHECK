import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
	Download,
	Mail,
	Star,
	TrendingDown,
	TrendingUp,
	Check,
	CheckCircle2,
	ListChecks,
	Sparkles,
	RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import axios from "axios";
import { assessmentV2API, API_BASE_URL as API_URL } from "../services/api";
import { getLevelV2ById } from "../utils/colors";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";
import { useClientAuth } from "../context/ClientAuthContext";
import { Button, Container, FormField } from "../components/ui/ds";
import ScoreRing from "../components/results/ScoreRing";
import PillarRadar from "../components/results/PillarRadar";

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
	const reduceMotion = useReducedMotion();

	const [data, setData] = useState(location.state || null);
	const [loading, setLoading] = useState(!location.state);
	const [savedAssessmentId, setSavedAssessmentId] = useState(
		searchParams.get("assessmentId") || null,
	);
	const [saved, setSaved] = useState(!!searchParams.get("assessmentId"));
	const [emailInput, setEmailInput] = useState("");
	const [saving, setSaving] = useState(false);
	const autoSaveAttempted = useRef(false);
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

	const doSave = async (email) => {
		if (!data || saving) return;
		setSaving(true);
		try {
			const token = localStorage.getItem("clientToken");
			const response = await assessmentV2API.saveAssessment(
				{
					answers: data.answers,
					language,
					companyName: data.formData?.companyName,
					email: email.trim(),
					companySize: data.formData?.companySize,
					sector: data.formData?.sector || undefined,
					questionnaireType: data.questionnaireType || "universal",
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

	// Pré-remplir l'email depuis location.state (flux normal après questionnaire)
	useEffect(() => {
		if (!emailInput) {
			const email = data?.formData?.email || user?.email || "";
			if (email) setEmailInput(email);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.formData?.email, user?.email]);

	// Auto-envoyer le rapport dès que l'email et les données sont disponibles
	useEffect(() => {
		if (autoSaveAttempted.current || saved || saving || !data || !emailInput) return;
		autoSaveAttempted.current = true;
		doSave(emailInput);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, emailInput, saved]);

	const handleSaveAndSend = async (e) => {
		if (e) e.preventDefault();
		if (!data || saving) return;

		if (!emailInput.trim()) {
			toast.error(t("diagnostic.errors.noEmail"));
			return;
		}

		await doSave(emailInput);
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
			toast.success(t("diagnostic.results.premiumReport.downloaded"));
		} catch (err) {
			console.error("Erreur téléchargement rapport premium:", err);
			const code = err.response?.data?.code;
			if (code === "SUBSCRIPTION_INACTIVE" || code === "SUBSCRIPTION_EXPIRED" || code === "PLAN_UPGRADE_REQUIRED") {
				toast.error(t("diagnostic.results.premiumReport.subscriptionRequired"));
			} else if (err.response?.status === 403) {
				toast.error(t("diagnostic.results.premiumReport.forbidden"));
			} else if (err.response?.status === 401) {
				toast.error(t("diagnostic.results.premiumReport.loginRequired"));
			} else {
				toast.error(t("diagnostic.results.premiumReport.downloadError"));
			}
		} finally {
			setDownloadingPremium(false);
		}
	};

	if (loading || !data) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center" role="status">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" aria-hidden="true" />
					<p className="font-text text-ubb-ink-muted">{t("diagnostic.loading.results")}</p>
				</div>
			</div>
		);
	}

	const { result, formData = {}, completedAt } = data;
	const { pillarScores, overallScore, overallLevel, recommendations, weakest } = result;

	// Utilise les niveaux spécifiques au secteur (ex: agriculture) si fournis, sinon les niveaux universels
	const getLevelInfo = (levelId) => {
		if (data.levels && Array.isArray(data.levels)) {
			const found = data.levels.find((l) => l.id === levelId);
			if (found) {
				return {
					id: found.id,
					color: found.color,
					label: found.label?.[language] || found.label?.fr || levelId,
					interpretation: found.interpretation?.[language] || found.interpretation?.fr || "",
				};
			}
		}
		return getLevelV2ById(levelId, language);
	};

	const overallLevelInfo = getLevelInfo(overallLevel);

	const dateLocale = language === "en" ? "en-US" : "fr-FR";
	const dateLabel = new Date(completedAt || Date.now()).toLocaleDateString(dateLocale, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	const findRecommendations = (pillarId) =>
		recommendations.find((r) => r.pillarId === pillarId)?.recommendations || [];

	// Risques = piliers Critique/Vulnérable ; points forts = piliers Stable et au-delà (même règle que le PDF)
	const isAtRisk = (pillar) => ["critique", "vulnerable"].includes(pillar.level);
	const byScoreAsc = [...pillarScores].sort((a, b) => a.score - b.score);
	const riskPillars = byScoreAsc.filter(isAtRisk).slice(0, 2);
	const hasRisks = riskPillars.length > 0;
	const focusPillars = hasRisks ? riskPillars : weakest;
	const strengthPillars = [...byScoreAsc].reverse().filter((pillar) => !isAtRisk(pillar)).slice(0, 2);

	const nextSteps = weakest
		.flatMap((pillar) =>
			findRecommendations(pillar.pillarId).map((text) => ({
				pillarName: pillar.pillarName,
				text,
			})),
		)
		.slice(0, 3);

	const premiumBenefits = t("diagnostic.results.premiumBenefits", { returnObjects: true });

	const pillarNumber = (pillarId) => pillarScores.findIndex((p) => p.pillarId === pillarId) + 1;
	const radarLabel = t("diagnostic.results.radarLabel", {
		details: pillarScores.map((p, i) => `${i + 1}. ${p.pillarName} ${p.score}/100`).join(", "),
	});

	const NumberBadge = ({ n }) => (
		<span
			className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ubb-brand-900 font-heading text-sm font-bold text-white"
			aria-hidden="true"
		>
			{n}
		</span>
	);

	return (
		<div className="min-h-screen bg-ubb-paper-soft">
			<SEOHead
				title={t("diagnostic.meta.resultsTitle")}
				description={t("diagnostic.meta.resultsDescription")}
				url="/diagnostic/resultats"
				noindex
			/>

			<Container className="max-w-5xl py-8 sm:py-12">
				{/* En-tête */}
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="min-w-0">
						<p className="font-text text-sm font-semibold text-ubb-ink-muted">
							{t("diagnostic.results.freeLabel")} · {dateLabel}
						</p>
						<h1 className="ubb-heading mt-1 break-words text-ubb-title">{formData.companyName}</h1>
					</div>
					<Button variant="outline" size="sm" onClick={handleNewAssessment}>
						<RotateCcw className="h-4 w-4" aria-hidden="true" />
						{t("diagnostic.results.redo")}
					</Button>
				</div>

				{/* Score global */}
				<section aria-labelledby="overall-title" className="ubb-card mt-8 p-6 sm:p-10">
					<div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
						<div className="text-center">
							<ScoreRing
								score={overallScore}
								color={overallLevelInfo.color}
								label={t("diagnostic.results.scoreLabel", { score: overallScore, level: overallLevelInfo.label })}
							/>
							<p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ubb-brand-900/15 bg-white px-4 py-1.5 font-text text-sm font-semibold text-ubb-ink">
								<span className="h-3 w-3 rounded-full" style={{ backgroundColor: overallLevelInfo.color }} aria-hidden="true" />
								{overallLevelInfo.label}
							</p>
						</div>
						<div>
							<h2 id="overall-title" className="ubb-heading text-ubb-subtitle">
								{t("diagnostic.results.overallTitle")}
							</h2>
							<p className="mt-3 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">
								{overallLevelInfo.interpretation}
							</p>
						</div>
					</div>

					<div className="mt-10 border-t border-ubb-brand-900/[0.08] pt-8">
						<h3 className="font-heading text-lg font-semibold text-ubb-ink">{t("diagnostic.results.pillarsTitle")}</h3>
						<div className="mt-6 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_1.2fr]">
							<PillarRadar
								label={radarLabel}
								pillars={pillarScores.map((p) => ({ score: p.score, color: getLevelInfo(p.level).color }))}
							/>
							<ul className="space-y-5">
								{pillarScores.map((pillar, index) => {
									const levelInfo = getLevelInfo(pillar.level);
									return (
										<li key={pillar.pillarId}>
											<div className="flex items-center gap-3">
												<NumberBadge n={index + 1} />
												<span className="min-w-0 flex-1 font-text text-ubb-body font-semibold text-ubb-ink">{pillar.pillarName}</span>
												<span className="font-heading text-lg font-bold text-ubb-ink">
													{pillar.score}
													<span className="font-text text-xs font-semibold text-ubb-ink-muted">/100</span>
												</span>
											</div>
											<div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ubb-brand-100" role="presentation">
												<motion.div
													className="h-full rounded-full"
													style={{ backgroundColor: levelInfo.color }}
													initial={reduceMotion ? false : { width: 0 }}
													animate={{ width: `${pillar.score}%` }}
													transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: "easeOut" }}
												/>
											</div>
											<p className="mt-1 pl-10 font-text text-xs text-ubb-ink-muted">{levelInfo.label}</p>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</section>

				{/* Axes de vigilance et points forts */}
				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<section aria-labelledby="risks-title" className="rounded-ubb-panel border border-ubb-accent-100 bg-ubb-accent-50 p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-white text-ubb-accent-ink">
								<TrendingDown className="h-5 w-5" aria-hidden="true" />
							</span>
							<h3 id="risks-title" className="ubb-heading text-xl font-semibold">
								{hasRisks ? t("diagnostic.results.risksTitle") : t("diagnostic.results.improvementTitle")}
							</h3>
						</div>
						<div className="mt-6 space-y-6">
							{focusPillars.map((pillar) => (
								<div key={pillar.pillarId}>
									<p className="flex items-center gap-2.5 font-text font-semibold text-ubb-ink">
										<NumberBadge n={pillarNumber(pillar.pillarId)} />
										<span className="min-w-0 flex-1">{pillar.pillarName}</span>
										<span className="font-heading">{pillar.score}/100</span>
									</p>
									<ul className="mt-3 space-y-2 pl-10">
										{findRecommendations(pillar.pillarId).map((rec, i) => (
											<li key={i} className="flex gap-2.5 font-text text-ubb-small text-ubb-ink">
												<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ubb-accent-ink" aria-hidden="true" />
												<span>{rec}</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</section>

					<section aria-labelledby="strengths-title" className="rounded-ubb-panel border border-ubb-brand-900/10 bg-ubb-brand-50 p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-white text-ubb-brand-900">
								<TrendingUp className="h-5 w-5" aria-hidden="true" />
							</span>
							<h3 id="strengths-title" className="ubb-heading text-xl font-semibold">
								{t("diagnostic.results.strengthsTitle")}
							</h3>
						</div>
						{strengthPillars.length === 0 ? (
							<p className="mt-6 font-text text-ubb-body text-ubb-ink-muted">{t("diagnostic.results.noStrengths")}</p>
						) : (
							<ul className="mt-6 space-y-4">
								{strengthPillars.map((pillar) => (
									<li key={pillar.pillarId} className="flex items-center gap-2.5 rounded-ubb-field bg-white p-4">
										<NumberBadge n={pillarNumber(pillar.pillarId)} />
										<span className="min-w-0 flex-1 font-text font-semibold text-ubb-ink">{pillar.pillarName}</span>
										<span className="font-heading text-2xl font-bold text-ubb-brand-900">{pillar.score}/100</span>
									</li>
								))}
							</ul>
						)}
					</section>
				</div>

				{/* Prochaines étapes */}
				{nextSteps.length > 0 && (
					<section aria-labelledby="steps-title" className="ubb-card mt-6 p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
								<ListChecks className="h-5 w-5" aria-hidden="true" />
							</span>
							<h3 id="steps-title" className="ubb-heading text-xl font-semibold">
								{t("diagnostic.results.nextStepsTitle")}
							</h3>
						</div>
						<ol className="mt-6 space-y-4">
							{nextSteps.map((step, index) => (
								<li key={index} className="flex items-start gap-4">
									<NumberBadge n={index + 1} />
									<span className="pt-0.5 font-text text-ubb-body text-ubb-ink">{step.text}</span>
								</li>
							))}
						</ol>
					</section>
				)}

				{/* Rapport par email / téléchargement */}
				{!saved && (
					<section aria-labelledby="report-title" className="ubb-card mt-6 p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
								<Mail className="h-5 w-5" aria-hidden="true" />
							</span>
							<h3 id="report-title" className="ubb-heading text-xl font-semibold">
								{t("diagnostic.results.emailSectionTitle")}
							</h3>
						</div>
						<p className="mt-3 max-w-ubb-prose font-text text-ubb-body text-ubb-ink-muted">
							{t("diagnostic.results.emailSectionSubtitle")}
						</p>

						{emailInput ? (
							<div className="mt-5">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
									<p className="flex min-h-[48px] min-w-0 flex-1 items-center gap-2 rounded-ubb-field bg-ubb-paper-soft px-4 font-text text-ubb-body font-medium text-ubb-ink">
										<Mail className="h-4 w-4 shrink-0 text-ubb-ink-muted" aria-hidden="true" />
										<span className="truncate">{emailInput}</span>
									</p>
									<Button onClick={handleSaveAndSend} disabled={saving}>
										{saving ? t("diagnostic.results.sending") : t("diagnostic.results.sendReportButton")}
									</Button>
								</div>
								<button
									type="button"
									onClick={() => setEmailInput("")}
									className="ubb-focus mt-1 inline-flex min-h-[44px] items-center rounded font-text text-sm font-semibold text-ubb-brand-900 underline underline-offset-4"
								>
									{t("diagnostic.results.otherEmail")}
								</button>
							</div>
						) : (
							<form onSubmit={handleSaveAndSend} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
								<div className="flex-1">
									<FormField id="results-email" label={t("diagnostic.intro.email")}>
										<input
											id="results-email"
											type="email"
											autoComplete="email"
											inputMode="email"
											value={emailInput}
											onChange={(e) => setEmailInput(e.target.value)}
											placeholder={t("diagnostic.results.emailPlaceholder")}
											className="ubb-input"
											required
										/>
									</FormField>
								</div>
								<Button type="submit" disabled={saving}>
									{saving ? t("diagnostic.results.sending") : t("diagnostic.results.sendReportButton")}
								</Button>
							</form>
						)}
					</section>
				)}

				{saved && savedAssessmentId && (
					<section aria-labelledby="ready-title" className="ubb-card mt-6 p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-ubb-brand-50 text-ubb-brand-900">
								<CheckCircle2 className="h-5 w-5" aria-hidden="true" />
							</span>
							<h3 id="ready-title" className="ubb-heading text-xl font-semibold">
								{t("diagnostic.results.reportReadyTitle")}
							</h3>
						</div>
						<p className="mt-3 max-w-ubb-prose font-text text-ubb-body text-ubb-ink-muted">
							{t("diagnostic.results.reportReadySubtitle")}
						</p>
						<Button variant="outline" onClick={handleDownload} disabled={downloading} className="mt-5">
							<Download className="h-4 w-4" aria-hidden="true" />
							{downloading ? t("diagnostic.results.downloading") : t("diagnostic.results.downloadButton")}
						</Button>
					</section>
				)}

				{/* Rapport premium (abonnés) */}
				{isPremiumUser && savedAssessmentId && (
					<section aria-labelledby="premium-report-title" className="mt-6 rounded-ubb-panel border-2 border-ubb-brand-900 bg-ubb-brand-50 p-6 sm:p-8">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-ubb-brand-900 text-ubb-accent-500">
								<Sparkles className="h-5 w-5" aria-hidden="true" />
							</span>
							<h3 id="premium-report-title" className="ubb-heading text-xl font-semibold">
								{t("diagnostic.results.premiumReport.title")}
							</h3>
						</div>
						<p className="mt-3 max-w-ubb-prose font-text text-ubb-body text-ubb-ink-muted">
							{t("diagnostic.results.premiumReport.description")}
						</p>
						<Button variant="secondary" onClick={handleDownloadPremium} disabled={downloadingPremium} className="mt-5">
							<Download className="h-4 w-4" aria-hidden="true" />
							{downloadingPremium ? t("diagnostic.results.premiumReport.generating") : t("diagnostic.results.premiumReport.download")}
						</Button>
					</section>
				)}

				{/* Passer au Premium (non abonnés) */}
				{!isPremiumUser && (
					<section aria-labelledby="premium-title" className="relative mt-6 overflow-hidden rounded-ubb-panel bg-ubb-brand-900 p-6 text-white sm:p-10">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgb(var(--ubb-brand-700)/0.8),transparent_70%)]"
						/>
						<div className="relative">
							<div className="flex items-center gap-3">
								<span className="flex h-10 w-10 items-center justify-center rounded-ubb-field bg-white/10 text-ubb-accent-500">
									<Star className="h-5 w-5" aria-hidden="true" />
								</span>
								<h3 id="premium-title" className="ubb-heading text-xl font-semibold text-white sm:text-2xl">
									{t("diagnostic.results.premiumTitle")}
								</h3>
							</div>
							<ul className="mt-6 grid gap-3 md:grid-cols-2">
								{Array.isArray(premiumBenefits) &&
									premiumBenefits.map((benefit, i) => (
										<li key={i} className="flex gap-3 font-text text-ubb-body text-ubb-brand-100">
											<Check className="mt-1 h-4 w-4 shrink-0 text-ubb-accent-500" strokeWidth={3} aria-hidden="true" />
											<span>{benefit}</span>
										</li>
									))}
							</ul>
							<Button onClick={handlePremiumUpgrade} className="mt-8 focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900">
								{t("diagnostic.results.premiumCta")}
							</Button>
						</div>
					</section>
				)}
			</Container>
		</div>
	);
};

export default SimplifiedResultsPage;
