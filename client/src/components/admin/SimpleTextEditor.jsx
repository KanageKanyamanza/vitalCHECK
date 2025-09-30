import React from 'react'
import { useTranslation } from 'react-i18next'

const SimpleTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Commencez à écrire...',
  className = '',
  editorId = 'content-editor'
}) => {
  const { t } = useTranslation()

  const handleKeyDown = (e) => {
    // Raccourcis clavier simples
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertFormatting('<strong>', '</strong>')
          break
        case 'i':
          e.preventDefault()
          insertFormatting('<em>', '</em>')
          break
        case 'u':
          e.preventDefault()
          insertFormatting('<u>', '</u>')
          break
      }
    }
  }

  const insertFormatting = (openTag, closeTag) => {
    const textarea = document.getElementById(editorId)
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end)
    
    // Utiliser un délai pour éviter les sauvegardes trop fréquentes
    onChange(newText)
    
    // Restaurer la sélection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + openTag.length, end + openTag.length)
    }, 0)
  }

  const insertAtCursor = (text) => {
    const textarea = document.getElementById(editorId)
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = value.substring(0, start) + text + value.substring(end)
    
    // Utiliser un délai pour éviter les sauvegardes trop fréquentes
    onChange(newText)
    
    // Positionner le curseur après l'insertion
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const formatButtons = [
    { label: 'Gras', tag: '<strong>', closeTag: '</strong>', shortcut: 'Ctrl+B' },
    { label: 'Italique', tag: '<em>', closeTag: '</em>', shortcut: 'Ctrl+I' },
    { label: 'Souligné', tag: '<u>', closeTag: '</u>', shortcut: 'Ctrl+U' },
    { label: 'Barré', tag: '<s>', closeTag: '</s>', shortcut: '' },
  ]

  const structureButtons = [
    { label: 'Titre 1', tag: '<h1>', closeTag: '</h1>' },
    { label: 'Titre 2', tag: '<h2>', closeTag: '</h2>' },
    { label: 'Titre 3', tag: '<h3>', closeTag: '</h3>' },
    { label: 'Paragraphe', tag: '<p>', closeTag: '</p>' },
  ]

  const listButtons = [
    { label: 'Liste à puces', tag: '<ul>\n<li>', closeTag: '</li>\n</ul>' },
    { label: 'Liste numérotée', tag: '<ol>\n<li>', closeTag: '</li>\n</ol>' },
    { label: 'Citation', tag: '<blockquote>', closeTag: '</blockquote>' },
  ]

  const insertButtons = [
    { label: 'Ligne horizontale', tag: '<hr>' },
    { label: 'Saut de ligne', tag: '<br>' },
    { label: 'Lien', tag: '<a href="URL">Texte du lien</a>' },
    { label: 'Image', tag: '<img src="URL" alt="Description">' },
  ]

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Barre d'outils */}
      <div className="border-b border-gray-200 p-3 bg-gray-50 rounded-t-lg">
        <div className="space-y-3">
          {/* Formatage du texte */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Formatage</h4>
            <div className="flex flex-wrap gap-2">
              {formatButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertFormatting(button.tag, button.closeTag)
                  }}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={button.shortcut ? `Raccourci: ${button.shortcut}` : ''}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {/* Structure */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Structure</h4>
            <div className="flex flex-wrap gap-2">
              {structureButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertFormatting(button.tag, button.closeTag)
                  }}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listes et citations */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Listes et citations</h4>
            <div className="flex flex-wrap gap-2">
              {listButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertFormatting(button.tag, button.closeTag)
                  }}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {/* Éléments spéciaux */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Éléments</h4>
            <div className="flex flex-wrap gap-2">
              {insertButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertAtCursor(button.tag)
                  }}
                  className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zone d'édition */}
      <div className="p-4">
        <textarea
          id={editorId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-64 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          style={{ fontFamily: 'monospace' }}
        />
      </div>

      {/* Aide */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>💡 Conseils :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Utilisez les boutons ci-dessus pour formater votre texte</li>
            <li>Raccourcis clavier : <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+B</kbd> (gras), <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+I</kbd> (italique), <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+U</kbd> (souligné)</li>
            <li>Sélectionnez du texte avant d'appliquer un formatage</li>
            <li>Le HTML généré sera automatiquement formaté dans l'article</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SimpleTextEditor
