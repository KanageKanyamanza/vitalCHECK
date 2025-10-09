import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AboutPage from '../pages/AboutPage'
import AssessmentPage from '../pages/AssessmentPage'
import ResumeAssessmentPage from '../pages/ResumeAssessmentPage'
import ResultsPage from '../pages/ResultsPage'
import ContactPage from '../pages/ContactPage'
import PricingPage from '../pages/PricingPage'
import CheckoutPage from '../pages/CheckoutPage'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'
import ClientLoginPage from '../pages/client/ClientLoginPage'
import ClientRegisterPage from '../pages/client/ClientRegisterPage'
import ClientDashboardPage from '../pages/client/ClientDashboardPage'
import ClientProfilePage from '../pages/client/ClientProfilePage'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'
import BlogPage from '../pages/BlogPage'
import BlogDetailPage from '../pages/BlogDetailPage'
import ReportDownloadPage from '../pages/ReportDownloadPage'
import AdminApp from '../pages/admin/AdminApp'
import { PingPongTest, LogoTest } from '../components/test'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
      <Route path="/resume/:token" element={<ResumeAssessmentPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/client/login" element={<ClientLoginPage />} />
      <Route path="/client/register" element={<ClientRegisterPage />} />
      <Route path="/client/dashboard" element={<ClientDashboardPage />} />
      <Route path="/client/profile" element={<ClientProfilePage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/report/download/:assessmentId" element={<ReportDownloadPage />} />
      <Route path="/ping-test" element={<PingPongTest />} />
      <Route path="/logo-test" element={<LogoTest />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  )
}

export default AppRoutes
