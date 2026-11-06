// Tests du paiement Mobile Money AfribaPay — lancer avec : npm run test:afribapay
// AfribaPay est simulé (aucun appel réseau) ; MongoDB tourne en mémoire.
const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Valeurs factices, propres aux tests
const SECRET = "test_secret_for_unit_tests_only";
Object.assign(process.env, {
	JWT_SECRET: "test-jwt",
	PAYMENT_PROVIDER: "afribapay",
	AFRIBAPAY_BASE_URL: "https://afribapay.test",
	AFRIBAPAY_PUBLIC_KEY: "public_test",
	AFRIBAPAY_SECRET_KEY: SECRET,
	AFRIBAPAY_MERCHANT_KEY: "merchant_test",
	AFRIBAPAY_NOTIFY_URL: "https://vitalcheck.test/api/payments/afribapay/webhook",
	FRONTEND_URL: "https://front.test",
});

// E-mails remplacés par un compteur
const emails = [];
const emailPath = require.resolve("../utils/emailService");
require.cache[emailPath] = {
	id: emailPath,
	filename: emailPath,
	loaded: true,
	exports: {
		sendAccountCreatedEmail: async (to) => emails.push(["created", to]),
		sendSubscriptionUpgradeEmail: async (to, _name, _planName, planId) => emails.push(["upgrade", to, planId]),
		sendRenewalReminderEmail: async (to, _name, opts) => emails.push([opts.expired ? "expired" : "reminder", to]),
		sendPaymentEmail: async () => {},
	},
};

const afribapay = require("../utils/afribapayService");
const Payment = require("../models/Payment");
const User = require("../models/User");
const { runReconciliation } = require("../utils/afribapayReconciler");
const { runRenewalReminders } = require("../utils/renewalReminder");

// ── AfribaPay simulé ──
const fake = { tokenCalls: 0, expiresIn: 86400, payins: [], txs: new Map(), statusOverride: null, initStatus: null };
const outcomeFor = ({ phone_number, otp_code }) => {
	if (otp_code && /^([0-4])\1{5}$/.test(otp_code)) return "FAILED";
	return { 1: "SUCCESS", 2: "PENDING", 3: "FAILED" }[phone_number.slice(-1)] || "PENDING";
};
afribapay._http.post = async (url, body, options) => {
	if (url.endsWith("/v1/token")) {
		assert.equal(options.auth.username, "public_test");
		fake.tokenCalls += 1;
		return { data: { data: { access_token: `tok${fake.tokenCalls}`, token_type: "bearer", expires_in: fake.expiresIn } } };
	}
	if (url.endsWith("/v1/pay/payin")) {
		fake.payins.push(body);
		const tx = {
			status: "PENDING",
			final: outcomeFor(body),
			transaction_id: `PIM${fake.payins.length}${Date.now()}`,
			order_id: body.order_id,
			operator: body.operator,
			phone_number: body.phone_number,
			original_amount: body.amount,
			amount: body.amount - 100,
			fees: 100,
			amount_total: body.amount,
			currency: body.currency,
			country: body.country,
		};
		fake.txs.set(body.order_id, tx);
		const data = { ...tx, status: fake.initStatus || tx.status };
		delete data.final;
		if (body.operator === "wave") data.provider_link = "https://pay.wave.com/c/test";
		return { data: { data } };
	}
	throw new Error(`POST inattendu ${url}`);
};
afribapay._http.get = async (url, options) => {
	if (url.endsWith("/v1/countries")) {
		return {
			data: {
				data: {
					SN: {
						currencies: {
							XOF: {
								operators: [
									{ operator_code: "orange", operator_name: "Orange Money", otp_required: 1, ussd_code: "#USSD-FROM-API#" },
									{ operator_code: "wave", operator_name: "Wave", otp_required: 0, ussd_code: "" },
									{ operator_code: "free", operator_name: "Free Money", otp_required: 0, ussd_code: "" },
									{ operator_code: "emoney", operator_name: "E-money", otp_required: 0, ussd_code: "" },
								],
							},
						},
					},
				},
			},
		};
	}
	if (url.endsWith("/v1/status")) {
		const tx = fake.txs.get(options.params.order_id);
		if (!tx) {
			const err = new Error("not found");
			err.response = { status: 404, data: { message: "Transaction not found" } };
			throw err;
		}
		const data = { ...tx, status: fake.statusOverride || tx.final };
		delete data.final;
		return { data: { data } };
	}
	throw new Error(`GET inattendu ${url}`);
};

