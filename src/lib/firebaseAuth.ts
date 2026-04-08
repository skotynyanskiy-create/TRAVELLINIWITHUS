import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app } from './firebaseApp';
import { trackEvent } from '../services/analytics';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    trackEvent('login', { method: 'Google' });
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    trackEvent('logout');
  } catch (error) {
    console.error('Error signing out', error);
  }
};
