import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseDb';
import { useAuth } from './AuthContext';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('travellini_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync from Firestore when user is logged in
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const docRef = doc(db, 'users', user.uid);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const firestoreFavorites = data.favoriteSlugs || [];
          
          // Merge local favorites with firestore favorites on first load
          const localFavorites = JSON.parse(localStorage.getItem('travellini_favorites') || '[]');
          if (localFavorites.length > 0) {
            const merged = Array.from(new Set([...firestoreFavorites, ...localFavorites]));
            if (merged.length > firestoreFavorites.length) {
              // Update firestore with merged list
              setDoc(docRef, { 
                uid: user.uid,
                favoriteSlugs: merged,
                updatedAt: serverTimestamp()
              }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
              setFavorites(merged);
              localStorage.removeItem('travellini_favorites'); // Clear local after merge
              return;
            }
          }
          
          setFavorites(firestoreFavorites);
        } else {
          // Document doesn't exist, create it with local favorites if any
          const localFavorites = JSON.parse(localStorage.getItem('travellini_favorites') || '[]');
          setDoc(docRef, {
            uid: user.uid,
            favoriteSlugs: localFavorites,
            updatedAt: serverTimestamp()
          }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
          setFavorites(localFavorites);
          localStorage.removeItem('travellini_favorites');
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      });

      return () => unsubscribe();
    } else {
      // User logged out, load from local storage
      const saved = localStorage.getItem('travellini_favorites');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(saved ? JSON.parse(saved) : []);
    }
  }, [user, authLoading]);

  // Sync to local storage if NOT logged in
  useEffect(() => {
    if (!user && !authLoading) {
      localStorage.setItem('travellini_favorites', JSON.stringify(favorites));
    }
  }, [favorites, user, authLoading]);

  const toggleFavorite = async (slug: string) => {
    const newFavorites = favorites.includes(slug)
      ? favorites.filter(id => id !== slug)
      : [...favorites, slug];

    // Optimistic update
    setFavorites(newFavorites);

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          uid: user.uid,
          favoriteSlugs: newFavorites,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        // Revert on error
        setFavorites(favorites);
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