// ── Application de test (même câblage que index.js) ──
let mongo;
let server;
let base;

before(async () => {
	mongo = await MongoMemoryServer.create();
	await mongoose.connect(mongo.getUri());
	await Payment.syncIndexes();
	const app = express();
	app.use("/api/payments/afribapay/webhook", express.raw({ type: () => true, limit: "64kb" }));
	app.use(express.json());
	app.use("/api/payments", require("../routes/afribapay"));
	await new Promise((resolve) => {
		server = app.listen(0, resolve);
	});
	base = `http://127.0.0.1:${server.address().port}/api/payments`;
});

after(async () => {
	server?.close();
	await mongoose.disconnect();
	await mongo?.stop();
});

beforeEach(async () => {
	await Payment.deleteMany({});
	await User.deleteMany({});
	emails.length = 0;
	fake.payins.length = 0;
	fake.txs.clear();
	fake.statusOverride = null;
	fake.initStatus = null;
	fake.expiresIn = 86400;
	afribapay._resetCaches();
});

const createUser = (extra = {}) =>
	new User({ email: `u${crypto.randomBytes(4).toString("hex")}@test.sn`, companyName: "PME Test", companySize: "sme", hasAccount: true, ...extra }).save();
const tokenFor = (user) => jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

const initiate = (user, body) =>
	fetch(`${base}/afribapay/initiate`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...(user ? { Authorization: `Bearer ${tokenFor(user)}` } : {}) },
		body: JSON.stringify(body),
	});
const getOrder = (user, orderId) => fetch(`${base}/afribapay/orders/${orderId}`, { headers: { Authorization: `Bearer ${tokenFor(user)}` } });

const sign = (raw) => crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
const postWebhook = (raw, signature) =>
	fetch(`${base}/afribapay/webhook`, {
		method: "POST",
		headers: { "Content-Type": "application/json", ...(signature !== undefined ? { "Afribapay-Sign": signature } : {}) },
		body: raw,
	});
const webhookBody = (payment, overrides = {}) =>
	JSON.stringify({
		status: "SUCCESS",
		transaction_id: payment.transactionId,
		order_id: payment.orderId,
		operator: payment.operator,
		phone_number: payment.phoneNumber,
		original_amount: payment.amount,
		net_amount: payment.amount - 100,
		amount: payment.amount - 100,
		fees: 100,
		amount_total: payment.amount,
		currency: "XOF",
		country: "SN",
		...overrides,
	});

// Commande en attente (numéro de test PENDING), prête à recevoir un webhook
const pendingOrder = async (planId = "premium") => {
	const user = await createUser();
	const res = await initiate(user, { planId, operator: "free", phoneNumber: "221700000002" });
	assert.equal(res.status, 201);
	const { orderId } = await res.json();
	return { user, payment: await Payment.findOne({ orderId }) };
};

// ── Signature ──
test("signature : corps brut valide accepté, en-tête en majuscules accepté", () => {
	const raw = Buffer.from('{"status":"SUCCESS","order_id":"A1"}');
	assert.equal(afribapay.verifySignature(raw, sign(raw), SECRET), true);
	assert.equal(afribapay.verifySignature(raw, sign(raw).toUpperCase(), SECRET), true);
});

test("signature : corps modifié d'un caractère refusé", () => {
	const raw = Buffer.from('{"status":"SUCCESS","order_id":"A1"}');
	const tampered = Buffer.from('{"status":"SUCCESS","order_id":"A2"}');
	assert.equal(afribapay.verifySignature(tampered, sign(raw), SECRET), false);
});

test("signature : en-tête absent, vide ou mal formé refusé", () => {
	const raw = Buffer.from("{}");
	assert.equal(afribapay.verifySignature(raw, undefined, SECRET), false);
	assert.equal(afribapay.verifySignature(raw, "", SECRET), false);
	assert.equal(afribapay.verifySignature(raw, "abc", SECRET), false);
	assert.equal(afribapay.verifySignature(raw, sign(raw), ""), false);
});

