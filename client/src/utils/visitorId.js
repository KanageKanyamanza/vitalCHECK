/**
 * Génère et stocke un identifiant unique pour les visiteurs non connectés
 * Cet identifiant est unique par navigateur et permet de suivre les likes par navigateur
 * 
 * Comportement:
 * - Chaque navigateur a son propre visitorId stocké dans localStorage
 * - Si localStorage n'est pas disponible, utilise les cookies comme fallback
 * - L'ID persiste entre les sessions du même navigateur
 * - Chaque navigateur peut liker indépendamment des autres
 * 
 * @returns {string} - L'identifiant unique du visiteur pour ce navigateur
 */
export const getOrCreateVisitorId = () => {
  const STORAGE_KEY = 'blog_visitor_id';
  const COOKIE_KEY = 'blog_visitor_id';
  
  /**
   * Lire un cookie
   */
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  /**
   * Écrire un cookie
   */
  const setCookie = (name, value, days = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };
  
  /**
   * Générer un nouvel identifiant unique
   */
  const generateVisitorId = () => {
    // Format: visitor_timestamp_randomString
    // Utilise timestamp + random pour garantir l'unicité
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `visitor_${timestamp}_${random}`;
  };
  
  try {
    // Essayer d'abord avec localStorage (plus fiable et persistant)
    let visitorId = null;
    
    if (typeof Storage !== 'undefined' && localStorage) {
      try {
        visitorId = localStorage.getItem(STORAGE_KEY);
        if (visitorId) {
          return visitorId;
        }
      } catch (e) {
        // localStorage peut être désactivé ou bloqué
        console.warn('localStorage non disponible, utilisation des cookies:', e);
      }
    }
    
    // Fallback sur les cookies si localStorage n'est pas disponible
    visitorId = getCookie(COOKIE_KEY);
    if (visitorId) {
      // Si trouvé dans les cookies, essayer de le sauvegarder dans localStorage pour la prochaine fois
      try {
        if (typeof Storage !== 'undefined' && localStorage) {
          localStorage.setItem(STORAGE_KEY, visitorId);
        }
      } catch (e) {
        // Ignorer l'erreur, on continue avec les cookies
      }
      return visitorId;
    }
    
    // Aucun visitorId trouvé, en générer un nouveau
    visitorId = generateVisitorId();
    
    // Sauvegarder dans localStorage si disponible
    try {
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.setItem(STORAGE_KEY, visitorId);
      }
    } catch (e) {
      // localStorage non disponible, continuer avec les cookies
    }
    
    // Sauvegarder aussi dans les cookies comme backup
    setCookie(COOKIE_KEY, visitorId);
    
    return visitorId;
  } catch (error) {
    // En cas d'erreur totale, générer un ID temporaire (session uniquement)
    console.error('Erreur lors de la génération du visitorId:', error);
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
};

