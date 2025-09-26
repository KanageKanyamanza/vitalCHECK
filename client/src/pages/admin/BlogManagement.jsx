import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	Plus,
	Edit,
	Trash2,
	Eye,
	EyeOff,
	Search,
	Filter,
	Calendar,
	User,
	Tag,
	BarChart3,
	FileText,
	BookOpen,
	Users,
	TrendingUp,
	Clock,
} from "lucide-react";
import { useAdminApi } from "../../hooks/useAdminApi";
import toast from "react-hot-toast";
import AdminLayout from "../../components/admin/AdminLayout";
// Les modales sont remplacées par des pages dédiées

const BlogManagement = () => {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const { loading, error, getBlogs, deleteBlog, updateBlog } = useAdminApi();

	const [blogs, setBlogs] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	// Les modales sont remplacées par des pages dédiées

	// Charger les blogs
	const loadBlogs = async () => {
		try {
			const data = await getBlogs({ page: 1, limit: 20 });
			setBlogs(data.data || []);
		} catch (err) {
			console.error("Error loading blogs:", err);
		}
	};

	// Obtenir le contenu localisé d'un blog
	const getLocalizedContent = (content, fallback = '') => {
		if (!content) return fallback;
		
		// Si c'est déjà une chaîne (ancien format), la retourner
		if (typeof content === 'string') return content;
		
		// Si c'est un objet bilingue, retourner selon la langue
		if (typeof content === 'object' && content !== null) {
			const currentLanguage = i18n.language || 'fr';
			return content[currentLanguage] || content.fr || content.en || fallback;
		}
		
		return fallback;
	};

	// Effet pour charger les blogs au montage
	useEffect(() => {
		loadBlogs();
	}, []);

	// Types et catégories
	const blogTypes = [
		{ value: "article", label: "Article", icon: FileText },
		{ value: "etude-cas", label: "Étude de cas", icon: BookOpen },
		{ value: "tutoriel", label: "Tutoriel", icon: TrendingUp },
		{ value: "actualite", label: "Actualité", icon: Clock },
		{ value: "temoignage", label: "Témoignage", icon: Users },
	];

	const blogCategories = [
		{ value: "strategie", label: "Stratégie" },
		{ value: "technologie", label: "Technologie" },
		{ value: "finance", label: "Finance" },
		{ value: "ressources-humaines", label: "Ressources Humaines" },
		{ value: "marketing", label: "Marketing" },
		{ value: "operations", label: "Opérations" },
		{ value: "gouvernance", label: "Gouvernance" },
	];

	const statusOptions = [
		{ value: "", label: "Tous les statuts" },
		{ value: "draft", label: "Brouillon" },
		{ value: "published", label: "Publié" },
		{ value: "archived", label: "Archivé" },
	];

	// Filtrer les blogs
	const filteredBlogs = blogs.filter((blog) => {
		const localizedTitle = getLocalizedContent(blog.title, '');
		const localizedExcerpt = getLocalizedContent(blog.excerpt, '');
		const matchesSearch =
			!searchTerm ||
			localizedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
			localizedExcerpt.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus = !statusFilter || blog.status === statusFilter;
		const matchesType = !typeFilter || blog.type === typeFilter;
		const matchesCategory = !categoryFilter || blog.category === categoryFilter;

		return matchesSearch && matchesStatus && matchesType && matchesCategory;
	});

	const handleDelete = async (id) => {
		if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce blog ?")) return;

		try {
			await deleteBlog(id);
			toast.success("Blog supprimé avec succès");
			loadBlogs();
		} catch (error) {
			console.error("Delete blog error:", error);
			toast.error("Erreur lors de la suppression");
		}
	};

	const handleEdit = (blog) => {
		navigate(`/admin/blog/edit/${blog._id}`);
	};

	const handleCreate = () => {
		navigate("/admin/blog/create");
	};

	const handleStats = () => {
		navigate("/admin/blog/stats");
	};

	const handleToggleStatus = async (blog) => {
		const newStatus = blog.status === "published" ? "draft" : "published";

		try {
			await updateBlog(blog._id, { status: newStatus });
			toast.success(
				`Blog ${newStatus === "published" ? "publié" : "dépublié"} avec succès`
			);
			loadBlogs();
		} catch (error) {
			console.error("Toggle status error:", error);
			toast.error("Erreur lors de la mise à jour");
		}
	};

	const getTypeIcon = (type) => {
		const typeConfig = blogTypes.find((t) => t.value === type);
		return typeConfig ? typeConfig.icon : FileText;
	};

	const getTypeLabel = (type) => {
		const typeConfig = blogTypes.find((t) => t.value === type);
		return typeConfig ? typeConfig.label : "Article";
	};

	const getCategoryLabel = (category) => {
		const categoryConfig = blogCategories.find((c) => c.value === category);
		return categoryConfig ? categoryConfig.label : category;
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="space-y-6 pt-5 px-7 pb-20">
				{/* Header */}
				<div className="flex max-w-7xl mx-auto flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Gestion du Blog
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Gérez les articles, études de cas et contenus de votre blog
						</p>
					</div>
					<div className="mt-4 sm:mt-0 flex space-x-3">
						<button
							onClick={handleStats}
							className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
						>
							<BarChart3 className="h-4 w-4 mr-2" />
							Statistiques
						</button>
						<button
							onClick={handleCreate}
							className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
						>
							<Plus className="h-4 w-4 mr-2" />
							Nouveau Blog
						</button>
					</div>
				</div>

				{/* Filtres */}
				<div className="bg-white py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg shadow">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Recherche */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Rechercher..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>

						{/* Filtre par statut */}
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						>
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						{/* Filtre par type */}
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="">Tous les types</option>
							{blogTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>

						{/* Filtre par catégorie */}
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="">Toutes les catégories</option>
							{blogCategories.map((category) => (
								<option key={category.value} value={category.value}>
									{category.label}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Liste des blogs */}
				<div className="bg-white shadow rounded-lg max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					{filteredBlogs.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="mx-auto h-12 w-12 text-gray-400" />
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								Aucun blog trouvé
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								{searchTerm || statusFilter || typeFilter || categoryFilter
									? "Aucun blog ne correspond à vos critères de recherche."
									: "Commencez par créer votre premier blog."}
							</p>
						</div>
					) : (
						<div className="divide-y divide-gray-200">
							{filteredBlogs.map((blog) => {
								const TypeIcon = getTypeIcon(blog.type);
								return (
									<div key={blog._id} className="sm:p-6 py-4 hover:bg-gray-50">
										<div className=" items-start justify-between">
											<div className="flex justify-between mb-2">
												<div className="flex flex-wrap items-center justify-center sm:space-x-3 space-y-2">
													<TypeIcon className="h-5 w-5 text-primary-600 content-center items-center" />
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
														{getTypeLabel(blog.type)}
													</span>
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
														{getCategoryLabel(blog.category)}
													</span>
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
															blog.status === "published"
																? "bg-green-100 text-green-800"
																: blog.status === "draft"
																? "bg-yellow-100 text-yellow-800"
																: "bg-gray-100 text-gray-800"
														}`}
													>
														{blog.status === "published"
															? "Publié"
															: blog.status === "draft"
															? "Brouillon"
															: "Archivé"}
													</span>
												</div>

												<div className="flex items-right space-x-2 ml-4 float-end">
													<button
														onClick={() => handleEdit(blog)}
														className="p-2 text-gray-400 hover:text-primary-600"
														title="Modifier"
													>
														<Edit className="h-4 w-4" />
													</button>

													<button
														onClick={() => handleToggleStatus(blog)}
														className="p-2 text-gray-400 hover:text-primary-600"
														title={
															blog.status === "published"
																? "Dépublier"
																: "Publier"
														}
													>
														{blog.status === "published" ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>

													<button
														onClick={() => handleDelete(blog._id)}
														className="p-2 text-gray-400 hover:text-red-600"
														title="Supprimer"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</div>

											<div>
												<h3 className="text-lg font-medium text-gray-900 mb-2">
													{getLocalizedContent(blog.title, 'Titre non disponible')}
												</h3>

												<p className="text-sm text-gray-600 mb-3 line-clamp-2">
													{getLocalizedContent(blog.excerpt, 'Extrait non disponible')}
												</p>
											</div>

											<div className="flex flex-wrap content-center justify-center sm:justify-start gap-2 items-center space-x-4 text-sm text-gray-500">
												<div className="flex items-center">
													<User className="h-4 w-4 mr-1" />
													{blog.author?.name || "Auteur inconnu"}
												</div>
												<div className="flex items-center">
													<Calendar className="h-4 w-4 mr-1" />
													{formatDate(blog.createdAt)}
												</div>
												<div className="flex items-center">
													<Eye className="h-4 w-4 mr-1" />
													{blog.views} vues
												</div>
												<div className="flex items-center">
													<Tag className="h-4 w-4 mr-1" />
													{blog.likes} likes
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>

			{/* Les modales sont remplacées par des pages dédiées */}
		</AdminLayout>
	);
};

export default BlogManagement;
