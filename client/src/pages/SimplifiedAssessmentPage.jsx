import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { assessmentV2API } from "../services/api";
import { SimpleQuestionCard, SimpleProgressBar } from "../components/assessment";
import { LanguageSelector } from "../components/ui";
import useSmoothScroll from "../hooks/useSmoothScroll";
import SEOHead from "../components/seo/SEOHead";

const PROGRESS_STORAGE_KEY = "vitalcheck-v2-progress";
const RESULT_STORAGE_KEY = "vitalcheck-v2-result";

const SimplifiedAssessmentPage = () => {
	const navigate = useNavigate();
	const { scrollToTop } = useSmoothScroll();
	const { t, i18n } = useTranslation();
	const language = i18n.language?.substring(0, 2) || "fr";

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

	// Charger (ou recharger) les questions quand la langue change
	useEffect(() => {
		const loadQuestions = async () => {
			setLoadingQuestions(true);
			try {
				const response = await assessmentV2API.getQuestions(language);
				if (response.data.success) {
					setQuestionsData(response.data.data);
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
	}, [language]);

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

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleStart = (e) => {
		e.preventDefault();

		if (!formData.companyName.trim() || !formData.email.trim() || !formData.companySize) {
			toast.error(t("diagnostic.errors.requiredFields"));
			return;
		}

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
			});

			if (response.data.success) {
				const payload = {
					result: response.data.result,
					formData,
					answers,
					language,
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

	if (loadingQuestions) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">{t("diagnostic.loading.questions")}</p>
				</div>
			</div>
		);
	}

	const companySizes = [
		{ value: "micro", label: t("diagnostic.sizes.micro") },
		{ value: "sme", label: t("diagnostic.sizes.sme") },
		{ value: "large-sme", label: t("diagnostic.sizes.large-sme") },
	];

	const sectors = [
		{ value: "technology", label: t("diagnostic.sectors.technology") },
		{ value: "commerce", label: t("diagnostic.sectors.commerce") },
		{ value: "services", label: t("diagnostic.sectors.services") },
		{ value: "manufacturing", label: t("diagnostic.sectors.manufacturing") },
		{ value: "agriculture", label: t("diagnostic.sectors.agriculture") },
		{ value: "healthcare", label: t("diagnostic.sectors.healthcare") },
		{ value: "education", label: t("diagnostic.sectors.education") },
		{ value: "finance", label: t("diagnostic.sectors.finance") },
		{ value: "other", label: t("diagnostic.sectors.other") },
	];

	return (
		<div className="min-h-screen py-[70px] bg-gray-50">
			<SEOHead
				title={t("diagnostic.meta.title")}
				description={t("diagnostic.meta.description")}
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
							<span className="text-sm font-medium">
								{t("diagnostic.intro.duration")} · {t("diagnostic.intro.free")}
							</span>
						</div>
						<h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
							{t("diagnostic.intro.title")}
						</h1>
						<p className="text-gray-600 mb-6">
							{t("diagnostic.intro.subtitle")}
						</p>

						<form onSubmit={handleStart} className="space-y-5">
							<div>
								<label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
									{t("diagnostic.intro.companyName")} *
								</label>
								<input
									type="text"
									id="companyName"
									name="companyName"
									value={formData.companyName}
									onChange={handleFormChange}
									className="input-field"
									placeholder={t("diagnostic.intro.companyNamePlaceholder")}
									required
								/>
							</div>

							<div>
								<label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
									{t("diagnostic.intro.companySize")} *
								</label>
								<select
									id="companySize"
									name="companySize"
									value={formData.companySize}
									onChange={handleFormChange}
									className="input-field"
									required
								>
									<option value="">{t("diagnostic.intro.companySizePlaceholder")}</option>
									{companySizes.map((size) => (
										<option key={size.value} value={size.value}>
											{size.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
									{t("diagnostic.intro.sector")} {t("common.optional")}
								</label>
								<select
									id="sector"
									name="sector"
									value={formData.sector}
									onChange={handleFormChange}
									className="input-field"
								>
									<option value="">{t("diagnostic.intro.sectorPlaceholder")}</option>
									{sectors.map((sector) => (
										<option key={sector.value} value={sector.value}>
											{sector.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
									{t("diagnostic.intro.email")} *
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleFormChange}
									className="input-field"
									placeholder={t("diagnostic.intro.emailPlaceholder")}
									required
								/>
								<p className="text-xs text-gray-500 mt-1">
									{t("diagnostic.intro.emailHint")}
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									{t("diagnostic.intro.language")}
								</label>
								<LanguageSelector />
							</div>

							<button type="submit" className="btn-primary w-full justify-center">
								{t("diagnostic.intro.startButton")}
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
									{t("diagnostic.questions.header")}
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
