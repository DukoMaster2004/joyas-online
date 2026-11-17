import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCn9yWVnz2l-_A41ombelQmXDyA9MC0Lvk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'miapp-4a216.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'miapp-4a216',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'miapp-4a216.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '553513944411',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:553513944411:web:c4b3592357220c9f63c67e',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
