import React from "react";
import { motion } from "framer-motion";

// Carte de question pour le diagnostic simplifié "Niveau 1" (v2)
// Affiche systématiquement 3 réponses : Oui / Partiellement / Non,
// avec une description contextuelle sous chaque libellé court.
const SimpleQuestionCard = ({ question, pillarName, selectedAnswer, onAnswerSelect }) => {
	if (!question) return null;

	const handleOptionClick = (value) => {
		onAnswerSelect(question.id, value);
	};

	return (
		<div className="card">
			<div className="mb-6">
				<div className="text-sm font-medium text-primary-600 mb-2">
					{pillarName}
				</div>
				<h2 className="sm:text-2xl text-lg font-bold text-gray-900 leading-tight">
					{question.text}
				</h2>
			</div>

			<div className="space-y-3">
				{question.options.map((option) => (
					<motion.button
						key={option.value}
						onClick={() => handleOptionClick(option.value)}
						className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
							selectedAnswer === option.value
								? "border-primary-500 bg-primary-50 text-primary-900"
								: "border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25"
						}`}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className="flex items-start space-x-3">
							<div
								className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
									selectedAnswer === option.value
										? "border-primary-500 bg-primary-500"
										: "border-gray-300"
								}`}
							>
								{selectedAnswer === option.value && (
									<div className="w-2 h-2 bg-white rounded-full" />
								)}
							</div>
							<div>
								<div className="font-semibold">{option.shortLabel}</div>
								<div className="text-sm text-gray-500 mt-0.5">{option.label}</div>
							</div>
						</div>
					</motion.button>
				))}
			</div>
		</div>
	);
};

export default SimpleQuestionCard;
