import { initializeApp } from 'firebase/app';
import fallbackFirebaseConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  ...fallbackFirebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackFirebaseConfig.apiKey,
};

export const app = initializeApp(firebaseConfig);
