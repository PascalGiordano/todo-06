// src/types/user.ts
import { Timestamp } from 'firebase/firestore'; // Importer Timestamp

// Represents the user data structure within our application context,
// potentially combining Firebase Auth info with custom data from Firestore.
export interface User {
  uid: string; // Firebase User ID (uid)
  email: string | null; // Email from Firebase Auth (can be null)
  displayName?: string | null; // displayName from Firebase Auth
  photoURL?: string | null; // photoURL from Firebase Auth
  
  // 'name' can be a copy of displayName or a custom field from Firestore.
  name?: string | null; 

  // 'createdAt' sera un Timestamp de Firestore à la lecture.
  // Pour l'écriture, serverTimestamp() (un FieldValue) est utilisé, mais le type User
  // dans le contexte de l'application devrait s'attendre à un Timestamp ou une Date.
  // Le type Date est plus facile à utiliser directement en JS.
  // La conversion Timestamp -> Date se fera après la lecture de Firestore.
  createdAt?: Timestamp | Date; // Firestore Timestamp ou JS Date

  // Example of custom fields you might add from Firestore:
  // roles?: string[];
  // tenantId?: string;
  // preferences?: Record<string, any>;
}

// This interface can be used for the session object if you want to store
// a subset of the User data or data specifically shaped for authentication state.
export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  // Vous pourriez ne pas inclure tous les champs de User ici si ce n'est pas nécessaire pour l'état d'authentification.
}
