import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, signInWithGoogle, logOut } from '../lib/firebaseAuth';
import { db } from '../lib/firebaseDb';
import { isAdminEmail } from '../config/admin';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'user';
  updatedAt: unknown;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthErrorMessage(error: unknown) {
  const errorCode = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';

  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return 'Il popup di accesso e stato chiuso prima del completamento.';
    case 'auth/cancelled-popup-request':
      return 'E gia presente una richiesta di accesso in corso. Attendi un attimo e riprova.';
    case 'auth/popup-blocked':
      return 'Il browser ha bloccato il popup Google. Consenti i popup per localhost e riprova.';
    case 'auth/unauthorized-domain':
      return 'Questo dominio non e autorizzato su Firebase Auth. Aggiungi localhost e 127.0.0.1 agli Authorized Domains.';
    case 'auth/operation-not-allowed':
      return 'L accesso con Google non risulta abilitato in Firebase Authentication.';
    case 'auth/network-request-failed':
      return 'La richiesta a Firebase non e andata a buon fine. Controlla connessione e configurazione del progetto.';
    default:
      return 'Accesso Google non riuscito. Controlla la configurazione Firebase Authentication e riprova.';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setAuthError(null);
        // Sync user profile with Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || '',
            photoURL: currentUser.photoURL || '',
            role: isAdminEmail(currentUser.email) ? 'admin' : 'user',
            updatedAt: serverTimestamp()
          };
          await setDoc(userRef, newProfile);
          setProfile(newProfile);
        } else {
          const existingProfile = userDoc.data() as UserProfile;

          if (existingProfile.role !== 'admin' && isAdminEmail(currentUser.email)) {
            const upgradedProfile: UserProfile = {
              ...existingProfile,
              role: 'admin',
              updatedAt: serverTimestamp()
            };
            await setDoc(userRef, upgradedProfile, { merge: true });
            setProfile(upgradedProfile);
          } else {
            setProfile(existingProfile);
          }
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setAuthError(null);

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Auth sign-in failed', error);
      setAuthError(getAuthErrorMessage(error));
    }
  };

  const signOut = async () => {
    setAuthError(null);
    await logOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: profile?.role === 'admin',
        loading,
        authError,
        signIn,
        signOut,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
