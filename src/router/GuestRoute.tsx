import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Added useLocation for potential 'from' state
import { useAuth } from '@/context';

const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-primary animate-pulse-slow">Chargement de l'authentification...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    // If user is authenticated, redirect them from guest pages (like login/register)
    // to the dashboard or the page they were trying to access before landing on a guest route.
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <Outlet />; // Render child routes/component (e.g., LoginPage, RegisterPage)
};

export default GuestRoute;
