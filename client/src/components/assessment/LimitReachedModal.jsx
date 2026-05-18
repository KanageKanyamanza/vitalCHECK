import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, ShieldAlert, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LimitReachedModal = ({ isOpen, onClose, limitData }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	if (!isOpen) return null;

	const { limit, plan } = limitData || {};

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 20 }}
				className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
			>
				{/* Header avec icône d'alerte */}
				<div className="bg-red-50 p-6 flex flex-col items-center text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<ShieldAlert className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{t("assessment.limitReachedTitle") || "Limite atteinte"}
					</h2>
					<p className="text-red-700 font-medium">
						Plan {plan?.toUpperCase()}
					</p>
				</div>

				{/* Corps de la modale */}
				<div className="p-8">
					<p className="text-gray-600 text-center mb-8 leading-relaxed">
						{t("assessment.limitReachedDesc", {
							limit,
						}) ||
							`Vous avez atteint votre limite mensuelle d'évaluations (${limit}) pour ce mois. Passez au plan supérieur pour continuer à évaluer votre entreprise.`}
					</p>

					<div className="space-y-4">
						<button
							onClick={() => navigate("/pricing")}
							className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
						>
							<Zap className="w-5 h-5 fill-current" />
							<span>{t("pricing.upgradeNow") || "Voir les plans premium"}</span>
							<ArrowRight className="w-5 h-5" />
						</button>

						<button
							onClick={onClose}
							className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
						>
							{t("assessment.viewOldResults") ||
								"Consulter mes anciens résultats"}
						</button>
					</div>
				</div>

				{/* Footer informatif */}
				<div className="bg-gray-50 p-4 border-t border-gray-100">
					<div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
						<AlertCircle className="w-4 h-4" />
						<span>
							{t("assessment.limitResetNote") ||
								"Réinitialisation de la limite le 1er du mois prochain"}
						</span>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default LimitReachedModal;
