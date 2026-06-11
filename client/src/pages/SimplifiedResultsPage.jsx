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
} from "lucide-react";
import toast from "react-hot-toast";
import { assessmentV2API } from "../services/api";
import { getLevelV2ById } from "../utils/colors";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";

const RESULT_STORAGE_KEY = "vitalcheck-v2-result";

const PREMIUM_BENEFITS = [
	"Diagnostic approfondi en 20 à 30 minutes sur l'ensemble de vos fonctions clés",
	"Analyse détaillée de chaque pilier avec benchmarks sectoriels",
	"Plan d'action priorisé sur 90 jours",
	"Rapport complet avec feuille de route de transformation",
	"Accompagnement par un expert vitalCHECK",
];

const rankPillars = (pillarScores) => {
	const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
	return {
		weakest: sorted.slice(0, 2),
		strongest: [...sorted].reverse().slice(0, 2),
	};
};

const SimplifiedResultsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const { scrollToTop } = useSmoothScroll();

	const [data, setData] = useState(location.state || null);
	const [loading, setLoading] = useState(!location.state);
	const [savedAssessmentId, setSavedAssessmentId] = useState(
		searchParams.get("assessmentId") || null,
	);
	const [saved, setSaved] = useState(!!searchParams.get("assessmentId"));
	const [emailInput, setEmailInput] = useState("");
	const [saving, setSaving] = useState(false);
	const [downloading, setDownloading] = useState(false);

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
							overallLevelLabel: getLevelV2ById(assessment.overallLevel).label,
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
						completedAt: assessment.completedAt,
					});
					setEmailInput(assessment.email || "");
				})
				.catch(() => {
					toast.error("Résultats introuvables");
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
			toast.error("Merci de renseigner votre email");
			return;
		}

		setSaving(true);
		try {
			const response = await assessmentV2API.saveAssessment({
				answers: data.answers,
				language: data.language || "fr",
				companyName: data.formData?.companyName,
				email: emailInput.trim(),
				companySize: data.formData?.companySize,
				sector: data.formData?.sector || undefined,
			});

			if (response.data.success) {
				setSavedAssessmentId(response.data.assessment.id);
				setSaved(true);
				toast.success(
					"Votre rapport PDF vous a été envoyé par email !",
				);
			}
		} catch (error) {
			console.error("Erreur de sauvegarde du diagnostic v2:", error);
			toast.error("Une erreur est survenue. Veuillez réessayer.");
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
			toast.error("Le rapport PDF n'est pas encore disponible.");
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

	if (loading || !data) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Chargement de vos résultats...</p>
				</div>
			</div>
		);
	}

	const { result, formData = {}, completedAt } = data;
	const { pillarScores, overallScore, overallLevel, recommendations, weakest, strongest } =
		result;

	const overallLevelInfo = getLevelV2ById(overallLevel);
	const dateLabel = new Date(completedAt || Date.now()).toLocaleDateString("fr-FR", {
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

	return (
		<div className="min-h-screen pb-[50px] bg-gray-50">
			<SEOHead
				title="Vos résultats - vitalCHECK"
				description="Découvrez votre score de santé organisationnelle et vos premières recommandations vitalCHECK."
				url="/diagnostic/resultats"
				noindex
			/>

			{/* Action Bar */}
			<div className="bg-white shadow-sm">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-wrap gap-2 items-center justify-between">
						<span className="text-lg font-bold text-gray-900">
							Vos résultats
						</span>
						<button
							onClick={handleNewAssessment}
							className="btn-outline flex items-center space-x-2"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Refaire le diagnostic</span>
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* ===== PAGE 1 : Calculate Your Readiness ===== */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="card"
				>
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-gray-900">
							{formData.companyName}
						</h1>
						<p className="text-sm text-gray-500">Diagnostic gratuit · {dateLabel}</p>
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
								Score global de santé organisationnelle
							</h2>
							<p className="text-gray-700 leading-relaxed">
								{overallLevelInfo.interpretation}
							</p>
						</div>
					</div>

					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Vos résultats par pilier
					</h3>
					<div className="space-y-4">
						{pillarScores.map((pillar) => {
							const levelInfo = getLevelV2ById(pillar.level);
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

				{/* ===== PAGE 2 : Strategic Reality ===== */}
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
								Vos axes de vigilance
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
								Vos points forts
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

				{/* Next Steps */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="card"
				>
					<div className="flex items-center space-x-2 mb-4">
						<ListChecks className="w-5 h-5 text-primary-500" />
						<h3 className="text-lg font-bold text-gray-900">
							Vos prochaines étapes
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

				{/* Save / send report */}
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
								Recevez votre rapport complet par email
							</h3>
						</div>
						<p className="text-gray-600 mb-4">
							Sauvegardez vos résultats et recevez un rapport PDF détaillé par
							email. Un compte vitalCHECK sera créé automatiquement pour
							retrouver vos résultats à tout moment.
						</p>
						<form onSubmit={handleSaveAndSend} className="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								value={emailInput}
								onChange={(e) => setEmailInput(e.target.value)}
								placeholder="vous@entreprise.com"
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
										<span>Recevoir mon rapport</span>
									</>
								)}
							</button>
						</form>
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
								Votre rapport est prêt
							</h3>
						</div>
						<p className="text-gray-600 mb-4">
							Votre rapport PDF a été envoyé par email. Vous pouvez également le
							télécharger directement.
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
									<span>Télécharger le rapport PDF</span>
								</>
							)}
						</button>
					</motion.div>
				)}

				{/* Premium CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
				>
					<div className="flex items-center space-x-2 mb-4">
						<Star className="w-6 h-6 text-purple-500" />
						<h3 className="text-xl font-bold text-gray-900">
							Allez plus loin avec le diagnostic Premium
						</h3>
					</div>
					<ul className="space-y-2 mb-6">
						{PREMIUM_BENEFITS.map((benefit, i) => (
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
						<span>Découvrir le diagnostic Premium</span>
					</button>
				</motion.div>
			</div>
		</div>
	);
};

export default SimplifiedResultsPage;
