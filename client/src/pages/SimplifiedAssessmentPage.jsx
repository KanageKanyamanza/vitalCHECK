import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { assessmentV2API } from "../services/api";
import DiagnosticQuestion from "../components/assessment/DiagnosticQuestion";
import DiagnosticProgress from "../components/assessment/DiagnosticProgress";
import DiagnosticHeader from "../components/assessment/DiagnosticHeader";
import DiagnosticIntro from "../components/assessment/DiagnosticIntro";
import { useAssessment } from "../context/AssessmentContext";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";
import { useClientAuth } from "../context/ClientAuthContext";

const PROGRESS_STORAGE_KEY = "vitalcheck-v2-progress";
const RESULT_STORAGE_KEY = "vitalcheck-v2-result";

// Types de questionnaires sectoriels supportés côté client (doit rester aligné
// avec SECTOR_QUESTIONNAIRES côté serveur dans assessmentsV2.js)
const SECTOR_QUESTIONNAIRE_TYPES = ["agriculture", "retail", "restaurant", "construction", "distribution", "export", "manufacturing"];

const SimplifiedAssessmentPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { scrollToTop } = useSmoothScroll();
	const { t, i18n } = useTranslation();
	const language = i18n.language?.substring(0, 2) || "fr";
	const { user } = useClientAuth();
	const { dispatch } = useAssessment();

	const requestedQuestionnaire = searchParams.get("questionnaire");
	const questionnaireType = SECTOR_QUESTIONNAIRE_TYPES.includes(requestedQuestionnaire)
		? requestedQuestionnaire
		: "universal";

	const [step, setStep] = useState("intro"); // 'intro' | 'questions'
	const [formData, setFormData] = useState({
		companyName: "",
		email: "",
		companySize: "",
		sector: "",
	});
	const [questionsData, setQuestionsData] = useState(null);
	const [sectorLevels, setSectorLevels] = useState(null); // niveaux spécifiques au secteur
	const [loadingQuestions, setLoadingQuestions] = useState(true);
	const [answers, setAnswers] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [submitting, setSubmitting] = useState(false);

	// Charger (ou recharger) les questions quand la langue ou le type de questionnaire change
	useEffect(() => {
		const loadQuestions = async () => {
			setLoadingQuestions(true);
			try {
				const response = await assessmentV2API.getQuestions(language, questionnaireType);
				if (response.data.success) {
					setQuestionsData(response.data.data);
					setSectorLevels(response.data.levels || null);
					setAnswers([]);
					setCurrentIndex(0);
				}
			} catch (error) {
				console.error("Erreur de chargement des questions v2:", error);
				toast.error(t("diagnostic.errors.loadFailed"));
			} finally {
				setLoadingQuestions(false);
			}
		};

		loadQuestions();
	}, [language, questionnaireType]);

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

	// Pré-remplir les champs depuis le profil utilisateur connecté
	useEffect(() => {
		if (!user) return;
		setFormData((prev) => ({
			companyName: prev.companyName || user.companyName || "",
			email: prev.email || user.email || "",
			companySize: prev.companySize || user.companySize || "",
			sector: prev.sector || user.sector || "",
		}));
	}, [user]);

	// Sauvegarder la progression à chaque changement
	useEffect(() => {
		try {
			sessionStorage.setItem(
				PROGRESS_STORAGE_KEY,
				JSON.stringify({ step, formData, answers, currentIndex, language }),
			);
		} catch {
			// Ignorer les erreurs d'écriture du stockage
		}
	}, [step, formData, answers, currentIndex, language]);

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
	const answeredIds = new Set(answers.map((a) => a.questionId));

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Le secteur choisi à l'accueil pilote le paramètre ?questionnaire= (qui recharge les questions)
	const handleSectorChange = (type) => {
		const next = new URLSearchParams(searchParams);
		if (type === "universal") next.delete("questionnaire");
		else next.set("questionnaire", type);
		setSearchParams(next, { replace: true });
	};

	const handleLanguageChange = (lang) => {
		dispatch({ type: "SET_LANGUAGE", payload: lang });
	};

	// Les champs sont validés par DiagnosticIntro avant l'appel
	const handleStart = () => {
		if (!questionsData) {
			toast.error(t("diagnostic.errors.noQuestions"));
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
				language,
				questionnaireType,
			});

			if (response.data.success) {
				const payload = {
					result: response.data.result,
					formData,
					answers,
					language,
					questionnaireType,
					...(sectorLevels ? { levels: sectorLevels } : {}),
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
				toast.error(t("diagnostic.errors.scoreError"));
			}
		} catch (error) {
			console.error("Erreur de calcul des scores v2:", error);
			toast.error(t("diagnostic.errors.scoreError"));
		} finally {
			setSubmitting(false);
		}
	};

	// Écran de chargement uniquement au tout premier chargement
	if (loadingQuestions && !questionsData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-ubb-brand-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true"></div>
					<p className="font-text text-ubb-ink-muted" role="status">{t("diagnostic.loading.questions")}</p>
				</div>
			</div>
		);
	}

	const headerTitle =
		questionnaireType === "universal"
			? t("diagnostic.questions.header")
			: t("diagnostic.header.titleSector", {
					sector: t(`landing.sectorCards.items.${questionnaireType}.name`),
				});

	return (
		<div className="min-h-screen bg-ubb-paper-soft">
			<SEOHead
				title={t("diagnostic.meta.title")}
				description={t("diagnostic.meta.description")}
				keywords="diagnostic gratuit, score entreprise, santé organisationnelle, vitalCHECK, PME"
				url="/diagnostic"
			/>

			{step === "intro" && (
				<>
					<DiagnosticHeader title={headerTitle} />
					<DiagnosticIntro
						questionnaireType={questionnaireType}
						onSectorChange={handleSectorChange}
						onLanguageChange={handleLanguageChange}
						formData={formData}
						onFormChange={handleFormChange}
						onStart={handleStart}
						questionsReady={!loadingQuestions && !!questionsData}
					/>
				</>
			)}

			{step === "questions" && currentQuestion && (
				<>
					<DiagnosticHeader title={headerTitle}>
						<DiagnosticProgress
							questions={flatQuestions}
							currentIndex={currentIndex}
							answeredIds={answeredIds}
							pillarNames={pillarNames}
						/>
					</DiagnosticHeader>

					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

						<AnimatePresence mode="wait">
							<motion.div
								key={currentIndex}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
							>
								<DiagnosticQuestion
									question={currentQuestion}
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
								<span className="hidden sm:block">{t("diagnostic.questions.previous")}</span>
							</button>

							<div className="flex items-center space-x-2 text-sm text-gray-500">
								<CheckCircle className="w-4 h-4" />
								<span>
									{t("diagnostic.questions.answers", {
										current: answers.length,
										total: totalQuestions,
									})}
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
											{isLastQuestion
												? t("diagnostic.questions.seeResults")
												: t("diagnostic.questions.next")}
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
