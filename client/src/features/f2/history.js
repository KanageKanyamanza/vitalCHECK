/**
 * Historique facultatif sur l'appareil (derrière le drapeau F2_LOCAL_HISTORY).
 * Drapeau coupé : rien n'est lu ni écrit dans le stockage.
 * Un seul contrôle est gardé : le précédent, qui sert à la comparaison.
 */

import { trend } from "./alertRules.js";

export const HISTORY_KEY = "vitalcheck-f2-history";

const browserStorage = () => {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
};

export const createHistory = ({ enabled, storage = enabled ? browserStorage() : null }) => ({
	enabled,

	load() {
		if (!enabled || !storage) return null;
		try {
			const raw = storage.getItem(HISTORY_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	},

	save({ date, figures, alerts }) {
		if (!enabled || !storage) return false;
		try {
			storage.setItem(HISTORY_KEY, JSON.stringify({ date, figures, alerts }));
			return true;
		} catch {
			return false;
		}
	},

	clear() {
		if (!enabled || !storage) return false;
		try {
			storage.removeItem(HISTORY_KEY);
			return true;
		} catch {
			return false;
		}
	},
});

// Chiffres comparés d'un contrôle à l'autre (le dernier mois saisi pour les ventes et dépenses)
const COMPARED = [
	["lastSales", (f) => f.sales?.[2]],
	["lastExpenses", (f) => f.expenses?.[2]],
	["overdueReceivables", (f) => f.overdueReceivables],
	["cash", (f) => f.cash],
	["fixedCosts", (f) => f.fixedCosts],
	["stockouts", (f) => f.stockouts],
	["topClientShare", (f) => f.topClientShare],
];

const isNumber = (v) => typeof v === "number" && Number.isFinite(v);

/** Comparaison avec le contrôle précédent : tendance par chiffre, alertes nouvelles ou disparues. */
export const compareWithPrevious = (previous, figures, alerts) => {
	if (!previous) return null;
	const figuresDiff = COMPARED.map(([field, get]) => {
		const before = get(previous.figures || {});
		const after = get(figures);
		if (!isNumber(before) || !isNumber(after)) return null;
		return { field, before, after, trend: trend(after - before) };
	}).filter(Boolean);
	const previousAlerts = previous.alerts || [];
	return {
		date: previous.date,
		figures: figuresDiff,
		newAlerts: alerts.filter((id) => !previousAlerts.includes(id)),
		goneAlerts: previousAlerts.filter((id) => !alerts.includes(id)),
	};
};
