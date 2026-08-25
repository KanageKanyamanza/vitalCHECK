const axios = require('axios');

const getApiBase = () =>
  process.env.PAYPAL_API_BASE ||
  (process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com');

// Expected amounts per plan (must stay in sync with client/src/config/paypal.js)
const EXPECTED_AMOUNTS = {
  standard:   18,
  premium:    45,
  diagnostic: 1000,
};

// OAuth2 client-credentials token from PayPal
const getPayPalAccessToken = async () => {
  const clientId     = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal credentials manquants (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)'
    );
  }

  const response = await axios.post(
    `${getApiBase()}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: { username: clientId, password: clientSecret },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 12000,
    }
  );

  return response.data.access_token;
};

// Verify that a PayPal order is COMPLETED and matches the expected plan + amount
const verifyPayPalOrder = async (orderId, planId) => {
  if (!orderId) throw new Error('orderId manquant');
  if (!EXPECTED_AMOUNTS[planId]) throw new Error(`Plan inconnu : ${planId}`);

  const accessToken = await getPayPalAccessToken();

  const response = await axios.get(
    `${getApiBase()}/v2/checkout/orders/${orderId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 12000,
    }
  );

  const order = response.data;

  if (order.status !== 'COMPLETED') {
    throw new Error(
      `Ordre PayPal ${orderId} non complété (statut: ${order.status})`
    );
  }

  const totalPaid = order.purchase_units.reduce(
    (sum, unit) => sum + parseFloat(unit.amount?.value || 0),
    0
  );

  const expected = EXPECTED_AMOUNTS[planId];
  if (totalPaid < expected - 0.01) {
    throw new Error(
      `Montant incorrect : attendu ${expected} USD, reçu ${totalPaid} USD`
    );
  }

  return { verified: true, order, totalPaid };
};

// Verify webhook signature via PayPal verification API
const verifyPayPalWebhook = async (headers, rawBody) => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.warn('[PayPal] PAYPAL_WEBHOOK_ID absent — vérification webhook ignorée');
    return false;
  }

  const accessToken = await getPayPalAccessToken();

  let parsedBody;
  try {
    parsedBody = JSON.parse(rawBody.toString());
  } catch {
    throw new Error('Corps du webhook invalide (non-JSON)');
  }

  const verificationBody = {
    auth_algo:         headers['paypal-auth-algo'],
    cert_url:          headers['paypal-cert-url'],
    transmission_id:   headers['paypal-transmission-id'],
    transmission_sig:  headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id:        webhookId,
    webhook_event:     parsedBody,
  };

  const response = await axios.post(
    `${getApiBase()}/v1/notifications/verify-webhook-signature`,
    verificationBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 12000,
    }
  );

  return response.data.verification_status === 'SUCCESS';
};

module.exports = { getPayPalAccessToken, verifyPayPalOrder, verifyPayPalWebhook };
