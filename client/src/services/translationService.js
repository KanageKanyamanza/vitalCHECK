import fallbackTranslationService from './fallbackTranslationService'

// Service de traduction automatique utilisant l'API Google Translate avec fallback
export const translationService = {
  // Traduire du texte simple
  async translateText(text, fromLang = 'auto', toLang = 'en') {
    try {
      if (!text || text.trim() === '') {
        return ''
      }

      // Essayer d'abord Google Translate
      try {
        const result = await this.callGoogleTranslateAPI(text, fromLang, toLang)
        return result
      } catch (googleError) {
        console.warn('Google Translate échoué, utilisation du fallback:', googleError)
        // Utiliser le service de fallback
        return await fallbackTranslationService.translateText(text, fromLang, toLang)
      }
    } catch (error) {
      console.error('Erreur de traduction:', error)
      throw new Error('Erreur lors de la traduction')
    }
  },

  // Appel via notre API serveur (contourne CORS)
  async callGoogleTranslateAPI(text, fromLang, toLang) {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/blogs/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text,
          fromLang,
          toLang
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.translatedText) {
        return data.translatedText
      }
      
      throw new Error('Format de réponse invalide')
    } catch (error) {
      console.error('Erreur API serveur:', error)
      throw error
    }
  },

  // Traduire un objet avec des champs bilingues
  async translateBilingualObject(obj, fromLang = 'fr', toLang = 'en') {
    try {
      // Essayer d'abord la traduction normale
      try {
        const result = await this.translateBilingualObjectInternal(obj, fromLang, toLang)
        return result
      } catch (error) {
        console.warn('Traduction normale échouée, utilisation du fallback:', error)
        // Utiliser le service de fallback
        const fallbackResult = await fallbackTranslationService.translateBilingualObject(obj, fromLang, toLang)
        return fallbackResult
      }
    } catch (error) {
      console.error('Erreur de traduction bilingue:', error)
      throw error
    }
  },

  // Traduction interne (sans fallback)
  async translateBilingualObjectInternal(obj, fromLang = 'fr', toLang = 'en') {
    const translatedObj = { ...obj }
    
    // Champs à traduire
    const fieldsToTranslate = ['title', 'excerpt', 'content', 'metaDescription', 'metaKeywords']
    
    for (const field of fieldsToTranslate) {
      if (obj[field] && obj[field][fromLang]) {
        const sourceText = obj[field][fromLang]
        if (sourceText.trim() !== '') {
          try {
            let translatedText
            if (field === 'content' && sourceText.length > 400) {
              // Diviser le contenu en parties plus petites
              translatedText = await this.translateLongText(sourceText, fromLang, toLang)
            } else {
              translatedText = await this.translateText(sourceText, fromLang, toLang)
            }
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
  },

  // Traduire un texte long en le divisant en parties
  async translateLongText(text, fromLang, toLang) {
    const maxLength = 400 // Limite de caractères par partie
    const parts = []
    
    // Diviser le texte en parties de 400 caractères max
    for (let i = 0; i < text.length; i += maxLength) {
      let part = text.substring(i, i + maxLength)
      
      // Essayer de couper à la fin d'une phrase ou d'un paragraphe
      if (i + maxLength < text.length) {
        const lastSentence = part.lastIndexOf('.')
        const lastParagraph = part.lastIndexOf('</p>')
        const lastBreak = part.lastIndexOf('<br>')
        
        const cutPoint = Math.max(lastSentence, lastParagraph, lastBreak)
        if (cutPoint > maxLength * 0.7) { // Si on trouve un bon point de coupure
          part = part.substring(0, cutPoint + 1)
          i = i - (maxLength - cutPoint - 1) // Ajuster l'index
        }
      }
      
      parts.push(part)
    }
    
    // Traduire chaque partie avec un délai
    const translatedParts = []
    for (let i = 0; i < parts.length; i++) {
      try {
        const translatedPart = await this.translateText(parts[i], fromLang, toLang)
        translatedParts.push(translatedPart)
        
        // Délai de 1 seconde entre les traductions pour éviter de surcharger l'API
        if (i < parts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.warn(`Erreur traduction partie ${i + 1}, utilisation du texte original`)
        translatedParts.push(parts[i])
      }
    }
    
    return translatedParts.join('')
  },

  // Détecter la langue du texte (simulation simple)
  async detectLanguage(text) {
    try {
      if (!text || text.trim() === '') {
        return 'auto'
      }
      
      // Pour simplifier, on retourne 'auto' et on laisse Google détecter
      return 'auto'
    } catch (error) {
      console.error('Erreur de détection de langue:', error)
      return 'auto'
    }
  },

  // Traduire avec préservation du formatage HTML simple
  async translateHtmlContent(htmlContent, fromLang = 'fr', toLang = 'en') {
    try {
      if (!htmlContent || htmlContent.trim() === '') {
        return ''
      }

      // Diviser le contenu en blocs (paragraphes, titres, etc.)
      const blocks = this.splitHtmlIntoBlocks(htmlContent)
      const translatedBlocks = []

      for (const block of blocks) {
        if (this.isHtmlTag(block)) {
          // Garder les balises HTML telles quelles
          translatedBlocks.push(block)
        } else {
          // Traduire le contenu textuel
          try {
            const translated = await this.translateText(block, fromLang, toLang)
            translatedBlocks.push(translated)
          } catch (error) {
            console.error('Erreur de traduction de bloc:', error)
            translatedBlocks.push(block) // Garder l'original en cas d'erreur
          }
        }
      }

      return translatedBlocks.join('')
    } catch (error) {
      console.error('Erreur de traduction HTML:', error)
      throw error
    }
  },

  // Diviser le HTML en blocs
  splitHtmlIntoBlocks(html) {
    // Regex pour diviser le HTML en blocs de balises et de texte
    const regex = /(<[^>]+>)|([^<]+)/g
    const blocks = []
    let match

    while ((match = regex.exec(html)) !== null) {
      if (match[1]) {
        // C'est une balise HTML
        blocks.push(match[1])
      } else if (match[2]) {
        // C'est du texte
        blocks.push(match[2])
      }
    }

    return blocks
  },

  // Vérifier si c'est une balise HTML
  isHtmlTag(text) {
    return /^<[^>]+>$/.test(text.trim())
  },

  // Méthode de traduction simple pour les cas d'usage courants
  async simpleTranslate(text, targetLang = 'en') {
    try {
      if (!text || text.trim() === '') {
        return ''
      }

      const result = await this.translateText(text, 'auto', targetLang)
      return result
    } catch (error) {
      console.error('Erreur de traduction simple:', error)
      return text // Retourner le texte original en cas d'erreur
    }
  },

  // Méthode de traduction avec retry en cas d'échec
  async translateWithRetry(text, fromLang = 'auto', toLang = 'en', maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.translateText(text, fromLang, toLang)
      } catch (error) {
        console.warn(`Tentative ${i + 1} échouée:`, error)
        if (i === maxRetries - 1) {
          throw error
        }
        // Attendre un peu avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }
}

export default translationService
