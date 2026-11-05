import { track } from "@vercel/analytics";

/**
 * Compteurs d'usage anonymes (Vercel Web Analytics, événements personnalisés).
 * Uniquement le nom de l'événement : jamais de chiffre saisi ni de donnée personnelle.
 * Sans plan Vercel compatible, l'événement est simplement ignoré.
 */
export const trackEvent = (name) => {
	try {
		track(name);
	} catch {
		// La mesure ne doit jamais bloquer l'interface
	}
};
