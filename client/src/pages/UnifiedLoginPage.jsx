import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	Lock,
	Mail,
	Eye,
	EyeOff,
	LogIn,
	ArrowRight,
	Shield,
	Users,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useClientAuth } from "../context/ClientAuthContext";

import { API_BASE_URL as API_URL } from "../services/api";

const UnifiedLoginPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { setToken, setUser } = useClientAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [detectedRole, setDetectedRole] = useState(null);
	const [hasRedirected, setHasRedirected] = useState(false);

	// Redirect if already authenticated
	useEffect(() => {
		if (hasRedirected || loading) return; // Éviter les redirections multiples et pendant le chargement

		const adminToken = localStorage.getItem("adminToken");
		const clientToken = localStorage.getItem("clientToken");

		// Redirection automatique seulement si pas en cours de connexion
		if (adminToken) {
			setHasRedirected(true);
			navigate("/admin/dashboard", { replace: true });
		} else if (clientToken) {
			setHasRedirected(true);
			navigate("/client/dashboard", { replace: true });
		}
	}, [navigate, loading, hasRedirected]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Utiliser l'API unifiée pour détecter automatiquement le rôle
			const response = await axios.post(`${API_URL}/unified-auth/login`, {
				email: formData.email,
				password: formData.password,
			});

			if (response.data.success) {
				const { token, user } = response.data;

				// Sauvegarder le token selon le rôle
				if (user.role === "admin") {
					localStorage.setItem("adminToken", token);
					localStorage.setItem("adminData", JSON.stringify(user));
					setDetectedRole("admin");
					toast.success("Connexion administrateur réussie !");

					// Arrêter le loader avant la redirection
					setLoading(false);
					setHasRedirected(true);

					// Petite pause pour que l'utilisateur voie le message de succès
					setTimeout(() => {
						navigate("/admin/dashboard", { replace: true });
					}, 500);
				} else if (user.role === "client") {
					localStorage.setItem("clientToken", token);
					// Mettre à jour le contexte d'authentification client
					setToken(token);
					setUser(user);
					setDetectedRole("client");
					toast.success("Connexion client réussie !");

					// Arrêter le loader avant la redirection
					setLoading(false);
					setHasRedirected(true);

					// Petite pause pour que l'utilisateur voie le message de succès
					setTimeout(() => {
						navigate("/client/dashboard", { replace: true });
					}, 500);
				}
			}
		} catch (error) {
			console.error("Erreur de connexion:", error);
			toast.error("Identifiants incorrects");
			setLoading(false); // Arrêter le loader en cas d'erreur
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
					<p className="mt-2 text-sm text-gray-600">
						Accédez à votre espace client ou administrateur
					</p>
				</motion.div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10"
				>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Adresse email
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									placeholder="votre@email.com"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Mot de passe
							</label>
							<div className="mt-1 relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleChange}
									className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									placeholder="Votre mot de passe"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ?
										<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									:	<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
									}
								</button>
							</div>
						</div>

						<div>
							<motion.button
								type="submit"
								disabled={loading}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ?
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Connexion en cours...
									</div>
								:	<div className="flex items-center">
										<LogIn className="h-4 w-4 mr-2" />
										Se connecter
										<ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
									</div>
								}
							</motion.button>
						</div>

						{detectedRole && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
							>
								<div className="flex items-center">
									{detectedRole === "admin" ?
										<Shield className="h-5 w-5 text-green-600 mr-2" />
									:	<Users className="h-5 w-5 text-green-600 mr-2" />}
									<span className="text-sm text-green-800">
										Connexion{" "}
										{detectedRole === "admin" ? "administrateur" : "client"}{" "}
										détectée
									</span>
								</div>
							</motion.div>
						)}
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Nouveau sur vitalCHECK ?
								</span>
							</div>
						</div>

						<div className="mt-6">
							<Link
								to="/client/register"
								className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
							>
								Créer un compte client
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default UnifiedLoginPage;
