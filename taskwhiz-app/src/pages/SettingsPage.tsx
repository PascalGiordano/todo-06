import React, { useState } from 'react';
import PriorityList from '../components/settings/priorities/PriorityList';
import StatusList from '../components/settings/statuses/StatusList'; // Import StatusList
// import CategoryList from '../components/settings/categories/CategoryList';

type SettingsSection = 'priorities' | 'statuses' | 'categories' | 'tags' | 'account' | 'appearance';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('priorities');

  const renderSection = () => {
    switch (activeSection) {
import CategoryList from '../components/settings/categories/CategoryList'; // Import CategoryList

// ... (existing code)

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('priorities');

  const renderSection = () => {
    switch (activeSection) {
      case 'priorities':
        return <PriorityList />;
      case 'statuses':
        return <StatusList />;
      case 'categories':
        return <CategoryList />; // Render CategoryList
      // ... other cases
      default:
        return <p className="text-gray-600 dark:text-gray-400">Sélectionnez une section de paramètres.</p>;
    }
  };

  const navItems: Array<{ id: SettingsSection; label: string; disabled?: boolean }> = [
    { id: 'priorities', label: 'Priorités' },
    { id: 'statuses', label: 'Statuts', disabled: false },
    { id: 'categories', label: 'Catégories', disabled: false }, // Enable Categories section
    { id: 'tags', label: 'Étiquettes', disabled: true },
    { id: 'account', label: 'Compte', disabled: true },
    { id: 'appearance', label: 'Apparence', disabled: true },
  ];

  return (
    // Main page background (bg-gray-100 dark:bg-gray-900) is handled by App.tsx
    <div className="flex flex-col md:flex-row h-full"> 
      {/* Settings Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 md:h-full">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Paramètres</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveSection(item.id)}
              disabled={item.disabled}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${item.disabled 
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : activeSection === item.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-500 dark:bg-opacity-25 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Settings Content Area */}
      {/* The direct children of this main (PriorityList, StatusList) handle their own bg/text for dark mode */}
      <main className="flex-1 p-6 overflow-y-auto"> 
        {renderSection()}
      </main>
    </div>
  );
};

export default SettingsPage;