test("webhook : signature absente ou invalide -> 403, aucune activation", async () => {
	const { user, payment } = await pendingOrder();
	const raw = webhookBody(payment);
	assert.equal((await postWebhook(raw)).status, 403);
	assert.equal((await postWebhook(raw, sign(raw + " "))).status, 403);
	assert.equal((await Payment.findById(payment._id)).status, "pending");
	assert.notEqual((await User.findById(user._id)).subscription.status, "active");
});

// ── Idempotence ──
test("webhook : le même SUCCESS reçu deux fois (et en parallèle) n'active et ne prolonge qu'une fois", async () => {
	const { user, payment } = await pendingOrder();
	fake.statusOverride = "SUCCESS";
	const raw = webhookBody(payment);

	const first = await postWebhook(raw, sign(raw));
	assert.equal(first.status, 200);
	const endAfterFirst = (await User.findById(user._id)).subscription.endDate.getTime();

	const replays = await Promise.all([postWebhook(raw, sign(raw)), postWebhook(raw, sign(raw)), postWebhook(raw, sign(raw))]);
	assert.deepEqual(replays.map((r) => r.status), [200, 200, 200]);

	const fresh = await User.findById(user._id);
	assert.equal(fresh.subscription.plan, "premium");
	assert.equal(fresh.subscription.status, "active");
	assert.equal(fresh.subscription.endDate.getTime(), endAfterFirst);
	assert.equal(emails.filter((e) => e[0] === "upgrade").length, 1);
	const saved = await Payment.findById(payment._id);
	assert.equal(saved.status, "completed");
	assert.ok(saved.planAppliedAt);
});

// ── Montant / devise ──
test("webhook : mauvais montant -> pas d'activation, commande signalée", async () => {
	const { user, payment } = await pendingOrder();
	fake.statusOverride = "SUCCESS";
	const raw = webhookBody(payment, { original_amount: 100, amount_total: 100 });
	assert.equal((await postWebhook(raw, sign(raw))).status, 200);
	const saved = await Payment.findById(payment._id);
	assert.equal(saved.status, "pending");
	assert.equal(saved.conflict, true);
	assert.notEqual((await User.findById(user._id)).subscription.status, "active");
});

test("webhook : mauvaise devise -> pas d'activation", async () => {
	const { user, payment } = await pendingOrder();
	fake.statusOverride = "SUCCESS";
	const raw = webhookBody(payment, { currency: "XAF" });
	assert.equal((await postWebhook(raw, sign(raw))).status, 200);
	assert.equal((await Payment.findById(payment._id)).status, "pending");
	assert.notEqual((await User.findById(user._id)).subscription.status, "active");
});

test("webhook : commande inconnue -> 200 sans opération ; JSON invalide -> 400", async () => {
	const raw = JSON.stringify({ status: "SUCCESS", order_id: "INCONNU", transaction_id: "X", original_amount: 25000, currency: "XOF" });
	assert.equal((await postWebhook(raw, sign(raw))).status, 200);
	assert.equal(await Payment.countDocuments(), 0);
	assert.equal((await postWebhook("{oops", sign("{oops"))).status, 400);
});

test("webhook FAILED signé puis SUCCESS -> reste échoué et signalé, jamais activé", async () => {
	const { user, payment } = await pendingOrder();
	const failed = webhookBody(payment, { status: "FAILED" });
	await postWebhook(failed, sign(failed));
	assert.equal((await Payment.findById(payment._id)).status, "failed");
	fake.statusOverride = "SUCCESS";
	const success = webhookBody(payment);
	await postWebhook(success, sign(success));
	const saved = await Payment.findById(payment._id);
	assert.equal(saved.status, "failed");
	assert.equal(saved.conflict, true);
	assert.notEqual((await User.findById(user._id)).subscription.status, "active");
});

