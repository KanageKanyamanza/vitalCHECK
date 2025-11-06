import { Helmet } from 'react-helmet-async'

const SEOHead = (props = {}) => {
  // Extraction sécurisée des props avec valeurs par défaut
  const {
    title = "vitalCHECK Enterprise Health Check - Évaluez la santé de votre entreprise",
    description = "Évaluez la santé organisationnelle de votre entreprise africaine avec vitalCHECK. Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé.",
    keywords = "entreprise, santé organisationnelle, évaluation, vitalCHECK, Afrique, business, conseil, croissance, PME, diagnostic, management, finance, opérations, marketing, RH, gouvernance, technologie",
    image = "https://www.checkmyenterprise.com/og-image.png",
    url = "https://www.checkmyenterprise.com/",
    type = "website",
    lang = "fr",
    structuredData = null,
    noindex = false,
    canonical = null
  } = props
  // S'assurer que les valeurs sont des strings et non null/undefined
  const safeUrl = (typeof url === 'string' && url) ? url : '/'
  const safeImage = (typeof image === 'string' && image) ? image : '/og-image.png'
  const safeCanonical = (typeof canonical === 'string' && canonical) ? canonical : null
  
  const fullUrl = safeUrl.startsWith('http') ? safeUrl : `https://www.checkmyenterprise.com${safeUrl}`
  const canonicalUrl = safeCanonical || fullUrl
  const fullImageUrl = safeImage.startsWith('http') ? safeImage : `https://www.checkmyenterprise.com${safeImage}`

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and Geo */}
      <meta name="language" content={lang === 'fr' ? 'French' : 'English'} />
      <meta name="geo.region" content="Africa" />
      <meta name="geo.placename" content="Africa" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="vitalCHECK Enterprise Health Check" />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'fr' ? 'en_US' : 'fr_FR'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vitalCHECK" />
      <meta name="twitter:creator" content="@vitalCHECK" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Alternate Language Versions */}
      <link rel="alternate" hreflang={lang} href={fullUrl} />
      <link rel="alternate" hreflang={lang === 'fr' ? 'en' : 'fr'} href={`${fullUrl}?lang=${lang === 'fr' ? 'en' : 'fr'}`} />
      <link rel="alternate" hreflang="x-default" href="https://www.checkmyenterprise.com/" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SEOHead
