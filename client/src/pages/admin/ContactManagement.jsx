import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Mail,
	Users,
	Search,
	Download,
	CheckCircle,
	XCircle,
	Calendar,
	Filter,
	ChevronLeft,
	ChevronRight,
	Send,
	FileText,
	Upload,
    Edit,
    Trash2,
    Save,
    X,
    Tag,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../services/api";

const ContactManagement = () => {
	const navigate = useNavigate();
	const [subscribers, setSubscribers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [dateRangeFilter, setDateRangeFilter] = useState("");
	const [availableTypes, setAvailableTypes] = useState([]);
	const [selectedSubscribers, setSelectedSubscribers] = useState([]);
	const [editingContact, setEditingContact] = useState(null);
	const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "", type: "" });
	const [isSaving, setIsSaving] = useState(false);

	const [stats, setStats] = useState({
		total: 0,
		active: 0,
		inactive: 0,
	});
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 50,
		total: 0,
		pages: 1,
	});

	useEffect(() => {
		fetchSubscribers();
	}, [pagination.page, statusFilter, typeFilter, searchTerm, dateRangeFilter]);

	const fetchSubscribers = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("adminToken");
			const params = {
				page: pagination.page,
				limit: pagination.limit,
				...(statusFilter && {
					isActive: statusFilter === "active" ? "true" : "false",
				}),
				...(typeFilter && { type: typeFilter }),
				...(searchTerm && { search: searchTerm }),
				...(dateRangeFilter && { dateRange: dateRangeFilter }),
			};

			const response = await axios.get(
				`${API_BASE_URL}/mailing-contacts`,
				{
					headers: { Authorization: `Bearer ${token}` },
					params,
				},
			);

			if (response.data.success) {
				setSubscribers(response.data.contacts);
				setAvailableTypes(response.data.types || []);
				setStats({
                    total: response.data.pagination.total,
                    active: response.data.contacts.filter(c => c.isActive).length,
                    inactive: response.data.contacts.filter(c => !c.isActive).length
                });
				setPagination((prev) => ({
					...prev,
					total: response.data.pagination.total,
					pages: response.data.pagination.pages,
				}));
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des abonnés:", error);
			toast.error(
				error.response?.data?.message ||
					"Erreur lors du chargement des abonnés",
			);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.pages) {
			setPagination((prev) => ({ ...prev, page: newPage }));
		}
	};

	const exportToCSV = () => {
		const headers = [
			"Email",
			"Prénom",
			"Nom",
			"Type",
			"Statut",
			"Date d'ajout",
			"Source",
		];
		const rows = subscribers.map((sub) => [
			sub.email,
			sub.firstName || "",
			sub.lastName || "",
			sub.type || "Prospect",
			sub.isActive ? "Actif" : "Inactif",
			new Date(sub.addedAt || sub.createdAt).toLocaleDateString("fr-FR"),
			sub.source || "manual",
		]);

		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`contacts_${new Date().toISOString().split("T")[0]}.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success("Export CSV réussi");
	};

	const handleSendToSelected = () => {
		if (selectedSubscribers.length === 0) {
			toast.error("Veuillez sélectionner au moins un contact");
			return;
		}

		const selectedEmails = subscribers
			.filter((sub) => selectedSubscribers.includes(sub._id))
			.map((sub) => sub.email);

		navigate("/admin/emails", { 
            state: { 
                selectedUsers: [],
                userEmails: selectedEmails 
            } 
        });
	};

	const handleEditClick = (contact) => {
		setEditingContact(contact);
		setEditForm({
			firstName: contact.firstName || "",
			lastName: contact.lastName || "",
			email: contact.email || "",
			type: contact.type || "Prospect",
		});
	};

	const handleSaveEdit = async () => {
		try {
			setIsSaving(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.put(
				`${API_BASE_URL}/mailing-contacts/${editingContact._id}`,
				editForm,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				toast.success("Contact mis à jour avec succès");
				setEditingContact(null);
				fetchSubscribers();
			}
		} catch (error) {
			console.error("Error updating contact:", error);
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
		} finally {
			setIsSaving(false);
		}
	};

    const handleDeleteContact = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) return;
        
        try {
            const token = localStorage.getItem("adminToken");
            await axios.delete(`${API_BASE_URL}/mailing-contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Contact supprimé");
            fetchSubscribers();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

	const getStatusBadge = (isActive) => {
		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${
					isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
				}`}
			>
				{isActive ?
					<span className="flex items-center gap-1">
						<CheckCircle className="w-3 h-3" />
						Actif
					</span>
				:	<span className="flex items-center gap-1">
						<XCircle className="w-3 h-3" />
						Inactif
					</span>
				}
			</span>
		);
	};

	const getSourceBadge = (source) => {
		const sources = {
			footer: { label: "Footer", color: "bg-blue-100 text-blue-800" },
			landing: { label: "Landing", color: "bg-purple-100 text-purple-800" },
			manual: { label: "Manuel", color: "bg-gray-100 text-gray-800" },
			import: { label: "Import", color: "bg-orange-100 text-orange-800" },
		};

		const sourceInfo = sources[source] || sources.footer;

		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${sourceInfo.color}`}
			>
				{sourceInfo.label}
			</span>
		);
	};

	if (loading && subscribers.length === 0) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="p-4 lg:p-6">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
							Mes Contacts
						</h1>
						<p className="text-gray-600 mt-1">
							Gérez vos listes de contacts et destinataires pour vos campagnes
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => navigate("/admin/emails")}
							className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm font-medium"
						>
							<Mail className="w-4 h-4" />
							Envoyer un Mail
						</button>
						<button
							onClick={() => navigate("/admin/emails/import")}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium"
						>
							<Upload className="w-4 h-4 text-orange-600" />
							Importer
						</button>
						<button
							onClick={exportToCSV}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium"
						>
							<Download className="w-4 h-4 text-blue-600" />
							Exporter
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4">
						<div className="p-3 bg-primary-50 rounded-lg">
							<Users className="w-6 h-6 text-primary-600" />
						</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Contacts</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
					</div>

					<div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4">
						<div className="p-3 bg-green-50 rounded-lg">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Actifs</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
					</div>

					<div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 flex items-center gap-4">
						<div className="p-3 bg-red-50 rounded-lg">
							<XCircle className="w-6 h-6 text-red-600" />
						</div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Inactifs</p>
                            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                        </div>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						<div className="lg:col-span-2">
							<label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">
								Recherche
							</label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<input
									type="text"
									placeholder="Email, nom, entreprise, type..."
									value={searchTerm}
									onChange={(e) => {
										setSearchTerm(e.target.value);
										setPagination((prev) => ({ ...prev, page: 1 }));
									}}
									className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm text-gray-900 font-medium"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">
								Type / Groupe
							</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        setPagination((prev) => ({ ...prev, page: 1 }));
                                    }}
                                    className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                                >
                                    <option value="">Tous les types</option>
                                    {availableTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
						</div>

						<div>
							<label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">
								Statut
							</label>
							<div className="relative">
								<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<select
									value={statusFilter}
									onChange={(e) => {
										setStatusFilter(e.target.value);
										setPagination((prev) => ({ ...prev, page: 1 }));
									}}
									className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
								>
									<option value="">Tous les statuts</option>
									<option value="active">Actifs uniquement</option>
									<option value="inactive">Inactifs uniquement</option>
								</select>
							</div>
						</div>

						<div className="flex items-end">
							<button
								onClick={() => {
									setSearchTerm("");
									setStatusFilter("");
                                    setTypeFilter("");
									setDateRangeFilter("");
									setPagination((prev) => ({ ...prev, page: 1 }));
								}}
								className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold"
							>
								Réinitialiser
							</button>
						</div>
					</div>
				</div>

				{/* Contacts List */}
				<div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
						<h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
							<Users className="w-5 h-5 text-gray-400" />
							Liste des Contacts ({pagination.total})
						</h2>
                        {selectedSubscribers.length > 0 && (
                            <button
                                onClick={handleSendToSelected}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-all text-xs font-bold"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Envoyer à {selectedSubscribers.length} sélectionné(s)
                            </button>
                        )}
					</div>

					{subscribers.length === 0 ?
						<div className="p-16 text-center">
							<Mail className="w-16 h-16 text-gray-200 mx-auto mb-4" />
							<p className="text-gray-500 font-medium">Aucun contact trouvé pour cette recherche</p>
						</div>
					:	<>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-100">
									<thead className="bg-gray-50/50">
										<tr>
											<th className="px-6 py-4 text-left">
												<input
													type="checkbox"
													checked={
														selectedSubscribers.length === subscribers.length &&
														subscribers.length > 0
													}
													onChange={(e) => {
														if (e.target.checked) {
															setSelectedSubscribers(
																subscribers.map((s) => s._id),
															);
														} else {
															setSelectedSubscribers([]);
														}
													}}
													className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
												/>
											</th>
											<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
												Contact
											</th>
											<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
												Type
											</th>
											<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
												Statut
											</th>
											<th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
												Date d'ajout
											</th>
											<th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-50">
										{subscribers.map((subscriber) => (
											<tr
												key={subscriber._id}
												className={`hover:bg-gray-50/80 transition-colors group ${selectedSubscribers.includes(subscriber._id) ? "bg-primary-50/30" : ""}`}
											>
												<td className="px-6 py-4 whitespace-nowrap">
													<input
														type="checkbox"
														checked={selectedSubscribers.includes(
															subscriber._id,
														)}
														onChange={(e) => {
															if (e.target.checked) {
																setSelectedSubscribers([
																	...selectedSubscribers,
																	subscriber._id,
																]);
															} else {
																setSelectedSubscribers(
																	selectedSubscribers.filter(
																		(id) => id !== subscriber._id,
																	),
																);
															}
														}}
														className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
													/>
												</td>
												<td className="px-6 py-4">
													<div className="flex flex-col">
														<span className="text-sm font-bold text-gray-900">
															{subscriber.firstName || subscriber.lastName ?
																`${subscriber.firstName || ""} ${subscriber.lastName || ""}`.trim()
															:	"Sans nom"}
														</span>
														<span className="text-xs text-gray-500">{subscriber.email}</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
														{subscriber.type || "Prospect"}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													{getStatusBadge(subscriber.isActive)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
														<Calendar className="w-3.5 h-3.5" />
														{new Date(subscriber.addedAt || subscriber.createdAt).toLocaleDateString("fr-FR")}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex justify-end gap-1 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditClick(subscriber)}
                                                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteContact(subscriber._id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							{pagination.pages > 1 && (
								<div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
									<div className="flex items-center justify-between">
										<div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
											Page {pagination.page} / {pagination.pages}
										</div>
										<div className="flex gap-1">
											<button
												onClick={() => handlePageChange(pagination.page - 1)}
												disabled={pagination.page === 1}
												className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-all shadow-sm"
											>
												<ChevronLeft className="w-4 h-4" />
											</button>
											<button
												onClick={() => handlePageChange(pagination.page + 1)}
												disabled={pagination.page === pagination.pages}
												className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-all shadow-sm"
											>
												<ChevronRight className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							)}
						</>
					}
				</div>
			</div>

            {/* Edit Modal */}
            {editingContact && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Edit className="w-4 h-4 text-primary-600" />
                                Modifier le contact
                            </h3>
                            <button 
                                onClick={() => setEditingContact(null)}
                                className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Prénom</label>
                                    <input 
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Nom</label>
                                    <input 
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Email</label>
                                <input 
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Type / Groupe</label>
                                <input 
                                    type="text"
                                    list="type-list"
                                    value={editForm.type}
                                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                                    placeholder="Ex: Prospect, Client, LinkedIn..."
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium"
                                />
                                <datalist id="type-list">
                                    {availableTypes.map(t => <option key={t} value={t} />)}
                                </datalist>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button 
                                onClick={() => setEditingContact(null)}
                                className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="flex-1 py-2.5 px-4 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                Sauvegarder
                            </button>
                        </div>
                    </div>
                </div>
            )}
		</AdminLayout>
	);
};

export default ContactManagement;
