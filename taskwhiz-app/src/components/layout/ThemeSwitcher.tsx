import React from 'react';
import { useAppStore } from '../../store/app.store';
import type { ThemeId } from '../../types'; // Assuming ThemeId can be 'light', 'dark', 'system'
import { Sun, Moon, Laptop } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useAppStore((state) => ({
    currentTheme: state.uiState.currentThemeId,
    setTheme: state.setTheme,
  }));

  const themes: { name: ThemeId | 'system'; label: string; icon: React.ElementType }[] = [
    { name: 'light', label: 'Clair', icon: Sun },
    { name: 'dark', label: 'Sombre', icon: Moon },
    { name: 'system', label: 'Système', icon: Laptop },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
      {themes.map((theme) => {
        const IconComponent = theme.icon;
        const isActive = currentTheme === theme.name;
        return (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.name)}
            className={`
              flex items-center justify-center w-full px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-700
              ${
                isActive
                  ? 'bg-white text-primary-600 shadow-sm dark:bg-gray-900 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600'
              }
            `}
            title={`Thème ${theme.label}`}
            aria-pressed={isActive}
          >
            <IconComponent className={`h-5 w-5 ${isActive ? '' : 'text-gray-500 dark:text-gray-400'}`} />
            <span className="ml-2 hidden sm:inline">{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
