import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
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

const AdminApp = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated() ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/users" 
        element={
          isAuthenticated() ? <UserManagement /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/users/:userId" 
        element={
          isAuthenticated() ? <UserDetail /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/assessments" 
        element={
          isAuthenticated() ? <AssessmentManagement /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/assessments/:assessmentId" 
        element={
          isAuthenticated() ? <AssessmentDetail /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/draft-assessments" 
        element={
          isAuthenticated() ? <DraftAssessmentsPage /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/blog" 
        element={
          isAuthenticated() ? <BlogManagement /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/blog/create" 
        element={
          isAuthenticated() ? <BlogEditPage /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/blog/edit/:id" 
        element={
          isAuthenticated() ? <BlogEditPage /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/blog/stats" 
        element={
          isAuthenticated() ? <BlogStatsPage /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/blog/analytics" 
        element={
          isAuthenticated() ? <BlogAnalyticsPage /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/blog-visitors" 
        element={
          isAuthenticated() ? <BlogVisitorsPageWrapper /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/emails" 
        element={
          isAuthenticated() ? <EmailManagement /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/reports" 
        element={
          isAuthenticated() ? <ReportsPage /> : <Navigate to="/admin/login" replace />
        } 
      />
      <Route 
        path="/settings" 
        element={
          isAuthenticated() ? <SettingsPage /> : <Navigate to="/admin/login" replace />
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
