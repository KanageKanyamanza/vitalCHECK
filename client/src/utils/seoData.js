// Données structurées Schema.org pour différentes pages

const BASE_URL = "https://www.checkmyenterprise.com"
const LOGO_URL = `${BASE_URL}/logo.png`
const OG_IMAGE = `${BASE_URL}/og-image.png`

// Signal de marque #1 : dit à Google que ce domaine EST vitalCHECK
export const getWebSiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  "name": "vitalCHECK",
  "alternateName": ["vitalCHECK Enterprise Health Check", "checkmyenterprise"],
  "url": `${BASE_URL}/`,
  "description": "Plateforme d'évaluation de la santé organisationnelle des entreprises africaines.",
  "inLanguage": ["fr", "en"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/blog?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@id": `${BASE_URL}/#organization`
  }
})

// Signal de marque #2 : entité Organisation avec brand explicite
export const getBrandOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  "name": "vitalCHECK",
  "legalName": "Ubuntu Business Builders",
  "alternateName": ["vitalCHECK Enterprise Health Check", "checkmyenterprise.com"],
  "description": "Plateforme d'évaluation de la santé organisationnelle des entreprises africaines. Diagnostic gratuit, recommandations personnalisées et rapport détaillé.",
  "url": `${BASE_URL}/`,
  "logo": {
    "@type": "ImageObject",
    "@id": `${BASE_URL}/#logo`,
    "url": LOGO_URL,
    "contentUrl": LOGO_URL,
    "width": 512,
    "height": 512,
    "caption": "vitalCHECK"
  },
  "image": {
    "@id": `${BASE_URL}/#logo`
  },
  "brand": {
    "@type": "Brand",
    "name": "vitalCHECK",
    "alternateName": "vitalCHECK Enterprise Health Check"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@checkmyenterprise.com",
    "availableLanguage": ["French", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressContinent": "Africa"
  },
  "sameAs": [
    `${BASE_URL}/`,
    "https://www.linkedin.com/company/vitalcheck",
    "https://twitter.com/vitalCHECK"
  ],
  "foundingDate": "2024"
})

export const getHomePageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#software`,
  "name": "vitalCHECK",
  "alternateName": "vitalCHECK Enterprise Health Check",
  "description": "Évaluez la santé organisationnelle de votre entreprise africaine avec vitalCHECK. Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé.",
  "url": `${BASE_URL}/`,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "XOF"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "120"
  },
  "author": {
    "@id": `${BASE_URL}/#organization`
  },
  "provider": {
    "@id": `${BASE_URL}/#organization`
  },
  "inLanguage": ["fr", "en"],
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Entrepreneurs, PME, Startups africains"
  },
  "featureList": [
    "Évaluation gratuite de santé d'entreprise",
    "Rapport détaillé personnalisé",
    "Recommandations d'amélioration",
    "Diagnostic multi-piliers",
    "Interface multilingue"
  ],
  "image": OG_IMAGE,
  "screenshot": OG_IMAGE
})

export const getAssessmentPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Évaluation de Santé d'Entreprise - vitalCHECK",
  "description": "Commencez votre évaluation gratuite de santé d'entreprise avec vitalCHECK. Diagnostic complet en 10 minutes avec recommandations personnalisées.",
  "url": "https://www.checkmyenterprise.com/assessment",
  "mainEntity": {
    "@type": "WebApplication",
    "name": "vitalCHECK Assessment Tool",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://www.checkmyenterprise.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Évaluation",
        "item": "https://www.checkmyenterprise.com/assessment"
      }
    ]
  }
})

export const getBlogPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog vitalCHECK - Conseils et Actualités Business",
  "description": "Découvrez nos articles sur la santé d'entreprise, le management, la croissance et les bonnes pratiques pour PME et startups africaines.",
  "url": "https://www.checkmyenterprise.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "logo": {
      "@type": "ImageObject",
      "url": LOGO_URL
    }
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://www.checkmyenterprise.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.checkmyenterprise.com/blog"
      }
    ]
  }
})

export const getBlogPostStructuredData = (blog) => {
  // Protection contre les valeurs undefined
  if (!blog || typeof blog !== 'object') {
    return null
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title || "Article de blog",
    "description": blog.excerpt || (blog.content ? (typeof blog.content === 'string' ? blog.content.substring(0, 160) + "..." : (blog.content.fr ? blog.content.fr.substring(0, 160) + "..." : blog.content.en ? blog.content.en.substring(0, 160) + "..." : "Article de blog vitalCHECK")) : "Article de blog vitalCHECK"),
    "image": (blog.featuredImage && typeof blog.featuredImage === 'string') ? `https://www.checkmyenterprise.com${blog.featuredImage}` : "https://www.checkmyenterprise.com/og-image.png",
    "url": blog.slug ? `https://www.checkmyenterprise.com/blog/${blog.slug}` : "https://www.checkmyenterprise.com/blog",
  "datePublished": blog.publishedAt,
  "dateModified": blog.updatedAt,
  "author": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "url": "https://www.checkmyenterprise.com/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "logo": {
      "@type": "ImageObject",
      "url": LOGO_URL
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.checkmyenterprise.com/blog/${blog.slug}`
  },
  "keywords": blog.tags ? blog.tags.join(", ") : "entreprise, business, conseil",
  "articleSection": blog.category || "Business",
  "wordCount": blog.content ? (typeof blog.content === 'string' ? blog.content.split(' ').length : (blog.content.fr ? blog.content.fr.split(' ').length : blog.content.en ? blog.content.en.split(' ').length : 0)) : 0,
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://www.checkmyenterprise.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.checkmyenterprise.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title || "Article",
        "item": blog.slug ? `https://www.checkmyenterprise.com/blog/${blog.slug}` : "https://www.checkmyenterprise.com/blog"
      }
    ]
  }
  }
}

export const getAboutPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "À Propos - vitalCHECK Enterprise Health Check",
  "description": "Découvrez vitalCHECK, la plateforme d'évaluation de santé d'entreprise développée par Ubuntu Business Builders pour les PME africaines.",
  "url": "https://www.checkmyenterprise.com/about",
  "mainEntity": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "description": "Organisation dédiée au développement des entreprises africaines",
    "url": "https://www.checkmyenterprise.com/",
    "logo": LOGO_URL,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@checkmyenterprise.com"
    },
    "sameAs": [
      "https://www.linkedin.com/company/vitalcheck",
      "https://twitter.com/vitalCHECK"
    ]
  }
})

export const getContactPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact - vitalCHECK Enterprise Health Check",
  "description": "Contactez l'équipe vitalCHECK pour toute question sur l'évaluation de santé d'entreprise ou nos services de conseil.",
  "url": "https://www.checkmyenterprise.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@vitalCHECK.com",
      "availableLanguage": ["French", "English"]
    }
  }
})

// Fonction utilitaire pour générer des données structurées FAQ
export const getFAQStructuredData = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})

export const getOrganizationStructuredData = getBrandOrganizationStructuredData
