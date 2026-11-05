const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { buildClientConfig } = require("../utils/f1Losses");

const router = express.Router();

const PAID_PLANS = ["standard", "premium", "diagnostic"];

// Même règle que checkSubscription('paid'), en lecture seule : l'absence d'abonnement
// donne l'accès gratuit au lieu d'une erreur 403.
const hasActivePaidPlan = (user) => {
	const sub = user?.team?.subscription || user?.subscription;
	if (!sub || sub.status !== "active") return false;
	if (sub.endDate && sub.endDate < new Date()) return false;
	return PAID_PLANS.includes(sub.plan);
};

// Authentification facultative : un jeton absent ou invalide = utilisateur gratuit
const resolvePaidAccess = async (req) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return false;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("subscription team").populate("team");
		return hasActivePaidPlan(user);
	} catch {
		return false;
	}
};

// POST /api/f1/config — configuration du calculateur, filtrée selon l'abonnement vérifié ici.
// Reçoit uniquement le type de questionnaire et les réponses au diagnostic (0 / 2 / 4) pour
// la pré-sélection ; aucun chiffre saisi dans le calculateur n'est envoyé.
router.post(
	"/config",
	[
		body("questionnaireType").optional().isString().isLength({ max: 40 }),
		body("answers").optional().isArray({ max: 60 }),
		body("answers.*.questionId").isString().isLength({ max: 80 }),
		body("answers.*.answer").isInt({ min: 0, max: 4 }).toInt(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		try {
			const isPaid = await resolvePaidAccess(req);
			const answers = (req.body.answers || []).map(({ questionId, answer }) => ({ questionId, answer }));
			const config = buildClientConfig({ questionnaireType: req.body.questionnaireType, answers, isPaid });
			res.set("Cache-Control", "private, no-store");
			res.json({ success: true, config });
		} catch (error) {
			console.error("F1 config error:", error);
			res.status(500).json({ success: false, message: "Server error" });
		}
	},
);

module.exports = router;
module.exports.hasActivePaidPlan = hasActivePaidPlan;
