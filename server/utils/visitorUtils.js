const UAParser = require('ua-parser-js');

/**
 * Obtenir l'adresse IP du client
 * @param {Object} req - Objet de requête Express
 * @returns {string} - Adresse IP du client
 */
const getClientIP = (req) => {
  // Vérifier les headers de proxy
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const cfConnectingIP = req.headers['cf-connecting-ip'];
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (forwarded) {
    // x-forwarded-for peut contenir plusieurs IPs séparées par des virgules
    return forwarded.split(',')[0].trim();
  }
  
  // Fallback sur l'adresse IP de la connexion
  return req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.ip ||
         '127.0.0.1';
};

/**
 * Analyser les informations de l'appareil à partir du User-Agent
 * @param {string} userAgent - User-Agent string
 * @returns {Object} - Informations de l'appareil
 */
const getDeviceInfo = (userAgent) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  return {
    type: getDeviceType(result.device.type),
    brand: result.device.brand || null,
    model: result.device.model || null,
    os: result.os.name || null,
    osVersion: result.os.version || null,
    browser: result.browser.name || null,
    browserVersion: result.browser.version || null
  };
};

/**
 * Déterminer le type d'appareil
 * @param {string} deviceType - Type d'appareil détecté
 * @returns {string} - Type normalisé
 */
