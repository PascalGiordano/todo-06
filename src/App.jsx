import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageWrapper from './pages/LandingPageWrapper';
import DashboardPage from './pages/DashboardPage';
import AppLayout from './components/layout/AppLayout'; // Importer AppLayout
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} /> {/* Landing page a sa propre navbar */}
        
        {/* Routes utilisant AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Exemple: <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
