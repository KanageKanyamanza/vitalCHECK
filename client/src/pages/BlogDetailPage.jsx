import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
import { Button, Container } from '../components/ui/ds'
import { blogApiService } from '../services/api'
import trackingService from '../services/trackingService'
import BlogImageGallery from '../components/blog/BlogImageGallery'
import BlogVisitorModal from '../components/blog/BlogVisitorModal'
import { useBlogVisitorModal } from '../hooks/useBlogVisitorModal'
import toast from 'react-hot-toast'
import { normalizeTags } from '../utils/tagUtils'
import { autoTranslateTag } from '../utils/autoTranslateTags'
import { parseMarkdown } from '../utils/markdownParser'
import { getOrCreateVisitorId } from '../utils/visitorId'

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

  /**
   * Rendu enrichi du contenu de l'article avec support Markdown
   * - Si le contenu contient déjà du HTML, on le rend tel quel (éditeur WYSIWYG)
   * - Sinon, on parse le Markdown (gras, titres, listes, etc.) et on le convertit en HTML formaté
   */
  const renderBlogContent = () => {
    const rawContent = getLocalizedContent(blog?.content, t('blog.noContent'))

    if (!rawContent) {
      return (
        <div className="ubb-article">
          <p>{t('blog.noContent')}</p>
        </div>
      )
    }

    // Heuristique : si on détecte des balises HTML complètes, on suppose que le contenu est déjà formaté
    const hasHtmlTags = /<\/(p|h1|h2|h3|h4|h5|h6|ul|ol|li|strong|em|br|div|span)>/i.test(rawContent) || /<(p|h1|h2|h3|h4|h5|h6|ul|ol|li|strong|em|br|div|span)[\s>]/i.test(rawContent)

    if (hasHtmlTags) {
      // Contenu déjà en HTML, le rendre tel quel
      return (
        <div
          className="ubb-article"
          dangerouslySetInnerHTML={{ __html: rawContent }}
        />
      )
    }

    // Sinon, parser le Markdown et convertir en HTML formaté
    const htmlContent = parseMarkdown(rawContent)

    return (
      <div
        className="ubb-article"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    )
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
      
      // Vérifier si l'utilisateur a déjà liké cet article (seulement en mode normal)
      if (!isPreviewMode && response.data.data._id) {
        try {
          const visitorId = getOrCreateVisitorId()
          const likeStatusResponse = await blogApiService.checkLikeStatus(response.data.data._id, visitorId)
          if (likeStatusResponse.data.success && likeStatusResponse.data.data.hasLiked) {
            setLiked(true)
          }
        } catch (error) {
          console.error('Error checking like status:', error)
          // Ne pas afficher d'erreur, juste continuer
        }
      }
      
      // Charger des blogs similaires (seulement en mode normal)
      if (!isPreviewMode) {
        const relatedResponse = await blogApiService.getBlogs({
          category: response.data.data.category,
          limit: 3
        })
        setRelatedBlogs(relatedResponse.data.data.filter(b => getLocalizedContent(b.slug, b.slug) !== slug))
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

  // Gérer le like/unlike (toggle)
  const handleLike = async () => {
    try {
      const visitorId = getOrCreateVisitorId()
      const response = await blogApiService.likeBlog(blog._id, visitorId)
      
      if (response.data.success) {
        const newLikedState = response.data.data.hasLiked
        setBlog({ ...blog, likes: response.data.data.likes })
        setLiked(newLikedState)
        
        if (newLikedState) {
          toast.success(t('blog.likeSuccess'))
        } else {
          toast.success(t('blog.unlikeSuccess'))
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error(t('blog.likeError'))
    }
  }

  // Partager l'article
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLocalizedContent(blog.title, ''),
          text: getLocalizedContent(blog.excerpt, ''),
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
    return new Date(date).toLocaleDateString((i18n.language || 'fr').startsWith('en') ? 'en-US' : 'fr-FR', {
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

  const NotFoundState = () => (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="ubb-heading text-ubb-title">{t('blog.articleNotFound')}</h1>
        <Button to="/blog" className="mt-6">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('blog.backToBlog')}
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t('common.loading')}>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" />
      </div>
    )
  }

  if (!blog) return <NotFoundState />

  const TypeIcon = getTypeIcon(blog.type)
  const articleTitle = getLocalizedContent(blog.title, t('blog.untitled'))

  // Données SEO localisées
  const localizedTitle =
    (blog?.metaTitle && getLocalizedContent(blog.metaTitle, null)) || articleTitle

  const localizedExcerpt =
    (blog?.metaDescription && getLocalizedContent(blog.metaDescription, null)) ||
    getLocalizedContent(blog?.excerpt, '') ||
    getLocalizedContent(blog?.content, t('blog.seo.articleFallback'))

  const localizedSlug = blog?.slug
    ? getLocalizedContent(blog.slug, slug || '')
    : slug || ''

  const seoUrl = localizedSlug ? `/blog/${localizedSlug}` : '/blog'
  const seoImage = blog?.featuredImage?.url || blog?.images?.[0]?.url || '/og-image.png'
  const normalizedTags = normalizeTags(blog.tags)

  const imagesAt = (position) => (blog.images || []).filter((img) => img.position === position)
  const Gallery = ({ position, className = '' }) =>
    imagesAt(position).length > 0 ? (
      <div className={className}>
        <BlogImageGallery images={imagesAt(position)} />
      </div>
    ) : null

  const ActionButtons = ({ className = '' }) => (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <button
        type="button"
        onClick={handleLike}
        aria-pressed={liked}
        className={`ubb-focus inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 font-text text-sm font-semibold transition-colors ${
          liked
            ? 'border-ubb-brand-900 bg-ubb-brand-900 text-white'
            : 'border-ubb-brand-900/20 bg-white text-ubb-ink hover:border-ubb-brand-900/50'
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} aria-hidden="true" />
        {liked ? t('blog.unlikeArticle') : t('blog.likeArticle')}
        <span aria-hidden="true">· {blog.likes}</span>
        <span className="sr-only">{t('blog.likesCount', { count: blog.likes })}</span>
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="ubb-focus inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ubb-brand-900/20 bg-white px-5 font-text text-sm font-semibold text-ubb-ink transition-colors hover:border-ubb-brand-900/50"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        {t('blog.share')}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-ubb-paper-soft">
      <SEOHead
        title={`${localizedTitle} - Blog vitalCHECK`}
        description={
          localizedExcerpt && typeof localizedExcerpt === 'string'
            ? `${localizedExcerpt.substring(0, 160)}${localizedExcerpt.length > 160 ? '...' : ''}`
            : t('blog.seo.articleFallback')
        }
        keywords={blog?.tags ? blog.tags.join(", ") : t('blog.seo.keywords')}
        url={seoUrl}
        image={seoImage}
        type="article"
        structuredData={blog ? getBlogPostStructuredData(blog) : null}
      />

      {/* Mode prévisualisation (administration) */}
      {isPreviewMode && (
        <div role="status" className="border-b border-ubb-accent-300 bg-ubb-accent-100 px-4 py-2">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-text text-sm font-semibold text-ubb-brand-950">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {t('blog.preview.banner')}
            </span>
            <button type="button" onClick={() => window.close()} className="ubb-focus min-h-[44px] rounded px-2 font-text text-sm font-semibold text-ubb-brand-950 underline underline-offset-4">
              {t('blog.preview.close')}
            </button>
          </div>
        </div>
      )}

      {/* En-tête de l'article */}
      <header className="bg-white">
        <Container className="max-w-4xl py-8 sm:py-12">
          {!isPreviewMode && (
            <Link to="/blog" className="ubb-focus inline-flex min-h-[44px] items-center gap-2 rounded font-text text-sm font-semibold text-ubb-brand-900">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('blog.backToBlog')}
            </Link>
          )}

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-text text-ubb-small font-semibold text-ubb-brand-900">
            <span className="flex items-center gap-1.5">
              <TypeIcon className="h-4 w-4" aria-hidden="true" />
              {getTypeLabel(blog.type)}
            </span>
            <span className="font-normal text-ubb-ink-muted">/ {getCategoryLabel(blog.category)}</span>
            <span className="flex items-center gap-1.5 font-normal text-ubb-ink-muted">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
          </p>

          <h1 className="ubb-heading mt-4 text-ubb-title sm:text-ubb-display">{articleTitle}</h1>
          <p className="mt-5 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">
            {getLocalizedContent(blog.excerpt, '')}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-text text-ubb-small text-ubb-ink-muted">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" aria-hidden="true" />
                {t('blog.author')} {blog.author?.name || t('blog.unknownAuthor')}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" aria-hidden="true" />
                {blog.views} {t('blog.views')}
              </span>
            </p>
            {!isPreviewMode && <ActionButtons />}
          </div>
        </Container>
      </header>

      <Container className="max-w-6xl py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          {/* Contenu */}
          <article className="ubb-card min-w-0 p-5 sm:p-10">
            <Gallery position="top" className="mb-8" />
            <Gallery position="content-start" className="mb-8" />

            {renderBlogContent()}

            <Gallery position="middle" className="my-8" />
            <Gallery position="bottom" className="mt-8" />
            <Gallery position="content-end" className="mt-8" />

            {normalizedTags.length > 0 && (
              <div className="mt-10 border-t border-ubb-brand-900/[0.08] pt-6">
                <h2 className="font-heading text-base font-semibold text-ubb-ink">{t('blog.tagsLabel')}</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {normalizedTags.map((tag, index) => (
                    <li key={index} className="inline-flex items-center gap-1.5 rounded-full bg-ubb-brand-50 px-3 py-1.5 font-text text-sm font-medium text-ubb-brand-950">
                      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      {translateTag(tag)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isPreviewMode && (
              <div className="mt-10 rounded-ubb-card bg-ubb-brand-900 p-6 text-white sm:p-8">
                <p className="font-heading text-xl font-semibold">{t('blog.cta.title')}</p>
                <p className="mt-2 font-text text-ubb-body text-ubb-brand-100">{t('blog.cta.text')}</p>
                <Button to="/diagnostic" className="mt-5 focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900">
                  {t('blog.cta.button')}
                </Button>
              </div>
            )}
          </article>

          {/* Articles similaires */}
          {relatedBlogs.length > 0 && (
            <aside aria-labelledby="related-title" className="lg:sticky lg:top-[calc(var(--ubb-header-h)+1.5rem)] lg:self-start">
              <h2 id="related-title" className="font-heading text-lg font-semibold text-ubb-ink">
                {t('blog.relatedArticles')}
              </h2>
              <ul className="mt-4 space-y-3">
                {relatedBlogs.map((relatedBlog) => {
                  const RelatedTypeIcon = getTypeIcon(relatedBlog.type)
                  const relatedTitle = getLocalizedContent(relatedBlog.title, t('blog.untitled'))
                  const relatedSlug = getLocalizedContent(relatedBlog.slug, relatedBlog.slug)
                  return (
                    <li key={relatedBlog._id} className="relative flex gap-3 rounded-ubb-card border border-ubb-brand-900/10 bg-white p-3 transition-shadow focus-within:ring-2 focus-within:ring-ubb-brand-900 hover:shadow-ubb-sm">
                      {(relatedBlog.featuredImage?.url || relatedBlog.images?.[0]?.url) && (
                        <img src={relatedBlog.featuredImage?.url || relatedBlog.images[0].url} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-ubb-field object-cover" />
                      )}
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-text text-xs font-semibold text-ubb-brand-900">
                          <RelatedTypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {getTypeLabel(relatedBlog.type)}
                        </p>
                        <h3 className="mt-1 line-clamp-2 font-text text-sm font-semibold text-ubb-ink">
                          <Link to={`/blog/${relatedSlug}`} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">
                            {relatedTitle}
                          </Link>
                        </h3>
                        <p className="mt-1 font-text text-xs text-ubb-ink-muted">{formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </aside>
          )}
        </div>
      </Container>

      {/* Modale des visiteurs - seulement en mode normal */}
      {!isPreviewMode && (
        <BlogVisitorModal
          isOpen={isModalOpen}
          onClose={closeModal}
          blogId={blog?._id}
          blogTitle={blog ? getLocalizedContent(blog.title, t('blog.untitled')) : ''}
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
