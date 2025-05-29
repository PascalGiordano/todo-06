// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; // Optionnel, si analytics est nécessaire

// IMPORTANT: Pour un projet en production, ces clés devraient être stockées
// dans des variables d'environnement (par exemple, via des fichiers .env et VITE_FIREBASE_API_KEY).
// Pour cet exercice, elles sont directement intégrées comme fourni.
const firebaseConfig = {
  apiKey: "AIzaSyC1QtXhgheEPko-JVPgJ7DoUtrqwJ3A-GM",
  authDomain: "cur-todo.firebaseapp.com",
  projectId: "cur-todo",
  storageBucket: "cur-todo.firebasestorage.app",
  messagingSenderId: "722374640049",
  appId: "1:722374640049:web:e8544adbb807a90176bd90",
  measurementId: "G-63N69THMMY" // Optionnel, si analytics est nécessaire
};

// Initialiser Firebase de manière idempotente
// Cela évite les erreurs si le module est rechargé (par exemple, pendant le HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app); // db est le nom commun pour l'instance Firestore
// const analytics = getAnalytics(app); // Décommentez si vous avez besoin d'Analytics

export { app, auth, db };
