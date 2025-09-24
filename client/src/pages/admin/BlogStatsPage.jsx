import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	BarChart2,
	Eye,
	Heart,
	FileText,
	TrendingUp,
	Users,
	Calendar,
	BarChart3,
} from "lucide-react";
import { adminBlogApiService } from "../../services/api";
import toast from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
import Chart from "chart.js/auto";

const BlogStatsPage = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const chartRef1 = useRef(null);
	const chartRef2 = useRef(null);
	const chartInstance1 = useRef(null);
	const chartInstance2 = useRef(null);

	useEffect(() => {
		loadStats();
		return () => {
			// Nettoyer les instances de graphiques
			if (chartInstance1.current) {
				chartInstance1.current.destroy();
			}
			if (chartInstance2.current) {
				chartInstance2.current.destroy();
			}
		};
	}, []);

	const loadStats = async () => {
		try {
			setLoading(true);
			console.log("Loading blog stats...");
			const response = await adminBlogApiService.getStats();
			console.log("Stats API response:", response);
			console.log("Stats data:", response.data);
			// La structure est {success: true, data: {...}}
			setStats(response.data.data);
		} catch (error) {
			console.error("Error loading stats:", error);
			console.error("Error details:", error.response?.data || error.message);
			toast.error(
				`Erreur lors du chargement des statistiques: ${
					error.response?.data?.message || error.message
				}`
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (stats && chartRef1.current && chartRef2.current) {
			// Détruire les graphiques existants
			if (chartInstance1.current) {
				chartInstance1.current.destroy();
			}
			if (chartInstance2.current) {
				chartInstance2.current.destroy();
			}

			// Graphique des types de blogs
			const ctx1 = chartRef1.current.getContext("2d");
			chartInstance1.current = new Chart(ctx1, {
				type: "doughnut",
				data: {
					labels: stats.byType
						? stats.byType.map((item) => {
								const typeLabels = {
									article: "Articles",
									"etude-cas": "Études de cas",
									tutoriel: "Tutoriels",
									actualite: "Actualités",
									temoignage: "Témoignages",
								};
								return typeLabels[item._id] || item._id;
						  })
						: [],
					datasets: [
						{
							data: stats.byType ? stats.byType.map((item) => item.count) : [],
							backgroundColor: [
								"#3B82F6", // Bleu
								"#10B981", // Vert
								"#F59E0B", // Orange
								"#EF4444", // Rouge
								"#8B5CF6", // Violet
							],
							borderWidth: 2,
							borderColor: "#fff",
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: "bottom",
						},
					},
				},
			});

			// Graphique des catégories
			const ctx2 = chartRef2.current.getContext("2d");
			chartInstance2.current = new Chart(ctx2, {
				type: "bar",
				data: {
					labels: stats.byCategory
						? stats.byCategory.map((item) => {
								const categoryLabels = {
									strategie: "Stratégie",
									technologie: "Technologie",
									finance: "Finance",
									"ressources-humaines": "RH",
									marketing: "Marketing",
									operations: "Opérations",
									gouvernance: "Gouvernance",
								};
								return categoryLabels[item._id] || item._id;
						  })
						: [],
					datasets: [
						{
							label: "Nombre de blogs",
							data: stats.byCategory
								? stats.byCategory.map((item) => item.count)
								: [],
							backgroundColor: "#3B82F6",
							borderColor: "#2563EB",
							borderWidth: 1,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false,
						},
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								stepSize: 1,
							},
						},
					},
				},
			});
		}
	}, [stats]);

	if (loading || !stats) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="max-w-7xl mx-auto pb-20 px-5 pt-5">
				<button
					onClick={() => navigate("/admin/blog")}
					className="p-2 flex text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
				>
					<span className="flex items-center"><ArrowLeft className="h-5 w-5 mr-2" /> </span>
					Retour
				</button>
				{/* Header */}
				<div className="flex flex-wrap items-center justify-between mb-6">
					<div className="flex items-center space-x-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Statistiques des blogs
							</h1>
							<p className="text-gray-600">
								Analyse des performances et de l'engagement
							</p>
						</div>
					</div>
					<div className="flex flex-wrap mx-auto space-x-3">
						<button
							onClick={() => navigate("/admin/blog/analytics")}
							className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
						>
							<BarChart3 className="h-4 w-4 mr-2" />
							Analytics détaillées
						</button>
					</div>
				</div>

				{/* Statistiques générales */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 md:p-6">
						<div className="flex items-center">
							<div className="p-2 bg-blue-100 rounded-lg">
								<FileText className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Total des blogs
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.total}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<TrendingUp className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Publiés</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.published}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<Calendar className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">Brouillons</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.draft}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Eye className="h-6 w-6 text-purple-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Vues totales
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalViews}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Graphiques */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Graphique des types */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Répartition par type
						</h3>
						<div className="h-64">
							<canvas ref={chartRef1}></canvas>
						</div>
					</div>

					{/* Graphique des catégories */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Répartition par catégorie
						</h3>
						<div className="h-64">
							<canvas ref={chartRef2}></canvas>
						</div>
					</div>
				</div>

				{/* Détails des statistiques */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Types de blogs */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Détail par type
						</h3>
						<div className="space-y-3">
							{stats.byType &&
								stats.byType.map((item, index) => {
									const typeLabels = {
										article: "Articles",
										"etude-cas": "Études de cas",
										tutoriel: "Tutoriels",
										actualite: "Actualités",
										temoignage: "Témoignages",
									};
									const colors = [
										"#3B82F6",
										"#10B981",
										"#F59E0B",
										"#EF4444",
										"#8B5CF6",
									];
									return (
										<div
											key={item._id}
											className="flex items-center justify-between"
										>
											<div className="flex items-center">
												<div
													className="w-3 h-3 rounded-full mr-3"
													style={{
														backgroundColor: colors[index % colors.length],
													}}
												></div>
												<span className="text-sm font-medium text-gray-700">
													{typeLabels[item._id] || item._id}
												</span>
											</div>
											<span className="text-sm font-bold text-gray-900">
												{item.count}
											</span>
										</div>
									);
								})}
						</div>
					</div>

					{/* Catégories */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Détail par catégorie
						</h3>
						<div className="space-y-3">
							{stats.byCategory &&
								stats.byCategory.map((item, index) => {
									const categoryLabels = {
										strategie: "Stratégie",
										technologie: "Technologie",
										finance: "Finance",
										"ressources-humaines": "Ressources Humaines",
										marketing: "Marketing",
										operations: "Opérations",
										gouvernance: "Gouvernance",
									};
									return (
										<div
											key={item._id}
											className="flex items-center justify-between"
										>
											<span className="text-sm font-medium text-gray-700">
												{categoryLabels[item._id] || item._id}
											</span>
											<span className="text-sm font-bold text-gray-900">
												{item.count}
											</span>
										</div>
									);
								})}
						</div>
					</div>
				</div>

				{/* Engagement */}
				<div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">Engagement</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex items-center">
							<div className="p-3 bg-blue-100 rounded-lg">
								<Eye className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Vues totales
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalViews}
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<div className="p-3 bg-red-100 rounded-lg">
								<Heart className="h-6 w-6 text-red-600" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600">
									Likes totaux
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.totalLikes}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default BlogStatsPage;
