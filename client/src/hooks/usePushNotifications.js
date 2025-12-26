import { useEffect } from "react";
import { publicApi } from "../services/api";

/**
 * Hook pour gérer l'abonnement aux notifications push et le badge de l'icône
 * @param {string} userId - ID de l'utilisateur connecté
 */
export const usePushNotifications = (userId) => {
	const VAPID_PUBLIC_KEY =
		"BAiptf2zuYxeOX8ho8UNoW6yX3TurH-DK_4fHfh14AVXGLAo_4chKyKVL59g3JTzhYMkT9EEhqaUBSddRVPJBw0";

	useEffect(() => {
		if (userId && "serviceWorker" in navigator && "PushManager" in window) {
			subscribeUser();
		}
	}, [userId]);

	/**
	 * Inscrit l'utilisateur aux notifications push
	 */
	const subscribeUser = async () => {
		try {
			const registration = await navigator.serviceWorker.ready;

			// Vérifier si une souscription existe déjà
			let subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				// Créer une nouvelle souscription
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
				});
				console.log("✅ Nouvel abonnement push créé");
			}

			// Envoyer l'abonnement au serveur
			await publicApi.subscribeToPush({
				userId,
				subscription,
				device: {
					userAgent: navigator.userAgent,
					platform: navigator.platform,
				},
			});
		} catch (error) {
			console.error("❌ Erreur lors de l'abonnement push:", error);
		}
	};

	/**
	 * Met à jour le badge sur l'icône de l'application
	 * @param {number} count - Nombre de notifications non lues
	 */
	const setAppBadge = async (count) => {
		if ("setAppBadge" in navigator) {
			try {
				if (count > 0) {
					await navigator.setAppBadge(count);
				} else {
					await navigator.clearAppBadge();
				}
			} catch (error) {
				console.error("❌ Erreur lors du réglage du badge:", error);
			}
		}
	};

	return { setAppBadge, subscribeUser };
};

/**
 * Utilitaire pour convertir la clé VAPID
 */
function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
