import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/ds";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { assessmentV2API } from "../services/api";
import DiagnosticQuestion from "../components/assessment/DiagnosticQuestion";
import DiagnosticProgress from "../components/assessment/DiagnosticProgress";
import PillarTransition from "../components/assessment/PillarTransition";
import AnalysisScreen from "../components/assessment/AnalysisScreen";
import DiagnosticHeader from "../components/assessment/DiagnosticHeader";
import DiagnosticIntro from "../components/assessment/DiagnosticIntro";
import { useAssessment } from "../context/AssessmentContext";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";
import { useClientAuth } from "../context/ClientAuthContext";

const PROGRESS_STORAGE_KEY = "vitalcheck-v2-progress";
const RESULT_STORAGE_KEY = "vitalcheck-v2-result";
// Transition d'une question à l'autre, dans le sens de la navigation
const questionVariants = {
	enter: (dir) => ({ opacity: 0, x: dir * 24 }),
	center: { opacity: 1, x: 0 },
	exit: (dir) => ({ opacity: 0, x: dir * -24 }),
};

// Durée minimale de l'écran d'analyse, pour qu'il ne se réduise pas à un flash
const MIN_ANALYSIS_MS = 1500;

// Délai avant le passage automatique à la question suivante (le temps de voir la sélection)
const AUTO_ADVANCE_MS = 450;

// Types de questionnaires sectoriels supportés côté client (doit rester aligné
// avec SECTOR_QUESTIONNAIRES côté serveur dans assessmentsV2.js)
const SECTOR_QUESTIONNAIRE_TYPES = ["agriculture", "retail", "restaurant", "construction", "distribution", "export", "manufacturing"];

// Progression interrompue (rafraîchissement, retour sur la page) : lue une seule fois,
// directement à l'initialisation des états, pour qu'aucune sauvegarde ne l'écrase avant.
const readSavedProgress = () => {
	try {
		return JSON.parse(sessionStorage.getItem(PROGRESS_STORAGE_KEY) || "null") || {};
	} catch {
		return {};
	}
};

