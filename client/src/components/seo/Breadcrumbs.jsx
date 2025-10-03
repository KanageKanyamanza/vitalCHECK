import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

const Breadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null

  // Ajouter l'accueil au début si pas présent
  const breadcrumbItems = items[0]?.name !== 'Accueil' 
    ? [{ name: 'Accueil', url: '/' }, ...items]
    : items

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": (item.url && item.url.startsWith('http')) ? item.url : `https://www.checkmyenterprise.com${item.url || '/'}`
    }))
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              <Link 
                to={item.url} 
                className="flex items-center hover:text-primary-600 transition-colors"
                aria-label="Accueil"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : (
              <Link 
                to={item.url} 
                className="hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            )}
            
            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  )
}

export default Breadcrumbs
