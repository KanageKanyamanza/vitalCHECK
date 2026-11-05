// Tests F2 — lancer avec : npm run test:f2
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { evaluateRules, triggeredAlerts, unverifiedRules, hasCritical, lastThreeMonths } from "./alertRules.js";
import { buildReminderIcs, reminderDate } from "./ics.js";
import { createHistory, compareWithPrevious, HISTORY_KEY } from "./history.js";

import i18next from "i18next";
import { factLines } from "./facts.js";

const require = createRequire(import.meta.url);
const serverConfig = require("../../../../server/config/f2-alerts.js");
const fr = require("../../i18n/locales/fr.json");
const en = require("../../i18n/locales/en.json");

// Seuils figés pour les tests, indépendants des futures valeurs des consultants
const config = {
	...serverConfig,
	rules: {
		salesDecline: { severity: "moderate", dropVsAverage: 0.15 },
		costsOutpaceSales: { severity: "moderate" },
		overdueReceivables: { severity: "critical", maxShareOfLastSales: 0.3 },
		lowCash: { severity: "critical", minMonthsOfFixedCosts: 1 },
		clientDependency: { severity: "moderate", maxTopClientShare: 40 },
		stockouts: { severity: "low", minStockoutsPerMonth: 3 },
	},
};

// Situation sans aucune alerte ; chaque test ne change que ce qu'il vérifie
const healthy = () => ({
	sales: [1_000_000, 1_000_000, 1_000_000],
	expenses: [800_000, 800_000, 800_000],
	overdueReceivables: 100_000,
	cash: 2_000_000,
	fixedCosts: 1_000_000,
	stockouts: 0,
	topClientShare: 20,
});
const statusOf = (figures, ruleId) => evaluateRules(figures, config).find((r) => r.ruleId === ruleId);

test("situation saine : aucune alerte, aucune règle non vérifiée", () => {
	const results = evaluateRules(healthy(), config);
	assert.equal(triggeredAlerts(results).length, 0);
	assert.equal(unverifiedRules(results).length, 0);
});

test("règle 1 : baisse continue sur 3 mois", () => {
	assert.equal(statusOf({ ...healthy(), sales: [1_000_000, 990_000, 980_000] }, "salesDecline").status, "triggered");
	// pas continue (M-2 = M-3) et seulement 2 % sous la moyenne
	assert.equal(statusOf({ ...healthy(), sales: [1_000_000, 1_000_000, 980_000] }, "salesDecline").status, "clear");
});

test("règle 1 : M-1 plus de 15 % sous la moyenne de M-3 et M-2 (juste au-dessus / juste en dessous)", () => {
	// moyenne 1 000 000 ; M-3 < M-2 pour exclure la baisse continue
	assert.equal(statusOf({ ...healthy(), sales: [900_000, 1_100_000, 849_000] }, "salesDecline").status, "triggered");
	assert.equal(statusOf({ ...healthy(), sales: [900_000, 1_100_000, 850_000] }, "salesDecline").status, "clear");
});

test("règle 2 : dépenses plus rapides que les ventes sur les deux passages", () => {
	const r = statusOf({ ...healthy(), sales: [1_000_000, 1_000_000, 1_000_000], expenses: [800_000, 801_000, 802_000] }, "costsOutpaceSales");
	assert.equal(r.status, "triggered");
	// un seul passage plus rapide : pas d'alerte
	assert.equal(statusOf({ ...healthy(), expenses: [800_000, 801_000, 801_000] }, "costsOutpaceSales").status, "clear");
});

test("règle 2 : signe compris — dépenses qui baissent moins vite que les ventes", () => {
	// ventes -20 %, dépenses -5 % sur chaque passage
	const r = statusOf({ ...healthy(), sales: [1_000_000, 800_000, 640_000], expenses: [800_000, 760_000, 722_000] }, "costsOutpaceSales");
	assert.equal(r.status, "triggered");
	assert.ok(Math.abs(r.facts.transitions[1].sales - -0.2) < 1e-9);
	assert.ok(Math.abs(r.facts.transitions[1].expenses - -0.05) < 1e-9);
	// mêmes variations : pas d'alerte
	assert.equal(statusOf({ ...healthy(), sales: [1_000_000, 800_000, 640_000], expenses: [800_000, 640_000, 512_000] }, "costsOutpaceSales").status, "clear");
});

