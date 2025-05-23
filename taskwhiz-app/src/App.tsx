import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAppStore } from './store/app.store';
import UserSetup from './components/auth/UserSetup';
import { useTheme } from './hooks/useTheme'; // Import useTheme

function App() {
  useTheme(); // Apply theme logic on mount and on theme change

  const { 
    currentUser, 
    users, 
    isSidebarCollapsed, 
    loadDefaultPriorities, 
    loadDefaultStatuses
  } = useAppStore(state => ({
    currentUser: state.uiState.currentUser,
    users: state.users.data,
    isSidebarCollapsed: state.uiState.isSidebarCollapsed,
    loadDefaultPriorities: state.loadDefaultPriorities,
    loadDefaultStatuses: state.loadDefaultStatuses,
    loadDefaultCategories: state.loadDefaultCategories, // Get action from store
  }));

  useEffect(() => {
    loadDefaultPriorities();
    loadDefaultStatuses();
  }, [loadDefaultPriorities, loadDefaultStatuses]);

  // Determine if UserSetup should be shown
  // Show if no current user is selected OR if there are no users at all.
  const showUserSetup = !currentUser || Object.keys(users).length === 0;

  if (showUserSetup) {
    return <UserSetup />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen font-sans antialiased">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main 
            className={`flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? "ml-20" : "ml-64" 
            }`}
          >
            {/* Global text color is applied here, specific components can override */}
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              {/* Define placeholder routes for items in sidebar that don't have pages yet */}
              <Route path="/team" element={<div>Team Page (Placeholder)</div>} />
              <Route path="/reports" element={<div>Reports Page (Placeholder)</div>} />
              <Route path="/ai-assistant" element={<div>AI Assistant Page (Placeholder)</div>} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
