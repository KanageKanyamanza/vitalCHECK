import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Tag,
  ArrowLeft,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Users,
  ChevronRight
} from 'lucide-react'
import { blogApiService } from '../services/api'
import toast from 'react-hot-toast'
import { normalizeTags } from '../utils/tagUtils'
import { autoTranslateTag } from '../utils/autoTranslateTags'

const BlogPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [language, setLanguage] = useState(i18n.language)

  // Types et catégories
  const blogTypes = [
    { value: '', label: t('blog.types.all'), icon: FileText },
    { value: 'article', label: t('blog.types.article'), icon: FileText },
    { value: 'etude-cas', label: t('blog.types.etude-cas'), icon: BookOpen },
    { value: 'tutoriel', label: t('blog.types.tutoriel'), icon: TrendingUp },
    { value: 'actualite', label: t('blog.types.actualite'), icon: Clock },
    { value: 'temoignage', label: t('blog.types.temoignage'), icon: Users }
  ]

  const blogCategories = [
    { value: '', label: t('blog.categories.all') },
    { value: 'strategie', label: t('blog.categories.strategie') },
    { value: 'technologie', label: t('blog.categories.technologie') },
    { value: 'finance', label: t('blog.categories.finance') },
    { value: 'ressources-humaines', label: t('blog.categories.ressources-humaines') },
    { value: 'marketing', label: t('blog.categories.marketing') },
    { value: 'operations', label: t('blog.categories.operations') },
    { value: 'gouvernance', label: t('blog.categories.gouvernance') }
  ]

  // Charger les blogs
  const loadBlogs = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedType && { type: selectedType }),
        ...(selectedCategory && { category: selectedCategory })
      }

      const response = await blogApiService.getBlogs(params)
      setBlogs(response.data.data)
      setTotalPages(response.data.pagination.pages)
    } catch (error) {
      console.error('Error loading blogs:', error)
      toast.error(t('blog.error'))
    } finally {
      setLoading(false)
    }
  }

  // Effet pour charger les blogs
  useEffect(() => {
    loadBlogs()
  }, [currentPage, selectedType, selectedCategory, language])

  // Effet pour détecter les changements de langue
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log('🌐 [BLOG PAGE] Changement de langue détecté:', lng)
      setLanguage(lng)
      // Recharger les blogs avec la nouvelle langue
      loadBlogs()
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // Effet pour la recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchParams.get('search')) {
        setSearchParams({ search: searchTerm })
        setCurrentPage(1)
        loadBlogs()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Gérer le like
  const handleLike = async (blogId) => {
    try {
      await blogApiService.likeBlog(blogId)
      setBlogs(blogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, likes: blog.likes + 1 }
          : blog
      ))
      toast.success(t('blog.likeSuccess'))
    } catch (error) {
      console.error('Error liking blog:', error)
      toast.error(t('blog.likeError'))
    }
  }

  // Naviguer vers un blog
  const handleBlogClick = (blog) => {
    const localizedSlug = getLocalizedContent(blog.slug, blog.slug)
    navigate(`/blog/${localizedSlug}`)
  }

  // Formater la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Obtenir l'icône du type
  const getTypeIcon = (type) => {
    const typeConfig = blogTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.icon : FileText
  }

  // Obtenir le label du type
  const getTypeLabel = (type) => {
    const typeConfig = blogTypes.find(typeItem => typeItem.value === type)
    return typeConfig ? typeConfig.label : t('blog.types.article')
  }

  // Obtenir le label de la catégorie
  const getCategoryLabel = (category) => {
    const categoryConfig = blogCategories.find(c => c.value === category)
    return categoryConfig ? categoryConfig.label : category
  }

  // Obtenir le contenu localisé d'un blog
  const getLocalizedContent = (content, fallback = '') => {
    if (!content) return fallback
    
    // Si c'est déjà une chaîne (ancien format), la retourner
    if (typeof content === 'string') return content
    
    // Si c'est un objet bilingue, retourner selon la langue
    if (typeof content === 'object' && content !== null) {
      const currentLanguage = i18n.language || 'fr'
      return content[currentLanguage] || content.fr || content.en || fallback
    }
    
    return fallback
  }

  // Traduire un tag (avec auto-traduction en fallback)
  const translateTag = (tag) => {
    const translation = t(`blog.tags.${tag}`)
    
    // Si la traduction retourne la clé (pas de traduction trouvée)
    if (translation === `blog.tags.${tag}`) {
      // Essayer l'auto-traduction
      const currentLanguage = i18n.language || 'fr'
      const autoTranslated = autoTranslateTag(tag, currentLanguage)
      return autoTranslated
    }
    
    return translation
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('blog.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('blog.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filtre par type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {blogTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Filtre par catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {blogCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Bouton retour */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToHome')}
            </button>
          </div>
        </div>

        {/* Liste des blogs */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('blog.noArticles')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('blog.noArticlesDesc')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => {
                const TypeIcon = getTypeIcon(blog.type)
                return (
                  <article
                    key={blog._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleBlogClick(blog)}
                  >
                    {/* Image */}
                    {blog.featuredImage?.url && (
                      <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                        <img
                          src={blog.featuredImage.url}
                          alt={blog.featuredImage.alt || blog.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="p-2 sm:p-6">
                      {/* Métadonnées */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center text-sm text-primary-600">
                          <TypeIcon className="h-4 w-4 mr-1" />
                          {getTypeLabel(blog.type)}
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {getCategoryLabel(blog.category)}
                        </span>
                      </div>

                      {/* Titre */}
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {getLocalizedContent(blog.title, 'Titre non disponible')}
                      </h2>

                      {/* Extrait */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {getLocalizedContent(blog.excerpt, 'Extrait non disponible')}
                      </p>

                      {/* Tags */}
                      {(() => {
                        const normalizedTags = normalizeTags(blog.tags)
                        return normalizedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {normalizedTags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {translateTag(tag)}
                              </span>
                            ))}
                          </div>
                        )
                      })()}

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {blog.author?.name || t('blog.author')}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {blog.views}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(blog._id)
                            }}
                            className="flex items-center hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {blog.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.previous')}
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === currentPage
                          ? 'text-white bg-primary-600 border border-primary-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('common.next')}
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BlogPage
