// Expected Auth Flow:
// 1. User lands on '/' (LandingPage).
// 2. Clicks "Login" or "Register" -> navigates to /login or /register (GuestRoutes).
// 3. After successful login/registration, user is redirected to /dashboard (ProtectedRoute).
// 4. Authenticated users trying to access /login or /register are redirected to /dashboard.
// 5. Unauthenticated users trying to access /dashboard are redirected to /login.
// 6. Logout from dashboard or navbar clears session and allows navigation back to /login or home.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage'; // Using path alias
import RegisterPage from '@/pages/auth/RegisterPage';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProtectedRoute from '@/router/ProtectedRoute';
import GuestRoute from '@/router/GuestRoute';

// Note: AuthProvider is in src/index.tsx, wrapping this App component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest Routes (Login, Register) - redirect to dashboard if logged in */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes (Dashboard, etc.) - redirect to login if not logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other protected routes here, e.g., /settings, /profile */}
        </Route>
        
        {/* Fallback route for unmatched paths - redirects to home */}
        {/* Consider a dedicated 404 Not Found page component here instead of just redirecting */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
