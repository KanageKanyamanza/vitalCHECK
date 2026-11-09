const crypto = require("crypto");
const axios = require("axios");

/**
 * Client serveur de l'API AfribaPay (PAYIN uniquement).
 * Documentation : https://docs.afribapay.com
 * Les clés ne quittent jamais le serveur et ne sont jamais écrites dans les journaux.
 */

// Client HTTP remplaçable dans les tests
const http = { post: (...args) => axios.post(...args), get: (...args) => axios.get(...args) };

const TIMEOUT_MS = 20000;
// Le jeton est renouvelé 5 minutes avant son expiration
const TOKEN_MARGIN_MS = 5 * 60 * 1000;
const COUNTRIES_TTL_MS = 60 * 60 * 1000;

// Opérateurs du Sénégal si /v1/countries est indisponible (sans code USSD : on n'en invente pas)
const FALLBACK_OPERATORS = {
	SN: [
		{ code: "orange", name: "Orange Money", otpRequired: true, ussdCode: "" },
		{ code: "wave", name: "Wave", otpRequired: false, ussdCode: "" },
		{ code: "free", name: "Free Money", otpRequired: false, ussdCode: "" },
		{ code: "emoney", name: "E-money", otpRequired: false, ussdCode: "" },
	],
};

class AfribapayError extends Error {
	constructor(message, httpStatus = null) {
		super(message);
		this.name = "AfribapayError";
		this.httpStatus = httpStatus;
	}
}

const env = (name) => (process.env[name] || "").trim();

const getConfig = () => {
	const config = {
		baseUrl: env("AFRIBAPAY_BASE_URL").replace(/\/$/, ""),
		publicKey: env("AFRIBAPAY_PUBLIC_KEY"),
		secretKey: env("AFRIBAPAY_SECRET_KEY"),
		merchantKey: env("AFRIBAPAY_MERCHANT_KEY"),
	};
	const missing = Object.entries(config).filter(([, v]) => !v).map(([k]) => k);
	if (missing.length) throw new AfribapayError(`Configuration AfribaPay incomplète (${missing.join(", ")})`);
	// notify_url est facultatif chez AfribaPay : sans webhook, la page d'attente et la revérification confirment le paiement
	config.notifyUrl = env("AFRIBAPAY_NOTIFY_URL");
	return config;
};

const isConfigured = () => {
	try {
		getConfig();
		return true;
	} catch {
		return false;
	}
};

// Transforme une erreur axios en erreur sans en-têtes ni corps de requête (qui contiennent les clés)
const toAfribapayError = (err) => {
	const status = err.response?.status ?? null;
	const data = err.response?.data;
	const detail = data?.message || data?.error?.message || data?.error || err.code || err.message;
	return new AfribapayError(`AfribaPay ${status ?? "network"}: ${typeof detail === "string" ? detail : "erreur"}`, status);
};

// ── Jeton d'accès, mis en cache jusqu'à son expiration ──
let tokenCache = { token: null, expiresAt: 0 };
let tokenRequest = null;

const fetchToken = async () => {
	const { baseUrl, publicKey, secretKey } = getConfig();
	let res;
	try {
		res = await http.post(`${baseUrl}/v1/token`, null, {
			auth: { username: publicKey, password: secretKey },
			headers: { "Content-Type": "application/json" },
			timeout: TIMEOUT_MS,
		});
	} catch (err) {
		throw toAfribapayError(err);
	}
	const data = res.data?.data;
	if (!data?.access_token) throw new AfribapayError("Réponse de jeton AfribaPay invalide");
	const expiresInMs = (Number(data.expires_in) || 3600) * 1000;
	tokenCache = { token: data.access_token, expiresAt: Date.now() + expiresInMs };
	return tokenCache.token;
};

const getToken = async () => {
	if (tokenCache.token && Date.now() < tokenCache.expiresAt - TOKEN_MARGIN_MS) return tokenCache.token;
	// Une seule demande de jeton à la fois, même si plusieurs requêtes arrivent ensemble
	if (!tokenRequest) tokenRequest = fetchToken().finally(() => { tokenRequest = null; });
	return tokenRequest;
};

const resetTokenCache = () => { tokenCache = { token: null, expiresAt: 0 }; };

