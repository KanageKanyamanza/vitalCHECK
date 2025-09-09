import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import AssessmentForm from '../components/AssessmentForm'
import Footer from '../components/Footer'
import { useAssessment } from '../context/AssessmentContext'

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
      {/* Hero Section */}
      <Hero onStartAssessment={handleStartAssessment} />
      
      {/* Assessment Form Section */}
      {showForm && (
        <div id="assessment-form">
          <AssessmentForm onFormSubmit={handleFormSubmit} />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage
