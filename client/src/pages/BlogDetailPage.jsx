import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/seo/SEOHead'
import { getBlogPostStructuredData } from '../utils/seoData'
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
import BlogImageGallery from '../components/blog/BlogImageGallery'
import BlogVisitorModal from '../components/blog/BlogVisitorModal'
import { useBlogVisitorModal } from '../hooks/useBlogVisitorModal'
import toast from 'react-hot-toast'
import { normalizeTags } from '../utils/tagUtils'
import { autoTranslateTag } from '../utils/autoTranslateTags'

const BlogDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [liked, setLiked] = useState(false)
  const [language, setLanguage] = useState(i18n.language)
  
  // Vérifier si on est en mode prévisualisation admin
  const isPreviewMode = searchParams.get('preview') === 'true' && searchParams.get('admin') === 'true'
  
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
  
  // Hook pour la modale des visiteurs (seulement en mode normal)
  const {
    isModalOpen,
    isReturningVisitor,
    visitorData,
    scrollPercentage,
    hasShownModal,
    openModal,
    closeModal,
    handleFormSubmit
  } = useBlogVisitorModal(
    blog?._id, 
    blog ? getLocalizedContent(blog.title, 'Titre non disponible') : '', 
    slug
  )

  // Charger le blog
  const loadBlog = async () => {
    try {
      setLoading(true)
      
      let response
      if (isPreviewMode) {
        // En mode prévisualisation, utiliser l'API admin pour récupérer tous les blogs
        const { adminApiService } = await import('../services/api')
        const blogsResponse = await adminApiService.getBlogs({ limit: 100 })
        const allBlogs = blogsResponse.data.data || []
        
        // Trouver le blog par slug (localisé)
        const foundBlog = allBlogs.find(b => {
          const localizedSlug = getLocalizedContent(b.slug, b.slug)
          return localizedSlug === slug
        })
        
        if (!foundBlog) {
          throw new Error('Blog not found')
        }
        
        response = { data: { data: foundBlog } }
      } else {
        // Mode normal, utiliser l'API publique
        response = await blogApiService.getBlogBySlug(slug)
        
        // Initialiser le tracking si un visitId est fourni
        if (response.data.visitId) {
          trackingService.initTracking(response.data.visitId)
        }
      }
      
      setBlog(response.data.data)
      
      // Charger des blogs similaires (seulement en mode normal)
      if (!isPreviewMode) {
        const relatedResponse = await blogApiService.getBlogs({
          category: response.data.data.category,
          limit: 3
        })
        setRelatedBlogs(relatedResponse.data.data.filter(b => b.slug !== slug))
      }
    } catch (error) {
      console.error('Error loading blog:', error)
      toast.error(t('blog.articleNotFound'))
      if (!isPreviewMode) {
        navigate('/blog')
      }
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

  // Traduire un tag (avec auto-traduction en fallback)
  const translateTag = (tag) => {
    try {
      const translation = t(`blog.tags.${tag}`)
      
      // Si la traduction retourne la clé (pas de traduction trouvée)
      if (translation === `blog.tags.${tag}`) {
        // Essayer l'auto-traduction
        const currentLanguage = i18n.language || 'fr'
        const autoTranslated = autoTranslateTag(tag, currentLanguage)
        return autoTranslated || tag
      }
      
      // Si c'est une chaîne valide, la retourner
      if (typeof translation === 'string') {
        return translation
      }
      
      // Si c'est un objet ou autre chose, retourner le tag original
      return tag
    } catch (error) {
      // En cas d'erreur, retourner le tag original
      return tag
    }
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
    <div className="min-h-screen bg-gray-50 pt-[50px]">
      <SEOHead
        title={blog?.title ? `${blog.title} - Blog vitalCHECK` : "Blog vitalCHECK"}
        description={blog?.excerpt || (blog?.content ? (typeof blog.content === 'string' ? blog.content.substring(0, 160) + "..." : (blog.content.fr ? blog.content.fr.substring(0, 160) + "..." : blog.content.en ? blog.content.en.substring(0, 160) + "..." : "Article de blog vitalCHECK")) : "Article de blog vitalCHECK")}
        keywords={blog?.tags ? blog.tags.join(", ") : "blog business, conseils entreprise, vitalCHECK"}
        url={blog?.slug ? `/blog/${blog.slug}` : "/blog"}
        image={blog?.featuredImage || '/og-image.png'}
        type="article"
        structuredData={blog ? getBlogPostStructuredData(blog) : null}
      />
      
      {/* Indicateur de prévisualisation */}
      {isPreviewMode && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Mode prévisualisation - Article non publié
              </span>
            </div>
            <button
              onClick={() => window.close()}
              className="text-sm text-yellow-600 hover:text-yellow-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => isPreviewMode ? window.close() : navigate('/blog')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Fermer la prévisualisation' : t('blog.backToBlog')}
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

            {!isPreviewMode && (
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
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm p-2 sm:p-8">
              {/* Images en haut */}
              {blog.images && blog.images.filter(img => img.position === 'top').length > 0 && (
                <div className="mb-8">
                  <BlogImageGallery images={blog.images.filter(img => img.position === 'top')} />
                </div>
              )}

              {/* Images au début du contenu */}
              {blog.images && blog.images.filter(img => img.position === 'content-start').length > 0 && (
                <div className="mb-8">
                  <BlogImageGallery images={blog.images.filter(img => img.position === 'content-start')} />
                </div>
              )}

              {/* Contenu */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: getLocalizedContent(blog.content, 'Contenu non disponible') }}
              />

              {/* Images au milieu */}
              {blog.images && blog.images.filter(img => img.position === 'middle').length > 0 && (
                <div className="my-8">
                  <BlogImageGallery images={blog.images.filter(img => img.position === 'middle')} />
                </div>
              )}

              {/* Images en bas */}
              {blog.images && blog.images.filter(img => img.position === 'bottom').length > 0 && (
                <div className="mt-8">
                  <BlogImageGallery images={blog.images.filter(img => img.position === 'bottom')} />
                </div>
              )}

              {/* Images à la fin du contenu */}
              {blog.images && blog.images.filter(img => img.position === 'content-end').length > 0 && (
                <div className="mt-8">
                  <BlogImageGallery images={blog.images.filter(img => img.position === 'content-end')} />
                </div>
              )}

              {/* Tags */}
              {(() => {
                const normalizedTags = normalizeTags(blog.tags)
                return normalizedTags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">{t('blog.tagsLabel', 'Tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {normalizedTags.map((tag, index) => (
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
                )
              })()}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Actions - seulement en mode normal */}
              {!isPreviewMode && (
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
              )}

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

      {/* Modale des visiteurs - seulement en mode normal */}
      {!isPreviewMode && (
        <BlogVisitorModal
          isOpen={isModalOpen}
          onClose={closeModal}
          blogId={blog?._id}
          blogTitle={blog ? getLocalizedContent(blog.title, 'Titre non disponible') : ''}
          blogSlug={slug}
          isReturningVisitor={isReturningVisitor}
          visitorData={visitorData}
          onFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}

export default BlogDetailPage