const EMPTY_FORM = { companyName: "", email: "", companySize: "", sector: "" };

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

	const [saved] = useState(readSavedProgress);
	const [step, setStep] = useState(saved.step || "intro"); // 'intro' | 'questions' | 'analysis'
	const [formData, setFormData] = useState(saved.formData || EMPTY_FORM);
	const [questionsData, setQuestionsData] = useState(null);
	const [sectorLevels, setSectorLevels] = useState(null); // niveaux spécifiques au secteur
	const [loadingQuestions, setLoadingQuestions] = useState(true);
	const [answers, setAnswers] = useState(Array.isArray(saved.answers) ? saved.answers : []);
	const [currentIndex, setCurrentIndex] = useState(
		typeof saved.currentIndex === "number" ? saved.currentIndex : 0,
	);
	const [submitting, setSubmitting] = useState(false);
	const [direction, setDirection] = useState(1); // 1 : vers la suite, -1 : retour
	const [pillarBreak, setPillarBreak] = useState(null); // index du pilier qui vient d'être terminé
	const [analysisStatus, setAnalysisStatus] = useState("running"); // 'running' | 'error'
	const reduceMotion = useReducedMotion();
	const autoAdvanceRef = useRef(null);
	const answersRef = useRef(answers);
	answersRef.current = answers;

	// Annuler un passage automatique en attente si la page est quittée
	useEffect(() => () => clearTimeout(autoAdvanceRef.current), []);

	// Charger (ou recharger) les questions quand la langue ou le type de questionnaire change
	useEffect(() => {
		const loadQuestions = async () => {
			setLoadingQuestions(true);
			try {
				const response = await assessmentV2API.getQuestions(language, questionnaireType);
				if (response.data.success) {
					const data = response.data.data;
					const questionIds = new Set(
						data.pillars.flatMap((pillar) => pillar.questions.map((question) => question.id)),
					);
					setQuestionsData(data);
					setSectorLevels(response.data.levels || null);
					// Garder les réponses dont la question existe toujours : une reprise après
					// rafraîchissement ou un changement de langue (mêmes identifiants) ne perd rien ;
					// un changement de secteur (autres identifiants) repart de zéro.
					const kept = answersRef.current.filter((a) => questionIds.has(a.questionId));
					setAnswers(kept);
					setCurrentIndex((index) => (kept.length === 0 ? 0 : Math.min(index, questionIds.size - 1)));
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
				// L'analyse n'est jamais reprise telle quelle : après un rafraîchissement on revient aux questions
				JSON.stringify({ step: step === "analysis" ? "questions" : step, formData, answers, currentIndex, language }),
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

	const goToQuestion = (index, dir) => {
		clearTimeout(autoAdvanceRef.current);
		setPillarBreak(null);
		setDirection(dir);
		setCurrentIndex(index);
		window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
	};

	// Vers la question suivante, avec une respiration quand un pilier se termine
	const goForwardFrom = (index) => {
		const here = flatQuestions[index];
		const next = flatQuestions[index + 1];
		if (here && next && next.pillarIndex !== here.pillarIndex) {
			clearTimeout(autoAdvanceRef.current);
			setDirection(1);
			setPillarBreak(here.pillarIndex);
			window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
		} else {
			goToQuestion(index + 1, 1);
		}
	};

	const handleAnswerSelect = (questionId, value, { viaPointer = false } = {}) => {
		setAnswers((prev) => {
			const existing = prev.findIndex((a) => a.questionId === questionId);
			if (existing >= 0) {
				const updated = [...prev];
				updated[existing] = { questionId, answer: value };
				return updated;
			}
			return [...prev, { questionId, answer: value }];
		});

		// Au doigt ou à la souris : passage automatique à la suite après un court instant
		// (le temps de voir la sélection). Jamais sur la dernière question ni au clavier.
		clearTimeout(autoAdvanceRef.current);
		if (viaPointer && !isLastQuestion) {
			autoAdvanceRef.current = setTimeout(() => goForwardFrom(currentIndex), AUTO_ADVANCE_MS);
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			goToQuestion(currentIndex - 1, -1);
		} else {
			clearTimeout(autoAdvanceRef.current);
			setStep("intro");
		}
	};

	const handleNext = () => {
		if (!canProceed) return;

		if (currentIndex < totalQuestions - 1) {
			goForwardFrom(currentIndex);
		} else {
			handleSubmit();
		}
	};

	// Entrée valide la question (hors boutons, qui gèrent déjà Entrée)
	const handleQuestionKeyDown = (e) => {
		if (e.key === "Enter" && e.target.tagName !== "BUTTON" && canProceed) {
			e.preventDefault();
			handleNext();
		}
	};

	const handleSubmit = async () => {
		if (submitting) return;

		setSubmitting(true);
		setAnalysisStatus("running");
		setStep("analysis");
		window.scrollTo({ top: 0 });
		try {
			const [response] = await Promise.all([
				assessmentV2API.scoreAssessment({
					answers,
					language,
					questionnaireType,
				}),
				new Promise((resolve) => setTimeout(resolve, MIN_ANALYSIS_MS)),
			]);

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
				setAnalysisStatus("error");
			}
		} catch (error) {
			console.error("Erreur de calcul des scores v2:", error);
			// Les réponses restent en mémoire et dans la session : l'écran propose de réessayer
			setAnalysisStatus("error");
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

					{/* pb : laisser la place à la barre d'action fixée en bas sur mobile */}
					<div className="ubb-container max-w-3xl pb-32 pt-6 sm:pb-12 sm:pt-10" onKeyDown={handleQuestionKeyDown}>
						<AnimatePresence mode="wait" initial={false} custom={direction}>
							<motion.div
								key={pillarBreak !== null ? `break-${pillarBreak}` : currentQuestion.id}
								custom={direction}
								variants={questionVariants}
								initial={reduceMotion ? false : "enter"}
								animate="center"
								exit={reduceMotion ? undefined : "exit"}
								transition={{ duration: 0.22, ease: "easeOut" }}
							>
								{pillarBreak !== null ? (
									<PillarTransition
										pillarIndex={pillarBreak}
										pillarNames={pillarNames}
										nextPillarQuestionCount={
											flatQuestions.filter((q) => q.pillarIndex === pillarBreak + 1).length
										}
										onContinue={() => goToQuestion(currentIndex + 1, 1)}
										onBack={() => {
											setDirection(-1);
											setPillarBreak(null);
										}}
									/>
								) : (
									<DiagnosticQuestion
										question={currentQuestion}
										selectedAnswer={currentAnswer?.answer}
										onAnswerSelect={handleAnswerSelect}
									/>
								)}
							</motion.div>
						</AnimatePresence>

						{pillarBreak === null && currentIndex === 0 && !canProceed && (
							<p className="mt-4 text-center font-text text-ubb-small text-ubb-ink-muted">
								{t("diagnostic.questions.hint")}
							</p>
						)}

						{/* Navigation : barre fixée en bas sur mobile (zone du pouce), sous la carte au-delà */}
						{pillarBreak === null && (
							<div className="fixed inset-x-0 bottom-0 z-30 border-t border-ubb-brand-900/[0.08] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:pb-0 sm:backdrop-blur-none">
								<div className="ubb-container flex items-center gap-3 py-3 sm:px-0 sm:py-0">
									<Button variant="outline" onClick={handlePrevious} className="shrink-0">
										<ArrowLeft className="h-4 w-4" aria-hidden="true" />
										{t("diagnostic.questions.previous")}
									</Button>
									<Button
										variant="secondary"
										onClick={handleNext}
										disabled={!canProceed || submitting}
										className="flex-1 sm:ml-auto sm:flex-none"
									>
										{isLastQuestion ? t("diagnostic.questions.seeResults") : t("diagnostic.questions.next")}
										<ArrowRight className="h-4 w-4" aria-hidden="true" />
									</Button>
								</div>
							</div>
						)}
					</div>
				</>
			)}

			{step === "analysis" && (
				<>
					<DiagnosticHeader title={headerTitle} />
					<div className="ubb-container max-w-3xl py-8 sm:py-12">
						<AnalysisScreen
							status={analysisStatus}
							answeredCount={answers.length}
							onRetry={handleSubmit}
							onBack={() => setStep("questions")}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default SimplifiedAssessmentPage;
