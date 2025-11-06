import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://www.checkmyenterprise.com/api'

// Télécharger un rapport PDF
export const downloadReport = async (assessmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/download/${assessmentId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    })

    // Créer un blob et télécharger le fichier
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Extraire le nom du fichier depuis les headers ou utiliser un nom par défaut
    const contentDisposition = response.headers['content-disposition']
    let filename = 'vitalCHECK-Report.pdf'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return { success: true, filename }
  } catch (error) {
    console.error('Erreur téléchargement rapport:', error)
    throw error
  }
}

// Générer un rapport
export const generateReport = async (assessmentId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reports/generate/${assessmentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur génération rapport:', error)
    throw error
  }
}
