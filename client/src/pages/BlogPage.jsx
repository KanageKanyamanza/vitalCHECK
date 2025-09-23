import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

const BlogPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Types et catégories
  const blogTypes = [
    { value: '', label: 'Tous les types', icon: FileText },
    { value: 'article', label: 'Articles', icon: FileText },
    { value: 'etude-cas', label: 'Études de cas', icon: BookOpen },
    { value: 'tutoriel', label: 'Tutoriels', icon: TrendingUp },
    { value: 'actualite', label: 'Actualités', icon: Clock },
    { value: 'temoignage', label: 'Témoignages', icon: Users }
  ]

  const blogCategories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'strategie', label: 'Stratégie' },
    { value: 'technologie', label: 'Technologie' },
    { value: 'finance', label: 'Finance' },
    { value: 'ressources-humaines', label: 'Ressources Humaines' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Opérations' },
    { value: 'gouvernance', label: 'Gouvernance' }
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
      toast.error('Erreur lors du chargement des blogs')
    } finally {
      setLoading(false)
    }
  }

  // Effet pour charger les blogs
  useEffect(() => {
    loadBlogs()
  }, [currentPage, selectedType, selectedCategory])

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
      toast.success('Merci pour votre like !')
    } catch (error) {
      console.error('Error liking blog:', error)
      toast.error('Erreur lors du like')
    }
  }

  // Naviguer vers un blog
  const handleBlogClick = (slug) => {
    navigate(`/blog/${slug}`)
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
    const typeConfig = blogTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.label : 'Article'
  }

  // Obtenir le label de la catégorie
  const getCategoryLabel = (category) => {
    const categoryConfig = blogCategories.find(c => c.value === category)
    return categoryConfig ? categoryConfig.label : category
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog UBB Enterprise Health Check
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos articles, études de cas et tutoriels pour améliorer la santé de votre entreprise
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
                placeholder="Rechercher un article..."
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
              Retour à l'accueil
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun article trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun article ne correspond à vos critères de recherche.
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
                    onClick={() => handleBlogClick(blog.slug)}
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
                        {blog.title}
                      </h2>

                      {/* Extrait */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {blog.author?.name || 'Auteur'}
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
                    Précédent
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
                    Suivant
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