// Requête authentifiée. Sur 401, le jeton est jeté ; seules les lectures sont rejouées.
const callApi = async (method, path, { data, params } = {}) => {
	const { baseUrl } = getConfig();
	const send = async () => {
		const token = await getToken();
		const options = { headers: { Authorization: `Bearer ${token}` }, params, timeout: TIMEOUT_MS };
		return method === "get" ? http.get(`${baseUrl}${path}`, options) : http.post(`${baseUrl}${path}`, data, options);
	};
	try {
		return (await send()).data;
	} catch (err) {
		if (err.response?.status === 401) {
			resetTokenCache();
			if (method === "get") {
				try {
					return (await send()).data;
				} catch (retryErr) {
					throw toAfribapayError(retryErr);
				}
			}
		}
		throw toAfribapayError(err);
	}
};

// ── Paiement ──
const payin = async ({ operator, phoneNumber, amount, currency, country, orderId, otpCode, lang, returnUrl, cancelUrl }) => {
	const { merchantKey, notifyUrl } = getConfig();
	const body = {
		operator,
		country,
		phone_number: phoneNumber,
		amount,
		currency,
		order_id: orderId,
		merchant_key: merchantKey,
		reference_id: orderId,
		lang: lang === "en" ? "en" : "fr",
	};
	if (notifyUrl) body.notify_url = notifyUrl;
	if (otpCode) body.otp_code = otpCode;
	if (returnUrl) body.return_url = returnUrl;
	if (cancelUrl) body.cancel_url = cancelUrl;
	const res = await callApi("post", "/v1/pay/payin", { data: body });
	if (!res?.data) throw new AfribapayError("Réponse PAYIN AfribaPay invalide");
	return res.data;
};

// Statut d'une transaction par order_id (un seul identifiant par requête)
const getStatus = async (orderId) => {
	const res = await callApi("get", "/v1/status", { params: { order_id: orderId } });
	if (!res?.data) throw new AfribapayError("Réponse de statut AfribaPay invalide");
	return res.data;
};

// ── Pays et opérateurs ──
let countriesCache = { data: null, expiresAt: 0 };

const getOperators = async (country, currency) => {
	if (!countriesCache.data || Date.now() > countriesCache.expiresAt) {
		const res = await callApi("get", "/v1/countries");
		countriesCache = { data: res?.data || {}, expiresAt: Date.now() + COUNTRIES_TTL_MS };
	}
	const operators = countriesCache.data?.[country]?.currencies?.[currency]?.operators || [];
	return operators.map((op) => ({
		code: op.operator_code,
		name: op.operator_name,
		otpRequired: Number(op.otp_required) === 1,
		ussdCode: op.ussd_code || "",
	}));
};

// Opérateurs disponibles, avec la liste de secours si l'API ne répond pas
const getOperatorsSafe = async (country, currency) => {
	try {
		const operators = await getOperators(country, currency);
		if (operators.length) return operators;
	} catch (err) {
		console.warn("[afribapay] /v1/countries indisponible:", err.message);
	}
	return FALLBACK_OPERATORS[country] || [];
};

// ── Webhook ──
/**
 * Vérifie l'en-tête Afribapay-Sign : HMAC-SHA256 (hexadécimal) du corps brut, clé = clé secrète API.
 * Le corps doit être le Buffer reçu, jamais un JSON re-sérialisé.
 */
const verifySignature = (rawBody, signature, secret = env("AFRIBAPAY_SECRET_KEY")) => {
	if (!secret || !Buffer.isBuffer(rawBody) || typeof signature !== "string") return false;
	const received = signature.trim().toLowerCase();
	if (!/^[0-9a-f]{64}$/.test(received)) return false;
	const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
	return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(received, "utf8"));
};

// ── Numéros ──
// Numéro mobile sénégalais au format 221XXXXXXXXX, ou null s'il est invalide
const normalizeSenegalPhone = (input) => {
	let digits = String(input || "").replace(/\D/g, "");
	if (digits.startsWith("00")) digits = digits.slice(2);
	if (digits.length === 9) digits = `221${digits}`;
	return /^2217\d{8}$/.test(digits) ? digits : null;
};

// 221700000001 -> 2217******01 (pour les journaux)
const maskPhone = (phone) => {
	const s = String(phone || "");
	if (s.length <= 6) return "******";
	return `${s.slice(0, 4)}${"*".repeat(s.length - 6)}${s.slice(-2)}`;
};

module.exports = {
	AfribapayError,
	isConfigured,
	payin,
	getStatus,
	getOperatorsSafe,
	verifySignature,
	normalizeSenegalPhone,
	maskPhone,
	getToken,
	// Tests
	_http: http,
	_resetCaches: () => {
		resetTokenCache();
		countriesCache = { data: null, expiresAt: 0 };
	},
};