const getDeviceType = (deviceType) => {
  if (!deviceType) {
    return 'desktop'; // Par défaut
  }
  
  const type = deviceType.toLowerCase();
  
  if (type.includes('mobile') || type.includes('phone')) {
    return 'mobile';
  } else if (type.includes('tablet') || type.includes('pad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * Obtenir les informations de localisation (simulation - en production, utiliser un service comme ipapi)
 * @param {string} ipAddress - Adresse IP
 * @returns {Promise<Object>} - Informations de localisation
 */
const getLocationInfo = async (ipAddress) => {
  try {
    // En production, vous pourriez utiliser un service comme:
    // - ipapi.co
    // - ip-api.com
    // - ipinfo.io
    // - maxmind GeoIP
    
    // Pour l'instant, on simule avec des données par défaut
    // ou on utilise un service gratuit si disponible
    
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      // IP locale
      return {
        country: 'France',
        region: 'Local',
        city: 'Local',
        timezone: 'Europe/Paris'
      };
    }
    
    // Ici, vous pourriez faire un appel à un service de géolocalisation
    // Exemple avec ipapi.co (gratuit jusqu'à 1000 requêtes/jour):
    /*
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    const data = await response.json();
    
    return {
      country: data.country_name || 'Inconnu',
      region: data.region || 'Inconnu',
      city: data.city || 'Inconnu',
      timezone: data.timezone || 'UTC'
    };
    */
    
    // Pour l'instant, retourner des données par défaut
    return {
      country: 'France',
      region: 'Inconnu',
      city: 'Inconnu',
      timezone: 'Europe/Paris'
    };
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la localisation:', error);
    return {
      country: 'Inconnu',
      region: 'Inconnu',
      city: 'Inconnu',
      timezone: 'UTC'
    };
  }
};

/**
 * Générer un ID de session unique
 * @returns {string} - ID de session
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valider une adresse email
 * @param {string} email - Adresse email à valider
 * @returns {boolean} - True si l'email est valide
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Nettoyer et valider les données du formulaire
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - Données nettoyées et validées
 */
const validateFormData = (formData) => {
  const errors = [];
  const cleanedData = {};
  
  // Prénom
  if (!formData.firstName || typeof formData.firstName !== 'string') {
    errors.push('Le prénom est requis');
  } else {
    cleanedData.firstName = formData.firstName.trim();
    if (cleanedData.firstName.length > 50) {
      errors.push('Le prénom ne peut pas dépasser 50 caractères');
    }
  }
  
  // Nom
  if (!formData.lastName || typeof formData.lastName !== 'string') {
    errors.push('Le nom de famille est requis');
  } else {
    cleanedData.lastName = formData.lastName.trim();
    if (cleanedData.lastName.length > 50) {
      errors.push('Le nom de famille ne peut pas dépasser 50 caractères');
    }
  }
  
  // Email
  if (!formData.email || typeof formData.email !== 'string') {
    errors.push('L\'email est requis');
  } else {
    cleanedData.email = formData.email.toLowerCase().trim();
    if (!isValidEmail(cleanedData.email)) {
      errors.push('L\'email n\'est pas valide');
    }
  }
  
  // Pays
  if (!formData.country || typeof formData.country !== 'string') {
    errors.push('Le pays est requis');
  } else {
    cleanedData.country = formData.country.trim();
    if (cleanedData.country.length > 100) {
      errors.push('Le nom du pays ne peut pas dépasser 100 caractères');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: cleanedData
  };
};

/**
 * Calculer la profondeur de scroll en pourcentage
 * @param {number} scrollTop - Position de scroll actuelle
 * @param {number} documentHeight - Hauteur totale du document
 * @param {number} windowHeight - Hauteur de la fenêtre
 * @returns {number} - Pourcentage de scroll (0-100)
 */
const calculateScrollDepth = (scrollTop, documentHeight, windowHeight) => {
  const maxScroll = documentHeight - windowHeight;
  if (maxScroll <= 0) return 100;
  
  const scrollPercent = (scrollTop / maxScroll) * 100;
  return Math.min(Math.max(scrollPercent, 0), 100);
};

/**
 * Formater la durée en minutes et secondes
 * @param {number} seconds - Durée en secondes
 * @returns {string} - Durée formatée
 */
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  return `${remainingSeconds}s`;
};

/**
 * Obtenir le nom du pays en français
 * @param {string} countryCode - Code pays ISO
 * @returns {string} - Nom du pays en français
 */
const getCountryName = (countryCode) => {
  const countries = {
    'FR': 'France',
    'US': 'États-Unis',
    'CA': 'Canada',
    'GB': 'Royaume-Uni',
    'DE': 'Allemagne',
    'ES': 'Espagne',
    'IT': 'Italie',
    'BE': 'Belgique',
    'CH': 'Suisse',
    'NL': 'Pays-Bas',
    'LU': 'Luxembourg',
    'MA': 'Maroc',
    'TN': 'Tunisie',
    'DZ': 'Algérie',
    'SN': 'Sénégal',
    'CI': 'Côte d\'Ivoire',
    'CM': 'Cameroun',
    'CD': 'République démocratique du Congo',
    'MG': 'Madagascar',
    'BF': 'Burkina Faso',
    'ML': 'Mali',
    'NE': 'Niger',
    'TD': 'Tchad',
    'CF': 'République centrafricaine',
    'GA': 'Gabon',
    'CG': 'République du Congo',
    'GQ': 'Guinée équatoriale',
    'ST': 'Sao Tomé-et-Principe',
    'GW': 'Guinée-Bissau',
    'GN': 'Guinée',
    'SL': 'Sierra Leone',
    'LR': 'Libéria',
    'GH': 'Ghana',
    'TG': 'Togo',
    'BJ': 'Bénin',
    'NG': 'Nigeria',
    'AO': 'Angola',
    'ZM': 'Zambie',
    'ZW': 'Zimbabwe',
    'BW': 'Botswana',
    'NA': 'Namibie',
    'ZA': 'Afrique du Sud',
    'LS': 'Lesotho',
    'SZ': 'Eswatini',
    'MW': 'Malawi',
    'MZ': 'Mozambique',
    'MG': 'Madagascar',
    'MU': 'Maurice',
    'SC': 'Seychelles',
    'KM': 'Comores',
    'DJ': 'Djibouti',
    'SO': 'Somalie',
    'ET': 'Éthiopie',
    'ER': 'Érythrée',
    'SD': 'Soudan',
    'SS': 'Soudan du Sud',
    'EG': 'Égypte',
    'LY': 'Libye',
    'TN': 'Tunisie',
    'DZ': 'Algérie',
    'MA': 'Maroc',
    'EH': 'Sahara occidental'
  };
  
  return countries[countryCode] || countryCode;
};

module.exports = {
  getClientIP,
  getDeviceInfo,
  getLocationInfo,
  generateSessionId,
  isValidEmail,
  validateFormData,
  calculateScrollDepth,
  formatDuration,
  getCountryName
};
