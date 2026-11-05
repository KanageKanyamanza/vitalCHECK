// Formats communs aux outils F1 et F2 (aucune dépendance)

/** 2 400 000 — espaces insécables entre les milliers, quelle que soit la langue. */
export const formatNumber = (n) =>
	Math.round(n)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Montant exact : « 2 400 000 FCFA » */
export const formatFcfaExact = (amount) => `${formatNumber(amount)} FCFA`;

/** Pourcentage : « 30 % » en français, « 30% » en anglais (une décimale au plus) */
export const formatPercent = (n, lang) => {
	const rounded = String(Math.round(n * 10) / 10);
	return lang === "en" ? `${rounded}%` : `${rounded.replace(".", ",")} %`;
};

/** Saisie : ne garde que les chiffres (13 au plus). null si vide. */
export const parseDigits = (text) => {
	const digits = String(text).replace(/\D/g, "").slice(0, 13);
	return digits === "" ? null : Number(digits);
};

/** Deux-points : espace insécable avant en français, aucune en anglais */
export const colon = (lang) => (lang === "en" ? ": " : " : ");
