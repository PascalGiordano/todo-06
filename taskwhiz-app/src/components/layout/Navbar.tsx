import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, UserCircle, Clock, LogOut, UserCog } from 'lucide-react'; // Added LogOut, UserCog
import { useAppStore } from '../../store/app.store';
import type { User } from '../../types';

const Navbar: React.FC = () => {
  const { currentUserId, users, setCurrentUser } = useAppStore(state => ({
    currentUserId: state.uiState.currentUser,
    users: state.users.data,
    setCurrentUser: state.setCurrentUser,
  }));

  const currentUser: User | null = useMemo(() => {
    return currentUserId && users[currentUserId] ? users[currentUserId] : null;
  }, [currentUserId, users]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null); // This will trigger UserSetup in App.tsx
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between h-16 text-gray-700 z-50 relative">
      {/* Logo and App Name */}
      <div className="flex items-center">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600 hover:text-primary-700">
          TaskWhiz
        </Link>
      </div>

      {/* Global Search Bar (Functionality to be implemented) */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            name="global-search"
            id="global-search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search tasks, projects..."
          />
        </div>
      </div>

import ThemeSwitcher from './ThemeSwitcher'; // Import ThemeSwitcher

// ... (other imports and existing code)

const Navbar: React.FC = () => {
  // ... (existing state and hooks) ...

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 flex items-center justify-between h-16 text-gray-700 dark:text-gray-200 z-50 relative">
      {/* Logo and App Name */}
      <div className="flex items-center">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500">
          TaskWhiz
        </Link>
      </div>

      {/* Global Search Bar (Functionality to be implemented) */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="search"
            name="global-search"
            id="global-search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 sm:text-sm"
            placeholder="Search tasks, projects..."
          />
        </div>
      </div>

      {/* Right-side Icons and User Menu */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Real-time Clock */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-5 w-5 mr-1" />
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-label="View notifications"
        >
          <Bell className="h-6 w-6" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            id="user-menu-button"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            {currentUser ? (
              <span
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: currentUser.color || '#A0AEC0' }} // A0AEC0 is gray-500
              >
                {currentUser.initials}
              </span>
            ) : (
              <UserCircle className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" />
            )}
            {currentUser && (
              <span className="ml-2 text-sm font-medium hidden sm:block text-gray-700 dark:text-gray-200">
                {currentUser.firstName || currentUser.username}
              </span>
            )}
          </button>
          
          {userMenuOpen && currentUser && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <div className="py-1">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                </div>
                <hr className="border-gray-200 dark:border-gray-700"/>
                <Link 
                  to="/profile" // Placeholder, no profile page yet
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                  role="menuitem"
                >
                  <UserCog className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"/> Profile
                </Link>
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                  role="menuitem"
                >
                  <LogOut className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"/> Change User / Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
