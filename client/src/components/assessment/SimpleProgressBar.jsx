import React from "react";
import { motion } from "framer-motion";

// Barre de progression du diagnostic simplifié "Niveau 1" (v2)
// Affiche la progression globale ainsi qu'un repère par pilier (1/5 ... 5/5)
const SimpleProgressBar = ({ current, total, pillars, currentPillarIndex }) => {
	const percentage = total > 0 ? (current / total) * 100 : 0;

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-gray-700">
					{pillars && pillars[currentPillarIndex]
						? `Pilier ${currentPillarIndex + 1}/${pillars.length} : ${pillars[currentPillarIndex]}`
						: "Progression"}
				</span>
				<span className="text-sm font-medium text-gray-700">
					{current} / {total}
				</span>
			</div>

			<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
				<motion.div
					className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				/>
			</div>

			{pillars && pillars.length > 0 && (
				<div className="flex items-center justify-between mt-3 gap-1">
					{pillars.map((pillarName, index) => (
						<div
							key={pillarName}
							className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
								index < currentPillarIndex
									? "bg-primary-500"
									: index === currentPillarIndex
										? "bg-accent-500"
										: "bg-gray-200"
							}`}
							title={pillarName}
						/>
					))}
				</div>
			)}

			<div className="text-center mt-2">
				<span className="text-lg font-semibold text-primary-600">
					{Math.round(percentage)}%
				</span>
			</div>
		</div>
	);
};

export default SimpleProgressBar;
