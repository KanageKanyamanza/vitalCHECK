import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Upload,
	FileText,
	Mail,
	User,
	AlertCircle,
	CheckCircle,
	X,
	Plus,
    Trash2,
    Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../services/api";

const EmailImport = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	
	const [activeTab, setActiveTab] = useState("file"); // "file" or "manual"
	const [manualText, setManualText] = useState("");
	const [parsedContacts, setParsedContacts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [importStats, setImportStats] = useState(null);
	const [existingEmails, setExistingEmails] = useState(new Set());

	useEffect(() => {
		fetchExistingEmails();
	}, []);

	const fetchExistingEmails = async () => {
		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.get(`${API_BASE_URL}/mailing-contacts/emails-only`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (response.data.success) {
				setExistingEmails(new Set(response.data.emails.map(e => String(e).toLowerCase())));
			}
		} catch (error) {
			console.error("Error fetching existing emails:", error);
		}
	};

	// Valider un email avec regex
	const isValidEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	// Gérer l'importation manuelle (TextArea)
	const handleManualParse = () => {
		if (!manualText.trim()) {
			toast.error("Veuillez saisir au moins un email");
			return;
		}

		// Séparer par ligne ou par virgule
		const lines = manualText.split(/[\n,;]/);
		const newContacts = [];
		const seenEmails = new Set(parsedContacts.map(c => c.email.toLowerCase()));
		let skippedCount = 0;

		lines.forEach(line => {
			const trimmed = line.trim();
			if (!trimmed) return;

			// Essayer de trouver un email dans la ligne
			const emailMatch = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
			if (emailMatch) {
				const email = emailMatch[0].toLowerCase();
				
				// Vérifier si déjà dans la liste actuelle OU dans la base de données
				if (existingEmails.has(email)) {
					skippedCount++;
					return;
				}

				if (!seenEmails.has(email)) {
					// Essayer d'extraire le nom si possible (Ex: "John Doe <john@example.com>")
					let firstName = "";
					let lastName = "";
					
					const namePart = trimmed.replace(email, "").replace(/[<>()[\]]/g, "").trim();
					if (namePart) {
						const parts = namePart.split(/\s+/);
						firstName = parts[0];
						lastName = parts.slice(1).join(" ");
					}

					newContacts.push({ email, firstName, lastName, source: "manual" });
					seenEmails.add(email);
				}
			}
		});

		if (newContacts.length === 0) {
			if (skippedCount > 0) {
				toast.error(`${skippedCount} contact(s) déjà présent(s) en base de données`);
			} else {
				toast.error("Aucun email valide trouvé");
			}
		} else {
			setParsedContacts([...parsedContacts, ...newContacts]);
			setManualText("");
			if (skippedCount > 0) {
				toast.success(`${newContacts.length} contact(s) ajouté(s), ${skippedCount} déjà présent(s) ignoré(s)`);
			} else {
				toast.success(`${newContacts.length} contact(s) ajouté(s)`);
			}
		}
	};

	// Gérer l'importation de fichier (Excel/CSV)
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (evt) => {
			try {
				const bstr = evt.target.result;
				const wb = XLSX.read(bstr, { type: "binary" });
				const newContacts = [];
				const seenEmails = new Set(parsedContacts.map(c => c.email.toLowerCase()));
				let skippedCount = 0;
				let totalFound = 0;

				// Parcourir toutes les feuilles du classeur Excel
				wb.SheetNames.forEach((wsname) => {
					const ws = wb.Sheets[wsname];
					const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

					if (data.length < 1) return;

					// Identifier les colonnes pour cette feuille spécifique
					const headers = data[0].map(h => String(h || "").toLowerCase());
					const emailIdx = headers.findIndex(h => h.includes("email") || h.includes("mail"));
					const firstNameIdx = headers.findIndex(h => h.includes("prenom") || h.includes("first") || h.includes("prénom"));
					const lastNameIdx = headers.findIndex(h => h.includes("nom") || h.includes("last"));
					const typeIdx = headers.findIndex(h => h.includes("type") || h.includes("catégorie") || h.includes("groupe") || h.includes("category"));

					// Si on ne trouve pas de colonne email dans cette feuille, on l'ignore
					if (emailIdx === -1) return;

					for (let i = 1; i < data.length; i++) {
						const row = data[i];
						const emailValue = row[emailIdx];
						if (!emailValue) continue;

						const email = String(emailValue).trim().toLowerCase();
						totalFound++;
						
						if (email && isValidEmail(email)) {
							// Ignorer si déjà présent en base de données
							if (existingEmails.has(email)) {
								skippedCount++;
								continue;
							}

							// Ignorer si déjà présent dans la liste actuelle d'importation
							if (!seenEmails.has(email)) {
								newContacts.push({
									email,
									firstName: firstNameIdx !== -1 ? String(row[firstNameIdx] || "").trim() : "",
									lastName: lastNameIdx !== -1 ? String(row[lastNameIdx] || "").trim() : "",
									type: typeIdx !== -1 ? String(row[typeIdx] || "").trim() : "Prospect",
									source: "file"
								});
								seenEmails.add(email);
							}
						}
					}
				});

				if (newContacts.length === 0) {
					if (skippedCount > 0) {
						toast.error(`${skippedCount} contact(s) déjà présent(s) en base de données`);
					} else if (totalFound === 0) {
						toast.error("Aucun contact trouvé dans le fichier");
					} else {
						toast.error("Aucun nouvel email valide trouvé");
					}
				} else {
					setParsedContacts([...parsedContacts, ...newContacts]);
					if (skippedCount > 0) {
						toast.success(`${newContacts.length} contacts chargés depuis tous les onglets, ${skippedCount} déjà présent(s) ignoré(s)`);
					} else {
						toast.success(`${newContacts.length} contacts chargés depuis tous les onglets du fichier`);
					}
				}
			} catch (err) {
				console.error("Excel parse error:", err);
				toast.error("Erreur lors de la lecture du fichier");
			}
		};
		reader.readAsBinaryString(file);
		// Reset file input
		e.target.value = null;
	};

	const removeContact = (index) => {
		const updated = [...parsedContacts];
		updated.splice(index, 1);
		setParsedContacts(updated);
	};

	const handleImport = async () => {
		if (parsedContacts.length === 0) {
			toast.error("Aucun contact à importer");
			return;
		}

		try {
			setLoading(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.post(
				`${API_BASE_URL}/mailing-contacts/bulk-import`,
				{ contacts: parsedContacts },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				setImportStats(response.data.stats);
				setParsedContacts([]);
				toast.success(response.data.message);
				fetchExistingEmails(); // Refresh local list of existing emails
			}
		} catch (error) {
			console.error("Import error:", error);
			toast.error(error.response?.data?.message || "Erreur lors de l'importation");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminLayout>
			<div className="max-w-4xl mx-auto px-4 py-6">
				{/* Header */}
				<div className="flex items-center gap-4 mb-4">
					<button
						onClick={() => navigate("/admin/contacts")}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-gray-900 tracking-tight">
							Importer des Contacts
						</h1>
						<p className="text-gray-600 mt-1">Ajoutez des contacts à votre carnet d'adresses</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Side: Input Methods */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
							<div className="flex border-b border-gray-100">
								<button
									onClick={() => setActiveTab("file")}
									className={`flex-1 py-4 text-sm font-medium transition-colors ${
										activeTab === "file" 
											? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50" 
											: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Upload className="w-4 h-4 inline-block mr-2" />
									Fichier
								</button>
								<button
									onClick={() => setActiveTab("manual")}
									className={`flex-1 py-4 text-sm font-medium transition-colors ${
										activeTab === "manual" 
											? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50" 
											: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
									}`}
								>
									<Plus className="w-4 h-4 inline-block mr-2" />
									Manuel
								</button>
							</div>

							<div className="p-6">
								{activeTab === "file" ? (
									<div className="space-y-4">
										<p className="text-sm text-gray-500">
											Importez un fichier Excel (.xlsx, .xls) ou CSV. 
											Le fichier doit contenir au moins une colonne "Email".
										</p>
										<div 
											onClick={() => fileInputRef.current?.click()}
											className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all group"
										>
											<div className="p-4 bg-gray-50 rounded-full group-hover:bg-primary-100 transition-colors mb-4">
												<Upload className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
											</div>
											<p className="text-sm font-medium text-gray-900 text-center">Cliquez pour téléverser</p>
											<p className="text-xs text-gray-500 mt-1 text-center">ou glissez-déposez ici</p>
											<input 
												type="file" 
												ref={fileInputRef}
												onChange={handleFileUpload}
												accept=".xlsx, .xls, .csv"
												className="hidden"
											/>
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<p className="text-sm text-gray-500">
											Collez une liste d'emails séparés par des virgules ou des retours à la ligne.
										</p>
										<textarea
											rows={6}
											value={manualText}
											onChange={(e) => setManualText(e.target.value)}
											placeholder="Ex: contact@entreprise.com, support@test.fr..."
											className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
										/>
										<button
											onClick={handleManualParse}
											disabled={!manualText.trim()}
											className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 transition-all"
										>
											Ajouter à la liste
										</button>
									</div>
								)}
							</div>
						</div>

						{importStats && (
							<div className="bg-green-50 border border-green-200 rounded-xl p-6">
								<h3 className="text-green-800 font-bold flex items-center gap-2 mb-4">
									<CheckCircle className="w-5 h-5" />
									Importation réussie
								</h3>
								<div className="space-y-2 text-sm text-green-700">
									<div className="flex justify-between">
										<span>Nouveaux contacts :</span>
										<span className="font-bold">{importStats.imported}</span>
									</div>
									<div className="flex justify-between">
										<span>Mises à jour :</span>
										<span className="font-bold">{importStats.updated}</span>
									</div>
									{importStats.failed > 0 && (
										<div className="flex justify-between text-red-600">
											<span>Échecs :</span>
											<span className="font-bold">{importStats.failed}</span>
										</div>
									)}
								</div>
								<button
									onClick={() => setImportStats(null)}
									className="w-full mt-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
								>
									Nouvel import
								</button>
							</div>
						)}
					</div>

					{/* Right Side: Preview & Action */}
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 flex flex-col h-[600px]">
							<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
								<h2 className="font-bold text-gray-900 flex items-center gap-2">
									<Users className="w-5 h-5 text-primary-600" />
									Liste des contacts ({parsedContacts.length})
								</h2>
								{parsedContacts.length > 0 && (
									<button
										onClick={() => setParsedContacts([])}
										className="text-sm text-red-600 hover:text-red-700 font-medium"
									>
										Tout effacer
									</button>
								)}
							</div>

							<div className="flex-1 overflow-y-auto p-4">
								{parsedContacts.length === 0 ? (
									<div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
										<div className="p-6 bg-gray-50 rounded-full">
											<Mail className="w-12 h-12 text-gray-300" />
										</div>
										<p className="text-center max-w-xs">
											Ajoutez des contacts manuellement ou téléversez un fichier pour commencer.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										{parsedContacts.map((contact, index) => (
											<div 
												key={index}
												className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group"
											>
												<div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="w-4 h-4 text-primary-600" />
                                                    </div>
													<div className="min-w-0">
														<div className="text-sm font-bold text-gray-900 truncate">
															{contact.firstName || contact.lastName 
																? `${contact.firstName} ${contact.lastName}`.trim()
																: "Sans nom"}
														</div>
														<div className="text-xs text-gray-500 truncate">{contact.email}</div>
													</div>
												</div>
												<button
													onClick={() => removeContact(index)}
													className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="p-6 border-t border-gray-100 bg-gray-50/50">
								<div className="flex flex-col sm:flex-row gap-4">
									<button
										onClick={() => navigate("/admin/contacts")}
										className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-white transition-all"
									>
										Annuler
									</button>
									<button
										onClick={handleImport}
										disabled={loading || parsedContacts.length === 0}
										className="flex-[2] p-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
									>
										{loading ? (
											<>
												<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
												Importation en cours...
											</>
										) : (
											<>
												<CheckCircle className="w-5 h-5" />
												Lancer l'importation de {parsedContacts.length} contacts
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Info Board */}
				<div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
					<div className="flex-shrink-0">
						<AlertCircle className="w-6 h-6 text-blue-600" />
					</div>
					<div>
						<h4 className="font-bold text-blue-900 mb-2">Conseils pour l'importation</h4>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• Les doublons déjà présents en base de données sont automatiquement ignorés lors de l'ajout.</li>
							<li>• Les doublons au sein du même fichier/saisie sont également filtrés.</li>
							<li>• Pour Excel/CSV, assurez-vous que les colonnes sont nommées "Email", "Prenom" et "Nom".</li>
							<li>• Vous pouvez copier-coller du texte depuis un PDF directement dans l'onglet "Saisie manuelle".</li>
							<li>• Tous les nouveaux contacts seront marqués avec la source "Importation".</li>
						</ul>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default EmailImport;
