const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription");
const Notification = require("../models/Notification");
require("dotenv").config();

// Configuration de web-push avec les clés VAPID
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
	webpush.setVapidDetails(
		"mailto:info@checkmyenterprise.com",
		process.env.VAPID_PUBLIC_KEY,
		process.env.VAPID_PRIVATE_KEY
	);
	console.log("✅ Web-Push configuré avec succès");
} else {
	console.warn("⚠️ Clés VAPID manquantes dans le fichier .env");
}

/**
 * Envoie une notification push à un utilisateur spécifique
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} payload - Contenu de la notification (title, body, etc.)
 */
const sendPushNotification = async (userId, payload) => {
	try {
		const subscriptions = await PushSubscription.find({ user: userId });

		if (!subscriptions || subscriptions.length === 0) {
			console.log(
				`ℹ️ Aucune souscription push trouvée pour l'utilisateur ${userId}`
			);
			return;
		}

		const notificationPayload = JSON.stringify({
			notification: {
				title: payload.title || "vitalCHECK",
				body: payload.body || "Nouvelle notification",
				icon: "/android-icon-192x192.png",
				badge: "/android-icon-96x96.png",
				vibrate: [100, 50, 100],
				data: payload.data || {},
				actions: payload.actions || [],
			},
		});

		const sendPromises = subscriptions.map((sub) =>
			webpush
				.sendNotification(sub.subscription, notificationPayload)
				.catch((err) => {
					if (err.statusCode === 404 || err.statusCode === 410) {
						console.log("🧹 Suppression d'un abonnement push expiré");
						return PushSubscription.deleteOne({ _id: sub._id });
					}
					console.error("❌ Erreur lors de l'envoi push:", err);
				})
		);

		await Promise.all(sendPromises);
	} catch (error) {
		console.error("❌ Erreur globale sendPushNotification:", error);
	}
};

/**
 * Envoie une notification à tous les administrateurs
 * @param {Object} payload - Contenu de la notification
 */
const notifyAdmins = async (payload) => {
	try {
		const User = require("../models/User");
		// On considère ici que les admins ont un rôle spécifique ou sont filtrés par email/champ
		// Pour cet exemple, on cherche les utilisateurs "hasAccount" qui pourraient être admins
		// Idéalement il faudrait un champ "role: 'admin'"
		const admins = await User.find({ role: "admin" }); // Ajuster selon votre logique

		for (const admin of admins) {
			await sendPushNotification(admin._id, payload);
		}
	} catch (error) {
		console.error("❌ Erreur notifyAdmins:", error);
	}
};

module.exports = {
	sendPushNotification,
	notifyAdmins,
};
