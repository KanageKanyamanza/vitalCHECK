import React, { useState, useEffect } from 'react'
import { X, Save, Upload, Image as ImageIcon, Tag, Calendar, User, Eye, EyeOff } from 'lucide-react'
import { adminBlogApiService } from '../../services/api'
import toast from 'react-hot-toast'

const BlogModal = ({ isOpen, onClose, blog, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: {
      fr: '',
      en: ''
    },
    slug: {
      fr: '',
      en: ''
    },
    excerpt: {
      fr: '',
      en: ''
    },
    content: {
      fr: '',
      en: ''
    },
    type: 'article',
    category: 'strategie',
    tags: [],
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    featuredImage: {
      url: '',
      alt: '',
      caption: ''
    },
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

  // Clé pour la mémorisation dans localStorage
  const STORAGE_KEY = 'blog-form-draft'

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

  // Effacer les données sauvegardées
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

  // Charger les données du blog si en mode édition
  useEffect(() => {
    if (blog) {
      console.log('🔍 [BLOG MODAL] Blog data received:', blog);
      console.log('🔍 [BLOG MODAL] Title type:', typeof blog.title, blog.title);
      console.log('🔍 [BLOG MODAL] Converted title:', convertToBilingual(blog.title));
      
      setFormData({
        title: convertToBilingual(blog.title),
        slug: convertToBilingual(blog.slug),
        excerpt: convertToBilingual(blog.excerpt),
        content: convertToBilingual(blog.content),
        type: blog.type || 'article',
        category: blog.category || 'strategie',
        tags: blog.tags || [],
        status: blog.status || 'draft',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        featuredImage: blog.featuredImage || { url: '', alt: '', caption: '' },
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
    } else {
      // Charger le brouillon sauvegardé ou réinitialiser le formulaire pour un nouveau blog
      const savedData = loadFromStorage()
      if (savedData) {
        setFormData(savedData)
        console.log('📝 Brouillon chargé depuis localStorage')
      } else {
        setFormData({
          title: { fr: '', en: '' },
          slug: { fr: '', en: '' },
          excerpt: { fr: '', en: '' },
          content: { fr: '', en: '' },
          type: 'article',
          category: 'strategie',
          tags: [],
          status: 'draft',
          metaTitle: '',
          metaDescription: '',
          featuredImage: { url: '', alt: '', caption: '' },
        caseStudy: {
          company: '',
          sector: '',
          companySize: '',
          challenge: '',
          solution: '',
          results: '',
          metrics: []
        },
        tutorial: {
          difficulty: 'debutant',
          duration: '',
          prerequisites: []
        },
        testimonial: {
          clientName: '',
          clientCompany: '',
          clientPosition: '',
          clientPhoto: '',
          rating: 5
        }
      })
    }
  }, [blog, isOpen])

  // Sauvegarder automatiquement les données (sauf en mode édition)
  useEffect(() => {
    if (!blog && isOpen) {
      saveToStorage(formData)
    }
  }, [formData, blog, isOpen])

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

  // Gérer le changement de metaTitle avec limite de caractères
  const handleMetaTitleChange = (value) => {
    if (value.length <= 60) {
      handleChange('metaTitle', value)
    }
  }

  // Gérer le changement de metaDescription avec limite de caractères
  const handleMetaDescriptionChange = (value) => {
    if (value.length <= 160) {
      handleChange('metaDescription', value)
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
    
    // Validation des champs bilingues
    if (!formData.title.fr.trim() || !formData.title.en.trim() || 
        !formData.excerpt.fr.trim() || !formData.excerpt.en.trim() || 
        !formData.content.fr.trim() || !formData.content.en.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires en français ET en anglais')
      return
    }

    setLoading(true)
    try {
      if (blog) {
        // Mode édition
        await adminBlogApiService.updateBlog(blog._id, formData)
        toast.success('Blog mis à jour avec succès')
      } else {
        // Mode création
        await adminBlogApiService.createBlog(formData)
        toast.success('Blog créé avec succès')
        // Effacer le brouillon après création réussie
        clearStorage()
      }
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {blog ? 'Modifier le blog' : 'Créer un nouveau blog'}
          </h2>
          <button
            onClick={() => {
              if (!blog) {
                clearStorage()
              }
              onClose()
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélecteur de langue */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue d'édition
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setSelectedLanguage('fr')}
                className={`px-4 py-2 rounded-md font-medium ${
                  selectedLanguage === 'fr'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">🇫🇷</span>
                <span className="hidden sm:inline ml-2">Français</span>
                {formData.title.fr && formData.excerpt.fr && formData.content.fr && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('en')}
                className={`px-4 py-2 rounded-md font-medium ${
                  selectedLanguage === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">🇬🇧</span>
                <span className="hidden sm:inline ml-2">English</span>
                {formData.title.en && formData.excerpt.en && formData.content.en && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Les deux langues sont obligatoires pour publier un blog
            </p>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre {selectedLanguage === 'fr' ? 'Français' : 'Anglais'} *
              </label>
              <input
                type="text"
                value={formData.title[selectedLanguage] || ''}
                onChange={(e) => {
                  console.log('🔍 [BLOG MODAL] Title input value:', e.target.value);
                  console.log('🔍 [BLOG MODAL] Current formData.title:', formData.title);
                  handleTitleChange(selectedLanguage, e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={`Titre du blog en ${selectedLanguage === 'fr' ? 'français' : 'anglais'}`}
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
          </div>

          {/* Slug généré automatiquement */}
          {formData.slug[selectedLanguage] && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du blog {selectedLanguage === 'fr' ? 'Français' : 'Anglais'} (générée automatiquement)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">/blog/</span>
                <input
                  type="text"
                  value={formData.slug[selectedLanguage]}
                  onChange={(e) => handleBilingualChange('slug', selectedLanguage, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                  placeholder="slug-du-blog"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Résumé {selectedLanguage === 'fr' ? 'Français' : 'Anglais'} *
            </label>
            <textarea
              value={formData.excerpt[selectedLanguage]}
              onChange={(e) => handleBilingualChange('excerpt', selectedLanguage, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder={`Résumé du blog en ${selectedLanguage === 'fr' ? 'français' : 'anglais'}`}
              required
            />
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
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
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Image principale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image principale
            </label>
            <div className="space-y-2">
              <input
                type="url"
                value={formData.featuredImage.url}
                onChange={(e) => handleChange('featuredImage.url', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="URL de l'image"
              />
              <input
                type="text"
                value={formData.featuredImage.alt}
                onChange={(e) => handleChange('featuredImage.alt', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Texte alternatif"
              />
              <input
                type="text"
                value={formData.featuredImage.caption}
                onChange={(e) => handleChange('featuredImage.caption', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Légende de l'image"
              />
            </div>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu {selectedLanguage === 'fr' ? 'Français' : 'Anglais'} *
            </label>
            <textarea
              value={formData.content[selectedLanguage]}
              onChange={(e) => handleBilingualChange('content', selectedLanguage, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={10}
              placeholder={`Contenu du blog en ${selectedLanguage === 'fr' ? 'français' : 'anglais'} (HTML supporté)`}
              required
            />
          </div>

          {/* SEO */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre SEO
                  <span className="text-sm text-gray-500 ml-2">
                    ({formData.metaTitle.length}/60 caractères)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleMetaTitleChange(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    formData.metaTitle.length > 60 
                      ? 'border-red-300 bg-red-50' 
                      : formData.metaTitle.length > 50 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'border-gray-300'
                  }`}
                  placeholder="Titre pour les moteurs de recherche"
                />
                {formData.metaTitle.length > 60 && (
                  <p className="text-red-500 text-sm mt-1">
                    Le titre SEO ne peut pas dépasser 60 caractères
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description SEO
                  <span className="text-sm text-gray-500 ml-2">
                    ({formData.metaDescription.length}/160 caractères)
                  </span>
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleMetaDescriptionChange(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    formData.metaDescription.length > 160 
                      ? 'border-red-300 bg-red-50' 
                      : formData.metaDescription.length > 140 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Description pour les moteurs de recherche"
                />
                {formData.metaDescription.length > 160 && (
                  <p className="text-red-500 text-sm mt-1">
                    La description SEO ne peut pas dépasser 160 caractères
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                if (!blog) {
                  clearStorage()
                }
                onClose()
              }}
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
              {blog ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogModal
