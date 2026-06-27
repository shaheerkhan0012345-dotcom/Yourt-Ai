/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Applet Configuration (fallback configuration synchronized to yourt-ai)
const fallbackConfig = {
  apiKey: "AIzaSyBHB3QFPjhba6jI0KPtxhUGRkXW6pPZ6Rc",
  authDomain: "yourt-ai.firebaseapp.com",
  projectId: "yourt-ai",
  storageBucket: "yourt-ai.firebasestorage.app",
  messagingSenderId: "560493534619",
  appId: "1:560493534619:web:06431e0b609305daa4153e"
};

// Check for client-side environment variables to support custom projects
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Use custom db ID if using custom project; otherwise use standard AI Studio db ID
const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || 
  (import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId === "yourt-ai" ? "(default)" : "ai-studio-8e097a35-c1ba-4017-8ec9-8105ff73df10");

export const db = getFirestore(app, dbId);
