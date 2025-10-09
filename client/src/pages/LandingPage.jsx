import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hero } from '../components/layout'
import { AssessmentForm } from '../components/assessment'
import { Footer } from '../components/navigation'
import { SocialShare } from '../components/ui'
import { useAssessment } from '../context/AssessmentContext'
import SEOHead from '../components/seo/SEOHead'
import { getHomePageStructuredData } from '../utils/seoData'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useAssessment()
  const [showForm, setShowForm] = useState(false)

  // Afficher le formulaire si l'utilisateur a déjà des données
  useEffect(() => {
    if (user && (user.companyName || user.email)) {
      setShowForm(true)
    }
  }, [user])

  const handleStartAssessment = () => {
    setShowForm(true)
    // Scroll to form
    setTimeout(() => {
      document.getElementById('assessment-form')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 100)
  }

  const handleFormSubmit = (user) => {
    // Navigate to assessment
    navigate('/assessment')
  }

  return (
    <div>
      <SEOHead
        title="VitalCheck Enterprise Health Check - Évaluez la santé de votre entreprise"
        description="Évaluez la santé organisationnelle de votre entreprise africaine avec VitalCheck. Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé."
        keywords="entreprise, santé organisationnelle, évaluation, VitalCheck, Afrique, business, conseil, croissance, PME, diagnostic, management, finance, opérations, marketing, RH, gouvernance, technologie"
        url="/"
        structuredData={getHomePageStructuredData()}
      />
      
      {/* Hero Section */}
      <Hero onStartAssessment={handleStartAssessment} />
      
      {/* Assessment Form Section */}
      {showForm && (
        <div id="assessment-form">
          <AssessmentForm onFormSubmit={handleFormSubmit} />
        </div>
      )}

      {/* Social Share */}
      <SocialShare 
        title="VitalCheck Enterprise Health Check - Évaluez la santé de votre entreprise"
        description="Évaluation gratuite de 10 minutes avec recommandations personnalisées et rapport détaillé."
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
