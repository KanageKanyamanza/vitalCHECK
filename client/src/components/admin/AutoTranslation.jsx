import React, { useState } from 'react'
import { Languages, Loader, Check, X, Edit3 } from 'lucide-react'
import { translationService } from '../../services/translationService'
import toast from 'react-hot-toast'

const AutoTranslation = ({ 
  formData, 
  onFormDataChange, 
  selectedLanguage = 'fr',
  className = ''
}) => {
  const [translating, setTranslating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [translatedData, setTranslatedData] = useState(null)

  // Déterminer la langue source et cible
  const sourceLang = selectedLanguage
  const targetLang = selectedLanguage === 'fr' ? 'en' : 'fr'

  // Vérifier si le contenu source existe
  const hasSourceContent = () => {
    const fields = ['title', 'excerpt', 'content']
    return fields.some(field => 
      formData[field] && 
      formData[field][sourceLang] && 
      formData[field][sourceLang].trim() !== ''
    )
  }

  // Vérifier si le contenu source est suffisant pour la traduction
  const hasEnoughContent = () => {
    const fields = ['title', 'excerpt', 'content']
    let filledFields = 0
    fields.forEach(field => {
      if (formData[field] && 
          formData[field][sourceLang] && 
          formData[field][sourceLang].trim() !== '') {
        filledFields++
      }
    })
    return filledFields >= 2 // Au moins 2 champs sur 3 doivent être remplis
  }

  // Traduire automatiquement
  const handleAutoTranslate = async () => {
    if (!hasEnoughContent()) {
      toast.error('Veuillez remplir au moins le titre et le résumé avant de traduire')
      return
    }

    setTranslating(true)
    try {
      const translated = await translationService.translateBilingualObject(
        formData, 
        sourceLang, 
        targetLang
      )
      
      setTranslatedData(translated)
      setShowPreview(true)
      toast.success('Traduction terminée ! Vérifiez le résultat avant de l\'appliquer.')
    } catch (error) {
      console.error('Erreur de traduction:', error)
      toast.error('Erreur lors de la traduction automatique')
    } finally {
      setTranslating(false)
    }
  }

  // Appliquer la traduction
  const applyTranslation = () => {
    if (translatedData) {
      onFormDataChange(translatedData)
      setShowPreview(false)
      setTranslatedData(null)
      toast.success('Traduction appliquée avec succès !')
    }
  }

  // Annuler la traduction
  const cancelTranslation = () => {
    setShowPreview(false)
    setTranslatedData(null)
  }

  // Modifier manuellement une traduction
  const editTranslation = (field, value) => {
    if (translatedData) {
      setTranslatedData({
        ...translatedData,
        [field]: {
          ...translatedData[field],
          [targetLang]: value
        }
      })
    }
  }

  if (!hasSourceContent()) {
    return null
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Languages className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-blue-900">
            Traduction automatique
          </h3>
        </div>
        
        {!showPreview && (
          <button
            onClick={handleAutoTranslate}
            disabled={translating}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Languages className="h-4 w-4" />
            )}
            <span>
              {translating ? 'Traduction...' : `Traduire en ${targetLang.toUpperCase()}`}
            </span>
          </button>
        )}
      </div>

      {showPreview && translatedData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              Aperçu de la traduction en <strong>{targetLang.toUpperCase()}</strong> :
            </p>
            <div className="flex space-x-2">
              <button
                onClick={applyTranslation}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
                <span>Appliquer</span>
              </button>
              <button
                onClick={cancelTranslation}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                <span>Annuler</span>
              </button>
            </div>
          </div>

          {/* Aperçu des traductions */}
          <div className="space-y-3">
            {['title', 'excerpt', 'content'].map(field => {
              const originalValue = formData[field]?.[sourceLang] || ''
              const translatedValue = translatedData[field]?.[targetLang] || ''
              
              if (!originalValue.trim()) return null

              return (
                <div key={field} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 capitalize">
                      {field === 'title' ? 'Titre' : field === 'excerpt' ? 'Résumé' : 'Contenu'}
                    </h4>
                    <button
                      onClick={() => {
                        const newValue = window.prompt(
                          `Modifier la traduction du ${field}:`,
                          translatedValue
                        )
                        if (newValue !== null) {
                          editTranslation(field, newValue)
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Modifier manuellement"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Original ({sourceLang.toUpperCase()}) :
                      </p>
                      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                        {originalValue.length > 200 
                          ? originalValue.substring(0, 200) + '...' 
                          : originalValue
                        }
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Traduction ({targetLang.toUpperCase()}) :
                      </p>
                      <div className="text-sm text-gray-900 bg-blue-50 p-2 rounded border max-h-20 overflow-y-auto">
                        {translatedValue.length > 200 
                          ? translatedValue.substring(0, 200) + '...' 
                          : translatedValue
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
            💡 <strong>Conseil :</strong> Vérifiez les traductions avant de les appliquer. 
            Vous pouvez cliquer sur l'icône d'édition pour modifier manuellement une traduction.
          </div>
        </div>
      )}
    </div>
  )
}

export default AutoTranslation
