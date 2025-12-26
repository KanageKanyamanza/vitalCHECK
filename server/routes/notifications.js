const express = require("express");
const router = express.Router();
const PushSubscription = require("../models/PushSubscription");
const { sendPushNotification } = require("../utils/pushService");
const { body, validationResult } = require("express-validator");

/**
 * @route POST /api/notifications/subscribe
 * @desc Enregistrer un nouvel abonnement push pour un utilisateur
 */
router.post(
	"/subscribe",
	[
		body("subscription").isObject(),
		body("userId").isMongoId(),
		body("device").optional().isObject(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const { subscription, userId, device } = req.body;

			// Vérifier si cet endpoint existe déjà pour cet utilisateur
			let pushSub = await PushSubscription.findOne({
				"subscription.endpoint": subscription.endpoint,
			});

			if (pushSub) {
				// Mettre à jour l'utilisateur associé si nécessaire
				pushSub.user = userId;
				if (device) pushSub.device = device;
				await pushSub.save();
			} else {
				// Créer un nouvel abonnement
				pushSub = new PushSubscription({
					user: userId,
					subscription,
					device,
				});
				await pushSub.save();
			}

			res.status(201).json({
				success: true,
				message: "Abonnement push enregistré avec succès",
			});
		} catch (error) {
			console.error("Error in /subscribe:", error);
			res.status(500).json({ success: false, message: "Erreur serveur" });
		}
	}
);

/**
 * @route POST /api/notifications/test
 * @desc Envoyer une notification de test à l'utilisateur
 */
router.post("/test", async (req, res) => {
	try {
		const { userId } = req.body;
		if (!userId) return res.status(400).json({ message: "userId requis" });

		await sendPushNotification(userId, {
			title: "vitalCHECK - Test réussi !",
			body: "Ceci est une notification de test pour vérifier que tout fonctionne.",
			data: { url: "/" },
		});

		res.json({ success: true, message: "Notification de test envoyée" });
	} catch (error) {
		console.error("Error in /test push:", error);
		res.status(500).json({ success: false, message: "Erreur" });
	}
});

module.exports = router;
