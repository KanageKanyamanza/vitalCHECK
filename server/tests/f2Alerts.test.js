// Tests de la configuration F2 — lancer avec : npm run test:f2
const { test } = require("node:test");
const assert = require("node:assert/strict");
const config = require("../config/f2-alerts");

const RULES = ["salesDecline", "costsOutpaceSales", "overdueReceivables", "lowCash", "clientDependency", "stockouts"];

test("les 6 règles sont présentes, ordonnées et d'une gravité valide", () => {
	assert.deepEqual([...config.ruleOrder].sort(), [...RULES].sort());
	for (const id of RULES) assert.ok(["critical", "moderate", "low"].includes(config.rules[id].severity), id);
});

test("chaque règle a un titre, des causes et une action en FR et EN, marqués à valider", () => {
	for (const id of RULES) {
		const texts = config.texts[id];
		for (const lang of ["fr", "en"]) {
			assert.ok(texts.title[lang], `${id} title ${lang}`);
			assert.ok(Array.isArray(texts.causes[lang]) && texts.causes[lang].length > 0, `${id} causes ${lang}`);
			assert.ok(texts.action[lang], `${id} action ${lang}`);
		}
		assert.ok(texts.action.fr.startsWith("[À VALIDER]"), id);
		assert.ok(texts.causes.fr.every((c) => c.startsWith("[À VALIDER]")), id);
	}
});

test("messages : aucune alerte, rappel agenda, consultant, en FR et EN", () => {
	for (const key of ["noAlert", "reminderTitle", "reminderDescription", "consultant"]) {
		assert.ok(config.messages[key].fr && config.messages[key].en, key);
	}
	assert.equal(config.status, "draft");
});
