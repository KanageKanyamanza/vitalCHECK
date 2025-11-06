import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	LayoutDashboard,
	FileText,
	Download,
	TrendingUp,
	Calendar,
	CreditCard,
	User,
	LogOut,
	Settings,
	Plus,
} from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import { useAssessment } from "../../context/AssessmentContext";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ClientDashboardPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user, logout, loading: authLoading } = useClientAuth();
	const { dispatch: assessmentDispatch } = useAssessment();

	const [assessments, setAssessments] = useState([]);
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'active', 'completed'
	const [downloadingReport, setDownloadingReport] = useState(null); // Track which report is downloading

	// Filtrer les paiements selon le filtre sélectionné
	const filteredPayments = payments.filter((payment) => {
		if (paymentFilter === "all") return true;
		if (paymentFilter === "active") return payment.status === "pending";
		if (paymentFilter === "completed")
			return payment.status === "completed" || payment.status === "processed";
		return true;
	});

	// Calculer les statistiques des paiements
	const paymentStats = {
		total: payments.length,
		active: payments.filter((p) => p.status === "pending").length,
		completed: payments.filter(
			(p) => p.status === "completed" || p.status === "processed"
		).length,
		failed: payments.filter((p) => p.status === "failed").length,
		totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
	};

	useEffect(() => {
		if (!authLoading && !user) {
			navigate("/login");
		} else if (user) {
			loadDashboardData();
		}
	}, [user, authLoading, navigate]);

	const loadDashboardData = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("clientToken");

			// Vérifier que user.id existe
			if (!user?.id) {
				console.error("User ID is undefined:", user);
				toast.error("Erreur: ID utilisateur manquant");
				return;
			}

			// Load assessments
			const assessmentsResponse = await axios.get(
				`${API_URL}/assessments/user/${user.id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setAssessments(assessmentsResponse.data.assessments || []);

			// Load payments
			const paymentsResponse = await axios.get(
				`${API_URL}/client-auth/payments`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setPayments(paymentsResponse.data.payments || []);
		} catch (error) {
			console.error("Error loading dashboard data:", error);
			toast.error("Erreur lors du chargement des données");
		} finally {
			setLoading(false);
		}
	};

	const getSubscriptionBadge = () => {
		const plan = user?.subscription?.plan || "free";
		const badges = {
			free: { bg: "bg-gray-100", text: "text-gray-800", label: "GRATUIT" },
			standard: { bg: "bg-blue-100", text: "text-blue-800", label: "STANDARD" },
			premium: {
				bg: "bg-purple-100",
				text: "text-purple-800",
				label: "PREMIUM",
			},
			diagnostic: {
				bg: "bg-yellow-100",
				text: "text-yellow-800",
				label: "DIAGNOSTIC",
			},
		};
		return badges[plan];
	};

	const handleNewAssessment = () => {
		// Nettoyer le contexte d'évaluation avant de commencer une nouvelle évaluation
		assessmentDispatch({ type: "CLEAR_STORAGE" });
		navigate("/");
	};

	const handleDownloadReport = async (assessmentId) => {
		setDownloadingReport(assessmentId);
		try {
			const token = localStorage.getItem('clientToken');
			const response = await axios.get(`${API_URL}/reports/download/${assessmentId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				},
				responseType: 'blob'
			});

			// Créer un blob URL et déclencher le téléchargement
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			
			// Générer un nom de fichier avec la date
			const date = new Date().toISOString().split('T')[0];
			link.download = `vitalCHECK-Report-${date}.pdf`;
			
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
			
			toast.success('Rapport téléchargé avec succès !');
		} catch (error) {
			console.error('Erreur lors du téléchargement:', error);
			toast.error('Erreur lors du téléchargement du rapport');
		} finally {
			setDownloadingReport(null);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	const badge = getSubscriptionBadge();

	return (
		<div className="min-h-screen bg-gray-50 py-[60px]">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-wrap gap-2 justify-between items-center">
						<div className="flex flex-wrap sm:grid gap-2">
							<h1 className="text-2xl font-bold text-gray-900">
								{t("clientDashboard.welcome")},{" "}
								{user?.firstName || user?.companyName}!
							</h1>
							<div className="flex items-center sm:hidden float-right ml-auto">
								<button
									onClick={() => navigate("/client/profile")}
									className="flex items-center py-2 px-1 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<Settings className="w-4 h-4 mr-2" />
									<span className="hidden md:inline">
										{t("clientDashboard.settings")}
									</span>
								</button>
								<button
									onClick={logout}
									className="flex items-center py-2 px-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								>
									<LogOut className="w-4 h-4 mr-2" />
									<span className="hidden md:inline">
										{t("clientDashboard.logout")}
									</span>
								</button>
							</div>
							<p className="text-sm text-gray-600">{user?.email}</p>
						</div>
						<div className="hidden sm:flex items-center gap-3">
							<button
								onClick={() => navigate("/client/profile")}
								className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<Settings className="w-4 h-4 mr-2" />
								<span className="hidden md:inline">
									{t("clientDashboard.settings")}
								</span>
							</button>
							<button
								onClick={logout}
								className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							>
								<LogOut className="w-4 h-4 mr-2" />
								<span className="hidden md:inline">
									{t("clientDashboard.logout")}
								</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{/* Subscription Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-lg shadow p-6"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center">
								<CreditCard className="w-8 h-8 text-primary-600 mr-3" />
								<h3 className="font-semibold text-gray-900">
									{t("clientDashboard.subscription.title")}
								</h3>
							</div>
						</div>
						<div className="space-y-2">
							<div
								className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
							>
								{badge.label}
							</div>
							<p className="text-sm text-gray-600">
								{user?.subscription?.status === "active"
									? t("clientDashboard.subscription.active")
									: t("clientDashboard.subscription.inactive")}
							</p>
							{user?.subscription?.plan !== "free" && (
								<button
									onClick={() => navigate("/pricing")}
									className="text-sm text-primary-600 hover:text-primary-700 font-medium"
								>
									{t("clientDashboard.subscription.manage")} →
								</button>
							)}
						</div>
					</motion.div>

					{/* Assessments Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-lg shadow p-6"
					>
						<div className="flex items-center mb-4">
							<FileText className="w-8 h-8 text-blue-600 mr-3" />
							<h3 className="font-semibold text-gray-900">
								{t("clientDashboard.assessments.title")}
							</h3>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-gray-900">
								{assessments.length}
							</div>
							<p className="text-sm text-gray-600">
								{t("clientDashboard.assessments.total")}
							</p>
							<button
								onClick={handleNewAssessment}
								className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
							>
								<Plus className="w-4 h-4 mr-1" />
								{t("clientDashboard.assessments.new")}
							</button>
						</div>
					</motion.div>

					{/* Payments Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white rounded-lg shadow p-6"
					>
						<div className="flex items-center mb-4">
							<TrendingUp className="w-8 h-8 text-green-600 mr-3" />
							<h3 className="font-semibold text-gray-900">
								{t("clientDashboard.payments.title")}
							</h3>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-gray-900">
								{payments.length}
							</div>
							<p className="text-sm text-gray-600">
								{t("clientDashboard.payments.total")}
							</p>
						</div>
					</motion.div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Assessments History */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-lg shadow mb-8"
					>
						<div className="p-6 border-b border-gray-200">
							<h2 className="text-xl font-bold text-gray-900 flex items-center">
								<FileText className="w-6 h-6 mr-2 text-primary-600" />
								{t("clientDashboard.history.title")}
							</h2>
						</div>
						<div className="p-6">
							{assessments.length === 0 ? (
								<div className="text-center py-12">
									<FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
									<p className="text-gray-500 mb-4">
										{t("clientDashboard.history.noAssessments")}
									</p>
									<button
										onClick={handleNewAssessment}
										className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
									>
										{t("clientDashboard.history.startFirst")}
									</button>
								</div>
							) : (
								<div className="space-y-4">
									{assessments.map((assessment) => (
										<div
											key={assessment._id}
											className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
										>
											<div className="flex flex-wrap md:flex-row md:items-center md:justify-between gap-4">
												<div className="flex-1">
													<h3 className="font-semibold text-gray-900 mb-2">
														{t("clientDashboard.history.evaluation")} -{" "}
														{new Date(
															assessment.completedAt || assessment.startedAt
														).toLocaleDateString("fr-FR")}
													</h3>
													<div className="flex flex-wrap gap-3 text-sm">
														<span className="text-gray-600">
															<Calendar className="w-4 h-4 inline mr-1" />
															{new Date(
																assessment.completedAt || assessment.startedAt
															).toLocaleDateString("fr-FR")}
														</span>
														<span className="font-semibold text-primary-600">
															{t("clientDashboard.history.score")}:{" "}
															{assessment.overallScore?.toFixed(0) || "N/A"}/100
														</span>
													</div>
												</div>
												<div className="grid gap-2 mx-auto">
													<button
														onClick={() =>
															navigate(`/results?id=${assessment._id}`)
														}
														className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm"
													>
														<FileText className="w-4 h-4 mr-2" />
														{t("clientDashboard.history.viewReport")}
													</button>
													<button
														onClick={() => handleDownloadReport(assessment._id)}
														disabled={downloadingReport === assessment._id}
														className="flex items-center px-4 py-2 text-green-600 border border-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
													>
														{downloadingReport === assessment._id ? (
															<>
																<div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
																{t("clientDashboard.history.downloading")}
															</>
														) : (
															<>
																<Download className="w-4 h-4 mr-2" />
																{t("clientDashboard.history.downloadPDF")}
															</>
														)}
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</motion.div>

					{/* Payments History */}
					{payments.length > 0 ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="bg-white rounded-lg shadow"
						>
							<div className="p-6 border-b border-gray-200">
								<div className="flex flex-wrap sm:flex-row sm:items-center sm:justify-between gap-4">
									<h2 className="text-xl font-bold text-gray-900 flex items-center whitespace-nowrap">
										<CreditCard className="w-6 h-6  mr-2 text-green-600" />
										{t("clientDashboard.paymentsHistory.title")}
									</h2>

									{/* Filtres des paiements */}
									<div className="flex gap-2">
										<button
											onClick={() => setPaymentFilter("all")}
											className={`px-3 whitespace-nowrap py-1 text-sm rounded-full transition-colors ${
												paymentFilter === "all"
													? "bg-blue-100 text-blue-800"
													: "bg-gray-100 text-gray-600 hover:bg-gray-200"
											}`}
										>
											{t("clientDashboard.paymentsHistory.all")} (
											{paymentStats.total})
										</button>
										<button
											onClick={() => setPaymentFilter("active")}
											className={`px-3 whitespace-nowrap py-1 text-sm rounded-full transition-colors ${
												paymentFilter === "active"
													? "bg-yellow-100 text-yellow-800"
													: "bg-gray-100 text-gray-600 hover:bg-gray-200"
											}`}
										>
											{t("clientDashboard.paymentsHistory.active")} (
											{paymentStats.active})
										</button>
										<button
											onClick={() => setPaymentFilter("completed")}
											className={`px-3 whitespace-nowrap py-1 text-sm rounded-full transition-colors ${
												paymentFilter === "completed"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-600 hover:bg-gray-200"
											}`}
										>
											{t("clientDashboard.paymentsHistory.completed")} (
											{paymentStats.completed})
										</button>
									</div>
								</div>

								{/* Statistiques des paiements */}
								<div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
									<div className="bg-blue-50 p-3 rounded-lg">
										<div className="text-sm text-blue-600 font-medium">
											{t("clientDashboard.paymentsHistory.stats.total")}
										</div>
										<div className="text-lg font-bold text-blue-900">
											{paymentStats.total}
										</div>
									</div>
									<div className="bg-yellow-50 p-3 rounded-lg">
										<div className="text-sm text-yellow-600 font-medium">
											{t("clientDashboard.paymentsHistory.stats.active")}
										</div>
										<div className="text-lg font-bold text-yellow-900">
											{paymentStats.active}
										</div>
									</div>
									<div className="bg-green-50 p-3 rounded-lg">
										<div className="text-sm text-green-600 font-medium">
											{t("clientDashboard.paymentsHistory.stats.completed")}
										</div>
										<div className="text-lg font-bold text-green-900">
											{paymentStats.completed}
										</div>
									</div>
									<div className="bg-purple-50 p-3 rounded-lg">
										<div className="text-sm text-purple-600 font-medium">
											{t("clientDashboard.paymentsHistory.stats.totalAmount")}
										</div>
										<div className="text-lg font-bold text-purple-900">
											${paymentStats.totalAmount}
										</div>
									</div>
								</div>
							</div>
							<div className="p-6">
								<div className="overflow-x-auto">
									<table className="min-w-full">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													{t("clientDashboard.paymentsHistory.date")}
												</th>
												<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													{t("clientDashboard.paymentsHistory.plan")}
												</th>
												<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													{t("clientDashboard.paymentsHistory.amount")}
												</th>
												<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													{t("clientDashboard.paymentsHistory.status")}
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{filteredPayments.length > 0 ? (
												filteredPayments.map((payment) => (
													<tr key={payment._id} className="hover:bg-gray-50">
														<td className="px-4 py-3 text-sm text-gray-900">
															{new Date(payment.createdAt).toLocaleDateString(
																"fr-FR"
															)}
														</td>
														<td className="px-4 py-3 text-sm font-medium text-gray-900">
															{payment.planName}
														</td>
														<td className="px-4 py-3 text-sm text-gray-900">
															${payment.amount} {payment.currency}
														</td>
														<td className="px-4 py-3">
															<span
																className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																	payment.status === "completed" ||
																	payment.status === "processed"
																		? "bg-green-100 text-green-800"
																		: payment.status === "pending"
																		? "bg-yellow-100 text-yellow-800"
																		: "bg-red-100 text-red-800"
																}`}
															>
																{payment.status === "completed" ||
																payment.status === "processed"
																	? t(
																			"clientDashboard.paymentsHistory.completed"
																	  )
																	: payment.status === "pending"
																	? t("clientDashboard.paymentsHistory.pending")
																	: t("clientDashboard.paymentsHistory.failed")}
															</span>
														</td>
													</tr>
												))
											) : (
												<tr>
													<td
														colSpan="4"
														className="px-4 py-8 text-center text-gray-500"
													>
														{t("clientDashboard.paymentsHistory.noPayments")}
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="bg-white rounded-lg shadow"
						>
							<div className="p-6 text-center">
								<CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Aucun paiement
								</h3>
								<p className="text-gray-600 mb-4">
									Vous n'avez pas encore effectué de paiement.
								</p>
								<button
									onClick={() => navigate("/pricing")}
									className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
								>
									Voir nos offres
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</main>
		</div>
	);
};

export default ClientDashboardPage;
