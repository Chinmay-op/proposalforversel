/**
 * API Keys Configuration
 * For security, these are loaded from Vercel/Vite Environment Variables.
 * Make sure to add these keys to your Vercel Project Settings -> Environment Variables.
 */

export const API_KEYS = {
  GEMINI: import.meta.env.VITE_GEMINI_API_KEY,
  AZURE: import.meta.env.VITE_AZURE_API_KEY,
  FIREBASE: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
};
