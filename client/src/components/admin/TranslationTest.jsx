import React, { useState } from 'react'
import { translationService } from '../../services/translationService'
import toast from 'react-hot-toast'

const TranslationTest = () => {
  const [text, setText] = useState('Bonjour, comment allez-vous ?')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)

  const testTranslation = async () => {
    setLoading(true)
    try {
      const result = await translationService.translateText(text, 'fr', 'en')
      setTranslated(result)
      toast.success('Traduction réussie !')
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de traduction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Test de traduction</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte à traduire :
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>
        
        <button
          onClick={testTranslation}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Traduction...' : 'Traduire'}
        </button>
        
        {translated && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Résultat :
            </label>
            <div className="p-2 bg-gray-100 rounded">
              {translated}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranslationTest
