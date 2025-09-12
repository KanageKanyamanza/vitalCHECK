import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Navbar from './components/Navbar'
import SplashScreen from './components/SplashScreen'
import PingPongTest from './components/PingPongTest'
import LogoTest from './components/LogoTest'
import BackToTop from './components/BackToTop'
import { AssessmentProvider } from './context/AssessmentContext'
import { toastColors } from './utils/colors'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <AssessmentProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {showSplash && (
            <SplashScreen onLoadingComplete={handleSplashComplete} />
          )}
          
          {!showSplash && (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/ping-test" element={<PingPongTest />} />
                <Route path="/logo-test" element={<LogoTest />} />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: toastColors.background,
                    color: toastColors.text,
                  },
                }}
              />
              
              {/* Bouton Back to Top global */}
              <BackToTop showAfter={300} />
            </>
          )}
        </div>
      </Router>
    </AssessmentProvider>
  )
}

export default App
