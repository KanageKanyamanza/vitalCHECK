import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload, Image as ImageIcon, Tag } from 'lucide-react'
import { adminBlogApiService } from '../../services/api'
import ImageUploader from '../../components/admin/ImageUploader'
import SimpleTextEditor from '../../components/admin/SimpleTextEditor'
import AutoTranslation from '../../components/admin/AutoTranslation'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'

const BlogEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: { fr: '', en: '' },
    slug: { fr: '', en: '' },
    excerpt: { fr: '', en: '' },
    content: { fr: '', en: '' },
    type: 'article',
    category: 'strategie',
    tags: [],
    status: 'draft',
    metaTitle: { fr: '', en: '' },
    metaDescription: { fr: '', en: '' },
    featuredImage: {
      url: '',
      alt: '',
      caption: ''
    },
    images: [],
    // Champs spécifiques aux études de cas
    caseStudy: {
      company: '',
      sector: '',
      companySize: '',
      challenge: '',
      solution: '',
      results: '',
      metrics: []
    },
    // Champs spécifiques aux tutoriels
    tutorial: {
      difficulty: 'debutant',
      duration: '',
      prerequisites: []
    },
    // Champs spécifiques aux témoignages
    testimonial: {
      clientName: '',
      clientCompany: '',
      clientPosition: '',
      clientPhoto: '',
      rating: 5
    }
  })

  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newMetric, setNewMetric] = useState({ label: '', value: '', description: '' })
  const [newPrerequisite, setNewPrerequisite] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('fr') // Langue sélectionnée pour l'édition
  const [useAutoTranslation, setUseAutoTranslation] = useState(false)

  // Clé pour la mémorisation dans localStorage
  const STORAGE_KEY = `blog-edit-draft-${id || 'new'}`

  // Sauvegarder les données dans localStorage
  const saveToStorage = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Impossible de sauvegarder le brouillon:', error)
    }
  }

  // Charger les données depuis localStorage
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.warn('Impossible de charger le brouillon:', error)
      return null
    }
  }

  // Effacer les données du localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Impossible d\'effacer le brouillon:', error)
    }
  }

  // Types et catégories
  const blogTypes = [
    { value: 'article', label: 'Article' },
    { value: 'etude-cas', label: 'Étude de cas' },
    { value: 'tutoriel', label: 'Tutoriel' },
    { value: 'actualite', label: 'Actualité' },
    { value: 'temoignage', label: 'Témoignage' }
  ]

  const blogCategories = [
    { value: 'strategie', label: 'Stratégie' },
    { value: 'technologie', label: 'Technologie' },
    { value: 'finance', label: 'Finance' },
    { value: 'ressources-humaines', label: 'Ressources Humaines' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Opérations' },
    { value: 'gouvernance', label: 'Gouvernance' }
  ]

  const difficultyLevels = [
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' }
  ]

  // Charger les données du blog si en mode édition
  useEffect(() => {
    if (isEdit && id) {
      loadBlog()
    } else if (!isEdit) {
      // Mode création : charger le brouillon depuis localStorage
      const savedData = loadFromStorage()
      if (savedData) {
        setFormData(savedData)
        toast.success('Brouillon restauré depuis la dernière session')
      }
    }
  }, [id, isEdit])

  // Sauvegarder automatiquement les données avec délai
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const dataToSave = {
        ...formData,
        selectedLanguage,
        useAutoTranslation,
        lastSaved: new Date().toISOString()
      }
      saveToStorage(dataToSave)
      
      // Afficher un message discret de sauvegarde
      if (formData.title?.fr?.trim() || formData.title?.en?.trim() || 
          formData.content?.fr?.trim() || formData.content?.en?.trim()) {
        toast.success('Brouillon sauvegardé automatiquement', { duration: 2000 })
      }
    }, 2000) // Délai de 2 secondes pour éviter les sauvegardes trop fréquentes

    return () => clearTimeout(timeoutId)
  }, [formData, selectedLanguage, useAutoTranslation])

  // Sauvegarder les préférences de langue et traduction
  useEffect(() => {
    const savedPrefs = loadFromStorage()
    if (savedPrefs && savedPrefs.selectedLanguage) {
      setSelectedLanguage(savedPrefs.selectedLanguage)
    }
    if (savedPrefs && savedPrefs.useAutoTranslation) {
      setUseAutoTranslation(savedPrefs.useAutoTranslation)
    }
  }, [])

  const loadBlog = async () => {
    try {
      setLoading(true)
      const response = await adminBlogApiService.getBlog(id)
      
      // Vérifier la structure de la réponse
      let blog
      if (response.data && response.data.data) {
        blog = response.data.data
      } else if (response.data) {
        blog = response.data
      } else {
        throw new Error('Structure de réponse invalide')
      }
      
      
      // Fonction pour convertir les données en format bilingue
      const convertToBilingual = (data) => {
        if (typeof data === 'string') {
          // Ancien format : chaîne simple -> convertir en objet bilingue
          return { fr: data, en: '' }
        } else if (typeof data === 'object' && data !== null) {
          // Nouveau format : objet bilingue -> garder tel quel
          return { fr: data.fr || '', en: data.en || '' }
        }
        return { fr: '', en: '' }
      }

      setFormData({
        title: convertToBilingual(blog.title),
        slug: convertToBilingual(blog.slug),
        excerpt: convertToBilingual(blog.excerpt),
        content: convertToBilingual(blog.content),
        type: blog.type || 'article',
        category: blog.category || 'strategie',
        tags: blog.tags || [],
        status: blog.status || 'draft',
        metaTitle: blog.metaTitle ? (typeof blog.metaTitle === 'object' ? { fr: blog.metaTitle.fr || '', en: blog.metaTitle.en || '' } : { fr: blog.metaTitle, en: '' }) : { fr: '', en: '' },
        metaDescription: blog.metaDescription ? (typeof blog.metaDescription === 'object' ? { fr: blog.metaDescription.fr || '', en: blog.metaDescription.en || '' } : { fr: blog.metaDescription, en: '' }) : { fr: '', en: '' },
        featuredImage: blog.featuredImage || { url: '', alt: '', caption: '' },
        images: blog.images || [],
        caseStudy: blog.caseStudy || {
          company: '',
          sector: '',
          companySize: '',
          challenge: '',
          solution: '',
          results: '',
          metrics: []
        },
        tutorial: blog.tutorial || {
          difficulty: 'debutant',
          duration: '',
          prerequisites: []
        },
        testimonial: blog.testimonial || {
          clientName: '',
          clientCompany: '',
          clientPosition: '',
          clientPhoto: '',
          rating: 5
        }
      })
    } catch (error) {
      console.error('Error loading blog:', error)
      console.error('Error details:', error.response?.data || error.message)
      toast.error(`Erreur lors du chargement du blog: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Gérer les changements de formulaire
  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  // Gérer les changements pour les champs bilingues
  const handleBilingualChange = (field, language, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value
      }
    }))
  }

  // Générer le slug automatiquement à partir du titre
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
      .trim('-') // Supprimer les tirets en début/fin
  }

  // Gérer le changement de titre et générer le slug
  const handleTitleChange = (language, value) => {
    setFormData(prev => ({
      ...prev,
      title: {
        ...prev.title,
        [language]: value
      },
      slug: {
        ...prev.slug,
        [language]: generateSlug(value)
      }
    }))
  }

  // Gérer le changement de metaTitle avec limite de caractères (bilingue)
  const handleMetaTitleChange = (language, value) => {
    if (value.length <= 60) {
      handleBilingualChange('metaTitle', language, value)
    }
  }

  // Gérer le changement de metaDescription avec limite de caractères (bilingue)
  const handleMetaDescriptionChange = (language, value) => {
    if (value.length <= 160) {
      handleBilingualChange('metaDescription', language, value)
    }
  }

  // Ajouter un tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // Supprimer un tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Ajouter une métrique (pour études de cas)
  const addMetric = () => {
    if (newMetric.label.trim() && newMetric.value.trim()) {
      setFormData(prev => ({
        ...prev,
        caseStudy: {
          ...prev.caseStudy,
          metrics: [...prev.caseStudy.metrics, { ...newMetric }]
        }
      }))
      setNewMetric({ label: '', value: '', description: '' })
    }
  }

  // Supprimer une métrique
  const removeMetric = (index) => {
    setFormData(prev => ({
      ...prev,
      caseStudy: {
        ...prev.caseStudy,
        metrics: prev.caseStudy.metrics.filter((_, i) => i !== index)
      }
    }))
  }

  // Ajouter un prérequis (pour tutoriels)
  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.tutorial.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        tutorial: {
          ...prev.tutorial,
          prerequisites: [...prev.tutorial.prerequisites, newPrerequisite.trim()]
        }
      }))
      setNewPrerequisite('')
    }
  }

  // Supprimer un prérequis
  const removePrerequisite = (prerequisiteToRemove) => {
    setFormData(prev => ({
      ...prev,
      tutorial: {
        ...prev.tutorial,
        prerequisites: prev.tutorial.prerequisites.filter(p => p !== prerequisiteToRemove)
      }
    }))
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation - vérifier les deux langues si mode manuel
    if (!useAutoTranslation) {
      if (!formData.title.fr?.trim() && !formData.title.en?.trim()) {
        toast.error('Au moins un titre (FR ou EN) est requis')
        return
      }
      if (!formData.content.fr?.trim() && !formData.content.en?.trim()) {
        toast.error('Au moins un contenu (FR ou EN) est requis')
        return
      }
    } else {
      // Mode traduction automatique - vérifier la langue sélectionnée
      if (!formData.title[selectedLanguage]?.trim()) {
        toast.error(`Le titre ${selectedLanguage === 'fr' ? 'français' : 'anglais'} est obligatoire`)
        return
      }
      if (!formData.content[selectedLanguage]?.trim()) {
        toast.error(`Le contenu ${selectedLanguage === 'fr' ? 'français' : 'anglais'} est obligatoire`)
        return
      }
    }

    setLoading(true)
    try {
      // Préparer les données à envoyer (ne pas envoyer les champs vides)
      const dataToSend = { ...formData }
      
      // Nettoyer les champs SEO vides
      if (dataToSend.metaTitle) {
        const hasMetaTitle = dataToSend.metaTitle.fr?.trim() || dataToSend.metaTitle.en?.trim()
        if (!hasMetaTitle) {
          delete dataToSend.metaTitle
        } else {
          // Nettoyer les valeurs vides dans les objets bilingues
          const cleaned = {}
          if (dataToSend.metaTitle.fr?.trim()) cleaned.fr = dataToSend.metaTitle.fr.trim()
          if (dataToSend.metaTitle.en?.trim()) cleaned.en = dataToSend.metaTitle.en.trim()
          dataToSend.metaTitle = cleaned
        }
      }
      
      if (dataToSend.metaDescription) {
        const hasMetaDescription = dataToSend.metaDescription.fr?.trim() || dataToSend.metaDescription.en?.trim()
        if (!hasMetaDescription) {
          delete dataToSend.metaDescription
        } else {
          // Nettoyer les valeurs vides dans les objets bilingues
          const cleaned = {}
          if (dataToSend.metaDescription.fr?.trim()) cleaned.fr = dataToSend.metaDescription.fr.trim()
          if (dataToSend.metaDescription.en?.trim()) cleaned.en = dataToSend.metaDescription.en.trim()
          dataToSend.metaDescription = cleaned
        }
      }
      
      if (isEdit) {
        // Mode édition
        await adminBlogApiService.updateBlog(id, dataToSend)
        toast.success('Blog mis à jour avec succès')
      } else {
        // Mode création
        await adminBlogApiService.createBlog(dataToSend)
        toast.success('Blog créé avec succès')
        // Effacer le brouillon après création réussie
        clearStorage()
      }
      navigate('/admin/blog')
    } catch (error) {
      console.error('Error saving blog:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Erreur lors de la sauvegarde'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-5 pb-8 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/blog')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Modifier le blog' : 'Créer un nouveau blog'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Modifiez les informations du blog' : 'Remplissez les informations pour créer un nouveau blog'}
                {!isEdit && loadFromStorage() && (
                  <span className="ml-2 text-blue-600 text-sm">💾 Brouillon sauvegardé automatiquement</span>
                )}
              </p>
            </div>
          </div>
          
          {/* Bouton pour effacer le brouillon */}
          {!isEdit && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir effacer le brouillon ?')) {
                  clearStorage()
                  setFormData({
                    title: { fr: '', en: '' },
                    excerpt: { fr: '', en: '' },
                    content: { fr: '', en: '' },
                    type: 'article',
                    category: 'strategie',
                    tags: [],
                    status: 'draft',
                    metaTitle: { fr: '', en: '' },
                    metaDescription: { fr: '', en: '' },
                    featuredImage: { url: '', alt: '', caption: '' },
                    images: [],
                    caseStudy: { company: '', sector: '', companySize: '', challenge: '', solution: '', results: '', metrics: [] },
                    tutorial: { difficulty: 'debutant', duration: '', prerequisites: [] },
                    testimonial: { clientName: '', clientCompany: '', clientPosition: '', clientPhoto: '', rating: 5 }
                  })
                  toast.success('Brouillon effacé')
                }
              }}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200"
            >
              Effacer le brouillon
            </button>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Configuration de rédaction */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Configuration de rédaction
                  </h3>
                  {!useAutoTranslation && (
                    <p className="text-sm text-gray-600">
                      Mode manuel : Remplissez les champs en français et en anglais séparément.
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-translation"
                    checked={useAutoTranslation}
                    onChange={(e) => setUseAutoTranslation(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="auto-translation" className="text-sm text-gray-700">
                    Traduction automatique
                  </label>
                </div>
              </div>
              
              {useAutoTranslation && (
                <div className="mt-3 space-y-3">
                  <div className="text-sm text-blue-600 bg-blue-100 p-3 rounded-lg">
                    💡 <strong>Mode traduction automatique :</strong> Rédigez dans votre langue préférée, 
                    la traduction automatique générera l'autre version. Vous pourrez réviser les traductions avant de les appliquer.
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Langue de rédaction :</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLanguage('fr')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          selectedLanguage === 'fr'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        🇫🇷 Français
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLanguage('en')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          selectedLanguage === 'en'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informations de base - Deux colonnes FR/EN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne Français */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Français *
                  </label>
                  <input
                    type="text"
                    value={formData.title.fr || ''}
                    onChange={(e) => handleTitleChange('fr', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Titre du blog en français"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {blogTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Résumé Français *
                  </label>
                  <textarea
                    value={formData.excerpt.fr || ''}
                    onChange={(e) => handleBilingualChange('excerpt', 'fr', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Résumé de votre article en français..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              {/* Colonne Anglais */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Anglais *
                  </label>
                  <input
                    type="text"
                    value={formData.title.en || ''}
                    onChange={(e) => handleTitleChange('en', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Blog title in English"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    {blogCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Résumé Anglais *
                  </label>
                  <textarea
                    value={formData.excerpt.en || ''}
                    onChange={(e) => handleBilingualChange('excerpt', 'en', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Summary of your article in English..."
                  />
                </div>
              </div>
            </div>

            {/* Champs spécifiques selon le type */}
            {formData.type === 'etude-cas' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'étude de cas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.caseStudy.company}
                      onChange={(e) => handleChange('caseStudy.company', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secteur
                    </label>
                    <input
                      type="text"
                      value={formData.caseStudy.sector}
                      onChange={(e) => handleChange('caseStudy.sector', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Secteur d'activité"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Défi
                  </label>
                  <textarea
                    value={formData.caseStudy.challenge}
                    onChange={(e) => handleChange('caseStudy.challenge', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Décrivez le défi rencontré"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solution
                  </label>
                  <textarea
                    value={formData.caseStudy.solution}
                    onChange={(e) => handleChange('caseStudy.solution', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Décrivez la solution mise en place"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Résultats
                  </label>
                  <textarea
                    value={formData.caseStudy.results}
                    onChange={(e) => handleChange('caseStudy.results', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    placeholder="Décrivez les résultats obtenus"
                  />
                </div>
              </div>
            )}

            {formData.type === 'tutoriel' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du tutoriel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulté
                    </label>
                    <select
                      value={formData.tutorial.difficulty}
                      onChange={(e) => handleChange('tutorial.difficulty', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      {difficultyLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée
                    </label>
                    <input
                      type="text"
                      value={formData.tutorial.duration}
                      onChange={(e) => handleChange('tutorial.duration', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="ex: 15 minutes"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'temoignage' && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du témoignage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du client
                    </label>
                    <input
                      type="text"
                      value={formData.testimonial.clientName}
                      onChange={(e) => handleChange('testimonial.clientName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nom du client"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.testimonial.clientCompany}
                      onChange={(e) => handleChange('testimonial.clientCompany', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Entreprise du client"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  <input
                    type="text"
                    value={formData.testimonial.clientPosition}
                    onChange={(e) => handleChange('testimonial.clientPosition', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Poste du client"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.testimonial.rating}
                    onChange={(e) => handleChange('testimonial.rating', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Contenu bilingue - Deux colonnes côte à côte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contenu Français */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu Français *
                </label>
                <SimpleTextEditor
                  value={formData.content.fr || ''}
                  onChange={(value) => handleBilingualChange('content', 'fr', value)}
                  placeholder="Rédigez votre article en français..."
                  className="w-full"
                  editorId="blog-content-editor-fr"
                />
              </div>

              {/* Contenu Anglais */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu Anglais *
                </label>
                <SimpleTextEditor
                  value={formData.content.en || ''}
                  onChange={(value) => handleBilingualChange('content', 'en', value)}
                  placeholder="Write your article in English..."
                  className="w-full"
                  editorId="blog-content-editor-en"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Images du blog */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du blog
              </label>
              <ImageUploader
                images={formData.images}
                onImagesChange={(images) => handleChange('images', images)}
                maxImages={10}
                showPositionControls={true}
              />
            </div>

            {/* Traduction automatique */}
            {useAutoTranslation && (
              <AutoTranslation
                formData={formData}
                onFormDataChange={setFormData}
                selectedLanguage={selectedLanguage}
              />
            )}

            {/* SEO */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SEO Français */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">SEO Français</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre SEO (FR)
                      <span className="text-sm text-gray-500 ml-2">
                        ({(formData.metaTitle?.fr || '').length}/60 caractères)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle?.fr || ''}
                      onChange={(e) => handleMetaTitleChange('fr', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        (formData.metaTitle?.fr || '').length > 60 
                          ? 'border-red-300 bg-red-50' 
                          : (formData.metaTitle?.fr || '').length > 50 
                            ? 'border-yellow-300 bg-yellow-50' 
                            : 'border-gray-300'
                      }`}
                      placeholder="Titre SEO en français"
                    />
                    {(formData.metaTitle?.fr || '').length > 60 && (
                      <p className="text-red-500 text-sm mt-1">
                        Le titre SEO ne peut pas dépasser 60 caractères
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description SEO (FR)
                      <span className="text-sm text-gray-500 ml-2">
                        ({(formData.metaDescription?.fr || '').length}/160 caractères)
                      </span>
                    </label>
                    <textarea
                      value={formData.metaDescription?.fr || ''}
                      onChange={(e) => handleMetaDescriptionChange('fr', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        (formData.metaDescription?.fr || '').length > 160 
                          ? 'border-red-300 bg-red-50' 
                          : (formData.metaDescription?.fr || '').length > 140 
                            ? 'border-yellow-300 bg-yellow-50' 
                            : 'border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Description SEO en français"
                    />
                    {(formData.metaDescription?.fr || '').length > 160 && (
                      <p className="text-red-500 text-sm mt-1">
                        La description SEO ne peut pas dépasser 160 caractères
                      </p>
                    )}
                  </div>
                </div>

                {/* SEO Anglais */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">SEO Anglais</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre SEO (EN)
                      <span className="text-sm text-gray-500 ml-2">
                        ({(formData.metaTitle?.en || '').length}/60 caractères)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle?.en || ''}
                      onChange={(e) => handleMetaTitleChange('en', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        (formData.metaTitle?.en || '').length > 60 
                          ? 'border-red-300 bg-red-50' 
                          : (formData.metaTitle?.en || '').length > 50 
                            ? 'border-yellow-300 bg-yellow-50' 
                            : 'border-gray-300'
                      }`}
                      placeholder="SEO title in English"
                    />
                    {(formData.metaTitle?.en || '').length > 60 && (
                      <p className="text-red-500 text-sm mt-1">
                        Le titre SEO ne peut pas dépasser 60 caractères
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description SEO (EN)
                      <span className="text-sm text-gray-500 ml-2">
                        ({(formData.metaDescription?.en || '').length}/160 caractères)
                      </span>
                    </label>
                    <textarea
                      value={formData.metaDescription?.en || ''}
                      onChange={(e) => handleMetaDescriptionChange('en', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        (formData.metaDescription?.en || '').length > 160 
                          ? 'border-red-300 bg-red-50' 
                          : (formData.metaDescription?.en || '').length > 140 
                            ? 'border-yellow-300 bg-yellow-50' 
                            : 'border-gray-300'
                      }`}
                      rows={3}
                      placeholder="SEO description in English"
                    />
                    {(formData.metaDescription?.en || '').length > 160 && (
                      <p className="text-red-500 text-sm mt-1">
                        La description SEO ne peut pas dépasser 160 caractères
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default BlogEditPage
