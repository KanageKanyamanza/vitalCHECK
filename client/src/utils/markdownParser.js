/**
 * Parser Markdown simple pour convertir le texte en HTML formaté
 * Gère : gras, italique, titres, listes, paragraphes, liens
 */

export const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') return ''
  
  // Détecter si le texte contient déjà du HTML structuré (balises complètes)
  // On vérifie la présence de balises HTML complètes (ouvrantes + fermantes)
  const hasStructuredHtml = /<[^>]+>.*?<\/[^>]+>/i.test(text) || 
                            /<(h[1-6]|p|div|ul|ol|li|strong|em|a|br|hr|blockquote|span)[\s>]/i.test(text)
  
  // Si le texte contient déjà du HTML structuré, le retourner tel quel
  if (hasStructuredHtml) {
    return text
  }
  
  let html = text
  
  // 1. Convertir les titres
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
  
  // 2. Convertir les listes à puces (commençant par - ou *)
  // D'abord, marquer les lignes de liste
  const lines = html.split('\n')
  const processedLines = []
  let inList = false
  let listItems = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Accepter aussi les puces copiées depuis Word/Google Docs : • ou ●
    const listMatch = line.match(/^[\*\-\+•●]\s+(.+)$/)
    
    if (listMatch) {
      if (!inList) {
        inList = true
        listItems = []
      }
      listItems.push(listMatch[1])
    } else {
      // Fin de liste, fermer la liste précédente si nécessaire
      if (inList && listItems.length > 0) {
        const listHtml = listItems.map(item => `<li class="ml-6 mb-2">${item}</li>`).join('\n')
        processedLines.push(`<ul class="list-disc space-y-2 my-4">${listHtml}</ul>`)
        listItems = []
        inList = false
      }
      processedLines.push(line)
    }
  }
  
  // Fermer la dernière liste si nécessaire
  if (inList && listItems.length > 0) {
    const listHtml = listItems.map(item => `<li class="ml-6 mb-2">${item}</li>`).join('\n')
    processedLines.push(`<ul class="list-disc space-y-2 my-4">${listHtml}</ul>`)
  }
  
  html = processedLines.join('\n')
  
  // 3. Convertir les listes numérotées
  const lines2 = html.split('\n')
  const processedLines2 = []
  let inOrderedList = false
  let orderedListItems = []
  
  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i]
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/)
    
    if (orderedMatch) {
      if (!inOrderedList) {
        inOrderedList = true
        orderedListItems = []
      }
      orderedListItems.push(orderedMatch[1])
    } else {
      // Fin de liste numérotée
      if (inOrderedList && orderedListItems.length > 0) {
        const listHtml = orderedListItems.map(item => `<li class="ml-6 mb-2">${item}</li>`).join('\n')
        processedLines2.push(`<ol class="list-decimal space-y-2 my-4">${listHtml}</ol>`)
        orderedListItems = []
        inOrderedList = false
      }
      processedLines2.push(line)
    }
  }
  
  // Fermer la dernière liste numérotée si nécessaire
  if (inOrderedList && orderedListItems.length > 0) {
    const listHtml = orderedListItems.map(item => `<li class="ml-6 mb-2">${item}</li>`).join('\n')
    processedLines2.push(`<ol class="list-decimal space-y-2 my-4">${listHtml}</ol>`)
  }
  
  html = processedLines2.join('\n')
  
  // 4. Convertir le gras **texte** ou __texte__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-gray-900">$1</strong>')
  
  // 5. Convertir l'italique *texte* ou _texte_
  html = html.replace(/\*(.+?)\*/g, (match, content) => {
    // Ne pas toucher si c'est déjà dans un <strong>
    if (match.includes('<strong>')) return match
    return `<em class="italic">${content}</em>`
  })
  html = html.replace(/_(.+?)_/g, (match, content) => {
    if (match.includes('<strong>')) return match
    return `<em class="italic">${content}</em>`
  })
  
  // 6. Convertir les liens [texte](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // 7. Convertir les retours à la ligne doubles en paragraphes
  // Séparer par des lignes vides (2+ retours à la ligne)
  const contentLines = html.split('\n')
  const paragraphLines = []
  let currentParagraph = []
  
  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i].trim()
    
    if (!line) {
      // Ligne vide = séparateur de paragraphe
      if (currentParagraph.length > 0) {
        paragraphLines.push(currentParagraph.join(' '))
        currentParagraph = []
      }
      continue
    }
    
    // Si c'est déjà un élément HTML (h1, h2, ul, ol, hr, blockquote), le garder tel quel
    if (line.startsWith('<') && (line.match(/^<(h[1-6]|ul|ol|hr|blockquote|p)/i))) {
      // Fermer le paragraphe en cours si nécessaire
      if (currentParagraph.length > 0) {
        paragraphLines.push(currentParagraph.join(' '))
        currentParagraph = []
      }
      paragraphLines.push(line)
      continue
    }
    
    // Sinon, ajouter à la ligne de paragraphe en cours
    currentParagraph.push(line)
  }
  
  // Fermer le dernier paragraphe si nécessaire
  if (currentParagraph.length > 0) {
    paragraphLines.push(currentParagraph.join(' '))
  }
  
  // Envelopper les lignes de texte dans des <p>
  html = paragraphLines.map(line => {
    // Si c'est déjà du HTML, le garder tel quel
    if (line.startsWith('<')) {
      return line
    }
    // Sinon, créer un paragraphe
    return `<p class="mb-4 leading-relaxed text-gray-700">${line}</p>`
  }).join('\n')
  
  // 8. Convertir les retours à la ligne simples en <br> (dans les paragraphes)
  html = html.replace(/(<p[^>]*>)(.*?)(<\/p>)/gs, (match, openTag, content, closeTag) => {
    // Remplacer les \n par <br> sauf si c'est déjà du HTML
    content = content.replace(/\n/g, '<br>')
    return openTag + content + closeTag
  })
  
  // 9. Nettoyer les espaces multiples
  html = html.replace(/\s{3,}/g, ' ')
  
  // 10. Convertir les séparateurs horizontaux ---
  html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300">')
  
  // 11. Convertir les citations > texte
  html = html.replace(/^>\s+(.+)$/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
  
  // 12. Convertir le code inline `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
  
  return html
}

/**
 * Convertit le Markdown en éléments React
 */
export const markdownToReact = (text) => {
  const html = parseMarkdown(text)
  return { __html: html }
}

