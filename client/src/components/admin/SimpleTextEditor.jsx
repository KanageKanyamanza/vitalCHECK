import React from 'react'
import { Bold, Italic, List, Link, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SimpleTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Commencez à écrire...',
  className = '',
  editorId = 'content-editor',
  showHint = true
}) => {
  const { t } = useTranslation()

  const handleKeyDown = (e) => {
    // Raccourcis clavier simples
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertFormatting('**', '**')
          break
        case 'i':
          e.preventDefault()
          insertFormatting('*', '*')
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
    
    onChange(newText)
    
    // Positionner le curseur après l'insertion
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const handleBold = () => {
    insertFormatting('**', '**')
  }

  const handleItalic = () => {
    insertFormatting('*', '*')
  }

  const handleList = () => {
    insertAtCursor('- ')
  }

  const handleLink = () => {
    const url = prompt('Entrez l\'URL du lien:')
    if (url) {
      const text = prompt('Entrez le texte du lien:', url)
      insertAtCursor(`[${text || url}](${url})`)
    }
  }

  const handleImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:')
    if (url) {
      const alt = prompt('Entrez le texte alternatif:')
      insertAtCursor(`![${alt || ''}](${url})`)
    }
  }

  return (
    <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
      {/* Barre d'outils simplifiée */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg flex items-center gap-2">
        <button
          type="button"
          onClick={handleBold}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Gras (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italique (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleList}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Liste"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Lien"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleImage}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Zone d'édition */}
      <div className="p-4">
        <textarea
          id={editorId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full min-h-[400px] p-3 border-0 focus:outline-none resize-y"
          style={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Aide Markdown */}
      {showHint && (
        <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-600">
            Astuce: Utilisez la syntaxe Markdown. <strong>**gras**</strong>, <em>*italique*</em>, <span>- liste</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default SimpleTextEditor
