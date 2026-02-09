import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAssessment } from "../context/AssessmentContext";
import { assessmentAPI } from "../services/api";
import toast from "react-hot-toast";
import {
	ProgressBar,
	QuestionCard,
	SubmissionProgress,
} from "../components/assessment";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";
import { getAssessmentPageStructuredData } from "../utils/seoData";

const AssessmentPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { scrollToTop } = useSmoothScroll();
	const {
		user,
		questions,
		currentQuestionIndex,
		answers,
		loading,
		language,
		assessmentId,
		dispatch,
	} = useAssessment();

	const [submitting, setSubmitting] = useState(false);
	const [submissionStep, setSubmissionStep] = useState(null);
	const [submissionError, setSubmissionError] = useState(null);
	const [submissionId] = useState(
		() => `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
	);

	useEffect(() => {
		if (!user) {
			navigate("/");
			return;
		}

		loadQuestions();
		createDraftAssessment();
	}, [user, navigate]);

	const createDraftAssessment = async () => {
		try {
			const response = await assessmentAPI.createDraft({
				userId: user.id,
				language,
			});

			if (response.data.success) {
				const { assessment } = response.data;

				dispatch({ type: "SET_ASSESSMENT_ID", payload: assessment.id });
				dispatch({ type: "SET_RESUME_TOKEN", payload: assessment.resumeToken });

				// Si on a des réponses existantes, les charger
				if (assessment.answers && assessment.answers.length > 0) {
					assessment.answers.forEach((answer) => {
						dispatch({
							type: "SET_ANSWER",
							payload: { questionId: answer.questionId, answer: answer.answer },
						});
					});
					dispatch({
						type: "SET_CURRENT_QUESTION_INDEX",
						payload: assessment.currentQuestionIndex,
					});
				}
			}
		} catch (error) {
			// Ne pas bloquer l'évaluation si la création du draft échoue
		}
	};

	const saveProgress = async () => {
		try {
			if (!assessmentId) {
				return;
			}

			await assessmentAPI.saveProgress(assessmentId, {
				answers,
				currentQuestionIndex,
			});
		} catch (error) {
			// Ne pas bloquer l'évaluation si la sauvegarde échoue
		}
	};

	const loadQuestions = async () => {
		try {
			dispatch({ type: "SET_LOADING", payload: true });
			console.log(
				`📡 [Frontend] Fetching questions for sector: ${user?.sector} (Lang: ${language})`,
			);

			const response = await assessmentAPI.getQuestions(language, user?.sector);

			if (response.data.success) {
				console.log("✅ [Frontend] Questions loaded successfully from API");
				dispatch({ type: "SET_QUESTIONS", payload: response.data.data });
			} else {
				throw new Error(response.data.message || "Failed to load questions");
			}
		} catch (error) {
			console.error("❌ [Frontend] Error loading questions:", error);
			toast.error("Erreur lors du chargement des questions");
			dispatch({
				type: "SET_ERROR",
				payload: "Impossible de charger les questions.",
			});
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	};

	const getCurrentQuestion = () => {
		if (!questions?.pillars) return null;

		let questionIndex = 0;
		for (const pillar of questions.pillars) {
			for (const question of pillar.questions) {
				if (questionIndex === currentQuestionIndex) {
					return {
						...question,
						pillarName: pillar.name,
						pillarId: pillar.id,
					};
				}
				questionIndex++;
			}
		}
		return null;
	};

	const getTotalQuestions = () => {
		return (
			questions?.pillars?.reduce(
				(total, pillar) => total + pillar.questions.length,
				0,
			) || 0
		);
	};

	const handleAnswerSelect = (questionId, score) => {
		dispatch({
			type: "SET_ANSWER",
			payload: { questionId, answer: score },
		});

		// Sauvegarder automatiquement la progression
		saveProgress();
	};

	const handleNext = () => {
		const totalQuestions = getTotalQuestions();
		if (currentQuestionIndex < totalQuestions - 1) {
			dispatch({ type: "NEXT_QUESTION" });
			// Sauvegarder la progression après changement de question
			saveProgress();
		} else {
			handleSubmit();
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			dispatch({ type: "PREVIOUS_QUESTION" });
		}
	};

	const handleSubmit = async () => {
		// Protection contre les soumissions multiples
		if (submitting) {
			return;
		}

		// Filtrer les réponses pour ne garder que celles qui correspondent aux questions actuelles
		const validAnswers = answers.filter((a) =>
			questions?.pillars?.some((p) =>
				p.questions.some((q) => q.id === a.questionId),
			),
		);

		if (validAnswers.length !== getTotalQuestions()) {
			toast.error("Veuillez répondre à toutes les questions");
			return;
		}

		setSubmitting(true);
		setSubmissionError(null);
		setSubmissionStep("validating");

		try {
			// Étape 1: Validation
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSubmissionStep("calculating");

			// Étape 2: Calcul des scores
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setSubmissionStep("generating");

			// Étape 3: Génération du rapport
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setSubmissionStep("saving");

			// Étape 4: Soumission réelle
			const response = await assessmentAPI.submitAssessment({
				userId: user.id,
				answers: validAnswers,
				language,
				submissionId, // Ajouter l'ID de soumission pour éviter les doublons
			});

			if (response.data.success) {
				setSubmissionStep("complete");

				// Attendre un peu pour montrer la completion
				await new Promise((resolve) => setTimeout(resolve, 1000));

				dispatch({ type: "SET_ASSESSMENT", payload: response.data.assessment });
				toast.success("Évaluation terminée avec succès !");

				// Scroll smooth vers le haut avant la navigation
				scrollToTop(500);

				// Attendre un peu pour que le scroll se termine
				await new Promise((resolve) => setTimeout(resolve, 300));

				navigate("/results");
			}
		} catch (error) {
			console.error("Submission error:", error);

			// Gestion spéciale pour les soumissions multiples
			if (error.response?.status === 429) {
				const existingAssessment = error.response.data.existingAssessment;
				if (existingAssessment) {
					setSubmissionError({
						message:
							"Une évaluation a déjà été soumise récemment. Redirection vers vos résultats...",
						existingAssessment,
					});
					toast.error("Évaluation déjà soumise - Redirection en cours...");

					// Redirection immédiate vers les résultats
					dispatch({
						type: "SET_ASSESSMENT",
						payload: { id: existingAssessment.id },
					});
					navigate("/results");
					return;
				}
			}

			setSubmissionError({
				message:
					error.response?.data?.message ||
					"Une erreur est survenue lors de la soumission",
			});
			toast.error("Erreur lors de la soumission de l'évaluation");
		} finally {
			setSubmitting(false);
		}
	};

	const handleRetry = () => {
		setSubmissionError(null);
		setSubmissionStep(null);
		handleSubmit();
	};

	const getCurrentAnswer = () => {
		const currentQuestion = getCurrentQuestion();
		if (!currentQuestion) return null;

		return answers.find((answer) => answer.questionId === currentQuestion.id);
	};

	const isLastQuestion = currentQuestionIndex === getTotalQuestions() - 1;
	const currentAnswer = getCurrentAnswer();
	const canProceed = currentAnswer !== null;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Chargement des questions...</p>
					<p className="text-sm text-gray-500 mt-2">
						Si ce chargement prend trop de temps, vérifiez que le serveur
						backend est démarré
					</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 btn-outline text-sm"
					>
						Recharger la page
					</button>
				</div>
			</div>
		);
	}

	const handleReset = () => {
		dispatch({ type: "RESET_ASSESSMENT" });
		dispatch({ type: "CLEAR_STORAGE" });
		window.location.reload();
	};

	if (!questions || getTotalQuestions() === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">
						{getTotalQuestions() === 0 ?
							"Aucune question trouvée pour votre secteur."
						:	t("common.error")}
					</p>
					<div className="space-x-4">
						<button onClick={() => navigate("/")} className="btn-outline">
							{t("navigation.home")}
						</button>
						<button onClick={handleReset} className="btn-primary">
							Réinitialiser l'évaluation
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-[70px] bg-gray-50">
			<SEOHead
				title="Évaluation de Santé d'Entreprise - vitalCHECK"
				description="Commencez votre évaluation gratuite de santé d'entreprise avec vitalCHECK. Diagnostic complet en 10 minutes avec recommandations personnalisées."
				keywords="évaluation entreprise, diagnostic business, santé organisationnelle, vitalCHECK, PME, startup, conseil"
				url="/assessment"
				structuredData={getAssessmentPageStructuredData()}
			/>

			{/* Submission Progress Modal */}
			{submitting && (
				<SubmissionProgress
					currentStep={submissionStep}
					error={submissionError}
					onRetry={handleRetry}
				/>
			)}

			{/* Progress Bar */}
			<div className="bg-white shadow-sm">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<span className="sm:text-lg font-bold text-gray-900">
								{t("assessment.title")}
							</span>
						</div>
						<div className="text-lg text-gray-600">{user?.companyName}</div>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Progress Bar */}
				<ProgressBar
					current={currentQuestionIndex + 1}
					total={getTotalQuestions()}
				/>

				{/* Question */}
				<AnimatePresence mode="wait">
					<motion.div
						key={currentQuestionIndex}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
					>
						<QuestionCard
							question={getCurrentQuestion()}
							selectedAnswer={currentAnswer?.answer}
							onAnswerSelect={handleAnswerSelect}
						/>
					</motion.div>
				</AnimatePresence>

				{/* Navigation */}
				<div className="flex items-center justify-between mt-8">
					<button
						onClick={handlePrevious}
						disabled={currentQuestionIndex === 0}
						className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ArrowLeft className="w-4 h-4" />
						<span className="hidden sm:block">{t("common.previous")}</span>
					</button>

					<div className="flex items-center space-x-2 text-sm text-gray-500">
						<CheckCircle className="w-4 h-4" />
						<span>
							{questions?.pillars ?
								answers.filter((a) =>
									questions.pillars.some((p) =>
										p.questions.some((q) => q.id === a.questionId),
									),
								).length
							:	0}{" "}
							/ {getTotalQuestions()} {t("assessment.responses")}
						</span>
					</div>

					<button
						onClick={handleNext}
						disabled={!canProceed || submitting}
						className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
						title={submitting ? "Soumission en cours..." : ""}
					>
						{submitting ?
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						:	<>
								<span className="hidden sm:block">
									{isLastQuestion ? t("common.finish") : t("common.next")}
								</span>
								<ArrowRight className="w-4 h-4" />
							</>
						}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AssessmentPage;