test("règle 2 : un mois à 0 rend la règle non vérifiée", () => {
	assert.equal(statusOf({ ...healthy(), sales: [0, 1_000_000, 1_000_000] }, "costsOutpaceSales").status, "unverified");
	assert.equal(statusOf({ ...healthy(), expenses: [800_000, 0, 800_000] }, "costsOutpaceSales").status, "unverified");
});

test("règle 3 : créances au-dessus de 30 % des ventes de M-1 (strict)", () => {
	assert.equal(statusOf({ ...healthy(), overdueReceivables: 300_001 }, "overdueReceivables").status, "triggered");
	assert.equal(statusOf({ ...healthy(), overdueReceivables: 300_000 }, "overdueReceivables").status, "clear");
});

test("règle 4 : trésorerie sous 1 mois de charges fixes (strict)", () => {
	assert.equal(statusOf({ ...healthy(), cash: 999_999 }, "lowCash").status, "triggered");
	assert.equal(statusOf({ ...healthy(), cash: 1_000_000 }, "lowCash").status, "clear");
	assert.equal(statusOf({ ...healthy(), fixedCosts: 0 }, "lowCash").status, "unverified");
});

test("règle 5 : premier client au-dessus de 40 % (strict)", () => {
	assert.equal(statusOf({ ...healthy(), topClientShare: 41 }, "clientDependency").status, "triggered");
	assert.equal(statusOf({ ...healthy(), topClientShare: 40 }, "clientDependency").status, "clear");
});

test("règle 6 : 3 ruptures ou plus (inclus)", () => {
	assert.equal(statusOf({ ...healthy(), stockouts: 3 }, "stockouts").status, "triggered");
	assert.equal(statusOf({ ...healthy(), stockouts: 2 }, "stockouts").status, "clear");
});

test("« Je ne sais pas » rend les règles dépendantes non vérifiées", () => {
	const results = evaluateRules({ ...healthy(), sales: [null, null, null], cash: null, topClientShare: null }, config);
	const unverified = unverifiedRules(results).map((r) => r.ruleId).sort();
	assert.deepEqual(unverified, ["clientDependency", "costsOutpaceSales", "lowCash", "overdueReceivables", "salesDecline"].sort());
	assert.equal(statusOf({ ...healthy(), stockouts: null }, "stockouts").status, "unverified");
});

test("tri par gravité et détection d'une alerte critique", () => {
	const results = evaluateRules({ ...healthy(), stockouts: 5, topClientShare: 60, cash: 100_000 }, config);
	assert.deepEqual(triggeredAlerts(results).map((r) => r.severity), ["critical", "moderate", "low"]);
	assert.equal(hasCritical(results), true);
	assert.equal(hasCritical(evaluateRules({ ...healthy(), stockouts: 5 }, config)), false);
});

test("noms des 3 derniers mois complets", () => {
	assert.deepEqual(lastThreeMonths(new Date(2026, 10, 5), "fr"), ["Août", "Septembre", "Octobre"]);
	assert.deepEqual(lastThreeMonths(new Date(2026, 1, 10), "en"), ["November", "December", "January"]);
});

test(".ics : journée entière dans 30 jours, alarme, lignes CRLF, texte échappé", () => {
	const now = new Date(2026, 10, 5, 10, 0, 0);
	const start = reminderDate(now);
	assert.equal(start.getDate(), 5);
	assert.equal(start.getMonth(), 11);
	const ics = buildReminderIcs({ title: "Rappel, vitalCHECK; test", description: "Ligne 1\nLigne 2", start, now, uid: "abc@vitalcheck" });
	assert.ok(ics.includes("DTSTART;VALUE=DATE:20261205\r\n"));
	assert.ok(ics.includes("DTEND;VALUE=DATE:20261206\r\n"));
	assert.ok(ics.includes("SUMMARY:Rappel\\, vitalCHECK\\; test\r\n"));
	assert.ok(ics.includes("DESCRIPTION:Ligne 1\\nLigne 2\r\n"));
	assert.ok(ics.includes("BEGIN:VALARM\r\n"));
	assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n") && ics.endsWith("END:VCALENDAR\r\n"));
	assert.ok(!/[^\r]\n/.test(ics));
});

const spyStorage = () => {
	const data = new Map();
	const calls = [];
	return {
		calls,
		data,
		getItem: (k) => (calls.push(["get", k]), data.has(k) ? data.get(k) : null),
		setItem: (k, v) => (calls.push(["set", k]), data.set(k, v)),
		removeItem: (k) => (calls.push(["remove", k]), data.delete(k)),
	};
};

