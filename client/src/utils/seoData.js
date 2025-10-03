// Données structurées Schema.org pour différentes pages

export const getHomePageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "VitalCheck Enterprise Health Check",
  "description": "Évaluez la santé organisationnelle de votre entreprise africaine avec VitalCheck. Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé.",
  "url": "https://www.checkmyenterprise.com/",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "provider": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "url": "https://www.checkmyenterprise.com/",
    "logo": "https://www.checkmyenterprise.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@vitalcheck.com"
    }
  },
  "author": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders"
  },
  "inLanguage": ["fr", "en"],
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Entrepreneurs, PME, Startups"
  },
  "featureList": [
    "Évaluation gratuite de santé d'entreprise",
    "Rapport détaillé personnalisé",
    "Recommandations d'amélioration",
    "Diagnostic multi-piliers",
    "Interface multilingue"
  ]
})

export const getAssessmentPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Évaluation de Santé d'Entreprise - VitalCheck",
  "description": "Commencez votre évaluation gratuite de santé d'entreprise avec VitalCheck. Diagnostic complet en 10 minutes avec recommandations personnalisées.",
  "url": "https://www.checkmyenterprise.com/assessment",
  "mainEntity": {
    "@type": "WebApplication",
    "name": "VitalCheck Assessment Tool",
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
  "name": "Blog VitalCheck - Conseils et Actualités Business",
  "description": "Découvrez nos articles sur la santé d'entreprise, le management, la croissance et les bonnes pratiques pour PME et startups africaines.",
  "url": "https://www.checkmyenterprise.com/blog",
  "publisher": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "logo": {
      "@type": "ImageObject",
      "url": "https://healthcheck.growthVitalCheck.space/logo.png"
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

export const getBlogPostStructuredData = (blog) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": blog.title,
  "description": blog.excerpt || blog.content?.substring(0, 160) + "...",
  "image": blog.featuredImage ? `https://www.checkmyenterprise.com${blog.featuredImage}` : "https://www.checkmyenterprise.com/og-image.png",
  "url": `https://www.checkmyenterprise.com/blog/${blog.slug}`,
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
      "url": "https://healthcheck.growthVitalCheck.space/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.checkmyenterprise.com/blog/${blog.slug}`
  },
  "keywords": blog.tags ? blog.tags.join(", ") : "entreprise, business, conseil",
  "articleSection": blog.category || "Business",
  "wordCount": blog.content ? blog.content.split(' ').length : 0,
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
        "name": blog.title,
        "item": `https://www.checkmyenterprise.com/blog/${blog.slug}`
      }
    ]
  }
})

export const getAboutPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "À Propos - VitalCheck Enterprise Health Check",
  "description": "Découvrez VitalCheck, la plateforme d'évaluation de santé d'entreprise développée par Ubuntu Business Builders pour les PME africaines.",
  "url": "https://www.checkmyenterprise.com/about",
  "mainEntity": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "description": "Organisation dédiée au développement des entreprises africaines",
    "url": "https://www.checkmyenterprise.com/",
    "logo": "https://www.checkmyenterprise.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@vitalcheck.com"
    },
    "sameAs": [
      "https://twitter.com/VitalCheck",
      "https://linkedin.com/company/vitalcheck"
    ]
  }
})

export const getContactPageStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact - VitalCheck Enterprise Health Check",
  "description": "Contactez l'équipe VitalCheck pour toute question sur l'évaluation de santé d'entreprise ou nos services de conseil.",
  "url": "https://www.checkmyenterprise.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "Ubuntu Business Builders",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@vitalcheck.com",
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

// Fonction utilitaire pour générer des données structurées d'organisation
export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ubuntu Business Builders",
  "description": "Organisation dédiée au développement et à l'accompagnement des entreprises africaines",
  "url": "https://www.checkmyenterprise.com/",
  "logo": "https://healthcheck.growthVitalCheck.space/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@vitalcheck.com",
    "availableLanguage": ["French", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Africa"
  },
  "sameAs": [
    "https://twitter.com/VitalCheck",
    "https://linkedin.com/company/vitalcheck"
  ]
})
