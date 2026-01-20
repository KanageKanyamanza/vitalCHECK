import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminApp = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  // Si pas connecté admin, on redirige vers la page de login unifiée
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on affiche les routes enfants définies dans AppRoutes.jsx sous /admin
  return <Outlet />;
};

export default AdminApp;
