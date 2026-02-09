import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

const ForgotPasswordPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await axios.post(`${API_URL}/client-auth/forgot-password`, { email });
			setEmailSent(true);
			toast.success("Email de réinitialisation envoyé !");
		} catch (error) {
			const message =
				error.response?.data?.message || "Erreur lors de l'envoi de l'email";
			toast.error(message);
		} finally {
			setLoading(false);
		}
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
					<h2 className="text-3xl font-bold text-gray-900">
						Mot de passe oublié ?
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Entrez votre adresse email pour recevoir un lien de réinitialisation
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
					{!emailSent ?
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
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
										placeholder="votre@email.com"
									/>
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
											Envoi en cours...
										</div>
									:	"Envoyer le lien de réinitialisation"}
								</motion.button>
							</div>
						</form>
					:	<div className="text-center space-y-4">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", duration: 0.5 }}
							>
								<CheckCircle className="mx-auto h-16 w-16 text-green-500" />
							</motion.div>
							<h3 className="text-lg font-medium text-gray-900">
								Email envoyé !
							</h3>
							<p className="text-sm text-gray-600">
								Si cet email existe dans notre système, vous recevrez un lien de
								réinitialisation. Vérifiez votre boîte de réception et vos
								spams.
							</p>
							<p className="text-xs text-gray-500">
								Le lien est valide pendant 1 heure.
							</p>
						</div>
					}

					<div className="mt-6">
						<Link
							to="/login"
							className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Retour à la connexion
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
