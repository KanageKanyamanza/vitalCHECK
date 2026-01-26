import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import AssessmentManagement from './AssessmentManagement';
import EmailManagement from './EmailManagement';
import UserDetail from './UserDetail';
import AssessmentDetail from './AssessmentDetail';
import ReportsPage from './ReportsPage';
import DraftAssessmentsPage from './DraftAssessmentsPage';
import BlogManagement from './BlogManagement';
import BlogEditPage from './BlogEditPage';
import BlogStatsPage from './BlogStatsPage';
import BlogAnalyticsPage from './BlogAnalyticsPage';
import BlogVisitorsPageWrapper from './BlogVisitorsPageWrapper';
import SettingsPage from './SettingsPage';
import PDFManagementPage from './PDFManagementPage';
import PaymentManagement from './PaymentManagement';
import ChatbotManagement from './ChatbotManagement';
import NewsletterManagement from './NewsletterManagement';
import NewsletterEditPage from './NewsletterEditPage';

const AdminApp = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  return (
    <Routes>
      {/* Redirection vers la page de login unifiée */}
      <Route 
        path="/login" 
        element={<Navigate to="/login" replace />}
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/users" 
        element={
          isAuthenticated() ? <UserManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/users/:userId" 
        element={
          isAuthenticated() ? <UserDetail /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/assessments" 
        element={
          isAuthenticated() ? <AssessmentManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/assessments/:assessmentId" 
        element={
          isAuthenticated() ? <AssessmentDetail /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/draft-assessments" 
        element={
          isAuthenticated() ? <DraftAssessmentsPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/blog" 
        element={
          isAuthenticated() ? <BlogManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/blog/create" 
        element={
          isAuthenticated() ? <BlogEditPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/blog/edit/:id" 
        element={
          isAuthenticated() ? <BlogEditPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/blog/stats" 
        element={
          isAuthenticated() ? <BlogStatsPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/blog/analytics" 
        element={
          isAuthenticated() ? <BlogAnalyticsPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/blog-visitors" 
        element={
          isAuthenticated() ? <BlogVisitorsPageWrapper /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/emails" 
        element={
          isAuthenticated() ? <EmailManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/reports" 
        element={
          isAuthenticated() ? <ReportsPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/pdfs" 
        element={
          isAuthenticated() ? <PDFManagementPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/payments" 
        element={
          isAuthenticated() ? <PaymentManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/settings" 
        element={
          isAuthenticated() ? <SettingsPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/chatbot" 
        element={
          isAuthenticated() ? <ChatbotManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/newsletters" 
        element={
          isAuthenticated() ? <NewsletterManagement /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/newsletters/create" 
        element={
          isAuthenticated() ? <NewsletterEditPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/newsletters/edit/:id" 
        element={
          isAuthenticated() ? <NewsletterEditPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to="/admin/dashboard" replace />} 
      />
    </Routes>
  );
};

export default AdminApp;
