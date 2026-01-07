/**
 * Génère et stocke un identifiant unique pour les visiteurs non connectés
 * @returns {string} - L'identifiant unique du visiteur
 */
export const getOrCreateVisitorId = () => {
  const STORAGE_KEY = 'blog_visitor_id';
  
  try {
    // Vérifier si un visitorId existe déjà dans localStorage
    let visitorId = localStorage.getItem(STORAGE_KEY);
    
    if (!visitorId) {
      // Générer un nouvel identifiant unique
      // Format: timestamp + random string
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(STORAGE_KEY, visitorId);
    }
    
    return visitorId;
  } catch (error) {
    // En cas d'erreur (localStorage désactivé, etc.), générer un ID temporaire
    console.warn('Impossible d\'accéder à localStorage, utilisation d\'un ID temporaire:', error);
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

