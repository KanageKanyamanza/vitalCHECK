const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Assessment = require("../models/Assessment");
const questionsDataV2 = require("../data/questions-v2");
const {
	calculateScoresV2,
	generateRecommendationsV2,
	getLevelLabel,
	rankPillars,
} = require("../utils/scoringV2");
const { generateV2PDFReport, generatePremiumV2PDFReport } = require("../utils/pdfGeneratorV2");
const { sendV2ResultEmail } = require("../utils/emailService");
const { notifyAdminRegistration, notifyAdminReportPrinted } = require("../utils/adminNotificationService");
const { generatePremiumInsights } = require("../utils/aiInsightsService");
const { authenticateClient } = require("../middleware/auth");
const { checkSubscription } = require("../middleware/checkSubscription");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Le contenu anglais sera ajouté en phase 2 : on retombe sur le français en attendant
const getQuestionsDataV2 = (language) => {
	if (language === "en" && questionsDataV2.en && questionsDataV2.en.pillars && questionsDataV2.en.pillars.length > 0) {
		return questionsDataV2.en;
	}
	return questionsDataV2.fr;
};

// Retire les champs internes (recommandations) avant d'envoyer les questions au client
const sanitizeQuestionsForClient = (data) => ({
	pillars: data.pillars.map((pillar) => ({
		id: pillar.id,
		name: pillar.name,
		questions: pillar.questions.map((question) => ({
			id: question.id,
			text: question.text,
			options: question.options.map((option) => ({
				value: option.value,
				shortLabel: option.shortLabel,
				label: option.label,
			})),
		})),
	})),
});

// GET /api/assessments-v2/questions?lang=fr
router.get("/questions", (req, res) => {
	try {
		const { lang = "fr" } = req.query;
		const data = getQuestionsDataV2(lang);

		res.json({
			success: true,
			data: sanitizeQuestionsForClient(data),
			language: questionsDataV2.en?.pillars?.length > 0 && lang === "en" ? "en" : "fr",
		});
	} catch (error) {
		console.error("Get v2 questions error:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
});

// POST /api/assessments-v2/score - calcul sans persistance (sans compte requis)
router.post(
	"/score",
	[body("answers").isArray({ min: 1 }), body("language").optional().isString()],
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { answers, language = "fr" } = req.body;
			const questionsData = getQuestionsDataV2(language);

			const { pillarScores, overallScore, overallLevel } = calculateScoresV2(answers, questionsData);
			const recommendations = generateRecommendationsV2(answers, pillarScores, questionsData);
			const { weakest, strongest } = rankPillars(pillarScores);

			res.json({
				success: true,
				result: {
					pillarScores,
					overallScore,
					overallLevel,
					overallLevelLabel: getLevelLabel(overallLevel, language),
					recommendations,
					weakest,
					strongest,
				},
			});
		} catch (error) {
			console.error("Score v2 assessment error:", error);
			res.status(500).json({
				success: false,
				message: "Server error during score calculation",
			});
		}
	},
);

