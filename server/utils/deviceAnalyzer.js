const UAParser = require('ua-parser-js');

/**
 * Analyse l'user agent pour extraire les informations de l'appareil
 * @param {string} userAgent - User agent string
 * @returns {Object} Informations de l'appareil
 */
function analyzeDevice(userAgent) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  return {
    type: getDeviceType(result.device.type),
    brand: result.device.brand || 'Unknown',
    model: result.device.model || 'Unknown',
    os: result.os.name || 'Unknown',
    osVersion: result.os.version || 'Unknown',
    browser: result.browser.name || 'Unknown',
    browserVersion: result.browser.version || 'Unknown'
  };
}

/**
 * Détermine le type d'appareil
 * @param {string} deviceType - Type d'appareil détecté
 * @returns {string} Type normalisé
 */
function getDeviceType(deviceType) {
  if (!deviceType) return 'desktop';
  
  const type = deviceType.toLowerCase();
  if (type.includes('mobile') || type.includes('phone')) {
    return 'mobile';
  } else if (type.includes('tablet') || type.includes('pad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Extrait le domaine du référent
 * @param {string} referrer - URL du référent
 * @returns {string|null} Domaine du référent
 */
function extractReferrerDomain(referrer) {
  if (!referrer) return null;
  
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch (error) {
    return null;
  }
}

/**
 * Extrait les paramètres UTM de l'URL
 * @param {string} url - URL complète
 * @returns {Object} Paramètres UTM
 */
function extractUTMParameters(url) {
  if (!url) return {};
  
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    return {
      utmSource: params.get('utm_source') || null,
      utmMedium: params.get('utm_medium') || null,
      utmCampaign: params.get('utm_campaign') || null
    };
  } catch (error) {
    return {};
  }
}

/**
 * Génère un ID de session unique
 * @returns {string} ID de session
 */
function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Détermine si la visite est un rebond basé sur le temps passé
 * @param {number} timeOnPage - Temps passé sur la page en secondes
 * @returns {boolean} True si c'est un rebond
 */
function isBounce(timeOnPage) {
  return timeOnPage < 30; // Moins de 30 secondes = rebond
}

module.exports = {
  analyzeDevice,
  extractReferrerDomain,
  extractUTMParameters,
  generateSessionId,
  isBounce
};
