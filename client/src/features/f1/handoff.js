/**
 * Transmission du diagnostic du rapport vers l'onglet du calculateur F1.
 * Échange direct entre les deux onglets (postMessage, même origine uniquement) :
 * rien dans l'adresse, rien en stockage. Le nouvel onglet demande, le rapport répond.
 */

const READY = "vitalcheck:f1:ready";
const DATA = "vitalcheck:f1:data";

export const F1_PATH = "/diagnostic/pertes-cachees";

/** Ouvre le calculateur dans un nouvel onglet. Sans « noopener » : le nouvel onglet doit pouvoir joindre le rapport. */
export const openF1Tab = () => window.open(F1_PATH, "_blank");

/** Côté rapport : répond aux demandes du calculateur. Renvoie la fonction de nettoyage. */
export const answerHandoffRequests = (getPayload) => {
	const onMessage = (event) => {
		if (event.origin !== window.location.origin || event.data?.type !== READY || !event.source) return;
		const payload = getPayload();
		if (payload) event.source.postMessage({ type: DATA, payload }, window.location.origin);
	};
	window.addEventListener("message", onMessage);
	return () => window.removeEventListener("message", onMessage);
};

/** Côté calculateur : demande le diagnostic à l'onglet du rapport. null si le rapport ne répond pas. */
export const requestHandoff = (timeoutMs = 3000) =>
	new Promise((resolve) => {
		const opener = window.opener;
		if (!opener || opener.closed) {
			resolve(null);
			return;
		}

		const finish = (payload) => {
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(payload);
		};
		const onMessage = (event) => {
			if (event.origin !== window.location.origin || event.source !== opener || event.data?.type !== DATA) return;
			finish(event.data.payload || null);
		};
		const timer = setTimeout(() => finish(null), timeoutMs);

		window.addEventListener("message", onMessage);
		opener.postMessage({ type: READY }, window.location.origin);
	});
