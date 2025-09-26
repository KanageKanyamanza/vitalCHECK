/**
 * Utilitaire pour auto-traduire les tags manquants
 */

// Dictionnaire de traductions automatiques
const autoTranslations = {
  // Français vers Anglais
  'Afrique du Sud': 'South Africa',
  'Aliments emballés': 'Packaged Food',
  'Marchés africains': 'African Markets',
  'Industrie alimentaire': 'Food Industry',
  'Chaîne d\'approvisionnement': 'Supply Chain',
  'Commerce de détail': 'Retail',
  'Développement commercial': 'Business Development',
  'Afrique': 'Africa',
  'Chaîne de valeur alimentaire': 'Food Value Chain',
  'Secteur de la grande distribution': 'Supermarket Sector',
  
  // Anglais vers Français
  'South Africa': 'Afrique du Sud',
  'Packaged Food': 'Aliments emballés',
  'African Markets': 'Marchés africains',
  'Food Industry': 'Industrie alimentaire',
  'Supply Chain': 'Chaîne d\'approvisionnement',
  'Retail': 'Commerce de détail',
  'Business Development': 'Développement commercial',
  'Africa': 'Afrique',
  'Food Value Chain': 'Chaîne de valeur alimentaire',
  'Supermarket Sector': 'Secteur de la grande distribution',
  
  // Mots communs
  'Business': 'Entreprise',
  'Health': 'Santé',
  'Management': 'Management',
  'Finance': 'Finance',
  'Growth': 'Croissance',
  'Strategy': 'Stratégie',
  'Technology': 'Technologie',
  'Marketing': 'Marketing',
  'Operations': 'Opérations',
  'Governance': 'Gouvernance',
  'Diagnostic': 'Diagnostic',
  'Testimonial': 'Témoignage',
  'Case Study': 'Étude de cas',
  'SME': 'PME',
  'Services': 'Services',
  'Productivity': 'Productivité',
  'Revenue': 'Chiffre d\'affaires',
  'Cash Flow': 'Trésorerie'
}

/**
 * Auto-traduit un tag
 * @param {string} tag - Le tag à traduire
 * @param {string} targetLanguage - Langue cible ('fr' ou 'en')
 * @returns {string} - Le tag traduit ou original si pas de traduction
 */
export const autoTranslateTag = (tag, targetLanguage = 'fr') => {
  if (!tag || typeof tag !== 'string') return tag
  
  const normalizedTag = tag.trim()
  
  // Si c'est déjà dans la langue cible, le retourner
  if (targetLanguage === 'fr' && /[àâäéèêëïîôöùûüÿç]/i.test(normalizedTag)) {
    return normalizedTag
  }
  
  if (targetLanguage === 'en' && !/[àâäéèêëïîôöùûüÿç]/i.test(normalizedTag)) {
    return normalizedTag
  }
  
  // Chercher une traduction automatique
  const translation = autoTranslations[normalizedTag]
  if (translation) {
    return translation
  }
  
  // Si pas de traduction trouvée, retourner le tag original
  return normalizedTag
}

/**
 * Auto-traduit une liste de tags
 * @param {Array} tags - Liste des tags
 * @param {string} targetLanguage - Langue cible
 * @returns {Array} - Liste des tags traduits
 */
export const autoTranslateTags = (tags, targetLanguage = 'fr') => {
  if (!Array.isArray(tags)) return []
  
  return tags.map(tag => autoTranslateTag(tag, targetLanguage))
}

/**
 * Génère les traductions manquantes pour les fichiers i18n
 * @param {Array} tags - Liste des tags à traduire
 * @returns {Object} - Objet avec les traductions pour fr et en
 */
export const generateTagTranslations = (tags) => {
  if (!Array.isArray(tags)) return { fr: {}, en: {} }
  
  const frTranslations = {}
  const enTranslations = {}
  
  tags.forEach(tag => {
    if (tag && tag.trim()) {
      const normalizedTag = tag.trim().toLowerCase()
      
      // Traduction française
      const frTranslation = autoTranslateTag(tag, 'fr')
      if (frTranslation !== tag) {
        frTranslations[normalizedTag] = frTranslation
      }
      
      // Traduction anglaise
      const enTranslation = autoTranslateTag(tag, 'en')
      if (enTranslation !== tag) {
        enTranslations[normalizedTag] = enTranslation
      }
    }
  })
  
  return {
    fr: frTranslations,
    en: enTranslations
  }
}
