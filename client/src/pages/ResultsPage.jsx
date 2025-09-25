import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	Download,
	Mail,
	ArrowLeft,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
	Star,
	Users,
	Target,
} from "lucide-react";
import { useAssessment } from "../context/AssessmentContext";
import { reportsAPI } from "../services/api";
import toast from "react-hot-toast";
import { ScoreGauge, PillarChart, RecommendationsList } from "../components/ui";
import {
	ReportGenerationProgress,
	ReportSuccessModal,
} from "../components/assessment";
import { BackToTop } from "../components/navigation";
import useSmoothScroll from "../hooks/useSmoothScroll";
import {
	generateClientPDF,
	generateSimpleClientPDF,
} from "../utils/pdfGeneratorClient";

const ResultsPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { user, assessment, dispatch } = useAssessment();
	const { scrollToTop, scrollToElement } = useSmoothScroll();
	const [generatingReport, setGeneratingReport] = useState(false);
	const [reportGenerated, setReportGenerated] = useState(false);
	const [reportError, setReportError] = useState(null);
	const [showConsultationModal, setShowConsultationModal] = useState(false);
	const [downloadingReport, setDownloadingReport] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	useEffect(() => {
		if (!assessment) {
			navigate("/");
			return;
		}

		// Scroll smooth vers le haut quand la page se charge
		setTimeout(() => {
			scrollToTop(600);
		}, 100);
	}, [assessment, navigate, scrollToTop]);

	const handleGenerateReport = async () => {
		console.log('🚀 [FRONTEND] Début de la génération de rapport...', {
			assessmentId: assessment.id,
			userEmail: user.email,
			companyName: user.companyName,
			language: assessment.language
		});

		setGeneratingReport(true);
		setReportError(null);

		try {
			// Simuler les étapes de génération
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Essayer d'abord la génération côté serveur
			try {
				console.log('📡 [FRONTEND] Appel API serveur pour génération PDF...', {
					assessmentId: assessment.id,
					apiUrl: `/reports/generate/${assessment.id}`
				});

				const response = await reportsAPI.generateReport(assessment.id);

				console.log('✅ [FRONTEND] Réponse serveur reçue:', {
					success: response.data.success,
					message: response.data.message,
					assessmentId: response.data.assessmentId
				});

				if (response.data.success) {
					setReportGenerated(true);
					setShowSuccessModal(true);
					console.log('🎉 [FRONTEND] Rapport généré avec succès côté serveur');
					return;
				}
			} catch (serverError) {
				console.error('❌ [FRONTEND] Erreur génération serveur:', {
					error: serverError.message,
					status: serverError.response?.status,
					data: serverError.response?.data,
					assessmentId: assessment.id
				});

				// Fallback: génération côté client
				console.log('🔄 [FRONTEND] Fallback vers génération côté client...');
				try {
					// Créer un objet assessment complet avec les données utilisateur
					const fullAssessment = {
						...assessment,
						user: user,
					};
					
					console.log('📄 [FRONTEND] Génération PDF côté client...', {
						companyName: user.companyName,
						overallScore: assessment.overallScore
					});
					
					await generateClientPDF(fullAssessment);
					setReportGenerated(true);
					setShowSuccessModal(true);
					toast.success("Rapport PDF généré avec succès !");
					console.log('✅ [FRONTEND] PDF côté client généré avec succès');
					return;
				} catch (clientError) {
					console.error('❌ [FRONTEND] Erreur génération PDF côté client:', {
						error: clientError.message,
						companyName: user.companyName
					});

					// Dernier recours: PDF simple
					console.log('🔄 [FRONTEND] Dernier recours: PDF simple...');
					const fullAssessment = {
						...assessment,
						user: user,
					};
					await generateSimpleClientPDF(fullAssessment);
					setReportGenerated(true);
					setShowSuccessModal(true);
					toast.success("Rapport PDF simple généré avec succès !");
					console.log('✅ [FRONTEND] PDF simple généré avec succès');
					return;
				}
			}
		} catch (error) {
			console.error("❌ [FRONTEND] Erreur finale génération rapport:", {
				error: error.message,
				assessmentId: assessment.id,
				userEmail: user.email,
				companyName: user.companyName
			});
			setReportError({
				message: "Impossible de générer le rapport PDF. Veuillez réessayer.",
			});
			toast.error("Erreur lors de la génération du rapport");
		} finally {
			setGeneratingReport(false);
			console.log('🏁 [FRONTEND] Génération de rapport terminée');
		}
	};

	const handleRetryReport = () => {
		setReportError(null);
		handleGenerateReport();
	};

	const handlePremiumUpgrade = () => {
		navigate('/contact');
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleGoHome = () => {
		// Effacer le localStorage et rediriger vers l'accueil
		dispatch({ type: "CLEAR_STORAGE" });
		navigate("/");
	};

	const handleCloseSuccessModal = () => {
		setShowSuccessModal(false);
	};

	const handleDownloadReport = async () => {
		setDownloadingReport(true);
		try {
			const response = await reportsAPI.downloadReport(assessment.id);

			// Create blob and download
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `UBB-Health-Check-${user?.companyName}-${
				new Date().toISOString().split("T")[0]
			}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast.success(t("results.downloadSuccess"));
			// Clear localStorage after successful download
			dispatch({ type: "CLEAR_STORAGE" });
		} catch (error) {
			console.error("Download error:", error);
			toast.error(t("results.downloadError"));
		} finally {
			setDownloadingReport(false);
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "green":
				return <CheckCircle className="w-5 h-5 text-success-500" />;
			case "amber":
				return <AlertTriangle className="w-5 h-5 text-warning-500" />;
			case "red":
				return <AlertTriangle className="w-5 h-5 text-danger-500" />;
			default:
				return <AlertTriangle className="w-5 h-5 text-gray-500" />;
		}
	};

	const getStatusText = (status) => {
		if (!t || typeof t !== "function") {
			return status === "green"
				? "Green Zone"
				: status === "amber"
				? "Amber Zone"
				: status === "red"
				? "Red Zone"
				: "Unknown";
		}

		try {
			switch (status) {
				case "green":
					return t("results.zones.green") || "Green Zone";
				case "amber":
					return t("results.zones.amber") || "Amber Zone";
				case "red":
					return t("results.zones.red") || "Red Zone";
				default:
					return "Unknown";
			}
		} catch (error) {
			console.warn("Translation error:", error);
			return status === "green"
				? "Green Zone"
				: status === "amber"
				? "Amber Zone"
				: status === "red"
				? "Red Zone"
				: "Unknown";
		}
	};

	const getOverallMessage = () => {
		switch (assessment.overallStatus) {
			case "green":
				return t("results.scoreMessages.excellent");
			case "amber":
				return t("results.scoreMessages.developing");
			case "red":
				return t("results.scoreMessages.critical");
			default:
				return t("common.loading");
		}
	};

	if (!assessment) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">Aucune évaluation trouvée</p>
					<button onClick={() => navigate("/")} className="btn-primary">
						Retour à l'accueil
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-[70px] bg-gray-50">
			{/* Report Generation Progress Modal */}
			<ReportGenerationProgress
				isGenerating={generatingReport}
				error={reportError}
				onRetry={handleRetryReport}
			/>

			{/* Action Bar */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-wrap gap-2 items-center justify-between">
						<div className="flex items-center space-x-3">
							<span className="text-lg font-bold text-gray-900">
								{t("results.title")}
							</span>
						</div>
						<button
							onClick={() => navigate("/")}
							className="btn-outline flex items-center space-x-2 mx-auto sm:mx-0"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>{t("results.newAssessment")}</span>
						</button>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Company Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="card mb-8"
				>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						{user?.companyName}
					</h1>
					<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-gray-600">
						<span>
							{t("results.sector") || "Secteur"}:{" "}
							{t(`landing.sectors.${user?.sector}`) || user?.sector}
						</span>
						<span className="sm:block hidden">•</span>
						<span>
							{t("results.size") || "Taille"}:{" "}
							{t(`landing.sizes.${user?.companySize}`) || user?.companySize}
						</span>
						<span className="sm:block hidden">•</span>
						<span>
							{t("results.date") || "Date"}:{" "}
							{new Date(assessment.completedAt).toLocaleDateString()}
						</span>
					</div>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Score */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="lg:col-span-1"
					>
						<div className="rounded-lg p-4 bg-white shadow-lg border text-center">
							<h2 className="text-xl font-bold text-gray-900 mb-6">
								{t("results.overallScore")}
							</h2>

							<ScoreGauge
								score={assessment.overallScore}
								status={assessment.overallStatus}
							/>

							<div className="mt-6">
								<div className="flex items-center justify-center space-x-2 mb-3">
									{getStatusIcon(assessment.overallStatus)}
									<span className="font-semibold text-gray-900">
										{getStatusText(assessment.overallStatus)}
									</span>
								</div>
								<p className="text-gray-600 text-sm">{getOverallMessage()}</p>
							</div>
						</div>
					</motion.div>

					{/* Chart and Details */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="lg:col-span-2 space-y-8"
					>
						{/* Pillar Chart */}
						<div className="rounded-lg p-4 bg-white shadow-lg border">
							<h3 className="text-xl font-bold text-gray-900 mb-6">
								{t("results.pillarResults")}
							</h3>
							<PillarChart pillarScores={assessment.pillarScores} />
						</div>
					</motion.div>

					{/* Pillar Details */}
					<div className="lg:col-span-3 rounded-lg p-4 bg-white shadow-lg border w-full">
						<h3 className="text-xl font-bold text-gray-900 mb-6">
							{t("results.pillarDetails")}
						</h3>
						<div className="sm:space-y-4 space-y-2">
							{assessment.pillarScores.map((pillar, index) => (
								<div
									key={index}
									className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center space-x-3 mb-2 sm:mb-0">
										{getStatusIcon(pillar.status)}
										<span className="font-medium text-gray-900">
											{pillar.pillarName}
										</span>
									</div>
									<div className="flex items-center space-x-3">
										<span className="text-2xl font-bold text-gray-900">
											{pillar.score}
										</span>
										<span className="text-sm text-gray-500">/100</span>
										<span
											className={`status-badge status-${pillar.status}`}
											style={{
												backgroundColor:
													pillar.status === "red"
														? "#EF4444"
														: pillar.status === "amber"
														? "#F59E0B"
														: pillar.status === "green"
														? "#10B981"
														: "#6B7280",
												color: "white",
											}}
										>
											{getStatusText(pillar.status)}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Recommendations */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="mt-8"
				>
					<RecommendationsList pillarScores={assessment.pillarScores} />
				</motion.div>

				{/* Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="mt-8"
				>
					<div className="card">
						<h3 className="text-xl font-bold text-gray-900 mb-6">
							{t("results.nextSteps")}
						</h3>

						<div className="grid md:grid-cols-2 gap-6">
							{/* Free Report */}
							<div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
								<div className="flex items-center space-x-3 mb-4">
									<Download className="w-6 h-6 text-primary-500" />
									<h4 className="text-lg font-semibold text-gray-900">
										{t("results.freeReport")}
									</h4>
								</div>
								<p className="text-gray-600 mb-4">
									{t("results.freeReportDesc")}
								</p>
								<div className="space-y-3">
									<button
										onClick={handleGenerateReport}
										disabled={generatingReport || reportGenerated}
										className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
									>
										{generatingReport ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										) : reportGenerated ? (
											<>
												<CheckCircle className="w-4 h-4" />
												<span>{t("results.reportSent")}</span>
											</>
										) : (
											<>
												<Mail className="w-4 h-4" />
												<span>{t("results.generateReportBtn")}</span>
											</>
										)}
									</button>

									{reportGenerated && (
										<button
											onClick={handleDownloadReport}
											disabled={downloadingReport}
											className="btn-outline w-full flex items-center justify-center space-x-2 disabled:opacity-50"
										>
											{downloadingReport ? (
												<div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
											) : (
												<>
													<Download className="w-4 h-4" />
													<span>{t("results.downloadReport")}</span>
												</>
											)}
										</button>
									)}
								</div>
							</div>

							{/* Premium Upgrade */}
							<div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
								<div className="flex items-center space-x-3 mb-4">
									<Star className="w-6 h-6 text-purple-500" />
									<h4 className="text-lg font-semibold text-gray-900">
										{t("results.premiumReport")}
									</h4>
								</div>
								<p className="text-gray-600 mb-4">
									{t("results.premiumReportDesc")}
								</p>
								<button
									onClick={handlePremiumUpgrade}
									className="btn-secondary w-full flex items-center justify-center space-x-2"
								>
									<Target className="w-4 h-4" />
									<span>{t("results.unlockPremium")}</span>
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Consultation Modal */}
			{showConsultationModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold text-gray-900">
								{t("results.consultationModal.title")}
							</h3>
							<button
								onClick={() => setShowConsultationModal(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="space-y-4">
							<p className="text-gray-600">
								{t("results.consultationModal.unlockText")}
							</p>
							<ul className="space-y-2 text-sm text-gray-600">
								<li className="flex items-center space-x-2">
									<CheckCircle className="w-4 h-4 text-green-500" />
									<span>
										{t("results.consultationModal.features.detailedAnalysis")}
									</span>
								</li>
								<li className="flex items-center space-x-2">
									<CheckCircle className="w-4 h-4 text-green-500" />
									<span>
										{t("results.consultationModal.features.sectorBenchmarking")}
									</span>
								</li>
								<li className="flex items-center space-x-2">
									<CheckCircle className="w-4 h-4 text-green-500" />
									<span>
										{t("results.consultationModal.features.actionPlan")}
									</span>
								</li>
								<li className="flex items-center space-x-2">
									<CheckCircle className="w-4 h-4 text-green-500" />
									<span>
										{t("results.consultationModal.features.expertConsultation")}
									</span>
								</li>
							</ul>

							<div className="pt-4">
								<p className="text-sm text-gray-500 mb-4">
									{t("results.consultationModal.contactText")}
								</p>
								<div className="flex space-x-3">
									<button
										onClick={() => setShowConsultationModal(false)}
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
									>
										{t("results.consultationModal.close")}
									</button>
									<button
										onClick={() => {
											navigate('/contact');
											window.scrollTo({ top: 0, behavior: 'smooth' });
											setShowConsultationModal(false);
										}}
										className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
									>
										{t("results.consultationModal.contactUs")}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Modal de succès après génération du rapport */}
			<ReportSuccessModal
				isOpen={showSuccessModal}
				onClose={handleCloseSuccessModal}
				onGoHome={handleGoHome}
				onUpgradePremium={handlePremiumUpgrade}
				userEmail={user?.email}
			/>

			{/* Bouton Back to Top */}
			<BackToTop showAfter={300} />
		</div>
	);
};

export default ResultsPage;
