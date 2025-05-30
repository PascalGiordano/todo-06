// TODO: Add your Firebase configuration object here
// Example from Firebase console:
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Optional: if you need auth
// import { getStorage } from 'firebase/storage'; // Optional: if you need storage

// This is a placeholder. Replace with your actual Firebase configuration from your Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Placeholder - REPLACE
  authDomain: "your-project-id.firebaseapp.com",    // Placeholder - REPLACE
  projectId: "your-project-id",                     // Placeholder - REPLACE
  storageBucket: "your-project-id.appspot.com",     // Placeholder - REPLACE
  messagingSenderId: "123456789012",                // Placeholder - REPLACE
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxx" // Placeholder - REPLACE
};

// Initialize Firebase
// Check if an app is already initialized to avoid errors during hot reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firestore instance
const db = getFirestore(app);

// Optional: Get Auth instance
// const auth = getAuth(app);

// Optional: Get Storage instance
// const storage = getStorage(app);

export { db }; // Export db to be used in other parts of the application
export default firebaseConfig; // Export the config too, if needed elsewhere, though db is primary for store access
