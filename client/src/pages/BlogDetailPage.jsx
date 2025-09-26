import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Tag,
  Share2,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react'
import { blogApiService } from '../services/api'
import trackingService from '../services/trackingService'
import toast from 'react-hot-toast'

const BlogDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [liked, setLiked] = useState(false)
  const [language, setLanguage] = useState(i18n.language)

  // Charger le blog
  const loadBlog = async () => {
    try {
      setLoading(true)
      const response = await blogApiService.getBlogBySlug(slug)
      setBlog(response.data.data)
      
      // Initialiser le tracking si un visitId est fourni
      if (response.data.visitId) {
        console.log('📖 [BLOG DETAIL] Initialisation du tracking avec visitId:', response.data.visitId)
        trackingService.initTracking(response.data.visitId)
      } else {
        console.log('⚠️ [BLOG DETAIL] Aucun visitId fourni pour le tracking')
      }
      
      // Charger des blogs similaires
      const relatedResponse = await blogApiService.getBlogs({
        category: response.data.data.category,
        limit: 3
      })
      setRelatedBlogs(relatedResponse.data.data.filter(b => b.slug !== slug))
    } catch (error) {
      console.error('Error loading blog:', error)
      toast.error(t('blog.articleNotFound'))
      navigate('/blog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlog()
    
    // Nettoyer le tracking lors du démontage du composant
    return () => {
      trackingService.stopTracking()
    }
  }, [slug])

  // Effet pour détecter les changements de langue
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log('🌐 [BLOG DETAIL] Changement de langue détecté:', lng)
      setLanguage(lng)
      // Ne pas recharger le blog, juste mettre à jour l'affichage
      // Le contenu bilingue est déjà chargé
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // Gérer le like
  const handleLike = async () => {
    if (liked) return
    
    try {
      await blogApiService.likeBlog(blog._id)
      setBlog({ ...blog, likes: blog.likes + 1 })
      setLiked(true)
      toast.success(t('blog.likeSuccess'))
    } catch (error) {
      console.error('Error liking blog:', error)
      toast.error(t('blog.likeError'))
    }
  }

  // Partager l'article
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href)
      toast.success(t('blog.shareSuccess'))
    }
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
    const typeIcons = {
      'article': FileText,
      'etude-cas': BookOpen,
      'tutoriel': TrendingUp,
      'actualite': Clock,
      'temoignage': Users
    }
    return typeIcons[type] || FileText
  }

  // Obtenir le label du type
  const getTypeLabel = (type) => {
    const typeLabels = {
      'article': t('blog.types.article'),
      'etude-cas': t('blog.types.etude-cas'),
      'tutoriel': t('blog.types.tutoriel'),
      'actualite': t('blog.types.actualite'),
      'temoignage': t('blog.types.temoignage')
    }
    return typeLabels[type] || t('blog.types.article')
  }

  // Obtenir le label de la catégorie
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      'strategie': t('blog.categories.strategie'),
      'technologie': t('blog.categories.technologie'),
      'finance': t('blog.categories.finance'),
      'ressources-humaines': t('blog.categories.ressources-humaines'),
      'marketing': t('blog.categories.marketing'),
      'operations': t('blog.categories.operations'),
      'gouvernance': t('blog.categories.gouvernance')
    }
    return categoryLabels[category] || category
  }

  // Obtenir le contenu localisé d'un blog
  const getLocalizedContent = (content, fallback = '') => {
    if (!content) return fallback
    
    // Si c'est déjà une chaîne (ancien format), la retourner
    if (typeof content === 'string') return content
    
    // Si c'est un objet bilingue, retourner selon la langue
    if (typeof content === 'object' && content !== null) {
      const currentLanguage = i18n.language || 'fr'
      console.log('🌐 [BLOG DETAIL] Extraction contenu pour langue:', currentLanguage, 'Contenu:', content)
      return content[currentLanguage] || content.fr || content.en || fallback
    }
    
    return fallback
  }

  // Traduire un tag
  const translateTag = (tag) => {
    return t(`blog.tags.${tag}`) || tag
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('blog.articleNotFound')}</h1>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('blog.backToBlog')}
          </button>
        </div>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(blog.type)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('blog.backToBlog')}
          </button>

          {/* Métadonnées */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center text-sm text-primary-600">
              <TypeIcon className="h-4 w-4 mr-1" />
              {getTypeLabel(blog.type)}
            </div>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              {getCategoryLabel(blog.category)}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </div>
          </div>

          {/* Titre */}
          <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-4">
            {getLocalizedContent(blog.title, 'Titre non disponible')}
          </h1>

          {/* Extrait */}
          <p className="md:text-xl text-sm text-gray-600 mb-6">
            {getLocalizedContent(blog.excerpt, 'Extrait non disponible')}
          </p>

          {/* Auteur et stats */}
          <div className="flex flex-wrap content-center items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {t('blog.author')} {blog.author?.name || t('blog.unknownAuthor')}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                {blog.views} {t('blog.views')}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  liked 
                    ? 'text-red-600 bg-red-100' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className="h-4 w-4 mr-1" />
                {blog.likes}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-1" />
                {t('blog.share')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm p-2 sm:p-8">
              {/* Image principale */}
              {blog.featuredImage?.url && (
                <div className="mb-8">
                  <img
                    src={blog.featuredImage.url}
                    alt={blog.featuredImage.alt || blog.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {blog.featuredImage.caption && (
                    <p className="text-sm text-gray-500 mt-2 text-center italic">
                      {blog.featuredImage.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Contenu */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: getLocalizedContent(blog.content, 'Contenu non disponible') }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{t('blog.tags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {translateTag(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('blog.actions')}</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleLike}
                    disabled={liked}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {liked ? t('blog.thankYou') : t('blog.likeArticle')}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('blog.share')}
                  </button>
                </div>
              </div>

              {/* Articles similaires */}
              {relatedBlogs.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('blog.relatedArticles')}</h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => {
                      const RelatedTypeIcon = getTypeIcon(relatedBlog.type)
                      return (
                        <div
                          key={relatedBlog._id}
                          className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                          onClick={() => {
                            const localizedSlug = getLocalizedContent(relatedBlog.slug, relatedBlog.slug)
                            navigate(`/blog/${localizedSlug}`)
                          }}
                        >
                          {relatedBlog.featuredImage?.url && (
                            <img
                              src={relatedBlog.featuredImage.url}
                              alt={relatedBlog.title}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center text-xs text-primary-600 mb-1">
                              <RelatedTypeIcon className="h-3 w-3 mr-1" />
                              {getTypeLabel(relatedBlog.type)}
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {getLocalizedContent(relatedBlog.title, 'Titre non disponible')}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage
