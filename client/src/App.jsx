import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AdminApp from './pages/admin/AdminApp'
import { Navbar, BackToTop } from './components/navigation'
import { SplashScreen } from './components/layout'
import { PingPongTest, LogoTest } from './components/test'
import { AssessmentProvider } from './context/AssessmentContext'
import { toastColors } from './utils/colors'
import { usePWAUpdate } from './hooks/usePWAUpdate'
import UpdateNotification from './components/ui/UpdateNotification'

function AppContent() {
  const [showSplash, setShowSplash] = useState(true)
  const { updateAvailable, updateApp, checkForUpdate } = usePWAUpdate()
  const location = useLocation()

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleUpdateDismiss = () => {
    // Optionnel : masquer la notification temporairement
    // Vous pouvez implémenter une logique pour ne pas la montrer pendant X minutes
  }

  // Vérifier si on est sur une page admin
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification de mise à jour PWA */}
      <UpdateNotification
        isVisible={updateAvailable}
        onUpdate={updateApp}
        onDismiss={handleUpdateDismiss}
      />
      
      {showSplash && (
        <SplashScreen onLoadingComplete={handleSplashComplete} />
      )}
      
      {!showSplash && (
        <>
          {/* Navbar seulement si ce n'est pas une page admin */}
          {!isAdminPage && <Navbar />}
          
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/ping-test" element={<PingPongTest />} />
            <Route path="/logo-test" element={<LogoTest />} />
            <Route path="/admin/*" element={<AdminApp />} />
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
          
          {/* Bouton Back to Top global - seulement si ce n'est pas une page admin */}
          {!isAdminPage && <BackToTop showAfter={300} />}
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <AppContent />
      </Router>
    </AssessmentProvider>
  )
}

export default App
