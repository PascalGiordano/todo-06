import { useEffect } from 'react';
import { useAppStore } from '../store/app.store';

export const useTheme = () => {
  const currentTheme = useAppStore((state) => state.uiState.currentThemeId);

  useEffect(() => {
    const root = window.document.documentElement;
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (theme: typeof currentTheme) => {
      root.classList.remove('dark', 'light', 'theme-light', 'theme-dark', 'theme-system'); // Clear previous theme classes

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.add('theme-dark');
      } else if (theme === 'light') {
        root.classList.add('light'); // Optional, if you have light-specific overrides not covered by default
        root.classList.add('theme-light');
      } else { // 'system'
        root.classList.add('theme-system');
        if (isSystemDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark'); // Ensure dark is removed if system is light
          root.classList.add('light'); // Explicitly add light for system if not dark
        }
      }
    };

    applyTheme(currentTheme);

    // Listener for system theme changes if 'system' is selected
    const mediaQueryListener = (e: MediaQueryListEvent) => {
      if (currentTheme === 'system') {
        if (e.matches) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (currentTheme === 'system') {
      mediaQuery.addEventListener('change', mediaQueryListener);
    }

    return () => {
      mediaQuery.removeEventListener('change', mediaQueryListener);
    };
  }, [currentTheme]);
};
