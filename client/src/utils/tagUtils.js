/**
 * Utilitaires pour gérer les tags des blogs
 */

/**
 * Convertit un objet de tags en tableau
 * @param {Object|Array|string} tags - Les tags sous forme d'objet, tableau ou chaîne
 * @returns {Array} - Tableau de tags
 */
export const normalizeTags = (tags) => {
  if (!tags) return []
  
  // Si c'est déjà un tableau, le retourner
  if (Array.isArray(tags)) {
    return tags
  }
  
  // Si c'est une chaîne, la diviser par virgules
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  }
  
  // Si c'est un objet, extraire les clés
  if (typeof tags === 'object' && tags !== null) {
    return Object.keys(tags).filter(key => key && key.trim().length > 0)
  }
  
  return []
}

/**
 * Convertit un tableau de tags en objet (pour l'envoi au backend)
 * @param {Array} tags - Tableau de tags
 * @returns {Object} - Objet de tags
 */
export const tagsToObject = (tags) => {
  if (!Array.isArray(tags)) return {}
  
  const tagsObject = {}
  tags.forEach(tag => {
    if (tag && tag.trim().length > 0) {
      tagsObject[tag.trim()] = true
    }
  })
  
  return tagsObject
}

/**
 * Convertit un tableau de tags en chaîne (pour l'affichage)
 * @param {Array} tags - Tableau de tags
 * @returns {string} - Chaîne de tags séparés par des virgules
 */
export const tagsToString = (tags) => {
  if (!Array.isArray(tags)) return ''
  return tags.filter(tag => tag && tag.trim().length > 0).join(', ')
}
