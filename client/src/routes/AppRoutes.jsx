import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import AboutPage from '../pages/AboutPage'
import AssessmentPage from '../pages/AssessmentPage'
import ResumeAssessmentPage from '../pages/ResumeAssessmentPage'
import ResultsPage from '../pages/ResultsPage'
import ContactPage from '../pages/ContactPage'
import PricingPage from '../pages/PricingPage'
import CheckoutPage from '../pages/CheckoutPage'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'
import ClientRegisterPage from '../pages/client/ClientRegisterPage'
import UnifiedLoginPage from '../pages/UnifiedLoginPage'
import ClientDashboardPage from '../pages/client/ClientDashboardPage'
import ClientProfilePage from '../pages/client/ClientProfilePage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'
import BlogPage from '../pages/BlogPage'
import BlogDetailPage from '../pages/BlogDetailPage'
import ReportDownloadPage from '../pages/ReportDownloadPage'
import AdminApp from '../pages/admin/AdminApp'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UserManagement from '../pages/admin/UserManagement'
import AssessmentManagement from '../pages/admin/AssessmentManagement'
import EmailManagement from '../pages/admin/EmailManagement'
import UserDetail from '../pages/admin/UserDetail'
import AssessmentDetail from '../pages/admin/AssessmentDetail'
import ReportsPage from '../pages/admin/ReportsPage'
import DraftAssessmentsPage from '../pages/admin/DraftAssessmentsPage'
import BlogManagement from '../pages/admin/BlogManagement'
import BlogEditPage from '../pages/admin/BlogEditPage'
import BlogStatsPage from '../pages/admin/BlogStatsPage'
import BlogAnalyticsPage from '../pages/admin/BlogAnalyticsPage'
import BlogVisitorsPageWrapper from '../pages/admin/BlogVisitorsPageWrapper'
import SettingsPage from '../pages/admin/SettingsPage'
import PDFManagementPage from '../pages/admin/PDFManagementPage'
import PaymentManagement from '../pages/admin/PaymentManagement'
import ChatbotManagement from '../pages/admin/ChatbotManagement'
import NewsletterManagement from '../pages/admin/NewsletterManagement'
import NewsletterEditPage from '../pages/admin/NewsletterEditPage'
import NewsletterSubscribers from '../pages/admin/NewsletterSubscribers'
import { PingPongTest } from '../components/test'

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
      <Route path="/login" element={<UnifiedLoginPage />} />
      {/* Redirection de l'ancienne route client/login vers la page unifiée */}
      <Route path="/client/login" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/client/register" element={<ClientRegisterPage />} />
      <Route path="/client/dashboard" element={<ClientDashboardPage />} />
      <Route path="/client/profile" element={<ClientProfilePage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/report/download/:assessmentId" element={<ReportDownloadPage />} />
      <Route path="/ping-test" element={<PingPongTest />} />
      <Route path="/admin" element={<AdminApp />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:userId" element={<UserDetail />} />
        <Route path="assessments" element={<AssessmentManagement />} />
        <Route path="assessments/:assessmentId" element={<AssessmentDetail />} />
        <Route path="draft-assessments" element={<DraftAssessmentsPage />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="blog/create" element={<BlogEditPage />} />
        <Route path="blog/edit/:id" element={<BlogEditPage />} />
        <Route path="blog/stats" element={<BlogStatsPage />} />
        <Route path="blog/analytics" element={<BlogAnalyticsPage />} />
        <Route path="blog-visitors" element={<BlogVisitorsPageWrapper />} />
        <Route path="emails" element={<EmailManagement />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="pdfs" element={<PDFManagementPage />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="chatbot" element={<ChatbotManagement />} />
        <Route path="newsletters" element={<NewsletterManagement />} />
        <Route path="newsletters/create" element={<NewsletterEditPage />} />
        <Route path="newsletters/edit/:id" element={<NewsletterEditPage />} />
        <Route path="newsletters/subscribers" element={<NewsletterSubscribers />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