// ── Parcours Sandbox (numéros et OTP de test SN) ──
test("numéros de test SN : SUCCESS / PENDING / FAILED via la page d'attente", async () => {
	const cases = [
		["221700000001", "completed"],
		["221700000002", "pending"],
		["221700000003", "failed"],
	];
	for (const [phone, expected] of cases) {
		const user = await createUser();
		const res = await initiate(user, { planId: "standard", operator: "free", phoneNumber: phone });
		const { orderId } = await res.json();
		await Payment.updateOne({ orderId }, { $set: { lastCheckedAt: null } });
		const order = await (await getOrder(user, orderId)).json();
		assert.equal(order.status, expected, phone);
		const sub = (await User.findById(user._id)).subscription;
		assert.equal(sub.status === "active", expected === "completed", phone);
	}
});

test("Orange : OTP obligatoire ; 123456 réussit, 000000 échoue", async () => {
	const user = await createUser();
	const missing = await initiate(user, { planId: "premium", operator: "orange", phoneNumber: "770000000" });
	assert.equal(missing.status, 400);
	assert.equal((await missing.json()).code, "OTP_REQUIRED");

	const ok = await (await initiate(user, { planId: "premium", operator: "orange", phoneNumber: "770000000", otpCode: "123456" })).json();
	assert.equal(fake.payins.at(-1).otp_code, "123456");
	await Payment.updateOne({ orderId: ok.orderId }, { $set: { lastCheckedAt: null } });
	assert.equal((await (await getOrder(user, ok.orderId)).json()).status, "pending"); // numéro hors liste de test : PENDING

	const ko = await (await initiate(user, { planId: "premium", operator: "orange", phoneNumber: "770000000", otpCode: "000000" })).json();
	await Payment.updateOne({ orderId: ko.orderId }, { $set: { lastCheckedAt: null } });
	assert.equal((await (await getOrder(user, ko.orderId)).json()).status, "failed");
});

test("Wave : le lien de paiement est renvoyé et return_url pointe vers la page d'attente", async () => {
	const user = await createUser();
	const body = await (await initiate(user, { planId: "standard", operator: "wave", phoneNumber: "221700000002" })).json();
	assert.equal(body.providerLink, "https://pay.wave.com/c/test");
	assert.equal(fake.payins.at(-1).return_url, `https://front.test/payment/pending?order=${body.orderId}`);
});

test("PENDING n'active jamais, même après revérification planifiée", async () => {
	const { user, payment } = await pendingOrder();
	await Payment.collection.updateOne({ _id: payment._id }, { $set: { createdAt: new Date(Date.now() - 60 * 1000) } }); // createdAt est immuable via Mongoose
	await runReconciliation();
	const saved = await Payment.findById(payment._id);
	assert.equal(saved.status, "pending");
	assert.equal(saved.checkCount, 1);
	assert.notEqual((await User.findById(user._id)).subscription.status, "active");
});

test("tâche planifiée : un PENDING devenu SUCCESS chez AfribaPay est activé (webhook manqué)", async () => {
	const { user, payment } = await pendingOrder();
	await Payment.collection.updateOne({ _id: payment._id }, { $set: { createdAt: new Date(Date.now() - 60 * 1000) } }); // createdAt est immuable via Mongoose
	fake.statusOverride = "SUCCESS";
	await runReconciliation();
	assert.equal((await Payment.findById(payment._id)).status, "completed");
	assert.equal((await User.findById(user._id)).subscription.plan, "premium");
});

// ── Jeton ──
test("jeton : mis en cache, puis renouvelé à l'expiration", async (t) => {
	fake.tokenCalls = 0;
	fake.expiresIn = 3600;
	assert.equal(await afribapay.getToken(), "tok1");
	assert.equal(await afribapay.getToken(), "tok1");
	await Promise.all([afribapay.getToken(), afribapay.getToken()]);
	assert.equal(fake.tokenCalls, 1);

	const realNow = Date.now();
	t.mock.method(Date, "now", () => realNow + 3600 * 1000);
	assert.equal(await afribapay.getToken(), "tok2");
	assert.equal(fake.tokenCalls, 2);
});