// POST /api/assessments-v2/save - persiste le résultat, crée/lie un compte, génère le PDF et envoie l'email
router.post(
	"/save",
	[
		body("answers").isArray({ min: 1 }),
		body("language").optional().isString(),
		body("companyName").trim().isLength({ min: 2 }),
		body("email").isEmail().normalizeEmail(),
		body("companySize").isIn(["micro", "sme", "large-sme"]),
		body("sector").optional().trim(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const {
				answers,
				language = "fr",
				companyName,
				email,
				companySize,
				sector,
			} = req.body;

			const questionsData = getQuestionsDataV2(language);

			// Recalcul des scores côté serveur (ne pas faire confiance au score envoyé par le client)
			const { pillarScores, overallScore, overallLevel } = calculateScoresV2(answers, questionsData);
			const recommendations = generateRecommendationsV2(answers, pillarScores, questionsData);

			// Si l'utilisateur est déjà connecté (JWT présent), lier à son compte existant
			// Évite la création d'un doublon quand la normalisation email diverge (ex: Gmail dots)
			let user = null;
			let accountCreated = false;
			let tempPassword = null;

			const authHeader = req.headers.authorization;
			if (authHeader) {
				try {
					const token = authHeader.split(" ")[1];
					const decoded = jwt.verify(token, process.env.JWT_SECRET);
					if (decoded.userId) {
						user = await User.findById(decoded.userId);
					}
				} catch {
					// Token invalide ou expiré → fallback sur la recherche par email
				}
			}

			if (!user) {
				// Recherche par email insensible à la casse (sans normalisation Gmail agressive)
				user = await User.findOne({ email: { $regex: new RegExp(`^${email.replace(/[.+*?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
			}

			if (!user) {
				user = new User({
					email,
					companyName,
					companySize,
					sector: sector || "other",
				});
				tempPassword = user.generateTempPassword();
				user.password = tempPassword;
				user.tempPassword = tempPassword;
				user.hasAccount = true;
				user.accountCreatedAt = new Date();
				await user.save();
				accountCreated = true;
				notifyAdminRegistration(user).catch(err => console.error('[notify] registration:', err.message));
			}

			const assessment = new Assessment({
				version: "v2",
				user: user._id,
				answers,
				pillarScores: pillarScores.map((pillar, index) => ({
					pillarId: pillar.pillarId,
					pillarName: pillar.pillarName,
					score: pillar.score,
					level: pillar.level,
					recommendations: recommendations[index].recommendations,
				})),
				overallScore,
				overallLevel,
				companyName,
				email,
				companySize,
				sector: sector || undefined,
				language,
				status: "completed",
				completedAt: new Date(),
				totalQuestions: answers.length,
			});

			await assessment.save();

			await User.findByIdAndUpdate(user._id, { $push: { assessments: assessment._id } });

			// Génération du rapport PDF (2 pages, style Cerclos)
			let pdfBuffer = null;
			try {
				pdfBuffer = await generateV2PDFReport({
					companyName,
					companySize,
					sector,
					language,
					pillarScores,
					overallScore,
					overallLevel,
					recommendations,
					completedAt: assessment.completedAt,
				});

				assessment.pdfBuffer = pdfBuffer;
				assessment.pdfGeneratedAt = new Date();
				assessment.reportGenerated = true;
				await assessment.save();
				notifyAdminReportPrinted(user, assessment).catch(err => console.error('[notify] report_printed:', err.message));
			} catch (pdfError) {
				console.error("V2 PDF generation error:", pdfError);
			}

			// Envoi de l'email avec le PDF en pièce jointe + lien vers les résultats
			try {
				const resultsUrl = `${process.env.CLIENT_URL || "https://checkmyenterprise.com"}/diagnostic/resultats?assessmentId=${assessment._id}`;
				await sendV2ResultEmail(
					email,
					companyName,
					overallScore,
					getLevelLabel(overallLevel, language),
					overallLevel,
					resultsUrl,
					pdfBuffer,
					language,
				);
			} catch (emailError) {
				console.error("V2 result email error:", emailError);
			}

			// Issue a JWT for new accounts so the client can authenticate payment requests
			let clientToken;
			if (accountCreated) {
				clientToken = jwt.sign(
					{ userId: user._id },
					process.env.JWT_SECRET,
					{ expiresIn: "7d" }
				);
			}

			res.status(201).json({
				success: true,
				assessment: {
					id: assessment._id,
					overallScore,
					overallLevel,
					overallLevelLabel: getLevelLabel(overallLevel, language),
					pillarScores: assessment.pillarScores,
					completedAt: assessment.completedAt,
				},
				account: {
					created: accountCreated,
					email: user.email,
				},
				...(clientToken && { clientToken }),
			});
		} catch (error) {
			console.error("Save v2 assessment error:", error);
			res.status(500).json({
				success: false,
				message: "Server error during assessment save",
			});
		}
	},
);

// GET /api/assessments-v2/:assessmentId - récupération d'un résultat sauvegardé
router.get("/:assessmentId", async (req, res) => {
	try {
		const assessment = await Assessment.findById(req.params.assessmentId).select("-pdfBuffer");

		if (!assessment || assessment.version !== "v2") {
			return res.status(404).json({
				success: false,
				message: "Assessment not found",
			});
		}

		res.json({
			success: true,
			assessment,
		});
	} catch (error) {
		console.error("Get v2 assessment error:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
});

// GET /api/assessments-v2/:assessmentId/pdf - téléchargement du PDF généré
router.get("/:assessmentId/pdf", async (req, res) => {
	try {
		const assessment = await Assessment.findById(req.params.assessmentId);

		if (!assessment || assessment.version !== "v2" || !assessment.pdfBuffer) {
			return res.status(404).json({
				success: false,
				message: "PDF not found for this assessment",
			});
		}

		res.set({
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename="vitalCHECK-diagnostic-niveau1.pdf"`,
		});
		res.send(assessment.pdfBuffer);
	} catch (error) {
		console.error("Get v2 PDF error:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
});

// GET /api/assessments-v2/:assessmentId/pdf/premium — rapport enrichi IA (abonnement actif requis)
router.get(
	"/:assessmentId/pdf/premium",
	authenticateClient,
	checkSubscription('paid'),
	async (req, res) => {
		try {
			const assessment = await Assessment.findById(req.params.assessmentId);

			if (!assessment || assessment.version !== "v2") {
				return res.status(404).json({ success: false, message: "Assessment not found" });
			}

			// Vérifier que l'assessment appartient à l'utilisateur authentifié
			if (!assessment.user || assessment.user.toString() !== req.user._id.toString()) {
				return res.status(403).json({ success: false, message: "Access denied" });
			}

			// Récupérer ou générer les insights IA (cache dans premiumInsights)
			let premiumInsights = assessment.premiumInsights;
			if (!premiumInsights || premiumInsights.fallback === true) {
				premiumInsights = await generatePremiumInsights(assessment);
				assessment.premiumInsights = premiumInsights;
				await assessment.save();
			}

			// Générer le PDF premium (rapport standard + page IA)
			const pdfData = {
				companyName: assessment.companyName,
				companySize: assessment.companySize,
				sector: assessment.sector,
				language: assessment.language,
				pillarScores: assessment.pillarScores,
				overallScore: assessment.overallScore,
				overallLevel: assessment.overallLevel,
				recommendations: assessment.pillarScores.map((p) => ({
					pillarId: p.pillarId,
					pillarName: p.pillarName,
					recommendations: p.recommendations || [],
				})),
				completedAt: assessment.completedAt,
			};

			const pdfBuffer = await generatePremiumV2PDFReport(pdfData, premiumInsights);

			res.set({
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="vitalCHECK-rapport-premium.pdf"`,
			});
			res.send(pdfBuffer);
		} catch (error) {
			console.error("Premium PDF error:", error);
			res.status(500).json({ success: false, message: "Server error" });
		}
	}
);

module.exports = router;
