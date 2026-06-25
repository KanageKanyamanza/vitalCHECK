import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { assessmentV2API } from "../services/api";
import { SimpleQuestionCard, SimpleProgressBar } from "../components/assessment";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";

const COMPANY_SIZES = [
	{ value: "micro", label: "Micro-entreprise (1-9 employés)" },
	{ value: "sme", label: "PME (10-49 employés)" },
	{ value: "large-sme", label: "Moyenne entreprise (50-250 employés)" },
];

const SECTORS = [
	{ value: "technology", label: "Technologie" },
	{ value: "commerce", label: "Commerce" },
	{ value: "services", label: "Services" },
	{ value: "manufacturing", label: "Industrie / Manufacture" },
	{ value: "agriculture", label: "Agriculture" },
	{ value: "healthcare", label: "Santé" },
	{ value: "education", label: "Éducation" },
	{ value: "finance", label: "Finance" },
	{ value: "other", label: "Autre" },
];

const PROGRESS_STORAGE_KEY = "vitalcheck-v2-progress";
const RESULT_STORAGE_KEY = "vitalcheck-v2-result";
const LANGUAGE = "fr";

const SimplifiedAssessmentPage = () => {
	const navigate = useNavigate();
	const { scrollToTop } = useSmoothScroll();

	const [step, setStep] = useState("intro"); // 'intro' | 'questions'
	const [formData, setFormData] = useState({
		companyName: "",
		email: "",
		companySize: "",
		sector: "",
	});
	const [questionsData, setQuestionsData] = useState(null);
	const [loadingQuestions, setLoadingQuestions] = useState(true);
	const [answers, setAnswers] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	// Charger les questions dès l'arrivée sur la page
	useEffect(() => {
		const loadQuestions = async () => {
			try {
				const response = await assessmentV2API.getQuestions(LANGUAGE);
				if (response.data.success) {
					setQuestionsData(response.data.data);
				}
			} catch (error) {
				console.error("Erreur de chargement des questions v2:", error);
				toast.error("Impossible de charger le diagnostic. Veuillez réessayer.");
			} finally {
				setLoadingQuestions(false);
			}
		};

		loadQuestions();
	}, []);

	// Restaurer une progression interrompue (rafraîchissement de page)
	useEffect(() => {
		try {
			const saved = sessionStorage.getItem(PROGRESS_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed.formData) setFormData(parsed.formData);
				if (Array.isArray(parsed.answers)) setAnswers(parsed.answers);
				if (typeof parsed.currentIndex === "number") setCurrentIndex(parsed.currentIndex);
				if (parsed.step) setStep(parsed.step);
			}
		} catch {
			// Ignorer les erreurs de lecture du stockage
		}
	}, []);

	// Sauvegarder la progression à chaque changement
	useEffect(() => {
		try {
			sessionStorage.setItem(
				PROGRESS_STORAGE_KEY,
				JSON.stringify({ step, formData, answers, currentIndex }),
			);
		} catch {
			// Ignorer les erreurs d'écriture du stockage
		}
	}, [step, formData, answers, currentIndex]);

	const flatQuestions =
		questionsData?.pillars?.flatMap((pillar, pillarIndex) =>
			pillar.questions.map((question) => ({
				...question,
				pillarId: pillar.id,
				pillarName: pillar.name,
				pillarIndex,
			})),
		) || [];

	const pillarNames = questionsData?.pillars?.map((pillar) => pillar.name) || [];
	const totalQuestions = flatQuestions.length;
	const currentQuestion = flatQuestions[currentIndex];
	const isLastQuestion = currentIndex === totalQuestions - 1;
	const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);
	const canProceed = currentAnswer !== undefined;

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleStart = (e) => {
		e.preventDefault();

		if (!formData.companyName.trim() || !formData.email.trim() || !formData.companySize) {
			toast.error("Merci de remplir tous les champs obligatoires");
			return;
		}

		if (!questionsData) {
			toast.error("Le diagnostic n'a pas pu être chargé. Veuillez réessayer.");
			return;
		}

		setStep("questions");
		scrollToTop(400);
	};

	const handleAnswerSelect = (questionId, value) => {
		setAnswers((prev) => {
			const existing = prev.findIndex((a) => a.questionId === questionId);
			if (existing >= 0) {
				const updated = [...prev];
				updated[existing] = { questionId, answer: value };
				return updated;
			}
			return [...prev, { questionId, answer: value }];
		});
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1);
		} else {
			setStep("intro");
		}
	};

	const handleNext = () => {
		if (!canProceed) return;

		if (currentIndex < totalQuestions - 1) {
			setCurrentIndex((prev) => prev + 1);
			scrollToTop(300);
		} else {
			handleSubmit();
		}
	};

	const handleSubmit = async () => {
		if (submitting) return;

		setSubmitting(true);
		try {
			const response = await assessmentV2API.scoreAssessment({
				answers,
				language: LANGUAGE,
			});

			if (response.data.success) {
				const payload = {
					result: response.data.result,
					formData,
					answers,
					language: LANGUAGE,
				};

				try {
					sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(payload));
					sessionStorage.removeItem(PROGRESS_STORAGE_KEY);
				} catch {
					// Ignorer les erreurs de stockage
				}

				scrollToTop(400);
				navigate("/diagnostic/resultats", { state: payload });
			} else {
				toast.error("Une erreur est survenue lors du calcul des résultats");
			}
		} catch (error) {
			console.error("Erreur de calcul des scores v2:", error);
			toast.error("Une erreur est survenue lors du calcul des résultats");
		} finally {
			setSubmitting(false);
		}
	};

	if (loadingQuestions) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Chargement du diagnostic...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-[70px] bg-gray-50">
			<SEOHead
				title="Diagnostic gratuit - vitalCHECK"
				description="Obtenez en 5 à 7 minutes un score de santé organisationnelle gratuit pour votre entreprise, avec recommandations immédiates."
				keywords="diagnostic gratuit, score entreprise, santé organisationnelle, vitalCHECK, PME"
				url="/diagnostic"
			/>

			{step === "intro" && (
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="card"
					>
						<div className="flex items-center space-x-2 text-primary-600 mb-3">
							<Clock className="w-5 h-5" />
							<span className="text-sm font-medium">5 à 7 minutes</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
							Votre score de santé d'entreprise gratuit
						</h1>
						<p className="text-gray-600 mb-6">
							Répondez à 25 questions rapides réparties sur 5 piliers clés et
							obtenez instantanément votre score global, vos points forts et vos
							premières recommandations.
						</p>

						<form onSubmit={handleStart} className="space-y-5">
							<div>
								<label
									htmlFor="companyName"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Nom de l'entreprise *
								</label>
								<input
									type="text"
									id="companyName"
									name="companyName"
									value={formData.companyName}
									onChange={handleFormChange}
									className="input-field"
									placeholder="Ex: Ma Société SARL"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="companySize"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Taille de l'entreprise *
								</label>
								<select
									id="companySize"
									name="companySize"
									value={formData.companySize}
									onChange={handleFormChange}
									className="input-field"
									required
								>
									<option value="">Sélectionnez une taille</option>
									{COMPANY_SIZES.map((size) => (
										<option key={size.value} value={size.value}>
											{size.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor="sector"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Secteur d'activité (optionnel)
								</label>
								<select
									id="sector"
									name="sector"
									value={formData.sector}
									onChange={handleFormChange}
									className="input-field"
								>
									<option value="">Préférez ne pas préciser</option>
									{SECTORS.map((sector) => (
										<option key={sector.value} value={sector.value}>
											{sector.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Adresse email *
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleFormChange}
									className="input-field"
									placeholder="vous@entreprise.com"
									required
								/>
								<p className="text-xs text-gray-500 mt-1">
									Vos résultats s'affichent immédiatement. Cette adresse nous
									permettra de vous renvoyer votre rapport si besoin.
								</p>
							</div>

							<button type="submit" className="btn-primary w-full justify-center">
								Démarrer le diagnostic
							</button>
						</form>
					</motion.div>
				</div>
			)}

			{step === "questions" && currentQuestion && (
				<>
					<div className="bg-white shadow-sm">
						<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
							<div className="flex items-center justify-between">
								<span className="sm:text-lg font-bold text-gray-900">
									Diagnostic gratuit
								</span>
								<div className="text-lg text-gray-600">{formData.companyName}</div>
							</div>
						</div>
					</div>

					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<SimpleProgressBar
							current={currentIndex + 1}
							total={totalQuestions}
							pillars={pillarNames}
							currentPillarIndex={currentQuestion.pillarIndex}
						/>

						<AnimatePresence mode="wait">
							<motion.div
								key={currentIndex}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
							>
								<SimpleQuestionCard
									question={currentQuestion}
									pillarName={currentQuestion.pillarName}
									selectedAnswer={currentAnswer?.answer}
									onAnswerSelect={handleAnswerSelect}
								/>
							</motion.div>
						</AnimatePresence>

						<div className="flex items-center justify-between mt-8">
							<button
								onClick={handlePrevious}
								className="btn-outline flex items-center space-x-2"
							>
								<ArrowLeft className="w-4 h-4" />
								<span className="hidden sm:block">Précédent</span>
							</button>

							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<CheckCircle className="w-4 h-4" />
								<span>
									{answers.length} / {totalQuestions} réponses
								</span>
							</div>

							<button
								onClick={handleNext}
								disabled={!canProceed || submitting}
								className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{submitting ? (
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								) : (
									<>
										<span className="hidden sm:block">
											{isLastQuestion ? "Voir mes résultats" : "Suivant"}
										</span>
										<ArrowRight className="w-4 h-4" />
									</>
								)}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default SimplifiedAssessmentPage;
