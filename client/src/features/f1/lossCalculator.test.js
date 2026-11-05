// Tests du module de calcul F1 — lancer avec : npm run test:f1
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
	computeCategory,
	totalAnnualLoss,
	sortResults,
	simulatedGain,
	totalSimulatedGain,
	needsRevenue,
	roundDisplay,
	formatFcfa,
} from "./lossCalculator.js";

const require = createRequire(import.meta.url);
const { buildClientConfig } = require("../../../../server/utils/f1Losses.js");

// Configuration réelle (structure des catégories) avec des taux figés pour les tests,
// indépendants des futures valeurs des consultants.
const baseConfig = buildClientConfig({ questionnaireType: "universal", answers: [], isPaid: true });
const config = {
	...baseConfig,
	rates: { nonRecovery: 0.15, financingMonthly: 0.015, grossMargin: 0.25, waste: 0.05, cancellation: 0.1 },
	fieldDefaults: { monthsLate: 3, stockoutDays: 2, unbilledHours: 10, lateOrders: 2, topClientShare: 30 },
	revenueDerivations: {
		unpaidAmount: { type: "multiply", factor: 1 },
		dailySales: { type: "divide", factor: 25 },
		wasteValue: { type: "rate", rate: "waste" },
		hourlyRate: { type: "divide", factor: 160 },
		orderValue: { type: "multiply", factor: 0.05 },
		avoidableAmount: { type: "multiply", factor: 0.05 },
	},
};

const inputs = (values = {}, unknown = {}, revenue = { value: null, unknown: false }) => ({ values, unknown, revenue });

test("impayés : 2 400 000 FCFA, 15 %, 1,5 %/mois, 3 mois = 468 000 FCFA", () => {
	const r = computeCategory("unpaid", inputs({ unpaidAmount: 2_400_000, monthsLate: 3 }), config);
	assert.equal(r.status, "ok");
	assert.equal(Math.round(r.amount), 468_000);
	assert.equal(r.kind, "stock");
});

test("gaspillage : 50 000 FCFA/mois = 600 000 FCFA/an", () => {
	const r = computeCategory("waste", inputs({ wasteValue: 50_000 }), config);
	assert.equal(r.amount, 600_000);
	assert.equal(r.confidence, "high");
});

test("ruptures : 4 jours × 100 000 FCFA/jour × 25 % × 12 = 1 200 000 FCFA", () => {
	const r = computeCategory("stockouts", inputs({ stockoutDays: 4, dailySales: 100_000 }), config);
	assert.equal(r.amount, 1_200_000);
});

test("temps non facturé, retards, dépenses évitables, dépendance", () => {
	assert.equal(computeCategory("unbilledTime", inputs({ unbilledHours: 10, hourlyRate: 5_000 }), config).amount, 600_000);
	assert.equal(
		Math.round(computeCategory("lateDeliveries", inputs({ lateOrders: 5, orderValue: 200_000 }), config).amount),
		1_200_000,
	);
	assert.equal(computeCategory("avoidableExpenses", inputs({ avoidableAmount: 30_000 }), config).amount, 360_000);
	const dep = computeCategory(
		"clientDependency",
		inputs({ topClientShare: 40 }, {}, { value: 1_000_000, unknown: false }),
		config,
	);
	assert.equal(Math.round(dep.amount), 4_800_000);
	assert.equal(dep.kind, "risk");
});

test("le total exclut les impayés et la dépendance", () => {
	const results = [
		computeCategory("unpaid", inputs({ unpaidAmount: 2_400_000, monthsLate: 3 }), config),
		computeCategory("waste", inputs({ wasteValue: 50_000 }), config),
		computeCategory("stockouts", inputs({ stockoutDays: 4, dailySales: 100_000 }), config),
		computeCategory("clientDependency", inputs({ topClientShare: 40 }, {}, { value: 1_000_000, unknown: false }), config),
	];
	assert.equal(totalAnnualLoss(results), 1_800_000);
});

test("« Je ne sais pas » sur un champ non monétaire applique la valeur du secteur et donne une confiance moyenne", () => {
	const r = computeCategory("unbilledTime", inputs({ hourlyRate: 5_000 }, { unbilledHours: true }), config);
	assert.equal(r.amount, 10 * 5_000 * 12);
	assert.equal(r.fields.find((f) => f.id === "unbilledHours").source, "default");
	assert.equal(r.confidence, "medium");
});

test("un taux du secteur dans la formule donne au mieux une confiance moyenne", () => {
	const r = computeCategory("unpaid", inputs({ unpaidAmount: 1_000_000, monthsLate: 2 }), config);
	assert.equal(r.confidence, "medium");
});

test("« Je ne sais pas » sur un montant : estimation à partir du CA et confiance faible", () => {
	const r = computeCategory("waste", inputs({}, { wasteValue: true }, { value: 2_000_000, unknown: false }), config);
	assert.equal(r.amount, 2_000_000 * 0.05 * 12);
	assert.equal(r.confidence, "low");
});

test("« Je ne sais pas » sur un montant sans CA connu : il manque un chiffre", () => {
	assert.equal(computeCategory("waste", inputs({}, { wasteValue: true }, { value: null, unknown: true }), config).status, "missing");
	assert.equal(computeCategory("clientDependency", inputs({ topClientShare: 40 }, {}, { value: null, unknown: true }), config).status, "missing");
});

test("champ vide sans « Je ne sais pas » : il manque un chiffre", () => {
	assert.equal(computeCategory("stockouts", inputs({ stockoutDays: 4 }), config).status, "missing");
});

test("le CA n'est demandé que s'il sert", () => {
	assert.equal(needsRevenue(["waste", "unpaid"], inputs(), config), false);
	assert.equal(needsRevenue(["waste"], inputs({}, { wasteValue: true }), config), true);
	assert.equal(needsRevenue(["waste"], inputs({}, { wasteValue: false }), config), false);
	assert.equal(needsRevenue(["clientDependency"], inputs(), config), true);
	// « Je ne sais pas » sur un champ non monétaire ne demande pas le CA
	assert.equal(needsRevenue(["unpaid"], inputs({}, { monthsLate: true }), config), false);
});

test("tri du plus élevé au plus faible, catégories incomplètes à la fin", () => {
	const sorted = sortResults([
		{ categoryId: "a", status: "ok", amount: 100 },
		{ categoryId: "b", status: "missing" },
		{ categoryId: "c", status: "ok", amount: 900 },
	]);
	assert.deepEqual(sorted.map((r) => r.categoryId), ["c", "a", "b"]);
});

test("simulateur : gain proportionnel, pas de simulateur pour la dépendance, total sur les pertes annuelles seulement", () => {
	const waste = computeCategory("waste", inputs({ wasteValue: 50_000 }), config);
	const unpaid = computeCategory("unpaid", inputs({ unpaidAmount: 2_400_000, monthsLate: 3 }), config);
	const dep = computeCategory("clientDependency", inputs({ topClientShare: 40 }, {}, { value: 1_000_000, unknown: false }), config);
	assert.equal(simulatedGain(waste, 50), 300_000);
	assert.equal(simulatedGain(dep, 50), null);
	assert.equal(totalSimulatedGain([waste, unpaid, dep], { waste: 50, unpaid: 100 }), 300_000);
});

test("affichage arrondi au millier, séparateur de milliers", () => {
	assert.equal(roundDisplay(467_600), 468_000);
	assert.equal(formatFcfa(2_400_000), "2 400 000 FCFA");
});
