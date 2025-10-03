import React from 'react'
import SEOHead from './SEOHead'

const SEOTest = ({ blog }) => {
  // Test avec des valeurs sûres
  const safeBlog = blog || {}
  
  console.log('SEOTest - blog:', blog)
  console.log('SEOTest - safeBlog:', safeBlog)
  console.log('SEOTest - blog.slug:', blog?.slug)
  console.log('SEOTest - typeof blog.slug:', typeof blog?.slug)
  
  return (
    <SEOHead
      title={safeBlog.title || "Test SEO"}
      description={safeBlog.excerpt || "Description de test"}
      keywords="test, seo"
      url="/test"
      image="/og-image.png"
      type="article"
    />
  )
}

export default SEOTest
