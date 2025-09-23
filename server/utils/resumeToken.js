const crypto = require('crypto');

/**
 * Génère un token unique pour reprendre une évaluation
 * @param {string} userId - ID de l'utilisateur
 * @param {string} assessmentId - ID de l'évaluation
 * @returns {string} Token de reprise
 */
const generateResumeToken = (userId, assessmentId) => {
  const data = `${userId}-${assessmentId}-${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
};

/**
 * Valide un token de reprise
 * @param {string} token - Token à valider
 * @returns {boolean} True si le token est valide
 */
const isValidResumeToken = (token) => {
  return token && typeof token === 'string' && token.length === 32 && /^[a-f0-9]+$/.test(token);
};

module.exports = {
  generateResumeToken,
  isValidResumeToken
};
