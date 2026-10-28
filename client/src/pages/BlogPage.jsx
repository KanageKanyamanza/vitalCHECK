import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/seo/SEOHead'
import { getBlogPageStructuredData } from '../utils/seoData'
import {
  Search,
  Calendar,
  User,
  Eye,
  Heart,
  Tag,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button, Container, PentagonSegments } from '../components/ui/ds'
import { blogApiService } from '../services/api'
import toast from 'react-hot-toast'
import { normalizeTags } from '../utils/tagUtils'
import { autoTranslateTag } from '../utils/autoTranslateTags'
import { getOrCreateVisitorId } from '../utils/visitorId'

const BlogPage = () => {
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
      // Debug: vérifier la structure des données
      if (response.data.data && response.data.data.length > 0) {
        console.log('📝 [BLOG PAGE] Premier blog:', {
          id: response.data.data[0]._id,
          title: response.data.data[0].title,
          featuredImage: response.data.data[0].featuredImage
        })
      }
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

  // Gérer le like/unlike (toggle)
  const handleLike = async (blogId) => {
    try {
      const visitorId = getOrCreateVisitorId()
      const response = await blogApiService.likeBlog(blogId, visitorId)
      
      if (response.data.success) {
        setBlogs(blogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, likes: response.data.data.likes }
            : blog
        ))
        
        if (response.data.data.hasLiked) {
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

  const resultsLabel = loading ? '' : t('blog.resultsCount', { count: blogs.length })

  return (
    <div className="min-h-screen bg-ubb-paper-soft">
      <SEOHead
        title={t('blog.seo.title')}
        description={t('blog.seo.description')}
        keywords={t('blog.seo.keywords')}
        url="/blog"
        structuredData={getBlogPageStructuredData()}
      />

      {/* En-tête */}
      <section aria-labelledby="blog-title" className="bg-white">
        <Container className="max-w-5xl py-10 sm:py-14">
          <h1 id="blog-title" className="ubb-heading text-ubb-title sm:text-ubb-display">
            {t('blog.title')}
          </h1>
          <p className="mt-4 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">{t('blog.subtitle')}</p>
        </Container>
      </section>

      <Container className="max-w-6xl py-8 sm:py-12">
        {/* Filtres */}
        <div role="search" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_260px]">
            <div className="relative">
              <label htmlFor="blog-search" className="sr-only">{t('blog.searchPlaceholder')}</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ubb-ink-muted" aria-hidden="true" />
              <input
                id="blog-search"
                type="search"
                placeholder={t('blog.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ubb-input pl-11"
              />
            </div>
            <div>
              <label htmlFor="blog-category" className="sr-only">{t('blog.categoryLabel')}</label>
              <select
                id="blog-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="ubb-input"
              >
                {blogCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Types : une seule rangée qui défile sur mobile */}
          <div role="radiogroup" aria-label={t('blog.typeLabel')} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {blogTypes.map((type) => {
              const active = selectedType === type.value
              return (
                <button
                  key={type.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedType(type.value)}
                  className={`ubb-focus inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 font-text text-sm font-semibold transition-colors ${
                    active
                      ? 'border-ubb-brand-900 bg-ubb-brand-900 text-white'
                      : 'border-ubb-brand-900/15 bg-white text-ubb-ink hover:border-ubb-brand-900/40'
                  }`}
                >
                  <type.icon className="h-4 w-4" aria-hidden="true" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">{resultsLabel}</p>

        {/* Liste des articles */}
        {loading ? (
          <div className="flex items-center justify-center py-20" role="status" aria-label={t('common.loading')}>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-ubb-panel border border-dashed border-ubb-brand-900/20 bg-white p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-ubb-brand-900" aria-hidden="true" />
            <h2 className="ubb-heading mt-4 text-xl">{t('blog.noArticles')}</h2>
            <p className="mt-2 font-text text-ubb-body text-ubb-ink-muted">{t('blog.noArticlesDesc')}</p>
          </div>
        ) : (
          <>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => {
                const TypeIcon = getTypeIcon(blog.type)
                const title = getLocalizedContent(blog.title, t('blog.untitled'))
                const slug = getLocalizedContent(blog.slug, blog.slug)
                const normalizedTags = normalizeTags(blog.tags)
                const coverUrl = (blog.featuredImage?.url || blog.images?.[0]?.url || '').trim()
                const hasImage = coverUrl !== ''
                return (
                  <li key={blog._id} className="group relative flex flex-col overflow-hidden rounded-ubb-card border border-ubb-brand-900/10 bg-white shadow-ubb-sm transition-shadow focus-within:ring-2 focus-within:ring-ubb-brand-900 focus-within:ring-offset-2 hover:shadow-ubb-md">
                    {hasImage ? (
                      <img
                        src={coverUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/9] w-full bg-ubb-brand-100 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex aspect-[16/9] w-full items-center justify-center bg-ubb-brand-100" aria-hidden="true">
                        <PentagonSegments done={3} className="h-16 w-16" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="flex flex-wrap items-center gap-x-2 font-text text-ubb-small font-semibold text-ubb-brand-900">
                        <TypeIcon className="h-4 w-4" aria-hidden="true" />
                        {getTypeLabel(blog.type)}
                        <span className="font-normal text-ubb-ink-muted">/ {getCategoryLabel(blog.category)}</span>
                      </p>

                      <h2 className="ubb-heading mt-3 line-clamp-2 text-xl font-semibold">
                        {/* Vrai lien : toute la carte est cliquable, au clavier comme à la souris */}
                        <Link
                          to={`/blog/${slug}`}
                          className="rounded after:absolute after:inset-0 after:content-[''] focus:outline-none"
                        >
                          {title}
                        </Link>
                      </h2>

                      <p className="mt-2 line-clamp-3 font-text text-ubb-body text-ubb-ink-muted">
                        {getLocalizedContent(blog.excerpt, t('blog.noExcerpt'))}
                      </p>

                      {normalizedTags.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2" aria-label={t('blog.tagsLabel')}>
                          {normalizedTags.slice(0, 3).map((tag, index) => (
                            <li key={index} className="inline-flex items-center gap-1 rounded-full bg-ubb-brand-50 px-2.5 py-1 font-text text-xs font-medium text-ubb-brand-950">
                              <Tag className="h-3 w-3" aria-hidden="true" />
                              {translateTag(tag)}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-5 font-text text-ubb-small text-ubb-ink-muted">
                        <span className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <User className="h-4 w-4" aria-hidden="true" />
                            {blog.author?.name || t('blog.author')}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </span>
                        <span className="relative z-10 flex items-center gap-1">
                          <span className="flex items-center gap-1.5" title={t('blog.views')}>
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">{t('blog.views')}</span>
                            {blog.views}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(blog._id)
                            }}
                            aria-label={t('blog.likeAction', { title })}
                            className="ubb-focus inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full px-2 hover:text-ubb-ink"
                          >
                            <Heart className="h-4 w-4" aria-hidden="true" />
                            {blog.likes}
                          </button>
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label={t('blog.paginationLabel')} className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {t('common.previous')}
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    aria-label={t('blog.pageN', { page })}
                    className={`ubb-focus inline-flex h-11 min-w-[44px] items-center justify-center rounded-full px-3 font-text text-sm font-semibold transition-colors ${
                      page === currentPage
                        ? 'bg-ubb-brand-900 text-white'
                        : 'border border-ubb-brand-900/15 bg-white text-ubb-ink hover:border-ubb-brand-900/40'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  {t('common.next')}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            )}
          </>
        )}
      </Container>
    </div>
  )
}

export default BlogPage
