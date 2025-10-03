import React from 'react'
import { Helmet } from 'react-helmet-async'

const FAQStructuredData = ({ faqs = [] }) => {
  if (!faqs || faqs.length === 0) return null

  const structuredData = {
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
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default FAQStructuredData
