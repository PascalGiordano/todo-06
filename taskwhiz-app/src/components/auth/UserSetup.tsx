import React, { useState } from 'react';
import { useAppStore } from '../../store/app.store';
import type { User, UserPreferences, UserStatistics, UserId } from '../../types';
import { generateId, getInitials, getRandomColor } from '../../utils/helpers'; // Assuming these helpers will be created

const UserSetup: React.FC = () => {
  const { users, currentUser, addUser, setCurrentUser } = useAppStore(
    (state) => ({
      users: state.users.data,
      currentUser: state.uiState.currentUser,
      addUser: state.addUser,
      setCurrentUser: state.setCurrentUser,
    })
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(Object.keys(users).length === 0);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      alert('First name and email are required.');
      return;
    }

    const newId = generateId() as UserId;
    const userCount = Object.keys(users).length;
    const userRole = userCount === 0 ? 'admin' : 'member';
    const userFullName = `${firstName.trim()} ${lastName.trim() || ''}`.trim();

    const defaultPreferences: UserPreferences = {
      id: generateId(), // Assuming preferences also need an ID
      userId: newId,
      theme: 'system',
      darkMode: 'system',
      language: 'fr',
      timezone: 'Europe/Paris',
      defaultView: 'kanban' as any, // Cast if ViewId is a branded type
      notificationsEnabled: true,
      emailNotifications: false,
      customShortcuts: {},
      taskDensity: 'comfortable',
      sidebarBehavior: 'pinned',
      dashboardWidgets: [],
      keyboardShortcutsEnabled: true,
      aiAssistantEnabled: true,
      dataSyncFrequency: 'manual',
      privacySettings: {
        showActivityStatus: true,
        allowDataCollectionForAI: true,
      },
      accessibility: {
        fontSize: 'medium',
        highContrastMode: false,
      },
      updatedAt: Date.now(),
    };

    // For now, UserStatistics is an empty object or minimal
    const defaultStatistics: UserStatistics = {
      id: generateId(), // Assuming statistics also need an ID
      userId: newId,
      tasksCreated: 0,
      tasksCompleted: 0,
      updatedAt: Date.now(),
    };
    
    // In a real app, you'd save preferences and statistics separately
    // and only store their IDs in the User object.
    // For this setup, we'll just store the IDs.

    const newUser: User = {
      id: newId,
      username: email, // Using email as username for simplicity
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      fullName: userFullName,
      initials: getInitials(userFullName),
      color: getRandomColor(),
      role: userRole,
      isActive: true,
      preferencesId: defaultPreferences.id, // Store ID
      statisticsId: defaultStatistics.id,   // Store ID
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // TODO: Persist defaultPreferences and defaultStatistics objects separately
      // For now, they are not being added to the store's collections
    };

    addUser(newUser);
    setCurrentUser(newUser.id);
    // Reset form if needed, or component will unmount
    setFirstName('');
    setLastName('');
    setEmail('');
    setShowCreateForm(false); // Hide form, show selection if other users exist
  };

  const handleSelectUser = (userId: UserId) => {
    setCurrentUser(userId);
  };

  if (currentUser) {
    return null; // Should not happen if App.tsx logic is correct
  }

  const usersArray = Object.values(users);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
          TaskWhiz User Setup
        </h1>

        {showCreateForm || usersArray.length === 0 ? (
          <form onSubmit={handleCreateUser} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              {usersArray.length === 0 ? 'Create Your First User' : 'Create New User'}
            </h2>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {usersArray.length === 0 ? 'Create Admin User' : 'Create User'}
            </button>
            {usersArray.length > 0 && (
                 <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="mt-4 w-full text-center py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                >
                    Cancel
                </button>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Select an Existing User</h2>
            {usersArray.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <span
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                    style={{ backgroundColor: user.color || '#cccccc' }} // Color should provide enough contrast
                  >
                    {user.initials}
                  </span>
                  <span className="text-gray-800 dark:text-gray-100">{user.fullName || `${user.firstName} ${user.lastName}`}</span>
                </div>
                <button
                  onClick={() => handleSelectUser(user.id)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 dark:bg-primary-500 dark:hover:bg-primary-600"
                >
                  Select
                </button>
              </div>
            ))}
            <hr className="my-6 border-gray-300 dark:border-gray-600"/>
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create New User
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSetup;
