// Service de traduction de fallback utilisant LibreTranslate (gratuit et open source)
export const fallbackTranslationService = {
  // URL de l'instance LibreTranslate publique (gratuite)
  LIBRETRANSLATE_URL: 'https://libretranslate.de/translate',

  // Traduire du texte avec LibreTranslate
  async translateText(text, fromLang = 'auto', toLang = 'en') {
    try {
      if (!text || text.trim() === '') {
        return ''
      }

      const response = await fetch(this.LIBRETRANSLATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang === 'auto' ? 'auto' : fromLang,
          target: toLang,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      
      if (data && data.translatedText) {
        return data.translatedText
      }
      
      throw new Error('Format de réponse invalide')
    } catch (error) {
      console.error('Erreur LibreTranslate:', error)
      throw error
    }
  },

  // Traduire un objet avec des champs bilingues
  async translateBilingualObject(obj, fromLang = 'fr', toLang = 'en') {
    try {
      const translatedObj = { ...obj }
      
      // Champs à traduire
      const fieldsToTranslate = ['title', 'excerpt', 'content', 'metaDescription', 'metaKeywords']
      
      for (const field of fieldsToTranslate) {
        if (obj[field] && obj[field][fromLang]) {
          const sourceText = obj[field][fromLang]
          if (sourceText.trim() !== '') {
            try {
              const translatedText = await this.translateText(sourceText, fromLang, toLang)
              translatedObj[field] = {
                ...obj[field],
                [toLang]: translatedText
              }
            } catch (error) {
              console.error(`Erreur de traduction pour ${field}:`, error)
              // Garder le texte original en cas d'erreur
              translatedObj[field] = {
                ...obj[field],
                [toLang]: sourceText
              }
            }
          }
        }
      }
      
      return translatedObj
    } catch (error) {
      console.error('Erreur de traduction bilingue:', error)
      throw error
    }
  }
}

export default fallbackTranslationService
