import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, logEvent } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only when a measurement ID is configured.
let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
  if ('measurementId' in firebaseConfig && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch {
  analytics = null;
}

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    trackEvent('login', { method: 'Google' });
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    trackEvent('logout');
  } catch (error) {
    console.error("Error signing out", error);
  }
};
