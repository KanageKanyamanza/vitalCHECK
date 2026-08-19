import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useClientAuth } from '../../context/ClientAuthContext';

const PAID_PLANS = ['standard', 'premium', 'diagnostic'];

const isSubscriptionActive = (user) => {
  const sub = user?.subscription;
  if (!sub || sub.status !== 'active') return false;
  if (sub.endDate && new Date(sub.endDate) < new Date()) return false;
  return true;
};

/**
 * Route guard that wraps React Router routes.
 *
 * Props:
 *   requireAuth              (bool, default true)  — redirect to /login when not authenticated
 *   requireActiveSubscription (bool, default false) — redirect to /pricing when no active paid plan
 *   children                                       — the route element to render
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireActiveSubscription = false,
}) => {
  const { user, loading, isAuthenticated } = useClientAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireActiveSubscription && isAuthenticated) {
    if (!isSubscriptionActive(user) || !PAID_PLANS.includes(user?.subscription?.plan)) {
      return <Navigate to="/pricing" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