test("historique, drapeau coupé : rien n'est lu ni écrit", () => {
	const storage = spyStorage();
	const history = createHistory({ enabled: false, storage });
	assert.equal(history.load(), null);
	assert.equal(history.save({ date: "x", figures: healthy(), alerts: [] }), false);
	assert.equal(history.clear(), false);
	assert.deepEqual(storage.calls, []);
});

test("historique, drapeau actif : enregistrement, relecture, effacement complet", () => {
	const storage = spyStorage();
	const history = createHistory({ enabled: true, storage });
	history.save({ date: "2026-10-05", figures: healthy(), alerts: ["lowCash"] });
	assert.equal(history.load().alerts[0], "lowCash");
	history.clear();
	assert.equal(storage.data.size, 0);
	assert.equal(history.load(), null);
	assert.ok(storage.calls.every(([, key]) => key === HISTORY_KEY));
});

test("comparaison avec le contrôle précédent : tendances, alertes nouvelles ou disparues", () => {
	const previous = { date: "2026-10-05", figures: { ...healthy(), cash: 2_500_000 }, alerts: ["clientDependency"] };
	const diff = compareWithPrevious(previous, healthy(), ["lowCash"]);
	assert.equal(diff.figures.find((f) => f.field === "cash").trend, -1);
	assert.equal(diff.figures.find((f) => f.field === "lastSales").trend, 0);
	assert.deepEqual(diff.newAlerts, ["lowCash"]);
	assert.deepEqual(diff.goneAlerts, ["clientDependency"]);
	assert.equal(compareWithPrevious(null, healthy(), []), null);
});

const translator = async (lng) => {
	const instance = i18next.createInstance();
	await instance.init({ lng, resources: { fr: { translation: fr }, en: { translation: en } }, interpolation: { escapeValue: false } });
	return instance.t.bind(instance);
};
const months = ["Août", "Septembre", "Octobre"];

test("faits de la règle 2 : deux baisses expliquées en clair (FR et EN)", async () => {
	const r = statusOf({ ...healthy(), sales: [1_000_000, 800_000, 640_000], expenses: [800_000, 760_000, 722_000] }, "costsOutpaceSales");
	const lines = factLines(r, months, "fr", await translator("fr"));
	assert.equal(lines[1], "De septembre à octobre, vos ventes ont baissé de 20 %, vos dépenses seulement de 5 %.");
	const linesEn = factLines(r, ["August", "September", "October"], "en", await translator("en"));
	assert.equal(linesEn[1], "From September to October, your sales fell by 20%, your expenses by only 5%.");
});

test("faits : montants exacts, mois en minuscules dans la phrase", async () => {
	const t = await translator("fr");
	const cash = statusOf({ ...healthy(), cash: 800_000, fixedCosts: 1_300_000 }, "lowCash");
	assert.equal(factLines(cash, months, "fr", t)[0], "Votre trésorerie (800 000 FCFA) couvre 0,6 mois de charges fixes (1 300 000 FCFA par mois).");
	const stock = statusOf({ ...healthy(), stockouts: 4 }, "stockouts");
	assert.equal(factLines(stock, months, "fr", t)[0], "Vous avez eu 4 ruptures de stock en octobre.");
	// chaque règle déclenchée produit au moins une phrase
	const all = evaluateRules({ ...healthy(), sales: [1_000_000, 900_000, 700_000], expenses: [800_000, 850_000, 900_000], overdueReceivables: 500_000, cash: 100_000, stockouts: 5, topClientShare: 60 }, config);
	for (const result of triggeredAlerts(all)) assert.ok(factLines(result, months, "fr", t).length > 0, result.ruleId);
});

test("faits en français : « d' » devant un mois qui commence par une voyelle", async () => {
	const t = await translator("fr");
	const costs = statusOf({ ...healthy(), sales: [1_000_000, 800_000, 640_000], expenses: [800_000, 760_000, 722_000] }, "costsOutpaceSales");
	assert.ok(factLines(costs, months, "fr", t)[0].startsWith("D'août à septembre,"));
	const overdue = statusOf({ ...healthy(), overdueReceivables: 500_000 }, "overdueReceivables");
	assert.ok(factLines(overdue, months, "fr", t)[0].includes("de vos ventes d'octobre"));
	const sales = statusOf({ ...healthy(), sales: [1_000_000, 900_000, 700_000] }, "salesDecline");
	assert.ok(factLines(sales, months, "fr", t)[1].includes("la moyenne d'août et de septembre"));
});