// ── Pas d'activation depuis le navigateur ──
test("sécurité : sans connexion -> 401 ; montant envoyé par le navigateur ignoré", async () => {
	assert.equal((await initiate(null, { planId: "premium", operator: "free", phoneNumber: "221700000001" })).status, 401);
	const user = await createUser();
	const res = await initiate(user, { planId: "premium", operator: "free", phoneNumber: "221700000002", amount: 1, currency: "XAF" });
	const { orderId } = await res.json();
	const saved = await Payment.findOne({ orderId });
	assert.equal(saved.amount, 25000);
	assert.equal(fake.payins.at(-1).amount, 25000);
	assert.equal(fake.payins.at(-1).currency, "XOF");
});

test("sécurité : offre ou opérateur inconnu refusé ; commande d'un autre client introuvable", async () => {
	const user = await createUser();
	assert.equal((await initiate(user, { planId: "diagnostic", operator: "free", phoneNumber: "221700000001" })).status, 400);
	assert.equal((await initiate(user, { planId: "premium", operator: "paypal", phoneNumber: "221700000001" })).status, 400);
	assert.equal((await initiate(user, { planId: "premium", operator: "free", phoneNumber: "12345" })).status, 400);

	const { payment } = await pendingOrder();
	assert.equal((await getOrder(user, payment.orderId)).status, 404);
});

test("sécurité : la réponse SUCCESS de l'initiation seule n'active pas sans confirmation /v1/status", async () => {
	const user = await createUser();
	fake.initStatus = "SUCCESS";
	fake.statusOverride = "PENDING";
	const res = await initiate(user, { planId: "premium", operator: "free", phoneNumber: "221700000001" });
	const { orderId } = await res.json();
	assert.equal((await Payment.findOne({ orderId })).status, "pending");
	assert.notEqual((await User.findById(user._id)).subscription.status, "active");
});

test("config publique : opérateurs, OTP et code USSD viennent de /v1/countries ; aucune clé exposée", async () => {
	const res = await fetch(`${base}/config`);
	const text = await res.text();
	const config = JSON.parse(text);
	assert.equal(config.provider, "afribapay");
	assert.deepEqual(config.plans, { standard: { amount: 10000 }, premium: { amount: 25000 } });
	assert.equal(config.operators.find((o) => o.code === "orange").ussdCode, "#USSD-FROM-API#");
	assert.ok(!text.includes(SECRET) && !text.includes("merchant_test") && !text.includes("public_test"));
});

// ── Renouvellement ──
test("renouvellement du même plan : les 30 jours s'ajoutent à la fin en cours", async () => {
	const endDate = new Date(Date.now() + 10 * 24 * 3600 * 1000);
	const user = await createUser({ subscription: { plan: "premium", status: "active", startDate: new Date(), endDate } });
	const res = await initiate(user, { planId: "premium", operator: "free", phoneNumber: "221700000002" });
	const { orderId } = await res.json();
	const payment = await Payment.findOne({ orderId });
	fake.statusOverride = "SUCCESS";
	const raw = webhookBody(payment);
	await postWebhook(raw, sign(raw));
	const sub = (await User.findById(user._id)).subscription;
	assert.equal(sub.endDate.getTime(), endDate.getTime() + 30 * 24 * 3600 * 1000);
});

test("rappel J-3 envoyé une seule fois, puis expiration réelle à l'échéance", async () => {
	const endDate = new Date(Date.now() + 2 * 24 * 3600 * 1000);
	const user = await createUser({ isPremium: true, subscription: { plan: "premium", status: "active", startDate: new Date(), endDate } });
	await runRenewalReminders();
	await runRenewalReminders();
	assert.equal(emails.filter((e) => e[0] === "reminder").length, 1);

	await runRenewalReminders(new Date(endDate.getTime() + 1000));
	await runRenewalReminders(new Date(endDate.getTime() + 2000));
	const fresh = await User.findById(user._id);
	assert.equal(fresh.subscription.status, "expired");
	assert.equal(fresh.isPremium, false);
	assert.equal(emails.filter((e) => e[0] === "expired").length, 1);
});

test("numéro masqué dans les journaux", () => {
	assert.equal(afribapay.maskPhone("221700000001"), "2217******01");
	assert.equal(afribapay.normalizeSenegalPhone("+221 77 123 45 67"), "221771234567");
	assert.equal(afribapay.normalizeSenegalPhone("771234567"), "221771234567");
	assert.equal(afribapay.normalizeSenegalPhone("33 123 45 67"), null);
});
