// PayPal Configuration
// Get your client ID from: https://developer.paypal.com/

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sandbox', // Use 'sandbox' for testing
  currency: 'USD',
  intent: 'capture',
  locale: 'en_US'
}

// Plan prices configuration
export const PLAN_PRICES = {
  standard: {
    monthly: {
      USD: 18, // ~10,000 FCFA
      XOF: 10000 // FCFA
    },
    annual: {
      USD: 180, // ~100,000 FCFA
      XOF: 100000 // FCFA
    }
  },
  premium: {
    monthly: {
      USD: 45, // ~25,000 FCFA
      XOF: 25000 // FCFA
    },
    annual: {
      USD: 450, // ~250,000 FCFA
      XOF: 250000 // FCFA
    }
  },
  diagnostic: {
    oneTime: {
      USD: 1000,
      XOF: 550000 // FCFA
    }
  }
}

