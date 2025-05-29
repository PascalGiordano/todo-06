// Ce fichier contenait auparavant des utilitaires pour gérer l'authentification et les sessions
// des utilisateurs via Local Storage. Ces fonctionnalités ont été migrées vers Firebase Authentication
// et Firebase Firestore.

// Si d'autres utilitaires non liés à l'authentification et utilisant Local Storage
// sont nécessaires à l'avenir, ils pourront être ajoutés ici.

// Pour l'instant, ce fichier peut être considéré comme vide ou en attente de suppression
// s'il n'y a pas d'autres usages de Local Storage prévus.

// Exemple d'utilitaire Local Storage non lié à l'authentification :
/*
const THEME_PREFERENCE_KEY = 'promptCompletThemePreference';

export const getThemePreference = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(THEME_PREFERENCE_KEY);
};

export const setThemePreference = (theme: 'light' | 'dark' | 'system'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_PREFERENCE_KEY, theme);
};
*/
