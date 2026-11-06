/**
 * Prix facturés par le serveur pour le paiement Mobile Money (AfribaPay).
 * Le navigateur n'envoie jamais de montant : il envoie un planId, le serveur lit ce tableau.
 * Les montants affichés sur le site (client/src/config/paypal.js) doivent rester identiques.
 *
 * Le Diagnostic (paiement unique) n'est pas proposé en Mobile Money : il passe par « Nous contacter ».
 */

const MOBILE_MONEY_CURRENCY = "XOF";
const MOBILE_MONEY_COUNTRY = "SN";

// Abonnement mensuel = période payée de 30 jours, renouvelée par un nouveau paiement
const PERIOD_DAYS = 30;

const PLANS = {
	standard: { name: "Standard", amount: 10000 },
	premium: { name: "Premium", amount: 25000 },
};

module.exports = { PLANS, PERIOD_DAYS, MOBILE_MONEY_CURRENCY, MOBILE_MONEY_COUNTRY };
