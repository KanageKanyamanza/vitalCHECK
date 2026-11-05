// Tests de la logique serveur F1 — lancer avec : npm run test:f1
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { preselectCategories, buildClientConfig, resolveSector } = require("../utils/f1Losses");
const { hasActivePaidPlan } = require("../routes/f1");

const answer = (questionId, value) => ({ questionId, answer: value });

test("pré-sélection : les 3 catégories aux réponses les plus faibles", () => {
	const answers = [
		answer("distribution_credit_1", 0),
		answer("distribution_credit_2", 0), // impayés : 0
		answer("distribution_stock_1", 4),
		answer("distribution_digital_3", 4), // ruptures : 4
		answer("distribution_stock_4", 2),
		answer("distribution_stock_2", 2), // gaspillage : 2
		answer("distribution_stock_5", 4), // retards : 4
		answer("distribution_finance_4", 0),
		answer("distribution_finance_3", 2), // dépenses : 1
		answer("distribution_pilotage_1", 4), // dépendance : 4
	];
	assert.deepEqual(preselectCategories("distribution", answers), ["unpaid", "avoidableExpenses", "waste"]);
});

test("pré-sélection : égalité départagée par l'ordre de la configuration, complétée si besoin", () => {
	assert.deepEqual(preselectCategories("universal", []), ["unpaid", "stockouts", "waste"]);
	const answers = [answer("agri_finance_5", 4), answer("agri_marche_1", 4), answer("agri_marche_2", 4)];
	// seulement 2 catégories mappées répondues : la 3e est complétée dans l'ordre
	assert.deepEqual(preselectCategories("agriculture", answers), ["unpaid", "clientDependency", "stockouts"]);
});

test("secteur inconnu : questionnaire universel", () => {
	assert.equal(resolveSector("inconnu"), "universal");
	assert.equal(resolveSector("retail"), "retail");
});

test("gratuit : les 3 catégories pré-cochées sont offertes, les autres sans action, sans simulateur ni total", () => {
	const answers = [answer("v2_sales_2", 0)]; // dépendance la plus faible, puis complétée dans l'ordre
	const config = buildClientConfig({ questionnaireType: "universal", answers, isPaid: false });
	const offered = ["clientDependency", "unpaid", "stockouts"];
	assert.equal(config.access, "free");
	assert.deepEqual(config.preselected, offered);
	assert.deepEqual(config.unlocked, offered);
	for (const [id, category] of Object.entries(config.categories)) {
		assert.equal("action" in category, offered.includes(id), id);
	}
	assert.equal(config.simulator, false);
	assert.equal(config.showTotal, false);
});

test("abonné : toutes les catégories, actions et simulateur", () => {
	const config = buildClientConfig({ questionnaireType: "retail", answers: [], isPaid: true });
	assert.equal(config.unlocked.length, 7);
	assert.ok(Object.values(config.categories).every((c) => typeof c.action.fr === "string"));
	assert.equal(config.simulator, true);
	assert.equal(config.showTotal, true);
});

test("contrôle d'abonnement : même règle que checkSubscription('paid')", () => {
	const future = new Date(Date.now() + 86_400_000);
	const past = new Date(Date.now() - 86_400_000);
	assert.equal(hasActivePaidPlan(null), false);
	assert.equal(hasActivePaidPlan({ subscription: { status: "active", plan: "free" } }), false);
	assert.equal(hasActivePaidPlan({ subscription: { status: "active", plan: "premium", endDate: future } }), true);
	assert.equal(hasActivePaidPlan({ subscription: { status: "active", plan: "premium", endDate: past } }), false);
	assert.equal(hasActivePaidPlan({ subscription: { status: "expired", plan: "premium" } }), false);
	assert.equal(hasActivePaidPlan({ subscription: { status: "active", plan: "diagnostic", endDate: null } }), true);
	// l'abonnement de l'équipe prime sur celui de l'utilisateur
	assert.equal(
		hasActivePaidPlan({ team: { subscription: { status: "expired", plan: "premium" } }, subscription: { status: "active", plan: "premium" } }),
		false,
	);
});
