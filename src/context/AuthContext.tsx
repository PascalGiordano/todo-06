import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  // Auth, // Not explicitly needed as 'auth' instance is used directly
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types/user';
import { createUserProfileDocument, getUserProfileDocument } from '@/lib/firestoreUtils'; // Import Firestore utilities

// Helper function to map Firebase Auth error codes to user-friendly messages
const mapFirebaseAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return "Format d'email invalide.";
    case 'auth/user-disabled':
      return "Ce compte utilisateur a été désactivé.";
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': // Common error for wrong email/password in newer SDKs
      return "Email ou mot de passe incorrect.";
    case 'auth/email-already-in-use':
      return "Cette adresse e-mail est déjà utilisée.";
    case 'auth/weak-password':
      return "Le mot de passe est trop faible (minimum 6 caractères)."; // Firebase default is 6
    case 'auth/operation-not-allowed':
      return "L'authentification par email et mot de passe n'est pas activée.";
    default:
      console.error("Unhandled Firebase Auth Error Code:", errorCode);
      return "Une erreur d'authentification est survenue. Veuillez réessayer.";
  }
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null; // For displaying auth errors
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>; // Changed to Promise<void> as signOut is async
  clearError: () => void; // Utility to clear error messages
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfileDocument(firebaseUser.uid);
          if (userProfile) {
            setCurrentUserState(userProfile); // User profile from Firestore
          } else {
            // No profile in Firestore, or error during fetch (though caught below)
            // This could be a new user whose Firestore doc creation is pending/failed,
            // or an existing user whose doc is missing.
            console.warn(`Profil Firestore non trouvé pour ${firebaseUser.uid}. Utilisation des données Auth Firebase seulement.`);
            const authOnlyUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              name: firebaseUser.displayName, // Fallback
              // createdAt would be undefined here
            };
            setCurrentUserState(authOnlyUser);
            // Optionally, attempt to create the Firestore document if it's missing for an authenticated user
            // This might be useful if the registration process failed to create the Firestore doc
            // For example: await createUserProfileDocument(firebaseUser, { name: firebaseUser.displayName || "" });
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du profil Firestore dans onAuthStateChanged:", error);
          setError("Impossible de charger le profil utilisateur. Certaines fonctionnalités pourraient être limitées.");
          // Fallback to auth-only data if profile fetch fails, to keep user logged in if possible
          const authOnlyUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            name: firebaseUser.displayName,
          };
          setCurrentUserState(authOnlyUser);
        }
      } else {
        // User is signed out
        setCurrentUserState(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const clearError = () => {
    setError(null);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting currentUserState
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(mapFirebaseAuthError(err.code));
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        const firebaseUser = userCredential.user;
        if (name) {
          await updateProfile(firebaseUser, { displayName: name });
        }

        // Prepare additional data for Firestore document
        const additionalDataForFirestore: Partial<User> = {
          name: name || firebaseUser.displayName || '', // Ensure 'name' is defined
          // createdAt will be handled by serverTimestamp in createUserProfileDocument
        };
        
        // Create user document in Firestore
        await createUserProfileDocument(firebaseUser, additionalDataForFirestore);

        // Update context state immediately with the most complete info available
        // (onAuthStateChanged will also run, this provides quicker UI update with name)
        setCurrentUserState({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name || firebaseUser.displayName, // Use updated name
          photoURL: firebaseUser.photoURL,
          name: name || firebaseUser.displayName, // Use updated name
          // createdAt will be undefined here, populated when profile is fetched from DB
        });
      }
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Registration error (Auth or Firestore):", err);
      // If createUserProfileDocument throws, err might not have a 'code' property
      // or it might be a FirebaseError from Firestore, not Auth.
      const errorCode = typeof err.code === 'string' ? err.code : 'app/generic-error';
      setError(mapFirebaseAuthError(errorCode)); // mapFirebaseAuthError might need to handle generic errors
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true); // Optional: show loading during sign out
    setError(null);
    try {
      await signOut(auth);
      // onAuthStateChanged will set currentUserState to null
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(mapFirebaseAuthError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
