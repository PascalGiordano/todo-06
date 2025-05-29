/*
Exemple de Règles de Sécurité Firestore pour la collection 'users':
(À configurer dans la console Firebase -> Firestore Database -> Règles)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs ne peuvent lire et écrire que leur propre document de profil.
    // La création est autorisée si l'UID du document correspond à l'UID de l'utilisateur authentifié.
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      // Pour des champs spécifiques comme 'roles', on pourrait avoir des règles plus granulaires.
      // Par exemple, 'roles' ne pourrait être modifié que par un admin.
      // Ou pour 'createdAt', on pourrait empêcher la modification après création:
      // allow update: if request.auth != null && request.auth.uid == userId && request.resource.data.createdAt == resource.data.createdAt;
    }

    // Autres collections (par exemple, 'projects', 'tasks') auront leurs propres règles.
    // Exemple pour des tâches appartenant à un utilisateur :
    // match /tasks/{taskId} {
    //   allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['user', 'manager']);
    //   // Ou si la tâche a un champ ownerId:
    //   // allow read, write: if request.auth != null && resource.data.ownerId == request.auth.uid;
    // }
  }
}
*/
import { doc, setDoc, serverTimestamp, FieldValue, getDoc, Timestamp } from 'firebase/firestore'; // Added getDoc, Timestamp
import { db } from './firebase'; // Notre instance Firestore
import { User } from '@/types/user'; // Notre type User
import { User as FirebaseUser } from 'firebase/auth'; // Firebase Auth user type

// Interface pour les données utilisateur stockées dans Firestore
// Peut être légèrement différente de User dans src/types/user.ts si besoin
// Par exemple, createdAt sera un FieldValue (serverTimestamp) à l'écriture
// et un Timestamp à la lecture.
interface UserDocument extends Omit<User, 'createdAt'> {
  createdAt: FieldValue; // Pour l'écriture avec serverTimestamp()
  // D'autres champs spécifiques à Firestore peuvent être ajoutés ici
}

/**
 * Crée ou met à jour un document utilisateur dans Firestore.
 * @param firebaseUser L'objet utilisateur de Firebase Authentication.
 * @param additionalData Données supplémentaires à fusionner dans le document utilisateur.
 */
export const createUserProfileDocument = async (
  firebaseUser: FirebaseUser, // Utiliser le type FirebaseUser pour l'entrée
  additionalData: Partial<Omit<User, 'uid' | 'email' | 'displayName' | 'photoURL'>> = {}
): Promise<void> => {
  if (!firebaseUser?.uid) {
    throw new Error("UID de l'utilisateur Firebase manquant pour la création du profil.");
  }

  const userRef = doc(db, 'users', firebaseUser.uid);
  
  // Préparer les données de base à partir de l'objet FirebaseUser
  const baseData: Pick<User, 'uid' | 'email' | 'displayName' | 'photoURL' | 'name'> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || null, // Assurer null si undefined
    photoURL: firebaseUser.photoURL || null, // Assurer null si undefined
    name: additionalData.name || firebaseUser.displayName || null, // Priorité à additionalData.name
  };

  // Combiner avec additionalData et ajouter createdAt
  // Les champs dans additionalData (comme 'name') peuvent écraser ceux de baseData si présents
  const userDataToWrite: UserDocument = {
    ...baseData, // baseData already correctly prioritizes additionalData.name for the 'name' field
    ...additionalData,
    createdAt: serverTimestamp(), // Utiliser serverTimestamp pour la date de création
  };
  
  // Nettoyer l'objet pour éviter d'écrire 'undefined' dans Firestore si certains champs optionnels ne sont pas définis
  // Par exemple, si additionalData.name est undefined, et baseData.name est null, on veut que name soit null, pas undefined.
  // Firestore gère bien les 'null' mais 'undefined' peut causer des problèmes ou être omis.
  // L'opérateur spread et la définition de baseData avec `|| null` devraient déjà bien gérer cela.

  try {
    // Utiliser setDoc avec { merge: true } pour créer ou mettre à jour le document.
    // Si le document existe, seuls les champs fournis seront mis à jour.
    // Si des champs sont undefined dans userDataToWrite, ils ne seront pas écrits si merge est true et qu'ils n'existent pas déjà.
    // Si on veut explicitement supprimer un champ, il faudrait utiliser `deleteField()` de Firestore.
    await setDoc(userRef, userDataToWrite, { merge: true });
    console.log(`Profil utilisateur ${firebaseUser.uid} créé/mis à jour dans Firestore.`);
  } catch (error) {
    console.error("Erreur lors de la création/mise à jour du profil utilisateur dans Firestore:", error);
    throw error; // Remonter l'erreur pour que la fonction appelante puisse la gérer
  }
};

/**
 * Récupère un document profil utilisateur depuis Firestore.
 * @param uid L'UID de l'utilisateur.
 * @returns {Promise<User | null>} Le profil utilisateur s'il existe, sinon null.
 */
export const getUserProfileDocument = async (uid: string): Promise<User | null> => {
  if (!uid) {
    console.warn("Tentative de récupération de profil sans UID.");
    return null;
  }
  
  const userRef = doc(db, 'users', uid);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      // Mapper les données de Firestore à notre type User
      // data.createdAt sera un Timestamp de Firestore.
      // Il peut être converti en Date JS avec (data.createdAt as Timestamp).toDate() si nécessaire.
      const userProfile: User = {
        uid: data.uid || uid, // Assurer que uid est toujours là
        email: data.email,
        displayName: data.displayName,
        name: data.name,
        photoURL: data.photoURL,
        createdAt: data.createdAt as Timestamp, // Assumer que createdAt est un Timestamp
        // ... étendre avec d'autres champs si définis dans votre type User et Firestore
      };
      return userProfile;
    } else {
      console.warn(`Aucun profil utilisateur trouvé dans Firestore pour l'UID: ${uid}. L'utilisateur existe peut-être uniquement dans Firebase Auth ou le document n'a pas encore été créé.`);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur depuis Firestore:", error);
    // Ne pas remonter l'erreur ici pourrait être une option pour ne pas bloquer le flux d'auth si Firestore est temporairement inaccessible
    // Mais pour l'instant, on la remonte pour être conscient du problème.
    throw error;
  }
};

// TODO: Implémenter updateUserProfileDocument si les utilisateurs peuvent modifier leur profil.
// export const updateUserProfileDocument = async (uid: string, dataToUpdate: Partial<User>): Promise<void> => {
//   if (!uid) throw new Error("UID est requis pour mettre à jour le profil.");
//   const userRef = doc(db, 'users', uid);
//   try {
//     // On pourrait vouloir empêcher la mise à jour de certains champs comme 'email' ou 'uid' ici.
//     // Aussi, si 'createdAt' est dans dataToUpdate, il faudrait le gérer ou le supprimer.
//     // Si 'name' est mis à jour, peut-être aussi mettre à jour 'displayName' dans Firebase Auth ?
//     await updateDoc(userRef, dataToUpdate); // updateDoc ne crée pas le document s'il n'existe pas.
//     console.log(`Profil utilisateur ${uid} mis à jour.`);
//   } catch (error) {
//     console.error(`Erreur lors de la mise à jour du profil utilisateur ${uid}:`, error);
//     throw error;
//   }
// };
